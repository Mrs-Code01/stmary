import localFont from "next/font/local";
import "./globals.css";
import ConditionalLayout from "@/components/ConditionalLayout";

const worksans = localFont({
  src: "./font/worksans-bold.ttf",
  variable: "--worksans-font", // Matches globals.css
  display: "swap",
});

const inter = localFont({
  src: "./font/inter-light-BETA.otf",
  variable: "--inter-font", // Matches globals.css
  display: "swap",
});

export const metadata = {
  title: "St Mary Educational Center",
  description: "Education",
  // icons: {
  //   icon: "/logo.png", // Change this to your actual PNG filename
  //   apple: "/logo.png", // Optional: for iPhone home screens
  // },
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
