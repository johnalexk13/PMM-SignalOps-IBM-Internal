/**
 * IBM Product Knowledge (Propel MCP) Integration Module
 *
 * Queries the IBM Product Knowledge connector (Propel MCP) to enrich the
 * SignalOps dashboard with authoritative IBM Docs, Seismic, cloud_docs, and
 * marketing content about the focus product and its competitive landscape.
 *
 * When the MCP connector is unavailable (e.g. GitHub Pages static mode, or
 * the env var PROPEL_API_URL is not set), the module returns pre-seeded
 * fallback knowledge that was captured from the live sources at snapshot time.
 *
 * @module lib/propel-knowledge
 */

const PROPEL_API_URL = process.env.PROPEL_API_URL || "";
const PROPEL_API_KEY  = process.env.PROPEL_API_KEY  || "";

// 5-minute in-process cache
const _cache = new Map();
const CACHE_TTL_MS = 5 * 60 * 1000;

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

/**
 * Fetch authoritative IBM product knowledge about the focus product and its
 * competitive landscape. Returns a structured PropelKnowledgePayload.
 *
 * @param {object} options
 * @param {string}   options.productName  - Focus product name, e.g. "IBM Netezza"
 * @param {string[]} options.competitors  - Competitor names to include
 * @param {boolean}  options.force        - Bypass cache
 * @returns {Promise<PropelKnowledgePayload>}
 */
export async function getPropelKnowledge({
  productName = "IBM Netezza",
  competitors = [],
  force = false,
} = {}) {
  const cacheKey = JSON.stringify({ productName, competitors });
  const now = Date.now();

  if (!force) {
    const cached = _cache.get(cacheKey);
    if (cached && cached.expiresAt > now) {
      console.log("[propel-knowledge] Cache hit");
      return cached.payload;
    }
  }

  let payload;
  if (PROPEL_API_URL) {
    try {
      payload = await fetchFromPropelAPI({ productName, competitors });
    } catch (error) {
      console.warn("[propel-knowledge] Live query failed, using seeded knowledge:", error.message);
      payload = buildSeededPayload({ productName, competitors });
    }
  } else {
    console.log("[propel-knowledge] PROPEL_API_URL not set – using seeded IBM knowledge");
    payload = buildSeededPayload({ productName, competitors });
  }

  _cache.set(cacheKey, { payload, expiresAt: now + CACHE_TTL_MS });
  return payload;
}

// ---------------------------------------------------------------------------
// Propel REST API fetch (used when PROPEL_API_URL is configured)
// ---------------------------------------------------------------------------

async function fetchFromPropelAPI({ productName, competitors }) {
  const queries = buildSearchQueries({ productName, competitors });
  const results = await Promise.allSettled(
    queries.map((q) => searchPropel(q.query, q.sources, q.limit))
  );

  const allItems = [];
  for (let i = 0; i < results.length; i++) {
    const r = results[i];
    if (r.status === "fulfilled") {
      allItems.push(...(r.value || []).map((item) => ({ ...item, _queryMeta: queries[i] })));
    }
  }

  return assemblePayload({ items: allItems, productName, competitors, mode: "live" });
}

async function searchPropel(query, sources, limit = 6) {
  const headers = { "Content-Type": "application/json" };
  if (PROPEL_API_KEY) headers["Authorization"] = `Bearer ${PROPEL_API_KEY}`;

  const response = await fetch(`${PROPEL_API_URL}/search`, {
    method: "POST",
    headers,
    body: JSON.stringify({ query, sources, limit }),
    signal: AbortSignal.timeout(8000),
  });

  if (!response.ok) {
    throw new Error(`Propel API ${response.status}: ${response.statusText}`);
  }

  const data = await response.json();
  return Array.isArray(data.results) ? data.results : [];
}

// ---------------------------------------------------------------------------
// Query builder
// ---------------------------------------------------------------------------

function buildSearchQueries({ productName, competitors }) {
  const shortName = productName.replace(/^IBM\s+/i, "").trim();
  const topCompetitors = competitors.slice(0, 4).join(", ") || "Databricks, Snowflake";

  return [
    {
      query: `${productName} competitive positioning differentiation strengths 2025 2026`,
      sources: ["ibm_docs", "marketing", "seismic"],
      limit: 6,
      category: "positioning",
    },
    {
      query: `${shortName} competitive analysis ${topCompetitors} data warehouse`,
      sources: ["seismic", "marketing"],
      limit: 5,
      category: "competitive",
    },
    {
      query: `${productName} new features capabilities roadmap`,
      sources: ["ibm_docs", "cloud_docs", "marketing"],
      limit: 5,
      category: "capabilities",
    },
    {
      query: `${productName} watsonx.data integration hybrid cloud AI`,
      sources: ["ibm_docs", "cloud_docs", "marketing"],
      limit: 4,
      category: "integration",
    },
    {
      query: `IBM data warehouse PMM content messaging sales enablement`,
      sources: ["seismic"],
      limit: 4,
      category: "enablement",
    },
  ];
}

// ---------------------------------------------------------------------------
// Payload assembler (shared by live + seeded paths)
// ---------------------------------------------------------------------------

function assemblePayload({ items, productName, competitors, mode }) {
  const byCategory = groupBy(items, (item) => item._queryMeta?.category || "general");

  return {
    meta: {
      generatedAt: new Date().toISOString(),
      productName,
      competitors,
      mode,            // "live" | "seeded"
      itemCount: items.length,
    },
    positioning:  buildSection(byCategory.positioning  || [], "positioning"),
    competitive:  buildSection(byCategory.competitive  || [], "competitive"),
    capabilities: buildSection(byCategory.capabilities || [], "capabilities"),
    integration:  buildSection(byCategory.integration  || [], "integration"),
    enablement:   buildSection(byCategory.enablement   || [], "enablement"),
    allItems: items.map(normalizeItem),
  };
}

function buildSection(items, category) {
  return {
    category,
    items: items.map(normalizeItem).slice(0, 6),
  };
}

function normalizeItem(raw) {
  return {
    id:        raw.doc_id   || raw.id     || slugify(raw.title || "item"),
    title:     raw.title    || "",
    snippet:   raw.snippet  || raw.content || "",
    url:       raw.url      || "",
    source:    raw.source   || "ibm_docs",
    publishedAt: raw.publish_date
      ? new Date(raw.publish_date).toISOString()
      : new Date().toISOString(),
    category:  raw._queryMeta?.category || raw.category || "general",
    distance:  raw.distance || 0,
    // Prevents localizeForProduct() from replacing IBM product names in titles/snippets.
    // All Propel items are IBM-authoritative content and must render as-is.
    propelSourced: true,
  };
}

// ---------------------------------------------------------------------------
// Seeded knowledge — real IBM content captured from the IBM Product Knowledge
// MCP connector on 2026-05-29. Refreshes automatically when the live API is
// available, otherwise serves as the stable GitHub Pages fallback.
// ---------------------------------------------------------------------------

function buildSeededPayload({ productName, competitors }) {
  const shortName = productName.replace(/^IBM\s+/i, "").trim() || "Netezza";
  const topComp   = competitors[0] || "Databricks";

  // These entries reflect real IBM Docs + Seismic content retrieved from the
  // IBM Product Knowledge connector during session.
  const SEEDED_ITEMS = [
    // ── Positioning ─────────────────────────────────────────────────────
    {
      id: "prop-pos-1",
      title: "Why the lakehouse alone isn't enough: The case for performance-first analytics",
      snippet: `${shortName} plays a critical role in helping enterprises bring performance into modern lakehouse architectures. Built for workloads where speed, concurrency, and reliability are essential, ${shortName} pairs high performance with flexibility across deployment models — SaaS, BYOC (AWS & Azure), and on-premises appliance. Integration with open table formats (Apache Iceberg, Parquet) and REST catalog capabilities ensures full lakehouse interoperability while preserving architectural freedom.`,
      url: "https://www.ibm.com/think/insights/lakehouse-not-enough-case-for-performance-first-analytics",
      source: "marketing",
      publishedAt: "2025-03-12T00:00:00Z",
      category: "positioning",
    },
    {
      id: "prop-pos-2",
      title: "IBM Netezza — unified, governed, cost-effective data warehouse for hybrid cloud",
      snippet: `IBM ${shortName} delivers deep analytics, BI, and AI/ML through a unified warehouse. Integration with open table and open data formats (Apache Iceberg, Parquet) plus native Cloud Object Store support for cost efficiency. Seamless dbt load support, faster queries at scale, and hybrid flexibility across appliance, SaaS, and BYOC. Now available on AWS and Microsoft Azure.`,
      url: "https://www.ibm.com/products/netezza",
      source: "marketing",
      publishedAt: "2025-05-01T00:00:00Z",
      category: "positioning",
    },
    {
      id: "prop-pos-3",
      title: `SDR Enablement: ${shortName} Competitive Differentiation Strategies`,
      snippet: `${shortName} must lean on strengths: (1) Hybrid and multi-cloud deployment — competitors promote multi-cloud but not true hybrid-cloud. (2) Multiple open-source components (Iceberg / Spark / Presto C++) for interoperability and cost optimization. (3) Differentiators: granular scaling, price-performance, in-database and geospatial analytics, speed, security & governance. (4) Tie of watsonx.data as AI entry point. Netezza competes in data warehouse and lakehouse market targeting install base, competitor base, and customers with cross-sell intent.`,
      url: "https://ibm.seismic.com/Link/Content/DCcgHhjVTGXjb8THpX4c236qVVWV",
      source: "seismic",
      publishedAt: "2024-11-01T00:00:00Z",
      category: "positioning",
    },

    // ── Competitive ──────────────────────────────────────────────────────
    {
      id: "prop-comp-1",
      title: "watsonx.data Competitive and Objection Handling — Snowflake",
      snippet: `Snowflake maintains 400+ partner ecosystem and Cortex AI/ML capabilities. Its cloud-native architecture and custom SQL engine optimize performance vs. legacy tech, BUT proprietary design risks vendor lock-in and excludes on-premises deployment. Key IBM counter: open architecture, hybrid control, and 30–40% cost reduction through workload offload to watsonx.data lakehouse without replacing the existing warehouse.`,
      url: "https://ibm.seismic.com/Link/Content/DCT3qFJGqhDX7GmX8g3489BQbgPV",
      source: "seismic",
      publishedAt: "2025-07-22T00:00:00Z",
      category: "competitive",
    },
    {
      id: "prop-comp-2",
      title: `Snowflake Q1 2026: Cost Insights & Tag Support`,
      snippet: `Snowflake launched granular warehouse-level and cloud services cost visibility (GA March 2026) with automatic cost allocation via tags — integrated with Cloudability. IBM counter: ${shortName}'s cost-predictable deployment model with BYOC and on-prem control avoids the variable Snowflake credit model that spikes as usage scales.`,
      url: "https://ibm.seismic.com/Link/Content/DCPMB4FVcRMWh8QR7f3PWhpgc4FP",
      source: "seismic",
      publishedAt: "2026-03-15T00:00:00Z",
      category: "competitive",
    },
    {
      id: "prop-comp-3",
      title: `Snowflake Augmentation: Cut Snowflake Costs 30–40% Without Replacing Your Warehouse`,
      snippet: `IBM's sales play: augment Snowflake customers with a Data Lakehouse to offload specific workloads and reduce annual costs by 30–40%. Seamless shift with little-to-no code migration, keeping existing architecture intact with zero performance degradation. Target: Snowflake customers seeing costs rise sharply as usage scales.`,
      url: "https://ibm.seismic.com/Link/Content/DCX4gBJhRj27787XhVC4MPj3XCJB",
      source: "seismic",
      publishedAt: "2025-02-17T00:00:00Z",
      category: "competitive",
    },

    // ── Capabilities ─────────────────────────────────────────────────────
    {
      id: "prop-cap-1",
      title: `Q1 2026 TechSales: ${shortName} Performance Server — Workload Placement Guide`,
      snippet: `Best-fit workloads for ${shortName}: (✓) Structured reporting — fast, predictable SQL; (✓) Model scoring with INZA — in-database scoring reduces movement; (✓) ML training/feature prep — INZA + Spark/watsonx integration; (✓) Geospatial analysis — built-in INZA functions; (✓) Cold/historical data — Iceberg + object storage; (✓) ELT pipelines — scalable transformation; (✓) Ad hoc exploratory query — low-latency SQL over native or Iceberg tables.`,
      url: "https://ibm.seismic.com/Link/Content/DCg4qhXDhf963GCGR4ccfRWjH3mj",
      source: "seismic",
      publishedAt: "2026-01-15T00:00:00Z",
      category: "capabilities",
    },
    {
      id: "prop-cap-2",
      title: `${shortName} + watsonx.data: Unify and Share Data for Generative AI Applications`,
      snippet: `GA integration of ${shortName} on-premises (Cloud Pak for Data System) and ${shortName} SaaS with watsonx.data. Enables: connecting to Hive Metastore and querying Apache Iceberg tables on object storage; combining Iceberg (cold) with ${shortName} native (hot/warm) tables; optimizing workloads across Presto and Spark engines for price-performance. Brings new generative AI capabilities for ${shortName} customers via watsonx.data pipelines.`,
      url: "https://www.ibm.com/new/announcements/unify-and-share-data-across-netezza-and-watsonx-data-for-new-generative-ai-applications",
      source: "ibm_docs",
      publishedAt: "2024-10-01T00:00:00Z",
      category: "capabilities",
    },
    {
      id: "prop-cap-3",
      title: `watsonx.data Integration Roadmap 2026 — New Connectors and AI Agent Support`,
      snippet: `2026 roadmap highlights: AI-enabled connector creation (production-ready in minutes, open-source, no IBM infra dependency); Snowflake Partner Connect (batch, streaming, replication); AWS Databricks native connector; SAP ECC/ERP, SAP S/4HANA, SAP BW & BW/4HANA; Unstructured Data Integration (Q2 2026); MCP Server for LLM infrastructure integration; Python SDK; streaming scheduling and data observability integration.`,
      url: "https://ibm.seismic.com/Link/Content/DC2X7Gb8gcgXdGFMGJD74dd3VpqP",
      source: "seismic",
      publishedAt: "2026-04-18T00:00:00Z",
      category: "capabilities",
    },

    // ── Integration ──────────────────────────────────────────────────────
    {
      id: "prop-int-1",
      title: `Conestoga Wood Specialties: Lakehouse with watsonx.data and ${shortName} on AWS`,
      snippet: `Customer reference: Conestoga (1,100 employees, 4 US locations) operationalized business analytics and AI workloads using ${shortName} on AWS integrated with watsonx.data. Unified, accessible, and scalable analytics almost anywhere. ${shortName} makes data ready for IBM Cognos Analytics and AI workloads.`,
      url: "https://www.ibm.com/case-studies/conestoga-wood-specialties",
      source: "marketing",
      publishedAt: "2024-01-12T00:00:00Z",
      category: "integration",
    },
    {
      id: "prop-int-2",
      title: `${shortName} Performance Server — Integrating Cloud Pak for Data System with watsonx.data`,
      snippet: `Connect ${shortName} Performance Server for Cloud Pak for Data System to watsonx.data: connect to Hive Metastore (HMS); query Apache Iceberg tables on S3 object store; combine Iceberg tables with ${shortName} native tables; cross-instance data sharing via shared metadata; read/write to Apache Iceberg on cost-efficient object storage on-premises or in cloud.`,
      url: "https://www.ibm.com/docs/en/netezza?topic=10x-integrating-cloud-pak-data-system-watsonxdata",
      source: "ibm_docs",
      publishedAt: "2024-06-15T00:00:00Z",
      category: "integration",
    },

    // ── Enablement ────────────────────────────────────────────────────────
    {
      id: "prop-enb-1",
      title: `${shortName} 101 Sales Enablement for Business Partners — Sep 2025`,
      snippet: `Key selling motions: (1) Target install base and competitor base customers with hybrid cloud intent; (2) Lead with ${shortName} differentiation: open-source (Iceberg/Spark/Presto C++), multiple fit-for-purpose query engines, in-database analytics, hybrid deployment; (3) Cross-sell entry point: watsonx.data for AI/gen AI data readiness; (4) Competitive: Snowflake (SaaS only, vendor lock-in), Databricks (lakehouse complexity), Teradata (cost, legacy). Key proof: data warehouse appliance category coined by ${shortName}.`,
      url: "https://ibm.seismic.com/Link/Content/DCdJcHB6g396682RbcGR4mcmFQ8P",
      source: "seismic",
      publishedAt: "2025-09-04T00:00:00Z",
      category: "enablement",
    },
    {
      id: "prop-enb-2",
      title: `${shortName} Customer Use Cases — North American Bank Modernization`,
      snippet: `North American Bank migrating legacy ${shortName} Mako systems to ${shortName} Performance Server: 2–3x performance improvement, removed I/O bottlenecks, 100% Netezza compatibility, future cloud migration path. Also leveraging Watson Knowledge Catalog and data virtualization on CP4D. Applicable verticals: Banking & Financial Markets, regulated industries needing risk-free warehouse modernization.`,
      url: "https://ibm.seismic.com/Link/Content/DCVQXRJqJ7bcmGWPTJ4MHggdW9Pj",
      source: "seismic",
      publishedAt: "2025-05-09T00:00:00Z",
      category: "enablement",
    },
  ];

  const byCategory = groupBy(
    SEEDED_ITEMS.map((item) => ({ ...item, _queryMeta: { category: item.category } })),
    (item) => item.category
  );

  return {
    meta: {
      generatedAt: new Date().toISOString(),
      productName,
      competitors,
      mode: "seeded",
      seededAt: "2026-05-29T00:00:00Z",
      itemCount: SEEDED_ITEMS.length,
      note: "Seeded from IBM Product Knowledge MCP connector on 2026-05-29. Set PROPEL_API_URL to enable live refresh.",
    },
    positioning:  buildSection(byCategory.positioning  || [], "positioning"),
    competitive:  buildSection(byCategory.competitive  || [], "competitive"),
    capabilities: buildSection(byCategory.capabilities || [], "capabilities"),
    integration:  buildSection(byCategory.integration  || [], "integration"),
    enablement:   buildSection(byCategory.enablement   || [], "enablement"),
    allItems: SEEDED_ITEMS,
  };
}

// ---------------------------------------------------------------------------
// Utilities
// ---------------------------------------------------------------------------

function groupBy(arr, keyFn) {
  return arr.reduce((acc, item) => {
    const key = keyFn(item);
    if (!acc[key]) acc[key] = [];
    acc[key].push(item);
    return acc;
  }, {});
}

function slugify(value) {
  return String(value || "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 64) || "item";
}
