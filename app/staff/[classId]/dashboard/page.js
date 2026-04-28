"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { supabase } from "@/lib/supabase";
import UploadAssignmentModal from "@/components/smcs/UploadAssignmentModal";
import UploadResultModal from "@/components/smcs/UploadResultModal";
import UploadLessonNoteModal from "@/components/smcs/UploadLessonNoteModal";
import { FaBook, FaLaptopCode, FaFilePdf, FaCalendarAlt, FaSignOutAlt, FaEdit, FaTrash, FaFileAlt, FaEye, FaTimes, FaUserGraduate, FaSortAmountDown } from "react-icons/fa";

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
  const rawClassId = decodeURIComponent(params.classId || "");
  
  // Normalizes IDs like "Nursery 3", "nursery 3", or "NURSERY_3" -> "NURSERY_3"
  const normalize = (id) => {
    if (!id) return "";
    return id.toUpperCase()
      .replace(/\s+/g, '_') // Replace spaces with underscores
      .replace(/_{2,}/g, '_') // Remove double underscores
      .replace(/([A-Z]+)(\d+.*)/, '$1_$2') // Ensure underscore between text and number (e.g. Nursery3 -> Nursery_3)
      .replace(/_+$/, ''); // Trim trailing underscores
  };
  
  const classId = normalize(rawClassId);
  const isGroup = ["BASIC_1_-_6", "BASIC_7_-_9", "SS1_-_SS3"].includes(classId);

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

  // Scores View state
  const [viewingScores, setViewingScores] = useState(null); // stores assignment object
  const [scores, setScores] = useState([]);
  const [scoresLoading, setScoresLoading] = useState(false);
  const [subjectName, setSubjectName] = useState("");

  useEffect(() => {
    const t = getTeacherFromCookie();
    if (!t || normalize(t.class_id) !== classId) {
      router.replace("/staff");
      return;
    }
    setTeacher(t);
    fetchExistingDate(classId);
    fetchData(classId);
  }, [classId, router]);

  const fetchData = async (cid, tInfo = null) => {
    setDataLoading(true);
    const activeTeacher = tInfo || teacher || getTeacherFromCookie();
    // Normalize the class ID for database queries
    const normalizedCid = isGroup ? classId : classId.toUpperCase().replace(/\s+|_/g, '').replace(/([A-Z]+)(\d+.*)/, '$1_$2');
    
    let filterSubject = "";
    if (activeTeacher?.type === 'subject' && activeTeacher.subject) {
      const { data: sub } = await supabase.from("subjects").select("name").eq("id", activeTeacher.subject).maybeSingle();
      if (sub) {
        filterSubject = sub.name;
        setSubjectName(sub.name);
      }
    } else if (activeTeacher?.type === 'tech' && activeTeacher.subject) {
      const { data: techSub } = await supabase.from("tech_courses").select("name").eq("id", activeTeacher.subject).maybeSingle();
      if (techSub) {
        filterSubject = techSub.name;
        setSubjectName(techSub.name);
      }
    }

    let assQuery = supabase.from("assignments").select("*").eq("class_id", normalizedCid).order("created_at", { ascending: false });
    if (filterSubject) {
      assQuery = assQuery.eq("subject", filterSubject);
    }

    const [assignmentsRes, resultsRes] = await Promise.all([
      assQuery,
      supabase.from("results").select("*").eq("class_id", normalizedCid).order("uploaded_at", { ascending: false })
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
    if (!confirm("Are you sure you want to delete this assignment? All student scores for this assignment will also be removed. This action cannot be undone.")) return;
    
    // Cascading delete is usually handled by DB, but we ensure cleanliness
    await supabase.from("assignments").delete().eq("id", id);
    fetchData(classId);
  };

  const handleDeleteResult = async (id) => {
    if (!confirm("Are you sure you want to delete this result?")) return;
    await supabase.from("results").delete().eq("id", id);
    fetchData(classId);
  };

  const handleViewScores = async (assignment) => {
    setViewingScores(assignment);
    setScoresLoading(true);
    
    const { data: scoreData, error } = await supabase
      .from("submissions")
      .select("*")
      .eq("assignment_id", assignment.id)
      .order("score", { ascending: false });

    if (error) {
      console.error("Error fetching scores:", error);
      setScores([]);
    } else if (scoreData && scoreData.length > 0) {
      const studentIds = [...new Set(scoreData.map((s) => s.student_id))];
      const { data: studentsData } = await supabase
        .from("students")
        .select("id, full_name, email")
        .in("id", studentIds);

      const studentMap = {};
      studentsData?.forEach((st) => {
        studentMap[st.id] = st;
      });

      const enrichedScores = scoreData.map((s) => ({
        ...s,
        students: studentMap[s.student_id] || { full_name: "Unknown", email: "N/A" }
      }));
      setScores(enrichedScores);
    } else {
      setScores([]);
    }
    setScoresLoading(false);
  };

  const handleModalClose = () => {
    setModal(null);
    setEditItem(null);
  };

  const displayClass = (isGroup ? rawClassId : classId).replace(/_/g, ' ');

  const isTier1 = [
    "Pre-Nursery", "Nursery 1", "Nursery 2", "Nursery 3", 
    "Basic 1", "Basic 2", "Basic 3", "Basic 4", "Basic 5", "Basic 6"
  ].map(normalize).includes(classId) || classId === "BASIC_1_-_6";

  const teacherType = teacher?.type;
  const actions = [
    {
      id: "result",
      label: "Upload Student Results",
      desc: "Upload terminal result PDFs for students in this class.",
      icon: <FaFilePdf size={24} />,
      color: "from-blue-500 to-indigo-600",
      glow: "rgba(59,130,246,0.35)",
      visible: teacherType === "class",
    },
    {
      id: "school",
      label: "Upload School Assignment",
      desc: "Add questions for your designated subject and class.",
      icon: <FaBook size={24} />,
      color: "from-orange-500 to-orange-600",
      glow: "rgba(249,115,22,0.35)",
      visible: (teacherType === "class" && isTier1) || teacherType === "subject",
    },
    {
      id: "tech",
      label: "Upload Tech Assessment",
      desc: "Add questions for your designated tech course.",
      icon: <FaLaptopCode size={24} />,
      color: "from-blue-500 to-cyan-500",
      glow: "rgba(6,182,212,0.35)",
      visible: teacherType === "tech",
    },
    {
      id: "lessonNote",
      label: "Upload Lesson Notes",
      desc: "Share lesson documents (PDF/Word) with your students.",
      icon: <FaFileAlt size={24} />,
      color: "from-emerald-500 to-emerald-600",
      glow: "rgba(16,185,129,0.35)",
      visible: (teacherType === "class" && isTier1) || teacherType === "subject" || teacherType === "tech",
    },
  ].filter(a => a.visible);

  if (!teacher) return null;

  return (
    <div className="min-h-screen bg-[#000a18]">
      {/* Header */}
      <header className="border-b border-white/5 px-6 md:px-12 py-5 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <img src="/images/logo.png" alt="St Mary Logo" className="w-16 h-16 md:w-20 md:h-20 object-contain" />
          <div>
            <p className="text-white/40 text-sm md:text-base font-bold font-mono tracking-wide mt-0.5">
              {teacher.id} <span className="opacity-50 mx-2">·</span> {displayClass}
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {actions.map((a) => (
              <button
                key={a.id}
                onClick={() => {
                  setEditItem(null);
                  setModal(a.id);
                }}
                className="group bg-white/[0.02] hover:bg-white/[0.04] border border-white/5 hover:border-white/10 rounded-[2.5rem] p-10 flex flex-col gap-6 text-left transition-all hover:-translate-y-2 shadow-2xl"
              >
                <div
                  className={`w-20 h-20 rounded-[2rem] bg-gradient-to-br ${a.color} flex items-center justify-center text-white group-hover:scale-110 transition-transform shadow-lg shadow-${a.id === 'school' ? 'orange' : 'emerald'}-500/20`}
                >
                  {a.icon}
                </div>
                <div>
                  <h3 className="text-white font-black text-2xl tracking-tight mb-2">{a.label}</h3>
                  <p className="text-white/40 text-sm leading-relaxed max-w-[280px] font-bold">{a.desc}</p>
                </div>
                <div className="flex items-center gap-3 text-white/20 group-hover:text-white/60 text-[10px] font-black uppercase tracking-[0.2em] transition-colors mt-4">
                  Initialize Action <span className="text-lg">→</span>
                </div>
              </button>
            ))}
          </div>
        </div>


        {/* Manage Assignments List */}
        {!dataLoading && (
          <div className="space-y-6">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-white font-black text-xl tracking-tight">Active Assignments</h2>
                <p className="text-white/40 text-xs font-bold uppercase tracking-widest mt-1">Manage, Edit, and View Student Scores</p>
              </div>
              <div className="bg-white/5 border border-white/10 px-4 py-2 rounded-2xl flex items-center gap-3">
                 <FaSortAmountDown className="text-white/20" size={12} />
                 <span className="text-white/40 text-[10px] font-black uppercase tracking-widest">{assignments.filter(a => a.type === 'school_assignment').length} Total</span>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4">
              {assignments.filter(a => a.type === 'school_assignment').length > 0 ? (
                assignments.filter(a => a.type === 'school_assignment').map(a => (
                  <div key={a.id} className={`group border rounded-[2rem] p-8 flex flex-col lg:flex-row lg:items-center justify-between transition-all shadow-2xl ${a.status === 'draft' ? 'bg-white/[0.01] border-dashed border-white/10' : 'bg-white/[0.02] border-white/5 hover:border-white/10 hover:bg-white/[0.04]'}`}>
                    <div className="mb-6 lg:mb-0">
                      <div className="flex items-center gap-4 mb-3">
                        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${a.status === 'draft' ? 'bg-white/5 text-white/20' : 'bg-orange-500/10 text-orange-500'}`}>
                          <FaFileAlt size={20} />
                        </div>
                        <div>
                          <div className="flex items-center gap-3">
                            <p className="text-white font-black text-xl tracking-tight">{a.subject}</p>
                            {a.status === 'draft' && (
                              <span className="text-[9px] font-black bg-white/10 text-white/40 px-2 py-0.5 rounded-full uppercase tracking-widest border border-white/5">Draft</span>
                            )}
                          </div>
                          <p className="text-white/30 text-[10px] font-black uppercase tracking-[0.15em] mt-1">Assignment ID: {a.id.slice(0,8)}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-6 text-white/30 text-xs font-bold pl-16">
                        <span className="flex items-center gap-2"><FaBook size={12} className="opacity-30" /> {a.questions?.length} Questions</span>
                        <span className="flex items-center gap-2"><FaCalendarAlt size={12} className="opacity-30" /> Created {new Date(a.created_at).toLocaleDateString("en-GB")}</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-4 pl-16 lg:pl-0">
                      {a.status !== 'draft' && (
                        <button 
                          onClick={() => handleViewScores(a)}
                          className="flex items-center gap-3 px-8 py-4 rounded-2xl bg-blue-600 text-white font-black text-xs uppercase tracking-widest transition-all active:scale-95 shadow-lg shadow-blue-600/20 hover:bg-blue-500"
                        >
                          <FaEye size={14} /> View Scores
                        </button>
                      )}
                      {a.status === 'draft' && (
                        <button 
                          onClick={() => { setEditItem(a); setModal('school'); }}
                          className="flex items-center gap-3 px-8 py-4 rounded-2xl bg-white/10 text-white font-black text-xs uppercase tracking-widest transition-all active:scale-95 border border-white/10 hover:bg-white/20"
                        >
                          <FaEdit size={14} /> Finish Editing
                        </button>
                      )}
                      <button 
                        onClick={() => { setEditItem(a); setModal('school'); }}
                        className="w-14 h-14 rounded-2xl bg-white/5 hover:bg-white/10 flex items-center justify-center text-white transition-all active:scale-95 border border-white/5"
                        title="Edit questions or details"
                      >
                        <FaEdit size={18} />
                      </button>
                      <button 
                        onClick={() => handleDeleteAssignment(a.id)}
                        className="w-14 h-14 rounded-2xl bg-red-500/10 hover:bg-red-500/20 flex items-center justify-center text-red-500 transition-all active:scale-95 border border-red-500/10"
                        title="Delete"
                      >
                        <FaTrash size={18} />
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="py-20 text-center bg-white/[0.01] border border-dashed border-white/10 rounded-[3rem]">
                  <p className="text-white/10 text-6xl mb-4 font-black">∅</p>
                  <p className="text-white/30 font-black uppercase tracking-widest text-xs">No School Assignments available</p>
                </div>
              )}
            </div>
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
          forcedSubject={teacher?.type === 'subject' ? subjectName : ""}
        />
      )}
      {modal === "tech" && (
        <UploadAssignmentModal
          type="tech_assessment"
          classId={classId}
          initialData={editItem}
          onClose={handleModalClose}
          onRefresh={() => fetchData(classId)}
          forcedSubject={(teacher?.type === 'subject' || teacher?.type === 'tech') ? subjectName : ""}
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
      {/* ── Score View Modal ── */}
      {viewingScores && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/90 backdrop-blur-xl">
          <div className="w-full max-w-2xl bg-[#000a18] border border-white/10 rounded-[3rem] shadow-2xl relative overflow-hidden animate-in zoom-in duration-300 flex flex-col max-h-[85vh]">
            {/* Background Glow */}
            <div className="absolute top-0 left-0 w-full h-40 bg-gradient-to-b from-blue-500/10 to-transparent pointer-events-none" />
            
            {/* Header */}
            <div className="relative p-10 pb-0 shrink-0">
               <button 
                onClick={() => setViewingScores(null)}
                className="absolute top-8 right-8 text-white/30 hover:text-white transition-colors"
              >
                <FaTimes size={20} />
              </button>

              <div className="flex items-center gap-5 mb-8">
                <div className="w-14 h-14 rounded-3xl bg-blue-500/20 flex items-center justify-center text-blue-400">
                  <FaUserGraduate size={26} />
                </div>
                <div>
                  <h2 className="text-2xl font-black text-white tracking-tight leading-none mb-2">{viewingScores.subject}</h2>
                  <p className="text-white/40 text-xs font-bold uppercase tracking-widest">{viewingScores.type.replace('_', ' ')} • Result Dashboard</p>
                </div>
              </div>
              
              <div className="flex items-center gap-4 bg-white/5 border border-white/5 rounded-2xl px-6 py-4 mb-6">
                <div className="flex-1 border-r border-white/5">
                  <p className="text-[10px] font-black text-white/30 uppercase tracking-widest mb-1">Submissions</p>
                  <p className="text-white font-black text-xl">{scores.length}</p>
                </div>
                <div className="flex-1">
                  <p className="text-[10px] font-black text-white/30 uppercase tracking-widest mb-1">Avg. Score</p>
                  <p className="text-white font-black text-xl">
                    {scores.length > 0 
                      ? Math.round((scores.reduce((acc, s) => acc + s.score, 0) / (scores.length * viewingScores.questions?.length)) * 100) 
                      : 0}%
                  </p>
                </div>
              </div>
            </div>

            {/* List Body */}
            <div className="flex-1 overflow-y-auto px-10 pb-10 custom-scrollbar">
              {scoresLoading ? (
                <div className="py-20 flex flex-col items-center gap-4 text-blue-400/50">
                  <div className="w-8 h-8 border-2 border-current border-t-transparent rounded-full animate-spin" />
                  <p className="text-xs font-bold uppercase tracking-widest">Loading Records...</p>
                </div>
              ) : scores.length === 0 ? (
                <div className="py-20 px-10 text-center bg-white/[0.02] border border-white/5 rounded-[2rem]">
                  <p className="text-white/20 text-4xl mb-4 font-black">∅</p>
                  <p className="text-white/40 text-sm font-bold leading-relaxed">No students have completed this assessment yet.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="flex items-center px-4 text-[10px] font-black text-white/20 uppercase tracking-[0.2em] mb-4">
                    <span className="w-10">Rank</span>
                    <span className="flex-1 px-4">Student Identity</span>
                    <span className="w-24 text-right">Progress</span>
                  </div>
                  {scores.map((s, idx) => (
                    <div key={s.id} className="flex items-center p-4 bg-white/[0.03] hover:bg-white/[0.06] border border-white/5 rounded-2xl transition-colors">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-black text-xs ${idx < 3 ? 'bg-blue-500 text-white' : 'bg-white/5 text-white/40'}`}>
                        #{idx + 1}
                      </div>
                      <div className="flex-1 px-4">
                        <p className="text-white font-black text-sm">{s.students?.full_name || 'Anonymous Student'}</p>
                        <p className="text-white/30 text-[10px] font-bold truncate max-w-[200px]">{s.students?.email || 'No email record'}</p>
                      </div>
                      <div className="w-24 text-right">
                        <p className="text-white font-black text-lg leading-none">{s.score}<span className="text-white/20 text-xs font-normal">/{viewingScores.questions?.length}</span></p>
                        <div className="w-full h-1 bg-white/5 rounded-full mt-2 overflow-hidden">
                           <div 
                            className="h-full bg-blue-500 rounded-full transition-all duration-1000" 
                            style={{ width: `${(s.score / viewingScores.questions?.length) * 100}%` }} 
                           />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
