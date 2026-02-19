// src/sections/PracticalBenefits.jsx
import { motion } from "framer-motion";
import { 
  RocketLaunchIcon, 
  ArrowTrendingUpIcon, 
  Square3Stack3DIcon, 
  WrenchScrewdriverIcon 
} from "@heroicons/react/24/outline";

const benefits = [
  {
    title: "Launch Faster",
    desc: "Skip the deep discovery phase for every new project. Use a pre-validated structure.",
    icon: RocketLaunchIcon,
  },
  {
    title: "Predictable Flow",
    desc: "Move from 'hoping for leads' to 'deploying for leads' with a conversion-first system.",
    icon: ArrowTrendingUpIcon,
  },
  {
    title: "Repeatable Process",
    desc: "A standardized framework means your team knows exactly how to build and scale.",
    icon: Square3Stack3DIcon,
  },
  {
    title: "Low Maintenance",
    desc: "Consistent logic makes it easy to update campaigns without breaking infrastructure.",
    icon: WrenchScrewdriverIcon,
  }
];

export default function PracticalBenefits() {
  return (
    <section className="relative py-24 bg-[#030405] text-white px-6 overflow-hidden">
      
      {/* Blue Atmospheric Glow */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-600/5 blur-[150px] rounded-full translate-x-1/2 -translate-y-1/2 pointer-events-none" />
      
      <div className="relative max-w-7xl mx-auto z-10">
        
        {/* Header */}
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <span className="text-blue-500 font-black text-[10px] uppercase tracking-[0.5em] mb-4 block">
              The Edge
            </span>
            <h2 className="text-4xl md:text-6xl font-black mb-6 tracking-tighter">
              Business <span className="text-blue-500">Benefits</span>
            </h2>
            <p className="text-gray-500 text-sm max-w-2xl mx-auto leading-relaxed">
              Operational advantages for teams that depend on predictable execution.
            </p>
          </motion.div>
        </div>

        {/* Benefits Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {benefits.map((benefit, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              whileHover={{ 
                y: -5,
                borderColor: "rgba(37, 99, 235, 0.4)",
                backgroundColor: "rgba(255, 255, 255, 0.01)" 
              }}
              className="p-8 rounded-[2rem] bg-black border border-white/5 transition-all duration-300 flex flex-col items-center text-center group cursor-default"
            >
              {/* Icon Node */}
              <div className="w-14 h-14 rounded-2xl bg-blue-600/10 flex items-center justify-center mb-6 border border-blue-500/20 group-hover:bg-blue-600 group-hover:border-blue-400 transition-all duration-500">
                <benefit.icon className="w-7 h-7 text-blue-500 group-hover:text-white transition-colors" />
              </div>

              {/* Text Content */}
              <h3 className="text-lg font-black text-white mb-3 tracking-tight group-hover:text-blue-500 transition-colors">
                {benefit.title}
              </h3>
              <p className="text-gray-500 text-xs leading-relaxed group-hover:text-gray-400 transition-colors">
                {benefit.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
