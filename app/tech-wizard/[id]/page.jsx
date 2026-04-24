"use client";

import Link from "next/link";
import { FaArrowLeft, FaBookOpen, FaUserGraduate, FaClock } from "react-icons/fa";
import { useParams } from "next/navigation";

const COURSE_DESCRIPTIONS = {
  "prompt-engineering": `Prompt Engineering is the cornerstone of the modern AI era. In this comprehensive 3-month masterclass, you will learn how to communicate effectively with Large Language Models (LLMs) to extract maximum value. The curriculum covers everything from basic zero-shot prompting to complex chain-of-thought and React paradigms. You will explore how to build structured outputs, manage context windows, and reduce model hallucinations. We dive into specialized prompting for different domains including coding, creative writing, and data analysis. By the end of this course, you will be able to build advanced AI-driven tools and automate intellectual tasks that previously required human intervention. This course is essential for anyone looking to stay ahead in the rapidly evolving job market where AI literacy is becoming a mandatory skill. Join us to transition from a simple AI user to a master of the machine's mind. Prepare to unlock the true potential of GPT-4, Claude, and specialized generative models. Your journey into the future of human-computer interaction starts here. You will learn the art of steering AI to generate code, summaries, and creative content with surgical precision. Our hands-on projects ensure you leave with a portfolio of prompts that solve real-world problems.`,
  "website-development": `The Website Development specialization is designed to transform you into a highly sought-after full-stack developer. Over 90 days, we push the boundaries of modern web standards, moving beyond simple HTML and CSS into the world of high-performance application building. You will master the React ecosystem, learning how to build scalable, component-based architectures with Next.js. We focus heavily on visual excellence, teaching you the intricacies of Tailwind CSS and modern animation libraries like Framer Motion. The course includes deep dives into backend integration, database management with Supabase, and deploying production-ready applications to the cloud. We believe in building "Real-world" projects, so your portfolio will include everything from e-commerce platforms to real-time dashboards. The web is evolving, and generic sites are no longer enough. We teach you how to create premium, high-impact digital experiences that "WOW" users and clients alike. Enroll today to begin your path toward becoming a professional engineer capable of bringing any digital vision to life with pixel-perfect precision. We cover responsive design principles, web accessibility, and SEO best practices to ensure your projects are world-class. From state management to API integration, you will learn every layer of the modern web stack.`,
  "ai-automation": `AI Automation is the bridge between technology and business efficiency. This course teaches you how to design, develop, and deploy intelligent automation systems that save thousands of human hours. You will learn to use low-code and no-code tools alongside custom AI scripts to connect disparate software systems. We focus on tools like Zapier, Make, and custom Python automations to build autonomous workflows. The curriculum covers data extraction using AI, automated reporting, and intelligent lead nurturing systems. You will understand how to integrate LLMs into existing business processes to create "AI employees" that handle repetitive tasks. By the end of 90 days, you will have the skills to consult for companies looking to modernize their operations through AI. Automation is no longer an option; it is a necessity for modern business survival. We provide the technical foundation and the strategic mindset needed to lead this revolution. Your future as an Automation Specialist starts now. Learn how to turn manual chaos into streamlined AI-driven productivity.`,
  "ai-chatbot": `AI Chatbots are redefining the way humans interact with brands and services. In this course, you will learn to build more than just simple response bots—you will create intelligent, context-aware conversational agents. We explore the architecture of modern chatbots, from vector databases for Retrieval-Augmented Generation (RAG) to multi-turn conversational logic. You will learn how to deploy these bots across the web, Discord, WhatsApp, and custom enterprise portals. We focus on personality design, prompt tuning for specific brand voices, and handling complex user intents. The course covers the integration of external APIs to allow bots to perform real-world actions like booking appointments or checking order status. By the end of 3 months, you will be a certified Chatbot Architect capable of building "brains" for any digital platform. The demand for intelligent conversational interfaces is skyrocketing, and we give you the tools to meet it. Start building the future of customer experience and digital interaction today.`,
  "ai-video-creation": `Generative AI for Video and Animation is the newest frontier in digital media. In this course, you will learn how to produce Hollywood-level visual content using only your computer and AI. We cover text-to-video, image-to-video, and advanced video-to-video transformation techniques. You will master tools like Runway Gen-2, Pika Labs, and Sora alternatives to create cinematic quality sequences. The curriculum includes AI-assisted storyboarding, script generation, and voice cloning for perfectly synced narrations. We dive into 3D animation generation and AI-driven special effects that used to take weeks but now take minutes. This course is perfect for content creators, marketers, and filmmakers who want to leverage the power of AI to tell incredible stories. You will learn the workflow of a modern "AI Producer," from initial concept to final cinematic edit. Stay on the absolute cutting edge of media production. The era of the "one-person film studio" has arrived, and we are showing you exactly how to lead it.`,
  "blockchain-development": `Blockchain Development remains one of the most intellectually rewarding and financially lucrative fields in tech. This 3-month intensive course takes you deep into the world of decentralized systems, smart contracts, and Web3 technologies. You will learn to write secure, efficient code using Solidity for the Ethereum Virtual Machine (EVM). We cover the fundamentals of decentralized finance (DeFi), non-fungible tokens (NFTs), and the mechanics of Proof of Stake systems. You will build and deploy your own decentralized applications (dApps) from scratch, connecting them to modern frontends with Ethers.js or Viem. Security is our top priority, so we spend significant time on smart contract auditing and avoiding common vulnerabilities like re-entrancy. The blockchain is about more than just crypto; it's about trustless infrastructure for the entire global economy. Become one of the elite developers building the backbone of the decentralized internet. Your path to being a Web3 Architect starts here. Master the protocols that are disrupting finance and digital ownership forever.`
};

export default function CourseDetailPageExact() {
  const params = useParams();
  const id = params?.id || "course";

  const courseTitle = id.split("-").map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(" ");
  const courseDesc = COURSE_DESCRIPTIONS[id] || `Dive deep into the ultimate ${courseTitle.toLowerCase()} masterclass designed to take you from a complete beginner to a certified professional. Complete all modules and pass the final assessment to unlock your completion certificate.`;

  const COURSE_MODULES = {
    "prompt-engineering": [
      { num: 1, title: "Fundamentals", desc: "What LLMs are, prompt anatomy, system vs. user prompts." },
      { num: 2, title: "Effective Instruction Design", desc: "Templates, constraints, few-shot prompting." },
      { num: 3, title: "Reasoning & Chain-of-Thought", desc: "Guiding models to reliable multi-step answers." },
      { num: 4, title: "Retrieval & Context", desc: "Using knowledge bases, embeddings, and RAG patterns." },
      { num: 5, title: "API Workflows & Tooling", desc: "Calling APIs, function-calling, and embedding pipelines." },
      { num: 6, title: "Evaluation & Debugging", desc: "Testing prompts, metrics, and iterative improvement." },
      { num: 7, title: "Safety, Bias & Guardrails", desc: "Content filters, fairness checks, and privacy." },
      { num: 8, title: "Practical Projects & Portfolio", desc: "Build a tutoring assistant, summarizer, or classroom tool." },
    ],
    "website-development": [
      { num: 1, title: "Fundamentals", desc: "HTML, CSS, and core web principles." },
      { num: 2, title: "Modern JavaScript", desc: "ES6+, DOM, and asynchronous patterns." },
      { num: 3, title: "React Basics", desc: "Components, props, state, and hooks." },
      { num: 4, title: "Next.js & Routing", desc: "Server-side rendering, static pages, and API routes." },
      { num: 5, title: "Styling & Responsive Design", desc: "CSS modules, flexbox/grid, mobile-first layouts." },
      { num: 6, title: "State Management & Data Fetching", desc: "Contexts, SWR/React Query patterns." },
      { num: 7, title: "Backend Essentials", desc: "Simple REST APIs, authentication, and databases." },
      { num: 8, title: "Deployment & DevOps", desc: "Hosting, CI/CD, performance, and accessibility best practices." },
      { num: 9, title: "Capstone Website", desc: "Design, build, and present a live portfolio or product site." },
    ],
    "ai-automation": [
      { num: 1, title: "Automation Principles", desc: "When to automate, ROI, and workflow mapping." },
      { num: 2, title: "Data & Integration Basics", desc: "APIs, webhooks, and common data formats." },
      { num: 3, title: "No-code/Low-code Tools", desc: "Practical use of automation platforms and connectors." },
      { num: 4, title: "Orchestrating Multi-step Workflows", desc: "Queues, retries, and scheduling." },
      { num: 5, title: "AI in Automation", desc: "Applying LLMs and vision models to tasks." },
      { num: 6, title: "Monitoring & Reliability", desc: "Logging, alerting, and testing automated flows." },
      { num: 7, title: "Security & Compliance", desc: "Data handling, access control, and privacy." },
      { num: 8, title: "Real-world Projects", desc: "Automate reporting, email triage, or student progress tracking." },
    ],
    "ai-chatbot": [
      { num: 1, title: "Conversation Design", desc: "Intents, slots, dialogue flows, and UX principles." },
      { num: 2, title: "Bot Architecture", desc: "Stateless vs. stateful bots, memory strategies." },
      { num: 3, title: "Building with Platforms", desc: "ChatGPT custom GPTs, Rasa, or Dialogflow basics." },
      { num: 4, title: "Integrations", desc: "Slack, MS Teams, WhatsApp, and website embedding." },
      { num: 5, title: "Rich Responses & Tools", desc: "Buttons, cards, file handling, and function-calling." },
      { num: 6, title: "Testing & Analytics", desc: "Conversation testing, metrics, and improvement cycles." },
      { num: 7, title: "Safety & Moderation", desc: "Filtering, fallback flows, and escalation to humans." },
      { num: 8, title: "Capstone Chatbot", desc: "Deploy a parent/teacher assistant or course helpdesk bot." },
    ],
    "ai-video-creation": [
      { num: 1, title: "Story & Script Fundamentals", desc: "Storyboarding and writing for short video." },
      { num: 2, title: "Generative Video Tools", desc: "Text-to-video, image-to-video, and prompt techniques." },
      { num: 3, title: "Motion & Animation Basics", desc: "Keyframes, easing, and simple 2D/3D concepts." },
      { num: 4, title: "Audio & Voice", desc: "Text-to-speech, voiceover recording and mixing." },
      { num: 5, title: "Editing & Postproduction", desc: "Cuts, transitions, color correction, and captions." },
      { num: 6, title: "Visual Effects & Motion Graphics", desc: "Overlays, lower thirds, and animations." },
      { num: 7, title: "Optimization & Publishing", desc: "Formats, platform requirements, and SEO for video." },
      { num: 8, title: "Portfolio Project", desc: "Produce and publish a short promotional or educational video." },
    ],
    "blockchain-development": [
      { num: 1, title: "Blockchain Fundamentals", desc: "Distributed ledgers, consensus, and wallets." },
      { num: 2, title: "Cryptography & Tokens", desc: "Keys, signatures, and token standards (ERC-20/721)." },
      { num: 3, title: "Smart Contracts", desc: "Solidity basics and contract structure." },
      { num: 4, title: "dApp Architecture", desc: "Front-end ↔ smart contract interaction patterns." },
      { num: 5, title: "Testing & Security", desc: "Unit tests, common vulnerabilities, and audits." },
      { num: 6, title: "Layer 2 & Scaling", desc: "Rollups, sidechains, and gas optimization." },
      { num: 7, title: "Deployment & Ecosystem", desc: "Testnets, mainnet deployment, and block explorers." },
      { num: 8, title: "Real Project", desc: "Build and deploy a simple token, marketplace, or credentialing dApp." },
    ],
  };

  const modules = COURSE_MODULES[id] || [
    { num: 1, title: "Fundamentals", desc: "Core concepts and foundational knowledge." },
    { num: 2, title: "Advanced Techniques", desc: "Deeper skills and applied methods." },
    { num: 3, title: "Practical Application", desc: "Hands-on real-world projects." },
    { num: 4, title: "Final Assessment", desc: "Assess your learning and earn your certificate." },
  ];

  return (
    <div className="min-h-screen bg-gray-50 pt-28 pb-24 text-[#111827]">
      <div className="w-[90%] mx-auto">

        {/* Navigation */}
        <Link href="/tech-wizard" className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-gray-400 hover:text-[#0096ff] transition-colors mt-[100px] mb-10">
          <FaArrowLeft /> Back to Tech-Wizard
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">

          {/* Main Content */}
          <div className="lg:col-span-2 space-y-10">
            {/* Header Hero */}
            <div className="bg-white rounded-[2rem] p-10 md:p-14 border border-gray-100 shadow-sm relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-[#0096ff] opacity-[0.03] rounded-bl-full" />

              <div className="relative z-10">
                <span className="inline-block px-3 py-1 bg-orange-100 text-[#cc5500] text-[15px] font-black uppercase tracking-widest rounded-md mb-6">
                  PREMIUM COURSE
                </span>
                <h1 className="text-4xl md:text-5xl font-black tracking-tight mb-6">
                  {courseTitle}
                </h1>
                <p className="text-gray-500 text-lg leading-relaxed max-w-2xl whitespace-pre-line">
                  {courseDesc}
                </p>


              </div>
            </div>

            {/* Modules Section */}
            <div>
              <h2 className="text-2xl font-black mb-6">Course Modules</h2>
              <div className="space-y-4">
                {modules.map((mod) => (
                  <Link
                    key={mod.num}
                    href={`/tech-wizard/${id}/module/${mod.num}`}
                    className="flex items-start justify-between p-6 rounded-2xl border bg-white border-gray-200 shadow-sm hover:border-[#0096ff] hover:shadow-md transition-all group"
                  >
                    <div className="flex items-start gap-6 flex-1 min-w-0">
                      <div className="w-14 h-14 shrink-0 rounded-full flex items-center justify-center border font-bold bg-white border-gray-200 text-[#111827] group-hover:border-[#0096ff] group-hover:text-[#0096ff] transition-colors">
                        {String(mod.num).padStart(2, "0")}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-[10px] uppercase font-bold text-gray-400 tracking-[0.2em] mb-1">Module {mod.num}</p>
                        <h3 className="font-bold text-lg leading-tight group-hover:text-[#0096ff] transition-colors">{mod.title}</h3>
                        {mod.desc && (
                          <p className="text-gray-400 text-sm mt-1 leading-relaxed">{mod.desc}</p>
                        )}
                        <span className="inline-block mt-3 text-xs font-bold text-[#0096ff] opacity-0 group-hover:opacity-100 transition-opacity">
                          View details →
                        </span>
                      </div>
                    </div>
                    <div className="ml-4 shrink-0 text-gray-300 group-hover:text-[#0096ff] transition-colors mt-1">
                      <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            <div className="bg-[#111827] text-white rounded-[2rem] p-8 shadow-xl">
              <h3 className="font-bold text-[1.6rem] mb-4 tracking-tight text-[#ff0000]">Access Required</h3>
              <p className="text-[15px] text-gray-400 mb-8 leading-relaxed">
                Please register for the SMCS Student Portal to access your student profile, track your progress, and take your monthly assessments.
              </p>

              <Link
                href="/smcs/student/register"
                className="block w-full bg-[#0096ff] hover:bg-[#00BFFF] py-4 rounded-xl font-black uppercase tracking-widest text-[12px] text-center transition-all shadow-[0_8px_20px_rgba(0,150,255,0.3)] active:scale-95"
              >
                Register Now →
              </Link>
            </div>

            <div className="bg-white rounded-[2rem] p-8 border border-gray-100 shadow-sm">
              <h3 className="font-bold text-xl mb-6">Course Requirements</h3>
              <ul className="space-y-5">
                <li className="flex gap-4 text-base text-gray-600 leading-relaxed">
                  <FaUserGraduate className="text-[#cc5500] shrink-0 mt-1" />
                  Commitment to 3 months of consistent learning and project development.
                </li>
                <li className="flex gap-4 text-base text-gray-600 leading-relaxed">
                  <FaBookOpen className="text-[#0096ff] shrink-0 mt-1" />
                  Successful completion of all monthly assessments with 70% or higher.
                </li>
                <li className="flex gap-4 text-base text-gray-600 leading-relaxed">
                  <FaClock className="text-orange-500 shrink-0 mt-1" />
                  Daily submission of effort logs and progress updates in the portal.
                </li>
              </ul>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
