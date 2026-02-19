// src/sections/HowItWorks.jsx
import { motion } from "framer-motion";
import {
  FunnelIcon,
  CpuChipIcon,
  ChatBubbleLeftRightIcon,
  RocketLaunchIcon,
} from "@heroicons/react/24/outline";

const steps = [
  {
    title: "Capture Leads",
    desc: "Collect leads automatically from forms, landing pages, ads, and integrations in real time.",
    icon: FunnelIcon,
  },
  {
    title: "AI Qualification",
    desc: "AI scores and qualifies leads instantly based on intent, behavior, and engagement.",
    icon: CpuChipIcon,
  },
  {
    title: "Smart Follow-ups",
    desc: "Automated, personalized follow-ups across email, WhatsApp, and SMS — no manual work.",
    icon: ChatBubbleLeftRightIcon,
  },
  {
    title: "Close Faster",
    desc: "Focus only on high-intent leads and convert them faster with smarter insights.",
    icon: RocketLaunchIcon,
  },
];

export default function HowItWorks() {
  return (
    <section className="relative py-24 bg-[#030405] text-white px-6 overflow-hidden">
      
      {/* Background Atmosphere */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-125 h-75 bg-blue-600/5 blur-[120px] pointer-events-none" />

      {/* Heading */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="text-center mb-16"
      >
        <span className="text-blue-500 font-black text-[10px] uppercase tracking-[0.5em] mb-4 block">
          The Workflow
        </span>
        <h2 className="text-4xl md:text-6xl font-black tracking-tighter">
          How It <span className="text-blue-500">Works?</span>
        </h2>
      </motion.div>

      {/* Steps Grid */}
      <div className="grid md:grid-cols-4 gap-4 max-w-7xl mx-auto">
        {steps.map((step, i) => {
          const Icon = step.icon;
          return (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              whileHover={{
                y: -5,
                borderColor: "rgba(37, 99, 235, 0.4)",
                backgroundColor: "rgba(255, 255, 255, 0.01)"
              }}
              className="group relative p-8 rounded-4xl border border-white/5 bg-black transition-all duration-300 overflow-hidden cursor-default"
            >
              {/* Subtle Blue inner glow on hover */}
              <div className="absolute inset-0 bg-linear-to-br from-blue-600/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />

              {/* Step number - Modern Minimal */}
              <span className="absolute top-6 right-8 text-[10px] font-black text-blue-500/30 group-hover:text-blue-500 transition-colors">
                0{i + 1}
              </span>

              {/* Icon Container */}
              <div className="mb-6 flex items-center justify-center w-12 h-12 rounded-xl bg-blue-600/10 border border-blue-600/20 group-hover:bg-blue-600 group-hover:border-blue-400 transition-all duration-500 shadow-[0_0_20px_rgba(37,99,235,0)] group-hover:shadow-[0_0_20px_rgba(37,99,235,0.3)]">
                <Icon className="w-6 h-6 text-blue-500 group-hover:text-white transition-colors" />
              </div>

              {/* Content */}
              <h3 className="text-lg font-black text-white mb-3 tracking-tight group-hover:text-blue-500 transition-colors">
                {step.title}
              </h3>

              <p className="text-gray-500 text-xs leading-relaxed group-hover:text-gray-400 transition-colors">
                {step.desc}
              </p>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
