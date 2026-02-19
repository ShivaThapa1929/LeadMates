import React, { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  User, Mail, Shield, LogOut,
  Settings, Bell, CreditCard, ChevronRight,
  ShieldCheck, ArrowLeft, Camera, Loader2
} from "lucide-react";
import authService from "../../api/authService";

function getAvatar(seed) {
  const s = encodeURIComponent(seed || "User");
  return `https://api.dicebear.com/7.x/initials/svg?seed=${s}&backgroundType=gradient&fontWeight=700`;
}

export default function ProfilePage() {
  const navigate = useNavigate();
  const fileInputRef = React.useRef(null);
  const [isUploading, setIsUploading] = React.useState(false);
  const [user, setUser] = React.useState(() => {
    try {
      const raw = localStorage.getItem("user");
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  });

  React.useEffect(() => {
    const handleAuthUpdate = () => {
      const raw = localStorage.getItem("user");
      setUser(raw ? JSON.parse(raw) : null);
    };
    window.addEventListener('auth-update', handleAuthUpdate);
    return () => window.removeEventListener('auth-update', handleAuthUpdate);
  }, []);

  const handleLogout = async () => {
    await authService.logout();
    navigate("/");
  };

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const [previewUrl, setPreviewUrl] = React.useState(null);

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Create optimistic local preview
    const localUrl = URL.createObjectURL(file);
    setPreviewUrl(localUrl);

    const formData = new FormData();
    formData.append('avatar', file);

    try {
      setIsUploading(true);
      const response = await authService.updateAvatar(formData);
      if (response.success) {
        setUser(response.data.user);
        setPreviewUrl(null); // Clear preview once uploaded
      }
    } catch (err) {
      console.error("Upload failed", err);
      setPreviewUrl(null); // Clear preview on error
      alert("Failed to upload profile picture. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  const avatar = previewUrl
    ? previewUrl
    : user?.avatar
      ? user.avatar
      : getAvatar(user?.name || user?.email);

  const profileSections = [
    { label: "Account Settings", icon: Settings, desc: "Manage your personal information", path: "settings" },
    { label: "Notifications", icon: Bell, desc: "Configure how you receive alerts", path: "notifications" },
    { label: "Billing", icon: CreditCard, desc: "Manage your subscription and invoices", path: "billing" },
    { label: "Security", icon: ShieldCheck, desc: "Password and two-factor authentication", path: "security" },
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fade-in relative z-10 transition-colors duration-300">
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
            <User size={28} className="text-primary lg:w-9 lg:h-9" />
            <div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-foreground tracking-tight uppercase">
                Account <span className="text-primary">Profile</span>
              </h1>
              <p className="text-[9px] sm:text-[10px] font-black text-muted-foreground uppercase tracking-widest mt-1 opacity-60">Personal configuration terminal</p>
            </div>
          </div>
        </div>
      </div>

      {/* Profile Card */}
      <div className="rounded-3xl border border-border bg-card p-8 relative overflow-hidden group shadow-premium">
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 blur-[100px] pointer-events-none" />

        <div className="flex flex-col md:flex-row items-center gap-8 relative z-10">
          <div className="relative group/avatar cursor-pointer" onClick={handleAvatarClick}>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              className="hidden"
              accept="image/*"
            />
            <div className="absolute inset-0 bg-primary/20 blur-2xl rounded-full group-hover/avatar:bg-primary/40 transition-all" />

            <div className="relative">
              <img
                src={avatar}
                alt="Avatar"
                className={`w-32 h-32 rounded-full border-4 border-border relative z-10 shadow-2xl transition-all object-cover ${isUploading ? 'opacity-50 grayscale' : 'group-hover/avatar:brightness-75'}`}
              />
              {isUploading ? (
                <div className="absolute inset-0 flex items-center justify-center z-20">
                  <Loader2 className="animate-spin text-primary" size={32} />
                </div>
              ) : (
                <div className="absolute inset-0 flex items-center justify-center z-20 opacity-0 group-hover/avatar:opacity-100 transition-opacity">
                  <Camera className="text-white" size={32} />
                </div>
              )}
            </div>

            <div className="absolute bottom-1 right-1 w-8 h-8 rounded-full bg-primary border-4 border-background flex items-center justify-center text-primary-foreground z-20 shadow-lg">
              <Shield size={14} />
            </div>
          </div>

          <div className="flex-1 text-center md:text-left">
            <h2 className="text-2xl font-black text-foreground uppercase tracking-widest mb-2">
              {user?.name || "Premium User"}
            </h2>
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-4">
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-secondary border border-border text-[10px] font-black text-muted-foreground uppercase tracking-widest">
                <Mail size={12} className="text-primary" />
                {user?.email || "No email linked"}
              </div>
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-primary/10 border border-primary/20 text-[10px] font-black text-primary uppercase tracking-widest">
                {(user?.roles?.includes('Admin') || user?.roles?.includes('Super Admin')) ? "Unlimited Access" : (user?.plan || "Identity Basic")}
              </div>
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-blue-500/10 border border-blue-500/20 text-[10px] font-black text-blue-500 uppercase tracking-widest">
                {user?.role_type === 'admin' ? "Admin Access" : "User Access"}
              </div>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="w-full md:w-auto flex items-center justify-center gap-3 px-8 py-4 rounded-2xl bg-destructive/10 border border-destructive/20 text-destructive hover:bg-destructive hover:text-white transition-all shadow-lg shadow-destructive/10 group active:scale-95 cursor-pointer mt-4 md:mt-0"
          >
            <LogOut size={20} className="group-hover:translate-x-1 transition-transform" />
            <span className="text-[12px] font-black uppercase tracking-[0.3em]">Sign Out</span>
          </button>
        </div>
      </div>

      {/* Settings Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {profileSections.map((section, idx) => (
          <motion.div
            key={section.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="p-6 rounded-2xl border border-border bg-card hover:bg-muted/50 hover:border-primary/30 transition-all group cursor-pointer shadow-sm"
            onClick={() => navigate(section.path)}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-secondary flex items-center justify-center text-primary group-hover:bg-primary/20 transition-all">
                  <section.icon size={22} />
                </div>
                <div>
                  <h3 className="text-sm font-black text-foreground uppercase tracking-widest">{section.label}</h3>
                  <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-tighter mt-1">{section.desc}</p>
                </div>
              </div>
              <ChevronRight size={18} className="text-muted-foreground group-hover:text-foreground group-hover:translate-x-1 transition-all" />
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
