"use client";

import Link from "next/link";
import { FaArrowRight } from "react-icons/fa";

const courses = [
  {
    id: "prompt-engineering",
    title: "Prompt Engineering",
    duration: "3 MONTHS DURATION",
    desc: "Master the art of crafting precise instructions for AI models like GPT-4, Claude, and Midjourney.",
    img: "/images/one.jpg"
  },
  {
    id: "website-development",
    title: "Website Development",
    duration: "3 MONTHS DURATION",
    desc: "Build modern, responsive, and powerful websites using React, Next.js, and modern CSS frameworks.",
    img: "/images/four.jpg"
  },
  {
    id: "ai-automation",
    title: "AI Automation",
    duration: "3 MONTHS DURATION",
    desc: "Connect apps and automate complex business workflows using cutting-edge AI-driven tools.",
    img: "/images/one.jpg"
  },
  {
    id: "ai-chatbot",
    title: "AI Chatbots",
    duration: "3 MONTHS DURATION",
    desc: "Build and deploy intelligent conversational agents and custom GPTs for any business platform.",
    img: "/images/two.jpg"
  },
  {
    id: "ai-video-creation",
    title: "AI Video Creation",
    duration: "3 MONTHS DURATION",
    desc: "Generate professional videos, 3D animations, and cinematic content through generative AI production.",
    img: "/images/three.jpg"
  },
  {
    id: "blockchain-development",
    title: "Blockchain Development",
    duration: "3 MONTHS DURATION",
    desc: "Dive into cryptocurrency, decentralized applications (dApps), and smart contract security protocols.",
    img: "/images/two.jpg"
  }
];

export default function TechWizardPage() {
  return (
    <div className="min-h-screen bg-white pt-52 pb-24 font-sans text-[#111827]">
      <div className="w-[90%] mx-auto">

        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-16 gap-6 border-b border-gray-100 pb-8">
          <h1 className="text-4xl md:text-[3.5rem] font-black leading-tight tracking-tight">
            The Tech Wizard <span className="text-[#0096ff] italic">Skill Acquisition</span>
          </h1>
        </div>

        {/* Grid Section matching screenshot EXACTLY */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-12">
          {courses.map((course, idx) => (
            <Link
              key={course.id}
              href={`/tech-wizard/${course.id}`}
              className="group block"
            >
              {/* Image Container with pill */}
              <div className="w-full aspect-[4/3] rounded-[2rem] overflow-hidden relative mb-6">
                <img
                  src={course.img}
                  alt={course.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute top-5 left-5 bg-white/90 backdrop-blur text-[#111827] text-xs font-bold px-4 py-2 rounded-xl shadow-sm">
                  0{idx + 1}
                </div>
              </div>

              {/* Text Content Below Image */}
              <div className="space-y-3">
                <h3 className="text-2xl font-black text-[#111827] group-hover:text-[#0096ff] transition-colors">
                  {course.title}
                </h3>
                <p className="text-gray-500 text-sm leading-relaxed max-w-sm">
                  {course.desc}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
