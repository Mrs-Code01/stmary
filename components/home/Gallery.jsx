"use client";

import React, { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { Loader2 } from "lucide-react";
import Link from "next/link";

const Gallery = () => {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchImages();
  }, []);

  const fetchImages = async () => {
    try {
      const { data, error } = await supabase
        .from('gallery_images')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(12);

      if (error) throw error;
      setImages(data || []);
    } catch (error) {
      console.error('Error fetching gallery images:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="w-full py-20 md:py-32 bg-white overflow-hidden font-[var(--inter-font)]">
      {/* Container set to 90% width on desktop */}
      <div className="w-[90%] mx-auto max-w-[1400px]">
        {/* Header Content */}
        <div className="text-center mb-16 space-y-6">
          <div className="inline-flex items-center gap-3 justify-center w-full">
             <span className="w-10 h-[1px] bg-[#cc5500]"></span>
             <span className="text-[#cc5500] text-xs font-black uppercase tracking-[0.4em]">Our Campus</span>
             <span className="w-10 h-[1px] bg-[#cc5500]"></span>
          </div>
          <h2 className="text-[#001011] text-4xl md:text-6xl font-black tracking-tight font-[var(--worksans-font)]">
            Discover Our <span className="text-[#0096ff]">Excellence</span>
          </h2>
          <p className="text-slate-500 text-base md:text-xl max-w-3xl mx-auto leading-relaxed font-medium">
            St Mary Educational Center is a leading institution dedicated to
            fulfilling the true potential of each child through a supportive and
            inspiring environment.
          </p>
        </div>

        {/* Dynamic Masonry-like Grid */}
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <Loader2 size={40} className="animate-spin text-[#0096ff]" />
          </div>
        ) : images.length === 0 ? (
          <div className="text-center py-20 text-slate-500 text-lg font-medium bg-slate-50 rounded-[3rem] border border-slate-100 italic">
            Check back soon for new photos from the campus!
          </div>
        ) : (
          <div className="columns-2 max-[350px]:columns-1 md:columns-3 lg:columns-4 gap-4 space-y-4">
            {images.map((img) => (
              <div
                key={img.id}
                className="relative overflow-hidden group rounded-2xl bg-slate-100 shadow-[0_10px_30px_rgba(0,0,0,0.03)] transition-all duration-500 hover:shadow-[0_20px_50px_rgba(0,150,255,0.1)] break-inside-avoid"
              >
                <div className="absolute inset-0 bg-gradient-to-t from-[#001011]/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10 pointer-events-none"></div>
                <img
                  src={img.url}
                  alt="Gallery image"
                  className="w-full h-auto object-cover transition-transform duration-[2s] ease-out group-hover:scale-110"
                />
                <div className="absolute bottom-6 left-6 z-20 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 pointer-events-none">
                   <span className="text-white text-xs font-black uppercase tracking-widest bg-white/20 backdrop-blur-md px-4 py-2 rounded-full border border-white/30">
                      View
                   </span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* View More Button */}
        {!loading && images.length > 0 && (
          <div className="mt-16 flex justify-center">
            <Link 
              href="/gallery"
              className="bg-transparent border-2 border-[#001011] text-[#001011] hover:bg-[#001011] hover:text-white px-10 py-4 rounded-full font-black text-xs uppercase tracking-widest transition-all duration-300 shadow-md active:scale-95 inline-block"
            >
              View More
            </Link>
          </div>
        )}
      </div>
    </section>
  );
};

export default Gallery;
