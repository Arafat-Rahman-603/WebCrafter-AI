"use client";

import React, { useEffect, useState, useRef, use, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import Link from "next/link";

const API = "http://localhost:4000/api/website";

const SUGGESTIONS = [
  "Make the navbar sticky with a shadow",
  "Add smooth scroll animations",
  "Change the color scheme to dark navy",
  "Add a contact form section",
  "Make it fully mobile responsive",
];

export default function EditorPage({ params }) {
  const resolvedParams = use(params);
  const { id } = resolvedParams;
  const { user, isInitialized } = useSelector((s) => s.auth);
  const router = useRouter();

  const [website, setWebsite] = useState(null);
  const [code, setCode] = useState("");
  const [titleValue, setTitleValue] = useState("");
  const [editingTitle, setEditingTitle] = useState(false);
  const [activeTab, setActiveTab] = useState("preview");
  const [deviceMode, setDeviceMode] = useState("desktop");
  const [chatOpen, setChatOpen] = useState(false);
  const [chatMessage, setChatMessage] = useState("");
  const [conversation, setConversation] = useState([]);
  const [isFixing, setIsFixing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeploying, setIsDeploying] = useState(false);
  const [isCapturing, setIsCapturing] = useState(false);
  const [deployUrl, setDeployUrl] = useState(null);
  const [deployed, setDeployed] = useState(false);
  const [deployModal, setDeployModal] = useState(false);
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [saveToast, setSaveToast] = useState(false);

  const iframeRef = useRef(null);
  const chatEndRef = useRef(null);
  const titleInputRef = useRef(null);
  const previewKey = useRef(0);

  const deviceWidths = { desktop: "100%", tablet: "768px", mobile: "390px" };

  // ── Auth + Fetch ──────────────────────────────────────────────────────────────
  useEffect(() => {
    if (isInitialized && !user) {
      router.push("/login");
      return;
    }
    if (user && id) fetchWebsite();
  }, [user, isInitialized, id]);

  const fetchWebsite = async () => {
    try {
      const res = await fetch(`${API}/${id}`, { credentials: "include" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to load");
      setWebsite(data.website);
      setCode(data.website.letestCode || "");
      setTitleValue(data.website.title || "Untitled");
      setConversation(data.website.conversation || []);
      setDeployed(data.website.deploy || false);
      setDeployUrl(data.website.deployUrl || null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [conversation]);

  // ── Title editing ─────────────────────────────────────────────────────────────
  const startTitleEdit = () => {
    setEditingTitle(true);
    setTimeout(() => titleInputRef.current?.select(), 50);
  };
  const saveTitle = async () => {
    setEditingTitle(false);
    if (!titleValue.trim() || titleValue.trim() === website?.title) return;
    try {
      await fetch(`${API}/${id}/title`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: titleValue.trim() }),
        credentials: "include",
      });
      setWebsite((w) => ({ ...w, title: titleValue.trim() }));
    } catch (err) {
      console.error(err);
    }
  };

  // ── Screenshot capture ────────────────────────────────────────────────────────
  const captureScreenshot = useCallback(async () => {
    const iframe = iframeRef.current;
    if (!iframe || isCapturing) return;
    try {
      setIsCapturing(true);
      await new Promise((r) => setTimeout(r, 800));
      const doc = iframe.contentDocument || iframe.contentWindow?.document;
      if (!doc?.body) return;
      const { default: html2canvas } = await import("html2canvas");
      const canvas = await html2canvas(doc.body, {
        useCORS: true,
        allowTaint: true,
        scale: 0.25,
        logging: false,
        width: doc.body.scrollWidth || 1280,
        height: Math.min(doc.body.scrollHeight || 720, 3000),
      });
      const dataUrl = canvas.toDataURL("image/jpeg", 0.6);
      await fetch(`${API}/${id}/thumbnail`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ thumbnail: dataUrl }),
        credentials: "include",
      });
    } catch (err) {
      console.error("Capture failed:", err);
    } finally {
      setIsCapturing(false);
    }
  }, [id, isCapturing]);

  const handleIframeLoad = useCallback(() => {
    setTimeout(captureScreenshot, 1500);
  }, [captureScreenshot]);

  // ── Save code ─────────────────────────────────────────────────────────────────
  const handleSave = async () => {
    setIsSaving(true);
    try {
      const res = await fetch(`${API}/${id}/code`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code }),
        credentials: "include",
      });
      if (!res.ok) throw new Error("Save failed");
      previewKey.current += 1;
      setActiveTab("preview");
      setSaveToast(true);
      setTimeout(() => setSaveToast(false), 2500);
    } catch (err) {
      alert(err.message);
    } finally {
      setIsSaving(false);
    }
  };

  // ── AI Fix ────────────────────────────────────────────────────────────────────
  const handleFix = async () => {
    if (!chatMessage.trim()) return;
    const msg = chatMessage.trim();
    setChatMessage("");
    setIsFixing(true);
    setConversation((c) => [...c, { role: "user", content: msg }]);
    try {
      const res = await fetch(`${API}/${id}/fix`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: msg }),
        credentials: "include",
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Fix failed");
      setCode(data.updatedCode);
      setConversation(data.conversation);
      previewKey.current += 1;
      setActiveTab("preview");
    } catch (err) {
      setConversation((c) => [
        ...c,
        { role: "assistant", content: `❌ ${err.message}` },
      ]);
    } finally {
      setIsFixing(false);
    }
  };

  // ── Deploy ────────────────────────────────────────────────────────────────────
  const handleDeploy = async () => {
    setIsDeploying(true);
    try {
      const res = await fetch(`${API}/${id}/deploy`, {
        method: "POST",
        credentials: "include",
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Deploy failed");
      setDeployed(data.deploy);
      setDeployUrl(data.deployUrl);
      if (data.deploy) setDeployModal(true);
    } catch (err) {
      alert(err.message);
    } finally {
      setIsDeploying(false);
    }
  };

  const handleCopy = () => {
    const url = `${window.location.origin}${deployUrl}`;
    navigator.clipboard.writeText(url).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const publicUrl = deployUrl
    ? `${typeof window !== "undefined" ? window.location.origin : ""}${deployUrl}`
    : "";

  // ── States ────────────────────────────────────────────────────────────────────
  if (!isInitialized || loading) {
    return (
      <div className="h-screen bg-[#0d1117] flex flex-col items-center justify-center gap-4">
        <div className="relative w-14 h-14">
          <div className="absolute inset-0 border-4 border-blue-500/10 rounded-full" />
          <div className="absolute inset-0 border-4 border-t-blue-500 border-x-transparent border-b-transparent rounded-full animate-spin" />
        </div>
        <span className="text-slate-500 text-sm">Loading editor…</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-screen bg-[#0d1117] flex flex-col items-center justify-center gap-4 text-center px-4">
        <div className="text-5xl mb-2">⚠️</div>
        <p className="text-red-400">{error}</p>
        <Link
          href="/dashboard"
          className="text-sm text-blue-400 hover:underline mt-2"
        >
          ← Back to Dashboard
        </Link>
      </div>
    );
  }

  return (
    <div
      className="flex flex-col h-screen bg-[#0d1117] overflow-hidden"
      style={{ fontFamily: "Inter, system-ui, sans-serif" }}
    >
      {/* ════════════════════ TOP BAR ════════════════════ */}
      <header className="flex items-center justify-between h-12 px-3 bg-[#161b22] border-b border-[#30363d] shrink-0 z-40 gap-2">
        {/* Left – back + editable title */}
        <div className="flex items-center gap-2 min-w-0 flex-1">
          <Link
            href="/dashboard"
            className="flex items-center justify-center w-7 h-7 rounded-md bg-[#21262d] hover:bg-[#30363d] border border-[#30363d] text-slate-400 hover:text-white transition-all shrink-0"
          >
            <svg
              className="w-3.5 h-3.5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </Link>
          <span className="text-[#30363d] hidden sm:block text-xs">•</span>

          {editingTitle ? (
            <input
              ref={titleInputRef}
              value={titleValue}
              onChange={(e) => setTitleValue(e.target.value)}
              onBlur={saveTitle}
              onKeyDown={(e) => {
                if (e.key === "Enter") saveTitle();
                if (e.key === "Escape") {
                  setEditingTitle(false);
                  setTitleValue(website?.title || "");
                }
              }}
              className="bg-[#0d1117] text-white text-sm font-medium border border-blue-500/50 rounded-md px-2 py-0.5 focus:outline-none focus:ring-2 focus:ring-blue-500/30 min-w-[100px] max-w-[180px] sm:max-w-[260px]"
              autoFocus
            />
          ) : (
            <button
              onClick={startTitleEdit}
              className="flex items-center gap-1.5 text-sm font-medium text-white hover:text-blue-400 transition-colors group max-w-[130px] sm:max-w-[230px] truncate"
              title="Click to rename"
            >
              <span className="truncate">{titleValue}</span>
              <svg
                className="w-3 h-3 text-slate-600 group-hover:text-blue-400 shrink-0 hidden sm:block"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                />
              </svg>
            </button>
          )}

          {deployed && (
            <span className="hidden sm:flex items-center gap-1 px-2 py-0.5 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-semibold rounded-full shrink-0">
              <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" />
              Live
            </span>
          )}
        </div>

        {/* Center – tabs */}
        <div className="flex bg-[#0d1117] border border-[#30363d] rounded-lg p-0.5 gap-0.5 shrink-0">
          {[
            { id: "preview", label: "Preview", icon: "👁" },
            { id: "code", label: "Code", icon: "⌨" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-2.5 py-1.5 rounded-md text-xs font-medium transition-all flex items-center gap-1.5 ${
                activeTab === tab.id
                  ? "bg-blue-600 text-white shadow-sm"
                  : "text-slate-500 hover:text-white"
              }`}
            >
              <span>{tab.icon}</span>
              <span className="hidden sm:block">{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Right – actions */}
        <div className="flex items-center gap-1.5 shrink-0">
          {/* Desktop device toggle */}
          {activeTab === "preview" && (
            <div className="hidden md:flex bg-[#0d1117] border border-[#30363d] rounded-lg p-0.5 gap-0.5">
              {[
                {
                  id: "desktop",
                  label: "Desktop",
                  path: "M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z",
                },
                {
                  id: "tablet",
                  label: "Tablet",
                  path: "M12 18h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z",
                },
                {
                  id: "mobile",
                  label: "Mobile",
                  path: "M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z",
                },
              ].map((d) => (
                <button
                  key={d.id}
                  onClick={() => setDeviceMode(d.id)}
                  title={d.label}
                  className={`p-1.5 rounded-md transition-all ${deviceMode === d.id ? "bg-[#30363d] text-white" : "text-slate-600 hover:text-slate-400"}`}
                >
                  <svg
                    className="w-3.5 h-3.5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d={d.path}
                    />
                  </svg>
                </button>
              ))}
            </div>
          )}

          {/* Save (code tab) */}
          {activeTab === "code" && (
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="flex items-center gap-1.5 px-2.5 py-1.5 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white rounded-lg text-xs font-semibold transition-all"
            >
              {isSaving ? (
                <span className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <svg
                  className="w-3.5 h-3.5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              )}
              <span className="hidden sm:block">Save</span>
            </button>
          )}

          {/* Capture thumbnail */}
          <button
            onClick={captureScreenshot}
            disabled={isCapturing}
            title="Capture thumbnail"
            className="flex items-center gap-1 px-2 py-1.5 bg-[#21262d] hover:bg-[#30363d] border border-[#30363d] text-slate-400 hover:text-white rounded-lg text-xs transition-all disabled:opacity-40"
          >
            {isCapturing ? (
              <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <svg
                className="w-3.5 h-3.5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
            )}
            <span className="hidden lg:block">Snap</span>
          </button>

          {/* AI Fix Chat */}
          <button
            onClick={() => setChatOpen((o) => !o)}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all border ${
              chatOpen
                ? "bg-violet-600 text-white border-violet-500"
                : "bg-[#21262d] hover:bg-[#30363d] border-[#30363d] text-slate-400 hover:text-white"
            }`}
          >
            <svg
              className="w-3.5 h-3.5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-4l-4 4z"
              />
            </svg>
            <span className="hidden sm:block">AI Fix</span>
            <span className="hidden sm:flex bg-violet-900/60 text-violet-300 px-1 rounded text-[9px] font-bold">
              10cr
            </span>
          </button>

          {/* Deploy */}
          <button
            onClick={handleDeploy}
            disabled={isDeploying}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all border disabled:opacity-60 ${
              deployed
                ? "bg-orange-500/10 border-orange-500/30 text-orange-400 hover:bg-orange-500/20"
                : "bg-gradient-to-r from-blue-600 to-violet-600 hover:opacity-90 text-white border-transparent shadow-[0_0_14px_rgba(99,102,241,0.3)]"
            }`}
          >
            {isDeploying ? (
              <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <svg
                className="w-3.5 h-3.5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6h.1a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                />
              </svg>
            )}
            <span className="hidden sm:block">
              {deployed ? "Unpublish" : "Deploy"}
            </span>
          </button>

          {deployed && deployUrl && (
            <a
              href={publicUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 px-2.5 py-1.5 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/20 text-emerald-400 rounded-lg text-xs font-semibold transition-all"
            >
              <svg
                className="w-3.5 h-3.5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                />
              </svg>
              <span className="hidden sm:block">Visit</span>
            </a>
          )}
        </div>
      </header>

      {/* ════════════════════ MAIN AREA ════════════════════ */}
      <div className="flex flex-1 overflow-hidden">
        {/* Preview / Code panel */}
        <div className="flex flex-col flex-1 overflow-hidden">
          <AnimatePresence mode="wait">
            {/* PREVIEW TAB */}
            {activeTab === "preview" && (
              <motion.div
                key={`preview-${previewKey.current}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.15 }}
                className="flex flex-col flex-1 overflow-hidden"
              >
                {/* Browser URL bar */}
                <div className="flex items-center gap-3 px-4 py-2 bg-[#161b22] border-b border-[#30363d] shrink-0">
                  <div className="flex gap-1.5 shrink-0">
                    <div className="w-3 h-3 rounded-full bg-red-500/70" />
                    <div className="w-3 h-3 rounded-full bg-yellow-400/70" />
                    <div className="w-3 h-3 rounded-full bg-emerald-500/70" />
                  </div>
                  <div className="flex-1 bg-[#0d1117] border border-[#30363d] rounded-md px-3 py-1 text-xs text-slate-500 font-mono truncate">
                    {deployed ? publicUrl : "⚡ preview – localhost"}
                  </div>
                  {/* Mobile device toggle */}
                  <div className="flex md:hidden bg-[#0d1117] border border-[#30363d] rounded-md p-0.5 gap-0.5 shrink-0">
                    {["desktop", "mobile"].map((d) => (
                      <button
                        key={d}
                        onClick={() => setDeviceMode(d)}
                        className={`px-2 py-1 rounded text-[11px] transition-all ${deviceMode === d ? "bg-[#30363d] text-white" : "text-slate-600"}`}
                      >
                        {d === "desktop" ? "🖥" : "📱"}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Iframe */}
                <div className="flex-1 overflow-auto bg-[#1c2128] flex justify-center items-start">
                  <div
                    className="h-full transition-all duration-500"
                    style={{
                      width: deviceWidths[deviceMode],
                      minHeight: "100%",
                    }}
                  >
                    {code ? (
                      <iframe
                        ref={iframeRef}
                        key={previewKey.current}
                        srcDoc={code}
                        title="preview"
                        className="w-full h-full border-0 bg-white"
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

            {/* CODE TAB */}
            {activeTab === "code" && (
              <motion.div
                key="code"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.15 }}
                className="flex flex-1 overflow-hidden"
              >
                {/* Line numbers */}
                <div
                  aria-hidden
                  className="bg-[#0d1117] text-slate-700 font-mono text-xs leading-[1.625rem] select-none py-3 pr-3 pl-2 text-right shrink-0 border-r border-[#21262d] overflow-hidden"
                  style={{ minWidth: "3rem" }}
                >
                  {code.split("\n").map((_, i) => (
                    <div key={i}>{i + 1}</div>
                  ))}
                </div>
                {/* Textarea */}
                <textarea
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  className="flex-1 h-full bg-[#0d1117] text-[#e6edf3] font-mono text-xs leading-[1.625rem] resize-none focus:outline-none p-3 overflow-auto"
                  spellCheck={false}
                  autoComplete="off"
                  autoCorrect="off"
                  style={{ tabSize: 2 }}
                  placeholder="<!-- HTML code appears here -->"
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* ════════════════════ AI CHAT SIDEBAR ════════════════════ */}
        <AnimatePresence>
          {chatOpen && (
            <motion.div
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: 340, opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              transition={{ duration: 0.22, ease: "easeInOut" }}
              className="flex flex-col bg-[#161b22] border-l border-[#30363d] overflow-hidden shrink-0"
            >
              <div className="flex flex-col h-full" style={{ minWidth: 300 }}>
                {/* Header */}
                <div className="flex items-center justify-between px-4 py-3 border-b border-[#30363d] shrink-0">
                  <div>
                    <div className="flex items-center gap-2 text-white font-semibold text-sm">
                      <span className="w-2 h-2 bg-violet-500 rounded-full animate-pulse" />
                      AI Fix Chat
                    </div>
                    <p className="text-slate-500 text-[11px] mt-0.5">
                      10 credits per fix
                      {user?.credits !== undefined && (
                        <span className="text-slate-600 ml-1.5">
                          · {user.credits} remaining
                        </span>
                      )}
                    </p>
                  </div>
                  <button
                    onClick={() => setChatOpen(false)}
                    className="text-slate-600 hover:text-white transition-colors"
                  >
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-3 space-y-3">
                  {conversation.length === 0 && (
                    <div className="text-center py-8">
                      <div className="w-12 h-12 rounded-2xl bg-violet-500/10 border border-violet-500/20 flex items-center justify-center mx-auto mb-3">
                        <svg
                          className="w-6 h-6 text-violet-400"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={1.5}
                            d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z"
                          />
                        </svg>
                      </div>
                      <p className="text-slate-500 text-xs mb-4">
                        Try a quick suggestion:
                      </p>
                      <div className="space-y-1.5">
                        {SUGGESTIONS.map((s) => (
                          <button
                            key={s}
                            onClick={() => setChatMessage(s)}
                            className="w-full text-left text-xs px-3 py-2 bg-[#21262d] hover:bg-[#30363d] border border-[#30363d] hover:border-violet-500/30 text-slate-400 hover:text-slate-200 rounded-lg transition-all"
                          >
                            {s}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {conversation.map((msg, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`flex gap-2 ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                    >
                      {msg.role === "assistant" && (
                        <div className="w-6 h-6 rounded-full bg-violet-600 flex items-center justify-center text-[11px] shrink-0 mt-0.5">
                          ✨
                        </div>
                      )}
                      <div
                        className={`max-w-[85%] px-3 py-2 rounded-xl text-xs leading-relaxed ${
                          msg.role === "user"
                            ? "bg-blue-600 text-white rounded-tr-sm"
                            : "bg-[#21262d] border border-[#30363d] text-slate-300 rounded-tl-sm"
                        }`}
                      >
                        {msg.content}
                      </div>
                    </motion.div>
                  ))}

                  {isFixing && (
                    <div className="flex gap-2 justify-start">
                      <div className="w-6 h-6 rounded-full bg-violet-600 flex items-center justify-center text-[11px] shrink-0 animate-pulse">
                        ✨
                      </div>
                      <div className="bg-[#21262d] border border-[#30363d] px-3 py-2.5 rounded-xl rounded-tl-sm flex items-center gap-1.5">
                        {[0, 150, 300].map((d) => (
                          <span
                            key={d}
                            className="w-1.5 h-1.5 bg-violet-400 rounded-full animate-bounce"
                            style={{ animationDelay: `${d}ms` }}
                          />
                        ))}
                        <span className="text-slate-600 text-[11px] ml-1">
                          Updating website…
                        </span>
                      </div>
                    </div>
                  )}
                  <div ref={chatEndRef} />
                </div>

                {/* Input */}
                <div className="p-3 border-t border-[#30363d] shrink-0">
                  <div className="flex gap-2">
                    <textarea
                      rows={2}
                      value={chatMessage}
                      onChange={(e) => setChatMessage(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && !e.shiftKey) {
                          e.preventDefault();
                          handleFix();
                        }
                      }}
                      disabled={isFixing}
                      placeholder="Describe your change…"
                      className="flex-1 bg-[#0d1117] text-slate-200 placeholder-slate-600 border border-[#30363d] focus:border-violet-500/50 rounded-xl px-3 py-2 text-xs resize-none focus:outline-none transition-colors disabled:opacity-50"
                    />
                    <button
                      onClick={handleFix}
                      disabled={!chatMessage.trim() || isFixing}
                      className="px-3 self-end py-2 bg-violet-600 hover:bg-violet-500 disabled:opacity-40 disabled:cursor-not-allowed text-white rounded-xl transition-all"
                    >
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                        />
                      </svg>
                    </button>
                  </div>
                  <p className="text-slate-700 text-[10px] mt-1.5 text-center">
                    ↵ send · ⇧↵ new line
                  </p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ════════════════════ SAVE TOAST ════════════════════ */}
      <AnimatePresence>
        {saveToast && (
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 40 }}
            className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 px-4 py-2.5 bg-emerald-600 text-white rounded-xl shadow-lg text-sm font-semibold"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
            Code saved & preview updated
          </motion.div>
        )}
      </AnimatePresence>

      {/* ════════════════════ DEPLOY MODAL ════════════════════ */}
      <AnimatePresence>
        {deployModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm px-4"
            onClick={(e) =>
              e.target === e.currentTarget && setDeployModal(false)
            }
          >
            <motion.div
              initial={{ scale: 0.9, y: 20, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.9, y: 20, opacity: 0 }}
              className="bg-[#161b22] border border-[#30363d] rounded-2xl p-6 max-w-sm w-full shadow-2xl"
            >
              <div className="text-center mb-5">
                <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mx-auto mb-4 text-2xl">
                  🚀
                </div>
                <h2 className="text-white font-bold text-lg">Deployed!</h2>
                <p className="text-slate-500 text-xs mt-1">
                  Your website is now publicly live at:
                </p>
              </div>
              <div className="bg-[#0d1117] border border-[#30363d] rounded-xl p-3 mb-4 flex items-center gap-2">
                <span className="text-emerald-400 text-xs font-mono truncate flex-1">
                  {publicUrl}
                </span>
                <button
                  onClick={handleCopy}
                  className="shrink-0 px-2.5 py-1 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/20 text-emerald-400 rounded-lg text-xs font-semibold transition-all"
                >
                  {copied ? "✓ Copied!" : "Copy"}
                </button>
              </div>
              <div className="flex gap-2">
                <a
                  href={publicUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 py-2.5 text-center bg-gradient-to-r from-blue-600 to-violet-600 hover:opacity-90 text-white rounded-xl text-xs font-semibold transition-all"
                >
                  Open Site ↗
                </a>
                <button
                  onClick={() => setDeployModal(false)}
                  className="flex-1 py-2.5 bg-[#21262d] hover:bg-[#30363d] border border-[#30363d] text-slate-400 hover:text-white rounded-xl text-xs font-semibold transition-all"
                >
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
