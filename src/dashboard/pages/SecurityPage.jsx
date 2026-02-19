import React, { useState } from "react";
import { ShieldCheck, Trash2, ArrowLeft, Lock, Key, Shield, Eye, EyeOff, Activity, Bell } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

export default function SecurityPage() {
    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false);

    const [passwords, setPasswords] = useState({
        current: "",
        new: "",
        confirm: ""
    });

    return (
        <div className="space-y-8 max-w-4xl mx-auto">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                <div className="flex items-center gap-4 sm:gap-5">
                    <button
                        onClick={() => navigate(-1)}
                        className="p-3 rounded-xl bg-secondary border border-border text-muted-foreground hover:text-foreground hover:bg-background transition-all font-mono cursor-pointer shadow-sm shrink-0"
                    >
                        <ArrowLeft size={18} />
                    </button>
                    <div className="flex items-center gap-3 sm:gap-4">
                        <Lock size={28} className="text-primary lg:w-9 lg:h-9" />
                        <div>
                            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-foreground tracking-tight uppercase">
                                Security <span className="text-primary">Node</span>
                            </h1>
                            <p className="text-[9px] sm:text-[10px] font-black text-muted-foreground uppercase tracking-widest mt-1 opacity-60">
                                Authentication protocols and access management
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column: Settings */}
                <div className="lg:col-span-2 space-y-8">
                    {/* Password Change */}
                    <div className="bg-card border border-border rounded-[32px] p-8 shadow-premium relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 blur-[100px] pointer-events-none" />

                        <div className="flex items-center gap-4 mb-8">
                            <div className="p-3 rounded-2xl bg-primary/10 text-primary border border-primary/20">
                                <Key size={20} />
                            </div>
                            <h3 className="text-[13px] font-black text-foreground uppercase tracking-[0.2em]">Update Authentication</h3>
                        </div>

                        <form className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest ml-1">Current Password</label>
                                <div className="relative">
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        className="w-full bg-input/50 focus:bg-input border border-border rounded-2xl py-4 px-6 text-[12px] font-bold text-foreground focus:outline-none focus:border-primary/50 transition-all uppercase tracking-widest placeholder:text-muted-foreground/30"
                                        placeholder="Enter current token"
                                        value={passwords.current}
                                        onChange={(e) => setPasswords({ ...passwords, current: e.target.value })}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-6 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                                    >
                                        {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                                    </button>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest ml-1">New Password</label>
                                    <input
                                        type="password"
                                        className="w-full bg-input/50 focus:bg-input border border-border rounded-2xl py-4 px-6 text-[12px] font-bold text-foreground focus:outline-none focus:border-primary/50 transition-all uppercase tracking-widest placeholder:text-muted-foreground/30"
                                        placeholder="Min 8 characters"
                                        value={passwords.new}
                                        onChange={(e) => setPasswords({ ...passwords, new: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest ml-1">Confirm New Password</label>
                                    <input
                                        type="password"
                                        className="w-full bg-input/50 focus:bg-input border border-border rounded-2xl py-4 px-6 text-[12px] font-bold text-foreground focus:outline-none focus:border-primary/50 transition-all uppercase tracking-widest placeholder:text-muted-foreground/30"
                                        placeholder="Repeat new token"
                                        value={passwords.confirm}
                                        onChange={(e) => setPasswords({ ...passwords, confirm: e.target.value })}
                                    />
                                </div>
                            </div>

                            <button className="w-full bg-primary text-white py-5 rounded-2xl text-[12px] font-black uppercase tracking-[0.3em] shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all mt-4">
                                Synchronize Security Token
                            </button>
                        </form>
                    </div>

                    {/* Login Sessions */}
                    <div className="bg-card border border-border rounded-[32px] p-8 shadow-premium">
                        <div className="flex items-center justify-between mb-8">
                            <div className="flex items-center gap-4">
                                <div className="p-3 rounded-2xl bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
                                    <Activity size={20} />
                                </div>
                                <h3 className="text-[13px] font-black text-foreground uppercase tracking-[0.2em]">Active Sessions</h3>
                            </div>
                            <span className="px-3 py-1 rounded-lg bg-emerald-500/10 text-emerald-500 text-[9px] font-black uppercase tracking-widest border border-emerald-500/20 ring-4 ring-emerald-500/5">
                                Live Tracking
                            </span>
                        </div>

                        <div className="space-y-4">
                            {[
                                { device: "Chrome / Windows 11", location: "New Delhi, IN", status: "Current Session", date: "Just now", color: "text-emerald-500" },
                                { device: "Safari / iPhone 15 Pro", location: "Mumbai, IN", status: "Recent Activity", date: "2 hours ago", color: "text-muted-foreground" }
                            ].map((session, i) => (
                                <div key={i} className="flex items-center justify-between p-5 rounded-2xl bg-secondary/30 border border-border/50 group hover:border-primary/20 transition-all">
                                    <div className="flex items-center gap-5">
                                        <div className="w-11 h-11 rounded-xl bg-background border border-border flex items-center justify-center text-primary shadow-sm group-hover:scale-105 transition-transform">
                                            <Shield size={20} />
                                        </div>
                                        <div>
                                            <h4 className="text-[12px] font-black text-foreground uppercase tracking-wider">{session.device}</h4>
                                            <p className="text-[10px] text-muted-foreground mt-1 font-bold uppercase tracking-tight">{session.location} • {session.date}</p>
                                        </div>
                                    </div>
                                    <span className={`text-[9px] font-black uppercase tracking-widest ${session.color}`}>{session.status}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Right Column: Status & Tips */}
                <div className="space-y-8">
                    <div className="bg-primary/5 border border-primary/20 rounded-[32px] p-8 shadow-premium relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/20 blur-[60px] pointer-events-none" />
                        <h3 className="text-[11px] font-black text-primary uppercase tracking-[0.3em] mb-6">Security Integrity</h3>
                        <div className="flex items-center gap-6 mb-8">
                            <div className="w-20 h-20 rounded-full border-4 border-primary/20 flex items-center justify-center relative">
                                <div className="absolute inset-0 border-4 border-primary rounded-full border-t-transparent animate-spin-slow" />
                                <span className="text-xl font-black text-primary">98%</span>
                            </div>
                            <div>
                                <div className="text-[14px] font-black text-foreground uppercase tracking-widest">Optimized</div>
                                <div className="text-[10px] font-black text-emerald-500 uppercase tracking-widest mt-1">High Clearance</div>
                            </div>
                        </div>
                        <p className="text-[11px] text-muted-foreground leading-relaxed font-bold uppercase tracking-tight">
                            Your account is protected with multi-layered encryption protocols.
                        </p>
                    </div>

                    <div className="bg-card border border-border rounded-[32px] p-8 shadow-premium">
                        <h3 className="text-[11px] font-black text-foreground uppercase tracking-[0.3em] mb-6 flex items-center gap-2">
                            System Advisory
                        </h3>
                        <div className="space-y-6">
                            <div className="flex gap-4">
                                <div className="w-8 h-8 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-500 border border-amber-500/20 shrink-0">
                                    <Bell size={14} />
                                </div>
                                <p className="text-[10px] font-bold text-muted-foreground uppercase leading-relaxed tracking-tight">
                                    Rotate your credentials every <span className="text-foreground">90 days</span> for maximum integrity.
                                </p>
                            </div>
                            <div className="flex gap-4">
                                <div className="w-8 h-8 rounded-xl bg-orange-500/10 flex items-center justify-center text-orange-500 border border-orange-500/20 shrink-0">
                                    <Lock size={14} />
                                </div>
                                <p className="text-[10px] font-bold text-muted-foreground uppercase leading-relaxed tracking-tight">
                                    Use complex alphanumeric tokens to prevent unauthorized node access.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
