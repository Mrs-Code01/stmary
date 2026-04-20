import Footer from "@/components/Footer";

export default function StaffClassLayout({ children }) {
  return (
    <div className="flex flex-col min-h-screen bg-[#000a18]">
      <div className="flex-1">
        {children}
      </div>
      <Footer />
    </div>
  );
}
