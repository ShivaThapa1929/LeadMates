import { motion } from "framer-motion";

export default function Feature({
  icon: Icon,
  title,
  desc,
  highlighted,
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      whileHover={{
        y: -6,
        scale: 1.04,
        boxShadow: "0px 20px 40px rgba(59,130,246,0.35)",
      }}
      transition={{
        type: "spring",
        stiffness: 260,
        damping: 20,
      }}
      className={`relative p-6 rounded-2xl border flex flex-col gap-4 cursor-pointer
        backdrop-blur-md
        ${
          highlighted
            ? "border-blue-500/60 bg-blue-500/10"
            : "border-gray-800 bg-black/40 hover:border-blue-500/40"
        }
      `}
    >
      {/* Icon */}
      {Icon && (
        <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-blue-500/10">
          <Icon className="w-6 h-6 text-blue-500" />
        </div>
      )}

      {/* Title */}
      <h4 className="text-lg font-semibold tracking-tight text-white">
        {title}
      </h4>

      {/* Description */}
      <p className="text-sm text-gray-400 leading-relaxed">
        {desc}
      </p>

      {/* Glow effect */}
      {highlighted && (
        <div className="absolute inset-0 rounded-2xl blur-2xl bg-blue-500/10 -z-10" />
      )}
    </motion.div>
  );
}
