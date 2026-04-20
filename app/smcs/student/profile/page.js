"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { User, Camera, Trophy, Book, Activity, Save, Loader2, ArrowLeft } from "lucide-react";

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

export default function StudentProfile() {
  const router = useRouter();
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(false);
  const [imageLoading, setImageLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  const [formData, setFormData] = useState({
    dreamJob: "",
    currentLearning: "",
    dailyEffort: ""
  });

  useEffect(() => {
    const s = getStudentFromCookie();
    if (s) {
      setStudent(s);
      setFormData({
        dreamJob: s.dream_job || "",
        currentLearning: s.current_learning || "",
        dailyEffort: s.daily_effort || ""
      });
    }
  }, []);

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setImageLoading(true);
    setMessage({ type: "", text: "" });

    try {
      const fileExt = file.name.split(".").pop();
      const fileName = `${student.id}-${Math.random()}.${fileExt}`;
      const filePath = `${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from("avatars")
        .upload(filePath, file, { 
          cacheControl: '3600',
          upsert: true 
        });

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from("avatars")
        .getPublicUrl(filePath);

      // Update DB
      const { error: dbError } = await supabase
        .from("students")
        .update({ avatar_url: publicUrl })
        .eq("id", student.id);

      if (dbError) throw dbError;

      // Update Local State & Cookie
      const updatedStudent = { ...student, avatar_url: publicUrl };
      setStudent(updatedStudent);
      document.cookie = `smcs_student=${encodeURIComponent(JSON.stringify(updatedStudent))}; path=/; max-age=604800`;
      
      router.refresh();
      setMessage({ type: "success", text: "Profile picture updated! Your changes are now live." });
    } catch (err) {
      console.error("Upload Error Details:", err);
      setMessage({ 
        type: "error", 
        text: `Failed to upload info: ${err.message || 'Check if "avatars" bucket is created and allows public uploads.'}` 
      });
    } finally {
      setImageLoading(false);
    }
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: "", text: "" });

    try {
      const { error: dbError } = await supabase
        .from("students")
        .update({
          dream_job: formData.dreamJob,
          current_learning: formData.currentLearning,
          daily_effort: formData.dailyEffort
        })
        .eq("id", student.id);

      if (dbError) throw dbError;

      // Update local student object for cookie sync
      const updatedStudent = { 
        ...student, 
        dream_job: formData.dreamJob,
        current_learning: formData.currentLearning,
        daily_effort: formData.dailyEffort
      };
      setStudent(updatedStudent);
      document.cookie = `smcs_student=${encodeURIComponent(JSON.stringify(updatedStudent))}; path=/; max-age=604800`;

      router.refresh();
      setMessage({ type: "success", text: "Profile information saved successfully!" });
    } catch (err) {
      console.error(err);
      setMessage({ type: "error", text: "Failed to save profile. Please try again." });
    } finally {
      setLoading(false);
    }
  };

  if (!student) return null;

  return (
    <div className="max-w-4xl mx-auto space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Header */}
      <div>
        <h1 className="text-3xl font-black text-gray-800 flex items-center gap-3">
          <User className="text-indigo-600" /> My Profile
        </h1>
        <p className="text-gray-500 text-sm mt-1">Manage your identity and career goals.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Avatar */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm flex flex-col items-center text-center">
            <div className="relative group">
              <div className="w-32 h-32 rounded-[2rem] bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white text-5xl font-black shadow-xl overflow-hidden border-4 border-white">
                {student.avatar_url ? (
                  <img src={student.avatar_url} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  student.full_name.charAt(0)
                )}
              </div>
              <label className="absolute bottom-[-10px] right-[-10px] bg-white p-2.5 rounded-2xl shadow-lg border border-gray-100 cursor-pointer hover:bg-gray-50 transition-all text-indigo-600 active:scale-90">
                <Camera size={20} />
                <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} disabled={imageLoading} />
              </label>
            </div>
            
            <div className="mt-8">
              <h2 className="text-xl font-bold text-gray-800">{student.full_name}</h2>
              <p className="text-sm text-indigo-600 font-bold uppercase tracking-widest mt-1">Class {student.class_id}</p>
              <p className="text-xs text-gray-400 mt-2 font-mono uppercase">{student.id}</p>
            </div>

            {imageLoading && (
              <div className="mt-4 flex items-center gap-2 text-indigo-500 text-xs font-bold animate-pulse">
                <Loader2 size={14} className="animate-spin" /> Uploading image...
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Personalization Form */}
        <div className="lg:col-span-2">
          <form onSubmit={handleSaveProfile} className="bg-white p-8 md:p-10 rounded-[2.5rem] border border-gray-100 shadow-sm space-y-8">
            <div className="grid grid-cols-1 gap-8">
              
              {/* Dream Job */}
              <div className="space-y-3">
                <label className="flex items-center gap-2 text-gray-400 text-xs font-black uppercase tracking-[0.1em]">
                  <Trophy size={14} className="text-indigo-500" /> What do you want to be?
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={formData.dreamJob}
                    onChange={(e) => setFormData({...formData, dreamJob: e.target.value})}
                    placeholder="e.g. Senior Software Engineer at Google"
                    className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-5 py-4 text-gray-800 placeholder-gray-300 focus:outline-none focus:border-indigo-400 transition-all font-bold text-lg"
                  />
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] bg-indigo-50 text-indigo-600 px-2 py-1 rounded-md font-black uppercase">Dream Job</div>
                </div>
              </div>

              {/* Current Learning */}
              <div className="space-y-3">
                <label className="flex items-center gap-2 text-gray-400 text-xs font-black uppercase tracking-[0.1em]">
                  <Book size={14} className="text-indigo-500" /> What are you learning now?
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={formData.currentLearning}
                    onChange={(e) => setFormData({...formData, currentLearning: e.target.value})}
                    placeholder="e.g. React.js, Tailwind CSS and AI Prompting"
                    className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-5 py-4 text-gray-800 placeholder-gray-300 focus:outline-none focus:border-indigo-400 transition-all font-bold text-lg"
                  />
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] bg-indigo-50 text-indigo-600 px-2 py-1 rounded-md font-black uppercase">Current Learning</div>
                </div>
              </div>

              {/* Daily Effort */}
              <div className="space-y-3">
                <label className="flex items-center gap-2 text-gray-400 text-xs font-black uppercase tracking-[0.1em]">
                  <Activity size={14} className="text-indigo-500" /> What are you doing daily?
                </label>
                <div className="relative">
                  <textarea
                    rows={4}
                    value={formData.dailyEffort}
                    onChange={(e) => setFormData({...formData, dailyEffort: e.target.value})}
                    placeholder="e.g. Practicing coding for 2 hours and reading technical articles..."
                    className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-5 py-4 text-gray-800 placeholder-gray-300 focus:outline-none focus:border-indigo-400 transition-all font-bold text-lg resize-none"
                  />
                  <div className="absolute right-4 bottom-4 text-[10px] bg-indigo-50 text-indigo-600 px-2 py-1 rounded-md font-black uppercase">Daily Effort</div>
                </div>
              </div>
            </div>

            {message.text && (
              <div className={`p-4 rounded-2xl text-center text-sm font-bold border italic ${
                message.type === 'success' ? 'bg-green-50 text-green-700 border-green-100' : 'bg-red-50 text-red-600 border-red-100'
              }`}>
                {message.text}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-indigo-600 text-white py-5 rounded-2xl font-black uppercase tracking-widest text-sm hover:bg-indigo-700 transition-all active:scale-95 disabled:opacity-50 flex items-center justify-center gap-3 shadow-xl shadow-indigo-100"
            >
              {loading ? <Loader2 size={20} className="animate-spin" /> : <Save size={20} />}
              {loading ? "Saving Changes..." : "Update Profile"}
            </button>

            <Link
              href="/smcs/student/dashboard"
              className="flex items-center justify-center gap-2 text-indigo-600 font-bold hover:underline py-2"
            >
              <ArrowLeft size={18} /> Back to Dashboard
            </Link>
          </form>
        </div>

      </div>
    </div>
  );
}
