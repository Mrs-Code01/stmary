"use client";
import React, { useState } from "react";
import { FaTimes, FaUniversity, FaInfoCircle, FaEnvelope, FaCopy, FaCheck } from "react-icons/fa";

const FeesModal = ({ isOpen, onClose }) => {
  const [copied, setCopied] = useState(false);
  const accountNumber = "2005444148";

  const handleCopy = () => {
    navigator.clipboard.writeText(accountNumber);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-[#00142a]/60 backdrop-blur-sm animate-in fade-in duration-300">
      <div 
        className="relative w-full max-w-2xl bg-white rounded-[2rem] shadow-[0_25px_50px_-12px_rgba(0,0,0,0.5)] overflow-hidden border border-gray-100 scale-in-center"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-8 md:p-10 flex justify-between items-start">
          <div>
            <h2 className="text-[#00142a] text-2xl font-black tracking-tight uppercase leading-none">
              Payment details
            </h2>
            <p className="text-gray-400 text-[10px] font-black uppercase tracking-[0.2em] mt-3">2025/2026 Academic Session</p>
          </div>
          <button 
            onClick={onClose}
            className="text-gray-300 hover:text-gray-900 transition-colors p-2 hover:bg-gray-50 rounded-full"
          >
            <FaTimes size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="px-8 md:px-12 pb-10 space-y-12 max-h-[55vh] overflow-y-auto custom-scrollbar">
          
          {/* Amount Large */}
          <div className="text-center py-4">
             <p className="text-gray-400 text-[11px] font-black uppercase tracking-[0.3em] mb-2">Application Fee</p>
             <h3 className="text-5xl font-black text-[#00142a] tracking-tighter">N10,000</h3>
          </div>

          {/* Bank Details Minimal */}
          <div className="space-y-8">
             <div className="flex items-center gap-4">
                <div className="h-px bg-gray-100 flex-1" />
                <span className="text-[9px] font-black text-gray-300 uppercase tracking-[0.3em] whitespace-nowrap">Bank Transfer Info</span>
                <div className="h-px bg-gray-100 flex-1" />
             </div>

             <div className="grid grid-cols-1 md:grid-cols-2 gap-y-8 gap-x-12">
                <div className="space-y-1">
                   <p className="text-gray-400 text-[10px] font-black uppercase tracking-widest">Bank Name</p>
                   <p className="text-[#00142a] font-bold text-xl tracking-tight">First Bank</p>
                </div>
                
                <button 
                  onClick={handleCopy}
                  className="text-left space-y-1 group relative active:scale-[0.98] transition-transform"
                >
                   <p className="text-gray-400 text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
                     Account Number 
                     {copied ? <FaCheck className="text-green-500" /> : <FaCopy className="opacity-0 group-hover:opacity-100 transition-opacity" />}
                   </p>
                   <p className="text-[#cc5500] font-black text-2xl tracking-[0.1em]">{accountNumber}</p>
                   {copied && (
                     <span className="absolute -bottom-5 left-0 text-[9px] font-bold text-green-500 uppercase tracking-widest animate-in fade-in slide-in-from-top-1">
                       Copied!
                     </span>
                   )}
                </button>

                <div className="md:col-span-2 space-y-1 pt-2">
                   <p className="text-gray-400 text-[10px] font-black uppercase tracking-widest">Account Name</p>
                   <p className="text-[#00142a] font-black text-xl md:text-2xl tracking-tighter">St. Mary Children School</p>
                </div>
             </div>
          </div>

          {/* Verification Minimal */}
          <div className="bg-[#fcfdfe] rounded-2xl p-6 border border-gray-100">
             <div className="flex items-start gap-4">
                <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center text-blue-500 shrink-0">
                  <FaInfoCircle size={14} />
                </div>
                <div className="space-y-3">
                   <p className="text-sm font-black text-[#00142a] uppercase tracking-widest">Verification Step</p>
                   <p className="text-gray-500 text-[13px] leading-relaxed font-medium">
                      Email your payment receipt to <span className="text-[#00142a] font-bold underline underline-offset-4 decoration-gray-200">iwuezemarychildrenschool@gmail.com</span> for immediate verification.
                   </p>
                   <p className="text-[10px] text-red-500 font-bold uppercase tracking-widest pt-1 border-t border-gray-50 inline-block">
                     * Cash payments are strictly not accepted
                   </p>
                </div>
             </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-8 bg-gray-50/50 border-t border-gray-100 flex justify-center">
          <button 
            onClick={onClose}
            className="w-full md:w-auto bg-[#00142a] hover:bg-black text-white px-16 py-4 rounded-xl font-black text-xs uppercase tracking-[0.2em] transition-all shadow-xl active:scale-95"
          >
            I Understand
          </button>
        </div>
      </div>

      {/* Overlay click to close */}
      <div className="absolute inset-0 -z-10" onClick={onClose} />

      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes scaleIn {
          from { opacity: 0; transform: scale(0.95) translateY(10px); }
          to { opacity: 1; transform: scale(1) translateY(0); }
        }
        .animate-in {
          animation: fadeIn 0.3s ease-out forwards;
        }
        .scale-in-center {
          animation: scaleIn 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #e2e8f0;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #cbd5e1;
        }
      `}</style>
    </div>
  );
};

export default FeesModal;
