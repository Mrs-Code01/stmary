"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import {
  Home, BookOpen, Laptop, Trophy, FileText,
  Settings, Bell, LogOut, Menu, X, User, GraduationCap
} from "lucide-react";
import Footer from "@/components/Footer";

const PUBLIC_ROUTES = ["/smcs/student/login", "/smcs/student/register"];

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

export default function StudentLayout({ children }) {
  const router = useRouter();
  const pathname = usePathname();
  const [student, setStudent] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [assessmentDate, setAssessmentDate] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [showNotifs, setShowNotifs] = useState(false);
  const [showAllNotifs, setShowAllNotifs] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  const isPublic = PUBLIC_ROUTES.includes(pathname);

  useEffect(() => {
    if (isPublic) return;

    const s = getStudentFromCookie();
    if (!s) {
      router.replace("/smcs/student/login");
    } else {
      setStudent(s);
      fetchAssessmentDate(s.class_id);
      fetchNotifications(s.id);
    }
  }, [router, isPublic]);

  const fetchNotifications = async (sid) => {
    const { data } = await supabase
      .from("student_notifications")
      .select("*")
      .eq("student_id", sid)
      .order("created_at", { ascending: false })
      .limit(10);

    if (data) {
      setNotifications(data);
      setUnreadCount(data.filter(n => !n.is_read).length);
    }
  };

  const markAllAsRead = async () => {
    if (unreadCount === 0 || !student) return;

    const { error } = await supabase
      .from("student_notifications")
      .update({ is_read: true })
      .eq("student_id", student.id)
      .eq("is_read", false);

    if (!error) {
      setUnreadCount(0);
      setNotifications(prev => prev.map(n => ({ ...n, is_read: true })));
    }
  };

  const deleteAllNotifications = async () => {
    if (notifications.length === 0 || !student) return;
    if (!confirm("Are you sure you want to clear all notifications? This cannot be undone.")) return;

    const { error } = await supabase
      .from("student_notifications")
      .delete()
      .eq("student_id", student.id);

    if (!error) {
      setNotifications([]);
      setUnreadCount(0);
      setShowAllNotifs(false);
    }
  };

  // Listen for course updates fired by the courses page
  useEffect(() => {
    const handler = (e) => {
      const newCourse = e.detail;
      setStudent((prev) => {
        if (!prev) return prev;
        const updated = { ...prev, tech_course: newCourse };
        // Persist to cookie so refreshes keep the updated name
        document.cookie = `smcs_student=${encodeURIComponent(JSON.stringify(updated))}; path=/; max-age=${60 * 60 * 24 * 7}; SameSite=Lax`;
        return updated;
      });
    };
    window.addEventListener("smcs_course_updated", handler);
    return () => window.removeEventListener("smcs_course_updated", handler);
  }, []);

  const fetchAssessmentDate = async (classId) => {
    // Normalize: uppercase + replace spaces with underscores
    // Handles "BASIC 1" -> "BASIC_1", "SS1" stays "SS1"
    let normalizedClassId = classId.toUpperCase().trim().replace(/\s+/g, "_");

    // Legacy fallback: handle old compact formats like "JSS2A" -> "JSS_2A"
    // but do NOT modify things like "SS1" which have no separator by design
    if (!normalizedClassId.includes("_") && !/^SS\d$/.test(normalizedClassId)) {
      normalizedClassId = normalizedClassId.replace(/^(JSS|SSS|PRIMARY|BASIC|PRE)(\d)/, "$1_$2");
    }

    const { data } = await supabase
      .from("assessment_dates")
      .select("*")
      .eq("class_id", normalizedClassId)
      .order("assessment_date", { ascending: true })
      .limit(1)
      .maybeSingle();
    if (data) setAssessmentDate(data);
  };

  const handleLogout = () => {
    document.cookie = "smcs_student=; path=/; max-age=0";
    router.replace("/smcs/student/login");
  };

  if (isPublic) return <>{children}</>;
  if (!student) return null;

  const navItems = [
    { label: "Home", href: "/smcs/student/dashboard", icon: Home },
    { label: "Courses", href: "/smcs/student/courses", icon: GraduationCap },
    { label: "Assignments", href: "/smcs/student/assignments", icon: BookOpen },
    { label: "Tech Assessment", href: "/smcs/student/tech-assessment", icon: Laptop },
    { label: "Leaderboard", href: "/smcs/student/leaderboard", icon: Trophy },
    { label: "Results", href: "/smcs/student/results", icon: FileText },
    { label: "Profile", href: "/smcs/student/profile", icon: User },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-[#F8F9FE] font-sans text-gray-800">
      <div className="flex xl:flex-row flex-col flex-1 overflow-hidden">
        {/* Mobile Top Bar */}
        <div className="xl:hidden flex items-center justify-between p-5 bg-white border-b border-gray-100 z-50">
          <div className="flex items-center space-x-2">
            <img
              src="/images/logo.png"
              alt="St Mary Logo"
              className="w-10 h-10 object-contain"
            />
            <span className="text-xl font-bold tracking-tight text-gray-800">Student Portal</span>
          </div>
          <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-2 text-gray-600">
            {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* --- SIDEBAR --- */}
        <aside className={`fixed xl:static top-0 left-0 z-40 h-full w-64 bg-white p-6 flex flex-col border-r border-gray-100 transition-transform duration-300 ${sidebarOpen ? "translate-x-0" : "-translate-x-full xl:translate-x-0"}`}>
          <div className="hidden xl:flex items-center space-x-3 mb-10 px-2 cursor-pointer" onClick={() => router.push("/")}>
            <div className="flex items-center gap-3 mb-1 justify-center">
              <img
                src="/images/logo.png"
                alt="St Mary Logo"
                className="w-25 h-25 object-contain transition-transform duration-300"
              />
            </div>
          </div>

          <nav className="space-y-3 flex-1">
            {navItems.map((item) => {
              const active = pathname.startsWith(item.href);
              return (
                <Link key={item.href} href={item.href} onClick={() => setSidebarOpen(false)}>
                  <div className={`flex items-center space-x-4 p-4 rounded-xl cursor-pointer transition-all ${active ? "bg-indigo-600 text-white shadow-lg shadow-indigo-200" : "text-gray-400 hover:bg-indigo-50 hover:text-indigo-600"
                    }`}>
                    <item.icon size={22} />
                    <div className="flex flex-col">
                      <span className="font-medium text-base leading-none">{item.label}</span>
                      {item.label === "Tech Assessment" && student.tech_course && (
                        <span className={`text-[10px] mt-1 font-bold truncate max-w-[120px] ${active ? 'text-indigo-200' : 'text-indigo-500'}`}>
                          {student.tech_course}
                        </span>
                      )}
                    </div>
                  </div>
                </Link>
              )
            })}
          </nav>

          <div className="mt-auto pt-6 border-t border-gray-100 space-y-3">
            <button className="w-full flex items-center space-x-4 p-4 rounded-xl cursor-pointer text-gray-400 hover:bg-gray-50 hover:text-gray-800 transition-all">
              <Settings size={22} />
              <span className="font-medium text-base">Settings</span>
            </button>
            <button onClick={handleLogout} className="w-full flex items-center space-x-4 p-4 rounded-xl cursor-pointer text-red-400 hover:bg-red-50 hover:text-red-600 transition-all">
              <LogOut size={22} />
              <span className="font-medium text-base">Log Out</span>
            </button>
          </div>
        </aside>

        {/* Mobile Overlay */}
        {sidebarOpen && (
          <div className="fixed inset-0 bg-black/20 backdrop-blur-sm z-30 xl:hidden" onClick={() => setSidebarOpen(false)} />
        )}

        {/* --- MAIN CONTENT --- */}
        <main className="flex-1 flex flex-col h-[100dvh] xl:h-auto max-h-screen overflow-y-auto w-full relative">
          {/* Top Header inside main */}
          <header className="sticky top-0 z-20 bg-[#F8F9FE]/80 backdrop-blur-xl flex justify-end items-center space-x-4 py-4 px-6 md:px-10 border-b border-[#F8F9FE]">
            <button className="p-3 text-gray-400 hover:bg-white hover:shadow-sm rounded-full transition-all">
              <Settings size={20} />
            </button>
            <div className="relative">
              <button
                onClick={() => {
                  setShowNotifs(!showNotifs);
                  if (!showNotifs) markAllAsRead();
                }}
                className={`p-3 rounded-full transition-all relative ${showNotifs ? 'bg-white shadow-sm text-indigo-600' : 'text-gray-400 hover:bg-white hover:shadow-sm'}`}
              >
                <Bell size={20} />
                {unreadCount > 0 && (
                  <span className="absolute top-2 right-2 min-w-[18px] h-[18px] bg-red-500 text-white rounded-full border-2 border-[#F8F9FE] flex items-center justify-center text-[10px] font-black px-1 animate-bounce">
                    {unreadCount}
                  </span>
                )}
              </button>

              {/* Notification Dropdown */}
              {showNotifs && (
                <>
                  <div className="fixed inset-0 z-30" onClick={() => setShowNotifs(false)} />
                  <div className="absolute right-0 mt-3 w-80 bg-[#F8F9FE] rounded-3xl z-40 overflow-hidden animate-in fade-in zoom-in-95 duration-200 border border-gray-200 shadow-xl">
                    <div className="p-5 border-b border-gray-100 flex items-center justify-between">
                      <h3 className="font-bold text-sm text-gray-800 uppercase tracking-widest">Notifications</h3>
                      <button
                        onClick={() => setShowNotifs(false)}
                        className="p-2 text-gray-400 hover:text-gray-800 transition-colors bg-white border border-gray-100 rounded-xl"
                      >
                        <X size={14} />
                      </button>
                    </div>
                    <div className="max-h-[400px] overflow-y-auto">
                      {notifications.length === 0 ? (
                        <div className="p-10 text-center">
                          <p className="text-gray-400 text-sm font-medium">All caught up! 🎉</p>
                        </div>
                      ) : (
                        notifications.map((n) => (
                          <div key={n.id} className="p-5 border-b border-gray-50 hover:bg-gray-50 transition-colors cursor-pointer group">
                            <div className="flex items-start gap-4">
                              <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${n.type === 'assessment' ? 'bg-amber-50' :
                                n.type === 'assignment' ? 'bg-indigo-50' : 'bg-green-50'
                                }`}>
                                <span className="text-lg">
                                  {n.type === 'assessment' ? '🧪' : n.type === 'assignment' ? '📚' : '📄'}
                                </span>
                              </div>
                              <div className="flex-1">
                                <h4 className="text-sm font-bold text-gray-800 mb-1 group-hover:text-indigo-600 transition-colors">{n.title}</h4>
                                <p className="text-xs text-gray-500 leading-relaxed mb-2">{n.message}</p>
                                <p className="text-[9px] font-bold text-gray-300 uppercase tracking-tighter">
                                  {new Date(n.created_at).toLocaleDateString()} · {new Date(n.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </p>
                              </div>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                    <div className="p-3 bg-gray-50 text-center">
                      <button
                        onClick={() => {
                          setShowNotifs(false);
                          setShowAllNotifs(true);
                        }}
                        className="text-[10px] font-black text-gray-400 uppercase tracking-widest hover:text-gray-800 transition-colors w-full py-2"
                      >
                        View All Activity
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
            <div className="flex flex-col items-end mr-2">
              <span className="text-xs font-bold text-gray-800">{student.full_name}</span>
              <span className="text-[10px] text-gray-400 font-medium">
                {student.tech_course || "Select Path"}
              </span>
            </div>
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 border-2 border-white shadow-sm flex items-center justify-center text-white font-bold text-sm uppercase cursor-pointer overflow-hidden">
              {student.avatar_url ? (
                <img src={student.avatar_url} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                student.full_name.charAt(0)
              )}
            </div>
          </header>

          {/* Full Activity Modal */}
          {showAllNotifs && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-0 md:p-8 bg-black/80 backdrop-blur-sm animate-in fade-in duration-300">
              <div className="w-full max-w-4xl bg-white rounded-none md:rounded-[2rem] shadow-2xl flex flex-col h-full md:max-h-[85vh] overflow-hidden animate-in zoom-in-95 duration-300 border border-gray-100">

                {/* Header */}
                <div className="p-6 md:p-8 border-b border-gray-100 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <h3 className="text-xl font-bold text-gray-700">Notifications</h3>
                  </div>
                  <button
                    onClick={() => setShowAllNotifs(false)}
                    className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 hover:text-gray-900 transition-all border border-gray-100"
                  >
                    <X size={20} />
                  </button>
                </div>

                {/* List Content */}
                <div className="flex-1 overflow-y-auto bg-gray-50/30">
                  {notifications.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center text-center p-20">
                      <Bell size={48} className="text-gray-200 mb-4" />
                      <p className="text-gray-400 font-medium">No recent activity</p>
                    </div>
                  ) : (
                    <div className="flex flex-col">
                      {notifications.map((n, idx) => (
                        <div key={n.id} className="flex items-center gap-4 p-5 md:p-6 bg-white border-b border-gray-100 hover:bg-indigo-50/30 transition-colors">
                          {/* Status Dot */}
                          <div className={`w-2 h-2 rounded-full shrink-0 ${!n.is_read ? 'bg-indigo-500' : 'bg-transparent'}`} />

                          {/* Icon/Avatar Mock */}
                          <div className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 text-white font-bold
                            ${n.type === 'assessment' ? 'bg-amber-400' : n.type === 'assignment' ? 'bg-blue-500' : 'bg-green-500'}`}>
                            {n.type === 'assessment' ? '🧪' : n.type === 'assignment' ? '📚' : '📄'}
                          </div>

                          {/* Message Content */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between mb-0.5">
                              <h4 className="text-sm md:text-base font-bold text-blue-600 truncate uppercase tracking-tight">TUTOR</h4>
                              <span className="text-[10px] font-bold text-gray-300 uppercase shrink-0">
                                {idx === 0 ? 'NOW' : new Date(n.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                              </span>
                            </div>
                            <p className="text-xs md:text-sm text-gray-500 leading-snug line-clamp-2">
                              <span className="font-bold text-gray-700 mr-2">{n.title}:</span>
                              {n.message}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Action Bar */}
                <button
                  onClick={deleteAllNotifications}
                  className="w-full bg-blue-500 hover:bg-blue-600 text-white py-5 font-bold uppercase tracking-widest text-sm transition-all flex items-center justify-center gap-2 active:brightness-90"
                >
                  Clear All
                </button>
              </div>
            </div>
          )}

          {/* Dynamic Page Content */}
          <div className="p-6 md:p-12 w-full max-w-full mx-auto flex-1">
            {children}

            {/* --- STACKED RIGHT PANEL CONTENT (Calendar/Notices) --- */}
            <div className="mt-12 pt-12 border-t border-gray-100 grid grid-cols-1 md:grid-cols-2 gap-10">
              {/* Calendar Widget */}
              <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-lg font-bold text-gray-800">April 2026</h3>
                </div>
                <div className="grid grid-cols-7 gap-1 text-center text-xs">
                  {["S", "M", "T", "W", "T", "F", "S"].map((d, idx) => (
                    <span key={idx} className="text-gray-400 font-bold mb-2">{d}</span>
                  ))}
                  {/* Mock Calendar Grid */}
                  {Array.from({ length: 30 }).map((_, i) => {
                    const active = i + 1 === new Date().getDate(); // Current Day mock
                    return (
                      <span key={i} className={`py-1.5 rounded-lg flex items-center justify-center ${active
                        ? "bg-indigo-600 text-white shadow-md shadow-indigo-200 font-bold"
                        : "text-gray-600 hover:bg-gray-100 cursor-pointer font-medium"
                        }`}>
                        {i + 1}
                      </span>
                    );
                  })}
                </div>
              </div>

              {/* Upcoming Tasks */}
              <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
                <h3 className="text-lg font-bold text-gray-800 mb-6">Upcoming Notice</h3>
                <div className="space-y-6">
                  {assessmentDate ? (
                    <div className="relative pl-6 border-l-2 border-indigo-200">
                      <div className="absolute -left-[5px] top-1 w-2.5 h-2.5 rounded-full bg-indigo-500 shadow-[0_0_8px_rgba(99,102,241,0.6)]"></div>
                      <h4 className="font-bold text-base text-gray-800 mb-1">{assessmentDate.label || "Assessment"}</h4>
                      <p className="text-sm text-gray-500 leading-relaxed mb-3">
                        This scheduled assessment requires your online presence. Complete assignments beforehand.
                      </p>
                      <div className="inline-block bg-indigo-50 text-indigo-600 px-3 py-1.5 rounded text-xs font-bold tracking-wider uppercase">
                        {new Date(assessmentDate.assessment_date).toLocaleDateString("en-GB", {
                          day: "numeric", month: "short"
                        })}
                      </div>
                    </div>
                  ) : (
                    <div className="p-5 border border-dashed border-gray-200 rounded-xl bg-gray-50 text-center">
                      <p className="text-sm text-gray-400 font-medium">No upcoming assessments currently scheduled.</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
      <Footer />
    </div>
  );
}
