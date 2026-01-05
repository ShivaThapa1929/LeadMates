import { motion } from "framer-motion";

export default function SplashScreen({ logo }) {
  return (
    <motion.div
      exit={{ opacity: 0, scale: 1.1 }}
      transition={{ duration: 0.8, ease: "circIn" }}
      className="fixed inset-0 bg-[#0B0D10] flex flex-col justify-center items-center z-100 overflow-hidden"
      // Added perspective to the entire screen to enable 3D depth
      style={{ perspective: 1200 }}
    >
      {/* BACKGROUND RADIANCE: Pulsing nebula core */}
      <motion.div 
        animate={{ 
          opacity: [0.1, 0.2, 0.1],
          scale: [1, 1.3, 1],
          z: [-50, 0, -50] // Moving in 3D space
        }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        className="absolute w-[600px] h-[600px] bg-blue-600/10 blur-[180px] rounded-full"
      />

      {/* THE 3D HUD SYSTEM */}
      <motion.div 
        initial={{ rotateX: 45, opacity: 0 }}
        animate={{ rotateX: 20, opacity: 1 }} // Slanted 3D view
        transition={{ duration: 1.5, ease: "easeOut" }}
        className="relative flex items-center justify-center mb-16"
        style={{ transformStyle: "preserve-3d" }}
      >
        {/* Outer Ring - Rotating 3D */}
        <motion.div 
          animate={{ rotateZ: 360 }}
          transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
          className="absolute w-56 h-56 md:w-72 md:h-72 border-[0.5px] border-blue-500/20 rounded-full border-t-blue-500/60 shadow-[0_0_30px_rgba(59,130,246,0.15)]"
        />

        {/* Inner Ring - Counter-rotating and slightly offset in Z-space */}
        <motion.div 
          animate={{ rotateZ: -360 }}
          transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
          className="absolute w-44 h-44 md:w-60 md:h-60 border border-dashed border-white/10 rounded-full"
          style={{ translateZ: 40 }} // Pushes this ring "forward" toward the user
        />

        {/* LOGO: Using 3D floating animation */}
        <motion.div
          initial={{ z: -100, opacity: 0 }}
          animate={{ 
            z: 0, 
            opacity: 1,
            rotateY: [0, 10, -10, 0], // Subtle 3D wobble
            y: [0, -10, 0] // Floating up and down
          }}
          transition={{ 
            z: { duration: 1.2 },
            rotateY: { duration: 5, repeat: Infinity, ease: "easeInOut" },
            y: { duration: 3, repeat: Infinity, ease: "easeInOut" }
          }}
          style={{ transformStyle: "preserve-3d" }}
        >
          <img
            src={logo}
            alt="LeadMates"
            className="w-20 h-20 md:w-28 md:h-28 object-contain relative z-10 filter drop-shadow-[0_0_20px_rgba(59,130,246,0.4)]"
          />
        </motion.div>
      </motion.div>

      {/* BRANDING & STATUS with 3D entry */}
      <motion.div 
        initial={{ opacity: 0, translateZ: -50 }}
        animate={{ opacity: 1, translateZ: 0 }}
        transition={{ delay: 0.5, duration: 1 }}
        className="text-center z-20"
      >
        <motion.h1 
          className="text-3xl md:text-6xl font-black text-white uppercase tracking-tighter"
        >
          Lead<span className="text-blue-500">Mates</span>
        </motion.h1>
        
        <motion.div 
          animate={{ opacity: [0.3, 1, 0.3] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="mt-6 flex items-center justify-center gap-3"
        >
          <div className="w-1 h-1 bg-blue-400 rounded-full" />
          <p className="text-[9px] text-blue-400/80 font-bold uppercase tracking-[0.6em]">
            Initializing 3D Infrastructure
          </p>
        </motion.div>
      </motion.div>

      {/* SCANNER LINE */}
      <div className="absolute bottom-16 w-40 h-px bg-white/5 overflow-hidden">
        <motion.div 
          initial={{ left: "-100%" }}
          animate={{ left: "100%" }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-0 w-20 h-full bg-linear-to-r from-transparent via-blue-500/60 to-transparent"
        />
      </div>
    </motion.div>
  );
}