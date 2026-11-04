## November 2026 reliability and saved insights update

- PMM cards now cover every configured competitor and contain downloadable first drafts. Content suggestions include filled copy, source notes and review requirements.
- All 11 pages provide **Save snapshot**, **History**, **Download Markdown** and **Download JSON**. Successful insight refreshes are archived automatically. Downloads include full drafts even when cards are collapsed. Manage exports include saved settings and document names, not credentials or uploaded file contents.
- History belongs to the current browser profile and product. Up to 10 versions per page are retained within a 1.2 MB text budget per product. Under browser quota pressure only the latest version per page is persisted; download important versions for long-term storage. Clearing browser storage removes local history. This is not cloud synchronization or a configuration-restore feature.
- Refresh requests have timeouts, a transient-error retry and shared in-flight requests. Failures preserve the last good market/insight snapshot. Capability evidence and knowledge metadata now survive reload. Static-host snapshots are accepted only when product and competitor scope match and there is no saved insight snapshot.
- Community search validates keywords in each returned result, uses direct HN discussion links and searches configured DBA/Stack Overflow/GitHub sources through their APIs. Per-source status distinguishes matches, no matches, failures, cached results and manual searches. LinkedIn/X require manual review.

Targeted verification: `npm test` (Node's built-in test runner; no new dependencies). Run locally with `npm start`.

---

# SignalOps: Market & Community Intelligence Platform

This workspace contains a clean internal SignalOps starter package for colleagues to run locally and create their own product intelligence workspace.

- competitive intelligence
- community intelligence
- content and PMM suggestion workflows
- simplified product, competitor, keyword, and community-link management

This package intentionally does not include a seeded personal profile, password, saved product workspace, or pre-signed-in session.

It can run in two modes:

- `Local live mode`: served by `server.mjs` on `http://localhost:3002`
- `GitHub Pages snapshot mode`: served as a static site for stakeholders

## Project files

- `index.html`: dashboard shell
- `styles.css`: layout and visual system
- `dashboard.js`: rendering, refresh, workspace switching, and data loading
- `server.mjs`: local server for localhost use
- `workspace-intelligence.mjs`: live payload generation
- `build/generate-stakeholder-snapshot.mjs`: builds the GitHub-shareable snapshot JSON
- `data/workspace-intelligence.json`: generated static snapshot used on GitHub Pages
- `Launch SignalOps Dashboard.command`: one-click local launcher

## How the hosted GitHub version works

When the dashboard runs on GitHub Pages, there is no Node server and no `/api/workspace-intelligence` endpoint.

To support that, the frontend now behaves like this:

1. It first tries the live local API.
2. If that API is unavailable, it falls back to `./data/workspace-intelligence.json`.
3. That JSON file is the stakeholder snapshot you generate before publishing.

This means:

- `localhost` can still use the richer local/live flow
- GitHub Pages can show a stable stakeholder-ready snapshot
- stakeholders do not need Node, Terminal, or localhost access

## Local run

From this folder:

```bash
node server.mjs
```

Then open:

```text
http://localhost:3002
```

Or use:

- `Launch SignalOps Dashboard.command`

## First-time colleague setup

When a colleague opens the app for the first time:

1. Click `Sign up`.
2. Create their own local profile with their email and password.
3. Open `Manage`.
4. Add their focus product.
5. In Competitive Intelligence Manage, add the focus product name, product page URL, and primary buyer.
6. Add competitor webpage links. SignalOps generates the source bundle automatically.
7. In Community Intelligence Manage, add focus keywords and community links.
8. Save the product workspace.

New profiles start with an empty workspace by design. Each person’s profile, focus products, generated source bundle, competitor links, community links, and local crawler snapshots are stored in that person’s browser local storage.

## Account workspace links

Account links are optional. For this internal GitHub package, the recommended flow is to let each colleague sign up locally and add their own products from `Manage`.

If you later choose to share account links, the `account` value keeps saved workspace data separate in the browser and the `products` value controls which preset focus products appear in that person's Product Library.

## Generate the stakeholder snapshot

Before publishing to GitHub, generate a fresh snapshot:

```bash
node build/generate-stakeholder-snapshot.mjs
```

Or:

```bash
npm run snapshot
```

This updates:

- `data/workspace-intelligence.json`

## Publish to GitHub Pages

1. Create a new GitHub repository.
2. Upload or push this project folder to the repository.
3. Generate a fresh snapshot before pushing:

```bash
node build/generate-stakeholder-snapshot.mjs
```

4. In GitHub, open:
   `Settings` -> `Pages`
5. Under `Build and deployment`, choose:
   - `Source`: `Deploy from a branch`
   - `Branch`: `main`
   - `Folder`: `/ (root)`
6. Save the settings.
7. GitHub will publish the site and give you a public Pages URL.

## How to refresh stakeholder content later

Whenever you want stakeholders to see newer insights:

1. Run:

```bash
node build/generate-stakeholder-snapshot.mjs
```

2. Commit the updated `data/workspace-intelligence.json`
3. Push to GitHub

That republishes the hosted snapshot with the latest generated content.

## Important note about freshness

The GitHub-hosted version is a published snapshot, not a true server-backed live app.

That means:

- the UI still auto-refreshes in the browser
- but the hosted content only changes when you regenerate and push a new snapshot

For fully live stakeholder sharing, Netlify or another Node/serverless host would still be the better fit.

## Recommended sharing model

Use:

- `GitHub Pages` for easy stakeholder viewing and broad sharing
- `localhost` for your own working version
- `Netlify` or `Vercel` if you want always-live hosted data refresh

## Git-connected Netlify and Vercel deploys

This folder is ready to deploy as the project root on both Netlify and Vercel.

If the GitHub repository contains this folder as a subfolder, set the platform root/base directory to:

```text
SignalOps-Github-IBM-Internal
```

If you upload this folder's contents directly to the GitHub repository root, leave the platform root/base directory blank.

Netlify settings:

```text
Base directory: SignalOps-Github-IBM-Internal
Build command: npm run build
Publish directory: .
Functions directory: netlify/functions
```

Vercel settings:

```text
Root Directory: SignalOps-Github-IBM-Internal
Framework Preset: Other
Build Command: npm run build
Output Directory: .
```

The shared API URLs are:

```text
/api/workspace-intelligence
/api/market-signals
/api/community-signals
```

## Better real-time hosting alternative: Render

If you need the live API-driven version instead of a static snapshot, `Render` is the simplest alternative to Netlify for this project.

Why Render fits this app:

- it runs `server.mjs` as a real Node web service
- it supports public shareable URLs
- it preserves `/api/workspace-intelligence` and `/api/market-signals`
- it does not require converting this app into GitHub Pages or Cloudflare Workers first

Important free-plan note:

- Render Free web services spin down after 15 minutes of inactivity and can take about a minute to wake back up

That is usually acceptable for stakeholder review, but it is not ideal for a polished production experience.
