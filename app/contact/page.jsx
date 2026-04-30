"use client";
import React, { useState, useEffect } from 'react';
import { FaPhone, FaEnvelope, FaMapMarkerAlt, FaWhatsapp, FaCheckCircle, FaSpinner } from 'react-icons/fa';
import { useForm, ValidationError } from '@formspree/react';

const ContactUsPage = () => {
  const [state, handleSubmit] = useForm("xnjwagjy");
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    if (state.succeeded) {
      setShowSuccess(true);
      const timer = setTimeout(() => {
        setShowSuccess(false);
      }, 7000);
      return () => clearTimeout(timer);
    }
  }, [state.succeeded]);

  return (
    <div className="flex flex-col md:flex-row min-h-[90vh] font-[var(--inter-font)] relative z-10 bg-white">
      
      {/* Left Section: Form */}
      <div className="w-full md:w-3/5 bg-white p-8 md:p-20">
        <div className="inline-block bg-[#0096ff] text-white text-[10px] font-black uppercase tracking-[0.3em] px-4 py-1.5 mb-6 mt-[120px]">
          CONTACT US
        </div>
        <h1 className="text-4xl md:text-5xl font-black text-[#001011] mb-4 font-[var(--worksans-font)] tracking-tight">Let's work together!</h1>
        <p className="text-slate-500 mb-10 text-lg">
          St. Mary Children School — We'd love to hear from you. Fill out the form and we'll get back to you shortly.
        </p>

        <form onSubmit={handleSubmit} className="space-y-8">
          <div>
            <label htmlFor="parentName" className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Name</label>
            <input
              required
              id="parentName"
              type="text"
              name="parentName"
              placeholder="Your full name"
              className="w-full border-b border-slate-200 py-3 focus:outline-none focus:border-[#cc5500] transition-colors text-[#001011] text-base"
            />
            <ValidationError prefix="Name" field="parentName" errors={state.errors} className="text-red-500 text-xs mt-1 font-bold" />
          </div>

          <div>
            <label htmlFor="email" className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Email Address</label>
            <input
              required
              id="email"
              type="email"
              name="email"
              placeholder="Your email address"
              className="w-full border-b border-slate-200 py-3 focus:outline-none focus:border-[#cc5500] transition-colors text-[#001011] text-base"
            />
            <ValidationError prefix="Email" field="email" errors={state.errors} className="text-red-500 text-xs mt-1 font-bold" />
          </div>

          <div>
            <label htmlFor="phone" className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Phone</label>
            <input
              required
              id="phone"
              type="tel"
              name="phone"
              placeholder="Your phone number"
              className="w-full border-b border-slate-200 py-3 focus:outline-none focus:border-[#cc5500] transition-colors text-[#001011] text-base"
            />
            <ValidationError prefix="Phone" field="phone" errors={state.errors} className="text-red-500 text-xs mt-1 font-bold" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <label htmlFor="childClass" className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Child's Class</label>
              <input
                id="childClass"
                type="text"
                name="childClass"
                placeholder="e.g. Primary 3"
                className="w-full border-b border-slate-200 py-3 focus:outline-none focus:border-[#cc5500] transition-colors text-[#001011] text-base"
              />
              <ValidationError prefix="Class" field="childClass" errors={state.errors} className="text-red-500 text-xs mt-1 font-bold" />
            </div>
            <div>
              <label htmlFor="childName" className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Child's Name</label>
              <input
                id="childName"
                type="text"
                name="childName"
                placeholder="Your child's name"
                className="w-full border-b border-slate-200 py-3 focus:outline-none focus:border-[#cc5500] transition-colors text-[#001011] text-base"
              />
              <ValidationError prefix="Child Name" field="childName" errors={state.errors} className="text-red-500 text-xs mt-1 font-bold" />
            </div>
          </div>

          <div>
            <label htmlFor="comment" className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Comment / Complaint</label>
            <textarea
              required
              id="comment"
              name="comment"
              placeholder="Write your comment or complaint here..."
              rows="4"
              className="w-full bg-slate-50 border-none rounded-xl p-6 mt-2 focus:outline-none focus:ring-2 focus:ring-[#cc5500]/20 transition-all text-[#001011] text-base resize-none"
            ></textarea>
            <ValidationError prefix="Message" field="comment" errors={state.errors} className="text-red-500 text-xs mt-1 font-bold" />
          </div>

          <div className="space-y-4">
            <button
              type="submit"
              disabled={state.submitting}
              className="w-full bg-gradient-to-r from-[#cc5500] to-[#ff8c00] hover:from-[#b34a00] hover:to-[#cc5500] text-white font-black py-5 rounded-sm uppercase tracking-widest text-sm transition-all shadow-[0_15px_40px_rgba(204,85,0,0.3)] active:scale-95 flex items-center justify-center gap-3 disabled:opacity-70"
            >
              {state.submitting ? (
                <>
                  <FaSpinner className="animate-spin" /> Processing...
                </>
              ) : (
                "Submit Message"
              )}
            </button>

            {showSuccess && (
              <div className="flex items-center justify-center gap-2 text-green-600 font-bold bg-green-50 py-3 rounded-xl border border-green-100 animate-in fade-in slide-in-from-top-2">
                <FaCheckCircle />
                <span>Message sent successfully!</span>
              </div>
            )}
          </div>
        </form>
      </div>

      {/* Right Section: Contact Info */}
      <div className="w-full md:w-2/5 bg-[#000000] p-8 md:p-20 text-white flex flex-col justify-center relative overflow-hidden group">
        <div className="absolute top-[-10%] right-[-10%] w-[20rem] h-[20rem] bg-[#000000] rounded-full mix-blend-screen filter blur-[80px] pointer-events-none transition-transform duration-1000 group-hover:scale-150"></div>
        <div className="absolute bottom-[-10%] left-[-10%] w-[15rem] h-[15rem] bg-[#000000] rounded-full mix-blend-screen filter blur-[60px] pointer-events-none transition-transform duration-1000 group-hover:scale-150"></div>

        <div className="relative z-10">
          <h2 className="text-3xl md:text-4xl text-[#ffffff] mb-8 font-[var(--worksans-font)] tracking-tight">Contact Information</h2>
          <p className="text-white/70 mb-12 text-lg font-medium">Reach out to us directly through any of the official channels below.</p>

          <div className="space-y-10">
            <div className="flex items-center gap-6 group/item cursor-pointer">
              <span className="w-14 h-14 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center group-hover/item:bg-[#cc5500] group-hover/item:border-[#cc5500] transition-colors shadow-lg">
                <FaPhone className="text-white text-xl" />
              </span>
              <div>
                <p className="text-[10px] text-white/50 font-black uppercase tracking-widest mb-1">Call Us Now</p>
                <p className="text-xl font-bold group-hover/item:text-[#cc5500] transition-colors">+234 80 6124 8237</p>
              </div>
            </div>

            <div className="flex items-center gap-6 group/item cursor-pointer">
              <span className="w-14 h-14 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center group-hover/item:bg-[#0096ff] group-hover/item:border-[#0096ff] transition-colors shadow-lg">
                <FaEnvelope className="text-white text-xl" />
              </span>
              <div>
                <p className="text-[10px] text-white/50 font-black uppercase tracking-widest mb-1">Email Us</p>
                <p className="text-lg font-bold group-hover/item:text-[#0096ff] transition-colors">iwuezemarychildrenschool@gmail.com</p>
              </div>
            </div>

            <div className="flex items-center gap-6 group/item cursor-pointer">
              <span className="w-14 h-14 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center group-hover/item:bg-[#ff8c00] group-hover/item:border-[#ff8c00] transition-colors shadow-lg">
                <FaMapMarkerAlt className="text-white text-xl" />
              </span>
              <div>
                <p className="text-[10px] text-white/50 font-black uppercase tracking-widest mb-1">Visit Campus</p>
                <p className="text-lg font-bold group-hover/item:text-[#ff8c00] transition-colors">8, Alofoje Street, Off Uwasota Road, Ugbowo, Benin City</p>
              </div>
            </div>
          </div>

          <div className="mt-16 pt-10 border-t border-white/10">
            <button className="flex items-center gap-4 px-6 py-4 border-2 border-green-500 text-green-500 rounded-xl hover:bg-green-500 hover:text-white transition-all font-bold uppercase tracking-widest text-[10px]">
              <FaWhatsapp className="text-2xl" />
              <span>Chat with Admin</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactUsPage;

