"use client";
import { useRouter } from "next/navigation";
import { FaArrowRight, FaImage, FaChevronDown, FaCrown } from "react-icons/fa";
import { useEffect, useState } from "react";
import Curriculum from "@/components/home/Curriculum";
import Welcome from "@/components/home/Welcome";
import Gallery from "@/components/home/Gallery";
import TechWizardModal from "@/components/home/TechWizardModal";

const Home = () => {
  const [isHeroVisible, setIsHeroVisible] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const heroSection = document.getElementById("heroSection");
    if (!heroSection) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsHeroVisible(entry.isIntersecting);
      },
      { threshold: 0.1 },
    );

    observer.observe(heroSection);
    return () => observer.disconnect();
  }, []);

  return (
    <main className="min-h-screen flex flex-col pb-32 relative bg-transparent text-[#001011] overflow-hidden ">
      {/* Fixed Side Buttons - Only visible when hero section is in view */}
      <div
        className={`fixed right-0 top-1/2 -translate-y-1/2 z-40 flex flex-col gap-4 pr-4 md:pr-6 hidden md:flex transition-opacity duration-300 ${isHeroVisible ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}
      >
        <button className="bg-gradient-to-r from-[#FFC107] to-[#FFB300] text-white px-6 md:px-8 py-3 md:py-4 rounded-l-2xl font-black text-sm md:text-base uppercase tracking-wider shadow-lg hover:shadow-xl transition-all hover:scale-105 flex items-center justify-center gap-2 group relative overflow-hidden">
          <span className="relative z-10">Inquire</span>
          <FaArrowRight
            className="relative z-10 group-hover:translate-x-1 transition-transform"
            size={16}
          />
          <span className="absolute inset-0 bg-white opacity-0 group-hover:opacity-15 transition-opacity"></span>
        </button>
        <button className="bg-gradient-to-r from-[#E74C3C] to-[#C0392B] text-white px-6 md:px-8 py-3 md:py-4 rounded-l-2xl font-black text-sm md:text-base uppercase tracking-wider shadow-lg hover:shadow-xl transition-all hover:scale-105 flex items-center justify-center gap-2 group relative overflow-hidden">
          <span className="relative z-10">Gallery</span>
          <FaImage
            className="relative z-10 group-hover:translate-x-1 transition-transform"
            size={16}
          />
          <span className="absolute inset-0 bg-white opacity-0 group-hover:opacity-15 transition-opacity"></span>
        </button>
        <button onClick={() => router.push("/apply")} className="bg-gradient-to-r from-[#E91E63] to-[#C2185B] text-white px-6 md:px-8 py-3 md:py-4 rounded-l-2xl font-black text-sm md:text-base uppercase tracking-wider shadow-lg hover:shadow-xl transition-all hover:scale-105 flex items-center justify-center gap-2 group relative overflow-hidden">
          <span className="relative z-10">Apply</span>
          <FaArrowRight
            className="relative z-10 group-hover:translate-x-1 transition-transform"
            size={16}
          />
          <span className="absolute inset-0 bg-white opacity-0 group-hover:opacity-15 transition-opacity"></span>
        </button>
      </div>

      {/* --- HERO SECTION --- */}
      <section
        id="heroSection"
        className="relative w-[100%] mt-[40px] md:mt-[60px] overflow-hidden flex items-center h-[750px] md:h-[900px] shadow-[0_40px_100px_rgba(0,16,17,0.15)] group/hero backdrop-blur-md"
      >
        <div className="absolute inset-0 w-full h-full">
          <img
            src="/images/three.jpg"
            alt="St Mary Campus Excellence"
            className="w-full h-full object-cover object-[center_30%] brightness-[0.7] transform scale-105 transition-transform duration-[30s] group-hover/hero:scale-[1.12] ease-out will-change-transform"
          />
          {/* Enhanced Overlays */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#000a18] via-[#000a18]/60 to-transparent mix-blend-multiply opacity-95"></div>
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#000a18]/20 to-[#000a18]/80"></div>
          <div className="absolute inset-0 bg-gradient-to-tr from-[#0096ff]/20 via-transparent to-[#cc5500]/20 mix-blend-overlay"></div>
        </div>

        {/* Dynamic ambient glows */}
        <div className="absolute top-[-10%] left-[-5%] w-[50rem] h-[50rem] bg-[#0096ff]/25 rounded-full mix-blend-screen filter blur-[180px] animate-pulse pointer-events-none"></div>
        <div className="absolute bottom-[-15%] right-[-5%] w-[55rem] h-[55rem] bg-[#cc5500]/20 rounded-full mix-blend-screen filter blur-[200px] animate-pulse delay-1000 pointer-events-none"></div>

        <div className="relative w-full z-10 px-8 md:px-16 lg:px-24 py-24 text-white flex flex-col justify-center h-full mt-50">
          {/* Premium Status Badge */}
          <div className="inline-flex items-center gap-3 py-2.5 px-6 rounded-full bg-white/5 backdrop-blur-3xl border border-white/20 mb-10 font-bold tracking-[0.4em] text-[9px] md:text-xs text-white uppercase shadow-[0_10px_40px_rgba(0,150,255,0.2)] w-max transform transition-all hover:scale-110 cursor-default hover:bg-white/10 hover:border-white/30">
            <span className="flex h-3 w-3 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#0096ff] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-[#0096ff]"></span>
            </span>
            <span className="font-[var(--inter-font)]">
              Empowering Future Leaders
            </span>
          </div>

          {/* Main Headline */}
          <h1 className="text-4xl sm:text-5xl md:text-5xl lg:text-[8rem] font-black max-w-[1200px] leading-[0.95] tracking-tight drop-shadow-[0_10px_30px_rgba(0,0,0,0.5)] mb-10 text-white font-[var(--worksans-font)]">
            St. Mary <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00BFFF] via-[#4db8ff] to-[#0096ff] bg-[length:200%_auto] animate-[gradient_4s_ease_infinite] inline-block filter drop-shadow-[0_5px_15px_rgba(0,191,255,0.4)]">
              Children
            </span>{" "}
            School
          </h1>

          {/* Refined Subtitle */}
          <p className="mt-8 text-sm md:text-xl lg:text-2xl max-w-2xl font-medium text-white/90 drop-shadow-md leading-relaxed border-l-[3px] md:border-l-[6px] border-[#00BFFF] pl-8 py-4 backdrop-blur-sm bg-gradient-to-r from-white/10 to-transparent rounded-r-2xl font-[var(--inter-font)]">
            Experience a world-class education designed to unlock potential,
            foster leadership, and inspire academic excellence in every child.
          </p>

          {/* Specialized CTA Buttons */}

          <div className="mt-14 flex flex-col sm:flex-row flex-wrap gap-6 relative z-20 mb-[60px]">
            <button onClick={() => router.push("/apply")} className="cursor-pointer bg-gradient-to-r from-[#cc5500] to-[#ff8c00] text-white px-7 md:px-9 py-4 md:py-6 rounded-full font-black flex items-center justify-center gap-4 transition-all shadow-[0_15px_40px_rgba(204,85,0,0.5)] hover:-translate-y-2 hover:shadow-[0_25px_60px_rgba(204,85,0,0.7)] text-xs md:text-[1.3rem] tracking-[0.05em] relative overflow-hidden group/btn group active:scale-95 w-full sm:w-max font-[var(--worksans-font)]">
              <span className="absolute inset-0 w-full h-full bg-white opacity-0 group-hover/btn:opacity-20 transition-opacity"></span>
              <span className="relative z-10 ">Start Your Journey</span>
              <FaArrowRight className="relative z-10 group-hover/btn:translate-x-3 transition-transform" />
            </button>

          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-4 animate-bounce cursor-pointer text-white/40 hover:text-white transition-colors z-20 group">
          <div className="w-[1px] h-12 bg-gradient-to-b from-transparent via-white/50 to-white/10 group-hover:via-white transition-colors"></div>
          <span className="text-[10px] uppercase tracking-[0.6em] font-black group-hover:text-white/80 transition-colors font-[var(--inter-font)]">
            Scroll
          </span>
          <FaChevronDown size={14} className="animate-pulse" />
        </div>
      </section>
      <Welcome />
      <Curriculum />
      <TechWizardModal />
      <Gallery />

      <style
        dangerouslySetInnerHTML={{
          __html: `
        @keyframes gradient {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        .animate-gradient-x {
          background-size: 200% auto;
          animation: gradient 4s ease infinite;
        }
      `,
        }}
      />
    </main>
  );
};

export default Home;
