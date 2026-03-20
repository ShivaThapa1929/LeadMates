import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Briefcase, MapPin, DollarSign, Clock, Search, Filter,
    ChevronRight, ArrowRight, Loader2, AlertCircle, CheckCircle,
    Building2, Globe, Sparkles
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import authService from '../api/authService';
import GalaxyHero from '../components/GalaxyHero';

const JOB_TYPES = ['Full-time', 'Part-time', 'Remote', 'Contract', 'Freelance'];
const CATEGORIES = ['Engineering', 'Marketing', 'Sales', 'Design', 'Customer Success', 'Finance'];

const Dropdown = ({ options, value, onChange, placeholder, icon }) => {
    const [isOpen, setIsOpen] = useState(false);
    return (
        <div className="relative">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full h-12 bg-white/[0.03] border border-white/5 rounded-xl pl-11 pr-4 text-[11px] text-white outline-none focus:border-blue-500/30 transition-all font-black uppercase tracking-wider flex items-center justify-between group cursor-pointer"
            >
                <div className="absolute left-4 top-1/2 -translate-y-1/2 group-hover:scale-110 transition-transform">
                    {icon}
                </div>
                <span className={value ? "text-white" : "text-gray-500"}>{value || placeholder}</span>
                <ChevronRight size={14} className={`text-gray-600 transition-transform duration-300 ${isOpen ? 'rotate-90' : ''}`} />
            </button>
            <AnimatePresence>
                {isOpen && (
                    <>
                        <div className="fixed inset-0 z-[60]" onClick={() => setIsOpen(false)} />
                        <motion.div
                            initial={{ opacity: 0, y: -10, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: -10, scale: 0.95 }}
                            className="absolute top-full left-0 w-full mt-2 bg-[#0a0a0b] border border-white/5 rounded-xl shadow-2xl z-[70] overflow-hidden backdrop-blur-3xl"
                        >
                            <div className="max-h-60 overflow-y-auto custom-scrollbar p-2">
                                <div 
                                    onClick={() => { onChange(""); setIsOpen(false); }}
                                    className="px-4 py-3 rounded-lg text-[10px] font-black uppercase tracking-widest text-gray-500 hover:bg-white/5 transition-colors cursor-pointer"
                                >
                                    {placeholder}
                                </div>
                                {options.map((opt) => (
                                    <div
                                        key={opt}
                                        onClick={() => { onChange(opt); setIsOpen(false); }}
                                        className={`px-4 py-3 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all cursor-pointer ${value === opt ? 'bg-blue-600/20 text-blue-400' : 'text-gray-400 hover:bg-white/5 hover:text-white'}`}
                                    >
                                        {opt}
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    );
};

export default function LatestJobsPage() {
    const navigate = useNavigate();
    const user = authService.getCurrentUser();

    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [applying, setApplying] = useState(null);
    const [successMsg, setSuccessMsg] = useState("");

    // Filters
    const [filters, setFilters] = useState({
        search: "",
        category: "",
        job_type: "",
        location: "",
        min_salary: ""
    });

    const fetchJobs = async () => {
        setLoading(true);
        try {
            const res = await authService.getPublicJobs(filters);
            setJobs(res.data || []);
            setError("");
        } catch (err) {
            setError(err.message || "Failed to load jobs.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchJobs();
    }, [filters.category, filters.job_type, filters.min_salary]);

    const handleApply = (jobId) => {
        if (!user) {
            navigate('/login', { state: { from: '/latest-jobs', message: 'Please login to apply for jobs.' } });
            return;
        }
        // Redirect to dashboard Jobs page where they can fill the full application form
        navigate('/dashboard/jobs', { state: { applyJobId: jobId } });
    };



    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters(prev => ({ ...prev, [name]: value }));
    };

    return (
        <main className="min-h-screen bg-background text-white relative overflow-hidden">
            <div className="absolute inset-0 z-0">
                <GalaxyHero simple={true} />
            </div>

            <div className="relative z-10 pt-32 pb-24 px-6 max-w-7xl mx-auto">
                {/* Header */}
                <div className="text-center mb-16">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-[10px] font-black uppercase tracking-[0.2em] mb-6"
                    >
                        <Briefcase size={14} />
                        Global Career Marketplace
                    </motion.div>
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-4xl md:text-6xl font-black tracking-tighter uppercase mb-6"
                    >
                        Find Your Next <span className="text-blue-500">Mission</span>
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="text-gray-400 text-sm md:text-md uppercase font-bold tracking-widest max-w-2xl mx-auto opacity-70"
                    >
                        Explore elite opportunities in the tech and sales ecosystem.
                        Direct connections with top agencies and enterprises.
                    </motion.p>
                </div>

                <div className="flex flex-col lg:flex-row gap-12">
                    {/* Sidebar Filters */}
                    <aside className="w-full lg:w-72 space-y-8 shrink-0">
                        <div className="p-8 rounded-[2rem] bg-white/[0.02] border border-white/[0.05] backdrop-blur-3xl sticky top-32">
                            <div className="flex items-center gap-3 mb-8">
                                <div className="w-8 h-8 rounded-lg bg-blue-600/20 flex items-center justify-center text-blue-500">
                                    <Filter size={16} />
                                </div>
                                <h3 className="text-xs font-black uppercase tracking-[0.2em]">Filter Engine</h3>
                            </div>

                            <div className="space-y-6">
                                {/* Search */}
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 ml-1">Search Terminal</label>
                                    <div className="relative">
                                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600" />
                                        <input
                                            type="text"
                                            name="search"
                                            value={filters.search}
                                            onChange={handleFilterChange}
                                            onKeyUp={(e) => e.key === 'Enter' && fetchJobs()}
                                            placeholder="Keywords..."
                                            className="w-full h-12 bg-white/[0.03] border border-white/5 rounded-xl pl-11 pr-4 text-xs text-white outline-none focus:border-blue-500/30 transition-all font-bold"
                                        />
                                    </div>
                                </div>

                                {/* Specialization Custom Dropdown */}
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 ml-1">Specialization</label>
                                    <Dropdown 
                                        options={CATEGORIES}
                                        value={filters.category}
                                        onChange={(val) => setFilters(f => ({...f, category: val}))}
                                        placeholder="All Categories"
                                        icon={<Sparkles size={14} className="text-blue-500/70" />}
                                    />
                                </div>

                                {/* Deployment Type Custom Dropdown */}
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 ml-1">Deployment Type</label>
                                    <Dropdown 
                                        options={JOB_TYPES}
                                        value={filters.job_type}
                                        onChange={(val) => setFilters(f => ({...f, job_type: val}))}
                                        placeholder="All Types"
                                        icon={<Clock size={14} className="text-emerald-500/70" />}
                                    />
                                </div>

                                {/* Location */}
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 ml-1">Geographic Zone</label>
                                    <input
                                        type="text"
                                        name="location"
                                        value={filters.location}
                                        onChange={handleFilterChange}
                                        placeholder="City / Country..."
                                        className="w-full h-12 bg-white/[0.03] border border-white/5 rounded-xl px-4 text-xs text-white outline-none focus:border-blue-500/30 transition-all font-bold"
                                    />
                                </div>

                                {/* Min Salary */}
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 ml-1">Minimum Reward</label>
                                    <div className="relative">
                                        <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600" />
                                        <input
                                            type="number"
                                            name="min_salary"
                                            value={filters.min_salary}
                                            onChange={handleFilterChange}
                                            placeholder="Min Salary..."
                                            className="w-full h-12 bg-white/[0.03] border border-white/5 rounded-xl pl-11 pr-4 text-xs text-white outline-none focus:border-blue-500/30 transition-all font-bold"
                                        />
                                    </div>
                                </div>

                                <button
                                    onClick={fetchJobs}
                                    className="w-full py-4 bg-blue-600 text-white rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-blue-500 transition-all shadow-lg shadow-blue-600/20 active:scale-95 flex items-center justify-center gap-2"
                                >
                                    Apply Filters
                                </button>
                            </div>
                        </div>
                    </aside>

                    {/* Jobs Listing */}
                    <div className="flex-1 space-y-6">
                        {loading ? (
                            <div className="min-h-[400px] flex flex-col items-center justify-center gap-6 p-12 bg-white/[0.02] border border-white/[0.05] rounded-[3rem]">
                                <div className="relative">
                                    <Loader2 className="w-12 h-12 text-blue-500 animate-spin" />
                                    <div className="absolute inset-0 blur-xl bg-blue-500/20 animate-pulse" />
                                </div>
                                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-500 animate-pulse">Syncing Marketplace...</p>
                            </div>
                        ) : error ? (
                            <div className="min-h-[400px] flex flex-col items-center justify-center gap-6 p-12 bg-rose-500/5 border border-rose-500/10 rounded-[3rem] text-center">
                                <AlertCircle className="w-12 h-12 text-rose-500" />
                                <div className="space-y-2">
                                    <p className="text-sm font-black uppercase tracking-widest text-rose-400">{error}</p>
                                    <button onClick={fetchJobs} className="text-[10px] font-black uppercase tracking-[0.2em] text-white/50 hover:text-white transition-colors">Retry Connection</button>
                                </div>
                            </div>
                        ) : jobs.length === 0 ? (
                            <div className="min-h-[400px] flex flex-col items-center justify-center gap-6 p-12 bg-white/[0.02] border border-white/[0.05] rounded-[3rem] text-center">
                                <Search className="w-12 h-12 text-gray-700" />
                                <div className="space-y-2">
                                    <p className="text-sm font-black uppercase tracking-widest text-gray-500">No missions found matching your parameters</p>
                                    <button onClick={() => setFilters({ search: "", category: "", job_type: "", location: "", min_salary: "" })} className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-500 hover:text-blue-400 transition-colors">Reset Filter Engine</button>
                                </div>
                            </div>
                        ) : (
                            <div className="flex flex-col gap-6">
                                <AnimatePresence mode="popLayout">
                                    {jobs.map((job, i) => (
                                        <motion.div
                                            key={job.id}
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: i * 0.05 }}
                                            className="group relative p-6 md:p-8 rounded-[2rem] md:rounded-[3rem] bg-white/[0.02] border border-white/[0.05] hover:border-blue-500/30 transition-all hover:bg-white/[0.04] backdrop-blur-3xl overflow-hidden"
                                        >
                                            <div className="relative z-10 flex flex-col lg:flex-row lg:items-center gap-8">
                                                {/* Left: Branding & Meta */}
                                                <div className="lg:w-48 shrink-0 space-y-4">
                                                    <div className="w-16 h-16 rounded-2xl bg-blue-600/10 border border-blue-500/20 flex items-center justify-center text-blue-500 group-hover:scale-110 transition-transform">
                                                        <Building2 size={32} strokeWidth={1.5} />
                                                    </div>
                                                    <div>
                                                        <div className="text-[10px] font-black uppercase tracking-widest text-blue-500 mb-1">
                                                            {job.business_name || 'Anonymous Entity'}
                                                        </div>
                                                        <div className="flex flex-wrap gap-2">
                                                            <span className="px-2 py-0.5 rounded-md bg-white/5 border border-white/10 text-[8px] font-black uppercase text-gray-400">
                                                                {job.category || 'Expert'}
                                                            </span>
                                                            <span className="px-2 py-0.5 rounded-md bg-white/5 border border-white/10 text-[8px] font-black uppercase text-gray-400">
                                                                {job.job_type || 'Full-time'}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Middle: Content */}
                                                <div className="flex-1 space-y-3">
                                                    <h3 className="text-xl md:text-2xl font-black text-white tracking-tight uppercase group-hover:text-blue-400 transition-colors">
                                                        {job.title}
                                                    </h3>
                                                    <p className="text-xs text-gray-400 leading-relaxed line-clamp-2 md:line-clamp-none opacity-80 uppercase font-bold tracking-tight">
                                                        {job.description}
                                                    </p>
                                                    <div className="flex flex-wrap gap-6 pt-2">
                                                        <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-gray-500">
                                                            <MapPin size={12} className="text-blue-500" />
                                                            {job.location}
                                                        </div>
                                                        <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-gray-500">
                                                            <DollarSign size={12} className="text-emerald-500" />
                                                            ${job.salary?.toLocaleString()}
                                                        </div>
                                                        <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-gray-500">
                                                            <Clock size={12} className="text-amber-500" />
                                                            Posted {new Date(job.created_at).toLocaleDateString()}
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Right: Actions */}
                                                <div className="lg:w-48 shrink-0 flex flex-col justify-center">
                                                    <button 
                                                        onClick={() => handleApply(job.id)}
                                                        disabled={applying === job.id}
                                                        className="w-full h-14 rounded-2xl bg-white/5 border border-white/10 hover:bg-blue-600 hover:text-white hover:border-blue-500 transition-all text-[11px] font-black uppercase tracking-[0.3em] flex items-center justify-center gap-3 group/btn relative overflow-hidden active:scale-95"
                                                    >
                                                        {applying === job.id ? (
                                                            <Loader2 className="w-5 h-5 animate-spin" />
                                                        ) : (
                                                            <>
                                                                Apply Now
                                                                <ArrowRight size={16} className="group-hover/btn:translate-x-1 transition-transform" />
                                                            </>
                                                        )}
                                                    </button>
                                                </div>
                                            </div>
                                        </motion.div>
                                    ))}
                                </AnimatePresence>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Success Notification */}
            <AnimatePresence>
                {successMsg && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 50 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 50 }}
                        className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[100] px-8 py-4 rounded-2xl bg-emerald-500 text-white shadow-2xl flex items-center gap-4 border border-emerald-400/50"
                    >
                        <CheckCircle size={20} className="shrink-0" />
                        <span className="text-sm font-black uppercase tracking-widest">{successMsg}</span>
                    </motion.div>
                )}
            </AnimatePresence>
        </main>
    );
}
