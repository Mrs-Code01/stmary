"use client";
import { useState } from "react";
import { supabase } from "@/lib/supabase";

// ─────────────────────────────────────────────────────────────────
// MAPPING: old class_id  →  new class_id
// The stored IDs use UPPERCASE + underscores (e.g. "JSS_1A")
// ─────────────────────────────────────────────────────────────────
const CLASS_MAP = {
  // Lower Basic (old Primary)
  PRIMARY_4A: "BASIC_4",
  PRIMARY_4B: "BASIC_4",
  PRIMARY_5A: "BASIC_5",
  PRIMARY_5B: "BASIC_5",
  PRIMARY_6A: "BASIC_6",
  PRIMARY_6B: "BASIC_6",
  "TECH_WIZARD_A": "BASIC_1",
  "TECH_WIZARD_B": "BASIC_1",

  // Higher Basic (old JSS)
  JSS_1A: "BASIC_7",
  JSS_1B: "BASIC_7",
  JSS_2A: "BASIC_8",
  JSS_2B: "BASIC_8",
  JSS_3A: "BASIC_9",
  JSS_3B: "BASIC_9",

  // Senior (old SSS)
  SSS_1A: "SS1",
  SSS_1B: "SS1",
  SSS_2A: "SS2",
  SSS_2B: "SS2",
  SSS_3A: "SS3",
  SSS_3B: "SS3",

  // Display-name variants (no underscore — some older records may use these)
  "JSS 1A": "BASIC_7",
  "JSS 1B": "BASIC_7",
  "JSS 2A": "BASIC_8",
  "JSS 2B": "BASIC_8",
  "JSS 3A": "BASIC_9",
  "JSS 3B": "BASIC_9",
  "SSS 1A": "SS1",
  "SSS 1B": "SS1",
  "SSS 2A": "SS2",
  "SSS 2B": "SS2",
  "SSS 3A": "SS3",
  "SSS 3B": "SS3",
  "Primary 4A": "BASIC_4",
  "Primary 4B": "BASIC_4",
  "Primary 5A": "BASIC_5",
  "Primary 5B": "BASIC_5",
  "Primary 6A": "BASIC_6",
  "Primary 6B": "BASIC_6",
  "Tech Wizard A": "BASIC_1",
  "Tech Wizard B": "BASIC_1",
};

// Tables and their class_id column name
const TABLES = [
  { name: "students",          col: "class_id" },
  { name: "teachers",          col: "class_id" },
  { name: "assignments",       col: "class_id" },
  { name: "results",           col: "class_id" },
  { name: "assessment_dates",  col: "class_id" },
];

export default function MigrateClassesPage() {
  const [log, setLog]       = useState([]);
  const [running, setRunning] = useState(false);
  const [done, setDone]     = useState(false);

  const append = (msg, type = "info") =>
    setLog(prev => [...prev, { msg, type, ts: new Date().toLocaleTimeString() }]);

  const runMigration = async () => {
    setRunning(true);
    setDone(false);
    setLog([]);
    append("🚀 Starting class migration…");

    for (const { name: table, col } of TABLES) {
      append(`\n📋 Table: ${table}`);
      let totalUpdated = 0;

      for (const [oldId, newId] of Object.entries(CLASS_MAP)) {
        // Fetch rows that still have the old class id
        const { data: rows, error: fetchErr } = await supabase
          .from(table)
          .select("id")
          .eq(col, oldId);

        if (fetchErr) {
          append(`  ⚠️  Could not query [${oldId}]: ${fetchErr.message}`, "warn");
          continue;
        }

        if (!rows || rows.length === 0) continue;

        // Update them
        const ids = rows.map(r => r.id);
        const { error: updateErr } = await supabase
          .from(table)
          .update({ [col]: newId })
          .in("id", ids);

        if (updateErr) {
          append(`  ❌  Failed to update [${oldId}→${newId}]: ${updateErr.message}`, "error");
        } else {
          append(`  ✅  ${oldId} → ${newId}  (${rows.length} row${rows.length > 1 ? "s" : ""})`, "success");
          totalUpdated += rows.length;
        }
      }

      append(`  → ${totalUpdated} total row(s) updated in "${table}"`);
    }

    append("\n🎉 Migration complete! All tables have been updated.", "success");
    setRunning(false);
    setDone(true);
  };

  const colorClass = (type) => {
    if (type === "success") return "text-green-400";
    if (type === "error")   return "text-red-400";
    if (type === "warn")    return "text-yellow-400";
    return "text-gray-300";
  };

  return (
    <div className="min-h-screen bg-[#0a0f1e] text-white p-8 font-mono">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-black mb-2 text-white">🛠 Class Migration Tool</h1>
        <p className="text-gray-400 mb-8 text-sm">
          This will rename all class IDs across every table in Supabase to the new format
          (BASIC_1 … BASIC_9, SS1, SS2, SS3). Run once only.
        </p>

        {/* Mapping preview */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 mb-8">
          <h2 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-4">Class Mapping</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">
            {Object.entries(CLASS_MAP).slice(0, 24).map(([o, n]) => (
              <div key={o} className="flex items-center gap-2">
                <span className="text-red-400">{o}</span>
                <span className="text-gray-500">→</span>
                <span className="text-green-400">{n}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Run button */}
        {!done && (
          <button
            onClick={runMigration}
            disabled={running}
            className="w-full py-4 rounded-xl font-black text-lg uppercase tracking-wider bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 transition-all active:scale-95 disabled:opacity-50 mb-8"
          >
            {running ? "Running migration…" : "▶ Run Migration Now"}
          </button>
        )}

        {done && (
          <div className="w-full py-4 rounded-xl font-black text-lg text-center bg-green-600/20 border border-green-500/40 text-green-400 mb-8">
            ✅ Migration Finished — You can close this page
          </div>
        )}

        {/* Log output */}
        {log.length > 0 && (
          <div className="bg-black/50 border border-white/10 rounded-2xl p-6 max-h-[500px] overflow-y-auto space-y-1 text-xs">
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
