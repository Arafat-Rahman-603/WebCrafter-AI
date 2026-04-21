"use client";

import React, { useEffect, useState, use } from "react";
import { motion } from "motion/react";
import Link from "next/link";

export default function ViewPage({ params }) {
  const resolvedParams = use(params);
  const { slug } = resolvedParams;
  const [html, setHtml] = useState(null);
  const [title, setTitle] = useState("WebCrafter AI");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSite = async () => {
      try {
        const res = await fetch(
          `https://webcrafter-ai-server.vercel.app/api/website/public/${slug}`,
        );
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || "Not found");
        setHtml(data.website.letestCode);
        setTitle(data.website.title || "WebCrafter AI");
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchSite();
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0f1e] flex flex-col items-center justify-center gap-4 font-sans">
        <div className="w-12 h-12 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin" />
        <p className="text-slate-400 text-sm animate-pulse">
          Loading your website...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#0a0f1e] flex flex-col items-center justify-center gap-6 font-sans px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center max-w-md"
        >
          <div className="w-20 h-20 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg
              className="w-10 h-10 text-red-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">Site Not Found</h1>
          <p className="text-slate-400 text-sm mb-6">
            This website is either not deployed or the link is incorrect.
            <br />
            {error}
          </p>
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-semibold text-sm transition-all"
          >
            ← Back to WebCrafter AI
          </Link>
          <p className="text-slate-600 text-xs mt-6">
            Powered by{" "}
            <Link href="/" className="text-blue-500 hover:text-blue-400">
              WebCrafter AI
            </Link>
          </p>
        </motion.div>
      </div>
    );
  }

  return (
    <>
      {/* Tiny watermark bar */}
      <div className="fixed bottom-0 left-0 right-0 z-50 pointer-events-none flex justify-center pb-2">
        <a
          href="/"
          target="_blank"
          rel="noopener noreferrer"
          className="pointer-events-auto bg-black/60 backdrop-blur-md border border-white/10 text-xs text-slate-400 hover:text-white px-4 py-1.5 rounded-full transition-colors flex items-center gap-2"
        >
          <span className="w-1.5 h-1.5 bg-blue-500 rounded-full" />
          Built with WebCrafter AI
        </a>
      </div>
      {/* Full-page iframe */}
      <iframe
        srcDoc={html}
        title={title}
        className="w-full border-0"
        style={{ height: "100vh", display: "block" }}
        sandbox="allow-scripts allow-same-origin"
      />
    </>
  );
}
