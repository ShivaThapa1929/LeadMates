// src/components/AnimatedSection.jsx
import { motion } from "framer-motion";

export default function AnimatedSection({ children, delay = 0 }) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{
        duration: 0.5,
        delay,
        ease: "easeOut",
      }}
    >
      {children}
    </motion.section>
  );
}
