"use client";

import React from "react";
import { Upload, ImageIcon } from "lucide-react";

export default function GalleryPage() {
  return (
    <div className="p-8 flex-1 flex flex-col">
      {/* Gallery Header */}
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-2xl font-bold text-slate-800">Gallery</h2>
        <button className="bg-[#4f46e5] hover:bg-[#4338ca] text-white px-5 py-2.5 rounded-xl text-sm font-semibold flex items-center gap-2 transition-all active:scale-95 shadow-sm">
          <Upload size={18} />
          Upload Photos
        </button>
      </div>

      {/* Empty State Container */}
      <div className="flex-1 flex flex-col items-center justify-center pt-24 pb-32">
        <div className="bg-slate-100 p-8 rounded-2xl mb-6">
           <ImageIcon size={80} className="text-slate-300" strokeWidth={1.5} />
        </div>
        
        <p className="text-slate-500 text-lg font-medium mb-1">
          No photos yet. Upload some to get started.
        </p>
        
        <p className="text-slate-400 text-sm mt-24 max-w-sm text-center">
          Note: Photos are stored locally in this session. Enable Lovable Cloud for permanent storage.
        </p>
      </div>
    </div>
  );
}
