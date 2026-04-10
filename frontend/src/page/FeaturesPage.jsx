"use client";

import React from "react";
import Navber from "@/componentes/Navber";
import { motion } from "motion/react";

const features = [
  {
    title: "AI-Powered Generation",
    description: "Simply describe your vision, and our advanced AI will generate a complete, responsive website in seconds.",
    icon: "🧠",
    color: "from-blue-500 to-indigo-500",
  },
  {
    title: "Instant Deployment",
    description: "Launch your website globally with one click. We handle the hosting, CDN, and SSL certificates automatically.",
    icon: "🚀",
    color: "from-purple-500 to-pink-500",
  },
  {
    title: "No-Code Editor",
    description: "Fine-tune your generated site with our intuitive drag-and-drop editor. No coding experience required.",
    icon: "🎨",
    color: "from-emerald-400 to-teal-500",
  },
  {
    title: "SEO Optimized",
    description: "Built-in best practices ensure your site ranks higher on search engines right out of the box.",
    icon: "📈",
    color: "from-amber-400 to-orange-500",
  },
  {
    title: "Enterprise Security",
    description: "Bank-level encryption and DDoS protection keep your data and your users safe around the clock.",
    icon: "🔒",
    color: "from-red-400 to-rose-500",
  },
  {
    title: "Custom Domains",
    description: "Connect your own domain name easily to establish your brand's unique professional identity.",
    icon: "🌐",
    color: "from-cyan-400 to-blue-500",
  },
];

export default function FeaturesPage() {
  return (
    <>
      <Navber />
      <div className="min-h-screen bg-[#0a0f1e] pt-32 pb-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        {/* Background Effects */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-blue-600/20 blur-[120px] rounded-full pointer-events-none" />
        
        <div className="max-w-7xl mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-20"
          >
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white mb-6 tracking-tight">
              Powerful Features for <br />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-violet-400">
                Modern Web Creators
              </span>
            </h1>
            <p className="text-lg text-slate-400 max-w-2xl mx-auto">
              Everything you need to build, launch, and scale stunning websites without writing a single line of code.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="group relative p-[1px] rounded-2xl overflow-hidden"
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-sm`} />
                <div className="relative h-full bg-[#0f172a]/90 backdrop-blur-xl p-8 rounded-2xl border border-white/10 hover:border-transparent transition-colors z-10">
                  <div className={`w-14 h-14 rounded-xl mb-6 flex items-center justify-center text-3xl bg-gradient-to-br ${feature.color} bg-opacity-20 shadow-lg`}>
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-bold text-white mb-3">{feature.title}</h3>
                  <p className="text-slate-400 leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
