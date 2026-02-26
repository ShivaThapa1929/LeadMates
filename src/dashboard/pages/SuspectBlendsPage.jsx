import React, { useEffect, useState } from "react";
import { AlertTriangle, Trash2, Loader2, ShieldAlert, Activity, Filter, Search, MoreVertical, RefreshCcw } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import suspectService from "../../api/suspectService";
import { useNotifications } from "../../context/NotificationContext.jsx";

export default function SuspectBlendsPage() {
    const { addNotification } = useNotifications();
    const [suspects, setSuspects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchSuspects = async () => {
        try {
            setLoading(true);
            const data = await suspectService.getSuspects();
            if (data.success) {
                setSuspects(data.data);
            }
        } catch (err) {
            setError(err.message || "Failed to scan for suspects");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSuspects();
    }, []);

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to remove this suspect record permanently?")) return;
        try {
            const data = await suspectService.deleteSuspect(id);
            if (data.success) {
                setSuspects(prev => prev.filter(s => s.id !== id));
                addNotification({
                    title: "Anomaly Removed",
                    message: "The suspected record has been successfully deleted.",
                    type: "warning",
                    icon: Trash2
                });
            }
        } catch (err) {
            addNotification({ title: "Error", message: "Failed to delete suspect", type: "error" });
        }
    };

    if (loading) return (
        <div className="flex flex-col items-center justify-center min-h-[400px] gap-3 text-gray-400">
            <Loader2 className="animate-spin" size={32} />
            <p className="text-[10px] font-black uppercase tracking-widest opacity-60">Scanning Neural Patterns...</p>
        </div>
    );

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                <div className="flex items-center gap-5">
                    <div className="p-3.5 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-500 shadow-lg shadow-rose-500/10">
                        <AlertTriangle size={24} />
                    </div>
                    <div>
                        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-foreground tracking-tight uppercase flex items-center gap-3">
                            <span className="text-foreground">Suspect</span> <span className="text-rose-500">Blends</span>
                        </h1>
                        <div className="flex items-center gap-2 mt-1 px-3 py-1 rounded-lg bg-rose-500/10 border border-rose-500/20 w-fit">
                            <span className="w-1.5 h-1.5 bg-rose-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(239,68,68,0.4)]" />
                            <span className="text-[9px] font-black text-rose-500 uppercase tracking-widest">{suspects.length} Anomaly Detections</span>
                        </div>
                    </div>
                </div>
                <div className="flex items-center gap-3 w-full sm:w-auto">
                    <button
                        onClick={fetchSuspects}
                        className="flex-1 sm:flex-none flex items-center justify-center gap-3 px-6 py-3 bg-secondary border border-border text-muted-foreground rounded-xl text-[11px] font-black uppercase tracking-widest hover:text-foreground transition-all active:scale-95"
                    >
                        <RefreshCcw size={16} />
                        Rescan
                    </button>
                </div>
            </div>

            {/* Suspect Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <AnimatePresence mode="popLayout">
                    {suspects.map((s) => (
                        <motion.div
                            layout
                            key={s.id}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            className="bg-card border border-rose-500/10 rounded-[32px] p-8 relative group hover:border-rose-500/30 transition-all shadow-premium overflow-hidden"
                        >
                            <div className="absolute top-0 right-0 w-32 h-32 bg-rose-500/5 blur-[60px] pointer-events-none" />

                            <div className="flex items-start justify-between mb-6">
                                <div className="p-3 rounded-2xl bg-rose-500/10 text-rose-500 border border-rose-500/20">
                                    <ShieldAlert size={20} />
                                </div>
                                <button
                                    onClick={() => handleDelete(s.id)}
                                    className="p-2.5 rounded-xl bg-secondary border border-border text-muted-foreground hover:bg-rose-500 hover:text-white hover:border-rose-500 transition-all shadow-sm"
                                >
                                    <Trash2 size={16} />
                                </button>
                            </div>

                            <div className="space-y-4">
                                <h3 className="text-lg font-black text-foreground uppercase tracking-tight group-hover:text-rose-500 transition-colors">
                                    {s.name || "Unknown Identity"}
                                </h3>
                                <div className="space-y-2">
                                    <div className="flex justify-between items-center text-[10px] uppercase font-black tracking-widest text-muted-foreground">
                                        <span>Anomaly Type</span>
                                        <span className="text-rose-500">{s.reason || "Bot Behavior"}</span>
                                    </div>
                                    <div className="h-1.5 w-full bg-secondary rounded-full overflow-hidden">
                                        <div className="h-full bg-rose-500 w-[75%] shadow-[0_0_10px_rgba(239,68,68,0.4)]" />
                                    </div>
                                </div>
                                <div className="pt-4 border-t border-border/50 flex flex-col gap-2">
                                    <div className="flex items-center gap-2 text-[9px] font-black text-muted-foreground uppercase opacity-60">
                                        <Activity size={12} /> Last Trace: {new Date(s.created_at || Date.now()).toLocaleDateString()}
                                    </div>
                                    <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-tight leading-relaxed">
                                        Metadata sync failed integrity check. Multiple duplicate entries detected from proxy node.
                                    </p>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>

            {suspects.length === 0 && (
                <div className="p-20 text-center rounded-[32px] border border-border bg-card/50 backdrop-blur-sm shadow-premium">
                    <div className="w-16 h-16 rounded-3xl bg-emerald-500/10 border border-emerald-500/20 shadow-emerald-500/20 flex items-center justify-center text-emerald-500 mx-auto mb-6">
                        <Activity size={32} />
                    </div>
                    <h3 className="text-lg font-black text-foreground uppercase tracking-widest mb-2">Clean Signals</h3>
                    <p className="text-xs text-muted-foreground font-bold uppercase tracking-widest opacity-60 max-w-[300px] mx-auto leading-relaxed">
                        No active anomalies detected in the intelligence stream. All nodes verified.
                    </p>
                </div>
            )}
        </div>
    );
}
