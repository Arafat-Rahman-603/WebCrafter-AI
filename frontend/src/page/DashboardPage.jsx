"use client";

import React, { useEffect, useState, useRef } from "react";
import Navber from "@/componentes/Navber";
import { motion, AnimatePresence } from "motion/react";
import { useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import Link from "next/link";

const API = "http://localhost:4000/api/website";

const GRADIENTS = [
  "from-blue-500 via-cyan-500 to-teal-500",
  "from-violet-500 via-fuchsia-500 to-pink-500",
  "from-emerald-500 via-teal-500 to-cyan-500",
  "from-rose-500 via-orange-500 to-amber-500",
  "from-indigo-500 via-blue-500 to-violet-500",
  "from-pink-500 via-rose-500 to-orange-500",
];

export default function DashboardPage() {
  const { user, isInitialized } = useSelector((s) => s.auth);
  const router = useRouter();

  const [websites, setWebsites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const [savingTitle, setSavingTitle] = useState(false);
  const editInputRef = useRef(null);

  useEffect(() => {
    if (isInitialized && !user) { router.push("/login"); return; }
    if (user) fetchWebsites();
  }, [user, isInitialized]);

  const fetchWebsites = async () => {
    try {
      const res = await fetch(`${API}`, { credentials: "include" });
      const data = await res.json();
      if (res.ok) setWebsites(data.websites || []);
    } catch { /* ignore */ }
    finally { setLoading(false); }
  };

  const startEdit = (site) => {
    setEditingId(site._id);
    setEditTitle(site.title);
    setTimeout(() => editInputRef.current?.select(), 50);
  };

  const saveTitle = async (id) => {
    if (!editTitle.trim()) { setEditingId(null); return; }
    setSavingTitle(true);
    try {
      const res = await fetch(`${API}/${id}/title`, {
        method: "PATCH", credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: editTitle.trim() }),
      });
      if (res.ok) {
        setWebsites((ws) => ws.map((w) => w._id === id ? { ...w, title: editTitle.trim() } : w));
      }
    } catch { /* ignore */ }
    finally { setSavingTitle(false); setEditingId(null); }
  };

  if (!isInitialized || loading) return (
    <div className="min-h-screen bg-[#0a0f1e] flex items-center justify-center">
      <div className="relative w-10 h-10">
        <div className="absolute inset-0 rounded-full border-4 border-blue-500/20" />
        <div className="absolute inset-0 rounded-full border-4 border-t-blue-500 border-r-transparent border-b-transparent border-l-transparent animate-spin" />
      </div>
    </div>
  );

  if (!user) return null;

  const totalGen = websites.length;
  const deployed = websites.filter(w => w.deploy).length;

  return (
    <>
      <Navber />
      <div className="min-h-screen bg-[#0a0f1e] pt-20 pb-24 px-4 sm:px-6 lg:px-8 font-sans relative overflow-hidden">

        {/* Decorative blobs */}
        <div className="pointer-events-none absolute top-0 right-0 w-[500px] h-[500px] bg-blue-600/8 blur-[160px] rounded-full" />
        <div className="pointer-events-none absolute bottom-0 left-0 w-[400px] h-[400px] bg-violet-600/8 blur-[140px] rounded-full" />

        <div className="max-w-7xl mx-auto relative z-10">

          {/* ── Header ─────────────────────────────────────────────────────────── */}
          <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }}
            className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-10">
            <div>
              <h1 className="text-3xl sm:text-4xl font-extrabold text-white mb-1 tracking-tight">
                Welcome back, <span className="bg-gradient-to-r from-blue-400 to-violet-400 bg-clip-text text-transparent">{user.name?.split(" ")[0] || "Creator"}</span>!
              </h1>
              <p className="text-slate-400 text-sm">Here are all your AI‑generated projects.</p>
            </div>
            <Link href="/generate"
              className="self-start sm:self-auto flex items-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-violet-600 hover:opacity-90 text-white font-semibold text-sm transition-all shadow-[0_0_20px_rgba(59,130,246,0.35)] group">
              <svg className="w-4 h-4 group-hover:scale-110 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Generate Website
            </Link>
          </motion.div>

          {/* ── Stats ───────────────────────────────────────────────────────────── */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-10">
            {[
              { label: "Total Projects", value: totalGen, color: "blue", icon: "🌐" },
              { label: "Credits Left", value: user.credits ?? 0, color: "violet", icon: "⚡" },
              { label: "Live Sites", value: deployed, color: "emerald", icon: "🚀" },
            ].map((stat, i) => (
              <motion.div key={stat.label} initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.07 }}
                className="bg-[#0f172a]/70 backdrop-blur-xl border border-white/8 rounded-2xl p-5 relative overflow-hidden group hover:border-white/15 transition-colors">
                <div className={`absolute top-0 left-0 w-1 h-full bg-${stat.color}-500`} />
                <div className="flex items-start justify-between mb-2">
                  <p className="text-slate-500 text-[11px] font-bold uppercase tracking-widest">{stat.label}</p>
                  <span className="text-xl">{stat.icon}</span>
                </div>
                <h4 className="text-4xl font-extrabold text-white">{stat.value}</h4>
              </motion.div>
            ))}
          </div>

          {/* ── Projects grid ──────────────────────────────────────────────────── */}
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-xl font-bold text-white">Your Projects</h2>
            <span className="text-slate-500 text-xs">{totalGen} total</span>
          </div>

          {websites.length === 0 ? (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              className="bg-[#0f172a]/50 border border-white/8 rounded-2xl py-16 text-center">
              <div className="text-5xl mb-4">🎨</div>
              <h3 className="text-white font-semibold mb-2">No projects yet</h3>
              <p className="text-slate-500 text-sm mb-5">Create your first AI-generated website in seconds</p>
              <Link href="/generate"
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-sm font-semibold transition-all">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                Generate First Website
              </Link>
            </motion.div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {websites.map((site, index) => (
                <motion.div key={site._id}
                  initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.04 }}
                  className="group bg-[#0f172a]/60 backdrop-blur-sm border border-white/8 hover:border-white/20 rounded-2xl overflow-hidden transition-all hover:shadow-xl hover:shadow-black/40 flex flex-col">

                  {/* Thumbnail */}
                  <div className="relative h-36 overflow-hidden shrink-0">
                    {site.thumbnail ? (
                      <img src={site.thumbnail} alt={site.title}
                        className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-105" />
                    ) : (
                      <div className={`w-full h-full bg-gradient-to-br ${GRADIENTS[index % GRADIENTS.length]} opacity-70 group-hover:opacity-90 transition-opacity flex items-center justify-center`}>
                        <svg className="w-12 h-12 text-white/40" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={0.75} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                      </div>
                    )}

                    {/* Badges overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0f172a] via-transparent to-transparent opacity-60" />
                    {site.deploy && (
                      <span className="absolute top-2.5 right-2.5 flex items-center gap-1 px-2 py-0.5 bg-emerald-500 text-white text-[10px] font-bold rounded-full shadow">
                        <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" />Live
                      </span>
                    )}
                  </div>

                  {/* Card body */}
                  <div className="p-4 flex flex-col flex-1 gap-3">

                    {/* Title + edit */}
                    <div className="min-h-[28px]">
                      {editingId === site._id ? (
                        <div className="flex gap-1.5">
                          <input ref={editInputRef} value={editTitle}
                            onChange={(e) => setEditTitle(e.target.value)}
                            onKeyDown={(e) => { if (e.key === "Enter") saveTitle(site._id); if (e.key === "Escape") setEditingId(null); }}
                            onBlur={() => saveTitle(site._id)}
                            className="flex-1 bg-[#0d1117] text-white text-sm font-semibold border border-blue-500/60 rounded-md px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500/30 min-w-0"
                            autoFocus
                          />
                          <button onClick={() => saveTitle(site._id)} disabled={savingTitle}
                            className="shrink-0 w-8 h-8 flex items-center justify-center bg-blue-600 text-white rounded-md text-xs hover:bg-blue-500 transition-colors disabled:opacity-50">
                            {savingTitle ? <span className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : "✓"}
                          </button>
                        </div>
                      ) : (
                        <button onClick={() => startEdit(site)}
                          className="group/title flex items-center gap-1.5 w-full text-left hover:bg-white/5 -mx-1 px-1 py-0.5 rounded-md transition-all">
                          <span className="text-white font-semibold text-sm truncate">{site.title}</span>
                          <svg className="w-3 h-3 text-slate-700 group-hover/title:text-slate-400 transition-colors shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536M9 13l6.586-6.586a2 2 0 012.828 2.828L11.828 16H9v-2.828z" />
                          </svg>
                        </button>
                      )}
                    </div>

                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-600">{new Date(site.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</span>
                      <span className={`px-2 py-0.5 rounded-md font-semibold ${site.deploy ? "bg-emerald-500/10 text-emerald-400" : "bg-slate-700/50 text-slate-500"}`}>
                        {site.deploy ? "Published" : "Draft"}
                      </span>
                    </div>

                    {/* Action buttons */}
                    <div className="flex gap-2 mt-auto">
                      <Link href={`/editor/${site._id}`}
                        className="flex-1 flex items-center justify-center gap-1.5 py-2 bg-blue-600/15 hover:bg-blue-600/30 border border-blue-500/25 text-blue-400 hover:text-blue-300 rounded-lg text-xs font-semibold transition-all">
                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                        Edit
                      </Link>
                      {site.deploy && site.deployUrl && (
                        <a href={site.deployUrl} target="_blank" rel="noopener noreferrer"
                          className="flex items-center justify-center gap-1 px-3 py-2 bg-emerald-600/10 hover:bg-emerald-600/25 border border-emerald-500/25 text-emerald-400 rounded-lg text-xs font-semibold transition-all">
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
    </>
  );
}
