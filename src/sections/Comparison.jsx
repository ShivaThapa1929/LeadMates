// src/sections/Comparison.jsx
import { motion } from "framer-motion";
import { CheckIcon, XMarkIcon } from "@heroicons/react/24/outline";

const comparisonData = [
  { 
    feature: "Focus", 
    traditional: "Aesthetic / Portfolio", 
    leadmates: "Conversion / Logic",
    isLeadmatesBetter: true 
  },
  { 
    feature: "Speed", 
    traditional: "Slow Custom Dev", 
    leadmates: "Rapid Deployment",
    isLeadmatesBetter: true 
  },
  { 
    feature: "Maintenance", 
    traditional: "Complex & Fragile", 
    leadmates: "Modular & Scalable",
    isLeadmatesBetter: true 
  },
  { 
    feature: "Results", 
    traditional: "Unpredictable Traffic", 
    leadmates: "Qualified Inquiries",
    isLeadmatesBetter: true 
  },
];

export default function Comparison() {
  return (
    <section className="relative py-32 bg-black text-white px-6 overflow-hidden">
      
      {/* 3D Background Accents */}
      <div className="absolute top-1/2 left-0 -translate-y-1/2 w-72 h-72 bg-blue-500/10 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-500/5 blur-[140px] pointer-events-none" />

      <div className="relative max-w-5xl mx-auto z-10">
        <div className="text-center mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-extrabold tracking-tight mb-6"
          >
            Traditional Websites <br /> 
            <span className="text-blue-500">vs. LeadMates</span>
          </motion.h2>
          <p className="text-gray-400 text-lg">
            Built from operational use, not just design assumptions.
          </p>
        </div>

        {/* Comparison Table Container */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="overflow-hidden rounded-3xl border border-white/10 bg-white/[0.02] backdrop-blur-xl shadow-2xl"
        >
          <div className="grid grid-cols-3 bg-white/5 py-6 px-4 md:px-8 border-b border-white/10 text-xs md:text-sm font-bold uppercase tracking-widest text-gray-400">
            <div>Feature</div>
            <div className="text-center">Traditional</div>
            <div className="text-center text-blue-400">LeadMates</div>
          </div>

          {comparisonData.map((row, i) => (
            <div 
              key={i} 
              className="grid grid-cols-3 py-6 px-4 md:px-8 border-b border-white/5 items-center hover:bg-white/[0.03] transition-colors"
            >
              <div className="text-sm md:text-base font-semibold text-gray-300">
                {row.feature}
              </div>
              
              <div className="flex flex-col items-center text-center gap-2">
                <XMarkIcon className="w-5 h-5 text-red-500/50" />
                <span className="text-xs md:text-sm text-gray-500">{row.traditional}</span>
              </div>

              <div className="flex flex-col items-center text-center gap-2">
                <CheckIcon className="w-6 h-6 text-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.5)]" />
                <span className="text-sm md:text-base text-white font-medium">{row.leadmates}</span>
              </div>
            </div>
          ))}
          
          <div className="py-8 bg-blue-600/5 text-center px-6">
             <p className="text-blue-400 font-semibold italic">
                LeadMates is built for operational use, not just for show.
             </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}