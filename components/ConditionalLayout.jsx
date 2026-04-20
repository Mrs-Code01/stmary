"use client";

import { usePathname } from "next/navigation";
import Nav from "@/components/Nav";
import Interface from "@/components/application/Interface";
import Footer from "@/components/Footer";

export default function ConditionalLayout({ children }) {
  const pathname = usePathname();
  const isPortal =
    pathname.startsWith("/dashboard") ||
    pathname.startsWith("/smcs") ||
    pathname.startsWith("/staff");

  if (isPortal) {
    return <>{children}</>;
  }

  return (
    <>
      <Nav />
      {children}
      <Interface />
      <Footer />
    </>
  );
}
