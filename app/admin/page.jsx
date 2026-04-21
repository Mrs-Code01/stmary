"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FaSpinner, FaEye, FaEyeSlash } from "react-icons/fa";

export default function AdminLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      router.push("/admin/dashboard");
    } catch (err) {
      setError(err.message || "Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 font-[var(--inter-font)]">
      <div className="w-full max-w-[420px] bg-white rounded-[1.5rem] p-8 md:p-10 shadow-2xl border border-[#000000]">
        <div className="text-center mb-8">
          <h2 className="text-[1.8rem] font-black text-[#3c4b64] tracking-tight">Sign In</h2>
          <p className="text-gray-400 text-sm font-medium mt-1">Admin Portal Access</p>
        </div>

        {error && (
          <div className="bg-red-50 text-red-500 text-sm px-4 py-3 rounded-xl mb-6 border border-red-100 font-medium">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-5">
          {/* Email Address */}
          <div className="space-y-1.5 bg-transparent">
            <label className="block text-[#5e6e82] text-[11px] font-black uppercase tracking-widest pl-1">
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="e.g. admin@school.com"
              className="w-full bg-[#f4f7fe] border border-transparent focus:bg-white focus:border-[#d9e2f2] text-[#3c4b64] font-medium text-[13px] rounded-xl px-4 py-3.5 outline-none transition-all placeholder:text-gray-400"
            />
          </div>

          {/* Password */}
          <div className="space-y-1.5 pt-1">
            <label className="block text-[#5e6e82] text-[11px] font-black uppercase tracking-widest pl-1 flex items-center justify-between pr-1">
              <span>Password</span>
              <Link href="/admin/forgot-password" className="text-[#fca26e] hover:text-[#f9935b] lowercase normal-case tracking-normal font-bold transition-colors">
                Forgot password?
              </Link>
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="••••••••••"
                className="w-full bg-[#f4f7fe] border border-transparent focus:bg-white focus:border-[#d9e2f2] text-[#3c4b64] font-medium text-[13px] rounded-xl pl-4 pr-12 py-3.5 outline-none transition-all placeholder:text-gray-400"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 outline-none transition-colors"
                tabIndex="-1"
              >
                {showPassword ? <FaEyeSlash className="text-lg" /> : <FaEye className="text-lg" />}
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <div className="pt-4">
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#fca26e] hover:bg-[#f9935b] text-white font-black py-4 rounded-xl transition-all flex items-center justify-center gap-2 text-[13px] uppercase tracking-wider disabled:opacity-50 active:scale-[0.98] shadow-md shadow-[#fca26e]/30"
            >
              {loading ? (
                <FaSpinner className="animate-spin text-lg" />
              ) : (
                <>SIGN IN &rarr;</>
              )}
            </button>
          </div>
        </form>

        <div className="mt-8 text-center">
          <Link href="/admin/register" className="text-[#5e6e82] hover:text-[#3c4b64] text-[13px] font-bold transition-colors">
            Don't have an account? Create Account
          </Link>
        </div>

        <div className="text-center mt-6 pt-6 border-t border-gray-100">
          <Link href="/" className="text-gray-400 hover:text-gray-600 text-[14px] font-medium transition-colors">
            &larr; Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
