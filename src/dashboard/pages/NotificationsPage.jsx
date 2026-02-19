import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Bell, Mail, MessageSquare, Zap, ArrowLeft } from "lucide-react";

export default function NotificationsPage() {
    const navigate = useNavigate();
    const [toggles, setToggles] = useState({
        emailAlerts: true,
        pushNotifs: true,
        marketing: false,
        security: true
    });

    const toggle = (key) => setToggles(prev => ({ ...prev, [key]: !prev[key] }));

    return (
        <div className="space-y-6 max-w-2xl mx-auto">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                <div className="flex items-center gap-4 sm:gap-5">
                    <button
                        onClick={() => navigate(-1)}
                        className="p-3 rounded-xl bg-secondary border border-border text-muted-foreground hover:text-foreground hover:bg-background transition-all font-mono cursor-pointer shadow-sm shrink-0"
                    >
                        <ArrowLeft size={18} />
                    </button>
                    <div>
                        <h2 className="text-2xl sm:text-3xl font-black text-foreground uppercase tracking-tight">Notification <span className="text-primary">Rules</span></h2>
                        <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mt-1 opacity-60">
                            Configure alert protocols and signal routing
                        </p>
                    </div>
                </div>
            </div>

            <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-sm">

                <div className="p-6 border-b border-border flex flex-col sm:flex-row sm:items-center justify-between gap-4 group hover:bg-secondary/20 transition-colors">
                    <div className="flex items-start gap-4">
                        <div className="p-3 rounded-xl bg-blue-500/10 text-blue-500">
                            <Mail size={20} />
                        </div>
                        <div>
                            <h3 className="text-sm font-black text-foreground uppercase tracking-wide">Email Alerts</h3>
                            <p className="text-xs text-muted-foreground mt-1 max-w-full sm:max-w-[300px]">Receive daily summaries and critical alerts directly to your inbox.</p>
                        </div>
                    </div>
                    <button
                        onClick={() => toggle('emailAlerts')}
                        className={`w-12 h-6 rounded-full transition-colors relative self-end sm:self-auto ${toggles.emailAlerts ? 'bg-primary' : 'bg-secondary border border-border'}`}
                    >
                        <div className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow-sm transition-all ${toggles.emailAlerts ? 'left-7' : 'left-1'}`} />
                    </button>
                </div>

                <div className="p-6 border-b border-border flex flex-col sm:flex-row sm:items-center justify-between gap-4 group hover:bg-secondary/20 transition-colors">
                    <div className="flex items-start gap-4">
                        <div className="p-3 rounded-xl bg-violet-500/10 text-violet-500">
                            <Bell size={20} />
                        </div>
                        <div>
                            <h3 className="text-sm font-black text-foreground uppercase tracking-wide">Push Notifications</h3>
                            <p className="text-xs text-muted-foreground mt-1 max-w-full sm:max-w-[300px]">Get real-time updates on your browser when leads are assigned.</p>
                        </div>
                    </div>
                    <button
                        onClick={() => toggle('pushNotifs')}
                        className={`w-12 h-6 rounded-full transition-colors relative self-end sm:self-auto ${toggles.pushNotifs ? 'bg-primary' : 'bg-secondary border border-border'}`}
                    >
                        <div className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow-sm transition-all ${toggles.pushNotifs ? 'left-7' : 'left-1'}`} />
                    </button>
                </div>

                <div className="p-6 border-b border-border flex flex-col sm:flex-row sm:items-center justify-between gap-4 group hover:bg-secondary/20 transition-colors">
                    <div className="flex items-start gap-4">
                        <div className="p-3 rounded-xl bg-rose-500/10 text-rose-500">
                            <Zap size={20} />
                        </div>
                        <div>
                            <h3 className="text-sm font-black text-foreground uppercase tracking-wide">Marketing & Offers</h3>
                            <p className="text-xs text-muted-foreground mt-1 max-w-full sm:max-w-[300px]">Receive special offers, product updates, and newsletters.</p>
                        </div>
                    </div>
                    <button
                        onClick={() => toggle('marketing')}
                        className={`w-12 h-6 rounded-full transition-colors relative self-end sm:self-auto ${toggles.marketing ? 'bg-primary' : 'bg-secondary border border-border'}`}
                    >
                        <div className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow-sm transition-all ${toggles.marketing ? 'left-7' : 'left-1'}`} />
                    </button>
                </div>

            </div>
        </div>
    );
}
