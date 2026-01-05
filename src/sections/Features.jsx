import { motion } from "framer-motion";
import { BoltIcon, Cog6ToothIcon, ChartBarIcon, UsersIcon, CheckBadgeIcon, RocketLaunchIcon } from "@heroicons/react/24/outline";

const features = [
  { title: "Reliable", desc: "Consistent performance with minimal errors.", icon: BoltIcon },
  { title: "Productive", desc: "Increase efficiency using AI-powered tools.", icon: Cog6ToothIcon },
  { title: "Intuitive", desc: "Simple and user-friendly interface.", icon: ChartBarIcon },
  { title: "Efficient", desc: "Automated workflows for better output.", icon: UsersIcon },
  { title: "Accurate", desc: "Precise insights and intelligent decisions.", icon: CheckBadgeIcon },
  { title: "Responsive", desc: "Fast responses across all platforms.", icon: RocketLaunchIcon },
];

export default function FeaturesPage() {
  return (
    <section className="relative py-28 bg-black text-white min-h-screen px-6">
      {/* Center glow */}
      <div className="absolute inset-x-0 top-1/2 h-75 bg-blue-500/10 blur-[140px]" />

      <div className="relative max-w-6xl mx-auto">
        <h2 className="text-4xl font-bold text-center mb-12">Features</h2>
        <div className="grid md:grid-cols-3 gap-6">
          {features.map((f, i) => {
            const Icon = f.icon;
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.6 }}
                whileHover={{
                  y: -6,
                  scale: 1.04,
                  boxShadow: "0px 20px 40px rgba(59,130,246,0.35)",
                }}
                className="relative p-6 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md flex flex-col gap-4 cursor-pointer"
              >
                {/* Icon */}
                <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-blue-500/10 mb-2">
                  <Icon className="w-6 h-6 text-blue-500" />
                </div>

                {/* Title */}
                <h3 className="text-lg font-semibold text-white">{f.title}</h3>

                {/* Description */}
                <p className="text-sm text-gray-400">{f.desc}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
