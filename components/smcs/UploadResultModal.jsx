"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { FaTimes } from "react-icons/fa";

export default function UploadResultModal({ classId, initialData, onClose, onRefresh }) {
  // If editing, student ID is read-only usually, or pre-filled.
  const [studentId, setStudentId] = useState(initialData?.student_id || "");
  const [file, setFile] = useState(null); // File is only needed if uploading a new one
  const [term, setTerm] = useState(initialData?.term || "1st Term");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const isEdit = !!initialData;

  const handleUpload = async () => {
    setError("");
    if (!studentId.trim()) {
      setError("Please enter the student ID.");
      return;
    }
    if (!/^SMCS\d+$/i.test(studentId.trim().toUpperCase())) {
      setError("Student ID must follow the format SMCS0001.");
      return;
    }
    if (!isEdit && !file) {
      setError("Please select a PDF file to upload.");
      return;
    }
    if (file.type !== "application/pdf") {
      setError("Only PDF files are allowed.");
      return;
    }

    setLoading(true);
    const sid = studentId.trim().toUpperCase();

    let finalPdfUrl = initialData?.pdf_url;

    if (file) {
      const path = `${classId}/${sid}/${Date.now()}.pdf`;

      // Upload to Supabase Storage
      const { error: storageErr } = await supabase.storage
        .from("results")
        .upload(path, file, { upsert: true });

      if (storageErr) {
        setLoading(false);
        setError("Storage upload failed: " + storageErr.message);
        return;
      }

      // Get public URL
      const { data: urlData } = supabase.storage.from("results").getPublicUrl(path);
      finalPdfUrl = urlData?.publicUrl;
    }

    if (isEdit) {
      const { error: dbErr } = await supabase.from("results").update({
        student_id: sid,
        pdf_url: finalPdfUrl,
        term,
        uploaded_at: new Date().toISOString() // refresh stamp
      }).eq("id", initialData.id);

      setLoading(false);
      if (dbErr) {
        setError("Database update failed: " + dbErr.message);
        return;
      }
    } else {
      const { error: dbErr } = await supabase.from("results").insert({
        student_id: sid,
        class_id: classId,
        pdf_url: finalPdfUrl,
        term,
      });

      if (!dbErr) {
        // Notify Student
        await supabase.from("student_notifications").insert({
          student_id: sid,
          type: "result",
          title: "New Result Uploaded",
          message: `Your result for ${term} has been uploaded. You can view it in your results portal.`,
        });
      }

      setLoading(false);
      if (dbErr) {
        setError("Database save failed: " + dbErr.message);
        return;
      }
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
            <h2 className="text-xl font-black text-white">Student Result PDF</h2>
          </div>
          <button onClick={onClose} className="text-white/30 hover:text-white transition-colors">
            <FaTimes size={18} />
          </button>
        </div>

        {success ? (
          <div className="px-8 py-12 text-center space-y-4">
            <p className="text-5xl">✅</p>
            <p className="text-white font-black text-xl">Result {isEdit ? "Updated" : "Uploaded"}!</p>
            <p className="text-white/40 text-sm">The student can now view their result in their portal.</p>
            <button
              onClick={onClose}
              className="bg-[#7c3aed] text-white px-8 py-3 rounded-xl font-black text-sm uppercase tracking-wider hover:bg-[#a855f7] transition-all mt-4"
            >
              Done
            </button>
          </div>
        ) : (
          <div className="px-8 py-6 space-y-5">
            <div>
              <label className="text-white/60 text-xs font-bold uppercase tracking-wider block mb-2">
                Student ID
              </label>
              <input
                type="text"
                value={studentId}
                onChange={(e) => setStudentId(e.target.value)}
                placeholder="e.g. SMCS0001"
                disabled={isEdit}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-[#7c3aed] transition-colors text-sm font-mono disabled:opacity-50"
              />
            </div>

            <div>
              <label className="text-white/60 text-xs font-bold uppercase tracking-wider block mb-2">
                Term Period
              </label>
              <select
                value={term}
                onChange={(e) => setTerm(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#7c3aed] transition-colors text-sm appearance-none"
              >
                <option value="1st Term" style={{ background: '#00142a' }}>1st Term</option>
                <option value="2nd Term" style={{ background: '#00142a' }}>2nd Term</option>
                <option value="3rd Term" style={{ background: '#00142a' }}>3rd Term</option>
              </select>
            </div>

            <div>
              <label className="text-white/60 text-xs font-bold uppercase tracking-wider block mb-2">
                Result PDF
              </label>
              <div
                className="bg-white/3 border-2 border-dashed border-white/10 hover:border-[#7c3aed]/40 rounded-xl p-6 text-center cursor-pointer transition-all"
                onClick={() => document.getElementById("pdf-upload").click()}
              >
                {file ? (
                  <div>
                    <p className="text-[#a855f7] font-bold text-sm">{file.name}</p>
                    <p className="text-white/30 text-xs mt-1">
                      {(file.size / 1024).toFixed(1)} KB · Click to change
                    </p>
                  </div>
                ) : isEdit ? (
                  <div>
                    <p className="text-4xl mb-2">📄</p>
                    <p className="text-[#a855f7] text-sm font-bold truncate px-4">{initialData.pdf_url.split('/').pop()}</p>
                    <p className="text-white/30 text-xs mt-1">Click to upload a new version and overwrite</p>
                  </div>
                ) : (
                  <div>
                    <p className="text-4xl mb-2">📄</p>
                    <p className="text-white/40 text-sm font-bold">Click to select PDF</p>
                    <p className="text-white/20 text-xs mt-1">PDF files only</p>
                  </div>
                )}
              </div>
              <input
                id="pdf-upload"
                type="file"
                accept="application/pdf"
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
                className="flex-1 bg-gradient-to-r from-[#7c3aed] to-[#a855f7] text-white py-3 rounded-xl font-black text-sm uppercase tracking-wider hover:shadow-[0_8px_24px_rgba(124,58,237,0.4)] transition-all active:scale-95 disabled:opacity-50"
              >
                {loading ? "Saving…" : isEdit ? "Update Result" : "Upload Result"}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
