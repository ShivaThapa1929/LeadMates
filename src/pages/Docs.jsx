// src/pages/Docs.jsx
import { motion } from "framer-motion";
import { 
  BookOpenIcon, 
  CommandLineIcon, 
  PuzzlePieceIcon, 
  ArrowUpTrayIcon, 
  UserGroupIcon 
} from "@heroicons/react/24/outline";

export default function Docs() {
  // Sections based on "YOU WILL LEARN" from PDF Page 7
  const sections = [
    { 
      title: "Setup", 
      desc: "Get started in minutes with our streamlined installation process.", 
      icon: CommandLineIcon 
    },
    { 
      title: "Structure", 
      desc: "Understand the conversion-first architecture and lead capture logic.", 
      icon: PuzzlePieceIcon 
    },
    { 
      title: "Deployment", 
      desc: "Everything required to deploy LeadMates to your production environment.", 
      icon: ArrowUpTrayIcon 
    },
  ];

  return (
    <main className="relative bg-[#0B0D10] min-h-screen text-white pt-40 pb-32 overflow-hidden">
      
      {/* Background Nebula Glows */}
      <motion.div 
        animate={{ opacity: [0.1, 0.15, 0.1], scale: [1, 1.1, 1] }}
        transition={{ duration: 10, repeat: Infinity }}
        className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-125 bg-blue-600/10 blur-[120px] pointer-events-none" 
      />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        {/* Heading Section - Content from PDF Source 127-128 */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-24"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-[10px] font-black uppercase tracking-[0.3em] mb-6 shadow-[0_0_15px_rgba(59,130,246,0.2)]">
            <BookOpenIcon className="w-4 h-4" />
            Documentation
          </div>
          
          {/* Updated H2 with requested gradient logic */}
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight mb-6">
            LeadMates <span className="text-blue-500">Docs</span>
          </h2>
          
          <p className="mt-4 text-gray-400 max-w-2xl mx-auto text-lg opacity-80">
            Everything required to install, customize, and deploy LeadMates. [cite: 128]
          </p>
        </motion.section>

        {/* Docs Cards Grid - Content from PDF Source 130 */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto mb-20">
          {sections.map((s, i) => {
            const Icon = s.icon;
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.6 }}
                whileHover={{
                  y: -10,
                  backgroundColor: "rgba(255, 255, 255, 0.03)",
                  boxShadow: "0px 20px 40px rgba(59,130,246,0.15)",
                }}
                className="group p-8 border border-white/10 rounded-[2rem] bg-white/[0.01] backdrop-blur-3xl flex flex-col gap-5 items-center text-center transition-all duration-300"
              >
                <div className="mb-2 flex items-center justify-center w-16 h-16 rounded-2xl bg-blue-500/10 border border-blue-500/20 group-hover:border-blue-500/50 transition-all">
                  <Icon className="w-8 h-8 text-blue-500" />
                </div>

                <h4 className="text-2xl font-bold tracking-tight text-white/90">{s.title}</h4>
                <p className="text-gray-500 text-sm leading-relaxed group-hover:text-gray-400 transition-colors">
                  {s.desc}
                </p>
                
                <motion.button 
                   whileHover={{ x: 5 }}
                   className="mt-4 text-blue-500 font-black text-[10px] uppercase tracking-widest flex items-center gap-2"
                >
                  Quick Start <span className="text-lg">→</span>
                </motion.button>
              </motion.div>
            );
          })}
        </section>

        {/* Target Audience Section - Content from PDF Source 131-132 */}
        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          className="pt-20 border-t border-white/5 text-center flex flex-col items-center"
        >
          <div className="flex items-center gap-2 mb-4 text-gray-500">
            <UserGroupIcon className="w-5 h-5" />
            <span className="text-xs font-bold uppercase tracking-widest">Built For</span>
          </div>
          <p className="text-gray-400 text-sm max-w-xl">
            Developers, agencies, and technical founders requiring a repeatable lead generation framework. 
          </p>
          <p className="mt-8 text-gray-600 text-[10px] uppercase tracking-[0.4em] font-bold">
            v1.0.4 - Approved by TechMates Technologies [cite: 135]
          </p>
        </motion.div>
      </div>
    </main>
  );
}