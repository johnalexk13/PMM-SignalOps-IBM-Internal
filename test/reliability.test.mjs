import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import vm from 'node:vm';
import { Readable } from 'node:stream';
import { appendHistory, snapshotMarkdown, snapshotFilename, fetchJson, validateWorkspacePayload } from '../lib/workspace-tools.mjs';
import { buildContentDraft, buildPmmDraft } from '../lib/asset-drafts.mjs';
import { readWorkspaceRequest } from '../lib/workspace-request.mjs';

const product = { id: 'test-product', displayName: 'Example Analytics', shortName: 'Example', productUrl: 'https://example.com/product', primaryBuyer: 'Data leaders' };
const signal = { competitor: 'Rival', sourceUrl: 'https://example.org/release', summary: 'New cost monitoring dashboard', coverageType: 'live' };

test('all main PMM formats contain usable copy, evidence and no unverified superiority claims', () => {
  const formats = ['battle-card', 'comparison-one-pager', 'faq', 'value-guide', 'landing-page', 'email-sequence'];
  const drafts = formats.map(format => buildPmmDraft({ product, signal, title: `${format} vs Rival`, format }));
  assert.equal(new Set(drafts).size, 6);
  for (const draft of drafts) {
    assert.ok(draft.length > 1800);
    assert.match(draft, /https:\/\/example.org\/release/);
    assert.match(draft, /REVIEW BEFORE PUBLISHING/);
    assert.doesNotMatch(draft, /Netezza|guaranteed|50% cheaper/);
  }
  assert.match(drafts[5], /EMAIL 3/);
});

test('content draft includes filled sections, CTA and source qualification', () => {
  const draft = buildContentDraft({ product, signal: { ...signal, coverageType: 'static' }, title: 'Example vs Rival', format: 'Blog / SEO' });
  assert.match(draft, /## Translate the message into evidence/);
  assert.match(draft, /No current verified claim is available/);
  assert.match(draft, /Primary CTA/);
  assert.ok(draft.split(/\s+/).length > 350);
});

test('history deduplicates unchanged content and retains ten versions per page', () => {
  let history = [];
  for (let i = 0; i < 14; i++) history = appendHistory(history, { id: `${i}`, pageId: 'content', text: `draft ${i}` });
  assert.equal(history.length, 10);
  assert.equal(history[0].id, '13');
  assert.equal(appendHistory(history, { pageId: 'content', text: 'draft 13' }), history);
  assert.equal(appendHistory(history, { pageId: 'market', text: 'market signal' }).length, 11);
});

test('downloads preserve complete drafts, source links and product context', () => {
  const entry = { productName: 'Example', pageTitle: 'PMM actions', createdAt: '2026-11-03T10:00:00.000Z', text: buildPmmDraft({ product, signal, format: 'email' }) };
  assert.ok(snapshotMarkdown(entry).includes(entry.text));
  assert.match(snapshotFilename(entry), /^example-pmm-actions-/);
  assert.ok(!snapshotFilename(entry).includes(':'));
});

test('request parsing preserves documents and competitor URLs on streamed POST and GET', async () => {
  const body = { productId: product.id, productName: product.displayName, productUrl: product.productUrl, competitors: [{ name: 'Rival', url: 'https://example.org' }], documents: [{ name: 'brief', text: 'approved text' }], refresh: '1' };
  const req = Readable.from([JSON.stringify(body)]); req.method = 'POST'; req.url = '/api/workspace-intelligence';
  const parsed = await readWorkspaceRequest(req);
  assert.equal(parsed.product.productUrl, product.productUrl);
  assert.deepEqual(parsed.documents, body.documents);
  assert.deepEqual(parsed.competitors, body.competitors);
  assert.equal(parsed.force, true);
  const get = await readWorkspaceRequest({ method: 'GET', url: '/api/workspace-intelligence?competitors=%5B%5D&productId=other' });
  assert.equal(get.product.id, 'other');
  await assert.rejects(readWorkspaceRequest({ method: 'POST', url: '/', body: '{broken' }), { status: 400 });
});

test('refresh retries transient failures, rejects HTML and wrong-product responses', async () => {
  let calls = 0;
  const payload = await fetchJson('/api', {}, { fetchImpl: async () => { calls++; return calls === 1 ? new Response('', { status: 503 }) : Response.json({ ok: true }); } });
  assert.equal(calls, 2); assert.equal(payload.ok, true);
  await assert.rejects(fetchJson('/api', {}, { retries: 0, fetchImpl: async () => new Response('<html>') }), /invalid response/);
  assert.throws(() => validateWorkspacePayload({ sections: {}, marketFeed: { items: [] }, meta: { focusProduct: { id: 'wrong' } } }, 'correct'), /different product/);
});

test('refresh timeout aborts instead of leaving loading state indefinitely', async () => {
  await assert.rejects(fetchJson('/api', {}, { timeoutMs: 5, retries: 0, fetchImpl: (_, { signal }) => new Promise((resolve, reject) => signal.addEventListener('abort', () => reject(new Error('aborted')))) }), /aborted/);
});

async function dashboardContext() {
  const values = new Map();
  const storage = { getItem: key => values.get(key) || null, setItem: (key, value) => values.set(key, value), removeItem: key => values.delete(key) };
  const context = vm.createContext({ console, URL, URLSearchParams, setTimeout, clearTimeout, buildContentDraft, buildPmmDraft, appendHistory, snapshotMarkdown, snapshotFilename, fetchJson, validateWorkspacePayload,
    window: { location: { search: '', protocol: 'http:' }, localStorage: storage }, localStorage: storage,
    document: { querySelector: () => null, querySelectorAll: () => [] } });
  const code = (await readFile(new URL('../dashboard.js', import.meta.url), 'utf8')).replace(/^import .*;\n/gm, '').replace('\nboot();', '\n');
  vm.runInContext(code, context);
  vm.runInContext(`
    authContext = { currentUser: { email: 'test@example.test' } };
    accountContext = { accountId: 'test', productIds: [] };
    state.activeProductId = 'test-product';
    state.productWorkspaces = { 'test-product': normalizeProductWorkspace(${JSON.stringify(product)}) };
    state.competitors = ['Snowflake','Databricks','Yellowbrick','Amazon Redshift','Google BigQuery'].map((name, i) => ({ id: 'c' + i, name, url: 'https://example.com/' + i }));
    state.marketFeed = { loading: false, meta: { lastUpdated: '2026-10-01' }, error: '', items: [{ id: 'saved', competitor: 'Snowflake', sourceUrl: 'https://example.com/saved', summary: 'Saved live result', coverageType: 'live' }] };
    state.liveInsights = { loading: false, meta: {}, sections: { content: { ideas: [] } }, capabilityEvidence: { test: true }, propelInsights: { items: [] } };
    renderPage = renderOverview = renderAllCommunityPages = updateHeaderMeta = renderPageTools = archivePages = () => {};
  `, context);
  return context;
}

test('all five competitors get six PMM drafts with balanced ordering', async () => {
  const ctx = await dashboardContext();
  const actions = vm.runInContext('buildDynamicPmmActions()', ctx);
  assert.equal(actions.length, 30);
  for (let i = 0; i < 5; i++) assert.ok(actions[i].id.startsWith(`dynamic-c${i}-`));
  assert.equal(vm.runInContext('getContentIdeas().length', ctx), 5);
});

test('failed refresh preserves market snapshot, insights, timestamps and persistence across reload', async () => {
  const ctx = await dashboardContext();
  vm.runInContext('fetchWorkspaceIntelligencePayload = async () => { throw new Error("offline"); };', ctx);
  await vm.runInContext('loadMarketSignals()', ctx);
  assert.equal(vm.runInContext('state.marketFeed.items[0].id', ctx), 'saved');
  assert.equal(vm.runInContext('state.marketFeed.meta.lastUpdated', ctx), '2026-10-01');
  assert.equal(vm.runInContext('state.marketFeed.loading', ctx), false);
  const restored = vm.runInContext('hydrateState()', ctx);
  assert.equal(restored.marketFeed.items[0].id, 'saved');
  assert.equal(restored.liveInsights.capabilityEvidence.test, true);
});

test('in-flight refresh cannot overwrite a switched product and duplicate refresh is coalesced', async () => {
  const ctx = await dashboardContext();
  vm.runInContext('var calls = 0; var finish; fetchWorkspaceIntelligencePayload = () => { calls++; return new Promise(resolve => { finish = resolve; }); };', ctx);
  const first = vm.runInContext('loadMarketSignals()', ctx);
  const second = vm.runInContext('loadMarketSignals()', ctx);
  assert.equal(first, second);
  assert.equal(vm.runInContext('calls', ctx), 1);
  vm.runInContext(`state.activeProductId = 'other'; state.productWorkspaces.other = normalizeProductWorkspace({ id: 'other', displayName: 'Other' }); applyProductWorkspace(state.productWorkspaces.other); finish({ payload: {}, mode: 'api' });`, ctx);
  await first;
  assert.equal(vm.runInContext('state.marketFeed.items.length', ctx), 0);
});

async function communityContext(fetchImpl) {
  const context = vm.createContext({ console, URL, Date, setTimeout, clearTimeout, AbortController, fetch: fetchImpl,
    readFile: async () => { throw new Error('no snapshot'); }, mkdir: async () => {}, writeFile: async () => {} });
  const code = (await readFile(new URL('../community-signals.mjs', import.meta.url), 'utf8')).replace(/^import .*;\n/gm, '').replace(/export /g, '').replace(/import.meta.url/g, JSON.stringify(new URL('../community-signals.mjs', import.meta.url).href));
  vm.runInContext(code, context);
  return context;
}

test('community rejects broadened search matches and opens HN discussion permalink', async () => {
  const ctx = await communityContext(async () => Response.json({ hits: [{ objectID: '42', title: 'Netezza architecture', url: 'https://external.example', created_at: '2026-11-02' }, { objectID: '43', title: 'Unrelated HDMI article', created_at: '2026-11-02' }] }));
  const feed = await vm.runInContext('getCommunitySignalsFeed({ productName: "IBM Netezza", keywords: ["Netezza"], platforms: ["Hacker News"] })', ctx);
  assert.equal(feed.items.length, 1);
  assert.equal(feed.items[0].sourceUrl, 'https://news.ycombinator.com/item?id=42');
  assert.equal(feed.meta.activeSources, 1);
  assert.equal(vm.runInContext('matchesCommunityTerms("Netezzaish", { keywords: ["Netezza"] }, { trustQueryMatch: true })', ctx), false);
});

test('community distinguishes empty sources, failures, saved results and product isolation', async () => {
  let status = 'live';
  const ctx = await communityContext(async () => status === 'failed' ? new Response('', { status: 429 }) : Response.json({ hits: status === 'empty' ? [] : [{ objectID: '42', title: 'Netezza architecture', created_at: '2026-11-02' }] }));
  const options = '{ force: true, productName: "IBM Netezza", keywords: ["Netezza"], platforms: ["Hacker News"] }';
  await vm.runInContext(`getCommunitySignalsFeed(${options})`, ctx);
  status = 'failed';
  const saved = await vm.runInContext(`getCommunitySignalsFeed(${options})`, ctx);
  assert.equal(saved.meta.failedSources, 1);
  assert.equal(saved.items[0].coverageType, 'cached');
  const other = await vm.runInContext('getCommunitySignalsFeed({ force: true, productName: "Other", keywords: ["Other"], platforms: ["Hacker News"] })', ctx);
  assert.equal(other.items.length, 0);
  status = 'empty';
  const empty = await vm.runInContext(`getCommunitySignalsFeed(${options})`, ctx);
  assert.equal(empty.meta.emptySources, 1); assert.equal(empty.meta.failedSources, 0);
});

test('configured DBA and GitHub URLs use search APIs; manual surfaces never claim freshness', async () => {
  const ctx = await communityContext(async () => Response.json({ items: [], hits: [], data: { children: [] } }));
  const feed = await vm.runInContext('getCommunitySignalsFeed({ productName: "IBM Netezza", keywords: ["Netezza"], platforms: ["https://dba.stackexchange.com", "https://github.com"] })', ctx);
  const sources = vm.runInContext('buildCommunitySources({ productName: "IBM Netezza", keywords: ["Netezza"], platforms: ["https://dba.stackexchange.com", "https://github.com"] })', ctx);
  assert.ok(sources.some(source => source.sourceUrl.includes('site=dba')));
  assert.ok(!sources.some(source => source.kind === 'html'));
  assert.equal(feed.meta.manualSources, 2);
  assert.ok(feed.items.every(item => item.isSurface && !item.isNew && item.publishedAt === null));
});

 test('community browser snapshot survives failed source on a cold server', async () => {
  const ctx = await dashboardContext();
  assert.equal(vm.runInContext(`mergeCommunitySnapshot({ meta: { sourceCoverage: [{ id: 'hn-1', status: 'failed' }] }, items: [] }, [{ sourceId: 'hn-1', sourceUrl: 'https://news.ycombinator.com/item?id=1', coverageType: 'live' }])[0].coverageType`, ctx), 'cached');
});
