import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Loader2, Phone, Mail, User, Shield, Clock, TrendingUp, AlertTriangle } from "lucide-react";
import leadService from "../../api/leadService";

export default function LeadDetailsPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [lead, setLead] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchLead = async () => {
            try {
                setLoading(true);
                const response = await leadService.getLead(id);
                if (response.success) {
                    setLead(response.data);
                } else {
                    setError("Lead not found");
                }
            } catch (err) {
                try {
                    const allLeads = await leadService.getLeads();
                    if (allLeads.success) {
                        const found = allLeads.data.find(l => l.id.toString() === id);
                        if (found) setLead(found);
                        else setError("Lead not found");
                    }
                } catch (fallbackErr) {
                    setError(err.message || "Failed to fetch lead details");
                }
            } finally {
                setLoading(false);
            }
        };
        fetchLead();
    }, [id]);

    if (loading) return (
        <div className="flex h-[50vh] items-center justify-center text-muted-foreground">
            <Loader2 className="animate-spin mr-2" /> Loading Lead Details...
        </div>
    );

    if (error || !lead) return (
        <div className="flex h-[50vh] flex-col items-center justify-center text-muted-foreground gap-4">
            <AlertTriangle size={48} className="text-rose-500" />
            <div className="text-lg font-black uppercase tracking-widest">{error || "Lead Not Found"}</div>
            <button onClick={() => navigate(-1)} className="text-primary hover:underline">Go Back</button>
        </div>
    );

    return (
        <div className="space-y-8 animate-fade-in max-w-5xl mx-auto">
            {/* Header */}
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                <div className="flex items-center gap-4 sm:gap-5 w-full min-w-0">
                    <button
                        onClick={() => navigate(-1)}
                        className="p-3 rounded-xl bg-secondary border border-border text-muted-foreground hover:text-foreground hover:bg-background transition-all font-mono cursor-pointer shadow-sm shrink-0"
                    >
                        <ArrowLeft size={18} />
                    </button>
                    <div className="min-w-0 flex-1">
                        <h1 className="text-2xl sm:text-3xl font-black text-foreground uppercase tracking-tight truncate">{lead.name}</h1>
                        <div className="flex flex-wrap items-center gap-3 mt-1">
                            <span className={`px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-widest whitespace-nowrap ${lead.status === 'SUSPECTED' ? 'bg-rose-500/10 text-rose-500' : 'bg-emerald-500/10 text-emerald-500'}`}>
                                {lead.status}
                            </span>
                            <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest flex items-center gap-1 whitespace-nowrap">
                                <Clock size={10} /> Created {new Date(lead.created_at || Date.now()).toLocaleDateString()}
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Main Info Card */}
                <div className="md:col-span-2 space-y-6">
                    <div className="bg-card border border-border rounded-[24px] p-8 shadow-sm relative overflow-hidden">
                        <div className="flex items-start justify-between mb-8">
                            <h3 className="text-xs font-black text-muted-foreground uppercase tracking-[0.2em]">Contact Information</h3>
                            <User className="text-primary opacity-20" size={40} />
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                            <div className="space-y-1">
                                <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Email Address</label>
                                <div className="flex items-center gap-2 text-foreground font-bold">
                                    <Mail size={14} className="text-blue-500" />
                                    {lead.email || "N/A"}
                                </div>
                            </div>
                            <div className="space-y-1">
                                <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Phone Number</label>
                                <div className="flex items-center gap-2 text-foreground font-bold">
                                    <Phone size={14} className="text-emerald-500" />
                                    {lead.phone || "N/A"}
                                </div>
                            </div>
                            <div className="space-y-1">
                                <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Traffic Channel</label>
                                <div className="flex items-center gap-2 text-foreground font-bold">
                                    <TrendingUp size={14} className="text-purple-500" />
                                    {lead.channel || "Direct"}
                                </div>
                            </div>
                            <div className="space-y-1">
                                <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Assigned To</label>
                                <div className="flex items-center gap-2 text-foreground font-bold">
                                    <Shield size={14} className="text-orange-500" />
                                    {lead.assignee_name || "Unassigned"}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Strategic Parameters / Custom Fields */}
                    {lead.custom_values && typeof lead.custom_values === 'object' && Object.keys(lead.custom_values).length > 0 && (
                        <div className="bg-card border border-border rounded-[24px] p-8 shadow-sm">
                            <h3 className="text-xs font-black text-muted-foreground uppercase tracking-[0.2em] mb-6 flex items-center gap-2">
                                <Shield size={16} className="text-primary" /> Additional Details
                            </h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                {Object.entries(lead.custom_values).map(([key, value]) => (
                                    <div key={key} className="p-4 rounded-xl bg-secondary/30 border border-border/50">
                                        <label className="text-[9px] font-black text-muted-foreground uppercase tracking-widest mb-1 block opacity-60">{key}</label>
                                        <div className="text-[13px] font-black text-foreground uppercase tracking-wide">
                                            {String(value) || "NOT_DEFINED"}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Notes Section */}
                    <div className="bg-card border border-border rounded-[24px] p-8 shadow-sm">
                        <h3 className="text-xs font-black text-muted-foreground uppercase tracking-[0.2em] mb-4">Notes</h3>
                        <div className="p-4 rounded-xl bg-secondary/50 border border-border min-h-[100px] text-sm text-foreground">
                            {lead.notes || "No additional notes recorded for this lead."}
                        </div>
                    </div>
                </div>

                {/* Sidebar Actions */}
                <div className="space-y-4">
                    <div className="bg-card border border-border rounded-[24px] p-6 shadow-sm">
                        <h3 className="text-xs font-black text-muted-foreground uppercase tracking-[0.2em] mb-4">Quick Actions</h3>
                        <div className="space-y-3">
                            <button
                                onClick={() => lead.phone ? window.location.href = `tel:${lead.phone}` : alert("No phone number recorded")}
                                className="w-full py-3 rounded-xl bg-primary/10 text-primary border border-primary/20 text-xs font-black uppercase tracking-widest hover:bg-primary/20 transition-all flex items-center justify-center gap-2"
                            >
                                <Phone size={14} /> Call Lead
                            </button>
                            <button
                                onClick={() => lead.email ? window.location.href = `mailto:${lead.email}` : alert("No email address recorded")}
                                className="w-full py-3 rounded-xl bg-secondary text-foreground border border-border text-xs font-black uppercase tracking-widest hover:bg-secondary/80 transition-all flex items-center justify-center gap-2"
                            >
                                <Mail size={14} /> Email Lead
                            </button>
                            <button className="w-full py-3 rounded-xl bg-rose-500/10 text-rose-500 border border-rose-500/20 text-xs font-black uppercase tracking-widest hover:bg-rose-500/20 transition-all flex items-center justify-center gap-2">
                                <AlertTriangle size={14} /> Mark Suspect
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
