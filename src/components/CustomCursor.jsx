import React, { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

export default function CustomCursor() {
  const [isHovering, setIsHovering] = useState(false);
  
  // 1. Raw Mouse Position
  const mouseX = useMotionValue(-100);
  const mouseY = useMotionValue(-100);

  // 2. SLOW SPEED CONFIGURATION
  // stiffness: lower = slower follow speed
  // damping: higher = smoother arrival (less "bounce")
  // mass: higher = more "weight" or inertia
  const springConfig = { 
    damping: 40, 
    stiffness: 80, 
    mass: 1.5 
  };
  
  const cursorX = useSpring(mouseX, springConfig);
  const cursorY = useSpring(mouseY, springConfig);

  useEffect(() => {
    const moveMouse = (e) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);

      const target = e.target;
      const isClickable = 
        window.getComputedStyle(target).cursor === "pointer" ||
        target.tagName === "BUTTON" ||
        target.tagName === "A";
      
      setIsHovering(isClickable);
    };

    window.addEventListener("mousemove", moveMouse);
    return () => window.removeEventListener("mousemove", moveMouse);
  }, [mouseX, mouseY]);

  return (
    <div className="fixed inset-0 pointer-events-none z-4444">
      {/* GLOWING AURA (Low speed ambient glow) */}
      <motion.div
        className="w-16 h-16 bg-blue-500/15 rounded-full fixed top-0 left-0 blur-[30px]"
        style={{ x: cursorX, y: cursorY, translateX: "-50%", translateY: "-50%" }}
        animate={{ 
          scale: isHovering ? 2 : 1,
        }}
      />

      {/* NEON CORE (The slow-moving point) */}
      <motion.div
        className="w-2.5 h-2.5 bg-blue-400 rounded-full fixed top-0 left-0 shadow-[0_0_20px_rgba(59,130,246,0.8)]"
        style={{ x: cursorX, y: cursorY, translateX: "-50%", translateY: "-50%" }}
        animate={{ scale: isHovering ? 0.6 : 1 }}
      />
      
      {/* OUTER DELAYED RING */}
      <motion.div
        className="w-8 h-8 border border-blue-400/40 rounded-full fixed top-0 left-0"
        style={{ x: cursorX, y: cursorY, translateX: "-50%", translateY: "-50%" }}
        animate={{ 
          scale: isHovering ? 1.8 : 1,
          opacity: isHovering ? 0.9 : 0.4
        }}
      />
    </div>
  );
}