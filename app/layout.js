import localFont from "next/font/local";
import "./globals.css";
import ConditionalLayout from "@/components/ConditionalLayout";

const worksans = localFont({
  src: "./font/WorkSans-Bold.ttf",
  variable: "--worksans-font", // Matches globals.css
  display: "swap",
});

const inter = localFont({
  src: "./font/Inter-Light-BETA.otf",
  variable: "--inter-font",
  display: "swap",
});

export const metadata = {
  title: "St. Mary Children School",
  description: "Experience a world-class education designed to unlock potential, foster leadership, and inspire academic excellence in every child.",
  icons: {
    icon: "/icon.png",
    apple: "/icon.png",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${worksans.variable} ${inter.variable} antialiased`}>
        <ConditionalLayout>{children}</ConditionalLayout>
      </body>
    </html>
  );
}
