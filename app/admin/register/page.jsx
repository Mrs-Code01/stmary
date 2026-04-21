"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import Link from "next/link";
import { FaSpinner, FaEye, FaEyeSlash } from "react-icons/fa";

export default function AdminRegisterPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const getPasswordStrength = (pass) => {
    if (!pass) return { label: "", bg: "bg-transparent", text: "", width: "w-0" };
    if (pass.length < 6) return { label: "Weak", bg: "bg-red-500", text: "text-red-500", width: "w-1/3" };
    if (pass.length < 10) return { label: "Medium", bg: "bg-orange-500", text: "text-orange-500", width: "w-2/3" };
    return { label: "Strong", bg: "bg-green-500", text: "text-green-500", width: "w-full" };
  };

  const strength = getPasswordStrength(password);

  const handleRegister = async (e) => {
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
      const { error } = await supabase.auth.signUp({ email, password });
      if (error) throw error;
      setSuccess(true);
    } catch (err) {
      if (err.message && err.message.toLowerCase().includes("user already registered")) {
        setError("This email address has been used already.");
      } else {
        setError(err.message || "Registration failed.");
      }
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-gray-500/20 flex flex-col items-center justify-center p-4">
        <div className="w-full max-w-md bg-white rounded-3xl shadow-xl text-center">
          <div className="text-green-500 text-5xl mb-4 font-black">✓</div>
          <h2 className="text-2xl font-black text-[#3c4b64] mb-3">Registration Successful!</h2>
          <p className="text-gray-500 text-sm mb-8 font-medium">Please check your email to verify your account before logging in.</p>
          <Link href="/admin" className="inline-block w-full bg-[#fca26e] hover:bg-[#f9935b] text-white font-black py-4 rounded-xl text-sm uppercase tracking-wider transition-colors">
            Go to Login &rarr;
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center font-[var(--inter-font)] py-[50px]">
      <div className="w-full max-w-[420px] bg-white rounded-[1.5rem] p-10 md:p-8 shadow-2xl border border-red">
        <div className="text-center mb-8">
          <h2 className="text-[1.8rem] font-black text-[#3c4b64] tracking-tight">Create Account</h2>
          <p className="text-gray-400 text-sm font-medium mt-1">Admin Portal Access</p>
        </div>

        {error && (
          <div className="bg-red-50 text-red-500 text-sm px-4 py-3 rounded-xl mb-6 border border-red-100 font-medium">
            {error}
          </div>
        )}

        <form onSubmit={handleRegister} className="space-y-5 ">
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
            <label className="block text-[#5e6e82] text-[11px] font-black uppercase tracking-widest pl-1">
              Password
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

            {/* Password Strength Indicator */}
            <div className="pt-2 px-1">
              <div className="h-1 w-full bg-gray-100 rounded-full overflow-hidden flex">
                <div className={`h-full ${strength.bg} ${strength.width} transition-all duration-300 ease-out`} />
              </div>
              <p className={`text-[10px] font-black mt-1.5 ${strength.text}`}>
                {strength.label}
              </p>
            </div>
          </div>

          {/* Confirm Password */}
          <div className="space-y-1.5 pt-1">
            <label className="block text-[#5e6e82] text-[11px] font-black uppercase tracking-widest pl-1">
              Confirm Password
            </label>
            <div className="relative">
              <input
                type={showConfirmPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                placeholder="Re-enter your password"
                className="w-full bg-[#f4f7fe] border border-transparent focus:bg-white focus:border-[#d9e2f2] text-[#3c4b64] font-medium text-[13px] rounded-xl pl-4 pr-12 py-3.5 outline-none transition-all placeholder:text-gray-400"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 outline-none transition-colors"
                tabIndex="-1"
              >
                {showConfirmPassword ? <FaEyeSlash className="text-lg" /> : <FaEye className="text-lg" />}
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
                <>CREATE ACCOUNT &rarr;</>
              )}
            </button>
          </div>
        </form>

        <div className="mt-8 text-center">
          <Link href="/admin" className="text-[#5e6e82] hover:text-[#3c4b64] text-[13px] font-bold transition-colors">
            Already have an account? Sign In
          </Link>
        </div>
      </div>
    </div>
  );
}
