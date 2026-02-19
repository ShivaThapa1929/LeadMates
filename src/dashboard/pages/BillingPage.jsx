import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { CreditCard, CheckCircle, Download, Clock, ArrowLeft, ShieldCheck, Zap, Receipt, ExternalLink } from "lucide-react";

export default function BillingPage() {
    const navigate = useNavigate();
    const [user, setUser] = useState(() => {
        try {
            const raw = localStorage.getItem("user");
            return raw ? JSON.parse(raw) : null;
        } catch {
            return null;
        }
    });

    const isAdmin = user?.role_type === 'admin' || user?.roles?.includes('Admin') || user?.roles?.includes('Super Admin');

    // Plan Mapping
    const getPlanDetails = (planName) => {
        const plans = {
            // Admin Plans
            "Starter Node": { price: 49, desc: "Perfect for small teams starting their lead generation journey." },
            "Infrastructure Pro": { price: 99, desc: "The complete command center for growing agencies." },
            "Agency Sovereign": { price: 199, desc: "Unlimited power for large scale lead operations." },
            // User Plans
            "Identity Basic": { price: 0, desc: "Essential tools for individual sales professionals." },
            "Pro Operative": { price: 29, desc: "Enhanced productivity for top-tier lead conversion." },
            "Lifetime Elite": { price: 59, desc: "The ultimate personal toolset for sales masters." }
        };
        return plans[planName] || { price: 0, desc: "Access essential lead management tools." };
    };

    const planDetails = getPlanDetails(user?.plan || "Identity Basic");

    const handleDownloadInvoice = (invoiceId, date, amount) => {
        const invoiceContent = `
LEADMATES OFFICIAL INVOICE
--------------------------
Invoice ID: ${invoiceId}
Billing Date: ${date}
Customer: ${user?.name || 'Valued Client'}
Email: ${user?.email || 'N/A'}
Plan: ${user?.plan || 'Identity Basic'}
Amount Paid: $${amount}
Status: PAID
--------------------------
Thank you for choosing LeadMates Infrastructure.
This is a computer-generated document.
        `;

        const blob = new Blob([invoiceContent], { type: "text/plain" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = `Invoice-${invoiceId}.txt`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            {/* Standardized Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                <div className="flex items-center gap-4 sm:gap-5">
                    <button
                        onClick={() => navigate(-1)}
                        className="p-3 rounded-xl bg-secondary border border-border text-muted-foreground hover:text-foreground hover:bg-background transition-all font-mono cursor-pointer shadow-sm shrink-0"
                    >
                        <ArrowLeft size={18} />
                    </button>
                    <div className="flex items-center gap-5">
                        <div className="hidden sm:flex p-3.5 rounded-2xl bg-primary/10 border border-primary/20 text-primary shadow-lg shadow-primary/10">
                            <Receipt size={24} />
                        </div>
                        <div>
                            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-foreground tracking-tight uppercase flex items-center gap-3">
                                <span className="text-foreground">Billing</span> <span className="text-primary">& Infrastructure</span>
                            </h1>
                            <p className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.3em] mt-2 ml-1">
                                Financial logs and subscription authorization hub
                            </p>
                        </div>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <button
                        onClick={() => navigate('/pricing')}
                        className="px-6 py-3 rounded-xl bg-primary text-white text-[11px] font-black uppercase tracking-widest shadow-xl shadow-primary/20 hover:scale-[1.05] active:scale-95 transition-all cursor-pointer flex items-center gap-2"
                    >
                        <Zap size={14} /> View Plans
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Current Authorization Tier */}
                <div className="lg:col-span-2 bg-card border border-border rounded-[40px] p-8 md:p-10 relative overflow-hidden shadow-premium group">
                    <div className="absolute top-0 right-0 w-80 h-80 bg-primary/5 blur-[100px] group-hover:bg-primary/10 transition-all duration-700" />

                    <div className="relative z-10">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                            <div>
                                <div className="flex items-center gap-3 mb-4">
                                    <span className="px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-[9px] font-black text-primary uppercase tracking-widest">Active License</span>
                                    {isAdmin && <span className="px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-[9px] font-black text-emerald-500 uppercase tracking-widest">Admin Control</span>}
                                </div>
                                <h3 className="text-4xl font-black text-foreground tracking-tighter uppercase mb-4">
                                    {user?.plan || (isAdmin ? "Starter Node" : "Identity Basic")}
                                </h3>
                                <p className="text-sm text-muted-foreground leading-relaxed max-w-md font-medium">
                                    {planDetails.desc}
                                </p>
                            </div>
                            <div className="w-20 h-20 bg-primary/10 border border-primary/20 rounded-[30px] flex items-center justify-center text-primary shadow-[0_0_30px_rgba(37,99,235,0.1)]">
                                <ShieldCheck size={40} />
                            </div>
                        </div>

                        <div className="mt-12 grid grid-cols-1 sm:grid-cols-3 gap-8 pt-8 border-t border-border/50">
                            <div>
                                <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-1 opacity-60">Deployment Date</p>
                                <p className="text-base font-black text-foreground uppercase tracking-tight">Active Forever</p>
                            </div>
                            <div>
                                <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-1 opacity-60">Authorization Cost</p>
                                <p className="text-2xl font-black text-foreground tracking-tighter">${planDetails.price}<span className="text-xs text-muted-foreground font-bold ml-1 uppercase">One-Time</span></p>
                            </div>
                            <div className="flex items-center">
                                <button
                                    onClick={() => navigate('/pricing')}
                                    className="w-full py-4 rounded-2xl bg-foreground text-background font-black text-[11px] uppercase tracking-widest hover:bg-primary hover:text-white transition-all shadow-xl active:scale-95 cursor-pointer"
                                >
                                    Upgrade Tier
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Secure Funding Method */}
                <div className="bg-card border border-border rounded-[40px] p-8 flex flex-col justify-between shadow-premium group">
                    <div className="relative">
                        <div className="flex items-center justify-between mb-8">
                            <p className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em]">Authorized Method</p>
                            <CreditCard size={18} className="text-muted-foreground opacity-30" />
                        </div>

                        <div className="space-y-6">
                            <div className="flex items-center gap-4 p-4 rounded-2xl bg-secondary/50 border border-border group-hover:border-primary/20 transition-all">
                                <div className="w-12 h-8 rounded-lg bg-zinc-800 flex items-center justify-center border border-white/5">
                                    <div className="flex items-center -space-x-1">
                                        <div className="w-4 h-4 rounded-full bg-rose-500/80" />
                                        <div className="w-4 h-4 rounded-full bg-amber-500/80" />
                                    </div>
                                </div>
                                <div>
                                    <p className="text-xs font-black text-foreground uppercase tracking-wide">Card • 4242</p>
                                    <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-tighter mt-0.5">Exp 12/28</p>
                                </div>
                            </div>
                            <p className="text-[10px] font-bold text-muted-foreground/60 leading-relaxed uppercase tracking-tight text-center px-4">
                                Data encrypted via AES-256 Protocol for maximum infrastructure security
                            </p>
                        </div>
                    </div>

                    <button className="w-full py-4 rounded-2xl border border-dashed border-border text-[10px] font-black uppercase tracking-widest text-muted-foreground hover:bg-secondary hover:text-foreground hover:border-solid transition-all mt-8 active:scale-95">
                        Replace Node
                    </button>
                </div>
            </div>

            {/* Archive History */}
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <h3 className="text-[10px] font-black text-foreground uppercase tracking-[0.4em] ml-1">Infrastructure Logs (Invoices)</h3>
                    <div className="flex items-center gap-2 text-[9px] font-black text-muted-foreground uppercase tracking-widest opacity-40">
                        <Receipt size={12} /> Sync: Real-Time
                    </div>
                </div>

                <div className="bg-card border border-border rounded-[32px] overflow-hidden shadow-premium">
                    {[
                        { id: "INV-2026-X81", date: "Feb 10, 2026", amount: planDetails.price },
                        { id: "INV-2025-Y42", date: "Jan 05, 2026", amount: "0.00" }
                    ].map((invoice, i) => (
                        <div key={i} className="p-6 border-b border-border last:border-0 flex items-center justify-between hover:bg-secondary/30 transition-all group cursor-default">
                            <div className="flex items-center gap-5">
                                <div className="p-3 rounded-xl bg-secondary border border-border text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary transition-all">
                                    <Clock size={16} />
                                </div>
                                <div className="hidden sm:block">
                                    <p className="text-[12px] font-black text-foreground uppercase tracking-wide group-hover:text-primary transition-all">Invoice {invoice.id}</p>
                                    <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest mt-0.5">{invoice.date}</p>
                                </div>
                                <div className="sm:hidden">
                                    <p className="text-[11px] font-black text-foreground uppercase">{invoice.id}</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-4 sm:gap-10">
                                <div className="text-right">
                                    <p className="text-sm font-black text-foreground">${invoice.amount}</p>
                                    <p className="text-[8px] font-black text-emerald-500 uppercase tracking-widest">Authorized</p>
                                </div>
                                <button
                                    onClick={() => handleDownloadInvoice(invoice.id, invoice.date, invoice.amount)}
                                    className="p-3 bg-secondary border border-border rounded-xl text-muted-foreground hover:text-primary hover:bg-background hover:scale-110 active:scale-90 transition-all shadow-sm"
                                    title="Download Deployment Log"
                                >
                                    <Download size={16} />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Security Banner */}
            <div className="p-8 rounded-[32px] bg-gradient-to-r from-emerald-500/5 to-transparent border border-emerald-500/10 flex flex-col md:flex-row items-center justify-between gap-6 overflow-hidden relative">
                <div className="absolute left-0 bottom-0 w-40 h-40 bg-emerald-500/10 blur-[80px] pointer-events-none" />
                <div className="flex items-center gap-6 relative z-10">
                    <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 flex items-center justify-center text-emerald-500 shadow-lg shadow-emerald-500/10">
                        <ShieldCheck size={28} />
                    </div>
                    <div>
                        <h4 className="text-sm font-black text-foreground uppercase tracking-widest mb-1 italic">Enterprise Grade Security</h4>
                        <p className="text-[10px] text-muted-foreground font-medium max-w-sm uppercase tracking-tight">Your data is secured using military-grade encryption protocols and distributed verification clusters.</p>
                    </div>
                </div>
                <button className="px-6 py-3 rounded-xl bg-card border border-border text-[10px] font-black uppercase tracking-widest hover:bg-secondary transition-all flex items-center gap-2 relative z-10">
                    Security Documentation <ExternalLink size={14} />
                </button>
            </div>
        </div>
    );
}
