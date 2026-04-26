"use client";
// Shared component for both School Assignments and Tech Assessments
// "type" prop: "school_assignment" | "tech_assessment"

import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/lib/supabase";
import { FaBook, FaArrowLeft, FaCheckCircle } from "react-icons/fa";

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

const OPTIONS = ["A", "B", "C", "D", "E"];
const PAGE_SIZE = 5;

export default function AssignmentPage({ type }) {
  const [student, setStudent] = useState(null);
  const [assignments, setAssignments] = useState([]);
  const [selectedAssignment, setSelectedAssignment] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [page, setPage] = useState(0);
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState(null); // { score, total }
  const [alreadySubmitted, setAlreadySubmitted] = useState(false);

  const fetchAssignments = useCallback(async (classId) => {
    setLoading(true);
    let normalizedClassId = classId.toUpperCase().replace(/\s+|_/g, '').replace(/([A-Z]+)(\d+.*)/, '$1_$2');
    
    // Tech Group Mapping logic
    if (type === "tech_assessment") {
      const name = classId.toUpperCase().replace(/\s+|_/g, '');
      if (name.includes("BASIC")) {
        const num = parseInt(name.match(/\d+/)?.[0]);
        if (num >= 1 && num <= 6) normalizedClassId = "BASIC_1_-_6";
        else if (num >= 7 && num <= 9) normalizedClassId = "BASIC_7_-_9";
      } else if (name.includes("SS")) {
        normalizedClassId = "SS1_-_SS3";
      }
    }

    let query = supabase
      .from("assignments")
      .select("*")
      .eq("class_id", normalizedClassId)
      .eq("type", type)
      .eq("status", "published");

    // If tech assessment, filter by student's specific tech course
    const s = getStudentFromCookie();
    if (type === "tech_assessment" && s?.tech_course) {
      query = query.eq("subject", s.tech_course);
    }

    const { data } = await query.order("created_at", { ascending: false });
    
    setLoading(false);
    if (data) setAssignments(data);
  }, [type]);

  useEffect(() => {
    const s = getStudentFromCookie();
    setStudent(s);
    if (s) fetchAssignments(s.class_id);
  }, [fetchAssignments]);

  const selectAssignment = async (a) => {
    setSelectedAssignment(a);
    setQuestions(a.questions || []);
    setPage(0);
    setAnswers({});
    setResult(null);
    setAlreadySubmitted(false);
    
    // Check if already submitted
    const s = getStudentFromCookie();
    if (s) {
      setLoading(true);
      const { data: sub } = await supabase
        .from("submissions")
        .select("id, score")
        .eq("student_id", s.id)
        .eq("assignment_id", a.id)
        .maybeSingle();
      
      if (sub) {
        setAlreadySubmitted(true);
        setResult({ score: sub.score, total: a.questions.length });
      }
      setLoading(false);
    }
  };

  const totalPages = Math.ceil(questions.length / PAGE_SIZE);
  const pageQuestions = questions.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE);

  const allPageAnswered = pageQuestions.every(
    (q, idx) => answers[page * PAGE_SIZE + idx] !== undefined && answers[page * PAGE_SIZE + idx] !== ""
  );

  const handleAnswerChange = (globalIdx, value) => {
    setAnswers((prev) => ({ ...prev, [globalIdx]: value }));
  };

  const handleSubmit = async () => {
    if (!student || !selectedAssignment) return;
    setSubmitting(true);

    // Auto-mark
    let score = 0;
    questions.forEach((q, i) => {
      const studentAnswer = (answers[i] || "").trim().toLowerCase();
      const correct = (q.correct_answer || "").trim().toLowerCase();
      if (studentAnswer === correct) score++;
    });

    const { error } = await supabase.from("submissions").insert({
      student_id: student.id,
      assignment_id: selectedAssignment.id,
      answers: answers,
      score: score,
    });

    setSubmitting(false);
    if (!error) {
      setResult({ score, total: questions.length });
      setAlreadySubmitted(true);
    }
  };

  const title = type === "school_assignment" ? "School Assignments" : "Tech Assessment";

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl md:text-3xl font-black flex items-center gap-3 text-gray-800">
          <FaBook className="text-indigo-600" />
          {title}
        </h1>
        <p className="text-gray-500 text-sm mt-1">
          Select an assignment below
        </p>
      </div>

      {!selectedAssignment ? (
        <div>
          {loading ? (
            <div className="text-gray-400 text-sm py-12 text-center">Loading assignments…</div>
          ) : assignments.length === 0 ? (
            <div className="py-16 text-center bg-gray-50 border border-gray-100 rounded-2xl">
              <p className="text-4xl mb-4">📭</p>
              <p className="text-gray-400 text-sm">No assignments have been uploaded yet.</p>
            </div>
          ) : (
            <div className="grid gap-4">
              {assignments.map((a) => (
                <button
                  key={a.id}
                  onClick={() => selectAssignment(a)}
                  className="w-full text-left bg-white border border-gray-100 hover:border-indigo-200 rounded-2xl p-6 flex items-center justify-between gap-4 transition-all group shadow-sm"
                >
                  <div>
                    <p className="text-gray-800 font-black text-base">{a.subject}</p>
                    <p className="text-gray-500 text-sm mt-1 font-mono">
                      {a.type === 'tech_assessment' && <span className="text-indigo-600 font-bold mr-2">Month {a.month} —</span>}
                      {a.questions?.length || 0} question{a.questions?.length !== 1 ? "s" : ""} ·{" "}
                      {new Date(a.created_at).toLocaleDateString("en-GB")}
                    </p>
                  </div>
                  <span className="text-gray-400 group-hover:text-indigo-600 font-bold text-base transition-colors">→</span>
                </button>
              ))}
            </div>
          )}
        </div>
      ) : (
        <div className="space-y-6">
          <div className="flex items-center gap-5 mb-12">
            <button
              onClick={() => setSelectedAssignment(null)}
              className="text-gray-400 hover:text-indigo-600 transition-colors p-2"
            >
              <FaArrowLeft size={24} />
            </button>
            <div>
              <h2 className="text-2xl md:text-3xl font-black text-gray-800">
                {selectedAssignment.subject}
              </h2>
              <p className="text-gray-500 text-sm mt-1 uppercase tracking-widest font-bold">
                {selectedAssignment.questions?.length || 0} Questions
              </p>
            </div>
          </div>

          {alreadySubmitted && result !== null ? (
            <div className="py-16 text-center">
              <div className="w-24 h-24 rounded-full bg-green-50 text-green-500 border border-green-200 flex items-center justify-center mx-auto mb-6 text-4xl shadow-inner">
                <FaCheckCircle />
              </div>
              <h3 className="text-2xl font-black text-gray-800 mb-2">Assessment Completed</h3>
              <p className="text-gray-500 mb-8">You have successfully submitted your answers.</p>
              
              <div className="inline-block p-6 rounded-2xl bg-indigo-50 border border-indigo-100">
                <p className="text-indigo-400 text-xs font-bold uppercase tracking-widest mb-2">Your Score</p>
                <div className="text-4xl font-black text-indigo-600">
                  {result.score} <span className="text-2xl text-indigo-300">/ {result.total}</span>
                </div>
              </div>
            </div>
          ) : loading ? (
             <div className="py-12 text-center text-gray-400 text-sm">Loading assignment…</div>
          ) : questions.length === 0 ? (
            <div className="text-center text-gray-400 py-10">
              No questions found for this assignment.
            </div>
          ) : (
            <div className="space-y-10">
              {pageQuestions.map((q, idx) => {
                const globalIdx = page * PAGE_SIZE + idx;
                return (
                  <div key={globalIdx} className="bg-white border border-gray-100 rounded-[2rem] p-8 md:p-10 shadow-sm">
                    <div className="flex gap-5 mb-8">
                      <span className="w-10 h-10 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center font-black text-base shrink-0">
                        {globalIdx + 1}
                      </span>
                      <p className="text-gray-800 font-bold text-lg leading-relaxed pt-1">{q.question}</p>
                    </div>

                    {q.type === "objective" ? (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pl-0 md:pl-[3.75rem]">
                        {OPTIONS.filter((opt) => q[`option_${opt.toLowerCase()}`]).map((opt) => (
                          <button
                            key={opt}
                            onClick={() => handleAnswerChange(globalIdx, opt)}
                            className={`p-5 rounded-2xl text-left transition-all border text-base ${
                              answers[globalIdx] === opt
                                ? "bg-indigo-600 border-indigo-600 text-white shadow-md shadow-indigo-200"
                                : "bg-white border-gray-200 text-gray-600 hover:border-indigo-300 hover:bg-gray-50"
                            }`}
                          >
                            <span className="font-bold mr-3 opacity-50">{opt}.</span>
                            {q[`option_${opt.toLowerCase()}`]}
                          </button>
                        ))}
                      </div>
                    ) : (
                      <div className="pl-0 md:pl-[3.75rem]">
                        <textarea
                          rows={5}
                          placeholder="Type your answer here..."
                          value={answers[globalIdx] || ""}
                          onChange={(e) => handleAnswerChange(globalIdx, e.target.value)}
                          className="w-full bg-gray-50 border border-gray-200 rounded-2xl p-5 text-gray-800 placeholder-gray-400 text-base focus:outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-400/20 transition-all resize-none shadow-sm"
                        />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}

          {/* Pagination / Submit */}
          {!alreadySubmitted && result === null && (
            <div className="flex items-center justify-between gap-4 pt-6 border-t border-gray-100">
              <button
                disabled={page === 0}
                onClick={() => setPage(p => p - 1)}
                className="px-6 py-3 rounded-xl bg-white border border-gray-200 text-gray-800 font-bold hover:bg-gray-50 focus:outline-none disabled:opacity-50 transition-all shadow-sm shadow-gray-100"
              >
                Previous
              </button>
              <p className="text-gray-400 font-bold text-sm">
                Page {page + 1} of {totalPages}
              </p>
              {page < totalPages - 1 ? (
                <button
                  onClick={() => setPage(p => p + 1)}
                  className="px-8 py-3 rounded-xl bg-gray-900 border border-gray-900 text-white font-bold hover:bg-gray-800 focus:outline-none transition-all shadow-md shadow-gray-300"
                >
                  Next
                </button>
              ) : (
                <button
                  onClick={handleSubmit}
                  disabled={submitting}
                  className="px-8 py-3 rounded-xl bg-indigo-600 text-white font-bold hover:bg-indigo-700 transition-all disabled:opacity-50 shadow-md shadow-indigo-200"
                >
                  {submitting ? "Submitting..." : "Submit All"}
                </button>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
