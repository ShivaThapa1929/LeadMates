// src/pages/UseCases.jsx
import { motion } from "framer-motion";
import { UserGroupIcon, BriefcaseIcon, MegaphoneIcon, GlobeAltIcon } from "@heroicons/react/24/outline";

export default function UseCases() {
  const useCases = [
    { 
      title: "Agencies", 
      desc: "Standardize lead-capture logic across multiple client accounts for predictable execution.", 
      icon: UserGroupIcon 
    },
    { 
      title: "Venture Startups", 
      desc: "Deploy rapidly and iterate on conversion structures without deep discovery cycles.", 
      icon: BriefcaseIcon 
    },
    { 
      title: "Paid Campaigns", 
      desc: "High-performance infrastructure built to handle and convert cold traffic at scale.", 
      icon: MegaphoneIcon 
    },
  ];

  return (
    <main className="relative bg-[#0B0D10] min-h-screen text-white pt-40 pb-40 overflow-hidden">
      
      {/* ANIMATION SYNC: Pulsing Nebula Background */}
      <motion.div 
        animate={{ 
          opacity: [0.05, 0.1, 0.05],
          scale: [1, 1.2, 1] 
        }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-0 right-1/4 w-[600px] h-[600px] bg-purple-600/10 blur-[160px] pointer-events-none" 
      />
      <motion.div 
        animate={{ 
          opacity: [0.05, 0.15, 0.05],
          scale: [1.2, 1, 1.2] 
        }}
        transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
        className="absolute bottom-1/4 left-1/4 w-[500px] h-[500px] bg-blue-600/10 blur-[140px] pointer-events-none" 
      />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        
        {/* Heading Section */}
        <motion.section
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-28"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-[10px] font-black uppercase tracking-[0.3em] mb-6 shadow-[0_0_20px_rgba(59,130,246,0.15)]">
            <GlobeAltIcon className="w-4 h-4" />
            Deployment Scenarios
          </div>
          <h2 className="text-5xl md:text-7xl font-black tracking-tighter mb-8 leading-tight">
            Operational <span className="text-blue-500">Utility</span>
          </h2>
          <p className="mt-4 text-gray-400 max-w-2xl mx-auto text-lg md:text-xl font-medium opacity-80 leading-relaxed">
            LeadMates is designed for high-stakes environments where <br className="hidden md:block" /> 
            reliability and conversion are the only metrics that matter.
          </p>
        </motion.section>

        {/* Use Case Cards */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-10 max-w-6xl mx-auto mb-16">
          {useCases.map((u, i) => {
            const Icon = u.icon;
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15, duration: 0.7 }}
                whileHover={{
                  y: -12,
                  backgroundColor: "rgba(255, 255, 255, 0.04)",
                  borderColor: "rgba(59, 130, 246, 0.4)",
                  boxShadow: "0px 25px 50px rgba(59,130,246,0.15)",
                }}
                className="group relative p-10 border border-white/10 rounded-[2.5rem] bg-white/[0.01] backdrop-blur-3xl flex flex-col items-center text-center transition-all duration-500"
              >
                {/* Floating Icon Container */}
                <div className="mb-8 flex items-center justify-center w-20 h-20 rounded-[1.5rem] bg-blue-500/5 border border-blue-500/20 group-hover:bg-blue-500/20 group-hover:border-blue-500/50 group-hover:scale-110 transition-all duration-500">
                  <Icon className="w-10 h-10 text-blue-500" />
                </div>

                <h4 className="text-2xl font-black tracking-tight mb-4 text-white">{u.title}</h4>
                <p className="text-gray-500 leading-relaxed group-hover:text-gray-300 transition-colors">
                  {u.desc}
                </p>

                {/* Subtle bottom glow for each card */}
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1/2 h-px bg-gradient-to-r from-transparent via-blue-500/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              </motion.div>
            );
          })}
        </section>

        {/* Strategic Footer Buffer */}
        <motion.div 
           initial={{ opacity: 0 }}
           whileInView={{ opacity: 1 }}
           className="mt-20 pt-20 border-t border-white/5 text-center"
        >
          <p className="text-gray-600 text-[10px] font-black uppercase tracking-[0.5em]">
            Optimized for TechMates Technologies ecosystems
          </p>
        </motion.div>
      </div>
    </main>
  );
}