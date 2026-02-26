// src/sections/WhatIsLeadMates.jsx
import { motion } from "framer-motion";

export default function WhatIsLeadMates() {
  const features = [
    "Proven page structures",
    "Clear lead capture flow",
    "Reusable conversion logic",
    "A reliable foundation for campaigns and websites"
  ];

  return (
    <section className="relative py-24 px-6 bg-[#030405] overflow-hidden">

      {/* Blue Glow Atmosphere */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-blue-600/5 blur-[150px] pointer-events-none" />

      <div className="max-w-4xl mx-auto text-center relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl md:text-6xl font-black text-white mb-8 tracking-tighter">
            What LeadMates <span className="text-blue-500">Actually Is</span>
          </h2>

          <p className="text-xl md:text-2xl text-gray-400 font-medium mb-16 leading-relaxed">
            LeadMates is a conversion infrastructure.
          </p>
        </motion.div>

        {/* Feature Grid: Black Cards with Hover Effects */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left mb-16">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              viewport={{ once: true }}

              // --- HOVER EFFECTS START ---
              whileHover={{
                scale: 1.02,
                backgroundColor: "rgba(255, 255, 255, 0.03)", // Slight lift on dark bg
                borderColor: "rgba(59, 130, 246, 0.5)" // Blue glow border
              }}
              style={{ borderColor: "rgba(255, 255, 255, 0.05)" }}
              className="p-8 rounded-2xl bg-black border flex items-start gap-5 transition-all duration-300 group cursor-default"
            // --- HOVER EFFECTS END ---
            >
              <div className="mt-1 w-6 h-6 rounded-lg bg-blue-600/10 border border-blue-600/20 flex items-center justify-center shrink-0 group-hover:bg-blue-600 group-hover:shadow-[0_0_15px_rgba(37,99,235,0.5)] transition-all">
                <div className="w-1.5 h-1.5 rounded-full bg-blue-500 group-hover:bg-white transition-colors" />
              </div>

              <span className="text-gray-400 text-sm font-bold uppercase tracking-widest group-hover:text-white transition-colors">
                {feature}
              </span>
            </motion.div>
          ))}
        </div>

        {/* Final Statement */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          viewport={{ once: true }}
          className="inline-block p-px rounded-full bg-gradient-to-r from-transparent via-blue-500/50 to-transparent"
        >
          <div className="px-10 py-4 rounded-full bg-black/80 backdrop-blur-xl border border-white/5">
            <p className="text-sm md:text-base text-blue-400 font-black uppercase tracking-[0.3em] italic">
              Instead of rebuilding pages, you deploy a system.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
