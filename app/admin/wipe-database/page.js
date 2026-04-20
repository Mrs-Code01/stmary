"use client";
import { useState } from "react";
import { supabase } from "@/lib/supabase";

const WIPE_TARGETS = [
  {
    table: "students",
    label: "Student accounts",
    description: "All registered student profiles, passwords and login credentials",
    color: "text-red-400",
    dot: "bg-red-500",
  },
  {
    table: "teachers",
    label: "Teacher accounts",
    description: "All registered teacher profiles, passwords and login credentials",
    color: "text-orange-400",
    dot: "bg-orange-500",
  },
  {
    table: "assignments",
    label: "Assignments",
    description: "All uploaded school and tech assignments",
    color: "text-yellow-400",
    dot: "bg-yellow-500",
  },
  {
    table: "results",
    label: "Student results",
    description: "All uploaded PDF result records",
    color: "text-purple-400",
    dot: "bg-purple-500",
  },
  {
    table: "assessment_dates",
    label: "Assessment dates",
    description: "All scheduled assessment date records",
    color: "text-blue-400",
    dot: "bg-blue-500",
  },
  {
    table: "submissions",
    label: "Submissions",
    description: "All quiz/assessment submissions",
    color: "text-pink-400",
    dot: "bg-pink-500",
  },
];

export default function WipeDatabasePage() {
  const [confirmed, setConfirmed]   = useState(false);
  const [typed, setTyped]           = useState("");
  const [running, setRunning]       = useState(false);
  const [done, setDone]             = useState(false);
  const [log, setLog]               = useState([]);
  const [summary, setSummary]       = useState([]);

  const CONFIRM_PHRASE = "WIPE DATABASE";

  const append = (msg, type = "info") =>
    setLog(prev => [...prev, { msg, type, ts: new Date().toLocaleTimeString() }]);

  const colorClass = (type) => {
    if (type === "success") return "text-green-400";
    if (type === "error")   return "text-red-400";
    if (type === "warn")    return "text-yellow-400";
    return "text-gray-400";
  };

  const runWipe = async () => {
    setRunning(true);
    setLog([]);
    setSummary([]);
    append("🔴 Starting full database wipe…", "warn");

    const results = [];

    for (const target of WIPE_TARGETS) {
      append(`\n🗑  Wiping "${target.table}"…`);

      // Count first
      const { count, error: countErr } = await supabase
        .from(target.table)
        .select("*", { count: "exact", head: true });

      if (countErr) {
        append(`   ⚠️  Could not count "${target.table}": ${countErr.message}`, "warn");
        results.push({ ...target, deleted: 0, skipped: true });
        continue;
      }

      if (count === 0) {
        append(`   ℹ️  "${target.table}" is already empty — skipped`, "info");
        results.push({ ...target, deleted: 0, skipped: true });
        continue;
      }

      // Delete all rows — works for both text and UUID id columns
      const { error: delErr } = await supabase
        .from(target.table)
        .delete()
        .not("id", "is", null);

      if (delErr) {
        append(`   ❌  Failed to delete "${target.table}": ${delErr.message}`, "error");
        results.push({ ...target, deleted: 0, failed: true });
      } else {
        append(`   ✅  Deleted ${count} record(s) from "${target.table}"`, "success");
        results.push({ ...target, deleted: count });
      }
    }

    setSummary(results);
    append("\n✅  Wipe complete. The database is now clean.", "success");
    setRunning(false);
    setDone(true);
  };

  return (
    <div className="min-h-screen bg-[#0a0f1e] text-white p-8 font-mono">
      <div className="max-w-2xl mx-auto">

        {/* Header */}
        <div className="mb-10">
          <div className="inline-block bg-red-500/20 border border-red-500/30 rounded-xl px-4 py-2 text-red-400 text-xs font-bold uppercase tracking-widest mb-4">
            ⚠️ Destructive Operation
          </div>
          <h1 className="text-3xl font-black text-white mb-2">Database Wipe Tool</h1>
          <p className="text-gray-400 text-sm">
            This will permanently delete all student and teacher records so you can start fresh
            with the new class format. <span className="text-red-400 font-bold">This cannot be undone.</span>
          </p>
        </div>

        {/* What will be deleted */}
        {!done && (
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6 mb-8">
            <h2 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-5">
              Will Be Deleted
            </h2>
            <div className="space-y-4">
              {WIPE_TARGETS.map(t => (
                <div key={t.table} className="flex items-start gap-3">
                  <div className={`w-2 h-2 rounded-full ${t.dot} mt-1.5 shrink-0`} />
                  <div>
                    <p className={`font-bold text-sm ${t.color}`}>{t.label}</p>
                    <p className="text-gray-500 text-xs mt-0.5">{t.description}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-6 pt-6 border-t border-white/10 bg-green-500/5 border-green-500/20 rounded-xl p-4">
              <p className="text-green-400 font-bold text-xs uppercase tracking-widest mb-1">✅ Will NOT be touched</p>
              <p className="text-gray-400 text-xs">Admin accounts · App settings · Code · Configurations · Uploaded images</p>
            </div>
          </div>
        )}

        {/* Confirmation Gate */}
        {!done && !running && (
          <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-6 mb-6">
            <p className="text-red-400 text-sm font-bold mb-4">
              Type <span className="bg-red-500/20 px-2 py-0.5 rounded font-mono">{CONFIRM_PHRASE}</span> below to unlock the wipe button:
            </p>
            <input
              type="text"
              value={typed}
              onChange={e => setTyped(e.target.value)}
              placeholder={CONFIRM_PHRASE}
              className="w-full bg-black/30 border border-red-500/30 rounded-xl px-4 py-3 text-white placeholder-red-900/60 focus:outline-none focus:border-red-500 transition-colors text-sm font-mono mb-5"
            />
            <button
              onClick={() => runWipe()}
              disabled={typed !== CONFIRM_PHRASE}
              className="w-full py-4 rounded-xl font-black text-lg uppercase tracking-wider bg-red-600 hover:bg-red-500 transition-all active:scale-95 disabled:opacity-30 disabled:cursor-not-allowed"
            >
              🗑 Wipe All Records Now
            </button>
          </div>
        )}

        {/* Running state */}
        {running && (
          <div className="flex items-center gap-3 text-yellow-400 text-sm font-bold mb-6 animate-pulse">
            <div className="w-3 h-3 rounded-full bg-yellow-400 animate-ping" />
            Operation in progress… do not close this page
          </div>
        )}

        {/* Done Summary */}
        {done && summary.length > 0 && (
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6 mb-8">
            <h2 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-5">
              Deletion Report
            </h2>
            <div className="space-y-3">
              {summary.map(r => (
                <div key={r.table} className="flex items-center justify-between border-b border-white/5 pb-3 last:border-0 last:pb-0">
                  <div>
                    <p className="text-sm font-bold text-white">{r.label}</p>
                    <p className="text-xs text-gray-500 font-mono">{r.table}</p>
                  </div>
                  <div className="text-right">
                    {r.failed ? (
                      <span className="text-red-400 text-xs font-bold">FAILED</span>
                    ) : r.skipped ? (
                      <span className="text-gray-500 text-xs">Already empty</span>
                    ) : (
                      <span className="text-green-400 font-bold text-sm">{r.deleted} deleted</span>
                    )}
                  </div>
                </div>
              ))}
              <div className="flex items-center justify-between pt-2">
                <span className="text-xs text-gray-400 font-bold uppercase tracking-widest">Total Records Wiped</span>
                <span className="text-white font-black text-xl">
                  {summary.reduce((acc, r) => acc + (r.deleted || 0), 0)}
                </span>
              </div>
            </div>
          </div>
        )}

        {done && (
          <div className="w-full py-4 rounded-xl text-center font-black text-lg bg-green-600/20 border border-green-500/40 text-green-400 mb-6">
            ✅ Database is clean — Ready for fresh registrations
          </div>
        )}

        {/* Log */}
        {log.length > 0 && (
          <div className="bg-black/50 border border-white/10 rounded-2xl p-6 max-h-[400px] overflow-y-auto space-y-1 text-xs">
            <div className="text-gray-500 text-[10px] uppercase tracking-widest mb-4">Output Log</div>
            {log.map((entry, i) => (
              <div key={i} className={`flex gap-3 ${colorClass(entry.type)}`}>
                <span className="text-gray-600 shrink-0">{entry.ts}</span>
                <span className="whitespace-pre-wrap">{entry.msg}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
