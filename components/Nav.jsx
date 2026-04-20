"use client";

import { useState } from "react";
import { HiMenu, HiX, HiChevronDown } from "react-icons/hi";
import Link from "next/link";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(null);

  const navLinks = [
    { name: "About Us", href: "/about" },
    {
      name: "Classes",
      href: "#",
      submenu: [
        { name: "Nursery", href: "/classes/nursery" },
        { name: "Basic 1-6", href: "/classes/basic-1-6" },
        { name: "Junior Secondary", href: "/classes/junior-secondary" },
        { name: "Senior Secondary", href: "/classes/senior-secondary" },
      ],
    },
    { name: "Tech Wizard", href: "/tech-wizard" },
  ];

  const toggleDropdown = (name) => {
    setOpenDropdown(openDropdown === name ? null : name);
  };

  return (
    <nav className="fixed top-0 left-0 right-0 w-full bg-white/85 backdrop-blur-2xl shadow-[0_8px_32px_rgba(0,0,0,0.08)] py-[15px] z-50 border-b border-white border-opacity-50">
      <div className="w-[90%] mx-auto flex justify-between items-center py-4">
        {/* Logo Section */}
        <Link href="/">
        <div className="flex items-center gap-4 group cursor-pointer">
          <img src="/images/logo.png" alt="St Mary Logo" className="w-25 h-25 object-contain transform transition-transform duration-300 group-hover:scale-110 group-hover:-rotate-6" />
          <div className="leading-[.9]">
            <h1 className="font-black text-[#001011] text-[1.5rem] tracking-tight leading-none group-hover:text-[#cc5500] transition-colors duration-300 font-[var(--worksans-font)]">
              St. Mary
            </h1>
            <p className="text-[1.3rem] text-[#000000] font-black mt-1 font-[var(--inter-font)]">
              Children School
            </p>
          </div>
        </div>
</Link>
        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-6 lg:gap-8">
          {navLinks.map((link) => (
            <div key={link.name} className="relative group">
              {link.submenu ? (
                <button
                  className="relative text-[#334155] hover:text-[#cc5500] font-bold transition-all text-[13px] px-2 py-1 flex items-center gap-1.5 group/link"
                  onClick={() => toggleDropdown(link.name)}
                >
                  {link.name}
                  <HiChevronDown
                    size={16}
                    className="transition-transform duration-300 group-hover/link:-rotate-180"
                  />
                </button>
              ) : (
                <Link
                  href={link.href}
                  className="relative text-[#334155] hover:text-[#cc5500] font-bold transition-all text-[13px] px-2 py-1 flex items-center gap-1.5 group/link"
                >
                  {link.name}
                </Link>
              )}

              {/* Dropdown Menu */}
              {link.submenu && (
                <div className="absolute left-0 mt-0 w-[170px] bg-white rounded-xl shadow-[0_10px_30px_rgba(0,0,0,0.1)] opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 py-3 border border-gray-100 top-full">
                  {link.submenu.map((item) => (
                    <a
                      key={item.name}
                      href={item.href}
                      className="block px-4 py-2.5 text-[#334155] hover:text-[#cc5500] hover:bg-orange-50 transition-all text-[13px] font-medium first:rounded-t-xl last:rounded-b-xl"
                    >
                      {item.name}
                    </a>
                  ))}
                </div>
              )}
            </div>
          ))}
          <Link
            href="/smcs/student"
            className="relative text-[#334155] hover:text-[#cc5500] font-bold transition-all text-[13px] px-4 py-2 flex items-center gap-1.5 group/link border border-gray-200 rounded-full hover:border-[#cc5500] hover:bg-orange-50"
          >
            Student Portal
          </Link>
          <Link
            href="/staff"
            className="relative text-[#334155] hover:text-[#0096ff] font-bold transition-all text-[13px] px-4 py-2 flex items-center gap-1.5 group/link border border-gray-200 rounded-full hover:border-[#0096ff] hover:bg-blue-50"
          >
            Staff Portal
          </Link>
          <Link
            href="/apply"
            className="bg-[#0096ff] text-white font-black transition-all text-[13px] px-5 py-2 rounded-full hover:shadow-lg hover:shadow-blue-500/20 active:scale-95"
          >
            Apply Now
          </Link>
        </div>

        {/* Mobile Toggle */}
        <div
          className="md:hidden text-[#334155] cursor-pointer p-2 hover:bg-gray-100 rounded-lg transition-all"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <HiX size={28} /> : <HiMenu size={28} />}
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden p-6 flex flex-col gap-4 bg-white/95 backdrop-blur-3xl shadow-2xl border-t border-gray-100 w-full z-40">
          {navLinks.map((link) => (
            <div key={link.name}>
              {link.submenu ? (
                <button
                  onClick={() => toggleDropdown(link.name)}
                  className="w-full text-left text-xl font-bold text-[#000000] py-3 px-4 rounded-xl hover:bg-orange-50 hover:text-[#cc5500] transition-all flex items-center justify-between"
                >
                  {link.name}
                  <HiChevronDown
                    size={20}
                    className={`transition-transform duration-300 ${
                      openDropdown === link.name ? "-rotate-180" : ""
                    }`}
                  />
                </button>
              ) : (
                <Link
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className="block w-full text-left text-xl font-bold text-[#000000] py-3 px-4 rounded-xl hover:bg-orange-50 hover:text-[#cc5500] transition-all"
                >
                  {link.name}
                </Link>
              )}

              {/* Mobile Dropdown */}
              {link.submenu && openDropdown === link.name && (
                <div className="pl-4 mt-2 space-y-2 border-l-2 border-[#cc5500]/30">
                  {link.submenu.map((item) => (
                    <a
                      key={item.name}
                      href={item.href}
                      className="block py-2 text-[#000000] hover:text-[#cc5500] transition-all text-[12px] font-bold"
                    >
                      {item.name}
                    </a>
                  ))}
                </div>
              )}
            </div>
          ))}
          <Link
            href="/smcs/student"
            onClick={() => setIsOpen(false)}
            className="block w-full text-left text-xl font-bold text-[#0096ff] py-3 px-4 rounded-xl hover:bg-blue-50 transition-all"
          >
            🎓 Student Portal
          </Link>
          <Link
            href="/staff"
            onClick={() => setIsOpen(false)}
            className="block w-full text-left text-xl font-bold text-[#334155] py-3 px-4 rounded-xl hover:bg-gray-50 transition-all"
          >
            🏫 Staff Portal
          </Link>
          <Link
            href="/apply"
            onClick={() => setIsOpen(false)}
            className="block w-full text-center text-xl font-bold bg-[#0096ff] text-white py-4 mt-2 rounded-xl"
          >
            Apply Now
          </Link>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
