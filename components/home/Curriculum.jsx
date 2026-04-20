import React from "react";

const AcademicStructure = () => {
  const milestones = [
    {
      id: "01",
      age: "AGES 18 MONTHS - 5 YEARS",
      title: "Nursery",
      description:
        "A nurturing sanctuary where curiosity is sparked and the foundation for lifelong learning is laid.",
      image: "images/one.jpg",
      href: "/classes/nursery",
    },
    {
      id: "02",
      age: "YEARS 1 - 6",
      title: "Basic 1-6",
      description:
        "Building critical thinkers through a rich blend of Nigerian and British curricula.",
      image: "images/two.jpg",
      href: "/classes/basic-1-6",
    },
    {
      id: "03",
      age: "JSS 1 - JSS 3",
      title: "Junior Secondary",
      description:
        "Bridging the gap to advanced learning with a focus on core academic mastery and personal growth.",
      image: "images/three.jpg",
      href: "/classes/junior-secondary",
    },
    {
      id: "04",
      age: "SSS 1 - SSS 3",
      title: "Senior Secondary",
      description:
        "Empowering future leaders with academic excellence and professional skill acquisition.",
      image: "images/four.jpg",
      href: "/classes/senior-secondary",
    },
  ];

  return (
    <section className="w-full py-20 md:py-32 bg-white">
      {/* Container: 
          - w-[92%] for mobile (slightly more breathing room)
          - md:w-[90%] for desktop as requested
      */}
      <div className="w-[92%] md:w-[90%] mx-auto max-w-[1400px]">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 border-b border-slate-100 pb-10">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-3">
               <span className="w-8 h-[2px] bg-[#cc5500]"></span>
               <p className="text-[#cc5500] text-[10px] md:text-[12px] font-black tracking-[0.3em] uppercase font-[var(--inter-font)]">
                Academic Excellence
              </p>
            </div>
            <h2 className="text-[#001011] text-3xl md:text-5xl font-black tracking-tight font-[var(--worksans-font)]">
              A Curriculum for{" "}
              <span className="text-[#0096ff] italic">Every Milestone</span>
            </h2>
          </div>
          <a
            href="#"
            className="group text-[#001011] font-black text-[10px] md:text-xs tracking-[0.3em] mt-8 md:mt-0 flex items-center gap-3 uppercase font-[var(--inter-font)]"
          >
            Explore FULL CURRICULUM
            <span className="w-10 h-10 rounded-full border border-slate-200 flex items-center justify-center transition-all group-hover:bg-[#001011] group-hover:text-white group-hover:border-[#001011]">
              <span className="transition-transform group-hover:translate-x-1">→</span>
            </span>
          </a>
        </div>

        {/* Grid Section */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 md:gap-12">
          {milestones.map((item) => (
            <a key={item.id} href={item.href} className="group cursor-pointer flex flex-col relative">
              {/* Image Container with Badge */}
              <div className="relative aspect-[4/3] overflow-hidden mb-8 rounded-[2.5rem] bg-slate-100 shadow-[0_20px_50px_rgba(0,0,0,0.05)] transition-all duration-500 group-hover:shadow-[0_30px_60px_rgba(0,150,255,0.15)] group-hover:-translate-y-2">
                <div className="absolute top-6 left-6 z-20 bg-white/90 backdrop-blur-md w-12 h-12 rounded-2xl flex items-center justify-center text-sm font-black text-[#001011] shadow-lg border border-white/50">
                  {item.id}
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-[#001011]/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10"></div>
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full object-cover transition-transform duration-[1.5s] ease-out group-hover:scale-110"
                />
              </div>

              {/* Content Section */}
              <div className="flex flex-col flex-grow px-2">
                <p className="text-[#cc5500] text-[11px] md:text-[9px] font-black tracking-[0.2em] uppercase mb-3 font-[var(--inter-font)]">
                  {item.age}
                </p>
                <h3 className="text-[#001011] text-2xl md:text-3xl font-black mb-4 font-[var(--worksans-font)] group-hover:text-[#0096ff] transition-colors">
                  {item.title}
                </h3>
                <p className="text-slate-500 text-sm md:text-base leading-relaxed mb-6 font-[var(--inter-font)] font-medium">
                  {item.description}
                </p>

                {/* Footer Link */}
                <div className="mt-auto pt-6 border-t border-slate-50">
                  <div
                    className="text-slate-400 text-[10px] font-black tracking-[0.2em] uppercase flex items-center gap-3 transition-all group-hover:text-[#001011]"
                  >
                    LEARN MORE <span className="text-xl transition-transform group-hover:translate-x-2">→</span>
                  </div>
                </div>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AcademicStructure;
