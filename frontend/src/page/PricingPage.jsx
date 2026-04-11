"use client";

import React from "react";
import Navber from "@/componentes/Navber";
import { motion } from "motion/react";

const plans = [
  {
    name: "Starter",
    price: "Free",
    description: "Perfect for individuals and hobbyists trying out AI website generation.",
    features: [
      "3 AI Website Generations / month",
      "Basic Templates",
      "WebCrafter Subdomain",
      "Community Support",
    ],
    highlight: false,
    buttonText: "Start for Free",
  },
  {
    name: "Pro",
    price: "$29",
    period: "/month",
    description: "Ideal for freelancers and professionals building stunning client sites.",
    features: [
      "Unlimited AI Generations",
      "Premium Templates & Components",
      "Custom Domain Support",
      "Export to React/Next.js Code",
      "Priority Email Support",
    ],
    highlight: true,
    buttonText: "Get Pro",
  },
  {
    name: "Enterprise",
    price: "Custom",
    description: "For agencies and large teams requiring advanced collaboration and security.",
    features: [
      "Everything in Pro",
      "Custom AI Model Training",
      "Advanced Team Collaboration",
      "Dedicated Account Manager",
      "99.9% Uptime SLA",
      "White-label options",
    ],
    highlight: false,
    buttonText: "Contact Sales",
  },
];

export default function PricingPage() {
  return (
    <>
      <Navber />
      <div className="min-h-screen bg-[#0a0f1e] pt-12 pb-24 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        {/* Decorative Effects */}
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-blue-500/10 blur-[150px] rounded-full pointer-events-none" />
        <div className="absolute bottom-[-10%] left-[10%] w-[500px] h-[500px] bg-violet-600/10 blur-[120px] rounded-full pointer-events-none" />

        <div className="max-w-7xl mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white mb-6 tracking-tight">
              Simple, transparent <br className="hidden md:block" />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-violet-400">
                pricing for everyone
              </span>
            </h1>
            <p className="text-lg text-slate-400 max-w-2xl mx-auto">
              Choose the perfect plan to accelerate your web development journey with AI. No hidden fees or surprises.
            </p>
          </motion.div>

          {/* Pricing Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center max-w-6xl mx-auto">
            {plans.map((plan, index) => (
              <motion.div
                key={plan.name}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.15 }}
                className={`relative rounded-3xl p-[1px] overflow-hidden ${
                  plan.highlight ? "transform md:-translate-y-4 shadow-2xl shadow-blue-900/20 z-10" : "z-0"
                }`}
              >
                {/* Glow border for highlighted plan */}
                {plan.highlight && (
                  <div className="absolute inset-0 bg-gradient-to-b from-blue-500 to-violet-500 opacity-50 blur-sm pointer-events-none" />
                )}

                <div 
                  className={`relative h-full flex flex-col p-8 rounded-3xl backdrop-blur-xl ${
                    plan.highlight 
                      ? "bg-[#0f172a]/90 border border-blue-500/30" 
                      : "bg-[#0f172a]/50 border border-white/5"
                  }`}
                >
                  {plan.highlight && (
                    <div className="absolute top-2 right-4 transform ">
                      <span className="bg-gradient-to-r from-blue-500 to-violet-500 text-white text-xs font-bold uppercase tracking-wider py-1 px-3 rounded-full">
                        Most Popular
                      </span>
                    </div>
                  )}

                  <h3 className="text-xl font-bold text-white mb-2">{plan.name}</h3>
                  <p className="text-slate-400 text-sm mb-6 min-h-[40px]">{plan.description}</p>
                  
                  <div className="mb-8 flex flex-col">
                    <span className="text-5xl font-extrabold text-white">{plan.price}</span>
                    {plan.period && <span className="text-slate-400 font-medium ml-1 mt-1">{plan.period}</span>}
                  </div>

                  <ul className="space-y-4 mb-8 flex-1">
                    {plan.features.map((feature, i) => (
                      <li key={i} className="flex items-start text-sm text-slate-300">
                        <svg className="w-5 h-5 text-blue-400 mr-3 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <button
                    className={`w-full py-4 px-6 rounded-xl font-semibold cursor-pointer transition-all duration-300 ${
                      plan.highlight
                        ? "bg-gradient-to-r from-blue-600 to-violet-600 hover:from-blue-500 hover:to-violet-500 text-white shadow-lg shadow-blue-500/25 active:scale-95"
                        : "bg-white/5 hover:bg-white/10 text-white border border-white/10 active:scale-95"
                    }`}
                  >
                    {plan.buttonText}
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
