import { motion } from "framer-motion";
import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#0B0D10] flex flex-col items-center justify-center px-6 relative overflow-hidden">
      
      {/* 1. ANIMATED BACKGROUND BEAM */}
      <motion.div 
        animate={{ 
          opacity: [0.05, 0.15, 0.05],
          scale: [1, 1.2, 1],
          rotate: [0, 90, 0]
        }}
        transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
        className="absolute w-200 h-75 bg-blue-600/20 blur-[120px] -z-10 rounded-full"
      />

      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="text-center relative z-10"
      >
        {/* 2. THE 404 TEXT WITH GLOW EFFECT */}
        <div className="relative inline-block">
          <motion.h1 
            animate={{ 
              textShadow: [
                "0 0 20px rgba(59,130,246,0)", 
                "0 0 40px rgba(59,130,246,0.4)", 
                "0 0 20px rgba(59,130,246,0)"
              ] 
            }}
            transition={{ duration: 3, repeat: Infinity }}
            className="text-[10rem] md:text-[14rem] font-black leading-none text-transparent bg-clip-text bg-linear-to-b from-white to-white/20 select-none tracking-tighter"
          >
            404
          </motion.h1>
          
          {/* Scanning line passing over the numbers */}
          <motion.div 
            animate={{ top: ["0%", "100%", "0%"] }}
            transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
            className="absolute left-0 w-full h-0.5 bg-blue-500/30 blur-[2px] -z-10"
          />
        </div>

        <h2 className="text-xl md:text-2xl font-bold text-white mt-2 uppercase tracking-[0.2em]">
          System Error: <span className="text-blue-500">Path Not Found</span>
        </h2>
        
        <p className="text-gray-500 mt-4 mb-10 max-w-sm mx-auto text-sm leading-relaxed font-medium">
          The node you are trying to access is unreachable or has been purged from the local cluster.
        </p>

        {/* 3. REDUCED & REFINED BUTTON */}
        <Link to="/">
          <motion.button
            whileHover={{ 
              scale: 1.02, 
              backgroundColor: "#2563eb",
              boxShadow: "0 0 15px rgba(37,99,235,0.3)" 
            }}
            whileTap={{ scale: 0.98 }}
            className="border border-blue-500/30 bg-blue-600/10 text-white px-6 py-2.5 rounded-lg text-sm font-semibold transition-all flex items-center gap-2 mx-auto backdrop-blur-sm"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Return to Home
          </motion.button>
        </Link>
      </motion.div>

      {/* 4. TECH GRID OVERLAY */}
      <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center opacity-[0.02] pointer-events-none -z-20" />
      
      {/* Perspective Lines for "Cyber" feel */}
      <div className="absolute bottom-0 left-0 w-full h-1/2 bg-linear-to-t from-blue-900/10 to-transparent pointer-events-none -z-10" />
    </div>
  );
}
