import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ShieldCheckIcon, ArrowLeftIcon } from "@heroicons/react/24/outline";

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-black text-white pt-32 pb-20 px-6 relative overflow-hidden">
      {/* Background Decorative Glows */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-600/10 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-600/10 blur-[120px] pointer-events-none" />

      <div className="max-w-4xl mx-auto relative z-10">
        {/* Back Button */}
        <Link 
          to="/" 
          className="inline-flex items-center gap-2 text-gray-500 hover:text-white transition-colors mb-12 group"
        >
          <ArrowLeftIcon className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span className="text-xs font-bold uppercase tracking-widest">Back to Home</span>
        </Link>

        {/* Simplified 3D Animated Card */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          whileHover={{ 
            rotateX: 2, 
            rotateY: -2, 
            scale: 1.01,
            boxShadow: "0px 20px 50px rgba(59, 130, 246, 0.1)" 
          }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
          style={{ perspective: 1000 }}
          className="relative rounded-[2rem] border border-white/10 bg-white/[0.03] backdrop-blur-2xl p-8 md:p-16 shadow-2xl overflow-hidden"
        >
          {/* Header */}
          <div className="flex items-center gap-4 mb-10">
            <motion.div 
              whileHover={{ rotate: 360 }}
              transition={{ duration: 0.8 }}
              className="w-14 h-14 rounded-2xl bg-blue-500/10 flex items-center justify-center border border-blue-500/20"
            >
              <ShieldCheckIcon className="w-7 h-7 text-blue-400" />
            </motion.div>
            <div>
              <h1 className="text-3xl md:text-5xl font-black tracking-tighter">
                Privacy <span className="text-blue-500">Policy</span>
              </h1>
              <p className="text-gray-500 text-xs uppercase tracking-[0.4em] font-bold mt-1">LeadMates v1.0</p>
            </div>
          </div>

          {/* Content Sections */}
          <div className="space-y-10 text-gray-400 leading-relaxed max-w-2xl">
            <section className="group">
              <h2 className="text-white font-bold text-xl mb-3 group-hover:text-blue-400 transition-colors">1. Data Transparency</h2>
              <p className="text-sm md:text-base border-l-2 border-white/5 pl-6 group-hover:border-blue-500/50 transition-colors">
                LeadMates processes data exclusively to optimize conversion infrastructure. We prioritize minimal data retention to ensure operational safety within the TechMates ecosystem.
              </p>
            </section>

            <section className="group">
              <h2 className="text-white font-bold text-xl mb-3 group-hover:text-blue-400 transition-colors">2. Security Protocol</h2>
              <p className="text-sm md:text-base border-l-2 border-white/5 pl-6 group-hover:border-blue-500/50 transition-colors">
                All inquiries handled by our infrastructure are encrypted at rest. Our repeatable execution framework prevents unauthorized leakages through isolated processing nodes.
              </p>
            </section>

            <section className="group">
              <h2 className="text-white font-bold text-xl mb-3 group-hover:text-blue-400 transition-colors">3. Cookies & Tracking</h2>
              <p className="text-sm md:text-base border-l-2 border-white/5 pl-6 group-hover:border-blue-500/50 transition-colors">
                We use essential technical cookies to maintain session persistence. No third-party marketing trackers are deployed within our core application interface.
              </p>
            </section>
          </div>

          {/* Footer of the card */}
          <div className="mt-16 pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-[10px] uppercase tracking-widest text-gray-600 font-bold">
              TechMates Technologies Ecosystem
            </p>
            <p className="text-[10px] uppercase tracking-widest text-blue-500/80 font-bold">
              legal@techmates.tech
            </p>
          </div>

          {/* Decorative Corner Accent */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-blue-500/10 to-transparent pointer-events-none" />
        </motion.div>
      </div>
    </div>
  );
}