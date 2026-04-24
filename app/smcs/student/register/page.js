"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import Link from "next/link";
import { Eye, EyeOff } from "lucide-react";

// ─── Helpers ────────────────────────────────────────────────────────────────

function getStrength(pwd) {
  if (!pwd || pwd.length < 6) return "weak";
  const hasLetter = /[a-zA-Z]/.test(pwd);
  const hasNumber = /\d/.test(pwd);
  const hasSpecial = /[!@#$%^&*_\-]/.test(pwd);
  if (pwd.length >= 10 && hasLetter && hasNumber && hasSpecial) return "strong";
  if (pwd.length >= 8 && hasLetter && hasNumber) return "medium";
  return "weak";
}

function validatePassword(pwd) {
  if (!pwd || pwd.length < 8) return "Must be at least 8 characters.";
  if (!/[a-zA-Z]/.test(pwd)) return "Must contain at least one letter.";
  if (!/\d/.test(pwd)) return "Must contain at least one number.";
  return "";
}

const strengthConfig = {
  weak: { label: "Weak", color: "#f87171", width: "33%" },
  medium: { label: "Medium", color: "#f59e0b", width: "66%" },
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
      <p style={{ color: cfg.color }} className="text-xs mt-1 font-bold">
        {cfg.label}
      </p>
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

// ─── Component ───────────────────────────────────────────────────────────────

export default function StudentRegister() {
  const router = useRouter();

  const [fullName, setFullName] = useState("");
  const [studentId, setStudentId] = useState("");
  const [classId, setClassId] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPwd, setShowPwd] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const pwdError = password ? validatePassword(password) : "";
  const confirmError = confirmPassword && password !== confirmPassword
    ? "Passwords do not match." : "";
  const strength = password ? getStrength(password) : null;

  const isValid =
    fullName.trim() && studentId.trim() && classId && email.trim() &&
    password && confirmPassword && !pwdError && !confirmError;

  const handleRegister = async () => {
    setError("");
    if (!isValid) { setError("Please complete all fields correctly."); return; }
    if (!/^SMCS\d+$/i.test(studentId.trim())) {
      setError("Student ID must follow the format SMCS0001.");
      return;
    }

    setLoading(true);

    // 1. Check duplicate student ID
    const { data: existing } = await supabase
      .from("students")
      .select("id")
      .eq("id", studentId.trim().toUpperCase())
      .maybeSingle();

    if (existing) {
      setLoading(false);
      setError("This Student ID is already registered. Please log in.");
      return;
    }

    // 2. Check if email is already in use (across students and teachers)
    const [studEmail, techEmail] = await Promise.all([
      supabase.from("students").select("id").eq("email", email.trim().toLowerCase()).maybeSingle(),
      supabase.from("teachers").select("id").eq("email", email.trim().toLowerCase()).maybeSingle(),
    ]);

    if (studEmail.data || techEmail.data) {
      setLoading(false);
      setError("This email is already registered. Use another or log in.");
      return;
    }

    // 3. Create Supabase Auth account (enables email-based password reset)
    const { error: authErr } = await supabase.auth.signUp({
      email: email.trim().toLowerCase(),
      password,
    });

    if (authErr) {
      setLoading(false);
      setError("Registration failed: " + authErr.message);
      return;
    }

    // 3. Store student profile in DB (no plain-text password stored)
    const { error: dbErr } = await supabase.from("students").insert({
      id: studentId.trim().toUpperCase(),
      full_name: fullName.trim(),
      email: email.trim().toLowerCase(),
      class_id: classId.trim().replace(/\s+/g, "_").toUpperCase(),
    });

    setLoading(false);
    if (dbErr) {
      setError("Profile setup failed: " + dbErr.message);
      return;
    }

    setSuccess(true);
  };

  // ── Success Screen ──────────────────────────────────────────────────────────
  if (success) {
    return (
      <div className="min-h-screen bg-[#F8F9FE] flex items-center justify-center px-4 py-16">
        <div className="w-full max-w-md">
          <LogoHeader />
          <div className="bg-white border border-gray-100 rounded-[2rem] p-8 md:p-10 shadow-sm text-center">
            <div className="w-16 h-16 bg-green-50 border border-green-200 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <span className="text-3xl">✅</span>
            </div>
            <h2 className="text-2xl font-black text-gray-800 mb-3">Account Created!</h2>
            <p className="text-gray-600 text-sm mb-10 leading-relaxed font-medium">
              Your student profile has been set up successfully. You can now log in to access your portal.
            </p>
            <button
              onClick={() => router.push("/smcs/student/login")}
              className="w-full bg-indigo-600 text-white py-4 rounded-xl font-bold uppercase tracking-wider text-sm hover:bg-indigo-700 shadow-md shadow-indigo-100 transition-all active:scale-95"
            >
              Go to Login →
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ── Registration Form ───────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-[#F8F9FE] flex items-center justify-center px-4 py-16">
      <div className="w-[40%] mx-auto max-[800px]:w-[70%] max-[470px]:w-[90%]">
        <div className="flex items-center justify-center gap-3 mb-4">
          <img src="/images/logo.png" alt="Logo" className="w-25 h-25 object-contain" />
        </div>

        <div className="bg-white border border-gray-100 rounded-[2rem] p-8 md:p-10 shadow-sm">
          <h1 className="text-2xl font-black text-gray-800 mb-2">Register</h1>
          <p className="text-gray-500 text-sm mb-8">Create your student account below.</p>

          <div className="space-y-5">

            {/* Full Name */}
            <Field label="Full Name">
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="e.g. John Doe"
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3.5 text-gray-800 placeholder-gray-400 focus:outline-none focus:border-indigo-400 focus:ring-1 focus:ring-indigo-400 transition-all text-sm shadow-sm"
              />
            </Field>

            {/* Student ID */}
            <Field label="Student ID">
              <input
                type="text"
                value={studentId}
                onChange={(e) => setStudentId(e.target.value)}
                placeholder="e.g. SMCS0001"
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3.5 text-gray-800 placeholder-gray-400 focus:outline-none focus:border-indigo-400 focus:ring-1 focus:ring-indigo-400 transition-all text-sm shadow-sm font-mono"
              />
            </Field>

            {/* Class */}
            <Field label="Class">
              <select
                value={classId}
                onChange={(e) => setClassId(e.target.value)}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3.5 text-gray-800 focus:outline-none focus:border-indigo-400 focus:ring-1 focus:ring-indigo-400 transition-all text-sm shadow-sm"
              >
                <option value="">Select your class</option>
                {[
                  "BASIC 1", "BASIC 2", "BASIC 3", "BASIC 4", "BASIC 5", "BASIC 6",
                  "BASIC 7", "BASIC 8", "BASIC 9",
                  "SS1", "SS2", "SS3",
                ].map((cls) => <option key={cls} value={cls}>{cls}</option>)}
              </select>
            </Field>

            {/* Email */}
            <Field label="Email Address">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="e.g. john@example.com"
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3.5 text-gray-800 placeholder-gray-400 focus:outline-none focus:border-indigo-400 focus:ring-1 focus:ring-indigo-400 transition-all text-sm shadow-sm"
              />
            </Field>

            {/* Password */}
            <div>
              <label className="text-gray-500 text-xs font-bold uppercase tracking-wider block mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPwd ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Min. 8 chars, letter + number"
                  className={`w-full bg-gray-50 border rounded-xl px-4 py-3.5 pr-12 text-gray-800 placeholder-gray-400 
                    focus:outline-none focus:ring-1 transition-all text-sm shadow-sm
                    ${password && pwdError
                      ? "border-red-300 focus:border-red-400 focus:ring-red-400"
                      : "border-gray-200 focus:border-indigo-400 focus:ring-indigo-400"}`}
                />
                <EyeToggle show={showPwd} onToggle={() => setShowPwd((v) => !v)} />
              </div>
              {password && pwdError && (
                <p className="text-red-500 text-xs mt-1.5 font-medium">{pwdError}</p>
              )}
              {password && !pwdError && strength && <StrengthBar strength={strength} />}
            </div>

            {/* Confirm Password */}
            <div>
              <label className="text-gray-500 text-xs font-bold uppercase tracking-wider block mb-2">
                Confirm Password
              </label>
              <div className="relative">
                <input
                  type={showConfirm ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Re-enter your password"
                  className={`w-full bg-gray-50 border rounded-xl px-4 py-3.5 pr-12 text-gray-800 placeholder-gray-400 
                    focus:outline-none focus:ring-1 transition-all text-sm shadow-sm
                    ${confirmError
                      ? "border-red-300 focus:border-red-400 focus:ring-red-400"
                      : "border-gray-200 focus:border-indigo-400 focus:ring-indigo-400"}`}
                />
                <EyeToggle show={showConfirm} onToggle={() => setShowConfirm((v) => !v)} />
              </div>
              {confirmError && (
                <p className="text-red-500 text-xs mt-1.5 font-medium">{confirmError}</p>
              )}
              {confirmPassword && !confirmError && (
                <p className="text-green-600 text-xs mt-1.5 font-bold">✓ Passwords match</p>
              )}
            </div>

          </div>

          {error && (
            <div className="mt-4 bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-red-600 text-sm font-medium">
              {error}
            </div>
          )}

          <button
            onClick={handleRegister}
            disabled={loading || !isValid}
            className="w-full mt-8 bg-indigo-600 text-white py-4 rounded-xl font-bold uppercase tracking-wider text-sm
              hover:bg-indigo-700 transition-all active:scale-95 disabled:opacity-50
              shadow-md shadow-indigo-100 flex items-center justify-center gap-2"
          >
            {loading ? <><Spinner /> Registering…</> : "Create Account →"}
          </button>

          <p className="text-center text-gray-500 text-sm mt-8">
            Already registered?{" "}
            <Link href="/smcs/student/login" className="text-indigo-600 hover:underline font-bold">
              Log In
            </Link>
          </p>
        </div>

        <p
          onClick={() => router.push("/")}
          className="text-center text-gray-400 text-xs font-bold uppercase tracking-widest mt-8
            cursor-pointer hover:text-indigo-600 transition-colors underline-offset-4 hover:underline"
        >
          ← Back to Home
        </p>
      </div>

    </div>
  );
}

// ── Sub-components ─────────────────────────────────────────────────────────

function LogoHeader() {
  return (
    <div className="flex items-center gap-3 mb-10 justify-center">
      <div className="w-12 h-12 rounded-xl bg-indigo-600 flex items-center justify-center text-white font-black text-xl shadow-md">
        SM
      </div>
      <div>
        <p className="font-black text-gray-800 text-xl tracking-tight">SMCS</p>
        <p className="text-[10px] tracking-[0.2em] text-indigo-500 font-bold uppercase">Student Portal</p>
      </div>
    </div>
  );
}

function Field({ label, children }) {
  return (
    <div>
      <label className="text-gray-500 text-xs font-bold uppercase tracking-wider block mb-2">
        {label}
      </label>
      {children}
    </div>
  );
}

function EyeToggle({ show, onToggle }) {
  return (
    <button
      type="button"
      onClick={onToggle}
      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors p-1"
      tabIndex={-1}
    >
      {show ? <EyeOff size={17} /> : <Eye size={17} />}
    </button>
  );
}
