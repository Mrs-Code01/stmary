"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { 
  Plus, Trash2, Edit2, CheckCircle, Save, 
  ArrowLeft, ChevronRight, Layout, LogOut, 
  FileText, Users, Eye, Send, Loader2, AlertTriangle, X
} from "lucide-react";

// ─── Constants ───────────────────────────────────────────────────────────────

const COURSES = [
  "Prompt Engineering", 
  "Website Development", 
  "AI Automation", 
  "AI Chatbots", 
  "AI Video Creation", 
  "Blockchain Development"
];

const MONTHS = [
  { val: 1, label: "Month 1" },
  { val: 2, label: "Month 2" },
  { val: 3, label: "Month 3" },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

function getTeacherFromCookie() {
  if (typeof document === "undefined") return null;
  const match = document.cookie
    .split("; ")
    .find((row) => row.startsWith("smcs_teacher="));
  if (!match) return null;
  try {
    return JSON.parse(decodeURIComponent(match.split("=").slice(1).join("=")));
  } catch {
    return null;
  }
}

// ─── Component ───────────────────────────────────────────────────────────────

export default function StaffAssessments() {
  const router = useRouter();
  const [teacher, setTeacher] = useState(null);
  const [loading, setLoading] = useState(true);

  // Filter State
  const [selectedCourse, setSelectedCourse] = useState(COURSES[0]);
  const [selectedMonth,  setSelectedMonth]  = useState(1);

  // Assessment Data
  const [assessment,    setAssessment]    = useState(null); // The current assessment row
  const [questions,     setQuestions]     = useState([]);    // Questions for the assessment
  const [results,       setResults]       = useState([]);    // Student results for table
  
  // UI State
  const [view,          setView]          = useState("manage"); // "manage" | "results"
  const [showEditor,    setShowEditor]    = useState(false);
  const [saving,        setSaving]        = useState(false);
  const [publishing,    setPublishing]    = useState(false);
  const [error,         setError]         = useState("");

  // Editor State
  const [editQId,       setEditQId]       = useState(null);
  const [qType,         setQType]         = useState("objective"); // "objective" | "theory"
  const [qText,         setQText]         = useState("");
  const [optA,          setOptA]          = useState("");
  const [optB,          setOptB]          = useState("");
  const [optC,          setOptC]          = useState("");
  const [optD,          setOptD]          = useState("");
  const [optE,          setOptE]          = useState("");
  const [correct,       setCorrect]       = useState("a");

  const [activeTab,     setActiveTab]     = useState("questions"); // "questions" | "results"

  // ── Auth & Init ───────────────────────────────────────────────────────────
  useEffect(() => {
    const t = getTeacherFromCookie();
    if (!t) {
      router.replace("/staff");
      return;
    }
    setTeacher(t);
    fetchAssessmentData();
  }, [selectedCourse, selectedMonth]);

  const fetchAssessmentData = async () => {
    setLoading(true);
    setError("");

    // 1. Fetch Assessment Info
    const { data: assm, error: assmErr } = await supabase
      .from("assessments")
      .select("*")
      .eq("course_name", selectedCourse)
      .eq("month_number", selectedMonth)
      .maybeSingle();

    if (assmErr) {
      setError("Failed to fetch assessment: " + assmErr.message);
      setLoading(false);
      return;
    }

    if (assm) {
      setAssessment(assm);
      // 2. Fetch Questions
      const { data: qs } = await supabase
        .from("assessment_questions")
        .select("*")
        .eq("assessment_id", assm.id)
        .order("question_order", { ascending: true });
      setQuestions(qs || []);

      // 3. Fetch Results
      const { data: res } = await supabase
        .from("student_assessment_results")
        .select(`
          *,
          student:students(full_name, class_id)
        `)
        .eq("assessment_id", assm.id);
      setResults(res || []);
    } else {
      setAssessment(null);
      setQuestions([]);
      setResults([]);
    }
    setLoading(false);
  };

  // ── Create/Manage Assessment ──────────────────────────────────────────────
  const handleCreateAssessment = async () => {
    setSaving(true);
    const { data, error: err } = await supabase
      .from("assessments")
      .insert({
        course_name:  selectedCourse,
        month_number: selectedMonth,
        title:        `${selectedCourse} - Month ${selectedMonth} Assessment`,
        total_questions: 0,
        is_published: false,
        created_by:   teacher.name || teacher.id,
      })
      .select()
      .single();

    if (err) {
      setError("Error creating assessment: " + err.message);
    } else {
      setAssessment(data);
    }
    setSaving(false);
  };

  const handlePublish = async () => {
    if (!assessment || questions.length === 0) return;
    setPublishing(true);
    const { error: err } = await supabase
      .from("assessments")
      .update({ 
        is_published: true, 
        total_questions: questions.length 
      })
      .eq("id", assessment.id);

    if (err) {
      setError("Error publishing: " + err.message);
    } else {
      setAssessment({ ...assessment, is_published: true, total_questions: questions.length });
      
      // Notify Students enrolled in this course
      const { data: students } = await supabase
        .from("students")
        .select("id")
        .eq("tech_course", selectedCourse);

      if (students && students.length > 0) {
        const notifications = students.map(s => ({
          student_id: s.id,
          type: "assessment",
          title: "New Assessment Published",
          message: `A new assessment for ${selectedCourse} (Month ${selectedMonth}) is now available.`,
        }));
        await supabase.from("student_notifications").insert(notifications);
      }
    }
    setPublishing(false);
  };

  // ── Question CRUD ───────────────────────────────────────────────────────────
  const saveQuestion = async (e) => {
    e.preventDefault();
    if (!qText) return;
    if (qType === "objective" && (!optA || !optB || !optC || !optD)) return;
    if (qType === "theory" && !correct) return; // 'correct' stores the phrase for theory

    setSaving(true);

    const qData = {
      assessment_id:  assessment.id,
      question_text:  qText,
      question_type:  qType,
      option_a:       qType === "objective" ? optA : "",
      option_b:       qType === "objective" ? optB : "",
      option_c:       qType === "objective" ? optC : "",
      option_d:       qType === "objective" ? optD : "",
      option_e:       qType === "objective" ? optE : "",
      correct_option: correct,
      question_order: questions.length + (editQId ? 0 : 1)
    };

    let err;
    if (editQId) {
      ({ error: err } = await supabase
        .from("assessment_questions")
        .update(qData)
        .eq("id", editQId));
    } else {
      ({ error: err } = await supabase
        .from("assessment_questions")
        .insert(qData));
    }

    if (err) {
      setError("Error saving question: " + err.message);
    } else {
      closeEditor();
      fetchAssessmentData();
    }
    setSaving(false);
  };

  const deleteQuestion = async (id) => {
    if (!confirm("Are you sure?")) return;
    const { error: err } = await supabase
      .from("assessment_questions")
      .delete()
      .eq("id", id);
    if (!err) fetchAssessmentData();
  };

  const openEditor = (q = null) => {
    if (q) {
      setEditQId(q.id);
      setQType(q.question_type || "objective");
      setQText(q.question_text);
      setOptA(q.option_a || "");
      setOptB(q.option_b || "");
      setOptC(q.option_c || "");
      setOptD(q.option_d || "");
      setOptE(q.option_e || "");
      setCorrect(q.correct_option);
    } else {
      setEditQId(null);
      setQType("objective");
      setQText(""); setOptA(""); setOptB(""); setOptC(""); setOptD(""); setOptE(""); setCorrect("a");
    }
    setShowEditor(true);
  };

  const closeEditor = () => {
    setShowEditor(false);
    setEditQId(null);
  };

  // ── Render Helpers ──────────────────────────────────────────────────────────

  if (!teacher) return null;

  return (
    <div className="min-h-screen bg-[#020813] text-white">
      {/* Header */}
      <header className="border-b border-white/5 px-6 md:px-12 py-5 flex items-center justify-between sticky top-0 bg-[#020813]/80 backdrop-blur-xl z-50">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => router.replace("/staff/" + encodeURIComponent(teacher.class_id) + "/dashboard")}
            className="w-10 h-10 rounded-xl bg-white/5 hover:bg-white/10 text-white/50 hover:text-white transition-all border border-white/5 flex items-center justify-center"
          >
            <ArrowLeft size={18} />
          </button>
          <div>
            <h1 className="text-white font-black text-base uppercase tracking-widest leading-none">Assessment Central</h1>
            <p className="text-white/30 text-[10px] font-bold mt-1 uppercase tracking-tighter">SMCS Staff Dashboard</p>
          </div>
        </div>
        <div className="flex items-center gap-6">
          <div className="hidden md:flex flex-col items-end">
            <span className="text-xs font-bold text-white/70">{teacher.name}</span>
            <span className="text-[10px] text-white/30 font-mono tracking-widest">{teacher.id}</span>
          </div>
        </div>
      </header>

      <main className="max-w-[1400px] mx-auto p-6 md:p-12">
        
        {/* Course & Month Select */}
        <div className="flex flex-col xl:flex-row gap-6 mb-12">
          <div className="flex-1">
            <h2 className="text-white/40 text-xs font-black uppercase tracking-widest mb-4">Course Category</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-3">
              {COURSES.map(c => (
                <button
                  key={c}
                  onClick={() => setSelectedCourse(c)}
                  className={`px-4 py-3.5 rounded-2xl text-[10px] md:text-xs font-black uppercase tracking-wider transition-all border
                    ${selectedCourse === c 
                      ? "bg-indigo-600 border-indigo-500 shadow-xl shadow-indigo-600/20 text-white" 
                      : "bg-white/3 border-white/5 text-white/30 hover:bg-white/5 hover:text-white/60"}`}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>
          <div className="w-full xl:w-72">
            <h2 className="text-white/40 text-xs font-black uppercase tracking-widest mb-4">Assessment Month</h2>
            <div className="flex gap-3">
              {MONTHS.map(m => (
                <button
                  key={m.val}
                  onClick={() => setSelectedMonth(m.val)}
                  className={`flex-1 px-4 py-3.5 rounded-2xl text-xs font-black uppercase tracking-wider transition-all border
                    ${selectedMonth === m.val 
                      ? "bg-amber-500 border-amber-400 text-black shadow-xl shadow-amber-500/10" 
                      : "bg-white/3 border-white/5 text-white/30 hover:bg-white/5 hover:text-white/60"}`}
                >
                  {m.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Status Banner */}
        {assessment && (
          <div className={`mb-10 rounded-3xl p-6 border flex flex-col md:flex-row items-center justify-between gap-6 transition-all animate-in fade-in slide-in-from-top-4
            ${assessment.is_published 
              ? "bg-green-500/5 border-green-500/10" 
              : "bg-amber-500/5 border-amber-500/10"}`}>
            <div className="flex items-center gap-5">
              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg
                ${assessment.is_published ? "bg-green-500 text-black" : "bg-amber-500 text-black"}`}>
                {assessment.is_published ? <CheckCircle size={28} /> : <AlertTriangle size={28} />}
              </div>
              <div>
                <div className="flex items-center gap-3">
                  <h3 className="text-xl font-black">{assessment.title}</h3>
                  <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest
                    ${assessment.is_published ? "bg-green-500/20 text-green-400" : "bg-amber-500/20 text-amber-400"}`}>
                    {assessment.is_published ? "Published" : "Draft"}
                  </span>
                </div>
                <p className="text-white/40 text-xs mt-1 font-medium">
                  {questions.length} Questions · Created by {assessment.created_by} on {new Date(assessment.created_at).toLocaleDateString()}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => setActiveTab("questions")}
                className={`px-5 py-3 rounded-xl text-xs font-black uppercase tracking-widest flex items-center gap-2 transition-all
                  ${activeTab === "questions" ? "bg-white/10 text-white shadow-lg" : "text-white/30 hover:text-white"}`}
              >
                <FileText size={16} /> Manage Questions
              </button>
              <button
                onClick={() => setActiveTab("results")}
                className={`px-5 py-3 rounded-xl text-xs font-black uppercase tracking-widest flex items-center gap-2 transition-all
                  ${activeTab === "results" ? "bg-white/10 text-white shadow-lg" : "text-white/30 hover:text-white"}`}
              >
                <Users size={16} /> View Results
              </button>
              {!assessment.is_published && questions.length > 0 && (
                <button
                  onClick={handlePublish}
                  disabled={publishing}
                  className="bg-indigo-600 hover:bg-indigo-500 text-white px-6 py-3 rounded-xl text-xs font-black uppercase tracking-widest flex items-center gap-2 shadow-xl shadow-indigo-600/20 active:scale-95 disabled:opacity-50 transition-all ml-4"
                >
                  {publishing ? <Loader2 className="animate-spin" size={16} /> : <Send size={16} />}
                  Final Upload
                </button>
              )}
            </div>
          </div>
        )}

        {/* Content Area */}
        {!assessment ? (
          <div className="bg-white/3 border border-white/5 rounded-[2.5rem] p-20 text-center animate-in zoom-in-95 duration-500">
            <div className="w-20 h-20 bg-white/5 rounded-3xl flex items-center justify-center mx-auto mb-8 text-white/10 ring-1 ring-white/5">
              <AlertTriangle size={40} />
            </div>
            <h2 className="text-2xl font-black text-white/50 mb-3">No Assessment Found</h2>
            <p className="text-white/20 text-sm max-w-sm mx-auto mb-10 leading-relaxed font-medium">
              There is no assessment created for <span className="text-white/40 font-bold">{selectedCourse}</span> in <span className="text-white/40 font-bold">Month {selectedMonth}</span> yet.
            </p>
            <button
              onClick={handleCreateAssessment}
              disabled={saving}
              className="bg-white text-black px-10 py-4 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-white/90 transition-all active:scale-95 shadow-xl shadow-white/5 flex items-center gap-3 mx-auto"
            >
              {saving ? <Loader2 className="animate-spin" /> : <Plus size={18} />}
              Create Month {selectedMonth} Draft
            </button>
          </div>
        ) : (
          <div className="space-y-8 animate-in fade-in duration-500">
            
            {activeTab === "questions" ? (
              <>
                <div className="flex items-center justify-between">
                  <h2 className="text-white/40 text-xs font-black uppercase tracking-widest">Question Bank</h2>
                  <button
                    onClick={() => openEditor()}
                    className="bg-white/5 hover:bg-white/10 text-white/80 px-4 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2 transition-all border border-white/5"
                  >
                    <Plus size={14} /> Add New Question
                  </button>
                </div>

                <div className="grid grid-cols-1 gap-4">
                  {questions.length === 0 ? (
                    <div className="p-20 border border-dashed border-white/5 rounded-[2rem] text-center bg-white/1 shadow-inner">
                      <p className="text-white/20 text-sm font-bold">No questions added yet. Start by adding your first question above.</p>
                    </div>
                  ) : (
                    questions.map((q, idx) => (
                      <div key={q.id} className="group bg-white/3 border border-white/5 rounded-3xl p-8 hover:bg-white/5 transition-all">
                        <div className="flex items-start justify-between gap-6">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-4">
                              <span className="w-8 h-8 rounded-lg bg-white/5 text-white/40 flex items-center justify-center text-xs font-black">
                                {idx + 1}
                              </span>
                              <h4 className="text-lg font-bold text-white/80 leading-snug">{q.question_text}</h4>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pl-11">
                              {[
                                { key: 'a', val: q.option_a },
                                { key: 'b', val: q.option_b },
                                { key: 'c', val: q.option_c },
                                { key: 'd', val: q.option_d },
                                { key: 'e', val: q.option_e },
                              ].filter(o => o.val).map(opt => (
                                <div key={opt.key} className={`px-4 py-3 rounded-xl border text-xs flex items-center gap-3 font-medium transition-all
                                  ${q.correct_option === opt.key 
                                    ? "bg-green-500/10 border-green-500/30 text-green-400 font-bold" 
                                    : "bg-white/5 border-white/5 text-white/40"}`}>
                                  <span className={`w-6 h-6 rounded-md flex items-center justify-center text-[10px] font-black uppercase
                                    ${q.correct_option === opt.key ? "bg-green-500 text-black" : "bg-white/10 text-white/40"}`}>
                                    {opt.key}
                                  </span>
                                  {opt.val}
                                </div>
                              ))}
                            </div>
                          </div>
                          <div className="flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button 
                              onClick={() => openEditor(q)}
                              className="w-10 h-10 rounded-xl bg-indigo-600/10 hover:bg-indigo-600/20 text-indigo-400 flex items-center justify-center transition-all shadow-lg"
                            >
                              <Edit2 size={16} />
                            </button>
                            <button 
                              onClick={() => deleteQuestion(q.id)}
                              className="w-10 h-10 rounded-xl bg-red-600/10 hover:bg-red-600/20 text-red-500 flex items-center justify-center transition-all shadow-lg"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </>
            ) : (
              // Results Tab
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-white/40 text-xs font-black uppercase tracking-widest">Student Performance Overview</h2>
                  <button className="text-white/30 hover:text-white text-[10px] font-black uppercase tracking-widest transition-all">
                    Export to CSV (Coming Soon)
                  </button>
                </div>
                
                <div className="bg-white/3 border border-white/5 rounded-[2.5rem] overflow-hidden">
                  <div className="overflow-x-auto w-full">
                    <table className="w-full text-left min-w-[800px]">
                      <thead>
                        <tr className="bg-white/5 text-[10px] font-black uppercase tracking-[0.2em] text-white/40">
                          <th className="px-8 py-5">Student</th>
                          <th className="px-8 py-5">Class</th>
                          <th className="px-8 py-5 text-center">Correct</th>
                          <th className="px-8 py-5 text-center">Score</th>
                          <th className="px-8 py-5 text-right">Submitted At</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/5">
                        {results.length === 0 ? (
                          <tr>
                            <td colSpan="5" className="px-8 py-20 text-center text-white/20 text-sm font-medium">
                              No submissions found for this assessment yet.
                            </td>
                          </tr>
                        ) : (
                          results.map(r => (
                            <tr key={r.id} className="hover:bg-white/1 transition-colors group">
                              <td className="px-8 py-5">
                                <div className="flex items-center gap-3">
                                  <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500/20 to-purple-500/20 flex items-center justify-center text-indigo-300 font-black text-xs border border-indigo-500/10">
                                    {r.student?.full_name?.charAt(0) || "S"}
                                  </div>
                                  <div>
                                    <p className="text-sm font-bold text-white group-hover:text-indigo-400 transition-colors uppercase tracking-wide">
                                      {r.student?.full_name}
                                    </p>
                                    <p className="text-[10px] text-white/30 font-mono mt-0.5">{r.student_id}</p>
                                  </div>
                                </div>
                              </td>
                              <td className="px-8 py-5">
                                <span className="px-2 py-1 rounded-md bg-white/5 text-white/40 text-[10px] font-bold border border-white/5">
                                  {r.student?.class_id?.replace(/_/g, " ")}
                                </span>
                              </td>
                              <td className="px-8 py-5 text-center text-sm font-bold text-white/70">
                                {r.correct_answers} / {r.total_questions}
                              </td>
                              <td className="px-8 py-5 text-center">
                                <span className="text-xl font-black text-indigo-400">{r.monthly_score}%</span>
                              </td>
                              <td className="px-8 py-5 text-right text-[10px] font-mono text-white/30">
                                {new Date(r.submitted_at).toLocaleString()}
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </main>

      {/* Editor Modal */}
      {showEditor && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-[#000d1e]/90 backdrop-blur-xl animate-in fade-in duration-300">
          <div className="w-full max-w-2xl bg-white border border-gray-100 rounded-[2.5rem] p-8 md:p-12 shadow-[0_32px_128px_rgba(0,0,0,0.5)] overflow-y-auto max-h-[90vh]">
            <div className="flex justify-between items-center mb-10">
              <h3 className="text-3xl font-black text-gray-900 tracking-tight">
                {editQId ? "Edit Question" : "Add New Question"}
              </h3>
              <button onClick={closeEditor} className="p-3 text-gray-300 hover:text-gray-900 transition-colors bg-gray-50 rounded-2xl">
                <X size={24} />
              </button>
            </div>

            <form onSubmit={saveQuestion} className="space-y-8">
              <div>
                <label className="text-gray-400 text-xs font-black uppercase tracking-widest block mb-3">Question Prompt</label>
                <textarea
                  value={qText}
                  onChange={(e) => setQText(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-6 py-5 text-gray-900 placeholder:text-gray-300 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all text-base min-h-[120px] font-medium"
                  placeholder="e.g. What is the main purpose of a Prompt in LLMs?"
                  required
                />
              </div>

              <div className="flex gap-2">
                {[
                  { id: "objective", label: "Objective" },
                  { id: "theory", label: "Theory" }
                ].map((t) => (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => {
                      setQType(t.id);
                      if (t.id === "theory") setCorrect("");
                      else setCorrect("a");
                    }}
                    className={`px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border
                      ${qType === t.id 
                        ? "bg-indigo-600 border-indigo-500 text-white shadow-lg" 
                        : "bg-gray-50 border-gray-100 text-gray-400 hover:text-gray-600"}`}
                  >
                    {t.label}
                  </button>
                ))}
              </div>

              {qType === "objective" ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {[
                    { key: "a", val: optA, set: setOptA },
                    { key: "b", val: optB, set: setOptB },
                    { key: "c", val: optC, set: setOptC },
                    { key: "d", val: optD, set: setOptD },
                    { key: "e", val: optE, set: setOptE },
                  ].map((opt) => (
                    <div key={opt.key}>
                      <label className="text-gray-400 text-[10px] font-black uppercase tracking-[0.2em] block mb-3 flex items-center justify-between">
                        Option {opt.key.toUpperCase()}
                        <input 
                          type="radio" 
                          name="correct" 
                          checked={correct === opt.key} 
                          onChange={() => setCorrect(opt.key)}
                          className="w-4 h-4 accent-indigo-600 cursor-pointer"
                        />
                      </label>
                      <input
                        type="text"
                        value={opt.val}
                        onChange={(e) => opt.set(e.target.value)}
                        className={`w-full bg-gray-50 border rounded-2xl px-5 py-4 text-gray-900 text-sm font-bold transition-all
                          ${correct === opt.key ? "border-indigo-500 ring-1 ring-indigo-500 bg-indigo-50/50" : "border-gray-100 focus:border-indigo-300"}`}
                        placeholder={opt.key === 'e' ? "Choice E (Optional)..." : `Choice ${opt.key.toUpperCase()}...`}
                        required={opt.key !== 'e'}
                      />
                    </div>
                  ))}
                </div>
              ) : (
                <div>
                  <label className="text-gray-400 text-xs font-black uppercase tracking-widest block mb-3">Correct Answer (Exact Phrase)</label>
                  <input
                    type="text"
                    value={correct}
                    onChange={(e) => setCorrect(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-6 py-5 text-gray-900 placeholder:text-gray-300 focus:outline-none focus:border-indigo-500 transition-all font-bold"
                    placeholder="e.g. Nigeria"
                    required
                  />
                  <p className="text-[10px] text-gray-400 mt-2 font-bold uppercase tracking-widest">Student must match this phrase exactly to get the score.</p>
                </div>
              )}

              {error && (
                <div className="bg-red-50 border border-red-100 rounded-2xl px-6 py-4 text-red-500 text-sm font-bold flex items-center gap-3">
                  <AlertTriangle size={18} />
                  {error}
                </div>
              )}

              <div className="flex gap-4 pt-4 border-t border-gray-100 pt-8">
                <button
                  type="button"
                  onClick={closeEditor}
                  className="flex-1 py-4.5 rounded-[1.25rem] border border-gray-100 text-gray-400 font-black text-xs uppercase tracking-widest hover:bg-gray-50 transition-all"
                >
                  Discard
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="flex-[2] py-4.5 rounded-[1.25rem] bg-gray-900 text-white font-black text-xs uppercase tracking-widest hover:bg-indigo-600 transition-all shadow-2xl active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {saving && <Loader2 className="animate-spin" size={16} />}
                  {editQId ? "Save Changes" : "Add to Library"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
