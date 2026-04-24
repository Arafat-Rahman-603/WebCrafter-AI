"use client";

import React from "react";
import Navber from "@/componentes/Navber";
import Link from "next/link";
import { useParams,useRouter } from "next/navigation";

// Hardcoded jobs mirroring the careers page
const jobsData = {
  "senior-full-stack-engineer": {
    title: "Senior Full-Stack Engineer",
    department: "Engineering",
    location: "Remote",
    type: "Full-time",
    description: `
      <h2>About the Role</h2>
      <p>As a Senior Full-Stack Engineer at WebCrafter AI, you will be instrumental in architecting and building the core platform that powers our AI website generator. You'll work across the stack, touching heavily optimized React frontends, Node.js/Go backends, and working closely with our ML models.</p>
      
      <h2>What You'll Do</h2>
      <ul>
        <li>Architect scalable cloud infrastructure to support high-throughput Next.js app generations.</li>
        <li>Build seamless, highly interactive UIs using React, Framer Motion, and Tailwind CSS.</li>
        <li>Collaborate with AI scientists to integrate the latest LLM capabilities directly into the visual editor.</li>
        <li>Mentor junior engineers and set engineering standards for the team.</li>
      </ul>

      <h2>Qualifications</h2>
      <ul>
        <li>5+ years of production experience in JavaScript/TypeScript and React ecosystems.</li>
        <li>Deep understanding of Next.js App Router and server components.</li>
        <li>Experience with robust system architecture and scaling complex web applications.</li>
        <li>Strong communication skills and a product-minded approach.</li>
      </ul>
    `
  },
  "ai-research-scientist": {
    title: "AI Research Scientist",
    department: "AI/ML",
    location: "San Francisco, CA",
    type: "Full-time",
    description: `
      <h2>About the Role</h2>
      <p>We are searching for a Research Scientist to push the boundaries of what is possible with code generation. You will be training custom foundational models and fine-tuning existing ones to perfectly translate natural language into semantic HTML and pristine React code.</p>
      
      <h2>What You'll Do</h2>
      <ul>
        <li>Develop and train novel LLM architectures focused on flawless UI/UX generation.</li>
        <li>Create evaluation frameworks to test model performance on edge-case layout requests.</li>
        <li>Publish research unblocking the industry's approach to AI-native website building.</li>
      </ul>

      <h2>Qualifications</h2>
      <ul>
        <li>Ph.D. or Master's in Computer Science, Machine Learning, or related fields.</li>
        <li>Proven track record of publishing in top-tier conferences (NeurIPS, ICML, ICLR).</li>
        <li>Deep expertise in PyTorch and transformer architectures.</li>
      </ul>
    `
  },
  "product-designer": {
    title: "Product Designer",
    department: "Design",
    location: "Remote",
    type: "Contract",
    description: `
      <h2>About the Role</h2>
      <p>We need a visionary Product Designer who lives and breathes high-end SaaS aesthetics. You will not just be designing our software; you will be designing the design system that our AI uses to generate websites for our customers.</p>
      
      <h2>What You'll Do</h2>
      <ul>
        <li>Design intuitive interfaces for the WebCrafter canvas and dashboard.</li>
        <li>Create comprehensive Figma systems that serve as the ground truth for our AI generation models.</li>
        <li>Work closely with the frontend team to ensure pixel-perfect implementation of micro-interactions.</li>
      </ul>

      <h2>Qualifications</h2>
      <ul>
        <li>A stunning portfolio demonstrating mastery in SaaS product design and dark mode typography.</li>
        <li>Expertise in Figma, auto-layout, and prototyping.</li>
        <li>Strong understanding of HTML/CSS capabilities to ensure designs are web-feasible.</li>
      </ul>
    `
  },
  "developer-advocate": {
    title: "Developer Advocate",
    department: "Marketing",
    location: "Remote",
    type: "Full-time",
    description: `
      <h2>About the Role</h2>
      <p>As our first Developer Advocate, you will be the bridge between WebCrafter AI and the global developer community. You will showcase how developers can leverage our tool to 10x their freelance or agency businesses.</p>
      
      <h2>What You'll Do</h2>
      <ul>
        <li>Create high-quality tutorials, videos, and documentation.</li>
        <li>Speak at conferences and host webinars to demonstrate platform capabilities.</li>
        <li>Gather feedback from the community and advocate for their needs internally with the product team.</li>
      </ul>

      <h2>Qualifications</h2>
      <ul>
        <li>Strong technical background with React and Next.js.</li>
        <li>Exceptional written and verbal communication skills.</li>
        <li>Existing presence or experience building developer communities is a huge plus.</li>
      </ul>
    `
  }
};

export default function SingleCareerPage() {
  const router = useRouter()
  const params = useParams();
  const slug = params?.slug;
  const job = jobsData[slug];

  if (!job) {
    return (
      <>
        <Navber />
        <div className="min-h-screen bg-[#0a0f1e] flex flex-col items-center justify-center text-white px-4">
          <h1 className="text-4xl font-bold mb-4">Position Not Found</h1>
          <p className="text-slate-400 mb-8">{"The job opening you're looking for doesn't exist or has been closed"}.</p>
          <Link href="/careers" className="px-6 py-3 rounded-full bg-blue-600 hover:bg-blue-500 font-medium transition-colors">
            Back to Careers
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
        <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-violet-600/10 blur-[150px] rounded-full pointer-events-none" />

        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <Link href="/careers" className="inline-flex items-center text-slate-400 hover:text-blue-400 transition-colors mb-10 text-sm font-medium">
            <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16l-4-4m0 0l4-4m-4 4h18" />
            </svg>
            All Open Positions
          </Link>

          <header className="mb-12 border-b border-white/5 pb-12">
            <h1 className="text-4xl md:text-5xl font-extrabold text-white leading-tight mb-6">
              {job.title}
            </h1>
            
            <div className="flex flex-wrap items-center gap-4 text-sm text-slate-400 font-medium bg-[#0f172a]/50 p-4 rounded-xl border border-white/5 inline-flex">
              <span className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                {job.department}
              </span>
              <span className="w-px h-4 bg-white/10"></span>
              <span className="flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                {job.location}
              </span>
              <span className="w-px h-4 bg-white/10"></span>
              <span className="flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {job.type}
              </span>
            </div>
          </header>

          {/* Job Description Content */}
          <div 
            className="prose prose-invert prose-lg prose-blue max-w-none text-slate-300
              prose-headings:text-white prose-headings:font-bold prose-headings:tracking-tight
              prose-h2:text-2xl prose-h2:mt-12 prose-h2:mb-6
              prose-p:leading-relaxed prose-p:mb-6
              prose-li:marker:text-blue-500 prose-ul:mb-8 prose-ul:space-y-2
              prose-strong:text-white"
            dangerouslySetInnerHTML={{ __html: job.description }}
          />

          {/* Apply Section */}
          <div className="mt-16 pt-10 border-t border-white/10 flex flex-col sm:flex-row justify-between items-center gap-6 bg-[#0f172a]/30 p-8 rounded-2xl border-white/5">
            <div>
              <h4 className="text-white font-semibold text-xl mb-2">Ready to join us?</h4>
              <p className="text-slate-400 text-sm">Please include your resume and any relevant links (GitHub, portfolio, etc).</p>
            </div>
            
            <button onClick={() => router.push('/contact')} className="whitespace-nowrap px-8 py-4 text-base font-semibold text-white rounded-xl transition-all duration-300 active:scale-95 shadow-[0_0_20px_rgba(59,130,246,0.3)] hover:shadow-[0_0_25px_rgba(59,130,246,0.5)]"
              style={{ background: "linear-gradient(135deg, #3b82f6 0%, #6d28d9 100%)" }}
            >
              Apply for this position
            </button>
          </div>
        </div>
      </article>
    </>
  );
}
