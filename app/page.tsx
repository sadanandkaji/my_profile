"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";

export default function Home() {
  const [active, setActive] = useState("home");

  return (
    <div className="bg-black min-h-screen text-white" style={{
    // backgroundImage:"radial-gradient(circle at 0.5px 0.5px ,rgba(6,182,212,0.2) 0.5px , transparent 0)",
    // backgroundSize:"8px 8px",
    // backgroundRepeat:"repeat",
      backgroundImage: `
      linear-gradient(to right , rgba(224, 231, 232, 0.1) 1.5px, transparent 1px),
      linear-gradient(to bottom, rgba(228, 236, 237, 0.1) 1.5px, transparent 1px)
    `,
    backgroundSize: '20px 20px',
    backgroundRepeat: 'repeat',
    backgroundAttachment:"fixed"
   }}>
      {/* Top Glassy Navbar */}
      <div className="fixed top-0 left-0 right-0 z-50 flex justify-center p-4">
        <div className="w-full max-w-5xl">
          <div className="flex justify-between items-center px-6 py-3 rounded-full bg-white/10 backdrop-blur-lg border border-white/20 shadow-xl">
            <div className="text-white italic text-2xl font-semibold">S.k</div>

            <div className="flex gap-8 text-md font-bold">
              {["home", "projects", "blogs"].map((item) => (
                <div
                  key={item}
                  role="button"
                  tabIndex={0}
                  className={`cursor-pointer select-none outline-none transition duration-200 ${
                    active === item
                      ? "border-b-2 border-green-400"
                      : "border-b-2 border-transparent"
                  }`}
                  onClick={() => {
                    setActive(item);

                    const section = document.getElementById(item);
                    section?.scrollIntoView({ behavior: "smooth" });

                    if (item === "home") {
                      window.scrollTo({ top: 0, behavior: "smooth" });
                    }
                  }}
                >
                  {item}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Page Content */}
      <div className="pt-32 px-6 max-w-5xl mx-auto">
        {/* Intro and image */}
        <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
          <div className="text-2xl leading-relaxed text-center md:text-left flex-1">
            Hi, this is{" "}
            <span className="text-green-400 font-semibold">Sadanand</span>. I
            am a developer and a BCA graduate at{" "}
            <span className="text-purple-400 font-medium">
              Acharya Institute of Graduate Studies
            </span>.
          </div>

          <div className="relative w-40 h-40 group cursor-pointer">
            <motion.img
              src="/myimage2.jpg"
              alt="Tilted Sadanand"
              className="absolute top-0 left-0 w-40 h-40 object-cover shadow-lg rounded-xl z-10 group-hover:z-30 transition-all duration-100"
              initial={{ rotate: 3, scale: 1 }}
              whileHover={{ scale: 1.05, rotate: 6 }}
              transition={{ duration: 0.1 }}
            />
            <motion.img
              src="/myimage.jpg"
              alt="Straight Sadanand"
              className="absolute top-0 left-0 w-40 h-40 object-cover shadow-lg rounded-xl z-30 group-hover:z-10 transition-all duration-100"
              initial={{ scale: 1 }}
              whileHover={{ scale: 0.98 }}
              transition={{ duration: 0.1 }}
            />
          </div>
        </div>

        {/* Project Section */}
        <div className="mt-12 w-full scroll-mt-28" id="projects">
          <h2 className="text-xl flex justify-center font-bold mb-4 text-green-400">Projects</h2>

          <a
            href="https://connect-art.vercel.app/"
            target="_blank"
            rel="noopener noreferrer"
            className="block bg-white/10 backdrop-blur-md p-4 rounded-xl shadow-md hover:shadow-xl transition duration-200 hover:scale-105"
          >
            <div className="flex flex-col md:flex-row items-center gap-4">
              <Image
                src="/Screenshot 2025-06-24 204511.png"
                alt="ConnectArt Screenshot"
                width={256}
                height={160}
                className="rounded-xl object-cover"
              />
              <div className="text-center md:text-left">
                <h3 className="text-white text-lg font-semibold">ConnectArt</h3>
                <p className="text-gray-300 text-sm mt-1">
                  Discover and connect with talented artists — singers, dancers, speakers, and DJs.
                </p>
                <p className="text-purple-400 mt-2 underline">connect-art.vercel.app</p>
              </div>
            </div>
          </a>
        </div>

        {/* Blogs Section */}
        <div
          className="scroll-mt-28 min-h-[60vh] pb-32 flex flex-col items-center justify-center"
          id="blogs"
        >
          <h2 className="text-xl font-bold mb-4 text-green-400">Blogs</h2>
          <p className="text-gray-400 text-lg">No blog yet!</p>
        </div>
      </div>
    </div>
  );
}
