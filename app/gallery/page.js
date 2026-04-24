"use client";

import React, { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { Loader2 } from "lucide-react";

export default function FullGalleryPage() {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const IMAGES_PER_PAGE = 50;

  useEffect(() => {
    fetchImages(0);
  }, []);

  const fetchImages = async (pageIndex) => {
    try {
      const from = pageIndex * IMAGES_PER_PAGE;
      const to = from + IMAGES_PER_PAGE - 1;

      const { data, error, count } = await supabase
        .from('gallery_images')
        .select('*', { count: 'exact' })
        .order('created_at', { ascending: false })
        .range(from, to);

      if (error) throw error;
      
      if (pageIndex === 0) {
        setImages(data || []);
      } else {
        setImages((prev) => [...prev, ...(data || [])]);
      }

      if ((data || []).length < IMAGES_PER_PAGE || (count && from + (data || []).length >= count)) {
        setHasMore(false);
      }
    } catch (error) {
      console.error('Error fetching gallery images:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLoadMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    fetchImages(nextPage);
  };

  return (
    <div className="min-h-screen bg-white font-[var(--inter-font)] flex flex-col relative z-20 mt-[50px]">
      
      {/* Spacer for sticky nav if needed (adjust based on your Nav height) */}
      <div className="h-24 bg-[#001011]"></div>

      {/* Hero Banner */}
      <div className="bg-[#001011] text-white py-20 md:py-32 relative overflow-hidden">
        <div className="absolute top-[-20%] right-[-10%] w-[30rem] h-[30rem] bg-[#0096ff]/10 rounded-full mix-blend-screen filter blur-[100px] pointer-events-none"></div>
        <div className="absolute bottom-[-20%] left-[-10%] w-[20rem] h-[20rem] bg-[#cc5500]/10 rounded-full mix-blend-screen filter blur-[80px] pointer-events-none"></div>
        
        <div className="relative z-10 text-center w-[90%] max-w-4xl mx-auto">
          <div className="inline-block bg-[#0096ff] text-white text-[10px] font-black uppercase tracking-[0.3em] px-4 py-1.5 mb-6 shadow-xl shadow-blue-500/20">
            FULL GALLERY
          </div>
          <h1 className="text-5xl md:text-7xl text-[#ffffff] my-6 font-[var(--worksans-font)] tracking-tight">Our Memories</h1>
          <p className="text-white/70 text-lg md:text-xl font-medium max-w-2xl mx-auto leading-relaxed">
            Take a comprehensive look at the facilities, events, and everyday excellence at St. Mary Educational Center.
          </p>
        </div>
      </div>

      {/* Gallery Section */}
      <div className="flex-1 w-[90%] mx-auto max-w-[1400px] py-20 md:py-32">
        {loading && page === 0 ? (
          <div className="flex justify-center items-center py-32">
            <Loader2 size={40} className="animate-spin text-[#0096ff]" />
          </div>
        ) : images.length === 0 ? (
          <div className="text-center py-32 text-slate-500 text-lg font-medium bg-slate-50 rounded-[3rem] border border-slate-100 italic">
            There are currently no photos uploaded to the gallery.
          </div>
        ) : (
          <>
            <div className="columns-2 max-[350px]:columns-1 md:columns-3 lg:columns-4 gap-4 space-y-4">
              {images.map((img) => (
                <div
                  key={img.id}
                  className="relative overflow-hidden group rounded-2xl bg-slate-100 shadow-[0_10px_30px_rgba(0,0,0,0.03)] transition-all duration-500 hover:shadow-[0_20px_50px_rgba(0,150,255,0.1)] break-inside-avoid"
                >
                  <div className="absolute inset-0 bg-gradient-to-t from-[#001011]/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10 pointer-events-none"></div>
                  <img
                    src={img.url}
                    alt="Gallery content"
                    className="w-full h-auto object-cover transition-transform duration-[2s] ease-out group-hover:scale-110"
                    loading="lazy"
                  />
                  <div className="absolute bottom-6 left-6 z-20 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 pointer-events-none">
                    <span className="text-white text-xs font-black uppercase tracking-widest bg-white/20 backdrop-blur-md px-4 py-2 rounded-full border border-white/30">
                        View
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination / Load More */}
            {hasMore && (
              <div className="mt-20 flex justify-center">
                <button 
                  onClick={handleLoadMore}
                  className="bg-transparent border-2 border-[#001011] text-[#001011] hover:bg-[#001011] hover:text-white px-12 py-5 rounded-full font-black text-xs uppercase tracking-widest transition-all duration-300 shadow-md active:scale-95 flex items-center gap-3 group"
                >
                  {loading && page > 0 ? (
                    <Loader2 size={16} className="animate-spin" />
                  ) : null}
                  Load More Photos
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
