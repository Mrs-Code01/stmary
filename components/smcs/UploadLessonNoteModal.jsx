"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { FaTimes } from "react-icons/fa";

export default function UploadLessonNoteModal({ classId, teacherId, onClose, onRefresh }) {
  const [subject, setSubject] = useState("");
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const ALLOWED_TYPES = [
    "application/pdf",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "application/msword",
  ];

  const handleUpload = async () => {
    setError("");

    if (!subject.trim()) {
      setError("Please enter the subject / topic for this lesson note.");
      return;
    }
    if (!file) {
      setError("Please select a PDF or Word document to upload.");
      return;
    }
    if (!ALLOWED_TYPES.includes(file.type)) {
      setError("Only PDF (.pdf) and Word (.docx / .doc) files are allowed.");
      return;
    }

    setLoading(true);

    const ext = file.name.split(".").pop();
    const path = `lesson_notes/${classId}/${teacherId}/${Date.now()}.${ext}`;

    const { error: storageErr } = await supabase.storage
      .from("lesson_notes")
      .upload(path, file, { upsert: true });

    if (storageErr) {
      setLoading(false);
      setError("Upload failed: " + storageErr.message);
      return;
    }

    const { data: urlData } = supabase.storage.from("lesson_notes").getPublicUrl(path);
    const fileUrl = urlData?.publicUrl;

    const { error: dbErr } = await supabase.from("lesson_notes").insert({
      teacher_id: teacherId,
      class_id: classId,
      subject: subject.trim(),
      file_url: fileUrl,
      file_name: file.name,
    });

    setLoading(false);

    if (dbErr) {
      setError("Database save failed: " + dbErr.message);
      return;
    }

    setSuccess(true);
    if (onRefresh) onRefresh();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <div className="w-full max-w-md bg-[#00142a] border border-white/10 rounded-3xl shadow-[0_40px_100px_rgba(0,0,0,0.7)] relative">
        {/* Header */}
        <div className="flex items-center justify-between px-8 py-6 border-b border-white/5">
          <div>
            <p className="text-white/40 text-xs font-bold uppercase tracking-widest mb-0.5">Upload</p>
            <h2 className="text-xl font-black text-white">Lesson Note</h2>
          </div>
          <button onClick={onClose} className="text-white/30 hover:text-white transition-colors">
            <FaTimes size={18} />
          </button>
        </div>

        {success ? (
          <div className="px-8 py-12 text-center space-y-4">
            <p className="text-5xl">✅</p>
            <p className="text-white font-black text-xl">Lesson Note Uploaded!</p>
            <p className="text-white/40 text-sm">The admin can now view and download it from the portal.</p>
            <button
              onClick={onClose}
              className="bg-gradient-to-r from-[#16a34a] to-[#22c55e] text-white px-8 py-3 rounded-xl font-black text-sm uppercase tracking-wider hover:opacity-90 transition-all mt-4"
            >
              Done
            </button>
          </div>
        ) : (
          <div className="px-8 py-6 space-y-5">
            {/* Subject */}
            <div>
              <label className="text-white/60 text-xs font-bold uppercase tracking-wider block mb-2">
                Subject / Topic
              </label>
              <input
                type="text"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="e.g. Mathematics – Fractions"
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-[#22c55e] transition-colors text-sm"
              />
            </div>

            {/* File Upload */}
            <div>
              <label className="text-white/60 text-xs font-bold uppercase tracking-wider block mb-2">
                Lesson Note File
              </label>
              <div
                className="bg-white/3 border-2 border-dashed border-white/10 hover:border-[#22c55e]/40 rounded-xl p-6 text-center cursor-pointer transition-all"
                onClick={() => document.getElementById("lesson-note-upload").click()}
              >
                {file ? (
                  <div>
                    <p className="text-[#22c55e] font-bold text-sm">{file.name}</p>
                    <p className="text-white/30 text-xs mt-1">
                      {(file.size / 1024).toFixed(1)} KB · Click to change
                    </p>
                  </div>
                ) : (
                  <div>
                    <p className="text-4xl mb-2">📝</p>
                    <p className="text-white/40 text-sm font-bold">Click to select file</p>
                    <p className="text-white/20 text-xs mt-1">PDF or Word document (.pdf, .docx)</p>
                  </div>
                )}
              </div>
              <input
                id="lesson-note-upload"
                type="file"
                accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                className="hidden"
                onChange={(e) => setFile(e.target.files?.[0] || null)}
              />
            </div>

            {error && (
              <div className="bg-red-500/10 border border-red-500/30 rounded-xl px-4 py-3 text-red-400 text-sm">
                {error}
              </div>
            )}

            <div className="flex gap-3 pt-2">
              <button
                onClick={onClose}
                className="flex-1 bg-white/5 border border-white/10 text-white/50 py-3 rounded-xl font-bold text-sm hover:text-white transition-all"
              >
                Cancel
              </button>
              <button
                onClick={handleUpload}
                disabled={loading}
                className="flex-1 bg-gradient-to-r from-[#16a34a] to-[#22c55e] text-white py-3 rounded-xl font-black text-sm uppercase tracking-wider hover:shadow-[0_8px_24px_rgba(34,197,94,0.4)] transition-all active:scale-95 disabled:opacity-50"
              >
                {loading ? "Uploading…" : "Upload Note"}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
