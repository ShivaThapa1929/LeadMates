import React, { useEffect, useState, useMemo } from "react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell, AreaChart, Area
} from "recharts";
import { Loader2, TrendingUp, Users, Filter, BarChart3, PieChart as PieChartIcon, Activity, Zap, Layers, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import leadService from "../../api/leadService";

const COLORS = ["#6366f1", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6", "#ec4899"];

export default function AnalyticsPage() {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await leadService.getLeads();
      if (response.success && Array.isArray(response.data)) {
        setLeads(response.data);
      } else {
        setLeads([]);
      }
    } catch (err) {
      setError("Failed to load analytics data.");
      setLeads([]);
    } finally {
      setLoading(false);
    }
  };

  const statusData = useMemo(() => {
    if (!Array.isArray(leads)) return [];
    const counts = {};
    leads.forEach(l => {
      const s = l.status || 'Unknown';
      counts[s] = (counts[s] || 0) + 1;
    });
    return Object.keys(counts).map(key => ({ name: key, value: counts[key] }));
  }, [leads]);

  const channelData = useMemo(() => {
    if (!Array.isArray(leads)) return [];
    const counts = {};
    leads.forEach(l => {
      const c = l.channel || 'Direct';
      counts[c] = (counts[c] || 0) + 1;
    });
    return Object.keys(counts).map(key => ({ name: key, value: counts[key] }));
  }, [leads]);

  const timelineData = useMemo(() => {
    if (!Array.isArray(leads)) return [];
    const months = {};
    leads.forEach(l => {
      const date = new Date(l.created_at);
      const key = date.toLocaleString('default', { month: 'short' });
      months[key] = (months[key] || 0) + 1;
    });
    return Object.keys(months).map(k => ({ name: k, leads: months[k] }));
  }, [leads]);

  const conversionRate = useMemo(() => {
    if (!Array.isArray(leads) || leads.length === 0) return 0;
    const converted = leads.filter(l => l.status === 'Won' || l.status === 'Qualified').length;
    return ((converted / leads.length) * 100).toFixed(1);
  }, [leads]);

  if (loading) return (
    <div className="flex flex-col items-center justify-center min-h-[400px] gap-3 text-gray-400">
      <Loader2 className="animate-spin" size={32} />
      <p className="text-[10px] font-black uppercase tracking-widest opacity-60">Loading Analytics...</p>
    </div>
  );

  if (error) return (
    <div className="p-10 text-center">
      <Activity size={48} className="mx-auto text-rose-500 mb-4 opacity-50" />
      <h3 className="text-xl font-black text-rose-500 uppercase tracking-widest">Error Loading Data</h3>
      <p className="text-xs text-muted-foreground mt-2 uppercase font-black tracking-widest">{error}</p>
    </div>
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-10 pb-12"
    >
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div className="flex items-center gap-5">
          <div className="p-4 rounded-[24px] bg-primary/10 border border-primary/20 text-primary shadow-lg shadow-primary/10">
            <Activity size={24} />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-foreground tracking-tight uppercase flex items-center gap-3">

              <span className="text-foreground">Analytics</span> <span className="text-primary">Dashboard</span>
            </h1>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-[9px] font-black text-muted-foreground uppercase tracking-widest opacity-60">Status: Active</span>
              <ChevronRight size={10} className="text-muted-foreground opacity-30" />
              <span className="text-[9px] font-black text-primary uppercase tracking-widest">Real-Time</span>
            </div>
          </div>
        </div>
      </div>

      {/* KPI Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
        <KpiCard title="Active Leads" value={leads.length} icon={Users} color="text-primary" bg="bg-primary/10" border="border-primary/20" trend="+12%" />
        <KpiCard title="Conversion" value={`${conversionRate}%`} icon={Zap} color="text-primary" bg="bg-primary/10" border="border-primary/20" trend="+4.5%" />
        <KpiCard title="Lead Sources" value={channelData.length} icon={Layers} color="text-primary" bg="bg-primary/10" border="border-primary/20" trend="Active" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-10">
        {/* Status Analysis */}
        <ChartCard title="Status Distribution" icon={PieChartIcon}>
          <div className="h-[350px] w-full min-w-0 mt-4">
            <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0} debounce={200}>
              <PieChart>
                <Pie
                  data={statusData}
                  cx="50%"
                  cy="50%"
                  innerRadius={80}
                  outerRadius={110}
                  paddingAngle={5}
                  dataKey="value"
                  stroke="none"
                >
                  {statusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <RechartsTooltip
                  contentStyle={{ backgroundColor: '#000000cc', backdropFilter: 'blur(8px)', border: '1px solid #ffffff10', borderRadius: '16px', color: '#fff', fontSize: '12px', fontWeight: 'bold' }}
                />
                <Legend iconType="circle" wrapperStyle={{ paddingTop: '30px', fontWeight: '900', fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.1em', opacity: 0.7 }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>

        {/* Source Analysis */}
        <ChartCard title="Lead Channels" icon={BarChart3}>
          <div className="h-[350px] w-full min-w-0 mt-4">
            <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0} debounce={200}>
              <BarChart data={channelData} barSize={32}>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" vertical={false} />
                <XAxis
                  dataKey="name"
                  stroke="#94a3b830"
                  tick={{ fontSize: 10, fontWeight: '900', fill: '#94a3b8' }}
                  axisLine={false}
                  tickLine={false}
                  dy={15}
                />
                <YAxis
                  stroke="#94a3b830"
                  tick={{ fontSize: 10, fontWeight: '900', fill: '#94a3b8' }}
                  axisLine={false}
                  tickLine={false}
                  dx={-15}
                />
                <RechartsTooltip
                  cursor={{ fill: '#ffffff05' }}
                  contentStyle={{ backgroundColor: '#000000cc', backdropFilter: 'blur(8px)', border: '1px solid #ffffff10', borderRadius: '16px', color: '#fff', fontSize: '12px', fontWeight: 'bold' }}
                />
                <Bar dataKey="value" radius={[8, 8, 0, 0]}>
                  {channelData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} fillOpacity={0.8} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>
      </div>

      {/* Temporal Expansion */}
      <ChartCard title="Lead Trends" icon={TrendingUp}>
        <div className="h-[400px] w-full min-w-0 mt-6">
          <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0} debounce={200}>
            <AreaChart data={timelineData}>
              <defs>
                <linearGradient id="colorLeads" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="var(--primary)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#ffffff03" vertical={false} />
              <XAxis
                dataKey="name"
                stroke="#94a3b830"
                tick={{ fontSize: 10, fontWeight: '900', fill: '#94a3b8' }}
                axisLine={false}
                tickLine={false}
                dy={15}
              />
              <YAxis
                stroke="#94a3b830"
                tick={{ fontSize: 10, fontWeight: '900', fill: '#94a3b8' }}
                axisLine={false}
                tickLine={false}
                dx={-15}
              />
              <RechartsTooltip
                contentStyle={{ backgroundColor: '#000000cc', backdropFilter: 'blur(8px)', border: '1px solid #ffffff10', borderRadius: '16px', color: '#fff', fontSize: '12px', fontWeight: 'bold' }}
              />
              <Area
                type="monotone"
                dataKey="leads"
                stroke="var(--primary)"
                strokeWidth={4}
                fillOpacity={1}
                fill="url(#colorLeads)"
                animationDuration={2000}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </ChartCard>
    </motion.div>
  );
}

function KpiCard({ title, value, icon: Icon, color, bg, border, trend }) {
  return (
    <motion.div
      whileHover={{ scale: 1.02, y: -5 }}
      className={`p-8 rounded-[32px] bg-card border border-border shadow-premium relative overflow-hidden group transition-all`}
    >
      <div className={`absolute top-0 right-0 w-32 h-32 ${bg} blur-[60px] pointer-events-none group-hover:blur-[80px] transition-all`} />

      <div className="flex items-center justify-between relative z-10 mb-6">
        <div className={`p-4 rounded-[20px] ${bg} ${border} border ${color} shadow-inner`}>
          <Icon size={24} />
        </div>
        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-[9px] font-black text-emerald-500 uppercase tracking-widest shadow-sm">
          {trend}
        </div>
      </div>

      <div className="relative z-10">
        <p className="text-[10px] text-muted-foreground font-black uppercase tracking-[0.25em] mb-2 opacity-60">{title}</p>
        <div className="text-4xl font-black text-foreground tracking-tighter italic">
          {value}
        </div>
      </div>
    </motion.div>
  )
}

function ChartCard({ title, icon: Icon, children }) {
  return (
    <div className="p-8 sm:p-10 rounded-[40px] bg-card border border-border shadow-premium relative group overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-border to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
      <div className="flex items-center justify-between mb-8 sm:mb-10">
        <div className="flex items-center gap-4">
          <div className="p-3 rounded-2xl bg-secondary border border-border text-foreground shadow-sm group-hover:text-primary transition-colors">
            <Icon size={20} />
          </div>
          <h3 className="text-sm font-black uppercase tracking-[0.2em] text-foreground">{title}</h3>
        </div>
        <div className="hidden sm:flex items-center gap-2">
          <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
          <span className="text-[8px] font-black uppercase tracking-widest text-muted-foreground opacity-50">Operational</span>
        </div>
      </div>
      {children}
    </div>
  )
}

