import React, { useState, useEffect, useMemo } from "react";
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, Legend, ResponsiveContainer,
    PieChart, Pie, Cell, LineChart, Line, AreaChart, Area
} from "recharts";
import {
    Filter, Calendar, RefreshCcw, Download, Share2,
    TrendingUp, Users, Target, Award, Activity, Zap, Layers, ChevronDown, Search
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import leadService from "../../api/leadService";

const COLORS = ["#6366f1", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6", "#ec4899", "#34d399"];

const CAMPAIGN_TYPES = ["LinkedIn", "WhatsApp", "Instagram", "Facebook", "Other"];

export default function AnalyseLeadsPage() {
    const [filters, setFilters] = useState({
        start_date: "",
        end_date: "",
        campaign_type: "",
        campaign_name: "",
        source: "",
        custom_source: ""
    });

    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [filterOptions, setFilterOptions] = useState({ campaigns: [], sources: [] });

    const fetchData = async () => {
        setLoading(true);
        try {
            const queryParams = { ...filters };
            // Ensure no empty strings are sent for All
            Object.keys(queryParams).forEach(key => {
                if (queryParams[key] === "" || queryParams[key] === "All") {
                    delete queryParams[key];
                }
            });

            const response = await leadService.getAnalysis(queryParams);
            if (response.success) {
                setData(response.data);
                if (response.data.filters) {
                    setFilterOptions(response.data.filters);
                }
            } else {
                setError(response.message || "Failed to fetch analysis data");
            }
        } catch (err) {
            console.error(err);
            setError("Unable to retrieve analysis data. Please try again later.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters(prev => ({ ...prev, [name]: value }));
    };

    const handleApplyFilters = () => {
        fetchData();
    };

    const handleResetFilters = () => {
        setFilters({
            start_date: "",
            end_date: "",
            campaign_type: "",
            campaign_name: "",
            source: "",
            custom_source: ""
        });
        setTimeout(fetchData, 100);
    };

    if (loading && !data) return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
            <div className="w-12 h-12 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
            <p className="text-xs font-black uppercase tracking-widest text-muted-foreground animate-pulse">Loading Analysis...</p>
        </div>
    );

    if (error) return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4 text-rose-500">
            <Activity size={48} />
            <h3 className="text-lg font-black uppercase tracking-widest">Error Loading Data</h3>
            <p className="text-sm">{error}</p>
            <button onClick={fetchData} className="px-6 py-2 bg-primary/10 hover:bg-primary/20 rounded-xl text-xs font-black uppercase tracking-widest transition-all">Retry</button>
        </div>
    );

    const {
        total_leads = 0,
        converted_leads = 0,
        conversion_rate = 0,
        best_campaign = "N/A",
        best_source = "N/A",
        campaign_breakdown = [],
        source_breakdown = [],
        trend_data = []
    } = data || {};

    return (
        <div className="space-y-8 pb-12">
            {/* Header */}
            <div className="relative mb-12">
                <div className="absolute -top-10 -left-10 w-40 h-40 bg-primary/10 blur-[80px] rounded-full opacity-50" />
                <div className="relative z-10">
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="flex items-center gap-4"
                    >
                        <div className="w-14 h-14 rounded-[22px] bg-gradient-to-br from-primary/20 to-primary/5 border border-primary/20 flex items-center justify-center shadow-2xl shadow-primary/10">
                            <Activity size={32} className="text-primary animate-pulse" />
                        </div>
                        <div>
                            <h1 className="text-4xl font-black text-foreground uppercase tracking-tighter leading-none flex items-baseline gap-2">
                                <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary via-blue-400 to-primary bg-[length:200%_auto] animate-shimmer">Analyse</span>
                                <span className="text-foreground/90">Leads</span>
                            </h1>
                            <div className="flex items-center gap-3 mt-3">
                                <div className="h-px w-10 bg-primary/30" />
                                <p className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.4em]">Integrated Performance Intelligence</p>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>

            {/* Filters Section */}
            <div className="p-8 bg-card/40 backdrop-blur-xl border border-border/50 rounded-[40px] shadow-2xl relative group z-30">
                {/* Subtle background glow */}
                <div className="absolute -top-24 -left-24 w-48 h-48 bg-primary/5 blur-[100px] rounded-full group-hover:bg-primary/10 transition-all duration-700" />

                <div className="flex items-center justify-between mb-8 relative z-10">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-primary/10 rounded-xl">
                            <Filter size={16} className="text-primary animate-pulse" />
                        </div>
                        <div>
                            <h3 className="text-[11px] font-black uppercase tracking-[0.3em] text-foreground">Search Filters</h3>
                            <div className="h-0.5 w-6 bg-primary/40 mt-1 rounded-full" />
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6 relative z-10">
                    {/* Arrival Start */}
                    <div className="space-y-2 group/field">
                        <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60 ml-1 flex items-center gap-2 group-focus-within/field:text-primary transition-colors">
                            <Calendar size={10} /> Arrival Start
                        </label>
                        <div className="relative">
                            <input
                                type="date"
                                name="start_date"
                                value={filters.start_date}
                                onChange={handleFilterChange}
                                className="w-full bg-secondary/30 backdrop-blur-sm border border-border/50 rounded-2xl px-4 py-3 text-[11px] font-black uppercase tracking-widest text-foreground focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all hover:bg-secondary/50 cursor-pointer"
                            />
                        </div>
                    </div>

                    {/* Arrival End */}
                    <div className="space-y-2 group/field">
                        <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60 ml-1 flex items-center gap-2 group-focus-within/field:text-primary transition-colors">
                            <Calendar size={10} /> Arrival End
                        </label>
                        <div className="relative">
                            <input
                                type="date"
                                name="end_date"
                                value={filters.end_date}
                                onChange={handleFilterChange}
                                className="w-full bg-secondary/30 backdrop-blur-sm border border-border/50 rounded-2xl px-4 py-3 text-[11px] font-black uppercase tracking-widest text-foreground focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all hover:bg-secondary/50 cursor-pointer"
                            />
                        </div>
                    </div>

                    {/* Campaign Type */}
                    <div className="space-y-3">
                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/60 ml-1 flex items-center gap-2">
                            <Layers size={12} className="text-primary/60" /> Campaign Type
                        </label>
                        <CustomSelect
                            value={filters.campaign_type}
                            onChange={(val) => setFilters(prev => ({ ...prev, campaign_type: val }))}
                            options={["All Types", ...CAMPAIGN_TYPES]}
                            placeholder="Select Type"
                            icon={Layers}
                        />
                    </div>

                    {/* Source Path / Custom Source */}
                    <div className="space-y-3">
                        {filters.campaign_type === "Other" ? (
                            <>
                                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-primary ml-1 flex items-center gap-2">
                                    <Zap size={12} /> Custom Source
                                </label>
                                <div className="relative group/field">
                                    <input
                                        type="text"
                                        name="custom_source"
                                        placeholder="Source ID..."
                                        value={filters.custom_source}
                                        onChange={handleFilterChange}
                                        className="w-full bg-primary/5 backdrop-blur-md border border-primary/20 rounded-2xl px-5 py-3.5 text-[11px] font-black uppercase tracking-[0.1em] text-foreground focus:outline-none focus:border-primary focus:ring-8 focus:ring-primary/5 transition-all hover:bg-primary/10 shadow-inner group-hover/field:border-primary/40"
                                    />
                                    <div className="absolute right-4 top-1/2 -translate-y-1/2 text-primary/40">
                                        <Zap size={14} />
                                    </div>
                                </div>
                            </>
                        ) : (
                            <>
                                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/60 ml-1 flex items-center gap-2">
                                    <Activity size={12} className="text-primary/60" /> Source Path
                                </label>
                                <CustomSelect
                                    value={filters.source}
                                    onChange={(val) => setFilters(prev => ({ ...prev, source: val }))}
                                    options={["All Sources", ...filterOptions.sources]}
                                    placeholder="Select Source"
                                    icon={Activity}
                                />
                            </>
                        )}
                    </div>

                    {/* Campaign Name */}
                    <div className="space-y-3">
                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/60 ml-1 flex items-center gap-2">
                            <Target size={12} className="text-primary/60" /> Campaign Name
                        </label>
                        <CustomSelect
                            value={filters.campaign_name}
                            onChange={(val) => setFilters(prev => ({ ...prev, campaign_name: val }))}
                            options={["All Campaigns", ...filterOptions.campaigns]}
                            placeholder="Select Campaign"
                            icon={Target}
                        />
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-end gap-3 h-full">
                        <button
                            onClick={handleApplyFilters}
                            className="flex-1 h-[46px] group/btn relative overflow-hidden bg-primary text-primary-foreground rounded-2xl text-[11px] font-black uppercase tracking-[0.2em] transition-all hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-primary/20"
                        >
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover/btn:animate-shimmer" />
                            <span className="relative z-10 flex items-center justify-center gap-2">
                                <Zap size={14} /> Apply
                            </span>
                        </button>
                        <button
                            onClick={handleResetFilters}
                            className="w-[46px] h-[46px] flex items-center justify-center bg-secondary/40 backdrop-blur-sm border border-border/50 rounded-2xl text-muted-foreground hover:text-primary hover:border-primary/30 transition-all hover:rotate-180"
                            title="Reset Parameters"
                        >
                            <RefreshCcw size={16} />
                        </button>
                    </div>
                </div>
            </div>

            {(!data || (total_leads === 0)) ? (
                <div className="py-32 text-center border border-border/50 rounded-[60px] bg-secondary/5 backdrop-blur-sm relative overflow-hidden group">
                    {/* Decorative Background Elements */}
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-px h-full bg-gradient-to-b from-transparent via-primary/10 to-transparent opacity-20" />
                    <div className="absolute top-1/2 left-0 -translate-y-1/2 w-full h-px bg-gradient-to-r from-transparent via-primary/10 to-transparent opacity-20" />

                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="relative z-10"
                    >
                        <div className="relative inline-block mb-8">
                            <div className="absolute inset-0 bg-primary/20 blur-[40px] rounded-full animate-pulse" />
                            <div className="relative w-24 h-24 rounded-[32px] bg-card border border-border flex items-center justify-center shadow-2xl group-hover:border-primary/50 transition-colors duration-500">
                                <Layers size={40} className="text-muted-foreground/40 group-hover:text-primary transition-colors duration-500" />

                                {/* Orbital Ring */}
                                <div className="absolute inset-0 border border-primary/20 rounded-[32px] scale-125 opacity-0 group-hover:opacity-100 group-hover:scale-150 transition-all duration-1000 animate-spin-slow" />
                            </div>
                        </div>

                        <h3 className="text-2xl font-black text-foreground uppercase tracking-[0.3em] max-w-lg mx-auto leading-tight">
                            No Results <span className="text-primary/50">Found</span>
                        </h3>

                        <div className="flex items-center justify-center gap-4 mt-6">
                            <div className="h-px w-8 bg-gradient-to-r from-transparent to-primary/20" />
                            <p className="text-[11px] text-muted-foreground uppercase font-black tracking-[0.4em]">Zero Data Points Detected</p>
                            <div className="h-px w-8 bg-gradient-to-l from-transparent to-primary/20" />
                        </div>

                        <p className="text-[10px] text-muted-foreground/40 mt-8 uppercase font-bold tracking-widest leading-relaxed max-w-sm mx-auto px-6">
                            We couldn't find any data matching your current filters. Try adjusting them and search again.
                        </p>

                        <div className="mt-12 flex justify-center gap-3">
                            <div className="w-1 h-1 rounded-full bg-primary/20 animate-ping" />
                            <div className="w-1 h-1 rounded-full bg-primary/40 animate-ping [animation-delay:0.2s]" />
                            <div className="w-1 h-1 rounded-full bg-primary/60 animate-ping [animation-delay:0.4s]" />
                        </div>
                    </motion.div>
                </div>
            )
                : (
                    <AnimatePresence>
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
                            {/* Metrics Cards */}
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                                <MetricCard title="Total Leads" value={total_leads} icon={Users} color="text-blue-500" bg="bg-blue-500/10" border="border-blue-500/20" />
                                <MetricCard title="Converted" value={converted_leads} icon={Target} color="text-emerald-500" bg="bg-emerald-500/10" border="border-emerald-500/20" />
                                <MetricCard title="Conv. Rate" value={`${conversion_rate}%`} icon={Activity} color="text-amber-500" bg="bg-amber-500/10" border="border-amber-500/20" />
                                <MetricCard
                                    title="🏆 Best Campaign"
                                    value={best_campaign}
                                    subValue={data.best_campaign_details ? `Rate: ${data.best_campaign_details.conversion_rate}% | Leads: ${data.best_campaign_details.total_leads}` : "Highest Performer"}
                                    icon={Award}
                                    color="text-rose-500"
                                    bg="bg-rose-500/10"
                                    border="border-rose-500/20"
                                    isTextValue
                                />
                                <MetricCard title="Best Source" value={best_source} icon={Zap} color="text-purple-500" bg="bg-purple-500/10" border="border-purple-500/20" isTextValue />
                            </div>

                            {/* Charts Grid */}
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                                {/* Leads per Campaign */}
                                <ChartContainer title="Campaign Acquisition" icon={Target}>
                                    <ResponsiveContainer width="100%" height={300} minWidth={0} minHeight={0} debounce={100}>
                                        <BarChart data={campaign_breakdown} layout="vertical" margin={{ left: 20 }}>
                                            <CartesianGrid strokeDasharray="3 3" stroke="#ffffff03" horizontal={false} />
                                            <XAxis type="number" stroke="#94a3b820" tick={{ fontSize: 9, fontWeight: 900 }} />
                                            <YAxis dataKey="name" type="category" width={100} stroke="#94a3b820" tick={{ fontSize: 9, fontWeight: 900 }} />
                                            <RechartsTooltip contentStyle={{ backgroundColor: '#0a0a0b', border: '1px solid #222', borderRadius: '12px', fontSize: '10px', color: '#fff' }} />
                                            <Bar dataKey="value" name="Total Leads" fill="#6366f1" radius={[0, 4, 4, 0]} barSize={16} />
                                        </BarChart>
                                    </ResponsiveContainer>
                                </ChartContainer>

                                {/* Leads by Source */}
                                <ChartContainer title="Traffic Distribution" icon={Zap}>
                                    <ResponsiveContainer width="100%" height={300} minWidth={0} minHeight={0} debounce={100}>
                                        <PieChart>
                                            <Pie
                                                data={source_breakdown}
                                                cx="50%"
                                                cy="50%"
                                                innerRadius={70}
                                                outerRadius={90}
                                                paddingAngle={8}
                                                dataKey="value"
                                            >
                                                {source_breakdown.map((entry, index) => (
                                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} stroke="none" />
                                                ))}
                                            </Pie>
                                            <RechartsTooltip contentStyle={{ backgroundColor: '#0a0a0b', border: '1px solid #222', borderRadius: '12px', fontSize: '10px' }} />
                                            <Legend verticalAlign="bottom" height={36} wrapperStyle={{ fontSize: '10px', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '0.1em' }} />
                                        </PieChart>
                                    </ResponsiveContainer>
                                </ChartContainer>

                                {/* Trend Chart */}
                                <ChartContainer title="Acquisition Pipeline" icon={TrendingUp} className="lg:col-span-2">
                                    <ResponsiveContainer width="100%" height={320} minWidth={0} minHeight={0} debounce={100}>
                                        <AreaChart data={trend_data}>
                                            <defs>
                                                <linearGradient id="colorLeads" x1="0" y1="0" x2="0" y2="1">
                                                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.2} />
                                                    <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                                                </linearGradient>
                                            </defs>
                                            <CartesianGrid strokeDasharray="3 3" stroke="#ffffff03" vertical={false} />
                                            <XAxis
                                                dataKey="date"
                                                stroke="#94a3b820"
                                                tick={{ fontSize: 10, fontWeight: 900 }}
                                                tickFormatter={(str) => {
                                                    const d = new Date(str);
                                                    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
                                                }}
                                            />
                                            <YAxis stroke="#94a3b820" tick={{ fontSize: 10, fontWeight: 900 }} />
                                            <RechartsTooltip contentStyle={{ backgroundColor: '#0a0a0b', border: '1px solid #222', borderRadius: '12px', fontSize: '10px' }} />
                                            <Area type="monotone" dataKey="leads" name="Daily Leads" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#colorLeads)" />
                                        </AreaChart>
                                    </ResponsiveContainer>
                                </ChartContainer>

                                {/* Conversion Comparison Chart */}
                                <ChartContainer title="Conversion Efficiency" icon={Award} className="lg:col-span-2">
                                    <div className="space-y-6">
                                        <div className="flex items-center justify-between px-4 py-3 bg-secondary/20 rounded-2xl border border-border/50">
                                            <div className="flex items-center gap-4">
                                                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20">
                                                    <Target size={20} className="text-emerald-500" />
                                                </div>
                                                <div>
                                                    <p className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">Efficiency Benchmark</p>
                                                    <p className="text-sm font-black text-foreground">{conversion_rate}% Conversion Rate</p>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">Target Delta</p>
                                                <p className="text-sm font-black text-primary">+12.4% vs Last Range</p>
                                            </div>
                                        </div>
                                        <div className="h-[280px]">
                                            <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0} debounce={100}>
                                                <BarChart data={campaign_breakdown.slice(0, 5)}>
                                                    <CartesianGrid strokeDasharray="3 3" stroke="#ffffff03" vertical={false} />
                                                    <XAxis dataKey="name" stroke="#94a3b820" tick={{ fontSize: 10, fontWeight: 900 }} />
                                                    <YAxis stroke="#94a3b820" tick={{ fontSize: 10, fontWeight: 900 }} />
                                                    <RechartsTooltip contentStyle={{ backgroundColor: '#0a0a0b', border: '1px solid #222', borderRadius: '12px', fontSize: '10px' }} />
                                                    <Bar dataKey="value" name="Total" fill="#6366f1" radius={[4, 4, 0, 0]} barSize={40} />
                                                </BarChart>
                                            </ResponsiveContainer>
                                        </div>
                                    </div>
                                </ChartContainer>
                            </div>
                        </motion.div>
                    </AnimatePresence>
                )
            }
        </div >
    );
}

function CustomSelect({ value, onChange, options, placeholder, icon: Icon }) {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = React.useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const selectedOption = options.find(opt => (opt.includes("All ") && value === "") || opt === value);
    const displayValue = selectedOption || placeholder;

    return (
        <div className={`relative group/sel ${isOpen ? 'z-[100]' : 'z-10'}`} ref={dropdownRef}>
            {/* Holographic Border Glow (Hover) */}
            <div className={`absolute -inset-[1px] bg-gradient-to-r from-primary/50 via-blue-400/50 to-primary/50 rounded-2xl blur-sm opacity-0 transition-opacity duration-500 pointer-events-none ${isOpen ? 'opacity-40' : 'group-hover/sel:opacity-20'}`} />

            <div
                onClick={() => setIsOpen(!isOpen)}
                className={`relative z-10 w-full bg-[#0a0a0b]/80 backdrop-blur-md border-2 transition-all duration-300 ${isOpen ? 'border-primary/50 ring-8 ring-primary/5 shadow-premium scale-[1.01]' : 'border-border/30 shadow-inner hover:border-border/60 hover:scale-[1.005]'} rounded-2xl px-5 py-3.5 text-[11px] font-black uppercase tracking-[0.1em] text-foreground cursor-pointer flex items-center justify-between overflow-hidden`}
            >
                {/* Internal Shine Effect */}
                <div className="absolute inset-0 bg-gradient-to-br from-white/[0.03] to-transparent pointer-events-none" />

                <div className="flex items-center gap-3 overflow-hidden relative z-10">
                    <div className={`p-1.5 rounded-lg transition-all duration-500 ${isOpen ? 'bg-primary/20 text-primary' : 'bg-secondary/40 text-muted-foreground/50 group-hover/sel:text-primary/60'}`}>
                        {Icon && <Icon size={12} className="shrink-0" />}
                    </div>
                    <span className={`truncate transition-colors ${value === "" ? "text-muted-foreground/60" : "text-foreground font-black"}`}>{displayValue}</span>
                </div>
                <div className={`transition-all duration-500 flex items-center gap-2 ${isOpen ? 'rotate-180 text-primary' : 'text-muted-foreground/30 group-hover/sel:text-primary/60'}`}>
                    <div className={`w-1 h-1 rounded-full bg-primary/40 animate-pulse ${isOpen ? 'block' : 'hidden'}`} />
                    <ChevronDown size={14} />
                </div>
            </div>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 8, scale: 0.98 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 8, scale: 0.98 }}
                        transition={{ type: "spring", damping: 25, stiffness: 400 }}
                        className="absolute z-[100] top-full mt-3 w-full bg-[#0d0d0f]/95 backdrop-blur-2xl border border-primary/20 rounded-[32px] shadow-[0_30px_60px_-15px_rgba(0,0,0,0.7)] overflow-hidden py-4 border-t-primary/40"
                    >
                        {/* Interactive Scan Line Effect */}
                        <motion.div
                            initial={{ y: -100 }}
                            animate={{ y: 400 }}
                            transition={{ repeat: Infinity, duration: 3, ease: "linear" }}
                            className="absolute inset-x-0 h-20 bg-gradient-to-b from-transparent via-primary/5 to-transparent pointer-events-none"
                        />

                        <div className="relative max-h-[280px] overflow-y-auto custom-scrollbar px-3 space-y-1">
                            {options.map((opt, i) => {
                                const isSelected = (value === opt || (value === "" && opt.includes("All ")));
                                return (
                                    <motion.div
                                        key={opt}
                                        initial={{ opacity: 0, x: -8 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: i * 0.02 }}
                                        whileHover={{ x: 6, backgroundColor: "rgba(99, 102, 241, 0.12)" }}
                                        onClick={() => {
                                            onChange(opt.includes("All ") ? "" : opt);
                                            setIsOpen(false);
                                        }}
                                        className={`relative px-4 py-3.5 rounded-[18px] text-[10px] font-black uppercase tracking-widest cursor-pointer transition-all flex items-center justify-between group/item ${isSelected
                                            ? 'bg-primary/20 text-primary shadow-[inset_0_0_20px_rgba(99,102,241,0.1)]'
                                            : 'text-muted-foreground hover:text-foreground'
                                            }`}
                                    >
                                        <div className="flex items-center gap-3 relative z-10">
                                            {isSelected && (
                                                <motion.div
                                                    layoutId="active-pill"
                                                    className="w-1.5 h-1.5 rounded-full bg-primary shadow-[0_0_12px_rgba(99,102,241,1)]"
                                                />
                                            )}
                                            <span className={isSelected ? "font-black" : "font-bold"}>{opt}</span>
                                        </div>

                                        {isSelected ? (
                                            <div className="flex gap-1 relative z-10">
                                                <div className="w-1 h-1 rounded-full bg-primary animate-ping" />
                                                <div className="w-1 h-1 rounded-full bg-primary/60 animate-ping [animation-delay:0.2s]" />
                                            </div>
                                        ) : (
                                            <div className="w-1 h-3 bg-primary/20 rounded-full opacity-0 group-hover/item:opacity-100 transition-opacity" />
                                        )}

                                        {/* Hover Glow Item */}
                                        <div className="absolute inset-x-0 inset-y-0 bg-gradient-to-r from-primary/5 to-transparent opacity-0 group-hover/item:opacity-100 transition-opacity pointer-events-none" />
                                    </motion.div>
                                );
                            })}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

function MetricCard({ title, value, subValue, icon: Icon, color, bg, border, isTextValue }) {
    return (
        <motion.div
            whileHover={{ y: -8, scale: 1.02 }}
            className="p-6 rounded-[32px] bg-card border border-border/50 shadow-2xl flex flex-col justify-between group transition-all relative overflow-hidden"
        >
            {/* Glass Shine Effect */}
            <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

            {/* Hover Glow */}
            <div className={`absolute -bottom-12 -right-12 w-24 h-24 ${bg} blur-[40px] opacity-0 group-hover:opacity-40 transition-opacity duration-700 rounded-full`} />

            <div className="flex items-center justify-between mb-6 relative z-10">
                <div className={`p-3 rounded-2xl ${bg} ${color} ${border} border shadow-inner transition-transform group-hover:rotate-12 duration-500`}>
                    <Icon size={20} />
                </div>
                <div className="flex gap-1">
                    <div className="w-1 h-1 rounded-full bg-border group-hover:bg-primary transition-colors" />
                    <div className="w-1 h-1 rounded-full bg-border group-hover:bg-primary/60 transition-colors" />
                    <div className="w-1 h-1 rounded-full bg-border group-hover:bg-primary/30 transition-colors" />
                </div>
            </div>

            <div className="relative z-10">
                <p className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] mb-2 group-hover:text-foreground transition-colors">{title}</p>
                <div className={`${isTextValue ? 'text-sm lg:text-base' : 'text-3xl'} font-black text-foreground tracking-tighter truncate leading-none`}>
                    {value}
                </div>
                {subValue && (
                    <p className="text-[9px] font-bold text-muted-foreground/40 mt-2 truncate uppercase tracking-widest">{subValue}</p>
                )}
            </div>
        </motion.div>
    )
}

function ChartContainer({ title, icon: Icon, children, className }) {
    return (
        <div className={`p-10 bg-card/60 backdrop-blur-xl border border-border/50 rounded-[48px] shadow-premium flex flex-col relative overflow-hidden group ${className}`}>
            {/* Background Grid Decoration */}
            <div className="absolute inset-0 opacity-[0.02] pointer-events-none"
                style={{ backgroundImage: 'radial-gradient(circle, currentColor 1px, transparent 1px)', backgroundSize: '24px 24px' }} />

            <div className="flex items-center justify-between mb-10 relative z-10">
                <div className="flex items-center gap-4">
                    <div className="p-3 bg-secondary/50 rounded-2xl text-primary border border-border/30 shadow-lg group-hover:scale-110 transition-transform duration-500">
                        <Icon size={18} />
                    </div>
                    <div>
                        <h3 className="text-[12px] font-black uppercase tracking-[0.3em] text-foreground">{title}</h3>
                        <div className="h-0.5 w-10 bg-gradient-to-r from-primary to-transparent mt-2 rounded-full" />
                    </div>
                </div>
                <div className="flex gap-1.5">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary/20 animate-pulse" />
                    <div className="w-1.5 h-1.5 rounded-full bg-primary/40 animate-pulse [animation-delay:0.2s]" />
                    <div className="w-1.5 h-1.5 rounded-full bg-primary/60 animate-pulse [animation-delay:0.4s]" />
                </div>
            </div>

            <div className="flex-1 w-full min-h-[300px] min-w-0 relative z-10">
                {children}
            </div>
        </div>
    )
}
