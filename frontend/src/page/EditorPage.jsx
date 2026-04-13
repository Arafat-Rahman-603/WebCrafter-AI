"use client";

import React, { useEffect, useState, useRef, use, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import Link from "next/link";

const API = "http://localhost:4000/api/website";

const DEVICES = [
  { id: "desktop", label: "Desktop", width: "100%", icon: (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
  )},
  { id: "tablet", label: "Tablet", width: "768px", icon: (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 18h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" /></svg>
  )},
  { id: "mobile", label: "Mobile", width: "390px", icon: (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" /></svg>
  )},
];

export default function EditorPage({ params }) {
  const resolvedParams = use(params);
  const { id } = resolvedParams;
  const { user, isInitialized } = useSelector((s) => s.auth);
  const router = useRouter();

  const [website, setWebsite] = useState(null);
  const [code, setCode] = useState("");
  const [activeTab, setActiveTab] = useState("preview");
  const [device, setDevice] = useState("desktop");
  const [chatOpen, setChatOpen] = useState(false);
  const [chatMessage, setChatMessage] = useState("");
  const [conversation, setConversation] = useState([]);
  const [isFixing, setIsFixing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [isDeploying, setIsDeploying] = useState(false);
  const [isCapturing, setIsCapturing] = useState(false);
  const [deployUrl, setDeployUrl] = useState(null);
  const [deployed, setDeployed] = useState(false);
  const [deployModal, setDeployModal] = useState(false);
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [titleEditing, setTitleEditing] = useState(false);
  const [titleValue, setTitleValue] = useState("");

  const iframeRef = useRef(null);
  const chatEndRef = useRef(null);
  const titleRef = useRef(null);
  const previewKey = useRef(0);
  const captureTimerRef = useRef(null);

  // ── Auth + fetch ──────────────────────────────────────────────────────────────
  useEffect(() => {
    if (isInitialized && !user) { router.push("/login"); return; }
    if (user && id) fetchWebsite();
  }, [user, isInitialized, id]);

  const fetchWebsite = async () => {
    try {
      const res = await fetch(`${API}/${id}`, { credentials: "include" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to load");
      setWebsite(data.website);
      setCode(data.website.letestCode || "");
      setConversation(data.website.conversation || []);
      setDeployed(data.website.deploy || false);
      setDeployUrl(data.website.deployUrl || null);
      setTitleValue(data.website.title || "Untitled");
    } catch (err) { setError(err.message); }
    finally { setLoading(false); }
  };

  // ── Chat scroll ───────────────────────────────────────────────────────────────
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [conversation, isFixing]);

  // ── Auto screenshot after preview loads ───────────────────────────────────────
  const captureScreenshot = useCallback(async () => {
    const iframe = iframeRef.current;
    if (!iframe || isCapturing) return;
    try {
      setIsCapturing(true);
      const html2canvas = (await import("html2canvas")).default;
      const doc = iframe.contentDocument || iframe.contentWindow?.document;
      if (!doc || !doc.body) return;
      const canvas = await html2canvas(doc.body, {
        useCORS: true, allowTaint: true, scale: 0.25,
        width: 1280, height: 800,
        windowWidth: 1280, windowHeight: 800,
      });
      const dataUrl = canvas.toDataURL("image/jpeg", 0.75);
      await fetch(`${API}/${id}/thumbnail`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ thumbnail: dataUrl }),
        credentials: "include",
      });
    } catch (e) { console.warn("Screenshot skipped:", e.message); }
    finally { setIsCapturing(false); }
  }, [id, isCapturing]);

  const handleIframeLoad = () => {
    // Auto-capture 2s after first preview load
    clearTimeout(captureTimerRef.current);
    captureTimerRef.current = setTimeout(captureScreenshot, 2000);
  };

  // ── Title save ────────────────────────────────────────────────────────────────
  const saveTitle = async () => {
    setTitleEditing(false);
    const trimmed = titleValue.trim();
    if (!trimmed || trimmed === website?.title) return;
    try {
      await fetch(`${API}/${id}/title`, {
        method: "PATCH", credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: trimmed }),
      });
      setWebsite((w) => ({ ...w, title: trimmed }));
    } catch { /* silently fail */ }
  };

  // ── Save code ─────────────────────────────────────────────────────────────────
  const handleSave = async () => {
    setIsSaving(true);
    try {
      await fetch(`${API}/${id}/code`, {
        method: "PATCH", credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code }),
      });
      previewKey.current += 1;
      setActiveTab("preview");
      setIsSaved(true);
      setTimeout(() => setIsSaved(false), 2000);
    } catch { alert("Save failed"); }
    finally { setIsSaving(false); }
  };

  // ── AI Fix ────────────────────────────────────────────────────────────────────
  const handleFix = async () => {
    const msg = chatMessage.trim();
    if (!msg || isFixing) return;
    setChatMessage("");
    setIsFixing(true);
    setConversation((c) => [...c, { role: "user", content: msg }]);
    try {
      const res = await fetch(`${API}/${id}/fix`, {
        method: "POST", credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: msg }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Fix failed");
      setCode(data.updatedCode);
      setConversation(data.conversation);
      previewKey.current += 1;
      setActiveTab("preview");
    } catch (err) {
      setConversation((c) => [...c, { role: "assistant", content: `❌ ${err.message}` }]);
    } finally { setIsFixing(false); }
  };

  // ── Deploy ────────────────────────────────────────────────────────────────────
  const handleDeploy = async () => {
    setIsDeploying(true);
    try {
      const res = await fetch(`${API}/${id}/deploy`, { method: "POST", credentials: "include" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      setDeployed(data.deploy);
      setDeployUrl(data.deployUrl || null);
      if (data.deploy) setDeployModal(true);
    } catch (err) { alert(err.message); }
    finally { setIsDeploying(false); }
  };

  const publicUrl = deployUrl && typeof window !== "undefined"
    ? `${window.location.origin}${deployUrl}` : "";

  const handleCopy = () => {
    navigator.clipboard.writeText(publicUrl).then(() => {
      setCopied(true); setTimeout(() => setCopied(false), 2000);
    });
  };

  const SUGGESTIONS = [
    "Make the navbar sticky on scroll",
    "Change the color scheme to blue and purple",
    "Add a contact form at the bottom",
    "Make it fully mobile responsive",
  ];

  // ── Loading ───────────────────────────────────────────────────────────────────
  if (!isInitialized || loading) return (
    <div className="h-screen bg-[#0d1117] flex flex-col items-center justify-center gap-3">
      <div className="relative w-12 h-12">
        <div className="absolute inset-0 rounded-full border-4 border-blue-500/20" />
        <div className="absolute inset-0 rounded-full border-4 border-t-blue-500 border-r-transparent border-b-transparent border-l-transparent animate-spin" />
      </div>
      <p className="text-slate-500 text-sm animate-pulse">Loading editor…</p>
    </div>
  );

  if (error) return (
    <div className="h-screen bg-[#0d1117] flex flex-col items-center justify-center gap-4 text-center px-4">
      <div className="text-5xl">⚠️</div>
      <p className="text-red-400 text-sm">{error}</p>
      <Link href="/dashboard" className="text-blue-400 hover:underline text-sm">← Back to Dashboard</Link>
    </div>
  );

  return (
    <div className="flex flex-col h-screen bg-[#0d1117] font-sans overflow-hidden">

      {/* ── HEADER BAR ─────────────────────────────────────────────────────────── */}
      <header className="flex items-center justify-between px-3 sm:px-4 py-2 bg-[#161b22] border-b border-[#30363d] z-50 shrink-0 gap-2">

        {/* LEFT: back + title */}
        <div className="flex items-center gap-2 min-w-0 flex-1">
          <Link href="/dashboard"
            className="shrink-0 flex items-center gap-1 px-2 py-1.5 rounded-lg hover:bg-white/5 text-slate-400 hover:text-white transition-all text-xs">
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            <span className="hidden sm:block">Back</span>
          </Link>
          <span className="text-[#30363d]">/</span>

          {/* Editable title */}
          {titleEditing ? (
            <input ref={titleRef} value={titleValue}
              onChange={(e) => setTitleValue(e.target.value)}
              onBlur={saveTitle}
              onKeyDown={(e) => { if (e.key === "Enter") saveTitle(); if (e.key === "Escape") { setTitleEditing(false); setTitleValue(website?.title || ""); } }}
              autoFocus
              className="bg-[#0d1117] border border-blue-500/60 rounded-md px-2 py-1 text-white text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/30 min-w-[100px] max-w-[180px] sm:max-w-[260px]"
            />
          ) : (
            <button onClick={() => setTitleEditing(true)}
              className="group flex items-center gap-1.5 hover:bg-white/5 px-2 py-1 rounded-lg transition-all min-w-0">
              <span className="text-white text-sm font-medium truncate max-w-[120px] sm:max-w-[220px]">{titleValue}</span>
              <svg className="w-3 h-3 text-slate-600 group-hover:text-slate-400 transition-colors shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536M9 13l6.586-6.586a2 2 0 012.828 2.828L11.828 16H9v-2.828z" />
              </svg>
            </button>
          )}
          {deployed && (
            <span className="hidden sm:flex shrink-0 items-center gap-1 px-2 py-0.5 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-bold rounded-full">
              <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" />Live
            </span>
          )}
        </div>

        {/* CENTER: Preview/Code tabs + device */}
        <div className="flex items-center gap-1.5 shrink-0">
          <div className="flex bg-[#0d1117] border border-[#30363d] rounded-lg p-0.5 gap-0.5">
            {[{ id: "preview", icon: "👁", label: "Preview" }, { id: "code", icon: "⌨", label: "Code" }].map(t => (
              <button key={t.id} onClick={() => setActiveTab(t.id)}
                className={`flex items-center gap-1 px-2.5 py-1.5 rounded-md text-xs font-medium transition-all ${activeTab === t.id ? "bg-blue-600 text-white shadow" : "text-slate-500 hover:text-slate-300"}`}>
                <span>{t.icon}</span>
                <span className="hidden md:block">{t.label}</span>
              </button>
            ))}
          </div>

          {/* Device size (only in preview) */}
          {activeTab === "preview" && (
            <div className="hidden sm:flex bg-[#0d1117] border border-[#30363d] rounded-lg p-0.5 gap-0.5">
              {DEVICES.map(d => (
                <button key={d.id} onClick={() => setDevice(d.id)} title={d.label}
                  className={`p-1.5 rounded-md transition-all ${device === d.id ? "bg-[#30363d] text-white" : "text-slate-600 hover:text-slate-400"}`}>
                  {d.icon}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* RIGHT: actions */}
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          {/* Save (code tab) */}
          {activeTab === "code" && (
            <button onClick={handleSave} disabled={isSaving}
              className="flex items-center gap-1 px-2.5 py-1.5 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-60 text-white rounded-lg text-xs font-semibold transition-all">
              {isSaving ? <span className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" /> :
                isSaved ? <span>✓</span> :
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>}
              <span className="hidden sm:block">{isSaved ? "Saved!" : "Save"}</span>
            </button>
          )}

          {/* Capture thumbnail (preview tab) */}
          {activeTab === "preview" && (
            <button onClick={captureScreenshot} disabled={isCapturing} title="Capture thumbnail"
              className="hidden sm:flex items-center gap-1 px-2.5 py-1.5 bg-[#21262d] hover:bg-[#30363d] border border-[#30363d] text-slate-400 hover:text-white rounded-lg text-xs font-medium transition-all disabled:opacity-50">
              {isCapturing ? <span className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" /> :
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" /></svg>}
              <span className="hidden lg:block">Capture</span>
            </button>
          )}

          {/* AI Fix */}
          <button onClick={() => setChatOpen(o => !o)}
            className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all border ${chatOpen
              ? "bg-violet-600 text-white border-violet-500 shadow-[0_0_12px_rgba(139,92,246,0.4)]"
              : "bg-[#21262d] hover:bg-[#30363d] border-[#30363d] text-slate-400 hover:text-white"}`}>
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-4l-4 4z" />
            </svg>
            <span className="hidden sm:block">AI Fix</span>
            <span className="bg-violet-900/60 text-violet-300 px-1 py-0.5 rounded text-[10px] hidden sm:block">10cr</span>
          </button>

          {/* Deploy */}
          <button onClick={handleDeploy} disabled={isDeploying}
            className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all border disabled:opacity-60 ${deployed
              ? "bg-orange-500/10 border-orange-500/30 text-orange-400 hover:bg-orange-500/20"
              : "bg-gradient-to-r from-blue-600 to-violet-600 hover:opacity-90 text-white border-transparent shadow-[0_0_14px_rgba(59,130,246,0.35)]"}`}>
            {isDeploying ? <span className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" /> :
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6h.1a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" /></svg>}
            <span className="hidden sm:block">{deployed ? "Unpublish" : "Deploy"}</span>
          </button>

          {deployed && deployUrl && (
            <a href={publicUrl} target="_blank" rel="noopener noreferrer"
              className="hidden sm:flex items-center gap-1 px-2.5 py-1.5 bg-emerald-600/10 border border-emerald-500/20 text-emerald-400 rounded-lg text-xs font-semibold hover:bg-emerald-600/20 transition-all">
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
              Visit
            </a>
          )}
        </div>
      </header>

      {/* ── WORKSPACE ───────────────────────────────────────────────────────────── */}
      <div className="flex flex-1 overflow-hidden">

        {/* Preview / Code */}
        <div className="flex flex-col flex-1 overflow-hidden bg-[#0d1117]">
          <AnimatePresence mode="wait">

            {/* ─ PREVIEW ─ */}
            {activeTab === "preview" && (
              <motion.div key={`p-${previewKey.current}`}
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                transition={{ duration: 0.15 }}
                className="flex flex-col flex-1 overflow-hidden bg-[#1c2128]">

                {/* Browser chrome bar */}
                <div className="flex items-center gap-2 px-3 py-2 bg-[#161b22] border-b border-[#30363d] shrink-0">
                  <div className="flex gap-1.5">
                    <div className="w-2.5 h-2.5 rounded-full bg-red-500/70" />
                    <div className="w-2.5 h-2.5 rounded-full bg-amber-500/70" />
                    <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/70" />
                  </div>
                  <div className="flex-1 bg-[#0d1117] border border-[#30363d] rounded-md px-3 py-1 text-xs text-slate-500 font-mono truncate max-w-[400px] mx-auto">
                    {deployed ? publicUrl : "preview://local"}
                  </div>
                  {isCapturing && (
                    <span className="text-[10px] text-slate-600 animate-pulse flex items-center gap-1">
                      <span className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-pulse" />capturing…
                    </span>
                  )}
                </div>

                {/* Iframe with device wrap */}
                <div className="flex-1 overflow-auto flex justify-center bg-[#1c2128]">
                  <div className="transition-all duration-500 h-full"
                    style={{ width: DEVICES.find(d => d.id === device)?.width || "100%" }}>
                    {code ? (
                      <iframe ref={iframeRef} key={previewKey.current}
                        srcDoc={code} title="Preview"
                        className="w-full h-full border-0"
                        sandbox="allow-scripts allow-same-origin"
                        onLoad={handleIframeLoad}
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full text-slate-600 text-sm">
                        No preview available
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            )}

            {/* ─ CODE EDITOR ─ */}
            {activeTab === "code" && (
              <motion.div key="code"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                transition={{ duration: 0.15 }}
                className="flex flex-col flex-1 overflow-hidden">

                {/* Editor top bar */}
                <div className="flex items-center justify-between px-4 py-2 bg-[#161b22] border-b border-[#30363d] shrink-0">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-orange-400" />
                    <span className="text-xs text-slate-400 font-mono">index.html</span>
                  </div>
                  <div className="flex items-center gap-3 text-[10px] text-slate-600 font-mono">
                    <span>{code.split("\n").length} lines</span>
                    <span>{(code.length / 1024).toFixed(1)} KB</span>
                  </div>
                </div>

                {/* Line numbers + textarea */}
                <div className="flex flex-1 overflow-hidden">
                  <div className="bg-[#0d1117] border-r border-[#21262d] py-4 px-2 text-right select-none shrink-0 overflow-hidden"
                    style={{ minWidth: "3.25rem" }}>
                    {code.split("\n").map((_, i) => (
                      <div key={i} className="font-mono text-[11px] text-slate-700 leading-[1.65rem]">{i + 1}</div>
                    ))}
                  </div>
                  <textarea value={code} onChange={(e) => setCode(e.target.value)}
                    className="flex-1 h-full bg-[#0d1117] text-[#e6edf3] font-mono text-[12px] leading-[1.65rem] p-4 pl-3 resize-none focus:outline-none"
                    spellCheck={false} autoComplete="off" autoCorrect="off"
                    style={{ tabSize: 2 }}
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* ── AI FIX CHAT SIDEBAR ──────────────────────────────────────────────── */}
        <AnimatePresence>
          {chatOpen && (
            <motion.aside
              initial={{ width: 0, opacity: 0 }} animate={{ width: 360, opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              transition={{ duration: 0.2, ease: "easeInOut" }}
              className="flex bg-[#161b22] border-l border-[#30363d] overflow-hidden shrink-0"
              style={{ minWidth: 0 }}>
              <div className="flex flex-col w-[360px] h-full">

                {/* Header */}
                <div className="flex items-center justify-between px-4 py-3 border-b border-[#30363d] shrink-0">
                  <div>
                    <h3 className="text-white font-semibold text-sm flex items-center gap-2">
                      <span className="w-2 h-2 bg-violet-500 rounded-full animate-pulse" />AI Fix Chat
                    </h3>
                    <p className="text-slate-500 text-[11px] mt-0.5">
                      10 credits / fix · You have <span className="text-white font-medium">{user?.credits ?? "?"}</span>
                    </p>
                  </div>
                  <button onClick={() => setChatOpen(false)} className="text-slate-600 hover:text-slate-300 transition-colors p-1">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                  </button>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-3 space-y-3">
                  {conversation.length === 0 && (
                    <div className="py-8 text-center">
                      <div className="w-12 h-12 bg-violet-500/10 border border-violet-500/20 rounded-2xl flex items-center justify-center mx-auto mb-3">
                        <svg className="w-6 h-6 text-violet-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
                        </svg>
                      </div>
                      <p className="text-slate-500 text-xs mb-4">Describe any change — AI will update your code</p>
                      <div className="space-y-1.5">
                        {SUGGESTIONS.map(s => (
                          <button key={s} onClick={() => setChatMessage(s)}
                            className="block w-full text-left px-3 py-2 bg-[#21262d] hover:bg-[#30363d] border border-[#30363d] text-slate-400 hover:text-slate-200 text-[11px] rounded-lg transition-all">
                            {s}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {conversation.map((msg, i) => (
                    <motion.div key={i} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
                      className={`flex gap-2 ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                      {msg.role === "assistant" && (
                        <div className="w-6 h-6 rounded-full bg-violet-600 flex items-center justify-center shrink-0 mt-1 text-[11px]">✨</div>
                      )}
                      <div className={`max-w-[83%] px-3 py-2.5 rounded-2xl text-xs leading-relaxed ${
                        msg.role === "user"
                          ? "bg-blue-600 text-white rounded-tr-sm"
                          : "bg-[#21262d] border border-[#30363d] text-slate-300 rounded-tl-sm"
                      }`}>
                        {msg.content}
                      </div>
                    </motion.div>
                  ))}

                  {isFixing && (
                    <div className="flex gap-2 items-start">
                      <div className="w-6 h-6 rounded-full bg-violet-600 flex items-center justify-center shrink-0 text-[11px] animate-pulse">✨</div>
                      <div className="bg-[#21262d] border border-[#30363d] px-4 py-3 rounded-2xl rounded-tl-sm flex items-center gap-1.5">
                        {[0, 150, 300].map(d => (
                          <span key={d} className="w-1.5 h-1.5 bg-violet-400 rounded-full animate-bounce" style={{ animationDelay: `${d}ms` }} />
                        ))}
                        <span className="text-slate-600 text-[11px] ml-1.5">Updating your website…</span>
                      </div>
                    </div>
                  )}
                  <div ref={chatEndRef} />
                </div>

                {/* Input */}
                <div className="p-3 border-t border-[#30363d] shrink-0">
                  <div className="flex gap-2">
                    <textarea rows={2} value={chatMessage}
                      onChange={(e) => setChatMessage(e.target.value)}
                      onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleFix(); } }}
                      disabled={isFixing}
                      placeholder="e.g. Make the hero text bigger…"
                      className="flex-1 bg-[#0d1117] text-slate-200 placeholder-slate-600 border border-[#30363d] focus:border-violet-500/60 rounded-xl px-3 py-2 text-xs resize-none focus:outline-none disabled:opacity-50 transition-colors leading-relaxed"
                    />
                    <button onClick={handleFix} disabled={!chatMessage.trim() || isFixing}
                      className="self-end px-3 py-2.5 bg-violet-600 hover:bg-violet-500 disabled:opacity-40 disabled:cursor-not-allowed text-white rounded-xl transition-all">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                      </svg>
                    </button>
                  </div>
                  <p className="text-slate-700 text-[10px] mt-1.5 text-center">↵ Send · Shift+↵ newline</p>
                </div>
              </div>
            </motion.aside>
          )}
        </AnimatePresence>
      </div>

      {/* ── DEPLOY MODAL ────────────────────────────────────────────────────────── */}
      <AnimatePresence>
        {deployModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm px-4"
            onClick={(e) => e.target === e.currentTarget && setDeployModal(false)}>
            <motion.div initial={{ scale: 0.88, opacity: 0, y: 16 }} animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.88, opacity: 0, y: 16 }}
              className="bg-[#161b22] border border-[#30363d] rounded-2xl p-6 max-w-sm w-full shadow-2xl">

              <div className="text-center mb-5">
                <div className="w-14 h-14 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl flex items-center justify-center mx-auto mb-3">
                  <svg className="w-7 h-7 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h2 className="text-xl font-bold text-white mb-1">🚀 Site is Live!</h2>
                <p className="text-slate-500 text-xs">Your website is publicly accessible at:</p>
              </div>

              <div className="bg-[#0d1117] border border-[#30363d] rounded-xl p-3 mb-4 flex items-center gap-2">
                <span className="text-emerald-400 text-xs font-mono truncate flex-1">{publicUrl}</span>
                <button onClick={handleCopy}
                  className="shrink-0 px-2.5 py-1 bg-emerald-600/20 hover:bg-emerald-600/30 border border-emerald-500/30 text-emerald-400 rounded-lg text-xs font-semibold transition-all">
                  {copied ? "✓ Done" : "Copy"}
                </button>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <a href={publicUrl} target="_blank" rel="noopener noreferrer"
                  className="py-2.5 bg-gradient-to-r from-blue-600 to-violet-600 hover:opacity-90 text-white rounded-xl font-semibold text-xs text-center transition-all">
                  Open Site ↗
                </a>
                <button onClick={() => setDeployModal(false)}
                  className="py-2.5 bg-[#21262d] hover:bg-[#30363d] border border-[#30363d] text-slate-400 hover:text-white rounded-xl font-semibold text-xs transition-all">
                  Close
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
