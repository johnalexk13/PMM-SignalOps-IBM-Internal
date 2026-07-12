/**
 * Propel-Powered Content Suggestions API
 *
 * Derives content gap suggestions from IBM Product Knowledge (Propel MCP).
 * Uses the capabilities, positioning, and competitive sections of the Propel
 * payload to surface what IBM should be saying in content — no Granite / LLM
 * required.  Works with seeded knowledge when PROPEL_API_URL is not set.
 *
 * Response shape is identical to the previous Granite implementation so the
 * dashboard UI requires no changes.
 *
 * @module api/ai-content-suggestions
 */

import { getPropelKnowledge } from "../lib/propel-knowledge.mjs";

// 5-minute in-process cache
const cache = new Map();
const CACHE_TTL = 5 * 60 * 1000;

/**
 * Derive content suggestions from a Propel knowledge payload.
 *
 * Strategy:
 *  - capabilities items  → "showcase IBM capability" content ideas
 *  - positioning items   → "reinforce IBM differentiation" content ideas
 *  - competitive items   → "counter competitor narrative" content ideas
 *
 * @param {object} propel - PropelKnowledgePayload from getPropelKnowledge()
 * @returns {Array} Array of suggestion objects
 */
function deriveContentSuggestions(propel) {
  const suggestions = [];

  // ── Capabilities → content that showcases what IBM can do ──────────────────
  for (const item of (propel.capabilities?.items || []).slice(0, 2)) {
    suggestions.push({
      topic: `${item.title}`,
      audience: "Data engineers, architects, and technical evaluators",
      differentiators: extractKeyPoints(item.snippet),
      format: "Technical deep-dive article or demo video",
      priority: "High",
      rationale: item.snippet
        ? item.snippet.substring(0, 200).trimEnd() + "…"
        : "IBM capability content is needed to address technical evaluation criteria.",
      source: item.source,
      sourceUrl: item.url,
      propelSourced: true,
    });
  }

  // ── Positioning → content that reinforces IBM differentiation ──────────────
  for (const item of (propel.positioning?.items || []).slice(0, 2)) {
    suggestions.push({
      topic: `Positioning brief: ${item.title}`,
      audience: "Enterprise buyers and executive decision-makers",
      differentiators: extractKeyPoints(item.snippet),
      format: "Executive one-pager or thought leadership blog",
      priority: "High",
      rationale: item.snippet
        ? item.snippet.substring(0, 200).trimEnd() + "…"
        : "Positioning content helps buyers understand IBM's unique angle vs. competitors.",
      source: item.source,
      sourceUrl: item.url,
      propelSourced: true,
    });
  }

  // ── Competitive → content that counters competitor narratives ──────────────
  for (const item of (propel.competitive?.items || []).slice(0, 2)) {
    suggestions.push({
      topic: `Counter-narrative: ${item.title}`,
      audience: "Sales teams and prospects evaluating alternatives",
      differentiators: extractKeyPoints(item.snippet),
      format: "Battle card or comparison guide",
      priority: "Medium",
      rationale: item.snippet
        ? item.snippet.substring(0, 200).trimEnd() + "…"
        : "Competitive content equips sellers to handle objections and win evaluations.",
      source: item.source,
      sourceUrl: item.url,
      propelSourced: true,
    });
  }

  return suggestions;
}

/** Pull up to 3 distinct key phrases from a snippet for the differentiators array. */
function extractKeyPoints(snippet = "") {
  const sentences = snippet
    .replace(/\(.*?\)/g, "")
    .split(/[;•\n]/)
    .map((s) => s.trim())
    .filter((s) => s.length > 20 && s.length < 120);
  return sentences.slice(0, 3).length > 0
    ? sentences.slice(0, 3)
    : ["IBM open architecture", "Hybrid cloud flexibility", "Enterprise-grade performance"];
}

async function getPropelContentSuggestions({ productName, competitors, force } = {}) {
  const cacheKey = JSON.stringify({ productName, competitors, type: "content" });

  if (!force && cache.has(cacheKey)) {
    const cached = cache.get(cacheKey);
    if (Date.now() - cached.timestamp < CACHE_TTL) {
      console.log("[ai-content-suggestions] Cache hit");
      return { ...cached.data, metadata: { ...cached.data.metadata, cached: true } };
    }
  }

  const propel = await getPropelKnowledge({ productName, competitors, force });
  const suggestions = deriveContentSuggestions(propel);

  const result = {
    suggestions,
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
  console.log(`[ai-content-suggestions] Derived ${suggestions.length} suggestions from Propel (mode: ${propel.meta?.mode})`);
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

    console.log(`[ai-content-suggestions] Request: product=${productName}, competitors=${competitors.length}, force=${force}`);
    const result = await getPropelContentSuggestions({ productName, competitors, force });
    return res.status(200).json(result);
  } catch (error) {
    console.error("[ai-content-suggestions] Error:", error);
    return res.status(500).json({ error: "Failed to generate content suggestions", message: error.message });
  }
}

// Made with IBM Bob
