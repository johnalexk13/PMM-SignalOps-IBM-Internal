export const HISTORY_LIMIT = 10;
export const HISTORY_BUDGET = 1200000;

export function appendHistory(history, entry) {
  const current = Array.isArray(history) ? history : [];
  const previous = current.find((item) => item.pageId === entry.pageId);
  if (previous?.text === entry.text) return current;
  const counts = new Map();
  let size = 0;
  return [entry, ...current].filter((item) => {
    const count = (counts.get(item.pageId) || 0) + 1;
    counts.set(item.pageId, count);
    size += JSON.stringify(item).length;
    return count <= HISTORY_LIMIT && size <= HISTORY_BUDGET;
  });
}

export function snapshotFilename(entry, extension = "md") {
  const slug = `${entry.productName}-${entry.pageTitle}`.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
  return `${slug || "signalops"}-${entry.createdAt.replace(/[:.]/g, "-")}.${extension}`;
}

export function snapshotMarkdown(entry) {
  return `# ${entry.pageTitle}\n\nProduct: ${entry.productName}\nSaved: ${entry.createdAt}\n\n${entry.text}\n`;
}

export async function fetchJson(url, options = {}, { timeoutMs = 45000, retries = 1, fetchImpl = fetch } = {}) {
  for (let attempt = 0; ; attempt += 1) {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeoutMs);
    try {
      const response = await fetchImpl(url, { ...options, signal: controller.signal });
      if (!response.ok) {
        const error = new Error(`Refresh request failed (${response.status})`);
        error.status = response.status;
        throw error;
      }
      if (!(response.headers.get("content-type") || "").includes("application/json")) throw new Error("Refresh returned an invalid response");
      return await response.json();
    } catch (error) {
      if (attempt >= retries || (error.status && error.status < 500 && error.status !== 429)) throw error;
    } finally {
      clearTimeout(timer);
    }
  }
}

export function validateWorkspacePayload(payload, productId) {
  if (!payload?.sections || !Array.isArray(payload?.marketFeed?.items)) throw new Error("Incomplete workspace response");
  if (payload.meta?.focusProduct?.id !== productId) throw new Error("Response belongs to a different product");
  return payload;
}
