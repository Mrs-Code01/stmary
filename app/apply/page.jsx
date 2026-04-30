"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import { FaCheckCircle, FaSpinner, FaChevronRight, FaChevronLeft, FaCreditCard } from "react-icons/fa";
import { supabase } from "@/lib/supabase";
import FeesModal from "@/components/apply/FeesModal";

export default function ApplyPage() {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [photoFile, setPhotoFile] = useState(null);
  const [photoError, setPhotoError] = useState("");
  const [showFeesModal, setShowFeesModal] = useState(false);
  const fileInputRef = useRef(null);

  const [formData, setFormData] = useState({
    studentName: "",
    fatherName: "",
    motherName: "",
    birthDate: "",
    gender: "",
    presentAddress: "",
    permanentAddress: "",
    phoneNumber: "",
    emailAddress: "",
    religion: "",
    nationality: "",
    ninNumber: "",
    bloodGroup: "",
    status: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    setPhotoError("");

    if (!file) return;

    if (file.size > 1048576) {
      setPhotoError("Photo must be less than 1MB");
      setPhotoPreview(null);
      setPhotoFile(null);
      return;
    }

    const img = new Image();
    const url = URL.createObjectURL(file);
    img.onload = () => {
      if (img.width !== 600 || img.height !== 600) {
        setPhotoError("Photo must be exactly 600×600px");
        setPhotoPreview(null);
        setPhotoFile(null);
        URL.revokeObjectURL(url);
        return;
      }
      setPhotoFile(file);
      const reader = new FileReader();
      reader.onloadend = () => setPhotoPreview(reader.result);
      reader.readAsDataURL(file);
      URL.revokeObjectURL(url);
    };
    img.onerror = () => {
      setPhotoError("Invalid image file");
      URL.revokeObjectURL(url);
    };
    img.src = url;
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
      return formData.studentName && formData.fatherName && formData.motherName && formData.birthDate && formData.gender && photoFile;
    }
    if (step === 2) {
      return formData.presentAddress && formData.permanentAddress && formData.phoneNumber && formData.emailAddress;
    }
    if (step === 3) {
      return formData.religion && formData.nationality && formData.ninNumber && formData.bloodGroup && formData.status;
    }
    return false;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isStepValid()) return;

    setLoading(true);
    try {
      // Upload photo
      const fileExt = photoFile.name.split(".").pop();
      const fileName = `${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from("avatars")
        .upload(fileName, photoFile);

      if (uploadError) throw uploadError;

      const { data: urlData } = supabase.storage
        .from("avatars")
        .getPublicUrl(fileName);

      // Insert admission
      const { error } = await supabase.from("admissions").insert([
        {
          student_name: formData.studentName,
          father_name: formData.fatherName,
          mother_name: formData.motherName,
          birth_date: formData.birthDate,
          gender: formData.gender,
          present_address: formData.presentAddress,
          permanent_address: formData.permanentAddress,
          religion: formData.religion,
          nationality: formData.nationality,
          phone_number: formData.phoneNumber,
          email_address: formData.emailAddress,
          nin_number: formData.ninNumber,
          blood_group: formData.bloodGroup,
          status: formData.status,
          photo_url: urlData.publicUrl,
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

  return (
    <div className={`min-h-screen bg-[#f8f9fa] pb-24 font-[var(--inter-font)]`}>
      {/* Hero Header */}
      <div className="relative h-[700px] overflow-hidden group">
        <img
          src="/images/one.jpg"
          alt="School Campus"
          className="w-full h-full object-cover brightness-[0.4] transition-transform duration-1000 group-hover:scale-105"
          onError={(e) => { e.target.src = "https://images.unsplash.com/photo-1523050853063-bd388f6a7262?auto=format&fit=crop&q=80&w=2000"; e.target.className = "w-full h-full object-cover brightness-[0.4]"; }}
        />
        <div className="absolute inset-0 flex items-center">
          <div className="w-[90%] mx-auto">
            <div className="w-[100%]">
              <span className="inline-block bg-[#0096ff] text-white text-sm font-black uppercase tracking-[0.3em] px-4 py-1.5 mb-6 mt-[50px]">
                ADMISSION FORM
              </span>
              <h1 className="text-5xl md:text-[5rem] font-black text-white mb-6 tracking-tighter leading-[1.1] font-[var(--worksans-font)]">
                Apply to <br /> St. Mary Children School
              </h1>
              <p className="text-white/80 text-xl md:text-2xl w-[100%] font-medium tracking-wide">
                Join a community dedicated to academic excellence. Complete the application below to begin your journey.
              </p>
              <button
                onClick={() => setShowFeesModal(true)}
                className="mt-8 flex items-center gap-3 bg-white hover:bg-[#cc5500] hover:text-white text-[#00142a] px-8 py-4 rounded-sm font-black text-sm tracking-[0.2em] uppercase transition-all shadow-xl active:scale-95 group"
              >
                <FaCreditCard className="group-hover:rotate-12 transition-transform" />
                Fees and Payment
              </button>
            </div>
          </div>
        </div>
      </div>

      <FeesModal isOpen={showFeesModal} onClose={() => setShowFeesModal(false)} />

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
              <p className="text-[#cc5500] text-base font-black uppercase tracking-widest mb-2">Admission Office</p>
              <p className="text-white/60 text-base font-medium italic">Questions? Contact us at</p>
              <p className="text-white text-base tracking-tight italic">info@smcs.org</p>
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
                    {step === 2 && "Address & Contact"}
                    {step === 3 && "Additional Details"}
                  </h2>
                  <p className="text-gray-400 text-base mt-2">2025/2026 Academic Session</p>
                </div>
                <div className="text-gray-400 font-black text-base uppercase tracking-widest whitespace-nowrap">
                  Step {step} of 3
                </div>
              </div>

              <div className="w-full h-px bg-gray-100 mb-12" />

              {/* Step Label */}
              <div className="text-[#cc5500] text-base font-black uppercase tracking-[0.1em] mb-8">
                {step === 1 && "STUDENT INFORMATION"}
                {step === 2 && "ADDRESS & CONTACT"}
                {step === 3 && "ADDITIONAL DETAILS"}
              </div>

              {/* Form Fields */}
              <div className="flex-grow">
                {step === 1 && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
                    <div className="space-y-4">
                      <label className="block text-[#001011] text-base font-black uppercase tracking-widest">Student&apos;s Full Name</label>
                      <input required type="text" name="studentName" value={formData.studentName} onChange={handleChange} className="w-full bg-gray-50 border-none px-6 py-4 text-[#001011] placeholder-gray-300 text-lg focus:ring-2 focus:ring-[#cc5500]/20 transition-all outline-none" placeholder="Enter full name" />
                    </div>
                    <div className="space-y-4">
                      <label className="block text-[#001011] text-base font-black uppercase tracking-widest">Father&apos;s Name</label>
                      <input required type="text" name="fatherName" value={formData.fatherName} onChange={handleChange} className="w-full bg-gray-50 border-none px-6 py-4 text-[#001011] placeholder-gray-300 text-lg focus:ring-2 focus:ring-[#cc5500]/20 transition-all outline-none" placeholder="Enter father's name" />
                    </div>
                    <div className="space-y-4">
                      <label className="block text-[#001011] text-base font-black uppercase tracking-widest">Mother&apos;s Name</label>
                      <input required type="text" name="motherName" value={formData.motherName} onChange={handleChange} className="w-full bg-gray-50 border-none px-6 py-4 text-[#001011] placeholder-gray-300 text-lg focus:ring-2 focus:ring-[#cc5500]/20 transition-all outline-none" placeholder="Enter mother's name" />
                    </div>
                    <div className="space-y-4">
                      <label className="block text-[#001011] text-base font-black uppercase tracking-widest">Date of Birth</label>
                      <input required type="date" name="birthDate" value={formData.birthDate} onChange={handleChange} className="w-full bg-gray-50 border-none px-6 py-4 text-[#001011] font-bold text-lg focus:ring-2 focus:ring-[#cc5500]/20 transition-all outline-none flex-row-reverse" />
                    </div>
                    <div className="space-y-4">
                      <label className="block text-[#001011] text-base font-black uppercase tracking-widest">Gender</label>
                      <div className="flex items-center gap-6 bg-gray-50 px-6 py-4">
                        <label className="inline-flex items-center cursor-pointer">
                          <input type="radio" name="gender" value="Male" checked={formData.gender === "Male"} onChange={handleChange} className="accent-[#cc5500] w-5 h-5" />
                          <span className="ml-2 text-lg font-bold text-[#001011]">Male</span>
                        </label>
                        <label className="inline-flex items-center cursor-pointer">
                          <input type="radio" name="gender" value="Female" checked={formData.gender === "Female"} onChange={handleChange} className="accent-[#cc5500] w-5 h-5" />
                          <span className="ml-2 text-lg font-bold text-[#001011]">Female</span>
                        </label>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <label className="block text-[#001011] text-base font-black uppercase tracking-widest">Student Photo</label>
                      <div
                        className="bg-gray-50 px-6 py-4 flex items-center gap-4 cursor-pointer hover:bg-gray-100 transition-colors"
                        onClick={() => fileInputRef.current.click()}
                      >
                        {photoPreview ? (
                          <div className="w-16 h-16 rounded overflow-hidden border-2 border-[#cc5500]/30 flex-shrink-0">
                            <img src={photoPreview} alt="Preview" className="w-full h-full object-cover" style={{ objectPosition: "top" }} />
                          </div>
                        ) : (
                          <div className="w-16 h-16 rounded border-2 border-dashed border-gray-300 flex items-center justify-center flex-shrink-0">
                            <span className="text-gray-300 text-xl">📷</span>
                          </div>
                        )}
                        <div>
                          <p className="text-lg font-bold text-[#001011]">{photoFile ? photoFile.name : "Click to upload"}</p>
                          <p className="text-base text-gray-400">600×600px, max 1MB</p>
                          {photoError && <p className="text-base text-red-500 font-bold mt-1">{photoError}</p>}
                        </div>
                      </div>
                      <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handlePhotoChange}
                        accept="image/*"
                        className="hidden"
                      />
                    </div>
                  </div>
                )}

                {step === 2 && (
                  <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
                    <div className="space-y-4">
                      <label className="block text-[#001011] text-base font-black uppercase tracking-widest">Present Address</label>
                      <textarea required name="presentAddress" value={formData.presentAddress} onChange={handleChange} rows="3" className="w-full bg-gray-50 border-none px-6 py-4 text-[#001011] placeholder-gray-300 text-lg focus:ring-2 focus:ring-[#cc5500]/20 transition-all outline-none resize-none" placeholder="Enter present address" />
                    </div>
                    <div className="space-y-4">
                      <label className="block text-[#001011] text-base font-black uppercase tracking-widest">Permanent Address</label>
                      <textarea required name="permanentAddress" value={formData.permanentAddress} onChange={handleChange} rows="3" className="w-full bg-gray-50 border-none px-6 py-4 text-[#001011] placeholder-gray-300 text-lg focus:ring-2 focus:ring-[#cc5500]/20 transition-all outline-none resize-none" placeholder="Enter permanent address" />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div className="space-y-4">
                        <label className="block text-[#001011] text-base font-black uppercase tracking-widest">Phone Number</label>
                        <input required type="tel" name="phoneNumber" value={formData.phoneNumber} onChange={handleChange} className="w-full bg-gray-50 border-none px-6 py-4 text-[#001011] placeholder-gray-300 text-lg focus:ring-2 focus:ring-[#cc5500]/20 transition-all outline-none" placeholder="+234..." />
                      </div>
                      <div className="space-y-4">
                        <label className="block text-[#001011] text-base font-black uppercase tracking-widest">Email Address</label>
                        <input required type="email" name="emailAddress" value={formData.emailAddress} onChange={handleChange} className="w-full bg-gray-50 border-none px-6 py-4 text-[#001011] placeholder-gray-300 text-lg focus:ring-2 focus:ring-[#cc5500]/20 transition-all outline-none" placeholder="email@example.com" />
                      </div>
                    </div>
                  </div>
                )}

                {step === 3 && (
                  <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div className="space-y-4">
                        <label className="block text-[#001011] text-base font-black uppercase tracking-widest">Religion</label>
                        <input required type="text" name="religion" value={formData.religion} onChange={handleChange} className="w-full bg-gray-50 border-none px-6 py-4 text-[#001011] placeholder-gray-300 text-lg focus:ring-2 focus:ring-[#cc5500]/20 transition-all outline-none" placeholder="Enter religion" />
                      </div>
                      <div className="space-y-4">
                        <label className="block text-[#001011] text-base font-black uppercase tracking-widest">Nationality</label>
                        <input required type="text" name="nationality" value={formData.nationality} onChange={handleChange} className="w-full bg-gray-50 border-none px-6 py-4 text-[#001011] placeholder-gray-300 text-lg focus:ring-2 focus:ring-[#cc5500]/20 transition-all outline-none" placeholder="Enter nationality" />
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div className="space-y-4">
                        <label className="block text-[#001011] text-base font-black uppercase tracking-widest">NIN Number</label>
                        <input required type="text" name="ninNumber" value={formData.ninNumber} onChange={handleChange} className="w-full bg-gray-50 border-none px-6 py-4 text-[#001011] placeholder-gray-300 text-lg focus:ring-2 focus:ring-[#cc5500]/20 transition-all outline-none" placeholder="Enter NIN number" />
                      </div>
                      <div className="space-y-4">
                        <label className="block text-[#001011] text-base font-black uppercase tracking-widest">Blood Group</label>
                        <input required type="text" name="bloodGroup" value={formData.bloodGroup} onChange={handleChange} className="w-full bg-gray-50 border-none px-6 py-4 text-[#001011] placeholder-gray-300 text-lg focus:ring-2 focus:ring-[#cc5500]/20 transition-all outline-none" placeholder="e.g. O+, A-, AB+" />
                      </div>
                    </div>
                    <div className="space-y-4">
                      <label className="block text-[#001011] text-base font-black uppercase tracking-widest">Status</label>
                      <div className="flex items-center gap-6 bg-gray-50 px-6 py-4">
                        <label className="inline-flex items-center cursor-pointer">
                          <input type="radio" name="status" value="Single" checked={formData.status === "Single"} onChange={handleChange} className="accent-[#cc5500] w-5 h-5" />
                          <span className="ml-2 text-lg font-bold text-[#001011]">Single</span>
                        </label>
                        <label className="inline-flex items-center cursor-pointer">
                          <input type="radio" name="status" value="Married" checked={formData.status === "Married"} onChange={handleChange} className="accent-[#cc5500] w-5 h-5" />
                          <span className="ml-2 text-lg font-bold text-[#001011]">Married</span>
                        </label>
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
                <p className="mt-8 text-center text-gray-400 text-base tracking-tight italic">
                  By clicking submit, you agree to St. Mary Children School&apos;s data privacy policy and terms of admission.
                </p>
              )}
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
