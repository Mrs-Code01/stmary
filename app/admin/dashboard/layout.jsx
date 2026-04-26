"use client";

import React, { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import Link from "next/link";
import {
  LayoutDashboard,
  Image as GalleryIcon,
  FileText,
  LogOut,
  Menu,
  BookOpen
} from "lucide-react";

export default function AdminDashboardLayout({ children }) {
  const [user, setUser] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      router.push("/admin");
      return;
    }
    setUser(session.user);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/admin");
  };

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  return (
    <div className="flex bg-[#f8fafc] font-[var(--inter-font)] text-slate-900">

      {/* Mobile Sidebar Overlay */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 bg-slate-900/50 z-40 md:hidden backdrop-blur-sm"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`w-64 bg-[#0f172a] text-slate-300 flex flex-col fixed md:sticky top-0 h-screen overflow-y-auto z-50 transition-transform duration-300 ${mobileMenuOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        }`}>
        <div className="p-6">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-3 mb-6 justify-center">
              <img
                src="/images/logo.png"
                alt="St Mary Logo"
                className="w-25 h-25 object-contain transition-transform duration-300"
              />
            </div>
            <div>
              <h1 className="text-xs font-bold text-white tracking-wider">ADMIN DASHBOARD</h1>
            </div>
          </div>
        </div>

        <nav className="mt-4 flex-1 px-3">
          <p className="px-4 text-[10px] font-semibold text-slate-500 mb-2 uppercase tracking-widest">Menu</p>
          <div className="space-y-1">
            <Link
              href="/admin/dashboard"
              className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-xl transition-colors ${pathname === "/admin/dashboard"
                ? "bg-blue-600/10 text-blue-400 border-r-4 border-blue-600"
                : "hover:bg-slate-800"
                }`}
            >
              <LayoutDashboard size={18} />
              Dashboard
            </Link>
            <Link
              href="/admin/dashboard/gallery"
              className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-xl transition-colors ${pathname.startsWith("/admin/dashboard/gallery")
                ? "bg-blue-600/10 text-blue-400 border-r-4 border-blue-600"
                : "hover:bg-slate-800"
                }`}
            >
              <GalleryIcon size={18} />
              Gallery
            </Link>
            <Link
              href="/admin/dashboard/lesson-notes"
              className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-xl transition-colors ${pathname.startsWith("/admin/dashboard/lesson-notes")
                ? "bg-blue-600/10 text-blue-400 border-r-4 border-blue-600"
                : "hover:bg-slate-800"
                }`}
            >
              <FileText size={18} />
              Lesson Notes
            </Link>
            <Link
              href="/admin/dashboard/subjects"
              className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-xl transition-colors ${pathname.startsWith("/admin/dashboard/subjects")
                ? "bg-blue-600/10 text-blue-400 border-r-4 border-blue-600"
                : "hover:bg-slate-800"
                }`}
            >
              <BookOpen size={18} />
              Subjects
            </Link>
          </div>
        </nav>

        <div className="p-6">
          <button onClick={handleLogout} className="flex items-center w-full gap-3 text-red-400 text-sm font-medium hover:text-red-300 transition-colors">
            <LogOut size={18} />
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-h-screen min-w-0">
        {/* Top Header */}
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 md:px-8 sticky top-0 z-30 shadow-sm">
          <div className="flex items-center gap-4">
            <Menu
              size={24}
              className="text-slate-600 cursor-pointer md:hidden hover:text-blue-600 transition-colors"
              onClick={() => setMobileMenuOpen(true)}
            />
          </div>
          <div className="flex items-center gap-6">
            {/* <Link href="/" className="text-[11px] font-bold text-blue-500 hover:text-blue-600 uppercase tracking-widest hidden sm:block">
              &larr; Back to Website
            </Link> */}
            <span className="text-sm text-slate-500 font-medium hidden sm:block">
              {user ? user.email : "Loading..."}
            </span>
            <button onClick={handleLogout} className="md:hidden text-red-500 hover:text-red-600 text-[11px] uppercase font-bold tracking-widest">
              Logout
            </button>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 flex flex-col min-h-0">
          {children}
        </main>
      </div>
    </div>
  );
}
