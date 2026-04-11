"use client";

import React from "react";
import Navber from "@/componentes/Navber";
import { motion } from "motion/react";
import Link from "next/link";
import Image from "next/image";

const posts = [
  {
    title: "Introducing WebCrafter AI v2.0: The Future of Web Dev",
    slug: "introducing-webcrafter-ai-v2",
    category: "Product",
    date: "Aug 15, 2026",
    readTime: "5 min read",
    image: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?q=80&w=1000&auto=format&fit=crop",
    excerpt: "Today, we're thrilled to announce the next generation of our AI-powered website builder. We've completely rebuilt the engine from the ground up.",
  },
  {
    title: "How to Optimize Your React Applications for Speed",
    slug: "optimize-react-applications-speed",
    category: "Engineering",
    date: "Aug 02, 2026",
    readTime: "8 min read",
    image: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=1000&auto=format&fit=crop",
    excerpt: "Performance is critical for user retention. Let's dive deep into the techniques we use internally to make React apps blaze through renders.",
  },
  {
    title: "The Design Philosophy Behind Dark Mode",
    slug: "design-philosophy-dark-mode",
    category: "Design",
    date: "Jul 21, 2026",
    readTime: "6 min read",
    image: "https://images.unsplash.com/photo-1542831371-29b0f74f9713?q=80&w=1000&auto=format&fit=crop",
    excerpt: "It's more than just flipping colors. Dark mode requires a careful review of contrast, saturation, and depth to reduce eye strain gracefully.",
  },
  {
    title: "Why AI Will Not Replace Developers",
    slug: "why-ai-will-not-replace-developers",
    category: "Opinion",
    date: "Jul 10, 2026",
    readTime: "7 min read",
    image: "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?q=80&w=1000&auto=format&fit=crop",
    excerpt: "A look into how AI serves as a powerful exoskeleton for engineers, allowing them to solve grander architectural challenges rather than disappearing.",
  },
];

export default function BlogPage() {
  return (
    <>
      <Navber />
      <div className="min-h-screen bg-[#0a0f1e] pt-112 pb-24 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        {/* Decorative Effects */}
        <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-blue-500/10 blur-[150px] rounded-full pointer-events-none" />
        
        <div className="max-w-7xl mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-16"
          >
            <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-4">
              News & <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-violet-400">Insights</span>
            </h1>
            <p className="text-lg text-slate-400 max-w-2xl">
              Stay up to date with the latest product updates, engineering deep dives, and company news.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {posts.map((post, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="group rounded-2xl overflow-hidden bg-[#0f172a]/50 border border-white/5 hover:border-white/10 transition-colors flex flex-col h-full"
              >
                <div className="relative h-64 w-full overflow-hidden">
                  <Image 
                    src={post.image} 
                    alt={post.title} 
                    fill 
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute top-4 left-4 bg-[#0a0f1e]/80 backdrop-blur-md px-3 py-1 rounded-full text-xs font-semibold text-white border border-white/10">
                    {post.category}
                  </div>
                </div>
                
                <div className="p-8 flex flex-col flex-1">
                  <div className="flex items-center gap-4 text-xs text-slate-400 mb-4 font-medium uppercase tracking-wider">
                    <span>{post.date}</span>
                    <span className="w-1 h-1 rounded-full bg-slate-600"></span>
                    <span>{post.readTime}</span>
                  </div>
                  
                  <h3 className="text-2xl font-bold text-white mb-3 group-hover:text-blue-400 transition-colors">
                    {post.title}
                  </h3>
                  
                  <p className="text-slate-400 mb-6 flex-1 line-clamp-3 leading-relaxed">
                    {post.excerpt}
                  </p>
                  
                  <Link href={`/blog/${post.slug}`} className="inline-flex items-center text-blue-400 font-semibold group-hover:text-blue-300">
                    Read article
                    <svg className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>

        </div>
      </div>
    </>
  );
}
