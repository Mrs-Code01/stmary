import React from "react";
import { FaHandshake, FaShieldAlt, FaAward, FaCheckCircle, FaCalendarAlt, FaLeaf } from "react-icons/fa";

const AboutUs = () => {
  return (
    <main className="min-h-screen bg-[#fdfdfc] font-[var(--inter-font)] text-[#001011] pt-32 pb-24 px-6 md:px-12 lg:px-0 overflow-hidden relative">
      {/* Dynamic ambient glows */}
      <div className="absolute top-[-5%] left-[-5%] w-[40rem] h-[40rem] bg-[#0096ff]/5 rounded-full mix-blend-screen filter blur-[150px] pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-5%] w-[45rem] h-[45rem] bg-[#cc5500]/5 rounded-full mix-blend-screen filter blur-[180px] pointer-events-none"></div>

      {/* Page Title Section */}
      <div className="relative mb-24 text-center w-[90%] mx-auto">
        <div className="inline-flex items-center gap-3 py-2 px-5 rounded-full bg-white/50 backdrop-blur-xl border border-gray-100 mb-6 mt-20 shadow-sm">
          <span className="w-2.5 h-2.5 rounded-full bg-[#cc5500] animate-pulse"></span>
          <span className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-500">Founded September 2019</span>
        </div>
        <h1 className="text-5xl md:text-7xl font-black text-[#001011] font-[var(--worksans-font)] tracking-tight uppercase leading-none">
          About <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#cc5500] to-[#ff8c00]">Us</span>
        </h1>
        <div className="w-24 h-1.5 bg-gradient-to-r from-[#cc5500] to-[#0096ff] mx-auto mt-8 rounded-full"></div>
      </div>

      <div className="w-[90%] mx-auto space-y-40">
        {/* Section 1: Who We Are - Updated with Founding Date & Accreditation */}
        <section className="flex flex-col lg:flex-row items-center gap-20 relative">
          <div className="flex-1 order-2 lg:order-1">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-orange-50 border border-orange-100 mb-8">
              <span className="w-2 h-2 rounded-full bg-[#cc5500]"></span>
              <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#cc5500]">Our Identity</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-black text-[#001011] mb-8 font-[var(--worksans-font)] leading-tight tracking-tight">
              Established Excellence <br /><span className="text-[#cc5500]">Since 2019</span>
            </h2>
            <div className="relative">
              <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-gradient-to-b from-[#cc5500] to-transparent rounded-full"></div>
              <div className="pl-10 space-y-6">
                <p className="leading-relaxed text-xl text-gray-600 text-justify md:text-left">
                  St Mary Children School is a community of learners committed to a challenging academic environment.
                  Founded in <strong>September 2019</strong>, we have quickly become a model of academic rigor.
                  We are a <strong>duly registered center</strong>, fully accredited and recognized by the <strong>State Ministry of Education</strong>.
                </p>
                <p className="leading-relaxed text-lg text-gray-500 italic">
                  Located in a serene environment, our campus affords a conducive, pollution-free atmosphere
                  essential for optimal teaching-learning encounters.
                </p>
              </div>
            </div>
          </div>
          <div className="flex-1 order-1 lg:order-2 group">
            <div className="relative">
              <div className="absolute -inset-6 bg-gradient-to-tr from-[#cc5500]/15 to-[#0096ff]/15 rounded-[3rem] blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
              <div className="relative z-10 overflow-hidden rounded-[2.5rem] shadow-2xl border-[12px] border-white ring-1 ring-gray-100">
                <img
                  src="/images/one.jpg"
                  alt="St Mary School Excellence"
                  className="w-full h-[500px] object-cover transform transition-transform duration-[2s] group-hover:scale-110"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Section 2: Our Mission - Updated with "Holistic" language */}
        <section className="flex flex-col lg:flex-row items-center gap-20">
          <div className="flex-1 group">
            <div className="relative">
              <div className="absolute -inset-6 bg-gradient-to-bl from-[#0096ff]/15 to-[#cc5500]/15 rounded-[3rem] blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
              <div className="relative z-10 overflow-hidden rounded-[2.5rem] shadow-2xl border-[12px] border-white ring-1 ring-gray-100">
                <img
                  src="/images/two.jpg"
                  alt="Our Purpose"
                  className="w-full h-[500px] object-cover transform transition-transform duration-[2s] group-hover:scale-110"
                />
              </div>
            </div>
          </div>
          <div className="flex-1">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 border border-blue-100 mb-8">
              <span className="w-2 h-2 rounded-full bg-[#0096ff]"></span>
              <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#0096ff]">Our Purpose</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-black text-[#001011] mb-8 font-[var(--worksans-font)] leading-tight tracking-tight">
              Education for <br /><span className="text-[#0096ff]">Fullness of Life</span>
            </h2>
            <div className="relative">
              <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-gradient-to-b from-[#0096ff] to-transparent rounded-full"></div>
              <p className="leading-relaxed text-xl text-gray-600 text-justify md:text-left pl-10 py-2">
                We believe education is more than just schooling; it is a dynamic process of change.
                Our mission is to turn out fully integrated, well-adjusted citizens by providing equitable
                access to essential life-skills and academic excellence for ALL children,
                regardless of background.
              </p>
            </div>
          </div>
        </section>

        {/* Section 3: Core Values / Fast Facts */}
        <section className="relative">
          <div className="text-center mb-20 relative">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-orange-50 border border-orange-100 mb-6">
              <span className="w-2 h-2 rounded-full bg-[#cc5500]"></span>
              <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#cc5500]">Institutional Pillars</span>
            </div>
            <h2 className="text-4xl md:text-6xl font-black text-[#001011] font-[var(--worksans-font)] tracking-tight leading-none">
              Why Choose <span className="text-[#cc5500]">St Mary?</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12 relative z-10">
            {[
              {
                tag: "Accredited",
                name: "Government Recognized",
                desc: "Fully registered and recognized by the State Ministry of Education as a center for academic excellence.",
                icon: <FaCheckCircle />,
                color: "from-[#cc5500] to-[#ff8c00]",
              },
              {
                tag: "2019",
                name: "Modern Legacy",
                desc: "Founded in September 2019, blending modern teaching techniques with seasoned educational values.",
                icon: <FaCalendarAlt />,
                color: "from-[#0096ff] to-[#00d2ff]",
              },
              {
                tag: "Safe",
                name: "Conducive Environment",
                desc: "A serene, pollution-free atmosphere designed for optimal health, safety, and focused learning.",
                icon: <FaLeaf />,
                color: "from-[#FFC107] to-[#FF9800]",
              }
            ].map((value, i) => (
              <div key={i} className="group relative">
                <div className={`absolute inset-0 bg-gradient-to-br ${value.color} opacity-0 group-hover:opacity-5 transition-opacity duration-500 rounded-[2.5rem]`}></div>
                <div className={`relative p-10 rounded-[2.5rem] bg-white border border-gray-100 shadow-[0_20px_50px_rgba(0,0,0,0.03)] transition-all duration-500 hover:shadow-[0_40px_80px_rgba(0,0,0,0.08)] hover:-translate-y-4 flex flex-col items-center text-center`}>

                  <div className={`w-20 h-20 rounded-3xl bg-gradient-to-br ${value.color} flex items-center justify-center text-white text-3xl shadow-lg mb-8 relative z-10 transform group-hover:rotate-6 transition-transform`}>
                    {value.icon}
                  </div>

                  <h3 className="text-2xl font-black text-[#001011] mb-4 font-[var(--worksans-font)] relative z-10">
                    {value.name}
                  </h3>

                  <p className="text-gray-500 text-base leading-relaxed relative z-10 font-medium font-[var(--inter-font)] px-2">
                    {value.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-20 max-w-4xl mx-auto">
            <div className="bg-[#001011] rounded-[3rem] p-10 md:p-16 text-center shadow-2xl relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-64 h-64 bg-[#cc5500]/20 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2"></div>

              <p className="text-white/80 text-xl md:text-2xl font-medium leading-relaxed italic relative z-10 mb-0 font-[var(--inter-font)]">
                "Our educational world is not just a preparation for life; it is life itself in all its fullness.
                We are poised to take pupils through an experience that shapes their social life, self-concept, and future."
              </p>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
};

export default AboutUs;