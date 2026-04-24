"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { FileText, Download, Loader2, Search } from "lucide-react";

export default function AdminLessonNotesPage() {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchNotes();
  }, []);

  const fetchNotes = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("lesson_notes")
        .select("*")
        .order("uploaded_at", { ascending: false });

      if (error) throw error;
      setNotes(data || []);
    } catch (err) {
      console.error("Error fetching lesson notes:", err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async (note) => {
    try {
      const response = await fetch(note.file_url);
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = note.file_name || `lesson-note-${note.id}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (err) {
      // Fallback: open in new tab
      window.open(note.file_url, "_blank");
    }
  };

  const filtered = notes.filter(
    (n) =>
      n.teacher_id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      n.class_id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      n.subject?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center p-8">
        <Loader2 className="animate-spin text-blue-500 w-8 h-8" />
      </div>
    );
  }

  return (
    <div className="p-8">
      {/* Page Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-1">
          <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
            <FileText className="text-blue-600 w-5 h-5" />
          </div>
          <h1 className="text-2xl font-bold text-slate-800">Lesson Notes</h1>
        </div>
        <p className="text-slate-400 text-sm ml-13 pl-1">
          All lesson notes uploaded by teachers. Click &quot;Get Lesson Note&quot; to download.
        </p>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center">
            <FileText className="text-blue-500 w-5 h-5" />
          </div>
          <div>
            <p className="text-[10px] font-bold text-slate-400 tracking-wider uppercase">Total Notes</p>
            <p className="text-2xl font-bold text-slate-800">{notes.length}</p>
          </div>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 bg-emerald-50 rounded-xl flex items-center justify-center">
            <FileText className="text-emerald-500 w-5 h-5" />
          </div>
          <div>
            <p className="text-[10px] font-bold text-slate-400 tracking-wider uppercase">Today</p>
            <p className="text-2xl font-bold text-slate-800">
              {notes.filter((n) => new Date(n.uploaded_at).toDateString() === new Date().toDateString()).length}
            </p>
          </div>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 bg-purple-50 rounded-xl flex items-center justify-center">
            <FileText className="text-purple-500 w-5 h-5" />
          </div>
          <div>
            <p className="text-[10px] font-bold text-slate-400 tracking-wider uppercase">Latest Upload</p>
            <p className="text-lg font-bold text-slate-800 truncate max-w-[160px]">
              {notes[0]?.subject || "—"}
            </p>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <h2 className="text-lg font-bold text-slate-800">All Lesson Notes</h2>
          <div className="relative w-full md:w-auto">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <input
              type="text"
              placeholder="Search by teacher, class, or subject..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 bg-[#f1f5f9] rounded-xl text-sm border-none outline-none focus:ring-2 focus:ring-blue-500 w-full md:w-72 transition-shadow"
            />
          </div>
        </div>

        {filtered.length === 0 ? (
          <div className="p-12 text-center text-slate-400">
            <FileText className="w-10 h-10 mx-auto mb-3 opacity-30" />
            <p className="text-lg font-bold mb-1">No lesson notes found</p>
            <p className="text-sm">Lesson notes uploaded by teachers will appear here.</p>
          </div>
        ) : (
          <div className="overflow-x-auto w-full">
            <table className="w-full text-left border-collapse min-w-[700px]">
              <thead>
                <tr className="border-y border-slate-100 text-[11px] uppercase tracking-wider text-slate-400 bg-slate-50/50">
                  <th className="px-6 py-4 font-semibold whitespace-nowrap">#</th>
                  <th className="px-6 py-4 font-semibold whitespace-nowrap">Teacher ID</th>
                  <th className="px-6 py-4 font-semibold whitespace-nowrap">Class</th>
                  <th className="px-6 py-4 font-semibold whitespace-nowrap">Subject / Topic</th>
                  <th className="px-6 py-4 font-semibold whitespace-nowrap">File</th>
                  <th className="px-6 py-4 font-semibold whitespace-nowrap">Date Uploaded</th>
                  <th className="px-6 py-4 font-semibold text-center whitespace-nowrap">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {filtered.map((note, index) => (
                  <tr
                    key={note.id}
                    className="text-sm text-slate-600 hover:bg-slate-50 transition-colors"
                  >
                    <td className="px-6 py-4 font-mono text-slate-400 text-xs">{index + 1}</td>
                    <td className="px-6 py-4">
                      <span className="font-mono text-xs bg-slate-100 text-slate-700 px-2.5 py-1 rounded-lg font-bold">
                        {note.teacher_id}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-blue-50 text-blue-700">
                        {note.class_id?.replace(/_/g, " ")}
                      </span>
                    </td>
                    <td className="px-6 py-4 font-medium text-slate-800">{note.subject}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1.5 text-slate-500">
                        <FileText size={13} />
                        <span className="text-xs truncate max-w-[140px]">{note.file_name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-slate-400 text-xs">
                      {new Date(note.uploaded_at).toLocaleDateString("en-GB", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      })}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <button
                        onClick={() => handleDownload(note)}
                        className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg text-xs font-medium flex items-center gap-2 mx-auto transition-all active:scale-95 shadow-sm shadow-emerald-500/20"
                      >
                        <Download size={13} />
                        Get Lesson Note
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
