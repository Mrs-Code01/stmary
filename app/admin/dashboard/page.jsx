"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { 
  Search, 
  Users, 
  Calendar, 
  Eye,
  Loader2
} from "lucide-react";

export default function AdminDashboardPage() {
  const [admissions, setAdmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const router = useRouter();

  useEffect(() => {
    fetchAdmissions();
  }, []);

  const fetchAdmissions = async () => {
    try {
      const { data, error } = await supabase
        .from("admissions")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setAdmissions(data || []);
    } catch (err) {
      console.error("Error fetching admissions:", err.message);
    } finally {
      setLoading(false);
    }
  };

  const todayCount = admissions.filter(
    (a) => new Date(a.created_at).toDateString() === new Date().toDateString()
  ).length;

  const filtered = admissions.filter((a) =>
    a.student_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    a.email_address.toLowerCase().includes(searchTerm.toLowerCase()) ||
    a.phone_number.includes(searchTerm)
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
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <StatCard 
          icon={<Users className="text-blue-600" />} 
          label="TOTAL SUBMISSIONS" 
          value={admissions.length} 
        />
        <StatCard 
          icon={<Calendar className="text-emerald-500" />} 
          label="TODAY" 
          value={todayCount} 
        />
        <StatCard 
          icon={<Eye className="text-purple-500" />} 
          label="LATEST" 
          value={admissions[0]?.student_name || "—"} 
          isText 
        />
      </div>

      {/* Admission Forms Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <h2 className="text-lg font-bold text-slate-800">All Admission Forms</h2>
          <div className="relative w-full md:w-auto">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <input 
              type="text" 
              placeholder="Search by name, email, or phone..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 bg-[#f1f5f9] rounded-xl text-sm border-none outline-none focus:ring-2 focus:ring-blue-500 w-full md:w-72 transition-shadow"
            />
          </div>
        </div>

        {filtered.length === 0 ? (
          <div className="p-12 text-center text-slate-400">
            <p className="text-lg font-bold mb-1">No submissions found</p>
            <p className="text-sm">Admission forms will appear here once submitted.</p>
          </div>
        ) : (
          <div className="overflow-x-auto w-full">
            <table className="w-full text-left border-collapse min-w-[800px]">
              <thead>
                <tr className="border-y border-slate-100 text-[11px] uppercase tracking-wider text-slate-400 bg-slate-50/50">
                  <th className="px-6 py-4 font-semibold whitespace-nowrap">#</th>
                  <th className="px-6 py-4 font-semibold whitespace-nowrap">Photo</th>
                  <th className="px-6 py-4 font-semibold whitespace-nowrap">Student Name</th>
                  <th className="px-6 py-4 font-semibold whitespace-nowrap">Gender</th>
                  <th className="px-6 py-4 font-semibold whitespace-nowrap">Phone</th>
                  <th className="px-6 py-4 font-semibold whitespace-nowrap">Date</th>
                  <th className="px-6 py-4 font-semibold text-center whitespace-nowrap">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {filtered.map((admission, index) => (
                  <tr 
                    key={admission.id} 
                    className="text-sm text-slate-600 hover:bg-slate-50 transition-colors cursor-pointer"
                    onClick={() => router.push(`/admin/dashboard/${admission.id}`)}
                  >
                    <td className="px-6 py-4">{index + 1}</td>
                    <td className="px-6 py-4">
                      {admission.photo_url ? (
                        <div className="w-10 h-10 rounded-full overflow-hidden border border-slate-200">
                           <img 
                             src={admission.photo_url} 
                             alt={admission.student_name} 
                             className="w-full h-full object-cover" 
                             style={{ objectPosition: "top" }} 
                           />
                        </div>
                      ) : (
                        <div className="w-10 h-10 bg-slate-200 rounded-full flex items-center justify-center">
                          <Users size={20} className="text-slate-400" />
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 font-medium text-slate-900">{admission.student_name}</td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        admission.gender === 'Female' ? 'bg-pink-100 text-pink-600' : 'bg-blue-100 text-blue-600'
                      }`}>
                        {admission.gender}
                      </span>
                    </td>
                    <td className="px-6 py-4">{admission.phone_number}</td>
                    <td className="px-6 py-4 text-slate-400">
                      {new Date(admission.created_at).toLocaleDateString("en-GB", { 
                        day: "2-digit", month: "short", year: "numeric" 
                      })}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          router.push(`/admin/dashboard/${admission.id}`);
                        }}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-xs font-medium flex items-center gap-2 mx-auto transition-all active:scale-95 shadow-sm shadow-blue-500/20"
                      >
                        <Eye size={14} />
                        View
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

// Sub-component for the stats
const StatCard = ({ icon, label, value, isText = false }) => (
  <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4 hover:shadow-md transition-shadow">
    <div className="w-14 h-14 bg-slate-50 rounded-xl flex items-center justify-center border border-slate-100">
      {icon}
    </div>
    <div className="flex-1 overflow-hidden">
      <p className="text-[10px] font-bold text-slate-400 tracking-wider mb-1 uppercase truncate">{label}</p>
      <p className={`font-bold text-slate-800 truncate ${isText ? 'text-lg' : 'text-2xl'}`}>
        {value}
      </p>
    </div>
  </div>
);
