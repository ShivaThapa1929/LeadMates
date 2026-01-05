// src/components/GalaxyHero.jsx
import { motion } from "framer-motion";

const GalaxyHero = () => {
  // Animation for floating dashboard panels
  const panelVariants = (delay) => ({
    initial: { y: 0, rotateX: 10, rotateY: -10, opacity: 0 },
    animate: {
      y: [-15, 15, -15],
      rotateX: [10, 5, 10],
      rotateY: [-10, -5, -10],
      opacity: 0.6,
      transition: {
        duration: 8,
        repeat: Infinity,
        delay: delay,
        ease: "easeInOut",
      },
    },
  });

  return (
    <div className="absolute inset-0 w-full h-full overflow-hidden bg-black">
      {/* 1. CENTRAL GLOW (The "Reflect" Galaxy Core) */}
      <div className="absolute bottom-[-10%] left-1/2 -translate-x-1/2 flex items-center justify-center">
        {/* Main core light */}
        <motion.div 
          animate={{ scale: [1, 1.1, 1], opacity: [0.5, 0.8, 0.5] }}
          transition={{ duration: 4, repeat: Infinity }}
          className="w-[500px] h-[500px] bg-blue-600/40 rounded-full blur-[120px]" 
        />
        {/* Horizon line glow */}
        <div className="absolute bottom-0 w-[120vw] h-[2px] bg-gradient-to-r from-transparent via-blue-400 to-transparent opacity-50" />
      </div>

      {/* 2. FLOATING HOLOGRAPHIC PANELS (From lm_01.jpg) */}
      <div className="relative w-full h-full max-w-7xl mx-auto">
        
        {/* Panel: Stats/Graph (Top Left) */}
        <motion.div 
          variants={panelVariants(0)} initial="initial" animate="animate"
          className="absolute top-20 left-10 w-64 h-40 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-4 hidden lg:block shadow-[0_0_50px_rgba(59,130,246,0.1)]"
        >
          <div className="space-y-2">
            <div className="h-2 w-1/2 bg-blue-400/30 rounded" />
            <div className="h-16 w-full bg-gradient-to-t from-blue-500/10 to-transparent rounded border-b border-blue-500/20" />
            <div className="flex gap-2 pt-2">
               <div className="h-6 w-6 rounded-full bg-white/10" />
               <div className="h-6 w-full rounded bg-white/5" />
            </div>
          </div>
        </motion.div>

        {/* Panel: Form/Input (Top Right) */}
        <motion.div 
          variants={panelVariants(2)} initial="initial" animate="animate"
          className="absolute top-40 right-10 w-56 h-48 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-4 hidden lg:block shadow-[0_0_50px_rgba(168,85,247,0.1)]"
        >
          <div className="space-y-3">
             <div className="h-6 w-6 rounded bg-purple-500/30" />
             <div className="h-4 w-full bg-white/10 rounded" />
             <div className="h-4 w-full bg-white/10 rounded" />
             <div className="h-8 w-full bg-purple-600/40 rounded-lg mt-4" />
          </div>
        </motion.div>

        {/* 3. PARTICLE/STARS EFFECT */}
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-white rounded-full"
            initial={{ opacity: 0.1 }}
            animate={{ 
              opacity: [0.1, 0.8, 0.1],
              scale: [1, 1.5, 1],
              y: [0, -100]
            }}
            transition={{ 
              duration: Math.random() * 5 + 5, 
              repeat: Infinity,
              delay: Math.random() * 5
            }}
            style={{ 
              left: `${Math.random() * 100}%`, 
              top: `${Math.random() * 100}%` 
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default GalaxyHero;