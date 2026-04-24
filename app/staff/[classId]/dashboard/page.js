"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { supabase } from "@/lib/supabase";
import UploadAssignmentModal from "@/components/smcs/UploadAssignmentModal";
import UploadResultModal from "@/components/smcs/UploadResultModal";
import UploadLessonNoteModal from "@/components/smcs/UploadLessonNoteModal";
import { FaBook, FaLaptopCode, FaFilePdf, FaCalendarAlt, FaSignOutAlt, FaEdit, FaTrash, FaFileAlt } from "react-icons/fa";

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

export default function TeacherDashboard() {
  const router = useRouter();
  const params = useParams();
  const classId = decodeURIComponent(params.classId || "");

  const [teacher, setTeacher] = useState(null);
  const [modal, setModal] = useState(null); // null | 'school' | 'tech' | 'result'
  const [editItem, setEditItem] = useState(null);

  const [assessmentDate, setAssessmentDate] = useState("");
  const [assessmentLabel, setAssessmentLabel] = useState("");
  const [dateLoading, setDateLoading] = useState(false);
  const [dateSaved, setDateSaved] = useState(false);
  const [existingDate, setExistingDate] = useState(null);

  const [assignments, setAssignments] = useState([]);
  const [results, setResults] = useState([]);
  const [dataLoading, setDataLoading] = useState(true);

  useEffect(() => {
    const t = getTeacherFromCookie();
    if (!t || t.class_id !== classId) {
      router.replace("/staff");
      return;
    }
    setTeacher(t);
    fetchExistingDate(classId);
    fetchData(classId);
  }, [classId, router]);

  const fetchData = async (cid) => {
    setDataLoading(true);
    const [assignmentsRes, resultsRes] = await Promise.all([
      supabase.from("assignments").select("*").eq("class_id", cid).order("created_at", { ascending: false }),
      supabase.from("results").select("*").eq("class_id", cid).order("uploaded_at", { ascending: false })
    ]);
    if (assignmentsRes.data) setAssignments(assignmentsRes.data);
    if (resultsRes.data) setResults(resultsRes.data);
    setDataLoading(false);
  };

  const fetchExistingDate = async (cid) => {
    const { data } = await supabase
      .from("assessment_dates")
      .select("*")
      .eq("class_id", cid)
      .order("assessment_date", { ascending: true })
      .limit(1)
      .maybeSingle();
    if (data) {
      setExistingDate(data);
      setAssessmentDate(data.assessment_date);
      setAssessmentLabel(data.label || "");
    }
  };

  const handleSaveDate = async () => {
    if (!assessmentDate) return;
    setDateLoading(true);
    setDateSaved(false);

    if (existingDate) {
      await supabase
        .from("assessment_dates")
        .update({ assessment_date: assessmentDate, label: assessmentLabel })
        .eq("id", existingDate.id);
    } else {
      await supabase.from("assessment_dates").insert({
        class_id: classId,
        teacher_id: teacher.id,
        assessment_date: assessmentDate,
        label: assessmentLabel,
      });
    }
    setDateLoading(false);
    setDateSaved(true);
    setTimeout(() => setDateSaved(false), 3000);
  };

  const handleLogout = () => {
    document.cookie = "smcs_teacher=; path=/; max-age=0";
    router.push("/staff");
  };

  const handleDeleteAssignment = async (id) => {
    if (!confirm("Are you sure you want to delete this assignment?")) return;
    await supabase.from("assignments").delete().eq("id", id);
    fetchData(classId);
  };

  const handleDeleteResult = async (id) => {
    if (!confirm("Are you sure you want to delete this result?")) return;
    await supabase.from("results").delete().eq("id", id);
    fetchData(classId);
  };

  const handleModalClose = () => {
    setModal(null);
    setEditItem(null);
  };

  const displayClass = classId.replace(/_/g, " ");

  const actions = [
    {
      id: "school",
      label: "Upload School Assignment",
      desc: "Add questions for your class's school assignment",
      icon: <FaBook size={24} />,
      color: "from-[#cc5500] to-[#ff8c00]",
      glow: "rgba(204,85,0,0.35)",
    },
    {
      id: "tech",
      label: "Upload Tech Assessment",
      desc: "Add technology skills assessment questions",
      icon: <FaLaptopCode size={24} />,
      color: "from-[#0096ff] to-[#00BFFF]",
      glow: "rgba(0,150,255,0.35)",
    },
    {
      id: "result",
      label: "Upload Student Result",
      desc: "Upload a PDF result for a specific student",
      icon: <FaFilePdf size={24} />,
      color: "from-[#7c3aed] to-[#a855f7]",
      glow: "rgba(124,58,237,0.35)",
    },
    {
      id: "lessonNote",
      label: "Upload Lesson Notes",
      desc: "Share a lesson note document (PDF or Word) with the admin",
      icon: <FaFileAlt size={24} />,
      color: "from-[#16a34a] to-[#22c55e]",
      glow: "rgba(34,197,94,0.35)",
    },
  ];

  if (!teacher) return null;

  return (
    <div className="min-h-screen bg-[#000a18]">
      {/* Header */}
      <header className="border-b border-white/5 px-6 md:px-12 py-5 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <img src="/images/logo.png" alt="St Mary Logo" className="w-25 h-25 object-contain" />
          <div>
            <p className="text-white/30 text-[1.5rem] font-mono mt-0.5">
              {teacher.id} · {displayClass}
            </p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 text-white/30 hover:text-red-400 text-sm font-bold transition-colors"
        >
          <FaSignOutAlt /> Log Out
        </button>
      </header>

      {/* Main */}
      <main className="w-[90%] mx-auto px-6 md:px-12 py-12 space-y-10">
        {/* Welcome */}
        <div>
          <h1 className="text-3xl md:text-4xl font-black text-white">{displayClass}</h1>
          <p className="text-white/40 text-sm mt-1">Teacher Dashboard</p>
        </div>

        {/* Action Cards */}
        <div>
          <h2 className="text-white/40 text-xs font-bold uppercase tracking-widest mb-4">
            Actions
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {actions.map((a) => (
              <button
                key={a.id}
                onClick={() => {
                  if (a.id === "tech") {
                    router.push("/smcs/staff/assessments");
                    return;
                  }
                  setEditItem(null);
                  setModal(a.id);
                }}
                className="group bg-white/3 hover:bg-white/5 border border-white/5 hover:border-white/10 rounded-2xl p-6 flex flex-col gap-5 text-left transition-all hover:-translate-y-1"
              >
                <div
                  className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${a.color} flex items-center justify-center text-white group-hover:scale-110 transition-transform shadow-[0_8px_24px_rgba(0,0,0,0.2)]`}
                >
                  {a.icon}
                </div>
                <div>
                  <p className="text-white font-black text-sm leading-tight">{a.label}</p>
                  <p className="text-white/30 text-xs mt-2 leading-relaxed">{a.desc}</p>
                </div>
                <span className="text-white/20 group-hover:text-white/50 text-sm font-bold transition-colors">
                  Open →
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Assessment Date Scheduler */}
        <div className="bg-white/3 border border-white/5 rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-5">
            <FaCalendarAlt className="text-yellow-400" size={18} />
            <h3 className="text-white font-black text-sm">Schedule Assessment Date</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
            <div>
              <label className="text-white/50 text-xs font-bold uppercase tracking-wider block mb-2">
                Label (e.g. Month 1 Assessment)
              </label>
              <input
                type="text"
                value={assessmentLabel}
                onChange={(e) => setAssessmentLabel(e.target.value)}
                placeholder="Month 1 Assessment"
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-yellow-400 transition-colors text-sm"
              />
            </div>
            <div>
              <label className="text-white/50 text-xs font-bold uppercase tracking-wider block mb-2">
                Date
              </label>
              <input
                type="date"
                value={assessmentDate}
                onChange={(e) => setAssessmentDate(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-yellow-400 transition-colors text-sm"
              />
            </div>
            <button
              onClick={handleSaveDate}
              disabled={!assessmentDate || dateLoading}
              className="bg-yellow-500 text-black py-3 rounded-xl font-black text-sm uppercase tracking-wider hover:bg-yellow-400 transition-all active:scale-95 disabled:opacity-40"
            >
              {dateLoading ? "Saving…" : dateSaved ? "✓ Saved!" : "Save Date"}
            </button>
          </div>
          {existingDate && (
            <p className="text-white/30 text-xs mt-4">
              Current: {existingDate.label ? `${existingDate.label} — ` : ""}
              {new Date(existingDate.assessment_date).toLocaleDateString("en-GB", {
                weekday: "long", day: "numeric", month: "long", year: "numeric",
              })}
            </p>
          )}
        </div>

        {/* Manage Data Sections */}
        {!dataLoading && ( assignments.length > 0 || results.length > 0 ) && (
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-10">
            {/* Assignments List */}
            {assignments.length > 0 && (
              <div>
                <h2 className="text-white/40 text-xs font-bold uppercase tracking-widest mb-4">
                  Manage Assignments
                </h2>
                <div className="space-y-4">
                  {assignments.map(a => (
                    <div key={a.id} className="bg-white/3 border border-white/5 hover:border-white/10 rounded-2xl p-5 flex items-center justify-between transition-all">
                      <div>
                        <p className="text-white font-bold text-sm">
                          {a.subject} <span className="text-white/40 font-normal ml-2 text-xs">({a.type === 'school_assignment' ? 'School' : 'Tech'})</span>
                        </p>
                        <p className="text-white/30 text-xs mt-1 font-mono">
                          {a.questions?.length} Questions · {new Date(a.created_at).toLocaleDateString("en-GB")}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <button 
                          onClick={() => { setEditItem(a); setModal(a.type === 'school_assignment' ? 'school' : 'tech'); }}
                          className="w-10 h-10 rounded-xl bg-white/5 hover:bg-white/10 flex items-center justify-center text-[#0096ff] transition-colors"
                        >
                          <FaEdit />
                        </button>
                        <button 
                          onClick={() => handleDeleteAssignment(a.id)}
                          className="w-10 h-10 rounded-xl bg-red-500/10 hover:bg-red-500/20 flex items-center justify-center text-red-400 transition-colors"
                        >
                          <FaTrash />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Results List */}
            {results.length > 0 && (
              <div>
                <h2 className="text-white/40 text-xs font-bold uppercase tracking-widest mb-4">
                  Manage Uploaded Results
                </h2>
                <div className="space-y-4">
                  {results.map(r => (
                    <div key={r.id} className="bg-white/3 border border-white/5 hover:border-white/10 rounded-2xl p-5 flex items-center justify-between transition-all">
                      <div>
                        <p className="text-white font-bold text-sm">
                          {r.student_id} <span className="text-white/40 font-normal ml-2 text-xs">(PDF Result)</span>
                        </p>
                        <p className="text-white/30 text-xs mt-1 font-mono">
                          {new Date(r.uploaded_at).toLocaleDateString("en-GB")}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <button 
                          onClick={() => { setEditItem(r); setModal('result'); }}
                          className="w-10 h-10 rounded-xl bg-white/5 hover:bg-white/10 flex items-center justify-center text-[#7c3aed] transition-colors"
                        >
                          <FaEdit />
                        </button>
                        <button 
                          onClick={() => handleDeleteResult(r.id)}
                          className="w-10 h-10 rounded-xl bg-red-500/10 hover:bg-red-500/20 flex items-center justify-center text-red-400 transition-colors"
                        >
                          <FaTrash />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </main>

      {/* Modals */}
      {modal === "school" && (
        <UploadAssignmentModal
          type="school_assignment"
          classId={classId}
          initialData={editItem}
          onClose={handleModalClose}
          onRefresh={() => fetchData(classId)}
        />
      )}
      {modal === "tech" && (
        <UploadAssignmentModal
          type="tech_assessment"
          classId={classId}
          initialData={editItem}
          onClose={handleModalClose}
          onRefresh={() => fetchData(classId)}
        />
      )}
      {modal === "result" && (
        <UploadResultModal
          classId={classId}
          initialData={editItem}
          onClose={handleModalClose}
          onRefresh={() => fetchData(classId)}
        />
      )}
      {modal === "lessonNote" && (
        <UploadLessonNoteModal
          classId={classId}
          teacherId={teacher.id}
          onClose={handleModalClose}
          onRefresh={() => fetchData(classId)}
        />
      )}
    </div>
  );
}
