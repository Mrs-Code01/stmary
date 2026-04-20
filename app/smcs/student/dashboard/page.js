"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { BookOpen, Laptop, FileText, ChevronRight, Trophy, Activity } from "lucide-react";

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

export default function StudentDashboard() {
  const [student, setStudent] = useState(null);
  const [metrics, setMetrics] = useState({
    schoolProgress: 0,
    techProgress: 0,
    techScore: 0,
    overallProgress: 0,
    hasResult: false,
    loading: true
  });

  useEffect(() => {
    const s = getStudentFromCookie();
    if (s) {
      setStudent(s);
      fetchRealMetrics(s);
    }
  }, []);

  const fetchRealMetrics = async (s) => {
    let normalizedClassId = s.class_id.toUpperCase().replace(/\s+|_/g, '').replace(/([A-Z]+)(\d+.*)/, '$1_$2');

    // 1. Fetch total assignments for class
    const { data: allAssignments } = await supabase
      .from("assignments")
      .select("id, type, subject, month")
      .eq("class_id", normalizedClassId);

    // 2. Fetch submissions for student (School assignments)
    const { data: mySubmissions } = await supabase
      .from("submissions")
      .select("assignment_id, score")
      .eq("student_id", s.id);

    // 3. Fetch results for student (PDF results)
    const { data: resultData } = await supabase
      .from("results")
      .select("id")
      .eq("student_id", s.id)
      .limit(1);

    // 4. Fetch NEW 3-Part Tech Assessment results
    const { data: techResults } = await supabase
      .from("student_assessment_results")
      .select("monthly_score, correct_answers")
      .eq("student_id", s.id);

    const safeAssignments = allAssignments || [];
    const safeSubmissions = mySubmissions || [];
    const submittedMap = new Map(safeSubmissions.map(sub => [sub.assignment_id, sub.score]));

    // School progress calculation
    let schoolTotal = 0, schoolDone = 0;
    safeAssignments.forEach(a => {
      if (a.type === 'school_assignment') {
        schoolTotal++;
        if (submittedMap.has(a.id)) schoolDone++;
      }
    });

    // Tech progress calculation (from the new scoring system)
    const techProgress = techResults?.reduce((acc, r) => acc + Number(r.monthly_score), 0) || 0;
    const techScoreRaw = techResults?.reduce((acc, r) => acc + Number(r.correct_answers), 0) || 0;

    const schoolProgress = schoolTotal === 0 ? 0 : Math.round((schoolDone / schoolTotal) * 100);
    
    // Overall progress (average of school and tech)
    const overallProgress = Math.round((schoolProgress + Math.min(100, techProgress)) / 2);

    setMetrics({
      schoolProgress,
      techProgress: Math.min(100, Math.round(techProgress)),
      techScore: techScoreRaw,
      overallProgress,
      hasResult: (resultData && resultData.length > 0) ? true : false,
      loading: false
    });
  };

  const NewCourseCard = ({ title, desc, icon: Icon, color, href }) => (
    <Link href={href} className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex-1 group hover:shadow-md transition-shadow flex flex-col">
      <div className={`${color} w-20 h-20 rounded-2xl flex items-center justify-center mb-5 text-white shadow-inner group-hover:scale-110 transition-transform`}>
        <Icon size={40} />
      </div>
      <h4 className="text-lg font-bold text-gray-800 mb-2">{title}</h4>
      <div className="text-sm text-gray-500 mb-8 leading-relaxed flex-1">
        {desc}
      </div>
      <div className="flex justify-between items-center mt-auto">
        <span className="font-bold text-sm uppercase tracking-wider text-gray-800 group-hover:text-indigo-600 transition-colors">Access Now</span>
        <button className="bg-gray-900 group-hover:bg-indigo-600 transition-colors text-white p-2 rounded-xl shadow-sm">
          <ChevronRight size={20} />
        </button>
      </div>
    </Link>
  );

  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-indigo-500 to-purple-400 rounded-[2.5rem] p-10 md:p-14 relative overflow-hidden shadow-xl shadow-indigo-100">
        <div className="relative z-10 w-full md:w-2/3">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-white mb-4 tracking-tight">
            Welcome Back, {student?.full_name ? student.full_name.split(" ")[0] : "Student"}
          </h1>
          <p className="text-indigo-100 mb-10 font-medium text-base md:text-lg">
            Class {student?.class_id || "—"} | SMCS Digital Dashboard
          </p>
          
          <div className="w-full max-w-sm bg-white/20 rounded-full h-3 mb-10 relative">
            <div className="bg-white h-3 rounded-full shadow-sm transition-all duration-1000" style={{ width: `${metrics.overallProgress}%` }}></div>
            <div className={`absolute -top-7 text-white text-xs font-bold transition-all duration-1000 ${metrics.overallProgress > 95 ? 'right-0' : ''}`} style={{ left: metrics.overallProgress <= 95 ? `calc(${metrics.overallProgress}% - 12px)` : 'auto' }}>
              {metrics.overallProgress}%
            </div>
          </div>

          {student?.tech_course && student?.tech_course_started_at && (
            <div className="mb-8 flex items-center gap-4">
              <div className="bg-white/10 backdrop-blur-md border border-white/20 px-5 py-2.5 rounded-2xl flex items-center gap-3">
                <span className="text-white/60 text-xs font-black uppercase tracking-wider">Path:</span>
                <span className="text-white font-black text-sm">{student.tech_course}</span>
              </div>
              <div className="bg-orange-500 text-white px-5 py-2.5 rounded-2xl flex items-center gap-3 shadow-lg shadow-orange-500/20">
                <span className="text-orange-200 text-xs font-black uppercase tracking-wider">Status:</span>
                <span className="text-white font-black text-sm">
                  Month {Math.min(3, Math.ceil((new Date() - new Date(student.tech_course_started_at)) / (1000 * 60 * 60 * 24 * 30.4)) || 1)} of 3
                </span>
              </div>
            </div>
          )}
          
          <div className="flex flex-wrap gap-4 mt-8">
            <Link href="/smcs/student/assignments" className="bg-white text-indigo-600 px-8 py-3 rounded-2xl text-base font-bold hover:bg-gray-50 transition-colors shadow-lg active:scale-95">
              Academics
            </Link>
            <div className="bg-indigo-600/30 border border-indigo-400/30 px-6 py-3 rounded-2xl flex items-center gap-3 backdrop-blur-sm">
              <span className="text-indigo-100 text-sm font-bold uppercase tracking-wider">Tech Score:</span>
              <span className="text-white text-xl font-black">{metrics.techScore}</span>
            </div>
          </div>
        </div>
        
        {/* Abstract Shapes */}
        <div className="absolute right-0 bottom-0 w-[500px] h-[500px] bg-white opacity-5 rounded-full blur-3xl mix-blend-overlay"></div>
        <div className="absolute -top-20 -right-20 w-[300px] h-[300px] bg-purple-600 opacity-20 rounded-full blur-2xl mix-blend-overlay"></div>
      </div>

      {/* Personal Vision Section */}
      <section>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-gray-800">My Vision & Goals</h2>
          <Link href="/smcs/student/profile" className="text-indigo-600 text-sm font-bold hover:underline">Edit Profile</Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow group">
            <div className="w-12 h-12 rounded-2xl bg-orange-50 text-orange-500 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <Trophy size={24} />
            </div>
            <h4 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-1">Dream Job</h4>
            <p className={`text-base font-bold ${student?.dream_job ? 'text-gray-800' : 'text-gray-300 italic'}`}>
              {student?.dream_job || "What do you want to be?"}
            </p>
          </div>
          <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow group">
            <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-500 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <BookOpen size={24} />
            </div>
            <h4 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-1">Current Learning</h4>
            <p className={`text-base font-bold ${student?.current_learning ? 'text-gray-800' : 'text-gray-300 italic'}`}>
              {student?.current_learning || "What are you learning now?"}
            </p>
          </div>
          <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow group">
            <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-500 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <Activity size={24} />
            </div>
            <h4 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-1">Daily Effort</h4>
            <p className={`text-base font-bold ${student?.daily_effort ? 'text-gray-800' : 'text-gray-300 italic'}`}>
              {student?.daily_effort || "What are you doing daily?"}
            </p>
          </div>
        </div>
      </section>

      {/* Quick Access section (reusing NewCourseCard template format) */}
      <section>
        <h2 className="text-xl font-bold text-gray-800 mb-6">Quick Links</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <NewCourseCard 
            title="School Assignments" 
            desc="General academic questions from your class teachers." 
            href="/smcs/student/assignments"
            icon={BookOpen} color="bg-orange-400" 
          />
          <NewCourseCard 
            title="Tech Assessment" 
            desc={`${student?.tech_course || 'Technical'} specialization path and monthly tests.`}
            href="/smcs/student/tech-assessment"
            icon={Laptop} color="bg-blue-500" 
          />
          <NewCourseCard 
            title="My Results" 
            desc="Official digital copies of your PDF term results." 
            href="/smcs/student/results"
            icon={FileText} color="bg-purple-500" 
          />
        </div>
      </section>

      {/* Course Overview Table Style */}
      <section>
        <h2 className="text-2xl font-bold text-gray-800 mb-8">Academic Overview</h2>
        <div className="bg-white rounded-[2rem] p-8 shadow-sm border border-gray-100 overflow-x-auto">
          <table className="w-full text-left min-w-[700px]">
             <thead>
               <tr className="text-gray-400 text-base border-b border-gray-50">
                 <th className="pb-5 font-medium px-4">Subject Portal</th>
                 <th className="pb-5 font-medium">Status</th>
                 <th className="pb-5 font-medium">Required</th>
                 <th className="pb-5 font-medium">Progress</th>
               </tr>
             </thead>
             <tbody className="divide-y divide-gray-50">
               {[
                 { name: "Term Assignments", status: metrics.schoolProgress > 0 ? "Active" : "Pending", req: "Weekly", progress: metrics.schoolProgress, icon: BookOpen, color: "text-orange-500", bg: "bg-orange-50" },
                 { name: "Skill Acquisition", status: metrics.techProgress > 0 ? "Active" : "Pending", req: "Monthly", progress: metrics.techProgress, icon: Laptop, color: "text-blue-500", bg: "bg-blue-50" },
                 { name: "Result Downloads", status: metrics.hasResult ? "Available" : "Pending", req: "Per Term", progress: metrics.hasResult ? 100 : 0, icon: FileText, color: "text-purple-500", bg: "bg-purple-50" },
               ].map((item, idx) => (
                 <tr key={idx} className={`group hover:bg-gray-50/50 transition-colors ${metrics.loading ? 'opacity-50' : 'opacity-100'}`}>
                   <td className="py-5 px-4 flex items-center space-x-5">
                     <div className={`p-3 rounded-2xl ${item.bg} ${item.color}`}>
                       <item.icon size={24} />
                     </div>
                     <span className="font-bold text-base text-gray-800">{item.name}</span>
                   </td>
                   <td className="py-5 text-base text-gray-500">
                     <span className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider ${item.status === 'Available' || item.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
                       {item.status}
                     </span>
                   </td>
                   <td className="py-5 text-base text-gray-500">{item.req}</td>
                   <td className="py-5">
                     <div className="flex items-center gap-4">
                       <span className="font-bold text-gray-800 text-base w-10">{item.progress}%</span>
                       <div className="w-32 h-2.5 bg-gray-100 rounded-full overflow-hidden">
                         <div className="h-full bg-indigo-500 rounded-full transition-all duration-1000" style={{ width: `${item.progress}%` }} />
                       </div>
                     </div>
                   </td>
                 </tr>
               ))}
             </tbody>
          </table>
        </div>
      </section>

    </div>
  );
}
