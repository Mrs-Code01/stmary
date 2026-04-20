"use client";

import { useState } from "react";
import Link from "next/link";
import { FaCheckCircle, FaSpinner, FaChevronRight, FaChevronLeft } from "react-icons/fa";
import { supabase } from "@/lib/supabase";

export default function ApplyPage() {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    dateOfBirth: "",
    gender: "",
    applyingForGrade: "",
    currentSchool: "",
    parentName: "",
    parentEmail: "",
    parentPhone: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleNext = (e) => {
    if (e) e.preventDefault();
    if (isStepValid()) {
      setStep((prev) => prev + 1);
    }
  };

  const handleBack = () => setStep((prev) => prev - 1);

  const isStepValid = () => {
    if (step === 1) {
      return formData.firstName && formData.lastName && formData.dateOfBirth && formData.gender;
    }
    if (step === 2) {
      return formData.applyingForGrade && formData.currentSchool;
    }
    if (step === 3) {
      return formData.parentName && formData.parentEmail && formData.parentPhone;
    }
    return false;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isStepValid()) return;

    setLoading(true);
    try {
      const { error } = await supabase.from("applications").insert([
        {
          first_name: formData.firstName,
          last_name: formData.lastName,
          date_of_birth: formData.dateOfBirth,
          gender: formData.gender,
          applying_for_grade: formData.applyingForGrade,
          current_school: formData.currentSchool,
          parent_name: formData.parentName,
          parent_email: formData.parentEmail,
          parent_phone: formData.parentPhone,
        },
      ]);

      if (error) throw error;
      setSuccess(true);
    } catch (error) {
      console.error("Error submitting application:", error.message);
      alert("Failed to submit application. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-[#f8f9fa] flex items-center justify-center py-24 px-4 overflow-hidden">
        <div className="max-w-xl w-full bg-white border border-gray-200 rounded-3xl p-12 text-center shadow-2xl">
          <FaCheckCircle className="text-green-500 text-7xl mx-auto mb-6" />
          <h2 className="text-4xl font-extrabold text-[#00142a] mb-4 uppercase tracking-tighter">Application Received!</h2>
          <p className="text-gray-600 mb-8 leading-relaxed text-lg font-medium">
            Thank you for choosing St. Mary Children School. Your application for the 2025/2026 Academic Session has been successfully submitted.
          </p>
          <Link href="/" className="inline-block bg-[#00142a] hover:bg-black text-white px-10 py-4 rounded-sm font-black text-xs tracking-[0.2em] uppercase transition-all shadow-xl active:scale-95">
            Return to Homepage
          </Link>
        </div>
      </div>
    );
  }

  const checklistItems = [
    "Previous school report",
    "Two recent passport photographs",
    "Photocopy of birth certificate",
    "Photocopy of immunization card",
    "Original birth certificate for sighting",
    "Parents' passport photographs",
  ];

  const gradeLevels = [
    "Creche / Pre-School",
    "Nursery 1-2",
    "Primary 1-6",
    "JSS 1-3",
    "SSS 1-3",
  ];

  return (
    <div className={`min-h-screen bg-[#f8f9fa] pb-24 font-[var(--inter-font)]`}>
      {/* Hero Header */}
      <div className="relative h-[500px] overflow-hidden group">
        <img 
          src="/images/one.jpg" 
          alt="School Campus" 
          className="w-full h-full object-cover brightness-[0.4] transition-transform duration-1000 group-hover:scale-105"
          onError={(e) => { e.target.src = "https://images.unsplash.com/photo-1523050853063-bd388f6a7262?auto=format&fit=crop&q=80&w=2000"; e.target.className = "w-full h-full object-cover brightness-[0.4]"; }}
        />
        <div className="absolute inset-0 flex items-center">
          <div className="w-[90%] mx-auto">
            <div className="w-[80%]">
              <span className="inline-block bg-[#0096ff] text-white text-[10px] font-black uppercase tracking-[0.3em] px-4 py-1.5 mb-6 mt-[50px]">
               ADMISSION FORM
              </span>
              <h1 className="text-5xl md:text-[5rem] font-black text-white mb-6 tracking-tighter leading-[1.1] font-[var(--worksans-font)]">
                Apply to <br /> St. Mary Children School
              </h1>
              <p className="text-white/80 text-lg md:text-xl w-[60%] font-medium tracking-wide">
                Join a community dedicated to academic excellence. Complete the application below to begin your journey.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="w-[90%] mx-auto -mt-16 relative z-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Checklist */}
          <div className="lg:col-span-4 bg-[#1a202c] text-white p-10 md:p-12 shadow-2xl rounded-sm border border-[#ffffff]">
            <h2 className="text-[2.3rem] text-[#ffffff] font-black mb-10 tracking-tight font-[var(--worksans-font)]">Application Checklist</h2>
            <ul className="space-y-6">
              {checklistItems.map((item, index) => (
                <li key={index} className="flex items-start gap-4 group">
                  <div className="mt-1 w-5 h-5 rounded-full border-2 border-[#cc5500] flex items-center justify-center shrink-0 transition-all group-hover:bg-[#cc5500]">
                    <div className="w-1.5 h-1.5 bg-transparent rounded-full group-hover:bg-white" />
                  </div>
                  <span className="text-[1.02rem] font-bold tracking-wide group-hover:text-white transition-colors">
                    {item}
                  </span>
                </li>
              ))}
            </ul>
            <div className="mt-16 pt-8 border-t border-white/10">
              <p className="text-[#cc5500] text-[13px] font-black uppercase tracking-widest mb-2">Admission Office</p>
              <p className="text-white/60 text-[12px] font-medium italic">Questions? Contact us at</p>
              <p className="text-white text-[12px] tracking-tight italic">info@smcs.org</p>
            </div>
          </div>

          {/* Right Column: Form */}
          <div className="lg:col-span-8 bg-white shadow-2xl rounded-sm overflow-hidden flex flex-col min-h-[600px]">
            {/* Progress Bar */}
            <div className="h-1.5 w-full bg-gray-100 flex">
              <div 
                className="h-full bg-[#cc5500] transition-all duration-700 ease-out" 
                style={{ width: `${(step / 3) * 100}%` }}
              />
            </div>

            <form onSubmit={step === 3 ? handleSubmit : handleNext} className="p-10 md:p-16 flex-grow flex flex-col">
              {/* Step Title Header */}
              <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
                <div>
                  <h2 className="text-3xl md:text-4xl font-extrabold text-[#001011] tracking-tight transition-all duration-500 font-[var(--worksans-font)]">
                    {step === 1 && "Student Information"}
                    {step === 2 && "Academic Details"}
                    {step === 3 && "Parent/Guardian Information"}
                  </h2>
                  <p className="text-gray-400 text-[12px] mt-2">2025/2026 Academic Session</p>
                </div>
                <div className="text-gray-400 font-black text-[10px] uppercase tracking-widest whitespace-nowrap">
                  Step {step} of 3
                </div>
              </div>

              <div className="w-full h-px bg-gray-100 mb-12" />

              {/* Step Label Label */}
              <div className="text-[#cc5500] text-[13px] font-black uppercase tracking-[0.1em] mb-8">
                {step === 1 && "STUDENT INFORMATION"}
                {step === 2 && "ACADEMIC INTEREST"}
                {step === 3 && "PARENT / GUARDIAN"}
              </div>

              {/* Form Fields */}
              <div className="flex-grow">
                {step === 1 && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
                    <div className="space-y-4">
                      <label className="block text-[#001011] text-[10px] font-black uppercase tracking-widest">First Name</label>
                      <input required type="text" name="firstName" value={formData.firstName} onChange={handleChange} className="w-full bg-gray-50 border-none px-6 py-4 text-[#001011] placeholder-gray-300 text-[12px] focus:ring-2 focus:ring-[#cc5500]/20 transition-all outline-none" placeholder="Enter first name" />
                    </div>
                    <div className="space-y-4">
                      <label className="block text-[#001011] text-[10px] font-black uppercase tracking-widest">Last Name</label>
                      <input required type="text" name="lastName" value={formData.lastName} onChange={handleChange} className="w-full bg-gray-50 border-none px-6 py-4 text-[#001011] placeholder-gray-300 text-[12px] focus:ring-2 focus:ring-[#cc5500]/20 transition-all outline-none" placeholder="Enter last name" />
                    </div>
                    <div className="space-y-4">
                      <label className="block text-[#001011] text-[10px] font-black uppercase tracking-widest">Date of Birth</label>
                      <input required type="date" name="dateOfBirth" value={formData.dateOfBirth} onChange={handleChange} className="w-full bg-gray-50 border-none px-6 py-4 text-[#001011] font-bold text-[12px] focus:ring-2 focus:ring-[#cc5500]/20 transition-all outline-none flex-row-reverse" />
                    </div>
                    <div className="space-y-4">
                      <label className="block text-[#001011] text-[10px] font-black uppercase tracking-widest">Gender</label>
                      <select required name="gender" value={formData.gender} onChange={handleChange} className="w-full bg-gray-50 border-none px-6 py-4 text-[#001011] font-bold text-[12px] focus:ring-2 focus:ring-[#cc5500]/20 transition-all outline-none appearance-none cursor-pointer">
                        <option value="">Select Gender</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                      </select>
                    </div>
                  </div>
                )}

                {step === 2 && (
                  <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
                    <div className="space-y-4">
                      <label className="block text-[#001011] text-[12px] font-black uppercase tracking-widest">Applying for Grade</label>
                      <select required name="applyingForGrade" value={formData.applyingForGrade} onChange={handleChange} className="w-full bg-gray-50 border-none px-6 py-4 text-[#001011] font-bold text-[12px] focus:ring-2 focus:ring-[#cc5500]/20 transition-all outline-none appearance-none cursor-pointer">
                        <option value="">Select Grade Level</option>
                        {gradeLevels.map((g) => (
                          <option key={g} value={g}>{g}</option>
                        ))}
                      </select>
                    </div>
                    <div className="space-y-4">
                      <label className="block text-[#001011] text-[12px] font-black uppercase tracking-widest">Current School</label>
                      <input required type="text" name="currentSchool" value={formData.currentSchool} onChange={handleChange} className="w-full bg-gray-50 border-none px-6 py-4 text-[#001011] placeholder-gray-300 text-[12px] focus:ring-2 focus:ring-[#cc5500]/20 transition-all outline-none" placeholder="Name of current institution" />
                    </div>
                  </div>
                )}

                {step === 3 && (
                  <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
                    <div className="space-y-4">
                      <label className="block text-[#001011] text-[12px] font-black uppercase tracking-widest">Full Name</label>
                      <input required type="text" name="parentName" value={formData.parentName} onChange={handleChange} className="w-full bg-gray-50 border-none px-6 py-4 text-[#001011] placeholder-gray-300 text-[12px] focus:ring-2 focus:ring-[#cc5500]/20 transition-all outline-none" placeholder="Parent's full name" />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div className="space-y-4">
                        <label className="block text-[#001011] text-[12px] font-black uppercase tracking-widest">Email Address</label>
                        <input required type="email" name="parentEmail" value={formData.parentEmail} onChange={handleChange} className="w-full bg-gray-50 border-none px-6 py-4 text-[#001011] placeholder-gray-300 text-[12px] focus:ring-2 focus:ring-[#cc5500]/20 transition-all outline-none" placeholder="email@example.com" />
                      </div>
                      <div className="space-y-4">
                        <label className="block text-[#001011] text-[12px] font-black uppercase tracking-widest">Phone Number</label>
                        <input required type="tel" name="parentPhone" value={formData.parentPhone} onChange={handleChange} className="w-full bg-gray-50 border-none px-6 py-4 text-[#001011] placeholder-gray-300 text-[12px] focus:ring-2 focus:ring-[#cc5500]/20 transition-all outline-none" placeholder="+234..." />
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Navigation Buttons */}
              <div className="flex items-center justify-between mt-16 pt-8 border-t border-gray-100">
                {step > 1 ? (
                  <button type="button" onClick={handleBack} className="flex items-center gap-3 text-gray-400 hover:text-[#001011] font-black text-[10px] uppercase tracking-widest transition-colors group">
                    <FaChevronLeft className="group-hover:-translate-x-1 transition-transform" /> Back
                  </button>
                ) : <div />}

                {step < 3 ? (
                  <button 
                    type="submit"
                    disabled={!isStepValid()}
                    className="flex items-center gap-4 bg-[#001011] hover:bg-black text-white px-10 py-5 rounded-sm font-black text-[10px] uppercase tracking-[0.2em] transition-all shadow-xl active:scale-95 disabled:opacity-30 disabled:cursor-not-allowed group"
                  >
                    Next Step <FaChevronRight className="group-hover:translate-x-1 transition-transform" />
                  </button>
                ) : (
                  <button 
                    type="submit"
                    disabled={loading || !isStepValid()}
                    className="flex items-center gap-4 bg-[#001011] hover:bg-black text-white px-10 py-5 rounded-sm font-black text-[10px] uppercase tracking-[0.2em] transition-all shadow-xl active:scale-95 disabled:opacity-30 disabled:cursor-not-allowed group relative overflow-hidden"
                  >
                    <span className={loading ? "opacity-0" : "opacity-100 transition-opacity"}>Submit Application</span>
                    {loading ? (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <FaSpinner className="animate-spin text-xl" />
                      </div>
                    ) : (
                      <FaChevronRight className="group-hover:translate-x-1 transition-transform" />
                    )}
                  </button>
                )}
              </div>

              {step === 3 && (
                <p className="mt-8 text-center text-gray-400 text-[12px] tracking-tight italic">
                  By clicking submit, you agree to Baldom International's data privacy policy andTerms of admission.
                </p>
              )}
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
