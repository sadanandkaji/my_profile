import type { Metadata } from "next";
import { Fraunces, Inter, JetBrains_Mono } from "next/font/google";
import "./global.css";
import Nav from "@/components/Nav";
import Background from "@/components/Background";
import PageTransition from "@/components/PageTransition";
import LuffyTracker from "@/components/LuffyTracker";
import CoordinateHUD from "@/components/CoordinateHUD";

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
});

export const metadata: Metadata = {
  title: "Sadanand Kaji — Developer",
  description:
    "Sadanand Kaji — MCA (RVITM), full-stack developer and freelancer. Building an AI-based CAD application. Two freelance projects delivered, multiple hackathon wins.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${fraunces.variable} ${inter.variable} ${jetbrainsMono.variable} antialiased`}
        style={{ fontFamily: "var(--font-inter)", background: "var(--bg)", color: "var(--ink)" }}
      >
        <Background />
        <Nav />
        <main className="relative z-10">
          <PageTransition>{children}</PageTransition>
        </main>
        <CoordinateHUD />
        <LuffyTracker />
      </body>
    </html>
  );
}