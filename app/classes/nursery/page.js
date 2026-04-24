import React from "react";
import { FaHeart, FaBrain, FaUsers, FaPalette, FaMicroscope, FaCalculator, FaBookOpen } from "react-icons/fa";

const ClassPage = () => {
  const focusAreas = [
    {
      id: "01",
      title: "Literacy & Phonics",
      desc: "Early reading skills through immersive storytelling, rhymes, and the Jolly Phonics program.",
      icon: <FaBookOpen />,
      color: "from-orange-500 to-red-500"
    },
    {
      id: "02",
      title: "Numeracy",
      desc: "Hands-on activities with counters, shapes, and patterns help children understand numbers.",
      icon: <FaCalculator />,
      color: "from-blue-500 to-indigo-500"
    },
    {
      id: "03",
      title: "World Discovery",
      desc: "Outdoor play, nature walks, and science experiments spark wonder about the environment.",
      icon: <FaMicroscope />,
      color: "from-green-500 to-teal-500"
    }
  ];

  return (
    <main className="min-h-screen bg-white font-[var(--inter-font)] relative overflow-x-hidden">
      {/* Hero Section */}
       <section className="relative h-[60vh] flex items-center overflow-hidden mt-35">
        <div className="absolute inset-0">
          <img 
            src="/images/one.jpg" 
            alt="Nursery Education" 
            className="w-full h-full object-cover brightness-[0.6] scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#001011] via-[#001011]/40 to-transparent"></div>
        </div>
        
        <div className="relative w-[90%] mx-auto z-10 text-white">
          <div className="inline-flex items-center gap-3 py-1.5 px-4 rounded-full bg-[#0096ff] text-[10px] font-black uppercase tracking-[0.2em] mb-6 shadow-lg shadow-blue-500/20">
            Nursery Level
          </div>
          <h1 className="text-5xl md:text-7xl font-black font-[var(--worksans-font)] mb-6 drop-shadow-2xl text-[#ffffff]">
          Nursery
          </h1>
          <p className="text-lg md:text-xl max-w-2xl text-white/90 leading-relaxed font-medium">
            A nurturing sanctuary where curiosity is sparked and the foundation for lifelong learning is laid.
          </p>
        </div>
      </section>

      {/* Overview Section */}
      <section className="py-24 w-[90%] mx-auto">
        <div className="flex flex-col lg:flex-row gap-20 items-center">
          <div className="flex-1 space-y-8">
            <div className="space-y-4">
              <p className="text-[#cc5500] text-xs font-black uppercase tracking-[0.3em]">Ages 18 Months - 5 Years</p>
              <h2 className="text-4xl md:text-5xl font-black text-[#001011] font-[var(--worksans-font)] leading-tight">
                Early Years Foundation
              </h2>
            </div>
            <p className="text-gray-600 text-lg leading-relaxed">
              At SMEC, our Early Years Foundation programme is designed to create confident, 
              curious, and capable learners who are ready to embrace the challenges and 
              opportunities of tomorrow.
            </p>
            <p className="text-gray-600 text-lg leading-relaxed">
              We believe that the early years are the most critical period in a child's development. Our 
              approach goes beyond traditional academics to nurture the whole child — emotionally, 
              socially, physically, and intellectually.
            </p>
          </div>

          <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
            {[
              { title: "Emotional Care", desc: "Nurturing hearts and minds", icon: <FaHeart className="text-red-400" />, overlayText: "We provide a safe, loving environment where children learn to process their emotions and build empathy." },
              { title: "Cognitive Growth", desc: "Building bright minds", icon: <FaBrain className="text-blue-400" />, overlayText: "Interactive puzzles and memory games stimulate critical thinking from an early age." },
              { title: "Social Skills", desc: "Learning together", icon: <FaUsers className="text-purple-400" />, overlayText: "Group activities and collaborative play help children develop strong communication and teamwork skills." },
              { title: "Creative Play", desc: "Imagination unleashed", icon: <FaPalette className="text-orange-400" />, overlayText: "Unrestricted access to art supplies, music, and role-play corners to foster boundless creativity." }
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
            <p className="text-[#0096ff] text-xs font-black uppercase tracking-[0.3em] mb-4">Curriculum Pillars</p>
            <h2 className="text-4xl md:text-5xl font-black text-[#001011] font-[var(--worksans-font)] leading-tight">
              Key Focus Areas
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

export default ClassPage;
