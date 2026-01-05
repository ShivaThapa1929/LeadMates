// src/sections/BuiltFor.jsx
import { motion } from "framer-motion";
import { 
  CheckCircleIcon, 
  XCircleIcon, 
  UserGroupIcon, 
  RocketLaunchIcon, 
  BuildingOffice2Icon,
  HandThumbDownIcon
} from "@heroicons/react/24/outline";

const groups = {
  builtFor: [
    {
      title: "Agencies",
      desc: "Standardize delivery and reduce rework across client projects.",
      icon: UserGroupIcon,
      color: "blue"
    },
    {
      title: "Founders",
      desc: "Validate offers and scale without heavy custom development.",
      icon: RocketLaunchIcon,
      color: "blue"
    },
    {
      title: "Service Businesses",
      desc: "Convert local traffic into consistent, qualified inquiries.",
      icon: BuildingOffice2Icon,
      color: "blue"
    },
  ],
  notBuiltFor: [
    {
      title: "Portfolio Websites",
      desc: "Not meant for design-only or gallery-focused showcases.",
      icon: XCircleIcon,
    },
    {
      title: "E-commerce Giants",
      desc: "We focus on lead-gen, not complex 10,000+ SKU inventory systems.",
      icon: HandThumbDownIcon,
    }
  ]
};

export default function BuiltFor() {
  return (
    <section className="relative py-32 bg-[#030405] text-white px-6 overflow-hidden">
      
      {/* Background Depth Elements */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-blue-600/5 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-red-600/5 blur-[120px] rounded-full pointer-events-none" />

      <div className="relative max-w-6xl mx-auto z-10">
        
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-24"
        >
          <span className="text-blue-500 font-black uppercase tracking-[0.4em] text-[10px] mb-4 block">Ecosystem Compatibility</span>
          <h2 className="text-5xl md:text-7xl font-black tracking-tighter mb-6">
            Who is <span className="text-blue-500">LeadMates For?</span>
          </h2>
          <div className="w-24 h-1 bg-blue-600 mx-auto rounded-full" />
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-16 items-start">
          
          {/* COLUMN 1: BUILT FOR (The Green/Blue "Ideal" Side) */}
          <div className="space-y-8">
            <div className="flex items-center gap-4 mb-4">
              <div className="p-2 rounded-lg bg-green-500/10 border border-green-500/20">
                <CheckCircleIcon className="w-6 h-6 text-green-500" />
              </div>
              <h3 className="text-2xl font-black uppercase tracking-widest text-white">Ideal Fit</h3>
            </div>
            
            <div className="grid gap-6">
              {groups.builtFor.map((item, i) => {
                const Icon = item.icon;
                return (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    whileHover={{ scale: 1.02, x: 10 }}
                    transition={{ duration: 0.4, delay: i * 0.1 }}
                    viewport={{ once: true }}
                    className="relative p-8 rounded-[2rem] border border-white/5 bg-white/[0.01] backdrop-blur-3xl group transition-all hover:border-blue-500/30 hover:bg-white/[0.03]"
                  >
                    {/* Hover Glow Effect */}
                    <div className="absolute inset-0 rounded-[2rem] bg-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity blur-xl" />
                    
                    <div className="relative flex gap-6 items-start">
                      <div className="w-14 h-14 shrink-0 rounded-2xl bg-[#0A0A0A] flex items-center justify-center border border-white/10 group-hover:border-blue-500/50 group-hover:shadow-[0_0_20px_rgba(59,130,246,0.3)] transition-all">
                        <Icon className="w-7 h-7 text-blue-500" />
                      </div>
                      <div>
                        <h4 className="text-xl font-bold text-white mb-2">{item.title}</h4>
                        <p className="text-gray-500 text-sm leading-relaxed group-hover:text-gray-300 transition-colors">{item.desc}</p>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>

          {/* COLUMN 2: NOT BUILT FOR (The Red "Reject" Side) */}
          <div className="space-y-8">
            <div className="flex items-center gap-4 mb-4">
              <div className="p-2 rounded-lg bg-red-500/10 border border-red-500/20">
                <XCircleIcon className="w-6 h-6 text-red-500" />
              </div>
              <h3 className="text-2xl font-black uppercase tracking-widest text-white">Not A Fit</h3>
            </div>
            
            <div className="grid gap-6">
              {groups.notBuiltFor.map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: 30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  whileHover={{ scale: 0.98 }}
                  transition={{ duration: 0.4, delay: i * 0.1 }}
                  viewport={{ once: true }}
                  className="p-8 rounded-[2rem] border border-white/5 bg-black/40 backdrop-blur-md flex gap-6 opacity-40 hover:opacity-100 grayscale hover:grayscale-0 transition-all group border-dashed"
                >
                  <div className="w-14 h-14 shrink-0 rounded-2xl bg-red-500/5 flex items-center justify-center border border-red-500/10 group-hover:border-red-500/40 transition-all">
                    <item.icon className="w-7 h-7 text-red-900 group-hover:text-red-500" />
                  </div>
                  <div>
                    <h4 className="text-xl font-bold text-gray-400 group-hover:text-white mb-2">{item.title}</h4>
                    <p className="text-gray-600 text-sm leading-relaxed group-hover:text-gray-400">{item.desc}</p>
                  </div>
                </motion.div>
              ))}

              <motion.div 
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                className="mt-6 p-6 rounded-2xl bg-blue-500/5 border border-blue-500/10 text-center"
              >
                <p className="text-blue-400/60 text-[11px] font-bold uppercase tracking-[0.2em] leading-relaxed">
                  *LeadMates is an conversion-first engine. <br/> We prioritize revenue over artistic portfolio displays.
                </p>
              </motion.div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}