// src/sections/Hero.jsx
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import GalaxyHero from "../components/GalaxyHero"; 

export default function Hero() {
  return (
    <section className="relative w-full min-h-screen flex items-center justify-center bg-black overflow-hidden pt-20 px-6">
      
      {/* 3D GALAXY BACKGROUND */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <GalaxyHero />
      </div>

      {/* OVERLAY GRADIENT for Text Readability */}
      <div className="absolute inset-0 z-[1] bg-gradient-to-b from-black via-transparent to-black opacity-60" />

      <div className="max-w-4xl mx-auto text-center z-10 relative">
        
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center px-3 py-1 mb-6 rounded-full bg-white/5 border border-white/10 backdrop-blur-md"
        >
          <span className="text-blue-400 text-xs font-semibold tracking-wide uppercase">
            Built and used internally by TechMates
          </span>
        </motion.div>

        {/* Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-3xl md:text-5xl lg:text-7xl font-extrabold text-white leading-[1.1] mb-6 tracking-tight"
        >
          A Reliable System to Turn Website Traffic into <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-blue-500 to-purple-600">
            Qualified Leads.
          </span> 
        </motion.h1>

        {/* Subheadline */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="text-gray-400 text-base md:text-lg leading-relaxed mb-10 max-w-2xl mx-auto"
        >
          LeadMates is a conversion-focused lead generation system built for 
          businesses that depend on consistent inquiries—not guesswork. 
        </motion.p>

        {/* CTA Buttons */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="w-full sm:w-auto">
            <Link
              to="/get-access"
              className="block w-full px-8 py-4 bg-blue-600 hover:bg-blue-500 text-white rounded-full font-bold text-sm transition-all shadow-[0_0_30px_rgba(37,99,235,0.4)] text-center"
            >
              Get Access to LeadMates 
            </Link>
          </motion.div>
          
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="w-full sm:w-auto">
            <Link
              to="/get-access"
              className="block w-full px-8 py-4 bg-white/5 border border-white/10 text-white rounded-full font-semibold text-sm transition-all hover:bg-white/10 text-center backdrop-blur-sm"
            >
              See How It Works 
            </Link>
          </motion.div>
        </motion.div>
      </div>

      {/* Bottom perspective floor (Subtle 3D Grid) */}
      <div className="absolute bottom-0 w-full h-[20vh] bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_100%,#000_70%,transparent_100%)] z-[1]" />
    </section>
  );
}