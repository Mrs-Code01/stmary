"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import Link from "next/link";
import { FaSpinner, FaEnvelope } from "react-icons/fa";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleReset = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/admin/reset-password`,
      });
      if (error) throw error;
      setSuccess(true);
    } catch (err) {
      setError(err.message || "Failed to send reset email.");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0B1528] via-[#1a2744] to-[#0B1528] flex items-center justify-center px-4">
        <div className="w-full max-w-md text-center">
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8 shadow-2xl">
            <div className="text-blue-400 text-5xl mb-4">✉️</div>
            <h2 className="text-xl font-bold text-white mb-3">Check Your Email</h2>
            <p className="text-white/60 text-sm mb-6">
              We&apos;ve sent a password reset link to <span className="text-white font-bold">{email}</span>.
            </p>
            <Link href="/admin" className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-lg text-sm uppercase tracking-wider transition-all">
              Back to Login
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
            <img src="/images/logo.png" alt="Logo" className="w-20 h-20 object-contain" />
          </div>
          <h1 className="text-2xl font-black text-white tracking-tight">St. Mary Children School</h1>
          <p className="text-blue-300 text-sm font-medium mt-1">Reset Password</p>
        </div>

        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8 shadow-2xl">
          <h2 className="text-xl font-bold text-white mb-2 text-center">Forgot Password?</h2>
          <p className="text-white/40 text-xs text-center mb-6">Enter your email and we&apos;ll send you a reset link.</p>

          {error && (
            <div className="bg-red-500/10 border border-red-500/30 text-red-300 text-sm px-4 py-3 rounded-lg mb-6">{error}</div>
          )}

          <form onSubmit={handleReset} className="space-y-5">
            <div>
              <label className="block text-white/60 text-xs font-bold uppercase tracking-wider mb-2">Email Address</label>
              <div className="relative">
                <FaEnvelope className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30 text-sm" />
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required placeholder="admin@example.com" className="w-full bg-white/5 border border-white/10 rounded-lg pl-11 pr-4 py-3 text-white text-sm placeholder-white/20 outline-none focus:border-blue-400 transition-colors" />
              </div>
            </div>

            <button type="submit" disabled={loading} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg transition-all flex items-center justify-center gap-2 text-sm uppercase tracking-wider disabled:opacity-50 active:scale-[0.98]">
              {loading ? <FaSpinner className="animate-spin" /> : null}
              {loading ? "Sending..." : "Send Reset Link"}
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
