import React, { useEffect, useState } from "react";
import { Trash2, RefreshCcw, Loader2, Archive, ShieldCheck, Clock, Layers, Filter, Search, MoreHorizontal } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import trashService from "../../api/trashService";
import { useNotifications } from "../../context/NotificationContext.jsx";

export default function TrashPage() {
    const { addNotification } = useNotifications();
    const [trash, setTrash] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeModule, setActiveModule] = useState("leads");
    const [searchQuery, setSearchQuery] = useState("");

    const fetchTrash = async (module) => {
        try {
            setLoading(true);
            const data = await trashService.getTrash(module);
            if (data.success) {
                setTrash(data.data);
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTrash(activeModule);
    }, [activeModule]);

    const handleRestore = async (id) => {
        try {
            const data = await trashService.restoreItem(activeModule, id);
            if (data.success) {
                setTrash(prev => prev.filter(item => item.id !== id));
                addNotification({
                    title: "Item Restored",
                    message: "The item has been successfully restored and is now active.",
                    type: "success",
                    icon: RefreshCcw
                });
            }
        } catch (err) {
            addNotification({ title: "Error", message: "Restoration failed", type: "error" });
        }
    };

    const handlePermanentDelete = async (id) => {
        if (!window.confirm("Are you sure you want to permanently delete this item? This action cannot be undone.")) return;
        try {
            const data = await trashService.permanentDelete(activeModule, id);
            if (data.success) {
                setTrash(prev => prev.filter(item => item.id !== id));
                addNotification({
                    title: "Item Deleted Permanently",
                    message: "The item and all associated data have been permanently removed.",
                    type: "warning",
                    icon: Trash2
                });
            }
        } catch (err) {
            addNotification({ title: "Error", message: "Purge failed", type: "error" });
        }
    };

    const filteredTrash = trash.filter(item =>
        (item.name || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
        (item.email || "").toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                <div className="flex items-center gap-5">
                    <div className="p-3.5 rounded-2xl bg-secondary border border-border text-muted-foreground shadow-lg">
                        <Archive size={24} />
                    </div>
                    <div>
                        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-foreground tracking-tight uppercase flex items-center gap-3">
                            <span className="text-foreground">Trash</span> <span className="text-primary">Archive</span>
                        </h1>
                        <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mt-1 opacity-60">
                            Soft-deleted entities awaiting manual purge or restoration
                        </p>
                    </div>
                </div>

                <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
                    {["leads", "projects", "campaigns"].map(m => (
                        <button
                            key={m}
                            onClick={() => setActiveModule(m)}
                            className={`flex-1 sm:flex-none px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeModule === m
                                ? "bg-primary text-white shadow-gradient shadow-primary/20"
                                : "bg-card border border-border text-muted-foreground hover:text-foreground"
                                }`}
                        >
                            {m}
                        </button>
                    ))}
                </div>
            </div>

            {/* Quick Stats Overlay */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                    { label: "Archived Nodes", value: trash.length, icon: Layers, color: "text-blue-500", bg: "bg-blue-500/10" },
                    { label: "Auto-Purge In", value: "28 Days", icon: Clock, color: "text-amber-500", bg: "bg-amber-500/10" },
                    { label: "Storage Saved", value: "2.4 MB", icon: ShieldCheck, color: "text-emerald-500", bg: "bg-emerald-500/10" }
                ].map((stat, i) => (
                    <div key={i} className="bg-card border border-border rounded-3xl p-6 flex items-center gap-5 shadow-sm">
                        <div className={`w-12 h-12 rounded-2xl ${stat.bg} ${stat.color} flex items-center justify-center`}>
                            <stat.icon size={20} />
                        </div>
                        <div>
                            <p className="text-[9px] font-black text-muted-foreground uppercase tracking-widest leading-none mb-1.5">{stat.label}</p>
                            <h4 className="text-lg font-black text-foreground uppercase tracking-tight">{stat.value}</h4>
                        </div>
                    </div>
                ))}
            </div>

            {/* Table Section */}
            <div className="bg-card border border-border rounded-[32px] overflow-hidden shadow-premium">
                <div className="px-8 py-6 border-b border-border flex items-center justify-between bg-muted/20">
                    <div className="relative group flex-1 max-w-sm">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground opacity-50" size={14} />
                        <input
                            type="text"
                            placeholder="Filter archived nodes..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full bg-input/50 focus:bg-input border border-border rounded-xl py-2.5 pl-11 pr-4 text-[11px] font-bold text-foreground focus:outline-none transition-all placeholder:text-muted-foreground/30 uppercase tracking-widest"
                        />
                    </div>
                    <div className="flex items-center gap-4 ml-6">
                        <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">{filteredTrash.length} Items Indexed</span>
                    </div>
                </div>

                <div className="overflow-x-auto no-scrollbar">
                    {loading ? (
                        <div className="p-20 flex flex-col items-center justify-center gap-4">
                            <Loader2 className="animate-spin text-primary" size={32} />
                            <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Accessing Secure Archive...</span>
                        </div>
                    ) : filteredTrash.length === 0 ? (
                        <div className="p-24 text-center">
                            <div className="w-16 h-16 rounded-3xl bg-secondary flex items-center justify-center text-muted-foreground/20 mx-auto mb-6">
                                <Trash2 size={32} />
                            </div>
                            <h3 className="text-[14px] font-black text-muted-foreground uppercase tracking-widest">Archive Empty</h3>
                        </div>
                    ) : (
                        <table className="w-full">
                            <thead>
                                <tr className="bg-muted/50 text-left border-b border-border">
                                    <th className="px-8 py-5 text-[9px] font-black text-muted-foreground uppercase tracking-[0.2em]">Entity Identity</th>
                                    <th className="px-8 py-5 text-[9px] font-black text-muted-foreground uppercase tracking-[0.2em]">Origin Node</th>
                                    <th className="px-8 py-5 text-[9px] font-black text-muted-foreground uppercase tracking-[0.2em]">Deleted On</th>
                                    <th className="px-8 py-5 text-right text-[9px] font-black text-muted-foreground uppercase tracking-[0.2em]">System Recovery</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border/50">
                                {filteredTrash.map((item) => (
                                    <tr key={item.id} className="hover:bg-muted/20 transition-colors group">
                                        <td className="px-8 py-6">
                                            <div className="flex items-center gap-4">
                                                <div className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center font-black text-muted-foreground text-[10px] border border-border uppercase">
                                                    {(item.name || item.title || "?")[0]}
                                                </div>
                                                <div>
                                                    <div className="text-[13px] font-black text-foreground tracking-tight uppercase">{item.name || item.title}</div>
                                                    <div className="text-[10px] font-bold text-muted-foreground mt-0.5 tracking-tight uppercase opacity-60">ID: #{item.id}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <span className="px-2.5 py-1 rounded-lg bg-primary/10 text-primary text-[9px] font-black uppercase tracking-widest border border-primary/20">
                                                {activeModule}
                                            </span>
                                        </td>
                                        <td className="px-8 py-6">
                                            <div className="text-[11px] font-bold text-muted-foreground uppercase tracking-tight">
                                                {new Date(item.deleted_at || item.updated_at).toLocaleDateString()}
                                            </div>
                                            <div className="text-[9px] text-muted-foreground/60 font-black mt-0.5 uppercase tracking-widest">
                                                {new Date(item.deleted_at || item.updated_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </div>
                                        </td>
                                        <td className="px-8 py-6 text-right">
                                            <div className="flex items-center justify-end gap-3 opacity-0 group-hover:opacity-100 transition-all">
                                                <button
                                                    onClick={() => handleRestore(item.id)}
                                                    className="px-4 py-2 rounded-xl bg-primary text-white text-[9px] font-black uppercase tracking-widest shadow-lg shadow-primary/20 hover:scale-105 active:scale-95 transition-all flex items-center gap-2"
                                                >
                                                    <RefreshCcw size={12} /> Reintegrate
                                                </button>
                                                <button
                                                    onClick={() => handlePermanentDelete(item.id)}
                                                    className="p-2.5 rounded-xl bg-rose-500/10 text-rose-500 border border-rose-500/20 hover:bg-rose-500 hover:text-white transition-all shadow-sm"
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>
        </div>
    );
}
