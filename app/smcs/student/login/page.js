"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import Link from "next/link";
import { Eye, EyeOff } from "lucide-react";

function Spinner() {
  return (
    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
    </svg>
  );
}

export default function StudentLogin() {
  const router = useRouter();

  // ── Login state ──────────────────────────────────────────────────────────
  const [studentId, setStudentId] = useState("");
  const [password,  setPassword]  = useState("");
  const [showPwd,   setShowPwd]   = useState(false);
  const [loading,   setLoading]   = useState(false);
  const [error,     setError]     = useState("");

  // ── Forgot-password state ────────────────────────────────────────────────
  const [forgotMode,    setForgotMode]    = useState(false);
  const [forgotEmail,   setForgotEmail]   = useState("");
  const [forgotLoading, setForgotLoading] = useState(false);
  const [forgotError,   setForgotError]   = useState("");
  const [forgotSuccess, setForgotSuccess] = useState(false);

  // ── Login handler ────────────────────────────────────────────────────────
  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    // 1. Fetch student record by ID (get email if it exists)
    const { data: student } = await supabase
      .from("students")
      .select("*")
      .eq("id", studentId.trim().toUpperCase())
      .maybeSingle();

    if (!student) {
      setLoading(false);
      setError("Student ID not found. Please register first.");
      return;
    }

    // Authenticate via Supabase Auth
    const { error: authErr } = await supabase.auth.signInWithPassword({
      email:    student.email,
      password: password.trim(),
    });

    if (authErr) {
      setLoading(false);
      if (authErr.message.toLowerCase().includes("email not confirmed") ||
          authErr.message.toLowerCase().includes("not confirmed")) {
        setError("Please confirm your email address first. Check your inbox for the verification link.");
      } else {
        setError("Incorrect password. Please try again, or use Forgot Password.");
      }
      return;
    }

    setLoading(false);

    // 3. Persist session in cookie
    const studentData = {
      id:                      student.id,
      full_name:               student.full_name,
      class_id:                student.class_id,
      tech_course:             student.tech_course,
      tech_course_started_at:  student.tech_course_started_at,
      avatar_url:              student.avatar_url,
      dream_job:               student.dream_job,
      current_learning:        student.current_learning,
      daily_effort:            student.daily_effort,
    };
    document.cookie = `smcs_student=${encodeURIComponent(JSON.stringify(studentData))}; path=/; max-age=${60 * 60 * 24 * 7}; SameSite=Lax`;
    router.push("/smcs/student/dashboard");
  };

  // ── Forgot-password handler ──────────────────────────────────────────────
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

  // ── Render ───────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-[#F8F9FE] flex items-center justify-center px-4 py-16">
      <div className="w-full max-w-md">

        {/* Logo */}
        <div className="flex items-center gap-3 mb-6 justify-center">
          <img
            src="/images/logo.png"
            alt="St Mary Logo"
            className="w-25 h-25 object-contain transition-transform duration-300"
          />
        </div>

        <div className="bg-white border border-gray-100 rounded-[2rem] p-8 md:p-10 shadow-sm">

          {/* ── FORGOT PASSWORD MODE ── */}
          {forgotMode ? (
            <>
              <button
                onClick={() => { setForgotMode(false); setForgotSuccess(false); setForgotError(""); setForgotEmail(""); }}
                className="text-gray-400 text-base font-bold uppercase tracking-wider mb-6 hover:text-gray-600 transition-colors flex items-center gap-1"
              >
                ← Back to Login
              </button>

              {forgotSuccess ? (
                <div className="text-center py-4">
                  <div className="w-14 h-14 bg-green-50 border border-green-200 rounded-2xl flex items-center justify-center mx-auto mb-5">
                    <span className="text-2xl">📧</span>
                  </div>
                  <h2 className="text-xl font-black text-gray-800 mb-2">Check your email</h2>
                  <p className="text-gray-500 text-sm leading-relaxed">
                    We sent a password reset link to{" "}
                    <span className="font-bold text-indigo-600">{forgotEmail}</span>.
                    Click the link to set a new password.
                  </p>
                  <p className="text-gray-400 text-base mt-3">Didn't get it? Check spam or try again.</p>
                  <button
                    onClick={() => setForgotSuccess(false)}
                    className="mt-6 text-indigo-600 text-sm font-bold hover:underline"
                  >
                    Resend email
                  </button>
                </div>
              ) : (
                <>
                  <h1 className="text-2xl font-black text-gray-800 mb-2 text-center">Forgot Password?</h1>
                  <p className="text-gray-500 text-base mb-8 text-center">
                    Enter the email you registered with and we'll send a reset link.
                  </p>

                  <form onSubmit={handleForgotPassword} className="space-y-5">
                    <div>
                      <label className="text-gray-500 text-base font-bold uppercase tracking-wider block mb-2">
                        Email Address
                      </label>
                      <input
                        type="email"
                        value={forgotEmail}
                        onChange={(e) => setForgotEmail(e.target.value)}
                        placeholder="e.g. john@example.com"
                        required
                        className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3.5 text-gray-800
                          placeholder-gray-400 focus:outline-none focus:border-indigo-400 focus:ring-1
                          focus:ring-indigo-400 transition-all text-lg shadow-sm"
                      />
                    </div>

                    {forgotError && (
                      <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-red-600 text-sm font-medium">
                        {forgotError}
                      </div>
                    )}

                    <button
                      type="submit"
                      disabled={forgotLoading}
                      className="w-full bg-indigo-600 text-white py-4 rounded-xl font-bold uppercase
                        tracking-wider text-sm hover:bg-indigo-700 transition-all active:scale-95
                        disabled:opacity-50 mt-2 shadow-md shadow-indigo-100 flex items-center justify-center gap-2"
                    >
                      {forgotLoading ? <><Spinner /> Sending…</> : "Send Reset Link →"}
                    </button>
                  </form>
                </>
              )}
            </>
          ) : (
            /* ── LOGIN MODE ── */
            <>
              <h1 className="text-2xl font-black text-gray-800 mb-2 text-center">Welcome Back</h1>
              <p className="text-gray-500 text-base mb-8 text-center">Log in to access your student portal.</p>

              <form onSubmit={handleLogin} className="space-y-5">

                {/* Student ID */}
                <div>
                  <label className="text-gray-500 text-base font-bold uppercase tracking-wider block mb-2">
                    Student ID
                  </label>
                  <input
                    type="text"
                    value={studentId}
                    onChange={(e) => setStudentId(e.target.value)}
                    placeholder="e.g. SMCS0001"
                    required
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3.5 text-gray-800
                      placeholder-gray-400 focus:outline-none focus:border-indigo-400 focus:ring-1
                      focus:ring-indigo-400 transition-all text-lg font-mono shadow-sm"
                  />
                </div>

                {/* Password */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-gray-500 text-base font-bold uppercase tracking-wider">
                      Password
                    </label>
                    <button
                      type="button"
                      onClick={() => setForgotMode(true)}
                      className="text-indigo-500 text-base font-bold hover:text-indigo-700 transition-colors hover:underline"
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
                      required
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3.5 pr-12 text-gray-800
                        placeholder-gray-400 focus:outline-none focus:border-indigo-400 focus:ring-1
                        focus:ring-indigo-400 transition-all text-lg shadow-sm"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPwd((v) => !v)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors p-1"
                      tabIndex={-1}
                    >
                      {showPwd ? <EyeOff size={17} /> : <Eye size={17} />}
                    </button>
                  </div>
                </div>

                {error && (
                  <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3.5 text-red-600 text-sm font-medium">
                    {error}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-indigo-600 text-white py-4 rounded-xl font-bold uppercase tracking-wider
                    text-sm hover:bg-indigo-700 transition-all active:scale-95 disabled:opacity-50 mt-4
                    shadow-md shadow-indigo-100 flex items-center justify-center gap-2"
                >
                  {loading ? <><Spinner /> Logging in…</> : "Log In →"}
                </button>
              </form>

              <p className="text-center text-gray-500 text-base mt-8">
                New student?{" "}
                <Link href="/smcs/student/register" className="text-indigo-600 hover:underline font-bold">
                  Register here
                </Link>
              </p>
            </>
          )}
        </div>

        <p
          onClick={() => router.push("/")}
          className="text-center text-gray-400 text-base font-bold uppercase tracking-widest mt-8
            cursor-pointer hover:text-indigo-600 transition-colors"
        >
          ← Back to home
        </p>
      </div>
    </div>
  );
}
