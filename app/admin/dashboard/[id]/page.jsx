"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import Link from "next/link";
import { FaSpinner, FaArrowLeft, FaDownload } from "react-icons/fa";

export default function ViewAdmissionPage() {
  const { id } = useParams();
  const router = useRouter();
  const [admission, setAdmission] = useState(null);
  const [loading, setLoading] = useState(true);
  const [downloading, setDownloading] = useState(false);

  useEffect(() => {
    checkAuth();
    fetchAdmission();
  }, [id]);

  const checkAuth = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      router.push("/admin");
    }
  };

  const fetchAdmission = async () => {
    try {
      const { data, error } = await supabase
        .from("admissions")
        .select("*")
        .eq("id", id)
        .single();

      if (error) throw error;
      setAdmission(data);
    } catch (err) {
      console.error("Error fetching admission:", err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadPDF = async () => {
    setDownloading(true);
    try {
      const { generateAdmissionPDF } = await import("@/lib/pdf");
      await generateAdmissionPDF("admission-form-print", admission.student_name);
    } catch (err) {
      console.error("PDF error:", err);
      alert("Failed to generate PDF.");
    } finally {
      setDownloading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0B1528] flex items-center justify-center">
        <FaSpinner className="animate-spin text-blue-400 text-3xl" />
      </div>
    );
  }

  if (!admission) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-500 text-lg mb-4">Admission not found.</p>
          <Link href="/admin/dashboard" className="text-blue-600 hover:underline text-sm font-bold">
            ← Back to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Action Bar */}
      <div className="max-w-4xl mx-auto px-4 pt-8 pb-4 flex items-center justify-between no-print">
        <Link 
          href="/admin/dashboard" 
          className="flex items-center gap-2 text-slate-500 hover:text-slate-700 font-medium text-sm transition-colors"
        >
          <FaArrowLeft className="text-xs" /> Back to Dashboard
        </Link>
        <button 
          onClick={handleDownloadPDF} 
          disabled={downloading} 
          className="flex items-center gap-2 bg-[#4f46e5] hover:bg-[#4338ca] text-white px-5 py-2.5 rounded-xl text-sm font-semibold transition-all active:scale-95 shadow-sm disabled:opacity-50"
        >
          {downloading ? <FaSpinner className="animate-spin" /> : <FaDownload />}
          {downloading ? "Generating PDF..." : "Download PDF"}
        </button>
      </div>

      {/* Admission Form Render — Table-based layout for PDF */}
      <div className="py-10 px-4 flex justify-center">
        <div id="admission-form-print" className="max-w-4xl w-full bg-white shadow-lg border-[6px] border-blue-700">
          {/* Top blue decorative lines */}
          <div className="w-full">
            <div className="h-[6px] bg-blue-700"></div>
            <div className="h-[3px] bg-blue-700 mt-[3px]"></div>
          </div>

          <div className="px-8 py-6">
            {/* Header Section */}
            <div className="flex items-start justify-between mb-2">
              <div className="w-[100px] h-[100px] flex-shrink-0">
                <img src="/images/logo.png" alt="School Logo" className="w-full h-full object-contain" />
              </div>

              <div className="flex-1 text-center px-4">
                <h1 className="text-2xl md:text-3xl font-black text-blue-800 uppercase tracking-tight leading-tight">
                  St. Mary Children School
                </h1>
                <p className="text-blue-600 font-bold text-sm md:text-base uppercase tracking-wide">
                  Educational & IT Training Academy
                </p>
                <div className="mt-3">
                  <span className="bg-blue-700 text-white px-8 py-1.5 text-sm font-bold uppercase tracking-[0.2em] inline-block">
                    Admission Form
                  </span>
                </div>
              </div>

              <div className="flex-shrink-0">
                <div className="w-[120px] h-[140px] border-2 border-blue-400 overflow-hidden bg-gray-50">
                  {admission.photo_url ? (
                    <img src={admission.photo_url} alt="Student" className="w-full h-full object-cover" style={{ objectPosition: "top" }} crossOrigin="anonymous" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-300 text-xs">No Photo</div>
                  )}
                </div>
              </div>
            </div>

            {/* Decorative lines */}
            <div className="mb-6">
              <div className="h-[3px] bg-blue-700"></div>
              <div className="h-[1.5px] bg-blue-700 mt-[2px]"></div>
            </div>

            {/* Form Table — Read Only */}
            <table className="w-full border-collapse text-[13px]">
              <tbody>
                <tr className="border-b border-gray-200">
                  <td className="py-2.5 font-bold text-gray-800 w-[160px]">Student&apos;s Name:</td>
                  <td className="py-2.5 border-b border-dotted border-gray-400" colSpan="3">{admission.student_name}</td>
                </tr>
                <tr className="border-b border-gray-200">
                  <td className="py-2.5 font-bold text-gray-800">Father&apos;s Name:</td>
                  <td className="py-2.5 border-b border-dotted border-gray-400" colSpan="3">{admission.father_name}</td>
                </tr>
                <tr className="border-b border-gray-200">
                  <td className="py-2.5 font-bold text-gray-800">Mother&apos;s Name:</td>
                  <td className="py-2.5 border-b border-dotted border-gray-400" colSpan="3">{admission.mother_name}</td>
                </tr>
                <tr className="border-b border-gray-200">
                  <td className="py-2.5 font-bold text-gray-800">Birth Date:</td>
                  <td className="py-2.5 border-b border-dotted border-gray-400 pr-6">
                    {new Date(admission.birth_date).toLocaleDateString("en-GB", { day: "2-digit", month: "long", year: "numeric" })}
                  </td>
                  <td className="py-2.5 font-bold text-gray-800 pl-4 w-[80px]">Gender:</td>
                  <td className="py-2.5 border-b border-dotted border-gray-400">
                    <span className="inline-flex items-center gap-1.5">
                      <span className={`w-3 h-3 rounded-full border-2 ${admission.gender === "Male" ? "bg-blue-600 border-blue-600" : "border-gray-300"}`}></span> Male
                    </span>
                    <span className="inline-flex items-center gap-1.5 ml-4">
                      <span className={`w-3 h-3 rounded-full border-2 ${admission.gender === "Female" ? "bg-blue-600 border-blue-600" : "border-gray-300"}`}></span> Female
                    </span>
                  </td>
                </tr>

                {/* Present Address */}
                <tr>
                  <td colSpan="4" className="pt-4 pb-2">
                    <fieldset className="border-2 border-dashed border-blue-300 p-3 rounded">
                      <legend className="px-2 font-bold text-blue-600 uppercase text-xs tracking-wide">Present Address</legend>
                      <div className="flex gap-3 items-start">
                        <span className="font-bold text-gray-800 mt-1 text-[13px]">Address:</span>
                        <p className="flex-1 border-b border-dotted border-gray-400 py-1 min-h-[2em]">{admission.present_address}</p>
                      </div>
                    </fieldset>
                  </td>
                </tr>

                {/* Permanent Address */}
                <tr>
                  <td colSpan="4" className="pt-2 pb-2">
                    <fieldset className="border-2 border-dashed border-blue-300 p-3 rounded">
                      <legend className="px-2 font-bold text-blue-600 uppercase text-xs tracking-wide">Permanent Address</legend>
                      <div className="flex gap-3 items-start">
                        <span className="font-bold text-gray-800 mt-1 text-[13px]">Address:</span>
                        <p className="flex-1 border-b border-dotted border-gray-400 py-1 min-h-[2em]">{admission.permanent_address}</p>
                      </div>
                    </fieldset>
                  </td>
                </tr>

                <tr className="border-b border-gray-200">
                  <td className="py-2.5 font-bold text-gray-800">Religion:</td>
                  <td className="py-2.5 border-b border-dotted border-gray-400 pr-6">{admission.religion}</td>
                  <td className="py-2.5 font-bold text-gray-800 pl-4">Nationality:</td>
                  <td className="py-2.5 border-b border-dotted border-gray-400">{admission.nationality}</td>
                </tr>
                <tr className="border-b border-gray-200">
                  <td className="py-2.5 font-bold text-gray-800">Phone Number:</td>
                  <td className="py-2.5 border-b border-dotted border-gray-400 pr-6">{admission.phone_number}</td>
                  <td className="py-2.5 font-bold text-gray-800 pl-4 whitespace-nowrap">Email Address:</td>
                  <td className="py-2.5 border-b border-dotted border-gray-400">{admission.email_address}</td>
                </tr>
                <tr className="border-b border-gray-200">
                  <td className="py-2.5 font-bold text-gray-800">NIN Number:</td>
                  <td className="py-2.5 border-b border-dotted border-gray-400 pr-6">{admission.nin_number}</td>
                  <td className="py-2.5 font-bold text-gray-800 pl-4 whitespace-nowrap">Blood Group:</td>
                  <td className="py-2.5 border-b border-dotted border-gray-400">{admission.blood_group}</td>
                </tr>
                <tr className="border-b border-gray-200">
                  <td className="py-2.5 font-bold text-gray-800">Status:</td>
                  <td className="py-2.5" colSpan="3">
                    <span className="inline-flex items-center gap-1.5">
                      <span className={`w-3 h-3 rounded-full border-2 ${admission.status === "Single" ? "bg-blue-600 border-blue-600" : "border-gray-300"}`}></span> Single
                    </span>
                    <span className="inline-flex items-center gap-1.5 ml-6">
                      <span className={`w-3 h-3 rounded-full border-2 ${admission.status === "Married" ? "bg-blue-600 border-blue-600" : "border-gray-300"}`}></span> Married
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>

            {/* Declaration */}
            <div className="mt-8">
              <h3 className="text-blue-800 font-bold uppercase text-center mb-2 text-sm tracking-[0.15em]">Declaration</h3>
              <p className="text-gray-700 text-xs text-center leading-relaxed italic px-4">
                I hereby declaring that I will obey all the rules and regulations of the institution and be fully responsible for violating the rules.
              </p>
            </div>

            {/* Signatures */}
            <div className="mt-16 flex justify-between px-4 mb-6">
              <div className="text-center w-48">
                <div className="h-12"></div>
                <div className="border-t-2 border-dotted border-gray-800"></div>
                <p className="font-bold text-gray-800 mt-1 text-xs">Student&apos;s Signature</p>
              </div>
              <div className="text-center w-48">
                <div className="h-12"></div>
                <div className="border-t-2 border-dotted border-gray-800"></div>
                <p className="font-bold text-gray-800 mt-1 text-xs">Authorized&apos;s Signature</p>
              </div>
            </div>
          </div>

          {/* Bottom blue decorative lines */}
          <div className="w-full">
            <div className="h-[1.5px] bg-blue-700"></div>
            <div className="h-[3px] bg-blue-700 mt-[2px]"></div>
            <div className="h-[6px] bg-blue-700 mt-[2px]"></div>
          </div>
        </div>
      </div>

      {/* Submission meta */}
      <div className="max-w-4xl mx-auto px-4 pb-10 text-center no-print">
        <p className="text-gray-400 text-xs">
          Submitted on {new Date(admission.created_at).toLocaleString("en-GB", { day: "2-digit", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit" })}
        </p>
      </div>

      <style jsx global>{`
        @media print {
          .no-print { display: none !important; }
          body { background: white !important; }
          header { display: none !important; }
        }
      `}</style>
    </div>
  );
}
