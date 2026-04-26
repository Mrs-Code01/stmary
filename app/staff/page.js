"use client";

import React, { useState, useEffect } from 'react';
import { BookOpen, GraduationCap, Medal, Baby, ChevronDown, Eye, EyeOff, Mail, Lock, User, Hash, Laptop } from 'lucide-react';
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import { FaTimes } from "react-icons/fa";

// ─── Helpers ────────────────────────────────────────────────────────────────

function getStrength(pwd) {
  if (!pwd || pwd.length < 6) return "weak";
  const hasLetter  = /[a-zA-Z]/.test(pwd);
  const hasNumber  = /\d/.test(pwd);
  const hasSpecial = /[!@#$%^&*_\-]/.test(pwd);
  if (pwd.length >= 10 && hasLetter && hasNumber && hasSpecial) return "strong";
  if (pwd.length >= 8  && hasLetter && hasNumber)               return "medium";
  return "weak";
}

function validatePassword(pwd) {
  if (!pwd || pwd.length < 8) return "Must be at least 8 characters.";
  if (!/[a-zA-Z]/.test(pwd))  return "Must contain at least one letter.";
  if (!/\d/.test(pwd))        return "Must contain at least one number.";
  return "";
}

const strengthConfig = {
  weak:   { label: "Weak",   color: "#f87171", width: "33%"  },
  medium: { label: "Medium", color: "#f59e0b", width: "66%"  },
  strong: { label: "Strong", color: "#22c55e", width: "100%" },
};

function StrengthBar({ strength }) {
  const cfg = strengthConfig[strength];
  return (
    <div className="mt-2">
      <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
        <div
          style={{ width: cfg.width, backgroundColor: cfg.color, transition: "all 0.35s ease" }}
          className="h-full rounded-full"
        />
      </div>
      <p style={{ color: cfg.color }} className="text-xs mt-1 font-bold">{cfg.label}</p>
    </div>
  );
}

function Spinner() {
  return (
    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
    </svg>
  );
}

// ─── Main Component ──────────────────────────────────────────────────────────

export default function StaffPortal() {
  const router = useRouter();
  const [activeModalClass, setActiveModalClass] = useState(null);

  // Login state
  const [teacherId, setTeacherId] = useState("");
  const [password,  setPassword]  = useState("");
  const [showPwd,   setShowPwd]   = useState(false);
  const [loading,   setLoading]   = useState(false);
  const [error,     setError]     = useState("");

  // Registration state
  const [regTeacherId,       setRegTeacherId]       = useState("");
  const [regEmail,           setRegEmail]           = useState("");
  const [regPassword,        setRegPassword]        = useState("");
  const [regConfirmPassword, setRegConfirmPassword] = useState("");
  const [regClass,           setRegClass]           = useState("");
  const [regSubject,         setRegSubject]         = useState("");
  const [regSubjectId,       setRegSubjectId]       = useState("");
  const [showRegPwd,         setShowRegPwd]         = useState(false);
  const [showRegConfirm,     setShowRegConfirm]     = useState(false);
  const [regError,           setRegError]           = useState("");

  const [availableSubjects,   setAvailableSubjects]   = useState([]);
  const [availableSubjectIds, setAvailableSubjectIds] = useState([]);

  // Modal sub-step: "login" | "register" | "regSuccess"
  const [step, setStep] = useState("login");

  // Forgot-password (inline in login)
  const [forgotMode,    setForgotMode]    = useState(false);
  const [forgotEmail,   setForgotEmail]   = useState("");
  const [forgotLoading, setForgotLoading] = useState(false);
  const [forgotError,   setForgotError]   = useState("");
  const [forgotSuccess, setForgotSuccess] = useState(false);

  const [selectedClasses, setSelectedClasses] = useState({
    "Nursery": "",
    "Lower Basic": "",
    "Higher Basic": "",
    "Senior": "",
  });

  const [userType, setUserType] = useState("class"); // "class" | "subject"

  const handleSelectChange = (category, value) =>
    setSelectedClasses((prev) => ({ ...prev, [category]: value }));

  const classToId = (name) => name.replace(/\s+/g, "_").toUpperCase();

  useEffect(() => {
    if (regClass) {
      if (userType === 'tech') {
        fetchTechCoursesForClass(regClass);
      } else {
        fetchSubjectsForClass(regClass);
      }
      setRegSubject("");
      setRegSubjectId("");
    } else {
      setAvailableSubjects([]);
    }
  }, [regClass, userType]);

  useEffect(() => {
    if (regSubject && regClass) {
      if (userType === 'tech') {
        fetchTechCourseIds(regSubject, regClass);
      } else {
        fetchSubjectIds(regSubject, regClass);
      }
      setRegSubjectId("");
    } else {
      setAvailableSubjectIds([]);
    }
  }, [regSubject, regClass, userType]);

  const fetchSubjectsForClass = async (className) => {
    const { data } = await supabase
      .from("subjects")
      .select("*")
      .eq("class_name", className)
      .order("name", { ascending: true });
    setAvailableSubjects(data || []);
  };

  const fetchTechCoursesForClass = async (className) => {
    const { data } = await supabase
      .from("tech_courses")
      .select("*")
      .eq("class_name", className)
      .order("name", { ascending: true });
    setAvailableSubjects(data || []);
  };

  const fetchSubjectIds = async (subjectId, className) => {
    const { data } = await supabase
      .from("subject_ids")
      .select("*")
      .eq("subject_id", subjectId)
      .eq("class_name", className)
      .order("external_id", { ascending: true });
    setAvailableSubjectIds(data || []);
  };

  const fetchTechCourseIds = async (courseId, className) => {
    const { data } = await supabase
      .from("tech_course_ids")
      .select("*")
      .eq("tech_course_id", courseId)
      .eq("class_name", className)
      .order("external_id", { ascending: true });
    setAvailableSubjectIds(data || []);
  };

  const openModal = (categoryTitle, type = "class") => {
    const cls = categoryTitle === "Subject Access" ? "" : selectedClasses[categoryTitle];
    if (type === "class" && !cls) { alert("Please select a class first from the dropdown!"); return; }
    
    setActiveModalClass(cls || "Subject Teacher");
    setUserType(type);
    setTeacherId(""); setPassword(""); setShowPwd(false);
    setRegEmail(""); setRegPassword(""); setRegConfirmPassword("");
    setRegClass(cls); setRegSubject(""); setRegSubjectId(""); setRegTeacherId("");
    setShowRegPwd(false); setShowRegConfirm(false);
    setError(""); setRegError(""); setForgotMode(false);
    setForgotEmail(""); setForgotError(""); setForgotSuccess(false);
    setStep("login");
  };

  const closeModal = () => setActiveModalClass(null);

  // ── Computed for registration form ────────────────────────────────────────
  const regPwdError     = regPassword ? validatePassword(regPassword) : "";
  const regConfirmError = regConfirmPassword && regPassword !== regConfirmPassword
    ? "Passwords do not match." : "";
  const regStrength     = regPassword ? getStrength(regPassword) : null;
  
  const regIsSubjectValid =
    regEmail.trim() && regPassword && regConfirmPassword &&
    regClass && regSubject && regSubjectId &&
    !regPwdError && !regConfirmError;

  const regIsClassValid =
    regEmail.trim() && regPassword && regConfirmPassword &&
    regClass && regTeacherId.trim() &&
    !regPwdError && !regConfirmError;

  const regIsValid = userType === "class" ? regIsClassValid : regIsSubjectValid;

  // ── Handlers ──────────────────────────────────────────────────────────────

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    const logId = teacherId.trim();

    if (userType === "class") {
      const cls = activeModalClass;
      // Fetch teacher by ID and class_id to ensure they match
      const { data: teacher } = await supabase
        .from("teachers")
        .select("*")
        .eq("id", logId)
        .eq("class_id", cls)
        .maybeSingle();

      if (!teacher) {
        setLoading(false);
        setError("Invalid Staff ID or Class selection.");
        return;
      }

      const { error: authErr } = await supabase.auth.signInWithPassword({
        email: teacher.email,
        password: password.trim(),
      });

      if (authErr) {
        setLoading(false);
        setError("Incorrect password.");
        return;
      }

      setLoading(false);
      document.cookie = `smcs_teacher=${encodeURIComponent(JSON.stringify({ id: teacher.id, class_id: teacher.class_id, type: "class" }))}; path=/; max-age=${60 * 60 * 8}; SameSite=Lax`;
      router.push(`/staff/${teacher.class_id}/dashboard`);
    } else if (userType === "subject") {
      // Subject Teacher Login
      const { data: teacher } = await supabase.from("subject_teachers").select("*").eq("subject_id", logId).maybeSingle();
      if (!teacher) {
        setLoading(false);
        setError("Subject ID not found.");
        return;
      }

      const { error: authErr } = await supabase.auth.signInWithPassword({
        email: teacher.email,
        password: password.trim(),
      });

      if (authErr) {
        setLoading(false);
        setError("Incorrect password.");
        return;
      }

      setLoading(false);
      document.cookie = `smcs_teacher=${encodeURIComponent(JSON.stringify({ 
        id: teacher.subject_id, 
        class_id: teacher.cclass, 
        subject: teacher.subject, 
        type: "subject" 
      }))}; path=/; max-age=${60 * 60 * 8}; SameSite=Lax`;
      router.push(`/staff/${teacher.cclass}/dashboard`);
    } else if (userType === "tech") {
      // Tech Teacher Login
      const { data: teacher } = await supabase.from("tech_teachers").select("*").eq("course_id", logId).maybeSingle();
      if (!teacher) {
        setLoading(false);
        setError("Tech Course ID not found.");
        return;
      }

      const { error: authErr } = await supabase.auth.signInWithPassword({
        email: teacher.email,
        password: password.trim(),
      });

      if (authErr) {
        setLoading(false);
        setError("Incorrect password.");
        return;
      }

      setLoading(false);
      document.cookie = `smcs_teacher=${encodeURIComponent(JSON.stringify({ 
        id: teacher.course_id, 
        class_id: teacher.cclass, 
        subject: teacher.course, 
        type: "tech" 
      }))}; path=/; max-age=${60 * 60 * 8}; SameSite=Lax`;
      router.push(`/staff/${teacher.cclass}/dashboard`);
    }
  };

  const handleRegister = async () => {
    setRegError("");
    if (!regIsValid) { setRegError("Please complete all fields correctly."); return; }

    setLoading(true);
    const classId = regClass;
    let loginId = "";

    if (userType === "class") {
      const trimmedId = regTeacherId.trim();

      // 1. Check if this Staff ID is already used by ANY class teacher
      const { data: idInUse } = await supabase
        .from("teachers")
        .select("class_id")
        .eq("id", trimmedId)
        .maybeSingle();

      if (idInUse) {
        setLoading(false);
        setRegError(`Staff ID "${trimmedId}" is already registered for ${idInUse.class_id}.`);
        return;
      }

      // 2. Check if the selected class already has a class teacher
      const { data: classInUse } = await supabase
        .from("teachers")
        .select("id")
        .eq("class_id", classId)
        .maybeSingle();

      if (classInUse) {
        setLoading(false);
        setRegError(`The class "${classId}" already has a class teacher.`);
        return;
      }

      loginId = trimmedId;
    } else if (userType === "subject") {
      const trimmedSubId = regSubjectId.trim();
      // 1. Check if this Subject ID is already used
      const { data: subIdInUse } = await supabase
        .from("subject_teachers")
        .select("subject_id")
        .eq("subject_id", trimmedSubId)
        .maybeSingle();

      if (subIdInUse) {
        setLoading(false);
        setRegError(`Subject ID "${trimmedSubId}" is already taken.`);
        return;
      }
      loginId = trimmedSubId;
    } else if (userType === "tech") {
      const trimmedTechId = regSubjectId.trim();
      // 1. Check if this Tech ID is already used
      const { data: techIdInUse } = await supabase
        .from("tech_teachers")
        .select("course_id")
        .eq("course_id", trimmedTechId)
        .maybeSingle();

      if (techIdInUse) {
        setLoading(false);
        setRegError(`Tech Course ID "${trimmedTechId}" is already taken.`);
        return;
      }
      loginId = trimmedTechId;
    }

    const emailCheck = regEmail.trim().toLowerCase();

    // ── Global Email Uniqueness Check ──
    const { data: studentEmail } = await supabase.from("students").select("id").eq("email", emailCheck).maybeSingle();
    const { data: teacherEmail } = await supabase.from("teachers").select("id").eq("email", emailCheck).maybeSingle();
    const { data: subTeacherEmail } = await supabase.from("subject_teachers").select("id").eq("email", emailCheck).maybeSingle();
    const { data: techTeacherEmail } = await supabase.from("tech_teachers").select("id").eq("email", emailCheck).maybeSingle();

    if (studentEmail || teacherEmail || subTeacherEmail || techTeacherEmail) {
      setLoading(false);
      setRegError("This email is already associated with an account on this portal.");
      return;
    }

    let { data: authData, error: authErr } = await supabase.auth.signUp({
      email: regEmail.trim().toLowerCase(),
      password: regPassword,
    });

    if (authErr && authErr.message.includes("User already registered")) {
      const { error: signInErr } = await supabase.auth.signInWithPassword({
        email: regEmail.trim().toLowerCase(),
        password: regPassword,
      });
      if (signInErr) {
        setLoading(false);
        setRegError("Invalid password for existing account.");
        return;
      }
      authErr = null;
    }

    if (authErr) {
      setLoading(false);
      setRegError(authErr.message);
      return;
    }

    if (userType === "class") {
      const { error: dbErr } = await supabase.from("teachers").upsert({
        id: loginId,
        email: regEmail.trim().toLowerCase(),
        class_id: classId,
        subject_id: null,
      }, { onConflict: 'id' });
      if (dbErr) { setLoading(false); setRegError(dbErr.message); return; }
    } else if (userType === "subject") {
      const { error: dbErr } = await supabase.from("subject_teachers").upsert({
        cclass: classId,
        subject: regSubject,
        email: regEmail.trim().toLowerCase(),
        subject_id: loginId,
        password: "HIDDEN_IN_DB_USE_AUTH",
      }, { onConflict: 'subject_id' });
      if (dbErr) { setLoading(false); setRegError(dbErr.message); return; }
    } else if (userType === "tech") {
      const { error: dbErr } = await supabase.from("tech_teachers").upsert({
        cclass: classId,
        course: regSubject,
        email: regEmail.trim().toLowerCase(),
        course_id: loginId,
        password: "HIDDEN_IN_DB_USE_AUTH",
      }, { onConflict: 'course_id' });
      if (dbErr) { setLoading(false); setRegError(dbErr.message); return; }
    }

    setLoading(false);
    setRegTeacherId(loginId);
    setStep("regSuccess");
  };

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    setForgotError("");
    if (!forgotEmail.trim()) { setForgotError("Please enter your email address."); return; }
    setForgotLoading(true);

    const { error } = await supabase.auth.resetPasswordForEmail(
      forgotEmail.trim().toLowerCase(),
      { redirectTo: `${window.location.origin}/reset-password` }
    );

    setForgotLoading(false);
    if (error) { setForgotError(error.message); return; }
    setForgotSuccess(true);
  };

  // ── Class categories ──────────────────────────────────────────────────────
  const categories = [
    {
      title: "Nursery",
      icon: <Baby className="w-6 h-6 text-purple-600" />,
      iconBg: "bg-purple-50", borderColor: "border-purple-500",
      buttonBg: "bg-purple-300", hoverBg: "hover:bg-purple-400",
      classes: ["Pre-Nursery", "Nursery 1", "Nursery 2", "Nursery 3"],
    },
    {
      title: "Lower Basic",
      icon: <BookOpen className="w-6 h-6 text-blue-600" />,
      iconBg: "bg-blue-50", borderColor: "border-blue-500",
      buttonBg: "bg-blue-300", hoverBg: "hover:bg-blue-400",
      classes: ["Basic 1","Basic 2","Basic 3","Basic 4","Basic 5","Basic 6"],
    },
    {
      title: "Higher Basic",
      icon: <GraduationCap className="w-6 h-6 text-green-600" />,
      iconBg: "bg-green-50", borderColor: "border-green-500",
      buttonBg: "bg-green-300", hoverBg: "hover:bg-green-400",
      classes: ["Basic 7","Basic 8","Basic 9"],
    },
    {
      title: "Senior",
      icon: <Medal className="w-6 h-6 text-orange-600" />,
      iconBg: "bg-orange-50", borderColor: "border-orange-500",
      buttonBg: "bg-orange-300", hoverBg: "hover:bg-orange-400",
      classes: ["SS1","SS2","SS3"],
    },
  ];

  const CLASS_LIST = [
    "Pre-Nursery", "Nursery 1", "Nursery 2", "Nursery 3", 
    "Basic 1", "Basic 2", "Basic 3", "Basic 4", "Basic 5", "Basic 6", 
    "Basic 7", "Basic 8", "Basic 9", "SS1", "SS2", "SS3"
  ];

  const TECH_GROUPS = [
    "Basic 1 - 6",
    "Basic 7 - 9",
    "SS1 - SS3"
  ];

  // ─────────────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-white flex flex-col items-center py-10 px-6 font-sans">
      
      {/* Top Nav */}
      <div className="w-full max-w-6xl flex justify-start mb-10 md:mb-16">
        <button
          onClick={() => router.push("/")}
          className="text-gray-500 hover:text-gray-900 font-medium transition-colors text-sm md:text-base"
        >
          ← Back to Home
        </button>
      </div>

      <div className="flex flex-col items-center w-full max-w-6xl flex-grow justify-center pb-20">
        
        {/* Header */}
        <div className="text-center mb-12 flex flex-col items-center">
          <img
            src="/images/logo.png"
            alt="St Mary Logo"
            className="w-24 h-24 object-contain mb-4 transform transition-transform duration-300 hover:scale-110 hover:-rotate-6"
          />
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Staff Portal</h1>
          <p className="text-gray-500 text-lg">Class & Subject Teacher Access</p>
        </div>

        {/* SECTION 1: Class Teacher Access */}
        <div className="w-full max-w-6xl mb-24">
          <div className="flex items-center gap-6 mb-12">
            <div className="h-[2px] bg-gray-100 flex-1 rounded-full" />
            <h2 className="text-xl font-bold text-gray-500 px-4 whitespace-nowrap">Class Teacher Access</h2>
            <div className="h-[2px] bg-gray-100 flex-1 rounded-full" />
          </div>

          {/* TIER 1 */}
          <div className="flex items-center gap-6 mb-8 mt-12 bg-blue-50/50 p-4 rounded-2xl border border-blue-100">
            <span className="text-2xl">🏫</span>
            <div className="flex flex-col">
              <h3 className="text-lg font-black text-blue-800 tracking-tight">Tier 1 Categories</h3>
              <p className="text-blue-600/70 text-xs font-bold uppercase tracking-wider">Pre-Nursery — Basic 6</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 w-full mb-20 max-w-4xl mx-auto">
            {categories.slice(0, 2).map((item, index) => (
              <div
                key={index}
                className={`border-2 ${item.borderColor} rounded-[2rem] p-8 flex flex-col items-center bg-white transition-all duration-300 group`}
              >
                <div className={`${item.iconBg} p-4 rounded-2xl mb-6 shadow-sm group-hover:scale-110 transition-transform`}>{item.icon}</div>
                <h2 className="text-2xl font-black text-gray-800 mb-6">{item.title}</h2>

                <div className="relative w-full mb-8">
                  <select
                    value={selectedClasses[item.title]}
                    onChange={(e) => handleSelectChange(item.title, e.target.value)}
                    className="w-full appearance-none bg-gray-50 border border-gray-100 rounded-xl py-4 px-5
                      text-gray-600 focus:outline-none focus:ring-4 focus:ring-gray-100 transition-all cursor-pointer font-bold text-sm shadow-sm"
                  >
                    <option value="">Select class</option>
                    {item.classes.map((cls) => <option key={cls} value={cls}>{cls}</option>)}
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center px-4 pointer-events-none">
                    <ChevronDown className="w-4 h-4 text-gray-400" />
                  </div>
                </div>

                <button
                  onClick={() => openModal(item.title, "class")}
                  className={`w-full py-4 rounded-xl text-white font-bold text-lg transition-all
                    ${item.buttonBg} ${item.hoverBg} shadow-lg active:scale-95`}
                >
                  Login
                </button>
              </div>
            ))}
          </div>

          {/* TIER 2 */}
          <div className="flex items-center gap-6 mb-8 bg-purple-50/50 p-4 rounded-2xl border border-purple-100">
            <span className="text-2xl">🎓</span>
            <div className="flex flex-col">
              <h3 className="text-lg font-black text-purple-800 tracking-tight">Tier 2 Categories</h3>
              <p className="text-purple-600/70 text-xs font-bold uppercase tracking-wider">Basic 7 — SS3</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 w-full max-w-4xl mx-auto">
            {categories.slice(2, 4).map((item, index) => (
              <div
                key={index}
                className={`border-2 ${item.borderColor} rounded-[2rem] p-8 flex flex-col items-center bg-white transition-all duration-300 group`}
              >
                <div className={`${item.iconBg} p-4 rounded-2xl mb-6 group-hover:scale-110 transition-transform`}>{item.icon}</div>
                <h2 className="text-2xl font-black text-gray-800 mb-6">{item.title}</h2>

                <div className="relative w-full mb-8">
                  <select
                    value={selectedClasses[item.title]}
                    onChange={(e) => handleSelectChange(item.title, e.target.value)}
                    className="w-full appearance-none bg-gray-50 border border-gray-100 rounded-xl py-4 px-5
                      text-gray-600 focus:outline-none focus:ring-4 focus:ring-gray-100 transition-all cursor-pointer font-bold text-sm shadow-sm"
                  >
                    <option value="">Select class</option>
                    {item.classes.map((cls) => <option key={cls} value={cls}>{cls}</option>)}
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center px-4 pointer-events-none">
                    <ChevronDown className="w-4 h-4 text-gray-400" />
                  </div>
                </div>

                <button
                  onClick={() => openModal(item.title, "class")}
                  className={`w-full py-4 rounded-xl text-white font-bold text-lg transition-all
                    ${item.buttonBg} ${item.hoverBg} shadow-lg active:scale-95`}
                >
                  Login
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* SECTION 2: Subject & Tech Staff Access */}
        <div className="w-full max-w-6xl mt-20">
          <div className="flex items-center gap-6 mb-16">
            <div className="h-[2px] bg-slate-100 flex-1 rounded-full" />
            <div className="bg-indigo-600 px-8 py-2.5 rounded-full shadow-lg shadow-indigo-200">
              <h2 className="text-sm font-black text-white uppercase tracking-[0.2em]">Subject & Tech Staff Access</h2>
            </div>
            <div className="h-[2px] bg-slate-100 flex-1 rounded-full" />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 w-full max-w-4xl mx-auto">
            {/* Subject Teacher Login */}
            <div className="group bg-white border-2 border-indigo-500 rounded-[2rem] p-8 flex flex-col items-center transition-all duration-300 relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-40 h-40 bg-blue-50/50 blur-[80px] -mr-16 -mt-16" />
              <div className="relative z-10 flex flex-col items-center">
                <div className="w-16 h-16 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-600 mb-6">
                  <BookOpen className="w-6 h-6" />
                </div>
                <h2 className="text-2xl font-black text-gray-800 mb-6">Subject Login</h2>
                <button 
                  onClick={() => openModal("Subject Access", "subject")}
                  className="w-full bg-indigo-600 text-white py-4 rounded-xl font-bold text-lg hover:bg-indigo-700 transition-all active:scale-95 shadow-lg"
                >
                  Login
                </button>
              </div>
            </div>

            {/* Tech Staff Login */}
            <div className="group bg-white border-2 border-teal-500 rounded-[2rem] p-8 flex flex-col items-center transition-all duration-300 relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-40 h-40 bg-teal-50/50 blur-[80px] -mr-16 -mt-16" />
              <div className="relative z-10 flex flex-col items-center">
                <div className="w-16 h-16 rounded-2xl bg-teal-50 flex items-center justify-center text-teal-600 mb-6">
                  <Laptop className="w-6 h-6" />
                </div>
                <h2 className="text-2xl font-black text-gray-800 mb-6">Tech Staff Login</h2>
                <button 
                  onClick={() => openModal("Tech Access", "tech")}
                  className="w-full bg-teal-600 text-white py-4 rounded-xl font-bold text-lg hover:bg-teal-700 transition-all active:scale-95 shadow-lg"
                >
                  Login
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Modal ── */}
      {activeModalClass && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-md">
          <div className="w-full max-w-md bg-white border border-gray-100 rounded-[2rem] p-8 md:p-10 shadow-2xl relative max-h-[90vh] overflow-y-auto custom-scrollbar">

            <button
              onClick={closeModal}
              className="absolute top-5 right-5 text-gray-400 hover:text-gray-800 transition-colors"
            >
              <FaTimes size={18} />
            </button>

            {/* Modal header */}
            <div className="mb-8">
              <p className="text-gray-400 text-xs font-bold uppercase tracking-widest mb-1">{step === 'register' ? 'New Account' : 'Portal Access'}</p>
              <h2 className="text-3xl font-black text-gray-800 tracking-tight">{step === 'register' ? activeModalClass : 'Login Access'}</h2>
            </div>

            {/* ── LOGIN STEP ── */}
            {step === "login" && !forgotMode && (
              <>
                <form onSubmit={handleLogin} className="space-y-4">
                  <div>
                    <label className="text-gray-600 text-xs font-bold uppercase tracking-wider block mb-2 px-1">
                      {userType === 'class' ? 'Teacher ID' : userType === 'tech' ? 'Tech ID' : 'Subject ID'}
                    </label>
                    <input
                      type="text"
                      value={teacherId}
                      onChange={(e) => setTeacherId(e.target.value)}
                      placeholder={userType === 'class' ? "e.g. SMCSTUTOR01" : userType === 'tech' ? "e.g. TECH-001" : "e.g. MATH-001"}
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3.5 text-gray-900
                        placeholder-gray-400 focus:outline-none focus:border-blue-500 transition-colors text-sm font-mono font-bold"
                    />
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label className="text-gray-600 text-xs font-bold uppercase tracking-wider">
                        Password
                      </label>
                      <button
                        type="button"
                        onClick={() => setForgotMode(true)}
                        className="text-blue-500 text-xs font-bold hover:text-blue-700 transition-colors hover:underline"
                      >
                        Forgot password?
                      </button>
                    </div>
                    <div className="relative">
                      <input
                        type={showPwd ? "text" : "password"}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Your password"
                        className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 pr-11 text-gray-900
                          placeholder-gray-400 focus:outline-none focus:border-blue-500 transition-colors text-sm"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPwd((v) => !v)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors p-1"
                        tabIndex={-1}
                      >
                        {showPwd ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                  </div>

                  {error && (
                    <div className="bg-red-50 border border-red-100 rounded-xl px-4 py-3 text-red-500 text-xs">
                      {error}
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full mt-2 bg-blue-600 text-white py-3.5 rounded-xl font-bold uppercase
                      tracking-wider text-sm hover:bg-blue-700 transition-colors active:scale-95
                      disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {loading ? <><Spinner /> Logging in…</> : "Log In →"}
                  </button>
                </form>

                <div className="mt-8 pt-6 border-t border-gray-100 text-center">
                  <p className="text-gray-500 text-xs font-medium mb-3">Not registered yet?</p>
                  <button
                    onClick={() => setStep("register")}
                    className="w-full bg-orange-50 text-orange-600 hover:bg-orange-600 hover:text-white
                      border border-orange-200 py-3.5 rounded-xl text-sm font-bold transition-all"
                  >
                    Create Account
                  </button>
                </div>
              </>
            )}

            {/* ── FORGOT PASSWORD STEP ── */}
            {step === "login" && forgotMode && (
              <>
                <button
                  onClick={() => { setForgotMode(false); setForgotSuccess(false); setForgotError(""); setForgotEmail(""); }}
                  className="text-gray-400 text-xs font-bold uppercase tracking-wider mb-5
                    hover:text-gray-600 transition-colors flex items-center gap-1"
                >
                  ← Back to Login
                </button>

                {forgotSuccess ? (
                  <div className="text-center py-4">
                    <div className="w-12 h-12 bg-green-50 border border-green-200 rounded-2xl flex items-center justify-center mx-auto mb-4">
                      <span className="text-xl">📧</span>
                    </div>
                    <p className="text-gray-800 font-bold text-sm mb-2">Reset link sent!</p>
                    <p className="text-gray-500 text-xs leading-relaxed">
                      Check <span className="font-bold text-blue-600">{forgotEmail}</span> for a password reset link.
                    </p>
                  </div>
                ) : (
                  <>
                    <p className="text-gray-600 text-sm mb-5">
                      Enter your registered email and we'll send a reset link.
                    </p>
                    <form onSubmit={handleForgotPassword} className="space-y-4">
                      <div>
                        <label className="text-gray-600 text-xs font-bold uppercase tracking-wider block mb-2">
                          Email Address
                        </label>
                        <input
                          type="email"
                          value={forgotEmail}
                          onChange={(e) => setForgotEmail(e.target.value)}
                          placeholder="e.g. teacher@school.com"
                          required
                          className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-gray-900
                            placeholder-gray-400 focus:outline-none focus:border-blue-500 transition-colors text-sm"
                        />
                      </div>
                      {forgotError && (
                        <div className="bg-red-50 border border-red-100 rounded-xl px-4 py-3 text-red-500 text-xs">
                          {forgotError}
                        </div>
                      )}
                      <button
                        type="submit"
                        disabled={forgotLoading}
                        className="w-full bg-blue-600 text-white py-3.5 rounded-xl font-bold uppercase
                          tracking-wider text-sm hover:bg-blue-700 transition-colors active:scale-95
                          disabled:opacity-50 flex items-center justify-center gap-2"
                      >
                        {forgotLoading ? <><Spinner /> Sending…</> : "Send Reset Link →"}
                      </button>
                    </form>
                  </>
                )}
              </>
            )}

            {/* ── REGISTER STEP ── */}
            {step === "register" && (
              <>
                <button
                  onClick={() => setStep("login")}
                  className="text-gray-400 text-xs font-bold uppercase tracking-wider mb-5
                    hover:text-gray-600 transition-colors flex items-center gap-1"
                >
                  ← Back to Login
                </button>
                <p className="text-gray-500 text-xs mb-5 leading-relaxed font-bold">
                  {userType === 'class' ? `Enter your details as the Class Teacher for ${activeModalClass}.` : userType === 'tech' ? 'Create your account using your Tech ID.' : 'Create your account using your Subject ID.'}
                </p>

                <div className="space-y-5">
                  <div>
                    <label className="text-gray-500 text-xs font-bold uppercase tracking-wider block mb-2 px-1">Email Address</label>
                    <input
                      type="email"
                      value={regEmail}
                      onChange={(e) => setRegEmail(e.target.value)}
                      placeholder="e.g. teacher@school.com"
                      className="w-full bg-[#f0f4f9] border border-gray-200 rounded-xl px-4 py-3.5 text-gray-800 placeholder-gray-400 focus:outline-none focus:border-indigo-400 transition-all text-sm font-medium"
                    />
                  </div>

                  <div>
                    <label className="text-gray-500 text-xs font-bold uppercase tracking-wider block mb-2 px-1">
                      {userType === 'tech' ? 'Tech Group' : 'Class'}
                    </label>
                    <div className="relative">
                      <select
                        value={regClass}
                        onChange={(e) => setRegClass(e.target.value)}
                        className="w-full appearance-none bg-white border border-gray-200 rounded-xl px-4 py-3.5 text-gray-800 focus:outline-none focus:border-indigo-400 transition-all text-sm font-medium"
                      >
                        <option value="">{regClass ? regClass : userType === 'tech' ? "Choose Tech Group..." : "Choose Class..."}</option>
                        {userType === 'tech' 
                          ? TECH_GROUPS.map(cls => <option key={cls} value={cls}>{cls}</option>)
                          : CLASS_LIST.map(cls => <option key={cls} value={cls}>{cls}</option>)
                        }
                      </select>
                      <ChevronDown size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                    </div>
                  </div>

                  {userType === "class" ? (
                    <div>
                      <label className="text-gray-500 text-xs font-bold uppercase tracking-wider block mb-2 px-1">Tutor ID</label>
                      <input
                        type="text"
                        value={regTeacherId}
                        onChange={(e) => setRegTeacherId(e.target.value)}
                        placeholder="e.g. SMCSTUTOR01"
                        className="w-full bg-[#f0f4f9] border border-gray-200 rounded-xl px-4 py-3.5 text-gray-800 placeholder-gray-400 focus:outline-none focus:border-indigo-400 transition-all text-sm font-mono font-bold"
                      />
                    </div>
                  ) : (
                    <>
                      {regClass && (
                        <div>
                          <label className="text-gray-500 text-xs font-bold uppercase tracking-wider block mb-2 px-1">
                            {userType === 'tech' ? 'Assigned Tech Course' : 'Assigned Subject'}
                          </label>
                          <div className="relative">
                            <select
                              value={regSubject}
                              onChange={(e) => setRegSubject(e.target.value)}
                              className="w-full appearance-none bg-white border border-gray-200 rounded-xl px-4 py-3.5 text-gray-800 focus:outline-none focus:border-indigo-400 transition-all text-sm font-medium"
                            >
                              <option value="">Select Subject...</option>
                              {availableSubjects.map(sub => <option key={sub.id} value={sub.id}>{sub.name}</option>)}
                            </select>
                            <ChevronDown size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                          </div>
                        </div>
                      )}
                      {regSubject && (
                        <div>
                          <label className="text-gray-500 text-xs font-bold uppercase tracking-wider block mb-2 px-1">
                            {userType === 'tech' ? 'Tech Course ID' : 'Subject ID'}
                          </label>
                          <div className="relative">
                            <select
                              value={regSubjectId}
                              onChange={(e) => setRegSubjectId(e.target.value)}
                              className="w-full appearance-none bg-[#f0f4f9] border border-gray-200 rounded-xl px-4 py-3.5 text-gray-800 focus:outline-none focus:border-indigo-400 transition-all text-sm font-medium"
                            >
                              <option value="">{userType === 'tech' ? 'Link Tech ID...' : 'Link Subject ID...'}</option>
                              {availableSubjectIds.map(id => (
                                <option key={id.id} value={id.external_id}>
                                  {id.external_id}
                                </option>
                              ))}
                            </select>
                            <Hash size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                          </div>
                        </div>
                      )}
                    </>
                  )}

                  <div>
                    <label className="text-gray-500 text-xs font-bold uppercase tracking-wider block mb-2 px-1">Password</label>
                    <div className="relative">
                      <input
                        type={showRegPwd ? "text" : "password"}
                        value={regPassword}
                        onChange={(e) => setRegPassword(e.target.value)}
                        placeholder="Min. 8 chars, letter + number"
                        className="w-full bg-[#f0f4f9] border border-gray-200 rounded-xl px-4 py-3.5 pr-11 text-gray-800 placeholder-gray-400 focus:outline-none focus:border-indigo-400 transition-all text-sm"
                      />
                      <button onClick={()=>setShowRegPwd(!showRegPwd)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"><Eye size={16}/></button>
                    </div>
                    {regPassword && regStrength && <StrengthBar strength={regStrength} />}
                  </div>

                  <div>
                    <label className="text-gray-500 text-xs font-bold uppercase tracking-wider block mb-2 px-1">Confirm Password</label>
                    <div className="relative">
                      <input
                        type={showRegConfirm ? "text" : "password"}
                        value={regConfirmPassword}
                        onChange={(e) => setRegConfirmPassword(e.target.value)}
                        placeholder="Re-enter your password"
                        className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3.5 pr-11 text-gray-800 placeholder-gray-400 focus:outline-none focus:border-indigo-400 transition-all text-sm"
                      />
                      <button onClick={()=>setShowRegConfirm(!showRegConfirm)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"><Eye size={16}/></button>
                    </div>
                  </div>
                </div>

                {regError && (
                  <div className="mt-4 bg-red-50 border border-red-100 rounded-xl px-4 py-3 text-red-500 text-xs font-bold">
                    {regError}
                  </div>
                )}

                <button
                  onClick={handleRegister}
                  disabled={loading || !regIsValid}
                  className="w-full mt-8 bg-[#ffb07c] text-white py-4 rounded-xl font-black uppercase
                    tracking-widest text-sm hover:opacity-90 transition-all active:scale-95
                    disabled:opacity-50 flex items-center justify-center gap-3 shadow-md"
                >
                  {loading ? <Spinner /> : "Create Account →"}
                </button>
              </>
            )}

            {/* ── REGISTRATION SUCCESS ── */}
            {step === "regSuccess" && (
              <div className="space-y-6">
                <div className="flex items-center gap-4 bg-green-50 px-4 py-5 rounded-xl">
                  <span className="text-3xl">✅</span>
                  <div>
                    <p className="text-green-800 font-bold text-sm">Account Created!</p>
                    <p className="text-green-600 text-xs mt-1">
                      Your staff profile is ready. You can now log in to the portal.
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => {
                    setTeacherId(regTeacherId);
                    setStep("login");
                  }}
                  className="w-full mt-4 bg-blue-600 text-white py-4 rounded-xl font-bold uppercase
                    tracking-wider text-sm hover:bg-blue-700 shadow-md shadow-blue-200
                    transition-all active:scale-95"
                >
                  Continue to Login →
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
