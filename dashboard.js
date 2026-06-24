const LEGACY_STORAGE_KEY = "ibm-netezza-product-marketing-insights-v1";
const STORAGE_KEY_PREFIX = "signalops-internal-product-marketing-insights-v1";
const AUTH_USERS_KEY = "signalops-internal-auth-users-v1";
const AUTH_SESSION_KEY = "signalops-internal-auth-session-v1";

const COMPETITOR_NAME_ALIASES = {
  databricks: "Databricks",
  snowflake: "Snowflake",
  bigquery: "Google BigQuery",
  "google bigquery": "Google BigQuery",
  google: "Google BigQuery",
  gcp: "Google BigQuery",
  redshift: "Amazon Redshift",
  "amazon redshift": "Amazon Redshift",
  amazon: "Amazon Redshift",
  aws: "Amazon Redshift",
  synapse: "Azure Synapse",
  "azure synapse": "Azure Synapse",
  azure: "Azure Synapse",
  teradata: "Teradata",
  yellowbrick: "Yellowbrick",
  "yellowbrick data": "Yellowbrick",
  pega: "Pega",
  appian: "Appian",
  opentext: "Opentext",
};
const DOCUMENT_PERSIST_BUDGET_CHARS = 1500000;
const EVIDENCE_STATUS_TO_ICON = { claimed: "strong", reported: "partial", "not-detected": "gap", unknown: "partial" };
const EVIDENCE_STATUS_LABEL = {
  claimed: "Claimed publicly on vendor page",
  reported: "Reported in recent news coverage",
  "not-detected": "Not detected on scanned page",
  unknown: "Page not reachable - no evidence yet",
};

const AUTH_PASSWORD_SALT = "signalops-internal-demo:v1";
const SEEDED_USER_EMAIL = "";
const SEEDED_USER_PASSWORD_HASH = "";
const MARKET_REFRESH_INTERVAL_MS = 5 * 60 * 1000;
const COMMUNITY_REFRESH_INTERVAL_MS = 5 * 60 * 1000;
const MAX_DOCUMENT_SOURCE_SIZE_BYTES = 2 * 1024 * 1024;
const STATIC_WORKSPACE_INTELLIGENCE_ENDPOINT = "./data/workspace-intelligence.json";
const PMM_PAGE_IDS = ["overview", "content", "events", "market", "product", "positioning", "manage"];
const COMMUNITY_PAGE_IDS = ["community-announcements", "community-thought-leadership", "community-replies", "community-manage"];

const SECTION_CONFIG = {
  pmm: {
    title: "Competitive Intelligence",
    eyebrow: "",
    headerTitle: "SignalOps: Market & Community Intelligence Platform",
    headerCopy: "Compare Netezza with the competitor set, curate source feeds, and turn market activity into content, PMM asset, product, and positioning actions.",
    noteLabel: "Workspace behavior",
    noteCopy: "Source URLs can be edited inline and saved locally in the browser. Filters and the last page you visited also persist locally.",
  },
  community: {
    title: "Community Intelligence",
    eyebrow: "",
    headerTitle: "SignalOps: Market & Community Intelligence Platform",
    headerCopy: "Identify the right communities and groups to engage with IBM Netezza announcements, releases, and thought leadership at the right time.",
    noteLabel: "Engagement model",
    noteCopy: "Use live community signals to find where warehouse, lakehouse, and analytics conversations are happening, then tune the keyword focus list as priorities change.",
  },
};

const COMMUNITY_HUBS = [
  { name: "LinkedIn", value: "Groups + posts", description: "Professional communities where announcements, POV posts, and enterprise release notes can land well" },
  { name: "Reddit", value: "Subreddits", description: "Practitioner discussions around warehouses, lakehouses, analytics operations, and architecture trade-offs" },
  { name: "Hacker News", value: "Threads", description: "Launch reactions and category debates among technical decision-makers" },
  { name: "GitHub", value: "Discussions", description: "Engineering-led conversations tied to tooling, integrations, and migration blockers" },
  { name: "Discord", value: "Servers", description: "Modern practitioner communities with fast-moving discussion around tooling and platform choices" },
  { name: "Stack Overflow", value: "Questions", description: "Technical problem statements and troubleshooting patterns tied to warehouse usage" },
  { name: "X", value: "Threads", description: "Fast-moving public narratives around launches, comparisons, and architecture opinion" },
];

const COMMUNITY_PAGES = [
  {
    id: "community-announcements",
    order: 1,
    title: "Best for announcements",
    badge: "Page 1",
    tone: "market",
    description: "The communities, groups, and discussion pages where IBM Netezza launches, release notes, and announcements should be shared at the right moment.",
  },
  {
    id: "community-thought-leadership",
    order: 2,
    title: "Best for thought leadership",
    badge: "Page 2",
    tone: "content",
    description: "The communities and discussion threads best suited for category POVs, architecture guidance, and broader IBM Netezza narrative framing.",
  },
  {
    id: "community-replies",
    order: 3,
    title: "Best for direct engagement replies",
    badge: "Page 3",
    tone: "events",
    description: "The communities where the best move is a contextual reply, follow-up comment, or thread-native proof point rather than a broad post.",
  },
  {
    id: "community-manage",
    order: 4,
    title: "Manage",
    badge: "Page 4",
    tone: "positioning",
    description: "Maintain the keyword focus areas used to discover and monitor communities tied to warehousing, lakehouse, and high-performance analytics conversations.",
  },
];
const DEFAULT_COMMUNITY_KEYWORDS = [
  "data warehouse",
  "lakehouse",
  "high performance analytics",
  "OLAP",
  "MPP database",
  "query performance",
  "warehouse modernization",
  "analytics cost optimization",
  "Snowflake vs BigQuery vs Netezza",
  "ETL / ELT pipelines",
];

const DEFAULT_COMMUNITY_PLATFORMS = [
  "LinkedIn",
  "Reddit",
  "Hacker News",
  "GitHub",
  "Discord",
  "Stack Overflow",
  "X",
];

const COMMUNITY_SIGNAL_GROUPS = [
  {
    community: "LinkedIn",
    play: "announcements",
    group: "Enterprise Data Warehousing & Analytics",
    audience: "Data architects, analytics leaders, platform owners",
    fit: "Strong fit for release announcements and thought-leadership posts tied to enterprise warehouses.",
    discussions: [
      {
        title: "Data warehouse modernization in 2026",
        signal: "Architects are discussing whether lakehouse momentum is replacing classic warehouse patterns or just broadening the stack.",
        content: "Best moment to share a Netezza point of view on workload-fit architecture, governed analytics, and predictable performance.",
        url: "https://www.linkedin.com/search/results/content/?keywords=data%20warehouse%20modernization",
      },
      {
        title: "High-performance analytics for regulated workloads",
        signal: "Senior practitioners are looking for performance plus governance, especially in BFSI and public-sector contexts.",
        content: "Good window for Netezza release proof and IBM-trust positioning.",
        url: "https://www.linkedin.com/search/results/content/?keywords=high-performance%20analytics",
      },
      {
        title: "Lakehouse vs warehouse strategy posts",
        signal: "Leaders are debating whether lakehouse adoption changes the warehouse story or simply expands architecture choices.",
        content: "Useful for sharing an IBM Netezza perspective on workload-fit, control, and hybrid analytics.",
        url: "https://www.linkedin.com/search/results/content/?keywords=lakehouse%20vs%20data%20warehouse",
      },
      {
        title: "Warehouse cost and modernization conversations",
        signal: "Comments and posts increasingly focus on how modernization affects cost predictability and migration complexity.",
        content: "Strong timing for Netezza economics messaging or release posts that support controlled modernization.",
        url: "https://www.linkedin.com/search/results/content/?keywords=analytics%20cost%20optimization",
      },
    ],
  },
  {
    community: "Reddit",
    play: "replies",
    group: "r/dataengineering",
    audience: "Hands-on data engineers and technical evaluators",
    fit: "High-signal discussion space for tooling comparisons, migration pain, and warehouse cost concerns.",
    discussions: [
      {
        title: "Snowflake vs BigQuery vs Redshift discussions",
        signal: "Practitioners compare cost, scale, ergonomics, and operational complexity in active threads.",
        content: "Use this as an early warning surface for where Netezza comparison content or release commentary could resonate.",
        url: "https://www.reddit.com/r/dataengineering/search/?q=data%20warehouse&restrict_sr=1",
      },
      {
        title: "Warehouse performance and scaling pain",
        signal: "Engineers share real-world issues around query speed, concurrency, and spend control.",
        content: "Opportunity to engage with workload-fit guidance rather than direct promotion.",
        url: "https://www.reddit.com/r/dataengineering/search/?q=query%20performance&restrict_sr=1",
      },
      {
        title: "Lakehouse and warehouse architecture debates",
        signal: "Subreddit threads regularly surface trade-offs between warehouse simplicity and newer lakehouse patterns.",
        content: "Helpful place to observe when Netezza release or positioning content can answer real architectural concerns.",
        url: "https://www.reddit.com/r/dataengineering/search/?q=lakehouse&restrict_sr=1",
      },
      {
        title: "Analytics cost optimization threads",
        signal: "People are actively asking how to reduce spend without losing performance or governance.",
        content: "Good opportunity to share cost-conscious release proof or follow-up content that speaks to predictable economics.",
        url: "https://www.reddit.com/r/dataengineering/search/?q=cost%20optimization&restrict_sr=1",
      },
    ],
  },
  {
    community: "Hacker News",
    play: "thought-leadership",
    group: "Launch and product discussion threads",
    audience: "Technical decision-makers and infrastructure-minded leaders",
    fit: "Useful for category framing right after product launches, announcements, or opinionated warehouse debates.",
    discussions: [
      {
        title: "Launch reaction threads about data platforms",
        signal: "Comments often reveal what technical buyers actually care about after a launch or release.",
        content: "Good moment to amplify Netezza announcements if the thread is already discussing warehouses, governance, or performance trade-offs.",
        url: "https://hn.algolia.com/?query=data%20warehouse",
      },
      {
        title: "Lakehouse and analytics platform comparison threads",
        signal: "Discussions quickly surface skepticism, enthusiasm, and practical decision criteria after vendor news.",
        content: "Use these threads to understand where IBM messaging should be precise before sharing releases more broadly.",
        url: "https://hn.algolia.com/?query=lakehouse",
      },
      {
        title: "Performance and scaling conversations",
        signal: "Threads about high-scale data systems often reveal what infrastructure-minded leaders see as credible differentiation.",
        content: "Useful for tailoring Netezza release framing around performance certainty and workload fit.",
        url: "https://hn.algolia.com/?query=query%20performance",
      },
    ],
  },
  {
    community: "GitHub",
    play: "replies",
    group: "dbt and data tooling discussions",
    audience: "Engineers shaping tooling and workflow decisions",
    fit: "Good for spotting migration blockers and integration needs that can inform how Netezza releases are framed.",
    discussions: [
      {
        title: "Warehouse integration and migration issues",
        signal: "Open issues and discussion boards highlight what practitioners struggle to operationalize.",
        content: "Useful for knowing when to share release notes, connectors, or compatibility messaging.",
        url: "https://github.com/search?q=data+warehouse+discussion&type=discussions",
      },
      {
        title: "dbt and transformation workflow discussions",
        signal: "Engineering conversations show where teams are struggling with platform fit, orchestration, and warehouse interoperability.",
        content: "Good source for identifying where a Netezza release or integration update would be relevant.",
        url: "https://github.com/search?q=dbt+warehouse+discussion&type=discussions",
      },
      {
        title: "Lakehouse tooling and open-table issues",
        signal: "Repository discussions often expose the real integration friction behind modern data stack choices.",
        content: "Useful when deciding how to package Netezza compatibility, modernization, and architecture content.",
        url: "https://github.com/search?q=lakehouse+discussion&type=discussions",
      },
    ],
  },
  {
    community: "Discord",
    play: "replies",
    group: "Data engineering and analytics community servers",
    audience: "Modern practitioners, data platform builders, analytics engineers",
    fit: "Good for fast-moving release awareness and for spotting where practitioners ask for platform recommendations in real time.",
    discussions: [
      {
        title: "Warehouse and lakehouse recommendation channels",
        signal: "Members ask for practical recommendations when choosing between warehouse, lakehouse, and hybrid stack options.",
        content: "Useful for timing IBM Netezza thought leadership or release awareness when the question is already active.",
        url: "https://disboard.org/servers/tag/data-engineering",
      },
      {
        title: "Analytics performance troubleshooting rooms",
        signal: "Communities share live troubleshooting around performance, cost, orchestration, and workload placement.",
        content: "Helpful for shaping how Netezza release messaging speaks to actual practitioner pain.",
        url: "https://disboard.org/servers/tag/analytics",
      },
      {
        title: "Modern data stack community channels",
        signal: "Threads often move quickly between tooling comparisons, implementation issues, and architecture advice.",
        content: "Best used as an early warning surface for when a release or announcement could fit an ongoing discussion.",
        url: "https://disboard.org/servers/tag/data",
      },
    ],
  },
  {
    community: "Stack Overflow",
    play: "replies",
    group: "Warehouse and analytics problem discussions",
    audience: "Hands-on implementers, data engineers, platform troubleshooters",
    fit: "Best for understanding the exact technical language people use when warehouses, performance, and scaling become painful.",
    discussions: [
      {
        title: "Data warehouse tagged questions",
        signal: "Question threads surface recurring implementation issues and platform selection pain points.",
        content: "Useful for seeing where Netezza release messaging should emphasize clarity, compatibility, or operational simplicity.",
        url: "https://stackoverflow.com/questions/tagged/data-warehouse",
      },
      {
        title: "OLAP and analytics performance questions",
        signal: "Teams often ask about scaling, optimization, and warehouse behavior in production workloads.",
        content: "Good moment to observe where Netezza high-performance analytics proof could resonate.",
        url: "https://stackoverflow.com/questions/tagged/olap",
      },
      {
        title: "ETL / ELT pipeline and warehouse design questions",
        signal: "Practitioners reveal where operational friction affects architecture and warehouse decisions.",
        content: "Helpful for shaping release communications around integration and ease of adoption.",
        url: "https://stackoverflow.com/questions/tagged/etl",
      },
    ],
  },
  {
    community: "X",
    play: "announcements",
    group: "Public data platform and analytics threads",
    audience: "Influencers, architects, vendor watchers, technical practitioners",
    fit: "Strong for spotting emerging narratives and knowing when a Netezza launch or announcement should join an already-visible conversation.",
    discussions: [
      {
        title: "Data warehouse narrative threads",
        signal: "Public posts and threaded debate capture where attention is moving in the warehouse category.",
        content: "Good for right-time amplification of announcements when category attention spikes.",
        url: "https://x.com/search?q=%22data%20warehouse%22&src=typed_query",
      },
      {
        title: "Lakehouse comparison conversations",
        signal: "Platform advocates and practitioners compare lakehouse and warehouse approaches in public and fast-moving threads.",
        content: "Useful for sharing short Netezza POV responses when comparisons are already active.",
        url: "https://x.com/search?q=lakehouse%20warehouse&src=typed_query",
      },
      {
        title: "Analytics performance and cost posts",
        signal: "Users call out cost surprises, scaling concerns, and architecture trade-offs after vendor changes or launches.",
        content: "Good surface for release follow-ups tied to predictable economics and workload-fit messaging.",
        url: "https://x.com/search?q=analytics%20cost%20optimization&src=typed_query",
      },
    ],
  },
];

const NETEZZA_COMMUNITY_SUGGESTIONS = [
  {
    community: "IBM Community - Netezza Performance Server",
    source: "IBM Community",
    freshness: "Official community",
    url: "https://community.ibm.com/community/user/groups/community-home?CommunityKey=d9f9d5de-e89f-4a6a-84a0-31df8b81f182",
    relevance: "Best place for Netezza-specific product questions, release follow-ups, library articles, and practitioner discussions tied to NCOS, hybrid analytics, and 2026 product updates.",
    suggestedMove: "Use this as the primary community for official Netezza announcements and for collecting stakeholder-ready questions from users.",
    tags: ["Official", "Netezza", "Release Q&A"],
  },
  {
    community: "LinkedIn - Netezza Community Day / IBM TechXchange conversations",
    source: "LinkedIn",
    freshness: "Recent social signal",
    url: "https://www.linkedin.com/search/results/content/?keywords=netezza%20community%20day%20watsonx%20analytics",
    relevance: "Relevant for amplifying Netezza Community Day, watsonx, hybrid analytics, and modernization narratives to architects, partners, and data leaders.",
    suggestedMove: "Post a short POV around workload-fit modernization, then invite comments from customers attending or following IBM TechXchange-style discussions.",
    tags: ["LinkedIn", "Community Day", "Partner reach"],
  },
  {
    community: "Reddit r/dataengineering - warehouse modernization threads",
    source: "Reddit",
    freshness: "Active practitioner surface",
    url: "https://www.reddit.com/r/dataengineering/search/?q=data%20warehouse%20replacement&restrict_sr=1&sort=new",
    relevance: "Useful listening surface for warehouse replacement, cost, lakehouse execution, and migration discussions where Snowflake, BigQuery, Redshift, and Databricks are compared.",
    suggestedMove: "Use this mainly for listening and direct replies. Avoid product pitching; respond with workload-fit guidance, cost governance questions, and migration checklists.",
    tags: ["Practitioner", "Migration", "Cost"],
  },
  {
    community: "Alteryx Community - Netezza integration troubleshooting",
    source: "Alteryx Community",
    freshness: "Connector-relevant thread",
    url: "https://community.alteryx.com/t5/Alteryx-Designer-Desktop-Discussions/Error-finding-connection-when-publishing-NETEZZA-data-source-to/td-p/1265055",
    relevance: "Good indicator of real integration questions from analytics practitioners who connect workflow tools to Netezza environments.",
    suggestedMove: "Create a short troubleshooting or connector readiness note that PMM and technical teams can reuse when integration friction appears.",
    tags: ["Integration", "Analytics workflow", "Troubleshooting"],
  },
  {
    community: "Microsoft Q&A - Netezza linked service and Azure Data Factory",
    source: "Microsoft Learn",
    freshness: "Cloud migration support signal",
    url: "https://learn.microsoft.com/en-us/answers/questions/2224136/netezza-linked-service-has-an-error-payload-%28unrec",
    relevance: "Relevant for hybrid and Azure-adjacent accounts because it surfaces data movement and linked-service issues buyers may hit during modernization.",
    suggestedMove: "Use this as input for an Azure migration FAQ or support-ready note around Netezza connectivity, drivers, and data pipeline validation.",
    tags: ["Azure", "ADF", "Hybrid migration"],
  },
];

const PRODUCT_PROFILE = {
  name: "IBM Netezza Performance Server",
  subtitle: "The product being monitored and compared against competitors",
  usageNote: "All 5 insight types compare competitor activity against this product's positioning, capabilities, and buyer perception to generate Netezza-specific winning recommendations.",
  fields: [
    { label: "Product Name", value: "IBM Netezza Performance Server" },
    { label: "Product Page URL", value: "https://www.ibm.com/products/netezza" },
    { label: "G2 Reviews URL", value: "https://www.g2.com/products/ibm-netezza/reviews" },
    { label: "TrustRadius URL", value: "https://www.trustradius.com/products/ibm-netezza-performance-server/reviews" },
    { label: "Blog / Announcements URL", value: "https://www.ibm.com/new/announcements/netezza-in-2026-powering-the-future-of-enterprise-analytics" },
    { label: "LinkedIn Page URL", value: "https://www.linkedin.com/showcase/ibm-netezza/" },
  ],
};

const COMPETITORS = [
  { id: "databricks", name: "Databricks", color: "#e74c3c", pressure: 92, narrative: "AI + lakehouse consolidation" },
  { id: "snowflake", name: "Snowflake", color: "#3498db", pressure: 88, narrative: "Ease, governance, and app velocity" },
  { id: "redshift", name: "Amazon Redshift", color: "#f39c12", pressure: 75, narrative: "AWS-native performance and cost control" },
  { id: "bigquery", name: "Google BigQuery", color: "#27ae60", pressure: 81, narrative: "Integrated AI analytics story" },
  { id: "synapse", name: "Azure Synapse", color: "#9b59b6", pressure: 69, narrative: "Microsoft ecosystem pull" },
  { id: "teradata", name: "Teradata", color: "#e67e22", pressure: 64, narrative: "Scale credibility in complex estates" },
];

const POSITIONING_DIMENSIONS = [
  {
    label: "Hybrid / on-prem deployment",
    netezza: 9.5,
    note: "Keep winning where deployment control, data residency, and regulated workload flexibility matter most.",
    competitors: { Databricks: 4.5, Snowflake: 4.0, "Amazon Redshift": 5.5, "Google BigQuery": 3.0, "Azure Synapse": 4.8, Teradata: 8.0 },
  },
  {
    label: "Predictable query performance",
    netezza: 9.2,
    note: "This remains one of the clearest executive-level reasons to choose Netezza for structured analytics workloads.",
    competitors: { Databricks: 6.5, Snowflake: 7.4, "Amazon Redshift": 6.8, "Google BigQuery": 7.8, "Azure Synapse": 6.9, Teradata: 8.1 },
  },
  {
    label: "Regulated industry compliance",
    netezza: 9.1,
    note: "Anchor IBM trust, security posture, and deployment flexibility in BFSI, healthcare, and public-sector evaluations.",
    competitors: { Databricks: 6.0, Snowflake: 7.0, "Amazon Redshift": 7.1, "Google BigQuery": 5.2, "Azure Synapse": 7.6, Teradata: 8.0 },
  },
  {
    label: "SQL-first simplicity for analysts",
    netezza: 9.0,
    note: "Use this whenever buyers are frustrated by engineering-heavy architectures or too many platform layers.",
    competitors: { Databricks: 5.5, Snowflake: 8.2, "Amazon Redshift": 7.0, "Google BigQuery": 7.5, "Azure Synapse": 6.8, Teradata: 7.2 },
  },
  {
    label: "TCO predictability",
    netezza: 8.8,
    note: "Economic clarity and cost control are still fertile ground versus cloud-first alternatives.",
    competitors: { Databricks: 5.0, Snowflake: 5.5, "Amazon Redshift": 5.8, "Google BigQuery": 6.1, "Azure Synapse": 6.0, Teradata: 6.2 },
  },
  {
    label: "AI / ML ecosystem",
    netezza: 7.0,
    note: "This is the biggest relative gap, so the platform story needs sharper proof, packaging, and partner language.",
    competitors: { Databricks: 9.5, Snowflake: 8.5, "Amazon Redshift": 7.4, "Google BigQuery": 8.8, "Azure Synapse": 7.9, Teradata: 6.5 },
  },
];

const MESSAGE_PILLARS = [
  { tone: "pillar-content", title: "Lakehouse performance engine", text: "Position Netezza as the warehouse-grade execution layer that makes lakehouse data fast, governed, and reliable for repeat analytics." },
  { tone: "pillar-events", title: "Hybrid freedom", text: "Make deployment flexibility central whenever a lakehouse evaluation includes sovereignty, residency, or infrastructure control requirements." },
  { tone: "pillar-market", title: "Predictable economics", text: "Use cost stories, NCOS proof, and governance-friendly economics to show how performant warehouse execution controls lakehouse query spend." },
  { tone: "pillar-product", title: "Regulated-ready trust", text: "Turn IBM credibility into a specific narrative for compliance-heavy, risk-sensitive analytics environments." },
  { tone: "pillar-positioning", title: "Open data execution", text: "Highlight Iceberg, object storage, and watsonx.data adjacency so Netezza complements lakehouse architecture instead of fighting it." },
];

const POSITIONING_RECOMMENDATION = {
  label: "AI positioning recommendation",
  statement: "The performant warehouse engine for open lakehouse architectures: governed, hybrid, and cost-disciplined execution for enterprise analytics that cannot afford slow or unpredictable queries.",
  evidence: "Use Databricks lakehouse SQL, Snowflake warehouse cost governance, Redshift lakehouse query claims, and BigQuery AI analytics as proof that buyers still need a focused execution layer for governed performance.",
};

const CONTENT_IDEA_ALERT = {
  title: "Urgent: publish the lakehouse performance-engine narrative",
  copy: "Competitors are making lakehouse platforms the default buying frame. Publish a source-backed point of view that shows why a lakehouse still needs a performant, governed warehouse engine.",
};

const CONTENT_IDEAS = [
  {
    id: "content-idea-lakehouse-performance-engine",
    icon: "!",
    title: "Why every enterprise lakehouse needs a performant warehouse engine",
    summary: "Source-backed POV for CDOs and data architects. Reframe Netezza as the governed execution layer for open lakehouse data, not as an alternative to the lakehouse category.",
    platform: "LinkedIn Article",
    status: "Urgent",
    tags: ["LinkedIn article", "Counter-Databricks", "Lakehouse performance", "Publish within 7 days"],
    outline: `DRAFT OUTLINE - LinkedIn Article

Hook: The lakehouse does not remove the need for a high-performance warehouse engine. It raises the bar for one.

Paragraph 1 - Acknowledge why lakehouse platforms are winning attention.
Paragraph 2 - Explain what happens after open data lands: enterprise teams still need fast, governed query execution.
Paragraph 3 - Where Netezza should lead:
- Warehouse-grade performance for repeat analytics
- Iceberg, object storage, and watsonx.data adjacency
- Hybrid control for regulated workloads
- Cost discipline for high-volume SQL
Paragraph 4 - The right question is not warehouse versus lakehouse. It is which engine runs which workload.

Closing CTA: What is driving your architecture decisions right now?

Suggested hashtags: #Lakehouse #EnterpriseAnalytics #IBMNetezza #DataStrategy`,
  },
  {
    id: "content-idea-lakehouse-engine-framework",
    icon: "[]",
    title: "Lakehouse engine decision framework for enterprise analytics teams",
    summary: "Neutral-framed guide that helps buyers decide where Databricks, Snowflake, Redshift, BigQuery, and Netezza fit in the lakehouse execution layer.",
    platform: "Blog / SEO",
    status: "New",
    tags: ["Blog / SEO", "Lakehouse architecture", "Evaluation stage"],
    outline: `DRAFT OUTLINE - Blog / SEO

Working title: Which warehouse engine should run your lakehouse workloads?

Section 1 - Why this decision matters in 2026
Section 2 - What lakehouse platforms are optimized for
Section 3 - Where warehouse-grade execution becomes the bottleneck or advantage
Section 4 - A decision matrix:
- Regulated analytics
- BI-heavy teams
- Cost predictability needs
- Hybrid deployment requirements
Section 5 - When Netezza should be the performance engine for lakehouse data

SEO angle: capture evaluation searches from buyers comparing lakehouse SQL, query engines, and governed performance.

CTA: Download the enterprise workload fit checklist.`,
  },
  {
    id: "content-idea-tco-analysis",
    icon: "$",
    title: "The real TCO of cloud-only data warehouses - 2026 analysis",
    summary: "Counter Snowflake, Redshift, and Databricks 'low entry cost' narrative. Use G2 review data showing cost complaints. Includes Databricks DBU cost unpredictability angle.",
    platform: "Blog and LinkedIn",
    status: "",
    tags: ["Blog / LinkedIn", "Counter-Snowflake", "Counter-Databricks", "High priority"],
    outline: `DRAFT OUTLINE - Blog + LinkedIn Promotion

Section 1 - Why list-price comparisons hide the real cost story
Section 2 - What review themes say about spend predictability
Section 3 - Query-cost variability, credits, DBUs, and operational overhead
Section 4 - How Netezza positions predictable economics differently
Section 5 - Questions finance and analytics leaders should ask vendors

Supporting proof:
- Review-site quotes about surprise cost growth
- Examples of workload volatility
- IBM narrative on economic clarity

CTA: Request the executive cost-pressure briefing.`,
  },
  {
    id: "content-idea-regulated-industries",
    icon: "#",
    title: "Why regulated lakehouses need a governed warehouse execution layer",
    summary: "Targets BFSI, healthcare, and government personas. Shows how compliance, residency, and predictable reporting depend on the engine layer beneath lakehouse analytics.",
    platform: "Whitepaper",
    status: "",
    tags: ["Whitepaper", "BFSI / Healthcare", "Counter-Databricks", "Counter-BigQuery"],
    outline: `DRAFT OUTLINE - Whitepaper

Executive summary - Regulated analytics decisions are architecture decisions.

Chapter 1 - Where lakehouse narratives can oversimplify regulated workload needs
Chapter 2 - Deployment control, residency, and auditability requirements
Chapter 3 - Why predictable performance matters for regulated reporting
Chapter 4 - The case for a governed warehouse engine inside the analytics architecture
Chapter 5 - Positioning Netezza for trust, control, and speed

Distribution plan:
- Gated asset on ibm.com
- Follow-up webinar
- Sales enablement leave-behind`,
  },
  {
    id: "content-idea-analysts-need-performance-engine",
    icon: "@",
    title: "Your analysts need lakehouse data with warehouse-grade performance",
    summary: "Persona-driven piece targeting BI leads who need fast, governed SQL on open data without turning every analytics request into an engineering project.",
    platform: "Blog",
    status: "",
    tags: ["Blog", "Counter-Databricks", "BI lead persona"],
    outline: `DRAFT OUTLINE - Blog

Opening: Analysts should not wait on engineering cycles to query trusted lakehouse data.

Section 1 - Where engineering-heavy stacks slow analytics teams down
Section 2 - Warehouse-grade performance as a productivity advantage
Section 3 - What buyer reviews say about complexity friction
Section 4 - Why Netezza is designed to give governed lakehouse data a faster execution layer

CTA: Share the analyst productivity checklist with your BI team.`,
  },
  {
    id: "content-idea-hybrid-strategy",
    icon: "+",
    title: "Hybrid data architecture is not a compromise - it's a strategy",
    summary: "Response to Teradata-Databricks partnership signals. Positions hybrid as intentional enterprise architecture choice for CTO audiences. Counters both from one angle.",
    platform: "LinkedIn Article",
    status: "",
    tags: ["LinkedIn article", "Counter-Teradata", "Counter-Databricks", "CTO persona"],
    outline: `DRAFT OUTLINE - LinkedIn Article

Opening argument: Hybrid is not transitional. For many enterprises it is the target state.

Paragraph 1 - Why blanket cloud-only narratives miss enterprise reality
Paragraph 2 - The operational benefits of choosing workload-fit architecture
Paragraph 3 - Where hybrid control supports security, governance, and migration pacing
Paragraph 4 - Position Netezza as deliberate architecture, not compromise

CTA: How are you balancing flexibility and control across your data estate?`,
  },
  {
    id: "content-idea-review-proof-pack",
    icon: "$",
    title: "What buyer reviews say when cloud warehouse economics stop making sense",
    summary: "Turns cost, billing variability, and operations friction themes from G2 and TrustRadius into a proof-led Netezza perspective for finance-conscious buyers.",
    platform: "Blog / Sales Enablement",
    status: "",
    tags: ["Review proof", "Counter-Snowflake", "Counter-Redshift", "Cost narrative"],
    outline: `DRAFT OUTLINE - Blog / Sales Enablement

Opening: Buyers do not experience platform economics as a pricing table. They experience them as surprises, friction, and trade-offs.

Section 1 - Which review themes keep appearing across cloud data warehouse alternatives
Section 2 - How cost unpredictability changes evaluation behavior
Section 3 - Where Netezza can speak more credibly about controlled economics
Section 4 - The proof points sales should use in active deals

CTA: Download the cost-objection rebuttal sheet.`,
  },
  {
    id: "content-idea-governed-ai",
    icon: "!",
    title: "Governed AI for analytics teams starts with governed data foundations",
    summary: "Counters Databricks and BigQuery AI-led narratives by reframing the conversation around governed structured analytics, trust, and operational fit.",
    platform: "Executive POV Post",
    status: "New",
    tags: ["AI narrative", "Counter-Databricks", "Counter-BigQuery", "Executive POV"],
    outline: `DRAFT OUTLINE - Executive POV Post

Opening: AI acceleration without data control creates new enterprise risk, not just new productivity.

Point 1 - Why governed data foundations still matter in the AI buying cycle
Point 2 - Where cloud-first AI messaging overreaches
Point 3 - How Netezza fits teams that need auditability, performance, and control
Point 4 - Questions executives should ask before following AI platform momentum

CTA: Book a governed analytics strategy session.`,
  },
  {
    id: "content-idea-sql-productivity",
    icon: "@",
    title: "Why lakehouse data still needs a focused SQL performance layer",
    summary: "Targets BI leaders and analytics managers who want fast, governed query execution on lakehouse data without an engineering-heavy operating model.",
    platform: "Blog",
    status: "",
    tags: ["BI productivity", "Counter-Databricks", "Lakehouse execution", "Practitioner audience"],
    outline: `DRAFT OUTLINE - Blog

Opening: Analytics speed depends as much on team fit as it does on platform capability.

Section 1 - Where over-engineered architectures slow down business analytics
Section 2 - The productivity advantages of governed warehouse-grade execution
Section 3 - The evaluation questions BI leaders should ask vendors
Section 4 - How Netezza supports lakehouse analytics teams more directly

CTA: Share the workload-fit checklist with your analytics team.`,
  },
  {
    id: "content-idea-migration-risk",
    icon: "[]",
    title: "Cloud migration stories rarely mention operational risk - buyers should ask anyway",
    summary: "Counters Redshift and cloud-only modernization narratives by focusing on migration friction, workload disruption, and governance trade-offs.",
    platform: "Comparison Landing Page",
    status: "",
    tags: ["Migration", "Counter-Redshift", "Counter-BigQuery", "Comparison page"],
    outline: `DRAFT OUTLINE - Comparison Landing Page

Headline: Modernization should reduce risk, not rename it.

Section 1 - What vendors highlight in migration success stories
Section 2 - Which operational questions buyers often forget to ask
Section 3 - Why workload-fit architecture matters more than blanket cloud narratives
Section 4 - Where Netezza fits enterprises with control and continuity requirements

CTA: Request the migration-risk evaluation checklist.`,
  },
  {
    id: "content-idea-regulated-checklist",
    icon: "#",
    title: "A regulated analytics platform checklist for BFSI, healthcare, and public sector teams",
    summary: "Transforms Netezza's compliance and deployment-control strengths into a concrete buyer checklist that counters general-purpose cloud-first messaging.",
    platform: "Checklist / Gated Asset",
    status: "",
    tags: ["Regulated industries", "Checklist", "BFSI / Healthcare", "Lead generation"],
    outline: `DRAFT OUTLINE - Checklist / Gated Asset

Section 1 - Data residency and sovereignty requirements
Section 2 - Auditability and performance expectations
Section 3 - Deployment control and migration pacing
Section 4 - Cost and governance evaluation criteria
Section 5 - Vendor questions for regulated analytics workloads

CTA: Download the regulated analytics checklist.`,
  },
  {
    id: "content-idea-ecosystem-story",
    icon: "+",
    title: "Open table formats are useful - but they are not the whole buying decision",
    summary: "Responds to Snowflake and Databricks ecosystem messaging by repositioning the conversation around workload fit, governance, and production outcomes.",
    platform: "LinkedIn Article",
    status: "",
    tags: ["Open table formats", "Counter-Databricks", "Counter-Snowflake", "Ecosystem narrative"],
    outline: `DRAFT OUTLINE - LinkedIn Article

Opening: Open ecosystem compatibility matters, but it is not the same as workload success.

Paragraph 1 - Where ecosystem narratives help buyers
Paragraph 2 - Where they can distract from operating requirements
Paragraph 3 - Why buyers should still test governance, economics, and performance
Paragraph 4 - How Netezza should frame compatibility inside a bigger enterprise story

CTA: Which buying criteria are still underweighted in your evaluations?`,
  },
  {
    id: "content-idea-cfo-brief",
    icon: "=",
    title: "A CFO brief on predictable analytics economics vs usage-driven platform drift",
    summary: "Creates an executive-ready finance angle for deals where Snowflake, Databricks, or BigQuery are being framed as more modern despite cost volatility concerns.",
    platform: "Executive Brief",
    status: "",
    tags: ["CFO persona", "Economics", "Counter-Snowflake", "Counter-Databricks"],
    outline: `DRAFT OUTLINE - Executive Brief

Section 1 - Why analytics platform economics become a finance issue
Section 2 - Where usage-driven models create unpredictability
Section 3 - What finance leaders should ask in late-stage evaluations
Section 4 - How Netezza should frame cost control and planning confidence

CTA: Request the executive economics briefing.`,
  },
  {
    id: "content-idea-seller-proof",
    icon: "^",
    title: "From market narrative to field proof: 10 rebuttals sellers need this quarter",
    summary: "Converts the latest competitor messaging into field-ready rebuttal content that marketing can publish and sales can reuse in live deals.",
    platform: "Enablement Pack",
    status: "",
    tags: ["Sales enablement", "Quarterly", "Field proof", "PMM reuse"],
    outline: `DRAFT OUTLINE - Enablement Pack

Section 1 - The 10 competitor narratives appearing most often right now
Section 2 - The Netezza response for each narrative
Section 3 - Proof links and customer-language examples
Section 4 - How marketing and sales should reuse the same content assets

CTA: Open the rebuttal pack for this quarter's active deals.`,
  },
];

const PMM_ACTION_ALERT = {
  title: "Urgent PMM actions - lakehouse execution narrative",
  copy: "Two immediate actions needed: (1) publish a LinkedIn POV on why lakehouses need performant warehouse engines, and (2) create the Netezza vs Databricks SQL battle card before month-end because lakehouse-SQL evaluations are shaping enterprise deals.",
};

const PMM_ACTIONS = [
  {
    id: "pmm-battlecard-databricks",
    icon: "X",
    title: "Battle card: Netezza vs Databricks SQL",
    summary: "Full competitive card for lakehouse-SQL evaluations, with positioning, landmines, and objection handlers.",
    status: "Urgent",
    outline: `OUTLINE - Battle card: Netezza vs Databricks SQL

Section 1 - Executive summary
- When Netezza wins
- When Databricks wins
- Why this battle matters now

Section 2 - Core positioning
- Netezza: performant warehouse engine for governed lakehouse analytics
- Databricks: AI + lakehouse consolidation with SQL warehouse execution inside the platform

Section 3 - Databricks landmines to use carefully
- Do not attack lakehouse adoption; ask which workloads need warehouse-grade execution
- Complexity burden on analyst-heavy teams
- Cost and architecture sprawl concerns in review language

Section 4 - Objection handlers
- "We need AI momentum"
- "Lakehouse is the future"
- "Databricks feels more modern"

Section 5 - Proof to include
- Iceberg, object storage, and watsonx.data adjacency
- Warehouse-grade performance for repeat SQL
- Regulated-workload fit
- TCO predictability

Closing asset note: keep this seller-ready, punchy, and easy to scan in a live deal.`,
  },
  {
    id: "pmm-battlecard-snowflake",
    icon: "X",
    title: "Battle card: Netezza vs Snowflake",
    summary: "Positioning, objection handlers, and landmines for Snowflake-led deals.",
    status: "",
    outline: `OUTLINE - Battle card: Netezza vs Snowflake

Section 1 - Competitive framing
Section 2 - Where Snowflake is strongest
Section 3 - Where Netezza should counter
- Economics and predictability
- Hybrid and on-prem flexibility
- Governance and performance certainty

Section 4 - Likely objections
- Ease of use
- Ecosystem breadth
- Cloud-first buying momentum

Section 5 - Deal guidance
- Which personas to target
- Which proof points matter most
- When to avoid feature-parity debates`,
  },
  {
    id: "pmm-battlecard-redshift",
    icon: "X",
    title: "Battle card: Netezza vs Redshift",
    summary: "Positioning, objection handlers, and landmines for AWS-native comparisons.",
    status: "",
    outline: `OUTLINE - Battle card: Netezza vs Redshift

Section 1 - AWS advantage vs workload-fit reality
Section 2 - Netezza message for hybrid enterprises
Section 3 - Redshift objection handling
- AWS alignment
- Scale claims
- Price-performance messaging

Section 4 - Landmines
- Cross-estate simplicity
- Governance and deployment freedom
- Regulated workload requirements

Section 5 - Seller talk track for infrastructure-led buyers`,
  },
  {
    id: "pmm-counterpost-databricks",
    icon: "!",
    title: "Counter-post: why lakehouses need performant warehouse engines",
    summary: "LinkedIn executive post ready to publish in a VP of Product voice.",
    status: "Urgent",
    outline: `OUTLINE - LinkedIn counter-post

Opening line: The lakehouse does not remove the need for a high-performance warehouse engine.

Paragraph 1 - Acknowledge why the lakehouse story resonates
Paragraph 2 - Explain why governed lakehouse data still needs fast, predictable query execution
Paragraph 3 - Make the case for governed, hybrid, warehouse-grade performance
Paragraph 4 - Position Netezza as the execution layer for open data, not a legacy alternative

Close with one provocative question for engagement.

Optional assets:
- pull-quote tile
- 3-slide carousel
- internal seller version of the same message`,
  },
  {
    id: "pmm-win-story-bfsi",
    icon: "*",
    title: "Win story: BFSI customer vs Databricks",
    summary: "Template for sales and marketing use in regulated account motion.",
    status: "New",
    outline: `OUTLINE - BFSI win story

Section 1 - Customer context
- Industry
- Data sensitivity
- Workload type

Section 2 - Why Databricks looked attractive initially
Section 3 - What concerns emerged
- Compliance
- Architecture complexity
- Cost predictability

Section 4 - Why Netezza won
- Governed performance
- Deployment control
- Lower operational burden

Section 5 - Reusable proof points for field and web`,
  },
  {
    id: "pmm-cio-briefing",
    icon: "=",
    title: "CIO briefing: Netezza competitive positioning",
    summary: "Executive-ready narrative versus Snowflake, Redshift, and Databricks.",
    status: "",
    outline: `OUTLINE - CIO briefing

Slide 1 - Why the lakehouse execution narrative is shifting
Slide 2 - Competitive landscape snapshot
Slide 3 - Where Netezza leads
Slide 4 - Where the market is loudest right now
Slide 5 - What messaging CIOs should hear from IBM
Slide 6 - Recommended next moves for enterprise accounts

Tone: strategic, concise, board-ready.`,
  },
  {
    id: "pmm-content-calendar",
    icon: "#",
    title: "Q2 2026 content calendar (updated with Databricks)",
    summary: "Full PMM content plan for the current win-in-market motion.",
    status: "",
    outline: `OUTLINE - Q2 2026 content calendar

Month 1
- Databricks counter-narrative post
- Decision framework blog
- Cost-predictability article

Month 2
- Regulated industries whitepaper
- Snowflake economics rebuttal
- Hybrid strategy executive POV

Month 3
- Analyst-facing thought leadership
- Customer proof asset
- Repurposed carousel/social sequence

For each item include:
- owner
- platform
- target persona
- CTA
- reuse plan`,
  },
  {
    id: "pmm-analyst-briefing",
    icon: "^",
    title: "Analyst briefing topics - Gartner / Forrester",
    summary: "Includes lakehouse performance-engine positioning and analyst talking points.",
    status: "",
    outline: `OUTLINE - Analyst briefing topics

Theme 1 - Why lakehouse architectures still need performant warehouse execution
Theme 2 - Hybrid deployment as a strategic requirement, not a transition phase
Theme 3 - Cost predictability and performance certainty as evaluation criteria
Theme 4 - Where competitor lakehouse narratives underplay execution, cost, and governance
Theme 5 - What IBM wants analysts to understand about Netezza in 2026

Deliverables:
- briefing memo
- 1-page takeaway
- follow-up proof package`,
  },
];

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

const PRODUCT_CRITICAL_GAP = {
  title: "Remaining critical gap - full AI / ML in-database execution and business-user NLQ",
  copy: "Iceberg, NCOS, Time Travel, and the AI Database Assistant are now confirmed shipped or packaged for PMM. The biggest remaining gaps versus Databricks, Snowflake Cortex, and BigQuery are full in-database ML training / inference for data scientists and a broader natural-language query experience for business users.",
};

const PRODUCT_CAPABILITY_MATRIX = [
  {
    capability: "Core SQL analytics",
    note: "Structured query processing",
    statuses: { Netezza: "strong", Databricks: "strong", Snowflake: "strong", "Amazon Redshift": "strong", "Google BigQuery": "strong", "Azure Synapse": "strong", Teradata: "strong" },
    gapScore: 0,
  },
  {
    capability: "Hybrid / on-prem deployment",
    note: "Run-anywhere architecture",
    statuses: { Netezza: "strong", Databricks: "gap", Snowflake: "gap", "Amazon Redshift": "partial", "Google BigQuery": "gap", "Azure Synapse": "partial", Teradata: "strong" },
    gapScore: 0,
  },
  {
    capability: "Enterprise compliance & governance",
    note: "BFSI, healthcare, government fit",
    statuses: { Netezza: "strong", Databricks: "partial", Snowflake: "partial", "Amazon Redshift": "partial", "Google BigQuery": "partial", "Azure Synapse": "partial", Teradata: "strong" },
    gapScore: 0,
  },
  {
    capability: "Native AI / ML model execution",
    note: "watsonx.data integration + custom ML in-engine roadmap",
    statuses: { Netezza: "partial", Databricks: "strong", Snowflake: "strong", "Amazon Redshift": "partial", "Google BigQuery": "strong", "Azure Synapse": "strong", Teradata: "partial" },
    gapScore: 6.5,
  },
  {
    capability: "Natural language querying (NLQ)",
    note: "AI Database Assistant today, broader business NLQ still needed",
    statuses: { Netezza: "partial", Databricks: "strong", Snowflake: "strong", "Amazon Redshift": "partial", "Google BigQuery": "strong", "Azure Synapse": "strong", Teradata: "partial" },
    gapScore: 5.0,
  },
  {
    capability: "Open table format support",
    note: "Apache Iceberg + Unity Catalog / AWS Glue compatibility",
    statuses: { Netezza: "strong", Databricks: "strong", Snowflake: "strong", "Amazon Redshift": "partial", "Google BigQuery": "strong", "Azure Synapse": "partial", Teradata: "partial" },
    gapScore: 0,
  },
  {
    capability: "Serverless auto-scaling",
    note: "NCOS compute-storage separation + pay-as-you-go pattern",
    statuses: { Netezza: "partial", Databricks: "strong", Snowflake: "strong", "Amazon Redshift": "strong", "Google BigQuery": "strong", "Azure Synapse": "partial", Teradata: "partial" },
    gapScore: 4.8,
  },
  {
    capability: "Data sharing marketplace",
    note: "Governed external data exchange",
    statuses: { Netezza: "gap", Databricks: "strong", Snowflake: "strong", "Amazon Redshift": "partial", "Google BigQuery": "strong", "Azure Synapse": "partial", Teradata: "gap" },
    gapScore: 6.5,
  },
  {
    capability: "Real-time / streaming analytics",
    note: "Event-stream ingestion at scale",
    statuses: { Netezza: "gap", Databricks: "strong", Snowflake: "partial", "Amazon Redshift": "partial", "Google BigQuery": "strong", "Azure Synapse": "strong", Teradata: "partial" },
    gapScore: 6.2,
  },
  {
    capability: "Notebook / IDE interface",
    note: "Built-in developer workspace",
    statuses: { Netezza: "partial", Databricks: "strong", Snowflake: "strong", "Amazon Redshift": "partial", "Google BigQuery": "partial", "Azure Synapse": "strong", Teradata: "partial" },
    gapScore: 5.0,
  },
];

const PRODUCT_CONFIRMED_STRENGTHS = [
  {
    status: "Shipped - GA",
    title: "Apache Iceberg open table format support",
    summary: "IBM Netezza now supports Apache Iceberg natively, with buyer-facing compatibility language around Unity Catalog, AWS Glue, and Azure Purview. This closes one of the most cited open-table objections in competitive evaluations.",
    leverage: "Lead with this in Databricks and Snowflake competitive deals as proof that Netezza can be the warehouse execution layer for open lakehouse data.",
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

const PRODUCT_REMAINING_GAPS = [
  {
    priority: "P1 - Critical",
    title: "Full in-database ML training and inference for data scientists",
    gapScore: "6.5 / 10",
    copy: "Netezza has made progress with watsonx.data integration and the 2026 roadmap now includes custom ML models and unstructured text processing inside the engine. The remaining gap is a fuller in-database ML story for data scientists, where Databricks, Snowflake Cortex, and BigQuery still market more aggressively.",
    current: "watsonx.data integration, Hadoop / Hive / Kerberos connectivity, custom ML in-engine roadmap",
    leverage: "IBM watsonx.ai + watsonx.data + Granite models",
    impact: "CDO, Head of Data Science, Data Architect",
    competitors: ["Databricks MLflow + Runtime", "Snowflake Cortex AI", "BigQuery ML + Vertex AI", "Azure Synapse + OpenAI"],
  },
  {
    priority: "P2 - High",
    title: "Expand NLQ from ops assistant to full business-user query interface",
    gapScore: "5.0 / 10",
    copy: "The AI-powered Database Assistant is a meaningful step forward, but it is still oriented toward DBAs and ops teams. The remaining gap is a natural-language experience that lets business users ask analytical questions directly and get governed SQL-backed answers.",
    current: "AI Database Assistant - NL troubleshooting, metric retrieval, config insights",
    leverage: "IBM watsonx Assistant + Granite LLM + semantic layer",
    impact: "Business Analyst, BI Lead, CDO, CFO",
    competitors: ["Databricks AI / Genie", "Snowflake Cortex Analyst", "BigQuery DataQnA / NLQ", "Synapse + Copilot"],
  },
  {
    priority: "P2 - High",
    title: "Governed data sharing marketplace",
    gapScore: "6.5 / 10",
    copy: "Snowflake Marketplace and Databricks Delta Sharing have become ecosystem moats. Netezza still needs a stronger governed sharing capability that lets customers expose read-only data products across organizations without losing control.",
    current: "Unified metadata management, watsonx.data ecosystem connectivity",
    leverage: "IBM Cloud Pak for Data + IAM governance",
    impact: "CDO, Data Product Owner, Partner ecosystem teams",
    competitors: ["Snowflake Data Marketplace", "Databricks Delta Sharing", "BigQuery Analytics Hub"],
  },
  {
    priority: "P3 - Strategic",
    title: "Real-time streaming analytics ingestion",
    gapScore: "6.2 / 10",
    copy: "Databricks, BigQuery, and Azure Synapse all support stronger streaming and real-time ingestion patterns. Netezza remains optimized for batch analytics, which is fine for many accounts, but a connector-layer streaming story would prevent losses in BFSI and telecom evaluations.",
    current: "Batch-optimized structured analytics with strong governed performance",
    leverage: "IBM Event Streams (Kafka managed) + IBM DataStage",
    impact: "Data Engineer, Platform Architect, BFSI / Telco verticals",
    competitors: ["Databricks Structured Streaming", "BigQuery Streaming + Pub/Sub", "Synapse + Event Hub"],
  },
];

const COMPETITIVE_SENTIMENT = [
  { name: "IBM Netezza", positive: 74, neutral: 17, negative: 9 },
  { name: "Snowflake", positive: 78, neutral: 14, negative: 8 },
  { name: "Databricks", positive: 68, neutral: 17, negative: 15 },
  { name: "Amazon Redshift", positive: 62, neutral: 20, negative: 18 },
  { name: "Google BigQuery", positive: 70, neutral: 18, negative: 12 },
  { name: "Azure Synapse", positive: 65, neutral: 20, negative: 15 },
  { name: "Teradata", positive: 60, neutral: 18, negative: 22 },
];

const INSIGHT_PAGES = [
  {
    id: "content",
    order: 1,
    title: "Content Suggestions",
    badge: "Insight Type 1",
    tone: "content",
    description: "Competitor blog posts and webpages to identify what topics to publish, which narratives to counter, and where IBM can lead the conversation.",
    drives: "Topics to publish, counter-narratives, blog angles",
    overviewHeadline: "Use competitor thought leadership and product messaging to decide what Netezza should publish next.",
    sourceIntro: "Track competitor blogs plus product pages so the team can convert messaging shifts into IBM content opportunities.",
    sources: [
      { id: "content-db-blog", kind: "BLOG", label: "Databricks Blog", competitor: "Databricks", url: "https://www.databricks.com/blog" },
      { id: "content-db-web", kind: "WEB", label: "Databricks Product Page", competitor: "Databricks", url: "https://www.databricks.com/product/data-warehousing" },
      { id: "content-sf-blog", kind: "BLOG", label: "Snowflake Blog", competitor: "Snowflake", url: "https://www.snowflake.com/en/blog/" },
      { id: "content-sf-web", kind: "WEB", label: "Snowflake Product Page", competitor: "Snowflake", url: "https://www.snowflake.com/en/data-cloud/platform/" },
      { id: "content-rs-blog", kind: "BLOG", label: "AWS Big Data Blog (Redshift)", competitor: "Amazon Redshift", url: "https://aws.amazon.com/blogs/big-data/category/database/amazon-redshift/" },
      { id: "content-rs-web", kind: "WEB", label: "Amazon Redshift Product Page", competitor: "Amazon Redshift", url: "https://aws.amazon.com/redshift/" },
      { id: "content-bq-blog", kind: "BLOG", label: "Google Cloud Blog (BigQuery)", competitor: "Google BigQuery", url: "https://cloud.google.com/blog/products/data-analytics" },
      { id: "content-bq-web", kind: "WEB", label: "BigQuery Product Page", competitor: "Google BigQuery", url: "https://cloud.google.com/bigquery" },
      { id: "content-as-blog", kind: "BLOG", label: "Microsoft Azure Synapse Blog", competitor: "Azure Synapse", url: "https://techcommunity.microsoft.com/t5/azure-synapse-analytics-blog/bg-p/AzureSynapseAnalyticsBlog" },
      { id: "content-as-web", kind: "WEB", label: "Azure Synapse Product Page", competitor: "Azure Synapse", url: "https://azure.microsoft.com/en-us/products/synapse-analytics" },
      { id: "content-td-blog", kind: "BLOG", label: "Teradata Blog", competitor: "Teradata", url: "https://www.teradata.com/Blog" },
      { id: "content-td-web", kind: "WEB", label: "Teradata Platform Page", competitor: "Teradata", url: "https://www.teradata.com/platform" },
    ],
    highlights: [
      { competitor: "Databricks", priority: "High priority", title: "Publish the lakehouse performance-engine POV", summary: "Databricks keeps bundling AI, lakehouse, SQL warehouse, and migration value into one platform story. Netezza can counter by showing why a lakehouse still needs a focused, governed warehouse execution layer.", recommendation: "Create one executive POV blog and one seller-facing comparison page that frames performance, cost, and governance as lakehouse success requirements.", tags: ["Lakehouse", "Performance engine", "Executive blog"] },
      { competitor: "Snowflake", priority: "High priority", title: "Own the TCO predictability angle", summary: "Snowflake still feels easy to buy, but cost predictability remains a recurring tension in competitive messaging and review conversations.", recommendation: "Build a proof-led article and calculator explainer that translates Netezza economics into CFO-friendly language.", tags: ["TCO", "Proof", "Decision support"] },
      { competitor: "Amazon Redshift", priority: "Medium priority", title: "Create a migration comparison page for AWS-native buyers", summary: "Redshift content usually leans technical. That opens space for Netezza to publish a simpler warehouse modernization framework.", recommendation: "Launch a search-friendly comparison page that shows when AWS alignment is not enough for hybrid, governed, or performance-sensitive deployments.", tags: ["Migration", "SEO", "Comparison"] },
      { competitor: "Google BigQuery", priority: "Medium priority", title: "Turn compliance and deployment control into a thought-leadership series", summary: "BigQuery content is strong on AI analytics, but weak on hybrid control and residency-sensitive workloads.", recommendation: "Draft a 3-part series focused on regulated industry analytics, hybrid governance, and why control still matters in 2026.", tags: ["Compliance", "Series", "Regulated industries"] },
    ],
  },
  {
    id: "events",
    order: 2,
    title: "PMM action centre",
    badge: "Insight Type 2",
    tone: "events",
    description: "Turn competitor pressure into the next PMM assets Netezza needs: battle cards, counter-posts, win stories, executive briefings, and analyst-facing materials.",
    drives: "Assets to create, outlines to generate, PMM response plays",
    overviewHeadline: "Use competitor pressure to decide which PMM assets Netezza should create next and make those assets easier to generate.",
    sourceIntro: "These trigger sources combine competitor pages, reviews, and market signals that should create new Netezza PMM assets.",
    sources: [
      { id: "pmm-db-linkedin", kind: "SIGNAL", label: "Databricks LinkedIn Narrative", competitor: "Databricks", url: "https://www.linkedin.com/company/databricks/posts/" },
      { id: "pmm-db-reviews", kind: "REVIEW", label: "Databricks G2 Reviews", competitor: "Databricks", url: "https://www.g2.com/products/databricks-data-intelligence-platform/reviews" },
      { id: "pmm-sf-reviews", kind: "REVIEW", label: "Snowflake G2 Reviews", competitor: "Snowflake", url: "https://www.g2.com/products/snowflake/reviews" },
      { id: "pmm-rs-web", kind: "WEB", label: "Amazon Redshift Features", competitor: "Amazon Redshift", url: "https://aws.amazon.com/redshift/features/" },
      { id: "pmm-bq-blog", kind: "BLOG", label: "BigQuery AI Analytics Blog", competitor: "Google BigQuery", url: "https://cloud.google.com/blog/products/data-analytics" },
      { id: "pmm-as-tr", kind: "REVIEW", label: "Azure Synapse TrustRadius", competitor: "Azure Synapse", url: "https://www.trustradius.com/products/azure-synapse-analytics/reviews" },
      { id: "pmm-td-linkedin", kind: "SIGNAL", label: "Teradata LinkedIn Narrative", competitor: "Teradata", url: "https://www.linkedin.com/company/teradata/posts/" },
      { id: "pmm-netezza-own", kind: "OWN", label: "IBM Netezza Product Page", competitor: "IBM Netezza", url: "https://www.ibm.com/products/netezza" },
    ],
    highlights: [
      { competitor: "Databricks", priority: "Urgent", title: "Create the Netezza vs Databricks SQL battle card now", summary: "Databricks is making lakehouse SQL feel like the default execution layer. PMM needs ready-to-use assets that explain where Netezza strengthens lakehouse architectures with governed performance.", recommendation: "Publish the lakehouse performance-engine POV first, then equip sellers with the battle card and objection guide for open deals.", tags: ["Battle card", "Lakehouse SQL", "Field readiness"] },
      { competitor: "Snowflake", priority: "High priority", title: "Build economics and objection-handling assets for Snowflake-led deals", summary: "Snowflake's ease and momentum still create buyer pull, but cost and workload fit remain rebuttal space for Netezza.", recommendation: "Create a Snowflake battle card plus a CIO-ready economics briefing that simplifies the value case.", tags: ["Economics", "CIO briefing", "Competitive enablement"] },
      { competitor: "Amazon Redshift", priority: "High priority", title: "Equip sellers for AWS-native comparisons", summary: "Redshift can win by default in AWS accounts unless PMM provides sharper workload-fit messaging and seller-ready landmines.", recommendation: "Ship a Redshift battle card and a concise hybrid architecture narrative deck for cloud infrastructure buyers.", tags: ["AWS", "Battle card", "Architecture deck"] },
      { competitor: "Analysts / market", priority: "Medium priority", title: "Prepare analyst and executive proof around lakehouse execution", summary: "The category conversation has moved from warehouse replacement to lakehouse execution quality. PMM should package a consistent executive and analyst response.", recommendation: "Create the analyst briefing memo, CIO briefing, and Q2 asset calendar from one shared narrative framework.", tags: ["Analyst briefing", "Lakehouse execution", "Executive assets"] },
    ],
  },
  {
    id: "market",
    order: 3,
    title: "Market Signals",
    badge: "Insight Type 3",
    tone: "market",
    description: "Track social posts and review sites to surface sentiment shifts, buyer complaints, competitor narrative moves, and emerging deal risks.",
    drives: "Sentiment shifts, buyer complaints, narrative moves",
    overviewHeadline: "Use social and review feeds to capture what buyers are saying and how competitor narratives are moving in-market.",
    sourceIntro: "This page is built for LinkedIn, G2, and TrustRadius sources so PMM can react to buyer language, complaints, and praise quickly.",
    sources: [
      { id: "market-db-social", kind: "SOCIAL", label: "Databricks LinkedIn Posts", competitor: "Databricks", url: "https://www.linkedin.com/company/databricks/posts/" },
      { id: "market-db-g2", kind: "G2", label: "Databricks G2 Reviews", competitor: "Databricks", url: "https://www.g2.com/products/databricks/reviews" },
      { id: "market-db-tr", kind: "TR", label: "Databricks TrustRadius", competitor: "Databricks", url: "https://www.trustradius.com/products/databricks/reviews" },
      { id: "market-sf-social", kind: "SOCIAL", label: "Snowflake LinkedIn Posts", competitor: "Snowflake", url: "https://www.linkedin.com/company/snowflake-computing/posts/" },
      { id: "market-sf-g2", kind: "G2", label: "Snowflake G2 Reviews", competitor: "Snowflake", url: "https://www.g2.com/products/snowflake/reviews" },
      { id: "market-sf-tr", kind: "TR", label: "Snowflake TrustRadius", competitor: "Snowflake", url: "https://www.trustradius.com/products/snowflake/reviews" },
      { id: "market-rs-social", kind: "SOCIAL", label: "Amazon Web Services LinkedIn", competitor: "Amazon Redshift", url: "https://www.linkedin.com/company/amazon-web-services/posts/" },
      { id: "market-rs-g2", kind: "G2", label: "Amazon Redshift G2 Reviews", competitor: "Amazon Redshift", url: "https://www.g2.com/products/amazon-redshift/reviews" },
      { id: "market-rs-tr", kind: "TR", label: "Amazon Redshift TrustRadius", competitor: "Amazon Redshift", url: "https://www.trustradius.com/products/redshift/reviews" },
      { id: "market-bq-social", kind: "SOCIAL", label: "Google Cloud LinkedIn Posts", competitor: "Google BigQuery", url: "https://www.linkedin.com/company/google-cloud/posts/" },
      { id: "market-bq-g2", kind: "G2", label: "BigQuery G2 Reviews", competitor: "Google BigQuery", url: "https://www.g2.com/products/google-bigquery/reviews" },
      { id: "market-bq-tr", kind: "TR", label: "BigQuery TrustRadius", competitor: "Google BigQuery", url: "https://www.trustradius.com/products/google-bigquery/reviews" },
      { id: "market-as-social", kind: "SOCIAL", label: "Microsoft Azure LinkedIn Posts", competitor: "Azure Synapse", url: "https://www.linkedin.com/showcase/microsoft-azure/posts/" },
      { id: "market-as-g2", kind: "G2", label: "Azure Synapse G2 Reviews", competitor: "Azure Synapse", url: "https://www.g2.com/products/microsoft-azure-synapse-analytics/reviews" },
      { id: "market-as-tr", kind: "TR", label: "Azure Synapse TrustRadius", competitor: "Azure Synapse", url: "https://www.trustradius.com/products/azure-synapse-analytics/reviews" },
      { id: "market-td-social", kind: "SOCIAL", label: "Teradata LinkedIn Posts", competitor: "Teradata", url: "https://www.linkedin.com/company/teradata/posts/" },
      { id: "market-td-g2", kind: "G2", label: "Teradata G2 Reviews", competitor: "Teradata", url: "https://www.g2.com/products/teradata-vantage/reviews" },
      { id: "market-td-tr", kind: "TR", label: "Teradata TrustRadius", competitor: "Teradata", url: "https://www.trustradius.com/products/teradata-vantage/reviews" },
    ],
    highlights: [
      { competitor: "Databricks", priority: "High priority", title: "Operational complexity is still a buyer complaint", summary: "Databricks can dominate vision-level messaging while still attracting comments about operational complexity and the burden on analytics teams.", recommendation: "Make warehouse-grade lakehouse execution, faster onboarding, and governed query performance stronger proof themes in battlecards, demos, and web copy.", tags: ["Complexity", "Reviews", "Lakehouse execution"] },
      { competitor: "Snowflake", priority: "High priority", title: "Cost conversations continue to follow positive sentiment", summary: "Snowflake receives praise for user experience and speed, but economics and role complexity still appear in reviews and social chatter.", recommendation: "Pair positive Netezza proof with a simple cost-objection framework so sellers can neutralize the ease-of-use halo.", tags: ["Cost", "Sentiment", "Field play"] },
      { competitor: "Teradata", priority: "Medium priority", title: "Migration effort is a recurring friction point", summary: "Teradata keeps scale credibility, but switching effort and modernization complexity still show up in review language.", recommendation: "Create a migration reassurance kit with time-to-value stories, risk controls, and simplified implementation proof.", tags: ["Migration", "Objection handling", "Proof"] },
      { competitor: "Google BigQuery", priority: "Medium priority", title: "AI-native excitement does not erase hybrid trust gaps", summary: "BigQuery social narratives are strong on AI and developer momentum, but they remain weaker when buyers need deployment control.", recommendation: "Use that gap to drive compliance, residency, and hybrid-trust content across web, sales, and analyst-facing channels.", tags: ["AI", "Hybrid", "Narrative shift"] },
    ],
  },
  {
    id: "product",
    order: 4,
    title: "Product Suggestions",
    badge: "Insight Type 4",
    tone: "product",
    description: "Review competitor capability pages and pricing surfaces to identify feature gaps, packaging opportunities, and what Netezza should build or sharpen to win deals.",
    drives: "Feature gaps in Netezza, what to build to win deals",
    overviewHeadline: "Use competitor capability and pricing pages to turn recurring market pressure into concrete product recommendations.",
    sourceIntro: "These feeds focus on public capability and commercial pages so product and PMM can identify where packaging or roadmap work is needed.",
    sources: [
      { id: "product-db-cap", kind: "CAPABILITY", label: "Databricks Data Warehousing", competitor: "Databricks", url: "https://www.databricks.com/product/data-warehousing" },
      { id: "product-db-price", kind: "PRICE", label: "Databricks Pricing", competitor: "Databricks", url: "https://www.databricks.com/product/pricing" },
      { id: "product-sf-cap", kind: "CAPABILITY", label: "Snowflake Platform", competitor: "Snowflake", url: "https://www.snowflake.com/en/data-cloud/platform/" },
      { id: "product-sf-price", kind: "PRICE", label: "Snowflake Pricing", competitor: "Snowflake", url: "https://www.snowflake.com/en/pricing/" },
      { id: "product-rs-cap", kind: "CAPABILITY", label: "Amazon Redshift Features", competitor: "Amazon Redshift", url: "https://aws.amazon.com/redshift/features/" },
      { id: "product-rs-price", kind: "PRICE", label: "Amazon Redshift Pricing", competitor: "Amazon Redshift", url: "https://aws.amazon.com/redshift/pricing/" },
      { id: "product-bq-cap", kind: "CAPABILITY", label: "BigQuery Product Page", competitor: "Google BigQuery", url: "https://cloud.google.com/bigquery" },
      { id: "product-bq-price", kind: "PRICE", label: "BigQuery Pricing", competitor: "Google BigQuery", url: "https://cloud.google.com/bigquery/pricing" },
      { id: "product-as-cap", kind: "CAPABILITY", label: "Azure Synapse Product Page", competitor: "Azure Synapse", url: "https://azure.microsoft.com/en-us/products/synapse-analytics" },
      { id: "product-as-price", kind: "PRICE", label: "Azure Synapse Pricing", competitor: "Azure Synapse", url: "https://azure.microsoft.com/en-us/pricing/details/synapse-analytics/" },
      { id: "product-td-cap", kind: "CAPABILITY", label: "Teradata Vantage Platform", competitor: "Teradata", url: "https://www.teradata.com/platform" },
      { id: "product-td-price", kind: "PRICE", label: "Teradata Commercial Packaging", competitor: "Teradata", url: "https://www.teradata.com/getting-started" },
    ],
    highlights: [
      { competitor: "Databricks", priority: "High priority", title: "Sharpen the AI ecosystem proof package", summary: "Databricks is still stronger in native AI workflow perception. Even when Netezza can play, the story is not packaged with the same clarity.", recommendation: "Prioritize clearer AI partner proof, reference architectures, and buyer-facing packaging before claiming parity in the field.", tags: ["AI", "Packaging", "Proof"] },
      { competitor: "Snowflake", priority: "High priority", title: "Improve self-service and buyer-facing simplicity proof", summary: "Snowflake remains strong on ease and analyst accessibility. Netezza needs better evidence, not just better messaging.", recommendation: "Invest in onboarding proof, short-path setup stories, and demo flows that show analyst productivity immediately.", tags: ["UX", "Self-service", "Demo"] },
      { competitor: "Google BigQuery", priority: "Medium priority", title: "Bring governed data sharing into the roadmap conversation", summary: "BigQuery and the rest of the cloud set benefit from stronger ecosystem and sharing narratives in modern data estates.", recommendation: "Evaluate packaging or roadmap options that make controlled data collaboration easier to explain and easier to adopt.", tags: ["Ecosystem", "Roadmap", "Governed sharing"] },
      { competitor: "Teradata", priority: "Medium priority", title: "Turn migration accelerators into a more visible product story", summary: "Migration assurance is strategically important, but buyers still struggle to understand how quickly they can transition with low risk.", recommendation: "Package migration accelerators, templates, and services more directly into the product narrative and pricing conversation.", tags: ["Migration", "Acceleration", "Commercial strategy"] },
    ],
  },
  {
    id: "positioning",
    order: 5,
    title: "Positioning",
    badge: "Insight Type 5",
    tone: "positioning",
    description: "Translate product, event, content, and market intelligence into a clear Netezza positioning system across message pillars, response angles, and strength dimensions.",
    drives: "Win themes, response angles, executive narrative",
    overviewHeadline: "Use Netezza strengths and competitor pressure to decide how the product should be framed in-market.",
    sourceIntro: "These sources ground the Netezza baseline so competitor activity can be compared against IBM's own product, review, and thought-leadership footprint.",
    sources: [
      { id: "positioning-product", kind: "OWN", label: "IBM Netezza Product Page", competitor: "IBM Netezza", url: "https://www.ibm.com/products/netezza" },
      { id: "positioning-g2", kind: "OWN", label: "IBM Netezza G2 Reviews", competitor: "IBM Netezza", url: "https://www.g2.com/products/ibm-netezza/reviews" },
      { id: "positioning-tr", kind: "OWN", label: "IBM Netezza TrustRadius", competitor: "IBM Netezza", url: "https://www.trustradius.com/products/ibm-netezza-performance-server/reviews" },
      { id: "positioning-blog", kind: "OWN", label: "IBM Blog / Announcements", competitor: "IBM Netezza", url: "https://www.ibm.com/new/announcements/netezza-in-2026-powering-the-future-of-enterprise-analytics" },
      { id: "positioning-linkedin", kind: "OWN", label: "IBM Netezza LinkedIn Page", competitor: "IBM Netezza", url: "https://www.linkedin.com/showcase/ibm-netezza/" },
    ],
    highlights: [
      { competitor: "Across competitors", priority: "Primary angle", title: "Lead with lakehouse performance plus regulated-workload confidence", summary: "Netezza's biggest durable differentiation is the combination of warehouse-grade execution, deployment flexibility, and IBM trust for highly governed analytics environments.", recommendation: "Keep this as the first message pillar for enterprise accounts that need lakehouse openness without giving up query control.", tags: ["Lakehouse", "Trust", "Enterprise"] },
      { competitor: "Databricks / BigQuery", priority: "Rebuttal", title: "Counter AI-native narratives with proof, not imitation", summary: "Netezza should not try to sound like a copy of AI-first competitors. It needs credible proof and a sharper role in the enterprise stack.", recommendation: "Use AI ecosystem evidence where real, while keeping the core promise anchored in governed analytics outcomes.", tags: ["AI", "Rebuttal", "Credibility"] },
      { competitor: "Snowflake / Redshift", priority: "Sales angle", title: "Use economics and workload fit to sharpen lakehouse decisions", summary: "Cost predictability and workload-specific performance remain practical ways to make competitive evaluations clearer for buyers.", recommendation: "Equip sellers with concise proof on performance certainty, economics, and open-data execution.", tags: ["Economics", "Performance", "Sales play"] },
    ],
  },
];

const MARKET_FILTERS = [
  { id: "all", label: "All sources" },
  { id: "social", label: "Social media" },
  { id: "reviews", label: "G2 / TrustRadius" },
  { id: "blog", label: "Blog / Content" },
  { id: "website", label: "Website changes" },
];

const MARKET_SIGNAL_ITEMS = [
  {
    id: "market-signal-databricks-linkedin",
    competitor: "Databricks",
    group: "social",
    sourceLabel: "LinkedIn",
    sourceBadge: "LINKEDIN",
    sourceUrl: "https://www.linkedin.com/company/databricks",
    actionLabel: "Open LinkedIn",
    freshnessLabel: "31 min ago",
    dateLabel: "Apr 18, 2026",
    isNew: true,
    summary: "Databricks is pushing a warehouse-migration narrative that says value comes from platform consolidation, governed AI, and faster legacy decommissioning. This is a direct modernization story Netezza should answer quickly.",
  },
  {
    id: "market-signal-databricks-website",
    competitor: "Databricks",
    group: "website",
    sourceLabel: "Website",
    sourceBadge: "WEBSITE",
    sourceUrl: "https://docs.databricks.com/aws/en/release-notes/product/2026/april",
    actionLabel: "Open release notes",
    freshnessLabel: "1 day ago",
    dateLabel: "Apr 17, 2026",
    isNew: true,
    summary: "Databricks' April 2026 platform notes add query-based connectors for Teradata, Oracle, SQL Server, MySQL, and more, while also expanding AI governance. The current website story is strengthening migration plus governance at the same time.",
  },
  {
    id: "market-signal-databricks-tr",
    competitor: "Databricks",
    group: "reviews",
    sourceLabel: "TrustRadius",
    sourceBadge: "TRUSTRADIUS",
    sourceUrl: "https://www.trustradius.com/products/databricks-data-intelligence-platform/reviews",
    actionLabel: "View TrustRadius",
    freshnessLabel: "Snapshot",
    dateLabel: "Apr 17, 2026",
    isNew: false,
    summary: "TrustRadius currently shows Databricks at 8.8/10 across 109 ratings. The page reinforces platform breadth and data/AI unification, giving PMM a live benchmark to counter with simpler operational proof.",
  },
  {
    id: "market-signal-snowflake-linkedin",
    competitor: "Snowflake",
    group: "social",
    sourceLabel: "LinkedIn",
    sourceBadge: "LINKEDIN",
    sourceUrl: "https://www.linkedin.com/company/snowflake-computing",
    actionLabel: "Open LinkedIn",
    freshnessLabel: "5 days ago",
    dateLabel: "Apr 13, 2026",
    isNew: true,
    summary: "Snowflake is promoting a migration case study claiming 30% cost savings after moving off physical infrastructure. That message directly targets on-prem and legacy warehouse buyers considering modernization.",
  },
  {
    id: "market-signal-snowflake-g2",
    competitor: "Snowflake",
    group: "reviews",
    sourceLabel: "G2",
    sourceBadge: "G2",
    sourceUrl: "https://www.g2.com/products/snowflake/reviews",
    actionLabel: "View G2",
    freshnessLabel: "3 days ago",
    dateLabel: "Apr 15, 2026",
    isNew: true,
    summary: "A recent G2 review describes Snowflake as reliable and fast for large analytics workloads with straightforward setup, while still noting limited low-level control. Ease plus scale remains Snowflake's strongest review pattern.",
  },
  {
    id: "market-signal-snowflake-website",
    competitor: "Snowflake",
    group: "website",
    sourceLabel: "Website",
    sourceBadge: "WEBSITE",
    sourceUrl: "https://www.snowflake.com/en/migrate-to-the-cloud/",
    actionLabel: "Open page",
    freshnessLabel: "Current page",
    dateLabel: "Apr 18, 2026",
    isNew: false,
    summary: "Snowflake's migration page now leads with free AI-powered migration tools and the Snowpark Migration Accelerator. The website is openly framing migration speed and low-risk modernization as a core demand-gen lever.",
  },
  {
    id: "market-signal-redshift-blog",
    competitor: "Amazon Redshift",
    group: "blog",
    sourceLabel: "Blog",
    sourceBadge: "BLOG",
    sourceUrl: "https://aws.amazon.com/blogs/big-data/amazon-redshift-dc2-migration-approach-with-a-customer-case-study/",
    actionLabel: "Open blog",
    freshnessLabel: "1 month ago",
    dateLabel: "Mar 11, 2026",
    isNew: false,
    summary: "AWS published a fresh Redshift migration case study focused on moving from DC2 to RA3 for better ETL performance, more storage, and cost efficiency. Migration storytelling is still a visible Redshift growth motion.",
  },
  {
    id: "market-signal-bigquery-blog",
    competitor: "Google BigQuery",
    group: "blog",
    sourceLabel: "Blog",
    sourceBadge: "BLOG",
    sourceUrl: "https://cloud.google.com/blog/products/data-analytics/using-the-fully-managed-remote-bigquery-mcp-server-to-build-data-ai-agents",
    actionLabel: "Open blog",
    freshnessLabel: "3 months ago",
    dateLabel: "Jan 7, 2026",
    isNew: false,
    summary: "Google Cloud is using its blog to position BigQuery as the analytics backbone for AI agents through the managed remote MCP server. That keeps BigQuery tightly associated with modern AI-native analytics workflows.",
  },
  {
    id: "market-signal-bigquery-tr",
    competitor: "Google BigQuery",
    group: "reviews",
    sourceLabel: "TrustRadius",
    sourceBadge: "TRUSTRADIUS",
    sourceUrl: "https://www.trustradius.com/products/google-bigquery/reviews",
    actionLabel: "View TrustRadius",
    freshnessLabel: "4 months ago",
    dateLabel: "Jan 2, 2026",
    isNew: false,
    summary: "A recent TrustRadius review positions BigQuery as the central analytical warehouse for large-scale event analytics and product metrics, but still calls out cost optimization and debugging friction. The signal is strong capability with ongoing economics pressure.",
  },
  {
    id: "market-signal-azure-website",
    competitor: "Azure Synapse",
    group: "website",
    sourceLabel: "Website",
    sourceBadge: "WEBSITE",
    sourceUrl: "https://azure.microsoft.com/en-us/products/synapse-analytics/",
    actionLabel: "Open page",
    freshnessLabel: "Current page",
    dateLabel: "Apr 18, 2026",
    isNew: false,
    summary: "Azure Synapse now explicitly pushes 'Migrate to Fabric' on the product page, signaling that Microsoft's current website motion is more about transition and modernization than net-new Synapse differentiation.",
  },
  {
    id: "market-signal-azure-tr",
    competitor: "Azure Synapse",
    group: "reviews",
    sourceLabel: "TrustRadius",
    sourceBadge: "TRUSTRADIUS",
    sourceUrl: "https://www.trustradius.com/products/azure-synapse-analytics/reviews/all",
    actionLabel: "View TrustRadius",
    freshnessLabel: "Review snapshot",
    dateLabel: "Aug 12, 2025",
    isNew: false,
    summary: "Recent TrustRadius commentary says Synapse works well for large data warehouse scenarios but is lagging in active development and trails Databricks in some feature areas. That creates a visible vulnerability in competitive comparisons.",
  },
  {
    id: "market-signal-teradata-linkedin",
    competitor: "Teradata",
    group: "social",
    sourceLabel: "LinkedIn",
    sourceBadge: "LINKEDIN",
    sourceUrl: "https://www.linkedin.com/company/teradata",
    actionLabel: "Open LinkedIn",
    freshnessLabel: "3 hours ago",
    dateLabel: "Apr 18, 2026",
    isNew: true,
    summary: "Teradata's latest LinkedIn update claims its MCP Server is helping a major financial-services customer deliver 50% faster responses, 20%+ higher satisfaction, and roughly 30% lower operational cost. Teradata is leaning hard into governed agentic AI value stories.",
  },
];

const DEFAULT_FOCUS_PRODUCT_ID = "ibm-netezza";
const DEFAULT_PRODUCT_PRESETS = [
  {
    id: DEFAULT_FOCUS_PRODUCT_ID,
    displayName: "IBM Netezza",
    productName: "IBM Netezza Performance Server",
    shortName: "Netezza",
    family: "Data and AI",
    description: "Hybrid data warehouse and governed structured analytics focus.",
    productUrl: "https://www.ibm.com/products/netezza",
    g2Url: "https://www.g2.com/products/ibm-netezza/reviews",
    trustRadiusUrl: "https://www.trustradius.com/products/ibm-netezza-performance-server/reviews",
    blogUrl: "https://www.ibm.com/new/announcements/netezza-in-2026-powering-the-future-of-enterprise-analytics",
    linkedinUrl: "https://www.linkedin.com/showcase/ibm-netezza/",
    primaryBuyer: "Data leaders, platform owners, analytics teams",
  },
  {
    id: "db2-warehouse",
    displayName: "IBM Db2 Warehouse",
    productName: "IBM Db2 Warehouse",
    shortName: "Db2 Warehouse",
    family: "Data and AI",
    description: "Cloud warehouse and SQL analytics modernization focus.",
    productUrl: "https://www.ibm.com/products/db2-warehouse",
    g2Url: "",
    trustRadiusUrl: "",
    blogUrl: "https://www.ibm.com/blog/tag/db2/",
    linkedinUrl: "https://www.linkedin.com/company/ibm/",
    primaryBuyer: "Database leaders, application owners, cloud analytics teams",
  },
];

const PRODUCT_INTELLIGENCE_BY_ID = {
  "ibm-netezza": {
    contentAlert: {
      title: "Priority: prove why lakehouses need a performant warehouse engine",
      copy: "The strongest content opportunity is to turn current competitor claims into buyer-facing decision tools: Databricks lakehouse SQL execution, Snowflake warehouse cost governance, Redshift lakehouse analytics, BigQuery AI analytics, Fabric migration pressure, and Teradata VantageCloud Lake modernization.",
    },
    contentIdeas: [
      {
        id: "netezza-content-snowflake-cost-control",
        icon: "$",
        title: "Snowflake cost governance vs Netezza workload control",
        summary: "Create a CFO/CDO asset that explains why credit-based cloud warehouse flexibility still needs workload discipline, chargeback, and predictable governance.",
        platform: "Blog + LinkedIn carousel",
        status: "High priority",
        tags: ["Counter-Snowflake", "Cost governance", "CFO"],
        outline: `DRAFT OUTLINE - Blog + LinkedIn Carousel

Working title: Cloud warehouse flexibility is not the same as cost control

Section 1 - What Snowflake tells buyers: elastic warehouses, AI Data Cloud, near-zero maintenance
Section 2 - What buyers still need to govern: warehouse sizing, serverless features, credit consumption, data transfer, and chargeback
Section 3 - Where Netezza can stand out
- Workload-specific architecture
- Governed analytics discipline
- Hybrid control for regulated estates
- Performance planning before usage sprawl
Section 4 - CFO/CDO checklist: questions to ask before accepting usage-driven economics

CTA: Request the analytics cost-governance workshop.`,
      },
      {
        id: "netezza-content-databricks-sql-line",
        icon: "!",
        title: "Databricks SQL proves the point: lakehouses need warehouse-grade execution",
        summary: "A comparison piece that respects Databricks SQL while showing where Netezza can be the governed, high-performance engine for BI-heavy lakehouse analytics.",
        platform: "Comparison landing page",
        status: "Urgent",
        tags: ["Counter-Databricks", "Lakehouse", "Performance engine"],
        outline: `DRAFT OUTLINE - Comparison Landing Page

Headline: A lakehouse is only as strong as the engine running its most important queries.

Section 1 - What Databricks SQL is good at: lakehouse-native analytics, data science adjacency, Unity Catalog governance
Section 2 - Where buyers should slow down
- BI-heavy repeat workloads
- Warehouse-grade performance expectations
- Regulated workload placement
- Operational simplicity and ownership
Section 3 - Where Netezza should lead
- Governed lakehouse query execution
- Iceberg, object storage, and watsonx.data adjacency
- Hybrid deployment choice
- Predictable workload-fit performance
Section 4 - Decision matrix: which engine should run which lakehouse workload

CTA: Download the workload-fit decision checklist.`,
      },
      {
        id: "netezza-content-redshift-automation",
        icon: "[]",
        title: "Redshift automation is useful - but AWS gravity should not decide warehouse strategy",
        summary: "Counter AWS-native defaults with a practical guide for enterprises that run hybrid estates and need governance, workload portability, and cross-cloud control.",
        platform: "Buyer checklist",
        status: "High priority",
        tags: ["Counter-Redshift", "AWS", "Hybrid"],
        outline: `DRAFT OUTLINE - Buyer Checklist

Section 1 - What Redshift is making easier: automated ingestion, maintenance, and AWS-native modernization
Section 2 - What AWS-native messaging can hide
- Cross-estate governance
- Non-AWS workload placement
- Migration sequencing
- Vendor concentration
Section 3 - Where Netezza can differentiate
- Hybrid deployment control
- IBM trust for regulated analytics
- Workload-fit modernization without forcing every workload into one cloud

CTA: Run the hybrid warehouse readiness assessment.`,
      },
      {
        id: "netezza-content-bigquery-ai",
        icon: "#",
        title: "BigQuery's AI platform story raises the bar for Netezza proof",
        summary: "Build an AI-readiness narrative that positions Netezza as the governed analytical foundation for AI and BI, not as a copy of BigQuery's autonomous data-to-AI platform.",
        platform: "Executive POV",
        status: "New",
        tags: ["Counter-BigQuery", "AI readiness", "Governance"],
        outline: `DRAFT OUTLINE - Executive POV

Opening: AI analytics is only as trustworthy as the data foundation underneath it.

Point 1 - BigQuery is pushing from data warehouse to autonomous data and AI platform
Point 2 - Enterprise buyers still need governed workload placement, explainability, and controls
Point 3 - Netezza's angle: trusted, high-performance structured analytics for teams that need AI-ready data without losing governance discipline
Point 4 - Proof IBM should show: watsonx.data connection, governed access, workload performance, and regulated-readiness examples

CTA: Book a governed AI analytics briefing.`,
      },
      {
        id: "netezza-content-fabric-migration",
        icon: "=",
        title: "What Synapse-to-Fabric migration pressure teaches warehouse buyers",
        summary: "Use Microsoft's own Fabric migration motion as a cautionary story about platform churn, roadmap clarity, and protecting analytical workloads from forced transitions.",
        platform: "LinkedIn article",
        status: "",
        tags: ["Counter-Synapse", "Fabric", "Migration risk"],
        outline: `DRAFT OUTLINE - LinkedIn Article

Section 1 - Why platform roadmap shifts matter to data warehouse buyers
Section 2 - What Synapse-to-Fabric migration pressure reveals: transitions require planning, skill changes, and workflow validation
Section 3 - Netezza response: stable workload-fit modernization for teams that value control and continuity
Section 4 - Questions to ask every vendor about roadmap risk

CTA: Share the roadmap-risk checklist with platform owners.`,
      },
      {
        id: "netezza-content-teradata-vantagecloud",
        icon: "^",
        title: "Teradata VantageCloud Lake is selling AI analytics modernization - Netezza needs proof of simpler time-to-value",
        summary: "Create a competitive response that acknowledges Teradata's enterprise credibility while pressing on simplicity, migration proof, and IBM stack alignment.",
        platform: "Sales enablement article",
        status: "",
        tags: ["Counter-Teradata", "AI analytics", "Time-to-value"],
        outline: `DRAFT OUTLINE - Sales Enablement Article

Section 1 - What Teradata is emphasizing: VantageCloud Lake, ClearScape Analytics, AI/ML workloads, flexible deployment
Section 2 - Where Netezza should not fight feature-for-feature
Section 3 - Netezza angle: simpler governed analytics modernization with IBM trust and focused workload performance
Section 4 - Seller proof points: migration path, hybrid control, cost governance, and regulated analytics fit

CTA: Use this in Teradata displacement and renewal-risk accounts.`,
      },
    ],
    pmmActionAlert: {
      title: "Urgent PMM actions - build lakehouse execution response assets",
      copy: "Prioritize four assets: Databricks SQL execution page, Snowflake cost-governance brief, Redshift open-lakehouse checklist, and BigQuery AI-readiness POV. Each should give sellers a clear proof point for why lakehouse architectures still need a performant governed engine.",
    },
    pmmActions: [
      {
        id: "netezza-pmm-snowflake-cost-brief",
        icon: "$",
        title: "CFO brief: Netezza vs Snowflake cost governance",
        summary: "Executive-ready asset focused on credit consumption, warehouse sizing, serverless usage, and workload governance.",
        status: "Urgent",
        outline: `OUTLINE - CFO Brief

Section 1 - The Snowflake appeal: elasticity, managed experience, AI Data Cloud momentum
Section 2 - The risk: cost governance depends on workload discipline, warehouse sizing, serverless feature use, and chargeback design
Section 3 - Netezza counter-position
- Governed workload-fit analytics
- Hybrid control
- Predictable performance planning
- IBM trust for regulated estates
Section 4 - Questions CFOs and CDOs should ask before committing
Section 5 - Proof PMM must attach: workload examples, cost-control model, governance checklist`,
      },
      {
        id: "netezza-pmm-databricks-sql-battlecard",
        icon: "X",
        title: "Battle card: Netezza vs Databricks SQL",
        summary: "Seller card for lakehouse-SQL evaluations where Databricks is positioned as the default execution layer for modern analytics.",
        status: "Urgent",
        outline: `OUTLINE - Battle card: Netezza vs Databricks SQL

When Netezza wins
- BI-heavy repeat analytics
- Regulated structured workloads
- Warehouse-grade query performance expectations
- Open data that needs governed execution
- Hybrid deployment and data residency needs

When Databricks wins
- Data science adjacency
- Lakehouse-native pipelines
- Unified ML and analytics workflows

Landmines
- Do not attack lakehouse broadly
- Ask which engine should run the most valuable lakehouse workloads
- Force clarity on operational ownership, skill fit, BI performance, and cost expectations`,
      },
      {
        id: "netezza-pmm-redshift-hybrid-checklist",
        icon: "[]",
        title: "Buyer checklist: Netezza vs Redshift for hybrid enterprises",
        summary: "Checklist for accounts where AWS-native alignment is creating default pull toward Redshift.",
        status: "High priority",
        outline: `OUTLINE - Buyer Checklist

Question 1 - Is the target workload fully AWS-native or cross-estate?
Question 2 - How will governance work outside AWS?
Question 3 - What migration sequencing risk exists?
Question 4 - Which workloads need predictable performance before elasticity?
Question 5 - How important are data residency, hybrid control, and regulated-readiness?

Recommended PMM move
- Build one checklist PDF and one seller talk track.
- Pair with a Redshift comparison landing page.`,
      },
      {
        id: "netezza-pmm-bigquery-ai-pov",
        icon: "!",
        title: "Executive POV: Netezza response to BigQuery's AI data platform",
        summary: "Thought-leadership asset reframing AI analytics around governed lakehouse data, workload-fit architecture, and predictable query execution.",
        status: "New",
        outline: `OUTLINE - Executive POV

Opening - AI analytics depends on trusted data foundations.
Point 1 - BigQuery is moving from warehouse to autonomous data and AI platform.
Point 2 - Enterprises need control, residency, explainability, and workload governance.
Point 3 - Netezza should own the performant warehouse engine role for governed lakehouse analytics.
Point 4 - IBM proof needed: watsonx connection, security, performance, hybrid control.

Distribution
- Executive LinkedIn post
- Blog version
- Seller email snippet`,
      },
      {
        id: "netezza-pmm-teradata-renewal-play",
        icon: "^",
        title: "Renewal play: Netezza vs Teradata VantageCloud Lake",
        summary: "PMM and seller kit for Teradata accounts evaluating VantageCloud Lake modernization and AI analytics.",
        status: "",
        outline: `OUTLINE - Renewal / Displacement Play

Section 1 - Teradata message: VantageCloud Lake, ClearScape Analytics, AI/ML workloads, multi-cloud flexibility
Section 2 - Netezza counter: simpler governed modernization, IBM ecosystem, lakehouse-ready warehouse execution
Section 3 - Discovery questions
- What workloads require AI/ML in-platform?
- What migration timeline is realistic?
- What proof of time-to-value is needed?
Section 4 - Assets needed
- Comparison brief
- Migration workshop
- Proof checklist`,
      },
    ],
    marketSignals: [
      {
        id: "netezza-signal-snowflake-cost",
        competitor: "Snowflake",
        group: "website",
        sourceLabel: "Docs",
        sourceBadge: "COST",
        sourceUrl: "https://docs.snowflake.com/en/user-guide/warehouses-considerations",
        actionLabel: "Open Snowflake docs",
        freshnessLabel: "Current docs",
        dateLabel: "May 18, 2026",
        isNew: true,
        summary: "Snowflake's warehouse model gives buyers elasticity, but warehouse size, multi-cluster usage, serverless features, and credits make cost governance a constant operating task. Netezza should publish content showing how a performant warehouse engine keeps lakehouse analytics predictable for CFOs and CDOs.",
      },
      {
        id: "netezza-signal-databricks-sql",
        competitor: "Databricks",
        group: "website",
        sourceLabel: "Docs",
        sourceBadge: "SQL",
        sourceUrl: "https://docs.databricks.com/en/compute/sql-warehouse/index.html",
        actionLabel: "Open Databricks docs",
        freshnessLabel: "Current docs",
        dateLabel: "May 18, 2026",
        isNew: true,
        summary: "Databricks positions SQL warehouses as compute resources for querying and exploring data on the lakehouse. Netezza should use this as validation that the lakehouse needs a warehouse engine, then show where IBM can deliver governed, high-performance execution for repeat analytics.",
      },
      {
        id: "netezza-signal-redshift-automation",
        competitor: "Amazon Redshift",
        group: "website",
        sourceLabel: "Features",
        sourceBadge: "AWS",
        sourceUrl: "https://aws.amazon.com/redshift/features/",
        actionLabel: "Open Redshift features",
        freshnessLabel: "Current page",
        dateLabel: "May 18, 2026",
        isNew: false,
        summary: "Redshift emphasizes automation around ingestion, table maintenance, production tuning, and lakehouse analytics. Netezza should not fight automation; it should show why open lakehouse execution, hybrid control, governance, and workload placement still matter when AWS-native defaults are not enough.",
      },
      {
        id: "netezza-signal-bigquery-ai",
        competitor: "Google BigQuery",
        group: "website",
        sourceLabel: "Product page",
        sourceBadge: "AI",
        sourceUrl: "https://cloud.google.com/products/bigquery",
        actionLabel: "Open BigQuery page",
        freshnessLabel: "Current page",
        dateLabel: "May 18, 2026",
        isNew: false,
        summary: "BigQuery is presenting itself as an autonomous data-to-AI platform. Netezza needs a governed AI-readiness narrative that connects trusted lakehouse data, IBM controls, and workload-specific warehouse performance.",
      },
      {
        id: "netezza-signal-synapse-fabric",
        competitor: "Azure Synapse",
        group: "website",
        sourceLabel: "Microsoft Learn",
        sourceBadge: "FABRIC",
        sourceUrl: "https://learn.microsoft.com/en-us/azure/data-factory/how-to-upgrade-your-azure-synapse-analytics-pipelines-to-fabric-data-factory",
        actionLabel: "Open Microsoft Learn",
        freshnessLabel: "Current guidance",
        dateLabel: "May 18, 2026",
        isNew: false,
        summary: "Microsoft guidance around modernizing Synapse pipelines into Fabric creates a clear opening: Netezza can publish roadmap-risk and migration-continuity content for buyers who want modernization without repeated platform transitions.",
      },
      {
        id: "netezza-signal-teradata-lake",
        competitor: "Teradata",
        group: "website",
        sourceLabel: "Product page",
        sourceBadge: "AI/ML",
        sourceUrl: "https://www.teradata.com/Cloud/Data-Lake",
        actionLabel: "Open Teradata page",
        freshnessLabel: "Current page",
        dateLabel: "May 18, 2026",
        isNew: false,
        summary: "Teradata VantageCloud Lake is pushing flexible AI/ML analytics and open ecosystem messaging. Netezza should respond with a simpler time-to-value story for governed lakehouse modernization and performant warehouse execution, not a broad feature-by-feature reply.",
      },
      {
        id: "netezza-social-snowflake-linkedin",
        competitor: "Snowflake",
        group: "social",
        sourceLabel: "LinkedIn",
        sourceBadge: "LINKEDIN",
        sourceUrl: "https://www.linkedin.com/company/snowflake-computing/posts/",
        actionLabel: "Open Snowflake LinkedIn",
        freshnessLabel: "Social feed",
        dateLabel: "May 19, 2026",
        isNew: true,
        summary: "Snowflake's social motion keeps reinforcing AI Data Cloud, migration, and customer-success narratives. Netezza should counter with posts that make cost governance, workload placement, and hybrid control more tangible for CDO and platform audiences.",
      },
      {
        id: "netezza-social-databricks-linkedin",
        competitor: "Databricks",
        group: "social",
        sourceLabel: "LinkedIn",
        sourceBadge: "LINKEDIN",
        sourceUrl: "https://www.linkedin.com/company/databricks/posts/",
        actionLabel: "Open Databricks LinkedIn",
        freshnessLabel: "Social feed",
        dateLabel: "May 19, 2026",
        isNew: true,
        summary: "Databricks continues to use social channels to connect lakehouse, data intelligence, governance, and AI into one modernization story. Netezza should avoid a broad AI-platform fight and respond with BI-heavy lakehouse execution guidance.",
      },
      {
        id: "netezza-social-teradata-linkedin",
        competitor: "Teradata",
        group: "social",
        sourceLabel: "LinkedIn",
        sourceBadge: "LINKEDIN",
        sourceUrl: "https://www.linkedin.com/company/teradata/posts/",
        actionLabel: "Open Teradata LinkedIn",
        freshnessLabel: "Social feed",
        dateLabel: "May 19, 2026",
        isNew: false,
        summary: "Teradata social messaging leans into trusted enterprise analytics, AI/ML, and customer value stories. Netezza should use social content to show simpler modernization paths and IBM ecosystem proof for Teradata renewal-risk accounts.",
      },
      {
        id: "netezza-review-snowflake-g2",
        competitor: "Snowflake",
        group: "reviews",
        sourceLabel: "G2",
        sourceBadge: "G2",
        sourceUrl: "https://www.g2.com/products/snowflake/reviews",
        actionLabel: "Open Snowflake G2",
        freshnessLabel: "Review snapshot",
        dateLabel: "May 19, 2026",
        isNew: false,
        summary: "Snowflake review surfaces are useful for tracking the ease-of-use and performance halo that PMM must neutralize. Netezza should pair any Snowflake comparison with a finance-ready cost-control and workload-governance checklist.",
      },
      {
        id: "netezza-review-databricks-g2",
        competitor: "Databricks",
        group: "reviews",
        sourceLabel: "G2",
        sourceBadge: "G2",
        sourceUrl: "https://www.g2.com/products/databricks-data-intelligence-platform/reviews",
        actionLabel: "Open Databricks G2",
        freshnessLabel: "Review snapshot",
        dateLabel: "May 19, 2026",
        isNew: false,
        summary: "Databricks review pages help expose where platform breadth is valued and where complexity can become a buying concern. Netezza content should use this to clarify when lakehouse breadth still needs a focused performance engine for governed BI-heavy workloads.",
      },
      {
        id: "netezza-review-redshift-trustradius",
        competitor: "Amazon Redshift",
        group: "reviews",
        sourceLabel: "TrustRadius",
        sourceBadge: "TRUSTRADIUS",
        sourceUrl: "https://www.trustradius.com/products/redshift/reviews",
        actionLabel: "Open Redshift TrustRadius",
        freshnessLabel: "Review snapshot",
        dateLabel: "May 19, 2026",
        isNew: false,
        summary: "Redshift review surfaces are useful for AWS-native buyer language around performance, integration, and operational tradeoffs. Netezza should use those themes to prepare hybrid-enterprise objection handling.",
      },
      {
        id: "netezza-review-bigquery-trustradius",
        competitor: "Google BigQuery",
        group: "reviews",
        sourceLabel: "TrustRadius",
        sourceBadge: "TRUSTRADIUS",
        sourceUrl: "https://www.trustradius.com/products/google-bigquery/reviews",
        actionLabel: "Open BigQuery TrustRadius",
        freshnessLabel: "Review snapshot",
        dateLabel: "May 19, 2026",
        isNew: false,
        summary: "BigQuery review pages are good inputs for cost, scale, and cloud-native analytics language. Netezza should mine these signals for AI-readiness content that does not sacrifice governance or workload control.",
      },
      {
        id: "netezza-blog-snowflake-ai-data-cloud",
        competitor: "Snowflake",
        group: "blog",
        sourceLabel: "Blog",
        sourceBadge: "BLOG",
        sourceUrl: "https://www.snowflake.com/en/blog/",
        actionLabel: "Open Snowflake blog",
        freshnessLabel: "Content feed",
        dateLabel: "May 19, 2026",
        isNew: true,
        summary: "Snowflake blog content is a strong monitor for AI Data Cloud, Cortex, migration, and app-development narratives. Netezza should turn recurring Snowflake themes into comparison pages and CFO-ready economics content.",
      },
      {
        id: "netezza-blog-databricks-lakehouse",
        competitor: "Databricks",
        group: "blog",
        sourceLabel: "Blog",
        sourceBadge: "BLOG",
        sourceUrl: "https://www.databricks.com/blog",
        actionLabel: "Open Databricks blog",
        freshnessLabel: "Content feed",
        dateLabel: "May 19, 2026",
        isNew: true,
        summary: "Databricks blog content remains the best signal for lakehouse, data intelligence, SQL warehouse, and AI governance messaging. Netezza should respond with a source-backed guide on why lakehouse strategy still depends on performant warehouse execution.",
      },
      {
        id: "netezza-blog-redshift-big-data",
        competitor: "Amazon Redshift",
        group: "blog",
        sourceLabel: "AWS Big Data Blog",
        sourceBadge: "BLOG",
        sourceUrl: "https://aws.amazon.com/blogs/big-data/category/database/amazon-redshift/",
        actionLabel: "Open Redshift blog",
        freshnessLabel: "Content feed",
        dateLabel: "May 19, 2026",
        isNew: false,
        summary: "AWS Redshift blog content often turns product automation, migration, and AWS integration into practical buyer proof. Netezza should counter with hybrid control, governance consistency, and non-AWS workload-placement content.",
      },
      {
        id: "netezza-blog-google-data-analytics",
        competitor: "Google BigQuery",
        group: "blog",
        sourceLabel: "Google Cloud Blog",
        sourceBadge: "BLOG",
        sourceUrl: "https://cloud.google.com/blog/products/data-analytics",
        actionLabel: "Open Google data analytics blog",
        freshnessLabel: "Content feed",
        dateLabel: "May 19, 2026",
        isNew: false,
        summary: "Google Cloud's data analytics blog is the best content feed for BigQuery AI, agents, and autonomous analytics messaging. Netezza should use it to build a governed AI-ready analytics POV for enterprise buyers.",
      },
    ],
    productCriticalGap: {
      title: "Critical gap - proof packaging for lakehouse execution",
      copy: "The product story is credible, but the market-facing proof needs sharper competitor packaging: Databricks SQL execution, Snowflake cost governance, Redshift lakehouse analytics, BigQuery AI-readiness, Fabric migration continuity, and Teradata time-to-value.",
    },
    productRemainingGaps: [
      {
        priority: "P1 - Critical",
        title: "Build a Snowflake cost-governance proof pack",
        gapScore: "7.0 / 10",
        copy: "Snowflake's usage model is powerful but creates a constant need for warehouse sizing, credit governance, serverless monitoring, and chargeback. Netezza needs CFO-ready proof that explains predictable workload governance in concrete terms.",
        current: "Hybrid deployment control, workload-fit analytics, IBM governance story",
        leverage: "Cost-governance calculator, workload planning workshop, CFO brief",
        impact: "CFO, CDO, VP Data Platform",
        competitors: ["Snowflake virtual warehouses", "Snowflake serverless features", "BigQuery slot / on-demand economics"],
      },
      {
        priority: "P1 - Critical",
        title: "Clarify Netezza as the performance engine for lakehouse workloads",
        gapScore: "6.8 / 10",
        copy: "Databricks SQL gives the lakehouse a warehouse-like buying path. Netezza needs a crisp decision guide showing where governed, BI-heavy lakehouse analytics benefit from a focused performant warehouse engine.",
        current: "Iceberg/open data support, watsonx.data integration, hybrid flexibility, regulated workload fit",
        leverage: "Lakehouse execution decision matrix and seller battle card",
        impact: "CDO, Data Architect, BI Lead",
        competitors: ["Databricks SQL", "Unity Catalog governed lakehouse", "Lakehouse migration narrative"],
      },
      {
        priority: "P2 - High",
        title: "Make AI-readiness proof specific",
        gapScore: "6.2 / 10",
        copy: "BigQuery, Snowflake, Databricks, and Teradata all connect warehouse decisions to AI. Netezza should show how governed structured analytics supports AI readiness through trusted data, workload controls, and IBM AI/data portfolio integration.",
        current: "Netezza analytics foundation and IBM Data and AI portfolio adjacency",
        leverage: "Governed AI analytics briefing and watsonx-connected reference architecture",
        impact: "Head of AI, CDO, Enterprise Architect",
        competitors: ["BigQuery AI platform", "Snowflake Cortex", "Databricks AI/lakehouse", "Teradata ClearScape Analytics"],
      },
    ],
    productConfirmedCapabilities: [
      "Appliance, SaaS, BYOC on AWS/Azure, and software-only deployment choices",
      "Open table and open data format support, including Apache Iceberg and Parquet",
      "Native Cloud Object Storage (NCOS) generally available on AWS and Azure",
      "Integration with IBM watsonx.data for hybrid analytics and AI workloads",
      "AI-powered Netezza Database Assistant for DBA troubleshooting and operations",
      "DBT-enabled data loading and cloud object storage support",
      "Time Travel and unified metadata management called out in IBM's 2026 roadmap update",
      "HIPAA-ready and SOC 2 Type 2 security posture referenced in IBM's 2026 update",
    ],
    productConfirmedStrengths: [
      {
        status: "Verified IBM proof",
        title: "Deployment choice is a real competitive wedge",
        summary: "IBM positions Netezza across appliance, SaaS, BYOC on AWS/Azure, and software-only models. That gives PMM a concrete answer when Snowflake, BigQuery, and Redshift try to make cloud-only operating models feel inevitable.",
        leverage: "Lead regulated-industry and data-sovereignty content with deployment choice, then tie it to workload placement and governance.",
        tags: ["Hybrid", "BYOC", "Regulated workloads"],
      },
      {
        status: "Verified IBM proof",
        title: "NCOS gives Netezza a cleaner cost-control story",
        summary: "IBM announced NCOS as generally available on AWS and Azure, with object-storage economics under the familiar Netezza experience. This is the strongest proof point for Snowflake and BigQuery cost-governance comparisons.",
        leverage: "Turn NCOS into a CFO brief, calculator narrative, and seller discovery checklist.",
        tags: ["NCOS", "Cost governance", "Snowflake counter"],
      },
      {
        status: "Verified IBM proof",
        title: "Open formats plus watsonx.data make the engine story credible",
        summary: "IBM's product page and 2026 update point to Apache Iceberg, Parquet, native cloud object storage, and watsonx.data integration. PMM should use this to show how Netezza complements open lakehouse architectures with governed warehouse execution.",
        leverage: "Create a decision guide for when Netezza should run high-value lakehouse workloads that need predictable performance and control.",
        tags: ["Iceberg", "watsonx.data", "Lakehouse execution"],
      },
    ],
    productCapabilityMatrix: [
      { capability: "Hybrid / on-prem deployment", note: "Appliance, SaaS, BYOC, and software-only options", statuses: { Netezza: "strong", Databricks: "gap", Snowflake: "gap", "Amazon Redshift": "partial", "Google BigQuery": "gap", "Azure Synapse": "partial", Teradata: "strong" }, gapScore: 0 },
      { capability: "Cost-governed object storage", note: "NCOS on AWS and Azure", statuses: { Netezza: "strong", Databricks: "partial", Snowflake: "partial", "Amazon Redshift": "partial", "Google BigQuery": "partial", "Azure Synapse": "partial", Teradata: "partial" }, gapScore: 1.5 },
      { capability: "Open table / open data formats", note: "Iceberg, Parquet, and lakehouse integration", statuses: { Netezza: "strong", Databricks: "strong", Snowflake: "strong", "Amazon Redshift": "partial", "Google BigQuery": "strong", "Azure Synapse": "partial", Teradata: "strong" }, gapScore: 1.8 },
      { capability: "Lakehouse warehouse execution", note: "Open data plus governed high-performance query serving", statuses: { Netezza: "strong", Databricks: "strong", Snowflake: "strong", "Amazon Redshift": "strong", "Google BigQuery": "strong", "Azure Synapse": "partial", Teradata: "strong" }, gapScore: 0 },
      { capability: "AI platform breadth", note: "Native AI/ML and agentic analytics packaging", statuses: { Netezza: "partial", Databricks: "strong", Snowflake: "strong", "Amazon Redshift": "partial", "Google BigQuery": "strong", "Azure Synapse": "partial", Teradata: "strong" }, gapScore: 6.2 },
      { capability: "Serverless / autonomous scaling narrative", note: "Managed scaling and optimization as the buying headline", statuses: { Netezza: "partial", Databricks: "strong", Snowflake: "strong", "Amazon Redshift": "strong", "Google BigQuery": "strong", "Azure Synapse": "partial", Teradata: "partial" }, gapScore: 4.8 },
      { capability: "Roadmap continuity proof", note: "Migration, compatibility, and forced-platform-transition risk", statuses: { Netezza: "strong", Databricks: "partial", Snowflake: "partial", "Amazon Redshift": "partial", "Google BigQuery": "partial", "Azure Synapse": "gap", Teradata: "partial" }, gapScore: 2.4 },
      { capability: "Business-user natural language analytics", note: "Beyond DBA assistance into analyst NLQ", statuses: { Netezza: "partial", Databricks: "strong", Snowflake: "strong", "Amazon Redshift": "partial", "Google BigQuery": "strong", "Azure Synapse": "partial", Teradata: "partial" }, gapScore: 5.8 },
    ],
    positioningDimensions: [
      { label: "Hybrid / on-prem deployment", netezza: 9.3, note: "Use IBM's deployment-choice proof as the first differentiator in regulated and sovereignty-sensitive deals.", competitors: { Databricks: 4.5, Snowflake: 4.0, "Amazon Redshift": 5.5, "Google BigQuery": 3.0, "Azure Synapse": 4.8, Teradata: 8.0 } },
      { label: "Predictable query performance", netezza: 8.6, note: "Keep performance framed around lakehouse workload execution, not benchmark theater.", competitors: { Databricks: 6.8, Snowflake: 7.6, "Amazon Redshift": 7.1, "Google BigQuery": 7.8, "Azure Synapse": 6.8, Teradata: 8.2 } },
      { label: "Regulated industry compliance", netezza: 8.8, note: "Tie IBM trust, deployment control, HIPAA-ready, and SOC 2 posture to buyer risk reduction.", competitors: { Databricks: 6.4, Snowflake: 7.3, "Amazon Redshift": 7.2, "Google BigQuery": 6.8, "Azure Synapse": 7.4, Teradata: 8.1 } },
      { label: "SQL-first simplicity for analysts", netezza: 8.4, note: "Use this to show how lakehouse data becomes easier for BI teams when the execution layer is purpose-built and governed.", competitors: { Databricks: 6.1, Snowflake: 8.3, "Amazon Redshift": 7.3, "Google BigQuery": 7.8, "Azure Synapse": 6.8, Teradata: 7.3 } },
      { label: "TCO predictability", netezza: 8.2, note: "NCOS and workload planning make the cost story more concrete than generic predictability claims.", competitors: { Databricks: 5.8, Snowflake: 5.7, "Amazon Redshift": 6.3, "Google BigQuery": 6.1, "Azure Synapse": 6.0, Teradata: 6.4 } },
      { label: "AI / ML ecosystem", netezza: 7.1, note: "Netezza should position as a governed AI-ready analytics foundation, not an all-in-one AI platform clone.", competitors: { Databricks: 9.4, Snowflake: 8.6, "Amazon Redshift": 7.4, "Google BigQuery": 9.0, "Azure Synapse": 7.7, Teradata: 8.0 } },
    ],
    messagePillars: [
      { tone: "pillar-content", title: "Lakehouse performance engine", text: "Make Netezza the choice for lakehouse workloads where governance, query speed, placement, and reliability matter more than platform breadth." },
      { tone: "pillar-events", title: "Hybrid choice", text: "Use appliance, SaaS, BYOC, and software-only deployment options as a concrete answer when lakehouse strategy must span regulated or hybrid estates." },
      { tone: "pillar-market", title: "Cost discipline", text: "Turn NCOS, workload planning, and object-storage economics into a direct counter to usage-driven query spend concerns." },
      { tone: "pillar-product", title: "Open data execution", text: "Use Iceberg, Parquet, watsonx.data, and metadata integration to make Netezza credible inside open lakehouse architectures." },
      { tone: "pillar-positioning", title: "AI-ready foundation", text: "Frame Netezza as trusted lakehouse analytics execution for AI and BI programs that need governed data before agentic ambition." },
    ],
    positioningRecommendation: {
      label: "Netezza positioning recommendation",
      statement: "The performant warehouse engine for open lakehouse architectures: governed, hybrid, and cost-disciplined execution for enterprise analytics that cannot afford slow or unpredictable queries.",
      evidence: "Use Databricks SQL/lakehouse positioning, Snowflake cost governance, Redshift lakehouse analytics, BigQuery AI-platform momentum, Fabric migration pressure, and Teradata AI analytics messaging as the competitor triggers.",
    },
    pageHighlights: {
      content: [
        { competitor: "Snowflake / Databricks", priority: "Urgent", title: "Publish lakehouse execution decision tools", summary: "The market is not asking whether warehouses matter. Competitors are winning with specific claims around AI, lakehouse SQL, cost, automation, and migration. Netezza content should show where a lakehouse needs a performant governed engine.", recommendation: "Start with Databricks SQL execution and Snowflake cost governance assets.", tags: ["Competitor content", "Lakehouse execution", "PMM"] },
      ],
      events: [
        { competitor: "Snowflake", priority: "Urgent", title: "Create the Snowflake cost-governance CFO brief first", summary: "Snowflake's credit and warehouse model creates a tangible buyer concern that Netezza can address with concrete governance questions and workload-planning proof.", recommendation: "Package CFO brief, seller talk track, and LinkedIn carousel from the same source narrative.", tags: ["CFO", "Cost", "Snowflake"] },
      ],
      market: [
        { competitor: "Across competitors", priority: "High priority", title: "Turn competitor positioning into a weekly lakehouse-execution queue", summary: "Each competitor has a distinct wedge: Databricks SQL/lakehouse, Snowflake cost/AI Data Cloud, Redshift AWS automation, BigQuery autonomous AI, Synapse-to-Fabric migration, and Teradata VantageCloud Lake.", recommendation: "Use the market signal list as the editorial queue for the next 6 weeks.", tags: ["Market signals", "Editorial queue", "Competitive"] },
      ],
      product: [
        { competitor: "Snowflake / Databricks / BigQuery", priority: "P1 - Critical", title: "Proof packaging is the product marketing gap", summary: "Netezza does not need more generic strength claims. It needs sharper proof packages mapped to competitor claims buyers already hear.", recommendation: "Build proof packs for lakehouse execution, cost governance, hybrid control, and AI-ready governed analytics.", tags: ["Proof", "Packaging", "Product marketing"] },
      ],
      positioning: [
        { competitor: "Across competitors", priority: "Primary angle", title: "Position Netezza as the lakehouse performance engine", summary: "The strongest message is that enterprises need lakehouse openness plus workload-fit execution, cost discipline, and governance when competitors push broad platform resets.", recommendation: "Use this line across the homepage, comparison pages, seller scripts, and executive posts.", tags: ["Positioning", "Lakehouse execution", "Governance"] },
      ],
    },
  },
  "db2-warehouse": {
    contentAlert: {
      title: "Priority: Db2 Warehouse modernization story needs sharper packaging",
      copy: "Competitors are selling cloud warehouse migration as a full platform reset. Db2 Warehouse should answer with a lower-risk modernization narrative built around SQL continuity, governance, workload portability, and IBM ecosystem fit.",
    },
    contentIdeas: [
      {
        id: "db2-content-modernization-without-rewrite",
        icon: "[]",
        title: "Modernize warehouse analytics without rewriting the operating model",
        summary: "A buyer guide for teams that want cloud warehouse modernization but cannot absorb a risky platform migration, app rewrite, or governance reset.",
        platform: "Blog / SEO",
        status: "High priority",
        tags: ["Migration", "SQL continuity", "Counter-Snowflake"],
        outline: `DRAFT OUTLINE - Blog / SEO

Working title: Warehouse modernization without rewriting the operating model

Section 1 - Why migration risk is now part of the buying decision
Section 2 - What cloud-first competitors underplay: app dependencies, SQL behavior, governance handoffs, and operational retraining
Section 3 - Where Db2 Warehouse gives teams a lower-risk path
- Familiar Db2 skills and SQL patterns
- IBM governance and security alignment
- Cloud analytics modernization without abandoning core data estate discipline
Section 4 - Evaluation checklist for CIOs and data platform owners

CTA: Request the Db2 Warehouse modernization readiness checklist.`,
      },
      {
        id: "db2-content-ai-ready-sql-foundation",
        icon: "!",
        title: "AI-ready analytics still needs a governed SQL foundation",
        summary: "Counters Databricks and BigQuery AI-native narratives by positioning Db2 Warehouse as the trusted analytical system of record behind governed AI and BI use cases.",
        platform: "Executive POV Post",
        status: "New",
        tags: ["AI readiness", "Governance", "Executive POV"],
        outline: `DRAFT OUTLINE - Executive POV Post

Opening: AI projects do not fail because teams lack ambition. They fail when trusted data foundations are weak.

Point 1 - Why AI-ready analytics still depends on governed, queryable enterprise data
Point 2 - Where all-in-one AI platform narratives can create new risk
Point 3 - How Db2 Warehouse supports trusted analytical workloads while connecting to the broader IBM AI stack
Point 4 - Questions leaders should ask before moving warehouse workloads into an AI-first platform

CTA: Book a governed analytics architecture review.`,
      },
      {
        id: "db2-content-cfo-cost-control",
        icon: "$",
        title: "A CFO checklist for cloud warehouse cost control",
        summary: "Uses review-site cost themes against Snowflake, Databricks, Redshift, and BigQuery to create a finance-friendly Db2 Warehouse evaluation asset.",
        platform: "Executive Brief",
        status: "High priority",
        tags: ["CFO", "TCO", "Cost governance"],
        outline: `DRAFT OUTLINE - Executive Brief

Section 1 - Why usage-driven analytics spend surprises finance teams
Section 2 - The cost controls buyers should verify before migration
Section 3 - Where Db2 Warehouse can frame predictable governance, workload discipline, and IBM commercial alignment
Section 4 - Questions finance leaders should bring into cloud warehouse evaluations

CTA: Request the analytics cost-control scorecard.`,
      },
      {
        id: "db2-content-dba-modernization",
        icon: "#",
        title: "The DBA-led path to warehouse modernization",
        summary: "Targets database leaders and platform teams who need to modernize analytics while preserving operational control, skills, and reliability.",
        platform: "Technical Guide",
        status: "",
        tags: ["DBA", "Platform teams", "Operational control"],
        outline: `DRAFT OUTLINE - Technical Guide

Section 1 - Why database teams are still central to analytical modernization
Section 2 - Common migration failure modes: incompatible SQL, uncontrolled cost, fragmented governance
Section 3 - A Db2 Warehouse modernization pattern for existing enterprise data teams
Section 4 - Proof points to include in demos and workshops
- SQL workload fit
- Performance management
- Governance and access controls
- Integration with IBM data tooling

CTA: Schedule the Db2 Warehouse technical discovery session.`,
      },
    ],
    pmmActionAlert: {
      title: "Urgent PMM actions - Db2 Warehouse modernization narrative",
      copy: "Two assets should move first: (1) a Db2 Warehouse vs Snowflake economics and migration battle card, and (2) a CIO briefing that positions Db2 Warehouse as a lower-risk modernization path for Db2 estates and governed analytics teams.",
    },
    pmmActions: [
      {
        id: "db2-pmm-battlecard-snowflake",
        icon: "X",
        title: "Battle card: Db2 Warehouse vs Snowflake",
        summary: "Competitive card focused on migration risk, cost governance, SQL continuity, and IBM enterprise fit.",
        status: "Urgent",
        outline: `OUTLINE - Battle card: Db2 Warehouse vs Snowflake

Section 1 - When Db2 Warehouse wins
- Existing IBM / Db2 estates
- Governed analytics teams
- Buyers worried about cost drift and migration disruption

Section 2 - Where Snowflake is strongest
- Market momentum
- Self-service experience
- Data sharing ecosystem

Section 3 - Db2 Warehouse landmines
- Do not let ease-of-adoption claims skip migration risk
- Ask how cost controls work after workloads scale
- Test SQL behavior, governance handoffs, and operational ownership

Section 4 - Objection handlers
- "Snowflake feels more modern"
- "We want cloud simplicity"
- "Our teams need AI readiness"

Section 5 - Proof to include
- Db2 skills continuity
- IBM governance alignment
- Analytics modernization without a full operating-model reset`,
      },
      {
        id: "db2-pmm-battlecard-redshift",
        icon: "X",
        title: "Battle card: Db2 Warehouse vs Amazon Redshift",
        summary: "Enablement asset for AWS-native comparisons where Redshift is positioned as the default cloud warehouse.",
        status: "High priority",
        outline: `OUTLINE - Battle card: Db2 Warehouse vs Amazon Redshift

Section 1 - AWS-native advantage vs enterprise data estate reality
Section 2 - Db2 Warehouse message for cross-estate analytics teams
Section 3 - Landmines
- Avoid letting cloud adjacency become the only decision criterion
- Ask about governance consistency beyond AWS-only workloads
- Validate migration, skills, and cost-control assumptions

Section 4 - Seller talk track
- Db2 Warehouse fits buyers who need modernization plus operational continuity
- IBM should lead with governed analytics, existing skill leverage, and lower-risk migration planning`,
      },
      {
        id: "db2-pmm-migration-kit",
        icon: "=",
        title: "Migration reassurance kit for existing Db2 estates",
        summary: "Workshop deck, checklist, and seller proof package for accounts modernizing from Db2 or adjacent IBM data platforms.",
        status: "New",
        outline: `OUTLINE - Migration reassurance kit

Asset 1 - 1-page migration risk checklist
Asset 2 - CIO workshop deck
Asset 3 - DBA technical validation checklist
Asset 4 - Seller objection sheet

Core story
- Preserve trusted operating patterns where they matter
- Modernize analytics delivery and deployment options
- Use IBM governance and support as a confidence layer

Proof needed
- Reference architecture
- Migration sequence
- Cost-control model
- Demo path for common analytical workloads`,
      },
      {
        id: "db2-pmm-cio-briefing",
        icon: "^",
        title: "CIO briefing: Db2 Warehouse modernization positioning",
        summary: "Executive narrative for accounts balancing cloud modernization, data governance, cost control, and skills continuity.",
        status: "",
        outline: `OUTLINE - CIO briefing

Slide 1 - Why warehouse modernization is now a risk decision
Slide 2 - The competitor pull: Snowflake ease, Redshift AWS gravity, Databricks AI platform breadth
Slide 3 - Where Db2 Warehouse fits
- SQL continuity
- Governed analytics
- IBM ecosystem alignment
- Lower disruption for existing Db2 teams

Slide 4 - Decision criteria CIOs should enforce
Slide 5 - Recommended next moves for target accounts`,
      },
    ],
    marketSignals: [
      {
        id: "db2-market-snowflake-migration",
        competitor: "Snowflake",
        group: "website",
        sourceLabel: "Website",
        sourceBadge: "WEBSITE",
        sourceUrl: "https://www.snowflake.com/en/migrate-to-the-cloud/",
        actionLabel: "Open page",
        freshnessLabel: "Current page",
        dateLabel: "Apr 18, 2026",
        isNew: true,
        summary: "Snowflake is using migration tooling and ease-of-adoption language to make cloud warehouse migration feel low-risk. Db2 Warehouse should counter with a migration-risk checklist that makes SQL behavior, governance continuity, and cost controls explicit.",
      },
      {
        id: "db2-market-redshift-default",
        competitor: "Amazon Redshift",
        group: "blog",
        sourceLabel: "Blog",
        sourceBadge: "BLOG",
        sourceUrl: "https://aws.amazon.com/blogs/big-data/category/database/amazon-redshift/",
        actionLabel: "Open blog",
        freshnessLabel: "Current narrative",
        dateLabel: "Apr 18, 2026",
        isNew: false,
        summary: "Redshift content keeps reinforcing AWS-native modernization and price-performance claims. Db2 Warehouse needs a cross-estate argument for buyers who do not want warehouse strategy reduced to cloud adjacency.",
      },
      {
        id: "db2-market-databricks-ai",
        competitor: "Databricks",
        group: "social",
        sourceLabel: "LinkedIn",
        sourceBadge: "LINKEDIN",
        sourceUrl: "https://www.linkedin.com/company/databricks",
        actionLabel: "Open LinkedIn",
        freshnessLabel: "Current narrative",
        dateLabel: "Apr 18, 2026",
        isNew: true,
        summary: "Databricks is tying warehouse decisions to lakehouse and AI platform consolidation. Db2 Warehouse should not mimic that breadth; it should position trusted SQL analytics as the governed data foundation AI programs still need.",
      },
      {
        id: "db2-market-bigquery-ai",
        competitor: "Google BigQuery",
        group: "blog",
        sourceLabel: "Blog",
        sourceBadge: "BLOG",
        sourceUrl: "https://cloud.google.com/blog/products/data-analytics",
        actionLabel: "Open blog",
        freshnessLabel: "Current narrative",
        dateLabel: "Apr 18, 2026",
        isNew: false,
        summary: "BigQuery's AI-agent and cloud analytics story is strong with digital-native teams. Db2 Warehouse should focus on governed analytics, enterprise controls, and modernization for teams with existing database discipline.",
      },
      {
        id: "db2-market-azure-fabric",
        competitor: "Azure Synapse",
        group: "website",
        sourceLabel: "Website",
        sourceBadge: "WEBSITE",
        sourceUrl: "https://azure.microsoft.com/en-us/products/synapse-analytics/",
        actionLabel: "Open page",
        freshnessLabel: "Current page",
        dateLabel: "Apr 18, 2026",
        isNew: false,
        summary: "Microsoft's Synapse page increasingly pushes Fabric migration. Db2 Warehouse can use this to argue for product clarity and a controlled modernization path rather than another platform transition.",
      },
    ],
    productConfirmedCapabilities: [
      "Db2 SQL and skills continuity for existing enterprise teams",
      "Columnar analytics and workload acceleration for warehouse use cases",
      "Deployment options across IBM Cloud and containerized enterprise environments",
      "IBM governance, security, and support alignment",
      "Integration path with IBM Data and AI portfolio",
      "Familiar database administration and operational controls",
    ],
    productCriticalGap: {
      title: "Critical gap - cloud-native simplicity and ecosystem perception",
      copy: "Db2 Warehouse has a credible modernization story, but competitors are louder on self-service cloud experience, marketplace ecosystems, and AI-native positioning. The PMM gap is not only feature parity; it is packaging Db2 Warehouse as a modern choice for governed analytics teams.",
    },
    productConfirmedStrengths: [
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
    productRemainingGaps: [
      {
        priority: "P1 - Critical",
        title: "Package a simpler cloud self-service story",
        gapScore: "6.8 / 10",
        copy: "Snowflake and BigQuery win perception through simplicity. Db2 Warehouse needs clearer proof around setup, onboarding, workload migration, and day-2 operations for cloud-first buyers.",
        current: "Enterprise-grade database controls, Db2 skill continuity, and IBM deployment options",
        leverage: "Guided trial, migration workshop, and short-path demo assets",
        impact: "CIO, Data Platform Owner, Cloud Analytics Lead",
        competitors: ["Snowflake self-service experience", "BigQuery managed analytics", "Redshift AWS-native onboarding"],
      },
      {
        priority: "P1 - Critical",
        title: "Create stronger AI-ready analytics packaging",
        gapScore: "6.4 / 10",
        copy: "Databricks and BigQuery connect warehouse decisions directly to AI workflows. Db2 Warehouse needs a more explicit story for governed AI data foundations, semantic consistency, and IBM watsonx alignment.",
        current: "Trusted SQL analytics foundation with IBM Data and AI portfolio adjacency",
        leverage: "IBM watsonx, governance proof, and AI-ready data architecture messaging",
        impact: "CDO, Head of AI, Enterprise Architect",
        competitors: ["Databricks lakehouse AI", "BigQuery AI analytics", "Snowflake Cortex"],
      },
      {
        priority: "P2 - High",
        title: "Make migration risk reduction measurable",
        gapScore: "5.8 / 10",
        copy: "Db2 Warehouse has a natural advantage with existing Db2 estates, but PMM needs concrete calculators, checklists, and migration sequencing proof to make lower risk visible.",
        current: "Db2 compatibility, familiar administration patterns, and IBM services/support motion",
        leverage: "Migration readiness scorecard and CIO workshop deck",
        impact: "CIO, DBA Lead, Application Owner",
        competitors: ["Snowflake migration tools", "AWS migration programs", "Databricks migration messaging"],
      },
      {
        priority: "P2 - High",
        title: "Clarify ecosystem and sharing story",
        gapScore: "5.6 / 10",
        copy: "Cloud competitors often win mindshare with marketplaces, sharing, and partner ecosystems. Db2 Warehouse needs a sharper explanation of where IBM ecosystem integration matters and where partners fit.",
        current: "IBM portfolio integration and enterprise account support",
        leverage: "Partner solution map and IBM ecosystem proof pack",
        impact: "CDO, Data Product Owner, Partner teams",
        competitors: ["Snowflake Marketplace", "Databricks Delta Sharing", "BigQuery Analytics Hub"],
      },
    ],
    productCapabilityMatrix: [
      { capability: "Core SQL analytics", note: "Enterprise analytical SQL workloads", statuses: { Netezza: "strong", Databricks: "strong", Snowflake: "strong", "Amazon Redshift": "strong", "Google BigQuery": "strong", "Azure Synapse": "strong", Teradata: "strong" }, gapScore: 0 },
      { capability: "Existing database skill leverage", note: "Continuity for Db2 / DBA-led teams", statuses: { Netezza: "strong", Databricks: "gap", Snowflake: "partial", "Amazon Redshift": "partial", "Google BigQuery": "gap", "Azure Synapse": "partial", Teradata: "partial" }, gapScore: 0 },
      { capability: "Enterprise governance and controls", note: "Access, security, operational discipline", statuses: { Netezza: "strong", Databricks: "partial", Snowflake: "partial", "Amazon Redshift": "partial", "Google BigQuery": "partial", "Azure Synapse": "partial", Teradata: "strong" }, gapScore: 0 },
      { capability: "Cloud self-service onboarding", note: "Fast trial and low-friction setup", statuses: { Netezza: "partial", Databricks: "strong", Snowflake: "strong", "Amazon Redshift": "strong", "Google BigQuery": "strong", "Azure Synapse": "partial", Teradata: "partial" }, gapScore: 6.8 },
      { capability: "AI-ready analytics packaging", note: "Clear story for governed AI data foundations", statuses: { Netezza: "partial", Databricks: "strong", Snowflake: "strong", "Amazon Redshift": "partial", "Google BigQuery": "strong", "Azure Synapse": "strong", Teradata: "partial" }, gapScore: 6.4 },
      { capability: "Migration risk proof", note: "Tools, sequence, and workload validation", statuses: { Netezza: "partial", Databricks: "partial", Snowflake: "strong", "Amazon Redshift": "strong", "Google BigQuery": "partial", "Azure Synapse": "partial", Teradata: "partial" }, gapScore: 5.8 },
      { capability: "Data sharing ecosystem", note: "Marketplace and governed data products", statuses: { Netezza: "gap", Databricks: "strong", Snowflake: "strong", "Amazon Redshift": "partial", "Google BigQuery": "strong", "Azure Synapse": "partial", Teradata: "gap" }, gapScore: 5.6 },
      { capability: "Cost governance messaging", note: "Budget controls and workload planning", statuses: { Netezza: "strong", Databricks: "partial", Snowflake: "partial", "Amazon Redshift": "partial", "Google BigQuery": "partial", "Azure Synapse": "partial", Teradata: "partial" }, gapScore: 2.5 },
    ],
    sentiment: [
      { name: "IBM Db2 Warehouse", positive: 67, neutral: 21, negative: 12 },
      { name: "Snowflake", positive: 78, neutral: 14, negative: 8 },
      { name: "Databricks", positive: 68, neutral: 17, negative: 15 },
      { name: "Amazon Redshift", positive: 62, neutral: 20, negative: 18 },
      { name: "Google BigQuery", positive: 70, neutral: 18, negative: 12 },
      { name: "Azure Synapse", positive: 65, neutral: 20, negative: 15 },
      { name: "Teradata", positive: 60, neutral: 18, negative: 22 },
    ],
    positioningDimensions: [
      { label: "Hybrid / on-prem deployment", netezza: 8.2, note: "Lead with deployment and operating-model continuity for teams with existing IBM data estates.", competitors: { Databricks: 4.5, Snowflake: 4.0, "Amazon Redshift": 5.5, "Google BigQuery": 3.0, "Azure Synapse": 4.8, Teradata: 8.0 } },
      { label: "Predictable query performance", netezza: 8.1, note: "Frame performance around managed analytical workloads and familiar database operations rather than raw benchmark theater.", competitors: { Databricks: 6.5, Snowflake: 7.4, "Amazon Redshift": 6.8, "Google BigQuery": 7.8, "Azure Synapse": 6.9, Teradata: 8.1 } },
      { label: "Regulated industry compliance", netezza: 8.7, note: "Use IBM trust, security posture, and operational control for regulated analytics buyers.", competitors: { Databricks: 6.0, Snowflake: 7.0, "Amazon Redshift": 7.1, "Google BigQuery": 5.2, "Azure Synapse": 7.6, Teradata: 8.0 } },
      { label: "SQL-first simplicity for analysts", netezza: 8.8, note: "Db2 Warehouse should own SQL continuity and familiar analytical workflows for existing enterprise teams.", competitors: { Databricks: 5.5, Snowflake: 8.2, "Amazon Redshift": 7.0, "Google BigQuery": 7.5, "Azure Synapse": 6.8, Teradata: 7.2 } },
      { label: "TCO predictability", netezza: 8.0, note: "Use cost governance and workload planning as a counter to usage-driven surprise spend.", competitors: { Databricks: 5.0, Snowflake: 5.5, "Amazon Redshift": 5.8, "Google BigQuery": 6.1, "Azure Synapse": 6.0, Teradata: 6.2 } },
      { label: "AI / ML ecosystem", netezza: 7.1, note: "The story needs IBM AI portfolio alignment, not a claim that Db2 Warehouse is an all-in-one AI platform.", competitors: { Databricks: 9.5, Snowflake: 8.5, "Amazon Redshift": 7.4, "Google BigQuery": 8.8, "Azure Synapse": 7.9, Teradata: 6.5 } },
    ],
    messagePillars: [
      { tone: "pillar-content", title: "Modernization without disruption", text: "Position Db2 Warehouse as a pragmatic path for teams that need cloud analytics progress without rewriting how trusted database operations work." },
      { tone: "pillar-events", title: "SQL continuity", text: "Make existing Db2 skills, SQL familiarity, and operational practices a strength in migration-heavy accounts." },
      { tone: "pillar-market", title: "Cost governance", text: "Counter usage-driven cloud warehouse narratives with workload planning, governance, and finance-friendly controls." },
      { tone: "pillar-product", title: "Trusted enterprise analytics", text: "Lean into IBM credibility, security, and support for regulated and operationally disciplined buyers." },
      { tone: "pillar-positioning", title: "AI-ready foundation", text: "Frame Db2 Warehouse as the governed analytical layer that supports AI readiness through trusted data, not as an AI platform copycat." },
    ],
    positioningRecommendation: {
      label: "Db2 Warehouse positioning recommendation",
      statement: "The governed cloud warehouse path for enterprise teams that want analytical modernization without losing SQL continuity, operational control, or IBM ecosystem trust.",
      evidence: "Use Snowflake migration claims, Redshift AWS gravity, and Databricks AI consolidation pressure as reasons to lead with lower-risk modernization and governed analytical foundations.",
    },
    pageHighlights: {
      content: [
        { competitor: "Snowflake / Redshift", priority: "High priority", title: "Publish the lower-risk modernization narrative", summary: "Competitors are making migration sound easy. Db2 Warehouse should make migration risk visible and show how existing database teams can modernize without resetting skills, governance, or operating patterns.", recommendation: "Create the modernization-without-rewrite blog and a CIO checklist.", tags: ["Migration", "SQL continuity", "CIO"] },
      ],
      events: [
        { competitor: "Snowflake", priority: "Urgent", title: "Create the Db2 Warehouse vs Snowflake battle card", summary: "Snowflake is the strongest perception competitor for cloud warehouse modernization. PMM needs a focused battle card around migration risk, cost governance, and IBM enterprise fit.", recommendation: "Prioritize the Snowflake battle card and attach it to the CIO briefing.", tags: ["Battle card", "Migration risk", "Cost"] },
      ],
      market: [
        { competitor: "Databricks / Snowflake", priority: "High priority", title: "Counter platform-reset narratives with operating continuity", summary: "Market leaders are selling broad platform resets. Db2 Warehouse should respond by focusing on trusted analytics modernization for teams that cannot afford disruption.", recommendation: "Turn the market signal feed into a migration-risk response kit.", tags: ["Market signal", "Modernization", "Continuity"] },
      ],
      product: [
        { competitor: "Snowflake / BigQuery", priority: "P1 - Critical", title: "Improve cloud self-service proof", summary: "Db2 Warehouse has enterprise strengths, but buyers need clearer evidence that onboarding, demos, and trial experiences are fast enough for cloud warehouse evaluations.", recommendation: "Build a short-path demo, guided trial narrative, and setup proof pack.", tags: ["Self-service", "Demo", "Proof"] },
      ],
      positioning: [
        { competitor: "Across competitors", priority: "Primary angle", title: "Own lower-risk modernization for governed analytics teams", summary: "Db2 Warehouse should not chase every AI and lakehouse claim. Its strongest role is helping existing enterprise teams modernize analytics while preserving trust, SQL continuity, and operating discipline.", recommendation: "Make lower-risk modernization the first message pillar across web, sales, and executive assets.", tags: ["Modernization", "Governance", "SQL continuity"] },
      ],
    },
  },
};

const PAGE_CONFIG_BY_ID = Object.fromEntries(INSIGHT_PAGES.map((page) => [page.id, page]));
const COMMUNITY_PAGE_CONFIG_BY_ID = Object.fromEntries(COMMUNITY_PAGES.map((page) => [page.id, page]));
const refs = {
  authGate: document.querySelector("#authGate"),
  userProfileEmail: document.querySelector("#userProfileEmail"),
  topbarEyebrow: document.querySelector("#topbarEyebrow"),
  topbarTitle: document.querySelector("#topbarTitle"),
  topbarCopy: document.querySelector("#topbarCopy"),
  focusProductButton: document.querySelector("#focusProductButton"),
  focusProductName: document.querySelector("#focusProductName"),
  focusProductStatus: document.querySelector("#focusProductStatus"),
  lastUpdated: document.querySelector("#lastUpdated"),
  sidebarPageNav: document.querySelector("#sidebarPageNav"),
  sidebarContextLabel: document.querySelector("#sidebarContextLabel"),
  sidebarContextList: document.querySelector("#sidebarContextList"),
  sidebarNoteLabel: document.querySelector("#sidebarNoteLabel"),
  sidebarNoteCopy: document.querySelector("#sidebarNoteCopy"),
  sectionTabs: [...document.querySelectorAll("[data-section-target]")],
  sections: {
    overview: document.querySelector("#page-overview"),
    content: document.querySelector("#page-content"),
    events: document.querySelector("#page-events"),
    market: document.querySelector("#page-market"),
    product: document.querySelector("#page-product"),
    positioning: document.querySelector("#page-positioning"),
    manage: document.querySelector("#page-manage"),
    "community-announcements": document.querySelector("#page-community-announcements"),
    "community-thought-leadership": document.querySelector("#page-community-thought-leadership"),
    "community-replies": document.querySelector("#page-community-replies"),
    "community-manage": document.querySelector("#page-community-manage"),
  },
};
let authContext = getAuthContext();
let accountContext = getAccountContext();
let state = hydrateState();
let marketRefreshTimer = null;
let communityRefreshTimer = null;
let marketRequestSequence = 0;
let communityRequestSequence = 0;
let eventsAttached = false;

boot();
function boot() {
  ensureSeededAuthUsers();
  authContext = getAuthContext();
  accountContext = getAccountContext();
  state = hydrateState();
  attachEvents();

  if (!authContext.currentUser) {
    lockWorkspaceForAuth();
    renderAuthGate("signin");
    return;
  }

  unlockWorkspaceForAuth();
  renderAllPages();
  renderShell();
  setActiveSection(state.activeSection);
  updateHeaderMeta();
  if (window.location.protocol === "file:") {
    renderLocalFileMessage();
    return;
  }
  loadMarketSignals();
  loadCommunitySignals();
  startMarketAutoRefresh();
  startCommunityAutoRefresh();
}

function renderLocalFileMessage() {
  const activeSection = refs.sections[state.activePage] || refs.sections.overview;
  activeSection.innerHTML = `
    <article class="panel">
      <div class="panel-header">
        <div>
          <p class="panel-kicker">Local launch required</p>
          <h3>Open this dashboard through localhost, not by double-clicking index.html</h3>
        </div>
      </div>
      <p class="section-copy">You opened the file directly from Finder using a <code>file://</code> URL. This dashboard needs the local Node server because it fetches live data from <code>/api/workspace-intelligence</code>, which does not exist when the page is opened as a plain file.</p>
      <p class="section-copy">Use <a href="http://localhost:3002">http://localhost:3002</a> after starting the local server with the launcher or by running <code>node server.mjs</code> in Terminal.</p>
    </article>
  `;
  state.marketFeed.loading = false;
  state.marketFeed.error = "Direct file open detected. Start the local server and use http://localhost:3002.";
  state.liveInsights.loading = false;
  state.liveInsights.error = "Local API unavailable in file mode.";
  state.communityFeed.loading = false;
  state.communityFeed.error = "Direct file open detected. Start the local server and use http://localhost:3002.";
  updateHeaderMeta();
}

function ensureSeededAuthUsers() {
  const seededEmail = normalizeEmail(SEEDED_USER_EMAIL);
  if (!seededEmail || !SEEDED_USER_PASSWORD_HASH) return;

  const users = getAuthUsers();
  users[seededEmail] = {
    ...(users[seededEmail] || {}),
    email: seededEmail,
    displayName: seededEmail.split("@")[0],
    accountId: sanitizeAccountId(seededEmail),
    passwordHash: SEEDED_USER_PASSWORD_HASH,
    productIds: Array.isArray(users[seededEmail]?.productIds) && users[seededEmail].productIds.length
      ? users[seededEmail].productIds
      : [DEFAULT_FOCUS_PRODUCT_ID],
    createdAt: users[seededEmail]?.createdAt || new Date().toISOString(),
    seeded: true,
  };
  setAuthUsers(users);
}

function getAuthContext() {
  const users = getAuthUsers();
  const sessionEmail = normalizeEmail(getLocalStorageValue(AUTH_SESSION_KEY));
  const currentUser = sessionEmail && users[sessionEmail] ? users[sessionEmail] : null;

  if (sessionEmail && !currentUser) {
    removeLocalStorageValue(AUTH_SESSION_KEY);
  }

  return {
    currentUser,
    users,
  };
}

function getAuthUsers() {
  const parsed = safeParse(getLocalStorageValue(AUTH_USERS_KEY));
  return parsed && typeof parsed === "object" && !Array.isArray(parsed) ? parsed : {};
}

function setAuthUsers(users) {
  setLocalStorageValue(AUTH_USERS_KEY, JSON.stringify(users || {}));
}

function normalizeEmail(value) {
  return String(value || "").trim().toLowerCase();
}

function lockWorkspaceForAuth() {
  document.body.classList.add("auth-locked");
  document.querySelector(".app-shell")?.setAttribute("aria-hidden", "true");
  if (refs.authGate) refs.authGate.hidden = false;
}

function unlockWorkspaceForAuth() {
  document.body.classList.remove("auth-locked");
  document.querySelector(".app-shell")?.removeAttribute("aria-hidden");
  if (refs.authGate) {
    refs.authGate.hidden = true;
    refs.authGate.innerHTML = "";
  }
}

function renderAuthGate(mode = "signin", message = "") {
  if (!refs.authGate) return;
  const isSignup = mode === "signup";
  refs.authGate.hidden = false;
  refs.authGate.innerHTML = `
    <section class="auth-card" aria-label="${isSignup ? "Sign up" : "Sign in"}">
      <div class="ibm-badge auth-logo">IBM</div>
      <p class="section-kicker">SignalOps workspace access</p>
      <h1>${isSignup ? "Create your profile" : "Sign in to your profile"}</h1>
      <p class="auth-copy">${isSignup
        ? "New profiles start with an empty workspace. Add the product, competitor links, keywords, and community links from Manage after signing in."
        : "Each signed-in profile has its own saved product library, competitor links, community setup, and crawler snapshots."}</p>
      <div class="auth-form" data-auth-form data-auth-mode="${isSignup ? "signup" : "signin"}">
        <label class="focus-field">
          <span class="field-label">Email</span>
          <input class="focus-input" type="email" autocomplete="email" data-auth-email value="">
        </label>
        <label class="focus-field">
          <span class="field-label">Password</span>
          <input class="focus-input" type="password" autocomplete="${isSignup ? "new-password" : "current-password"}" data-auth-password>
        </label>
        ${message ? `<p class="auth-message">${escapeHtml(message)}</p>` : ""}
        <button class="save-button auth-submit" type="button" data-auth-submit>${isSignup ? "Create profile" : "Sign in"}</button>
      </div>
      <div class="auth-switch-row">
        <span>${isSignup ? "Already have a profile?" : "New stakeholder or teammate?"}</span>
        <button class="secondary-button" type="button" data-auth-mode-switch="${isSignup ? "signin" : "signup"}">${isSignup ? "Sign in" : "Sign up"}</button>
      </div>
      <p class="auth-disclaimer">Prototype local sign-in for stakeholder review. Production deployment should use IBM SSO or an approved identity provider.</p>
    </section>
  `;
  requestAnimationFrame(() => refs.authGate?.querySelector("[data-auth-email]")?.focus());
}

async function handleAuthSubmit() {
  const form = refs.authGate?.querySelector("[data-auth-form]");
  if (!form) return;

  const mode = form.dataset.authMode === "signup" ? "signup" : "signin";
  const email = normalizeEmail(form.querySelector("[data-auth-email]")?.value);
  const password = form.querySelector("[data-auth-password]")?.value || "";

  if (!email || !password) {
    renderAuthGate(mode, "Enter both email and password.");
    return;
  }

  if (password.length < 8) {
    renderAuthGate(mode, "Use a password with at least 8 characters.");
    return;
  }

  const users = getAuthUsers();
  const passwordHash = await hashPassword(email, password);

  if (mode === "signin") {
    const user = users[email];
    if (!user || user.passwordHash !== passwordHash) {
      renderAuthGate("signin", "Email or password did not match a saved profile.");
      return;
    }
    persistAuthSession(email);
    loadAuthenticatedWorkspace();
    return;
  }

  if (users[email]) {
    renderAuthGate("signup", "A profile already exists for this email. Sign in instead.");
    return;
  }

  users[email] = {
    email,
    displayName: email.split("@")[0],
    accountId: sanitizeAccountId(email),
    passwordHash,
    productIds: [],
    createdAt: new Date().toISOString(),
    seeded: false,
  };
  setAuthUsers(users);
  persistAuthSession(email);
  loadAuthenticatedWorkspace();
}

function persistAuthSession(email) {
  setLocalStorageValue(AUTH_SESSION_KEY, email);
  if (normalizeEmail(getLocalStorageValue(AUTH_SESSION_KEY)) === normalizeEmail(email)) return;
  // Storage write silently failed (quota). Free legacy space and retry once.
  console.warn("[auth] Session write failed - clearing legacy storage and retrying");
  removeLocalStorageValue(LEGACY_STORAGE_KEY);
  setLocalStorageValue(AUTH_SESSION_KEY, email);
}

async function hashPassword(email, password) {
  const normalizedEmail = normalizeEmail(email);
  const input = `${AUTH_PASSWORD_SALT}:${normalizedEmail}:${password}`;
  if (window.crypto?.subtle) {
    const bytes = new TextEncoder().encode(input);
    const digest = await window.crypto.subtle.digest("SHA-256", bytes);
    return [...new Uint8Array(digest)].map((byte) => byte.toString(16).padStart(2, "0")).join("");
  }

  let hash = 0;
  for (let index = 0; index < input.length; index += 1) {
    hash = ((hash << 5) - hash + input.charCodeAt(index)) | 0;
  }
  return `fallback-${Math.abs(hash)}`;
}

function handleSignOut() {
  removeLocalStorageValue(AUTH_SESSION_KEY);
  authContext = getAuthContext();
  accountContext = getAccountContext();
  state = hydrateState();
  stopAutoRefreshTimers();
  lockWorkspaceForAuth();
  renderAuthGate("signin", "Signed out. Choose a profile to continue.");
}

function loadAuthenticatedWorkspace() {
  authContext = getAuthContext();
  accountContext = getAccountContext();
  state = hydrateState();
  unlockWorkspaceForAuth();
  renderAllPages();
  renderShell();
  setActiveSection(state.activeSection);
  updateHeaderMeta();
  if (window.location.protocol !== "file:") {
    loadMarketSignals();
    loadCommunitySignals();
    startMarketAutoRefresh();
    startCommunityAutoRefresh();
  }
}

function stopAutoRefreshTimers() {
  if (marketRefreshTimer) {
    window.clearInterval(marketRefreshTimer);
    marketRefreshTimer = null;
  }
  if (communityRefreshTimer) {
    window.clearInterval(communityRefreshTimer);
    communityRefreshTimer = null;
  }
}

function updateCurrentUserProductIds(productId) {
  const email = authContext.currentUser?.email;
  if (!email || !productId) return;

  const users = getAuthUsers();
  const user = users[email];
  if (!user) return;

  const productIds = new Set(Array.isArray(user.productIds) ? user.productIds : []);
  productIds.add(productId);
  user.productIds = [...productIds];
  users[email] = user;
  setAuthUsers(users);
  authContext = getAuthContext();
  accountContext = getAccountContext();
}

function hydrateState() {
  const saved = safeParse(getStorage());
  const productWorkspaces = hydrateProductWorkspaces(saved);
  const activeProductId = productWorkspaces[saved?.activeProductId] ? saved.activeProductId : getDefaultActiveProductId(productWorkspaces);
  const activeWorkspace = productWorkspaces[activeProductId] || getEmptyProductWorkspace();
  const activeSection = saved?.activeSection === "community" ? "community" : "pmm";
  const activePageBySection = {
    pmm: PMM_PAGE_IDS.includes(saved?.activePageBySection?.pmm) ? saved.activePageBySection.pmm : "overview",
    community: COMMUNITY_PAGE_IDS.includes(saved?.activePageBySection?.community) ? saved.activePageBySection.community : "community-announcements",
  };
  return {
    activeProductId,
    productWorkspaces,
    activeSection,
    activePage: activePageBySection[activeSection],
    activePageBySection,
    contentIdeaExpandedId: activeWorkspace.contentIdeaExpandedId || saved?.contentIdeaExpandedId || "",
    pmmActionExpandedId: activeWorkspace.pmmActionExpandedId || saved?.pmmActionExpandedId || "",
    marketFeedFilter: activeWorkspace.marketFeedFilter || saved?.marketFeedFilter || "all",
    marketFeed: hydrateMarketFeedState(activeWorkspace.marketFeed, { loading: activeProductId === DEFAULT_FOCUS_PRODUCT_ID }),
    liveInsights: hydrateLiveInsightsState(activeWorkspace.liveInsights, { loading: activeProductId === DEFAULT_FOCUS_PRODUCT_ID }),
    communityFeed: hydrateCommunityFeedState(activeWorkspace.communityFeed, { loading: activeProductId === DEFAULT_FOCUS_PRODUCT_ID }),
    documentSources: activeProductId ? hydrateDocumentSources(activeWorkspace.documentSources || saved?.documentSources) : [],
    filters: hydrateFilters(activeProductId ? activeWorkspace.filters || saved?.filters : null),
    sources: activeProductId ? hydrateSources(buildAutoSourcesForWorkspace(activeWorkspace, activeWorkspace.competitors)) : hydrateEmptySources(),
    competitors: activeProductId ? hydrateCompetitors(activeWorkspace.competitors) : [],
    communityKeywords: activeProductId ? hydrateCommunityKeywords(productizeForFocusProduct(activeWorkspace.communityKeywords || saved?.communityKeywords || [], activeWorkspace)) : [],
    communityPlatforms: activeProductId ? hydrateCommunityPlatforms(activeWorkspace.communityPlatforms || saved?.communityPlatforms || []) : [],
    communityMeta: activeWorkspace.communityMeta || {
      lastUpdated: saved?.communityMeta?.lastUpdated || new Date().toISOString(),
    },
    drafts: {},
  };
}

function hydrateProductWorkspaces(saved) {
  const savedWorkspaces = saved?.productWorkspaces && typeof saved.productWorkspaces === "object" ? saved.productWorkspaces : {};
  const workspaces = {};
  const allowedProductIds = getAllowedProductIds();
  const presetIds = new Set(DEFAULT_PRODUCT_PRESETS.map((product) => product.id));

  DEFAULT_PRODUCT_PRESETS.filter((preset) => allowedProductIds.includes(preset.id)).forEach((preset) => {
    const savedWorkspace = savedWorkspaces[preset.id] || {};
    const legacyData = preset.id === DEFAULT_FOCUS_PRODUCT_ID ? (saved || {}) : {};
    workspaces[preset.id] = normalizeProductWorkspace({
      ...preset,
      ...savedWorkspace,
      id: preset.id,
      sources: savedWorkspace.sources || legacyData.sources || buildAutoSourcesForWorkspace(preset, savedWorkspace.competitors || []),
      filters: savedWorkspace.filters || legacyData.filters || hydrateFilters(),
      communityKeywords: savedWorkspace.communityKeywords || legacyData.communityKeywords || [],
      communityPlatforms: savedWorkspace.communityPlatforms || legacyData.communityPlatforms || [],
      communityMeta: savedWorkspace.communityMeta || legacyData.communityMeta,
      marketFeed: savedWorkspace.marketFeed,
      liveInsights: savedWorkspace.liveInsights,
      communityFeed: savedWorkspace.communityFeed || legacyData.communityFeed,
      documentSources: savedWorkspace.documentSources || legacyData.documentSources,
    });
  });

  Object.entries(savedWorkspaces).forEach(([id, workspace]) => {
    if ((allowedProductIds.includes(id) || !presetIds.has(id)) && !workspaces[id]) {
      workspaces[id] = normalizeProductWorkspace({ ...workspace, id });
    }
  });

  return workspaces;
}

function getEmptyProductWorkspace() {
  const now = new Date().toISOString();
  return {
    id: "",
    displayName: "No focus product",
    productName: "No focus product",
    shortName: "No product",
    family: "Data and AI",
    description: "Add a focus product from Manage to start tracking sources, competitor signals, and PMM recommendations.",
    productUrl: "",
    g2Url: "",
    trustRadiusUrl: "",
    blogUrl: "",
    linkedinUrl: "",
    primaryBuyer: "",
    savedAt: now,
    sources: hydrateEmptySources(),
    filters: hydrateFilters(),
    communityKeywords: [],
    communityPlatforms: [],
    communityMeta: { lastUpdated: now },
    marketFeed: null,
    liveInsights: null,
    communityFeed: null,
    documentSources: [],
    competitors: [],
    marketFeedFilter: "all",
    contentIdeaExpandedId: "",
    pmmActionExpandedId: "",
  };
}

function hasActiveProductWorkspace() {
  return Boolean(state?.activeProductId && state?.productWorkspaces?.[state.activeProductId]);
}

function getActiveCompetitors() {
  if (state?.newProductDraftActive || !hasActiveProductWorkspace()) return [];
  return hydrateCompetitors(state?.competitors || []);
}

function getAccountContext() {
  const user = authContext?.currentUser;
  if (user) {
    return {
      accountId: user.accountId || sanitizeAccountId(user.email),
      email: user.email,
      productIds: Array.isArray(user.productIds) ? user.productIds : [],
    };
  }

  const params = new URLSearchParams(window.location.search);
  const accountId = sanitizeAccountId(params.get("account") || params.get("workspace") || "signed-out");
  const productIds = parseAccountProductIds(params.get("products"));

  return {
    accountId,
    email: "",
    productIds,
  };
}

function parseAccountProductIds(value) {
  if (!value) return [];

  const validIds = new Set(DEFAULT_PRODUCT_PRESETS.map((product) => product.id));
  const parsed = String(value)
    .split(",")
    .map((item) => item.trim())
    .filter((item) => validIds.has(item));

  return [...new Set(parsed)];
}

function sanitizeAccountId(value) {
  return String(value || "my-account")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "") || "my-account";
}

function getAllowedProductIds() {
  return Array.isArray(accountContext?.productIds) ? accountContext.productIds : [];
}

function getDefaultActiveProductId(productWorkspaces = state?.productWorkspaces) {
  return Object.keys(productWorkspaces || {})[0] || "";
}

function getStorageKey() {
  return `${STORAGE_KEY_PREFIX}:${accountContext.accountId}`;
}

function getAccountLink({ accountId = accountContext.accountId, productIds = getAllowedProductIds() } = {}) {
  const url = new URL(window.location.href);
  url.searchParams.set("account", sanitizeAccountId(accountId));
  url.searchParams.set("products", productIds.join(","));
  url.hash = "";
  return url.toString();
}

function normalizeProductWorkspace(workspace) {
  const matchedPreset = DEFAULT_PRODUCT_PRESETS.find((item) => item.id === workspace.id);
  const preset = matchedPreset || DEFAULT_PRODUCT_PRESETS[0];
  const displayName = workspace.displayName || workspace.name || preset.displayName;
  const productName = workspace.productName || displayName;
  const fallbackProductUrl = matchedPreset ? preset.productUrl : "";
  const fallbackG2Url = matchedPreset ? preset.g2Url : "";
  const fallbackTrustRadiusUrl = matchedPreset ? preset.trustRadiusUrl : "";
  const fallbackBlogUrl = matchedPreset ? preset.blogUrl : "";
  const fallbackLinkedinUrl = matchedPreset ? preset.linkedinUrl : "";
  const sourceProfile = {
    ...preset,
    ...workspace,
    displayName,
    productName,
    shortName: workspace.shortName || displayName.replace(/^IBM\s+/i, ""),
    productUrl: workspace.productUrl || getWorkspaceFieldValue(workspace, "Product Page URL") || fallbackProductUrl,
    g2Url: workspace.g2Url || getWorkspaceFieldValue(workspace, "G2 Reviews URL") || fallbackG2Url,
    trustRadiusUrl: workspace.trustRadiusUrl || getWorkspaceFieldValue(workspace, "TrustRadius URL") || fallbackTrustRadiusUrl,
    blogUrl: workspace.blogUrl || getWorkspaceFieldValue(workspace, "Blog / Announcements URL") || fallbackBlogUrl,
    linkedinUrl: workspace.linkedinUrl || getWorkspaceFieldValue(workspace, "LinkedIn Page URL") || fallbackLinkedinUrl,
  };
  const normalized = {
    id: workspace.id || createProductId(displayName),
    displayName,
    productName,
    shortName: sourceProfile.shortName,
    family: workspace.family || preset.family || "Data and AI",
    description: workspace.description || preset.description || "Saved product marketing intelligence workspace.",
    productUrl: sourceProfile.productUrl,
    g2Url: sourceProfile.g2Url,
    trustRadiusUrl: sourceProfile.trustRadiusUrl,
    blogUrl: sourceProfile.blogUrl,
    linkedinUrl: sourceProfile.linkedinUrl,
    primaryBuyer: workspace.primaryBuyer || preset.primaryBuyer || "Product, marketing, sales, and strategy stakeholders",
    savedAt: workspace.savedAt || new Date().toISOString(),
    sources: hydrateSources(buildAutoSourcesForWorkspace(sourceProfile, workspace.competitors || [])),
    filters: hydrateFilters(workspace.filters),
    communityKeywords: filterLegacyDefaultValues(workspace.communityKeywords, DEFAULT_COMMUNITY_KEYWORDS),
    communityPlatforms: filterLegacyDefaultValues(workspace.communityPlatforms, DEFAULT_COMMUNITY_PLATFORMS),
    communityMeta: workspace.communityMeta || { lastUpdated: new Date().toISOString() },
    marketFeed: workspace.marketFeed || null,
    liveInsights: workspace.liveInsights || null,
    communityFeed: workspace.communityFeed || null,
    documentSources: hydrateDocumentSources(workspace.documentSources),
    competitors: hydrateCompetitors(workspace.competitors),
    marketFeedFilter: workspace.marketFeedFilter || "all",
    contentIdeaExpandedId: workspace.contentIdeaExpandedId || "",
    pmmActionExpandedId: workspace.pmmActionExpandedId || "",
  };
  normalized.fields = getProductProfileFields(normalized);
  return normalized;
}

function hydrateCompetitors(competitors) {
  if (!Array.isArray(competitors)) return [];
  const seen = new Set();
  return competitors
    .map((competitor, index) => normalizeCompetitor(competitor, index))
    .filter((competitor) => {
      const key = competitor.name.toLowerCase();
      if (!competitor.name || !competitor.url || seen.has(key)) return false;
      seen.add(key);
      return true;
    });
}

function normalizeCompetitor(competitor, index = 0) {
  let name = typeof competitor === "string" ? competitor : competitor?.name;
  const color = typeof competitor === "object" && competitor?.color ? competitor.color : getCompetitorColor(index);
  const url = typeof competitor === "object" && competitor?.url ? competitor.url : "";
  // If a parent-brand name was stored (e.g. "Google", "Amazon") but the URL
  // points to a specific product, upgrade the label to the product name.
  if (url) {
    const inferred = inferCompetitorNameFromUrl(url);
    const generic = ["google", "amazon", "aws", "azure", "microsoft", "gcp"];
    if (inferred && inferred !== "Competitor" && (!name || generic.includes(String(name).trim().toLowerCase()))) {
      name = inferred;
    }
  }
  return {
    id: typeof competitor === "object" && competitor?.id ? competitor.id : createCompetitorId(name),
    name: String(name || "").trim(),
    url: String(url || "").trim(),
    color,
  };
}

function createCompetitorId(name) {
  return String(name || "competitor")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "") || `competitor-${Date.now()}`;
}

function getCompetitorColor(index) {
  return ["#da1e28", "#4589ff", "#24a148", "#f1c21b", "#8a3ffc", "#ff832b", "#009d9a", "#ee5396"][index % 8];
}

function getWorkspaceFieldValue(workspace, label) {
  const field = Array.isArray(workspace.fields) ? workspace.fields.find((item) => item.label === label) : null;
  return field?.value || "";
}

function hydrateMarketFeedState(savedMarketFeed, { loading = false } = {}) {
  const fallback = {
    loading,
    error: "",
    meta: {
      status: loading ? "Connecting live sources" : "Saved product snapshot",
      lastUpdated: "",
      activeSources: 0,
      totalSources: 0,
      failedSources: 0,
    },
    items: clone(MARKET_SIGNAL_ITEMS),
  };

  if (!savedMarketFeed || typeof savedMarketFeed !== "object") {
    return fallback;
  }

  return {
    ...fallback,
    ...clone(savedMarketFeed),
    loading: false,
    error: savedMarketFeed.error || "",
    items: Array.isArray(savedMarketFeed.items) && savedMarketFeed.items.length ? clone(savedMarketFeed.items) : fallback.items,
  };
}

function hydrateLiveInsightsState(savedLiveInsights, { loading = false } = {}) {
  const fallback = {
    loading,
    error: "",
    meta: {
      mode: "snapshot",
      generatedAt: "",
    },
    sections: null,
  };

  if (!savedLiveInsights || typeof savedLiveInsights !== "object") {
    return fallback;
  }

  return {
    ...fallback,
    ...clone(savedLiveInsights),
    loading: false,
    error: savedLiveInsights.error || "",
  };
}

function hydrateCommunityFeedState(savedCommunityFeed, { loading = false } = {}) {
  const fallback = {
    loading,
    error: "",
    meta: {
      status: loading ? "Connecting community crawler" : "Saved community snapshot",
      lastUpdated: "",
      activeSources: 0,
      totalSources: 0,
      failedSources: 0,
    },
    items: [],
  };

  if (!savedCommunityFeed || typeof savedCommunityFeed !== "object") {
    return fallback;
  }

  return {
    ...fallback,
    ...clone(savedCommunityFeed),
    loading: false,
    error: savedCommunityFeed.error || "",
    items: Array.isArray(savedCommunityFeed.items) ? clone(savedCommunityFeed.items) : [],
  };
}

function hydrateDocumentSources(savedDocuments) {
  const list = Array.isArray(savedDocuments) ? savedDocuments : [];
  return list
    .filter((document) => document && typeof document === "object")
    .map((document, index) => ({
      id: document.id || `document-source-${index + 1}`,
      name: String(document.name || "Uploaded source document"),
      type: String(document.type || "Document"),
      size: Number(document.size || 0),
      uploadedAt: document.uploadedAt || new Date().toISOString(),
      linkedTo: document.linkedTo || "Source library",
      dataUrl: document.dataUrl || "",
      extractedText: document.extractedText || "",
      storageMode: document.storageMode || (document.dataUrl ? "Saved locally" : "Metadata only"),
    }));
}

function hydrateFilters(savedFilters) {
  const filters = {};
  INSIGHT_PAGES.forEach((page) => {
    filters[page.id] = {
      search: savedFilters?.[page.id]?.search || "",
      competitor: savedFilters?.[page.id]?.competitor || "All competitors",
    };
  });
  return filters;
}

function hydrateSources(savedSources) {
  const sources = {};
  INSIGHT_PAGES.forEach((page) => {
    const savedList = Array.isArray(savedSources?.[page.id]) ? savedSources[page.id] : null;
    sources[page.id] = (savedList ? savedList : clone(page.sources)).map(normalizeSource);
  });
  return sources;
}

function hydrateEmptySources() {
  return Object.fromEntries(INSIGHT_PAGES.map((page) => [page.id, []]));
}

function hydrateCommunityKeywords(savedKeywords) {
  const list = Array.isArray(savedKeywords) ? savedKeywords : [];
  return list.map((keyword, index) => ({ id: `community-keyword-${index + 1}`, value: String(keyword || "") }));
}

function hydrateCommunityPlatforms(savedPlatforms) {
  const list = Array.isArray(savedPlatforms) ? savedPlatforms : [];
  return list.map((platform, index) => ({ id: `community-platform-${index + 1}`, value: String(platform || "") }));
}

function filterLegacyDefaultValues(values, defaultValues) {
  if (!Array.isArray(values)) return [];
  const defaultSet = new Set((defaultValues || []).map((value) => normalizeListValue(value)));
  return values
    .map((value) => String(value || "").trim())
    .filter((value) => value && !defaultSet.has(normalizeListValue(value)));
}

function normalizeListValue(value) {
  return String(value || "").trim().toLowerCase();
}


function canonicalCompetitorName(value) {
  const key = normalizeListValue(value).replace(/[^a-z0-9]+/g, " ").replace(/\s+/g, " ").trim();
  if (!key) return "";
  if (COMPETITOR_NAME_ALIASES[key]) return normalizeListValue(COMPETITOR_NAME_ALIASES[key]);
  for (const aliasKey of Object.keys(COMPETITOR_NAME_ALIASES)) {
    if (key === aliasKey || key.includes(aliasKey) || aliasKey.includes(key)) {
      return normalizeListValue(COMPETITOR_NAME_ALIASES[aliasKey]);
    }
  }
  return key;
}

function buildDefaultSourcesForProduct(product) {
  const productLabel = product.displayName || product.productName || "IBM product";
  return Object.fromEntries(INSIGHT_PAGES.map((page) => [
    page.id,
    clone(page.sources).map((source) => normalizeSourceForProduct(source, productLabel, product)),
  ]));
}

function buildAutoSourcesForWorkspace(product, competitors = []) {
  const productLabel = product.displayName || product.productName || "Focus product";
  const productUrl = product.productUrl || "";
  const normalizedCompetitors = hydrateCompetitors(competitors).filter((competitor) => competitor.url);

  return Object.fromEntries(INSIGHT_PAGES.map((page) => {
    const focusSource = productUrl
      ? [normalizeSource({
        id: `${page.id}-focus-product-page`,
        kind: page.id === "positioning" ? "OWN" : "PRODUCT",
        label: `${productLabel} product page`,
        competitor: productLabel,
        url: productUrl,
      })]
      : [];

    const competitorSources = normalizedCompetitors.map((competitor) => normalizeSource({
      id: `${page.id}-${competitor.id}-website`,
      kind: getAutoSourceKind(page.id),
      label: `${competitor.name} website`,
      competitor: competitor.name,
      url: competitor.url,
    }));

    return [page.id, [...focusSource, ...competitorSources]];
  }));
}

function getAutoSourceKind(pageId) {
  return {
    content: "WEB",
    events: "WEB",
    market: "WEBSITE",
    product: "CAPABILITY",
    positioning: "POSITIONING",
  }[pageId] || "WEB";
}

function buildDefaultCommunityKeywordsForProduct(product) {
  return productizeForFocusProduct(DEFAULT_COMMUNITY_KEYWORDS, product);
}

function normalizeSourceForProduct(source, productLabel, product) {
  const ownSource = isDefaultFocusProductSource(source) || source.competitor === "IBM Netezza";
  if (!ownSource) {
    return normalizeSource(source);
  }

  return normalizeDefaultFocusProductSource(source, { ...product, displayName: productLabel });
}

function isDefaultFocusProductSource(source) {
  const sourceSignature = `${source.id || ""} ${source.label || ""}`.toLowerCase();
  return source.kind === "OWN" && (
    sourceSignature.includes("netezza") ||
    sourceSignature.includes("positioning-product") ||
    sourceSignature.includes("positioning-g2") ||
    sourceSignature.includes("positioning-tr") ||
    sourceSignature.includes("positioning-blog") ||
    sourceSignature.includes("positioning-linkedin") ||
    sourceSignature.includes("pmm-netezza-own")
  );
}

function isOwnedCompetitorSource(source, previousProduct) {
  return source.competitor === "IBM Netezza"
    || source.competitor === previousProduct?.displayName
    || source.competitor === previousProduct?.productName;
}

function normalizeDefaultFocusProductSource(source, product) {
  const productLabel = product.displayName || product.productName || "Focus product";
  const sourceSignature = `${source.id || ""} ${source.label || ""}`.toLowerCase();
  let label = `${productLabel} Product Page`;
  let url = product.productUrl || "";

  if (sourceSignature.includes("g2")) {
    label = `${productLabel} G2 Reviews`;
    url = product.g2Url || "";
  } else if (sourceSignature.includes("trustradius") || sourceSignature.includes("-tr")) {
    label = `${productLabel} TrustRadius`;
    url = product.trustRadiusUrl || "";
  } else if (sourceSignature.includes("blog") || sourceSignature.includes("announcement")) {
    label = `${productLabel} Blog / Announcements`;
    url = product.blogUrl || "";
  } else if (sourceSignature.includes("linkedin")) {
    label = `${productLabel} LinkedIn Page`;
    url = product.linkedinUrl || "";
  }

  return normalizeSource({ ...source, competitor: productLabel, label, url });
}

function rebaseSourcesForProduct(sourceMap, product, previousProduct = getActiveProductWorkspace()) {
  const normalizedSources = sourceMap && typeof sourceMap === "object" ? sourceMap : {};
  const defaults = buildDefaultSourcesForProduct(product);

  return Object.fromEntries(INSIGHT_PAGES.map((page) => [
    page.id,
    (Array.isArray(normalizedSources[page.id]) ? normalizedSources[page.id] : defaults[page.id]).map((source) => {
      if (isDefaultFocusProductSource(source)) {
        return normalizeDefaultFocusProductSource(source, product);
      }

      if (isOwnedCompetitorSource(source, previousProduct)) {
        return normalizeSource({
          ...source,
          competitor: product.displayName,
          label: focusProductText(source.label, product),
        });
      }

      return normalizeSource(source);
    }),
  ]));
}

function normalizeSource(source) {
  return { id: source.id, kind: source.kind, label: source.label, competitor: source.competitor, url: source.url || "" };
}

function getActiveProductWorkspace() {
  const workspaces = state?.productWorkspaces || {};
  return workspaces[state.activeProductId] || workspaces[getDefaultActiveProductId(workspaces)] || getEmptyProductWorkspace();
}

function getFocusProductDisplayName(workspace = getActiveProductWorkspace()) {
  return workspace?.displayName || "Focus product";
}

function getFocusProductShortName(workspace = getActiveProductWorkspace()) {
  return workspace?.shortName || getFocusProductDisplayName(workspace);
}

function focusProductText(value, workspace = getActiveProductWorkspace()) {
  const displayName = getFocusProductDisplayName(workspace);
  const shortName = getFocusProductShortName(workspace);
  const productHashtag = `#${displayName.replace(/[^a-z0-9]+/gi, "") || "FocusProduct"}`;
  const displayToken = "__FOCUS_PRODUCT_DISPLAY__";
  const shortToken = "__FOCUS_PRODUCT_SHORT__";
  const hashtagToken = "__FOCUS_PRODUCT_HASHTAG__";

  return String(value || "")
    .replace(/#IBMNetezza/g, hashtagToken)
    .replace(/IBM Netezza Performance Server|IBM Netezza/g, displayToken)
    .replace(/Netezza/g, shortToken)
    .replaceAll(displayToken, displayName)
    .replaceAll(shortToken, shortName)
    .replaceAll(hashtagToken, productHashtag);
}

function productizeForFocusProduct(value, workspace = getActiveProductWorkspace()) {
  if (typeof value === "string") {
    return focusProductText(value, workspace);
  }

  if (Array.isArray(value)) {
    return value.map((item) => productizeForFocusProduct(item, workspace));
  }

  if (value && typeof value === "object") {
    return Object.fromEntries(Object.entries(value).map(([key, item]) => [key, productizeForFocusProduct(item, workspace)]));
  }

  return value;
}

function getProductIntelligence(workspace = getActiveProductWorkspace()) {
  return PRODUCT_INTELLIGENCE_BY_ID[workspace?.id] || {};
}

function getProductSpecificValue(key, fallback, workspace = getActiveProductWorkspace()) {
  const intelligence = getProductIntelligence(workspace);
  const value = Object.prototype.hasOwnProperty.call(intelligence, key) ? intelligence[key] : fallback;
  return productizeForFocusProduct(value, workspace);
}

function getProductPageHighlights(pageId) {
  const highlights = getProductIntelligence().pageHighlights?.[pageId];
  return highlights?.length ? productizeForFocusProduct(highlights) : null;
}

function getProductPositioningDimensions() {
  return getProductSpecificValue("positioningDimensions", POSITIONING_DIMENSIONS);
}

function getProductMarketSignalItems() {
  const configured = getConfiguredCompetitors();
  if (!configured.length) return [];
  return buildConfiguredCompetitorMarketSignals(configured);
}

function getConfiguredCompetitors() {
  return getActiveCompetitors().filter((competitor) => competitor.url);
}

function getConfiguredCompetitorNames() {
  return new Set(getConfiguredCompetitors().map((competitor) => canonicalCompetitorName(competitor.name)));
}

function isConfiguredCompetitorSignal(item) {
  const names = getConfiguredCompetitorNames();
  if (!names.size) return false;
  return names.has(canonicalCompetitorName(item?.competitor));
}

function isConfiguredCompetitorInsight(item) {
  const names = getConfiguredCompetitorNames();
  if (!names.size) return false;
  
  // Check if the item has a competitor field
  if (item?.competitor) {
    return names.has(canonicalCompetitorName(item.competitor));
  }
  
  // Check if the item has tags with Counter-CompetitorName format
  // Tags may carry a SHORT competitor name (e.g. "Counter-BigQuery"), while the
  // configured set holds full names (e.g. "google bigquery"), so match by
  // exact value OR substring containment in either direction.
  if (Array.isArray(item?.tags)) {
    return item.tags.some(tag => {
      if (tag.startsWith("Counter-")) {
        const competitorName = canonicalCompetitorName(tag.replace("Counter-", ""));
        if (competitorName && names.has(competitorName)) return true;
      }
      return false;
    });
  }
  
  // Check if the item has competitors array
  if (Array.isArray(item?.competitors)) {
    return item.competitors.some(comp => names.has(canonicalCompetitorName(comp)));
  }
  
  return false;
}

function getRelevantMarketSignalItems() {
  const configured = getConfiguredCompetitors();
  if (!configured.length) return [];

  const crawlerItems = Array.isArray(state.marketFeed?.items) ? state.marketFeed.items : [];
  const liveOrCached = crawlerItems
    .filter(isConfiguredCompetitorSignal)
    .map((item) => ({ ...item, coverageType: item.coverageType || "live", coverageLabel: item.coverageLabel || "Live" }));
  const inferred = buildConfiguredCompetitorMarketSignals(configured);
  return dedupeSignalsBySource([...liveOrCached, ...inferred]);
}

function dedupeSignalsBySource(items) {
  const seen = new Set();
  return items.filter((item) => {
    const key = `${normalizeListValue(item.competitor)}::${item.group || ""}::${item.sourceUrl || item.sourceLabel || ""}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

function buildConfiguredCompetitorMarketSignals(competitors) {
  const now = new Date().toISOString();
  return competitors.flatMap((competitor) => buildInferredSourcesForCompetitor(competitor).map((source) => ({
    id: `${competitor.id}-${source.group}-${createCompetitorId(source.sourceLabel)}`,
    competitor: competitor.name,
    group: source.group,
    headline: `${competitor.name} ${source.sourceLabel} monitoring`,
    sourceLabel: source.sourceLabel,
    sourceBadge: source.sourceBadge,
    sourceUrl: source.sourceUrl,
    actionLabel: source.actionLabel,
    summary: source.summary,
    publishedAt: now,
    coverageType: "static",
    coverageLabel: "Static",
    isNew: false,
    freshnessLabel: "Configured source",
    dateLabel: "Saved setup",
  })));
}

function buildInferredSourcesForCompetitor(competitor) {
  const rootUrl = normalizeUrlInput(competitor.url);
  const root = getRootUrl(rootUrl);
  const slug = getCompetitorSlug(competitor);
  const productName = getFocusProductShortName();
  return [
    {
      group: "website",
      sourceLabel: "Official website",
      sourceBadge: "WEBSITE",
      sourceUrl: rootUrl,
      actionLabel: "Open website",
      summary: `Track ${competitor.name}'s official product page for positioning shifts, packaging language, launch CTAs, and claims ${productName} should counter or adopt in messaging.`,
    },
    {
      group: "social",
      sourceLabel: "LinkedIn",
      sourceBadge: "LINKEDIN",
      sourceUrl: `https://www.linkedin.com/search/results/content/?keywords=${encodeURIComponent(competitor.name)}`,
      actionLabel: "Open LinkedIn search",
      summary: `Monitor ${competitor.name} social posts for launch narratives, customer proof, event themes, and executive language that can become PMM response angles.`,
    },
    {
      group: "reviews",
      sourceLabel: "G2",
      sourceBadge: "G2",
      sourceUrl: `https://www.g2.com/search?query=${encodeURIComponent(competitor.name)}`,
      actionLabel: "Search G2",
      summary: `Use G2 review language for buyer objections, strengths buyers value, friction themes, and proof gaps sellers need to answer against ${competitor.name}.`,
    },
    {
      group: "reviews",
      sourceLabel: "TrustRadius",
      sourceBadge: "TRUSTRADIUS",
      sourceUrl: `https://www.trustradius.com/search?f=0&productToSave=${encodeURIComponent(competitor.name)}`,
      actionLabel: "Search TrustRadius",
      summary: `Use TrustRadius as a second review surface for ${competitor.name}, especially recurring pros, cons, implementation friction, and enterprise buyer concerns.`,
    },
    {
      group: "blog",
      sourceLabel: "Blog / updates",
      sourceBadge: "BLOG",
      sourceUrl: `${root}/blog`,
      actionLabel: "Open blog",
      summary: `Watch ${competitor.name}'s blog and update pages for launch announcements, feature themes, migration stories, AI narratives, and campaign topics ${productName} should respond to.`,
    },
  ];
}

function getRootUrl(url) {
  try {
    const parsed = new URL(normalizeUrlInput(url));
    return `${parsed.protocol}//${parsed.hostname}`;
  } catch {
    return normalizeUrlInput(url).replace(/\/+$/, "");
  }
}

function getCompetitorSlug(competitor) {
  try {
    const host = new URL(normalizeUrlInput(competitor.url)).hostname.replace(/^www\./i, "");
    return host.split(".")[0] || createCompetitorId(competitor.name);
  } catch {
    return createCompetitorId(competitor.name);
  }
}

function extractCompetitorFromActionTitle(title) {
  const shortName = getFocusProductShortName();
  return String(title || "")
    .replace(new RegExp(`^Battle card:\\s*${escapeRegExp(shortName)}\\s+vs\\s+`, "i"), "")
    .replace(/^Battle card:\s*Netezza\s+vs\s+/i, "")
    .replace(/^Counter-post:\s*/i, "")
    .trim() || "Live";
}

function escapeRegExp(value) {
  return String(value).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function getProductProfileFields(workspace) {
  return [
    { label: "Product Name", value: workspace.productName || workspace.displayName },
    { label: "Product Page URL", value: workspace.productUrl || "" },
    { label: "G2 Reviews URL", value: workspace.g2Url || "Not configured yet" },
    { label: "TrustRadius URL", value: workspace.trustRadiusUrl || "Not configured yet" },
    { label: "Blog / Announcements URL", value: workspace.blogUrl || "Not configured yet" },
    { label: "LinkedIn Page URL", value: workspace.linkedinUrl || "Not configured yet" },
    { label: "Primary Buyer", value: workspace.primaryBuyer || "Product and marketing stakeholders" },
  ];
}

function createProductId(name) {
  const base = String(name || "product").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || "product";
  let id = base;
  let counter = 2;
  while (state?.productWorkspaces?.[id]) {
    id = `${base}-${counter}`;
    counter += 1;
  }
  return id;
}

function renderAllPages() {
  renderOverview();
  INSIGHT_PAGES.forEach((page) => renderPage(page.id));
  renderManagePage();
  COMMUNITY_PAGES.forEach((page) => renderPage(page.id));
}

function renderShell() {
  renderTopbar();
  renderSidebarPages();
  renderSidebarContext();
}

function renderTopbar() {
  const config = SECTION_CONFIG[state.activeSection];
  const productName = getFocusProductDisplayName();
  document.title = `${productName} Product Marketing Insights`;
  if (refs.userProfileEmail) {
    refs.userProfileEmail.textContent = accountContext.email || authContext.currentUser?.email || "Not signed in";
  }
  refs.topbarEyebrow.textContent = config.eyebrow;
  refs.topbarEyebrow.style.display = config.eyebrow ? "" : "none";
  refs.topbarTitle.textContent = config.headerTitle;
  refs.topbarCopy.textContent = state.activeSection === "community"
    ? `Identify the right communities and groups to engage with ${productName} announcements, releases, and thought leadership at the right time.`
    : `Compare ${productName} with the competitor set, curate source feeds, and turn market activity into content, PMM asset, product, and positioning actions.`;
  refs.focusProductName.textContent = productName;
  refs.focusProductStatus.textContent = hasActiveProductWorkspace()
    ? `Profile: ${accountContext.email || accountContext.accountId} - Saved: ${formatDateTime(new Date(getActiveProductWorkspace().savedAt))}`
    : `Profile: ${accountContext.email || accountContext.accountId} - Add product in Manage`;
  refs.sectionTabs.forEach((button) => button.classList.toggle("active", button.dataset.sectionTarget === state.activeSection));
}

function renderSidebarPages() {
  const pages = getActiveSectionPages();
  refs.sidebarPageNav.innerHTML = pages.map((page) => `
    <button class="nav-button ${page.id === state.activePage ? "active" : ""}" type="button" data-page-target="${page.id}">
      ${escapeHtml(page.title)}
    </button>
  `).join("");
}

function renderSidebarContext() {
  if (state.activeSection === "community") {
    refs.sidebarContextLabel.closest(".sidebar-panel")?.classList.add("is-hidden");
  } else {
    const competitors = getActiveCompetitors();
    refs.sidebarContextLabel.closest(".sidebar-panel")?.classList.remove("is-hidden");
    refs.sidebarContextLabel.textContent = "Competitors tracked";
    refs.sidebarContextList.innerHTML = competitors.length
      ? competitors.map((competitor) => `<div class="sidebar-chip"><div class="chip-left"><span class="competitor-dot" style="background:${escapeAttribute(competitor.color)}"></span><span>${escapeHtml(competitor.name)}</span></div></div>`).join("")
      : `<div class="empty-state sidebar-empty-state">Add competitors in Manage</div>`;
  }
  refs.sidebarNoteLabel.textContent = SECTION_CONFIG[state.activeSection].noteLabel;
  refs.sidebarNoteCopy.textContent = SECTION_CONFIG[state.activeSection].noteCopy;
}

function getActiveSectionPages() {
  return state.activeSection === "community"
    ? COMMUNITY_PAGES.map((page) => ({ id: page.id, title: page.title }))
    : [
        { id: "overview", title: "Overview" },
        ...INSIGHT_PAGES.map((page) => ({ id: page.id, title: page.title })),
        { id: "manage", title: "Manage" },
      ];
}

function renderOverview() {
  if (!hasActiveProductWorkspace()) {
    refs.sections.overview.innerHTML = renderEmptyWorkspaceOverview();
    return;
  }

  // Step 2 guard: without configured competitors, the competitive-intelligence
  // insights on Overview would be filled from generic fallbacks. Show the same
  // "Complete Step 2" state the individual CI pages use instead of fabricating.
  const overviewCompetitors = getConfiguredCompetitors();
  if (overviewCompetitors.length === 0) {
    refs.sections.overview.innerHTML = renderCompetitorRequiredState(
      { badge: "Overview", title: "High-level product marketing insight system", description: "A single workspace for comparing __FOCUS_PRODUCT_DISPLAY__ with the competitor set across content, PMM actions, social and review signals, product gaps, and positioning strength." },
      "Overview insights"
    );
    return;
  }

  const productName = getFocusProductDisplayName();
  const productShortName = getFocusProductShortName();
  const pageSummaries = INSIGHT_PAGES.map((page) => ({
    ...page,
    sourceCount: getSources(page.id).length,
    topInsight: getOverviewInsightForPage(page),
  }));

  refs.sections.overview.innerHTML = `
    <div class="section-heading">
      <div>
        <p class="section-kicker">Overview</p>
        <h2>High-level product marketing insight system</h2>
        <p class="section-copy">A single workspace for comparing ${escapeHtml(productName)} with the competitor set across content, PMM actions, social and review signals, product gaps, and positioning strength.</p>
      </div>
    </div>
    <article class="panel">
      <div class="panel-header"><div><p class="panel-kicker">Overview insights</p><h3>Top insight from each section</h3></div></div>
      <div class="summary-grid">
        ${pageSummaries.map((page) => renderOverviewInsightCard(page)).join("")}
      </div>
    </article>
    <article class="panel overview-chart-panel">
      <div class="panel-header">
        <div>
          <p class="panel-kicker">Competitive positioning radar</p>
          <h3>Competitive positioning - ${escapeHtml(productShortName)} vs all competitors</h3>
        </div>
        <button class="page-link-button" type="button" data-open-page="positioning">Open Positioning</button>
      </div>
      ${renderOverviewPositioningPanel()}
    </article>
  `;
}

function renderEmptyWorkspaceOverview() {
  return `
    <div class="section-heading">
      <div>
        <p class="section-kicker">Overview</p>
        <h2>Set up your product workspace</h2>
        <p class="section-copy">This profile does not have a focus product linked yet. Add a product, competitor webpage links, focus keywords, and community links in Manage to start building intelligence.</p>
      </div>
    </div>
    <article class="panel workspace-empty-panel">
      <div class="workspace-empty-icon">+</div>
      <div>
        <p class="panel-kicker">Workspace notification</p>
        <h3>No product is linked to ${escapeHtml(accountContext.email || accountContext.accountId)}</h3>
        <p class="section-copy">New users start with a clean workspace so they only see their own products. Once a product is added, SignalOps will save its generated source bundle, crawler snapshots, and product suggestions under this profile.</p>
        <div class="workspace-empty-actions">
          <button class="page-link-button" type="button" data-open-page="manage">Add product in Manage</button>
        </div>
      </div>
    </article>
  `;
}

function renderEmptyWorkspacePage(pageId) {
  const page = PAGE_CONFIG_BY_ID[pageId] || COMMUNITY_PAGE_CONFIG_BY_ID[pageId];
  return `
    <div class="section-heading">
      <div>
        <p class="section-kicker">${escapeHtml(page?.badge || "Workspace")}</p>
        <h2>${escapeHtml(page?.title || "Workspace setup required")}</h2>
        <p class="section-copy">Add a focus product in Manage before this page can show product-specific insights, source evidence, and recommendations.</p>
      </div>
      <button class="page-link-button" type="button" data-open-page="manage">Go to Manage</button>
    </div>
    <article class="panel workspace-empty-panel">
      <div class="workspace-empty-icon">+</div>
      <div>
        <p class="panel-kicker">No product linked</p>
        <h3>This page will populate after setup</h3>
        <p class="section-copy">The platform keeps each user's product library separate. This profile is empty by design until you add a product, competitor links, and community setup.</p>
      </div>
    </article>
  `;
}

function renderOverviewInsightCard(page) {
  const insight = page.topInsight;

  return `
    <article class="summary-card overview-insight-card">
      <div class="summary-top">
        <div>
          <span class="tone-pill tone-${page.tone}">${escapeHtml(page.badge)}</span>
          <h3>${escapeHtml(page.title)}</h3>
        </div>
        <span class="mini-pill">${page.sourceCount} sources</span>
      </div>
      <p class="summary-copy"><strong>Current insight:</strong> ${escapeHtml(insight.title)}</p>
      <p class="summary-copy">${escapeHtml(insight.summary)}</p>
      <div class="overview-insight-meta">
        <span class="tag tone-${page.tone}">${escapeHtml(focusProductText(page.drives))}</span>
        <span class="tag">${escapeHtml(insight.competitor)}</span>
        <span class="tag">${escapeHtml(insight.priority)}</span>
      </div>
      <p class="summary-copy"><strong>Recommended next move:</strong> ${escapeHtml(insight.recommendation)}</p>
      <div class="overview-insight-footer">
        <span class="overview-insight-linkcopy">Opens the ${escapeHtml(page.title)} page</span>
        <button class="page-link-button" type="button" data-open-page="${page.id}">Go To ${escapeHtml(page.title)}</button>
      </div>
    </article>
  `;
}

function getLiveSectionData(sectionId) {
  const section = state.liveInsights?.sections?.[sectionId] || null;
  return section ? productizeForFocusProduct(section) : null;
}

function getOverviewInsightForPage(page) {
  const liveOverview = getLiveSectionData("overview")?.pageInsights?.[page.id];
  if (liveOverview) {
    return liveOverview;
  }

  if (page.id === "content") {
    const section = getLiveSectionData("content");
    if (section?.ideas?.length) {
      // Filter ideas to only show configured competitors
      const filteredIdeas = section.ideas.filter(isConfiguredCompetitorInsight);
      if (filteredIdeas.length) {
        return {
          competitor: filteredIdeas[0].tags?.find((tag) => tag.startsWith("Counter-"))?.replace("Counter-", "") || "Live",
          priority: filteredIdeas[0].status || "Live",
          title: filteredIdeas[0].title,
          summary: filteredIdeas[0].summary,
          recommendation: `Draft on ${filteredIdeas[0].platform} from the Content Suggestions page.`,
        };
      }
    }
    const ideas = getProductSpecificValue("contentIdeas", CONTENT_IDEAS);
    if (ideas?.length) {
      // Filter ideas to only show configured competitors
      const filteredIdeas = ideas.filter(isConfiguredCompetitorInsight);
      if (filteredIdeas.length) {
        return {
          competitor: filteredIdeas[0].tags?.find((tag) => tag.startsWith("Counter-"))?.replace("Counter-", "") || getFocusProductShortName(),
          priority: filteredIdeas[0].status || "Recommended",
          title: filteredIdeas[0].title,
          summary: filteredIdeas[0].summary,
          recommendation: `Draft on ${filteredIdeas[0].platform} from the Content Suggestions page.`,
        };
      }
    }
  }

  if (page.id === "events") {
    const section = getLiveSectionData("events");
    if (section?.actions?.length) {
      // Filter actions to only show configured competitors
      const filteredActions = section.actions.filter(isConfiguredCompetitorInsight);
      if (filteredActions.length) {
        return {
          competitor: extractCompetitorFromActionTitle(filteredActions[0].title),
          priority: filteredActions[0].status || "Live",
          title: filteredActions[0].title,
          summary: filteredActions[0].summary,
          recommendation: "Open PMM action centre and expand the ready-to-use outline.",
        };
      }
    }
    const actions = getProductSpecificValue("pmmActions", PMM_ACTIONS);
    if (actions?.length) {
      // Filter actions to only show configured competitors
      const filteredActions = actions.filter(isConfiguredCompetitorInsight);
      if (filteredActions.length) {
        return {
          competitor: extractCompetitorFromActionTitle(filteredActions[0].title),
          priority: filteredActions[0].status || "Recommended",
          title: filteredActions[0].title,
          summary: filteredActions[0].summary,
          recommendation: "Open PMM action centre and expand the ready-to-use outline.",
        };
      }
    }
  }

  if (page.id === "product") {
    const section = getLiveSectionData("product");
    if (section?.remainingGaps?.length) {
      // Filter gaps to only show configured competitors
      const filteredGaps = section.remainingGaps.filter(isConfiguredCompetitorInsight);
      if (filteredGaps.length) {
        return {
          competitor: filteredGaps[0].competitors?.[0] || "Live",
          priority: filteredGaps[0].priority,
          title: filteredGaps[0].title,
          summary: filteredGaps[0].copy,
          recommendation: filteredGaps[0].leverage,
        };
      }
    }
    const remainingGaps = getProductSpecificValue("productRemainingGaps", PRODUCT_REMAINING_GAPS);
    if (remainingGaps?.length) {
      // Filter gaps to only show configured competitors
      const filteredGaps = remainingGaps.filter(isConfiguredCompetitorInsight);
      if (filteredGaps.length) {
        return {
          competitor: filteredGaps[0].competitors?.[0] || getFocusProductShortName(),
          priority: filteredGaps[0].priority,
          title: filteredGaps[0].title,
          summary: filteredGaps[0].copy,
          recommendation: filteredGaps[0].leverage,
        };
      }
    }
  }

  if (page.id === "positioning") {
    const section = getLiveSectionData("positioning");
    if (section?.responseAngles?.length) {
      return section.responseAngles[0];
    }
  }

  const highlights = getProductPageHighlights(page.id);
  return highlights?.[0] || productizeForFocusProduct(page.highlights[0]);
}

function renderPage(pageId) {
  const page = PAGE_CONFIG_BY_ID[pageId] || COMMUNITY_PAGE_CONFIG_BY_ID[pageId];
  if (pageId === "manage") {
    renderManagePage();
    return;
  }
  if (!page) return;
  if (!hasActiveProductWorkspace()) {
    refs.sections[pageId].innerHTML = renderEmptyWorkspacePage(pageId);
    return;
  }
  if (COMMUNITY_PAGE_CONFIG_BY_ID[pageId]) {
    refs.sections[pageId].innerHTML = renderCommunityPage(page);
    return;
  }
  refs.sections[pageId].innerHTML = pageId === "positioning"
    ? renderPositioningPage(page)
    : pageId === "product"
      ? renderProductPage(page)
    : pageId === "events"
      ? renderPmmActionPage(page)
    : pageId === "content"
      ? renderContentPage(page)
    : pageId === "market"
      ? renderMarketPage(page)
      : renderGenericPage(page);
}

function renderManagePage() {
  const workspace = getActiveProductWorkspace();
  const savedProducts = Object.values(state.productWorkspaces);
  const hasProduct = hasActiveProductWorkspace();
  const isDraft = Boolean(state.newProductDraftActive) || !hasProduct;
  refs.sections.manage.innerHTML = `
    <div class="section-heading">
      <div>
        <p class="section-kicker">Setup</p>
        <h2>Manage workspace</h2>
        <p class="section-copy">${hasProduct && !isDraft ? "Keep setup simple: product profile plus competitor webpages. SignalOps determines the source bundle automatically." : "Start with three product details, then add competitor webpage links when ready."}</p>
      </div>
      <button class="page-link-button" type="button" data-new-focus-product>Add product</button>
    </div>
    <article class="panel setup-step-panel">
      <div class="product-header">
        <div>
          <p class="panel-kicker">Step 1</p>
          <h3>${isDraft ? "Add your focus product" : "Focus product"}</h3>
          <p class="panel-subcopy">${isDraft ? "Add the minimum product profile needed to create the workspace." : "Edit the active product profile. Community Intelligence pulls these details automatically."}</p>
        </div>
        <div class="product-meta">${hasProduct && !isDraft ? `Saved: ${formatDateTime(new Date(workspace.savedAt))}` : "New workspace"}</div>
      </div>
      ${renderFocusProductForm(workspace)}
    </article>

    ${savedProducts.length ? `<article class="panel product-library-panel" id="productLibraryPanel">
      <div class="panel-header">
        <div>
          <p class="panel-kicker">Saved products</p>
          <h3>Product library</h3>
          <p class="panel-subcopy">${savedProducts.length ? "Switch between products saved in your local profile." : "No products saved yet."}</p>
        </div>
        <span class="mini-pill">${savedProducts.length} saved</span>
      </div>
      <div class="product-library-grid compact">
        ${savedProducts.map((product) => renderProductLibraryCard(product)).join("")}
        ${renderProductLibraryAddCard()}
      </div>
    </article>` : ""}

    ${renderCompetitorManager()}
    ${hasProduct && !isDraft ? renderDocumentSourcePanel() : ""}
    ${hasProduct && !isDraft ? `<article class="panel">
      <div class="panel-header">
        <div>
          <p class="panel-kicker">Automatic sources</p>
          <h3>Source bundle is generated from your setup</h3>
          <p class="panel-subcopy">SignalOps uses the focus product URL and competitor webpage links to determine the monitoring sources across content, PMM actions, market signals, product suggestions, and positioning.</p>
        </div>
        <span class="mini-pill">${getAutomaticSourceCount()} sources</span>
      </div>
    </article>` : ""}
  `;
}

function renderDocumentSourcePanel() {
  const documents = state.documentSources || [];
  return `
    <article class="panel document-source-panel">
      <div class="panel-header">
        <div>
          <p class="panel-kicker">Step 3 (Optional)</p>
          <h3>Additional sources</h3>
          <p class="panel-subcopy">Upload PDFs, DOCX files, or add external links for competitor analysis. These sources provide extra context for insights and suggestions.</p>
        </div>
        <span class="mini-pill">${documents.length} ${documents.length === 1 ? "source" : "sources"}</span>
      </div>
      <div class="competitor-add-row">
        <label class="focus-field">
          <span class="field-label">External link (optional)</span>
          <input class="focus-input" type="url" data-new-document-link placeholder="https://example.com/competitor-analysis.pdf">
        </label>
        <button class="save-button" type="button" data-add-document-link>Add link</button>
      </div>
      <label class="document-upload-dropzone">
        <input type="file" multiple data-document-upload accept=".pdf,.doc,.docx,.txt,.md,.csv,.xlsx,.ppt,.pptx,application/pdf,text/plain,text/markdown,text/csv">
        <span class="document-upload-icon">+</span>
        <span>
          <strong>Upload documents (PDF, DOCX, etc.)</strong>
          <span>Files up to ${Math.round(MAX_DOCUMENT_SOURCE_SIZE_BYTES / 1024 / 1024)} MB are saved locally; larger files are tracked as metadata only.</span>
        </span>
      </label>
      <div class="document-source-list">
        ${documents.length ? documents.map((document) => renderDocumentSourceRow(document)).join("") : `<div class="empty-state">No additional sources added yet. Upload files or add links to provide extra competitor context.</div>`}
      </div>
    </article>
  `;
}

function renderCompetitorManager() {
  const competitors = getActiveCompetitors();
  const disabled = !hasActiveProductWorkspace() || state.newProductDraftActive;
  return `
    <article class="panel competitor-manager-panel">
      <div class="panel-header">
        <div>
          <p class="panel-kicker">Step 2</p>
          <h3>Competitors</h3>
          <p class="panel-subcopy">${disabled ? "Save a focus product first, then add competitor webpages for that product." : "Add competitor webpage links only. SignalOps infers the competitor name and updates the left sidebar."}</p>
        </div>
        <span class="mini-pill">${competitors.length} added</span>
      </div>
      <div class="competitor-add-row">
        <label class="focus-field">
          <span class="field-label">Competitor webpage link</span>
          <input class="focus-input" type="url" data-new-competitor-url placeholder="https://www.snowflake.com" ${disabled ? "disabled" : ""}>
        </label>
        <button class="save-button" type="button" data-add-competitor ${disabled ? "disabled" : ""}>Add competitor</button>
      </div>
      <div class="competitor-list">
        ${competitors.length ? competitors.map(renderManagedCompetitor).join("") : `<div class="empty-state">No competitors added yet.</div>`}
      </div>
    </article>
  `;
}

function renderManagedCompetitor(competitor) {
  return `
    <article class="competitor-item">
      <div class="competitor-meta">
        <span class="competitor-dot" style="background:${escapeAttribute(competitor.color)}"></span>
        <div>
          <strong>${escapeHtml(competitor.name)}</strong>
          <span>${escapeHtml(competitor.url || "Webpage link missing")}</span>
        </div>
      </div>
      <button class="delete-button" type="button" data-delete-competitor="${escapeAttribute(competitor.id)}">Remove</button>
    </article>
  `;
}

function renderDocumentSourceRow(document) {
  const canOpen = Boolean(document.dataUrl);
  const isLink = document.isExternalLink || document.storageMode === "External link";
  const pillLabel = isLink ? "LINK" : "DOC";
  const pillClass = isLink ? "tone-market" : "tone-positioning";
  
  return `
    <article class="document-source-row">
      <div class="document-source-main">
        <span class="tone-pill ${pillClass}">${pillLabel}</span>
        <div>
          <h4>${escapeHtml(document.name)}</h4>
          <p class="panel-subcopy">${isLink ? 'External link' : escapeHtml(formatFileSize(document.size))} - ${escapeHtml(document.type || "Document")} - ${escapeHtml(document.storageMode)}</p>
          <p class="panel-subcopy">Added ${escapeHtml(formatDateTime(new Date(document.uploadedAt)))} - Linked to ${escapeHtml(document.linkedTo)}</p>
        </div>
      </div>
      <div class="document-source-actions">
        ${canOpen
          ? `<a class="market-action-link" href="${escapeAttribute(document.dataUrl)}" target="_blank" rel="noreferrer noopener">Open</a>`
          : (document.extractedText ? `<span class="mini-pill">Analyzed</span>` : `<span class="mini-pill">Metadata only</span>`)}
        <button class="delete-button" type="button" data-delete-document-source="${escapeAttribute(document.id)}">Delete</button>
      </div>
    </article>
  `;
}

function renderFocusProductForm(workspace) {
  const isNewProductDraft = Boolean(state.newProductDraftActive) || !hasActiveProductWorkspace();
  return `
    <div class="focus-product-form">
      ${renderFocusInput("Focus product name", "displayName", workspace.displayName)}
      ${renderFocusInput("Product page URL", "productUrl", workspace.productUrl, true)}
      ${renderFocusInput("Primary buyer", "primaryBuyer", workspace.primaryBuyer)}
    </div>
    <div class="focus-product-actions">
      <button class="save-button" type="button" data-save-focus-product>${isNewProductDraft ? "Save new product" : "Save product workspace"}</button>
      <span class="workspace-save-status" id="workspaceSaveStatus">Saved just now</span>
    </div>
  `;
}

function renderAccountWorkspacePanel() {
  const productCount = Object.keys(state.productWorkspaces || {}).length;
  const email = accountContext.email || authContext.currentUser?.email || accountContext.accountId;
  return `
    <article class="panel account-workspace-panel">
      <div class="panel-header">
        <div>
          <p class="panel-kicker">User workspace</p>
          <h3>Profile-specific product library</h3>
          <p class="panel-subcopy">This signed-in profile has a separate product library, competitor links, community setup, and crawler snapshots.</p>
        </div>
        <span class="mini-pill">${escapeHtml(productCount)} linked ${productCount === 1 ? "product" : "products"}</span>
      </div>
      <div class="profile-summary-grid">
        <article class="field-card">
          <p class="field-label">Signed-in email</p>
          <div class="field-value">${escapeHtml(email)}</div>
        </article>
        <article class="field-card">
          <p class="field-label">Workspace ID</p>
          <div class="field-value">${escapeHtml(accountContext.accountId)}</div>
        </article>
        <article class="field-card">
          <p class="field-label">Setup state</p>
          <div class="field-value">${productCount ? "Product workspace active" : "No product linked yet"}</div>
        </article>
      </div>
      <div class="focus-product-actions">
        <button class="secondary-button" type="button" data-sign-out>Sign out</button>
        <span class="workspace-save-status visible">Local prototype profile isolation</span>
      </div>
    </article>
  `;
}

function renderFocusInput(label, field, value, wide = false) {
  return `
    <label class="focus-field ${wide ? "focus-field-wide" : ""}">
      <span class="field-label">${escapeHtml(label)}</span>
      <input class="focus-input" type="text" value="${escapeAttribute(value || "")}" data-focus-product-field="${escapeAttribute(field)}">
    </label>
  `;
}

function renderWorkspaceBundleSummary() {
  const bundleRows = [
    ["P", "Product profile and positioning baseline", "Name, URLs, audience, description, and owned IBM product sources."],
    ["S", "Competitors and monitoring sources", "Competitor set, source URLs, source types, filters, and edited source rows."],
    ["I", "Generated insights and PMM actions", "Market feed snapshot, content ideas, PMM assets, product gaps, and positioning state."],
    ["C", "Community intelligence settings", "Focus keywords, community links, and last refresh metadata."],
    ["D", "Uploaded source documents", "Locally saved document metadata and small uploaded source files linked to this product workspace."],
  ];

  return `
    <div class="workspace-bundle-list">
      ${bundleRows.map(([icon, title, copy]) => `
        <article class="workspace-bundle-row">
          <div class="workspace-bundle-icon">${escapeHtml(icon)}</div>
          <div>
            <h4>${escapeHtml(title)}</h4>
            <p class="panel-subcopy">${escapeHtml(copy)}</p>
          </div>
          <span class="bundle-saved-pill">Saved</span>
        </article>
      `).join("")}
    </div>
  `;
}

function renderProductLibraryCard(product) {
  const active = product.id === state.activeProductId;
  const sourceCount = Object.values(product.sources || {}).reduce((sum, rows) => sum + (Array.isArray(rows) ? rows.length : 0), 0);
  const communityCount = (product.communityKeywords?.length || 0) + (product.communityPlatforms?.length || 0);
  return `
    <div class="product-library-card-wrap ${active ? "active" : ""}">
      <button class="product-library-card ${active ? "active" : ""}" type="button" data-switch-focus-product="${escapeAttribute(product.id)}">
        <div class="product-card-top">
          <p class="field-label">${active ? "Current" : "Saved"}</p>
          <span class="product-card-state">${active ? "Active" : "Restore"}</span>
        </div>
        <div>
          <h4>${escapeHtml(product.displayName)}</h4>
          <p class="panel-subcopy">${escapeHtml(product.description)}</p>
        </div>
        <div class="tag-row">
          <span class="tag tone-content">${sourceCount} sources</span>
          <span class="tag">${INSIGHT_PAGES.length} insight types</span>
          <span class="tag tone-market">${communityCount} community settings</span>
        </div>
      </button>
      ${active ? "" : `<button class="product-card-delete" type="button" data-delete-focus-product="${escapeAttribute(product.id)}" title="Remove this product" aria-label="Remove ${escapeAttribute(product.displayName)}">Remove</button>`}
    </div>
  `;
}

function renderProductLibraryAddCard() {
  return `
    <button class="product-library-card product-library-add-card" type="button" data-new-focus-product>
      <div class="product-add-icon">+</div>
      <div>
        <h4>Add product</h4>
        <p class="panel-subcopy">Create a separate focus product workspace with its own saved sources, filters, insights, and community settings.</p>
      </div>
      <span class="product-card-state">Create later</span>
    </button>
  `;
}

function renderCommunityPage(page) {
  return page.id === "community-manage"
    ? renderCommunityManagePage(page)
    : renderCommunitySignalsPage(page);
}

function renderPmmActionPage(page) {
  // Check if competitors are configured with URLs (Step 2 complete)
  const competitors = getConfiguredCompetitors();
  if (competitors.length === 0) {
    return renderCompetitorRequiredState(page, "PMM Action Centre");
  }

  const expandedActionId = state.pmmActionExpandedId || "";
  const productShortName = getFocusProductShortName();
  const section = getLiveSectionData("events");
  const dynamicActions = buildDynamicPmmActions();
  const setupActions = dynamicActions.length ? [] : buildPmmSetupActions();
  const actions = dynamicActions.length ? dynamicActions : setupActions;
  const alert = dynamicActions.length
    ? buildDynamicPmmAlert(dynamicActions)
    : {
      title: "Competitor setup needed for PMM recommendations",
      copy: "Add competitor webpage links in Manage. SignalOps will then generate battle cards, comparison assets, seller emails, discovery sheets, and campaign ideas from the configured competitor monitoring surfaces.",
    };
  return `
    <div class="section-heading">
      <div>
        <p class="section-kicker">${escapeHtml(page.badge)}</p>
        <h2>PMM action centre</h2>
        <p class="section-copy">Click any action to expand a ready-to-use outline grounded in competitor pressure, source citations, and product positioning.</p>
      </div>
    </div>
    <article class="pmm-alert-banner">
      <div class="pmm-alert-icon">!</div>
      <div>
        <strong>${escapeHtml(alert.title)}</strong>
        <p>${escapeHtml(alert.copy)}</p>
      </div>
    </article>
    <article class="panel pmm-actions-panel">
      <div class="panel-header">
        <div>
          <p class="panel-kicker">Recommended assets - click any to expand outline</p>
          <h3>Recommended PMM assets for ${escapeHtml(productShortName)}</h3>
          <p class="panel-subcopy">Each action is mapped to competitor pressure and includes a ready-to-use asset outline for PMM review.</p>
        </div>
      </div>
      <div class="pmm-action-list">
        ${actions.map((action) => renderPmmActionItem(action, expandedActionId)).join("")}
      </div>
    </article>
    ${renderSourceEvidenceBox(page.id)}
  `;
}

function buildPmmSetupActions() {
  const product = getFocusProductShortName();
  return [{
    id: "pmm-setup-competitors",
    icon: "+",
    title: "Add competitor webpages to generate PMM assets",
    summary: `PMM recommendations for ${product} are intentionally paused until competitors are configured. This prevents stale Netezza-default suggestions from appearing in a custom workspace.`,
    status: "Setup required",
    tags: ["Manage", "Competitors", "Source setup"],
    citations: [],
    outline: `SETUP STEPS

1. Open Competitive Intelligence > Manage.
2. Confirm the focus product name, product page URL, and primary buyer.
3. Add competitor webpage links.
4. Return to PMM Action Centre.
5. SignalOps will generate competitor-specific assets such as:
- seller battle card
- buyer comparison one-pager
- objection FAQ
- value conversation guide
- competitive landing page
- seller email sequence
- discovery question sheet
- demo proof pack`,
  }];
}

function buildDynamicPmmAlert(actions) {
  const competitors = getConfiguredCompetitors();
  const topCompetitor = competitors[0]?.name || "configured competitors";
  return {
    title: `Recommended PMM actions - ${topCompetitor} pressure`,
    copy: `${actions.length} asset suggestions are generated from configured competitor monitoring surfaces. Prioritize the first two for immediate seller readiness, then use the remaining items to build campaign, proof, and discovery coverage.`,
  };
}

function buildDynamicPmmActions() {
  const competitors = getConfiguredCompetitors();
  if (!competitors.length) return [];

  const signals = getRelevantMarketSignalItems();
  const product = getFocusProductShortName();
  const templates = [
    {
      id: "battle-card",
      icon: "X",
      title: (competitor) => `Seller battle card: ${product} vs ${competitor}`,
      summary: (competitor, signal) => `Refresh the competitive card using ${competitor}'s current ${signal.sourceLabel} surface, with positioning traps, landmines, and objection handlers.`,
      status: "Urgent",
      tags: ["Sales enablement", "Competitive response", "Objection handling"],
      outline: (competitor, signal) => `OUTLINE - Seller battle card: ${product} vs ${competitor}

1. Deal context
- When ${competitor} appears in evaluations
- Buyer persona most likely to care
- What ${competitor} is currently emphasizing from ${signal.sourceLabel}

2. Positioning frame
- Do not attack the category trend directly
- Reframe around workload fit, governance, cost, migration risk, and proof
- Make ${product} the safer choice where predictable execution matters

3. Landmines and discovery questions
- Which workloads need repeatable performance?
- Where does cost or operational ownership become unclear?
- What proof would make the buyer confident?

4. Objection handlers
- Modern platform breadth
- Migration momentum
- AI or automation claims
- Ease-of-use claims

5. Seller-ready proof
- Link back to the source citation
- Add one customer proof point
- Add one product proof point from the focus product page`,
    },
    {
      id: "comparison-one-pager",
      icon: "=",
      title: (competitor) => `Buyer comparison one-pager: ${product} vs ${competitor}`,
      summary: (competitor) => `Create a buyer-facing comparison that helps evaluators ask sharper questions instead of accepting ${competitor}'s positioning at face value.`,
      status: "High priority",
      tags: ["Buyer asset", "Comparison", "Evaluation guide"],
      outline: (competitor, signal) => `OUTLINE - Buyer comparison one-pager

1. Evaluation question
- What is the buyer really trying to improve?

2. ${competitor} message observed
- Source: ${signal.sourceLabel}
- CTA/source link: ${signal.sourceUrl}

3. ${product} counter-frame
- Workload fit
- Governance and control
- Cost and operational predictability
- Migration or adoption risk

4. Buyer checklist
- 5 questions procurement, CDO, and platform teams should ask

5. CTA
- Point to product page, demo, or seller follow-up`,
    },
    {
      id: "objection-faq",
      icon: "?",
      title: (competitor) => `Competitive objection FAQ for ${competitor}`,
      summary: (competitor, signal) => `Turn ${signal.sourceLabel} language into short objection handlers sellers can use in active opportunities.`,
      status: "",
      tags: ["FAQ", "Field enablement", "Deal support"],
      outline: (competitor) => `OUTLINE - Competitive objection FAQ

1. Top five buyer objections
- Why ${competitor}?
- Why now?
- Why not standardize?
- Why should ${product} be considered?
- What proof removes risk?

2. Short seller responses
- 30-second answer
- Follow-up proof
- Discovery question

3. Do-not-say guidance
- Avoid unsupported feature parity
- Avoid broad claims without source proof

4. Final seller note
- Use in email follow-up and live calls`,
    },
    {
      id: "value-guide",
      icon: "$",
      title: (competitor) => `Value conversation guide against ${competitor}`,
      summary: () => `Equip sellers to connect competitor claims to business value, cost governance, migration risk, and workload outcomes.`,
      status: "",
      tags: ["Value", "CFO", "Business case"],
      outline: (competitor) => `OUTLINE - Value conversation guide

1. Business issue
- Cost predictability
- Workload performance
- Migration/change burden
- Governance and ownership

2. ${competitor} value claim
- Capture the claim from source evidence

3. ${product} value response
- Where the product reduces uncertainty
- Where the product supports enterprise control

4. CFO/CDO questions
- What cost metric matters?
- What workload risk matters?
- What operational proof is needed?`,
    },
    {
      id: "landing-page",
      icon: "[]",
      title: (competitor) => `Competitive landing page refresh for ${competitor}`,
      summary: (competitor) => `Build or refresh a page that turns ${competitor}'s latest message into clear proof blocks, comparison language, and a CTA.`,
      status: "",
      tags: ["Web", "Demand", "SEO"],
      outline: (competitor) => `OUTLINE - Competitive landing page refresh

Hero
- Direct comparison angle
- One buyer outcome

Proof blocks
- Source-backed competitor claim
- ${product} response
- Product proof
- Customer or workload proof

CTA
- Talk to sales
- Read comparison guide
- Request demo`,
    },
    {
      id: "seller-email",
      icon: "@",
      title: (competitor) => `Three-touch seller email sequence for ${competitor} accounts`,
      summary: () => `Give sellers a quick sequence that turns the latest competitor signal into a practical customer conversation.`,
      status: "",
      tags: ["Email", "Seller motion", "Account follow-up"],
      outline: (competitor, signal) => `OUTLINE - Seller email sequence

Email 1 - Market trigger
- Reference ${competitor}'s ${signal.sourceLabel} theme
- Ask if the buyer is evaluating the same issue

Email 2 - Evaluation question
- Share one workload-fit question
- Offer comparison one-pager

Email 3 - Proof
- Share ${product} proof point
- Offer workshop or demo`,
    },
    {
      id: "discovery-sheet",
      icon: "?",
      title: (competitor) => `Discovery question sheet for ${competitor} deals`,
      summary: () => `Create sharper qualification questions so PMM insight turns into better sales discovery and fewer generic comparisons.`,
      status: "",
      tags: ["Discovery", "Sales play", "Qualification"],
      outline: () => `OUTLINE - Discovery question sheet

1. Workload questions
2. Governance questions
3. Cost questions
4. Migration risk questions
5. Proof and validation questions
6. Decision criteria to capture in CRM`,
    },
    {
      id: "demo-proof-pack",
      icon: "+",
      title: (competitor) => `Demo proof pack for ${competitor} comparisons`,
      summary: () => `Package the demo story, proof points, and validation checklist sellers need when a competitor claim becomes the evaluation anchor.`,
      status: "",
      tags: ["Demo", "Proof", "Validation"],
      outline: () => `OUTLINE - Demo proof pack

1. Demo narrative
2. Workload to demonstrate
3. Proof point to show
4. Buyer validation checklist
5. Follow-up asset bundle`,
    },
    {
      id: "campaign-kit",
      icon: "*",
      title: (competitor) => `Campaign kit responding to ${competitor}`,
      summary: () => `Turn the competitor signal into a coordinated content, social, seller, and web response plan.`,
      status: "",
      tags: ["Campaign", "Content", "Social"],
      outline: () => `OUTLINE - Campaign kit

1. Blog angle
2. LinkedIn post
3. Sales snippet
4. Landing page block
5. Customer proof ask
6. Measurement plan`,
    },
    {
      id: "review-objection-map",
      icon: "#",
      title: (competitor) => `Review objection map for ${competitor}`,
      summary: (competitor) => `Convert ${competitor} review and comparison surfaces into buyer objections, proof gaps, and field response snippets.`,
      status: "",
      tags: ["Reviews", "Buyer voice", "Proof gaps"],
      outline: (competitor, signal) => `OUTLINE - Review objection map

1. Source to inspect
- ${signal.sourceLabel}: ${signal.sourceUrl}

2. Buyer language to capture
- Repeated implementation concerns
- Cost or governance questions
- Ease-of-use claims
- Performance or scale concerns

3. PMM output
- 5 objection handlers
- 3 proof points to request
- 2 content angles
- 1 seller coaching note`,
    },
    {
      id: "launch-watch-brief",
      icon: "!",
      title: (competitor) => `Launch watch brief for ${competitor}`,
      summary: (competitor) => `Create a one-page watch brief that tracks ${competitor}'s latest launches, blog themes, and campaign claims.`,
      status: "",
      tags: ["Launch watch", "Competitive intel", "Campaign"],
      outline: (competitor, signal) => `OUTLINE - Launch watch brief

1. What changed
- Inspect ${competitor}'s ${signal.sourceLabel} source
- Capture feature, packaging, partner, or campaign shifts

2. Why PMM should care
- Buyer expectation created
- Sales objection likely to appear
- Content topic worth responding to

3. Recommended response
- Immediate seller note
- Medium-term comparison asset
- Longer-term product proof ask`,
    },
    {
      id: "seo-counter-narrative",
      icon: "S",
      title: (competitor) => `SEO counter-narrative plan for ${competitor}`,
      summary: (competitor) => `Translate ${competitor}'s public blog and webpage themes into comparison keywords and differentiated content angles.`,
      status: "",
      tags: ["SEO", "Content", "Demand"],
      outline: (competitor) => `OUTLINE - SEO counter-narrative plan

1. Competitor narrative
- Top claims from webpage/blog surfaces
- Words and phrases buyers may search

2. Search intent
- Comparison
- Migration
- Cost
- Governance
- Performance

3. Content backlog
- Comparison landing page section
- Blog article
- FAQ block
- LinkedIn post
- Seller follow-up snippet`,
    },
    {
      id: "proof-request-brief",
      icon: "P",
      title: (competitor) => `Proof request brief against ${competitor}`,
      summary: () => `Tell product, customer marketing, and sales engineering what proof PMM needs to compete with confidence.`,
      status: "",
      tags: ["Proof", "Customer story", "Product marketing"],
      outline: (competitor) => `OUTLINE - Proof request brief

1. Competitive claim to answer
- What ${competitor} is making easy to believe

2. Proof needed
- Customer proof
- Technical proof
- Migration proof
- Cost or operations proof

3. Owner request
- Product proof owner
- Customer marketing proof owner
- Sales engineering validation owner

4. PMM usage
- Battle card
- Comparison page
- Seller email
- Executive deck`,
    },
  ];

  const signalByCompetitor = new Map();
  signals.forEach((signal) => {
    const key = normalizeListValue(signal.competitor);
    if (!signalByCompetitor.has(key)) signalByCompetitor.set(key, signal);
  });

  const actions = [];
  competitors.forEach((competitor) => {
    const fallbackSignal = buildInferredSourcesForCompetitor(competitor)[0];
    const signal = signalByCompetitor.get(normalizeListValue(competitor.name)) || {
      competitor: competitor.name,
      sourceLabel: fallbackSignal.sourceLabel,
      sourceBadge: fallbackSignal.sourceBadge,
      sourceUrl: fallbackSignal.sourceUrl,
      coverageType: "static",
      coverageLabel: "Static",
    };
    templates.slice(0, competitors.length > 1 ? 6 : 12).forEach((template) => {
      actions.push({
        id: `dynamic-${competitor.id}-${template.id}`,
        icon: template.icon,
        title: template.title(competitor.name, signal),
        summary: template.summary(competitor.name, signal),
        status: template.status,
        tags: template.tags,
        citations: [{
          sourceUrl: signal.sourceUrl,
          sourceLabel: signal.sourceLabel,
          sourceBadge: signal.sourceBadge,
          coverageType: signal.coverageType || "static",
          coverageLabel: signal.coverageLabel || "Static",
        }],
        outline: template.outline(competitor.name, signal),
      });
    });
  });

  return actions.slice(0, 14);
}

function renderProductPage(page) {
  // Check if competitors are configured with URLs (Step 2 complete)
  const competitors = getConfiguredCompetitors();
  if (competitors.length === 0) {
    return renderCompetitorRequiredState(page, "Product Suggestions");
  }

  const productShortName = getFocusProductShortName();
  const model = buildDynamicProductSuggestionModel();
  const allSources = getSources(page.id);
  const confirmedCapabilities = model.confirmedCapabilities;
  const criticalGap = model.criticalGap;
  const confirmedStrengths = model.confirmedStrengths;
  const remainingGaps = model.remainingGaps;
  const capabilityMatrix = model.capabilityMatrix;
  const matrixCompetitors = model.matrixCompetitors;
  return `
    <div class="section-heading">
      <div>
        <p class="section-kicker">${escapeHtml(page.badge)}</p>
        <h2>Product capability suggestions</h2>
        <p class="section-copy">${escapeHtml(productShortName)} capability suggestions are generated from the focus product page and the competitor webpages configured in Manage.</p>
      </div>
    </div>
    <article class="product-capability-banner product-capability-banner-positive">
      <div class="product-capability-banner-head">
        <strong>Confirmed product proof points - usable in PMM messaging</strong>
      </div>
      <div class="product-capability-pill-row">
        ${confirmedCapabilities.map((item) => `<span class="product-capability-pill">${escapeHtml(item)}</span>`).join("")}
      </div>
      <p class="product-capability-banner-copy">Sources: Focus product page URL from Manage plus configured competitor webpage, social, review, and blog monitoring surfaces.</p>
    </article>
    <article class="product-capability-banner product-capability-banner-critical">
      <div class="product-capability-banner-head">
        <strong>${escapeHtml(criticalGap.title)}</strong>
      </div>
      <p class="product-capability-banner-copy">${escapeHtml(criticalGap.copy)}</p>
    </article>
    <article class="panel product-matrix-panel">
      <div class="panel-header">
        <div>
          <p class="panel-kicker">Capability matrix - ${escapeHtml(productShortName)} vs configured competitors</p>
          <h3>Capability matrix - ${escapeHtml(productShortName)} vs configured competitors</h3>
        </div>
        <div class="product-legend">
          <span class="product-legend-item"><span class="product-status-icon strong">✓</span> Claimed publicly</span>
          <span class="product-legend-item"><span class="product-status-icon partial">◆</span> Reported / unverified</span>
          <span class="product-legend-item"><span class="product-status-icon gap">×</span> Not detected</span>
        </div>
      </div>
      <div class="table-wrap">
        <table class="product-matrix-table">
          <thead>
            <tr>
              <th>Capability</th>
              <th class="is-netezza">${escapeHtml(productShortName)}</th>
              ${matrixCompetitors.map((name) => `<th>${escapeHtml(shortCompetitorLabel(name))}</th>`).join("")}
              <th>Gap score</th>
            </tr>
          </thead>
          <tbody>
            ${capabilityMatrix.map((row) => renderProductMatrixRow(row, matrixCompetitors)).join("")}
          </tbody>
        </table>
      </div>
    </article>
    <article class="panel">
      <div class="panel-header">
        <div>
          <p class="panel-kicker">Confirmed strengths</p>
          <h3>Confirmed strengths - now use these in PMM messaging</h3>
          <p class="panel-subcopy">Capabilities ${escapeHtml(productShortName)} can confidently message today because the product proof is now public and usable.</p>
        </div>
      </div>
      <div class="product-strength-list">
        ${confirmedStrengths.map((item) => renderProductStrengthCard(item)).join("")}
      </div>
    </article>
    <article class="panel">
      <div class="panel-header">
        <div>
          <p class="panel-kicker">Remaining gaps</p>
          <h3>Remaining gaps - product investment needed</h3>
          <p class="panel-subcopy">These are the missing or partial capabilities competitors are using most aggressively against ${escapeHtml(productShortName)} today.</p>
        </div>
      </div>
      <div class="product-gap-list">
        ${remainingGaps.map((item) => renderProductGapCard(item)).join("")}
      </div>
    </article>
    <section class="metrics-grid">
      ${renderMetricCard("Reference sources", String(allSources.length), "neutral", "All configured in Manage", "Capability and pricing pages used to track public product moves.", true)}
      ${renderMetricCard("Matrix rows", String(capabilityMatrix.length), "positive", "Configured competitors", "Core capability view for PMM and product strategy.")}
      ${renderMetricCard("Confirmed strengths", String(confirmedStrengths.length), "neutral", "Ready for PMM use", "Capabilities that can move from roadmap talk to active messaging.")}
      ${renderMetricCard("Investment gaps", String(remainingGaps.length), "warn", "Prioritized by market pressure", "Where roadmap, packaging, or ecosystem work is still needed.")}
    </section>
    ${renderSourceEvidenceBox(page.id)}
  `;
}

function buildDynamicProductSuggestionModel() {
  const workspace = getActiveProductWorkspace();
  const productShortName = getFocusProductShortName();
  const competitors = getConfiguredCompetitors();
  const competitorNames = competitors.map((competitor) => competitor.name);
  const signals = getRelevantMarketSignalItems();
  const byCompetitor = new Map();
  competitors.forEach((competitor) => {
    byCompetitor.set(competitor.name, signals.filter((signal) => normalizeListValue(signal.competitor) === normalizeListValue(competitor.name)));
  });

  const confirmedCapabilities = [
    workspace.productUrl ? "Focus product page configured" : "Focus product page missing",
    workspace.primaryBuyer ? `Primary buyer: ${workspace.primaryBuyer}` : "Primary buyer missing",
    competitors.length ? `${competitors.length} competitor webpage ${competitors.length === 1 ? "link" : "links"} configured` : "No competitor webpages configured",
    signals.length ? `${signals.length} monitoring surfaces generated` : "No competitor monitoring surfaces yet",
  ];

  const criticalGap = competitors.length
    ? {
      title: "Sharpen product gaps from configured competitor evidence",
      copy: `Use the competitor webpage, social, review, and blog monitoring surfaces to identify what ${productShortName} must prove better: product clarity, buyer proof, migration risk, cost governance, ecosystem strength, or time-to-value.`,
    }
    : {
      title: "Competitor setup needed before product gap analysis",
      copy: "Add competitor webpage links in Manage so this page can compare the focus product against the actual competitors you want to track.",
    };

  const confirmedStrengths = [
    {
      status: "Configured",
      title: `${productShortName} product page is the product baseline`,
      summary: workspace.productUrl
        ? `SignalOps uses ${workspace.productUrl} as the active product baseline instead of default Netezza announcements or old documents.`
        : "Add the focus product page URL in Manage so SignalOps can anchor product suggestions in the right product.",
      leverage: "Use the product page as the proof source for claims, CTAs, persona fit, and product language.",
      tags: ["Product page", "Baseline", productShortName],
    },
    {
      status: competitors.length ? "Active" : "Setup needed",
      title: "Competitor set comes only from Manage",
      summary: competitors.length
        ? `Current comparison set: ${competitorNames.join(", ")}. No unconfigured competitors are used in this capability view.`
        : "No competitors are configured yet, so capability suggestions are intentionally limited.",
      leverage: "Add or remove competitor links in Manage to change the comparison set.",
      tags: ["Competitors", "Manage", "Custom setup"],
    },
    {
      status: "PMM-ready",
      title: "Source coverage is split by website, social, reviews, and blog/update surfaces",
      summary: "This lets PMM separate product claims, market narratives, buyer review friction, and launch/update momentum instead of blending them into one generic insight.",
      leverage: "Use each source type to decide whether the next move is product roadmap input, seller enablement, content, or positioning.",
      tags: ["Evidence", "Coverage", "Source types"],
    },
  ];

  // Prefer the backend's specific, evidence-enriched gap blueprints (full
  // in-database ML, governed data sharing, streaming, NLQ, etc.) which carry
  // real "what the product has now", IBM asset to leverage, named competitor
  // capabilities, and buyer impact. Only fall back to the generic
  // per-competitor coverage cards when the backend produced nothing.
  const liveProductSection = getLiveSectionData("product");
  const backendGaps = Array.isArray(liveProductSection?.remainingGaps)
    ? liveProductSection.remainingGaps.filter((gap) => gap && gap.title && gap.copy)
    : [];

  const genericRemainingGaps = competitors.length ? competitors.map((competitor) => {
    const competitorSignals = byCompetitor.get(competitor.name) || [];
    const groups = new Set(competitorSignals.map((signal) => signal.group));
    const missing = ["social", "reviews", "blog", "website"].filter((group) => !groups.has(group));
    return {
      priority: missing.length ? "P2 - Needs evidence" : "P1 - Review now",
      title: `${competitor.name}: validate product gaps from source coverage`,
      gapScore: `${Math.min(9, 4 + missing.length).toFixed(1)} / 10`,
      copy: missing.length
        ? `${competitor.name} has a webpage link configured, but ${missing.join(", ")} evidence still needs manual review or live crawler confirmation before making product claims.`
        : `${competitor.name} has website, social, review, and blog/update monitoring coverage. Use this to identify concrete roadmap, packaging, proof, and messaging gaps.`,
      current: `${productShortName} product page and buyer context from Manage`,
      leverage: "Turn source review into a roadmap evidence note, comparison proof block, or product packaging recommendation.",
      impact: workspace.primaryBuyer || "Product, PMM, sales, and strategy stakeholders",
      competitors: [competitor.name],
      tags: ["Source coverage", "Competitor evidence"],
    };
  }) : [{
    priority: "P1 - Setup required",
    title: "Add competitors before generating capability gaps",
    gapScore: "0 / 10",
    copy: "Product gap suggestions need competitor webpage links. Add competitors in Manage to generate a capability view that matches the product you are tracking.",
    current: workspace.productUrl ? `${productShortName} product page configured` : "Focus product page missing",
    leverage: "Add competitor webpage links; SignalOps will infer website, social, review, and blog/update sources.",
    impact: workspace.primaryBuyer || "Product and PMM stakeholders",
    competitors: [],
    tags: ["Setup"],
  }];

  // Use backend's specific gaps when available; otherwise the generic cards.
  const remainingGaps = backendGaps.length ? backendGaps : genericRemainingGaps;

  const capabilityMatrix = buildProductCapabilityMatrixForCompetitors(competitors, state.liveInsights?.capabilityEvidence);

  return {
    confirmedCapabilities,
    criticalGap,
    confirmedStrengths,
    remainingGaps,
    capabilityMatrix,
    matrixCompetitors: competitorNames,
  };
}

function resolveCapabilityMatrixColumn(name) {
  const canonical = canonicalCompetitorName(name);
  const direct = Object.keys(PRODUCT_CAPABILITY_MATRIX[0]?.statuses || {}).find(
    (column) => normalizeListValue(column) === canonical
  );
  return direct || "";
}


function describeEvidenceCell(cell) {
  if (!cell) return EVIDENCE_STATUS_LABEL.unknown;
  const base = EVIDENCE_STATUS_LABEL[cell.status] || EVIDENCE_STATUS_LABEL.unknown;
  const matched = cell.term ? `${base} (matched: \"${cell.term}\")` : base;
  if (cell.evidenceSource === "document" && cell.evidenceLabel) {
    return `${matched} - from uploaded source: ${cell.evidenceLabel}`;
  }
  return matched;
}

function buildEvidenceCapabilityMatrix(competitors, evidence) {
  const competitorKeys = Object.keys(evidence.competitors || {});
  const resolveKey = (name) => {
    const canonical = canonicalCompetitorName(name);
    return competitorKeys.find((key) => canonicalCompetitorName(key) === canonical) || "";
  };
  return (evidence.rows || []).map((row) => {
    const focusCell = evidence.focus?.[row.id];
    const statuses = { focus: EVIDENCE_STATUS_TO_ICON[focusCell?.status] || "partial" };
    const details = { focus: describeEvidenceCell(focusCell) };
    let competitorsClaimed = 0;
    competitors.forEach((competitor) => {
      const key = resolveKey(competitor.name);
      const cell = key ? evidence.competitors[key]?.[row.id] : null;
      statuses[competitor.name] = EVIDENCE_STATUS_TO_ICON[cell?.status] || "partial";
      details[competitor.name] = describeEvidenceCell(cell);
      if (cell?.status === "claimed") competitorsClaimed += 1;
    });
    const focusClaimed = focusCell?.status === "claimed";
    const gapScore = competitors.length && !focusClaimed && competitorsClaimed > 0
      ? Math.min(9, 3 + competitorsClaimed * 1.5).toFixed(1)
      : 0;
    return { capability: row.capability, note: row.note, statuses, details, gapScore };
  });
}

function buildProductCapabilityMatrixForCompetitors(competitors, capabilityEvidence) {
  if (capabilityEvidence && capabilityEvidence.rows && capabilityEvidence.rows.length) {
    return buildEvidenceCapabilityMatrix(competitors, capabilityEvidence);
  }
  return PRODUCT_CAPABILITY_MATRIX.map((row) => {
    const statuses = { focus: row.statuses.Netezza || "partial" };
    let weakCount = 0;
    competitors.forEach((competitor) => {
      const column = resolveCapabilityMatrixColumn(competitor.name);
      const status = column && row.statuses[column] ? row.statuses[column] : "partial";
      statuses[competitor.name] = status;
      if (status !== "strong") weakCount += 1;
    });
    const focusWeak = statuses.focus !== "strong";
    const competitorsStrong = competitors.length - weakCount;
    const gapScore = competitors.length && focusWeak && competitorsStrong > 0
      ? Math.min(9, 3 + competitorsStrong * 1.5).toFixed(1)
      : 0;
    return {
      capability: row.capability,
      note: row.note,
      statuses,
      gapScore,
    };
  });
}

function makeDynamicCapabilityRow(capability, note, focusStatus, competitors, byCompetitor, group) {
  const statuses = { focus: focusStatus };
  competitors.forEach((competitor) => {
    const signals = byCompetitor.get(competitor.name) || [];
    statuses[competitor.name] = signals.some((signal) => signal.group === group) ? "strong" : "partial";
  });
  const weakCount = competitors.filter((competitor) => statuses[competitor.name] !== "strong").length;
  return {
    capability,
    note,
    statuses,
    gapScore: competitors.length ? Math.min(9, 2 + weakCount * 1.2).toFixed(1) : 0,
  };
}

function renderCommunitySetupRequiredState(page) {
  return `
    <div class="section-heading">
      <div>
        <p class="section-kicker">${escapeHtml(page.badge)}</p>
        <h2>${escapeHtml(page.title)}</h2>
        <p class="section-copy">${escapeHtml(focusProductText(page.description))}</p>
      </div>
    </div>
    <article class="panel">
      <div class="empty-state" style="padding: 60px 40px; text-align: center;">
        <div style="font-size: 48px; margin-bottom: 20px;">⚠️</div>
        <h3 style="margin-bottom: 12px;">Complete setup to view Community Intelligence</h3>
        <p style="color: #666; margin-bottom: 24px; max-width: 600px; margin-left: auto; margin-right: auto;">
          Community Intelligence needs at least one community keyword or platform link. Add these in the <strong>Manage</strong> page under Community Intelligence to start seeing recommendations.
        </p>
        <button class="primary-button" type="button" onclick="navigateToPage('community-manage')">
          Go to Community Manage
        </button>
      </div>
    </article>
  `;
}

function renderCompetitorRequiredState(page, pageName) {
  return `
    <div class="section-heading">
      <div>
        <p class="section-kicker">${escapeHtml(page.badge)}</p>
        <h2>${escapeHtml(page.title)}</h2>
        <p class="section-copy">${escapeHtml(focusProductText(page.description))}</p>
      </div>
    </div>
    <article class="panel">
      <div class="empty-state" style="padding: 60px 40px; text-align: center;">
        <div style="font-size: 48px; margin-bottom: 20px;">⚠️</div>
        <h3 style="margin-bottom: 12px;">Complete Step 2 to view ${escapeHtml(pageName)}</h3>
        <p style="color: #666; margin-bottom: 24px; max-width: 600px; margin-left: auto; margin-right: auto;">
          ${escapeHtml(pageName)} require competitor data to generate insights. Please add at least one competitor webpage link in the <strong>Manage</strong> page (Step 2) to start seeing recommendations.
        </p>
        <button class="primary-button" type="button" onclick="navigateToPage('manage')">
          Go to Manage (Step 2)
        </button>
      </div>
    </article>
  `;
}

function renderContentPage(page) {
  // Check if competitors are configured with URLs (Step 2 complete)
  const competitors = getConfiguredCompetitors();
  if (competitors.length === 0) {
    return renderCompetitorRequiredState(page, "Content Suggestions");
  }

  const expandedIdeaId = state.contentIdeaExpandedId || "";
  const section = getLiveSectionData("content");
  const alert = section?.alert || getProductSpecificValue("contentAlert", CONTENT_IDEA_ALERT);
  const allIdeas = section?.ideas?.length ? section.ideas : getProductSpecificValue("contentIdeas", CONTENT_IDEAS);
  // Filter ideas to only show configured competitors
  const ideas = allIdeas.filter(isConfiguredCompetitorInsight);
  return `
    <div class="section-heading">
      <div>
        <p class="section-kicker">${escapeHtml(page.badge)}</p>
        <h2>Thought leadership content ideas</h2>
        <p class="section-copy">Q2 2026 - mapped to competitor gaps and review themes</p>
      </div>
    </div>
    <article class="content-alert-banner">
      <div class="content-alert-icon">!</div>
      <div>
        <strong>${escapeHtml(alert.title)}</strong>
        <p>${escapeHtml(alert.copy)}</p>
      </div>
    </article>
    <article class="panel content-ideas-panel">
      <div class="panel-header">
        <div>
          <p class="panel-kicker">Recommended Content - Q2 2026</p>
          <h3>Thought leadership content mapped to competitor gaps</h3>
          <p class="panel-subcopy">Each recommendation includes the best publishing platform and a ready-to-use draft outline.</p>
        </div>
      </div>
      <div class="content-idea-list">
        ${ideas.map((idea) => renderContentIdeaItem(idea, expandedIdeaId)).join("")}
      </div>
    </article>
    ${renderSourceEvidenceBox(page.id)}
  `;
}

function renderMarketPage(page) {
  // Check if competitors are configured with URLs (Step 2 complete)
  const competitors = getConfiguredCompetitors();
  if (competitors.length === 0) {
    return renderCompetitorRequiredState(page, "Market Signals");
  }

  const activeFilter = state.marketFeedFilter || "all";
  const feedItems = getRelevantMarketSignalItems();
  const signals = feedItems.filter((item) => activeFilter === "all" || item.group === activeFilter);
  const status = getMarketFeedStatus();

  return `
    <div class="section-heading">
      <div>
        <p class="section-kicker">${escapeHtml(page.badge)}</p>
        <h2>${escapeHtml(page.title)}</h2>
        <p class="section-copy">${escapeHtml(focusProductText(page.description))}</p>
      </div>
    </div>
    <article class="section-banner">
      <div>
        <span class="tone-pill tone-${page.tone}">${escapeHtml(page.badge)}</span>
        <p class="section-copy">Competitor signal feed across official webpages, social handles, G2, TrustRadius, and blog/update sources inferred from your configured competitor webpages. Every item links to the source surface PMM should inspect.</p>
      </div>
      <div class="banner-driver">
        <strong>Live response board</strong>
        <p class="section-copy">Live means the crawler matched a configured competitor source. Static means SignalOps created the monitoring surface from your competitor link so PMM can review it directly.</p>
      </div>
    </article>
    ${renderMarketSignalSuggestionBox(signals, feedItems, activeFilter)}
    <article class="panel market-feed-panel">
      <div class="market-filter-row">
        ${MARKET_FILTERS.map((filter) => `
          <button class="market-filter-button ${activeFilter === filter.id ? "active" : ""}" type="button" data-market-filter="${filter.id}">
            ${escapeHtml(filter.label)}
          </button>
        `).join("")}
      </div>
      <div class="market-feed-status">
        <div class="market-feed-status-copy">
          <strong>${escapeHtml(status.label)}</strong>
          <span>${escapeHtml(status.detail)}</span>
          ${status.error ? `<span class="market-feed-warning">${escapeHtml(status.error)}</span>` : ""}
        </div>
        <div class="market-feed-status-meta">
          <span>${escapeHtml(status.updated)}</span>
          <button class="secondary-button" type="button" data-market-refresh ${state.marketFeed.loading ? "disabled" : ""}>${state.marketFeed.loading ? "Refreshing..." : "Refresh now"}</button>
        </div>
      </div>
      <div class="market-feed-list">
        ${signals.length ? signals.map((item) => renderMarketSignalItem(item)).join("") : `<div class="empty-state">Add competitor webpage links in Manage to generate social, review, blog, and website monitoring surfaces.</div>`}
      </div>
    </article>
    ${renderSourceEvidenceBox(page.id)}
  `;
}

function renderMarketSignalSuggestionBox(filteredSignals, allSignals, activeFilter) {
  const suggestion = getMarketSignalSuggestion(filteredSignals, allSignals, activeFilter);
  const coverageClass = suggestion.coverageType === "live" ? "live" : "static";

  return `
    <article class="market-suggestion-card">
      <div class="market-suggestion-main">
        <div class="market-suggestion-topline">
          <span class="tone-pill tone-market">Market signal suggestion</span>
          <span class="market-coverage-pill ${coverageClass}">${escapeHtml(suggestion.coverageLabel)}</span>
          <span class="mini-pill">${escapeHtml(suggestion.filterLabel)}</span>
        </div>
        <h3>${escapeHtml(suggestion.title)}</h3>
        <p>${escapeHtml(suggestion.copy)}</p>
        <div class="market-suggestion-meta">
          <span>${escapeHtml(suggestion.sourceLabel)}</span>
          <span>•</span>
          <span>${escapeHtml(suggestion.updatedLabel)}</span>
        </div>
      </div>
      <div class="market-suggestion-action">
        ${suggestion.sourceUrl ? `<a class="market-action-link" href="${escapeAttribute(suggestion.sourceUrl)}" target="_blank" rel="noreferrer noopener">${escapeHtml(suggestion.actionLabel)}</a>` : ""}
      </div>
    </article>
  `;
}

function getMarketSignalSuggestion(filteredSignals, allSignals, activeFilter) {
  const filterLabel = MARKET_FILTERS.find((filter) => filter.id === activeFilter)?.label || "All sources";
  const visibleSignal = filteredSignals[0] || null;
  const fallbackSignal = allSignals[0] || null;
  const signal = visibleSignal || fallbackSignal;

  if (!signal) {
    return {
      filterLabel,
      coverageType: "static",
      coverageLabel: "Static",
      title: "Refresh the feed to identify the next market move",
      copy: `No ${filterLabel.toLowerCase()} signals are available right now. Refresh the feed, then use the first live competitor signal to decide the next ${getFocusProductShortName()} content or PMM response.`,
      sourceLabel: "Monitoring",
      updatedLabel: "No signal available",
      sourceUrl: "",
      actionLabel: "Open source",
    };
  }

  const coverage = getMarketSignalCoverage(signal);
  const competitor = shortCompetitorLabel(signal.competitor);
  const theme = inferMarketSignalSuggestionTheme(signal);
  const focusProduct = getFocusProductShortName();
  const filterContext = visibleSignal
    ? `${filterLabel} signal`
    : `All-source priority because ${filterLabel.toLowerCase()} has no matching signal`;

  return {
    filterLabel,
    coverageType: coverage.type,
    coverageLabel: coverage.label,
    title: `${competitor}: ${theme.title}`,
    copy: `${filterContext}: ${theme.copy} Frame the response around ${focusProduct} as the performant warehouse engine a lakehouse needs, with a clear CTA back to the source evidence.`,
    sourceLabel: `${signal.competitor} ${signal.sourceLabel || "source"}`,
    updatedLabel: signal.freshnessLabel || signal.dateLabel || "Current signal",
    sourceUrl: signal.sourceUrl || "",
    actionLabel: signal.actionLabel || "Open source",
  };
}

function inferMarketSignalSuggestionTheme(signal) {
  const text = `${signal.headline || ""} ${signal.summary || ""} ${signal.sourceBadge || ""}`.toLowerCase();

  if (/(cost|credit|price|pricing|billing|economics|tco|chargeback)/.test(text)) {
    return {
      title: "turn cost pressure into a CFO-ready proof asset",
      copy: "Prioritize a cost-governance message that contrasts usage-driven spend with predictable workload planning, NCOS, and governed query execution.",
    };
  }

  if (/(lakehouse|sql warehouse|query|performance|engine|warehouse-grade)/.test(text)) {
    return {
      title: "own the lakehouse performance-engine narrative",
      copy: "Use this signal to show that open lakehouse data still needs fast, governed, workload-fit execution for BI and repeat analytics.",
    };
  }

  if (/(ai|agent|genai|ml|model|cortex|genie|watsonx)/.test(text)) {
    return {
      title: "connect AI readiness to trusted analytics execution",
      copy: "Build a response that links AI ambition to governed data, predictable query performance, hybrid control, and IBM ecosystem proof.",
    };
  }

  if (/(migration|modernization|fabric|decommission|transition)/.test(text)) {
    return {
      title: "convert migration pressure into a workload-placement checklist",
      copy: "Create a decision tool that asks which workloads should move, which should stay governed, and which need a dedicated performance engine.",
    };
  }

  if (/(review|complexity|friction|setup|operational|debug)/.test(text)) {
    return {
      title: "turn buyer friction into an objection-handling play",
      copy: "Use the buyer language to build a seller response around simplicity, operational ownership, and measurable time-to-value.",
    };
  }

  return {
    title: "convert this signal into a competitor response",
    copy: "Use the source as the lead proof point for one content idea, one seller talking point, and one comparison-page update.",
  };
}

function renderMarketSignalItem(item) {
  const coverage = getMarketSignalCoverage(item);
  return `
    <article class="market-signal-item">
      <div class="market-signal-main">
        <div class="market-signal-topline">
          <span class="market-signal-dot"></span>
          <span class="market-signal-source">
            ${escapeHtml(item.competitor.toUpperCase())} •
            <a class="market-source-link" href="${escapeAttribute(item.sourceUrl)}" target="_blank" rel="noreferrer noopener">${escapeHtml(item.sourceLabel.toUpperCase())}</a>
          </span>
          <span class="market-coverage-pill ${coverage.type === "live" ? "live" : "static"}">${escapeHtml(coverage.label)}</span>
          ${item.isNew ? `<span class="market-new-badge">NEW</span>` : ""}
        </div>
        ${item.headline ? `<p class="market-signal-headline">${escapeHtml(item.headline)}</p>` : ""}
        <p class="market-signal-copy">${escapeHtml(item.summary)}</p>
        <div class="market-signal-meta">
          <span>${escapeHtml(item.freshnessLabel)}</span>
          <span>•</span>
          <span>${escapeHtml(item.dateLabel)}</span>
          <span class="tag tone-market">${escapeHtml(item.sourceBadge)}</span>
        </div>
      </div>
      <div class="market-signal-actions">
        <a class="market-action-link" href="${escapeAttribute(item.sourceUrl)}" target="_blank" rel="noreferrer noopener">${escapeHtml(item.actionLabel)}</a>
      </div>
    </article>
  `;
}

function getMarketSignalCoverage(item) {
  const type = item.coverageType === "live" ? "live" : "static";
  return {
    type,
    label: type === "live" ? "Live" : "Static",
  };
}

function getCommunitySignalCoverage(item) {
  const type = item?.coverageType === "live" ? "live" : "static";
  return {
    type,
    label: type === "live" ? "Live" : "Static",
  };
}

function renderSourceEvidenceBox(pageId, { section = "market" } = {}) {
  return "";
}

function renderSourceCitationItem(item) {
  const title = item.sourceUrl
    ? `<a href="${escapeAttribute(item.sourceUrl)}" target="_blank" rel="noreferrer noopener">${escapeHtml(item.title)}</a>`
    : escapeHtml(item.title);

  return `
    <article class="source-citation-item">
      <div class="source-citation-top">
        <span class="market-coverage-pill ${item.coverageType}">${escapeHtml(item.coverageLabel)}</span>
        <span class="tag tone-market">${escapeHtml(item.sourceBadge)}</span>
      </div>
      <h4>${title}</h4>
      <p>${escapeHtml(item.summary)}</p>
      <div class="source-citation-meta">
        <span>${escapeHtml(item.sourceName)}</span>
        <span>${escapeHtml(item.updatedLabel)}</span>
      </div>
    </article>
  `;
}

function getMarketEvidenceSummary(pageId) {
  const items = getMarketEvidencePool();
  const citations = getMarketEvidenceItems(pageId, 4).map(toMarketCitation);
  const meta = state.marketFeed?.meta || {};
  const liveCount = items.filter((item) => getMarketSignalCoverage(item).type === "live").length;
  const staticCount = items.length - liveCount;
  const tone = state.marketFeed?.loading
    ? "hybrid"
    : liveCount && staticCount
      ? "hybrid"
      : liveCount
        ? "live"
        : "static";
  const label = state.marketFeed?.loading
    ? "Refreshing"
    : tone === "live"
      ? "Live crawler"
      : tone === "hybrid"
        ? "Hybrid live + fallback"
        : "Static fallback";
  const sourceCountLabel = meta.totalSources
    ? `${meta.activeSources || 0}/${meta.totalSources} sources live`
    : `${liveCount} live / ${staticCount} static`;
  const sourceDetail = state.marketFeed?.error
    ? "The crawler did not complete the latest refresh, so this page is using saved source-backed fallback coverage."
    : meta.totalSources
      ? `${meta.activeSources || 0} of ${meta.totalSources} approved competitor sources produced live signals; ${meta.failedSources || 0} ${pluralVerb(meta.failedSources || 0)} covered by cached or static fallback evidence.`
      : `${liveCount} live citations and ${staticCount} fallback citations are available from the saved source bundle.`;

  return {
    title: getEvidenceTitle(pageId),
    label,
    tone,
    countLabel: sourceCountLabel,
    detail: `${getEvidencePageUse(pageId)} ${sourceDetail}`,
    updated: getEvidenceUpdated(meta, state.marketFeed?.loading),
    scope: getEvidenceScope(pageId),
    note: "Live means the approved source was fetched during the latest crawler refresh. Static means a saved source-backed fallback is being used until that source returns usable data again.",
    items: citations,
  };
}

function getMarketEvidencePool() {
  return productizeForFocusProduct(getRelevantMarketSignalItems());
}

function getMarketEvidenceItems(pageId, limit = 4) {
  const groupOrder = getEvidenceGroupOrder(pageId);
  const groupRank = new Map(groupOrder.map((group, index) => [group, groupOrder.length - index]));
  const ranked = getMarketEvidencePool()
    .filter((item) => groupOrder.includes(item.group))
    .sort((left, right) => {
      const leftCoverage = getMarketSignalCoverage(left).type === "live" ? 1 : 0;
      const rightCoverage = getMarketSignalCoverage(right).type === "live" ? 1 : 0;
      if (leftCoverage !== rightCoverage) return rightCoverage - leftCoverage;
      const leftRank = groupRank.get(left.group) || 0;
      const rightRank = groupRank.get(right.group) || 0;
      if (leftRank !== rightRank) return rightRank - leftRank;
      return new Date(right.publishedAt || 0) - new Date(left.publishedAt || 0);
    });

  return diversifyBySource(ranked, limit);
}

function getEvidenceGroupOrder(pageId) {
  return {
    overview: ["website", "blog", "reviews", "social"],
    content: ["blog", "website", "reviews", "social"],
    events: ["social", "reviews", "website", "blog"],
    market: ["social", "reviews", "blog", "website"],
    product: ["website", "blog", "reviews"],
    positioning: ["social", "website", "reviews", "blog"],
    manage: ["website", "social", "reviews", "blog"],
  }[pageId] || ["website", "blog", "reviews", "social"];
}

function diversifyBySource(items, limit) {
  const picked = [];
  const seenCompetitors = new Set();

  items.forEach((item) => {
    if (picked.length >= limit) return;
    const key = item.competitor || item.community || item.platform || item.sourceName || item.sourceLabel;
    if (seenCompetitors.has(key)) return;
    picked.push(item);
    seenCompetitors.add(key);
  });

  items.forEach((item) => {
    if (picked.length >= limit) return;
    if (!picked.some((pickedItem) => pickedItem.id === item.id)) {
      picked.push(item);
    }
  });

  return picked;
}

function toMarketCitation(item) {
  const coverage = getMarketSignalCoverage(item);
  return {
    id: item.id,
    title: item.headline || `${item.competitor} ${item.sourceLabel} signal`,
    summary: item.summary || "Monitored competitor source used as evidence for this recommendation.",
    sourceName: `${item.competitor || "Competitor"} - ${item.sourceLabel || "Source"}`,
    sourceBadge: item.sourceBadge || item.group || "SOURCE",
    sourceUrl: item.sourceUrl || "",
    updatedLabel: item.freshnessLabel || item.dateLabel || "Saved source",
    coverageType: coverage.type,
    coverageLabel: coverage.label,
  };
}

function getCommunityEvidenceSummary(pageId) {
  const items = getCommunityEvidencePool(pageId);
  const citations = diversifyBySource(items, 4).map(toCommunityCitation);
  const meta = state.communityFeed?.meta || {};
  const liveCount = items.filter((item) => getCommunitySignalCoverage(item).type === "live").length;
  const staticCount = items.length - liveCount;
  const tone = state.communityFeed?.loading
    ? "hybrid"
    : liveCount && staticCount
      ? "hybrid"
      : liveCount
        ? "live"
        : "static";
  const label = state.communityFeed?.loading
    ? "Refreshing"
    : tone === "live"
      ? "Live crawler"
      : tone === "hybrid"
        ? "Hybrid live + fallback"
        : "Static fallback";
  const sourceDetail = state.communityFeed?.error
    ? "The community crawler did not complete the latest refresh, so this page is using saved community guidance."
    : meta.totalSources
      ? `${meta.activeSources || 0} of ${meta.totalSources} approved community sources produced live items; ${meta.failedSources || 0} ${pluralVerb(meta.failedSources || 0)} covered by fallback community citations.`
      : `${liveCount} live community citations and ${staticCount} fallback citations are available.`;

  return {
    title: getEvidenceTitle(pageId),
    label,
    tone,
    countLabel: meta.totalSources ? `${meta.activeSources || 0}/${meta.totalSources} sources live` : `${liveCount} live / ${staticCount} static`,
    detail: `${getEvidencePageUse(pageId)} ${sourceDetail}`,
    updated: getEvidenceUpdated(meta, state.communityFeed?.loading),
    scope: getEvidenceScope(pageId),
    note: "Community live means the approved community, forum, search, or API endpoint returned a usable item. Static means a saved fallback citation is filling the gap.",
    items: citations,
  };
}

function getCommunityEvidencePool(pageId) {
  const bucket = getCommunityBucketForPage(pageId);
  const liveItems = Array.isArray(state.communityFeed?.items) && !state.communityFeed.loading
    ? state.communityFeed.items
    : [];
  const sourceItems = liveItems.length ? liveItems : getStaticCommunityEvidenceItems(pageId);
  return sourceItems.filter((item) => !bucket || item.play === bucket.id);
}

function getStaticCommunityEvidenceItems(pageId) {
  const bucket = getCommunityBucketForPage(pageId);
  const groups = COMMUNITY_SIGNAL_GROUPS.filter((group) => !bucket || group.play === bucket.id);
  const groupItems = groups.flatMap((group, groupIndex) => group.discussions.map((discussion, discussionIndex) => ({
    id: `static-community-${groupIndex}-${discussionIndex}`,
    play: group.play,
    community: group.community,
    platform: group.community,
    group: group.group,
    sourceLabel: group.community,
    sourceBadge: "STATIC",
    sourceUrl: discussion.url,
    title: discussion.title,
    signal: discussion.signal,
    content: discussion.content,
    publishedAt: "",
    freshnessLabel: "Saved fallback",
    dateLabel: "Saved",
    coverageType: "static",
    coverageLabel: "Static",
  })));

  if (bucket) {
    return groupItems;
  }

  return getCommunitySuggestionItems().map((item, index) => ({
    id: `static-community-suggestion-${index}`,
    play: "announcements",
    community: item.community,
    platform: item.source,
    group: item.community,
    sourceLabel: item.source,
    sourceBadge: item.tags?.[0] || "SOURCE",
    sourceUrl: item.url,
    title: item.community,
    signal: item.relevance,
    content: item.suggestedMove,
    publishedAt: "",
    freshnessLabel: item.freshness || "Saved fallback",
    dateLabel: "Saved",
    coverageType: "static",
    coverageLabel: "Static",
  }));
}

function toCommunityCitation(item) {
  const coverage = getCommunitySignalCoverage(item);
  return {
    id: item.id,
    title: item.title || item.community || "Community signal",
    summary: item.signal || item.content || "Monitored community source used as evidence for this recommendation.",
    sourceName: `${item.community || item.platform || "Community"} - ${item.group || item.sourceLabel || "Source"}`,
    sourceBadge: item.sourceBadge || "SOURCE",
    sourceUrl: item.sourceUrl || "",
    updatedLabel: item.freshnessLabel || item.dateLabel || "Saved source",
    coverageType: coverage.type,
    coverageLabel: coverage.label,
  };
}

function getEvidenceTitle(pageId) {
  return {
    overview: "Evidence behind the overview roll-up",
    content: "Evidence behind content recommendations",
    events: "Evidence behind PMM action priorities",
    market: "Evidence behind market signal suggestions",
    product: "Evidence behind product capability suggestions",
    positioning: "Evidence behind positioning guidance",
    manage: "Evidence behind the saved source registry",
    "community-announcements": "Evidence behind announcement communities",
    "community-thought-leadership": "Evidence behind thought-leadership communities",
    "community-replies": "Evidence behind direct-reply opportunities",
    "community-manage": "Evidence behind community source settings",
  }[pageId] || "Evidence behind this page";
}

function getEvidencePageUse(pageId) {
  return {
    overview: "This page summarizes live competitor evidence before rolling it into executive-level insights.",
    content: "This page uses competitor blogs, product pages, review themes, and social signals to shape content topics.",
    events: "This page uses live competitor pressure to prioritize battle cards, briefings, and seller response assets.",
    market: "This page shows the source feed directly and keeps the top recommendation tied to the selected filter.",
    product: "This page combines the saved Netezza product baseline with live competitor capability and messaging evidence.",
    positioning: "This page converts competitor claims into Netezza counter-positioning grounded in cited source pages.",
    manage: "This page stores the saved product source bundle; the evidence below comes from the currently approved monitored endpoints and your edited URLs stay with the workspace.",
    "community-announcements": "This page uses community evidence to decide where Netezza announcements and releases should be shared.",
    "community-thought-leadership": "This page uses community evidence to identify where architecture POVs can travel credibly.",
    "community-replies": "This page uses community evidence to identify thread-native reply opportunities.",
    "community-manage": "This page controls the focus keywords and community links used by the community crawler.",
  }[pageId] || "This page uses the approved source registry to support the recommendation set.";
}

function getEvidenceScope(pageId) {
  return {
    overview: "Scope: all competitor sources",
    content: "Scope: blogs, webpages, review language, social",
    events: "Scope: social, reviews, webpages, blogs",
    market: "Scope: official pages, social, G2, TrustRadius, blogs",
    product: "Scope: product pages, blogs, review proof",
    positioning: "Scope: social narratives, webpages, reviews, blogs",
    manage: "Scope: saved product and source bundle",
    "community-announcements": "Scope: announcement-ready communities",
    "community-thought-leadership": "Scope: POV-ready community discussions",
    "community-replies": "Scope: reply-ready threads and Q&A",
    "community-manage": "Scope: focus keywords and community links",
  }[pageId] || "Scope: approved monitored sources";
}

function getEvidenceUpdated(meta, loading) {
  if (loading) {
    return "Refresh in progress";
  }
  if (meta?.refreshCompletedAt || meta?.lastUpdated) {
    return `Last refresh: ${formatDateTimePrecise(new Date(meta.refreshCompletedAt || meta.lastUpdated))}`;
  }
  return "Waiting for first refresh";
}

function pluralVerb(count) {
  return Number(count) === 1 ? "is" : "are";
}

function renderGenericPage(page) {
  const filteredSources = getFilteredSources(page.id);
  const highlights = getProductPageHighlights(page.id) || productizeForFocusProduct(page.highlights);
  return `
    <div class="section-heading"><div><p class="section-kicker">${escapeHtml(page.badge)}</p><h2>${escapeHtml(page.title)}</h2><p class="section-copy">${escapeHtml(focusProductText(page.description))}</p></div></div>
    <article class="section-banner"><div><span class="tone-pill tone-${page.tone}">${escapeHtml(page.badge)}</span><p class="section-copy">${escapeHtml(focusProductText(page.sourceIntro))}</p></div><div class="banner-driver"><strong>What it drives</strong><p class="section-copy">${escapeHtml(focusProductText(page.drives))}</p></div></article>
    <article class="panel"><div class="panel-header"><div><p class="panel-kicker">Source feed</p><h3>Configured monitoring sources</h3><p class="panel-subcopy">Filter by competitor, search by source name, edit URLs inline, and save your changes locally.</p></div></div>${renderSourcePanel(page, filteredSources)}</article>
    <article class="panel"><div class="panel-header"><div><p class="panel-kicker">Insights</p><h3>${escapeHtml(page.title)} recommendations</h3></div></div><div class="insight-grid">${highlights.map((highlight) => renderHighlightCard(highlight, page.tone)).join("")}</div></article>
    ${renderSourceEvidenceBox(page.id)}
  `;
}

function renderPositioningPage(page) {
  // Check if competitors are configured with URLs (Step 2 complete)
  const competitors = getConfiguredCompetitors();
  if (competitors.length === 0) {
    return renderCompetitorRequiredState(page, "Positioning");
  }

  const productShortName = getFocusProductShortName();
  const positioningDimensions = getProductPositioningDimensions();
  const strongestDimension = [...positioningDimensions].sort((left, right) => right.netezza - left.netezza)[0];
  const section = getLiveSectionData("positioning");
  const recommendation = section?.recommendation || getProductSpecificValue("positioningRecommendation", POSITIONING_RECOMMENDATION);
  const pillars = section?.messagePillars?.length ? section.messagePillars : getProductSpecificValue("messagePillars", MESSAGE_PILLARS);
  const responseAngles = section?.responseAngles?.length ? section.responseAngles : (getProductPageHighlights(page.id) || productizeForFocusProduct(page.highlights));
  return `
    <div class="section-heading"><div><p class="section-kicker">${escapeHtml(page.badge)}</p><h2>${escapeHtml(page.title)}</h2><p class="section-copy">${escapeHtml(focusProductText(page.description))}</p></div></div>
    <article class="section-banner"><div><span class="tone-pill tone-${page.tone}">${escapeHtml(page.badge)}</span><p class="section-copy">${escapeHtml(focusProductText(page.overviewHeadline))}</p></div><div class="banner-driver"><strong>Strongest position today</strong><p class="section-copy">${escapeHtml(strongestDimension.label)} (${strongestDimension.netezza.toFixed(1)})</p></div></article>
    <article class="positioning-recommendation-card">
      <div class="positioning-recommendation-icon">!</div>
      <div class="positioning-recommendation-copy">
        <p class="positioning-recommendation-label">${escapeHtml(recommendation.label)}</p>
        <p class="positioning-recommendation-text">${escapeHtml(productShortName)}'s clearest differentiated position: <strong>"${escapeHtml(recommendation.statement)}"</strong> ${escapeHtml(recommendation.evidence)}</p>
      </div>
    </article>
    <div class="positioning-grid">
      <article class="panel"><div class="panel-header"><div><p class="panel-kicker">Strength grid</p><h3>Positioning strength vs all 6 competitors</h3><p class="panel-subcopy">Scores out of 10 based on public reviews, analyst framing, website narratives, and saved product analysis.</p></div></div><div class="dimension-stack">${positioningDimensions.map((dimension) => renderDimensionCard(dimension)).join("")}</div></article>
      <article class="panel"><div class="panel-header"><div><p class="panel-kicker">${pillars.length} messaging pillars</p><h3>Core IBM-aligned talk track</h3></div></div><div class="pillar-grid">${pillars.map((pillar, index) => renderPillarCard(pillar, index)).join("")}</div></article>
    </div>
    <article class="panel"><div class="panel-header"><div><p class="panel-kicker">Response angles</p><h3>Counter-positioning framework</h3><p class="panel-subcopy">Field-ready rebuttals that translate competitor pressure into a sharper ${escapeHtml(productShortName)} narrative.</p></div></div><div class="angle-grid positioning-angle-grid">${responseAngles.map((highlight, index) => renderPositioningAngleCard(highlight, page.tone, index)).join("")}</div></article>
    <section class="metrics-grid">
      ${renderMetricCard("Reference sources", String(getSources(page.id).length), "neutral", "Managed in one place", `Owned product, review, and announcement sources used as the ${productShortName} baseline.`, true)}
      ${renderMetricCard("Positioning dimensions", String(positioningDimensions.length), "positive", "Scored vs all 6 competitors", `Core dimensions used to explain where ${productShortName} leads and where the story needs work.`)}
      ${renderMetricCard("Message pillars", String(pillars.length), "neutral", "Reusable talk tracks", "Use these pillars across overview, web copy, seller briefs, and event messaging.")}
      ${renderMetricCard("Response angles", String(responseAngles.length), "warn", "Prioritized rebuttal system", "Concise ways to translate competitive pressure into field-ready messaging.")}
    </section>
    ${renderSourceEvidenceBox(page.id)}
  `;
}

function renderContentIdeaItem(idea, expandedIdeaId) {
  const expanded = idea.id === expandedIdeaId;
  const hasStatus = Boolean(idea.status);
  return `
    <article class="content-idea-item ${expanded ? "expanded" : ""}">
      <div class="content-idea-row">
        <div class="content-idea-main">
          <div class="content-idea-icon">${escapeHtml(idea.icon)}</div>
          <div class="content-idea-copy">
            <div class="content-idea-title-row">
              <h3>${escapeHtml(idea.title)}</h3>
              ${hasStatus ? `<span class="content-status-pill">${escapeHtml(idea.status)}</span>` : ""}
            </div>
            <p class="content-idea-summary">${escapeHtml(idea.summary)}</p>
            <div class="content-idea-tags">
              <span class="content-platform-pill">${escapeHtml(idea.platform)}</span>
              ${idea.tags.map((tag) => `<span class="content-tag">${escapeHtml(tag)}</span>`).join("")}
            </div>
          </div>
        </div>
        <button class="content-outline-button" type="button" data-content-outline="${idea.id}">
          ${expanded ? "Close" : "Draft"} ${escapeHtml(idea.platform)}
        </button>
      </div>
      ${expanded ? `<div class="content-outline-panel"><pre>${escapeHtml(idea.outline)}</pre></div>` : ""}
    </article>
  `;
}

function renderPmmActionItem(action, expandedActionId) {
  const expanded = action.id === expandedActionId;
  const hasStatus = Boolean(action.status);
  const tags = Array.isArray(action.tags) ? action.tags.filter(Boolean).slice(0, 4) : [];
  const citations = Array.isArray(action.citations) ? action.citations.filter((item) => item?.sourceUrl).slice(0, 3) : [];
  return `
    <article class="pmm-action-item ${expanded ? "expanded" : ""}">
      <div class="pmm-action-row">
        <div class="pmm-action-main">
          <div class="pmm-action-icon">${escapeHtml(action.icon)}</div>
          <div class="pmm-action-copy">
            <div class="pmm-action-title-row">
              <h3>${escapeHtml(action.title)}</h3>
              ${hasStatus ? `<span class="pmm-status-pill">${escapeHtml(action.status)}</span>` : ""}
            </div>
            <p class="pmm-action-summary">${escapeHtml(action.summary)}</p>
            ${tags.length ? `<div class="pmm-action-tags">${tags.map((tag) => `<span class="tag tone-events">${escapeHtml(tag)}</span>`).join("")}</div>` : ""}
            ${citations.length ? `<div class="pmm-action-citations">${citations.map((citation) => renderPmmActionCitation(citation)).join("")}</div>` : ""}
          </div>
        </div>
        <button class="pmm-action-button" type="button" data-pmm-action="${action.id}">
          ${expanded ? "Close" : "Outline"}
        </button>
      </div>
      ${expanded ? `<div class="pmm-outline-panel"><pre>${escapeHtml(action.outline)}</pre></div>` : ""}
    </article>
  `;
}

function renderPmmActionCitation(citation) {
  return `
    <a class="pmm-action-citation" href="${escapeAttribute(citation.sourceUrl)}" target="_blank" rel="noreferrer noopener">
      <span class="market-coverage-pill ${escapeAttribute(citation.coverageType || "static")}">${escapeHtml(citation.coverageLabel || "Static")}</span>
      <span>${escapeHtml(citation.sourceBadge || citation.sourceLabel || "Source")}</span>
    </a>
  `;
}

function renderProductMatrixRow(row, competitors = []) {
  return `
    <tr>
      <td class="product-capability-cell">
        <strong>${escapeHtml(row.capability)}</strong>
        <span>${escapeHtml(row.note)}</span>
      </td>
      <td class="product-status-cell is-netezza" title="${escapeHtml(row.details?.focus || "")}">${renderProductStatus(row.statuses.focus)}</td>
      ${competitors.map((name) => `<td class="product-status-cell" title="${escapeHtml(row.details?.[name] || "")}">${renderProductStatus(row.statuses[name] || "partial")}</td>`).join("")}
      <td class="product-gap-score-cell">${renderProductGapScore(row.gapScore)}</td>
    </tr>
  `;
}

function renderProductStrengthCard(item) {
  return `
    <article class="product-strength-card">
      <div class="product-strength-top">
        <span class="product-strength-status">${escapeHtml(item.status)}</span>
        <h3>${escapeHtml(item.title)}</h3>
      </div>
      <p class="product-strength-copy">${escapeHtml(item.summary)}</p>
      <div class="product-strength-meta">
        <div>
          <span class="product-mini-label">Use this now</span>
          <p>${escapeHtml(item.leverage)}</p>
        </div>
      </div>
      <div class="tag-row">
        ${item.tags.map((tag) => `<span class="tag tone-product">${escapeHtml(tag)}</span>`).join("")}
      </div>
    </article>
  `;
}

function renderProductGapCard(item) {
  const productShortName = getFocusProductShortName();
  return `
    <article class="product-gap-card">
      <div class="product-gap-top">
        <div class="product-gap-heading">
          <span class="product-gap-priority">${escapeHtml(item.priority)}</span>
          <h3>${escapeHtml(item.title)}</h3>
        </div>
        <div class="product-gap-score-label">Gap score: ${escapeHtml(item.gapScore)}</div>
      </div>
      <p class="product-gap-copy">${escapeHtml(item.copy)}</p>
      <div class="product-gap-meta-grid">
        <div>
          <span class="product-mini-label">What ${escapeHtml(productShortName)} has now</span>
          <p>${escapeHtml(item.current)}</p>
        </div>
        <div>
          <span class="product-mini-label">IBM asset to leverage</span>
          <p>${escapeHtml(item.leverage)}</p>
        </div>
        <div>
          <span class="product-mini-label">Buyer impact</span>
          <p>${escapeHtml(item.impact)}</p>
        </div>
      </div>
      <div class="product-gap-competitors">
        <span class="product-mini-label">Competitors with this capability</span>
        <div class="tag-row">
          ${item.competitors.map((tag) => `<span class="tag">${escapeHtml(tag)}</span>`).join("")}
        </div>
      </div>
    </article>
  `;
}

function renderManageSourceGroup(page) {
  const sourceCount = getSources(page.id).length;
  return `
    <details class="manage-source-details">
      <summary>
        <div>
          <p class="panel-kicker">${escapeHtml(page.badge)}</p>
          <h3>${escapeHtml(page.title)}</h3>
          <p class="panel-subcopy">${escapeHtml(focusProductText(page.sourceIntro))}</p>
        </div>
        <span class="mini-pill">${sourceCount} sources</span>
      </summary>
      <div class="manage-source-details-body">
        ${renderSourcePanel(page, getFilteredSources(page.id))}
      </div>
    </details>
  `;
}

function getCommunityBucketForPage(pageId) {
  return {
    "community-announcements": {
      id: "announcements",
      title: "Best for announcements",
      description: "Use these communities when IBM Netezza has launches, release notes, product updates, or announcement moments that can ride existing attention.",
      label: "Best for release drops",
    },
    "community-thought-leadership": {
      id: "thought-leadership",
      title: "Best for thought leadership",
      description: "Use these when you want to share a stronger category point of view, architecture guidance, or narrative framing rather than a direct product post.",
      label: "Best for architecture POVs",
    },
    "community-replies": {
      id: "replies",
      title: "Best for direct engagement replies",
      description: "Use these when the conversation is already active and the best move is a contextual response, proof point, or thread-native follow-up.",
      label: "Best for reply-based engagement",
    },
  }[pageId];
}

function getCommunityGroupsForBucket(bucketId) {
  const liveItems = Array.isArray(state.communityFeed?.items)
    ? state.communityFeed.items.filter((item) => item.play === bucketId)
    : [];

  if (!state.communityFeed?.loading && liveItems.length) {
    const grouped = new Map();
    liveItems.forEach((item) => {
      const key = `${item.community || item.platform}::${item.group || item.sourceLabel}`;
      if (!grouped.has(key)) {
        grouped.set(key, {
          community: item.community || item.platform || "Community",
          group: item.group || item.sourceLabel || "Monitored source",
          audience: item.audience || "Relevant data and analytics practitioners",
          fit: item.fit || item.content || "Relevant monitored community signal.",
          discussions: [],
        });
      }

      grouped.get(key).discussions.push({
        title: item.title || `${item.community || item.platform} signal`,
        signal: item.signal || item.summary || "",
        content: item.content || "Review the linked source and decide whether a launch post, POV, or reply is useful.",
        url: item.sourceUrl,
        sourceLabel: item.sourceLabel || item.platform || "Source",
        sourceBadge: item.sourceBadge || "SOURCE",
        freshnessLabel: item.freshnessLabel || "",
        dateLabel: item.dateLabel || "",
        actionLabel: item.actionLabel || "Open source",
        isNew: Boolean(item.isNew),
        coverageType: item.coverageType,
        coverageLabel: item.coverageLabel,
      });
    });

    return [...grouped.values()];
  }

  return COMMUNITY_SIGNAL_GROUPS.filter((group) => group.play === bucketId);
}

function getCommunityFeedStatus() {
  const meta = state.communityFeed?.meta || {};
  const label = state.communityFeed?.loading
    ? "Refreshing community crawler"
    : meta.status || "Community source monitoring";
  const detail = state.communityFeed?.error
    ? "The dashboard is using saved community guidance because the latest crawler refresh did not complete."
    : meta.totalSources
      ? `${meta.activeSources || 0} of ${meta.totalSources} monitored community sources produced source-backed items${meta.failedSources ? `; ${meta.failedSources} ${pluralVerb(meta.failedSources)} covered by fallback coverage` : ""}.`
      : "Monitoring approved community, social, forum, Q&A, and developer sources.";
  const updated = meta.lastUpdated
    ? `Last refresh: ${formatDateTime(new Date(meta.lastUpdated))}`
    : `Last refresh: ${formatDateTime(new Date(state.communityMeta.lastUpdated))}`;

  return {
    label,
    detail,
    updated,
    error: state.communityFeed?.error || "",
  };
}

function getCommunitySuggestionItems() {
  const liveItems = Array.isArray(state.communityFeed?.items) ? state.communityFeed.items : [];
  if (!state.communityFeed?.loading && liveItems.length) {
    return liveItems.slice(0, 6).map((item) => ({
      community: `${item.community || item.platform} - ${item.group || item.sourceLabel}`,
      source: item.sourceLabel || item.platform || "Source",
      freshness: item.freshnessLabel || item.dateLabel || "Live source",
      url: item.sourceUrl,
      relevance: item.signal || item.title || "",
      suggestedMove: item.content || "Review the linked source and decide the best PMM action.",
      tags: item.tags?.length ? item.tags : [item.sourceBadge || "Source"],
      coverageType: item.coverageType,
      coverageLabel: item.coverageLabel,
    }));
  }

  return NETEZZA_COMMUNITY_SUGGESTIONS.map((item) => ({
    ...item,
    coverageType: "static",
    coverageLabel: "Static",
  }));
}

function renderCommunitySignalsPage(page) {
  // Setup guard: Community Intelligence is driven by community keywords and
  // platform links. Without any configured, results would come from generic
  // fallbacks, so show a setup-needed state instead.
  const hasCommunitySetup = (state.communityKeywords || []).length > 0
    || (state.communityPlatforms || []).length > 0;
  if (!hasCommunitySetup) {
    return renderCommunitySetupRequiredState(page);
  }
  const productShortName = getFocusProductShortName();
  const bucket = getCommunityBucketForPage(page.id);
  const groups = getCommunityGroupsForBucket(bucket.id);
  const status = getCommunityFeedStatus();
  const discussionCount = groups.reduce((sum, group) => sum + group.discussions.length, 0);
  const bucketMetrics = bucket.id === "announcements"
    ? [
        ["Communities found", String(groups.length), "neutral", "Release-aware shortlist", "Communities most suitable for launch notes, release posts, and announcement visibility."],
        ["Active discussion pages", String(discussionCount), "positive", "Announcement-friendly threads", `Existing discussion pages where a ${getFocusProductShortName()} release can join the conversation at the right moment.`],
        ["Community links", String(state.communityPlatforms.length), "warn", "Editable in Manage", "Community links currently in scope for launch and release sharing."],
        ["Best move", "Release drop", "neutral", "Right-time distribution", `Use these spaces when ${getFocusProductDisplayName()} has a product update, release note, or formal announcement.`],
      ]
    : bucket.id === "thought-leadership"
      ? [
          ["Communities found", String(groups.length), "neutral", "POV-ready shortlist", "Communities where architecture framing and category narrative posts can travel well."],
          ["Active discussion pages", String(discussionCount), "positive", "Debate-heavy threads", "Discussion pages where warehouse, lakehouse, and modernization narratives are actively being shaped."],
          ["Focus themes", String(state.communityKeywords.length), "neutral", "Editable in Manage", "Keyword themes that drive which category debates stay in scope."],
          ["Best move", "Architecture POV", "warn", "Narrative shaping", `Use these spaces for ${getFocusProductDisplayName()} thought leadership rather than direct launch promotion.`],
        ]
      : [
          ["Communities found", String(groups.length), "neutral", "Reply-ready shortlist", "Communities where the best move is a contextual reply inside an existing thread."],
          ["Active discussion pages", String(discussionCount), "positive", "Conversation entry points", "Discussion pages where the team can respond with proof, guidance, or a thread-native follow-up."],
          ["Focus themes", String(state.communityKeywords.length), "neutral", "Editable in Manage", "Keyword themes currently shaping which conversations get prioritized."],
          ["Best move", "Direct reply", "warn", "Thread-native engagement", "Use these spaces when the strongest action is a contextual response instead of a standalone post."],
        ];
  return `
    <div class="section-heading">
      <div>
        <p class="section-kicker">${escapeHtml(page.badge)}</p>
        <h2>${escapeHtml(page.title)}</h2>
        <p class="section-copy">${escapeHtml(focusProductText(page.description))}</p>
      </div>
      <button class="secondary-button" type="button" data-community-refresh>Refresh now</button>
    </div>
    <section class="metrics-grid">
      ${bucketMetrics.map((metric, index) => renderMetricCard(metric[0], metric[1], metric[2], metric[3], metric[4], index === 0)).join("")}
    </section>
    <div class="community-stack">
      <article class="panel">
        <div class="panel-header">
          <div>
          <p class="panel-kicker">Engagement bucket</p>
          <h3>${escapeHtml(bucket.title)}</h3>
          <p class="panel-subcopy">${escapeHtml(focusProductText(bucket.description))}</p>
        </div>
          <span class="mini-pill">${escapeHtml(status.label)}</span>
        </div>
        <div class="market-feed-status community-feed-status">
          <div class="market-feed-status-copy">
            <strong>${escapeHtml(groups.length)} platform ${groups.length === 1 ? "group" : "groups"}</strong>
            <span>${escapeHtml(status.detail)}</span>
            ${status.error ? `<span class="market-feed-warning">${escapeHtml(status.error)}</span>` : ""}
          </div>
          <div class="market-feed-status-meta">
            <span>${escapeHtml(status.updated)}</span>
          </div>
        </div>
        <div class="community-stack">
          ${groups.map((group) => `
            <article class="summary-card community-group-card">
              <div class="panel-header">
                <div>
                  <p class="panel-kicker">${escapeHtml(group.community)}</p>
                  <h3>${escapeHtml(group.group)}</h3>
                  <p class="panel-subcopy">${escapeHtml(group.audience)}</p>
                </div>
                <div class="tag-row">
                  <span class="tag tone-${page.tone}">${escapeHtml(bucket.label)}</span>
                  <span class="mini-pill">${group.discussions.length} discussion ${group.discussions.length === 1 ? "page" : "pages"}</span>
                </div>
              </div>
              <p class="summary-copy"><strong>Why this is relevant:</strong> ${escapeHtml(focusProductText(group.fit))}</p>
              <div class="community-signal-list">
                ${group.discussions.map((discussion) => `
                  <article class="summary-card community-signal-card">
                    <div class="summary-top">
                      <div>
                        <span class="tone-pill tone-${page.tone}">${escapeHtml(bucket.label)}</span>
                        <h3>${escapeHtml(discussion.title)}</h3>
                      </div>
                    </div>
                    <p class="summary-copy"><strong>What is being discussed:</strong> ${escapeHtml(discussion.signal)}</p>
                    <p class="summary-copy"><strong>Why ${escapeHtml(productShortName)} should care:</strong> ${escapeHtml(focusProductText(discussion.content))}</p>
                    <div class="community-signal-footer">
                      <div class="market-signal-meta">
                        <span>${escapeHtml(discussion.sourceLabel || group.community)}</span>
                        ${discussion.freshnessLabel ? `<span>•</span><span>${escapeHtml(discussion.freshnessLabel)}</span>` : ""}
                        ${discussion.dateLabel ? `<span>•</span><span>${escapeHtml(discussion.dateLabel)}</span>` : ""}
                        ${discussion.sourceBadge ? `<span class="tag tone-market">${escapeHtml(discussion.sourceBadge)}</span>` : ""}
                        <span class="market-coverage-pill ${getCommunitySignalCoverage(discussion).type}">${escapeHtml(getCommunitySignalCoverage(discussion).label)}</span>
                        ${discussion.isNew ? `<span class="market-new-badge">NEW</span>` : ""}
                      </div>
                      <a class="market-action-link" href="${escapeAttribute(discussion.url)}" target="_blank" rel="noreferrer noopener">${escapeHtml(discussion.actionLabel || "Open discussion page")}</a>
                    </div>
                  </article>
                `).join("")}
              </div>
            </article>
          `).join("")}
        </div>
      </article>
    </div>
    ${renderSourceEvidenceBox(page.id, { section: "community" })}
  `;
}

function renderCommunityManagePage(page) {
  const workspace = getActiveProductWorkspace();
  return `
    <div class="section-heading">
      <div>
        <p class="section-kicker">${escapeHtml(page.badge)}</p>
        <h2>${escapeHtml(page.title)}</h2>
        <p class="section-copy">Set the community discovery keywords and community links for ${escapeHtml(getFocusProductShortName())}. Product details are pulled from Competitive Intelligence Manage.</p>
      </div>
    </div>
    <article class="panel">
      <div class="panel-header">
        <div>
          <p class="panel-kicker">Focus product context</p>
          <h3>Imported from Competitive Intelligence Manage</h3>
          <p class="panel-subcopy">Update these product details in the Competitive Intelligence Manage section.</p>
        </div>
      </div>
      <div class="profile-summary-grid">
        <article class="field-card">
          <p class="field-label">Focus product name</p>
          <div class="field-value">${escapeHtml(workspace.displayName || "Not set")}</div>
        </article>
        <article class="field-card">
          <p class="field-label">Product page URL</p>
          <div class="field-value">${workspace.productUrl ? `<a href="${escapeAttribute(workspace.productUrl)}" target="_blank" rel="noreferrer noopener">${escapeHtml(workspace.productUrl)}</a>` : "Not set"}</div>
        </article>
        <article class="field-card">
          <p class="field-label">Primary buyer</p>
          <div class="field-value">${escapeHtml(workspace.primaryBuyer || "Not set")}</div>
        </article>
      </div>
    </article>
    <article class="panel">
      <div class="panel-header">
        <div>
          <p class="panel-kicker">Step 1</p>
          <h3>Focus keywords</h3>
          <p class="panel-subcopy">Add the keywords SignalOps should use to identify relevant discussions, release conversations, migration topics, and buyer questions.</p>
        </div>
      </div>
      <div class="source-toolbar">
        <button class="secondary-button" type="button" data-add-community-keyword>Add keyword</button>
        <button class="ghost-button" type="button" data-reset-community-keywords>Clear keywords</button>
      </div>
      <p class="toolbar-note">${state.communityKeywords.length} keyword rows in the current view.</p>
      <div class="source-list">
        ${state.communityKeywords.length ? state.communityKeywords.map((keyword, index) => renderCommunityKeywordRow(keyword, index)).join("") : `<div class="empty-state">No focus keywords added yet.</div>`}
      </div>
    </article>
    <article class="panel">
      <div class="panel-header">
        <div>
          <p class="panel-kicker">Step 2</p>
          <h3>Community links</h3>
          <p class="panel-subcopy">Add community, forum, Q&A, social, developer, or practitioner links that should be monitored for this product.</p>
        </div>
      </div>
      <div class="source-toolbar">
        <button class="secondary-button" type="button" data-add-community-platform>Add community link</button>
        <button class="ghost-button" type="button" data-reset-community-platforms>Clear links</button>
      </div>
      <p class="toolbar-note">${state.communityPlatforms.length} community link rows in the current view.</p>
      <div class="source-list">
        ${state.communityPlatforms.length ? state.communityPlatforms.map((platform, index) => renderCommunityPlatformRow(platform, index)).join("") : `<div class="empty-state">No community links added yet.</div>`}
      </div>
    </article>
  `;
}

function renderNetezzaCommunitySuggestionsPanel() {
  const productShortName = getFocusProductShortName();
  const suggestions = getCommunitySuggestionItems();
  return `
    <article class="panel community-suggestions-panel">
      <div class="panel-header">
        <div>
          <p class="panel-kicker">Latest relevant communities</p>
          <h3>Suggested communities to monitor for ${escapeHtml(productShortName)}</h3>
          <p class="panel-subcopy">Use these as a source-backed shortlist: official Netezza spaces first, then practitioner and integration communities where competitor comparisons or migration blockers may appear.</p>
        </div>
        <span class="mini-pill">${suggestions.length} suggestions</span>
      </div>
      <div class="community-suggestion-grid">
        ${suggestions.map((item) => `
          <article class="community-suggestion-card">
            <div class="community-suggestion-top">
              <div>
                <span class="tone-pill tone-positioning">${escapeHtml(item.source)}</span>
                <h4>${escapeHtml(item.community)}</h4>
              </div>
              <div class="source-evidence-status">
                <span class="market-coverage-pill ${getCommunitySignalCoverage(item).type}">${escapeHtml(getCommunitySignalCoverage(item).label)}</span>
                <span class="mini-pill">${escapeHtml(item.freshness)}</span>
              </div>
            </div>
            <p>${escapeHtml(item.relevance)}</p>
            <div class="community-suggestion-move">
              <strong>Suggested move</strong>
              <span>${escapeHtml(item.suggestedMove)}</span>
            </div>
            <div class="community-suggestion-footer">
              <div class="tag-row">
                ${item.tags.map((tag) => `<span class="tag tone-market">${escapeHtml(tag)}</span>`).join("")}
              </div>
              <a class="market-action-link" href="${escapeAttribute(item.url)}" target="_blank" rel="noreferrer noopener">Open</a>
            </div>
          </article>
        `).join("")}
      </div>
    </article>
  `;
}

function renderCommunityKeywordRow(keyword, index) {
  return `
    <article class="source-row ${keyword.dirty ? "dirty" : ""}">
      <div class="source-name">
        <span class="tone-pill tone-content">KEYWORD</span>
        <div><strong>Focus keyword ${index + 1}</strong><div class="source-subline">Discovery scope</div></div>
      </div>
      <input class="source-input" type="text" value="${escapeAttribute(keyword.value)}" data-community-keyword-input data-keyword-id="${keyword.id}">
      <div class="source-actions">
        <button class="save-button" type="button" data-save-community-keyword data-keyword-id="${keyword.id}">Save</button>
        <button class="delete-button" type="button" data-delete-community-keyword data-keyword-id="${keyword.id}">×</button>
      </div>
    </article>
  `;
}

function renderCommunityPlatformRow(platform, index) {
  return `
    <article class="source-row ${platform.dirty ? "dirty" : ""}">
      <div class="source-name">
        <span class="tone-pill tone-market">LINK</span>
        <div><strong>Community link ${index + 1}</strong><div class="source-subline">Community URL</div></div>
      </div>
      <input class="source-input" type="url" value="${escapeAttribute(platform.value)}" data-community-platform-input data-platform-id="${platform.id}" placeholder="https://community.example.com/topic">
      <div class="source-actions">
        <button class="save-button" type="button" data-save-community-platform data-platform-id="${platform.id}">Save</button>
        <button class="delete-button" type="button" data-delete-community-platform data-platform-id="${platform.id}">×</button>
      </div>
    </article>
  `;
}
function renderSourcePanel(page, filteredSources) {
  const filters = state.filters[page.id];
  const competitorOptions = ["All competitors", ...getCoveredCompetitors(page.id)];
  return `
    <div class="source-toolbar">
      <input type="search" placeholder="Search sources, competitors, or URLs..." value="${escapeAttribute(filters.search)}" data-page-search data-page-id="${page.id}">
      <select data-page-competitor data-page-id="${page.id}">
        ${competitorOptions.map((option) => `<option value="${escapeAttribute(option)}" ${option === filters.competitor ? "selected" : ""}>${escapeHtml(option)}</option>`).join("")}
      </select>
      <button class="secondary-button" type="button" data-add-source="${page.id}">Add source</button>
      <button class="ghost-button" type="button" data-reset-sources="${page.id}">Restore defaults</button>
    </div>
    <p class="toolbar-note">${filteredSources.length} source rows in the current view.</p>
    <div class="source-list">
      ${filteredSources.length ? filteredSources.map((source) => renderSourceRow(page.id, page.tone, source)).join("") : `<div class="empty-state">No source rows match the current filter. Try widening the search or switching back to all competitors.</div>`}
    </div>
  `;
}

function renderSourceRow(pageId, tone, source) {
  const url = getDisplayUrl(pageId, source.id);
  const dirty = Boolean(state.drafts[pageId]?.[source.id] !== undefined);
  const hasUrl = Boolean(url.trim());
  return `
    <article class="source-row ${dirty ? "dirty" : ""}">
      <div class="source-name">
        <span class="tone-pill tone-${tone}">${escapeHtml(source.kind)}</span>
        <div><strong>${escapeHtml(source.label)}</strong><div class="source-subline">${escapeHtml(source.competitor)}</div></div>
      </div>
      <input class="source-input" type="text" value="${escapeAttribute(url)}" data-source-url data-page-id="${pageId}" data-source-id="${source.id}">
      <div class="source-actions">
        <a class="open-link ${hasUrl ? "" : "disabled"}" href="${hasUrl ? escapeAttribute(url) : "#"}" target="_blank" rel="noreferrer noopener">Open</a>
        <button class="save-button" type="button" data-save-source data-page-id="${pageId}" data-source-id="${source.id}">Save</button>
        <button class="delete-button" type="button" data-delete-source data-page-id="${pageId}" data-source-id="${source.id}">×</button>
      </div>
    </article>
  `;
}

function renderHighlightCard(highlight, tone) {
  return `<article class="insight-card"><div class="insight-top"><div><span class="tone-pill tone-${tone}">${escapeHtml(highlight.priority)}</span><h3>${escapeHtml(highlight.title)}</h3></div><span class="mini-pill">${escapeHtml(highlight.competitor)}</span></div><p class="insight-copy">${escapeHtml(highlight.summary)}</p><div class="tag-row">${highlight.tags.map((tag) => `<span class="tag tone-${tone}">${escapeHtml(tag)}</span>`).join("")}</div><p class="insight-copy highlight-meta"><strong>Recommended move:</strong> ${escapeHtml(highlight.recommendation)}</p></article>`;
}

function renderDimensionCard(dimension) {
  const isGap = dimension.netezza < 7.5;
  return `<article class="dimension-card"><div class="dimension-top"><div><h3>${escapeHtml(dimension.label)}</h3><p class="dimension-note">${escapeHtml(dimension.note)}</p></div><span class="score-value ${isGap ? "score-value-warn" : ""}">${dimension.netezza.toFixed(1)}</span></div><div class="score-bar"><div class="score-fill ${isGap ? "score-fill-warn" : ""}" style="width:${dimension.netezza * 10}%"></div></div><div class="peer-row">${Object.entries(dimension.competitors).map(([competitor, score]) => `<span class="peer-pill">${escapeHtml(competitor)}: ${score.toFixed(1)}</span>`).join("")}</div></article>`;
}

function renderPillarCard(pillar, index) {
  return `<article class="pillar-card ${escapeHtml(pillar.tone)}"><p class="pillar-label">Pillar ${index + 1} · ${escapeHtml(pillar.title)}</p><p class="pillar-quote">"${escapeHtml(pillar.text)}"</p></article>`;
}

function renderPositioningAngleCard(highlight, tone, index) {
  return `<article class="angle-card positioning-angle-card"><p class="angle-label">Angle ${index + 1}</p><h3>${escapeHtml(highlight.title)}</h3><p class="angle-copy">${escapeHtml(highlight.summary)}</p><div class="tag-row">${highlight.tags.map((tag) => `<span class="tag tone-${tone}">${escapeHtml(tag)}</span>`).join("")}</div><p class="angle-recommendation"><strong>What to say:</strong> ${escapeHtml(highlight.recommendation)}</p></article>`;
}

function renderProductStatus(status) {
  const icon = status === "strong" ? "✓" : status === "partial" ? "◆" : "×";
  return `<span class="product-status-icon ${escapeHtml(status)}">${icon}</span>`;
}

function renderProductGapScore(score) {
  const numeric = Number(score || 0);
  const percentage = Math.max(0, Math.min(100, (numeric / 10) * 100));
  const tone = numeric >= 6 ? "high" : numeric >= 4.5 ? "medium" : "low";
  return `
    <div class="product-gap-score-wrap">
      <div class="product-gap-score-bar"><div class="product-gap-score-fill ${tone}" style="width:${percentage}%"></div></div>
      <strong>${numeric ? numeric.toFixed(1) : "0"}</strong>
    </div>
  `;
}

function renderOverviewMarketSignalPanel() {
  const marketPage = PAGE_CONFIG_BY_ID.market;
  const primaryInsight = marketPage ? getOverviewInsightForPage(marketPage) : null;
  const signals = getMarketEvidenceItems("overview", 4);

  return `
    ${primaryInsight ? `
      <article class="overview-evidence-callout">
        <span class="tone-pill tone-market">${escapeHtml(primaryInsight.priority)}</span>
        <div>
          <h4>${escapeHtml(primaryInsight.title)}</h4>
          <p>${escapeHtml(primaryInsight.summary)}</p>
        </div>
      </article>
    ` : ""}
    <div class="overview-signal-grid">
      ${signals.map((item) => `
        <article class="overview-signal-card">
          <div class="overview-signal-top">
            <span class="mini-pill">${escapeHtml(item.competitor)}</span>
            <span class="market-coverage-pill ${getMarketSignalCoverage(item).type}">${escapeHtml(getMarketSignalCoverage(item).label)}</span>
          </div>
          <h4><a href="${escapeAttribute(item.sourceUrl)}" target="_blank" rel="noreferrer noopener">${escapeHtml(item.sourceLabel)}: ${escapeHtml(item.freshnessLabel || item.dateLabel || "Saved source")}</a></h4>
          <p>${escapeHtml(item.summary)}</p>
        </article>
      `).join("")}
    </div>
  `;
}

function renderOverviewPositioningPanel() {
  const recommendation = getProductSpecificValue("positioningRecommendation", POSITIONING_RECOMMENDATION);
  const dimensions = [...getProductPositioningDimensions()]
    .sort((left, right) => right.netezza - left.netezza)
    .slice(0, 3);

  return `
    <div class="overview-positioning-layout">
      ${renderOverviewRadarChart()}
      <aside class="overview-positioning-insights">
        <article class="overview-evidence-callout">
          <span class="tone-pill tone-positioning">${escapeHtml(recommendation.label)}</span>
          <div>
            <h4>${escapeHtml(recommendation.statement)}</h4>
            <p>${escapeHtml(recommendation.evidence)}</p>
          </div>
        </article>
        <div class="overview-dimension-list">
          ${dimensions.map((dimension) => `
            <article class="overview-dimension-item">
              <div>
                <strong>${escapeHtml(dimension.label)}</strong>
                <p>${escapeHtml(dimension.note)}</p>
              </div>
              <span>${dimension.netezza.toFixed(1)}</span>
            </article>
          `).join("")}
        </div>
      </aside>
    </div>
  `;
}

function renderOverviewSentimentChart() {
  const sentiment = getLiveSectionData("overview")?.sentiment?.length ? getLiveSectionData("overview").sentiment : getProductSpecificValue("sentiment", COMPETITIVE_SENTIMENT);
  return `
    <div class="sentiment-legend">
      <span class="sentiment-legend-item"><span class="sentiment-swatch positive"></span> Positive</span>
      <span class="sentiment-legend-item"><span class="sentiment-swatch neutral"></span> Neutral</span>
      <span class="sentiment-legend-item"><span class="sentiment-swatch negative"></span> Negative</span>
    </div>
    <div class="sentiment-chart">
      <div class="sentiment-y-axis">
        ${[100, 80, 60, 40, 20, 0].map((value) => `<span>${value}%</span>`).join("")}
      </div>
      <div class="sentiment-bars">
        ${sentiment.map((item) => `
          <div class="sentiment-column">
            <div class="sentiment-bar">
              <span class="sentiment-segment positive" style="height:${item.positive}%"></span>
              <span class="sentiment-segment neutral" style="height:${item.neutral}%"></span>
              <span class="sentiment-segment negative" style="height:${item.negative}%"></span>
            </div>
            <span class="sentiment-label">${escapeHtml(shortCompetitorLabel(item.name))}</span>
          </div>
        `).join("")}
      </div>
    </div>
  `;
}

function renderOverviewRadarChart() {
  const positioningDimensions = getProductPositioningDimensions();
  const axes = [
    { label: "Hybrid / On-prem", key: "Hybrid / on-prem deployment" },
    { label: "Query Performance", key: "Predictable query performance" },
    { label: "Compliance", key: "Regulated industry compliance" },
    { label: "SQL Simplicity", key: "SQL-first simplicity for analysts" },
    { label: "TCO Predictability", key: "TCO predictability" },
    { label: "AI / ML Ecosystem", key: "AI / ML ecosystem" },
  ];
  const series = buildOverviewRadarSeries(axes, positioningDimensions);
  const size = 520;
  const center = 260;
  const radius = 170;
  const rings = [2, 4, 6, 8, 10];

  return `
    <div class="overview-radar-wrap">
      <svg class="overview-radar-svg" viewBox="0 0 ${size} ${size}" role="img" aria-label="Competitive positioning radar">
        ${rings.map((ring) => `<polygon points="${getRadarPolygonPoints(axes, center, radius * (ring / 10))}" class="overview-radar-ring"></polygon>`).join("")}
        ${axes.map((axis, index) => {
          const end = getRadarPoint(index, axes.length, center, radius + 8);
          const label = getRadarPoint(index, axes.length, center, radius + 38);
          return `
            <line x1="${center}" y1="${center}" x2="${end.x}" y2="${end.y}" class="overview-radar-axis"></line>
            <text x="${label.x}" y="${label.y}" text-anchor="${getRadarTextAnchor(label.x, center)}" class="overview-radar-label">${escapeHtml(axis.label)}</text>
          `;
        }).join("")}
        ${series.map((item) => `
          <polygon points="${getRadarSeriesPoints(item.values, axes, center, radius)}" class="overview-radar-area" style="stroke:${escapeAttribute(item.color)}; fill:${escapeAttribute(withAlpha(item.color, item.isFocusProduct ? 0.14 : 0.07))}"></polygon>
        `).join("")}
        ${series.map((item) => item.values.map((value, index) => {
          const point = getRadarPoint(index, axes.length, center, radius * (value / 10));
          return `<circle cx="${point.x}" cy="${point.y}" r="${item.isFocusProduct ? 5.5 : 4}" fill="${escapeAttribute(item.color)}"></circle>`;
        }).join("")).join("")}
      </svg>
      <div class="overview-radar-legend">
        ${series.map((item) => `<span class="overview-radar-legend-item"><span class="overview-radar-legend-box" style="border-color:${escapeAttribute(item.color)}"></span>${escapeHtml(item.name)}</span>`).join("")}
      </div>
    </div>
  `;
}

function renderMetricCard(label, value, tone, foot, copy, highlight = false) {
  return `<article class="metric-card ${highlight ? "highlight" : ""}"><p class="panel-kicker">${escapeHtml(label)}</p><div class="metric-value">${escapeHtml(value)}</div><div class="metric-foot ${escapeHtml(tone)}">${escapeHtml(foot)}</div><p class="metric-copy">${escapeHtml(copy)}</p></article>`;
}

function renderSidebarCompetitors() {
  renderSidebarContext();
}

function updateHeaderMeta() {
  if (refs.userProfileEmail) {
    refs.userProfileEmail.textContent = accountContext.email || authContext.currentUser?.email || "Not signed in";
  }
  refs.focusProductName.textContent = getFocusProductDisplayName();
  refs.focusProductStatus.textContent = hasActiveProductWorkspace()
    ? `Profile: ${accountContext.email || accountContext.accountId} - Saved: ${formatDateTime(new Date(getActiveProductWorkspace().savedAt))}`
    : `Profile: ${accountContext.email || accountContext.accountId} - Add product in Manage`;
  ensureManualRefreshButton(refs);
  if (refs.lastUpdated) refs.lastUpdated.textContent = state.activeSection === "community"
    ? state.communityFeed?.meta?.lastUpdated
      ? formatDateTime(new Date(state.communityFeed.meta.lastUpdated))
      : formatDateTime(new Date(state.communityMeta.lastUpdated))
    : state.marketFeed.error || state.liveInsights.meta?.deliveryMode === "static-snapshot"
      ? "Fallback snapshot"
      : state.liveInsights.meta?.generatedAt
        ? formatDateTime(new Date(state.liveInsights.meta.generatedAt))
        : state.marketFeed.meta?.lastUpdated
          ? formatDateTime(new Date(state.marketFeed.meta.lastUpdated))
          : formatDateTime(new Date());
}

function ensureManualRefreshButton(refs) {
  if (!refs.lastUpdated || !refs.lastUpdated.parentElement) return;
  if (document.querySelector("#manualRefreshButton")) return;
  const button = document.createElement("button");
  button.id = "manualRefreshButton";
  button.type = "button";
  button.textContent = "\u21bb Refresh";
  button.title = "Re-crawl all sources now";
  button.style.cssText = "margin-top:6px;padding:4px 12px;border-radius:999px;border:1px solid rgba(255,255,255,0.6);background:rgba(255,255,255,0.16);color:#fff;font-size:12px;font-weight:600;cursor:pointer;display:block;width:100%;";
  button.addEventListener("click", async () => {
    if (button.disabled) return;
    button.disabled = true;
    const originalLabel = button.textContent;
    button.textContent = "Refreshing...";
    try {
      await Promise.allSettled([
        loadMarketSignals({ force: true, showLoadingState: false }),
        loadCommunitySignals({ force: true, showLoadingState: false }),
      ]);
    } finally {
      button.textContent = originalLabel;
      button.disabled = false;
    }
  });
  refs.lastUpdated.parentElement.appendChild(button);
}

function getTotalSourceCount() {
  return state.activeSection === "community"
    ? state.communityFeed?.meta?.totalSources || state.communityKeywords.length + state.communityPlatforms.length
    : INSIGHT_PAGES.reduce((sum, page) => sum + getSources(page.id).length, 0) + (state.documentSources?.length || 0);
}

function getSectionInsightTypeCount() {
  return state.activeSection === "community" ? COMMUNITY_PAGES.length : INSIGHT_PAGES.length;
}

function getSources(pageId) {
  return Array.isArray(state.sources[pageId]) ? state.sources[pageId] : [];
}

function getCoveredCompetitors(pageId) {
  return [...new Set(getSources(pageId).map((source) => source.competitor).filter(Boolean))];
}

function getFilteredSources(pageId) {
  const filters = state.filters[pageId];
  const search = filters.search.trim().toLowerCase();
  return getSources(pageId).filter((source) => {
    const url = getDisplayUrl(pageId, source.id).toLowerCase();
    const matchesCompetitor = filters.competitor === "All competitors" || source.competitor === filters.competitor;
    const matchesSearch = !search || [source.kind, source.label, source.competitor, url].join(" ").toLowerCase().includes(search);
    return matchesCompetitor && matchesSearch;
  });
}

function getDisplayUrl(pageId, sourceId) {
  const draft = state.drafts[pageId]?.[sourceId];
  if (draft !== undefined) return draft;
  return getSources(pageId).find((source) => source.id === sourceId)?.url || "";
}

function setActivePage(pageId, { scrollToTop = false } = {}) {
  const validPages = state.activeSection === "community" ? COMMUNITY_PAGE_IDS : PMM_PAGE_IDS;
  state.activePage = validPages.includes(pageId) && refs.sections[pageId] ? pageId : validPages[0];
  if (state.activePage !== "manage") {
    state.newProductDraftActive = false;
  }
  state.activePageBySection[state.activeSection] = state.activePage;
  if (state.activePage === "overview") {
    renderOverview();
  } else {
    renderPage(state.activePage);
  }
  [...refs.sidebarPageNav.querySelectorAll("[data-page-target]")].forEach((button) => button.classList.toggle("active", button.dataset.pageTarget === state.activePage));
  Object.entries(refs.sections).forEach(([id, section]) => section.classList.toggle("active", id === state.activePage));
  persistShellState();
  if (scrollToTop) {
    requestAnimationFrame(() => window.scrollTo({ top: 0, behavior: "smooth" }));
  }
}

function setActiveSection(sectionId) {
  state.activeSection = sectionId === "community" ? "community" : "pmm";
  renderShell();
  setActivePage(state.activePageBySection[state.activeSection]);
  updateHeaderMeta();
}

function startCommunityAutoRefresh() {
  if (communityRefreshTimer) {
    window.clearInterval(communityRefreshTimer);
  }

  communityRefreshTimer = window.setInterval(() => {
    loadCommunitySignals({ force: true, showLoadingState: false });
  }, COMMUNITY_REFRESH_INTERVAL_MS);
}
function attachEvents() {
  if (eventsAttached) return;
  eventsAttached = true;

  document.addEventListener("click", (event) => {
    const authModeSwitch = event.target.closest("[data-auth-mode-switch]");
    if (authModeSwitch) {
      renderAuthGate(authModeSwitch.dataset.authModeSwitch);
      return;
    }

    const authSubmitButton = event.target.closest("[data-auth-submit]");
    if (authSubmitButton) {
      handleAuthSubmit();
      return;
    }

    const signOutButton = event.target.closest("[data-sign-out]");
    if (signOutButton) {
      handleSignOut();
      return;
    }

    if (!authContext.currentUser) return;

    const sectionTab = event.target.closest("[data-section-target]");
    if (sectionTab) {
      setActiveSection(sectionTab.dataset.sectionTarget);
      return;
    }

    const pageButton = event.target.closest("[data-page-target]");
    if (pageButton) {
      setActivePage(pageButton.dataset.pageTarget);
      return;
    }

    const openPageButton = event.target.closest("[data-open-page]");
    if (openPageButton) {
      setActivePage(openPageButton.dataset.openPage, { scrollToTop: true });
      return;
    }

    const focusProductButton = event.target.closest("#focusProductButton");
    if (focusProductButton) {
      openProductLibrary();
      return;
    }

    const applyAccountLinkButton = event.target.closest("[data-apply-account-link]");
    if (applyAccountLinkButton) {
      openAccountLinkFromPanel();
      return;
    }

    const copyAccountLinkButton = event.target.closest("[data-copy-account-link]");
    if (copyAccountLinkButton) {
      copyAccountLinkFromPanel();
      return;
    }

    const saveFocusProductButton = event.target.closest("[data-save-focus-product]");
    if (saveFocusProductButton) {
      saveFocusProductWorkspace();
      return;
    }

    const saveFocusProductAsNewButton = event.target.closest("[data-save-focus-product-as-new]");
    if (saveFocusProductAsNewButton) {
      saveFocusProductWorkspace({ asNew: true });
      return;
    }

    const newFocusProductButton = event.target.closest("[data-new-focus-product]");
    if (newFocusProductButton) {
      prepareNewFocusProductForm();
      return;
    }

    const deleteFocusProductButton = event.target.closest("[data-delete-focus-product]");
    if (deleteFocusProductButton) {
      event.stopPropagation();
      deleteFocusProduct(deleteFocusProductButton.dataset.deleteFocusProduct);
      return;
    }

    const switchFocusProductButton = event.target.closest("[data-switch-focus-product]");
    if (switchFocusProductButton) {
      switchFocusProduct(switchFocusProductButton.dataset.switchFocusProduct);
      return;
    }

    const addSourceButton = event.target.closest("[data-add-source]");
    if (addSourceButton) {
      addSource(addSourceButton.dataset.addSource);
      return;
    }

    const addCommunityKeywordButton = event.target.closest("[data-add-community-keyword]");
    if (addCommunityKeywordButton) {
      addCommunityKeyword();
      return;
    }

    const addCommunityPlatformButton = event.target.closest("[data-add-community-platform]");
    if (addCommunityPlatformButton) {
      addCommunityPlatform();
      return;
    }

    const addCompetitorButton = event.target.closest("[data-add-competitor]");
    if (addCompetitorButton) {
      addCompetitor();
      return;
    }

    const deleteCompetitorButton = event.target.closest("[data-delete-competitor]");
    if (deleteCompetitorButton) {
      deleteCompetitor(deleteCompetitorButton.dataset.deleteCompetitor);
      return;
    }

    const resetButton = event.target.closest("[data-reset-sources]");
    if (resetButton) {
      resetSources(resetButton.dataset.resetSources);
      return;
    }

    const resetCommunityKeywordsButton = event.target.closest("[data-reset-community-keywords]");
    if (resetCommunityKeywordsButton) {
      resetCommunityKeywords();
      return;
    }

    const resetCommunityPlatformsButton = event.target.closest("[data-reset-community-platforms]");
    if (resetCommunityPlatformsButton) {
      resetCommunityPlatforms();
      return;
    }

    const saveButton = event.target.closest("[data-save-source]");
    if (saveButton) {
      saveSource(saveButton.dataset.pageId, saveButton.dataset.sourceId);
      return;
    }

    const deleteButton = event.target.closest("[data-delete-source]");
    if (deleteButton) {
      deleteSource(deleteButton.dataset.pageId, deleteButton.dataset.sourceId);
      return;
    }

    const saveCommunityKeywordButton = event.target.closest("[data-save-community-keyword]");
    if (saveCommunityKeywordButton) {
      saveCommunityKeyword(saveCommunityKeywordButton.dataset.keywordId);
      return;
    }

    const deleteCommunityKeywordButton = event.target.closest("[data-delete-community-keyword]");
    if (deleteCommunityKeywordButton) {
      deleteCommunityKeyword(deleteCommunityKeywordButton.dataset.keywordId);
      return;
    }

    const saveCommunityPlatformButton = event.target.closest("[data-save-community-platform]");
    if (saveCommunityPlatformButton) {
      saveCommunityPlatform(saveCommunityPlatformButton.dataset.platformId);
      return;
    }

    const deleteCommunityPlatformButton = event.target.closest("[data-delete-community-platform]");
    if (deleteCommunityPlatformButton) {
      deleteCommunityPlatform(deleteCommunityPlatformButton.dataset.platformId);
      return;
    }

    const addDocumentLinkButton = event.target.closest("[data-add-document-link]");
    if (addDocumentLinkButton) {
      addDocumentLink();
      return;
    }

    const deleteDocumentButton = event.target.closest("[data-delete-document-source]");
    if (deleteDocumentButton) {
      deleteDocumentSource(deleteDocumentButton.dataset.deleteDocumentSource);
      return;
    }

    const marketFilterButton = event.target.closest("[data-market-filter]");
    if (marketFilterButton) {
      state.marketFeedFilter = marketFilterButton.dataset.marketFilter;
      renderPage("market");
      persistShellState();
      return;
    }

    const marketRefreshButton = event.target.closest("[data-market-refresh]");
    if (marketRefreshButton) {
      loadMarketSignals({ force: true, showLoadingState: true });
      return;
    }

    const communityRefreshButton = event.target.closest("[data-community-refresh]");
    if (communityRefreshButton) {
      loadCommunitySignals({ force: true, showLoadingState: true });
      return;
    }

    const contentOutlineButton = event.target.closest("[data-content-outline]");
    if (contentOutlineButton) {
      const ideaId = contentOutlineButton.dataset.contentOutline;
      state.contentIdeaExpandedId = state.contentIdeaExpandedId === ideaId ? "" : ideaId;
      renderPage("content");
      persistShellState();
      return;
    }

    const pmmActionButton = event.target.closest("[data-pmm-action]");
    if (pmmActionButton) {
      const actionId = pmmActionButton.dataset.pmmAction;
      state.pmmActionExpandedId = state.pmmActionExpandedId === actionId ? "" : actionId;
      renderPage("events");
      persistShellState();
      return;
    }
  });

  document.addEventListener("input", (event) => {
    if (!authContext.currentUser) return;

    const sourceInput = event.target.closest("[data-source-url]");
    if (sourceInput) {
      handleSourceDraft(sourceInput.dataset.pageId, sourceInput.dataset.sourceId, sourceInput.value, sourceInput);
      return;
    }

    const accountInput = event.target.closest("[data-account-id-input]");
    if (accountInput) {
      updateAccountLinkOutput();
      return;
    }

    const keywordInput = event.target.closest("[data-community-keyword-input]");
    if (keywordInput) {
      handleCommunityKeywordDraft(keywordInput.dataset.keywordId, keywordInput.value, keywordInput);
      return;
    }

    const platformInput = event.target.closest("[data-community-platform-input]");
    if (platformInput) {
      handleCommunityPlatformDraft(platformInput.dataset.platformId, platformInput.value, platformInput);
      return;
    }

    const searchInput = event.target.closest("[data-page-search]");
    if (searchInput) {
      state.filters[searchInput.dataset.pageId].search = searchInput.value;
      refreshConfiguredPage(searchInput.dataset.pageId);
      persistShellState();
    }
  });

  document.addEventListener("change", (event) => {
    if (!authContext.currentUser) return;

    const competitorSelect = event.target.closest("[data-page-competitor]");
    if (competitorSelect) {
      state.filters[competitorSelect.dataset.pageId].competitor = competitorSelect.value;
      refreshConfiguredPage(competitorSelect.dataset.pageId);
      persistShellState();
      return;
    }

    const accountProductInput = event.target.closest("[data-account-product-input]");
    if (accountProductInput) {
      updateAccountLinkOutput();
      return;
    }

    const documentUploadInput = event.target.closest("[data-document-upload]");
    if (documentUploadInput) {
      handleDocumentUpload(documentUploadInput);
    }
  });

  document.addEventListener("keydown", (event) => {
    const authForm = event.target.closest("[data-auth-form]");
    if (authForm && event.key === "Enter") {
      event.preventDefault();
      handleAuthSubmit();
      return;
    }

    if (!authContext.currentUser) return;
  });
}

function openProductLibrary() {
  setActiveSection("pmm");
  setActivePage("manage");
  requestAnimationFrame(() => {
    const panel = document.querySelector("#productLibraryPanel");
    if (!panel) return;
    panel.scrollIntoView({ behavior: "smooth", block: "start" });
    panel.classList.add("highlight");
    window.setTimeout(() => panel.classList.remove("highlight"), 1400);
  });
}

function getAccountLinkValuesFromPanel() {
  const accountId = sanitizeAccountId(document.querySelector("[data-account-id-input]")?.value || accountContext.accountId);
  const selectedProductIds = [...document.querySelectorAll("[data-account-product-input]:checked")]
    .map((input) => input.value)
    .filter((id) => DEFAULT_PRODUCT_PRESETS.some((product) => product.id === id));

  return {
    accountId,
    productIds: selectedProductIds.length ? selectedProductIds : getAllowedProductIds(),
  };
}

function updateAccountLinkOutput() {
  const output = document.querySelector("[data-account-link-output]");
  if (!output) return;
  output.value = getAccountLink(getAccountLinkValuesFromPanel());
}

function openAccountLinkFromPanel() {
  window.location.href = getAccountLink(getAccountLinkValuesFromPanel());
}

async function copyAccountLinkFromPanel() {
  const link = getAccountLink(getAccountLinkValuesFromPanel());
  const output = document.querySelector("[data-account-link-output]");
  if (output) {
    output.value = link;
    output.select();
  }

  try {
    await navigator.clipboard.writeText(link);
    showAccountLinkStatus("Copied account link");
  } catch (error) {
    showAccountLinkStatus("Link ready to copy");
  }
}

function showAccountLinkStatus(message) {
  const status = document.querySelector("#accountLinkStatus");
  if (!status) return;
  status.textContent = message;
  status.classList.add("visible");
  window.setTimeout(() => status.classList.remove("visible"), 1800);
}

function prepareNewFocusProductForm() {
  state.newProductDraftActive = true;
  setActiveSection("pmm");
  setActivePage("manage");
  renderManagePage();

  requestAnimationFrame(() => {
    const defaults = {
      displayName: "",
      productName: "",
      family: "Data and AI",
      primaryBuyer: "",
      productUrl: "",
      g2Url: "",
      trustRadiusUrl: "",
      blogUrl: "",
      linkedinUrl: "",
      description: "",
    };

    Object.entries(defaults).forEach(([field, value]) => {
      const input = document.querySelector(`[data-focus-product-field="${field}"]`);
      if (input) input.value = value;
    });

    document.querySelector('[data-focus-product-field="displayName"]')?.focus();
    showWorkspaceSaveStatus("Enter product details, then save the new product");
  });
}

function saveFocusProductWorkspace({ asNew = false } = {}) {
  const formValues = getFocusProductFormValues();
  const currentWorkspace = getActiveProductWorkspace();
  const creatingNewProduct = asNew || state.newProductDraftActive || !hasActiveProductWorkspace();
  const displayName = formValues.displayName || (creatingNewProduct ? "" : currentWorkspace.displayName);
  if (creatingNewProduct && !displayName) {
    showWorkspaceSaveStatus("Add a product name first");
    return;
  }

  const workspaceId = creatingNewProduct ? createProductId(displayName) : state.activeProductId;
  const savedAt = new Date().toISOString();
  const nextProductProfile = {
    ...(creatingNewProduct ? {} : currentWorkspace),
    ...formValues,
    id: workspaceId,
    displayName,
    productName: formValues.productName || displayName,
    family: formValues.family || currentWorkspace.family || "Data and AI",
    description: formValues.description || currentWorkspace.description || `Saved product marketing intelligence workspace for ${displayName}.`,
    shortName: displayName.replace(/^IBM\s+/i, ""),
  };
  const nextCompetitors = creatingNewProduct ? [] : getPersistableCompetitors();
  const nextSources = buildAutoSourcesForWorkspace(nextProductProfile, nextCompetitors);
  const nextFilters = creatingNewProduct ? hydrateFilters() : clone(state.filters);
  const nextCommunityKeywords = creatingNewProduct ? [] : getPersistableCommunityKeywords();
  const nextCommunityPlatforms = creatingNewProduct ? [] : getPersistableCommunityPlatforms();
  const nextCommunityMeta = creatingNewProduct ? { lastUpdated: savedAt } : clone(state.communityMeta);
  const nextWorkspace = normalizeProductWorkspace({
    ...nextProductProfile,
    savedAt,
    sources: nextSources,
    filters: nextFilters,
    communityKeywords: productizeForFocusProduct(nextCommunityKeywords, nextProductProfile),
    communityPlatforms: nextCommunityPlatforms,
    communityMeta: nextCommunityMeta,
    marketFeed: creatingNewProduct ? null : getPersistableMarketFeed(),
    liveInsights: creatingNewProduct ? null : getPersistableLiveInsights(),
    communityFeed: creatingNewProduct ? null : getPersistableCommunityFeed(),
    documentSources: creatingNewProduct ? [] : getPersistableDocumentSources(),
    competitors: nextCompetitors,
    marketFeedFilter: creatingNewProduct ? "all" : state.marketFeedFilter,
    contentIdeaExpandedId: creatingNewProduct ? "" : state.contentIdeaExpandedId,
    pmmActionExpandedId: creatingNewProduct ? "" : state.pmmActionExpandedId,
  });

  state.productWorkspaces[workspaceId] = nextWorkspace;
  state.activeProductId = workspaceId;
  updateCurrentUserProductIds(workspaceId);
  state.newProductDraftActive = false;
  state.sources = hydrateSources(nextWorkspace.sources);
  state.filters = hydrateFilters(nextWorkspace.filters);
  state.communityKeywords = hydrateCommunityKeywords(productizeForFocusProduct(nextWorkspace.communityKeywords, nextWorkspace));
  state.communityPlatforms = hydrateCommunityPlatforms(nextWorkspace.communityPlatforms);
  state.communityMeta = nextWorkspace.communityMeta;
  state.marketFeed = hydrateMarketFeedState(nextWorkspace.marketFeed, { loading: false });
  state.liveInsights = hydrateLiveInsightsState(nextWorkspace.liveInsights, { loading: false });
  state.communityFeed = hydrateCommunityFeedState(nextWorkspace.communityFeed, { loading: false });
  state.documentSources = hydrateDocumentSources(nextWorkspace.documentSources);
  state.competitors = hydrateCompetitors(nextWorkspace.competitors);
  state.marketFeedFilter = nextWorkspace.marketFeedFilter || "all";
  state.contentIdeaExpandedId = nextWorkspace.contentIdeaExpandedId || "";
  state.pmmActionExpandedId = nextWorkspace.pmmActionExpandedId || "";

  persistAllState({ touchWorkspace: false });
  renderAllPages();
  renderShell();
  setActivePage("manage");
  updateHeaderMeta();
  if (window.location.protocol !== "file:") {
    loadMarketSignals({ showLoadingState: false });
    loadCommunitySignals({ showLoadingState: false });
  }
  showWorkspaceSaveStatus(creatingNewProduct ? "Saved new product workspace" : "Saved product workspace");
  loadMarketSignals({ force: true, showLoadingState: false });
}

function getFocusProductFormValues() {
  const values = {};
  document.querySelectorAll("[data-focus-product-field]").forEach((input) => {
    values[input.dataset.focusProductField] = input.value.trim();
  });
  return values;
}

function switchFocusProduct(productId) {
  const workspace = state.productWorkspaces[productId];
  if (!workspace || productId === state.activeProductId) return;

  saveActiveWorkspaceSnapshot();
  state.activeProductId = productId;
  state.newProductDraftActive = false;
  applyProductWorkspace(workspace);
  persistShellState();
  renderAllPages();
  renderShell();
  setActivePage("manage");
  updateHeaderMeta();
  if (window.location.protocol !== "file:") {
    loadMarketSignals({ showLoadingState: false });
    loadCommunitySignals({ showLoadingState: false });
  }
}

function deleteFocusProduct(productId) {
  const workspaces = state.productWorkspaces || {};
  const target = workspaces[productId];
  if (!target) return;

  const name = target.displayName || "this product";
  const confirmed = window.confirm(`Remove "${name}" and all its saved sources, competitors, and settings? This cannot be undone.`);
  if (!confirmed) return;

  const wasActive = productId === state.activeProductId;
  // If we're deleting the active product, snapshot nothing (it's going away) and
  // pick another product to switch to afterwards.
  delete workspaces[productId];

  const remainingIds = Object.keys(workspaces);
  if (wasActive) {
    if (remainingIds.length) {
      const nextId = remainingIds[0];
      state.activeProductId = nextId;
      state.newProductDraftActive = false;
      applyProductWorkspace(workspaces[nextId]);
    } else {
      // No products left: drop into the empty/new-product state.
      state.activeProductId = "";
      state.newProductDraftActive = false;
      applyProductWorkspace(getEmptyProductWorkspace());
    }
  }

  persistShellState();
  renderAllPages();
  renderShell();
  setActivePage("manage");
  updateHeaderMeta();
  if (wasActive && window.location.protocol !== "file:") {
    loadMarketSignals({ showLoadingState: false });
    loadCommunitySignals({ showLoadingState: false });
  }
}

function applyProductWorkspace(workspace) {
  state.sources = hydrateSources(rebaseSourcesForProduct(workspace.sources, workspace, workspace));
  state.filters = hydrateFilters(workspace.filters);
  state.communityKeywords = hydrateCommunityKeywords(productizeForFocusProduct(workspace.communityKeywords || buildDefaultCommunityKeywordsForProduct(workspace), workspace));
  state.communityPlatforms = hydrateCommunityPlatforms(workspace.communityPlatforms);
  state.communityMeta = workspace.communityMeta || { lastUpdated: new Date().toISOString() };
  state.marketFeedFilter = workspace.marketFeedFilter || "all";
  state.marketFeed = hydrateMarketFeedState(workspace.marketFeed, { loading: false });
  state.liveInsights = hydrateLiveInsightsState(workspace.liveInsights, { loading: false });
  state.communityFeed = hydrateCommunityFeedState(workspace.communityFeed, { loading: false });
  state.documentSources = hydrateDocumentSources(workspace.documentSources);
  state.competitors = hydrateCompetitors(workspace.competitors);
  state.contentIdeaExpandedId = workspace.contentIdeaExpandedId || "";
  state.pmmActionExpandedId = workspace.pmmActionExpandedId || "";
  state.drafts = {};
}

function showWorkspaceSaveStatus(message) {
  const status = document.querySelector("#workspaceSaveStatus");
  if (!status) return;
  status.textContent = message;
  status.classList.add("visible");
  window.setTimeout(() => status.classList.remove("visible"), 1800);
}

async function handleDocumentUpload(input) {
  const files = [...(input.files || [])];
  if (!files.length) return;

  const uploadedAt = new Date().toISOString();
  const additions = await Promise.all(files.map(async (file) => {
    const canStoreFile = file.size <= MAX_DOCUMENT_SOURCE_SIZE_BYTES;
    const dataUrl = canStoreFile ? await readFileAsDataUrl(file) : "";
    // Extract compact readable text now; this is small enough to persist and is
    // what the analysis engine actually reads (works for PDFs too).
    const extractedText = dataUrl
      ? extractTextForStorage({ name: file.name, type: file.type, dataUrl })
      : "";
    return {
      id: `document-source-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      name: file.name,
      type: file.type || "Document",
      size: file.size,
      uploadedAt,
      linkedTo: getFocusProductDisplayName(),
      dataUrl,
      extractedText,
      storageMode: extractedText
        ? "Analyzed - text saved"
        : (canStoreFile ? "Saved locally" : "Metadata only"),
    };
  }));

  state.documentSources = [...additions, ...(state.documentSources || [])];
  input.value = "";
  persistAllState();
  renderManagePage();
  updateHeaderMeta();
  showWorkspaceSaveStatus(`${additions.length} document ${additions.length === 1 ? "source" : "sources"} uploaded`);
  loadMarketSignals({ force: true, showLoadingState: false });
}

function addDocumentLink() {
  const input = document.querySelector("[data-new-document-link]");
  const url = input?.value?.trim();
  
  if (!url) {
    showWorkspaceSaveStatus("Enter a link URL first");
    return;
  }

  try {
    new URL(url);
  } catch (error) {
    showWorkspaceSaveStatus("Enter a valid URL");
    return;
  }

  const fileName = url.split('/').pop() || 'External Link';
  const uploadedAt = new Date().toISOString();
  
  const newDocument = {
    id: `document-link-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    name: fileName,
    type: "External Link",
    size: 0,
    uploadedAt,
    linkedTo: getFocusProductDisplayName(),
    dataUrl: url,
    storageMode: "External link",
    isExternalLink: true,
  };

  state.documentSources = [newDocument, ...(state.documentSources || [])];
  input.value = "";
  persistAllState();
  renderManagePage();
  updateHeaderMeta();
  showWorkspaceSaveStatus("External link added");
  loadMarketSignals({ force: true, showLoadingState: false });
}

function deleteDocumentSource(documentId) {
  state.documentSources = (state.documentSources || []).filter((document) => document.id !== documentId);
  persistAllState();
  renderManagePage();
  updateHeaderMeta();
  showWorkspaceSaveStatus("Document source deleted");
  loadMarketSignals({ force: true, showLoadingState: false });
}

function addCompetitor() {
  if (!hasActiveProductWorkspace() || state.newProductDraftActive) {
    showWorkspaceSaveStatus("Save a focus product before adding competitors");
    return;
  }

  const input = document.querySelector("[data-new-competitor-url]");
  const url = normalizeUrlInput(input?.value || "");
  const name = inferCompetitorNameFromUrl(url);
  if (!url) {
    showWorkspaceSaveStatus("Enter a competitor webpage link");
    input?.focus();
    return;
  }

  const existing = getActiveCompetitors();
  if (existing.some((competitor) => competitor.url.toLowerCase() === url.toLowerCase() || competitor.name.toLowerCase() === name.toLowerCase())) {
    showWorkspaceSaveStatus("Competitor already added");
    input.value = "";
    input.focus();
    return;
  }

  state.competitors = [
    ...existing,
    {
      id: createCompetitorId(name),
      name,
      url,
      color: getCompetitorColor(existing.length),
    },
  ];
  rebuildAutomaticSources();
  input.value = "";
  persistAllState();
  renderManagePage();
  renderSidebarContext();
  showWorkspaceSaveStatus("Competitor added");
  loadMarketSignals({ force: true, showLoadingState: false });
}

function deleteCompetitor(competitorId) {
  const before = getActiveCompetitors();
  state.competitors = before.filter((competitor) => competitor.id !== competitorId);
  rebuildAutomaticSources();
  persistAllState();
  renderManagePage();
  renderSidebarContext();
  showWorkspaceSaveStatus("Competitor removed");
  loadMarketSignals({ force: true, showLoadingState: false });
}

function rebuildAutomaticSources() {
  if (!hasActiveProductWorkspace()) return;
  state.sources = hydrateSources(buildAutoSourcesForWorkspace(getActiveProductWorkspace(), state.competitors));
  state.filters = hydrateFilters(state.filters);
}

function normalizeUrlInput(value) {
  const trimmed = String(value || "").trim();
  if (!trimmed) return "";
  if (/^https?:\/\//i.test(trimmed)) return trimmed;
  return `https://${trimmed}`;
}

function inferCompetitorNameFromUrl(url) {
  try {
    const parsed = new URL(url);
    const hostname = parsed.hostname.replace(/^www\./i, "").toLowerCase();
    const path = parsed.pathname.toLowerCase();
    const full = `${hostname}${path}`;
    // Recognise specific products so the label reads e.g. "Amazon Redshift"
    // rather than just the parent brand "Amazon".
    const PRODUCT_RULES = [
      [/bigquery/, "Google BigQuery"],
      [/redshift/, "Amazon Redshift"],
      [/synapse/, "Azure Synapse"],
      [/databricks/, "Databricks"],
      [/snowflake/, "Snowflake"],
      [/yellowbrick/, "Yellowbrick"],
      [/teradata/, "Teradata"],
    ];
    for (const [pattern, label] of PRODUCT_RULES) {
      if (pattern.test(full)) return label;
    }
    const parts = hostname.split(".").filter(Boolean);
    const core = parts.length > 1 ? parts[parts.length - 2] : parts[0];
    return toTitleCase(core.replace(/[-_]+/g, " ")) || "Competitor";
  } catch {
    return "Competitor";
  }
}

function toTitleCase(value) {
  return String(value || "")
    .split(/\s+/)
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
}

function readFileAsDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result || ""));
    reader.onerror = () => reject(reader.error || new Error("Document upload failed"));
    reader.readAsDataURL(file);
  });
}

function handleSourceDraft(pageId, sourceId, value, input) {
  state.drafts[pageId] = state.drafts[pageId] || {};
  state.drafts[pageId][sourceId] = value;
  const row = input.closest(".source-row");
  const openLink = row?.querySelector(".open-link");
  const trimmed = value.trim();
  row?.classList.add("dirty");
  if (openLink) {
    openLink.href = trimmed || "#";
    openLink.classList.toggle("disabled", !trimmed);
  }
}

function handleCommunityKeywordDraft(keywordId, value, input) {
  const keyword = state.communityKeywords.find((item) => item.id === keywordId);
  if (!keyword) return;
  keyword.value = value;
  keyword.dirty = true;
  input.closest(".source-row")?.classList.add("dirty");
}

function handleCommunityPlatformDraft(platformId, value, input) {
  const platform = state.communityPlatforms.find((item) => item.id === platformId);
  if (!platform) return;
  platform.value = value;
  platform.dirty = true;
  input.closest(".source-row")?.classList.add("dirty");
}

function saveSource(pageId, sourceId) {
  const source = getSources(pageId).find((item) => item.id === sourceId);
  if (!source) return;

  const draftValue = state.drafts[pageId]?.[sourceId];
  if (draftValue !== undefined) {
    source.url = draftValue.trim();
    delete state.drafts[pageId][sourceId];
    if (!Object.keys(state.drafts[pageId]).length) {
      delete state.drafts[pageId];
    }
  }

  persistAllState();
  refreshConfiguredPage(pageId);
  renderOverview();
  updateHeaderMeta();
}

function deleteSource(pageId, sourceId) {
  state.sources[pageId] = getSources(pageId).filter((source) => source.id !== sourceId);
  if (state.drafts[pageId]) {
    delete state.drafts[pageId][sourceId];
    if (!Object.keys(state.drafts[pageId]).length) delete state.drafts[pageId];
  }
  persistAllState();
  refreshConfiguredPage(pageId);
  renderOverview();
  updateHeaderMeta();
}

function addSource(pageId) {
  const page = PAGE_CONFIG_BY_ID[pageId];
  if (!page) return;

  const nextIndex = getSources(pageId).length + 1;
  const kind = pageId === "events" ? "SIGNAL" : pageId === "market" ? "SOCIAL" : pageId === "product" ? "CAPABILITY" : pageId === "positioning" ? "OWN" : "WEB";
  const competitor = pageId === "positioning" ? getFocusProductDisplayName() : "Custom competitor";
  state.sources[pageId] = [...getSources(pageId), normalizeSource({ id: `${pageId}-custom-${Date.now()}`, kind, label: `Custom ${page.title} source ${nextIndex}`, competitor, url: "" })];
  persistAllState();
  refreshConfiguredPage(pageId);
  renderOverview();
  updateHeaderMeta();
}

function resetSources(pageId) {
  const page = PAGE_CONFIG_BY_ID[pageId];
  if (!page) return;
  state.sources[pageId] = buildDefaultSourcesForProduct(getActiveProductWorkspace())[pageId];
  delete state.drafts[pageId];
  persistAllState();
  refreshConfiguredPage(pageId);
  renderOverview();
  updateHeaderMeta();
}

function addCommunityKeyword() {
  state.communityKeywords = [
    ...state.communityKeywords,
    { id: `community-keyword-${Date.now()}`, value: "", dirty: true },
  ];
  persistAllState();
  renderPage("community-manage");
  loadCommunitySignals({ force: true, showLoadingState: false });
  updateHeaderMeta();
}

function saveCommunityKeyword(keywordId) {
  const keyword = state.communityKeywords.find((item) => item.id === keywordId);
  if (!keyword) return;
  keyword.value = keyword.value.trim();
  keyword.dirty = false;
  persistAllState();
  renderPage("community-manage");
  loadCommunitySignals({ force: true, showLoadingState: false });
  updateHeaderMeta();
}

function deleteCommunityKeyword(keywordId) {
  state.communityKeywords = state.communityKeywords.filter((item) => item.id !== keywordId);
  persistAllState();
  renderPage("community-manage");
  loadCommunitySignals({ force: true, showLoadingState: false });
  updateHeaderMeta();
}

function resetCommunityKeywords() {
  state.communityKeywords = [];
  persistAllState();
  renderPage("community-manage");
  loadCommunitySignals({ force: true, showLoadingState: false });
  updateHeaderMeta();
}

function addCommunityPlatform() {
  state.communityPlatforms = [
    ...state.communityPlatforms,
    { id: `community-platform-${Date.now()}`, value: "", dirty: true },
  ];
  persistAllState();
  renderPage("community-manage");
  loadCommunitySignals({ force: true, showLoadingState: false });
  updateHeaderMeta();
}

function saveCommunityPlatform(platformId) {
  const platform = state.communityPlatforms.find((item) => item.id === platformId);
  if (!platform) return;
  platform.value = normalizeUrlInput(platform.value);
  platform.dirty = false;
  persistAllState();
  renderPage("community-manage");
  loadCommunitySignals({ force: true, showLoadingState: false });
  updateHeaderMeta();
}

function deleteCommunityPlatform(platformId) {
  state.communityPlatforms = state.communityPlatforms.filter((item) => item.id !== platformId);
  persistAllState();
  renderPage("community-manage");
  loadCommunitySignals({ force: true, showLoadingState: false });
  updateHeaderMeta();
}

function resetCommunityPlatforms() {
  state.communityPlatforms = [];
  persistAllState();
  renderPage("community-manage");
  loadCommunitySignals({ force: true, showLoadingState: false });
  updateHeaderMeta();
}

function refreshCommunitySignalPages({ updateTimestamp = false } = {}) {
  if (updateTimestamp) {
    state.communityMeta.lastUpdated = new Date().toISOString();
    persistShellState();
  }
  renderPage("community-announcements");
  renderPage("community-thought-leadership");
  renderPage("community-replies");
}

function refreshConfiguredPage(pageId) {
  renderPage(pageId);
  renderManagePage();
}

function stripHeavyContentFromWorkspaces(productWorkspaces) {
  const slimmed = {};
  Object.entries(productWorkspaces || {}).forEach(([productId, workspace]) => {
    slimmed[productId] = {
      ...workspace,
      documentSources: (workspace.documentSources || []).map((doc) => (
        doc.isExternalLink || !(doc.dataUrl || "").length
          ? doc
          : { ...doc, dataUrl: "", storageMode: doc.extractedText ? "Analyzed - text saved" : "Metadata only - content too large to keep after a reload" }
      )),
      marketFeed: workspace.marketFeed
        ? { ...workspace.marketFeed, items: (workspace.marketFeed.items || []).slice(0, 25) }
        : workspace.marketFeed,
      communityFeed: workspace.communityFeed
        ? { ...workspace.communityFeed, items: (workspace.communityFeed.items || []).slice(0, 25) }
        : workspace.communityFeed,
    };
  });
  return slimmed;
}

function buildShellPayload({ slim = false } = {}) {
  const productWorkspaces = slim
    ? stripHeavyContentFromWorkspaces(state.productWorkspaces)
    : state.productWorkspaces;
  return {
    activeProductId: state.activeProductId,
    productWorkspaces,
    activeSection: state.activeSection,
    activePage: state.activePage,
    activePageBySection: state.activePageBySection,
    contentIdeaExpandedId: state.contentIdeaExpandedId,
    pmmActionExpandedId: state.pmmActionExpandedId,
    marketFeedFilter: state.marketFeedFilter,
    filters: state.filters,
    sources: getPersistableSources(),
    communityKeywords: getPersistableCommunityKeywords(),
    communityPlatforms: getPersistableCommunityPlatforms(),
    communityMeta: state.communityMeta,
    communityFeed: getPersistableCommunityFeed(),
    documentSources: getPersistableDocumentSources({ slim }),
    competitors: getPersistableCompetitors(),
  };
}

function persistShellState({ touchWorkspace = false } = {}) {
  saveActiveWorkspaceSnapshot({ touchWorkspace });
  if (setStorage(JSON.stringify(buildShellPayload()))) return;

  // Browser storage quota hit: retry with document content and feed caches slimmed
  // so profile, session, competitors, keywords, and settings are never lost.
  console.warn("[storage] Quota exceeded - retrying with slimmed snapshot");
  const slimSaved = setStorage(JSON.stringify(buildShellPayload({ slim: true })));
  if (typeof showWorkspaceSaveStatus === "function") {
    showWorkspaceSaveStatus(slimSaved
      ? "Browser storage is full - large document content will not survive a reload"
      : "Browser storage is full - recent changes could not be saved locally");
  }
}

function persistAllState(options = {}) {
  persistShellState({ touchWorkspace: true, ...options });
}

function saveActiveWorkspaceSnapshot({ touchWorkspace = false } = {}) {
  if (!hasActiveProductWorkspace()) return;

  const workspace = getActiveProductWorkspace();
  if (!workspace) return;

  const savedAt = touchWorkspace ? new Date().toISOString() : workspace.savedAt;
  state.productWorkspaces[state.activeProductId] = normalizeProductWorkspace({
    ...workspace,
    savedAt,
    sources: getPersistableSources(),
    filters: clone(state.filters),
    communityKeywords: getPersistableCommunityKeywords(),
    communityPlatforms: getPersistableCommunityPlatforms(),
    communityMeta: clone(state.communityMeta),
    marketFeed: getPersistableMarketFeed(),
    liveInsights: getPersistableLiveInsights(),
    communityFeed: getPersistableCommunityFeed(),
    documentSources: getPersistableDocumentSources(),
    competitors: getPersistableCompetitors(),
    marketFeedFilter: state.marketFeedFilter,
    contentIdeaExpandedId: state.contentIdeaExpandedId,
    pmmActionExpandedId: state.pmmActionExpandedId,
  });
}

function getPersistableMarketFeed() {
  return {
    loading: false,
    error: state.marketFeed.error || "",
    meta: clone(state.marketFeed.meta || {}),
    items: clone(state.marketFeed.items || []),
  };
}

function getPersistableLiveInsights() {
  return {
    loading: false,
    error: state.liveInsights.error || "",
    meta: clone(state.liveInsights.meta || {}),
    sections: clone(state.liveInsights.sections || null),
  };
}

function getPersistableCommunityFeed() {
  return {
    loading: false,
    error: state.communityFeed.error || "",
    meta: clone(state.communityFeed.meta || {}),
    items: clone(state.communityFeed.items || []),
  };
}

function getPersistableDocumentSources({ slim = false } = {}) {
  const documents = clone(state.documentSources || []);
  let budget = slim ? 0 : DOCUMENT_PERSIST_BUDGET_CHARS;
  return documents.map((doc) => {
    if (doc.isExternalLink) return doc;
    const contentSize = (doc.dataUrl || "").length;
    if (!contentSize) return doc;
    if (contentSize <= budget) {
      budget -= contentSize;
      return doc;
    }
    // Drop the heavy base64 data URL but ALWAYS keep the small extracted text,
    // so the analysis engine still has document content after a reload.
    return {
      ...doc,
      dataUrl: "",
      storageMode: doc.extractedText
        ? "Analyzed - text saved"
        : "Metadata only - content too large to keep after a reload",
    };
  });
}

function getPersistableCompetitors() {
  return hydrateCompetitors(state.competitors || []);
}

function getPersistableSources() {
  const persisted = {};
  Object.keys(state.sources).forEach((pageId) => {
    persisted[pageId] = getSources(pageId).map((source) => ({ id: source.id, kind: source.kind, label: source.label, competitor: source.competitor, url: source.url }));
  });
  return persisted;
}

function getAutomaticSourceCount() {
  return Object.values(state.sources || {}).reduce((sum, rows) => sum + (Array.isArray(rows) ? rows.length : 0), 0);
}

function getPersistableCommunityKeywords() {
  return state.communityKeywords.map((keyword) => keyword.value).filter(Boolean);
}

function getPersistableCommunityPlatforms() {
  return state.communityPlatforms.map((platform) => platform.value).filter(Boolean);
}

function getToneLabel(tone) {
  return { content: "IBM Blue", events: "Green", market: "Amber", product: "Purple", positioning: "Teal" }[tone] || tone;
}

function shortCompetitorLabel(name) {
  if (name === getFocusProductDisplayName()) {
    return getFocusProductShortName();
  }

  return {
    Netezza: "Netezza",
    "IBM Netezza": "IBM Netezza",
    Databricks: "Databricks",
    Snowflake: "Snowflake",
    "Amazon Redshift": "Redshift",
    "Google BigQuery": "BigQuery",
    "Azure Synapse": "Synapse",
    Teradata: "Teradata",
  }[name] || name;
}

function buildOverviewRadarSeries(axes, positioningDimensions = getProductPositioningDimensions()) {
  const competitorMap = [
    { name: getFocusProductDisplayName(), color: "#0f62fe", key: "netezza", isFocusProduct: true },
    { name: "Databricks", color: "#e74c3c", key: "Databricks" },
    { name: "Snowflake", color: "#3498db", key: "Snowflake" },
    { name: "Amazon Redshift", color: "#f39c12", key: "Amazon Redshift" },
    { name: "Google BigQuery", color: "#27ae60", key: "Google BigQuery" },
    { name: "Azure Synapse", color: "#9b59b6", key: "Azure Synapse" },
    { name: "Teradata", color: "#e67e22", key: "Teradata" },
  ];

  return competitorMap.map((item) => ({
    name: item.name,
    color: item.color,
    isFocusProduct: Boolean(item.isFocusProduct),
    values: axes.map((axis) => {
      const dimension = positioningDimensions.find((entry) => entry.label === axis.key);
      if (!dimension) return 0;
      return item.key === "netezza" ? dimension.netezza : dimension.competitors[item.key];
    }),
  }));
}

function getRadarSeriesPoints(values, axes, center, radius) {
  return values.map((value, index) => {
    const point = getRadarPoint(index, axes.length, center, radius * (value / 10));
    return `${point.x},${point.y}`;
  }).join(" ");
}

function getRadarPolygonPoints(axes, center, radius) {
  return axes.map((_, index) => {
    const point = getRadarPoint(index, axes.length, center, radius);
    return `${point.x},${point.y}`;
  }).join(" ");
}

function getRadarPoint(index, total, center, radius) {
  const angle = (-Math.PI / 2) + ((Math.PI * 2) * index / total);
  return {
    x: center + Math.cos(angle) * radius,
    y: center + Math.sin(angle) * radius,
  };
}

function getRadarTextAnchor(x, center) {
  if (Math.abs(x - center) < 8) return "middle";
  return x < center ? "start" : "end";
}

function withAlpha(hex, alpha) {
  const normalized = hex.replace("#", "");
  const chunk = normalized.length === 3
    ? normalized.split("").map((value) => value + value).join("")
    : normalized;
  const red = Number.parseInt(chunk.slice(0, 2), 16);
  const green = Number.parseInt(chunk.slice(2, 4), 16);
  const blue = Number.parseInt(chunk.slice(4, 6), 16);
  return `rgba(${red}, ${green}, ${blue}, ${alpha})`;
}

function startMarketAutoRefresh() {
  if (marketRefreshTimer) {
    window.clearInterval(marketRefreshTimer);
  }

  marketRefreshTimer = window.setInterval(() => {
    loadMarketSignals({ force: true, showLoadingState: false });
  }, MARKET_REFRESH_INTERVAL_MS);
}

async function loadMarketSignals({ force = false, showLoadingState = true } = {}) {
  if (!hasActiveProductWorkspace()) {
    state.marketFeed.loading = false;
    state.marketFeed.error = "";
    state.liveInsights.loading = false;
    renderPage("market");
    renderOverview();
    updateHeaderMeta();
    return;
  }

  const requestId = ++marketRequestSequence;

  if (showLoadingState) {
    state.marketFeed.loading = true;
    state.marketFeed.error = "";
    state.liveInsights.loading = true;
    state.liveInsights.error = "";
    renderPage("market");
  }

  try {
    const { payload, mode } = await fetchWorkspaceIntelligencePayload({ force });
    if (requestId !== marketRequestSequence) {
      return;
    }

    const feed = payload.marketFeed || {};
    state.marketFeed = {
      loading: false,
      error: "",
      meta: {
        ...(feed.meta || payload.meta || state.marketFeed.meta),
        refreshCompletedAt: new Date().toISOString(),
      },
      items: Array.isArray(feed.items) && feed.items.length
        ? feed.items.filter(isConfiguredCompetitorSignal)
        : getProductMarketSignalItems(),
    };
    state.liveInsights = {
      loading: false,
      error: "",
      meta: {
        ...(payload.meta || state.liveInsights.meta),
        deliveryMode: mode,
      },
      sections: payload.sections || state.liveInsights.sections,
      capabilityEvidence: payload.capabilityEvidence || state.liveInsights.capabilityEvidence || null,
    };
  } catch (error) {
    if (requestId !== marketRequestSequence) {
      return;
    }

    state.marketFeed = {
      ...state.marketFeed,
      loading: false,
      error: "Live source refresh failed, so this page is showing seeded fallback competitor signals instead of fresh external-source results.",
      items: getProductMarketSignalItems(),
    };
    state.liveInsights = {
      ...state.liveInsights,
      loading: false,
      error: "Live insight generation is temporarily unavailable, so the workspace is using seeded strategic recommendations.",
    };
  }

  persistAllState();
  renderPage("market");
  renderOverview();
  updateHeaderMeta();
}

const ANALYZABLE_TEXT_TYPES = ["text/", "application/json", "application/xml"];
const ANALYZABLE_TEXT_EXTENSIONS = [".txt", ".md", ".csv", ".json", ".html", ".htm", ".xml"];
// Cap stored extracted text so several documents fit comfortably in localStorage.
const EXTRACTED_TEXT_CAP_CHARS = 40000;

function decodeDocumentText(dataUrl) {
  try {
    const base64 = String(dataUrl || "").split(",")[1] || "";
    if (!base64) return "";
    const binary = atob(base64);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
    return new TextDecoder("utf-8", { fatal: false }).decode(bytes);
  } catch {
    return "";
  }
}

// Lightweight in-browser PDF text extraction. Pulls readable strings from PDF
// content streams (text shown between parentheses in BT/ET text blocks and in
// TJ/Tj operators). Not a full PDF engine, but recovers enough prose for the
// capability/keyword scan without any external library or build step.
function extractPdfText(dataUrl) {
  try {
    const base64 = String(dataUrl || "").split(",")[1] || "";
    if (!base64) return "";
    const binary = atob(base64);
    // Latin1 view preserves byte values for the regex passes below.
    let raw = "";
    const chunk = 65536;
    for (let i = 0; i < binary.length; i += chunk) {
      raw += binary.slice(i, i + chunk);
    }
    const pieces = [];
    // Match text inside ( ) including escaped parens, the usual PDF string form.
    const stringRegex = /\(((?:\\.|[^\\()])*)\)/g;
    let m;
    while ((m = stringRegex.exec(raw)) !== null) {
      let s = m[1]
        .replace(/\\\(/g, "(").replace(/\\\)/g, ")").replace(/\\\\/g, "\\")
        .replace(/\\n/g, " ").replace(/\\r/g, " ").replace(/\\t/g, " ");
      if (s.trim()) pieces.push(s);
      if (pieces.join(" ").length > EXTRACTED_TEXT_CAP_CHARS * 2) break;
    }
    let text = pieces.join(" ")
      .replace(/[^\x20-\x7E\u00A0-\uFFFF]+/g, " ")
      .replace(/\s+/g, " ")
      .trim();
    return text;
  } catch {
    return "";
  }
}

// Decide the best extraction for a file and return capped readable text.
function extractTextForStorage({ name, type, dataUrl }) {
  if (!dataUrl) return "";
  const lowerName = String(name || "").toLowerCase();
  const isPdf = String(type || "").includes("pdf") || lowerName.endsWith(".pdf");
  let text = isPdf ? extractPdfText(dataUrl) : decodeDocumentText(dataUrl);
  text = (text || "").slice(0, EXTRACTED_TEXT_CAP_CHARS);
  // Quality gate: require enough real words so a few stray glyphs from a
  // compressed/scanned PDF aren't mistaken for usable text. If extraction is
  // too thin, return empty so the UI honestly shows it could not be analyzed.
  const wordCount = (text.match(/[A-Za-z]{3,}/g) || []).length;
  if (wordCount < 20) return "";
  return text;
}

function buildAnalyzableDocuments() {
  const documents = state.documentSources || [];
  const analyzable = [];
  let totalChars = 0;
  for (const doc of documents) {
    if (analyzable.length >= 8 || totalChars > 300000) break;
    if (doc.isExternalLink && doc.dataUrl) {
      analyzable.push({ name: doc.name, url: doc.dataUrl });
      continue;
    }
    // Prefer pre-extracted text (survives reload); fall back to decoding the
    // data URL if it's still in memory this session.
    let text = String(doc.extractedText || "");
    if (!text && doc.dataUrl) {
      text = extractTextForStorage({ name: doc.name, type: doc.type, dataUrl: doc.dataUrl });
    }
    text = text.slice(0, 60000);
    if (!text.trim()) continue;
    totalChars += text.length;
    analyzable.push({ name: doc.name, text });
  }
  return analyzable;
}

async function fetchWorkspaceIntelligencePayload({ force = false } = {}) {
  const product = getActiveProductWorkspace();
  const params = new URLSearchParams();
  if (force) {
    params.set("refresh", String(Date.now()));
  }
  params.set("productId", product.id || state.activeProductId || "");
  params.set("productName", product.displayName || product.productName || "");
  params.set("fullProductName", product.productName || product.displayName || "");
  params.set("shortName", product.shortName || product.displayName || "");
  params.set("description", product.description || "");
  params.set("primaryBuyer", product.primaryBuyer || "");
  params.set("productUrl", product.productUrl || "");
  
  // Add competitors parameter
  const configuredCompetitors = getConfiguredCompetitors();
  // Send name + configured URL so the server can build crawl sources for ANY competitor
  const competitors = configuredCompetitors.map(c => ({ name: c.name, url: c.url || "" }));
  if (competitors && competitors.length > 0) {
    params.set("competitors", JSON.stringify(competitors));
    console.log(`[dashboard] Sending competitors to API: ${competitors.map(c => c.name).join(', ')}`);
  }
  
  // Documents from Manage Step 3 are sent for analysis alongside product + competitors
  const requestBody = Object.fromEntries(params.entries());
  requestBody.competitors = configuredCompetitors.map(c => ({ name: c.name, url: c.url || "" }));
  requestBody.documents = buildAnalyzableDocuments();
  try {
    const postResponse = await fetch(`/api/workspace-intelligence`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      cache: "no-store",
      body: JSON.stringify(requestBody),
    });
    if (postResponse.ok) {
      return {
        payload: await postResponse.json(),
        mode: "api",
      };
    }
  } catch (error) {
    console.warn("[dashboard] POST workspace-intelligence failed, falling back to GET", error);
  }

  const query = `?${params.toString()}`;
  const candidateEndpoints = [`/api/workspace-intelligence${query}`, `/.netlify/functions/workspace-intelligence${query}`];

  let lastError;

  for (const endpoint of candidateEndpoints) {
    try {
      const response = await fetch(endpoint, { cache: "no-store" });
      if (!response.ok) {
        throw new Error(`Request failed with ${response.status} for ${endpoint}`);
      }
      return {
        payload: await response.json(),
        mode: "api",
      };
    } catch (error) {
      lastError = error;
    }
  }

  const snapshotEndpoint = force ? `${STATIC_WORKSPACE_INTELLIGENCE_ENDPOINT}?refresh=${Date.now()}` : STATIC_WORKSPACE_INTELLIGENCE_ENDPOINT;
  const snapshotResponse = await fetch(snapshotEndpoint, { cache: "no-store" });
  if (!snapshotResponse.ok) {
    throw new Error(`Snapshot request failed with ${snapshotResponse.status}`);
  }
  const payload = await snapshotResponse.json();
  return {
    payload,
    mode: "static-snapshot",
    apiError: lastError,
  };
}

async function loadCommunitySignals({ force = false, showLoadingState = true } = {}) {
  if (window.location.protocol === "file:") {
    return;
  }

  if (!hasActiveProductWorkspace()) {
    state.communityFeed.loading = false;
    state.communityFeed.error = "";
    renderPage("community-announcements");
    renderPage("community-thought-leadership");
    renderPage("community-replies");
    renderPage("community-manage");
    updateHeaderMeta();
    return;
  }

  const requestId = ++communityRequestSequence;

  if (showLoadingState) {
    state.communityFeed.loading = true;
    state.communityFeed.error = "";
    renderPage("community-announcements");
    renderPage("community-thought-leadership");
    renderPage("community-replies");
    renderPage("community-manage");
  }

  try {
    const payload = await fetchCommunitySignalsPayload({ force });
    if (requestId !== communityRequestSequence) {
      return;
    }

    state.communityFeed = {
      loading: false,
      error: "",
      meta: payload.meta || state.communityFeed.meta,
      items: Array.isArray(payload.items) ? payload.items : [],
    };
    state.communityMeta.lastUpdated = payload.meta?.lastUpdated || new Date().toISOString();
  } catch (error) {
    if (requestId !== communityRequestSequence) {
      return;
    }

    state.communityFeed = {
      ...state.communityFeed,
      loading: false,
      error: "Community crawler refresh failed, so this page is showing saved community guidance.",
      items: Array.isArray(state.communityFeed.items) ? state.communityFeed.items : [],
    };
    state.communityMeta.lastUpdated = new Date().toISOString();
  }

  persistAllState();
  renderPage("community-announcements");
  renderPage("community-thought-leadership");
  renderPage("community-replies");
  renderPage("community-manage");
  updateHeaderMeta();
}

async function fetchCommunitySignalsPayload({ force = false } = {}) {
  const params = new URLSearchParams();
  params.set("product", getFocusProductDisplayName());
  params.set("keywords", getPersistableCommunityKeywords().join(","));
  params.set("platforms", getPersistableCommunityPlatforms().join(","));
  if (force) {
    params.set("refresh", String(Date.now()));
  }
  const query = `?${params.toString()}`;
  const candidateEndpoints = [`/api/community-signals${query}`, `/.netlify/functions/community-signals${query}`];

  let lastError;
  for (const endpoint of candidateEndpoints) {
    try {
      const response = await fetch(endpoint, { cache: "no-store" });
      if (!response.ok) {
        throw new Error(`Request failed with ${response.status} for ${endpoint}`);
      }
      return await response.json();
    } catch (error) {
      lastError = error;
    }
  }

  throw lastError || new Error("Community signal endpoint unavailable");
}

function getMarketFeedStatus() {
  const meta = state.marketFeed.meta || {};
  const configured = getConfiguredCompetitors();
  const relevantItems = getRelevantMarketSignalItems();
  const liveCount = relevantItems.filter((item) => getMarketSignalCoverage(item).type === "live").length;
  const staticCount = relevantItems.length - liveCount;
  const label = state.marketFeed.loading
    ? "Refreshing live signal feed"
    : !configured.length
      ? "No competitors configured"
      : liveCount
        ? "Hybrid live + configured monitoring"
    : state.liveInsights.meta?.deliveryMode === "static-snapshot"
      ? "Fallback snapshot in use"
      : "Configured monitoring surfaces";
  const detail = state.marketFeed.error
    ? "The dashboard is currently using source-backed saved competitor intelligence because the latest crawler refresh did not complete successfully."
    : !configured.length
      ? "Add competitor webpage links in Manage. SignalOps will infer official website, social, review, and blog/update monitoring surfaces from those links."
      : liveCount
        ? `${liveCount} live configured competitor signals and ${staticCount} inferred static monitoring surfaces are available.`
    : state.liveInsights.meta?.deliveryMode === "static-snapshot"
      ? "This shared version is running from a published stakeholder snapshot, so it shows the latest generated dataset rather than calling the local live API."
      : `${configured.length} configured ${configured.length === 1 ? "competitor" : "competitors"} generating ${staticCount} social, review, blog, and website monitoring surfaces.`;
  const updated = state.liveInsights.meta?.generatedAt
    ? `Last refresh: ${formatDateTimePrecise(new Date(meta.refreshCompletedAt || state.liveInsights.meta.generatedAt))}`
    : meta.lastUpdated
      ? `Last refresh: ${formatDateTimePrecise(new Date(meta.refreshCompletedAt || meta.lastUpdated))}`
      : "Waiting for first live refresh";

  return {
    label,
    detail,
    updated,
    error: state.marketFeed.error || state.liveInsights.error,
  };
}

function formatDate(date) {
  return new Intl.DateTimeFormat(undefined, { dateStyle: "medium" }).format(date);
}

function formatDateTime(date) {
  return new Intl.DateTimeFormat(undefined, { dateStyle: "medium", timeStyle: "short" }).format(date);
}

function formatDateTimePrecise(date) {
  return new Intl.DateTimeFormat(undefined, { dateStyle: "medium", timeStyle: "medium" }).format(date);
}

function formatFileSize(bytes) {
  const value = Number(bytes || 0);
  if (value < 1024) return `${value} B`;
  if (value < 1024 * 1024) return `${(value / 1024).toFixed(1)} KB`;
  return `${(value / 1024 / 1024).toFixed(1)} MB`;
}

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

function safeParse(value) {
  if (!value) return null;
  try {
    return JSON.parse(value);
  } catch (error) {
    console.error("Failed to parse saved workspace state", error);
    return null;
  }
}

function isLocalHost() {
  return window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1";
}

function getLocalStorageValue(key) {
  try {
    return window.localStorage.getItem(key);
  } catch (error) {
    console.error("Failed to read local storage", error);
    return null;
  }
}

function setLocalStorageValue(key, value) {
  try {
    window.localStorage.setItem(key, value);
  } catch (error) {
    console.error("Failed to write local storage", error);
  }
}

function removeLocalStorageValue(key) {
  try {
    window.localStorage.removeItem(key);
  } catch (error) {
    console.error("Failed to remove local storage", error);
  }
}

function getStorage() {
  try {
    const accountStorage = window.localStorage.getItem(getStorageKey());
    if (accountStorage) return accountStorage;
    return accountContext.accountId === "my-account" ? window.localStorage.getItem(LEGACY_STORAGE_KEY) : null;
  } catch (error) {
    console.error("Failed to read local storage", error);
    return null;
  }
}

function setStorage(value) {
  try {
    window.localStorage.setItem(getStorageKey(), value);
    return true;
  } catch (error) {
    console.error("Failed to write local storage", error);
    return false;
  }
}

function escapeHtml(value) {
  return String(value).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/\"/g, "&quot;").replace(/'/g, "&#39;");
}

function escapeAttribute(value) {
  return escapeHtml(value).replace(/\n/g, "&#10;");
}


