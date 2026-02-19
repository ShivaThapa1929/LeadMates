// src/components/SocialProof.jsx
import { motion } from "framer-motion";

export default function SocialProof() {
  // These represent the "Operational Nodes" or industries LeadMates powers
  const nodes = ["SAAS FLOW", "AGENCY OPS", "VENTURE ALPHA", "CRM SYNC", "LEAD GEN 2.0"];

  return (
    <section className="py-12 bg-[#0B0D10] border-y border-white/5 relative overflow-hidden">
      
      {/* BACKGROUND EFFECTS: Subtle horizon glow */}
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-blue-500/30 to-transparent" />
      <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-blue-500/10 to-transparent" />
      
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-12">
          
          {/* 1. BRAND TRUST BLOCK */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="flex items-center gap-6"
          >
            <div className="relative">
              {/* Spinning Logo Aura */}
              <motion.div 
                animate={{ rotate: 360 }}
                transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                className="w-16 h-16 rounded-2xl border border-blue-500/20 bg-blue-500/5 flex items-center justify-center"
              />
              <div className="absolute inset-0 flex items-center justify-center font-black text-blue-500 text-xl">
                TM
              </div>
            </div>
            
            <div className="flex flex-col">
              <p className="text-gray-300 text-lg md:text-xl font-medium leading-tight">
                Deployed internally by <span className="text-white font-black underline decoration-blue-500/50 underline-offset-4">TechMates</span>
              </p>
              <p className="text-gray-500 text-xs uppercase tracking-[0.3em] mt-2 font-bold">
                Primary Infrastructure Provider
              </p>
            </div>
          </motion.div>

          {/* 2. LIVE OPERATIONAL TICKER (The "Attractive" Part) */}
          <div className="relative flex-1 max-w-xl overflow-hidden [mask-image:linear-gradient(to_right,transparent,white_20%,white_80%,transparent)]">
            <motion.div 
              animate={{ x: [0, -1000] }}
              transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
              className="flex whitespace-nowrap gap-12"
            >
              {[...nodes, ...nodes].map((node, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.8)]" />
                  <span className="text-gray-400 font-black text-[10px] uppercase tracking-widest">{node}</span>
                </div>
              ))}
            </motion.div>
          </div>

          {/* 3. CALLOUT: Built from use */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="px-6 py-3 rounded-2xl bg-white/[0.03] border border-white/10 backdrop-blur-md hidden xl:block"
          >
            <div className="flex flex-col text-right">
              <span className="text-blue-400 font-black text-sm uppercase tracking-tighter">
                Operational Proof 
              </span>
              <span className="text-gray-600 text-[9px] font-bold uppercase tracking-[0.2em]">
                System v1.0.4 Verified
              </span>
            </div>
          </motion.div>
          
        </div>
      </div>
    </section>
  );
}
