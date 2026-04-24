import React from "react";
import { FaMicroscope, FaBrain, FaDraftingCompass, FaGlobe, FaBullhorn, FaRobot, FaBusinessTime } from "react-icons/fa";

const JuniorSecondaryPage = () => {
  const focusAreas = [
    {
      id: "01",
      title: "Science & Tech",
      desc: "Introducing foundational concepts in physics, chemistry, and biology through lab-based discovery.",
      icon: <FaMicroscope />,
      color: "from-[#0096ff] to-[#00d2ff]"
    },
    {
      id: "02",
      title: "Humanities",
      desc: "Exploring history, geography, and social studies to foster global citizenship and empathy.",
      icon: <FaGlobe />,
      color: "from-[#cc5500] to-[#ff8c00]"
    },
    {
      id: "03",
      title: "Technical Skills",
      desc: "Hands-on introduction to vocational and technical arts, building practical life-long skills.",
      icon: <FaDraftingCompass />,
      color: "from-purple-600 to-pink-400"
    }
  ];

  return (
    <main className="min-h-screen bg-white font-[var(--inter-font)] relative overflow-x-hidden">
      {/* Hero Section */}
      <section className="relative h-[60vh] flex items-center overflow-hidden mt-35">
        <div className="absolute inset-0">
          <img 
            src="/images/three.jpg" 
            alt="Junior Secondary Education" 
            className="w-full h-full object-cover brightness-[0.5] scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#001011] via-[#001011]/60 to-transparent"></div>
        </div>
        
        <div className="relative w-[90%] mx-auto z-10 text-white">
          <div className="inline-flex items-center gap-3 py-1.5 px-4 rounded-full bg-[#0096ff] text-[10px] font-black uppercase tracking-[0.2em] mb-6 shadow-lg shadow-blue-500/20">
            Secondary Level
          </div>
          <h1 className="text-5xl md:text-7xl font-black font-[var(--worksans-font)] mb-6 drop-shadow-2xl text-[#ffffff]">
          Higher Basic
          </h1>
          <p className="text-lg md:text-xl max-w-2xl text-white/90 leading-relaxed font-medium">
            Bridging the gap between foundational education and specialized academic mastery.
          </p>
        </div>
      </section>

      {/* Overview Section */}
      <section className="py-24 w-[90%] mx-auto">
        <div className="flex flex-col lg:flex-row gap-20 items-center">
          <div className="flex-1 space-y-8">
            <div className="space-y-4">
              <p className="text-[#cc5500] text-xs font-black uppercase tracking-[0.3em]">Transitioning to Mastery</p>
              <h2 className="text-4xl md:text-5xl font-black text-[#001011] font-[var(--worksans-font)] leading-tight">
                Academic Bridge Phase
              </h2>
            </div>
            <p className="text-gray-600 text-lg leading-relaxed">
              Junior Secondary (JSS 1-3) marks a critical transition. At SMEC, we provide a 
              stimulating environment where students transition from broad subjects to deeper 
              academic inquiry.
            </p>
            <p className="text-gray-600 text-lg leading-relaxed">
              We focus on building strong analytical minds, effective communication skills, 
              and the beginning of specialized vocational awareness through our diverse curriculum.
            </p>
          </div>

          <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
            {[
              { title: "Public Speaking", desc: "Developing confident orators", icon: <FaBullhorn className="text-red-500" />, overlayText: "Engaging in debates and presentations to build articulate, confident communicators." },
              { title: "Critical Thinking", desc: "Solving complex problems", icon: <FaBrain className="text-indigo-500" />, overlayText: "Encouraging analytical reasoning and independent thought across diverse subjects." },
              { title: "Robotics & AI", desc: "Exploring future tech", icon: <FaRobot className="text-blue-500" />, overlayText: "Hands-on projects with foundational robotics and artificial intelligence logic." },
              { title: "Pre-Business", desc: "Intro to financial logic", icon: <FaBusinessTime className="text-emerald-500" />, overlayText: "Learning the basics of entrepreneurship, economics, and real-world financial literacy." }
            ].map((card, i) => (
              <div key={i} className="group relative p-8 rounded-[2rem] bg-gray-50 border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-500 hover:-translate-y-1 overflow-hidden">
                <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center text-xl shadow-sm mb-6 relative z-10 transition-transform duration-500 group-hover:scale-110">
                  {card.icon}
                </div>
                <h4 className="text-[#001011] font-black text-lg mb-2 font-[var(--worksans-font)] relative z-10 transition-colors duration-300">{card.title}</h4>
                <p className="text-gray-500 text-sm relative z-10 transition-opacity duration-300 group-hover:opacity-0">{card.desc}</p>
                
                {/* Overlay */}
                <div className="absolute inset-0 bg-[#001011] p-8 flex flex-col justify-center translate-y-[101%] group-hover:translate-y-0 transition-transform duration-500 ease-in-out z-20">
                  <h4 className="text-white font-black text-lg mb-3 font-[var(--worksans-font)]">{card.title}</h4>
                  <p className="text-white/80 text-sm leading-relaxed">{card.overlayText}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Key Focus Areas */}
      <section className="py-24 bg-gray-50/50">
        <div className="w-[90%] mx-auto">
          <div className="mb-16">
            <p className="text-[#0096ff] text-xs font-black uppercase tracking-[0.3em] mb-4">Focus Categories</p>
            <h2 className="text-4xl md:text-5xl font-black text-[#001011] font-[var(--worksans-font)] leading-tight">
              Curriculum Core
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {focusAreas.map((area, i) => (
              <div key={i} className="group relative">
                <div className="relative p-10 rounded-[2.5rem] bg-white border border-gray-100 shadow-[0_20px_50px_rgba(0,0,0,0.03)] transition-all duration-500 hover:shadow-[0_40px_80px_rgba(0,0,0,0.08)] hover:-translate-y-4">
                  <div className="absolute top-6 right-8 text-6xl font-black text-gray-50 group-hover:text-gray-100 transition-colors">
                    {area.id}
                  </div>
                  
                  <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${area.color} flex items-center justify-center text-white text-2xl shadow-lg mb-8 transform group-hover:rotate-6 transition-transform`}>
                    {area.icon}
                  </div>

                  <h3 className="text-2xl font-black text-[#001011] mb-4 font-[var(--worksans-font)]">
                    {area.title}
                  </h3>
                  
                  <p className="text-gray-500 leading-relaxed font-medium">
                    {area.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
};

export default JuniorSecondaryPage;
