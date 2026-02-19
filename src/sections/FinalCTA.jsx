// src/sections/FinalCTA.jsx
import { motion } from "framer-motion";
import { ArrowRightIcon, SparklesIcon } from "@heroicons/react/24/outline";

export default function FinalCTA() {
  return (
    <section className="relative py-24 bg-black text-white px-6 overflow-hidden">

      {/* THEME LAYER: Intense Galaxy Portal Effect */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[500px] bg-blue-600/10 blur-[180px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-blue-500/50 to-transparent" />

      <div className="relative max-w-4xl mx-auto z-10 text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          {/* Support Line */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-[10px] font-black uppercase tracking-[0.3em] mb-8 shadow-[0_0_15px_rgba(59,130,246,0.1)]">
            <SparklesIcon className="w-4 h-4" />
            Reliable Infrastructure
          </div>

          {/* Headline */}
          <h2 className="text-5xl md:text-7xl font-black tracking-tighter mb-8 leading-[1.1]">
            If lead generation matters <br />
            <span className="text-blue-500">
              get access to LeadMates.
            </span>
          </h2>

          {/* Reduced Button Container */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-8 mt-12">
            <motion.button
              whileHover={{
                scale: 1.05,
                boxShadow: "0px 0px 30px rgba(37, 99, 235, 0.4)"
              }}
              whileTap={{ scale: 0.95 }}
              /* REDUCED SIZE: Changed px-10 py-5 to px-8 py-3, and text-lg to text-sm */
              className="group relative px-8 py-3 bg-blue-600 text-white rounded-full font-black text-sm transition-all flex items-center gap-2 overflow-hidden shadow-xl shadow-blue-600/20"
            >
              <span className="relative z-10">Get Access Now</span>
              <ArrowRightIcon className="w-4 h-4 relative z-10 group-hover:translate-x-1 transition-transform" />

              {/* Animated Inner Shine */}
              <motion.div
                animate={{ x: ['-100%', '200%'] }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                className="absolute top-0 left-0 w-1/2 h-full bg-white/10 skew-x-[45deg] z-0"
              />
            </motion.button>

            <motion.a
              href="/docs"
              whileHover={{ textShadow: "0px 0px 8px rgba(255,255,255,0.5)", color: "#fff" }}
              className="text-gray-500 font-bold tracking-[0.2em] uppercase text-[11px] transition-all"
            >
              Read the Docs
            </motion.a>
          </div>

          {/* Final Logic Note */}
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="mt-20 text-gray-600 text-[10px] uppercase tracking-[0.4em] font-bold"
          >
            Operational use • No assumptions
          </motion.p>
        </motion.div>
      </div>

      {/* Decorative grid */}
      <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:radial-gradient(white,transparent_85%)] opacity-5 pointer-events-none" />
    </section>
  );
}
