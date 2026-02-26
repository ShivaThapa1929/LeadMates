import React, { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

export default function CustomCursor() {
  const [isHovering, setIsHovering] = useState(false);

  // 1. Raw Mouse Position
  const mouseX = useMotionValue(-100);
  const mouseY = useMotionValue(-100);

  // 2. PERFECTED KINETIC CONFIGURATION
  // Core: Pinpoint accuracy with high-fidelity tracking
  const coreSpringConfig = {
    damping: 35,
    stiffness: 800,
    mass: 0.1
  };

  // Outer ring: "Buttery" smooth follow for premium aesthetic
  const outerSpringConfig = {
    damping: 50,
    stiffness: 200,
    mass: 1.2
  };

  const cursorX = useSpring(mouseX, coreSpringConfig);
  const cursorY = useSpring(mouseY, coreSpringConfig);

  const outerX = useSpring(mouseX, outerSpringConfig);
  const outerY = useSpring(mouseY, outerSpringConfig);

  useEffect(() => {
    const moveMouse = (e) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);

      const target = e.target;
      const isClickable =
        target.closest('button') ||
        target.closest('a') ||
        target.closest('[role="button"]') ||
        window.getComputedStyle(target).cursor === "pointer";

      setIsHovering(!!isClickable);
    };

    window.addEventListener("mousemove", moveMouse);
    return () => window.removeEventListener("mousemove", moveMouse);
  }, [mouseX, mouseY]);

  return (
    <div className="fixed inset-0 pointer-events-none z-4444">
      {/* GLOWING AURA (Follows smoothly) */}
      <motion.div
        className="w-16 h-16 bg-blue-500/15 rounded-full fixed top-0 left-0 blur-[30px]"
        style={{ x: outerX, y: outerY, translateX: "-50%", translateY: "-50%" }}
        animate={{
          scale: isHovering ? 2 : 1,
        }}
      />

      {/* NEON CORE (Absolute Accuracy - No Latency) */}
      <motion.div
        className="w-2.5 h-2.5 bg-blue-400 rounded-full fixed top-0 left-0 shadow-[0_0_20px_rgba(59,130,246,0.8)]"
        style={{ x: mouseX, y: mouseY, translateX: "-50%", translateY: "-50%" }}
        animate={{ scale: isHovering ? 0.6 : 1 }}
      />

      {/* OUTER DELAYED RING (Elegant follow) */}
      <motion.div
        className="w-8 h-8 border border-blue-400/40 rounded-full fixed top-0 left-0"
        style={{ x: outerX, y: outerY, translateX: "-50%", translateY: "-50%" }}
        animate={{
          scale: isHovering ? 1.8 : 1,
          opacity: isHovering ? 0.9 : 0.4
        }}
      />
    </div>
  );
}
