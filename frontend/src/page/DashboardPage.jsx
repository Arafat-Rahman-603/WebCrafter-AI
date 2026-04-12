"use client";

import React, { useEffect, useState } from "react";
import Navber from "@/componentes/Navber";
import { motion } from "motion/react";
import { useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function DashboardPage() {
  const { user, isInitialized } = useSelector((state) => state.auth);
  const router = useRouter();

  const [recentWebsites, setRecentWebsites] = useState([]);
  const [totalGen, setTotalGen] = useState(0);

  useEffect(() => {
    if (isInitialized && !user) {
      router.push("/login");
    } else if (user) {
      fetchWebsites();
    }
  }, [user, isInitialized, router]);

  const fetchWebsites = async () => {
    try {
      const res = await fetch("http://localhost:4000/api/website", {
        method: "GET",
        credentials: "include"
      });
      const data = await res.json();
      if (res.ok && data.websites) {
         setRecentWebsites(data.websites);
         setTotalGen(data.websites.length);
      }
    } catch (err) {
      console.error("Failed to fetch websites", err);
    }
  };

  if (!isInitialized) {
    return (
      <div className="min-h-screen bg-[#0a0f1e] flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!user) return null;

  // Colors for placeholder aesthetic
  const thumbColors = [
    "from-blue-500 to-cyan-500", 
    "from-violet-500 to-fuchsia-500", 
    "from-emerald-500 to-teal-500",
    "from-rose-500 to-orange-500"
  ];

  return (
    <>
      <Navber />
      <div className="min-h-screen bg-[#0a0f1e] pt-12 pb-24 px-4 sm:px-6 lg:px-8 relative overflow-hidden font-sans">
        {/* Decorative Effects */}
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-blue-500/10 blur-[150px] rounded-full pointer-events-none" />
        <div className="absolute bottom-[-10%] left-[10%] w-[500px] h-[500px] bg-violet-600/10 blur-[120px] rounded-full pointer-events-none" />

        <div className="max-w-6xl mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-12 flex flex-col md:flex-row md:items-center justify-between gap-6"
          >
            <div>
              <h1 className="text-4xl font-extrabold text-white mb-2">Welcome back, {user.name || "Creator"}!</h1>
              <p className="text-slate-400">Here's what's happening with your projects today.</p>
            </div>
            <Link
              href="/generate"
              className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold transition-all shadow-[0_0_20px_rgba(37,99,235,0.4)] flex items-center gap-2 self-start md:self-auto group"
            >
              <svg className="w-5 h-5 group-hover:scale-110 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Generate New Website
            </Link>
          </motion.div>

          {/* Stats Section */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-[#0f172a]/60 backdrop-blur-xl border border-white/10 rounded-2xl p-6 relative overflow-hidden group hover:border-blue-500/30 transition-colors"
            >
              <div className="absolute top-0 left-0 w-1 h-full bg-blue-500"></div>
              <p className="text-slate-500 text-xs font-bold uppercase tracking-widest mb-2">Total Generations</p>
              <h4 className="text-4xl font-extrabold text-white">{totalGen}</h4>
              <p className="text-slate-400 text-sm mt-2">Lifetime websites built</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-[#0f172a]/60 backdrop-blur-xl border border-white/10 rounded-2xl p-6 relative overflow-hidden group hover:border-violet-500/30 transition-colors"
            >
              <div className="absolute top-0 left-0 w-1 h-full bg-violet-500"></div>
              <p className="text-slate-500 text-xs font-bold uppercase tracking-widest mb-2">Available Credits</p>
              <h4 className="text-4xl font-extrabold text-white">{user.credits || 0}</h4>
              <p className="text-slate-400 text-sm mt-2">Refreshes next month</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-[#0f172a]/60 backdrop-blur-xl border border-white/10 rounded-2xl p-6 relative overflow-hidden group hover:border-emerald-500/30 transition-colors"
            >
              <div className="absolute top-0 left-0 w-1 h-full bg-emerald-500"></div>
              <p className="text-slate-500 text-xs font-bold uppercase tracking-widest mb-2">Current Plan</p>
              <h4 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-400 uppercase">
                {user.plan || "Free"}
              </h4>
              <Link href="/pricing" className="text-blue-400 text-sm mt-2 inline-block hover:underline">Upgrade Plan</Link>
            </motion.div>
          </div>

          {/* Recent Projects */}
          <motion.div
             initial={{ opacity: 0, y: 20 }}
             animate={{ opacity: 1, y: 0 }}
             transition={{ delay: 0.4 }}
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-white">Recent Projects</h2>
              <button className="text-sm font-semibold text-slate-400 hover:text-white transition-colors">View All</button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {recentWebsites.length === 0 && (
                <div className="col-span-full py-12 text-center text-slate-500">
                  <p>No projects yet. Start by generating your first website!</p>
                </div>
              )}
              {recentWebsites.map((site, index) => (
                <div key={site._id} className="bg-[#0f172a]/40 backdrop-blur-sm border border-white/5 hover:border-white/20 rounded-2xl p-5 transition-all group overflow-hidden cursor-pointer hover:shadow-xl hover:shadow-black/50">
                  <div className={`h-32 rounded-xl mb-4 bg-gradient-to-tr ${thumbColors[index % thumbColors.length]} opacity-80 group-hover:opacity-100 transition-opacity flex items-center justify-center relative overflow-hidden`}>
                    {/* Abstract placeholder visual */}
                    <div className="absolute inset-0 bg-black/10 backdrop-blur-[2px]"></div>
                    <svg className="w-12 h-12 text-white/50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-bold text-white mb-1 group-hover:text-blue-400 transition-colors truncate">{site.title}</h3>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-500">{new Date(site.createdAt).toLocaleDateString()}</span>
                    <span className={`px-2 py-1 rounded-md text-xs font-bold ${site.deploy ? "bg-emerald-500/10 text-emerald-400" : "bg-slate-500/10 text-slate-400"}`}>
                      {site.deploy ? "Published" : "Draft"}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </>
  );
}
