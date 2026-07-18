/* ============================================================
   CONTENT.JS — EDIT THIS FILE ONLY.
   Everything you see on the site lives here. Change the text,
   save, refresh. You never need to touch index.html.

   Tips:
   - Keep the quotes around text. If your text contains an
     apostrophe ('), either use double quotes around the string
     or write \' instead.
   - <b>...</b> makes text bold (highlighted white).
   - To remove an item from any list, delete its whole { ... },
     block including the comma. To add one, copy an existing
     block and edit it.
   ============================================================ */

window.CONTENT = {

  /* ---------- BASICS ---------- */
  name: "Mohit Misra",
  logoUser: "mhtmsr",            // terminal-style logo: user@prod ~
  resumeFile: "Mohit_Misra_Resume.pdf",   // must match the PDF filename in your repo
  siteTitle: "Mohit Misra — Full Stack GenAI & Agentic AI Developer",
  metaDescription: "Full Stack GenAI & Agentic AI Developer. Co-Founder & CTO at AROSCAI. RAG chatbots, LLM-vision pipelines, and multi-agent systems shipped to production on FastAPI, Claude, pgvector, and AWS.",
  footerLeft: "© 2026 Mohit Misra · Bhubaneswar, IN",
  footerRight: " <b></b>",

  /* ---------- HERO ---------- */
  hero: {
    command: "whoami",           // the "$ whoami" line
    line1: "Mohit Misra",        // big name (a teal dot is added automatically)
    line2: "I build Generative & Agentic AI systems that",   // grey line
    line3: "survive production.",          // gradient line
    paragraph: "<b>Full Stack GenAI & Agentic AI Developer</b> · Co-Founder & CTO at AROSCAI Technologies. 5+ years taking AI products end to end — <b>React frontends → FastAPI + Claude backends → AWS production</b> — including a hybrid-RAG support chatbot, an LLM-vision estimation pipeline, and multi-agent systems on LangGraph & MCP.",
    primaryBtn: "⬇ Download Resume / CV",
    secondaryBtn: "aroscai.com — live product ↗",
    secondaryUrl: "https://www.aroscai.com"
  },

  /* ---------- METRICS (animated counters) ----------
     n = the number counted up to; suffix = text after it (e.g. "+")
     hot: true makes the number amber instead of teal            */
  metrics: [
    { n: 5,  suffix: "+", label: "years in shipping SaaS apps" },
    { n: 3, suffix: "", label: "companies shipped for — startup, client contract & semiconductor" },,
    { n: 2,  suffix: "",  label: "peer-reviewed publications (Springer · AAP)" },
    { n: 2,  suffix: "", label: "voice skills & actions shipped — Alexa & Google Assistant", hot: true }
  ],

  /* ---------- CLIENTS / COMPANIES STRIP ---------- */
  clientsLabel: "COMPANIES · CLIENTS · DELIVERIES",
  clients: [
    { name: "AROSCAI Technologies",  role: "CO-FOUNDER · CTO" },
    { name: "VLSIPRO Technologies",  role: "CONTRACT CLIENT" },
    { name: "Marquee Semiconductor", role: "DIGITAL DESIGN ENGINEER" },
    { name: "Hyperlink Infosystem",  role: "CLIENT-SIDE SPOC & TEAM DIRECTION" }
  ],

  /* ---------- PIPELINE (Frontend → Backend → Production) ---------- */
  pipelineSection: {
    eyebrow: "// end-to-end ownership",
    title: "Frontend → Backend → Production",
    subtitle: "Most engineers own one layer. As a founder-CTO, I've had to own all three — and each layer is designed knowing what the next one costs."
  },
  pipeline: [
    {
      num: "01 / FRONTEND",
      title: "Interfaces users actually use",
      body: "<b>React + Vite ERP/CRM</b> with JWT auth and per-module RBAC — leads, tickets, installations, B2B hierarchies, catalog, chatbot-conversation review. <b>Next.js</b> marketing sites with 19 programmatic SEO pages, JSON-LD, dynamic sitemaps/OG images, and GA4 + Meta Pixel conversion tracking. Admin panels that let <b>non-engineers update the AI's knowledge base</b> — zero redeploys.",
      chips: ["React", "Next.js", "Vite", "Tailwind", "RBAC UI"]
    },
    {
      num: "02 / BACKEND & AI",
      title: "Retrieval, agents & streaming",
      body: "<b>Async FastAPI + Anthropic Claude</b>: hybrid RAG fusing keyword/tag scoring with <b>pgvector cosine-similarity over an HNSW index</b>, SSE token streaming, and bounded tool-calling (strict schemas, whitelisted functions) into live warranty APIs. Ingestion: PDF/HTML extraction → <b>paragraph-aware chunking</b> → local ONNX embeddings on CPU — no GPU bill. Agentic systems on <b>LangGraph state machines + MCP servers</b>.",
      chips: ["FastAPI", "Claude API", "pgvector", "LangGraph", "MCP", "SSE"]
    },
    {
      num: "03 / PRODUCTION",
      title: "Deployed, monitored, affordable",
      body: "Containerized with <b>Docker</b>, shipped through <b>GitHub Actions CI/CD</b>, running on <b>AWS — EC2, RDS/Postgres + pgvector, S3, SES, Route 53</b>. Production decisions treated as design constraints: <b>cost per query, p95 latency, retrieval precision/recall, hallucination containment</b>. Example: Smart Estimate's deterministic re-match path means user edits never trigger repeat LLM calls.",
      chips: ["AWS", "Docker", "GitHub Actions", "EC2 · RDS · S3", "Route 53"]
    }
  ],

  /* ---------- PROJECTS ----------
     icon: any character/emoji · hot: true = amber icon
     kpi: the amber highlight box (delete the line to hide it)   */
  workSection: {
    eyebrow: "// shipped — not demos",
    title: "Production systems & agentic builds",
    subtitle: "Every card below is real: serving customers at aroscai.com, delivered to a client, or in active development as open agentic infrastructure."
  },
  projects: [
    {
      icon: "⌘", tag: "PRODUCTION · AROSCAI",
      title: "GenAI Support Chatbot",
      body: "Customer-facing RAG assistant on <b>FastAPI + Anthropic Claude</b>. Hybrid retrieval — keyword/tag scoring fused with pgvector cosine-similarity over an <b>HNSW index</b> — so exact part numbers and vague paraphrases both land. Responses stream token-by-token via <b>SSE</b>; <b>bounded tool-calling</b> hits live warranty APIs with strict schemas, so the model looks up real data but can't invent actions.",
      kpi: "▸ Hallucination-contained by architecture · live data via whitelisted tools only",
      chips: ["FastAPI", "Claude", "pgvector", "HNSW", "SSE"]
    },
    {
      icon: "◉", hot: true, tag: "PRODUCTION · AROSCAI",
      title: "AI Smart Estimate",
      body: "Switchboard photo → <b>LLM-vision extraction</b> into validated structured JSON → embedding-based catalog matching → instant lead-gen estimate cart. The critical cost decision: user edits route through a <b>deterministic re-match path</b> — pure catalog logic, zero repeat LLM calls.",
      kpi: "▸ 1 inference per photo, not per interaction — cost-per-query as a design constraint",
      chips: ["LLM Vision", "Structured JSON", "Embeddings"]
    },
    {
      icon: "⚙", tag: "PRODUCTION · AROSCAI",
      title: "Knowledge Pipeline + Admin",
      body: "The unglamorous part that makes RAG work: <b>PDF/HTML extraction → paragraph-aware chunking</b> (semantic boundaries, not fixed windows) → <b>local ONNX embeddings on CPU</b> — no GPU dependency. An RBAC admin panel lets support staff update the knowledge base themselves; content re-embeds on save.",
      kpi: "▸ 0 redeploys, 0 engineers in the loop for knowledge updates",
      chips: ["ONNX", "Chunking", "RBAC Admin"]
    },
    {
      icon: "▣", tag: "CLIENT · VLSIPRO",
      title: "TalentTrack",
      body: "<b>MERN recruitment platform</b> built around <b>OpenAI embeddings</b> for true semantic candidate search. Every HR search query and candidate resume is converted into a vector via the <b>OpenAI embeddings API</b>, indexed in <b>MongoDB Atlas Vector Search</b>, and ranked by <b>cosine similarity</b> — so 'senior backend engineer, fintech background' matches candidates by meaning, not keyword overlap. Vector results are then narrowed with <b>metadata filtering</b> (skills, location, experience level, availability) before hitting recruiter dashboards. REST APIs power job postings and candidate indexing/retrieval end to end.",
      kpi: '▸ Query → OpenAI embedding → Atlas Vector Search (cosine similarity) → metadata filters → ranked candidates · also shipped <a href="https://knowledgespark.in" target="_blank" rel="noopener">Knowledge Spark LMS ↗</a>',
      chips: ["MongoDB Atlas", "Vector Search", "OpenAI Embeddings", "Express", "React", "Node"]
    },
    {
      icon: "⧉", tag: "AGENTIC · ACTIVE",
      title: "AgentDesk",
      body: "Multi-agent support assistant: <b>retrieval, ticketing, and escalation agents</b> orchestrated as <b>LangGraph state machines</b> with LangChain tool-calling. Internal tools (order lookup, ticket creation) are exposed via <b>MCP servers</b> for dynamic agent discovery; responses ground on pgvector retrieval with reranking over a hybrid corpus.",
      kpi: "▸ Agent hand-offs as explicit state transitions — debuggable, not vibes",
      chips: ["LangGraph", "LangChain", "MCP", "Reranking"]
    },
    {
      icon: "◈", tag: "AGENTIC · ACTIVE",
      title: "DocMind",
      body: "<b>MCP-native document research agent</b>: multi-step reasoning over LangGraph state graphs and LangChain retrieval chains for iterative research. Its MCP server exposes <b>search, summarization, and citation tools</b> consumable by any MCP-compatible client, with hybrid vector + keyword retrieval and structured JSON outputs.",
      kpi: "▸ Build once, plug into any MCP client — Claude, IDEs, agents",
      chips: ["MCP Server", "LangGraph", "Hybrid Retrieval"]
    }
  ],

  /* ---------- EXPERIENCE ----------
     now: true = filled/glowing timeline dot (current role)      */
  experienceSection: {
    eyebrow: "// git log --career",
    title: "Experience",
    subtitle: "From semiconductor-adjacent IoT systems to founding and running a GenAI product company."
  },
  experience: [
    {
      now: true,
      span: "Nov 2021 — Present",
      role: "Co-Founder, CTO & Director",
      org: "AROSCAI Technologies Pvt. Ltd. · aroscai.com",
      points: [
        "<b>Architected the production GenAI support chatbot</b> — FastAPI + Claude, hybrid RAG (keyword scoring + pgvector/HNSW cosine similarity), SSE streaming, bounded tool-calling for live warranty lookups.",
        "<b>Shipped AI Smart Estimate</b> — LLM-vision structured extraction → catalog matching → lead-gen cart, with a deterministic no-LLM re-match path eliminating repeat inference costs.",
        "<b>Built the knowledge-ingestion pipeline</b> — PDF/HTML extraction, paragraph-aware chunking, local ONNX embeddings (CPU-only) — plus an admin tool for non-engineering staff.",
        "<b>Led an 8-engineer team</b> on the IoT smart-home platform; shipped Alexa & Google Assistant integrations in-house and directed Hyperlink Infosystem through iOS/Android app delivery.",
        "<b>Owned production infrastructure</b> — AWS (EC2, RDS, S3, SES, Route 53), Docker builds, GitHub Actions CI/CD — and growth: 19 programmatic SEO pages, JSON-LD, GA4 + Meta Pixel tracking."
      ]
    },
    {
      span: "Mar 2025 — Jul 2026 · Contract (completed)",
      role: "Full Stack AI Developer",
      org: "VLSIPRO Technologies Pvt. Ltd.",
      points: [
        "<b>Built TalentTrack</b> — MERN recruitment platform converting HR search queries into vector embeddings via the <b>OpenAI embeddings API</b>, stored and indexed in <b>MongoDB Atlas Vector Search</b>, and ranked by <b>cosine similarity</b> for semantic candidate matching.",
        "<b>Layered metadata filtering</b> (skills, location, experience level, availability) on top of vector search results, so recruiters get semantically relevant candidates narrowed to hard constraints — not just a similarity score.",
        "<b>Designed REST APIs</b> for recruiter dashboards, job postings, and candidate indexing/retrieval workflows.",
        '<b>Delivered <a href="https://knowledgespark.in" target="_blank" rel="noopener">Knowledge Spark LMS ↗</a></b> — course management, automated enrollment, and payment gateway integration.'
      ]
    },
    {
      span: "Dec 2020 — Nov 2021",
      role: "Digital Design Engineer",
      org: "Marquee Semiconductor Pvt. Ltd.",
      points: [
        "<b>Built IoT data-acquisition systems</b> (ESP32/ESP8266) with backend logging pipelines streaming real-time sensor data to cloud servers; designed hardware-to-web API integrations.",
        "<b>Laid the foundations of an internal project-management tool</b> that later grew in scale into corplink.ai, an independent startup entity."
      ]
    }
  ],

  /* ---------- SKILLS ---------- */
  skillsSection: {
    eyebrow: "// import stack",
    title: "The stack I ship with"
  },
  skills: [
    { icon: "⌘", name: "GenAI / LLM",    items: ["RAG — hybrid keyword + vector", "LangChain · LangGraph", "MCP (Model Context Protocol)", "Anthropic Claude API", "Tool / function calling", "LLM vision extraction", "Structured outputs (JSON)", "Prompt engineering", "Chunking & embeddings", "Semantic search"] },
    { icon: "⚡", name: "Backend",        items: ["Python (async)", "FastAPI · Pydantic", "Node.js · Express.js", "REST API design", "JWT auth · RBAC", "SSE streaming", "Scalable system design"] },
    { icon: "◫", name: "Data",           items: ["PostgreSQL + pgvector (HNSW)", "MongoDB", "Vector databases", "Embedding pipelines"] },
    { icon: "▤", name: "Frontend",       items: ["React.js", "Next.js", "Vite", "Tailwind CSS", "Responsive UI"] },
    { icon: "☁", name: "Cloud & DevOps", items: ["AWS — EC2 · RDS · S3 · SES · Route 53", "Docker & Docker Compose", "GitHub Actions CI/CD", "Cloud deployment"] },
    { icon: "⇌", name: "IoT",            items: ["ESP32 / ESP8266", "MQTT · HTTP", "Sensor data pipelines", "Alexa Skills", "Google Assistant"] }
  ],

  /* ---------- CREDENTIALS ---------- */
  credentialsSection: {
    eyebrow: "// credentials --verify",
    title: "Education, certification & recognition"
  },
  credentials: [
    { heading: "EDUCATION",     lines: ["<b>B.Tech, Computer Science & Engineering</b>", "National Institute of Science & Technology (NIST), BPUT · 2017–2021", "<b>CGPA 9.06</b> · Certificate of Excellence (SGPA 9.21)"] },
    { heading: "CERTIFICATION", lines: ["<b>RAG and Agentic AI Professional Certificate — IBM</b> (verified)", "RAG systems, AI agents, LangChain, LangGraph, vector databases, multi-agent workflows"] },
    { heading: "PUBLICATIONS",  lines: ["<b>Two-Wheeler Anti-Theft System</b> — three-layer architecture · Springer Singapore, 2022", "<b>RF-Based Social Distance Smart Band</b> — Apple Academic Press, 2022"] },
    { heading: "ACHIEVEMENTS",  lines: ["<b>Top 10 Finalist</b> — CSI In-App Student Project Awards 2020", "<b>Top 9 Teams</b> — NASA Space Apps Challenge 2019"] }
  ],

  /* ---------- CONTACT ---------- */
  contact: {
    command: 'open --to "Full Stack GenAI / Agentic AI roles"',
    titleLine1: "The prototype-to-production gap",
    titleLine2: "is where I work.",   // rendered in teal
    paragraph: "Retrieval quality, latency, cost per query, and tooling your whole team can run — if that's the engineering you need, let's talk.",
    links: [
      { label: "⬇ Resume / CV",            href: "Mohit_Misra_Resume.pdf", download: true, primary: true },
      { label: "✉ dev.mhtmsr@gmail.com",   href: "mailto:dev.mhtmsr@gmail.com" },
      { label: "in/ linkedin.com/in/mhtmsr", href: "https://linkedin.com/in/mhtmsr" },
      { label: "◍ aroscai.com",            href: "https://www.aroscai.com" },
      { label: "✆ +91 79783 19648",        href: "tel:+917978319648" }
    ]
  },

  /* ---------- NAV LINKS ---------- */
  nav: [
    { label: "How I Ship",  target: "#pipeline" },
    { label: "Work",        target: "#work" },
    { label: "Experience",  target: "#experience" },
    { label: "Stack",       target: "#skills" },
    { label: "Contact",     target: "#contact" }
  ],
  navCta: "resume --download"
};
