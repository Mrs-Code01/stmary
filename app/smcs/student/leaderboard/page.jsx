"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { FaTrophy, FaMedal } from "react-icons/fa";

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

export default function LeaderboardPage() {
  const [student, setStudent] = useState(null);
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const s = getStudentFromCookie();
    setStudent(s);
    if (s) {
      fetchLeaderboard(s);
    } else {
      setLoading(false);
    }
  }, []);

  const fetchLeaderboard = async (stud) => {
    setLoading(true);

    try {
      // 1. Fetch all students in this class and same tech course
      const { data: studentsData, error: studentError } = await supabase
        .from("students")
        .select("id, full_name, tech_course")
        .eq("class_id", stud.class_id)
        .eq("tech_course", stud.tech_course);

      if (studentError) throw studentError;

      const studentIds = studentsData.map((s) => s.id);

      if (studentIds.length === 0) {
        setLeaderboard([]);
        setLoading(false);
        return;
      }

      // 2. Fetch all submissions (School Assignments)
      const { data: submissionsData } = await supabase
        .from("submissions")
        .select("student_id, score")
        .in("student_id", studentIds);

      // 3. Fetch tech assessment results
      const { data: techResults } = await supabase
        .from("student_assessment_results")
        .select("student_id, correct_answers")
        .in("student_id", studentIds);

      // 4. Aggregate scores
      const scoreMap = {};
      studentIds.forEach((id) => (scoreMap[id] = 0));

      submissionsData?.forEach((sub) => {
        scoreMap[sub.student_id] += sub.score || 0;
      });

      techResults?.forEach((res) => {
        scoreMap[res.student_id] += res.correct_answers || 0;
      });

      // 5. Map into leaderboard array and sort
      const finalBoard = studentsData
        .map((s) => ({
          id: s.id,
          name: s.full_name,
          tech_course: s.tech_course,
          score: scoreMap[s.id],
        }))
        .sort((a, b) => b.score - a.score);

      setLeaderboard(finalBoard);
    } catch (err) {
      console.error("Error fetching leaderboard:", err);
    }

    setLoading(false);
  };

  const getOrdinal = (n) => {
    const s = ["th", "st", "nd", "rd"];
    const v = n % 100;
    return n + (s[(v - 20) % 10] || s[v] || s[0]);
  };

  if (!student) return null;

  return (
    <div className="w-[90%] mx-auto space-y-6">
      <div>
        <h1 className="text-2xl md:text-3xl font-black text-gray-800 flex items-center gap-3">
          <FaTrophy className="text-indigo-600" /> Class Leaderboard
        </h1>
        <p className="text-gray-500 text-sm mt-1 uppercase font-bold tracking-widest text-[10px]">
          {student.tech_course} · Class {student.class_id}
        </p>
      </div>

      <div className="bg-white border border-gray-100 rounded-3xl p-6 md:p-8 shadow-sm">
        {loading ? (
          <div className="text-gray-400 text-sm text-center py-10">
            Loading rankings...
          </div>
        ) : leaderboard.length === 0 ? (
          <div className="text-gray-400 text-sm text-center py-20 flex flex-col items-center gap-4">
            <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center text-2xl opacity-50">🏝️</div>
            <p className="font-bold">No activity recorded for {student.tech_course} yet.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Top 5 */}
            {leaderboard.slice(0, 5).map((user, idx) => {
              const isCurrentUser = user.id === student.id;
              let rankStyle = "bg-gray-50 text-gray-400 border-gray-100";
              let medalIcon = null;

              if (idx === 0) {
                // 1st: Gold
                rankStyle = "bg-yellow-50 text-yellow-600 border-yellow-200 shadow-sm";
                medalIcon = <FaMedal className="text-yellow-500 text-5xl" />;
              } else if (idx === 1) {
                // 2nd: Green
                rankStyle = "bg-emerald-50 text-emerald-600 border-emerald-200 shadow-sm";
                medalIcon = <FaMedal className="text-emerald-400 text-5xl" />;
              } else if (idx === 2) {
                // 3rd: Purple
                rankStyle = "bg-purple-50 text-purple-600 border-purple-200 shadow-sm";
                medalIcon = <FaMedal className="text-purple-400 text-5xl" />;
              } else if (idx === 3) {
                // 4th: Orange
                rankStyle = "bg-orange-50 text-orange-600 border-orange-200 shadow-sm";
                medalIcon = <FaMedal className="text-orange-500 text-5xl" />;
              } else if (idx === 4) {
                // 5th: Green
                rankStyle = "bg-emerald-50 text-emerald-600 border-emerald-200 shadow-sm";
                medalIcon = <FaMedal className="text-emerald-400 text-5xl" />;
              }

              return (
                <div
                  key={user.id}
                  className={`flex items-center justify-between p-6 rounded-[2rem] border transition-all ${
                    isCurrentUser
                      ? "bg-indigo-50 border-indigo-200 shadow-md shadow-indigo-100/50 scale-[1.02]"
                      : "bg-white border-gray-100 hover:bg-gray-50"
                  }`}
                >
                  <div className="flex items-center gap-6">
                    <div
                      className={`w-24 h-24 rounded-[1.8rem] flex items-center justify-center font-black text-xl border transition-transform group-hover:scale-105 ${rankStyle}`}
                    >
                      {getOrdinal(idx + 1)}
                    </div>
                    <div className="flex-1">
                      <p className={`font-bold text-base ${isCurrentUser ? "text-indigo-900" : "text-gray-800"}`}>
                        {user.name} {isCurrentUser && "(You)"}
                      </p>
                      <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">
                        {user.tech_course} · <span className="font-mono text-[9px] opacity-60 uppercase">{user.id}</span>
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-6">
                    {medalIcon}
                  </div>
                </div>
              );
            })}

            {/* Current Student Rank (if outside Top 5) */}
            {leaderboard.findIndex(u => u.id === student.id) >= 5 && (
              <>
                <div className="py-6 flex items-center gap-4 overflow-hidden">
                  <div className="h-[1px] flex-1 bg-gray-100" />
                  <span className="text-[10px] font-black text-gray-300 uppercase tracking-widest whitespace-nowrap">Your Rank</span>
                  <div className="h-[1px] flex-1 bg-gray-100" />
                </div>
                {(() => {
                  const userIdx = leaderboard.findIndex(u => u.id === student.id);
                  const user = leaderboard[userIdx];
                  return (
                    <div className="flex items-center justify-between p-6 rounded-[2rem] border bg-indigo-50 border-indigo-200 shadow-md shadow-indigo-100/50 scale-[1.02]">
                       <div className="flex items-center gap-6">
                        <div className="w-24 h-24 rounded-[1.8rem] flex items-center justify-center font-black text-xl border bg-indigo-600 text-white border-indigo-500 shadow-lg shadow-indigo-200">
                          {getOrdinal(userIdx + 1)}
                        </div>
                        <div className="flex-1">
                          <p className="font-bold text-base text-indigo-900">
                            {user.name} (You)
                          </p>
                          <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">
                            {user.tech_course} · <span className="font-mono text-[9px] opacity-60 uppercase">{user.id}</span>
                          </p>
                        </div>
                      </div>
                      <div className="text-right flex items-center">
                         <div className="w-16 h-16 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 shadow-inner">
                           <FaTrophy size={32} />
                         </div>
                      </div>
                    </div>
                  );
                })()}
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
