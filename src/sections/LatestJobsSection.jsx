import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Briefcase, MapPin, DollarSign, ArrowRight, Loader2, Building2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import authService from '../api/authService';

export default function LatestJobsSection() {
    const navigate = useNavigate();
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchLatestJobs = async () => {
            try {
                // Fetch public jobs, limit to 9 for the homepage grid
                const res = await authService.getPublicJobs();
                setJobs(res.data?.slice(0, 6) || []);
            } catch (err) {
                console.error("Failed to fetch homepage jobs:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchLatestJobs();
    }, []);

    if (loading) {
        return (
            <div className="py-24 flex justify-center">
                <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
            </div>
        );
    }

    if (jobs.length === 0) return null;

    return (
        <section className="py-24 px-6 relative overflow-hidden">
            <div className="max-w-7xl mx-auto relative z-10">
                <div className="text-center mb-16">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-[9px] font-black uppercase tracking-[0.2em] mb-4"
                    >
                        <Briefcase size={12} />
                        Marketplace Delta
                    </motion.div>
                    <h2 className="text-3xl md:text-5xl font-black tracking-tighter uppercase mb-4">
                        Latest <span className="text-blue-500">Missions</span>
                    </h2>
                    <p className="text-gray-500 text-xs font-bold uppercase tracking-widest opacity-60">
                        Elite opportunities for top-tier performers
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
                    {jobs.map((job, i) => (
                        <motion.div
                            key={job.id}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.1 }}
                            className="p-8 rounded-[2.5rem] bg-white/[0.02] border border-white/[0.05] hover:border-blue-500/30 transition-all group backdrop-blur-3xl"
                        >
                            <div className="flex justify-between items-start mb-6">
                                <div className="p-3 rounded-2xl bg-blue-600/10 border border-blue-500/20 text-blue-500">
                                    <Building2 size={24} />
                                </div>
                                <div className="text-right">
                                    <div className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-1">Reward</div>
                                    <div className="text-sm font-black text-white">${job.salary?.toLocaleString()}</div>
                                </div>
                            </div>

                            <h3 className="text-lg font-black text-white uppercase tracking-tight mb-2 group-hover:text-blue-400 transition-colors">
                                {job.title}
                            </h3>
                            <p className="text-[10px] font-black text-blue-500 uppercase tracking-widest mb-4">
                                {job.business_name || 'Anonymous Entity'}
                            </p>

                            <p className="text-xs text-gray-400 font-bold uppercase tracking-tight opacity-70 mb-8 line-clamp-2">
                                {job.description}
                            </p>

                            <div className="flex items-center gap-2 text-[10px] font-black text-gray-500 uppercase tracking-widest mb-8">
                                <MapPin size={12} className="text-blue-500" />
                                {job.location}
                            </div>

                            <button 
                                onClick={() => navigate('/latest-jobs')}
                                className="w-full h-12 rounded-xl border border-white/10 bg-white/5 hover:bg-blue-600 hover:border-blue-500 hover:text-white transition-all text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2 group/btn"
                            >
                                Apply Job
                                <ArrowRight size={14} className="group-hover/btn:translate-x-1 transition-transform" />
                            </button>
                        </motion.div>
                    ))}
                </div>

                <div className="text-center">
                    <button
                        onClick={() => navigate('/latest-jobs')}
                        className="px-10 py-5 bg-white text-black rounded-2xl font-black text-[11px] uppercase tracking-[0.2em] hover:scale-105 transition-transform shadow-xl shadow-white/10 flex items-center gap-3 mx-auto"
                    >
                        View More
                        <ArrowRight size={18} />
                    </button>
                </div>
            </div>
        </section>
    );
}
