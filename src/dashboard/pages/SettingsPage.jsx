import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Save, User, Mail, Phone, MapPin, Globe, ArrowLeft } from "lucide-react";

export default function SettingsPage() {
    const navigate = useNavigate();
    const [user, setUser] = useState(() => {
        try {
            return JSON.parse(localStorage.getItem("user") || "{}");
        } catch { return {}; }
    });

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
                        <h2 className="text-2xl sm:text-3xl font-black text-foreground uppercase tracking-tight">
                            Account <span className="text-primary">Settings</span>
                        </h2>
                        <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mt-1 opacity-60">
                            Manage your personal information
                        </p>
                    </div>
                </div>
                <button className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-primary text-primary-foreground text-[11px] font-black uppercase tracking-widest hover:bg-primary/90 transition-all shadow-lg hover:shadow-primary/20">
                    <Save size={16} /> Save Changes
                </button>
            </div>

            <div className="bg-card border border-border rounded-2xl p-6 shadow-sm space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                            <User size={12} /> Full Name
                        </label>
                        <input
                            defaultValue={user.name}
                            className="w-full bg-secondary/50 border border-border rounded-xl px-4 py-3 text-sm font-bold text-foreground focus:outline-none focus:border-primary/50 transition-colors"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                            <Mail size={12} /> Email Address
                        </label>
                        <input
                            defaultValue={user.email}
                            disabled
                            className="w-full bg-secondary/20 border border-border/50 rounded-xl px-4 py-3 text-sm font-bold text-muted-foreground cursor-not-allowed"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                            <Phone size={12} /> Phone Number
                        </label>
                        <input
                            placeholder="+1 (555) 000-0000"
                            className="w-full bg-secondary/50 border border-border rounded-xl px-4 py-3 text-sm font-bold text-foreground focus:outline-none focus:border-primary/50 transition-colors"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                            <Globe size={12} /> Timezone
                        </label>
                        <select className="w-full bg-secondary/50 border border-border rounded-xl px-4 py-3 text-sm font-bold text-foreground focus:outline-none focus:border-primary/50 transition-colors appearance-none">
                            <option>UTC (Coordinated Universal Time)</option>
                            <option>EST (Eastern Standard Time)</option>
                            <option>PST (Pacific Standard Time)</option>
                        </select>
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                        <MapPin size={12} /> Address
                    </label>
                    <textarea
                        rows={3}
                        placeholder="123 Business Avenue, Tech District, City, Country"
                        className="w-full bg-secondary/50 border border-border rounded-xl px-4 py-3 text-sm font-bold text-foreground focus:outline-none focus:border-primary/50 transition-colors resize-none"
                    />
                </div>
            </div>
        </div>
    );
}
