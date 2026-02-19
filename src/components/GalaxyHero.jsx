// src/components/GalaxyHero.jsx
import React, { useMemo } from "react";
import { motion } from "framer-motion";

const GalaxyHero = React.memo(({ simple = false }) => {
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

  // Stabilize particles so they don't jump on every re-render
  const particles = useMemo(() => {
    return [...Array(30)].map((_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 100}%`,
      duration: Math.random() * 8 + 8,
      delay: Math.random() * 5
    }));
  }, []);

  return (
    <div className="absolute inset-0 w-full h-full overflow-hidden bg-background">
      {/* 1. CENTRAL GLOW (The "Reflect" Galaxy Core) */}
      <div className="absolute bottom-[-10%] left-1/2 -translate-x-1/2 flex items-center justify-center pointer-events-none">
        {/* Main core light */}
        <motion.div
          animate={{ scale: [1, 1.1, 1], opacity: [0.3, 0.6, 0.3] }}
          transition={{ duration: 6, repeat: Infinity }}
          className="w-[600px] h-[600px] bg-blue-600/30 rounded-full blur-[120px]"
        />
        {/* Horizon line glow */}
        <div className="absolute bottom-0 w-[120vw] h-[1px] bg-gradient-to-r from-transparent via-blue-500/30 to-transparent" />
      </div>

      {/* 2. FLOATING HOLOGRAPHIC PANELS (Hidden in simple mode) */}
      {!simple && (
        <div className="relative w-full h-full max-w-7xl mx-auto pointer-events-none">
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
        </div>
      )}

      {/* 3. PARTICLE/STARS EFFECT (Always visible) */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        {particles.map((p) => (
          <motion.div
            key={p.id}
            className="absolute w-0.5 h-0.5 bg-white rounded-full"
            initial={{ opacity: 0.1 }}
            animate={{
              opacity: [0.1, 0.6, 0.1],
              scale: [1, 1.4, 1],
              y: [0, -60]
            }}
            transition={{
              duration: p.duration,
              repeat: Infinity,
              delay: p.delay
            }}
            style={{
              left: p.left,
              top: p.top
            }}
          />
        ))}
      </div>
    </div>
  );
});

export default GalaxyHero;
