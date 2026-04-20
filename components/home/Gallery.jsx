import React from "react";

const Gallery = () => {
  // Array for the gallery images
  // Replace these with your actual image paths from your public folder
  const galleryImages = [
    "/images/one.jpg",
    "/images/two.jpg",
    "/images/three.jpg",
    "/images/four.jpg",
    "/images/one.jpg",
    "/images/two.jpg",
    "/images/three.jpg",
    "/images/four.jpg",
  ];

  return (
    <section className="w-full py-20 md:py-32 bg-white overflow-hidden">
      {/* Container set to 90% width on desktop */}
      <div className="w-[90%] mx-auto max-w-[1400px]">
        {/* Header Content */}
        <div className="text-center mb-16 space-y-6">
          <div className="inline-flex items-center gap-3 justify-center w-full">
             <span className="w-10 h-[1px] bg-[#cc5500]"></span>
             <span className="text-[#cc5500] text-xs font-black uppercase tracking-[0.4em] font-[var(--inter-font)]">Our Campus</span>
             <span className="w-10 h-[1px] bg-[#cc5500]"></span>
          </div>
          <h2 className="text-[#001011] text-4xl md:text-6xl font-black tracking-tight font-[var(--worksans-font)]">
            Discover Our <span className="text-[#0096ff]">Excellence</span>
          </h2>
          <p className="text-slate-500 text-base md:text-xl max-w-3xl mx-auto leading-relaxed font-[var(--inter-font)] font-medium">
            St Mary Educational Center is a leading institution dedicated to
            fulfilling the true potential of each child through a supportive and
            inspiring environment.
          </p>
        </div>

        {/* Dynamic Masonry-like Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {galleryImages.map((src, index) => (
            <div
              key={index}
              className={`relative overflow-hidden group rounded-[2rem] bg-slate-100 shadow-[0_10px_30px_rgba(0,0,0,0.03)] transition-all duration-500 hover:shadow-[0_20px_50px_rgba(0,150,255,0.1)] ${
                index === 0 || index === 5 ? "md:col-span-2 md:row-span-2 aspect-square md:aspect-auto" : "aspect-square"
              }`}
            >
              <div className="absolute inset-0 bg-gradient-to-t from-[#001011]/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10"></div>
              <img
                src={src}
                alt={`Gallery image ${index + 1}`}
                className="w-full h-full object-cover transition-transform duration-[2s] ease-out group-hover:scale-110"
              />
              <div className="absolute bottom-6 left-6 z-20 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
                 <span className="text-white text-xs font-black uppercase tracking-widest bg-white/20 backdrop-blur-md px-4 py-2 rounded-full border border-white/30">
                    View
                 </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Gallery;
