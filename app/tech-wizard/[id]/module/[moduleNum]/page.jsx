"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { FaArrowLeft, FaCheckCircle, FaBook, FaFlask, FaTools, FaStar, FaClipboardList, FaShieldAlt, FaGraduationCap } from "react-icons/fa";
import { COURSE_MODULE_DETAILS, COURSE_HERO_IMAGES, COURSE_ACCENT_COLORS } from "@/constants/courseModuleData";

const COURSE_LABELS = {
  "prompt-engineering": "Prompt Engineering",
  "website-development": "Website Development",
  "ai-automation": "AI Automation",
  "ai-chatbot": "AI Chatbots",
  "ai-video-creation": "AI Video Creation",
  "blockchain-development": "Blockchain Development",
};

export default function ModuleDetailPage() {
  const params = useParams();
  const courseId = params?.id || "";
  const moduleNum = parseInt(params?.moduleNum || "1", 10);

  const allModules = COURSE_MODULE_DETAILS[courseId] || [];
  const mod = allModules.find((m) => m.num === moduleNum);
  const heroImage = COURSE_HERO_IMAGES[courseId] || "/images/two.jpg";
  const accent = COURSE_ACCENT_COLORS[courseId] || { from: "#0096ff", to: "#00BFFF", hex: "#0096ff" };
  const courseLabel = COURSE_LABELS[courseId] || courseId;

  const prevMod = allModules.find((m) => m.num === moduleNum - 1);
  const nextMod = allModules.find((m) => m.num === moduleNum + 1);

  if (!mod) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 pt-24">
        <div className="text-center">
          <p className="text-6xl mb-4">🔍</p>
          <h1 className="text-2xl font-black text-gray-800 mb-2">Module not found</h1>
          <Link href={`/tech-wizard/${courseId}`} className="text-[#0096ff] font-bold hover:underline">
            ← Back to course
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 text-[#111827]">

      {/* ── Hero Banner ──────────────────────────────────────────────────── */}
      <div className="relative h-[55vh] min-h-[380px] overflow-hidden">
        {/* Background image */}
        <img
          src={heroImage}
          alt={mod.title}
          className="absolute inset-0 w-full h-full object-cover object-center"
        />
        {/* Dark gradient overlay */}
        <div
          className="absolute inset-0"
          style={{
            background: `linear-gradient(135deg, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.55) 50%, rgba(0,0,0,0.3) 100%)`,
          }}
        />
        {/* Accent color tint strip at bottom */}
        <div
          className="absolute bottom-0 left-0 right-0 h-1.5"
          style={{ background: `linear-gradient(to right, ${accent.from}, ${accent.to})` }}
        />

        {/* Hero content */}
        <div className="relative z-10 w-[90%] mx-auto h-full flex flex-col justify-end pb-12 pt-32">
          {/* Breadcrumb */}
          <Link
            href={`/tech-wizard/${courseId}`}
            className="inline-flex items-center gap-2 text-white/60 hover:text-white text-xs font-bold uppercase tracking-widest mb-6 transition-colors w-fit"
          >
            <FaArrowLeft size={10} /> {courseLabel}
          </Link>

          {/* Module badge */}
          <span
            className="inline-block px-3 py-1 rounded-md text-xs font-black uppercase tracking-widest mb-4 w-fit"
            style={{ background: accent.hex, color: "#fff" }}
          >
            Module {String(mod.num).padStart(2, "0")}
          </span>

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-white leading-tight max-w-3xl drop-shadow-xl">
            {mod.title}
          </h1>
          <p className="text-white/70 text-lg mt-4 max-w-2xl leading-relaxed">
            {mod.desc}
          </p>
        </div>
      </div>

      {/* ── Body ─────────────────────────────────────────────────────────── */}
      <div className="w-[90%] mx-auto py-16 grid grid-cols-1 lg:grid-cols-3 gap-10">

        {/* Main column */}
        <div className="lg:col-span-2 space-y-10">

          {/* Overview */}
          <Section icon={<FaBook />} title="Module Overview" accent={accent.hex}>
            <p className="text-gray-600 leading-relaxed text-[1.05rem]">{mod.overview}</p>
          </Section>

          {/* Learning Objectives */}
          <Section icon={<FaGraduationCap />} title="Learning Objectives" accent={accent.hex}>
            <ul className="space-y-3">
              {mod.objectives.map((obj, i) => (
                <li key={i} className="flex items-start gap-3">
                  <FaCheckCircle className="shrink-0 mt-1" style={{ color: accent.hex }} size={15} />
                  <span className="text-gray-600 leading-relaxed">{obj}</span>
                </li>
              ))}
            </ul>
          </Section>

          {/* Lesson-by-lesson */}
          <Section icon={<FaClipboardList />} title="Lesson-by-Lesson Breakdown" accent={accent.hex}>
            <div className="space-y-3">
              {mod.lessons.map((lesson, i) => (
                <div key={i} className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl border border-gray-100">
                  <div
                    className="w-7 h-7 rounded-full flex items-center justify-center text-white text-xs font-black shrink-0"
                    style={{ background: accent.hex }}
                  >
                    {i + 1}
                  </div>
                  <p className="text-gray-700 leading-relaxed text-sm pt-0.5">{lesson}</p>
                </div>
              ))}
            </div>
          </Section>

          {/* Activities & Deliverable */}
          <Section icon={<FaFlask />} title="Hands-on Activities & Deliverables" accent={accent.hex}>
            <div className="space-y-5">
              <div>
                <p className="text-[11px] font-black uppercase tracking-widest text-gray-400 mb-2">Activities</p>
                <p className="text-gray-600 leading-relaxed">{mod.activities}</p>
              </div>
              <div
                className="p-5 rounded-2xl border"
                style={{ borderColor: accent.hex + "40", background: accent.hex + "08" }}
              >
                <p className="text-[11px] font-black uppercase tracking-widest mb-2" style={{ color: accent.hex }}>
                  📦 Deliverable
                </p>
                <p className="text-gray-700 font-medium leading-relaxed">{mod.deliverable}</p>
              </div>
            </div>
          </Section>

          {/* Tools & Readings */}
          <Section icon={<FaTools />} title="Required Tools & Readings" accent={accent.hex}>
            <p className="text-gray-600 leading-relaxed">{mod.tools}</p>
          </Section>

        </div>

        {/* Sidebar column */}
        <div className="space-y-6">

          {/* Assessment & Rubric */}
          <SideCard title="Assessment & Rubric" icon={<FaStar />} accent={accent.hex}>
            <ul className="space-y-3">
              {mod.rubric.map((r, i) => {
                const [label, pct] = r.split(" — ");
                return (
                  <li key={i}>
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-xs font-bold text-gray-700">{label}</span>
                      <span className="text-xs font-black" style={{ color: accent.hex }}>{pct}</span>
                    </div>
                    <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full"
                        style={{
                          width: pct,
                          background: `linear-gradient(to right, ${accent.from}, ${accent.to})`,
                        }}
                      />
                    </div>
                  </li>
                );
              })}
            </ul>
          </SideCard>

          {/* Prerequisites */}
          <SideCard title="Prerequisites" icon={<FaShieldAlt />} accent={accent.hex}>
            <p className="text-gray-600 text-sm leading-relaxed">{mod.prerequisites}</p>
          </SideCard>

          {/* Parent Value */}
          <SideCard title="Parent-Friendly Value" icon="👨‍👩‍👧" accent={accent.hex} isEmoji>
            <p className="text-gray-600 text-sm leading-relaxed">{mod.parentValue}</p>
          </SideCard>

          {/* CTA */}
          <div
            className="rounded-2xl p-6 text-white"
            style={{ background: `linear-gradient(135deg, ${accent.from}, ${accent.to})` }}
          >
            <p className="text-xs font-black uppercase tracking-widest mb-2 text-white/70">Ready to Start?</p>
            <h3 className="font-black text-lg mb-3 leading-tight">Join the {courseLabel} Course</h3>
            <Link
              href="/smcs/student/register"
              className="block w-full bg-white text-center py-3 rounded-xl text-sm font-black uppercase tracking-widest hover:opacity-90 transition-all active:scale-95"
              style={{ color: accent.hex }}
            >
              Register Now →
            </Link>
          </div>

          {/* Back to course */}
          <Link
            href={`/tech-wizard/${courseId}`}
            className="flex items-center gap-2 text-sm font-bold text-gray-400 hover:text-gray-700 transition-colors"
          >
            <FaArrowLeft size={12} /> Back to all modules
          </Link>
        </div>
      </div>

      {/* ── Module navigation ────────────────────────────────────────────── */}
      {(prevMod || nextMod) && (
        <div className="w-[90%] mx-auto pb-20">
          <div className="border-t border-gray-200 pt-10 grid grid-cols-1 md:grid-cols-2 gap-4">
            {prevMod ? (
              <Link
                href={`/tech-wizard/${courseId}/module/${prevMod.num}`}
                className="flex items-center gap-4 p-5 bg-white rounded-2xl border border-gray-200 hover:border-gray-300 hover:shadow-md transition-all group"
              >
                <FaArrowLeft className="text-gray-400 group-hover:text-gray-700 transition-colors shrink-0" />
                <div>
                  <p className="text-[10px] uppercase font-bold text-gray-400 tracking-wider mb-0.5">Previous</p>
                  <p className="font-bold text-gray-800 group-hover:text-[#0096ff] transition-colors">
                    Module {String(prevMod.num).padStart(2, "0")} — {prevMod.title}
                  </p>
                </div>
              </Link>
            ) : <div />}

            {nextMod && (
              <Link
                href={`/tech-wizard/${courseId}/module/${nextMod.num}`}
                className="flex items-center justify-between gap-4 p-5 bg-white rounded-2xl border border-gray-200 hover:border-gray-300 hover:shadow-md transition-all group md:text-right"
              >
                <div className="md:ml-auto">
                  <p className="text-[10px] uppercase font-bold text-gray-400 tracking-wider mb-0.5">Next</p>
                  <p className="font-bold text-gray-800 group-hover:text-[#0096ff] transition-colors">
                    Module {String(nextMod.num).padStart(2, "0")} — {nextMod.title}
                  </p>
                </div>
                <FaArrowLeft className="text-gray-400 group-hover:text-gray-700 transition-colors rotate-180 shrink-0" />
              </Link>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Reusable section block ────────────────────────────────────────────────
function Section({ icon, title, accent, children }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8">
      <div className="flex items-center gap-3 mb-5">
        <div
          className="w-9 h-9 rounded-xl flex items-center justify-center text-white text-sm"
          style={{ background: accent }}
        >
          {icon}
        </div>
        <h2 className="font-black text-lg text-gray-800">{title}</h2>
      </div>
      {children}
    </div>
  );
}

// ─── Reusable sidebar card ─────────────────────────────────────────────────
function SideCard({ icon, title, accent, children, isEmoji }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
      <div className="flex items-center gap-3 mb-4">
        {isEmoji ? (
          <span className="text-xl">{icon}</span>
        ) : (
          <div
            className="w-8 h-8 rounded-xl flex items-center justify-center text-white text-xs"
            style={{ background: accent }}
          >
            {icon}
          </div>
        )}
        <h3 className="font-black text-sm text-gray-800 uppercase tracking-wider">{title}</h3>
      </div>
      {children}
    </div>
  );
}
