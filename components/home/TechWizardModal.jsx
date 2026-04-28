"use client";
import Link from "next/link";
import { useState, useEffect } from "react";
import { FaChevronLeft, FaChevronRight, FaTimes, FaMagic } from "react-icons/fa";

const cards = [
  {
    id: "ai-automation",
    title: "AI automation",
    img: "/images/one.jpg",
    desc: "Experience the power of intelligent workflows that handle repetitive tasks with precision.",
    rating: "4.9",
    color: "from-blue-500/20",
    glow: "shadow-blue-500/20",
  },
  {
    id: "ai-chatbot",
    title: "AI chatbot",
    img: "/images/two.jpg",
    desc: "Engage your audience like never before with next-generation conversational agents.",
    rating: "4.8",
    color: "from-purple-500/20",
    glow: "shadow-purple-500/20",
  },
  {
    id: "ai-video-creation",
    title: "AI video creation",
    img: "/images/three.jpg",
    desc: "Unleash your creativity with generative media tools that turn ideas into cinematic reality.",
    rating: "4.7",
    color: "from-pink-500/20",
    glow: "shadow-pink-500/20",
  },
  {
    id: "website-development",
    title: "Website development",
    img: "/images/four.jpg",
    desc: "Build the foundation of your digital presence with high-performance, responsive web applications.",
    rating: "4.9",
    color: "from-green-500/20",
    glow: "shadow-green-500/20",
  },
  {
    id: "blockchain-development",
    title: "Blockchain development",
    img: "/images/two.jpg",
    desc: "Enter the world of decentralized technology with secure, transparent, and immutable solutions.",
    rating: "4.8",
    color: "from-orange-500/20",
    glow: "shadow-orange-500/20",
  },
];

const TechWizardModal = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsOpen(true);
    }, 1500); // Show modal shortly after load
    return () => clearTimeout(timer);
  }, []);

  const nextCard = () => {
    setCurrentIndex((prev) => (prev === cards.length - 1 ? 0 : prev + 1));
  };

  const prevCard = () => {
    setCurrentIndex((prev) => (prev === 0 ? cards.length - 1 : prev - 1));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-md animate-in fade-in duration-500">
      <div
        className="relative w-full max-w-2xl bg-white/90 backdrop-blur-2xl rounded-[2rem] md:rounded-[2.5rem] shadow-[0_32px_64px_-16px_rgba(0,0,0,0.2)] border border-white/50 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={() => setIsOpen(false)}
          className="absolute top-4 right-4 md:top-6 md:right-6 z-50 p-2 md:p-3 rounded-full bg-slate-100/80 hover:bg-slate-200 text-slate-500 transition-all hover:rotate-90"
        >
          <FaTimes size={16} />
        </button>

        <div className="flex flex-col md:flex-row h-full md:min-h-[400px]">
          {/* Image Side */}
          <div className="relative w-full md:w-5/12 h-48 md:h-auto overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-600/10 to-purple-600/10 z-10" />
            <img
              src={cards[currentIndex].img}
              alt={cards[currentIndex].title}
              className="w-full h-full object-cover transition-transform duration-700 hover:scale-110"
            />
            <div className="absolute bottom-4 left-4 z-20">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/30 backdrop-blur-md border border-white/40 text-white text-[9px] font-bold uppercase tracking-wider">
                <FaMagic /> {currentIndex + 1} / {cards.length}
              </div>
            </div>
          </div>

          {/* Content Side */}
          <div className="w-full md:w-7/12 p-6 md:p-10 flex flex-col justify-center">
            <div className="mb-4 md:mb-6">
              <span className="text-[9px] font-black uppercase tracking-[0.2em] text-[#cc5500] mb-1.5 block">
                Level up your skills
              </span>
              <h2 className="text-2xl md:text-3xl font-black text-[#001011] leading-tight mb-3 md:mb-4">
                {cards[currentIndex].title}
              </h2>
              <p className="text-slate-500 text-sm md:text-base font-medium leading-relaxed">
                {cards[currentIndex].desc}
              </p>
            </div>

            <div className="mt-4 md:mt-6 flex flex-wrap items-center justify-between gap-4">
              <div className="flex gap-2 md:gap-3">
                <button
                  onClick={prevCard}
                  className="p-3 md:p-4 rounded-full border border-slate-200 text-slate-400 hover:bg-slate-100 hover:text-[#001011] transition-all cursor-pointer active:scale-90"
                >
                  <FaChevronLeft size={14} />
                </button>
                <button
                  onClick={nextCard}
                  className="p-3 md:p-4 rounded-full bg-[#001011] text-white hover:bg-[#cc5500] transition-all shadow-lg hover:shadow-[#cc5500]/20 cursor-pointer active:scale-90"
                >
                  <FaChevronRight size={14} />
                </button>
              </div>

              <Link
                href={`/tech-wizard/${cards[currentIndex].id}`}
                onClick={() => setIsOpen(false)}
                className="flex-1 md:flex-none px-6 md:px-8 py-3 md:py-4 rounded-full bg-gradient-to-r from-[#0096ff] to-[#0077cc] text-white font-bold text-xs md:text-sm uppercase tracking-wider hover:shadow-xl transition-all hover:scale-105 active:scale-95 cursor-pointer text-center"
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>

        {/* Progress Dots */}
        <div className="absolute bottom-4 left-1/2 md:left-[70%] -translate-x-1/2 flex gap-1.5 md:gap-2">
          {cards.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentIndex(idx)}
              className={`w-1.5 h-1.5 md:w-2 md:h-2 rounded-full transition-all duration-300 ${currentIndex === idx ? "w-4 md:w-6 bg-[#001011]" : "bg-slate-300"} cursor-pointer`}
            />
          ))}
        </div>
      </div>

      {/* Background click to close */}
      <div className="absolute inset-0 -z-10" onClick={() => setIsOpen(false)} />

      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }
        .animate-in {
          animation: fadeIn 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
      `}</style>
    </div>
  );
};

export default TechWizardModal;
