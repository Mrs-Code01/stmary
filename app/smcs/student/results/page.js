"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

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

export default function StudentResults() {
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const [student, setStudent] = useState(null);

  useEffect(() => {
    const s = getStudentFromCookie();
    setStudent(s);
    if (s) fetchResult(s.id);
  }, []);

  const fetchResult = async (studentId) => {
    setLoading(true);
    const { data } = await supabase
      .from("results")
      .select("*")
      .eq("student_id", studentId)
      .order("uploaded_at", { ascending: false })
      .limit(1)
      .maybeSingle();
    setLoading(false);
    if (data) setResult(data);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl md:text-3xl font-black text-gray-800">My Results</h1>
        <p className="text-gray-500 text-sm mt-1">
          Result documents uploaded by your teacher.
        </p>
      </div>

      {loading ? (
        <div className="text-gray-400 text-sm py-16 text-center">Loading…</div>
      ) : result ? (
        <div className="space-y-4">
          <div className="bg-white border border-gray-100 rounded-2xl p-6 flex items-center justify-between gap-4 shadow-sm">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-purple-50 flex items-center justify-center text-purple-600 text-2xl">
                📄
              </div>
              <div>
                <p className="text-gray-800 font-bold text-base">Result Document</p>
                <p className="text-gray-400 text-xs mt-1 font-mono">
                  Uploaded:{" "}
                  {new Date(result.uploaded_at).toLocaleDateString("en-GB", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                </p>
              </div>
            </div>
            <a
              href={result.pdf_url}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-purple-600 text-white px-6 py-3 rounded-xl text-xs font-bold uppercase tracking-wider hover:bg-purple-700 transition-all shadow-md active:scale-95"
            >
              View PDF
            </a>
          </div>

          {/* Embed PDF */}
          <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm h-[600px]">
            <iframe
              src={result.pdf_url}
              title="Student Result"
              className="w-full h-full"
              style={{ border: "none" }}
            />
          </div>
        </div>
      ) : (
        <div className="py-20 text-center bg-gray-50 border border-gray-100 rounded-2xl">
          <p className="text-5xl mb-4">📭</p>
          <p className="text-gray-400 font-bold text-sm">No result uploaded yet</p>
          <p className="text-gray-400 text-xs mt-2 max-w-xs mx-auto text-center">
            Your teacher has not uploaded your result document yet. Check back later.
          </p>
        </div>
      )}
    </div>
  );
}
