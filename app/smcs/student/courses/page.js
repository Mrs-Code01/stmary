"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import {
  Bot, Globe, Zap, MessageCircle, Video, Link2,
  CheckCircle, Pencil, X, Loader2
} from "lucide-react";

// ─── Course data ─────────────────────────────────────────────────────────────

const COURSES = [
  {
    name: "Prompt Engineering",
    desc: "Master the art of crafting precise instructions for AI models.",
    Icon: Bot,
    gradient: "from-violet-500 to-purple-600",
    light: "bg-violet-50 text-violet-600 border-violet-200",
  },
  {
    name: "Website Development",
    desc: "Build modern, responsive, and powerful websites from scratch.",
    Icon: Globe,
    gradient: "from-blue-500 to-indigo-600",
    light: "bg-blue-50 text-blue-600 border-blue-200",
  },
  {
    name: "AI Automation",
    desc: "Connect apps and automate workflows using cutting-edge AI tools.",
    Icon: Zap,
    gradient: "from-orange-500 to-amber-500",
    light: "bg-orange-50 text-orange-600 border-orange-200",
  },
  {
    name: "AI Chatbots",
    desc: "Build and deploy intelligent conversational agents for any platform.",
    Icon: MessageCircle,
    gradient: "from-green-500 to-emerald-600",
    light: "bg-green-50 text-green-600 border-green-200",
  },
  {
    name: "AI Video Creation",
    desc: "Generate professional videos and animations using generative AI.",
    Icon: Video,
    gradient: "from-pink-500 to-rose-600",
    light: "bg-pink-50 text-pink-600 border-pink-200",
  },
  {
    name: "Blockchain Development",
    desc: "Build decentralised applications and smart contracts.",
    Icon: Link2,
    gradient: "from-teal-500 to-cyan-600",
    light: "bg-teal-50 text-teal-600 border-teal-200",
  },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

function getStudentFromCookie() {
  if (typeof document === "undefined") return null;
  const match = document.cookie
    .split("; ")
    .find((r) => r.startsWith("smcs_student="));
  if (!match) return null;
  try {
    return JSON.parse(decodeURIComponent(match.split("=").slice(1).join("=")));
  } catch {
    return null;
  }
}

function formatDate(iso) {
  return new Date(iso).toLocaleDateString("en-GB", {
    day: "numeric", month: "long", year: "numeric",
  });
}

function addMonths(date, months) {
  const d = new Date(date);
  d.setMonth(d.getMonth() + months);
  return d.toISOString();
}

// ─── Toast component ──────────────────────────────────────────────────────────

function Toast({ message, type, onDone }) {
  useEffect(() => {
    const t = setTimeout(onDone, 3000);
    return () => clearTimeout(t);
  }, [onDone]);

  const bg = type === "success" ? "bg-green-600" : "bg-red-500";
  return (
    <div className={`fixed bottom-8 left-1/2 -translate-x-1/2 z-50 ${bg} text-white
      px-6 py-3.5 rounded-2xl shadow-2xl font-bold text-sm flex items-center gap-3
      animate-[fadeInUp_0.3s_ease]`}
    >
      {type === "success" ? <CheckCircle size={18} /> : <X size={18} />}
      {message}
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function CoursesPage() {
  const router = useRouter();
  const [student,      setStudent]      = useState(null);
  const [record,       setRecord]       = useState(null);   // existing student_courses row
  const [loading,      setLoading]      = useState(true);
  const [editing,      setEditing]      = useState(false);
  const [pending,      setPending]      = useState(null);   // course being confirmed
  const [saving,       setSaving]       = useState(false);
  const [toast,        setToast]        = useState(null);   // { message, type }
  const [error,        setError]        = useState("");

  // ── Auth guard + initial data load ────────────────────────────────────────
  useEffect(() => {
    const s = getStudentFromCookie();
    if (!s) { router.replace("/smcs/student/login"); return; }
    setStudent(s);
    fetchRecord(s.id);
  }, [router]);

  const fetchRecord = async (studentId) => {
    const { data, error: err } = await supabase
      .from("student_courses")
      .select("*")
      .eq("student_id", studentId)
      .maybeSingle();
    if (err) console.error(err);
    setRecord(data || null);
    setLoading(false);
  };

  // ── Confirm modal submit ──────────────────────────────────────────────────
  const handleConfirm = async () => {
    if (!pending || !student) return;
    setSaving(true);
    setError("");

    const now        = new Date().toISOString();
    const sessionEnd = addMonths(now, 3);
    const isUpdate   = !!record;

    const payload = {
      student_id:    student.id,
      course_name:   pending.name,
      selected_at:   now,
      session_start: now,
      session_end:   sessionEnd,
      updated_at:    now,
    };

    let err;
    if (isUpdate) {
      ({ error: err } = await supabase
        .from("student_courses")
        .update(payload)
        .eq("student_id", student.id));
    } else {
      ({ error: err } = await supabase
        .from("student_courses")
        .insert(payload));
    }

    if (err) {
      setSaving(false);
      setError("Failed to save record: " + err.message);
      return;
    }

    // ── Also update the main 'students' table for consistency ──
    const { error: studentErr } = await supabase
      .from("students")
      .update({ tech_course: pending.name })
      .eq("id", student.id);

    setSaving(false);
    if (studentErr) {
      setError("Failed to update profile: " + studentErr.message);
      return;
    }

    // ── Notify layout to update header/sidebar immediately ──
    window.dispatchEvent(new CustomEvent("smcs_course_updated", { detail: pending.name }));

    setRecord({ ...payload });
    setPending(null);
    setEditing(false);
    setToast({ message: isUpdate ? "Course updated successfully!" : "Course selected successfully!", type: "success" });
  };

  // ── Derived state ─────────────────────────────────────────────────────────
  const showGrid   = !record || editing;
  const activeCourse = record
    ? COURSES.find((c) => c.name === record.course_name)
    : null;

  // ── Render ────────────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <Loader2 className="animate-spin text-indigo-400" size={36} />
      </div>
    );
  }

  return (
    <div className="w-full">

      {/* ── Toast ── */}
      {toast && (
        <Toast message={toast.message} type={toast.type} onDone={() => setToast(null)} />
      )}

      {/* ── Confirmation Modal ── */}
      {pending && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="w-full max-w-sm bg-white rounded-3xl p-8 shadow-2xl border border-gray-100">
            <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${pending.gradient}
              flex items-center justify-center mb-5 shadow-lg`}
            >
              <pending.Icon size={28} className="text-white" />
            </div>
            <h3 className="text-xl font-black text-gray-800 mb-2">Confirm Selection</h3>
            <p className="text-gray-500 text-sm leading-relaxed mb-6">
              Are you sure you want to select{" "}
              <span className="font-bold text-gray-800">{pending.name}</span>?
              You can always change this later.
            </p>

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3
                text-red-600 text-xs font-medium mb-4">
                {error}
              </div>
            )}

            <div className="flex gap-3">
              <button
                onClick={() => { setPending(null); setError(""); }}
                className="flex-1 py-3 rounded-xl border border-gray-200 text-gray-600
                  font-bold text-sm hover:bg-gray-50 transition-all"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirm}
                disabled={saving}
                className="flex-1 py-3 rounded-xl bg-indigo-600 text-white font-bold
                  text-sm hover:bg-indigo-700 transition-all disabled:opacity-60
                  flex items-center justify-center gap-2"
              >
                {saving
                  ? <><Loader2 size={16} className="animate-spin" /> Saving…</>
                  : "Yes, Select →"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Page Header ── */}
      <div className="mb-8">
        <h1 className="text-3xl font-black text-gray-900 mb-1">
          {record ? "My Course" : "Select Your Tech Course"}
        </h1>
        <p className="text-gray-500 text-sm">
          {record
            ? "Your enrolled course for this session."
            : "Choose the course your tutor has assigned to you for this session."}
        </p>
      </div>

      {/* ── Active Course Banner ── */}
      {record && activeCourse && (
        <div className={`relative overflow-hidden rounded-2xl p-6 mb-8 bg-gradient-to-br
          ${activeCourse.gradient} text-white shadow-xl`}
        >
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center
                justify-center backdrop-blur-sm flex-shrink-0">
                <activeCourse.Icon size={28} className="text-white" />
              </div>
              <div>
                <p className="text-white/70 text-xs font-bold uppercase tracking-widest mb-1">
                  Your Current Course
                </p>
                <h2 className="text-2xl font-black leading-tight">{record.course_name}</h2>
                <p className="text-white/80 text-xs mt-2 font-medium">
                  Session: {formatDate(record.session_start)} – {formatDate(record.session_end)}
                </p>
              </div>
            </div>
            <button
              onClick={() => setEditing(true)}
              className="flex items-center gap-2 bg-white/20 hover:bg-white/30 backdrop-blur-sm
                px-4 py-2.5 rounded-xl text-white text-xs font-bold transition-all
                flex-shrink-0 border border-white/30"
            >
              <Pencil size={14} />
              Change
            </button>
          </div>

          {/* subtle radial glow */}
          <div className="absolute -bottom-8 -right-8 w-48 h-48 bg-white/10 rounded-full blur-2xl
            pointer-events-none" />
        </div>
      )}

      {/* ── Cancel edit banner ── */}
      {editing && record && (
        <div className="flex items-center justify-between bg-indigo-50 border border-indigo-200
          rounded-2xl px-5 py-4 mb-6">
          <p className="text-indigo-700 text-sm font-bold">
            Select a new course to replace your current one.
          </p>
          <button
            onClick={() => { setEditing(false); setError(""); }}
            className="text-indigo-500 hover:text-indigo-700 transition-colors ml-4"
          >
            <X size={18} />
          </button>
        </div>
      )}

      {/* ── Course Grid ── */}
      {showGrid && (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
          {COURSES.map((course) => {
            const isActive = record?.course_name === course.name;
            return (
              <button
                key={course.name}
                onClick={() => setPending(course)}
                className={`group relative text-left p-6 rounded-2xl border-2 bg-white
                  transition-all duration-200 shadow-sm hover:shadow-lg hover:-translate-y-1
                  focus:outline-none focus:ring-2 focus:ring-indigo-400
                  ${isActive
                    ? "border-indigo-500 shadow-indigo-100 ring-2 ring-indigo-300"
                    : "border-gray-100 hover:border-indigo-300"}`}
              >
                {/* Active badge */}
                {isActive && (
                  <span className="absolute top-3 right-3 bg-indigo-600 text-white
                    text-[9px] font-black uppercase tracking-widest px-2 py-1 rounded-full">
                    Current
                  </span>
                )}

                {/* Icon */}
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${course.gradient}
                  flex items-center justify-center mb-4 shadow-md
                  group-hover:scale-110 transition-transform duration-200`}
                >
                  <course.Icon size={22} className="text-white" />
                </div>

                {/* Text */}
                <h3 className="font-black text-gray-800 text-base mb-2 leading-snug">
                  {course.name}
                </h3>
                <p className="text-gray-400 text-xs leading-relaxed">
                  {course.desc}
                </p>
              </button>
            );
          })}
        </div>
      )}

      {/* ── Animation keyframe ── */}
      <style>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translate(-50%, 12px); }
          to   { opacity: 1; transform: translate(-50%, 0); }
        }
      `}</style>
    </div>
  );
}
