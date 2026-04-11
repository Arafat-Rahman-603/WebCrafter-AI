"use client";

import React from "react";
import { motion } from "motion/react";

export default function Hero() {
  return (
    <section className="relative pt-0 pb-20 overflow-hidden bg-[#0a0f1e] min-h-screen flex flex-col justify-center">
      {/* Background animated orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{ scale: [1, 1.2, 1], x: [0, 50, 0], y: [0, -30, 0] }}
          transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-[10%] left-[15%] w-[500px] h-[500px] bg-blue-700/25 rounded-full blur-[130px]"
        />
        <motion.div
          animate={{ scale: [1, 1.1, 1], x: [0, -50, 0], y: [0, 40, 0] }}
          transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-[15%] right-[15%] w-[450px] h-[450px] bg-violet-700/25 rounded-full blur-[120px]"
        />
        <motion.div
          animate={{ scale: [1, 1.3, 1], x: [0, 30, 0], y: [0, 50, 0] }}
          transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -bottom-[10%] left-[40%] w-[400px] h-[400px] bg-indigo-700/20 rounded-full blur-[130px]"
        />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full pt-12">
        <div className="text-center max-w-4xl mx-auto">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="flex justify-center mb-8"
          >
            <div
              className="px-4 py-2 rounded-full text-sm font-semibold text-slate-300 flex items-center gap-3 cursor-pointer hover:border-white/20 transition-all"
              style={{
                background: "rgba(255,255,255,0.05)",
                border: "1px solid rgba(255,255,255,0.1)",
                backdropFilter: "blur(10px)",
              }}
            >
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
              </span>
              <span>WebCrafter AI 2.0 is now available</span>
              <span className="text-white/20">|</span>
              <span className="text-blue-400 flex items-center gap-1 group">
                Read the announcement
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 group-hover:translate-x-0.5 transition-transform"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </span>
            </div>
          </motion.div>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1, ease: "easeOut" }}
            className="text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight text-white mb-8 leading-[1.1]"
          >
            Design and build websites <br className="hidden md:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-400 to-violet-400">
              at the speed of thought.
            </span>
          </motion.h1>

          {/* Subheadline */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2, ease: "easeOut" }}
            className="text-lg md:text-xl text-slate-400 mb-10 max-w-2xl mx-auto leading-relaxed"
          >
            Turn your ideas into production-ready React components instantly. No
            coding experience needed. Just describe what you want and let AI do
            the heavy lifting.
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3, ease: "easeOut" }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <button
              className="w-full  cursor-pointer sm:w-auto px-8 py-4 text-white rounded-full font-semibold text-lg transition-all duration-300 active:scale-95 flex items-center curson-pointer justify-center gap-2"
              style={{
                background: "linear-gradient(135deg, #3b82f6 0%, #6d28d9 100%)",
                boxShadow: "0 4px 24px rgba(59,130,246,0.35)",
              }}
            >
              Start building for free
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
            <button className="w-full cursor-pointer sm:w-auto px-8 py-4 text-slate-300 hover:text-white border border-white/10 hover:border-white/25 hover:bg-white/5 rounded-full font-semibold text-lg transition-all duration-300 active:scale-95 flex items-center justify-center gap-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z"
                  clipRule="evenodd"
                />
              </svg>
              See how it works
            </button>
          </motion.div>
        </div>

        {/* Floating Mockup Preview */}
        <motion.div
          initial={{ opacity: 0, y: 60 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5, ease: "easeOut" }}
          className="mt-12 sm:mt-20 mx-auto max-w-5xl relative block px-2 sm:px-0"
        >
          {/* Glow Behind Mockup */}
          <div className="absolute inset-0 bg-gradient-to-b from-blue-500/20 to-transparent blur-3xl opacity-60 z-0 rounded-full transform -translate-y-12"></div>

          <div
            className="relative z-10 rounded-2xl md:rounded-3xl overflow-hidden ring-1 ring-white/10"
            style={{
              background: "rgba(15, 23, 42, 0.8)",
              border: "1px solid rgba(255,255,255,0.08)",
              backdropFilter: "blur(16px)",
              boxShadow: "0 30px 80px rgba(0,0,0,0.6)",
            }}
          >
            {/* Mac Window Header */}
            <div
              className="h-10 sm:h-14 flex items-center px-3 sm:px-5 gap-2 border-b border-white/5"
              style={{ background: "rgba(255,255,255,0.03)" }}
            >
              <div className="flex gap-1.5 sm:gap-2 w-12 sm:w-16">
                <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-[#ff5f56]"></div>
                <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-[#ffbd2e]"></div>
                <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-[#27c93f]"></div>
              </div>
              <div className="flex-1 flex justify-center">
                <div className="rounded-md flex items-center justify-center text-[10px] sm:text-xs font-medium text-slate-500 py-1 sm:py-1.5 px-3 sm:px-6 md:px-32 xl:px-48 border border-white/5 bg-white/5 truncate max-w-[150px] sm:max-w-none">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-2.5 w-2.5 sm:h-3 sm:w-3 mr-1 sm:mr-1.5 opacity-50 shrink-0"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span className="truncate">app.webcrafter.ai</span>
                </div>
              </div>
              <div className="w-12 sm:w-16"></div>
            </div>

            {/* Inner Dashboard Mock */}
            <div className="py-10 px-4 sm:p-6 md:p-12 aspect-[4/3] sm:aspect-[16/9] md:aspect-[21/9] flex flex-col items-center justify-center relative overflow-hidden">
              <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:16px_16px] sm:bg-[size:24px_24px]"></div>

              <div className="relative z-10 w-full max-w-2xl flex flex-col items-center">
                <motion.div
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.5, delay: 1 }}
                  className="w-12 h-12 sm:w-16 sm:h-16 rounded-2xl flex items-center justify-center mb-4 sm:mb-6 border border-white/10"
                  style={{ background: "rgba(59,130,246,0.15)" }}
                >
                  <span className="text-2xl sm:text-3xl filter drop-shadow-sm">✨</span>
                </motion.div>

                <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-white mb-2 tracking-tight text-center">
                  What do you want to build?
                </h3>
                <p className="text-slate-400 text-xs sm:text-sm md:text-base mb-6 sm:mb-8 text-center max-w-xs sm:max-w-sm">
                  Describe your desired UI component, and our AI will generate
                  it instantly.
                </p>

                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.5, delay: 1.2 }}
                  className="w-full rounded-full p-1.5 sm:p-2 pl-4 sm:pl-6 flex items-center border border-white/10"
                  style={{
                    background: "rgba(255,255,255,0.05)",
                    boxShadow: "0 8px 32px rgba(0,0,0,0.3)",
                  }}
                >
                  <div className="text-slate-500 text-[10px] sm:text-sm md:text-base flex-1 flex items-center gap-1.5 sm:gap-2 truncate pr-2">
                    <span className="animate-pulse w-[1px] h-3.5 sm:h-5 bg-blue-500 inline-block shrink-0"></span>
                    <span className="truncate">A modern SaaS pricing table with a dark mode...</span>
                  </div>
                  <div className="bg-blue-600 p-2 sm:p-2.5 rounded-full text-white cursor-pointer hover:bg-blue-700 transition-colors shadow-md shadow-blue-500/30 shrink-0">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-3.5 w-3.5 sm:h-5 sm:w-5 transform -rotate-45"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
                    </svg>
                  </div>
                </motion.div>

                <div className="flex flex-wrap justify-center gap-1.5 sm:gap-2 mt-5 sm:mt-6">
                  {["Hero Section", "Login Form", "Dashboard"].map((tag) => (
                    <span
                      key={tag}
                      className="px-2.5 sm:px-3 py-1 rounded-full text-[10px] sm:text-xs font-medium text-slate-400 border border-white/10 bg-white/5 cursor-pointer hover:bg-white/10 hover:text-slate-200 transition-all"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}  