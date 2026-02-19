// src/sections/CoreFeatures.jsx
import { motion } from "framer-motion";
import { 
  Square3Stack3DIcon, 
  ArrowsRightLeftIcon, 
  KeyIcon, 
  DevicePhoneMobileIcon 
} from "@heroicons/react/24/outline";

const features = [
  {
    title: "Conversion-first architecture",
    desc: "Every component is designed to move visitors toward a specific action.",
    icon: Square3Stack3DIcon,
  },
  {
    title: "Reusable logic",
    desc: "Modular components that maintain consistent lead-capture behavior across your site.",
    icon: ArrowsRightLeftIcon,
  },
  {
    title: "Minimal UI, Maximum Speed",
    desc: "No unnecessary code. High-performance layouts that reduce friction for the end user.",
    icon: KeyIcon,
  },
  {
    title: "Mobile-optimized flow",
    desc: "Seamless lead generation experiences across all screen sizes.",
    icon: DevicePhoneMobileIcon,
  },
];

export default function CoreFeatures() {
  return (
    <section className="relative py-32 bg-black text-white px-6 overflow-hidden">
      
      {/* 3D THEME LAYER: Abstract galaxy elements */}
      <div className="absolute top-0 left-1/4 w-72 h-72 bg-blue-600/5 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-600/5 blur-[140px] pointer-events-none" />

      <div className="relative max-w-7xl mx-auto z-10">
        
        {/* Updated Heading from PDF Section 9 */}
        <div className="text-center mb-20">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight mb-6"
          >
            Core <span className="text-blue-500">Features</span>
          </motion.h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            The technical foundation of a high-performing lead generation system.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, i) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
                whileHover={{
                  y: -10,
                  borderColor: "rgba(59, 130, 246, 0.5)",
                  backgroundColor: "rgba(255, 255, 255, 0.05)",
                }}
                className="relative p-8 rounded-3xl border border-white/5 bg-white/[0.02] backdrop-blur-xl transition-all duration-300 group"
              >
                {/* 3D Holographic Icon Container */}
                <div className="mb-6 flex items-center justify-center w-14 h-14 rounded-2xl bg-blue-500/10 border border-blue-500/20 group-hover:bg-blue-500/20 group-hover:border-blue-500/50 transition-all shadow-[0_0_15px_rgba(59,130,246,0.1)]">
                  <Icon className="w-7 h-7 text-blue-500" />
                </div>

                {/* Content: Strictly from PDF */}
                <h3 className="text-xl font-bold text-white mb-3 tracking-tight">
                  {feature.title}
                </h3>
                <p className="text-gray-400 text-sm leading-relaxed group-hover:text-gray-300 transition-colors">
                  {feature.desc}
                </p>

                {/* Visual Accent */}
                <div className="absolute bottom-4 right-6 opacity-0 group-hover:opacity-20 transition-opacity">
                  <Icon className="w-12 h-12 text-blue-500" />
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
