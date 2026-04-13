"use client";

import React, { useEffect, useState, useRef } from "react";
import Navber from "@/componentes/Navber";
import { motion, AnimatePresence } from "motion/react";
import { useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import Link from "next/link";

const API = "http://localhost:4000/api/website";

export default function DashboardPage() {
  const { user, isInitialized } = useSelector((state) => state.auth);
  const router = useRouter();

  const [recentWebsites, setRecentWebsites] = useState([]);
  const [totalGen, setTotalGen]             = useState(0);
  const [editingId, setEditingId]           = useState(null);
  const [editTitle, setEditTitle]           = useState("");
  const titleInputRef                       = useRef(null);

  useEffect(() => {
    if (isInitialized && !user) {
      router.push("/login");
    } else if (user) {
      fetchWebsites();
    }
  }, [user, isInitialized, router]);

  useEffect(() => {
    if (editingId) setTimeout(() => titleInputRef.current?.select(), 40);
  }, [editingId]);

  const fetchWebsites = async () => {
    try {
      const res = await fetch(`${API}`, { credentials: "include" });
      const data = await res.json();
      if (res.ok && data.websites) {
        setRecentWebsites(data.websites);
        setTotalGen(data.websites.length);
      }
    } catch (err) {
      console.error("Failed to fetch websites", err);
    }
  };

  const startEdit = (site) => {
    setEditingId(site._id);
    setEditTitle(site.title);
  };

  const saveCardTitle = async (siteId) => {
    const trimmed = editTitle.trim();
    setEditingId(null);
    if (!trimmed) return;
    try {
      await fetch(`${API}/${siteId}/title`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: trimmed }),
        credentials: "include",
      });
      setRecentWebsites((prev) =>
        prev.map((s) => (s._id === siteId ? { ...s, title: trimmed } : s))
      );
    } catch (err) {
      console.error("Title save failed:", err);
    }
  };

  if (!isInitialized) {
    return (
      <div className="min-h-screen bg-[#0a0f1e] flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) return null;

  const thumbGradients = [
    "from-blue-500 via-cyan-500 to-teal-500",
    "from-violet-500 via-purple-500 to-fuchsia-500",
    "from-emerald-500 via-green-500 to-teal-400",
    "from-rose-500 via-pink-500 to-orange-400",
    "from-amber-400 via-orange-500 to-red-500",
    "from-indigo-500 via-blue-500 to-cyan-400",
  ];

  return (
    <>
      <Navber />
      <div className="min-h-screen bg-[#0a0f1e] pt-12 pb-24 px-4 sm:px-6 lg:px-8 relative overflow-hidden font-sans">
        {/* Decorative blobs */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-500/8 blur-[140px] rounded-full pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-violet-600/8 blur-[120px] rounded-full pointer-events-none" />

        <div className="max-w-6xl mx-auto relative z-10">

          {/* ── Header ── */}
          <motion.div
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            className="mb-10 flex flex-col sm:flex-row sm:items-center justify-between gap-5"
          >
            <div>
              <h1 className="text-3xl sm:text-4xl font-extrabold text-white mb-1">
                Welcome back, {user.name?.split(" ")[0] || "Creator"}! 👋
              </h1>
              <p className="text-slate-400 text-sm">Here&apos;s what&apos;s happening with your projects.</p>
            </div>
            <Link
              href="/generate"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-violet-600 hover:opacity-90 text-white text-sm font-semibold transition-all shadow-[0_0_20px_rgba(99,102,241,0.3)] self-start sm:self-auto"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              New Website
            </Link>
          </motion.div>

          {/* ── Stats ── */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
            {[
              { label: "Total Generations", value: totalGen, sub: "Lifetime websites built", color: "blue" },
              { label: "Available Credits",  value: user.credits ?? 0, sub: "Refreshes next month",   color: "violet" },
              { label: "Current Plan",       value: user.plan || "Free", sub: null, color: "emerald", isUpgrade: true },
            ].map((stat, idx) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.08 * (idx + 1) }}
                className={`relative overflow-hidden bg-[#0f172a]/60 backdrop-blur-xl border border-white/8 rounded-2xl p-5 hover:border-${stat.color}-500/30 transition-colors`}
              >
                <div className={`absolute top-0 left-0 w-1 h-full bg-${stat.color}-500 rounded-l-sm`} />
                <p className="text-slate-500 text-[11px] font-bold uppercase tracking-widest mb-2">{stat.label}</p>
                <h4 className={`text-3xl font-extrabold ${stat.color === "emerald" ? "text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-400 uppercase" : "text-white"}`}>
                  {stat.value}
                </h4>
                {stat.sub && <p className="text-slate-400 text-xs mt-1">{stat.sub}</p>}
                {stat.isUpgrade && (
                  <Link href="/pricing" className="text-blue-400 text-xs mt-1 inline-block hover:underline">
                    Upgrade Plan →
                  </Link>
                )}
              </motion.div>
            ))}
          </div>

          {/* ── Projects ── */}
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-white">Recent Projects</h2>
              <span className="text-slate-500 text-xs">{recentWebsites.length} project{recentWebsites.length !== 1 ? "s" : ""}</span>
            </div>

            {recentWebsites.length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                className="col-span-full py-20 text-center"
              >
                <div className="w-16 h-16 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <p className="text-slate-500 text-sm mb-4">No projects yet.</p>
                <Link href="/generate" className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-sm font-semibold transition-all">
                  Generate your first website
                </Link>
              </motion.div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {recentWebsites.map((site, index) => (
                  <motion.div
                    key={site._id}
                    initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.05 * index }}
                    className="group bg-[#0f172a]/50 backdrop-blur-sm border border-white/6 hover:border-white/18 rounded-2xl overflow-hidden transition-all hover:shadow-2xl hover:shadow-black/40 flex flex-col"
                  >
                    {/* Thumbnail */}
                    <div className="relative h-40 shrink-0 overflow-hidden">
                      {site.thumbnail ? (
                        <img
                          src={site.thumbnail}
                          alt={site.title}
                          className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
                        />
                      ) : (
                        <div className={`w-full h-full bg-gradient-to-br ${thumbGradients[index % thumbGradients.length]} opacity-80 group-hover:opacity-100 transition-opacity flex items-center justify-center`}>
                          <svg className="w-10 h-10 text-white/30" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                          </svg>
                        </div>
                      )}
                      {/* Live badge */}
                      {site.deploy && (
                        <span className="absolute top-2.5 right-2.5 flex items-center gap-1 px-2 py-0.5 bg-emerald-500/90 text-white text-[10px] font-bold rounded-full">
                          <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" />
                          Live
                        </span>
                      )}
                    </div>

                    {/* Card body */}
                    <div className="p-4 flex flex-col flex-1 gap-3">
                      {/* Inline title edit */}
                      {editingId === site._id ? (
                        <input
                          ref={titleInputRef}
                          value={editTitle}
                          onChange={(e) => setEditTitle(e.target.value)}
                          onBlur={() => saveCardTitle(site._id)}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") saveCardTitle(site._id);
                            if (e.key === "Escape") setEditingId(null);
                          }}
                          className="text-sm font-semibold bg-[#0a0f1e] text-white border border-blue-500/50 rounded-lg px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500/30 w-full"
                          autoFocus
                        />
                      ) : (
                        <button
                          onClick={() => startEdit(site)}
                          className="text-sm font-semibold text-white group-hover:text-blue-400 transition-colors text-left flex items-center gap-1.5 truncate"
                          title="Click to rename"
                        >
                          <span className="truncate">{site.title}</span>
                          <svg className="w-3 h-3 text-slate-600 opacity-0 group-hover:opacity-100 shrink-0 transition-opacity" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                          </svg>
                        </button>
                      )}

                      <div className="flex items-center justify-between text-xs">
                        <span className="text-slate-500">{new Date(site.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</span>
                        <span className={`px-2 py-0.5 rounded-md font-semibold ${site.deploy ? "bg-emerald-500/10 text-emerald-400" : "bg-white/5 text-slate-500"}`}>
                          {site.deploy ? "Published" : "Draft"}
                        </span>
                      </div>

                      {/* Action buttons */}
                      <div className="flex gap-2 mt-auto pt-1">
                        <Link
                          href={`/editor/${site._id}`}
                          className="flex-1 flex items-center justify-center gap-1.5 py-2 bg-blue-600/15 hover:bg-blue-600/30 border border-blue-500/25 text-blue-400 rounded-lg text-xs font-semibold transition-all"
                        >
                          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                          </svg>
                          Open Editor
                        </Link>
                        {site.deploy && site.deployUrl && (
                          <a
                            href={site.deployUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-1 px-3 py-2 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/20 text-emerald-400 rounded-lg text-xs font-semibold transition-all"
                          >
                            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                            </svg>
                            Visit
                          </a>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
