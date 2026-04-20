import React from "react";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full bg-[#0B1528] text-white py-12 md:py-20">
      <div className="w-[90%] mx-auto max-w-[1400px]">
        {/* Main Footer Grid: Flex row on desktop, Col on mobile */}
        <div className="flex flex-col lg:flex-row justify-between gap-12 lg:gap-8 mb-16">
          {/* Brand & Social Section */}
          <div className="flex flex-col items-start gap-6 max-w-sm">
            <div className="flex items-center gap-3">
                <img src="/images/logo.png" alt="St Mary Logo" className="w-16 h-16 object-contain" />
            </div>

            <p className="text-gray-400 text-[15px] leading-relaxed pr-4">
              Empowering the next generation of Nigerian leaders and global
              citizens through academic excellence and character development.
            </p>

            <div className="flex items-center gap-4 pt-2">
              <a
                href="#"
                className="w-10 h-10 border border-gray-700 rounded-sm flex items-center justify-center hover:bg-white hover:text-[#0B1528] transition-all"
              >
                <span className="text-xs uppercase font-bold">f</span>
              </a>
              <a
                href="#"
                className="w-10 h-10 border border-gray-700 rounded-sm flex items-center justify-center hover:bg-white hover:text-[#0B1528] transition-all"
              >
                <span className="text-xs uppercase font-bold">in</span>
              </a>
            </div>
          </div>

          {/* Navigation Columns Wrapper */}
          <div className="flex flex-wrap md:flex-row justify-between flex-1 gap-10 lg:pl-16">
            {/* Explore Column */}
            <div className="flex flex-col gap-5 min-w-[120px]">
              <h4 className="text-[15px] font-bold text-white/50 mb-2">
                Explore
              </h4>
              <ul className="flex flex-col gap-4 text-[13px] font-medium">
                <li>
                  <a href="#" className="hover:text-blue-400 transition-colors">
                    Home
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-blue-400 transition-colors">
                    About
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-blue-400 transition-colors">
                    News & Events
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-blue-400 transition-colors">
                    Alumni
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-blue-400 transition-colors">
                    Contact Us
                  </a>
                </li>
              </ul>
            </div>

            {/* Academics Column */}
            <div className="flex flex-col gap-5 min-w-[120px]">
              <h4 className="text-[15px] font-bold text-white/50 mb-2">
                Academics
              </h4>
              <ul className="flex flex-col gap-4 text-[13px] font-medium">
                <li>
                  <a href="#" className="hover:text-blue-400 transition-colors">
                    Early Years
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-blue-400 transition-colors">
                    Primary School
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-blue-400 transition-colors">
                    Secondary
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-blue-400 transition-colors">
                    Curriculum
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-blue-400 transition-colors">
                    Admission
                  </a>
                </li>
              </ul>
            </div>

            {/* Contact Column */}
            <div className="flex flex-col gap-5 min-w-[200px]">
              <h4 className="text-[15px] font-bold text-white/50 mb-2">
                Visit Campus
              </h4>
              <ul className="flex flex-col gap-6 text-[13px] font-medium">
                <li className="flex items-start gap-3">
                  <span className="text-gray-500 mt-1">📍</span>
                  <p className="text-gray-300 leading-snug">
                    20, Gana Street, Maitama,
                    <br /> Abuja, Nigeria
                  </p>
                </li>
                <li className="flex items-center gap-3">
                  <span className="text-gray-500">📞</span>
                  <a
                    href="tel:+2349026361135"
                    className="hover:text-blue-400 transition-colors"
                  >
                    +2349026 361135
                  </a>
                </li>
                <li className="flex items-center gap-3">
                  <span className="text-gray-500">✉️</span>
                  <a
                    href="mailto:info@smec.edu.ng"
                    className="hover:text-blue-400 transition-colors"
                  >
                    info@smec.edu.ng
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-[10px] md:text-xs font-bold tracking-widest text-gray-500 uppercase order-2 md:order-1">
            © {currentYear} ST MARY EDUCATIONAL CENTER.
          </p>

          <div className="flex items-center gap-8 order-1 md:order-2">
            <a
              href="#"
              className="text-[10px] md:text-xs font-bold tracking-widest uppercase hover:text-white transition-colors text-gray-500"
            >
              Privacy Policy
            </a>
            <a
              href="#"
              className="text-[10px] md:text-xs font-bold tracking-widest uppercase hover:text-white transition-colors text-gray-500"
            >
              Terms of Use
            </a>
            <a
              href="#"
              className="text-[10px] md:text-xs font-bold tracking-widest uppercase text-red-600 hover:text-red-500 transition-colors"
            >
              Portal Login
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
