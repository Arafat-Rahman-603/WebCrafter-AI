"use client";

import React from "react";
import Navber from "@/componentes/Navber";
import { motion } from "motion/react";
import Image from "next/image";

export default function AboutPage() {
  return (
    <>
      <Navber />
      <div className="min-h-screen bg-[#0a0f1e] pt-12 pb-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        {/* Decorative Orbs */}
        <div className="absolute top-40 left-0 w-[400px] h-[400px] bg-violet-600/20 blur-[100px] rounded-full pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-blue-600/20 blur-[120px] rounded-full pointer-events-none" />
        
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="flex flex-col lg:flex-row items-center gap-16">
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7 }}
              className="flex-1 text-center lg:text-left"
            >
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white mb-6">
                Redefining How the <br className="hidden lg:block"/>
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-violet-400">
                  Web is Built
                </span>
              </h1>
              <p className="text-lg text-slate-300 leading-relaxed mb-6">
                {"At WebCrafter AI, we believe that creating a stunning online presence shouldn't require years of coding experience or massive budgets. We're on a mission to democratize website creation using the power of artificial intelligence."}
              </p>
              <p className="text-lg text-slate-400 leading-relaxed mb-8">
               {" Founded by a team of passionate developers and designers, we built WebCrafter AI to bridge the gap between imagination and execution. Whether you're a small business owner, a creator, or an enterprise, we provide the tools to bring your ideas to life instantly."}
              </p>

              <div className="flex flex-wrap gap-6 justify-center lg:justify-start">
                <div className="flex flex-col items-center lg:items-start">
                  <span className="text-3xl font-bold text-white mb-1">100K+</span>
                  <span className="text-sm text-slate-500 uppercase tracking-wider">Users</span>
                </div>
                <div className="h-12 w-px bg-white/10 hidden lg:block" />
                <div className="flex flex-col items-center lg:items-start">
                  <span className="text-3xl font-bold text-white mb-1">500K+</span>
                  <span className="text-sm text-slate-500 uppercase tracking-wider">Sites Built</span>
                </div>
                <div className="h-12 w-px bg-white/10 hidden lg:block" />
                <div className="flex flex-col items-center lg:items-start">
                  <span className="text-3xl font-bold text-white mb-1">99.9%</span>
                  <span className="text-sm text-slate-500 uppercase tracking-wider">Uptime</span>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="flex-1 w-full"
            >
              <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-white/10 bg-[#0f172a]/50 p-2">
                <div className="absolute inset-0 bg-gradient-to-tr from-blue-500/10 to-violet-500/10 backdrop-blur-md" />
                <Image
                  src="/work.avif"
                  loading="lazy"
                  width={1000}
                  height={1000}
                  alt="Team working together"
                  className="rounded-xl w-full h-auto object-cover opacity-80 mix-blend-luminosity hover:mix-blend-normal hover:opacity-100 transition-all duration-700"
                />
              </div>
              
              <div className="mt-8 grid grid-cols-2 gap-4">
                 <div className="bg-[#0f172a]/80 backdrop-blur-sm border border-white/5 p-6 rounded-2xl">
                    <h3 className="text-white font-bold mb-2 text-xl">Innovation</h3>
                    <p className="text-slate-400 text-sm">Constantly pushing the boundaries of what AI can do for web design.</p>
                 </div>
                 <div className="bg-[#0f172a]/80 backdrop-blur-sm border border-white/5 p-6 rounded-2xl">
                    <h3 className="text-white font-bold mb-2 text-xl">Simplicity</h3>
                    <p className="text-slate-400 text-sm">Making complex processes as simple as writing a text prompt.</p>
                 </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </>
  );
}
