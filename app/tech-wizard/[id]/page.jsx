"use client";

import Link from "next/link";
import { FaArrowLeft, FaCheckCircle, FaLock, FaBookOpen, FaUserGraduate, FaClock, FaCertificate } from "react-icons/fa";
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

  const modules = [
    { num: 1, title: "Fundamentals", locked: false, completed: false },
    { num: 2, title: "Advanced Techniques", locked: false, completed: false },
    { num: 3, title: "Practical Application", locked: false, completed: false },
    { num: 4, title: "Final Assessment", locked: false, completed: false },
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

                <div className="flex flex-wrap gap-8 mt-10 border-t border-gray-100 pt-8">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-[#0096ff]">
                      <FaClock size={16} />
                    </div>
                    <div>
                      <p className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">Duration</p>
                      <p className="font-bold">3 Months</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-purple-50 flex items-center justify-center text-purple-600">
                      <FaCertificate size={16} />
                    </div>
                    <div>
                      <p className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">Outcome</p>
                      <p className="font-bold">Certified Professional</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Modules Section */}
            <div>
              <h2 className="text-2xl font-black mb-6">Course Modules</h2>
              <div className="space-y-4">
                {modules.map((mod) => (
                  <div
                    key={mod.num}
                    className="flex items-center justify-between p-6 rounded-2xl border bg-white border-gray-200 shadow-sm hover:border-[#0096ff] hover:shadow-md transition-all cursor-pointer"
                  >
                    <div className="flex items-center gap-6">
                      <div className={`w-14 h-14 rounded-full flex items-center justify-center border font-bold ${mod.completed ? "bg-green-50 text-green-600 border-green-200" : "bg-white border-gray-200 text-[#111827]"}`}>
                        {mod.completed ? <FaCheckCircle size={20} /> : `0${mod.num}`}
                      </div>
                      <div>
                        <p className="text-[10px] uppercase font-bold text-gray-400 tracking-[0.2em] mb-1">Module {mod.num}</p>
                        <h3 className="font-bold text-lg">{mod.title}</h3>
                      </div>
                    </div>
                    <div>
                    </div>
                  </div>
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
