"use client";

import React from "react";
import Navber from "@/componentes/Navber";
import { motion } from "motion/react";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";

// Hardcoded articles mirroring the blog page
const articlesData = {
  "introducing-webcrafter-ai-v2": {
    title: "Introducing WebCrafter AI v2.0: The Future of Web Dev",
    category: "Product",
    date: "Aug 15, 2026",
    readTime: "5 min read",
    author: "Jane Doe",
    authorRole: "CEO & Co-founder",
    image: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?q=80&w=1000&auto=format&fit=crop",
    content: `
      <p>Today, we're thrilled to announce the next generation of our AI-powered website builder. We've completely rebuilt the engine from the ground up to ensure you can build not just fast, but seamlessly.</p>
      <h2>What's New in v2.0?</h2>
      <p>We’ve listened to thousands of pieces of feedback over the past year. <strong>WebCrafter AI v2.0</strong> is the culmination of those insights. The new engine boasts a 3x faster generation speed, allowing you to see your components instantly.</p>
      <ul>
        <li>Lightning-fast component rendering</li>
        <li>Enhanced dark mode generation algorithms</li>
        <li>Seamless export to Next.js and Tailwind CSS</li>
      </ul>
      <p>This is just the beginning. The future of web development is prompt-based, and we're excited to lead the charge.</p>
    `
  },
  "optimize-react-applications-speed": {
    title: "How to Optimize Your React Applications for Speed",
    category: "Engineering",
    date: "Aug 02, 2026",
    readTime: "8 min read",
    author: "Alex Smith",
    authorRole: "Lead Engineer",
    image: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=1000&auto=format&fit=crop",
    content: `
      <p>Performance is critical for user retention. Let's dive deep into the techniques we use internally to make React apps blaze through renders.</p>
      <h2>Minimize Re-renders</h2>
      <p>The most common cause of slow React applications is unnecessary re-renders. Always ensure you are memoizing expensive computations with <code>useMemo</code> and isolating state whenever possible.</p>
      <h2>Code Splitting</h2>
      <p>Never ship a monolithic bundle. Break your code apart using dynamic imports. Next.js handles this exceptionally well right out of the box, but you should still be mindful of your component trees.</p>
    `
  },
  "design-philosophy-dark-mode": {
    title: "The Design Philosophy Behind Dark Mode",
    category: "Design",
    date: "Jul 21, 2026",
    readTime: "6 min read",
    author: "Elena Vasquez",
    authorRole: "Principal Designer",
    image: "https://images.unsplash.com/photo-1542831371-29b0f74f9713?q=80&w=1000&auto=format&fit=crop",
    content: `
      <p>It's more than just flipping colors. Dark mode requires a careful review of contrast, saturation, and depth to reduce eye strain gracefully.</p>
      <h2>Avoid Pure Black</h2>
      <p>Pure black (`+ "`" + `#000000` + "`" + `) causes severe eye strain when contrasted with white text. Instead, we use dark slate grays like we do here on WebCrafter AI.</p>
      <h2>Use Elevation for Depth</h2>
      <p>Unlike light mode where shadows indicate depth, dark mode uses lightness. Surfaces closer to the user should be a lighter shade of your background color.</p>
    `
  },
  "why-ai-will-not-replace-developers": {
    title: "Why AI Will Not Replace Developers",
    category: "Opinion",
    date: "Jul 10, 2026",
    readTime: "7 min read",
    author: "Michael Chang",
    authorRole: "Developer Advocate",
    image: "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?q=80&w=1000&auto=format&fit=crop",
    content: `
      <p>A look into how AI serves as a powerful exoskeleton for engineers, allowing them to solve grander architectural challenges rather than disappearing.</p>
      <h2>The Shift in Abstraction</h2>
      <p>We've moved from Assembly to C, from C to Javascript, and now from Javascript to Prompting. The nature of problem-solving remains; we are simply operating at a higher level of abstraction.</p>
    `
  }
};

export default function SingleArticlePage() {
  const params = useParams();
  const slug = params?.slug;
  const article = articlesData[slug];

  if (!article) {
    return (
      <>
        <Navber />
        <div className="min-h-screen bg-[#0a0f1e] flex flex-col items-center justify-center text-white px-4">
          <h1 className="text-4xl font-bold mb-4">Article Not Found</h1>
          <p className="text-slate-400 mb-8">{"The blog post you're looking for doesn't exist."}</p>
          <Link href="/blog" className="px-6 py-3 rounded-full bg-blue-600 hover:bg-blue-500 font-medium transition-colors">
            Back to Blog
          </Link>
        </div>
      </>
    );
  }

  return (
    <>
      <Navber />
      <article className="min-h-screen bg-[#0a0f1e] pt-12 pb-24 relative overflow-hidden">
        {/* Background glow */}
        <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-blue-500/5 blur-[150px] rounded-full pointer-events-none" />

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <Link href="/blog" className="inline-flex items-center text-slate-400 hover:text-blue-400 transition-colors mb-10 text-sm font-medium">
            <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16l-4-4m0 0l4-4m-4 4h18" />
            </svg>
            Back to all articles
          </Link>

          <header className="mb-12">
            <div className="flex items-center gap-3 mb-6">
              <span className="bg-[#0f172a] border border-white/10 px-3 py-1 rounded-full text-xs font-semibold text-white">
                {article.category}
              </span>
              <span className="text-slate-500 text-sm font-medium">{article.date}</span>
              <span className="w-1 h-1 rounded-full bg-slate-600"></span>
              <span className="text-slate-500 text-sm font-medium">{article.readTime}</span>
            </div>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white leading-tight mb-8">
              {article.title}
            </h1>

            <div className="flex items-center gap-4 border-t border-b border-white/5 py-6 mb-8">
              <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-blue-500 to-violet-500 p-[2px]">
                <div className="w-full h-full rounded-full bg-[#0a0f1e] flex items-center justify-center font-bold text-white uppercase">
                  {article.author.charAt(0)}
                </div>
              </div>
              <div>
                <div className="text-white font-semibold">{article.author}</div>
                <div className="text-slate-400 text-sm">{article.authorRole}</div>
              </div>
            </div>
          </header>

          {/* Featured Image */}
          <div className="relative w-full aspect-[21/9] rounded-2xl overflow-hidden mb-16 ring-1 ring-white/10 shadow-2xl">
            <Image 
              src={article.image} 
              alt={article.title} 
              fill 
              className="object-cover"
              priority
            />
          </div>

          {/* Article Content */}
          <div 
            className="prose prose-invert prose-lg prose-blue max-w-none text-slate-300
              prose-headings:text-white prose-headings:font-bold prose-headings:tracking-tight
              prose-h2:text-3xl prose-h2:mt-12 prose-h2:mb-6
              prose-p:leading-relaxed prose-p:mb-6
              prose-a:text-blue-400 hover:prose-a:text-blue-300
              prose-li:marker:text-blue-500 prose-ul:mb-6"
            dangerouslySetInnerHTML={{ __html: article.content }}
          />

          {/* Footer of the article */}
          <div className="mt-20 pt-10 border-t border-white/10 flex flex-col sm:flex-row justify-between items-center gap-6">
            <h4 className="text-white font-semibold text-xl">Enjoyed this article?</h4>
            <div className="flex gap-4">
               <button className="px-6 py-2.5 rounded-full bg-[#0f172a] text-white font-medium hover:bg-[#1e293b] border border-white/10 transition-colors flex items-center gap-2">
                 <svg className="w-5 h-5 text-blue-400" fill="currentColor" viewBox="0 0 24 24"><path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/></svg>
                 Share on Twitter
               </button>
            </div>
          </div>
        </div>
      </article>  
    </>
  );
}
