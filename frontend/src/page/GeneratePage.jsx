"use client";

import React, { useState, useEffect } from "react";
import Navber from "@/componentes/Navber";
import { motion } from "motion/react";
import { useSelector } from "react-redux";
import { useRouter } from "next/navigation";

export default function GeneratePage() {
  const { user, isInitialized } = useSelector((state) => state.auth);
  const router = useRouter();

  const [prompt, setPrompt] = useState("");
  const [theme, setTheme] = useState("Dark & Modern");
  const [websiteType, setWebsiteType] = useState("Landing Page");
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState("");

  // Auth guard
  useEffect(() => {
    if (isInitialized && !user) {
      router.push("/login");
    }
  }, [isInitialized, user, router]);

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    setIsGenerating(true);
    setError("");

    try {
      const res = await fetch("http://localhost:4000/api/website/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt, theme, type: websiteType }),
        credentials: "include",
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Generation failed");

      // Redirect to the live editor for instant preview
      router.push(`/editor/${data.website._id}`);
    } catch (err) {
      console.error(err);
      setError(err.message || "Something went wrong. Please try again.");
      setIsGenerating(false);
    }
  };

  // Show spinner while auth is initializing
  if (!isInitialized) {
    return (
      <div className="min-h-screen bg-[#0a0f1e] flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) return null;

  return (
    <>
      <Navber />
      <div className="min-h-screen bg-[#0a0f1e] pt-12 pb-24 px-4 sm:px-6 lg:px-8 relative overflow-hidden font-sans">
        {/* Decorative Effects */}
        <div className="absolute top-[20%] left-[-10%] w-[500px] h-[500px] bg-blue-600/10 blur-[150px] rounded-full pointer-events-none" />
        <div className="absolute top-[40%] right-[-10%] w-[600px] h-[600px] bg-violet-600/10 blur-[120px] rounded-full pointer-events-none" />

        <div className="max-w-4xl mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-4 tracking-tight">What do you want to build?</h1>
            <p className="text-slate-400 text-lg max-w-2xl mx-auto">Describe your dream website. Our AI will craft the layout, styling, and copy in seconds.</p>
          </motion.div>

          {/* Generator Interface */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
            className="bg-[#0f172a]/60 backdrop-blur-xl border border-white/10 rounded-3xl p-6 md:p-10 shadow-2xl relative"
          >
            {isGenerating && (
              <div className="absolute inset-0 z-50 bg-[#0f172a]/80 backdrop-blur-sm rounded-3xl flex flex-col items-center justify-center">
                <div className="w-16 h-16 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin mb-4 shadow-[0_0_15px_rgba(59,130,246,0.5)]"></div>
                <h3 className="text-xl font-bold text-white mb-2 animate-pulse">Crafting your website...</h3>
                <p className="text-slate-400 text-sm">AI is generating layouts and compiling assets</p>
              </div>
            )}

            <div className="space-y-8">
              {/* Error Message */}
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-4 bg-red-500/10 border border-red-500/30 text-red-400 rounded-xl text-sm font-medium"
                >
                  ⚠️ {error}
                </motion.div>
              )}

              {/* Prompt Area */}
              <div>
                <label className="block text-sm font-bold text-slate-300 mb-3">Website Prompt</label>
                <div className="relative group">
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 to-violet-500 rounded-2xl blur opacity-30 group-hover:opacity-50 transition duration-500"></div>
                  <textarea
                    rows={6}
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder="e.g. A dark-themed modern landing page for my new SaaS startup that offers AI-driven analytics..."
                    className="relative w-full bg-[#0a0f1e]/90 text-white placeholder-slate-500 border border-white/10 rounded-2xl p-5 focus:outline-none focus:ring-2 focus:ring-blue-500/50 resize-none text-lg transition-all"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold text-slate-300 mb-3">Website Type</label>
                  <select
                    value={websiteType}
                    onChange={(e) => setWebsiteType(e.target.value)}
                    className="w-full bg-[#0a0f1e] text-slate-300 border border-white/10 rounded-xl px-4 py-3.5 focus:outline-none focus:ring-2 focus:ring-blue-500/40 appearance-none"
                  >
                    <option>Landing Page</option>
                    <option>Portfolio</option>
                    <option>E-Commerce</option>
                    <option>Blog</option>
                    <option>Dashboard</option>
                    <option>Restaurant</option>
                    <option>Agency</option>
                    <option>SaaS</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-300 mb-3">Color Theme</label>
                  <select
                    value={theme}
                    onChange={(e) => setTheme(e.target.value)}
                    className="w-full bg-[#0a0f1e] text-slate-300 border border-white/10 rounded-xl px-4 py-3.5 focus:outline-none focus:ring-2 focus:ring-blue-500/40 appearance-none"
                  >
                    <option>Dark & Modern</option>
                    <option>Light & Minimal</option>
                    <option>Vibrant & Playful</option>
                    <option>Corporate Professional</option>
                    <option>Neon & Cyberpunk</option>
                    <option>Elegant & Luxury</option>
                  </select>
                </div>
              </div>

              <div className="pt-4 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="text-sm text-slate-400 flex items-center gap-2">
                  <span className="w-2 h-2 bg-blue-500 rounded-full" />
                  Cost: <span className="text-white font-bold">1 Credit</span>
                  {user?.credits !== undefined && (
                    <span className="text-slate-500 ml-2">· {user.credits} remaining</span>
                  )}
                </div>
                <button
                  onClick={handleGenerate}
                  disabled={!prompt.trim() || isGenerating}
                  className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-blue-600 to-violet-600 hover:from-blue-500 hover:to-violet-500 text-white rounded-xl font-bold text-lg shadow-[0_0_20px_rgba(59,130,246,0.4)] disabled:opacity-50 disabled:cursor-not-allowed transition-all hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2"
                >
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                  </svg>
                  Craft Website
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </>
  );
}
