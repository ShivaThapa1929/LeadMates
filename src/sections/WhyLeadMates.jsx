// src/sections/WhyLeadMates.jsx
import { motion } from "framer-motion";
import { 
  ExclamationTriangleIcon, 
  WrenchScrewdriverIcon,   
  BoltIcon,                
  UserGroupIcon            
} from "@heroicons/react/24/outline";

const storySections = [
  {
    title: "The Problem",
    desc: "Every campaign required rebuilding pages. Conversion logic changed constantly.",
    icon: ExclamationTriangleIcon,
  },
  {
    title: "Decision to Build",
    desc: "One reusable system that works across clients, campaigns, and businesses.",
    icon: WrenchScrewdriverIcon,
  },
  {
    title: "How It's Different",
    desc: "Conversion-first structure, reusable logic, and performance architecture.",
    icon: BoltIcon,
  },
  {
    title: "Who It Is For",
    desc: "Teams that depend on predictable inquiries and repeatable execution.",
    icon: UserGroupIcon,
  },
];

export default function WhyLeadMates() {
  return (
    <section className="relative py-20 bg-[#030405] text-white px-6 overflow-hidden">
      
      {/* 3D THEME LAYER */}
      <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-[400px] bg-blue-600/5 blur-[120px] pointer-events-none" />

      <div className="relative max-w-5xl mx-auto z-10">
        
        {/* Header - Scaled Down */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <span className="text-blue-500 font-black text-[9px] uppercase tracking-[0.4em] mb-3 block">
            The Origin
          </span>
          <h2 className="text-4xl md:text-5xl font-black tracking-tighter mb-4">
            Why <span className="text-blue-500">LeadMates</span>
          </h2>
          <p className="text-gray-500 text-sm max-w-2xl mx-auto leading-relaxed">
            Solving the operational friction of lead-driven growth.
          </p>
        </motion.div>

        {/* Grid of Story Sections: Smaller Padding & Icons */}
        <div className="grid md:grid-cols-2 gap-4">
          {storySections.map((item, i) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                whileHover={{
                  y: -3,
                  borderColor: "rgba(37, 99, 235, 0.3)",
                  backgroundColor: "rgba(255, 255, 255, 0.01)"
                }}
                className="group relative p-6 rounded-2xl border border-white/5 bg-black flex items-start gap-5 transition-all duration-300 cursor-default"
              >
                <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-blue-600/10 border border-blue-600/20 group-hover:bg-blue-600 transition-all duration-500 shrink-0">
                  <Icon className="w-5 h-5 text-blue-500 group-hover:text-white transition-colors" />
                </div>

                <div>
                  <h3 className="text-lg font-black text-white mb-1 tracking-tight">
                    {item.title}
                  </h3>
                  <p className="text-gray-500 text-xs leading-relaxed group-hover:text-gray-400 transition-colors">
                    {item.desc}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Compact Philosophy Footer */}
        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          className="mt-16 pt-8 border-t border-white/5 text-center"
        >
          <blockquote className="text-xl md:text-2xl font-black tracking-tighter text-white/30 italic">
            "Lead generation should be <span className="text-white/60">structured</span> and <span className="text-white/60">predictable</span>."
          </blockquote>
        </motion.div>
      </div>
    </section>
  );
}