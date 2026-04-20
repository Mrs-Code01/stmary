"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { Laptop, MessageSquare, Zap, Bot, Video, Box } from "lucide-react";

const TECH_COURSES = [
  { name: "Prompt Engineering", icon: MessageSquare, color: "bg-blue-500", desc: "Master the art of crafting precise instructions for AI models like GPT-4." },
  { name: "Website Development", icon: Laptop, color: "bg-indigo-600", desc: "Build modern, responsive, and powerful websites from scratch." },
  { name: "AI Automation", icon: Zap, color: "bg-orange-500", desc: "Connect apps and automate workflows using cutting-edge AI tools." },
  { name: "AI Chatbots", icon: Bot, color: "bg-green-500", desc: "Build and deploy intelligent conversational agents for any platform." },
  { name: "AI Video Creation", icon: Video, color: "bg-pink-500", desc: "Generate professional videos and animations using generative AI." },
  { name: "Blockchain Development", icon: Box, color: "bg-purple-600", desc: "Build decentralized applications and smart contracts on the blockchain." }
];

export default function TechCourseSelectionModal({ student, onSelect }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSelect = async (courseName) => {
    setLoading(true);
    setError("");

    try {
      const startedAt = new Date().toISOString();
      // 1. Update Supabase
      const { error: dbErr } = await supabase
        .from("students")
        .update({ 
          tech_course: courseName,
          tech_course_started_at: startedAt
        })
        .eq("id", student.id);

      if (dbErr) throw dbErr;

      // 2. Update Cookie
      const updatedStudent = { 
        ...student, 
        tech_course: courseName,
        tech_course_started_at: startedAt
      };
      document.cookie = `smcs_student=${encodeURIComponent(JSON.stringify(updatedStudent))}; path=/; max-age=86400`;

      // 3. Callback
      onSelect(updatedStudent);
    } catch (err) {
      setError(err.message || "Failed to save selection. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-gray-900/40 backdrop-blur-md animate-in fade-in duration-300">
      <div className="bg-white w-full max-w-4xl rounded-[2.5rem] shadow-2xl p-8 md:p-12 relative overflow-hidden max-h-[90vh] overflow-y-auto">
        
        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-block bg-indigo-50 text-indigo-600 px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest mb-4">
            Specialization Required
          </div>
          <h2 className="text-3xl md:text-4xl font-black text-gray-800 tracking-tight">
            Select Your Tech Path
          </h2>
          <p className="text-gray-500 mt-2 max-w-lg mx-auto">
            Choose the technology course you are currently enrolled in as instructed by your teacher.
          </p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {TECH_COURSES.map((course) => (
            <button
              key={course.name}
              disabled={loading}
              onClick={() => handleSelect(course.name)}
              className="flex flex-col text-left p-6 rounded-3xl border border-gray-100 hover:border-indigo-200 hover:bg-indigo-50/30 transition-all group relative"
            >
              <div className={`${course.color} w-12 h-12 rounded-2xl flex items-center justify-center text-white mb-4 group-hover:scale-110 transition-transform shadow-lg`}>
                <course.icon size={24} />
              </div>
              <h3 className="font-bold text-gray-800 text-lg mb-2">{course.name}</h3>
              <p className="text-gray-500 text-sm leading-relaxed mb-6 flex-1">
                {course.desc}
              </p>
              <span className="text-xs font-black uppercase tracking-wider text-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity">
                Choose Path →
              </span>
            </button>
          ))}
        </div>

        {error && (
          <div className="mt-8 p-4 bg-red-50 text-red-600 rounded-2xl text-center text-sm font-bold border border-red-100 italic">
            {error}
          </div>
        )}

        {loading && (
          <div className="absolute inset-0 bg-white/60 backdrop-blur-[2px] flex items-center justify-center rounded-[2.5rem]">
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
              <p className="mt-4 text-indigo-600 font-bold">Saving your path...</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
