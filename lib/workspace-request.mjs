export async function readWorkspaceRequest(request) {
  let body = {};
  if (request.method === "POST") {
    if (request.body && typeof request.body === "object") body = request.body;
    else {
      let raw = typeof request.body === "string" ? request.body : "";
      if (!raw) for await (const chunk of request) {
        raw += chunk;
        if (Buffer.byteLength(raw) > 1500000) throw Object.assign(new Error("Request too large"), { status: 413 });
      }
      try { body = raw ? JSON.parse(raw) : {}; }
      catch { throw Object.assign(new Error("Invalid JSON request"), { status: 400 }); }
    }
  }
  const params = { ...Object.fromEntries(new URL(request.url, "http://localhost").searchParams), ...body };
  let competitors = params.competitors || [];
  if (typeof competitors === "string") {
    try { competitors = JSON.parse(competitors); }
    catch { throw Object.assign(new Error("Invalid competitors"), { status: 400 }); }
  }
  if (!Array.isArray(competitors)) throw Object.assign(new Error("Competitors must be a list"), { status: 400 });
  return {
    force: Boolean(params.refresh), competitors: competitors.slice(0, 20),
    documents: Array.isArray(params.documents) ? params.documents.slice(0, 8) : [],
    product: { id: params.productId || "", displayName: params.productName || "", productName: params.fullProductName || params.productName || "", shortName: params.shortName || "", description: params.description || "", primaryBuyer: params.primaryBuyer || "", productUrl: params.productUrl || "" },
  };
}
