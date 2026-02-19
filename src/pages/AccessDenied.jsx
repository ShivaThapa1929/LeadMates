import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ShieldAlert, ArrowLeft, Lock } from "lucide-react";

export default function AccessDenied() {
    return (
        <div className="min-h-screen bg-[#0B0D10] flex flex-col items-center justify-center px-6 relative overflow-hidden">

            {/* 1. ANIMATED BACKGROUND BEAM */}
            <motion.div
                animate={{
                    opacity: [0.05, 0.1, 0.05],
                    scale: [1, 1.2, 1],
                }}
                transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                className="absolute w-[800px] h-[300px] bg-rose-600/20 blur-[120px] -z-10 rounded-full"
            />

            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="text-center relative z-10"
            >
                <div className="relative inline-block mb-10">
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring", damping: 12, delay: 0.2 }}
                        className="w-32 h-32 rounded-[2.5rem] bg-rose-500/10 border border-rose-500/20 flex items-center justify-center mx-auto shadow-[0_0_50px_rgba(244,63,94,0.1)]"
                    >
                        <ShieldAlert size={64} className="text-rose-500" />
                    </motion.div>

                    <motion.div
                        animate={{ opacity: [0, 1, 0] }}
                        transition={{ duration: 2, repeat: Infinity }}
                        className="absolute -top-4 -right-4"
                    >
                        <Lock size={32} className="text-rose-500" />
                    </motion.div>
                </div>

                <h2 className="text-4xl md:text-6xl font-black text-white mt-2 uppercase tracking-tighter italic">
                    Access <span className="text-rose-500 underline decoration-rose-500/30">Denied</span>
                </h2>

                <p className="text-gray-500 mt-6 mb-12 max-w-md mx-auto text-sm leading-relaxed font-bold uppercase tracking-widest opacity-80">
                    Insufficient Clearance Level Detected. Your authentication protocols do not permit access to this encrypted sector.
                </p>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-6 mt-12">
                    <Link to="/dashboard">
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="bg-white/5 border border-white/10 text-white px-8 py-4 rounded-2xl text-[11px] font-black uppercase tracking-[0.2em] transition-all flex items-center gap-3 backdrop-blur-md hover:bg-white/10"
                        >
                            <ArrowLeft size={16} />
                            Back to Terminal
                        </motion.button>
                    </Link>

                    <Link to="/contact">
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="bg-rose-600 text-white px-8 py-4 rounded-2xl text-[11px] font-black uppercase tracking-[0.2em] transition-all shadow-[0_20px_40px_-12px_rgba(225,29,72,0.4)]"
                        >
                            Request Clearance
                        </motion.button>
                    </Link>
                </div>
            </motion.div>

            {/* FOOTER STRIP */}
            <div className="absolute bottom-12 left-0 w-full flex justify-center gap-8 opacity-20 hidden md:flex">
                <span className="text-[10px] font-black text-white uppercase tracking-[0.5em]">Sector: Restricted</span>
                <span className="text-[10px] font-black text-white uppercase tracking-[0.5em]">Status: Flagged</span>
                <span className="text-[10px] font-black text-white uppercase tracking-[0.5em]">Protocol: 403</span>
            </div>

            <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center opacity-[0.02] pointer-events-none -z-20" />
        </div>
    );
}
