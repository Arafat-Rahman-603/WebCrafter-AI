"use client";

import React from "react";
import Navber from "@/componentes/Navber";
import { motion } from "motion/react";
import Link from "next/link";

const jobs = [
  {
    title: "Senior Full-Stack Engineer",
    slug: "senior-full-stack-engineer",
    department: "Engineering",
    location: "Remote",
    type: "Full-time",
  },
  {
    title: "AI Research Scientist",
    slug: "ai-research-scientist",
    department: "AI/ML",
    location: "San Francisco, CA",
    type: "Full-time",
  },
  {
    title: "Product Designer",
    slug: "product-designer",
    department: "Design",
    location: "Remote",
    type: "Contract",
  },
  {
    title: "Developer Advocate",
    slug: "developer-advocate",
    department: "Marketing",
    location: "Remote",
    type: "Full-time",
  },
];

export default function CareersPage() {
  return (
    <>
      <Navber />
      <div className="min-h-screen bg-[#0a0f1e] pt-12 pb-24 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        {/* Decorative Effects */}
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-violet-500/10 blur-[150px] rounded-full pointer-events-none" />
        <div className="absolute top-1/2 left-0 w-[400px] h-[400px] bg-blue-600/10 blur-[120px] rounded-full pointer-events-none" />

        <div className="max-w-4xl mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white mb-6">
              Join Our{" "}
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-violet-400">
                Mission
              </span>
            </h1>
            <p className="text-lg text-slate-400 max-w-2xl mx-auto">
              {"Help us redefine how the world builds software. We're looking for passionate individuals to join our growing team."}
            </p>
          </motion.div>

          <div className="grid gap-6">
            {jobs.map((job, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                className="group p-6 rounded-2xl bg-[#0f172a]/50 border border-white/5 hover:border-blue-500/30 transition-all duration-300 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 cursor-pointer"
              >
                <div>
                  <h3 className="text-xl font-bold text-white group-hover:text-blue-400 transition-colors mb-2">
                    {job.title}
                  </h3>
                  <div className="flex flex-wrap items-center gap-3 text-sm text-slate-400">
                    <span className="bg-white/5 px-3 py-1 rounded-full">{job.department}</span>
                    <span className="flex items-center gap-1">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      {job.location}
                    </span>
                    <span className="flex items-center gap-1">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      {job.type}
                    </span>
                  </div>
                </div>
                
                <Link href={`/careers/${job.slug}`} className="hidden sm:flex items-center gap-2 text-blue-400 font-semibold opacity-0 group-hover:opacity-100 transition-opacity translate-x-2 group-hover:translate-x-0">
                  View Details
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              </motion.div>
            ))}
          </div>

          <div className="mt-16 text-center border-t border-white/5 pt-12">
            <h3 className="text-xl font-bold text-white mb-4">{"Don't see a fit?"}</h3>
            <p className="text-slate-400 mb-6">
              {"We're always looking for talented people. Send us your resume and we'll reach out when a position opens up."}
            </p>
            <button className="px-6 py-3 rounded-full bg-white/5 hover:bg-white/10 text-white font-medium border border-white/10 transition-all">
              Send Resume
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
