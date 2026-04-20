"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { Eye, EyeOff } from "lucide-react";

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

// ─── Component ───────────────────────────────────────────────────────────────

export default function ResetPassword() {
  const router = useRouter();

  const [sessionReady, setSessionReady] = useState(false);
  const [tokenError,   setTokenError]   = useState(false);
  const [checking,     setChecking]     = useState(true);

  const [password,        setPassword]        = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPwd,         setShowPwd]         = useState(false);
  const [showConfirm,     setShowConfirm]     = useState(false);
  const [loading,         setLoading]         = useState(false);
  const [error,           setError]           = useState("");
  const [success,         setSuccess]         = useState(false);

  const pwdError     = password ? validatePassword(password) : "";
  const confirmError = confirmPassword && password !== confirmPassword
    ? "Passwords do not match." : "";
  const strength     = password ? getStrength(password) : null;
  const isValid      = password && confirmPassword && !pwdError && !confirmError;

  // ── Detect recovery session from URL hash ─────────────────────────────────
  useEffect(() => {
    let timer;

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "PASSWORD_RECOVERY" || (session && event === "SIGNED_IN")) {
        setSessionReady(true);
        setChecking(false);
        clearTimeout(timer);
      }
    });

    // Fallback: check existing session after brief delay
    timer = setTimeout(async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        setSessionReady(true);
      } else {
        setTokenError(true);
      }
      setChecking(false);
    }, 2500);

    return () => {
      subscription.unsubscribe();
      clearTimeout(timer);
    };
  }, []);

  // ── Submit new password ───────────────────────────────────────────────────
  const handleReset = async (e) => {
    e.preventDefault();
    if (!isValid) return;
    setError("");
    setLoading(true);

    const { error: updateErr } = await supabase.auth.updateUser({ password });

    setLoading(false);
    if (updateErr) {
      setError(updateErr.message);
      return;
    }
    setSuccess(true);
    // Auto-redirect after 3 s
    setTimeout(() => router.push("/smcs/student/login"), 3000);
  };

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-[#F8F9FE] flex items-center justify-center px-4 py-16">
      <div className="w-full max-w-md">

        {/* Logo */}
        <div className="flex items-center gap-3 mb-10 justify-center">
          <div className="w-12 h-12 rounded-xl bg-indigo-600 flex items-center justify-center text-white font-black text-xl shadow-md">
            SM
          </div>
          <div>
            <p className="font-black text-gray-800 text-xl tracking-tight">SMCS</p>
            <p className="text-[10px] tracking-[0.2em] text-indigo-500 font-bold uppercase">Password Reset</p>
          </div>
        </div>

        <div className="bg-white border border-gray-100 rounded-[2rem] p-8 md:p-10 shadow-sm">

          {/* ── Checking session ── */}
          {checking && (
            <div className="text-center py-8">
              <div className="flex justify-center mb-4">
                <svg className="animate-spin h-8 w-8 text-indigo-400" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                </svg>
              </div>
              <p className="text-gray-500 text-sm font-medium">Verifying your reset link…</p>
            </div>
          )}

          {/* ── Invalid / expired token ── */}
          {!checking && tokenError && (
            <div className="text-center py-4">
              <div className="w-14 h-14 bg-red-50 border border-red-200 rounded-2xl flex items-center justify-center mx-auto mb-5">
                <span className="text-2xl">⚠️</span>
              </div>
              <h2 className="text-xl font-black text-gray-800 mb-3">Link Expired or Invalid</h2>
              <p className="text-gray-500 text-sm leading-relaxed mb-6">
                This password reset link has expired or is invalid. Please request a new one from the login page.
              </p>
              <button
                onClick={() => router.push("/smcs/student/login")}
                className="w-full bg-indigo-600 text-white py-4 rounded-xl font-bold uppercase tracking-wider
                  text-sm hover:bg-indigo-700 transition-all active:scale-95 shadow-md shadow-indigo-100"
              >
                Back to Login
              </button>
            </div>
          )}

          {/* ── Success ── */}
          {!checking && !tokenError && success && (
            <div className="text-center py-4">
              <div className="w-14 h-14 bg-green-50 border border-green-200 rounded-2xl flex items-center justify-center mx-auto mb-5">
                <span className="text-2xl">✅</span>
              </div>
              <h2 className="text-xl font-black text-gray-800 mb-3">Password Updated!</h2>
              <p className="text-gray-500 text-sm leading-relaxed mb-2">
                Your password has been successfully changed. Redirecting you to login…
              </p>
              <p className="text-gray-400 text-xs">Taking too long?{" "}
                <button
                  onClick={() => router.push("/smcs/student/login")}
                  className="text-indigo-600 font-bold hover:underline"
                >
                  Click here
                </button>
              </p>
            </div>
          )}

          {/* ── Reset Form ── */}
          {!checking && sessionReady && !success && (
            <>
              <h1 className="text-2xl font-black text-gray-800 mb-2">Set New Password</h1>
              <p className="text-gray-500 text-sm mb-8">
                Choose a strong password for your account.
              </p>

              <form onSubmit={handleReset} className="space-y-5">

                {/* New Password */}
                <div>
                  <label className="text-gray-500 text-xs font-bold uppercase tracking-wider block mb-2">
                    New Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPwd ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Min. 8 chars, letter + number"
                      className={`w-full bg-gray-50 border rounded-xl px-4 py-3.5 pr-12 text-gray-800
                        placeholder-gray-400 focus:outline-none focus:ring-1 transition-all text-sm shadow-sm
                        ${password && pwdError
                          ? "border-red-300 focus:border-red-400 focus:ring-red-400"
                          : "border-gray-200 focus:border-indigo-400 focus:ring-indigo-400"}`}
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
                  {password && pwdError && (
                    <p className="text-red-500 text-xs mt-1.5 font-medium">{pwdError}</p>
                  )}
                  {password && !pwdError && strength && <StrengthBar strength={strength} />}
                </div>

                {/* Confirm Password */}
                <div>
                  <label className="text-gray-500 text-xs font-bold uppercase tracking-wider block mb-2">
                    Confirm New Password
                  </label>
                  <div className="relative">
                    <input
                      type={showConfirm ? "text" : "password"}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Re-enter your new password"
                      className={`w-full bg-gray-50 border rounded-xl px-4 py-3.5 pr-12 text-gray-800
                        placeholder-gray-400 focus:outline-none focus:ring-1 transition-all text-sm shadow-sm
                        ${confirmError
                          ? "border-red-300 focus:border-red-400 focus:ring-red-400"
                          : "border-gray-200 focus:border-indigo-400 focus:ring-indigo-400"}`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirm((v) => !v)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors p-1"
                      tabIndex={-1}
                    >
                      {showConfirm ? <EyeOff size={17} /> : <Eye size={17} />}
                    </button>
                  </div>
                  {confirmError && (
                    <p className="text-red-500 text-xs mt-1.5 font-medium">{confirmError}</p>
                  )}
                  {confirmPassword && !confirmError && (
                    <p className="text-green-600 text-xs mt-1.5 font-bold">✓ Passwords match</p>
                  )}
                </div>

                {error && (
                  <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-red-600 text-sm font-medium">
                    {error}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading || !isValid}
                  className="w-full mt-2 bg-indigo-600 text-white py-4 rounded-xl font-bold uppercase
                    tracking-wider text-sm hover:bg-indigo-700 transition-all active:scale-95
                    disabled:opacity-50 shadow-md shadow-indigo-100 flex items-center justify-center gap-2"
                >
                  {loading ? <><Spinner /> Updating…</> : "Update Password →"}
                </button>
              </form>
            </>
          )}
        </div>

        <p
          onClick={() => router.push("/smcs/student/login")}
          className="text-center text-gray-400 text-xs font-bold uppercase tracking-widest mt-8
            cursor-pointer hover:text-indigo-600 transition-colors"
        >
          ← Back to Login
        </p>
      </div>
    </div>
  );
}
