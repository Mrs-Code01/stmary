"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { FaTimes, FaPlus, FaTrash } from "react-icons/fa";

const TECH_COURSES = [
  "Prompt Engineering", 
  "Website Development", 
  "AI Automation", 
  "AI Chatbots", 
  "AI Video Creation", 
  "Blockchain Development"
];

const OPTIONS = ["A", "B", "C", "D", "E"];

function newQuestion() {
  return {
    question: "",
    type: "objective", // "objective" | "theory"
    option_a: "", option_b: "", option_c: "", option_d: "", option_e: "",
    correct_answer: "",
  };
}

export default function UploadAssignmentModal({ type, classId, initialData, onClose, onRefresh }) {
  const [questions, setQuestions] = useState(initialData?.questions || [newQuestion()]);
  const [availableSubjects, setAvailableSubjects] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [lastWasDraft, setLastWasDraft] = useState(false);

  const isTech = type === "tech_assessment";
  const [subject, setSubject] = useState(initialData?.subject || "");

  useEffect(() => {
    if (!isTech) {
      fetchSubjects();
    } else {
      if (!subject) setSubject(TECH_COURSES[0]);
    }
  }, []);

  const fetchSubjects = async () => {
    const rawCid = classId.replace('_', '');
    const { data } = await supabase
      .from("subjects")
      .select("*")
      .or(`class_name.eq.${classId},class_name.eq.${rawCid}`)
      .order("name", { ascending: true });
    
    if (data && data.length > 0) {
      setAvailableSubjects(data);
      if (!subject) setSubject(data[0].name);
    }
  };

  const label = type === "school_assignment" ? "School Assignment" : "Tech Assessment";
  const actionText = initialData ? "Update" : "Upload";

  const updateQuestion = (idx, field, value) => {
    setQuestions((prev) =>
      prev.map((q, i) => (i === idx ? { ...q, [field]: value } : q))
    );
  };

  const addQuestion = () => setQuestions((prev) => [...prev, newQuestion()]);
  const removeQuestion = (idx) =>
    setQuestions((prev) => prev.filter((_, i) => i !== idx));

  const handleSubmit = async (isDraft = false) => {
    setError("");
    for (let i = 0; i < questions.length; i++) {
      const q = questions[i];
      if (!q.question.trim()) {
        setError(`Question ${i + 1} text is required.`);
        return;
      }
      if (q.type === "objective") {
        if (!q.option_a.trim() || !q.option_b.trim()) {
          setError(`Question ${i + 1}: at least options A and B are required.`);
          return;
        }
        if (!q.correct_answer && !isDraft) {
          setError(`Question ${i + 1}: please select the correct answer.`);
          return;
        }
      }
    }

    setLoading(true);
    const assignmentStatus = isDraft ? 'draft' : 'published';

    if (initialData) {
      const { error: dbErr } = await supabase
        .from("assignments")
        .update({ subject, questions, status: assignmentStatus })
        .eq("id", initialData.id);

      if (dbErr) {
        setLoading(false);
        setError("Update failed: " + dbErr.message);
        return;
      }
    } else {
      const normalizedClassId = classId.toUpperCase().replace(/\s+|_/g, '').replace(/([A-Z]+)(\d+.*)/, '$1_$2');
      const { data: newAss, error: dbErr } = await supabase.from("assignments").insert({
        class_id: normalizedClassId,
        subject,
        type,
        questions,
        status: assignmentStatus,
        month: 1
      }).select().single();

      if (dbErr) {
        setLoading(false);
        setError("Save failed: " + dbErr.message);
        return;
      }

      // Only notify if NOT a draft
      if (!isDraft) {
        let studentQuery = supabase.from("students").select("id").eq("class_id", classId);
        const { data: students } = await studentQuery;

        if (students && students.length > 0) {
          const notifs = students.map(s => ({
            student_id: s.id,
            type: "assignment",
            title: `New Assignment: ${subject}`,
            message: `A new ${subject} assignment has been uploaded for your class.`,
          }));
          await supabase.from("student_notifications").insert(notifs);
        }
      }
    }

    setLoading(false);
    setLastWasDraft(isDraft);
    setSuccess(true);
    if (onRefresh) onRefresh();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center p-4 bg-black/70 backdrop-blur-sm overflow-y-auto py-8">
      <div className="w-full max-w-2xl bg-[#00142a] border border-white/10 rounded-3xl shadow-[0_40px_100px_rgba(0,0,0,0.7)] relative">
        {/* Header */}
        <div className="flex items-center justify-between px-8 py-6 border-b border-white/5">
          <div>
            <p className="text-white/40 text-xs font-bold uppercase tracking-widest mb-0.5">{actionText}</p>
            <h2 className="text-xl font-black text-white">{label}</h2>
          </div>
          <button onClick={onClose} className="text-white/30 hover:text-white transition-colors">
            <FaTimes size={18} />
          </button>
        </div>

        {success ? (
          <div className="px-8 py-12 text-center space-y-4">
            <p className="text-5xl">✅</p>
            <p className="text-white font-black text-xl">
              {lastWasDraft ? "Saved as Draft" : `${initialData ? "Updated" : "Uploaded"} Successfully!`}
            </p>
            <p className="text-white/40 text-sm">
              {lastWasDraft 
                ? "This assignment has been saved but is NOT yet visible to students."
                : `The ${label.toLowerCase()} has been saved and is now visible to all students in this class.`
              }
            </p>
            <button
              onClick={onClose}
              className="bg-[#0096ff] text-white px-8 py-3 rounded-xl font-black text-sm uppercase tracking-wider hover:bg-[#00BFFF] transition-all mt-4"
            >
              Done
            </button>
          </div>
        ) : (
          <div className="px-8 py-6 space-y-6">
            {/* Subject & Month Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-white/60 text-xs font-bold uppercase tracking-wider block mb-2">
                  {isTech ? "Tech Course" : "Subject"}
                </label>
                <select
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#0096ff] transition-colors text-sm"
                >
                  {isTech ? (
                    TECH_COURSES.map((s) => (
                      <option key={s} value={s} style={{ background: "#00142a" }}>{s}</option>
                    ))
                  ) : (
                    availableSubjects.map((s) => (
                      <option key={s.id} value={s.name} style={{ background: "#00142a" }}>{s.name}</option>
                    ))
                  )}
                </select>
              </div>

              {isTech && (
                <div>
                  <label className="text-white/60 text-xs font-bold uppercase tracking-wider block mb-2">Month</label>
                  <select
                    value={month}
                    onChange={(e) => setMonth(parseInt(e.target.value))}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#0096ff] transition-colors text-sm"
                  >
                    {[1, 2, 3, 4, 5].map((m) => (
                      <option key={m} value={m} style={{ background: "#00142a" }}>Month {m}</option>
                    ))}
                  </select>
                </div>
              )}
            </div>

            {/* Questions */}
            <div className="space-y-6">
              {questions.map((q, idx) => (
                <div key={idx} className="bg-white/3 border border-white/5 rounded-2xl p-5 space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-white/40 text-xs font-bold uppercase tracking-wider">
                      Question {idx + 1}
                    </span>
                    {questions.length > 1 && (
                      <button
                        onClick={() => removeQuestion(idx)}
                        className="text-red-400/50 hover:text-red-400 transition-colors"
                      >
                        <FaTrash size={12} />
                      </button>
                    )}
                  </div>

                  {/* Question Text */}
                  <textarea
                    rows={2}
                    value={q.question}
                    onChange={(e) => updateQuestion(idx, "question", e.target.value)}
                    placeholder="Type your question here…"
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-[#0096ff] transition-colors text-sm resize-none"
                  />

                  {/* Type Toggle */}
                  <div className="flex gap-2">
                    {["objective", "theory"].map((t) => (
                      <button
                        key={t}
                        onClick={() => updateQuestion(idx, "type", t)}
                        className={`px-4 py-1.5 rounded-lg text-xs font-black uppercase tracking-wider transition-all ${
                          q.type === t
                            ? "bg-[#0096ff] text-white"
                            : "bg-white/5 text-white/40 hover:text-white border border-white/10"
                        }`}
                      >
                        {t}
                      </button>
                    ))}
                  </div>

                  {q.type === "objective" ? (
                    <div className="space-y-2">
                      {OPTIONS.map((opt) => (
                        <div key={opt} className="flex gap-2 items-center">
                          <span className="w-6 h-6 rounded-md bg-white/10 text-white/40 text-xs font-black flex items-center justify-center flex-shrink-0">
                            {opt}
                          </span>
                          <input
                            type="text"
                            value={q[`option_${opt.toLowerCase()}`]}
                            onChange={(e) =>
                              updateQuestion(idx, `option_${opt.toLowerCase()}`, e.target.value)
                            }
                            placeholder={`Option ${opt}${opt === "A" || opt === "B" ? " (required)" : " (optional)"}`}
                            className="flex-1 bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white placeholder-white/20 focus:outline-none focus:border-[#0096ff] transition-colors text-xs"
                          />
                        </div>
                      ))}
                      {/* Correct Answer Selector */}
                      <div className="pt-2">
                        <label className="text-white/40 text-xs font-bold uppercase tracking-wider block mb-2">
                          Correct Answer
                        </label>
                        <div className="flex gap-2">
                          {OPTIONS.filter((o) => q[`option_${o.toLowerCase()}`]).map((opt) => (
                            <button
                              key={opt}
                              onClick={() => updateQuestion(idx, "correct_answer", opt)}
                              className={`w-9 h-9 rounded-lg text-xs font-black transition-all ${
                                q.correct_answer === opt
                                  ? "bg-green-500 text-white"
                                  : "bg-white/5 text-white/40 border border-white/10 hover:border-green-500/40"
                              }`}
                            >
                              {opt}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div>
                      <label className="text-white/40 text-xs font-bold uppercase tracking-wider block mb-2">
                        Correct Answer (exact phrase)
                      </label>
                      <input
                        type="text"
                        value={q.correct_answer}
                        onChange={(e) => updateQuestion(idx, "correct_answer", e.target.value)}
                        placeholder="Type the exact correct answer…"
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-green-500 transition-colors text-sm"
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Add Question */}
            <button
              onClick={addQuestion}
              className="w-full flex items-center justify-center gap-2 border border-dashed border-white/10 hover:border-[#0096ff]/40 text-white/30 hover:text-[#0096ff] py-4 rounded-2xl text-sm font-bold transition-all"
            >
              <FaPlus size={12} /> Add Another Question
            </button>

            {error && (
              <div className="bg-red-500/10 border border-red-500/30 rounded-xl px-4 py-3 text-red-400 text-sm">
                {error}
              </div>
            )}

            {/* Submit */}
            <div className="flex gap-4 pb-2">
              <button
                onClick={() => handleSubmit(true)}
                disabled={loading}
                className="flex-1 bg-white/[0.05] border border-white/10 text-white font-black text-xs uppercase tracking-widest py-4 rounded-xl hover:bg-white/[0.1] transition-all active:scale-95 disabled:opacity-50"
              >
                {loading ? "..." : "Save as Draft"}
              </button>
              <button
                onClick={() => handleSubmit(false)}
                disabled={loading}
                className="flex-[2] bg-gradient-to-r from-orange-500 to-orange-600 text-white py-4 rounded-xl font-black text-xs uppercase tracking-widest hover:shadow-[0_8px_24px_rgba(249,115,22,0.3)] transition-all active:scale-95 disabled:opacity-50"
              >
                {loading ? "Processing…" : `Finalize & Publish`}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
