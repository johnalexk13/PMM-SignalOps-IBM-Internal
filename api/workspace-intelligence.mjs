import { getWorkspaceIntelligence } from "../workspace-intelligence.mjs";
import { readWorkspaceRequest } from "../lib/workspace-request.mjs";

export const config = { maxDuration: 60 };

export default async function handler(request, response) {
  response.setHeader("Cache-Control", "no-store");
  if (!["GET", "POST"].includes(request.method)) {
    response.setHeader("Allow", "GET, POST");
    return response.status(405).json({ error: "Method not allowed" });
  }
  try {
    response.status(200).json(await getWorkspaceIntelligence(await readWorkspaceRequest(request)));
  } catch (error) {
    response.status(error.status || 500).json({ error: error.status ? error.message : "Workspace refresh failed. Retry; your saved snapshot is unchanged." });
  }
}
