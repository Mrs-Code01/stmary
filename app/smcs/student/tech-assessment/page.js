"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { 
  Lock, CheckCircle2, PlayCircle, Clock, 
  BarChart3, Calendar, GraduationCap, ArrowRight,
  ShieldCheck, AlertCircle, Info, Loader2, X
} from "lucide-react";

// ─── Helpers ──────────────────────────────────────────────────────────────────

function getStudentFromCookie() {
  if (typeof document === "undefined") return null;
  const match = document.cookie
    .split("; ")
    .find((row) => row.startsWith("smcs_student="));
  if (!match) return null;
  try {
    return JSON.parse(decodeURIComponent(match.split("=").slice(1).join("=")));
  } catch {
    return null;
  }
}

function getRemainingDays(targetDate) {
  const diffTime = new Date(targetDate) - new Date();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays > 0 ? diffDays : 0;
}

// ─── Component ───────────────────────────────────────────────────────────────

export default function StudentTechAssessment() {
  const router = useRouter();
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);

  const [session,     setSession]     = useState(null);   // link to student_courses
  const [assessments, setAssessments] = useState([]);     // assessments for course
  const [results,     setResults]     = useState([]);     // student results for these assessments
  const [error,       setError]       = useState("");

  useEffect(() => {
    const s = getStudentFromCookie();
    if (!s) {
      router.replace("/smcs/student/login");
      return;
    }
    setStudent(s);
    fetchData(s);
  }, [router]);

  const fetchData = async (stud) => {
    setLoading(true);
    setError("");

    // 1. Fetch Session Info
    const { data: sessData } = await supabase
      .from("student_courses")
      .select("*")
      .eq("student_id", stud.id)
      .maybeSingle();
    
    if (!sessData) {
      setError("No active tech course session found. Please select a course first.");
      setLoading(false);
      return;
    }
    setSession(sessData);

    // 2. Fetch Published Assessments for Course
    const { data: assmData } = await supabase
      .from("assessments")
      .select("*")
      .eq("course_name", sessData.course_name)
      .eq("is_published", true)
      .order("month_number", { ascending: true });
    setAssessments(assmData || []);

    // 3. Fetch User's Results
    const { data: resData } = await supabase
      .from("student_assessment_results")
      .select("*")
      .eq("student_id", stud.id)
      .eq("course_name", sessData.course_name);
    setResults(resData || []);

    setLoading(false);
  };

  // ── Logic ───────────────────────────────────────────────────────────────────
  
  const statusMap = useMemo(() => {
    const map = {};
    results.forEach(r => map[r.month_number] = r);
    return map;
  }, [results]);

  const assessmentStatus = (monthNum) => {
    const res = statusMap[monthNum];
    if (res) return { status: "completed", score: res.monthly_score, data: res };

    // Locking logic
    if (monthNum === 1) return { status: "available" };

    const prevMonthRes = statusMap[monthNum - 1];
    if (!prevMonthRes) return { status: "locked", reason: `Complete Month ${monthNum - 1} first.` };

    // Check 30-day delay
    const submitDate = new Date(prevMonthRes.submitted_at);
    const unlockDate = new Date(submitDate);
    unlockDate.setDate(unlockDate.getDate() + 30);

    if (new Date() < unlockDate) {
      return { 
        status: "locked", 
        reason: `Unlocked in ${getRemainingDays(unlockDate)} days.`,
        date: unlockDate 
      };
    }

    return { status: "available" };
  };

  const totalScore = results.reduce((acc, r) => acc + Number(r.monthly_score), 0);

  // ── Render ────────────────────────────────────────────────────────────────

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Loader2 className="animate-spin text-indigo-400" size={40} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-2xl mx-auto mt-20 p-10 bg-white border border-red-100 rounded-[2.5rem] text-center shadow-sm">
        <div className="w-16 h-16 bg-red-50 text-red-500 rounded-3xl flex items-center justify-center mx-auto mb-6">
          <AlertCircle size={32} />
        </div>
        <h2 className="text-2xl font-black text-gray-900 mb-4">Course Required</h2>
        <p className="text-gray-500 font-medium mb-8">{error}</p>
        <button 
          onClick={() => router.push("/smcs/student/courses")}
          className="bg-indigo-600 text-white px-8 py-4 rounded-2xl font-bold hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-100"
        >
          Go to Courses →
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
      
      {/* Overview Head */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black text-gray-900 tracking-tight mb-2">My Assessments</h1>
          <p className="text-gray-400 text-base font-medium flex items-center gap-2">
            <GraduationCap size={18} className="text-indigo-400" />
            {session.course_name}
          </p>
        </div>
        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex items-center gap-6">
          <div className="text-right">
            <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-1">Total Session Score</p>
            <p className="text-3xl font-black text-indigo-600">{totalScore.toFixed(2)}%</p>
          </div>
          <div className="w-16 h-16 rounded-full border-4 border-indigo-50 bg-indigo-50/20 flex items-center justify-center">
            <BarChart3 size={24} className="text-indigo-500" />
          </div>
        </div>
      </div>

      {/* Progress Card */}
      <div className="bg-gradient-to-br from-indigo-600 to-purple-700 rounded-[2.5rem] p-8 md:p-12 text-white relative overflow-hidden shadow-2xl shadow-indigo-200">
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-6">
             <Clock size={20} className="text-indigo-200" />
             <span className="text-indigo-100 text-sm font-black uppercase tracking-widest">3rd Term / 2026 Session</span>
          </div>
          <h2 className="text-2xl font-bold mb-10 max-w-lg">Complete all 3 assessments to achieve your digital tech certification.</h2>
          
          <div className="space-y-4 max-w-2xl">
            <div className="flex justify-between items-end mb-2">
               <span className="text-sm font-bold text-white/70 uppercase">Monthly Progress</span>
               <span className="text-2xl font-black">{totalScore.toFixed(0)} / 100%</span>
            </div>
            <div className="w-full bg-white/20 rounded-full h-4 relative">
               <div 
                 className="bg-white h-4 rounded-full shadow-lg transition-all duration-1000 ease-out" 
                 style={{ width: `${totalScore}%` }}
               />
               <div className="absolute top-1/2 -translate-y-1/2 left-[33.33%] w-[2px] h-6 bg-white/30" />
               <div className="absolute top-1/2 -translate-y-1/2 left-[66.66%] w-[2px] h-6 bg-white/30" />
            </div>
            <div className="flex justify-between text-[10px] font-black uppercase text-white/50 tracking-tighter pt-4">
               <span>Month 1 (33.3%)</span>
               <span>Month 2 (66.6%)</span>
               <span>Full Cert (100%)</span>
            </div>
          </div>
        </div>
        
        {/* BG Deco */}
        <div className="absolute top-[-50%] right-[-10%] w-[500px] h-[500px] bg-white opacity-5 rounded-full blur-3xl pointer-events-none" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[1, 2, 3].map(month => {
          const assm = assessments.find(a => a.month_number === month);
          const state = assessmentStatus(month);

          return (
            <div 
              key={month}
              className={`relative overflow-hidden group bg-white border border-gray-100 rounded-[2rem] p-8 transition-all hover:shadow-xl hover:-translate-y-2
                ${state.status === "available" ? "ring-2 ring-indigo-600/10 cursor-pointer" : ""}`}
            >
              {/* Month Indicator */}
              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-12 shadow-sm transition-transform group-hover:scale-110 duration-500
                ${state.status === "completed" ? "bg-green-50 text-green-500" : 
                  state.status === "locked" ? "bg-gray-50 text-gray-300" : "bg-indigo-50 text-indigo-600"}`}>
                {state.status === "completed" ? <CheckCircle2 size={28} /> : 
                 state.status === "locked" ? <Lock size={28} /> : <PlayCircle size={28} />}
              </div>

              <div className="mb-4">
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Step 0{month}</span>
                <h3 className="text-xl font-black text-gray-800 uppercase mt-1">Month 0{month} Assessment</h3>
              </div>

              <div className="space-y-4 mb-10 min-h-[50px]">
                {state.status === "completed" ? (
                  <div className="flex flex-col">
                    <span className="text-3xl font-black text-gray-900">{state.score}%</span>
                    <span className="text-xs font-bold text-green-600 mt-1 uppercase tracking-widest">Submitted ✓</span>
                  </div>
                ) : state.status === "locked" ? (
                  <div className="flex items-center gap-2 text-gray-400 font-medium text-sm">
                    <X size={14} className="text-red-300" />
                    {state.reason}
                  </div>
                ) : (
                  <div className="flex items-center gap-3 text-indigo-500 text-sm font-bold bg-indigo-50/50 py-3 px-4 rounded-xl border border-indigo-100">
                    <ShieldCheck size={18} />
                    Ready to Start
                  </div>
                )}
              </div>

              <div className="pt-6 border-t border-gray-50">
                {state.status === "available" && assm ? (
                  <button 
                    onClick={() => router.push(`/smcs/student/tech-assessment/take/${assm.id}`)}
                    className="w-full flex items-center justify-between text-indigo-600 font-black text-sm uppercase tracking-widest group-hover:gap-4 transition-all"
                  >
                    Take Assessment <ArrowRight size={18} />
                  </button>
                ) : state.status === "available" && !assm ? (
                  <span className="text-gray-300 text-[10px] font-black uppercase italic">Not Yet Published</span>
                ) : (
                  <span className={`text-[10px] font-black uppercase tracking-widest
                    ${state.status === "completed" ? "text-green-500" : "text-gray-300"}`}>
                    {state.status === "completed" ? "Activity Recorded" : "Access Restricted"}
                  </span>
                )}
              </div>

              {/* Status Deco Icon */}
              <div className="absolute bottom-[-10px] right-[-10px] text-gray-50 opacity-10 group-hover:scale-125 transition-transform duration-700">
                 {month === 1 ? <Info size={120} /> : month === 2 ? <Calendar size={120} /> : <BarChart3 size={120} />}
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
}
