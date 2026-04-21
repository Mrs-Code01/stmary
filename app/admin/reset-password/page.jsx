"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import Link from "next/link";
import { FaSpinner, FaLock } from "react-icons/fa";

export default function ResetPasswordPage() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const { data: listener } = supabase.auth.onAuthStateChange((event) => {
      if (event === "PASSWORD_RECOVERY") {
        setReady(true);
      }
    });

    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) setReady(true);
    });

    return () => {
      listener?.subscription?.unsubscribe();
    };
  }, []);

  const handleReset = async (e) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase.auth.updateUser({ password });
      if (error) throw error;
      setSuccess(true);
    } catch (err) {
      setError(err.message || "Failed to reset password.");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0B1528] via-[#1a2744] to-[#0B1528] flex items-center justify-center px-4">
        <div className="w-full max-w-md text-center">
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8 shadow-2xl">
            <div className="text-green-400 text-5xl mb-4">✓</div>
            <h2 className="text-xl font-bold text-white mb-3">Password Updated!</h2>
            <p className="text-white/60 text-sm mb-6">Your password has been successfully reset.</p>
            <Link href="/admin" className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-lg text-sm uppercase tracking-wider transition-all">
              Go to Login
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0B1528] via-[#1a2744] to-[#0B1528] flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <img src="/images/logo.png" alt="Logo" className="w-25 h-25 object-contain" />
          </div>
          <h1 className="text-2xl font-black text-white tracking-tight">St. Mary Children School</h1>
          <p className="text-blue-300 text-sm font-medium mt-1">Set New Password</p>
        </div>

        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8 shadow-2xl">
          <h2 className="text-xl font-bold text-white mb-6 text-center">Reset Password</h2>

          {!ready && (
            <div className="text-yellow-300/80 text-xs text-center mb-4 bg-yellow-500/10 border border-yellow-500/20 px-4 py-3 rounded-lg">
              Verifying your reset link... If this persists, please request a new reset email.
            </div>
          )}

          {error && (
            <div className="bg-red-500/10 border border-red-500/30 text-red-300 text-sm px-4 py-3 rounded-lg mb-6">{error}</div>
          )}

          <form onSubmit={handleReset} className="space-y-5">
            <div>
              <label className="block text-white/60 text-xs font-bold uppercase tracking-wider mb-2">New Password</label>
              <div className="relative">
                <FaLock className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30 text-sm" />
                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required placeholder="Min. 6 characters" className="w-full bg-white/5 border border-white/10 rounded-lg pl-11 pr-4 py-3 text-white text-sm placeholder-white/20 outline-none focus:border-blue-400 transition-colors" />
              </div>
            </div>

            <div>
              <label className="block text-white/60 text-xs font-bold uppercase tracking-wider mb-2">Confirm Password</label>
              <div className="relative">
                <FaLock className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30 text-sm" />
                <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required placeholder="Re-enter password" className="w-full bg-white/5 border border-white/10 rounded-lg pl-11 pr-4 py-3 text-white text-sm placeholder-white/20 outline-none focus:border-blue-400 transition-colors" />
              </div>
            </div>

            <button type="submit" disabled={loading || !ready} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg transition-all flex items-center justify-center gap-2 text-sm uppercase tracking-wider disabled:opacity-50 active:scale-[0.98]">
              {loading ? <FaSpinner className="animate-spin" /> : null}
              {loading ? "Updating..." : "Update Password"}
            </button>
          </form>

          <div className="mt-6 text-center text-xs">
            <Link href="/admin" className="text-blue-400 hover:text-blue-300 font-medium transition-colors">← Back to Login</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
