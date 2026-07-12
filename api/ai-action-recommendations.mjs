/**
 * Propel-Powered PMM Action Recommendations API
 *
 * Derives prioritized PMM actions from IBM Product Knowledge (Propel MCP).
 * Uses the enablement, competitive, and positioning sections of the Propel
 * payload to produce actionable recommendations — no Granite / LLM required.
 * Works with seeded knowledge when PROPEL_API_URL is not set.
 *
 * Response shape is identical to the previous Granite implementation so the
 * dashboard UI requires no changes.
 *
 * @module api/ai-action-recommendations
 */

import { getPropelKnowledge } from "../lib/propel-knowledge.mjs";

// 5-minute in-process cache
const cache = new Map();
const CACHE_TTL = 5 * 60 * 1000;

// Priority scores by Propel source category
const PRIORITY_BY_CATEGORY = {
  enablement: 9,
  competitive: 8,
  positioning: 8,
  capabilities: 7,
  integration: 6,
};

// Effort and impact heuristics by source category
const EFFORT_BY_CATEGORY = {
  enablement: "Low",
  competitive: "Medium",
  positioning: "Medium",
  capabilities: "High",
  integration: "High",
};

const IMPACT_BY_CATEGORY = {
  enablement: "High",
  competitive: "High",
  positioning: "High",
  capabilities: "Medium",
  integration: "Medium",
};

// What kind of assets each category drives
const ASSETS_BY_CATEGORY = {
  enablement: ["Sales enablement deck", "Battle card", "Objection-handling cheat sheet", "Partner brief"],
  competitive: ["Competitive comparison guide", "TCO calculator", "Win/loss one-pager", "Displacement playbook"],
  positioning: ["Messaging framework", "Positioning one-pager", "Executive talk track", "Campaign landing page"],
  capabilities: ["Technical whitepaper", "Demo video", "Feature comparison matrix", "Solution brief"],
  integration: ["Integration guide", "Architecture diagram", "Reference architecture", "Customer case study"],
};

/**
 * Derive PMM actions from a Propel knowledge payload.
 *
 * Strategy:
 *  - enablement items  → highest-priority seller-ready actions (use now)
 *  - competitive items → counter-competitor actions
 *  - positioning items → messaging and campaign actions
 *  - capabilities items → technical content actions
 *
 * @param {object} propel - PropelKnowledgePayload from getPropelKnowledge()
 * @returns {Array} Array of action objects
 */
function derivePMMActions(propel) {
  const actions = [];

  const sections = [
    { key: "enablement",  label: "Activate seller content",        items: propel.enablement?.items  || [] },
    { key: "competitive", label: "Counter competitor messaging",    items: propel.competitive?.items || [] },
    { key: "positioning", label: "Reinforce IBM positioning",       items: propel.positioning?.items || [] },
    { key: "capabilities",label: "Publish capability content",      items: propel.capabilities?.items|| [] },
  ];

  for (const section of sections) {
    for (const item of section.items.slice(0, 2)) {
      const category = item.category || section.key;
      actions.push({
        action: `${section.label}: ${item.title}`,
        rationale: item.snippet
          ? item.snippet.substring(0, 220).trimEnd() + "…"
          : `This ${category} insight from IBM authoritative sources requires a corresponding PMM action.`,
        audience: audienceFor(category),
        impact: IMPACT_BY_CATEGORY[category] || "Medium",
        effort: EFFORT_BY_CATEGORY[category] || "Medium",
        priority: PRIORITY_BY_CATEGORY[category] || 7,
        assets: ASSETS_BY_CATEGORY[category] || ["One-pager", "Slide deck"],
        source: item.source,
        sourceUrl: item.url,
        propelSourced: true,
      });
    }
  }

  // Sort by priority descending, then limit to top 8
  return actions.sort((a, b) => b.priority - a.priority).slice(0, 8);
}

function audienceFor(category) {
  const map = {
    enablement:   "Sales reps, SDRs, and business partners",
    competitive:  "Sellers handling competitive displacement deals",
    positioning:  "Marketing, demand gen, and executive stakeholders",
    capabilities: "Technical buyers, architects, and data engineers",
    integration:  "Enterprise architects and IT leaders",
  };
  return map[category] || "PMM and sales teams";
}

async function getPropelPMMActions({ productName, competitors, force } = {}) {
  const cacheKey = JSON.stringify({ productName, competitors, type: "actions" });

  if (!force && cache.has(cacheKey)) {
    const cached = cache.get(cacheKey);
    if (Date.now() - cached.timestamp < CACHE_TTL) {
      console.log("[ai-action-recommendations] Cache hit");
      return { ...cached.data, metadata: { ...cached.data.metadata, cached: true } };
    }
  }

  const propel = await getPropelKnowledge({ productName, competitors, force });
  const actions = derivePMMActions(propel);

  const result = {
    actions,
    metadata: {
      model: "propel-knowledge",
      mode: propel.meta?.mode || "seeded",
      source: "IBM Product Knowledge (Propel MCP)",
      timestamp: propel.meta?.generatedAt || new Date().toISOString(),
      itemCount: propel.meta?.itemCount || 0,
      cached: false,
      propelSourced: true,
    },
  };

  cache.set(cacheKey, { data: result, timestamp: Date.now() });
  console.log(`[ai-action-recommendations] Derived ${actions.length} actions from Propel (mode: ${propel.meta?.mode})`);
  return result;
}

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "GET") return res.status(405).json({ error: "Method not allowed" });

  try {
    const url = new URL(req.url, `http://${req.headers.host}`);
    const force = url.searchParams.has("refresh");
    const productName = url.searchParams.get("product") || "IBM Netezza";

    let competitors = [];
    const competitorsParam = url.searchParams.get("competitors");
    if (competitorsParam) {
      try { competitors = JSON.parse(competitorsParam); } catch {
        return res.status(400).json({ error: "Invalid competitors parameter" });
      }
    }

    console.log(`[ai-action-recommendations] Request: product=${productName}, competitors=${competitors.length}, force=${force}`);
    const result = await getPropelPMMActions({ productName, competitors, force });
    return res.status(200).json(result);
  } catch (error) {
    console.error("[ai-action-recommendations] Error:", error);
    return res.status(500).json({ error: "Failed to generate PMM action recommendations", message: error.message });
  }
}

// Made with IBM Bob
