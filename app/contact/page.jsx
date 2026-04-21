import React from "react";
import Link from "next/link";
import { FaMapMarkerAlt, FaPhone, FaEnvelope } from "react-icons/fa";

export default function ContactUsPage() {
  return (
    <div className="min-h-[80vh] flex flex-col">
      {/* Banner */}
      <div className="bg-[#0B1528] text-white py-16 text-center">
        <h1 className="text-4xl font-black mb-4 tracking-tight">Contact Us</h1>
        <p className="text-blue-200 text-sm max-w-xl mx-auto px-4">
          We&apos;d love to hear from you. Reach out to St. Mary Children School for any inquiries, admissions, or support.
        </p>
      </div>

      <div className="flex-1 bg-[#f8fafc] py-16 px-6">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row gap-12">
          {/* Contact Details */}
          <div className="flex-1 space-y-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Get In Touch</h2>
            
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 flex-shrink-0">
                <FaMapMarkerAlt size={20} />
              </div>
              <div>
                <h3 className="font-bold text-gray-900 mb-1">Campus Address</h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  20, Gana Street, Maitama,<br />
                  Abuja, Nigeria
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 flex-shrink-0">
                <FaPhone size={20} />
              </div>
              <div>
                <h3 className="font-bold text-gray-900 mb-1">Phone Number</h3>
                <p className="text-gray-600 text-sm">
                  <a href="tel:+2349026361135" className="hover:text-blue-600 transition-colors">+2349026 361135</a>
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 flex-shrink-0">
                <FaEnvelope size={20} />
              </div>
              <div>
                <h3 className="font-bold text-gray-900 mb-1">Email Address</h3>
                <p className="text-gray-600 text-sm">
                  <a href="mailto:info@smec.edu.ng" className="hover:text-blue-600 transition-colors">info@smec.edu.ng</a>
                </p>
              </div>
            </div>
            
            <div className="pt-6 border-t border-gray-200">
              <Link href="/" className="inline-flex items-center text-blue-600 font-bold text-sm tracking-wide hover:underline">
                &larr; Back to Home
              </Link>
            </div>
          </div>

          {/* Contact Form Placeholder */}
          <div className="flex-1 bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Send a Message</h2>
            <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-2">Your Name</label>
                <input type="text" className="w-full border border-gray-200 rounded-lg px-4 py-3 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500" placeholder="John Doe" />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-2">Email Address</label>
                <input type="email" className="w-full border border-gray-200 rounded-lg px-4 py-3 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500" placeholder="john@example.com" />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-2">Message</label>
                <textarea rows="4" className="w-full border border-gray-200 rounded-lg px-4 py-3 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500" placeholder="How can we help you?"></textarea>
              </div>
              
              <button 
                type="button" 
                onClick={() => alert('Message sending logic will be implemented here!')}
                className="w-full bg-[#0B1528] text-white font-bold uppercase tracking-widest text-xs py-4 rounded-lg hover:bg-blue-800 transition-colors"
              >
                Send Message
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
