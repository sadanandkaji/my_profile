import type { Metadata } from "next";
import { Geist, Geist_Mono, Instrument_Serif } from "next/font/google";
import "./globals.css";
import { WorkbenchProvider } from "@/components/Workbench";
import Background from "@/components/Background";
import Rulers from "@/components/Rulers";
import Nav from "@/components/Nav";
import StatusBar from "@/components/StatusBar";
import Inspector from "@/components/Inspector";
import CommandPalette from "@/components/CommandPalette";
import Vim from "@/components/Vim";
import Snake from "@/components/Snake";
import { Reveal, SmoothScroll } from "@/components/Smooth";
import PageTransition from "@/components/PageTransition";

const geist = Geist({
  variable: "--font-geist",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const instrument = Instrument_Serif({
  variable: "--font-instrument",
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
});

export const metadata: Metadata = {
  title: "Sadanand Kaji — AI Agent Engineer · Design Engineer · System Architect · Full-Stack Developer",
  description:
    "Sadanand Kaji — AI agent engineer, design engineer, system architect and full-stack developer (MCA, RVITM). Building an AI-based CAD application. Freelance client work shipped, multiple hackathon wins.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geist.variable} ${geistMono.variable} ${instrument.variable} antialiased`}>
        <WorkbenchProvider>
          <Background />
          <Snake />
          <Rulers />
          <Nav />
          <main className="relative z-10 md:pl-5">
            <PageTransition>{children}</PageTransition>
          </main>
          <StatusBar />
          <Inspector />
          <CommandPalette />
          <Vim />
          <SmoothScroll />
          <Reveal />
        </WorkbenchProvider>
      </body>
    </html>
  );
}
