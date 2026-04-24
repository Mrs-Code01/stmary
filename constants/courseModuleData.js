// ─── Full detailed module data for all Tech Wizard courses ───────────────────
// URL pattern:  /tech-wizard/[courseId]/module/[moduleNum]

export const COURSE_MODULE_DETAILS = {
  // ══════════════════════════════════════════════════════════════════════════
  "prompt-engineering": [
    {
      num: 1,
      title: "Fundamentals",
      desc: "What LLMs are, prompt anatomy, system vs. user prompts.",
      overview:
        "Introduces what large language models are, how they're trained conceptually, the roles that different prompt components play (system, user, assistant), and a taxonomy of common failure modes. Uses concrete examples so students can reason about model behavior.",
      objectives: [
        "Explain at a conceptual level how transformer-based LLMs process prompts and generate output.",
        "Identify and label parts of a prompt (intent, context, constraints, examples).",
        "Diagnose common failure modes (hallucination, verbosity, factual drift, ambiguity) and propose simple mitigations.",
        "Produce reproducible single-turn prompts with clear acceptance criteria.",
      ],
      lessons: [
        "What is an LLM? — high-level architecture, training data concepts, and what \"knowledge\" means for a model.",
        "Prompt anatomy — break down real prompts line-by-line and map to expected behaviors.",
        "Roles & instruction hierarchy — practice with system vs user instructions and how they change outputs.",
        "Failure taxonomy — examples of hallucinations, incorrect facts, verbosity, and unsafe responses.",
        "Quick mitigation patterns — temperature, top-p, constraints, and formatting.",
        "Reproducibility & logging — how to log prompts and outputs for repeatable testing.",
      ],
      activities:
        "Lab: Given 8 real-world tasks (summarize, rewrite, classify, generate questions), craft single-turn prompts, capture 3 outputs each, and write a comparative analysis (why best prompt wins).",
      deliverable:
        "A short report that includes the prompt library (3 best prompts), sample outputs, and a 1-page reflection on limitations.",
      tools:
        "Playground or API sandbox, short primer articles on transformers (non-technical), curated blog posts on prompt patterns, example prompt bank.",
      rubric: [
        "Prompt clarity & specification — 30%",
        "Reproducibility and logging — 25%",
        "Correctness of outputs vs acceptance criteria — 30%",
        "Reflection on failure modes — 15%",
      ],
      prerequisites: "Basic computer literacy; no prior ML experience required.",
      parentValue:
        "Students learn the foundation of how to reliably instruct AI — the skill behind automated tutors, summarizers, and classroom helpers.",
    },
    {
      num: 2,
      title: "Effective Instruction Design",
      desc: "Templates, constraints, few-shot prompting.",
      overview:
        "Deep dive into prompting patterns and design techniques that consistently elicit desired outputs: zero/one/few-shot patterns, templates, output schemas, persona/role-play, and multi-step prompt chaining. Emphasis on reusability and testing.",
      objectives: [
        "Choose and apply the optimal shot pattern for a given task and dataset size.",
        "Design reusable, parameterized prompt templates that enforce output schemas (JSON, CSV, bullet lists).",
        "Implement prompt chaining patterns to break complex tasks into manageable steps.",
        "Build a small test harness to evaluate template stability across inputs.",
      ],
      lessons: [
        "Shot patterns: tradeoffs and performance examples (zero/one/few).",
        "Template engineering: parameterization, placeholders, and environmental variables.",
        "Output shaping: schema enforcement, delimiters, and parsing reliability.",
        "Role-play & persona control: tone, instruction bias, and consistent voice.",
        "Chaining & decomposition: design patterns for multi-step generation.",
        "Building a template library and tagging for reuse.",
        "Peer testing: structured A/B checks on templates.",
      ],
      activities:
        "Create a template library (minimum: summary template, Q&A template, lesson-plan generator) with test cases and expected schema.",
      deliverable:
        "Template repo + README describing usage, parameters, sample inputs & expected outputs.",
      tools:
        "Example template repositories, simple script for running prompts at scale (CSV in/out), documentation on model parameters.",
      rubric: [
        "Reusability & clarity of templates — 35%",
        "Schema adherence — 30%",
        "Testing coverage and results — 20%",
        "Documentation quality — 15%",
      ],
      prerequisites: "Completion of Module 1 or equivalent understanding of LLM basics.",
      parentValue:
        "Produces repeatable prompt 'tools' students can reuse across tasks (homework help, lesson creation, content summarization).",
    },
    {
      num: 3,
      title: "Reasoning & Chain-of-Thought",
      desc: "Guiding models to reliable multi-step answers.",
      overview:
        "Methods to coax stepwise reasoning from LLMs, compare direct answers vs chain-of-thought approaches, and combine models with external deterministic checkers. Focus on reliability and verification.",
      objectives: [
        "Construct prompts that elicit stepwise reasoning and decomposition for multi-step tasks.",
        "Evaluate when chain-of-thought improves correctness and when it increases hallucination risk.",
        "Design verification steps (self-check prompts, cross-checks, external calculators, regex validators).",
      ],
      lessons: [
        "Decomposition strategies: task splitting and subtask framing.",
        "Chain-of-thought prompting: examples, pitfalls, and self-consistency techniques.",
        "Verification patterns: assert-check, secondary-model-check, and deterministic validators.",
        "Hybrid pipelines: LLM + calculator / LLM + regex / LLM + reference data.",
        "Error analysis: categorize errors and remediation strategies.",
        "Reporting & transparency: how to show parents what was checked and why.",
      ],
      activities:
        "Build prompts that solve multi-step arithmetic/logic problems with verifiable steps; produce a comparison report (accuracy & failure cases) with visualizations of error types.",
      deliverable:
        "Notebook or script showing inputs, outputs, verification steps, and final correctness metrics.",
      tools:
        "Datasets of reasoning tasks, simple test harness, articles on chain-of-thought prompting.",
      rubric: [
        "Correctness after verification — 50%",
        "Quality and clarity of stepwise outputs — 25%",
        "Thoroughness of error analysis — 25%",
      ],
      prerequisites: "Modules 1–2 recommended.",
      parentValue:
        "Ensures student-produced answers are transparent and verifiable — helpful for homework checking and tutoring scenarios.",
    },
    {
      num: 4,
      title: "Retrieval & Context",
      desc: "Using knowledge bases, embeddings, and RAG patterns.",
      overview:
        "Teach how to ground LLM responses in external documents using embeddings and retrieval to avoid hallucination and provide evidence-backed answers. Covers chunking, vector similarity, reranking, and contamination risks.",
      objectives: [
        "Explain embeddings and nearest-neighbor retrieval at a conceptual level.",
        "Implement a retrieval-augmented pipeline: document ingestion → chunking → embedding → retrieval → prompt composition.",
        "Evaluate retrieval quality (precision, recall) and control context contamination.",
      ],
      lessons: [
        "Embeddings explained: vector space intuition and similarity metrics.",
        "Chunking strategies and metadata tagging for source attribution.",
        "Building a simple retrieval pipeline (local or hosted vector DB conceptually).",
        "Prompt composition patterns that include retrieved context while controlling token budgets.",
        "Reranking and filtering to remove low-relevance passages.",
        "Attribution & citation techniques to surface source excerpts.",
        "Contamination risks and how to avoid leaking test data into context.",
      ],
      activities:
        "Build a demo Q&A over a curated document set (e.g., course handbook + policies). Deliver a short video demo showing retrieval steps and why answers improved.",
      deliverable:
        "Code/recipe + sample queries, retrieved contexts, and correctness comparison vs baseline LLM-only responses.",
      tools:
        "Embedding libraries (conceptual), sample notebooks for vector search, reading on RAG best practices.",
      rubric: [
        "Retrieval relevance & precision — 40%",
        "Integration correctness — 30%",
        "Clarity of documentation & demo — 30%",
      ],
      prerequisites: "Modules 1–3 recommended.",
      parentValue:
        "Students learn to make the AI cite real materials — increasing trust and usefulness for parent/staff-facing tools.",
    },
    {
      num: 5,
      title: "API Workflows & Tooling",
      desc: "Calling APIs, function-calling, and embedding pipelines.",
      overview:
        "Practical instruction for calling model APIs, handling structured outputs, error handling, retries, rate-limits, and building small production-like workflows. Includes function-calling and schema validation techniques.",
      objectives: [
        "Implement reliable API calls and parse model outputs into structured formats.",
        "Handle API errors, rate limits, retries, and logging for reproducibility.",
        "Use function-calling or structured output prompts to integrate LLMs into apps or scripts.",
      ],
      lessons: [
        "API basics: authentication, request/response lifecycle, environment variables.",
        "Parsing outputs: strong parsing patterns for JSON, CSV, and delimited text.",
        "Error handling patterns: transient errors, exponential backoff, idempotency.",
        "Function-calling concepts and integrating external tools.",
        "Logging and observability for debugging prompt pipelines.",
        "Packaging a small script into a reusable CLI or web endpoint.",
      ],
      activities:
        "Build a small integration: LLM tags a batch of text → structured JSON output → written to a CSV/DB. Provide a runbook explaining environment variables and how to reproduce results.",
      deliverable:
        "GitHub repo containing code, sample inputs/outputs, and a runbook.",
      tools:
        "API docs (model provider), simple SDK examples, linting/checkstyle suggestions.",
      rubric: [
        "Working integration & reproducibility — 50%",
        "Robustness and error handling — 25%",
        "Documentation & security — 25%",
      ],
      prerequisites: "Basic scripting knowledge (Python/JS recommended) and Modules 1–3 concepts.",
      parentValue:
        "Students will be able to produce tools that generate structured, repeatable results for classroom or administrative use.",
    },
    {
      num: 6,
      title: "Evaluation & Debugging",
      desc: "Testing prompts, metrics, and iterative improvement.",
      overview:
        "Systematic methods for evaluating prompts and pipelines: metric definitions, test harnesses, A/B testing, human annotation, and debug workflows to iteratively improve outputs. Emphasizes scientific approach to prompt iteration.",
      objectives: [
        "Define and implement evaluation metrics for different tasks (accuracy, F1, BLEU-like, human-rated usefulness).",
        "Design A/B tests and interpret results with statistical thinking appropriate for small-sample educational pilots.",
        "Establish logging and reproducibility so bugs are traceable and fixes validated.",
      ],
      lessons: [
        "Choosing metrics aligned with task goals.",
        "Building test sets and gold-standard labels.",
        "Running controlled experiments and interpreting results.",
        "Human evaluation protocols and inter-rater reliability basics.",
        "Debugging prompt pipelines: isolation, reproduction, and fixes.",
        "Documentation & changelogs for iterative improvement.",
      ],
      activities:
        "Run an end-to-end experiment comparing two prompt designs on a 50–100 item test set; present results with simple statistical summaries and recommendations.",
      deliverable:
        "Experiment report, dataset, and recommended next-step plan.",
      tools:
        "Evaluation script templates, examples of human-eval forms, reading on small-sample experiment interpretation.",
      rubric: [
        "Experimental design quality — 40%",
        "Clarity and rigor of analysis — 40%",
        "Recommended improvements — 20%",
      ],
      prerequisites: "Modules 1–5.",
      parentValue:
        "Demonstrates that student work is measured and improved using data — tangible evidence of learning and reliability.",
    },
    {
      num: 7,
      title: "Safety, Bias & Guardrails",
      desc: "Content filters, fairness checks, and privacy.",
      overview:
        "Practical safety engineering for prompt-driven tools: bias awareness, content filtering, refusal patterns, human-in-the-loop decisions, and privacy best practices tailored for educational contexts (student data sensitivity).",
      objectives: [
        "Identify common sources of bias and risky outputs in LLMs and propose mitigation approaches.",
        "Implement filter layers and refusal logic that keep outputs appropriate for school/parent audiences.",
        "Design human escalation and audit trails for borderline cases and privacy incidents.",
      ],
      lessons: [
        "Safety taxonomy: hate, sexual, medical/legal, and privacy-related risks.",
        "Filter & refusal engineering: whitelist/blacklist, classifier pre-filters, and post-generation checks.",
        "Human-in-the-loop patterns: when and how to route to human review.",
        "Data handling for student information: minimization, masking, and retention policies.",
        "Testing safety: adversarial prompts and robustness checks.",
        "Building a simple incident report and response playbook.",
      ],
      activities:
        "Implement a moderation layer for a demo assistant and run adversarial prompt tests; submit a safety report describing prevented violations and residual risks.",
      deliverable:
        "Safety checklist, sample logs showing blocked content, and an incident response playbook.",
      tools:
        "Moderation API examples (conceptual), FERPA/GDPR overviews (plain-language), example safety policy templates.",
      rubric: [
        "Guardrail comprehensiveness — 40%",
        "Effectiveness in tests — 30%",
        "Clarity of incident playbook — 30%",
      ],
      prerequisites: "Modules 1–4 recommended.",
      parentValue:
        "Shows parents that student projects and tools are built with explicit safeguards and privacy-first design.",
    },
    {
      num: 8,
      title: "Practical Projects & Portfolio",
      desc: "Build a tutoring assistant, summarizer, or classroom tool.",
      overview:
        "End-to-end project work: scoping, engineering, testing, documenting, and presenting a portfolio-ready project that demonstrates mastery across prompt engineering skills. Emphasis on reproducibility, clear presentation, and measurable outcomes.",
      objectives: [
        "Scope a feasible project, select appropriate prompt patterns, and deliver a reproducible demo.",
        "Document design decisions, tests, and metrics showing impact.",
        "Present a professional demo (video + written README) that communicates value to non-technical stakeholders.",
      ],
      lessons: [
        "Project scoping, acceptance criteria, and milestone planning.",
        "Mid-sprint review: code, prompts, and test harness check.",
        "Iteration loop: evaluation, debugging, safety checks.",
        "Polishing deliverables: README, demo video, and presentation slides.",
        "Peer review & feedback incorporation.",
      ],
      activities:
        "Capstone: deliver a small assistant (tutor, summarizer, FAQ) with code, prompt library, test set, safety report, and a 3-minute demo video.",
      deliverable:
        "Public repo / hosted demo link + demo video and a one-page parent-facing summary.",
      tools: "Project templates, slide templates, demo checklist.",
      rubric: [
        "Functionality & correctness — 40%",
        "Safety & evaluation — 25%",
        "Documentation & presentation quality — 35%",
      ],
      prerequisites: "Completion of previous modules recommended.",
      parentValue:
        "Produces a showable product and measurable results parents can review (demo, tests, safety checks).",
    },
  ],

  // ══════════════════════════════════════════════════════════════════════════
  "website-development": [
    {
      num: 1,
      title: "Fundamentals",
      desc: "HTML, CSS, and core web principles.",
      overview:
        "Detailed coverage of semantic HTML, CSS fundamentals, box model, layout reasoning, accessibility basics, and developer tooling workflows. Students learn to build well-structured pages and reason about visual structure and accessibility.",
      objectives: [
        "Construct semantic HTML documents with appropriate landmarks and ARIA where needed.",
        "Apply CSS fundamentals including selectors, specificity, box model, and positioning.",
        "Use browser devtools to debug layout and accessibility issues.",
      ],
      lessons: [
        "Semantic HTML: headings, sections, nav, main, article, footer.",
        "Images & media: responsive images, alt text, and best practices.",
        "CSS selectors, cascade, specificity, and inheritance.",
        "Box model, margin collapsing, and layout debugging.",
        "Positioning (static, relative, absolute, fixed, sticky) and stacking contexts.",
        "Accessibility basics and keyboard navigation testing.",
        "Devtools deep dive: inspecting, live edits, and performance snapshots.",
      ],
      activities:
        "Build a multi-page site (Home, About, Contact) that meets an accessibility checklist and includes responsive images and semantic markup.",
      deliverable:
        "Hosted static site link (or ZIP) + accessibility checklist report.",
      tools: "MDN references, devtools cheatsheet, accessibility guidelines (WCAG overview).",
      rubric: [
        "Semantic markup — 35%",
        "Layout correctness & cross-browser sanity — 35%",
        "Accessibility items met — 30%",
      ],
      prerequisites: "None.",
      parentValue:
        "Students produce accessible, standards-compliant web pages suitable for public presentation.",
    },
    {
      num: 2,
      title: "Modern JavaScript",
      desc: "ES6+, DOM, and asynchronous patterns.",
      overview:
        "Modern JS language features (ES6+), event-driven programming, DOM APIs, asynchronous patterns, and fetching remote data with robust error handling. Students gain the ability to add interactive behavior and manage simple state.",
      objectives: [
        "Apply ES6+ syntax effectively (modules, arrow functions, destructuring, promises, async/await).",
        "Manipulate the DOM and implement robust event handling patterns (delegation, throttling/debouncing).",
        "Use fetch and handle errors/loading/caching concerns conceptually.",
      ],
      lessons: [
        "Modern syntax overview and module usage.",
        "DOM traversal, element creation, event listeners, and delegation.",
        "Asynchronous JS: Promises vs async/await — error handling best practices.",
        "Fetch API patterns, request headers, JSON handling.",
        "Local storage basics and persistence strategies for simple apps.",
        "Debugging JS: breakpoints, call stacks, and common pitfalls.",
      ],
      activities:
        "Build a dynamic todo app with add/edit/delete, local persistence, and fetch-based sample data.",
      deliverable:
        "GitHub repo with README, screenshots, and usage instructions.",
      tools: "JS reference guides, interactive code playgrounds.",
      rubric: [
        "Functionality & correctness — 50%",
        "Code clarity & structure — 25%",
        "Robustness & error handling — 25%",
      ],
      prerequisites: "Module 1 helpful but not required.",
      parentValue:
        "Students learn to make web pages interactive and build basic web applications.",
    },
    {
      num: 3,
      title: "React Basics",
      desc: "Components, props, state, and hooks.",
      overview:
        "Practical, hands-on introduction to React: components, props, state, hooks, lifting state, component composition, and best practices for readable components. Focus on building maintainable UI.",
      objectives: [
        "Create React components using functional components and hooks (useState, useEffect).",
        "Structure an app with component composition and prop-driven design.",
        "Manage side effects and lifecycle concerns using hooks.",
      ],
      lessons: [
        "JSX and functional component patterns.",
        "Props, state, and uni-directional data flow.",
        "useEffect and effect dependency reasoning.",
        "Component composition and prop drilling vs context.",
        "Forms and controlled components.",
        "Simple testing concepts and component debugging tips.",
      ],
      activities:
        "Build a React quiz/flashcard app with progress tracking and local persistence.",
      deliverable:
        "Live preview link (or local instructions) + repo and short demo video.",
      tools: "React docs excerpts, starter template.",
      rubric: [
        "Component design — 40%",
        "State management correctness — 30%",
        "UX polish and code readability — 30%",
      ],
      prerequisites: "Basic JS (Module 2 recommended).",
      parentValue:
        "Students will be able to build interactive, component-based applications that can scale into real projects.",
    },
    {
      num: 4,
      title: "Next.js & Routing",
      desc: "Server-side rendering, static pages, and API routes.",
      overview:
        "File-based routing, data fetching strategies (SSG/SSR/CSR), API routes, and deployment patterns using serverless-friendly approaches. Students learn when to use each rendering strategy and how to wire a front-end to small server endpoints.",
      objectives: [
        "Understand Next.js project structure and file-based routing.",
        "Implement static generation and server-side rendering patterns conceptually.",
        "Create simple API routes and connect front-end to back-end endpoints.",
      ],
      lessons: [
        "Next.js project setup and page routing fundamentals.",
        "Static generation (getStaticProps) and incremental static regeneration concepts.",
        "Server-side props (getServerSideProps) and use-cases.",
        "API routes: building lightweight endpoints for simple back-end features.",
        "Authentication patterns at a conceptual level (cookie vs token basics).",
        "Deployment considerations and environment variables.",
      ],
      activities:
        "Build a small blog with SSG for posts and an API route for comments or contact submission.",
      deliverable:
        "Deployed sample (or deployment instructions) + README.",
      tools: "Next.js examples and deployment docs.",
      rubric: [
        "Correct application of rendering strategy — 40%",
        "Functioning API route — 30%",
        "Deployment readiness — 30%",
      ],
      prerequisites: "React basics (Module 3 recommended).",
      parentValue:
        "Students learn modern web frameworks so their projects are fast and production-ready.",
    },
    {
      num: 5,
      title: "Styling & Responsive Design",
      desc: "CSS modules, flexbox/grid, mobile-first layouts.",
      overview:
        "Deep exploration of responsive patterns, layout systems (Flexbox, Grid), mobile-first design, typographic systems, and creating accessible visual hierarchies. Students learn to translate static mockups into responsive implementations.",
      objectives: [
        "Implement layouts with Flexbox and Grid for complex responsive patterns.",
        "Apply mobile-first techniques & media queries effectively.",
        "Create accessible typographic and spacing systems.",
      ],
      lessons: [
        "Flexbox fundamentals and common layout patterns.",
        "CSS Grid for multi-axis layouts and grid template usage.",
        "Media queries and responsive scaling patterns.",
        "Typography, spacing scale, and visual rhythm.",
        "Component-based styling strategies and utility systems.",
        "Accessibility in visual design: contrast, focus states, and readable type sizes.",
      ],
      activities:
        "Convert a desktop mockup into a responsive page covering small/medium/large breakpoints.",
      deliverable:
        "Live link/screenshots + code snippet explaining responsive choices.",
      tools: "Layout guides, sample mockups.",
      rubric: [
        "Responsiveness & fidelity — 40%",
        "Accessibility choices — 30%",
        "Code cleanliness — 30%",
      ],
      prerequisites: "Modules 1–4 recommended.",
      parentValue:
        "Students will produce web pages that work well for phones, tablets, and desktops — crucial for real-world usability.",
    },
    {
      num: 6,
      title: "State Management & Data Fetching",
      desc: "Contexts, SWR/React Query patterns.",
      overview:
        "Explore Context API patterns for app-level state, data-fetch lifecycles, caching strategies, optimistic updates, and handling loading/error states gracefully. Focus on building resilient UX.",
      objectives: [
        "Use Context to share state across components and understand alternatives for larger apps.",
        "Implement clean data-fetch lifecycles with caching and optimistic UI patterns.",
        "Handle loading/error states and build resilient user experiences.",
      ],
      lessons: [
        "Context & provider patterns: when and how to use them.",
        "Data fetching lifecycles and caching reasoning.",
        "Optimistic updates and rollback strategies.",
        "Error boundaries and graceful degradation patterns.",
        "Light-weight strategies for client-side caching and invalidation.",
      ],
      activities:
        "Build a dashboard that fetches data, shows loading/error states, and caches data between views.",
      deliverable:
        "Repo + short demo video showing caching/optimistic behavior.",
      tools: "Conceptual guides to SWR/React Query, Context examples.",
      rubric: [
        "Correctness of state flows — 40%",
        "UX resilience — 30%",
        "Code structure — 30%",
      ],
      prerequisites: "React basics (Module 3).",
      parentValue: "Students learn to build apps that feel fast and robust to users.",
    },
    {
      num: 7,
      title: "Backend Essentials",
      desc: "Simple REST APIs, authentication, and databases.",
      overview:
        "Build simple RESTful APIs, basic authentication patterns (token/session concepts), data modeling and lightweight persistence, and connecting front-end to back-end with secure practices. Emphasis on minimal viable back-ends for student projects.",
      objectives: [
        "Design simple REST endpoints and practice request/response formatting.",
        "Implement basic authentication and secure key handling at a conceptual level.",
        "Connect front-end apps to back-end endpoints and implement CRUD flows.",
      ],
      lessons: [
        "REST fundamentals, routes, status codes, and JSON responses.",
        "Simple data modeling and in-memory persistence vs lightweight DBs.",
        "Authentication concepts: cookies, tokens, and basic session flows.",
        "Secure storage of secrets (env vars) and basics of HTTPS.",
        "API testing with Postman or similar tools and endpoint validation.",
      ],
      activities:
        "Create a small CRUD API and consume it from the front-end (e.g., create/edit/delete posts or tasks).",
      deliverable:
        "API repo with README + Postman collection and sample responses.",
      tools: "Express/Next.js API route examples, Postman tutorial.",
      rubric: [
        "Endpoint correctness — 40%",
        "Security awareness — 30%",
        "Integration completeness — 30%",
      ],
      prerequisites: "JavaScript fundamentals and Modules 1–5.",
      parentValue:
        "Students will be able to build simple but real features that persist data and can power classroom apps.",
    },
    {
      num: 8,
      title: "Deployment & DevOps",
      desc: "Hosting, CI/CD, performance, and accessibility best practices.",
      overview:
        "Practical deployment choices (Vercel/Netlify/simple VPS), CI basics, performance optimization (images, caching), analytics and simple monitoring, plus accessibility and SEO checks for production quality.",
      objectives: [
        "Deploy static and serverless apps using modern hosting services and set up a basic CI pipeline.",
        "Optimize critical performance paths and run accessibility/performance audits.",
        "Configure minimal monitoring/alerts suitable for student projects.",
      ],
      lessons: [
        "Hosting options and choosing the right one for a project.",
        "CI basics: GitHub Actions or equivalent for automated builds and deploys.",
        "Performance optimizations: images, caching, and network considerations.",
        "Accessibility & SEO checks using Lighthouse and manual audits.",
        "Basic monitoring: logs, uptime checks, and lightweight alerts.",
      ],
      activities:
        "Deploy capstone site and include CI config + Lighthouse report with improvement plan.",
      deliverable:
        "Live site link + CI pipeline config + audit report.",
      tools: "Hosting docs, Lighthouse guide, CI examples.",
      rubric: [
        "Successful deployment & CI — 50%",
        "Audit improvements — 30%",
        "Documentation — 20%",
      ],
      prerequisites: "Prior modules completed (especially Module 4).",
      parentValue:
        "Students will ship projects that are live and discoverable — a tangible output parents can visit.",
    },
    {
      num: 9,
      title: "Capstone Website",
      desc: "Design, build, and present a live portfolio or product site.",
      overview:
        "End-to-end project requiring project management, implementation, testing, deployment, and presentation. Students produce a public-facing portfolio or product site with polished UX and documentation.",
      objectives: [
        "Plan and execute an end-to-end web project with front-end, back-end, and deployment.",
        "Demonstrate accessibility, performance, and code quality practices.",
        "Present the project clearly to non-technical stakeholders.",
      ],
      lessons: [
        "Project planning and milestone setup.",
        "Mid-sprint technical reviews and acceptance criteria checks.",
        "Polishing UX, accessibility, and performance.",
        "Final deployment, documentation, and presentation prep.",
        "Peer demos and feedback incorporation.",
      ],
      activities:
        "Deliver a live site, repo with clear README, demo video, and a short parent-facing one-pager describing the project's value.",
      deliverable:
        "Public repo + live URL + demo video + one-page summary.",
      tools: "Project templates and deployment checklist.",
      rubric: [
        "Project completeness & UX — 40%",
        "Accessibility & performance — 30%",
        "Presentation & documentation — 30%",
      ],
      prerequisites: "All previous modules recommended.",
      parentValue:
        "A finished website parents can visit and evaluate — clear evidence of student capability.",
    },
  ],

  // ══════════════════════════════════════════════════════════════════════════
  "ai-automation": [
    {
      num: 1,
      title: "Automation Principles",
      desc: "When to automate, ROI, and workflow mapping.",
      overview:
        "How to discover automation opportunities, map processes, compute ROI, and set measurable acceptance criteria. Students learn stakeholder analysis and how to scope meaningful automations.",
      objectives: [
        "Map an existing routine process and compute a simple ROI for automating it.",
        "Define success criteria and KPIs for automated flows (time saved, error rates).",
        "Produce a prioritized automation backlog based on impact and feasibility.",
      ],
      lessons: [
        "Process discovery: interviewing stakeholders and flow mapping.",
        "Automation types: event-driven, scheduled, and on-demand patterns.",
        "Simple ROI modeling and cost-benefit reasoning.",
        "Acceptance criteria and KPIs for pilots.",
        "Creating a lightweight project plan for implementation.",
      ],
      activities:
        "Deliver an automation proposal for a school administrative task (flowchart + ROI estimate + acceptance criteria).",
      deliverable:
        "Proposal PDF and short slide deck for stakeholders.",
      tools: "Process mapping templates, ROI calculator spreadsheet.",
      rubric: [
        "Clarity of mapping — 40%",
        "Realism of ROI estimate — 30%",
        "Feasibility & stakeholder alignment — 30%",
      ],
      prerequisites: "None.",
      parentValue:
        "Ensures students think in terms of real-world impact, not just technology for its own sake.",
    },
    {
      num: 2,
      title: "Data & Integration Basics",
      desc: "APIs, webhooks, and common data formats.",
      overview:
        "Practical skills for parsing and moving data across systems: JSON/CSV handling, webhook handling, authentication basics, and validation/transform patterns.",
      objectives: [
        "Parse and transform common data formats reliably.",
        "Implement a webhook listener and validate incoming payloads.",
        "Understand API auth patterns and how to protect credentials.",
      ],
      lessons: [
        "JSON and CSV parsing patterns and pitfalls.",
        "APIs basics: methods, status codes, and endpoints.",
        "Webhook mechanics: receiving, validating, and responding to events.",
        "Authentication overview: API keys vs OAuth (conceptual).",
        "Data validation and sanitization best practices.",
      ],
      activities:
        "Build a webhook listener that logs events to a Google Sheet or CSV and validates payloads.",
      deliverable:
        "Repo + runbook showing how to test with sample payloads.",
      tools: "Postman, webhook test services, sample payloads.",
      rubric: [
        "Correct parsing/validation — 50%",
        "Secure credential handling — 25%",
        "Documentation & reproducibility — 25%",
      ],
      prerequisites: "Basic scripting familiarity.",
      parentValue:
        "Students can reliably move and validate data between systems — the backbone of real automations.",
    },
    {
      num: 3,
      title: "No-code/Low-code Tools",
      desc: "Practical use of automation platforms and connectors.",
      overview:
        "Teach when to use no-code tools, how to design flows using connectors, error handling inside visual flows, and how to transition to code when required. Includes best-practices for maintainable low-code flows.",
      objectives: [
        "Build reliable flows in no-code environments (mapping, error handling, retries).",
        "Understand maintainability and credentials management in no-code tools.",
        "Decide when a solution should migrate to custom code.",
      ],
      lessons: [
        "Platform walkthrough and connector logic.",
        "Field mapping patterns and transformation strategies.",
        "Error handling: retries, notifications, and dead-letter patterns.",
        "Security considerations: secret storage and credential rotation.",
        "Transition planning for custom code.",
      ],
      activities:
        "Build a multi-step no-code automation: form submission → validation → email + spreadsheet update + Slack notification.",
      deliverable:
        "Flow export / screenshots + runbook on error scenarios.",
      tools: "Conceptual guides to popular no-code platforms (Zapier/Make conceptual docs).",
      rubric: [
        "Flow correctness & resilience — 50%",
        "Security & maintainability considerations — 30%",
        "Documentation — 20%",
      ],
      prerequisites: "Modules 1–2 recommended.",
      parentValue:
        "Allows students to prototype automations quickly that produce visible value.",
    },
    {
      num: 4,
      title: "Orchestrating Multi-step Workflows",
      desc: "Queues, retries, and scheduling.",
      overview:
        "Design durable and fault-tolerant multi-step automation: idempotency, retries, scheduling, long-running tasks, and human approval steps. Emphasizes design patterns that avoid duplicate work and data loss.",
      objectives: [
        "Design workflows that tolerate transient failures and avoid duplicate processing.",
        "Use idempotency keys and checkpointing to support safe retries.",
        "Model long-running processes with human approvals and timeout handling.",
      ],
      lessons: [
        "Durable architecture patterns and idempotency basics.",
        "Retry/backoff strategies and exponential backoff design.",
        "Scheduling and cron-like patterns.",
        "Long-running tasks and checkpointing approaches.",
        "Human-in-the-loop approval steps and notification patterns.",
      ],
      activities:
        "Design and prototype a resilient file-processing workflow with deduplication and retry policies.",
      deliverable:
        "Architecture diagram, sample code/snippets, test results demonstrating resilience.",
      tools: "Diagrams of durable workflows, sample code for idempotency keys.",
      rubric: [
        "Resilience & correctness of design — 50%",
        "Clarity of diagrams & runbook — 30%",
        "Test reproducibility — 20%",
      ],
      prerequisites: "Modules 1–3 recommended.",
      parentValue:
        "Students deliver automations that are realistic for production use, not fragile prototypes.",
    },
    {
      num: 5,
      title: "AI in Automation",
      desc: "Applying LLMs and vision models to tasks.",
      overview:
        "Applying LLMs and vision models inside automation flows: classification, summarization, routing, and extraction. Covers verification, confidence thresholds, and fallback logic to avoid costly errors.",
      objectives: [
        "Identify automation steps where AI adds value vs where deterministic logic is preferred.",
        "Integrate model calls into flows with confidence scoring and fallback paths.",
        "Design verification steps and human escalation for model outputs.",
      ],
      lessons: [
        "Use-case mapping: classification, summarization, extraction.",
        "Confidence & thresholds: when to accept vs escalate.",
        "Combining deterministic rules with model outputs.",
        "Logging & audit trails for model decisions.",
        "Cost considerations and rate-limit management.",
      ],
      activities:
        "Build an email triage automation using an LLM to classify and route messages with a fallback human review queue.",
      deliverable:
        "Demo flow, sample dataset, and evaluation report (precision/recall + false positive analysis).",
      tools: "Model API examples (conceptual), decision threshold guides.",
      rubric: [
        "Correctness of classification/routing — 40%",
        "Fallback & verification design — 30%",
        "Cost-awareness & documentation — 30%",
      ],
      prerequisites: "Modules 1–4 recommended.",
      parentValue:
        "Shows how AI can reduce manual workload while keeping humans in control when needed.",
    },
    {
      num: 6,
      title: "Monitoring & Reliability",
      desc: "Logging, alerting, and testing automated flows.",
      overview:
        "Observability for automations: logging, alerting, KPIs, postmortems, and incremental improvement cycles. Students learn what to monitor and how to respond to incidents.",
      objectives: [
        "Identify key metrics to observe (success rate, processing latency, error types).",
        "Implement basic logging and alerting for automation flows.",
        "Run a structured postmortem and produce a remediation plan.",
      ],
      lessons: [
        "Defining SLAs and SLOs suitable for student projects.",
        "Instrumentation: logs, structured events, and trace IDs.",
        "Alerts: thresholds and notification routing.",
        "Postmortem framework and root-cause analysis basics.",
        "Continuous improvement: metrics-driven changes and small experiments.",
      ],
      activities:
        "Instrument a demo flow with logs & error alerts; simulate an incident and produce a postmortem.",
      deliverable:
        "Logs sample, alert config, and postmortem document.",
      tools: "Logging format guides and postmortem templates.",
      rubric: [
        "Instrumentation completeness — 40%",
        "Quality of postmortem — 40%",
        "Improvement plan feasibility — 20%",
      ],
      prerequisites: "Prior modules recommended.",
      parentValue:
        "Ensures automations are not only built but also observed and maintained — reducing surprises.",
    },
    {
      num: 7,
      title: "Security & Compliance",
      desc: "Data handling, access control, and privacy.",
      overview:
        "Practical security hygiene and compliance basics relevant for school data: data minimization, credential storage, encryption basics, access controls, and conceptual FERPA/GDPR considerations.",
      objectives: [
        "Apply basic security practices: secret management, least privilege, and encrypted transport.",
        "Understand key compliance concepts relevant to student data and build mitigation strategies.",
        "Create access controls and audit-friendly logs for sensitive flows.",
      ],
      lessons: [
        "Secrets & credentials: env var best practices and rotation basics.",
        "Data minimization and masking strategies for personal data.",
        "Encryption in transit and at rest (high level).",
        "Access control and role-based permissions conceptually.",
        "Compliance overview: FERPA/GDPR concepts and school policies.",
      ],
      activities:
        "Produce a security checklist for a given automation and implement a secrets-handling demo.",
      deliverable:
        "Security checklist + sample logs showing masked PII.",
      tools: "Security checklist templates and plain-language compliance primers.",
      rubric: [
        "Security hygiene completeness — 50%",
        "Clarity of documentation — 30%",
        "Compliance awareness — 20%",
      ],
      prerequisites: "Basic scripting knowledge.",
      parentValue:
        "Parents can see explicit safeguards for student data built into projects.",
    },
    {
      num: 8,
      title: "Real-world Projects",
      desc: "Automate reporting, email triage, or student progress tracking.",
      overview:
        "End-to-end automation projects where students plan, implement, monitor, and present a working automation that demonstrates measurable impact (time saved, errors reduced, or visibility improved).",
      objectives: [
        "Deliver a fully documented automation with measurable KPIs.",
        "Communicate project results to stakeholders via a short report and demo.",
        "Build a maintenance plan and handover documentation.",
      ],
      lessons: [
        "Project kickoff: stakeholder interviews and success metrics.",
        "Implementation sprints with mid-sprint checks.",
        "Testing, monitoring setup, and pilot rollout.",
        "Collecting metrics and analyzing pilot results.",
        "Final presentation and handover package.",
      ],
      activities:
        "Capstone automation with live demo, results dashboard, and one-page impact summary.",
      deliverable:
        "Repo, runbook, demo video, and impact report (before vs after metrics).",
      tools: "Project templates and KPI examples.",
      rubric: [
        "Measurable impact & function — 45%",
        "Documentation & maintainability — 30%",
        "Presentation & stakeholder clarity — 25%",
      ],
      prerequisites: "Most prior modules recommended.",
      parentValue:
        "Tangible outcomes that show how student work improves real workflows — easy for parents/staff to understand the benefit.",
    },
  ],

  // ══════════════════════════════════════════════════════════════════════════
  "ai-chatbot": [
    {
      num: 1,
      title: "Conversation Design",
      desc: "Intents, slots, dialogue flows, and UX principles.",
      overview:
        "Principles of conversational UX: intents, entities, dialogue flows, fallback strategies, persona and tone, and designing for discoverability and brevity. Students learn to script and test dialogue trees and mapping to prompts.",
      objectives: [
        "Create intent taxonomies and map sample utterances to intents.",
        "Design dialogue flows including happy-path, edge-cases, and fallback paths.",
        "Define persona and tone specifications appropriate for parent/student audiences.",
      ],
      lessons: [
        "Intent discovery and example utterance collection.",
        "Dialogue flow notation and mapping (state diagrams).",
        "Slot filling and entity extraction patterns.",
        "Persona specification and consistent voice control.",
        "Fallbacks, clarifying questions, and graceful failures.",
      ],
      activities:
        "Deliver a dialogue flow (diagram + sample transcripts) for a parent-helpdesk bot covering top 10 intents.",
      deliverable:
        "Flow diagram, sample conversation transcripts, and persona spec.",
      tools: "Dialogue mapping templates, UX reading on conversational design.",
      rubric: [
        "Completeness of intent coverage — 35%",
        "Clarity of flows — 35%",
        "Persona & tone appropriateness — 30%",
      ],
      prerequisites: "None.",
      parentValue:
        "Ensures any built chatbot is predictable, helpful, and aligned to parental expectations.",
    },
    {
      num: 2,
      title: "Bot Architecture",
      desc: "Stateless vs. stateful bots, memory strategies.",
      overview:
        "Stateless vs stateful designs, memory strategies, session management, tradeoffs in complexity vs maintainability, and when to persist conversation state.",
      objectives: [
        "Choose appropriate architecture for a use-case (stateless vs stateful).",
        "Implement basic session management patterns and short-term memory strategies.",
        "Evaluate complexity tradeoffs and plan for maintainability.",
      ],
      lessons: [
        "Stateless vs stateful: pros and cons.",
        "Session stores and memory duration decisions.",
        "Memory pruning and storage costs.",
        "Consistency and concurrency considerations.",
        "Logging conversations while preserving privacy.",
      ],
      activities:
        "Prototype a demo bot architecture diagram and implement a simple session store for a sample bot.",
      deliverable: "Architecture doc + sample session store demo.",
      tools: "Architecture pattern examples, privacy-focused logging guides.",
      rubric: [
        "Architectural soundness — 40%",
        "Privacy-aware logging — 30%",
        "Implementation demo — 30%",
      ],
      prerequisites: "Basic programming & Module 1.",
      parentValue:
        "Data and session handling is designed to protect privacy and create consistent experiences.",
    },
    {
      num: 3,
      title: "Building with Platforms",
      desc: "ChatGPT custom GPTs, Rasa, or Dialogflow basics.",
      overview:
        "How to prototype bots on platforms (conceptual coverage of platform features), using function-calling / tool invocation, multimodal inputs, and lifecycle of deployment on hosted platforms.",
      objectives: [
        "Prototype a bot on a chosen platform and leverage platform features responsibly.",
        "Use function-calling patterns to safely connect external APIs.",
        "Package a bot for easy deployment and iteration.",
      ],
      lessons: [
        "Platform feature survey and choosing the right one for the use-case.",
        "Function-calling patterns and safe API invocation.",
        "Multimodal inputs: attachments, images, and file handling.",
        "Deployment lifecycle and environment considerations.",
        "Rollout strategies and versioning.",
      ],
      activities:
        "Build a prototype FAQ bot and implement one function-call integration (e.g., calendar lookup or simple DB query).",
      deliverable:
        "Prototype link (or local instructions) + integration README.",
      tools: "Platform docs (conceptual), function-calling examples.",
      rubric: [
        "Prototype functionality — 40%",
        "Safe integration — 30%",
        "Documentation & deployability — 30%",
      ],
      prerequisites: "Modules 1–2 recommended.",
      parentValue:
        "Rapid prototypes that can be shown to parents/staff for early feedback.",
    },
    {
      num: 4,
      title: "Integrations",
      desc: "Slack, MS Teams, WhatsApp, and website embedding.",
      overview:
        "Connecting chatbots to external channels (website widget, Slack, Teams), handling attachments and user metadata, webhook patterns, and secure channel configuration.",
      objectives: [
        "Integrate a bot with at least one external channel and handle attachments and metadata.",
        "Use webhooks and secure auth for channel connections.",
        "Ensure conversational continuity across channels where possible.",
      ],
      lessons: [
        "Channel integration basics and authentication patterns.",
        "Handling attachments, images, and files in conversations.",
        "User metadata and personalization considerations.",
        "Channel-specific UX adjustments (e.g., Slack vs web).",
        "Webhook security and retries.",
      ],
      activities:
        "Embed a bot widget on a demo site or connect to Slack with basic message handling and attachments.",
      deliverable: "Integration demo + instructions for replication.",
      tools: "Channel integration guides and webhook test tools.",
      rubric: [
        "Integration completeness — 40%",
        "Secure auth handling — 30%",
        "UX adaptation — 30%",
      ],
      prerequisites: "Prior modules recommended.",
      parentValue:
        "Parents can interact with bots through familiar channels (website or messaging apps).",
    },
    {
      num: 5,
      title: "Rich Responses & Tools",
      desc: "Buttons, cards, file handling, and function-calling.",
      overview:
        "Design and implement rich responses (buttons, cards, carousels), quick replies, and file handling; safe tool invocation (calendars, bookable slots) and graceful fallbacks for unsupported clients.",
      objectives: [
        "Create rich response templates and map fallback flows for plain-text clients.",
        "Integrate simple tooling (calendar, booking) via function-calls or API wrappers.",
        "Ensure graceful degradation and accessible fallbacks.",
      ],
      lessons: [
        "Rich response components and accessibility considerations.",
        "Quick replies and UX patterns for faster completion.",
        "Tool integrations: calendar lookup, appointment booking patterns.",
        "Fallback handling and client differences.",
        "Testing rich responses across channels.",
      ],
      activities:
        "Implement a 'book appointment' flow with calendar integration and card-based confirmations.",
      deliverable:
        "Demo flow and test cases for fallback scenarios.",
      tools: "UI card examples and calendar API docs (conceptual).",
      rubric: [
        "UX completeness & accessibility — 40%",
        "Successful integration & fallback handling — 40%",
        "Documentation — 20%",
      ],
      prerequisites: "Modules 1–4.",
      parentValue:
        "Produces useful, actionable chat experiences (e.g., booking conferences with teachers).",
    },
    {
      num: 6,
      title: "Testing & Analytics",
      desc: "Conversation testing, metrics, and improvement cycles.",
      overview:
        "Conversation testing methodologies, logging and analytics (completion rate, escalation rate), user testing and iteration loops. Students learn to measure and improve bots based on real usage signals.",
      objectives: [
        "Design conversation tests and implement analytics tracking for key metrics.",
        "Run small pilots and analyze conversation logs to prioritize improvements.",
        "Create iteration cycles based on measured data and user feedback.",
      ],
      lessons: [
        "Conversation testing frameworks and synthetic tests.",
        "Logging heuristics: what to capture and how to anonymize.",
        "Analytics dashboards: essential metrics and KPIs.",
        "Running pilots and qualitative user testing.",
        "Iteration planning and change rollout.",
      ],
      activities:
        "Launch a 10-user pilot, collect logs & feedback, produce a prioritized improvement backlog and analytics summary.",
      deliverable: "Pilot report + prioritized roadmap.",
      tools: "Analytics templates and test plan examples.",
      rubric: [
        "Pilot execution & data quality — 40%",
        "Analysis insightfulness — 40%",
        "Proposed roadmap — 20%",
      ],
      prerequisites: "Modules 1–5.",
      parentValue:
        "Shows parents that bots are tested with real users and improved based on data.",
    },
    {
      num: 7,
      title: "Safety & Moderation",
      desc: "Filtering, fallback flows, and escalation to humans.",
      overview:
        "Safety engineering for chatbots: content moderation, escalation to humans, privacy-preserving logging, and transparent refusals. Emphasis on policy + technical controls.",
      objectives: [
        "Implement moderation pipelines and escalation thresholds.",
        "Design privacy-preserving logs that support audits without exposing PII.",
        "Write clear refusal messages and handoff flows for complex/unsafe requests.",
      ],
      lessons: [
        "Moderation strategies and classifier-based pre-filters.",
        "Escalation thresholds and human review queue design.",
        "Privacy-preserving logging and redaction patterns.",
        "Tone and wording for refusals and safe messaging.",
        "Testing moderation with adversarial examples.",
      ],
      activities:
        "Add a moderation layer to a demo chatbot and simulate adversarial inputs; produce a moderation effectiveness report.",
      deliverable:
        "Moderation report and sample logs with redaction.",
      tools: "Moderation API examples (conceptual) and policy templates.",
      rubric: [
        "Moderation coverage — 40%",
        "Escalation & human-in-the-loop design — 30%",
        "Privacy-preserving logging — 30%",
      ],
      prerequisites: "Modules 1–5.",
      parentValue:
        "Ensures chatbots remain safe and escalate appropriately — a key parental concern.",
    },
    {
      num: 8,
      title: "Capstone Chatbot",
      desc: "Deploy a parent/teacher assistant or course helpdesk bot.",
      overview:
        "Full build, deploy, and present cycle for a meaningful chatbot (parent/teacher assistant, course helpdesk). Includes documentation, pilot, and metrics collection.",
      objectives: [
        "Plan and deliver a production-like chatbot with integrations, safety controls, and analytics.",
        "Present findings and usage metrics to stakeholders.",
        "Document maintenance and extension pathways.",
      ],
      lessons: [
        "Project planning and stakeholder interviews.",
        "Mid-project review and safety checks.",
        "Pilot rollout and analytics collection.",
        "Final polish and presentation prep.",
      ],
      activities:
        "Deliver a deployed chatbot (or hosted prototype), demo video, pilot metrics report, and a parent-facing FAQ explaining capabilities and limitations.",
      deliverable:
        "Repo/demo + pilot report + FAQ & maintenance notes.",
      tools: "Project templates.",
      rubric: [
        "Functionality & usability — 40%",
        "Safety & monitoring — 30%",
        "Documentation & stakeholder communication — 30%",
      ],
      prerequisites: "All prior chatbot modules.",
      parentValue:
        "A deployed bot parents can interact with or test — a clear demonstration of learned skills.",
    },
  ],

  // ══════════════════════════════════════════════════════════════════════════
  "ai-video-creation": [
    {
      num: 1,
      title: "Story & Script Fundamentals",
      desc: "Storyboarding and writing for short video.",
      overview:
        "Storytelling essentials for short-form educational video: structuring arguments, storyboarding frames and shots, audience-first scriptwriting, and pacing for retention. Emphasizes learning goals and measurable comprehension outcomes.",
      objectives: [
        "Write concise scripts aligned to learning objectives and edit for clarity and pacing.",
        "Produce storyboards mapping script to shots and on-screen captions.",
        "Design micro-learning segments that optimize information retention.",
      ],
      lessons: [
        "Audience analysis and learning-goal alignment.",
        "Scriptwriting techniques for clarity and engagement.",
        "Storyboarding basics and shot listing.",
        "Pacing, rhythm, and attention management techniques (hooks, recaps).",
        "Captioning and accessibility-for-video basics.",
      ],
      activities:
        "Produce a script + storyboard for a 60–90s lesson including shot list and caption script.",
      deliverable:
        "Script PDF + storyboard images or annotated slides.",
      tools: "Storyboard templates, script examples from educational content.",
      rubric: [
        "Clarity of learning goals — 30%",
        "Script quality/pacing — 35%",
        "Storyboard completeness — 35%",
      ],
      prerequisites: "None.",
      parentValue:
        "Produces lesson-ready scripts and storyboards parents can review for educational quality.",
    },
    {
      num: 2,
      title: "Generative Video Tools",
      desc: "Text-to-video, image-to-video, and prompt techniques.",
      overview:
        "Survey of text-to-video and image-to-video tools, prompt techniques for consistent visual style, understanding limitations, and legal/ethical considerations for generated media.",
      objectives: [
        "Use generative tools to produce short clips and iterate prompts to refine style and motion.",
        "Understand legal/ethical constraints for generated media (copyright, image-of-persons).",
        "Combine generated clips with authored content for cohesive videos.",
      ],
      lessons: [
        "Tool survey and capability overview.",
        "Prompt engineering for visual style and motion.",
        "Combining generated assets with live-recorded footage.",
        "Addressing artifacts, quality limitations, and post-generation fixes.",
        "Legal/ethical considerations and consent.",
      ],
      activities:
        "Produce a 10–30s AI-assisted clip and document prompt versions & iterations.",
      deliverable:
        "Clip + prompt history and short reflection on limitations.",
      tools: "Generative tool docs (conceptual), legal primer on generated media.",
      rubric: [
        "Visual coherence & prompt documentation — 40%",
        "Ethical considerations demonstrated — 30%",
        "Iteration evidence — 30%",
      ],
      prerequisites: "Module 1 recommended.",
      parentValue:
        "Enables students to prototype short educational videos with modern tools while respecting ethical boundaries.",
    },
    {
      num: 3,
      title: "Motion & Animation Basics",
      desc: "Keyframes, easing, and simple 2D/3D concepts.",
      overview:
        "Fundamental animation principles (keyframes, easing), simple 2D animation techniques, motion design patterns for learning (attention guidance), and integrating motion to reinforce concepts rather than distract.",
      objectives: [
        "Create basic animations using keyframes and easing for clear visual communication.",
        "Use motion to clarify rather than obscure learning points (transitions, emphasis).",
        "Export animations with production-ready settings.",
      ],
      lessons: [
        "Principles of motion: easing, squash & stretch (conceptual), timing.",
        "Keyframing workflow and interpolation basics.",
        "Motion graphics for text and explainer elements.",
        "Export settings and file formats for web/video.",
        "Accessibility considerations for motion (reducing motion options).",
      ],
      activities:
        "Animate a short explainer scene (e.g., illustrating a science concept) with motion that clarifies process steps.",
      deliverable:
        "Animated clip + before/after explanation of how motion aids learning.",
      tools: "Animation concept primers and simple animation tool guides.",
      rubric: [
        "Clarity of motion for learning — 40%",
        "Technical correctness/export — 30%",
        "Accessibility considerations — 30%",
      ],
      prerequisites: "Modules 1–2 recommended.",
      parentValue:
        "Demonstrates intentional use of motion to support understanding, not just decoration.",
    },
    {
      num: 4,
      title: "Audio & Voice",
      desc: "Text-to-speech, voiceover recording and mixing.",
      overview:
        "Script-to-voice pipeline: recording/selection of voice talent vs TTS, pacing and intonation, basic audio editing and mixing, background music selection and levels, and caption synchronization.",
      objectives: [
        "Produce clean voice recordings or high-quality TTS voiceovers and mix with background audio.",
        "Apply pacing and emphasis appropriate for instructional clarity.",
        "Sync captions and ensure intelligibility at different listening conditions.",
      ],
      lessons: [
        "Voice selection: human vs TTS tradeoffs.",
        "Recording environment and microphone basics.",
        "Basic audio editing and noise reduction.",
        "Mixing background music and voice clarity considerations.",
        "Caption creation and alignment with audio.",
      ],
      activities:
        "Produce a voiceover track (human recording or TTS) and mix it with background music for a short script. Provide caption file.",
      deliverable:
        "Audio file + caption file + notes on mixing choices.",
      tools: "TTS services (conceptual) and audio-editing primer.",
      rubric: [
        "Intelligibility & pacing — 40%",
        "Technical audio quality — 30%",
        "Caption accuracy — 30%",
      ],
      prerequisites: "Modules 1–3 recommended.",
      parentValue:
        "Ensures videos are clear, accessible, and professional-sounding.",
    },
    {
      num: 5,
      title: "Editing & Postproduction",
      desc: "Cuts, transitions, color correction, and captions.",
      overview:
        "Editing workflows: cuts, transitions, color correction basics, captions, export settings, and preparing video for different platforms. Focus on accessible exports and small-scale workflows students can reproduce.",
      objectives: [
        "Edit clips into coherent sequences with polished transitions and captions.",
        "Apply basic color correction and export settings for web delivery.",
        "Prepare accessible exports (captions, metadata).",
      ],
      lessons: [
        "Non-linear editing basics and timeline management.",
        "Cutting for clarity and pacing.",
        "Transitions, overlays, and intro/outro templates.",
        "Color correction basics and consistent looks.",
        "Export settings and platform considerations.",
      ],
      activities:
        "Edit generated clips and recorded voiceover into a 60s lesson with captions and branded intro/outro.",
      deliverable:
        "Final video file + source project and export presets.",
      tools: "Editing tool primer and export guidelines.",
      rubric: [
        "Story coherence & pacing — 40%",
        "Technical export correctness — 30%",
        "Caption accessibility — 30%",
      ],
      prerequisites: "Modules 1–4 recommended.",
      parentValue:
        "Students deliver polished videos ready for classroom or website use.",
    },
    {
      num: 6,
      title: "Visual Effects & Motion Graphics",
      desc: "Overlays, lower thirds, and animations.",
      overview:
        "Creating overlays, lower-thirds, simple VFX, and branded motion templates. Students learn when effects enhance comprehension and when they distract.",
      objectives: [
        "Design motion graphics that support branding and learning (lower-thirds, callouts).",
        "Apply simple VFX for emphasis (highlighting text or diagrams).",
        "Create reusable motion templates for consistent production.",
      ],
      lessons: [
        "Branding in motion: templates and consistency.",
        "Lower-thirds, callouts, and annotation overlays.",
        "Simple VFX techniques (glows, masks for emphasis).",
        "Exporting templates and reusing assets.",
        "When effects help vs when to simplify for clarity.",
      ],
      activities:
        "Create a branded intro/outro and a set of lower-thirds for course video templates.",
      deliverable:
        "Template files + demo render showing templates in use.",
      tools: "Motion template guides and VFX primers.",
      rubric: [
        "Template usefulness & reusability — 40%",
        "Clarity & non-distraction — 30%",
        "Technical correctness — 30%",
      ],
      prerequisites: "Modules 1–5.",
      parentValue:
        "Maintains a consistent, professional look for course videos.",
    },
    {
      num: 7,
      title: "Optimization & Publishing",
      desc: "Formats, platform requirements, and SEO for video.",
      overview:
        "Strategy for selecting the right formats, thumbnails, video metadata, SEO basics, platform-specific tips (YouTube, school LMS), and measuring engagement metrics to iterate.",
      objectives: [
        "Choose appropriate formats and export presets for target platforms.",
        "Create thumbnails and metadata that improve discoverability.",
        "Measure and interpret first-order engagement metrics (views, watch-time, retention).",
      ],
      lessons: [
        "Format selection and export presets for web and social platforms.",
        "Thumbnail design and metadata best practices.",
        "Publishing pipelines for LMS vs YouTube.",
        "Key metrics to monitor and basic analysis.",
        "Iteration based on viewer data.",
      ],
      activities:
        "Publish a capstone video to a target platform and produce a short analysis of first-week engagement metrics and a plan to iterate.",
      deliverable:
        "Published link + metrics report + iteration plan.",
      tools: "Platform publishing guides and thumbnail best-practice checklists.",
      rubric: [
        "Quality of publish — 40%",
        "Metrics analysis — 30%",
        "Iteration plan — 30%",
      ],
      prerequisites: "Prior modules.",
      parentValue:
        "Ensures student videos are published correctly and have measurable reach.",
    },
    {
      num: 8,
      title: "Portfolio Project",
      desc: "Produce and publish a short promotional or educational video.",
      overview:
        "End-to-end production of a polished educational or promotional video suitable for a portfolio: planning, production, postproduction, publishing, and reflection on learning & impact.",
      objectives: [
        "Deliver a publish-ready video with supporting documentation and a reflective report on production decisions and learning outcomes.",
        "Demonstrate the ability to design for learning and measure initial engagement.",
      ],
      lessons: [
        "Project planning and storyboard finalization.",
        "Production sprint: generate or capture assets and voiceover.",
        "Postproduction: edit, mix, and finalize captions.",
        "Publish and collect metrics; reflect and plan iteration.",
      ],
      activities:
        "Final video + hosted link, project repo, demo video walkthrough, and a reflective report on design decisions and metrics.",
      deliverable:
        "Portfolio-ready package suitable for sharing with parents/employers.",
      tools: "Project templates and portfolio guidelines.",
      rubric: [
        "Final video quality & learning alignment — 45%",
        "Documentation & reflectiveness — 25%",
        "Metrics & iteration plan — 30%",
      ],
      prerequisites: "All prior modules recommended.",
      parentValue:
        "Tangible showpiece demonstrating creativity, technical skill, and instructional design.",
    },
  ],

  // ══════════════════════════════════════════════════════════════════════════
  "blockchain-development": [
    {
      num: 1,
      title: "Blockchain Fundamentals",
      desc: "Distributed ledgers, consensus, and wallets.",
      overview:
        "Clear, non-technical explanation of distributed ledgers, blocks, transactions, nodes, and consensus mechanisms. Practical usage: wallets, addresses, and reading transactions on explorers.",
      objectives: [
        "Explain how a blockchain stores transactions and how blocks are linked.",
        "Distinguish public vs private chains and basic tradeoffs.",
        "Use a testnet wallet and read transactions in a block explorer.",
      ],
      lessons: [
        "Distributed ledger concept and immutable records.",
        "Blocks, transactions, and basic transaction anatomy.",
        "Nodes, miners/validators, and consensus at a high level.",
        "Wallets, keys, and basic transaction flows.",
        "Using block explorers and reading transaction details.",
      ],
      activities:
        "Create a testnet wallet and send/receive a small test transaction; produce a short write-up explaining the transaction trace.",
      deliverable:
        "Transaction screenshot + explanation.",
      tools: "Testnet faucet instructions, block explorer primer.",
      rubric: [
        "Correctness of actions — 50%",
        "Clarity of explanation — 30%",
        "Safety awareness — 20%",
      ],
      prerequisites: "None.",
      parentValue:
        "Gives students a safe, hands-on understanding of how blockchain transactions work without financial risk.",
    },
    {
      num: 2,
      title: "Cryptography & Tokens",
      desc: "Keys, signatures, and token standards (ERC-20/721).",
      overview:
        "High-level cryptography: public/private keys, signatures, hashing; token standards (ERC-20, ERC-721) and how ownership is represented on-chain. Emphasis on intuitive understanding rather than deep math.",
      objectives: [
        "Explain signing and key usage conceptually and why private keys must remain secret.",
        "Identify token standards and their typical use-cases.",
        "Inspect a token contract on a block explorer and read simple transfer events.",
      ],
      lessons: [
        "Keys, signatures, and hashing at a conceptual level.",
        "Token types: fungible vs non-fungible and standard behaviors.",
        "Token transfers and event logs interpretation.",
        "Wallet interactions with tokens and security implications.",
      ],
      activities:
        "Identify and inspect one ERC-20 and one ERC-721 contract on a testnet explorer and summarize differences.",
      deliverable:
        "Short comparative report with screenshots.",
      tools: "Block explorer token pages and plain-English cryptography primers.",
      rubric: [
        "Understanding of differences — 40%",
        "Correct exploration steps — 40%",
        "Safety considerations — 20%",
      ],
      prerequisites: "Module 1.",
      parentValue:
        "Students learn token concepts used in credentialing and digital ownership systems.",
    },
    {
      num: 3,
      title: "Smart Contracts",
      desc: "Solidity basics and contract structure.",
      overview:
        "Practical introduction to Solidity basics: contract skeletons, functions, state variables, events, and deployment lifecycle on testnets. Includes common patterns and safety considerations at a conceptual level.",
      objectives: [
        "Write minimal smart contracts with state variables and functions.",
        "Compile and deploy to a testnet and interact with deployed contracts.",
        "Recognize common vulnerability patterns at a high level.",
      ],
      lessons: [
        "Solidity syntax and contract structure.",
        "State management, functions, and events.",
        "Local testing and simulation tools.",
        "Deploying to a testnet and interacting with transactions.",
        "Basic security concerns and common mistakes.",
      ],
      activities:
        "Create and deploy a simple storage contract on testnet and demonstrate reading/writing state with a front-end or CLI.",
      deliverable:
        "Repo + testnet contract address + interaction demo.",
      tools: "Solidity starter examples, testnet deployment guides.",
      rubric: [
        "Functionality of contract — 50%",
        "Correct deployment & interactions — 30%",
        "Documentation & safety notes — 20%",
      ],
      prerequisites: "Programming basics.",
      parentValue:
        "Demonstrates practical ability to build on-chain logic in a safe test environment.",
    },
    {
      num: 4,
      title: "dApp Architecture",
      desc: "Front-end ↔ smart contract interaction patterns.",
      overview:
        "How front-ends interact with smart contracts (web3 providers), wallet integration patterns, transaction lifecycle, and off-chain vs on-chain tradeoffs for UX and cost.",
      objectives: [
        "Architect a simple dApp that reads and writes to a contract via a front-end.",
        "Implement wallet-connect patterns for user transactions.",
        "Make tradeoffs between on-chain persistence and off-chain storage.",
      ],
      lessons: [
        "Web3 providers and how front-ends talk to contracts.",
        "Wallet UX patterns and transaction confirmation lifecycle.",
        "Off-chain storage and hybrid architectures.",
        "Gas and UX tradeoffs (batching, meta-transactions conceptually).",
        "Verifying transactions and listening for events.",
      ],
      activities:
        "Build a small front-end that reads from and writes to a deployed testnet contract (e.g., a simple credential registry).",
      deliverable:
        "Demo link + repo + instructions for testing with a wallet.",
      tools: "Web3 provider docs and wallet integration examples.",
      rubric: [
        "End-to-end functionality — 40%",
        "Clarity of UX flow — 30%",
        "Documentation — 30%",
      ],
      prerequisites: "Modules 1–3.",
      parentValue:
        "Shows how blockchain features can be used to build interactive apps (credential checks, proof-of-workflow).",
    },
    {
      num: 5,
      title: "Testing & Security",
      desc: "Unit tests, common vulnerabilities, and audits.",
      overview:
        "Unit testing smart contracts, common vulnerabilities (reentrancy, integer issues, access control), test coverage basics, and mitigation patterns. Emphasizes safety-first deployment practices.",
      objectives: [
        "Write basic unit tests for smart contracts and run them locally.",
        "Recognize and articulate common vulnerability classes and mitigation strategies.",
        "Create a simple security checklist before any deployment.",
      ],
      lessons: [
        "Testing frameworks and writing unit tests.",
        "Overview of vulnerability classes with examples.",
        "Access control and safe patterns for privileged functions.",
        "Testnet audits: verifying expected behaviors in public environments.",
        "Creating a security checklist and basic mitigation plan.",
      ],
      activities:
        "Add unit tests to the capstone contract and run them; produce a security checklist addressing potential risks.",
      deliverable: "Test output + security checklist.",
      tools: "Testing framework examples and security primers.",
      rubric: [
        "Test coverage & correctness — 50%",
        "Security checklist thoroughness — 30%",
        "Remediation suggestions — 20%",
      ],
      prerequisites: "Module 3.",
      parentValue:
        "Emphasizes safety and reduces risk before any broader exposure.",
    },
    {
      num: 6,
      title: "Layer 2 & Scaling",
      desc: "Rollups, sidechains, and gas optimization.",
      overview:
        "High-level introduction to scaling strategies (rollups, sidechains), gas optimization techniques, and tradeoffs between cost, throughput, and security. Practical tips for minimizing deployment costs in student projects.",
      objectives: [
        "Explain tradeoffs between Layer 1 and Layer 2 choices and basic gas optimization techniques.",
        "Apply simple optimizations in smart contract code to reduce gas usage.",
        "Choose an appropriate testnet or Layer 2 for a small demo deployment.",
      ],
      lessons: [
        "Why scaling matters: costs and UX.",
        "Overview of rollups and sidechains at a high level.",
        "Simple gas optimization patterns and storage considerations.",
        "Choosing the right testnet/L2 for demos.",
        "Verifying cost improvements via simple measurements.",
      ],
      activities:
        "Optimize a contract function to reduce gas and measure the savings; document the changes.",
      deliverable:
        "Optimization report showing before/after gas measurements.",
      tools: "Gas measurement guides and L2 overviews.",
      rubric: [
        "Gas reduction effectiveness — 50%",
        "Explanation & correctness of changes — 30%",
        "Measurement transparency — 20%",
      ],
      prerequisites: "Modules 3–5.",
      parentValue:
        "Keeps demo costs low and improves real usability for student projects.",
    },
    {
      num: 7,
      title: "Deployment & Ecosystem",
      desc: "Testnets, mainnet deployment, and block explorers.",
      overview:
        "Using testnets, explorers, verifying contracts, basic deployment hygiene, and connecting wallets and user flows. Also covers ecosystem resources and where to find libraries and developer docs.",
      objectives: [
        "Deploy and verify contracts on testnets and provide clear usage instructions.",
        "Use explorers to confirm transactions and teach parents how to read simple transaction info.",
        "Create a maintenance & update plan for a dApp demo.",
      ],
      lessons: [
        "Testnet selection and faucet usage.",
        "Contract verification and explorers.",
        "Wallet connection and user walkthrough.",
        "Developer resources and libraries to accelerate work.",
        "Maintenance considerations and upgrade patterns (conceptual).",
      ],
      activities:
        "Deploy & verify the capstone contract, produce a demo walkthrough and simple maintenance notes.",
      deliverable:
        "Verified contract link + demo walkthrough and maintenance plan.",
      tools: "Explorer guides and verification docs.",
      rubric: [
        "Successful deployment & verification — 40%",
        "Clarity of walkthrough — 30%",
        "Maintenance readiness — 30%",
      ],
      prerequisites: "Prior modules.",
      parentValue:
        "Gives parents confidence that the demos are verifiable and that student work is transparent.",
    },
    {
      num: 8,
      title: "Real Project",
      desc: "Build and deploy a simple token, marketplace, or credentialing dApp.",
      overview:
        "End-to-end dApp project: plan, build, test, secure, deploy (testnet), and present. Emphasis on documentation, demo UX, measurements, and explaining tradeoffs to non-technical stakeholders.",
      objectives: [
        "Deliver a functioning dApp demo with documentation, tests, and security checklist.",
        "Present the project and explain technical choices, costs, and next steps.",
      ],
      lessons: [
        "Project kickoff and stakeholder alignment.",
        "Implementation sprints and mid-project review.",
        "Testing, auditing, and security checks.",
        "Deployment and demo preparation.",
        "Presentation and reflection.",
      ],
      activities:
        "Capstone dApp on a testnet with a user guide, demo video, and security report.",
      deliverable:
        "Repo + demo link + presentation slides + security checklist.",
      tools: "Project templates and demo checklists.",
      rubric: [
        "Project functionality & UX — 40%",
        "Security & tests — 30%",
        "Presentation & documentation — 30%",
      ],
      prerequisites: "Completion of prior modules recommended.",
      parentValue:
        "A finished, demonstrable project that clearly communicates student competence and safety.",
    },
  ],
};

// Hero images per course (cycling images since we only have a few)
export const COURSE_HERO_IMAGES = {
  "prompt-engineering": "/images/four.jpg",
  "website-development": "/images/two.jpg",
  "ai-automation": "/images/three.jpg",
  "ai-chatbot": "/images/one.jpg",
  "ai-video-creation": "/images/four.jpg",
  "blockchain-development": "/images/two.jpg",
};

// Accent colors per course for hero gradient tints
export const COURSE_ACCENT_COLORS = {
  "prompt-engineering": { from: "#0096ff", to: "#00BFFF", hex: "#0096ff" },
  "website-development": { from: "#cc5500", to: "#ff8c00", hex: "#cc5500" },
  "ai-automation": { from: "#7c3aed", to: "#a855f7", hex: "#7c3aed" },
  "ai-chatbot": { from: "#16a34a", to: "#22c55e", hex: "#16a34a" },
  "ai-video-creation": { from: "#dc2626", to: "#f97316", hex: "#dc2626" },
  "blockchain-development": { from: "#0f766e", to: "#14b8a6", hex: "#0f766e" },
};
