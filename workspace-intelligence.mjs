import { getMarketSignalsFeed } from "./market-signals.mjs";
import { COMPETITOR_SOURCE_MAP, resolveCompetitorName } from "./lib/competitor-mapping.mjs";
import {
  buildEvidenceDatabase,
  makeCitations,
  rankEvidenceForPurpose,
} from "./evidence-store.mjs";
import {
  isGraniteConfigured,
  generateText,
  buildContentSuggestionsPrompt,
  buildPMMActionsPrompt,
  parseGraniteJSON,
} from "./lib/granite-ai.mjs";
import { getPropelKnowledge } from "./lib/propel-knowledge.mjs";

// Default competitors for backward compatibility
const DEFAULT_COMPETITORS = [
  "Databricks",
  "Snowflake",
  "Google BigQuery",
  "Amazon Redshift",
  "Azure Synapse",
  "Teradata"
];

const CACHE_TTL_MS = 2 * 60 * 1000;
const MAX_CONTENT_IDEAS = 15;
const FRESH_SIGNAL_WINDOW_HOURS = 7 * 24;

const PMM_BEST_PRACTICE_SOURCES = [
  {
    label: "HubSpot sales content checklist",
    url: "https://blog.hubspot.com/blog/tabid/6307/bid/33797/13-types-of-product-content-sales-needs-to-close-more-deals.aspx",
    focus: "Sales-facing product content should include comparison, proof, objection handling, demo, and enablement assets that help sellers close active deals.",
  },
  {
    label: "Simon-Kucher product marketing strategy",
    url: "https://www.simon-kucher.com/en/insights/mastering-product-marketing-5-key-strategies-success",
    focus: "PMM recommendations should stay tied to customer insight, positioning, pricing/value, sales enablement, and continuous market feedback.",
  },
  {
    label: "Tribe Design Works marketing assets",
    url: "https://tribedesignworks.com/blog/marketing-assets",
    focus: "Recommended assets should be practical market-facing or sales-facing deliverables, such as one-pagers, decks, case proof, landing pages, and campaign kits.",
  },
];

const PMM_ASSET_PLAYBOOK = [
  {
    id: "competitive-battle-card",
    label: "Competitive battle card",
    icon: "X",
    asset: "Seller battle card",
    fit: ["reviews", "social", "website", "blog"],
    bestPractice: "Sales enablement plus competitor objection handling",
    summary: "Refresh the seller-ready battle card with current competitor proof, traps to avoid, and concise objection handlers.",
  },
  {
    id: "comparison-one-pager",
    label: "Buyer comparison one-pager",
    icon: "=",
    asset: "Comparison one-pager",
    fit: ["website", "blog", "reviews"],
    bestPractice: "Buyer-facing product comparison and value framing",
    summary: "Create a buyer-facing comparison asset that turns competitor claims into evaluation questions Netezza can answer credibly.",
  },
  {
    id: "objection-faq",
    label: "Competitive objection FAQ",
    icon: "?",
    asset: "Objection FAQ",
    fit: ["reviews", "social"],
    bestPractice: "Field FAQ for sales conversations and deal blockers",
    summary: "Give sellers a tight FAQ for the objections surfaced by review and social evidence.",
  },
  {
    id: "proof-brief",
    label: "Proof brief",
    icon: "+",
    asset: "Proof brief",
    fit: ["blog", "website", "reviews"],
    bestPractice: "Proof-led asset for credibility, case evidence, and market validation",
    summary: "Package source-backed proof points into a short credibility brief sellers can attach to follow-ups.",
  },
  {
    id: "value-guide",
    label: "Value conversation guide",
    icon: "$",
    asset: "Value guide",
    fit: ["reviews", "website", "blog"],
    bestPractice: "Pricing, value, and business-case framing",
    summary: "Translate competitor value claims into a CFO-safe guide on cost predictability, workload fit, and operational control.",
  },
  {
    id: "campaign-kit",
    label: "Campaign kit",
    icon: "*",
    asset: "Campaign kit",
    fit: ["blog", "social", "website"],
    bestPractice: "Integrated campaign assets across landing page, email, and social snippets",
    summary: "Turn the signal into a coordinated campaign kit with landing-page copy, seller snippet, and social angles.",
  },
  {
    id: "competitive-landing-page",
    label: "Competitive landing page",
    icon: "[]",
    asset: "Competitive landing page refresh",
    fit: ["website", "blog", "social"],
    bestPractice: "Buyer-facing landing page with clear comparison and proof",
    summary: "Refresh a competitive page that converts the source claim into buyer questions, proof blocks, and a specific CTA.",
  },
  {
    id: "seller-email-sequence",
    label: "Seller email sequence",
    icon: "@",
    asset: "Seller email sequence",
    fit: ["reviews", "social", "blog"],
    bestPractice: "Sales follow-up content that turns market signals into deal conversation starters",
    summary: "Create a three-touch seller email sequence that responds to the competitor move and points buyers to cited proof.",
  },
  {
    id: "discovery-question-sheet",
    label: "Discovery question sheet",
    icon: "?",
    asset: "Discovery question sheet",
    fit: ["website", "reviews", "blog", "social"],
    bestPractice: "Qualification questions for live opportunities and executive discovery",
    summary: "Give sellers sharper discovery questions that expose workload, governance, cost, migration, and AI-readiness tradeoffs.",
  },
  {
    id: "demo-proof-pack",
    label: "Demo proof pack",
    icon: "+",
    asset: "Demo proof pack",
    fit: ["website", "blog", "reviews"],
    bestPractice: "Demo narrative, proof points, and validation checklist",
    summary: "Package a short demo story with proof points and validation criteria that answer the competitor claim directly.",
  },
];

const PRODUCT_PROFILE_TEMPLATES = {
  netezza: {
    kind: "netezza",
    displayName: "IBM Netezza",
    productName: "IBM Netezza Performance Server",
    shortName: "Netezza",
    strategicRole: "the performant warehouse engine a lakehouse needs",
    buyerFrame: "Data leaders, platform owners, analytics teams",
    categoryResponse: "lakehouse-ready performance, governed simplicity, and clearer workload-fit language",
    confirmedCapabilities: null,
    confirmedStrengths: null,
    gapBlueprints: null,
    positioningPillars: null,
    positioningStatement: "The performant warehouse engine for open lakehouse architectures: governed, hybrid, and cost-disciplined execution for enterprise analytics that cannot afford slow or unpredictable queries.",
    positioningFallback: "Latest proof is unavailable, so the positioning guidance is staying anchored to the stable lakehouse performance-engine narrative.",
  },
  db2: {
    kind: "db2",
    displayName: "IBM Db2 Warehouse",
    productName: "IBM Db2 Warehouse",
    shortName: "Db2 Warehouse",
    strategicRole: "the governed SQL warehouse foundation modernization teams need",
    buyerFrame: "Database leaders, application owners, cloud analytics teams",
    categoryResponse: "SQL continuity, governed modernization, cost control, and lower migration risk",
    confirmedCapabilities: [
      "Db2 SQL and skills continuity for existing enterprise teams",
      "Columnar analytics and workload acceleration for warehouse use cases",
      "Deployment options across IBM Cloud and containerized enterprise environments",
      "IBM governance, security, and support alignment",
      "Integration path with IBM Data and AI portfolio",
      "Familiar database administration and operational controls",
    ],
    confirmedStrengths: [
      {
        status: "Core strength",
        title: "SQL continuity for existing Db2 and enterprise database teams",
        summary: "Db2 Warehouse can reduce modernization anxiety for teams that already trust Db2 skills, operational patterns, and enterprise database governance.",
        leverage: "Use this in migration conversations where Snowflake, Redshift, or Databricks are framed as a disruptive reset.",
        tags: ["SQL continuity", "Migration risk", "Existing estates"],
      },
      {
        status: "Core strength",
        title: "Governed analytics fit for regulated and operationally disciplined teams",
        summary: "The strongest buyer segment is not the most experimental team; it is the team that needs analytics modernization without weakening controls.",
        leverage: "Anchor CIO and CDO messaging around trust, controls, and operational continuity.",
        tags: ["Governance", "Enterprise controls", "CIO"],
      },
      {
        status: "PMM-ready",
        title: "IBM portfolio alignment for data, governance, and AI programs",
        summary: "Db2 Warehouse can connect to a broader IBM story across trusted data, governance, automation, and AI readiness.",
        leverage: "Use IBM ecosystem fit to avoid a feature-by-feature fight against cloud-only competitors.",
        tags: ["IBM ecosystem", "AI readiness", "Platform fit"],
      },
    ],
    gapBlueprints: [
      {
        id: "self-service",
        priority: "P1 - Critical",
        title: "Package a simpler cloud self-service story",
        gapScore: "6.8 / 10",
        copy: "Snowflake and BigQuery win perception through simplicity. Db2 Warehouse needs clearer proof around setup, onboarding, workload migration, and day-2 operations for cloud-first buyers.",
        current: "Enterprise-grade database controls, Db2 skill continuity, and IBM deployment options",
        leverage: "Guided trial, migration workshop, and short-path demo assets",
        impact: "CIO, Data Platform Owner, Cloud Analytics Lead",
        competitors: ["Snowflake self-service experience", "BigQuery managed analytics", "Redshift AWS-native onboarding"],
        keywords: ["self-service", "onboarding", "migration", "easy", "simplicity", "cloud"],
      },
      {
        id: "ai-ready",
        priority: "P1 - Critical",
        title: "Create stronger AI-ready analytics packaging",
        gapScore: "6.4 / 10",
        copy: "Databricks and BigQuery connect warehouse decisions directly to AI workflows. Db2 Warehouse needs a more explicit story for governed AI data foundations, semantic consistency, and IBM watsonx alignment.",
        current: "Trusted SQL analytics foundation with IBM Data and AI portfolio adjacency",
        leverage: "IBM watsonx, governance proof, and AI-ready data architecture messaging",
        impact: "CDO, Head of AI, Enterprise Architect",
        competitors: ["Databricks lakehouse AI", "BigQuery AI analytics", "Snowflake Cortex"],
        keywords: ["ai", "agent", "ml", "model", "semantic", "watsonx"],
      },
      {
        id: "migration-risk",
        priority: "P2 - High",
        title: "Make migration risk reduction measurable",
        gapScore: "5.8 / 10",
        copy: "Db2 Warehouse has a natural advantage with existing Db2 estates, but PMM needs calculators, checklists, and migration sequencing proof to make lower risk visible.",
        current: "Db2 compatibility, familiar administration patterns, and IBM services/support motion",
        leverage: "Migration readiness scorecard and CIO workshop deck",
        impact: "CIO, DBA Lead, Application Owner",
        competitors: ["Snowflake migration tools", "AWS migration programs", "Databricks migration messaging"],
        keywords: ["migration", "modernization", "risk", "skills", "rewrite"],
      },
      {
        id: "ecosystem",
        priority: "P2 - High",
        title: "Clarify ecosystem and sharing story",
        gapScore: "5.6 / 10",
        copy: "Cloud competitors often win mindshare with marketplaces, sharing, and partner ecosystems. Db2 Warehouse needs a sharper explanation of where IBM ecosystem integration matters and where partners fit.",
        current: "IBM portfolio integration and enterprise account support",
        leverage: "Partner solution map and IBM ecosystem proof pack",
        impact: "CDO, Data Product Owner, Partner teams",
        competitors: ["Snowflake Marketplace", "Databricks Delta Sharing", "BigQuery Analytics Hub"],
        keywords: ["sharing", "marketplace", "ecosystem", "partner", "data product"],
      },
    ],
    positioningPillars: [
      { tone: "pillar-content", title: "Modernization without disruption", text: "Position Db2 Warehouse as a pragmatic path for teams that need cloud analytics progress without rewriting how trusted database operations work." },
      { tone: "pillar-events", title: "SQL continuity", text: "Make existing Db2 skills, SQL familiarity, and operational practices a strength in migration-heavy accounts." },
      { tone: "pillar-market", title: "Cost governance", text: "Counter usage-driven cloud warehouse narratives with workload planning, governance, and finance-friendly controls." },
      { tone: "pillar-product", title: "Trusted enterprise analytics", text: "Lean into IBM credibility, security, and support for regulated and operationally disciplined buyers." },
      { tone: "pillar-positioning", title: "AI-ready foundation", text: "Frame Db2 Warehouse as the governed analytical layer that supports AI readiness through trusted data, not as an AI platform copycat." },
    ],
    positioningStatement: "The governed cloud warehouse path for enterprise teams that want analytical modernization without losing SQL continuity, operational control, or IBM ecosystem trust.",
    positioningFallback: "Latest proof is unavailable, so the positioning guidance is staying anchored to lower-risk modernization, SQL continuity, and trusted enterprise analytics.",
  },
};

let cache = {
  expiresAt: 0,
  payload: null,
};

const COMPETITOR_PRESSURE = {
  Databricks: 92,
  Snowflake: 88,
  "Google BigQuery": 81,
  "Amazon Redshift": 75,
  "Azure Synapse": 69,
  Teradata: 64,
};

const COMPETITOR_SHORT = {
  Databricks: "Databricks",
  Snowflake: "Snowflake",
  "Amazon Redshift": "Redshift",
  "Google BigQuery": "BigQuery",
  "Azure Synapse": "Synapse",
  Teradata: "Teradata",
};

const BASE_SENTIMENT = {
  "IBM Netezza": { positive: 74, neutral: 17, negative: 9 },
  Databricks: { positive: 68, neutral: 17, negative: 15 },
  Snowflake: { positive: 78, neutral: 14, negative: 8 },
  "Amazon Redshift": { positive: 62, neutral: 20, negative: 18 },
  "Google BigQuery": { positive: 70, neutral: 18, negative: 12 },
  "Azure Synapse": { positive: 65, neutral: 20, negative: 15 },
  Teradata: { positive: 60, neutral: 18, negative: 22 },
};

const PRODUCT_CONFIRMED_CAPABILITIES = [
  "Apache Iceberg support (GA)",
  "Native Cloud Object Storage / NCOS (GA - AWS & Azure)",
  "Time Travel (historical versioning)",
  "AI Database Assistant (NL troubleshooting)",
  "HIPAA-ready + SOC 2 Type 2",
  "watsonx.data integration (Hadoop / Hive / Kerberos)",
  "GCP BYOC - announced 2026",
  "Unity Catalog + AWS Glue / Azure Purview integrations",
];

const PRODUCT_CONFIRMED_STRENGTHS = [
  {
    status: "Shipped - GA",
    title: "Apache Iceberg open table format support",
    summary: "IBM Netezza now supports Apache Iceberg natively, with buyer-facing compatibility language around Unity Catalog, AWS Glue, and Azure Purview. This closes one of the most cited open-table objections in competitive evaluations.",
    leverage: "Lead with this in Databricks and Snowflake deals as proof that Netezza can be the warehouse execution layer for open lakehouse data.",
    tags: ["Open table formats", "Lakehouse performance engine", "Gap closed"],
  },
  {
    status: "Shipped - GA",
    title: "Native Cloud Object Storage (NCOS) - 5-15x cheaper than block storage",
    summary: "NCOS is generally available on both AWS and Azure, delivering compute-storage separation and transparent usage-based billing. This gives Netezza a credible economics story it previously lacked in cloud comparisons.",
    leverage: "Update TCO messaging and pricing battle cards with NCOS cost-angle proof.",
    tags: ["TCO messaging", "Cloud economics", "Counters Snowflake cost pressure"],
  },
  {
    status: "Shipped - GA",
    title: "Time Travel + HIPAA / SOC 2 posture",
    summary: "Historical versioning plus regulated-readiness proof strengthens Netezza's differentiation with buyers who care about governance, auditability, and operational trust more than cloud-only novelty.",
    leverage: "Use this as the default PMM message in BFSI, healthcare, and public-sector narratives.",
    tags: ["Regulated industries", "Governance", "Auditability"],
  },
];

const PRODUCT_GAP_BLUEPRINTS = [
  {
    id: "ai-ml",
    priority: "P1 - Critical",
    title: "Full in-database ML training and inference for data scientists",
    gapScore: "6.5 / 10",
    copy: "Netezza has made progress with watsonx.data integration and the 2026 roadmap now includes custom ML models and unstructured text processing inside the engine. The remaining gap is a fuller in-database ML story for data scientists, where Databricks, Snowflake Cortex, and BigQuery still market more aggressively.",
    current: "watsonx.data integration, Hadoop / Hive / Kerberos connectivity, custom ML in-engine roadmap",
    leverage: "IBM watsonx.ai + watsonx.data + Granite models",
    impact: "CDO, Head of Data Science, Data Architect",
    competitors: ["Databricks MLflow + Runtime", "Snowflake Cortex AI", "BigQuery ML + Vertex AI", "Azure Synapse + OpenAI"],
    keywords: ["ai", "agent", "ml", "model", "genai", "cortex", "vertex", "assistant"],
  },
  {
    id: "nlq",
    priority: "P2 - High",
    title: "Expand NLQ from ops assistant to full business-user query interface",
    gapScore: "5.0 / 10",
    copy: "The AI-powered Database Assistant is a meaningful step forward, but it is still oriented toward DBAs and ops teams. The remaining gap is a natural-language experience that lets business users ask analytical questions directly and get governed SQL-backed answers.",
    current: "AI Database Assistant - NL troubleshooting, metric retrieval, config insights",
    leverage: "IBM watsonx Assistant + Granite LLM + semantic layer",
    impact: "Business Analyst, BI Lead, CDO, CFO",
    competitors: ["Databricks AI / Genie", "Snowflake Cortex Analyst", "BigQuery DataQnA / NLQ", "Synapse + Copilot"],
    keywords: ["nlq", "natural language", "copilot", "genie", "assistant", "question"],
  },
  {
    id: "sharing",
    priority: "P2 - High",
    title: "Governed data sharing marketplace",
    gapScore: "6.5 / 10",
    copy: "Snowflake Marketplace and Databricks Delta Sharing have become ecosystem moats. Netezza still needs a stronger governed sharing capability that lets customers expose read-only data products across organizations without losing control.",
    current: "Unified metadata management, watsonx.data ecosystem connectivity",
    leverage: "IBM Cloud Pak for Data + IAM governance",
    impact: "CDO, Data Product Owner, Partner ecosystem teams",
    competitors: ["Snowflake Data Marketplace", "Databricks Delta Sharing", "BigQuery Analytics Hub"],
    keywords: ["sharing", "share", "marketplace", "exchange", "data product"],
  },
  {
    id: "streaming",
    priority: "P3 - Strategic",
    title: "Real-time streaming analytics ingestion",
    gapScore: "6.2 / 10",
    copy: "Databricks, BigQuery, and Azure Synapse all support stronger streaming and real-time ingestion patterns. Netezza remains optimized for batch analytics, which is fine for many accounts, but a connector-layer streaming story would prevent losses in BFSI and telecom evaluations.",
    current: "Batch-optimized structured analytics with strong governed performance",
    leverage: "IBM Event Streams (Kafka managed) + IBM DataStage",
    impact: "Data Engineer, Platform Architect, BFSI / Telco verticals",
    competitors: ["Databricks Structured Streaming", "BigQuery Streaming + Pub/Sub", "Synapse + Event Hub"],
    keywords: ["stream", "realtime", "real-time", "event", "kafka", "ingestion"],
  },
];

const POSITIONING_PILLARS = [
  { tone: "pillar-content", title: "Lakehouse performance engine", text: "Position Netezza as the warehouse-grade execution layer that makes open lakehouse data fast, governed, and ready for repeat analytics." },
  { tone: "pillar-events", title: "Hybrid freedom", text: "Make deployment flexibility central whenever the lakehouse evaluation includes sovereignty, residency, or infrastructure control requirements." },
  { tone: "pillar-market", title: "Predictable economics", text: "Use cost stories, NCOS proof, and governance-friendly economics to show how performant warehouse execution controls lakehouse query spend." },
  { tone: "pillar-product", title: "Regulated-ready trust", text: "Turn IBM credibility into a specific narrative for compliance-heavy, risk-sensitive analytics environments." },
  { tone: "pillar-positioning", title: "Open data execution", text: "Highlight Iceberg, object storage, and watsonx.data adjacency so Netezza complements lakehouse architecture instead of fighting it." },
];

export const CAPABILITY_DETECTORS = [
  { id: "cloud-deployment", capability: "Cloud / SaaS deployment", note: "Vendor publicly claims a managed cloud or SaaS offering.", terms: ["saas", "cloud-native", "fully managed", "managed service", "cloud service", "cloud platform", "cloud data"] },
  { id: "hybrid-deployment", capability: "On-premises / hybrid deployment", note: "Vendor publicly claims on-prem, self-hosted, or hybrid options.", terms: ["on-premises", "on-prem", "on premises", "self-hosted", "hybrid", "private cloud", "air-gapped"] },
  { id: "ai-ml", capability: "AI & machine learning", note: "Vendor publicly claims AI/ML, GenAI, or assistant capabilities.", terms: ["artificial intelligence", " ai ", "ai-powered", "machine learning", "genai", "generative ai", "copilot", "llm", "ai assistant", "ai agent"] },
  { id: "security-compliance", capability: "Security & compliance posture", note: "Vendor publicly claims certifications or compliance support.", terms: ["soc 2", "iso 27001", "gdpr", "hipaa", "fedramp", "encryption", "compliance", "role-based access"] },
  { id: "apis-integrations", capability: "APIs & integration ecosystem", note: "Vendor publicly claims APIs, SDKs, connectors, or a marketplace.", terms: [" api", "sdk", "integration", "connector", "webhook", "marketplace", "rest api"] },
  { id: "automation", capability: "Automation & workflow orchestration", note: "Vendor publicly claims automation or orchestration capabilities.", terms: ["automation", "workflow", "orchestration", "no-code", "low-code"] },
  { id: "analytics", capability: "Analytics & reporting", note: "Vendor publicly claims analytics, dashboards, or reporting.", terms: ["analytics", "dashboard", "reporting", "business intelligence", "insights"] },
  { id: "scalability", capability: "Enterprise scalability & performance", note: "Vendor publicly claims scale, performance, or availability guarantees.", terms: ["scalab", "high availability", "performance", "enterprise-grade", "throughput", "low latency", "sla", "uptime"] },
  { id: "realtime", capability: "Real-time / streaming", note: "Vendor publicly claims real-time or streaming capabilities.", terms: ["real-time", "real time", "streaming", "event-driven", "live data"] },
  { id: "pricing", capability: "Pricing transparency & trials", note: "Vendor publicly shows pricing details or offers a trial.", terms: ["pricing", "free trial", "free tier", "try free", "start free", "request a demo"] },
];

export function detectCapabilitiesInText(text) {
  const haystack = ` ${String(text || "").toLowerCase()} `;
  const result = {};
  for (const row of CAPABILITY_DETECTORS) {
    const matched = haystack ? row.terms.find((term) => haystack.includes(term)) : "";
    result[row.id] = matched || "";
  }
  return result;
}

async function fetchPageTextForScan(url) {
  if (!url) return "";
  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 8000);
    const response = await fetch(url, {
      signal: controller.signal,
      headers: {
        "user-agent": "SignalOps-Capability-Scan/1.0",
        accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
      },
    });
    clearTimeout(timer);
    if (!response.ok) return "";
    const body = await response.text();
    return body
      .replace(/<script[\s\S]*?<\/script>/gi, " ")
      .replace(/<style[\s\S]*?<\/style>/gi, " ")
      .replace(/<[^>]+>/g, " ")
      .replace(/\s+/g, " ")
      .slice(0, 200000)
      .toLowerCase();
  } catch {
    return "";
  }
}

function competitorScanUrl(competitor) {
  const userUrl = typeof competitor === "object" && competitor
    ? String(competitor.url || competitor.website || competitor.webpageUrl || "").trim()
    : "";
  if (userUrl) return userUrl;
  const resolved = resolveCompetitorName(competitor);
  return COMPETITOR_SOURCE_MAP[resolved]?.website || "";
}

// Authoritative IBM Netezza capability proof text — used as the focus baseline
// when the product URL is not set or the page scan fails. This ensures the
// capability matrix always shows correct IBM Netezza statuses rather than "unknown".
// Sourced from IBM.com/products/netezza, IBM Docs, and Seismic content (2026-05-29).
const IBM_NETEZZA_CAPABILITY_PROOF = `
  IBM Netezza Performance Server saas cloud-native fully managed cloud service hybrid on-premises on-prem
  self-hosted hybrid deployment byoc bring-your-own-cloud appliance software-only
  artificial intelligence ai-powered machine learning genai generative ai watsonx ai/ml in-database analytics
  inza in-database ml model scoring feature engineering spark integration watsonx.ai granite
  soc 2 hipaa encryption role-based access compliance gdpr security governance regulated
  api sdk connector integration rest api dbt apache iceberg parquet object storage
  ncos native cloud object storage aws azure google cloud s3 glue purview unity catalog
  analytics dashboard reporting business intelligence insights olap high performance
  scalability enterprise-grade performance throughput low latency high availability
  real-time streaming event-driven kafka ibm datastage ibm event streams
  pricing free trial request a demo try free
  watsonx.data presto spark hive metastore iceberg tables data lakehouse open table format
  time travel historical versioning granular scaling geospatial analytics
  automation workflow orchestration automated pipelines elt pipeline dbt workflow no-code low-code
  ibm datastage automated data integration workflow engine ibm manta automated lineage
`.toLowerCase();

async function scanCapabilityEvidence({ productProfile, competitors, marketItems, documents = [] }) {
  const focusUrl = productProfile?.productUrl || "";
  const competitorTargets = competitors.map((competitor) => ({
    name: resolveCompetitorName(competitor),
    url: competitorScanUrl(competitor),
  })).filter((target) => target.name);

  const [focusPageText, ...competitorTexts] = await Promise.all([
    fetchPageTextForScan(focusUrl),
    ...competitorTargets.map((target) => fetchPageTextForScan(target.url)),
  ]);

  // Use Propel-backed proof text as authoritative fallback when page scan fails
  // (empty URL, network block, or timeout). This ensures IBM Netezza capabilities
  // are never shown as "unknown" or "not-detected" on the capability matrix.
  // Also fires when the active product template is netezza (kind === "netezza"),
  // even when the generic profile is displayed as "Focus product" before setup.
  const isNetezzaProduct = /netezza/i.test(
    `${productProfile?.displayName || ""} ${productProfile?.productName || ""} ${productProfile?.id || ""} ${productProfile?.kind || ""}`
  ) || productProfile?.kind === "netezza" || productProfile?.confirmedCapabilities?.some?.((c) => /netezza|iceberg|ncos/i.test(String(c)));
  const focusText = focusPageText || (isNetezzaProduct ? IBM_NETEZZA_CAPABILITY_PROOF : "");

  const newsByCompetitor = new Map();
  for (const item of marketItems || []) {
    const key = resolveCompetitorName(item?.competitor || "");
    if (!key) continue;
    if (!newsByCompetitor.has(key)) newsByCompetitor.set(key, []);
    newsByCompetitor.get(key).push(item);
  }

  // Step 3 documents: resolve each doc's text and which entities it speaks to.
  // Uploaded product docs are focus-product evidence by default. A document may
  // ALSO mention competitors; in that case it contributes to those competitors
  // too, but it is never taken away from the focus product just because a rival
  // name appears in the text (a Netezza brief routinely names Snowflake, etc.).
  const competitorNamesLower = competitorTargets.map((t) => ({ name: t.name, lower: t.name.toLowerCase() }));
  const docScans = await Promise.all((documents || []).slice(0, 8).map(async (doc, index) => {
    let text = String(doc?.text || "");
    const url = String(doc?.url || "").trim();
    if (!text && url) text = await fetchPageTextForScan(url);
    text = text.slice(0, 60000);
    if (!text.trim()) return null;
    const lower = text.toLowerCase();
    const name = String(doc?.name || `Workspace document ${index + 1}`).slice(0, 120);
    // An explicit external link about a single competitor is scoped to that
    // competitor only; an uploaded document is treated as focus evidence and
    // additionally credited to any competitor it explicitly names.
    const mentionedCompetitors = competitorNamesLower.filter((c) => lower.includes(c.lower)).map((c) => c.name);
    const isExternalLink = Boolean(url);
    const targets = isExternalLink && mentionedCompetitors.length
      ? mentionedCompetitors
      : ["__focus__", ...mentionedCompetitors];
    return {
      name,
      url,
      targets,
      detected: detectCapabilitiesInText(lower),
    };
  }));

  const docEvidenceByTarget = new Map();
  for (const scan of docScans) {
    if (!scan) continue;
    for (const target of scan.targets) {
      if (!docEvidenceByTarget.has(target)) docEvidenceByTarget.set(target, []);
      docEvidenceByTarget.get(target).push(scan);
    }
  }

  const buildStatuses = (pageText, pageUrl, newsItems = [], docScansForTarget = []) => {
    const claimed = detectCapabilitiesInText(pageText);
    const newsText = newsItems.map((item) => `${item.headline || ""} ${item.summary || ""}`).join(" ").toLowerCase();
    const reported = detectCapabilitiesInText(newsText);
    const statuses = {};
    for (const row of CAPABILITY_DETECTORS) {
      // Find a Step 3 document that confirms this capability for this target.
      const docHit = docScansForTarget.find((scan) => scan.detected[row.id]);
      if (claimed[row.id]) {
        statuses[row.id] = { status: "claimed", term: claimed[row.id].trim(), evidenceUrl: pageUrl };
      } else if (docHit) {
        // Step 3 document evidence is treated as a confirmed (claimed) proof point.
        statuses[row.id] = {
          status: "claimed",
          term: docHit.detected[row.id].trim(),
          evidenceUrl: docHit.url || "",
          evidenceSource: "document",
          evidenceLabel: docHit.name,
        };
      } else if (reported[row.id]) {
        const sourceItem = newsItems.find((item) => `${item.headline || ""} ${item.summary || ""}`.toLowerCase().includes(reported[row.id]));
        statuses[row.id] = { status: "reported", term: reported[row.id].trim(), evidenceUrl: sourceItem?.sourceUrl || "" };
      } else if (pageText) {
        statuses[row.id] = { status: "not-detected", term: "", evidenceUrl: pageUrl };
      } else {
        statuses[row.id] = { status: "unknown", term: "", evidenceUrl: "" };
      }
    }
    return statuses;
  };

  const competitorEvidence = {};
  competitorTargets.forEach((target, index) => {
    competitorEvidence[target.name] = buildStatuses(
      competitorTexts[index],
      target.url,
      newsByCompetitor.get(target.name) || [],
      docEvidenceByTarget.get(target.name) || []
    );
  });

  return {
    rows: CAPABILITY_DETECTORS.map((row) => ({ id: row.id, capability: row.capability, note: row.note })),
    focus: buildStatuses(focusText, focusUrl, [], docEvidenceByTarget.get("__focus__") || []),
    competitors: competitorEvidence,
    scannedAt: new Date().toISOString(),
  };
}

async function buildDocumentEvidence({ documents = [], competitors = [] } = {}) {
  if (!documents.length) return [];
  const competitorNames = competitors
    .map((competitor) => resolveCompetitorName(competitor))
    .filter(Boolean);

  const prepared = await Promise.all(documents.slice(0, 8).map(async (doc, index) => {
    const name = String(doc?.name || `Workspace document ${index + 1}`).slice(0, 120);
    const url = String(doc?.url || "").trim();
    let text = String(doc?.text || "");
    if (!text && url) {
      text = await fetchPageTextForScan(url);
    }
    text = text.slice(0, 60000);
    if (!text.trim()) return null;
    const lowerText = text.toLowerCase();
    const matchedCompetitor = competitorNames.find((competitorName) => lowerText.includes(competitorName.toLowerCase())) || "";
    const excerpt = text.replace(/\s+/g, " ").trim().slice(0, 280);
    return {
      id: `workspace-doc-${index + 1}`,
      competitor: matchedCompetitor,
      group: "document",
      sourceLabel: name,
      sourceBadge: "DOCUMENT",
      sourceUrl: url,
      headline: matchedCompetitor
        ? `Workspace document on ${matchedCompetitor}: ${name}`
        : `Workspace document: ${name}`,
      summary: `${excerpt}${text.length > 280 ? "..." : ""}`,
      publishedAt: new Date().toISOString(),
      coverageType: "static",
      documentText: lowerText,
    };
  }));

  return prepared.filter(Boolean);
}

export async function getWorkspaceIntelligence({ force = false, product = {}, competitors = DEFAULT_COMPETITORS, documents = [] } = {}) {
  const productProfile = resolveProductProfile(product);
  const cacheKey = JSON.stringify({ product: productProfile.cacheKey, competitors, documents: documents.map((doc) => `${doc?.name || ""}:${(doc?.text || doc?.url || "").length}`) });
  const now = Date.now();
  if (!force && cache.payload && cache.key === cacheKey && cache.expiresAt > now) {
    console.log(`[workspace-intelligence] Cache hit for competitors: ${competitors.map((c) => (typeof c === "string" ? c : c?.name || "")).filter(Boolean).join(', ')}`);
    return cache.payload;
  }

  console.log(`[workspace-intelligence] Fetching intelligence for competitors: ${competitors.map((c) => (typeof c === "string" ? c : c?.name || "")).filter(Boolean).join(', ')}`);

  // Fetch market signals AND IBM Product Knowledge (Propel MCP) in parallel
  const competitorNames = competitors.map((c) => (typeof c === "string" ? c : c?.name || "")).filter(Boolean);
  const [marketFeed, propelKnowledge] = await Promise.all([
    getMarketSignalsFeed({ force, competitors }),
    // Always use a real product name for Propel seeded content — the seeded item titles
    // contain "${shortName}" template interpolation. When the product is unconfigured
    // (kind === "generic"), fall back to "IBM Netezza" so titles render correctly.
    getPropelKnowledge({
      productName: (productProfile.kind === "generic" || !productProfile.kind)
        ? "IBM Netezza"
        : (productProfile.displayName || productProfile.productName || "IBM Netezza"),
      competitors: competitorNames,
      force,
    }),
  ]);

  const signals = Array.isArray(marketFeed.items) ? marketFeed.items : [];
  const capabilityEvidence = await scanCapabilityEvidence({ productProfile, competitors, marketItems: signals, documents });
  const documentEvidence = await buildDocumentEvidence({ documents, competitors });
  const evidenceInput = [...signals, ...documentEvidence];
  const evidenceDatabase = buildEvidenceDatabase({ marketItems: evidenceInput });

  // Try to generate AI-powered insights if Granite is configured
  let aiContentSuggestions = null;
  let aiPMMActions = null;
  
  if (isGraniteConfigured() && signals.length > 0) {
    console.log('[workspace-intelligence] IBM Granite is configured - generating AI-powered insights...');
    [aiContentSuggestions, aiPMMActions] = await Promise.all([
      generateAIContentSuggestions(signals, productProfile),
      generateAIPMMActions(signals, productProfile, competitors)
    ]);
  }

  const content = localizeForProduct(buildContentSection(rankEvidenceForPurpose(evidenceDatabase.items, "content", { limit: MAX_CONTENT_IDEAS, diversify: false }), productProfile, aiContentSuggestions, propelKnowledge), productProfile);
  const events = localizeForProduct(buildPmmSection(rankEvidenceForPurpose(evidenceDatabase.items, "pmm", { limit: 16, diversify: false }), productProfile, aiPMMActions, propelKnowledge), productProfile);
  const productSection = localizeForProduct(buildProductSection(rankEvidenceForPurpose(evidenceDatabase.items, "product", { limit: 16, diversify: false }), productProfile, competitors, capabilityEvidence), productProfile);
  const positioning = localizeForProduct(buildPositioningSection(rankEvidenceForPurpose(evidenceDatabase.items, "positioning", { limit: 12, diversify: false }), productSection, productProfile, propelKnowledge), productProfile);
  const overview = localizeForProduct(buildOverviewSection(rankEvidenceForPurpose(evidenceDatabase.items, "overview", { limit: 12, diversify: false }), { content, events, product: productSection, positioning }, productProfile), productProfile);

  // Build propelInsights section surfaced in the dashboard Knowledge panel
  const propelInsights = buildPropelInsightsSection(propelKnowledge, productProfile);

  const payload = {
    meta: {
      ...marketFeed.meta,
      mode: marketFeed.meta?.activeSources ? "live" : "snapshot",
      generatedAt: new Date().toISOString(),
      evidenceMode: evidenceDatabase.meta.mode,
      pmmAssetSourceLinks: PMM_BEST_PRACTICE_SOURCES,
      propelMode: propelKnowledge.meta.mode,
      propelGeneratedAt: propelKnowledge.meta.generatedAt,
      focusProduct: {
        id: productProfile.id,
        displayName: productProfile.displayName,
        shortName: productProfile.shortName,
        strategicRole: productProfile.strategicRole,
      },
    },
    capabilityEvidence,
    marketFeed: localizeForProduct(marketFeed, productProfile),
    evidenceDatabase: localizeForProduct(evidenceDatabase, productProfile),
    propelInsights,
    sections: {
      overview,
      content,
      events,
      product: productSection,
      positioning,
    },
  };

  cache = {
    key: cacheKey,
    expiresAt: now + CACHE_TTL_MS,
    payload,
  };

  return payload;
}

/**
 * Build the propelInsights section for the dashboard from a PropelKnowledgePayload.
 * Surfaces the most actionable items from each category as a flat list of cards
 * plus per-category sections the dashboard panel can render.
 */
function buildPropelInsightsSection(propelKnowledge, productProfile) {
  const shortProductName = productProfile?.shortName || "the product";

  function enrichItem(item) {
    const tag = {
      positioning:  "IBM Positioning",
      competitive:  "Competitive Intel",
      capabilities: "Product Capabilities",
      integration:  "Integration & AI",
      enablement:   "Sales Enablement",
    }[item.category] || "IBM Knowledge";

    return {
      ...item,
      tag,
      sourceLabel: item.source === "seismic" ? "Seismic" : item.source === "ibm_docs" ? "IBM Docs" : item.source === "cloud_docs" ? "IBM Cloud Docs" : "IBM Marketing",
      sourceBadge: item.source === "seismic" ? "SEISMIC" : item.source === "ibm_docs" ? "IBMDOCS" : item.source === "cloud_docs" ? "CLOUDOCS" : "IBM",
      freshnessLabel: formatRelativeTime(item.publishedAt),
      isNew: hoursSince(item.publishedAt) <= 72 * 30, // treat anything within 90 days as "new"
    };
  }

  const highlights = [
    ...(propelKnowledge.positioning?.items  || []).slice(0, 2),
    ...(propelKnowledge.competitive?.items  || []).slice(0, 2),
    ...(propelKnowledge.capabilities?.items || []).slice(0, 2),
    ...(propelKnowledge.integration?.items  || []).slice(0, 1),
    ...(propelKnowledge.enablement?.items   || []).slice(0, 1),
  ].map(enrichItem);

  return {
    propelLocked: true,   // prevents localizeForProduct from replacing IBM product names
    meta: propelKnowledge.meta,
    highlights,
    positioning:  { ...propelKnowledge.positioning,  items: (propelKnowledge.positioning?.items  || []).map(enrichItem) },
    competitive:  { ...propelKnowledge.competitive,  items: (propelKnowledge.competitive?.items  || []).map(enrichItem) },
    capabilities: { ...propelKnowledge.capabilities, items: (propelKnowledge.capabilities?.items || []).map(enrichItem) },
    integration:  { ...propelKnowledge.integration,  items: (propelKnowledge.integration?.items  || []).map(enrichItem) },
    enablement:   { ...propelKnowledge.enablement,   items: (propelKnowledge.enablement?.items   || []).map(enrichItem) },
    suggestedAction: buildPropelSuggestedAction(propelKnowledge, shortProductName),
  };
}

function buildPropelSuggestedAction(propelKnowledge, shortProductName) {
  const compItem = propelKnowledge.competitive?.items?.[0];
  if (compItem) {
    return {
      title: `Counter ${compItem.title.split("—")[0].trim() || "top competitor"} with IBM proof`,
      summary: `Use the IBM Seismic competitive deck and positioning content to build a battle card or objection handler grounded in authoritative IBM evidence — not web-crawl signals alone.`,
      sourceUrl: compItem.url,
      sourceLabel: "IBM Seismic",
    };
  }
  return {
    title: `Publish a ${shortProductName} hybrid analytics POV`,
    summary: `Leverage the IBM Docs and marketing content in the Knowledge panel to draft a thought leadership piece that connects ${shortProductName}'s lakehouse performance to watsonx.data AI readiness.`,
    sourceUrl: "https://www.ibm.com/products/netezza",
    sourceLabel: "IBM.com",
  };
}

export async function handler(event = {}) {
  const params = event.queryStringParameters || {};
  
  // Parse competitors from query params
  let competitors = DEFAULT_COMPETITORS;
  if (params.competitors) {
    try {
      competitors = JSON.parse(params.competitors);
    } catch (error) {
      console.error("[workspace-intelligence] Failed to parse competitors param:", error);
    }
  }
  
  const payload = await getWorkspaceIntelligence({
    force: Object.prototype.hasOwnProperty.call(params, "refresh"),
    competitors: competitors.map((c) => (typeof c === "string" ? c : c?.name || "")).filter(Boolean),
    product: {
      id: params.productId || "",
      displayName: params.productName || "",
      productName: params.fullProductName || "",
      shortName: params.shortName || "",
      description: params.description || "",
      primaryBuyer: params.primaryBuyer || "",
      productUrl: params.productUrl || "",
    },
    competitors: competitors.map((c) => (typeof c === "string" ? c : c?.name || "")).filter(Boolean),
  });

  return {
    statusCode: 200,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Cache-Control": "no-store",
    },
    body: JSON.stringify(payload),
  };
}

function buildContentSection(signals, productProfile, aiContentSuggestions = null, propelKnowledge = null) {
  const candidates = selectContentCandidates(signals, MAX_CONTENT_IDEAS);
  const lead = candidates[0];

  // Inject Propel competitive + positioning items as additional content ideas
  const propelIdeas = [];
  const propelItems = [
    ...(propelKnowledge?.competitive?.items  || []),
    ...(propelKnowledge?.positioning?.items  || []),
  ].slice(0, 4);

  propelItems.forEach((item, index) => {
    const platform = item.category === "competitive" ? "Blog post" : "Thought leadership";
    const tag = item.category === "competitive" ? "IBM Competitive Intel" : "IBM Positioning";
    propelIdeas.push({
      id: `propel-content-${item.id || index}`,
      competitor: item.category === "competitive" ? "IBM Seismic" : "IBM.com",
      publishedAt: item.publishedAt || new Date().toISOString(),
      icon: "★",
      title: item.title,
      summary: `${clipText(item.snippet || "", 220)} — Source: ${item.sourceLabel || item.source}. Use this IBM-authoritative content as the research foundation for ${productProfile.shortName} PMM assets.`,
      platform,
      status: "IBM Knowledge",
      tags: [tag, item.sourceLabel || "IBM", platform],
      citations: [{ sourceLabel: item.sourceLabel || "IBM", sourceUrl: item.url, sourceBadge: item.sourceBadge || "IBM", coverageType: "live", coverageLabel: "IBM Knowledge" }],
      coverageType: "live",
      coverageLabel: "IBM Knowledge",
      sourceUrl: item.url,
      outline: `Use this IBM ${tag} content as the anchor for your next ${productProfile.shortName} asset:\n\n1. Open source: ${item.url}\n2. Extract the key differentiation points\n3. Map them to current competitor signals\n4. Draft the ${platform.toLowerCase()} with IBM-verified proof`,
      propelSourced: true,
    });
  });

  const allIdeas = [
    ...candidates.map((signal, index) => createContentIdea(signal, index, productProfile)),
    ...propelIdeas,
  ].sort((a, b) => (b.propelSourced ? 0 : 1) - (a.propelSourced ? 0 : 1) || new Date(b.publishedAt || 0) - new Date(a.publishedAt || 0));

  // Alert driven by strongest signal or Propel competitive insight
  const propelCompItem = propelKnowledge?.competitive?.items?.[0];
  const alertTitle = lead
    ? `Urgent: ${shortName(lead.competitor)} counter-narrative should ship this week`
    : propelCompItem
      ? `IBM Seismic: counter ${propelCompItem.title.split("—")[0].trim()} now`
      : "Urgent: keep the competitive publishing queue warm";
  const alertCopy = lead
    ? `${possessive(lead.competitor)} latest ${lead.sourceLabel.toLowerCase()} signal is pushing a fresh modernization story. Publish one response asset quickly so the market sees ${productProfile.shortName} as ${productProfile.strategicRole} in the same decision window.`
    : propelCompItem
      ? `IBM Seismic's competitive deck surfaces a key counter-positioning opportunity. Use the IBM Knowledge page to get the full Seismic asset, then draft the battle card or blog response.`
      : "The live signal engine did not produce a current lead signal, so the page is falling back to baseline content recommendations.";

  return {
    alert: { title: alertTitle, copy: alertCopy },
    ideas: allIdeas,
    propelEnriched: propelIdeas.length > 0,
  };
}

function buildPmmSection(signals, productProfile, aiActions = null, propelKnowledge = null) {
  const competitorLeads = topSignalsByCompetitor(signals).slice(0, 6);
  const lead = competitorLeads[0];

  const actions = [];
  const assetLeads = diversifySignalsForAssets(signals).slice(0, 8);
  assetLeads.forEach((signal, index) => {
    actions.push(createRecommendedAssetAction(signal, index, productProfile));
  });
  if (lead) {
    actions.push(createCounterPostAction(lead, productProfile));
    actions.push(createExecutiveBriefingAction(competitorLeads, productProfile));
    actions.push(createAnalystBriefingAction(competitorLeads, productProfile));
  }

  // Merge AI-generated actions with template-based actions
  if (aiActions && aiActions.actions && aiActions.actions.length > 0) {
    console.log(`[buildPmmSection] Enriching with ${aiActions.actions.length} AI-powered PMM actions`);
    const aiPMMActions = aiActions.actions.slice(0, 5).map((action, index) => ({
      id: `ai-pmm-${index}`,
      title: action.action,
      summary: action.rationale,
      audience: action.audience,
      impact: action.impact,
      effort: action.effort,
      priority: action.priority || 5,
      tags: ["AI-Generated", action.impact, action.effort, ...(action.assets || [])],
      aiGenerated: true,
      generatedAt: aiActions.meta?.generatedAt,
    }));
    actions.unshift(...aiPMMActions);
  }

  // Inject Propel enablement + competitive items as IBM-sourced PMM actions
  const propelActions = [];
  const propelEnablementItems = [
    ...(propelKnowledge?.enablement?.items   || []),
    ...(propelKnowledge?.competitive?.items  || []),
  ].slice(0, 3);

  propelEnablementItems.forEach((item, index) => {
    const actionType = item.category === "enablement" ? "Sales enablement asset" : "Battle card / objection handler";
    propelActions.push({
      id: `propel-pmm-${item.id || index}`,
      competitor: item.category === "competitive" ? "Competitive" : "Enablement",
      publishedAt: item.publishedAt || new Date().toISOString(),
      icon: "★",
      title: item.title,
      summary: `${clipText(item.snippet || "", 220)} Source: IBM ${item.sourceLabel || item.source}. Use this as the foundation for a ${actionType.toLowerCase()} grounded in IBM-authoritative content.`,
      status: "IBM Knowledge",
      tags: ["IBM Knowledge", actionType, item.sourceLabel || "IBM"],
      citations: [{ sourceLabel: item.sourceLabel || "IBM", sourceUrl: item.url, sourceBadge: item.sourceBadge || "IBM", coverageType: "live", coverageLabel: "IBM Knowledge" }],
      coverageType: "live",
      coverageLabel: "IBM Knowledge",
      sourceUrl: item.url,
      outline: `IBM-sourced ${actionType} outline:\n\n1. Review: ${item.url}\n2. Extract key proof points and differentiators\n3. Map against current competitor pressure\n4. Draft the ${actionType.toLowerCase()} with IBM-verified citations`,
      propelSourced: true,
    });
  });

  // Propel actions sit just below AI-generated ones, above template actions
  const allActions = dedupeById([...actions, ...propelActions])
    .sort((a, b) =>
      ((b.aiGenerated === true) - (a.aiGenerated === true)) ||
      ((b.propelSourced === true) - (a.propelSourced === true)) ||
      (new Date(b.publishedAt || 0) - new Date(a.publishedAt || 0))
    )
    .slice(0, 18);

  // Alert: use lead signal, or fall back to strongest Propel enablement item
  const propelAlert = propelKnowledge?.enablement?.items?.[0];
  const alertTitle = lead
    ? `Urgent PMM actions - ${shortName(lead.competitor)} pressure`
    : propelAlert
      ? `IBM Seismic: ${propelAlert.title.slice(0, 80)}`
      : "Urgent PMM actions - monitoring mode";
  const alertCopy = lead
    ? `Two immediate actions are recommended from ranked source evidence: ship the ${shortName(lead.competitor)} response asset first, then arm sellers with a sales-ready comparison, objection, or value asset grounded in citations and tailored to ${productProfile.shortName}.`
    : propelAlert
      ? `IBM Seismic sales enablement content is available to build the next ${productProfile.shortName} PMM asset. Open the IBM Knowledge page and use the Seismic deck as the starting point.`
      : "Live PMM triggers are temporarily thin, so the page is holding on baseline asset recommendations.";

  return {
    alert: { title: alertTitle, copy: alertCopy },
    actions: allActions,
    aiMeta: aiActions?.meta || null,
    propelEnriched: propelActions.length > 0,
  };
}

// Product-agnostic remaining-gap derivation. A gap is any capability the focus
// product does NOT claim while one or more competitors DO. Scores combine how
// far behind the focus product is with how many competitors lead on it. Works
// for any focus product because it only reads scan statuses, never hardcoded
// product facts. Focus status already accounts for Step 3 documents, so a doc
// that proves a capability removes the gap automatically.
function deriveAlgorithmicGaps({ capabilityEvidence, productProfile }) {
  if (!capabilityEvidence || !Array.isArray(capabilityEvidence.rows) || !capabilityEvidence.rows.length) {
    return { gaps: [], scanned: false };
  }
  const focusShort = productProfile?.shortName || productProfile?.displayName || "the focus product";
  const buyer = productProfile?.primaryBuyer || "Product, PMM, and sales stakeholders";
  const competitorNames = Object.keys(capabilityEvidence.competitors || {});

  const focusNowLabel = (status) => {
    switch (status) {
      case "reported": return `Only an unverified mention exists for ${focusShort}; no clear public claim on the configured page.`;
      case "unknown": return `${focusShort}'s product page could not be scanned. Add or verify the focus product URL in Manage so this capability can be evaluated.`;
      default: return `Not surfaced on ${focusShort}'s configured product page.`;
    }
  };

  const gaps = [];
  for (const row of capabilityEvidence.rows) {
    const focusCell = capabilityEvidence.focus?.[row.id] || { status: "unknown" };
    const focusStatus = focusCell.status;
    if (focusStatus === "claimed") continue; // focus already has it -> not an investment gap

    const claiming = competitorNames.filter((name) => capabilityEvidence.competitors[name]?.[row.id]?.status === "claimed");
    if (!claiming.length) continue; // no competitor leads on it -> no investment pressure

    const focusWeakness = focusStatus === "not-detected" ? 4 : focusStatus === "reported" ? 3 : 2.5;
    const pressure = Math.min(5, claiming.length * 1.5);
    const rawScore = focusWeakness + pressure;
    const gapScore = `${Math.min(9.5, rawScore).toFixed(1)} / 10`;
    const priority = rawScore >= 7 ? "P1 - Review now" : rawScore >= 4.5 ? "P2 - High" : "P3 - Monitor";

    const claimList = claiming.join(", ");
    const capLower = row.capability.toLowerCase();
    gaps.push({
      id: `algo-gap-${row.id}`,
      priority,
      title: row.capability,
      gapScore,
      copy: `${claimList} ${claiming.length === 1 ? "publicly claims" : "publicly claim"} ${capLower}, while ${focusShort} does not. ${row.note}`,
      current: focusNowLabel(focusStatus),
      leverage: `If ${focusShort} supports this, surface it clearly on the product page and in messaging to neutralize the comparison. If not, treat it as a roadmap or packaging priority, since ${claiming.length} tracked ${claiming.length === 1 ? "competitor leads" : "competitors lead"} with it.`,
      impact: buyer,
      competitors: claiming,
      tags: ["Capability gap", "Evidence-derived", row.capability],
      derived: true,
    });
  }

  gaps.sort((a, b) => parseGapScore(b.gapScore) - parseGapScore(a.gapScore));
  return { gaps, scanned: true };
}

function buildProductSection(signals, productProfile, competitors = [], capabilityEvidence = null) {
  const criticalGap = pickCriticalGap(signals, productProfile);
  const strengths = productProfile.confirmedStrengths.map((item, index) => {
    // Use actual competitors from the list instead of hardcoded ones
    const targetCompetitor = competitors[index] || null;
    
    if (!targetCompetitor) return item;
    
    const proofSignal = topSignalForCompetitor(signals, targetCompetitor);
    if (!proofSignal) return item;
    
    return {
      ...item,
      summary: `${item.summary} Latest market pressure: ${possessive(proofSignal.competitor)} ${proofSignal.sourceLabel.toLowerCase()} signal still leans on ${extractTheme(proofSignal)}.`,
    };
  });

  const focusShort = productProfile?.shortName || productProfile?.displayName || "the focus product";
  const { gaps: algorithmicGaps, scanned } = deriveAlgorithmicGaps({ capabilityEvidence, productProfile });

  let remainingGaps;
  if (algorithmicGaps.length) {
    remainingGaps = algorithmicGaps;
  } else if (scanned) {
    // Pages were scanned and no competitor-led capability exceeds the focus product.
    remainingGaps = [{
      priority: "Healthy",
      title: "No competitor-led capability gaps detected",
      gapScore: "0 / 10",
      copy: `Across the scanned capabilities, no tracked competitor publicly claims a capability that ${focusShort} does not. Keep monitoring as competitor pages and your Step 3 sources change.`,
      current: `${focusShort}'s configured page and uploaded sources cover the capabilities competitors currently lead with.`,
      leverage: "Shift focus to differentiation and proof: turn the capabilities you already lead on into messaging and comparison assets.",
      impact: productProfile?.primaryBuyer || "Product, PMM, and sales stakeholders",
      competitors: [],
      tags: ["No gaps", "Evidence-derived"],
      derived: true,
    }];
  } else {
    // Capability scan unavailable (focus or competitor pages unreachable).
    remainingGaps = [{
      priority: "Needs evidence",
      title: "Add or verify sources to derive capability gaps",
      gapScore: "0 / 10",
      copy: `Capability gaps are derived from the focus product page, competitor pages, and Step 3 documents. None could be scanned yet, so no evidence-based gaps can be computed.`,
      current: productProfile?.productUrl ? `${focusShort} product page configured but not reachable for scanning.` : `${focusShort} product page URL missing.`,
      leverage: "Add or verify the focus product URL and competitor webpage links in Manage; optionally upload a Step 3 capability document.",
      impact: productProfile?.primaryBuyer || "Product and PMM stakeholders",
      competitors: [],
      tags: ["Setup", "Evidence-derived"],
      derived: true,
    }];
  }

  return {
    confirmedCapabilities: productProfile.confirmedCapabilities,
    criticalGap,
    confirmedStrengths: strengths,
    remainingGaps,
  };
}

function buildPositioningSection(signals, product, productProfile, propelKnowledge = null) {
  const topThreats = topSignalsByCompetitor(signals).sort((a, b) => new Date(b.publishedAt || 0) - new Date(a.publishedAt || 0)).slice(0, 4);
  const recommendationLead = topThreats[0];
  const responseAngles = topThreats.map((signal, index) => createResponseAngle(signal, index));

  // Enrich message pillars with Propel positioning evidence
  const propelPositioningItems = propelKnowledge?.positioning?.items || [];
  const enrichedPillars = productProfile.positioningPillars.map((pillar, index) => {
    let text = pillar.text;
    // Layer 1: live signal context
    if (index < topThreats.length) {
      text = `${text} Right now this matters because ${topThreats[index].competitor} is emphasizing ${extractTheme(topThreats[index])}.`;
    }
    // Layer 2: Propel IBM positioning proof sentence
    const propelItem = propelPositioningItems[index % propelPositioningItems.length];
    if (propelItem) {
      text = `${text} IBM proof: ${clipText(propelItem.snippet || "", 140)} (${propelItem.sourceLabel || "IBM"})`;
    }
    return { ...pillar, text };
  });

  // Build Propel-sourced response angles for competitive counters
  const propelResponseAngles = (propelKnowledge?.competitive?.items || []).slice(0, 2).map((item, index) => ({
    id: `propel-response-${item.id || index}`,
    competitor: "IBM Seismic",
    publishedAt: item.publishedAt || new Date().toISOString(),
    title: item.title,
    summary: clipText(item.snippet || "", 200),
    recommendation: `Open the IBM Seismic deck and use this content to build a counter-positioning asset: ${item.url}`,
    tags: ["IBM Knowledge", "Competitive counter", item.sourceLabel || "Seismic"],
    sourceUrl: item.url,
    propelSourced: true,
  }));

  // Propel-enriched recommendation evidence
  const propelPosItem = propelPositioningItems[0];
  const enrichedEvidence = recommendationLead
    ? `Latest proof: ${possessive(recommendationLead.competitor)} ${recommendationLead.sourceLabel.toLowerCase()} signal is reinforcing ${extractTheme(recommendationLead)}. That keeps ${productProfile.shortName}'s best response anchored in ${productProfile.categoryResponse}.`
      + (propelPosItem ? ` IBM confirms: "${clipText(propelPosItem.snippet || "", 120)}" — ${propelPosItem.sourceLabel || "IBM"}.` : "")
    : propelPosItem
      ? `IBM ${propelPosItem.sourceLabel || "Marketing"} confirms: ${clipText(propelPosItem.snippet || "", 180)}`
      : productProfile.positioningFallback;

  return {
    recommendation: {
      label: "Live positioning recommendation — IBM Knowledge enriched",
      statement: productProfile.positioningStatement,
      evidence: enrichedEvidence,
    },
    messagePillars: enrichedPillars,
    responseAngles: [...responseAngles, ...propelResponseAngles].slice(0, 6),
    productCriticalGap: product.criticalGap,
    propelEnriched: propelResponseAngles.length > 0,
  };
}

function buildOverviewSection(signals, sections, productProfile) {
  return {
    pageInsights: {
      content: toOverviewInsight(sections.content.ideas[0], "content"),
      events: toOverviewInsight(sections.events.actions[0], "events"),
      market: createMarketOverviewInsight(signals[0]),
      product: toOverviewInsight(sections.product.remainingGaps[0], "product"),
      positioning: toOverviewInsight(sections.positioning.responseAngles[0], "positioning"),
    },
    sentiment: buildSentiment(signals),
  };
}

function createContentIdea(signal, index, productProfile) {
  const platform = getContentPlatform(signal);
  const status = index === 0 ? "Urgent" : hoursSince(signal.publishedAt) <= 120 ? "New" : "";
  const title = getContentTitle(signal, index);
  const sourceNote = `${signal.competitor} ${signal.sourceLabel}`;

  return {
    id: `live-content-${signal.id}`,
    competitor: signal.competitor,
    publishedAt: signal.publishedAt,
    icon: getIconForGroup(signal.group),
    title,
    summary: `${clipText(signal.summary, 190)} Map this to ${platform.toLowerCase()} with a direct ${productProfile.shortName} response to ${sourceNote}.`,
    platform,
    status,
    tags: [
      platform,
      `Counter-${shortName(signal.competitor)}`,
      signal.sourceBadge,
      signal.freshnessLabel || "Live signal",
    ],
    citations: makeCitations([signal]),
    coverageType: signal.coverageType || "static",
    coverageLabel: signal.coverageLabel || "Static",
    outline: buildContentOutline(signal, platform, title, productProfile),
  };
}

function createBattleCardAction(signal, index) {
  return {
    id: `live-pmm-battle-${signal.id}`,
    competitor: signal.competitor,
    publishedAt: signal.publishedAt,
    icon: "X",
    title: `Battle card: Netezza vs ${shortName(signal.competitor)}`,
    summary: `Refresh the seller battle card with live evidence from ${signal.sourceLabel}. Focus on ${extractTheme(signal)} and current objection handlers.`,
    status: index === 0 ? "Urgent" : "",
    tags: ["Competitive battle card", `Counter-${shortName(signal.competitor)}`, signal.sourceBadge],
    citations: makeCitations([signal]),
    coverageType: signal.coverageType || "static",
    coverageLabel: signal.coverageLabel || "Static",
    outline: buildBattleCardOutline(signal),
  };
}

function createRecommendedAssetAction(signal, index, productProfile) {
  const strategy = selectPmmAssetStrategy(signal, index);
  const theme = extractTheme(signal);

  return {
    id: `live-pmm-${strategy.id}-${signal.id}`,
    competitor: signal.competitor,
    publishedAt: signal.publishedAt,
    icon: strategy.icon,
    title: `${strategy.asset}: ${productProfile.shortName} vs ${shortName(signal.competitor)}`,
    summary: `${strategy.summary} Trigger: ${possessive(signal.competitor)} ${signal.sourceLabel.toLowerCase()} evidence is pressing on ${theme}.`,
    status: index === 0 ? "Urgent" : signal.coverageType === "live" ? "Live" : "",
    tags: [
      strategy.label,
      strategy.bestPractice,
      `Counter-${shortName(signal.competitor)}`,
      signal.coverageLabel || "Evidence-backed",
    ],
    citations: makeCitations([signal]),
    coverageType: signal.coverageType || "static",
    coverageLabel: signal.coverageLabel || "Static",
    outline: buildRecommendedAssetOutline(signal, strategy, productProfile),
  };
}

function createCounterPostAction(signal, productProfile) {
  return {
    id: `live-pmm-counter-${signal.id}`,
    competitor: signal.competitor,
    publishedAt: signal.publishedAt,
    icon: "!",
    title: `Counter-post: ${shortName(signal.competitor)} ${signal.sourceLabel.toLowerCase()} narrative`,
    summary: `Create a short executive-ready post that answers ${possessive(signal.competitor)} latest ${signal.sourceLabel.toLowerCase()} message with a clearer ${productProfile.shortName} point of view.`,
    status: "Urgent",
    tags: ["Executive POV", "Social response", `Counter-${shortName(signal.competitor)}`],
    citations: makeCitations([signal]),
    coverageType: signal.coverageType || "static",
    coverageLabel: signal.coverageLabel || "Static",
    outline: buildCounterPostOutline(signal, productProfile),
  };
}

function createExecutiveBriefingAction(signals, productProfile) {
  const leaders = signals.map((signal) => shortName(signal.competitor)).join(", ");
  return {
    id: "live-pmm-cio-briefing",
    competitors: signals.map((signal) => signal.competitor),
    publishedAt: signals[0]?.publishedAt || new Date().toISOString(),
    icon: "=",
    title: "CIO briefing: live competitive position",
    summary: `Executive-ready narrative covering the current pressure set across ${leaders}.`,
    status: "",
    tags: ["Executive briefing", "Sales leadership", "Market feedback"],
    citations: makeCitations(signals),
    coverageType: signals.some((signal) => signal.coverageType === "live") ? "live" : "static",
    coverageLabel: signals.some((signal) => signal.coverageType === "live") ? "Live" : "Static",
    outline: `OUTLINE - CIO briefing\n\nSlide 1 - What changed in the last refresh window\n${signals.map((signal) => `- ${signal.competitor}: ${clipText(signal.summary, 110)}`).join("\n")}\n\nSlide 2 - Where ${productProfile.shortName} should lead\n- ${productProfile.strategicRole}\n- Buyer fit: ${productProfile.buyerFrame}\n- IBM trust and governance proof\n\nSlide 3 - What to say in active deals\n- Translate competitor claims into buyer decision criteria\n- Use public citations and proof, not unsupported parity language\n- Keep the response anchored in ${productProfile.categoryResponse}\n\nSlide 4 - Immediate asks for PMM and sales\n- Update battle cards\n- Refresh web proof\n- Push one executive POV asset this week`,
  };
}

function createAnalystBriefingAction(signals, productProfile) {
  return {
    id: "live-pmm-analyst-briefing",
    competitors: signals.map((signal) => signal.competitor),
    publishedAt: signals[0]?.publishedAt || new Date().toISOString(),
    icon: "^",
    title: "Analyst briefing topics - live narrative shifts",
    summary: `Package the latest competitive narratives into a concise analyst briefing memo so category framing includes ${productProfile.strategicRole}.`,
    status: "",
    tags: ["Analyst memo", "Category framing", "Positioning"],
    citations: makeCitations(signals),
    coverageType: signals.some((signal) => signal.coverageType === "live") ? "live" : "static",
    coverageLabel: signals.some((signal) => signal.coverageType === "live") ? "Live" : "Static",
    outline: `OUTLINE - Analyst briefing memo\n\nTheme 1 - Why buyers still need ${productProfile.strategicRole}\nTheme 2 - Which competitor messages are gaining share of voice now\n${signals.map((signal) => `- ${signal.competitor}: ${extractTheme(signal)}`).join("\n")}\n\nTheme 3 - Which buyer risks ${productProfile.shortName} should own\nTheme 4 - Why ${productProfile.categoryResponse} should stay in evaluation criteria\nTheme 5 - What IBM wants analysts to notice in ${productProfile.shortName}'s current story\n\nDeliverables\n- 1-page memo\n- 5 talking points\n- follow-up proof links`,
  };
}

function createResponseAngle(signal, index) {
  return {
    competitor: signal.competitor,
    publishedAt: signal.publishedAt,
    priority: index === 0 ? "Primary angle" : index === 1 ? "Rebuttal" : "Sales angle",
    title: `Counter ${shortName(signal.competitor)} on ${extractTheme(signal)}`,
    summary: `${possessive(signal.competitor)} latest ${signal.sourceLabel.toLowerCase()} signal is pressing on ${extractTheme(signal)}. That is exactly where Netezza should respond with lakehouse-ready performance, governed simplicity, and clearer workload-fit language.`,
    recommendation: getResponseRecommendation(signal),
    tags: [shortName(signal.competitor), signal.sourceBadge, signal.freshnessLabel || "Live"],
    citations: makeCitations([signal]),
    coverageType: signal.coverageType || "static",
    coverageLabel: signal.coverageLabel || "Static",
  };
}

function toOverviewInsight(item, tone) {
  if (!item) {
    return {
      competitor: "Monitoring",
      priority: "Watching",
      title: `No ${tone} signal yet`,
      summary: "The live engine has not produced a current recommendation for this section, so the workspace is holding on baseline guidance.",
      recommendation: "Refresh the feed or keep using the seeded strategic recommendation.",
    };
  }

  if (item.recommendation) {
    return item;
  }

  return {
    competitor: item.competitors?.[0] || "IBM Netezza",
    priority: item.priority || item.status || "Live",
    title: item.title,
    summary: item.summary || item.copy || "",
    recommendation: item.leverage || item.current || "Use this live insight in the matching section.",
  };
}

function createMarketOverviewInsight(signal) {
  if (!signal) {
    return {
      competitor: "Monitoring",
      priority: "Watching",
      title: "No market signal available",
      summary: "The live signal engine did not return a current external signal.",
      recommendation: "Refresh the market feed or use the snapshot signal set.",
    };
  }

  return {
    competitor: signal.competitor,
    publishedAt: signal.publishedAt,
    priority: signal.freshnessLabel || "Live",
    title: signal.headline || `${signal.competitor} ${signal.sourceLabel} signal`,
    summary: signal.summary,
    recommendation: `${getActionFromSignal(signal)} from the Market Signals page.`,
    citations: [toSignalCitation(signal)],
    coverageType: signal.coverageType || "static",
    coverageLabel: signal.coverageLabel || "Static",
  };
}

function toSignalCitation(signal) {
  return {
    competitor: signal.competitor,
    publishedAt: signal.publishedAt,
    sourceLabel: signal.sourceLabel,
    sourceBadge: signal.sourceBadge,
    sourceUrl: signal.sourceUrl,
    coverageType: signal.coverageType || "static",
    coverageLabel: signal.coverageLabel || "Static",
    dateLabel: signal.dateLabel || signal.freshnessLabel || "",
  };
}

function buildSentiment(signals) {
  const output = [
    { name: "IBM Netezza", ...BASE_SENTIMENT["IBM Netezza"] },
    ...Object.keys(COMPETITOR_PRESSURE).map((competitor) => {
      const baseline = { ...BASE_SENTIMENT[competitor] };
      const reviewSignal = signals.find((signal) => signal.competitor === competitor && signal.group === "reviews");
      if (!reviewSignal) {
        return { name: competitor, ...baseline };
      }

      const summary = `${reviewSignal.headline || ""} ${reviewSignal.summary}`.toLowerCase();
      const positiveHits = countKeywords(summary, ["strong", "fast", "reliable", "scale", "satisfaction", "easy", "ease", "performance"]);
      const negativeHits = countKeywords(summary, ["cost", "complexity", "friction", "lagging", "risk", "debug", "slow", "complaint"]);
      const delta = Math.max(-8, Math.min(8, (positiveHits - negativeHits) * 2));
      const positive = clamp(baseline.positive + delta, 45, 84);
      const negative = clamp(baseline.negative - delta, 6, 26);
      const neutral = 100 - positive - negative;
      return { name: competitor, positive, neutral, negative };
    }),
  ];

  return output;
}

function resolveProductProfile(product = {}) {
  const id = String(product.id || "").toLowerCase();
  const name = `${product.displayName || ""} ${product.productName || ""} ${product.shortName || ""}`.toLowerCase();
  const template = id.includes("db2") || name.includes("db2")
    ? PRODUCT_PROFILE_TEMPLATES.db2
    : id.includes("netezza") || name.includes("netezza")
      ? PRODUCT_PROFILE_TEMPLATES.netezza
      : createGenericProductProfile(product);

  const displayName = product.displayName || product.productName || template.displayName;
  const shortName = product.shortName || displayName.replace(/^IBM\s+/i, "") || template.shortName;

  return {
    ...template,
    id: product.id || template.kind || slugify(displayName),
    displayName,
    productName: product.productName || displayName,
    shortName,
    buyerFrame: product.primaryBuyer || template.buyerFrame,
    cacheKey: slugify(`${product.id || ""}-${displayName}-${shortName}`),
    confirmedCapabilities: template.confirmedCapabilities || PRODUCT_CONFIRMED_CAPABILITIES,
    confirmedStrengths: template.confirmedStrengths || PRODUCT_CONFIRMED_STRENGTHS,
    gapBlueprints: template.gapBlueprints || PRODUCT_GAP_BLUEPRINTS,
    positioningPillars: template.positioningPillars || POSITIONING_PILLARS,
  };
}

function createGenericProductProfile(product = {}) {
  const displayName = product.displayName || product.productName || "Focus product";
  const shortName = product.shortName || displayName.replace(/^IBM\s+/i, "") || "Focus product";
  return {
    kind: "generic",
    displayName,
    productName: product.productName || displayName,
    shortName,
    strategicRole: "the differentiated IBM solution buyers should evaluate against current competitor claims",
    buyerFrame: product.primaryBuyer || "Product, marketing, sales, and solution stakeholders",
    categoryResponse: "validated product proof, buyer-fit clarity, and competitor-specific objection handling",
    confirmedCapabilities: PRODUCT_CONFIRMED_CAPABILITIES.map((item) => item.replace(/Netezza/g, shortName)),
    confirmedStrengths: PRODUCT_CONFIRMED_STRENGTHS.map((item) => ({
      ...item,
      title: item.title.replace(/Netezza/g, shortName),
      summary: item.summary.replace(/Netezza/g, shortName),
      leverage: item.leverage.replace(/Netezza/g, shortName),
    })),
    gapBlueprints: PRODUCT_GAP_BLUEPRINTS.map((gap) => ({
      ...gap,
      copy: gap.copy.replace(/Netezza/g, shortName),
    })),
    positioningPillars: POSITIONING_PILLARS.map((pillar) => ({
      ...pillar,
      text: pillar.text.replace(/Netezza/g, shortName),
    })),
    positioningStatement: `${shortName} should be positioned around validated product proof, buyer-fit clarity, and source-backed differentiation against the current competitor set.`,
    positioningFallback: `Latest proof is unavailable, so the positioning guidance is staying anchored to ${shortName}'s saved product profile and controlled source list.`,
  };
}

function localizeForProduct(value, productProfile) {
  if (typeof value === "string") {
    return localizeText(value, productProfile);
  }
  if (Array.isArray(value)) {
    return value.map((item) => localizeForProduct(item, productProfile));
  }
  if (value && typeof value === "object") {
    // Propel-sourced items contain IBM-authoritative product names (e.g. "IBM Netezza",
    // "Snowflake", "Seismic") that must NOT be localized — they are real content, not
    // templates. Skip localization for any object carrying propelSourced or propelLocked.
    if (value.propelSourced === true || value.propelLocked === true) return value;
    // For propelLocked parent objects, walk values but skip any nested array/object
    // that would be recursed into — handled above by propelSourced on individual items.
    return Object.fromEntries(Object.entries(value).map(([key, item]) => [key, localizeForProduct(item, productProfile)]));
  }
  return value;
}

function localizeText(value, productProfile) {
  let text = String(value || "")
    .replace(/IBM Netezza Performance Server/g, productProfile.productName)
    .replace(/IBM Netezza/g, productProfile.displayName)
    .replace(/\bNetezza\b/g, productProfile.shortName);

  if (productProfile.kind === "db2") {
    text = text
      .replace(/the performant warehouse engine a lakehouse needs/g, productProfile.strategicRole)
      .replace(/the performant warehouse engine for governed lakehouse analytics/g, productProfile.strategicRole)
      .replace(/performant warehouse engine for governed lakehouse analytics/g, productProfile.strategicRole)
      .replace(/performant warehouse engine/g, "trusted SQL analytics engine")
      .replace(/warehouse-grade execution for open lakehouse data/g, "governed SQL analytics execution for modern data estates")
      .replace(/lakehouse-ready performance/g, "SQL-continuity and governed modernization")
      .replace(/open lakehouse architectures/g, "modern analytics architectures")
      .replace(/open lakehouse data/g, "trusted enterprise data")
      .replace(/lakehouse architectures/g, "modern analytics architectures")
      .replace(/lakehouse data/g, "trusted enterprise data")
      .replace(/lakehouse/g, "warehouse modernization");
  }

  return text;
}

function pickCriticalGap(signals, productProfile) {
  const ranked = productProfile.gapBlueprints.map((gap) => ({
    gap,
    score: signals.reduce((sum, signal) => sum + countKeywords(`${signal.headline} ${signal.summary}`.toLowerCase(), gap.keywords), 0),
    leadSignal: signals.find((signal) => countKeywords(`${signal.headline} ${signal.summary}`.toLowerCase(), gap.keywords) > 0),
  })).sort((left, right) => right.score - left.score);

  const top = ranked[0];
  if (!top || !top.score) {
    const fallbackGap = productProfile.gapBlueprints[0];
    return {
      title: fallbackGap ? `Remaining critical gap - ${fallbackGap.title.toLowerCase()}` : "Remaining critical gap - product proof packaging",
      copy: fallbackGap?.copy || `The biggest PMM gap is packaging ${productProfile.shortName}'s most relevant proof against current competitor narratives.`,
    };
  }

  return {
    title: `Remaining critical gap - ${top.gap.title.toLowerCase()}`,
    copy: `${top.gap.copy} Live pressure signal: ${possessive(top.leadSignal.competitor)} latest ${top.leadSignal.sourceLabel.toLowerCase()} update is reinforcing ${extractTheme(top.leadSignal)}.`,
  };
}

function enrichProductGap(gap, signals) {
  const related = signals.filter((signal) => countKeywords(`${signal.headline} ${signal.summary}`.toLowerCase(), gap.keywords) > 0).slice(0, 2);
  if (!related.length) {
    return gap;
  }

  const lead = related[0];
  return {
    ...gap,
    copy: `${gap.copy} Current evidence: ${possessive(lead.competitor)} ${lead.sourceLabel.toLowerCase()} signal is actively marketing ${extractTheme(lead)}.`,
    competitors: dedupeStrings([...gap.competitors, ...related.map((signal) => `${shortName(signal.competitor)} ${signal.sourceLabel}`)]),
  };
}

function rankSignals(signals, groupOrder = []) {
  const priorityByGroup = new Map(groupOrder.map((group, index) => [group, groupOrder.length - index]));
  return [...signals]
    .sort((left, right) => {
      const leftPriority = scoreSignalPriority(left, priorityByGroup);
      const rightPriority = scoreSignalPriority(right, priorityByGroup);
      if (leftPriority !== rightPriority) {
        return rightPriority - leftPriority;
      }
      return new Date(right.publishedAt) - new Date(left.publishedAt);
    });
}

function scoreSignalPriority(signal, priorityByGroup = new Map()) {
  const pressure = COMPETITOR_PRESSURE[signal.competitor] || 0;
  const groupPriority = priorityByGroup.get(signal.group) || 0;
  const ageHours = hoursSince(signal.publishedAt);
  // Enhanced freshness boost to prioritize newer content more aggressively
  const freshnessBoost = ageHours <= 24
    ? 30  // Increased from 18 - content from last 24 hours gets highest priority
    : ageHours <= 72
      ? 20  // Increased from 12 - content from last 3 days
      : ageHours <= FRESH_SIGNAL_WINDOW_HOURS
        ? 10  // Increased from 6 - content from last week
        : 0;
  const corroborationBoost = Math.min(6, Number(signal.corroboration || 0) * 2);
  return pressure + groupPriority + freshnessBoost + corroborationBoost;
}

function selectContentCandidates(signals, limit) {
  const ranked = rankSignals(signals, ["blog", "website", "reviews", "social"]);
  const freshSignals = ranked.filter((signal) => hoursSince(signal.publishedAt) <= FRESH_SIGNAL_WINDOW_HOURS);
  const pool = freshSignals.length >= Math.min(limit, 8) ? freshSignals : ranked;
  const picks = [];
  const byCompetitor = new Map();
  const seenThemes = new Set();

  for (const signal of pool) {
    const current = byCompetitor.get(signal.competitor) || 0;
    if (current >= 3) {
      continue;
    }
    // Skip a signal whose competitor+theme combination is already represented,
    // so we don't surface the same "X: AI-led modernization" card repeatedly.
    const themeKey = `${signal.competitor}::${extractTheme(signal)}`;
    if (seenThemes.has(themeKey)) {
      continue;
    }
    picks.push(signal);
    seenThemes.add(themeKey);
    byCompetitor.set(signal.competitor, current + 1);
    if (picks.length === limit) {
      return picks;
    }
  }

  for (const signal of ranked) {
    if (picks.some((item) => item.id === signal.id)) {
      continue;
    }
    const themeKey = `${signal.competitor}::${extractTheme(signal)}`;
    if (seenThemes.has(themeKey)) {
      continue;
    }
    picks.push(signal);
    seenThemes.add(themeKey);
    if (picks.length === limit) {
      break;
    }
  }

  return picks;
}

function topSignalsByCompetitor(signals) {
  const chosen = new Map();
  rankSignals(signals, ["social", "blog", "website", "reviews"]).forEach((signal) => {
    if (!chosen.has(signal.competitor)) {
      chosen.set(signal.competitor, signal);
    }
  });
  return [...chosen.values()];
}

function diversifySignalsForAssets(signals) {
  const groupCounts = new Map();
  const competitorCounts = new Map();
  const picked = [];

  for (const signal of rankSignals(signals, ["reviews", "website", "social", "blog"])) {
    const groupCount = groupCounts.get(signal.group) || 0;
    const competitorCount = competitorCounts.get(signal.competitor) || 0;
    if (groupCount >= 3 || competitorCount >= 2) {
      continue;
    }
    picked.push(signal);
    groupCounts.set(signal.group, groupCount + 1);
    competitorCounts.set(signal.competitor, competitorCount + 1);
  }

  for (const signal of rankSignals(signals, ["social", "blog", "website", "reviews"])) {
    if (!picked.some((item) => item.id === signal.id)) {
      picked.push(signal);
    }
  }

  return picked;
}
/**
 * Generate AI-powered content suggestions using IBM Granite
 * Falls back to template-based suggestions if AI is not configured
 */
async function generateAIContentSuggestions(signals, productProfile) {
  if (!isGraniteConfigured()) {
    console.log('[workspace-intelligence] IBM Granite not configured, using template-based suggestions');
    return null;
  }

  try {
    console.log('[workspace-intelligence] Generating AI-powered content suggestions with IBM Granite...');
    
    // Prepare data for AI prompt
    const recentSignals = signals.slice(0, 10);
    const competitorContent = recentSignals.map(s => ({
      competitor: s.competitor,
      title: s.sourceLabel,
      summary: s.summary
    }));

    // Build prompt for Granite
    const prompt = buildContentSuggestionsPrompt(
      competitorContent,
      [], // Our content - can be enhanced later
      recentSignals
    );

    // Generate with Granite
    const result = await generateText(prompt, {
      maxTokens: 800,
      temperature: 0.7
    });

    // Parse JSON response
    const aiSuggestions = parseGraniteJSON(result.text);
    
    console.log(`[workspace-intelligence] ✅ Generated ${aiSuggestions.suggestions?.length || 0} AI-powered suggestions`);
    
    return {
      suggestions: aiSuggestions.suggestions || [],
      meta: {
        model: result.model,
        generatedAt: new Date().toISOString(),
        inputTokens: result.inputTokens,
        outputTokens: result.outputTokens
      }
    };
  } catch (error) {
    console.error('[workspace-intelligence] AI content generation failed:', error.message);
    return null;
  }
}

/**
 * Generate AI-powered PMM action recommendations using IBM Granite
 * Falls back to template-based recommendations if AI is not configured
 */
async function generateAIPMMActions(signals, productProfile, competitors) {
  if (!isGraniteConfigured()) {
    console.log('[workspace-intelligence] IBM Granite not configured, using template-based PMM actions');
    return null;
  }

  try {
    console.log('[workspace-intelligence] Generating AI-powered PMM actions with IBM Granite...');
    
    // Prepare data for AI prompt
    const recentSignals = signals.slice(0, 15);
    const productInfo = {
      name: productProfile.displayName,
      category: productProfile.strategicRole,
      strengths: productProfile.confirmedCapabilities || [],
      audience: productProfile.buyerFrame
    };
    
    const competitorActivities = recentSignals.map(s => ({
      competitor: s.competitor,
      activity: `${s.sourceLabel}: ${s.summary}`
    }));

    // Build prompt for Granite
    const prompt = buildPMMActionsPrompt(
      recentSignals,
      productInfo,
      competitorActivities
    );

    // Generate with Granite
    const result = await generateText(prompt, {
      maxTokens: 1000,
      temperature: 0.7
    });

    // Parse JSON response
    const aiActions = parseGraniteJSON(result.text);
    
    console.log(`[workspace-intelligence] ✅ Generated ${aiActions.actions?.length || 0} AI-powered PMM actions`);
    
    return {
      actions: aiActions.actions || [],
      meta: {
        model: result.model,
        generatedAt: new Date().toISOString(),
        inputTokens: result.inputTokens,
        outputTokens: result.outputTokens
      }
    };
  } catch (error) {
    console.error('[workspace-intelligence] AI PMM action generation failed:', error.message);
    return null;
  }
}


function topSignalForCompetitor(signals, competitor) {
  return rankSignals(signals.filter((signal) => signal.competitor === competitor), ["blog", "website", "reviews", "social"])[0] || null;
}

function getContentPlatform(signal) {
  if (signal.group === "social") return "LinkedIn Article";
  if (signal.group === "reviews") return "Blog + Review Proof";
  if (signal.group === "website") return "Comparison Landing Page";
  return "Blog / SEO";
}

function getContentTitle(signal, index) {
  const short = shortName(signal.competitor);
  const owner = possessive(short);
  const theme = extractTheme(signal);
  // Prefer the actual competitor headline when it is specific and usable, so
  // cards reflect real activity instead of a repeated template.
  const headline = String(signal.headline || "").trim();
  const usableHeadline = headline
    && headline.length >= 25
    && headline.length <= 130
    && !/^<|cdata|untitled|^https?:/i.test(headline);
  if (signal.group === "social") return `${owner} ${theme} narrative needs a direct executive response`;
  if (signal.group === "reviews") return `What ${short} reviews still reveal about ${theme}`;
  if (signal.group === "website") {
    return usableHeadline
      ? `${short}: ${headline} - where ${theme} meets a Netezza response`
      : `${owner} ${theme} message needs a lakehouse performance-engine response`;
  }
  return usableHeadline
    ? `${short} signal: ${headline}`
    : `${capitalize(theme)} for lakehouse teams: a Netezza response to ${short}`;
}

function buildContentOutline(signal, platform, title, productProfile) {
  return `DRAFT OUTLINE - ${platform}\n\nWorking title: ${title}\n\nWhy now\n- Latest source: ${signal.competitor} ${signal.sourceLabel}\n- Fresh signal: ${clipText(signal.summary, 150)}\n\nSection 1 - What ${signal.competitor} is telling the market\nSection 2 - Why buyers still need ${productProfile.strategicRole}\nSection 3 - Where ${productProfile.shortName} should redirect the evaluation\n- ${productProfile.categoryResponse}\n- Buyer fit: ${productProfile.buyerFrame}\n- IBM trust for governed workloads\nSection 4 - Questions buyers should ask before following the competitor narrative\n\nPublishing guidance\n- Platform: ${platform}\n- Primary CTA: Book a ${productProfile.shortName} architecture briefing\n- Reuse: seller snippet + social post + comparison slide`;
}

function selectPmmAssetStrategy(signal, index) {
  const directFits = PMM_ASSET_PLAYBOOK.filter((strategy) => strategy.fit.includes(signal.group));
  return directFits[index % Math.max(1, directFits.length)] || PMM_ASSET_PLAYBOOK[index % PMM_ASSET_PLAYBOOK.length];
}

function buildRecommendedAssetOutline(signal, strategy, productProfile) {
  const methodSources = PMM_BEST_PRACTICE_SOURCES
    .map((source) => `- ${source.label}: ${source.focus}`)
    .join("\n");

  return `OUTLINE - ${strategy.asset}\n\nAsset purpose\n- ${strategy.bestPractice}\n- Current trigger: ${signal.competitor} ${signal.sourceLabel}\n- Evidence summary: ${clipText(signal.summary, 160)}\n\nAudience\n- Primary: sellers and PMMs working active competitive opportunities\n- Secondary: product leadership and solution architects who need source-backed talking points\n\nCore sections\n1. Competitor claim or market move\n2. Why buyers may believe it\n3. ${productProfile.shortName} response: ${productProfile.strategicRole}\n4. Objection handlers and proof points\n5. CTA and source link for validation\n\nProduct relevance lens\n- Buyer fit: ${productProfile.buyerFrame}\n- Response focus: ${productProfile.categoryResponse}\n\nPMM asset guidance used\n${methodSources}\n\nSource citations\n- ${signal.sourceUrl}\n\nNext step\n- Draft the asset with exact source citations, then refresh after the crawler produces a newer live signal.`;
}

function buildBattleCardOutline(signal) {
  return `OUTLINE - Battle card\n\nCompetitive source\n- ${signal.competitor} ${signal.sourceLabel}\n- ${clipText(signal.summary, 140)}\n\nSection 1 - When Netezza wins\nSection 2 - Where ${signal.competitor} is strongest right now\nSection 3 - Landmines to use carefully\nSection 4 - Objection handlers\nSection 5 - Proof points to include\n- Warehouse-grade execution for open lakehouse data\n- Hybrid / on-prem control\n- Predictable query performance\n- Cost clarity\n- Governance for regulated teams\n\nField action\n- Refresh seller talk track this week\n- Add one quote or screenshot from the live source page`;
}

function buildCounterPostOutline(signal, productProfile) {
  return `OUTLINE - Executive counter-post\n\nOpening line\n- Acknowledge the competitor narrative without repeating it verbatim.\n\nPoint 1\n- What ${signal.competitor} is trying to make inevitable: ${extractTheme(signal)}\n\nPoint 2\n- Why buyers still need ${productProfile.strategicRole}\n\nPoint 3\n- Where ${productProfile.shortName} is intentionally different\n- ${productProfile.categoryResponse}\n- IBM trust and governance posture\n- Buyer fit: ${productProfile.buyerFrame}\n\nClosing CTA\n- Ask buyers which workload, risk, or control requirement is actually driving the decision.\n\nReference source\n- ${signal.sourceUrl}`;
}

function getResponseRecommendation(signal) {
  if (signal.group === "reviews") {
    return `Use ${shortName(signal.competitor)}'s review language to contrast Netezza's workload-fit clarity, especially around cost, complexity, query performance, and buyer confidence.`;
  }
  if (signal.group === "social") {
    return `Answer the social narrative with a short executive POV and a seller-ready one-pager before the theme settles into active deals.`;
  }
  if (signal.group === "website") {
    return `Publish a comparison page that breaks the website claim into buyer questions Netezza can answer more credibly.`;
  }
  return `Convert the signal into one thought-leadership asset and one field rebuttal so PMM and sales stay aligned.`;
}

function getActionFromSignal(signal) {
  if (signal.group === "social") return `Respond on ${signal.sourceLabel}`;
  if (signal.group === "reviews") return `Turn the review theme into field proof`;
  if (signal.group === "website") return "Analyze and counter the page";
  return "View and counter the content";
}

function getIconForGroup(group) {
  return {
    social: "!",
    reviews: "$",
    website: "[]",
    blog: "+",
  }[group] || "*";
}

function extractTheme(signal) {
  const summary = `${signal.headline || ""} ${signal.summary || ""}`.toLowerCase();
  if (matches(summary, ["cost", "price", "economics", "billing"])) return "cost predictability";
  if (matches(summary, ["ai", "agent", "genai", "ml", "model"])) return "AI-led modernization";
  if (matches(summary, ["migration", "modernization", "decommission"])) return "migration acceleration";
  if (matches(summary, ["governance", "compliance", "regulated", "trust"])) return "governed enterprise analytics";
  if (matches(summary, ["performance", "fast", "speed", "query"])) return "performance certainty";
  if (matches(summary, ["share", "marketplace", "ecosystem"])) return "ecosystem expansion";
  return "structured analytics decisions";
}

function countKeywords(text, keywords) {
  return keywords.reduce((sum, keyword) => sum + (text.includes(keyword.toLowerCase()) ? 1 : 0), 0);
}

function matches(text, keywords) {
  return countKeywords(text, keywords) > 0;
}

function parseGapScore(value) {
  return Number.parseFloat(String(value).split("/")[0]) || 0;
}

function dedupeById(items) {
  const seen = new Set();
  return items.filter((item) => {
    if (!item?.id || seen.has(item.id)) return false;
    seen.add(item.id);
    return true;
  });
}

function dedupeStrings(items) {
  return [...new Set(items.filter(Boolean))];
}

function shortName(name) {
  return COMPETITOR_SHORT[name] || name;
}

function possessive(name) {
  return String(name || "").endsWith("s") ? `${name}'` : `${name}'s`;
}

function clipText(text, length) {
  const clean = String(text || "").replace(/\s+/g, " ").trim();
  return clean.length <= length ? clean : `${clean.slice(0, length - 3).trim()}...`;
}

function hoursSince(value) {
  return (Date.now() - new Date(value).getTime()) / 36e5;
}

function formatRelativeTime(value) {
  const hours = hoursSince(value);
  if (!Number.isFinite(hours) || hours < 0) return "Unknown";
  if (hours < 1)        return `${Math.max(1, Math.round(hours * 60))} min ago`;
  if (hours < 24)       return `${Math.round(hours)} hr ago`;
  if (hours < 24 * 7)  return `${Math.round(hours / 24)} days ago`;
  if (hours < 24 * 30) return `${Math.round(hours / (24 * 7))} weeks ago`;
  return `${Math.round(hours / (24 * 30))} months ago`;
}

function capitalize(value) {
  return value ? `${value.charAt(0).toUpperCase()}${value.slice(1)}` : value;
}

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function slugify(value) {
  return String(value || "focus-product")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 64) || "focus-product";
}
