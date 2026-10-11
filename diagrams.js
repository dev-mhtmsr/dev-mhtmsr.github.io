/* ============================================================
   DIAGRAMS.JS: system design diagrams for the "System design" section.
   Built from the real repos (AroscaiNextGen, Knowledgespark V2.0).
   "built" = what runs in production today. "scale" = the design for 10-100x
   traffic, grounded in each repo's own scaling notes.

   Node:  { id, x, y, w?, h?, label, sub, kind, detail: { what, where?, talk } }
   kind:  client | edge | app | ai | data | queue | ext
   Edge:  [from, to, label?, dashed?, sides?]   sides e.g. "r-r" forces exit/entry sides (t, r, b, l)
   Group: { label, x, y, w, h }   (dashed box, e.g. a server or a VPC)
   ============================================================ */

window.DIAGRAMS = [

  /* ---------------------------------------------------------- */
  {
    id: "aroscai",
    tab: "AROSCAI platform",
    summary: "Three apps (public site, staff Online Information System, FastAPI backend) share one API and one Postgres. Everything runs in Docker Compose on one EC2 instance behind Caddy.",
    built: {
      h: 540,
      groups: [{ label: "AWS EC2 · t3.medium · Docker Compose", x: 350, y: 16, w: 410, h: 508 }],
      nodes: [
        { id: "users", x: 20, y: 40, w: 150, label: "Customers", sub: "browser · aroscai.com", kind: "client",
          detail: { what: "Visitors browse products, chat with the support bot and run Smart Estimate.", talk: "Every customer-facing AI feature goes through the same API, so there is one place to rate-limit, log and meter cost." } },
        { id: "staff", x: 20, y: 390, w: 150, label: "Staff", sub: "Online Information System", kind: "client",
          detail: { what: "Sales, service and stores teams log in to the OIS to run leads, tickets and installations.", talk: "Per-module read/write permissions are enforced on the API, not just hidden in the UI." } },
        { id: "dns", x: 200, y: 215, w: 140, label: "Cloudflare DNS", sub: "DNS only, no proxy", kind: "edge",
          detail: { what: "A records for www, webapi and internal point at one Elastic IP.", where: "production.md §7", talk: "Proxying was switched off on purpose: Caddy needs the real ACME challenge and SSE streams must not be buffered." } },
        { id: "caddy", x: 370, y: 215, w: 150, label: "Caddy", sub: "TLS · reverse proxy", kind: "edge",
          detail: { what: "Terminates TLS with automatic Let's Encrypt certificates and routes by hostname to the three apps.", where: "deploy/Caddyfile", talk: "flush_interval -1 on the API route keeps chatbot tokens streaming instead of arriving all at once." } },
        { id: "web", x: 570, y: 60, label: "Next.js site", sub: "client · SSR + SEO", kind: "app",
          detail: { what: "Marketing and commerce site with the chatbot widget, Smart Estimate and 19 generated SEO pages.", where: "client/ (Next.js 16, App Router)", talk: "Build-time env vars (API URL, GA4, Pixel) are baked in by CI as Docker build args." } },
        { id: "api", x: 570, y: 215, label: "FastAPI", sub: "server · /api + /internal", kind: "app",
          detail: { what: "Single backend for both frontends: public /api routes and JWT-protected /internal routes.", where: "server/app/api/routes (27 route modules), services/, agents/, mcp_server/", talk: "The only service with a database connection, so it is the single source of truth." } },
        { id: "ois", x: 570, y: 370, label: "Info System (OIS)", sub: "internal · React + Vite", kind: "app",
          detail: { what: "Staff ERP/CRM served as a static build behind nginx: leads, tickets, customers, installations, KB and AI billing.", where: "internal/src/pages", talk: "Route-level ModuleGate mirrors the API's permission checks for a clean UX." } },
        { id: "pg", x: 370, y: 440, w: 150, label: "Postgres 16", sub: "pgvector · HNSW", kind: "data",
          detail: { what: "All business data plus knowledge-base chunks with 384-dim embeddings under an HNSW cosine index.", where: "server/app/models", talk: "Vectors live next to relational data, so retrieval can filter on status with plain SQL." } },
        { id: "claude", x: 810, y: 40, label: "Claude API", sub: "Sonnet + Haiku", kind: "ai",
          detail: { what: "Sonnet for chat agents and vision extraction, Haiku for the cheap 16-token router call.", talk: "Every call is metered per feature and model, and reconciled against Anthropic's Admin API in the OIS." } },
        { id: "langfuse", x: 810, y: 150, label: "Langfuse", sub: "LLM traces · optional", kind: "ext",
          detail: { what: "Traces each agent run when keys are configured.", where: "services/langfuse_client.py", talk: "Designed to be optional: an outage or missing key can never take the bot down." } },
        { id: "ses", x: 810, y: 275, label: "Amazon SES", sub: "leads · tickets · OTP", kind: "ext",
          detail: { what: "Lead and ticket emails, ticket status updates and warranty OTP codes.", talk: "Credentials come from the EC2 instance role through IMDS, not stored keys." } },
        { id: "s3", x: 810, y: 440, label: "Amazon S3", sub: "nightly pg_dump · 30 days", kind: "data",
          detail: { what: "Nightly database backups with 30-day retention.", where: "deploy/backup.sh", talk: "Named trade-off versus RDS point-in-time recovery: worst-case data loss is about 24 hours." } },
        { id: "ci", x: 200, y: 440, w: 140, label: "GitHub Actions", sub: "OIDC → ECR → SSM", kind: "ext",
          detail: { what: "Builds only the apps that changed, pushes images to ECR and rolls them out over AWS Systems Manager.", where: ".github/workflows/deploy.yml, deploy/deploy.sh", talk: "No stored AWS keys and no open SSH port. A failed health check fails the deploy." } }
      ],
      edges: [
        ["users", "dns", "HTTPS"], ["staff", "dns"], ["dns", "caddy"],
        ["caddy", "web", "www"], ["caddy", "api", "SSE"], ["caddy", "ois", "internal"],
        ["api", "pg", "SQL + vectors"], ["api", "claude", "chat · vision"], ["api", "langfuse", "", true],
        ["api", "ses", "email"], ["pg", "s3", "backup", true], ["ci", "caddy", "deploy", true]
      ],
      notes: [
        "One EC2 host with Compose was chosen over ECS/Kubernetes: the whole stack fits on a t3.medium and there is no cluster to run.",
        "Postgres in a container with nightly S3 dumps is a documented trade-off against RDS. It is the first thing to change if data criticality grows.",
        "Deploys rebuild only the apps whose folders changed, and are serialized so two deploys never overlap."
      ]
    },
    scale: {
      h: 600,
      groups: [{ label: "AWS · multi-AZ", x: 335, y: 16, w: 645, h: 494 }],
      nodes: [
        { id: "users", x: 20, y: 120, label: "Customers", sub: "browser", kind: "client",
          detail: { what: "Same entry point; traffic now absorbed at the edge first.", talk: "Scale the read-heavy public site and the AI paths independently." } },
        { id: "staff", x: 20, y: 380, label: "Staff", sub: "OIS", kind: "client",
          detail: { what: "Staff traffic is small but must stay available during public spikes.", talk: "Separate the static OIS build from the API so it never competes for app capacity." } },
        { id: "cdn", x: 180, y: 250, w: 140, label: "Cloudflare", sub: "CDN · WAF · proxy", kind: "edge",
          detail: { what: "Turn on proxying: cache static and ISR pages, block bots, absorb spikes.", talk: "SSE routes stay un-cached with buffering disabled at the edge." } },
        { id: "alb", x: 355, y: 250, w: 140, label: "Load balancer", sub: "ALB · health checks", kind: "edge",
          detail: { what: "Replaces the single Caddy: spreads requests over many tasks and drains unhealthy ones.", talk: "Enables zero-downtime rolling deploys, which the single-host setup can't do." } },
        { id: "ois", x: 355, y: 420, w: 140, label: "OIS build", sub: "S3 + CloudFront", kind: "app",
          detail: { what: "The Vite build is just static files, so serve it from S3 behind a CDN.", talk: "Removes a whole container from the app tier." } },
        { id: "web", x: 535, y: 60, label: "Next.js · ECS", sub: "2+ tasks, autoscaled", kind: "app",
          detail: { what: "Stateless containers on Fargate, scaled on CPU and request count.", talk: "Already containerized, so this is a hosting change, not a rewrite." } },
        { id: "api", x: 535, y: 250, label: "FastAPI · ECS", sub: "stateless, autoscaled", kind: "app",
          detail: { what: "Many API tasks. Chat sessions are keyed by a client UUID, so any task can serve any turn.", talk: "Scale on concurrent SSE connections, not just CPU, because chat is I/O-bound waiting on the model." } },
        { id: "sqs", x: 535, y: 350, h: 50, label: "SQS", sub: "ingest + email jobs", kind: "queue",
          detail: { what: "Knowledge-base ingestion is synchronous today. Move it, and emails, onto a queue.", talk: "This is the known gap in the current design: a large PDF blocks a request." } },
        { id: "worker", x: 535, y: 440, label: "Workers · ECS", sub: "ingest · embed · summarize", kind: "queue",
          detail: { what: "Chunking, local ONNX embedding and summaries run off the request path.", talk: "Embedding stays on CPU with fastembed, so workers scale without GPUs." } },
        { id: "redis", x: 790, y: 40, w: 180, label: "ElastiCache Redis", sub: "rate limits · answer cache", kind: "queue",
          detail: { what: "Per-IP and per-session rate limits, plus a cache for repeated chatbot answers.", talk: "A semantic cache on frequent questions cuts model spend further on top of the regex fast path." } },
        { id: "rds", x: 790, y: 180, w: 180, label: "RDS Postgres", sub: "Multi-AZ · pgvector HNSW", kind: "data",
          detail: { what: "Managed primary with point-in-time recovery; pgvector keeps the HNSW index.", talk: "First step on the documented path: move DATABASE_URL to RDS so every container becomes disposable." } },
        { id: "replica", x: 790, y: 310, w: 180, label: "Read replica", sub: "catalog · dashboards", kind: "data",
          detail: { what: "Product pages, retrieval reads and OIS dashboards read from the replica.", talk: "Writes (leads, tickets, installs) stay on the primary." } },
        { id: "s3", x: 790, y: 440, w: 180, label: "Amazon S3", sub: "KB uploads · backups", kind: "data",
          detail: { what: "KB uploads move from local disk to S3, so any task can read them.", talk: "Local-disk uploads are a listed gap; shared storage is required once there is more than one task." } },
        { id: "obs", x: 180, y: 530, w: 140, label: "Observability", sub: "CloudWatch · Langfuse", kind: "ext",
          detail: { what: "Request metrics, logs and LLM traces in one place.", talk: "Alert on p95 latency, model error rate and cost per conversation." } },
        { id: "claude", x: 535, y: 530, label: "Claude API", sub: "prompt caching · Haiku router", kind: "ai",
          detail: { what: "Same models, with prompt caching on the long system prompts.", talk: "The Haiku router already keeps the cheap decision off the expensive model." } },
        { id: "ses", x: 790, y: 530, w: 180, label: "Amazon SES", sub: "via worker queue", kind: "ext",
          detail: { what: "Email sent from workers, with retries.", talk: "A slow mail provider can no longer slow down an API request." } }
      ],
      edges: [
        ["users", "cdn", "HTTPS"], ["staff", "cdn"], ["cdn", "alb"], ["cdn", "ois", "static", true],
        ["alb", "web"], ["alb", "api"], ["api", "redis"], ["api", "rds", "writes"], ["api", "replica", "reads"],
        ["rds", "replica", "replication", true], ["api", "sqs", "enqueue"], ["sqs", "worker"], ["worker", "s3"],
        ["worker", "rds", "", false, "r-l"], ["api", "claude", "", false, "r-r"], ["worker", "ses"]
      ],
      notes: [
        "Order of changes: RDS first (makes containers disposable), then S3 for uploads, then a queue for ingestion, then ECS for horizontal scale.",
        "Chat is I/O-bound on the model, so autoscale API tasks on open SSE connections, not CPU alone.",
        "Cost controls compound: regex fast path, Haiku router, prompt caching, then an answer cache."
      ]
    }
  },

  /* ---------------------------------------------------------- */
  {
    id: "chatbot",
    tab: "AI support chatbot",
    summary: "A LangGraph agent: retrieve context, let a cheap model pick one of six categories, then run that category's agent with only the tools it is allowed to use. Replies stream to the browser over SSE.",
    built: {
      h: 540,
      groups: [{ label: "LangGraph agent graph · server/app/agents/graph.py", x: 300, y: 16, w: 450, h: 430 }],
      nodes: [
        { id: "widget", x: 20, y: 60, label: "Chat widget", sub: "Next.js · SSE reader", kind: "client",
          detail: { what: "Floating widget on every page. Reads the SSE stream by hand and renders inline lead and ticket forms when the backend sends them.", where: "client/components/shared/AIChatbot.jsx", talk: "A client-generated session UUID ties a conversation together across page loads." } },
        { id: "api", x: 20, y: 215, label: "POST /api/chat", sub: "FastAPI · SSE", kind: "app",
          detail: { what: "Validates the turn, caps history and streams events back: tokens, lead_form, ticket_form, smart-estimate link.", where: "api/routes/chat.py, services/chat_agent.py", talk: "The SSE event contract stayed the same when the internals moved to agents, so the widget didn't change." } },
        { id: "fast", x: 20, y: 380, label: "Fast path", sub: "regex · zero LLM calls", kind: "app",
          detail: { what: "Canned questions like contact details are answered without calling a model.", where: "services/chat_fastpath.py", talk: "Cheapest call is the one you never make." } },
        { id: "retrieve", x: 325, y: 60, w: 180, label: "retrieve", sub: "catalog keywords + pgvector", kind: "app",
          detail: { what: "Hybrid retrieval: keyword and tag scoring over the product catalogue, plus cosine search over knowledge-base chunks.", where: "services/chat_retrieval.py", talk: "Model numbers and specs match better on keywords; vague questions match better on embeddings. Use both." } },
        { id: "route", x: 325, y: 200, w: 180, label: "route", sub: "Claude Haiku · 16 tokens", kind: "ai",
          detail: { what: "Classifies the turn into sales, service, warranty, career, general or contact, using the last four turns.", talk: "A tiny, cheap call decides which expensive agent runs and which tools it gets." } },
        { id: "agents", x: 325, y: 340, w: 180, label: "6 category agents", sub: "Sonnet · ≤3 tool rounds", kind: "ai",
          detail: { what: "Each category agent is bound only to its own tools. After the last tool round the model is called with tools disabled.", where: "agents/graph.py: _make_category_node", talk: "The final no-tools round guarantees the reply ends in text, never a dangling tool call." } },
        { id: "mcp", x: 555, y: 200, w: 175, label: "MCP server", sub: "contact · tickets · OTP", kind: "app",
          detail: { what: "Tools exposed over MCP: contact info, ticket status, warranty OTP send and verify, context search.", where: "server/app/mcp_server/tools.py", talk: "The session key is injected server-side, so the model can never act on someone else's session." } },
        { id: "pg", x: 800, y: 60, label: "Postgres", sub: "KB chunks · conversations", kind: "data",
          detail: { what: "Knowledge-base vectors, saved conversations, leads, tickets and installations.", talk: "Every conversation is stored and reviewable in the OIS." } },
        { id: "claude", x: 800, y: 340, label: "Claude Sonnet", sub: "token streaming", kind: "ai",
          detail: { what: "Generates the answer token by token; usage is recorded per feature.", where: "services/usage.py", talk: "Cost per conversation is visible in the OIS Usage & Billing page." } },
        { id: "ses", x: 800, y: 200, label: "Amazon SES", sub: "warranty OTP", kind: "ext",
          detail: { what: "Sends a 6-digit code to the email registered on the installation, never one the user types in.", where: "services/warranty_otp.py", talk: "The OTP never enters the model's context; only 'sent' or 'verified' does." } },
        { id: "langfuse", x: 555, y: 470, w: 175, label: "Langfuse", sub: "traces · optional", kind: "ext",
          detail: { what: "Traces every node and tool call when configured.", talk: "Observability is optional so it can never be a single point of failure." } }
      ],
      edges: [
        ["widget", "api", "message"], ["api", "fast", "canned?"], ["api", "retrieve", "astream"],
        ["retrieve", "pg", "hybrid search"], ["retrieve", "route"], ["route", "agents", "category"],
        ["agents", "mcp", "tool calls"], ["mcp", "ses", "OTP"], ["mcp", "pg"], ["agents", "claude", "stream"],
        ["agents", "widget", "tokens · forms", true], ["agents", "langfuse", "", true]
      ],
      notes: [
        "Least privilege for tools: each category agent only sees the tools its job needs.",
        "Bounded loop with a forced final text round, instead of an open-ended ReAct agent.",
        "Warranty data is behind an OTP sent to the address on file, so knowing a serial number is not enough."
      ]
    }
  },

  /* ---------------------------------------------------------- */
  {
    id: "estimate",
    tab: "AI Smart Estimate",
    summary: "Photo in, matched panels out. The model is called once per photo; everything after extraction is deterministic code, so corrections are instant and free.",
    built: {
      h: 470,
      nodes: [
        { id: "photo", x: 20, y: 40, label: "Switchboard photo", sub: "one per board, per room", kind: "client",
          detail: { what: "Customers add rooms and upload a photo of each switchboard.", talk: "Several boards per room, several rooms per estimate." } },
        { id: "cache", x: 210, y: 40, label: "Image cache", sub: "same photo, no new call", kind: "queue",
          detail: { what: "Keyed by the image's SHA-256 plus a fingerprint of the prompt, so a repeat photo reuses the earlier result.", where: "services/extraction.py, models/extraction_cache.py", talk: "Editing the prompt changes the key, so stale extractions can never be served. Savings show in the OIS billing page." } },
        { id: "extract", x: 400, y: 40, label: "Vision extraction", sub: "Claude Sonnet → JSON", kind: "ai",
          detail: { what: "One high-resolution vision call returns switch, socket, regulator, dimmer and module-size counts with a confidence.", where: "services/extraction.py", talk: "Structured output only; the model never chooses products." } },
        { id: "validate", x: 590, y: 40, label: "Validation", sub: "Pydantic · real sizes", kind: "app",
          detail: { what: "Snaps module size to real values (2, 3, 4, 6, 8, 12, 16) and enforces a capacity floor.", where: "schemas/switchboard.py", talk: "Never trust the model alone: validation fixes impossible answers." } },
        { id: "filter", x: 790, y: 40, label: "Size filter", sub: "exact module size only", kind: "app",
          detail: { what: "Only panels of the detected size are considered.", where: "services/matching.py: _fits_board", talk: "No match is better than a panel that physically won't fit." } },
        { id: "score", x: 790, y: 200, label: "Coverage scoring", sub: "60 · 15 · 15 · 10", kind: "app",
          detail: { what: "Scores 0-100: load coverage 60, switch-type coverage 15, efficiency 15, size 10.", where: "services/matching.py: score_product", talk: "Coverage first, then least waste: don't sell a 16-switch panel to a 4-switch home." } },
        { id: "top3", x: 590, y: 200, label: "Top 3 panels", sub: "with plain-English reasons", kind: "app",
          detail: { what: "Each pick explains itself, e.g. 'covers 4 switches, no room for 1 socket'.", talk: "Explanations build trust and make wrong detections easy to spot." } },
        { id: "cart", x: 400, y: 200, label: "Enquiry cart", sub: "all rooms, one request", kind: "client",
          detail: { what: "Chosen panels for every room go into one enquiry.", talk: "Designed as lead generation, not checkout." } },
        { id: "lead", x: 210, y: 200, label: "Lead + email", sub: "OIS Leads · SES", kind: "ext",
          detail: { what: "Creates a lead in the OIS and emails the sales team.", talk: "Closes the loop from AI feature to a sales conversation." } },
        { id: "edit", x: 590, y: 360, label: "Customer edits counts", sub: "POST /api/match-products", kind: "client",
          detail: { what: "If a count is wrong the customer fixes it; validation, filter and scoring run again.", talk: "Zero model calls on edits, so the adjust-and-rescore loop is instant and free." } },
        { id: "catalog", x: 790, y: 360, label: "Panel catalogue", sub: "37 panels · OIS Product Feed", kind: "data",
          detail: { what: "Verified specs for every panel, stored in Postgres and edited by staff.", where: "core/touch_panel_catalog.py, touch_panels table", talk: "The original price list was wrong; each panel was re-verified by hand against its image." } }
      ],
      edges: [
        ["photo", "cache", "hash"], ["cache", "extract", "miss"], ["extract", "validate", "JSON"], ["validate", "filter"],
        ["filter", "score"], ["catalog", "score", "specs"], ["score", "top3"], ["top3", "cart", "pick"], ["cart", "lead"],
        ["top3", "edit", "adjust"], ["edit", "score", "re-score, no LLM", true]
      ],
      notes: [
        "LLM for perception, code for decisions: the model reads the photo, deterministic scoring picks the products.",
        "Cost is bounded per photo, not per interaction.",
        "Data quality beat model tuning: fixing the catalogue mattered more than prompt changes."
      ]
    }
  },

  /* ---------------------------------------------------------- */
  {
    id: "ks",
    tab: "Knowledge Spark platform",
    summary: "A four-role LMS (students, instructors, admins, recruiters) on FastAPI and Next.js. Slow work runs in arq workers, Postgres sits behind PgBouncer, and everything runs in Docker Compose behind Nginx.",
    built: {
      h: 580,
      groups: [{ label: "VPS · Docker Compose (docker-compose.prod.yml)", x: 300, y: 16, w: 440, h: 548 }],
      nodes: [
        { id: "users", x: 20, y: 200, label: "Learners & staff", sub: "4 roles, one login", kind: "client",
          detail: { what: "Students, instructors, admins and recruiters. One account can hold several roles.", where: "frontend/src/app/{student,instructor,admin,hr}", talk: "The JWT carries the full role set; switch-role re-issues a token for the active role." } },
        { id: "nginx", x: 320, y: 200, w: 150, label: "Nginx", sub: "TLS · maintenance gate", kind: "edge",
          detail: { what: "TLS via certbot, routes the site and api subdomain, and serves a maintenance page during cutovers.", where: "deploy/maintenance.conf", talk: "A bypass secret lets the team test the new release while the public sees maintenance." } },
        { id: "front", x: 520, y: 50, w: 200, label: "Next.js frontend", sub: "role route groups", kind: "app",
          detail: { what: "Marketing site, course catalogue and four dashboards.", where: "frontend/src/app", talk: "Dashboards keep builder tabs mounted so unsaved edits survive tab switches." } },
        { id: "api", x: 520, y: 200, w: 200, label: "FastAPI backend", sub: "async · JWT · RLS context", kind: "app",
          detail: { what: "49 route modules over a shared services layer (checkout, enrollment, certificates, payouts...).", where: "backend/app/api/routes, services/", talk: "Logic used by several routes lives once in services/, e.g. one certificate function behind three routes." } },
        { id: "redis", x: 320, y: 340, w: 150, label: "Redis 7", sub: "rate limits · arq queue", kind: "queue",
          detail: { what: "Fixed-window rate limits per user and per IP, and the job queue.", where: "core/rate_limit.py", talk: "Fixed window is one round trip; the boundary burst is an accepted trade-off at this scale." } },
        { id: "worker", x: 320, y: 480, w: 150, label: "arq worker", sub: "jobs · 4 crons", kind: "queue",
          detail: { what: "Embeddings, bulk email, PDF compression, roster imports. Crons: daily metrics, course metrics, earnings maturation, order reconciliation every 15 min.", where: "backend/app/worker.py", talk: "Anything with fan-out or third-party latency never blocks a request." } },
        { id: "pgb", x: 520, y: 340, w: 200, label: "PgBouncer", sub: "transaction pooling", kind: "data",
          detail: { what: "Pools connections in front of Postgres.", where: "app/db.py", talk: "Transaction pooling breaks asyncpg prepared statements; statement_cache_size=0 on the engine fixes it for every request." } },
        { id: "pg", x: 520, y: 480, w: 200, label: "Postgres 16", sub: "pgvector · RLS", kind: "data",
          detail: { what: "All data, profile embeddings, and precomputed daily metrics tables. Row-level security on student-owned tables.", where: "backend/app/models, alembic/versions", talk: "The app connects as a non-superuser role, because superusers always bypass RLS." } },
        { id: "rzp", x: 790, y: 40, label: "Razorpay", sub: "checkout · webhooks", kind: "ext",
          detail: { what: "Orders, subscriptions and refunds. Payment state changes only on a verified webhook.", where: "services/payment_gateway.py", talk: "Behind a gateway interface with a dev stand-in, so the whole flow is testable without live keys." } },
        { id: "openai", x: 790, y: 160, label: "OpenAI", sub: "embeddings · ATS feedback", kind: "ai",
          detail: { what: "1536-dim embeddings for recruiter search and an optional short LLM pass on ATS scores.", where: "services/embedding_provider.py, llm_service.py", talk: "The rule-based ATS score never waits on the LLM; AI feedback is additive." } },
        { id: "r2", x: 790, y: 290, label: "Cloudflare R2", sub: "presigned uploads", kind: "data",
          detail: { what: "Course files, resumes and certificates, uploaded directly from the browser with presigned URLs.", where: "core/storage.py, services/file_urls.py", talk: "Large files never pass through the API server." } },
        { id: "mail", x: 20, y: 480, label: "Email", sub: "Brevo (SES pending)", kind: "ext",
          detail: { what: "Signup, enrollment and bulk instructor emails.", talk: "Sent from the worker so a slow provider never delays a request." } }
      ],
      edges: [
        ["users", "nginx", "HTTPS"], ["nginx", "front", "site"], ["nginx", "api", "api.*"],
        ["api", "redis", "INCR · enqueue"], ["redis", "worker", "jobs"], ["api", "pgb", "asyncpg"], ["pgb", "pg"],
        ["worker", "pg"], ["api", "rzp", "orders · webhooks"], ["api", "openai"],
        ["api", "r2", "presign"], ["worker", "mail", "email"]
      ],
      notes: [
        "Dashboards read precomputed daily tables, never live SUM() over growing tables.",
        "One generic mechanism over many CRUDs: courses, mock tests, webinars and internships share one table.",
        "Fails loudly on boot if production secrets are still placeholders."
      ]
    },
    scale: {
      h: 620,
      nodes: [
        { id: "users", x: 20, y: 120, label: "Learners & staff", sub: "4 roles", kind: "client",
          detail: { what: "Public catalogue traffic grows fastest and is read-only.", talk: "Split read-heavy anonymous traffic from authenticated writes." } },
        { id: "cdn", x: 180, y: 250, w: 140, label: "CDN", sub: "catalogue · course files", kind: "edge",
          detail: { what: "Caches public pages and R2 course files at the edge.", talk: "Most catalogue requests never reach the app." } },
        { id: "lb", x: 355, y: 250, w: 140, label: "Load balancer", sub: "TLS · health checks", kind: "edge",
          detail: { what: "Spreads traffic over many app instances.", talk: "Rolling deploys replace the maintenance-page cutover." } },
        { id: "front", x: 535, y: 60, label: "Next.js × N", sub: "stateless, autoscaled", kind: "app",
          detail: { what: "More frontend instances behind the balancer.", talk: "No server-side session state, so instances are interchangeable." } },
        { id: "api", x: 535, y: 250, label: "FastAPI × N", sub: "stateless, autoscaled", kind: "app",
          detail: { what: "More API instances; auth is JWT, so any instance can serve any user.", talk: "The app tier is the easiest part to scale; the database comes first." } },
        { id: "workers", x: 535, y: 440, label: "Worker pools", sub: "embed · email · PDF queues", kind: "queue",
          detail: { what: "Split the single arq queue by job type.", talk: "A slow embedding backlog can no longer delay bulk email (scaling note #6)." } },
        { id: "webhooks", x: 355, y: 440, w: 140, label: "Webhook queue", sub: "idempotent events", kind: "queue",
          detail: { what: "Payment webhooks are acknowledged fast and processed from a queue.", talk: "Idempotent by order id, so retries from Razorpay are harmless." } },
        { id: "rzp", x: 180, y: 520, w: 140, label: "Razorpay", sub: "webhooks", kind: "ext",
          detail: { what: "Same provider, with a buffer in front of processing.", talk: "The 15-minute reconciliation cron stays as the safety net." } },
        { id: "redis", x: 790, y: 40, w: 180, label: "Redis", sub: "sliding-window limits", kind: "queue",
          detail: { what: "Sliding window or token bucket in a Lua script, still one round trip.", talk: "Fixes the burst-at-boundary weakness of fixed windows (scaling note #2)." } },
        { id: "pgb", x: 790, y: 160, w: 180, label: "PgBouncer pool", sub: "tuned · scaled out", kind: "data",
          detail: { what: "Pool sizes are hard-coded today (20 per pool, 200 clients).", talk: "Pool limits bite before the app tier does (scaling note #4)." } },
        { id: "primary", x: 790, y: 280, w: 180, label: "Postgres primary", sub: "writes · HNSW vector index", kind: "data",
          detail: { what: "Orders, payments and RLS tables. Recruiter ranking moves into SQL with an HNSW index and the <=> operator.", talk: "Similarity is ranked in Python today, an O(n) scan. It is the first thing to fall over (scaling note #1)." } },
        { id: "replica", x: 790, y: 400, w: 180, label: "Read replicas", sub: "catalogue · dashboards", kind: "data",
          detail: { what: "Public catalogue and dashboards read from replicas.", talk: "The first database split is reads, keeping transactional writes on the primary (scaling note #5)." } },
        { id: "r2", x: 790, y: 520, w: 180, label: "R2 storage", sub: "served via CDN", kind: "data",
          detail: { what: "Same buckets, fronted by the CDN.", talk: "Video and PDF bandwidth never touches the app servers." } }
      ],
      edges: [
        ["users", "cdn", "HTTPS"], ["cdn", "lb"], ["lb", "front"], ["lb", "api"], ["api", "redis"], ["api", "pgb"],
        ["pgb", "primary", "writes"], ["api", "replica", "reads"], ["primary", "replica", "replication", true],
        ["api", "workers", "enqueue"], ["workers", "primary"], ["rzp", "webhooks", "events"], ["webhooks", "workers"],
        ["workers", "r2"]
      ],
      notes: [
        "Answer 'what breaks first' specifically: in-Python vector ranking, then pool sizes, then the single primary.",
        "Metrics stay precomputed; if they must be near real time, update counters on write instead of nightly recompute.",
        "Queue isolation by job class keeps one slow integration from starving the others."
      ]
    }
  },

  /* ---------------------------------------------------------- */
  {
    id: "payments",
    tab: "Knowledge Spark payments",
    summary: "Payments are a webhook-driven state machine. The browser's 'I paid' callback never changes state; only a signature-verified webhook or the reconciliation job does.",
    built: {
      h: 470,
      nodes: [
        { id: "student", x: 20, y: 40, w: 150, label: "Student", sub: "course or membership", kind: "client",
          detail: { what: "Starts checkout for a course, bundle or membership, optionally with a coupon.", talk: "Coupon limits are enforced at redemption time, not just when shown." } },
        { id: "create", x: 215, y: 40, w: 150, label: "Create order", sub: "status = pending", kind: "app",
          detail: { what: "Creates the order and a Razorpay order id. Checkout is rate-limited per user.", where: "services/checkout_service.py", talk: "Order items are polymorphic: course, bundle or membership in one table." } },
        { id: "rzp", x: 410, y: 40, w: 150, label: "Razorpay", sub: "hosted checkout", kind: "ext",
          detail: { what: "The customer pays on Razorpay's checkout.", talk: "Card data never touches our servers." } },
        { id: "webhook", x: 605, y: 40, w: 150, label: "Verified webhook", sub: "HMAC signature check", kind: "app",
          detail: { what: "payment.captured arrives with a signature checked against the webhook secret.", where: "api/routes/payments.py", talk: "The highest-consequence rule: state changes only here, because a client callback is trivially spoofable." } },
        { id: "paid", x: 800, y: 40, w: 150, label: "mark_order_paid", sub: "idempotent", kind: "app",
          detail: { what: "Marks the order paid exactly once, even if the webhook is delivered twice.", where: "services/checkout_service.py", talk: "The webhook and the reconciliation job call the same function." } },
        { id: "grant", x: 800, y: 200, w: 150, label: "Grant access", sub: "enrollment · membership", kind: "data",
          detail: { what: "Enrolls the student or activates the membership tier.", where: "services/enrollment_service.py, membership_service.py", talk: "Access follows payment state, never the other way round." } },
        { id: "earning", x: 800, y: 360, w: 150, label: "Instructor earning", sub: "status = pending", kind: "data",
          detail: { what: "Records the instructor's share using the admin-set revenue split.", where: "services/revenue_service.py", talk: "Earnings start pending so refunds inside the hold period don't pay out." } },
        { id: "mature", x: 605, y: 360, w: 150, label: "Nightly maturation", sub: "cron 01:00 · hold period", kind: "queue",
          detail: { what: "Moves earnings past the hold period to available.", where: "worker.py: mature_pending_earnings", talk: "Same function is exposed on demand for testing." } },
        { id: "payout", x: 410, y: 360, w: 150, label: "Payout request", sub: "admin approves", kind: "app",
          detail: { what: "Instructors request a payout to an encrypted bank account; admins approve from a queue.", where: "services/payout_service.py, crypto.py", talk: "Bank details are encrypted at rest with a dedicated key." } },
        { id: "reconcile", x: 605, y: 200, w: 150, label: "Reconciliation", sub: "cron every 15 min", kind: "queue",
          detail: { what: "Polls Razorpay for orders still pending past the webhook grace period.", where: "worker.py: reconcile_pending_orders_job", talk: "Recovers payments whose webhook was dropped or misconfigured." } },
        { id: "refund", x: 410, y: 200, w: 150, label: "Refunds", sub: "admin, paid orders only", kind: "app",
          detail: { what: "Refunds can only be started against a paid order, from the Orders screen.", talk: "Refunds go through the same gateway interface, so the dev stand-in covers them too." } }
      ],
      edges: [
        ["student", "create", "checkout"], ["create", "rzp", "order id"], ["rzp", "webhook", "captured"],
        ["webhook", "paid"], ["paid", "grant"], ["paid", "earning", "", false, "r-r"], ["earning", "mature"],
        ["mature", "payout", "available"], ["reconcile", "paid", "missed webhooks", true], ["refund", "rzp", "", true]
      ],
      notes: [
        "Trust the provider's signed webhook, not the browser.",
        "Idempotent handlers plus a polling backstop make delivery failures harmless.",
        "The gateway sits behind an interface with a deterministic dev implementation, so the whole flow runs in tests without real keys."
      ]
    }
  }
];
