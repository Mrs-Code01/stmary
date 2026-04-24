"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import { useRouter, useParams } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { 
  Loader2, ChevronRight, ChevronLeft, 
  Send, AlertTriangle, Clock, Target, 
  CheckCircle2, XCircle, Info
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

// ─── Component ───────────────────────────────────────────────────────────────

export default function TakeAssessment() {
  const router = useRouter();
  const params = useParams();
  const assessmentId = params.id;

  const [student,    setStudent]    = useState(null);
  const [assessment, setAssessment] = useState(null);
  const [questions,  setQuestions]  = useState([]);
  const [session,    setSession]    = useState(null);
  
  const [loading,     setLoading]     = useState(true);
  const [error,       setError]       = useState("");
  const [showWarning, setShowWarning] = useState(true);
  const [activeIdx,   setActiveIdx]   = useState(0);
  const [answers,     setAnswers]     = useState({}); // { [qId]: 'a'|'b'|'c'|'d' }

  const [timeLeft,   setTimeLeft]   = useState(30 * 60); // 30 minutes in seconds
  const [quizStarted, setQuizStarted] = useState(false);
  const [submitting,  setSubmitting]  = useState(false);
  const [result,      setResult]      = useState(null); // { correct, total, score, totalScore }

  // ── Auth & Data Loading ───────────────────────────────────────────────────
  useEffect(() => {
    const s = getStudentFromCookie();
    if (!s) { router.replace("/smcs/student/login"); return; }
    setStudent(s);
    
    const init = async () => {
      // 1. Fetch Session Info
      const { data: sess } = await supabase.from("student_courses").select("*").eq("student_id", s.id).maybeSingle();
      if (!sess) { setError("No active session."); setLoading(false); return; }
      setSession(sess);

      // 2. Fetch Assessment Row
      const { data: assm, error: assmErr } = await supabase.from("assessments").select("*").eq("id", assessmentId).single();
      if (assmErr || !assm) { setError("Assessment not found."); setLoading(false); return; }
      if (!assm.is_published) { setError("This assessment is not yet published."); setLoading(false); return; }
      setAssessment(assm);
      setTimeLeft(assm.time_limit * 60);

      // 3. Verify No Existing Result
      const { data: existing } = await supabase.from("student_assessment_results")
        .select("id")
        .eq("student_id", s.id)
        .eq("assessment_id", assessmentId)
        .maybeSingle();
      
      if (existing) { setError("You have already completed this Month Assessment."); setLoading(false); return; }

      // 4. Fetch Questions
      const { data: qs } = await supabase.from("assessment_questions").select("*").eq("assessment_id", assessmentId).order("question_order", { ascending: true });
      if (!qs || qs.length === 0) { setError("No questions found in this assessment."); setLoading(false); return; }
      setQuestions(qs);
      
      setLoading(false);
    };
    init();
  }, [assessmentId, router]);

  // ── Timer Logic ─────────────────────────────────────────────────────────────
  useEffect(() => {
    let timer;
    if (quizStarted && timeLeft > 0 && !result) {
      timer = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
    } else if (timeLeft === 0 && quizStarted && !result) {
      handleSubmit(null, true); // Auto-submit
    }
    return () => clearInterval(timer);
  }, [quizStarted, timeLeft, result]);

  // ── Handlers ───────────────────────────────────────────────────────────────
  
  const startQuiz = () => {
    setShowWarning(false);
    setQuizStarted(true);
  };

  const setAnswer = (qId, val) => {
    if (result) return;
    setAnswers(prev => ({ ...prev, [qId]: val }));
  };

  const handleSubmit = async (e, isAuto = false) => {
    if (e) e.preventDefault();
    if (submitting || result) return;
    
    setSubmitting(true);
    setError("");

    // Calculate score
    let correctCount = 0;
    questions.forEach(q => {
      const studentAnswer = (answers[q.id] || "").trim().toLowerCase();
      const correctAnswer = (q.correct_option || "").trim().toLowerCase();
      
      if (studentAnswer === correctAnswer) {
        correctCount++;
      }
    });

    const totalQ = questions.length;
    // monthly_score = (correct / total) * (100/3) -> max 33.333...% per month
    const scoreVal = Number(((correctCount / totalQ) * (100 / 3)).toFixed(1));

    const payload = {
      student_id:       student.id,
      assessment_id:    assessmentId,
      course_name:      assessment.course_name,
      month_number:     assessment.month_number,
      correct_answers:  correctCount,
      total_questions:  totalQ,
      monthly_score:    scoreVal,
      session_start:    session.session_start,
      submitted_at:     new Date().toISOString()
    };

    const { error: dbErr } = await supabase.from("student_assessment_results").insert(payload);

    if (dbErr) {
      setError("Failed to save results: " + dbErr.message);
      setSubmitting(false);
      return;
    }

    // Success
    setResult({
      correct: correctCount,
      total: totalQ,
      score: scoreVal,
      isAuto
    });
    setSubmitting(false);
  };

  // ── Progress UI ────────────────────────────────────────────────────────────
  const progressPercent = ((activeIdx + 1) / questions.length) * 100;
  const currentQ = questions[activeIdx];
  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  // ── Render ──────────────────────────────────────────────────────────────────

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F8F9FE] flex flex-col items-center justify-center p-10">
        <Loader2 className="animate-spin text-indigo-400 mb-6" size={48} />
        <p className="text-gray-400 font-black uppercase tracking-widest text-[10px]">Assembling Exam Engine…</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#F8F9FE] flex items-center justify-center p-6">
        <div className="w-full max-w-sm bg-white rounded-[2.5rem] p-10 text-center border border-gray-100 shadow-xl">
           <div className="w-16 h-16 bg-amber-50 rounded-2xl flex items-center justify-center mx-auto mb-6 text-amber-500 border border-amber-100">
              <AlertTriangle size={32} />
           </div>
           <h2 className="text-xl font-bold text-gray-800 mb-3 underline underline-offset-4 decoration-amber-200">Notice</h2>
           <p className="text-gray-400 text-sm font-medium leading-relaxed mb-8">{error}</p>
           <button onClick={() => router.replace("/smcs/student/tech-assessment")} className="w-full bg-gray-900 text-white py-4 rounded-xl font-bold uppercase tracking-widest text-xs hover:bg-gray-800 transition-all active:scale-95 shadow-lg shadow-gray-200">
             Back to Portal
           </button>
        </div>
      </div>
    );
  }

  // ── SUCCESS SCREEN ──────────────────────────────────────────────────
  if (result) {
    return (
      <div className="min-h-screen bg-[#F8F9FE] flex items-center justify-center p-6 animate-in zoom-in-95 duration-500">
        <div className="w-full max-w-md bg-white rounded-[3rem] p-10 md:p-14 text-center border border-gray-50 shadow-2xl relative overflow-hidden">
           
           <div className={`w-20 h-20 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-lg ring-4 ring-offset-4
             ${result.score > 0 ? 'bg-green-500 text-white ring-green-100' : 'bg-red-500 text-white ring-red-100'}`}>
              {result.score > 0 ? <CheckCircle2 size={40} /> : <XCircle size={40} />}
           </div>

           <h1 className="text-3xl font-black text-gray-900 mb-2 tracking-tight">Assessment Complete!</h1>
           <p className="text-gray-400 text-sm font-bold uppercase tracking-widest mb-10">
             {result.isAuto ? "⏰ Time Expired (Auto-Submitted)" : "✓ Activity Recorded Successfully"}
           </p>

           <div className="grid grid-cols-2 gap-4 mb-10">
              <div className="bg-gray-50 p-6 rounded-3xl border border-gray-100">
                 <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Performance</p>
                 <p className="text-2xl font-black text-gray-800">{result.correct} / {result.total}</p>
              </div>
              <div className="bg-indigo-50 p-6 rounded-3xl border border-indigo-100">
                 <p className="text-[10px] font-black text-indigo-400 uppercase tracking-widest mb-2">Session Score</p>
                 <p className="text-2xl font-black text-indigo-600">{result.score}%</p>
              </div>
           </div>

           <p className="text-gray-400 text-xs leading-relaxed mb-10 px-4">
             {result.score > 0 
               ? "Great job! Your performance has been recorded in your session profile. You can see your updated total on the dashboard."
               : "Unfortunately, your score was low. Keep learning and focus more on the next month's assessment to improve your total percentage."}
           </p>

           <button 
             onClick={() => router.replace("/smcs/student/tech-assessment")} 
             className="w-full bg-indigo-600 text-white py-5 rounded-[1.5rem] font-bold uppercase tracking-widest text-xs hover:bg-indigo-700 transition-all active:scale-95 shadow-xl shadow-indigo-100"
           >
             Continue to Dashboard →
           </button>
           
           {/* Deco */}
           <div className="absolute top-[-10%] right-[-10%] w-32 h-32 bg-indigo-50/50 rounded-full blur-2xl" />
        </div>
      </div>
    );
  }

  // ── PRE-QUIZ MODAL ──────────────────────────────────────────────────
  if (showWarning) {
    return (
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-[#000a18]/90 backdrop-blur-xl animate-in fade-in duration-300">
         <div className="w-full max-w-sm bg-white rounded-[2.5rem] p-10 md:p-12 text-center border border-white/10 shadow-[0_32px_128px_rgba(0,0,0,0.5)]">
            <div className="w-16 h-16 bg-red-50 rounded-2xl flex items-center justify-center mx-auto mb-8 text-red-500 ring-2 ring-red-100">
               <Clock size={32} />
            </div>
            <h2 className="text-2xl font-black text-gray-900 mb-4 uppercase tracking-tighter">Ready to Start?</h2>
            
            <div className="space-y-4 text-gray-500 text-sm font-medium leading-relaxed mb-10">
               <p className="flex items-center gap-3 px-4 py-3 bg-gray-50 rounded-xl">
                 <Target size={18} className="text-indigo-600" />
                 Total {questions.length} Questions
               </p>
               <p className="flex items-center gap-3 px-4 py-3 bg-red-50 text-red-600 rounded-xl font-bold">
                 <AlertTriangle size={18} />
                 Time Limit: 30 Minutes
               </p>
               <p className="bg-amber-50 text-amber-600 px-4 py-4 rounded-xl text-xs font-bold ring-1 ring-amber-100">
                 ⚠️ Unanswered questions will be automatically marked incorrect if time runs out.
               </p>
            </div>

            <button 
              onClick={startQuiz} 
              className="w-full bg-indigo-600 text-white py-5 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-indigo-700 transition-all active:scale-95 shadow-xl shadow-indigo-100 flex items-center justify-center gap-3"
            >
              Start 30min Timer <ChevronRight size={18} />
            </button>
            <button 
              onClick={() => router.back()} 
              className="mt-4 text-gray-400 font-bold uppercase tracking-widest text-[9px] hover:text-gray-900 transition-colors"
            >
              Maybe Later
            </button>
         </div>
      </div>
    );
  }

  // ── MAIN QUIZ ENGINE ───────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-[#F8F9FE] p-6 lg:p-12 font-sans text-gray-900 select-none">
       
       <header className="max-w-4xl mx-auto flex items-center justify-between mb-8">
          <div>
             <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mb-1">Assessment In Progress</h4>
             <h1 className="text-lg md:text-xl font-black text-gray-800">{assessment.title}</h1>
          </div>
          <div className={`flex items-center gap-3 px-6 py-3 rounded-2xl border-2 font-black transition-all
            ${timeLeft < 300 ? 'bg-red-50 border-red-200 text-red-600 animate-pulse' : 'bg-white border-gray-100 text-gray-700 shadow-sm'}`}>
             <Clock size={16} />
             <span className="text-lg">{formatTime(timeLeft)}</span>
          </div>
       </header>

       <div className="max-w-4xl mx-auto">
          {/* Progress Bar */}
          <div className="bg-white p-4 rounded-3xl border border-gray-100 shadow-sm mb-8">
             <div className="flex justify-between items-center mb-3 px-2">
                <span className="text-xs font-black text-gray-400 uppercase tracking-widest">Question {activeIdx + 1} of {questions.length}</span>
                <span className="text-xs font-black text-indigo-600 uppercase tracking-widest">{Math.round(progressPercent)}% Done</span>
             </div>
             <div className="h-2 bg-gray-50 rounded-full overflow-hidden">
                <div className="h-full bg-indigo-600 transition-all duration-500 ease-out" style={{ width: `${progressPercent}%` }} />
             </div>
          </div>

          {/* Question Card */}
          <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-2xl p-8 md:p-14 relative overflow-hidden animate-in slide-in-from-right-4 duration-300">
             
             <div className="relative z-10">
                <div className="mb-10 text-xl md:text-2xl lg:text-3xl font-black text-gray-900 leading-snug">
                   {currentQ.question_text}
                </div>

                {currentQ.question_type === "theory" ? (
                  <div className="space-y-4">
                    <label className="text-[10px] font-black text-indigo-400 uppercase tracking-widest pl-2">Type your answer below</label>
                    <textarea
                      rows={4}
                      value={answers[currentQ.id] || ""}
                      onChange={(e) => setAnswer(currentQ.id, e.target.value)}
                      placeholder="Enter the correct term or phrase..."
                      className="w-full bg-gray-50 border-2 border-gray-50 rounded-[2rem] p-8 text-lg font-bold text-gray-800 placeholder:text-gray-300 focus:outline-none focus:border-indigo-100 focus:bg-white transition-all resize-none shadow-inner"
                    />
                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest pl-2 italic">Note: Ensure correct spelling for auto-marking.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {['a', 'b', 'c', 'd', 'e'].filter(key => currentQ[`option_${key}`]).map(key => {
                        const optLabel = `option_${key}`;
                        const active = answers[currentQ.id] === key;
                        return (
                          <button
                            key={key}
                            onClick={() => setAnswer(currentQ.id, key)}
                            className={`flex items-center gap-5 p-6 rounded-[1.5rem] text-left border-2 transition-all duration-200 group
                              ${active 
                                ? "bg-indigo-600 border-indigo-600 text-white shadow-xl shadow-indigo-600/20 translate-x-1" 
                                : "bg-gray-50 border-gray-50 hover:bg-white hover:border-indigo-100 text-gray-700 hover:translate-x-1"}`}
                          >
                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-black text-sm uppercase transition-all
                                ${active ? "bg-white text-indigo-600" : "bg-white/50 text-gray-300 group-hover:bg-indigo-50 group-hover:text-indigo-400"}`}>
                                {key}
                            </div>
                            <span className="text-base font-bold flex-1">{currentQ[optLabel]}</span>
                          </button>
                        );
                    })}
                  </div>
                )}
             </div>

             {/* Deco */}
             <div className="absolute top-[-10%] right-[-10%] w-60 h-60 bg-indigo-50/30 rounded-full blur-3xl pointer-events-none" />
          </div>

          {/* Navigation */}
          <div className="flex items-center justify-between mt-10">
             <button
               onClick={() => setActiveIdx(prev => prev - 1)}
               disabled={activeIdx === 0}
               className="flex items-center gap-3 text-gray-400 hover:text-gray-900 font-bold uppercase tracking-widest text-xs transition-all disabled:opacity-20"
             >
                <ChevronLeft size={20} /> Prev
             </button>

             {activeIdx === questions.length - 1 ? (
                <button
                  onClick={() => handleSubmit()}
                  disabled={submitting}
                  className="bg-indigo-600 text-white px-10 py-5 rounded-[1.5rem] font-black uppercase tracking-widest text-xs hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-600/30 flex items-center gap-3 active:scale-95"
                >
                   {submitting ? <Loader2 className="animate-spin" size={20} /> : <Send size={20} />}
                   Submit Final
                </button>
             ) : (
                <button
                  onClick={() => setActiveIdx(prev => prev + 1)}
                  className="bg-gray-900 text-white px-10 py-5 rounded-[1.5rem] font-black uppercase tracking-widest text-xs hover:bg-gray-800 transition-all shadow-xl shadow-gray-200 flex items-center gap-3 group"
                >
                   Next Question <ChevronRight size={20} className="group-hover:translate-x-1 transition-transform" />
                </button>
             )}
          </div>
       </div>

       {/* Footer Help */}
       <div className="max-w-4xl mx-auto mt-20 flex flex-col md:flex-row items-center justify-between py-6 border-t border-gray-200 gap-4">
          <p className="flex items-center gap-2 text-gray-400 text-xs font-bold">
             <Info size={14} />
             Your session progress is automatically monitored.
          </p>
          <div className="flex items-center gap-4">
             <span className="w-2.5 h-2.5 bg-green-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(34,197,94,0.6)]" />
             <span className="text-[10px] font-black uppercase tracking-widest text-gray-500">Live Secure Stream</span>
          </div>
       </div>
    </div>
  );
}
