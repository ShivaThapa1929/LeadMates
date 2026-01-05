// src/sections/Contact.jsx
import { motion, useMotionValue, useTransform } from "framer-motion";
import { PaperAirplaneIcon, CpuChipIcon, ShieldCheckIcon, SparklesIcon } from "@heroicons/react/24/outline";

export default function Contact() {
  // Tilt Effect Logic
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useTransform(y, [-100, 100], [10, -10]);
  const rotateY = useTransform(x, [-100, 100], [-10, 10]);

  function handleMouse(event) {
    const rect = event.currentTarget.getBoundingClientRect();
    x.set(event.clientX - rect.left - rect.width / 2);
    y.set(event.clientY - rect.top - rect.height / 2);
  }

  return (
    <section id="contact" className="relative bg-[#030405] text-white px-6 md:px-16 py-28 overflow-hidden">
      
      {/* 3D Depth Lights - Changed to Blue */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-600/3 blur-[120px] rounded-full" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-600/2 blur-[120px] rounded-full" />
      </div>

      <div className="max-w-6xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-24"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-500/[0.05] border border-blue-500/20 text-blue-400 text-[9px] font-black uppercase tracking-[0.4em] mb-8">
            <SparklesIcon className="w-3.5 h-3.5" />
            Establish Signal
          </div>
          <h2 className="text-6xl md:text-8xl font-black tracking-tighter mb-6 text-white leading-none">
            Ready to <span className="text-blue-600">Sync?</span>
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 perspective-1000">
          
          {/* Glass Status Card with Blue Accents */}
          <motion.div 
            style={{ rotateX, rotateY, z: 50 }}
            onMouseMove={handleMouse}
            onMouseLeave={() => { x.set(0); y.set(0); }}
            className="lg:col-span-1"
          >
            <div className="h-full p-10 rounded-[2.5rem] bg-white/[0.01] border border-blue-500/10 backdrop-blur-2xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] group hover:border-blue-500/30 transition-colors">
              <div className="flex items-center gap-3 mb-8">
                <div className="w-1.5 h-1.5 rounded-full bg-blue-500 shadow-[0_0_10px_#3b82f6]" />
                <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-blue-500/60">Node Status: Active</span>
              </div>
              <h4 className="text-xl font-black mb-4 tracking-tight">Secure Line</h4>
              <p className="text-xs text-gray-500 leading-loose mb-10">End-to-end encrypted transmission channel for conversion infrastructure.</p>
              
              <div className="space-y-6">
                <div className="flex items-center gap-4 text-[9px] font-black text-gray-400 uppercase tracking-widest group-hover:text-blue-400 transition-colors">
                  <CpuChipIcon className="w-5 h-5 opacity-40 group-hover:opacity-100" />
                  <span>v1.0.4 Global</span>
                </div>
                <div className="flex items-center gap-4 text-[9px] font-black text-gray-400 uppercase tracking-widest group-hover:text-blue-400 transition-colors">
                  <ShieldCheckIcon className="w-5 h-5 opacity-40 group-hover:opacity-100" />
                  <span>Verified Cluster</span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Form Panel - Blue Border Gradient */}
          <motion.div className="lg:col-span-2 p-px rounded-[3rem] bg-gradient-to-b from-blue-500/20 via-transparent to-transparent">
            <div className="bg-[#050607]/80 backdrop-blur-3xl p-8 md:p-14 rounded-[2.9rem] h-full border border-white/5">
              <form className="grid grid-cols-1 md:grid-cols-2 gap-12" onSubmit={(e) => e.preventDefault()}>
                <div className="space-y-12">
                  {['Identity', 'Signal (Email)'].map((label) => (
                    <div key={label} className="relative group">
                      <input
                        type="text"
                        required
                        className="peer w-full bg-transparent border-b border-white/10 py-4 text-white focus:outline-none transition-all placeholder-transparent text-sm focus:border-blue-500"
                        placeholder={label}
                      />
                      <label className="absolute left-0 -top-4 text-gray-500 text-[9px] font-black uppercase tracking-widest transition-all peer-placeholder-shown:text-gray-600 peer-placeholder-shown:top-4 peer-focus:-top-4 peer-focus:text-blue-500">
                        {label}
                      </label>
                      <div className="absolute bottom-0 left-0 w-0 h-[1px] bg-blue-500 transition-all duration-500 peer-focus:w-full" />
                    </div>
                  ))}
                </div>

                <div className="relative group">
                  <textarea
                    required
                    rows="4"
                    className="peer w-full bg-transparent border-b border-white/10 py-4 text-white focus:outline-none transition-all placeholder-transparent resize-none text-sm focus:border-blue-500"
                    placeholder="Transmission"
                  />
                  <label className="absolute left-0 -top-4 text-gray-500 text-[9px] font-black uppercase tracking-widest transition-all peer-placeholder-shown:text-gray-600 peer-placeholder-shown:top-4 peer-focus:-top-4 peer-focus:text-blue-500">
                    Transmission
                  </label>
                  <div className="absolute bottom-0 left-0 w-0 h-[1px] bg-blue-500 transition-all duration-500 peer-focus:w-full" />
                </div>

                <div className="md:col-span-2 flex flex-col items-center gap-10 mt-6">
                  <motion.button
                    whileHover={{ scale: 1.02, y: -4 }}
                    whileTap={{ scale: 0.98 }}
                    className="group relative px-12 py-4 bg-blue-600 text-white font-black rounded-full text-[10px] uppercase tracking-widest flex items-center gap-3 overflow-hidden shadow-[0_20px_40px_rgba(37,99,235,0.25)] hover:bg-blue-500 transition-all"
                  >
                    Broadcast
                    <PaperAirplaneIcon className="w-4 h-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                  </motion.button>
                  <p className="text-[8px] text-blue-900 uppercase tracking-[1em] font-black">Encrypted Channel</p>
                </div>
              </form>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}