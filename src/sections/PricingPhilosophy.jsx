// src/sections/PricingPhilosophy.jsx
import { motion } from "framer-motion";
import { 
  CheckBadgeIcon, 
  ShieldCheckIcon, 
  ClockIcon 
} from "@heroicons/react/24/outline";

export default function PricingPhilosophy() {
  const includes = [
    "LeadMates system",
    "Layouts and components",
    "Full Documentation",
    "Lifetime usage rights"
  ];

  return (
    <section className="relative py-20 bg-black text-white px-6 overflow-hidden">
      
      {/* Galaxy Background Accents */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-600/5 blur-[140px] pointer-events-none" />

      <div className="relative max-w-4xl mx-auto z-10 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-6">
            Pricing <span className="text-blue-500">Philosophy</span>
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Simple, transparent, infrastructure-based pricing. 
            Built for teams that value predictable costs.
          </p>
        </motion.div>

        {/* Pricing Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="relative max-w-lg mx-auto p-10 rounded-[2.5rem] border border-white/10 bg-white/[0.02] backdrop-blur-2xl shadow-2xl overflow-hidden"
        >
          {/* Top Label */}
          <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-bold uppercase tracking-widest mb-8">
            <ShieldCheckIcon className="w-4 h-4" />
            Lifetime Access
          </div>

          <div className="mb-8">
            <h3 className="text-5xl font-black text-white mb-2">$39</h3>
            <p className="text-gray-500 font-medium text-sm">One-time purchase. No monthly bloat.</p>
          </div>

          {/* Includes List */}
          <ul className="space-y-4 mb-10 text-left">
            {includes.map((item, i) => (
              <li key={i} className="flex items-center gap-3 text-gray-300">
                <CheckBadgeIcon className="w-4 h-4 text-blue-500" />
                <span className="text-sm font-medium">{item}</span>
              </li>
            ))}
          </ul>

          {/* Reduced Button & Logic Section */}
          <div className="pt-8 border-t border-white/5 flex flex-col items-center gap-4">
            <div className="flex items-center justify-center gap-2 text-[11px] text-gray-500 mb-2 uppercase tracking-widest">
              <ClockIcon className="w-3 h-3 text-blue-500/50" />
              <span>Lifetime usage rights included</span>
            </div>
            
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              /* Adjusted Padding: py-2.5 (smaller height) px-8 (shorter width) */
              /* Adjusted Typography: text-sm (smaller text) */
              className="px-8 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-full text-sm font-black transition-all shadow-lg shadow-blue-600/20"
            >
              Get Started
            </motion.button>
            
            <p className="text-[9px] text-gray-600 uppercase tracking-tighter mt-2">
              Optional setup services available
            </p>
          </div>

          {/* Decorative Corner Glow */}
          <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-blue-500/20 blur-3xl rounded-full" />
        </motion.div>

        {/* Footer Disclaimer */}
        <motion.p 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mt-12 text-gray-500 text-[10px] italic uppercase tracking-widest"
        >
          *Infrastructure only. Hosting and custom development not included.
        </motion.p>
      </div>
    </section>
  );
}