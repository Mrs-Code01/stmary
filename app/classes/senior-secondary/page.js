import React from "react";
import { FaGraduationCap, FaNetworkWired, FaChartBar, FaMicrochip, FaGavel, FaLightbulb, FaUserTie } from "react-icons/fa";

const SeniorSecondaryPage = () => {
  const focusAreas = [
    {
      id: "01",
      title: "Science & Engineering",
      desc: "Advanced STEM subjects including Physics, Chemistry, Biology, and further Mathematics.",
      icon: <FaMicrochip />,
      color: "from-blue-700 to-blue-400"
    },
    {
      id: "02",
      title: "Business & Commerce",
      desc: "Comprehensive study of Accounting, Commerce, and Economics to build future entrepreneurs.",
      icon: <FaChartBar />,
      color: "from-[#cc5500] to-[#ff8c00]"
    },
    {
      id: "03",
      title: "Arts & Humanities",
      desc: "Developing analytical and creative minds through Government, Literature, and History.",
      icon: <FaGavel />,
      color: "from-purple-700 to-pink-500"
    }
  ];

  return (
    <main className="min-h-screen bg-white font-[var(--inter-font)] relative overflow-x-hidden">
      {/* Hero Section */}
      <section className="relative h-[60vh] flex items-center overflow-hidden mt-35">
        <div className="absolute inset-0">
          <img 
            src="/images/four.jpg" 
            alt="Senior Secondary Education" 
            className="w-full h-full object-cover brightness-[0.5] scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#001011] via-[#001011]/60 to-transparent"></div>
        </div>
        
        <div className="relative w-[90%] mx-auto z-10 text-white">
          <div className="inline-flex items-center gap-3 py-1.5 px-4 rounded-full bg-[#0096ff] text-[10px] font-black uppercase tracking-[0.2em] mb-6 shadow-lg shadow-blue-500/20">
            University Preparation
          </div>
          <h1 className="text-5xl md:text-7xl font-black font-[var(--worksans-font)] mb-6 drop-shadow-2xl text-[#ffffff]">
            Senior
          </h1>
          <p className="text-lg md:text-xl max-w-2xl text-white/90 leading-relaxed font-medium">
            Empowering future leaders with academic excellence and professional skill acquisition for global competitiveness.
          </p>
        </div>
      </section>

      {/* Overview Section */}
      <section className="py-24 w-[90%] mx-auto">
        <div className="flex flex-col lg:flex-row gap-20 items-center">
          <div className="flex-1 space-y-8">
            <div className="space-y-4">
              <p className="text-[#0096ff] text-xs font-black uppercase tracking-[0.3em]">Preparing for Post-Secondary</p>
              <h2 className="text-4xl md:text-5xl font-black text-[#001011] font-[var(--worksans-font)] leading-tight">
                Global Leadership Stage
              </h2>
            </div>
            <p className="text-gray-600 text-lg leading-relaxed">
              Our Senior Secondary School (SSS 1-3) provides a world-class education designed 
              to prepare students for top-tier universities and future leadership roles.
            </p>
            <p className="text-gray-600 text-lg leading-relaxed">
              We offer specialized pathways in Science, Commercial, and Art disciplines, 
              ensuring every student can excel in their chosen field while maintaining the high 
              standards of our academic community.
            </p>
          </div>

          <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
            {[
              { title: "University Prep", desc: "Coaching for IGCSE, WAEC, JAMB", icon: <FaGraduationCap className="text-blue-600" />, overlayText: "Intensive preparation and mock exams to ensure outstanding scores in national and international examinations." },
              { title: "Career Placement", desc: "Guiding the future workforce", icon: <FaUserTie className="text-slate-600" />, overlayText: "Dedicated counseling to help students discover their passions and align them with real-world career paths." },
              { title: "Innovation & IT", desc: "Mastering complex digital logic", icon: <FaNetworkWired className="text-indigo-600" />, overlayText: "Advanced computer science principles, programming, and understanding of modern digital ecosystems." },
              { title: "Social Impact", desc: "Building local/global leaders", icon: <FaLightbulb className="text-yellow-500" />, overlayText: "Fostering leadership through community service, innovative projects, and global awareness programs." }
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
          <div className="mb-16 text-center lg:text-left">
            <p className="text-[#cc5500] text-xs font-black uppercase tracking-[0.3em] mb-4">Academic Streams</p>
            <h2 className="text-4xl md:text-5xl font-black text-[#001011] font-[var(--worksans-font)] leading-tight">
              Specialized Pathways
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

export default SeniorSecondaryPage;
