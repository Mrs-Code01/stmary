"use client";

import React, { useState } from 'react';
import { BookOpen, GraduationCap, Medal, Baby, ChevronDown, Eye, EyeOff } from 'lucide-react';
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
  const [showRegPwd,         setShowRegPwd]         = useState(false);
  const [showRegConfirm,     setShowRegConfirm]     = useState(false);
  const [regError,           setRegError]           = useState("");

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

  const handleSelectChange = (category, value) =>
    setSelectedClasses((prev) => ({ ...prev, [category]: value }));

  const classToId = (name) => name.replace(/\s+/g, "_").toUpperCase();

  const openModal = (categoryTitle) => {
    const cls = selectedClasses[categoryTitle];
    if (!cls) { alert("Please select a class first from the dropdown!"); return; }
    setActiveModalClass(cls);
    // Reset all state
    setTeacherId(""); setPassword(""); setShowPwd(false);
    setRegTeacherId(""); setRegEmail(""); setRegPassword(""); setRegConfirmPassword("");
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
  const regIsValid      =
    regTeacherId.trim() && regEmail.trim() && regPassword && regConfirmPassword &&
    !regPwdError && !regConfirmError;

  // ── Handlers ──────────────────────────────────────────────────────────────

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    const id      = teacherId.trim().toUpperCase();
    const classId = classToId(activeModalClass);

    // Fetch teacher record by ID to get email
    const { data: teacher } = await supabase
      .from("teachers")
      .select("*")
      .eq("id", id)
      .eq("class_id", classId)
      .maybeSingle();

    if (!teacher) {
      setLoading(false);
      setError("Teacher ID not found or not assigned to this class.");
      return;
    }

    // Authenticate via Supabase Auth
    const { error: authErr } = await supabase.auth.signInWithPassword({
      email:    teacher.email,
      password: password.trim(),
    });
    if (authErr) {
      setLoading(false);
      if (authErr.message.toLowerCase().includes("email not confirmed") ||
          authErr.message.toLowerCase().includes("not confirmed")) {
        setError("Please confirm your email address first. Check your inbox for the verification link.");
      } else {
        setError("Incorrect password. Please try again.");
      }
      return;
    }

    setLoading(false);
    document.cookie = `smcs_teacher=${JSON.stringify({ id: teacher.id, class_id: teacher.class_id })}; path=/; max-age=${60 * 60 * 8}; SameSite=Lax`;
    router.push(`/staff/${encodeURIComponent(classId)}/dashboard`);
  };

  const handleRegister = async () => {
    setRegError("");
    if (!regIsValid) { setRegError("Please complete all fields correctly."); return; }
    if (!/^SMCSTUTOR\d+$/i.test(regTeacherId.trim())) {
      setRegError("Teacher ID must follow the format SMCSTUTOR01.");
      return;
    }

    setLoading(true);
    const id      = regTeacherId.trim().toUpperCase();
    const classId = classToId(activeModalClass);

    // Check duplicate
    const { data: existing } = await supabase
      .from("teachers")
      .select("id")
      .eq("id", id)
      .maybeSingle();

    if (existing) {
      setLoading(false);
      setRegError("This Teacher ID is already registered. Please log in.");
      return;
    }

    // Check if email is already in use (across students and teachers)
    const [studEmail, techEmail] = await Promise.all([
      supabase.from("students").select("id").eq("email", regEmail.trim().toLowerCase()).maybeSingle(),
      supabase.from("teachers").select("id").eq("email", regEmail.trim().toLowerCase()).maybeSingle(),
    ]);

    if (studEmail.data || techEmail.data) {
      setLoading(false);
      setRegError("This email is already registered. Use another or log in.");
      return;
    }

    // Create Supabase Auth account
    const { error: authErr } = await supabase.auth.signUp({
      email:    regEmail.trim().toLowerCase(),
      password: regPassword,
    });

    if (authErr) {
      setLoading(false);
      setRegError("Registration failed: " + authErr.message);
      return;
    }

    // Insert into teachers table
    const { error: dbErr } = await supabase.from("teachers").insert({
      id,
      email:    regEmail.trim().toLowerCase(),
      class_id: classId,
    });

    setLoading(false);
    if (dbErr) {
      setRegError("Profile setup failed: " + dbErr.message);
      return;
    }

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
      classes: ["PRENURSERY", "NURSERY 1", "NURSERY 2", "NURSERY 3"],
    },
    {
      title: "Lower Basic",
      icon: <BookOpen className="w-6 h-6 text-blue-600" />,
      iconBg: "bg-blue-50", borderColor: "border-blue-500",
      buttonBg: "bg-blue-300", hoverBg: "hover:bg-blue-400",
      classes: ["BASIC 1","BASIC 2","BASIC 3","BASIC 4","BASIC 5","BASIC 6"],
    },
    {
      title: "Higher Basic",
      icon: <GraduationCap className="w-6 h-6 text-green-600" />,
      iconBg: "bg-green-50", borderColor: "border-green-500",
      buttonBg: "bg-green-300", hoverBg: "hover:bg-green-400",
      classes: ["BASIC 7","BASIC 8","BASIC 9"],
    },
    {
      title: "Senior",
      icon: <Medal className="w-6 h-6 text-orange-600" />,
      iconBg: "bg-orange-50", borderColor: "border-orange-500",
      buttonBg: "bg-orange-300", hoverBg: "hover:bg-orange-400",
      classes: ["SS1","SS2","SS3"],
    },
  ];

  // ─────────────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6 font-sans relative mt-5 ">

      {/* Back to Home */}
      <button
        onClick={() => router.push("/")}
        className="absolute top-6 left-6 text-gray-500 hover:text-gray-900 font-medium transition-colors pb-[100px]"
      >
        ← Back to Home
      </button>

      {/* Header */}
      <div className="text-center mb-12 flex flex-col items-center">
        <img
          src="/images/logo.png"
          alt="St Mary Logo"
          className="w-24 h-24 object-contain mb-4 transform transition-transform duration-300 hover:scale-110 hover:-rotate-6"
        />
        <h1 className="text-4xl font-bold text-gray-900 mb-2">Staff Portal</h1>
        <p className="text-gray-500 text-lg">Select your class category and login</p>
      </div>

      {/* Category Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 w-full max-w-6xl">
        {categories.map((item, index) => (
          <div
            key={index}
            className={`border-2 ${item.borderColor} rounded-xl p-8 flex flex-col items-center shadow-sm bg-white hover:-translate-y-1 transition-transform`}
          >
            <div className={`${item.iconBg} p-4 rounded-full mb-6`}>{item.icon}</div>
            <h2 className="text-2xl font-bold text-gray-800 mb-6">{item.title}</h2>

            <div className="relative w-full mb-8">
              <select
                value={selectedClasses[item.title]}
                onChange={(e) => handleSelectChange(item.title, e.target.value)}
                className="w-full appearance-none bg-white border border-gray-200 rounded-lg py-3 px-4
                  text-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-300 transition-all cursor-pointer font-medium"
              >
                <option value="">Select class</option>
                {item.classes.map((cls) => <option key={cls} value={cls}>{cls}</option>)}
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center px-3 pointer-events-none">
                <ChevronDown className="w-4 h-4 text-gray-400" />
              </div>
            </div>

            <button
              onClick={() => openModal(item.title)}
              className={`w-full py-3 rounded-lg text-white font-semibold text-lg transition-colors
                ${item.buttonBg} ${item.hoverBg} shadow-sm active:scale-95`}
            >
              Login
            </button>
          </div>
        ))}
      </div>

      {/* ── Modal ── */}
      {activeModalClass && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="w-full max-w-md bg-white border border-gray-200 rounded-3xl p-8 shadow-2xl relative max-h-[90vh] overflow-y-auto">

            <button
              onClick={closeModal}
              className="absolute top-5 right-5 text-gray-400 hover:text-gray-800 transition-colors"
            >
              <FaTimes size={18} />
            </button>

            {/* Modal header */}
            <div className="mb-6 mt-2">
              <p className="text-gray-500 text-xs font-bold uppercase tracking-widest mb-1">
                {step === "register" ? "New Account" : "Staff Login"}
              </p>
              <h2 className="text-2xl font-black text-gray-900">{activeModalClass}</h2>
            </div>

            {/* ── LOGIN STEP ── */}
            {step === "login" && !forgotMode && (
              <>
                <form onSubmit={handleLogin} className="space-y-4">
                  <div>
                    <label className="text-gray-600 text-xs font-bold uppercase tracking-wider block mb-2">
                      Teacher ID
                    </label>
                    <input
                      type="text"
                      value={teacherId}
                      onChange={(e) => setTeacherId(e.target.value)}
                      placeholder="e.g. SMCSTUTOR01"
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-gray-900
                        placeholder-gray-400 focus:outline-none focus:border-blue-500 transition-colors text-sm font-mono"
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
                  <p className="text-gray-500 text-xs font-medium mb-3">First time on this portal?</p>
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
                <p className="text-gray-500 text-xs mb-5 leading-relaxed">
                  Create your account for <span className="font-bold text-gray-700">{activeModalClass}</span>.
                </p>

                <div className="space-y-4">
                  {/* Teacher ID */}
                  <div>
                    <label className="text-gray-600 text-xs font-bold uppercase tracking-wider block mb-2">
                      Teacher ID
                    </label>
                    <input
                      type="text"
                      value={regTeacherId}
                      onChange={(e) => setRegTeacherId(e.target.value)}
                      placeholder="e.g. SMCSTUTOR01"
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-gray-900
                        placeholder-gray-400 focus:outline-none focus:border-orange-500 transition-colors text-sm font-mono"
                    />
                  </div>

                  {/* Email */}
                  <div>
                    <label className="text-gray-600 text-xs font-bold uppercase tracking-wider block mb-2">
                      Email Address
                    </label>
                    <input
                      type="email"
                      value={regEmail}
                      onChange={(e) => setRegEmail(e.target.value)}
                      placeholder="e.g. teacher@school.com"
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-gray-900
                        placeholder-gray-400 focus:outline-none focus:border-orange-500 transition-colors text-sm"
                    />
                  </div>

                  {/* Password */}
                  <div>
                    <label className="text-gray-600 text-xs font-bold uppercase tracking-wider block mb-2">
                      Password
                    </label>
                    <div className="relative">
                      <input
                        type={showRegPwd ? "text" : "password"}
                        value={regPassword}
                        onChange={(e) => setRegPassword(e.target.value)}
                        placeholder="Min. 8 chars, letter + number"
                        className={`w-full bg-gray-50 border rounded-xl px-4 py-3 pr-11 text-gray-900
                          placeholder-gray-400 focus:outline-none transition-colors text-sm
                          ${regPassword && regPwdError
                            ? "border-red-300 focus:border-red-400"
                            : "border-gray-200 focus:border-orange-500"}`}
                      />
                      <button
                        type="button"
                        onClick={() => setShowRegPwd((v) => !v)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors p-1"
                        tabIndex={-1}
                      >
                        {showRegPwd ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                    {regPassword && regPwdError && (
                      <p className="text-red-500 text-xs mt-1.5 font-medium">{regPwdError}</p>
                    )}
                    {regPassword && !regPwdError && regStrength && <StrengthBar strength={regStrength} />}
                  </div>

                  {/* Confirm Password */}
                  <div>
                    <label className="text-gray-600 text-xs font-bold uppercase tracking-wider block mb-2">
                      Confirm Password
                    </label>
                    <div className="relative">
                      <input
                        type={showRegConfirm ? "text" : "password"}
                        value={regConfirmPassword}
                        onChange={(e) => setRegConfirmPassword(e.target.value)}
                        placeholder="Re-enter your password"
                        className={`w-full bg-gray-50 border rounded-xl px-4 py-3 pr-11 text-gray-900
                          placeholder-gray-400 focus:outline-none transition-colors text-sm
                          ${regConfirmError
                            ? "border-red-300 focus:border-red-400"
                            : "border-gray-200 focus:border-orange-500"}`}
                      />
                      <button
                        type="button"
                        onClick={() => setShowRegConfirm((v) => !v)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors p-1"
                        tabIndex={-1}
                      >
                        {showRegConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                    {regConfirmError && (
                      <p className="text-red-500 text-xs mt-1.5 font-medium">{regConfirmError}</p>
                    )}
                    {regConfirmPassword && !regConfirmError && (
                      <p className="text-green-600 text-xs mt-1.5 font-bold">✓ Passwords match</p>
                    )}
                  </div>
                </div>

                {regError && (
                  <div className="mt-4 bg-red-50 border border-red-100 rounded-xl px-4 py-3 text-red-500 text-xs">
                    {regError}
                  </div>
                )}

                <button
                  onClick={handleRegister}
                  disabled={loading || !regIsValid}
                  className="w-full mt-6 bg-orange-500 text-white py-3.5 rounded-xl font-bold uppercase
                    tracking-wider text-sm hover:bg-orange-600 transition-colors active:scale-95
                    disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {loading ? <><Spinner /> Creating Account…</> : "Create Account →"}
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
                    // Pre-fill Teacher ID for login convenience
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
