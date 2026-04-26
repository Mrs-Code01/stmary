"use client";

import React, { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { 
  Plus, 
  Search, 
  Trash2, 
  Laptop, 
  Hash, 
  X, 
  AlertCircle,
  CheckCircle2,
  Loader2
} from "lucide-react";

// Tech Groups for Tech Courses
const TECH_GROUPS = [
  "Basic 1 - 6",
  "Basic 7 - 9",
  "SS1 - SS3"
];

const CLASSES = [
  "Pre-Nursery", "Nursery 1", "Nursery 2", "Nursery 3", 
  "Basic 1", "Basic 2", "Basic 3", "Basic 4", "Basic 5", "Basic 6", 
  "Basic 7", "Basic 8", "Basic 9", "SS1", "SS2", "SS3"
];

// Helper to validate Title Case
const isTitleCase = (str) => {
  if (!str) return false;
  const words = str.trim().split(/\s+/);
  return words.every(word => 
    /^[A-Z][a-z]*$/.test(word) || // Standard capitalized word
    /^(And|Of|The|In|On|At)$/.test(word) // Allowed minor words capitalized
  );
};

export default function TechCoursesPage() {
  const [courses, setCourses] = useState([]);
  const [courseIds, setCourseIds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(null); // 'createCourse' | 'addId'
  
  // Create Course Form
  const [newCourseName, setNewCourseName] = useState("");
  const [newCourseClass, setNewCourseClass] = useState(TECH_GROUPS[0]);
  const [courseError, setCourseError] = useState("");
  const [courseLoading, setCourseLoading] = useState(false);

  // Add Course ID Form
  const [idClass, setIdClass] = useState(TECH_GROUPS[0]);
  const [idCourse, setIdCourse] = useState("");
  const [idText, setIdText] = useState("");
  const [idError, setIdError] = useState("");
  const [idLoading, setIdLoading] = useState(false);

  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    const [coursesRes, idRes] = await Promise.all([
      supabase.from("tech_courses").select("*").order("class_name", { ascending: true }),
      supabase.from("tech_course_ids").select("*, tech_courses(name)").order("class_name", { ascending: true })
    ]);
    if (coursesRes.data) setCourses(coursesRes.data);
    if (idRes.data) setCourseIds(idRes.data);
    setLoading(false);
  };

  const handleCreateCourse = async (e) => {
    e.preventDefault();
    setCourseError("");
    
    if (!isTitleCase(newCourseName)) {
      setCourseError("Please follow the format shown in the placeholder — capitalize each word (e.g. 'Web Development').");
      return;
    }

    setCourseLoading(true);
    const { error } = await supabase.from("tech_courses").insert({
      name: newCourseName.trim(),
      class_name: newCourseClass
    });

    if (error) {
      setCourseError(error.message);
    } else {
      setNewCourseName("");
      setModal(null);
      fetchData();
    }
    setCourseLoading(false);
  };

  const handleAddId = async (e) => {
    e.preventDefault();
    setIdError("");

    if (!idCourse) {
      setIdError("Please select a tech course.");
      return;
    }
    if (!idText.trim()) {
      setIdError("Please enter a Tech Course ID.");
      return;
    }

    setIdLoading(true);
    const { error } = await supabase.from("tech_course_ids").insert({
      tech_course_id: idCourse,
      external_id: idText.trim(),
      class_name: idClass
    });

    if (error) {
      setIdError(error.message);
    } else {
      setIdText("");
      setModal(null);
      fetchData();
    }
    setIdLoading(false);
  };

  const handleDeleteCourse = async (id) => {
    if (!confirm("Are you sure? This will remove the tech course and potentially its linked IDs.")) return;
    await supabase.from("tech_courses").delete().eq("id", id);
    fetchData();
  };

  const handleDeleteId = async (id) => {
    if (!confirm("Remove this Tech Course ID?")) return;
    await supabase.from("tech_course_ids").delete().eq("id", id);
    fetchData();
  };

  const filteredCourses = courses.filter(s => 
    s.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    s.class_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-8 max-w-6xl mx-auto space-y-8">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Tech Course Management</h1>
          <p className="text-slate-500 font-medium">Manage tech courses and their unique registration IDs</p>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={() => setModal('createCourse')}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-xl font-bold transition-all active:scale-95 shadow-lg shadow-blue-600/20"
          >
            <Plus size={18} />
            Create Tech Course
          </button>
          <button 
            onClick={() => setModal('addId')}
            className="flex items-center gap-2 bg-slate-800 hover:bg-slate-900 text-white px-5 py-3 rounded-xl font-bold transition-all active:scale-95 shadow-lg shadow-slate-800/20"
          >
            <Hash size={18} />
            Add Tech ID
          </button>
        </div>
      </div>

      {/* Search and Feedback */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
        <input 
          type="text" 
          placeholder="Search tech courses or classes..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-12 pr-4 py-4 bg-white border border-slate-200 rounded-2xl outline-none focus:ring-4 focus:ring-blue-100 transition-all font-medium text-slate-700 shadow-sm"
        />
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Courses List */}
        <section className="bg-white rounded-[2rem] border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center text-blue-600">
                <Laptop size={20} />
              </div>
              <h2 className="text-lg font-black text-slate-800">All Tech Courses</h2>
            </div>
            <span className="bg-blue-100 text-blue-600 px-3 py-1 rounded-full text-xs font-bold">
              {courses.length} Total
            </span>
          </div>
          
          <div className="divide-y divide-slate-50 max-h-[600px] overflow-y-auto">
            {loading ? (
              <div className="p-12 flex justify-center"><Loader2 className="animate-spin text-blue-500" /></div>
            ) : filteredCourses.length === 0 ? (
              <p className="p-12 text-center text-slate-400 font-medium lowercase">No tech courses found</p>
            ) : (
              filteredCourses.map(course => (
                <div key={course.id} className="p-5 flex items-center justify-between hover:bg-slate-50/50 transition-colors group">
                  <div>
                    <p className="font-bold text-slate-900">{course.name}</p>
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-0.5">{course.class_name}</p>
                  </div>
                  <button 
                    onClick={() => handleDeleteCourse(course.id)}
                    className="p-2 text-slate-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))
            )}
          </div>
        </section>

        {/* Course IDs List */}
        <section className="bg-white rounded-[2rem] border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center text-slate-600">
                <Hash size={20} />
              </div>
              <h2 className="text-lg font-black text-slate-800">Assigned Tech IDs</h2>
            </div>
            <span className="bg-slate-100 text-slate-600 px-3 py-1 rounded-full text-xs font-bold">
              {courseIds.length} Active
            </span>
          </div>

          <div className="divide-y divide-slate-50 max-h-[600px] overflow-y-auto">
            {loading ? (
              <div className="p-12 flex justify-center"><Loader2 className="animate-spin text-slate-500" /></div>
            ) : courseIds.length === 0 ? (
              <p className="p-12 text-center text-slate-400 font-medium lowercase">No tech IDs assigned</p>
            ) : (
              courseIds.map(id => (
                <div key={id.id} className="p-5 flex items-center justify-between hover:bg-slate-50/50 transition-colors group">
                  <div>
                    <div className="flex items-center gap-2">
                       <span className="font-mono font-black text-blue-600 bg-blue-50 px-2 py-0.5 rounded text-sm tracking-tighter">{id.external_id}</span>
                       <p className="font-bold text-slate-900 text-sm">{id.tech_courses?.name}</p>
                    </div>
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">{id.class_name}</p>
                  </div>
                  <button 
                    onClick={() => handleDeleteId(id.id)}
                    className="p-2 text-slate-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))
            )}
          </div>
        </section>
      </div>

      {/* --- MODALS --- */}

      {/* Create Course Modal */}
      {modal === 'createCourse' && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="w-full max-w-lg bg-white rounded-[2.5rem] p-8 shadow-2xl relative animate-in fade-in zoom-in duration-300">
            <button onClick={() => setModal(null)} className="absolute top-6 right-6 text-slate-400 hover:text-slate-900">
              <X size={24} />
            </button>
            
            <div className="mb-8">
              <h2 className="text-2xl font-black text-slate-900 tracking-tight">Create New Tech Course</h2>
              <p className="text-slate-500 text-sm font-medium">Add a new tech course to a specific class</p>
            </div>

            <form onSubmit={handleCreateCourse} className="space-y-6">
              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2 block">Select Class</label>
                <select 
                  value={newCourseClass}
                  onChange={(e) => setNewCourseClass(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3.5 text-slate-700 font-bold focus:ring-4 focus:ring-blue-100 transition-all outline-none appearance-none"
                >
                  {TECH_GROUPS.map(cls => <option key={cls} value={cls}>{cls}</option>)}
                </select>
              </div>

              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2 block">Course Name</label>
                <input 
                  type="text"
                  placeholder='e.g. "Web Development" / "Blockchain"'
                  value={newCourseName}
                  onChange={(e) => setNewCourseName(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3.5 text-slate-700 font-bold focus:ring-4 focus:ring-blue-100 transition-all outline-none placeholder:text-slate-300 placeholder:font-medium"
                />
              </div>

              {courseError && (
                <div className="flex items-start gap-3 bg-red-50 text-red-600 p-4 rounded-2xl border border-red-100 animate-in slide-in-from-top-2">
                  <AlertCircle size={18} className="shrink-0 mt-0.5" />
                  <p className="text-xs font-bold leading-relaxed">{courseError}</p>
                </div>
              )}

              <button 
                type="submit"
                disabled={courseLoading || !newCourseName.trim()}
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-black py-4 rounded-2xl transition-all shadow-lg shadow-blue-600/20 active:scale-95 flex items-center justify-center gap-2"
              >
                {courseLoading ? <Loader2 className="animate-spin" /> : "Add Tech Course"}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Add Tech ID Modal */}
      {modal === 'addId' && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="w-full max-w-lg bg-white rounded-[2.5rem] p-8 shadow-2xl relative animate-in fade-in zoom-in duration-300">
            <button onClick={() => setModal(null)} className="absolute top-6 right-6 text-slate-400 hover:text-slate-900">
              <X size={24} />
            </button>
            
            <div className="mb-8">
              <h2 className="text-2xl font-black text-slate-900 tracking-tight">Add Tech ID</h2>
              <p className="text-slate-500 text-sm font-medium">Link a unique registration ID to a tech course and class</p>
            </div>

            <form onSubmit={handleAddId} className="space-y-6">
              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2 block">Select Class</label>
                <select 
                  value={idClass}
                  onChange={(e) => {
                    setIdClass(e.target.value);
                    setIdCourse(""); // Reset course selection
                  }}
                  className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3.5 text-slate-700 font-bold focus:ring-4 focus:ring-blue-100 transition-all outline-none appearance-none"
                >
                  {TECH_GROUPS.map(cls => <option key={cls} value={cls}>{cls}</option>)}
                </select>
              </div>

              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2 block">Select Tech Course</label>
                <select 
                  value={idCourse}
                  onChange={(e) => setIdCourse(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3.5 text-slate-700 font-bold focus:ring-4 focus:ring-blue-100 transition-all outline-none appearance-none"
                >
                  <option value="">Choose course...</option>
                  {courses.filter(s => s.class_name === idClass).map(s => (
                    <option key={s.id} value={s.id}>{s.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2 block">Unique Tech ID</label>
                <input 
                  type="text"
                  placeholder="e.g. TECH-P1-001"
                  value={idText}
                  onChange={(e) => setIdText(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3.5 text-slate-700 font-mono font-bold focus:ring-4 focus:ring-blue-100 transition-all outline-none"
                />
              </div>

              {idError && (
                <div className="flex items-start gap-3 bg-red-50 text-red-600 p-4 rounded-2xl border border-red-100">
                  <AlertCircle size={18} className="shrink-0 mt-0.5" />
                  <p className="text-xs font-bold leading-relaxed">{idError}</p>
                </div>
              )}

              <button 
                type="submit"
                disabled={idLoading || !idText.trim() || !idCourse}
                className="w-full bg-slate-900 hover:bg-black disabled:opacity-50 text-white font-black py-4 rounded-2xl transition-all shadow-lg active:scale-95 flex items-center justify-center gap-2"
              >
                {idLoading ? <Loader2 className="animate-spin" /> : "Save ID Link"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
