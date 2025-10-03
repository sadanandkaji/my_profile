"use client";
import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import Image from "next/image";

export default function Home() {
  const [active, setActive] = useState("home");
  const luffyRef = useRef<HTMLImageElement>(null);

  const GIFS = {
    right: "/luffyreal/luffy_runrightreal.gif",
    left: "/luffyreal/luffy_runleftreal.gif",
    up: "/luffyreal/luffy_runbackreal.gif",
    down: "/luffyreal/luffy_runstraight.gif",
    still: "/luffyreal/still.png",
  };

  useEffect(() => {
    const luffy = luffyRef.current;
    if (!luffy) return;

    let animFrame: number;
    let currentDirection: keyof typeof GIFS = "still";

    const showDirection = (dir: keyof typeof GIFS) => {
      if (!luffy) return;
      if (!luffy.src.includes(GIFS[dir])) luffy.src = GIFS[dir];
      currentDirection = dir;
    };

    const moveLuffy = (targetX: number, targetY: number) => {
      cancelAnimationFrame(animFrame);

      const step = () => {
        if (!luffy) return;

        const rect = luffy.getBoundingClientRect();
        const currentX = rect.left + rect.width / 2;
        const currentY = rect.top + rect.height / 2;

        const dx = targetX - currentX;
        const dy = targetY - currentY;
        const distance = Math.sqrt(dx * dx + dy * dy);

        const speed = 4;

        // Snap to target if next step overshoots
        if (distance <= speed) {
          luffy.style.left = `${targetX - rect.width / 2}px`;
          luffy.style.top = `${targetY - rect.height / 2}px`;
          showDirection("still");
          return;
        }

        // Determine movement direction
        let direction: keyof typeof GIFS;
        if (Math.abs(dx) > Math.abs(dy)) direction = dx > 0 ? "right" : "left";
        else direction = dy > 0 ? "down" : "up";

        if (currentDirection !== direction) showDirection(direction);

        // Move proportionally to maintain straight line
        const nx = (dx / distance) * speed;
        const ny = (dy / distance) * speed;

        luffy.style.left = `${currentX + nx - rect.width / 2}px`;
        luffy.style.top = `${currentY + ny - rect.height / 2}px`;

        animFrame = requestAnimationFrame(step);
      };

      step();
    };

    const handleClick = (e: MouseEvent | TouchEvent) => {
      let x: number, y: number;
      if (e instanceof TouchEvent) {
        const touch = e.touches[0];
        x = touch.clientX;
        y = touch.clientY;
      } else {
        x = e.clientX;
        y = e.clientY;
      }
      moveLuffy(x, y);
    };

    document.addEventListener("click", handleClick);
    document.addEventListener("touchstart", handleClick);

    return () => {
      document.removeEventListener("click", handleClick);
      document.removeEventListener("touchstart", handleClick);
      cancelAnimationFrame(animFrame);
    };
  }, []);

  return (
    <div
      className="bg-black min-h-screen text-white relative overflow-x-hidden"
      style={{
        backgroundImage: `
          linear-gradient(to right , rgba(224, 231, 232, 0.1) 1.5px, transparent 1px),
          linear-gradient(to bottom, rgba(228, 236, 237, 0.1) 1.5px, transparent 1px)
        `,
        backgroundSize: "20px 20px",
        backgroundRepeat: "repeat",
        backgroundAttachment: "fixed",
      }}
    >
      {/* Luffy Layer */}
      <div className="fixed top-0 left-0 w-full h-full pointer-events-none z-[999]">
        <img
          ref={luffyRef}
          src={GIFS.still}
          alt="Luffy"
          className="w-16 h-auto absolute left-0 top-0"
          style={{ transition: "none" }}
        />
      </div>

      {/* Navbar */}
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
                    if (item === "home") window.scrollTo({ top: 0, behavior: "smooth" });
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
        {/* Intro */}
        <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
          <div className="text-2xl leading-relaxed text-center md:text-left flex-1">
            Hi, this is{" "}
            <span className="text-green-400 font-semibold">Sadanand</span>. I am a
            developer and a BCA graduate at{" "}
            <span className="text-purple-400 font-medium">
              Acharya Institute of Graduate Studies
            </span>
            .
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

        {/* Projects */}
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

        {/* Blogs */}
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
