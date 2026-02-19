// src/sections/CoreProblem.jsx
import { motion } from "framer-motion";

export default function CoreProblem() {
  // Content strictly following the approved PDF copy 
  const problems = [
    "Traffic without leads",
    "Pages built for design, not decisions",
    "Rebuilding landing pages for every campaign",
    "No consistent conversion logic"
  ];

  return (
    <section className="relative py-32 bg-black text-white overflow-hidden">
      
      {/* 1. THEME LAYER: Subtle Galaxy Glow */}
      <div className="absolute top-1/2 left-0 -translate-y-1/2 w-96 h-96 bg-blue-600/10 blur-[150px] pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[500px] h-[300px] bg-purple-600/5 blur-[120px] pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
        
        {/* Left Column: Approved PDF Content [cite: 18, 19, 21] */}
        <motion.div 
          initial={{ opacity: 0, x: -40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          {/* Headline  */}
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold mb-8 leading-tight tracking-tight">
            Why Most Websites <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-gray-100 to-gray-500">
              Fail to Convert
            </span>
          </h2>

          {/* Sub-content  */}
          <p className="text-gray-400 text-lg md:text-xl mb-10 leading-relaxed max-w-lg">
            Most websites fail at one critical point: converting visitors into inquiries. 
          </p>

          {/* Problem List  */}
          <ul className="space-y-6">
            {problems.map((item, index) => (
              <motion.li 
                key={index}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 + index * 0.1 }}
                className="flex items-center gap-5 text-gray-300 group"
              >
                <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center group-hover:border-blue-500/50 transition-colors">
                  <div className="w-1.5 h-1.5 rounded-full bg-blue-500 shadow-[0_0_12px_rgba(59,130,246,0.8)]" />
                </div>
                <span className="text-lg font-medium group-hover:text-white transition-colors">{item}</span>
              </motion.li>
            ))}
          </ul>

          {/* Final Statement  */}
          <motion.div 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.8 }}
            className="mt-12 inline-flex items-center gap-3 px-4 py-2 rounded-lg bg-blue-500/10 border border-blue-500/20"
          >
            <span className="text-blue-400 font-semibold italic">
              Without a system, results remain unpredictable. 
            </span>
          </motion.div>
        </motion.div>

        {/* Right Column: 3D Holographic Visuals [cite: 18] */}
        <motion.div
          initial={{ opacity: 0, rotateY: 20, scale: 0.9 }}
          whileInView={{ opacity: 1, rotateY: 0, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          className="relative perspective-[1000px] hidden lg:block"
        >
          <div className="grid grid-cols-2 gap-6 rotate-12">
            {/* Box 1: Traffic Without Leads */}
            <div className="aspect-square bg-white/[0.03] backdrop-blur-md border border-white/10 rounded-3xl flex flex-col items-center justify-center p-8 shadow-2xl">
               <span className="text-5xl mb-4 grayscale opacity-50">📉</span>
               <div className="h-1 w-12 bg-gray-500/20 rounded-full" />
            </div>

            {/* Box 2: Design-First Fail */}
            <div className="aspect-square bg-blue-600/10 backdrop-blur-md border border-blue-500/20 rounded-3xl flex flex-col items-center justify-center p-8 translate-y-12 shadow-[0_0_50px_rgba(37,99,235,0.1)]">
               <span className="text-5xl mb-4">🛑</span>
               <div className="h-1 w-12 bg-blue-400/40 rounded-full" />
            </div>

            {/* Box 3: Campaign Rework */}
            <div className="aspect-square bg-white/[0.03] backdrop-blur-md border border-white/10 rounded-3xl flex flex-col items-center justify-center p-8 -translate-y-12 shadow-2xl">
               <span className="text-5xl mb-4 grayscale opacity-50">🧩</span>
               <div className="h-1 w-12 bg-gray-500/20 rounded-full" />
            </div>

            {/* Box 4: No Logic */}
            <div className="aspect-square bg-white/[0.03] backdrop-blur-md border border-white/10 rounded-3xl flex flex-col items-center justify-center p-8 shadow-2xl">
               <span className="text-5xl mb-4 grayscale opacity-50">⚠️</span>
               <div className="h-1 w-12 bg-gray-500/20 rounded-full" />
            </div>
          </div>

          {/* Floating Glow lines connecting boxes */}
          <div className="absolute inset-0 pointer-events-none border border-white/5 rounded-full scale-150 opacity-20 rotate-45" />
        </motion.div>
      </div>
    </section>
  );
}
