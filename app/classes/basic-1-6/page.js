import React from "react";
import { FaLaptopCode, FaLanguage, FaGlobeAfrica, FaFlask, FaPalette, FaHistory, FaSquareRootAlt } from "react-icons/fa";

const BasicPage = () => {
  const focusAreas = [
    {
      id: "01",
      title: "Core Literacy",
      desc: "Developing strong reading, writing, and communication skills through a balanced literacy approach.",
      icon: <FaLanguage />,
      color: "from-blue-600 to-blue-400"
    },
    {
      id: "02",
      title: "Mathematical Logic",
      desc: "Fostering analytical thinking and problem-solving through advanced numeracy and logic exercises.",
      icon: <FaSquareRootAlt />,
      color: "from-[#cc5500] to-[#ff8c00]"
    },
    {
      id: "03",
      title: "Scientific Inquiry",
      desc: "Encouraging curiosity about the natural world through hands-on experiments and observation.",
      icon: <FaFlask />,
      color: "from-green-600 to-emerald-400"
    }
  ];

  return (
    <main className="min-h-screen bg-white font-[var(--inter-font)] relative overflow-x-hidden">
      {/* Hero Section */}
      <section className="relative h-[70vh] flex items-center overflow-hidden">
        <div className="absolute inset-0">
          <img 
            src="/images/two.jpg" 
            alt="Primary Education" 
            className="w-full h-full object-cover brightness-[0.55] scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#001011] via-[#001011]/50 to-transparent"></div>
        </div>
        
        <div className="mt-30 relative w-[90%] mx-auto z-10 text-white">
          <div className="inline-flex items-center gap-3 py-1.5 px-4 rounded-full bg-[#cc5500] text-[10px] font-black uppercase tracking-[0.2em] mb-6 shadow-lg shadow-orange-500/20 text-[#ffffff]">
            Primary Level
          </div>
          <h1 className="text-5xl md:text-7xl font-black font-[var(--worksans-font)] mb-6 drop-shadow-2xl text-[#ffffff]">
            Basic 1 - 6
          </h1>
          <p className="text-lg md:text-xl max-w-2xl text-white/90 leading-relaxed font-medium">
            Building critical thinkers through a rich blend of Nigerian and British curricula, focusing on holistic academic excellence.
          </p>
        </div>
      </section>

      {/* Overview Section */}
      <section className="py-24 w-[90%] mx-auto">
        <div className="flex flex-col lg:flex-row gap-20 items-center">
          <div className="flex-1 space-y-8">
            <div className="space-y-4">
              <p className="text-[#0096ff] text-xs font-black uppercase tracking-[0.3em]">Foundation for Excellence</p>
              <h2 className="text-4xl md:text-5xl font-black text-[#001011] font-[var(--worksans-font)] leading-tight">
                Primary Education Stage
              </h2>
            </div>
            <p className="text-gray-600 text-lg leading-relaxed">
              Our Basic 1-6 curriculum is designed to challenge students to think deeply, 
              question continuously, and develop a genuine passion for lifelong learning. 
              We offer a balanced academic program that prepares them for the rigors of secondary education.
            </p>
            <p className="text-gray-600 text-lg leading-relaxed">
              At this stage, we emphasize building core competencies in literacy, numeracy, 
              and the sciences, while integrating modern technology and citizenship education 
              into their daily learning experiences.
            </p>
          </div>

          <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
            {[
              { title: "Digital Literacy", desc: "Equipping kids for the future", icon: <FaLaptopCode className="text-blue-500" /> },
              { title: "Civic Awareness", desc: "Building responsible citizens", icon: <FaGlobeAfrica className="text-green-500" /> },
              { title: "Creative Arts", desc: "Expressing unique talents", icon: <FaPalette className="text-orange-500" /> },
              { title: "History & Culture", desc: "Understanding our heritage", icon: <FaHistory className="text-purple-500" /> }
            ].map((card, i) => (
              <div key={i} className="p-8 rounded-[2rem] bg-gray-50 border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-500 hover:-translate-y-1">
                <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center text-xl shadow-sm mb-6">
                  {card.icon}
                </div>
                <h4 className="text-[#001011] font-black text-lg mb-2 font-[var(--worksans-font)]">{card.title}</h4>
                <p className="text-gray-500 text-sm">{card.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Key Focus Areas */}
      <section className="py-24 bg-gray-50/50">
        <div className="w-[90%] mx-auto">
          <div className="mb-16 text-center lg:text-left">
            <p className="text-[#cc5500] text-xs font-black uppercase tracking-[0.3em] mb-4">Curriculum Pillars</p>
            <h2 className="text-4xl md:text-5xl font-black text-[#001011] font-[var(--worksans-font)] leading-tight">
              Academic Focus Areas
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

export default BasicPage;
