import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Save, User, Mail, Phone, MapPin, Globe, ArrowLeft, Loader2, CheckCircle } from "lucide-react";
import userService from "../../api/userService";

export default function SettingsPage() {
    const navigate = useNavigate();
    const currentUser = (() => {
        try { return JSON.parse(localStorage.getItem("user") || "{}"); } catch { return {}; }
    })();

    const [formData, setFormData] = useState({
        name: currentUser.name || "",
        phone: currentUser.phone || "",
        timezone: currentUser.timezone || "UTC",
        address: currentUser.address || "",
    });
    const [saving, setSaving] = useState(false);
    const [saved, setSaved] = useState(false);
    const [error, setError] = useState("");

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        if (saved) setSaved(false);
        if (error) setError("");
    };

    const handleSave = async (e) => {
        e.preventDefault();
        if (!formData.name.trim()) { setError("Name is required."); return; }
        setSaving(true);
        setError("");
        try {
            const result = await userService.updateUser(currentUser.id, {
                name: formData.name,
                phone: formData.phone,
            });
            if (result.success) {
                // Update localStorage so Navbar/Profile reflects the new name
                const updated = { ...currentUser, name: result.data?.name || formData.name };
                localStorage.setItem("user", JSON.stringify(updated));
                window.dispatchEvent(new Event("auth-update"));
                setSaved(true);
                setTimeout(() => setSaved(false), 3000);
            }
        } catch (err) {
            setError(err.message || "Failed to save settings.");
        } finally {
            setSaving(false);
        }
    };

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
                <button
                    onClick={handleSave}
                    disabled={saving}
                    className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-primary text-primary-foreground text-[11px] font-black uppercase tracking-widest hover:bg-primary/90 transition-all shadow-lg hover:shadow-primary/20 disabled:opacity-60"
                >
                    {saving ? (
                        <><Loader2 size={16} className="animate-spin" /> Saving...</>
                    ) : saved ? (
                        <><CheckCircle size={16} className="text-emerald-300" /> Saved!</>
                    ) : (
                        <><Save size={16} /> Save Changes</>
                    )}
                </button>
            </div>

            {error && (
                <div className="px-4 py-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs font-bold uppercase tracking-wider">
                    {error}
                </div>
            )}

            <form onSubmit={handleSave} className="bg-card border border-border rounded-2xl p-6 shadow-sm space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                            <User size={12} /> Full Name
                        </label>
                        <input
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                            className="w-full bg-secondary/50 border border-border rounded-xl px-4 py-3 text-sm font-bold text-foreground focus:outline-none focus:border-primary/50 transition-colors"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                            <Mail size={12} /> Email Address
                        </label>
                        <input
                            value={currentUser.email || ""}
                            disabled
                            className="w-full bg-secondary/20 border border-border/50 rounded-xl px-4 py-3 text-sm font-bold text-muted-foreground cursor-not-allowed"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                            <Phone size={12} /> Phone Number
                        </label>
                        <input
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                            placeholder="+1 (555) 000-0000"
                            className="w-full bg-secondary/50 border border-border rounded-xl px-4 py-3 text-sm font-bold text-foreground focus:outline-none focus:border-primary/50 transition-colors"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                            <Globe size={12} /> Timezone
                        </label>
                        <select
                            name="timezone"
                            value={formData.timezone}
                            onChange={handleChange}
                            className="w-full bg-secondary/50 border border-border rounded-xl px-4 py-3 text-sm font-bold text-foreground focus:outline-none focus:border-primary/50 transition-colors appearance-none"
                        >
                            <option value="UTC">UTC (Coordinated Universal Time)</option>
                            <option value="EST">EST (Eastern Standard Time)</option>
                            <option value="PST">PST (Pacific Standard Time)</option>
                            <option value="IST">IST (India Standard Time)</option>
                            <option value="GMT">GMT (Greenwich Mean Time)</option>
                            <option value="CET">CET (Central European Time)</option>
                        </select>
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                        <MapPin size={12} /> Address
                    </label>
                    <textarea
                        name="address"
                        value={formData.address}
                        onChange={handleChange}
                        rows={3}
                        placeholder="123 Business Avenue, Tech District, City, Country"
                        className="w-full bg-secondary/50 border border-border rounded-xl px-4 py-3 text-sm font-bold text-foreground focus:outline-none focus:border-primary/50 transition-colors resize-none"
                    />
                </div>
            </form>
        </div>
    );
}
