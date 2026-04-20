import React from "react";
import Link from "next/link";

const CallToAction = () => {
  return (
    <section className="w-full bg-black border-y border-[#cc5500]/30 py-12 md:py-16">
      <div className="w-[90%] mx-auto flex flex-col md:flex-row items-center justify-between gap-10">
        
        {/* Text Content */}
        <div className="text-center md:text-left space-y-3 max-w-2xl">
          <h2 className="text-white text-2xl md:text-4xl font-black tracking-tighter leading-tight">
            Ready to Start Your Child's Journey?
          </h2>
          <p className="text-white/80 text-base md:text-lg font-bold tracking-wide">
            APPLY TODAY FOR THE 2025/2026 ACADEMIC SESSION.
          </p>
        </div>

        {/* Action Button */}
        <div className="shrink-0">
          <Link
            href="/apply"
            className="bg-[#0096ff] text-white px-10 py-5 rounded-sm font-black text-xs md:text-sm tracking-[0.2em] uppercase transition-all hover:bg-white hover:text-black shadow-xl active:scale-95 flex items-center gap-4 group"
          >
            Apply Now
            <span className="text-xl group-hover:translate-x-2 transition-transform duration-300">→</span>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default CallToAction;
