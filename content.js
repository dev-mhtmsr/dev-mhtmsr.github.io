/* ============================================================
   CONTENT.JS: edit this file only.
   Everything on the site comes from here. Change the text, save,
   refresh. You never need to touch index.html.

   - Keep the quotes around text. If your text contains an
     apostrophe ('), use double quotes around the string, or \'.
   - <em>...</em> gives light emphasis. Use it sparingly.
   - To remove an item from a list, delete its whole { ... },
     block. To add one, copy an existing block and edit it.
   ============================================================ */

window.CONTENT = {

  name: "Mohit Misra",
  location: "Bhubaneswar, India",
  siteTitle: "Mohit Misra",
  metaDescription: "Mohit Misra, full-stack developer in Bhubaneswar. Co-founder of AROSCAI and Full Stack AI Developer at VLSIPROF Technologies. Builds web apps with FastAPI, React and Postgres, and the AI features inside them.",
  resumeFile: "Mohit_Misra_Resume_OnePage.pdf",   // must match the PDF filename in the repo
  showResume: false,                              // true shows a "Résumé (PDF)" link

  /* ---------- INTRO ---------- */
  intro: {
    role: "Full-stack developer · Bhubaneswar, India",
    status: "Full Stack GenAI & Agentic AI Developer",
    now: [
      { org: "AROSCAI Technologies",  role: "Co-founder & CTO",        since: "2021", url: "https://www.aroscai.com" },
      { org: "VLSIPROF Technologies", role: "Full Stack AI Developer", since: "2025", url: "https://vlsiprof.com" }
    ],
    heading: "I build web software for real businesses, and the AI features that go inside it.",
    paragraphs: [
      "I'm Mohit. In 2021 I co-founded AROSCAI, a smart-home company in Bhubaneswar, and I've written most of its software since: the website and its support chatbot, a tool that quotes products from a photo of a switchboard, and the Online Information System our staff run the business on.",
      "I'm also a Full Stack AI Developer at VLSIPROF Technologies, where I built Knowledge Spark, their learning and hiring platform. Both products are live, and I look after them in production.",
      "Day to day that means Python and FastAPI on the backend, React or Next.js on the front, Postgres underneath, and Docker on AWS or a VPS."
    ]
  },

  /* ---------- SELECTED WORK ----------
     image: screenshot shown above the write-up
     notes: short list of decisions worth explaining
     gallery: optional screenshots shown in a grid (click to enlarge)   */
  work: [
    {
      id: "aroscai", tint: "navy",
      summary: "A smart-home store with a support chatbot and a tool that quotes products from a photo of a switchboard.",
      title: "AROSCAI website, support chatbot and Smart Estimate",
      meta: "AROSCAI Technologies · Co-founder & CTO · 2021 to now",
      url: "https://www.aroscai.com", urlLabel: "aroscai.com",
      image: "img/sites/aroscai.webp",
      imageAlt: "The aroscai.com homepage",
      body: [
        "The public side of AROSCAI is a Next.js site that sells touch panels, smart locks and video door phones. I built it along with the FastAPI backend behind it.",
        "Two parts of it use Claude. The support chatbot answers product, warranty and policy questions from a knowledge base that staff maintain themselves. It searches with both keywords and embeddings in Postgres (pgvector), so an exact model number and a vaguely worded question both find the right page. Smart Estimate lets a customer upload a photo of their switchboard. The model counts the switches, sockets and fan regulators, and the backend matches that to panels from our catalogue."
      ],
      notesTitle: "Things I'd point out",
      notes: [
        "The model is called once per photo. If the customer corrects a count, only the matching logic runs again, which keeps the cost per estimate predictable.",
        "I don't take the model's answer as final. Its output is validated against real panel sizes, and if nothing in the catalogue fits, the customer sees no match rather than a wrong one.",
        "The original product list didn't match the actual products. I went through all 37 panels by hand and rebuilt the catalogue so the matcher had correct data to work with.",
        "Deploys run from GitHub Actions to an EC2 server through AWS Systems Manager, so there are no stored AWS keys and no open SSH port. A failed health check stops the release."
      ],
      stack: "Next.js, FastAPI, PostgreSQL with pgvector, Claude API, fastembed, Docker, GitHub Actions, AWS (EC2, ECR, SSM, SES), Caddy",
      galleryTitle: "AI Smart Estimate",
      gallery: [
        { src: "img/smart-estimate/upload.webp",          title: "Rooms and switchboard photos", caption: "Customers add each room and upload a photo of every switchboard in it." },
        { src: "img/smart-estimate/recommendations.webp", title: "Detected loads and panel picks", caption: "The model counts switches, sockets and regulators. Any count can be corrected, and the top three matching panels update instantly." }
      ]
    },
    {
      id: "internal", tint: "slate",
      summary: "The staff app AROSCAI runs on: leads, tickets, installations, warranties and the chatbot's knowledge base.",
      title: "Online Information System ATPL",
      meta: "AROSCAI Technologies · Staff-only web app",
      body: [
        "This is what the team at AROSCAI uses every day: leads, support tickets, customers, partners and distributors, every installed device and its warranty. It also has the controls for the chatbot, where staff add pages and PDFs to its knowledge base and read past conversations.",
        "It's a React and Vite app on the same FastAPI backend as the website. Each staff account gets read or write access per module, and every change is written to an activity log. A Usage & Billing page shows what each AI feature costs, checked against Anthropic's own billing data."
      ],
      galleryNote: "Screens from the live system. Customer names, phone numbers and emails are blurred.",
      gallery: [
        { src: "img/aroscai-internal/service-dashboard.webp", title: "Service dashboard",   caption: "Installations, open tickets and warranties that expire soon." },
        { src: "img/aroscai-internal/tickets.webp",           title: "Tickets",             caption: "Raised from the website or logged from a phone call. The customer is emailed on every status change." },
        { src: "img/aroscai-internal/customers.webp",         title: "Customers",           caption: "Records sharing a phone, email or name are grouped, so duplicates are easy to spot." },
        { src: "img/aroscai-internal/installations.webp",     title: "Installations",       caption: "Every serial-numbered device per customer, with its warranty status." },
        { src: "img/aroscai-internal/product-feed.webp",      title: "Product feed",        caption: "The 37-panel catalogue that Smart Estimate matches against." },
        { src: "img/aroscai-internal/bot-knowledgebase.webp", title: "Chatbot knowledge base", caption: "Staff add links or PDFs, and the chatbot can use them straight away." },
        { src: "img/aroscai-internal/usage-billing.webp",     title: "Usage & billing",     caption: "AI cost by feature and by model." },
        { src: "img/aroscai-internal/activity-log.webp",      title: "Activity log",        caption: "Who changed what, and when." },
        { src: "img/aroscai-internal/user-management.webp",   title: "User management",     caption: "Per-module access for each staff account." }
      ],
      stack: "React, Vite, Tailwind CSS, FastAPI, PostgreSQL, JWT auth, Amazon SES"
    },
    {
      id: "knowledgespark", tint: "orange",
      summary: "A learning and hiring platform for engineering students, with four kinds of user on one account system.",
      title: "Knowledge Spark",
      meta: "VLSIPROF Technologies · Full Stack AI Developer · 2025 to now",
      url: "https://knowledgespark.in", urlLabel: "knowledgespark.in",
      image: "img/sites/knowledgespark.webp",
      imageAlt: "The knowledgespark.in homepage",
      body: [
        "Knowledge Spark is a learning platform for engineering students, run by VLSIPROF. It replaced their old WordPress site. There are four kinds of user: students, instructors, admins and recruiters, and one person can hold more than one role.",
        "Students take courses and quizzes, earn certificates and buy memberships. Instructors build courses and get paid out through an earnings ledger. Recruiters search student profiles to hire from. That search uses embeddings of each student's whole profile, filtered by location, score and certifications. It started as a separate project and I later merged it into the platform."
      ],
      notesTitle: "Things I'd point out",
      notes: [
        "Admin and instructor dashboards read from daily summary tables that a background job fills overnight. They don't run heavy queries every time a page opens.",
        "Recruiter results are ranked across all matching students before they're split into pages, so page two really is the next best candidates.",
        "Moving off WordPress meant writing a migration for users, courses, lessons and quiz attempts. I ran it on a small pilot first and checked uploaded files against checksums before going live.",
        "Email, payment webhooks and certificate PDFs run in background workers (Redis and arq) so they never slow down a request."
      ],
      stack: "Next.js, React, Tailwind CSS, FastAPI, SQLAlchemy, PostgreSQL with pgvector, PgBouncer, Redis, Razorpay, Cloudflare R2, Docker Compose, Nginx",
      galleryTitle: "Admin, instructor and student dashboards",
      galleryNote: "Screens from the live platform. User names, emails, profile photos and coupon codes are blurred.",
      gallery: [
        { src: "img/knowledgespark/admin-dashboard.webp",    title: "Admin dashboard",     caption: "Users by role, revenue, refunds and paid orders, read from daily summary tables." },
        { src: "img/knowledgespark/course-builder.webp",     title: "Course builder",      caption: "Instructors arrange modules of lessons, PDFs and quizzes." },
        { src: "img/knowledgespark/course-player.webp",      title: "Course player",       caption: "Students read lessons in a built-in viewer and track progress by module." },
        { src: "img/knowledgespark/resume-ats.webp",         title: "Resume ATS score",    caption: "A resume score from rule-based checks, plus AI feedback." },
        { src: "img/knowledgespark/orders.webp",             title: "Orders",              caption: "Course and membership purchases through Razorpay, with refunds." },
        { src: "img/knowledgespark/membership-plans.webp",   title: "Membership plans",    caption: "Student and recruiter tiers, and the instructor revenue split." },
        { src: "img/knowledgespark/student-membership.webp", title: "Student membership",  caption: "Students compare tiers, apply coupons and subscribe." },
        { src: "img/knowledgespark/earnings.webp",           title: "Instructor earnings", caption: "Earnings, bank accounts and payout requests." },
        { src: "img/knowledgespark/grading-settings.webp",   title: "Grading settings",    caption: "Quiz and assignment weights, pass mark and letter grades." },
        { src: "img/knowledgespark/coupons.webp",            title: "Coupons",             caption: "Percent or fixed discounts, with limits enforced at checkout." },
        { src: "img/knowledgespark/resource-usage.webp",     title: "Resource usage",      caption: "Signups, active users, enrollments and storage over time." },
        { src: "img/knowledgespark/users.webp",              title: "Users",               caption: "Search users and change their role or status." },
        { src: "img/knowledgespark/activity-logs.webp",      title: "Activity logs",       caption: "Admin, instructor and student activity in one feed." }
      ]
    }
  ],

  /* ---------- SIDE PROJECTS ---------- */
  sideTitle: "In progress",
  side: [
    { title: "AgentDesk", body: "A support assistant split into separate agents for search, ticketing and escalation, using LangGraph. Internal tools are exposed through MCP servers." },
    { title: "DocMind",   body: "A document research agent that runs as an MCP server, with search, summary and citation tools that any MCP client can use." }
  ],

  /* ---------- EXPERIENCE ---------- */
  experience: [
    {
      span: "2021 – now",
      role: "Co-founder, CTO & Director",
      org: "AROSCAI Technologies", orgUrl: "https://www.aroscai.com",
      points: [
        "Built the website, support chatbot, Smart Estimate and the Online Information System described above, and run the infrastructure they sit on.",
        "Led a team of eight engineers on the smart-home platform, including our Alexa and Google Assistant integrations.",
        "Managed Hyperlink Infosystem as our outside agency for the iOS and Android apps.",
        "Set up the site's SEO: 19 generated landing pages, structured data and analytics."
      ]
    },
    {
      span: "2025 – now",
      role: "Full Stack AI Developer",
      org: "VLSIPROF Technologies", orgUrl: "https://vlsiprof.com",
      points: [
        "Built Knowledge Spark and its recruiter search, and moved the old WordPress site's users and courses onto it.",
        "Deploy and maintain it on a VPS with Docker Compose and Nginx."
      ]
    },
    {
      span: "2020 – 2021",
      role: "Digital Design Engineer",
      org: "Marquee Semiconductor",
      points: [
        "Built IoT data-collection devices on ESP32 and ESP8266, with a backend that logged their sensor data.",
        "Started an internal project-management tool that later grew into corplink.ai, now a separate company."
      ]
    }
  ],

  /* ---------- SKILLS (plain lines, no badges) ---------- */
  skills: [
    { name: "Backend",  text: "Python, FastAPI, Pydantic, SQLAlchemy, Alembic, Redis and arq, REST APIs, JWT auth" },
    { name: "Frontend", text: "React, Next.js, Vite, Tailwind CSS" },
    { name: "Data",     text: "PostgreSQL, pgvector, PgBouncer, MongoDB" },
    { name: "AI",       text: "Claude API, retrieval (RAG), embeddings, tool calling, image extraction, LangChain, LangGraph, MCP" },
    { name: "Infra",    text: "Docker, GitHub Actions, AWS (EC2, ECR, SSM, S3, SES, RDS), Nginx, Caddy, Cloudflare" },
    { name: "Hardware", text: "ESP32, ESP8266, MQTT, Alexa skills, Google Assistant actions" }
  ],

  /* ---------- EDUCATION & OTHER ---------- */
  education: [
    "B.Tech in Computer Science, National Institute of Science & Technology, Berhampur (BPUT), 2017–2021. CGPA 9.06.",
    "IBM RAG and Agentic AI Professional Certificate."
  ],
  publications: [
    "Two-Wheeler Anti-Theft System. Springer Singapore, 2022.",
    "RF-Based Social Distance Smart Band. Apple Academic Press, 2022."
  ],
  awards: [
    "Top 10 finalist, CSI In-App Student Project Awards, 2020.",
    "Top 9 teams, NASA Space Apps Challenge, 2019."
  ],

  /* ---------- CONTACT ---------- */
  contact: {
    text: "I'm open to full-stack and AI engineering roles, and to freelance work on similar systems. Email is the best way to reach me.",
    email: "dev.mhtmsr@gmail.com",
    phone: "+91 79783 19648",
    linkedin: "https://linkedin.com/in/mhtmsr"
  }
};
