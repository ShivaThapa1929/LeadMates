import React, { useMemo, useState, useEffect, useRef } from "react";
import { NavLink, Outlet, useNavigate, useLocation } from "react-router-dom";
import {
  LayoutDashboard, LineChart, Users, FolderKanban,
  Megaphone, Settings, User, Search, Bell, Sun, Moon,
  Maximize, ChevronDown, Menu as MenuIcon, X, LogOut, Sparkles, ShieldCheck, Trash2, UserPlus, CreditCard
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import logo from "../assets/logo-primary.png";
import authService from "../api/authService";
import { useTheme } from "../context/ThemeContext";
import { useSearch } from "../context/SearchContext";
import { useNotifications } from "../context/NotificationContext";

export default function Layout() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { isDarkMode, toggleTheme } = useTheme();
  const { searchQuery, setSearchQuery } = useSearch();
  const { notifications, unreadCount, addNotification, markAllAsRead, clearNotifications } = useNotifications();
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const notifRef = useRef(null);
  const [showWelcome, setShowWelcome] = useState(false);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (notifRef.current && !notifRef.current.contains(event.target)) {
        setIsNotifOpen(false);
      }
    };

    if (isNotifOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isNotifOpen]);

  useEffect(() => {
    const welcomeFlag = sessionStorage.getItem('showWelcome');
    if (welcomeFlag === 'true') {
      setShowWelcome(true);
      sessionStorage.removeItem('showWelcome');

      // Add to global notifications
      addNotification({
        title: "System Initialized",
        message: "Neural cluster active. Welcome to LeadMates central.",
        type: "info",
        icon: Sparkles
      });

      const timer = setTimeout(() => setShowWelcome(false), 5000);
      return () => clearTimeout(timer);
    }
  }, [addNotification]);

  const [user, setUser] = useState(() => {
    try {
      const raw = localStorage.getItem("user");
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  });

  useEffect(() => {
    const handleAuthUpdate = () => {
      const raw = localStorage.getItem("user");
      setUser(raw ? JSON.parse(raw) : null);
    };
    window.addEventListener('auth-update', handleAuthUpdate);
    return () => window.removeEventListener('auth-update', handleAuthUpdate);
  }, []);

  const hasPermission = (permission) => {
    return user?.permissions?.includes(permission) || user?.roles?.includes('Admin') || user?.roles?.includes('Super Admin');
  };

  const isAdminPath = location.pathname.startsWith('/admin/dashboard');
  const basePrefix = isAdminPath ? '/admin/dashboard' : '/dashboard';

  const { isProfileContext, profileItems } = useMemo(() => {
    const isProfile = location.pathname.includes('/profile');
    const items = [
      { to: `${basePrefix}/profile`, label: "Personal Info", icon: User },
      { to: `${basePrefix}/profile/notifications`, label: "System Alerts", icon: Bell },
      { to: `${basePrefix}/profile/security`, label: "Node Security", icon: ShieldCheck },
    ];
    return { isProfileContext: isProfile, profileItems: items };
  }, [location.pathname, basePrefix]);

  const navItems = useMemo(() => {
    const plan = user?.plan || 'Identity Basic';
    const isAdmin = user?.roles?.includes('Admin') || user?.roles?.includes('Super Admin');

    // Define features that are locked for specific plans
    const lockedFeatures = {
      'Starter Node': ['Users', 'Analytics'],
      'Identity Basic': ['Campaigns', 'Analytics'],
    };

    const allItems = [
      { to: basePrefix, label: "Overview", icon: LayoutDashboard, permission: null },
      { to: `${basePrefix}/leads`, label: "Leads", icon: Users, permission: "leads.view" },
      { to: `${basePrefix}/projects`, label: "Projects", icon: FolderKanban, permission: "projects.view" },
      { to: `${basePrefix}/campaigns`, label: "Campaigns", icon: Megaphone, permission: "campaigns.view" },
      { to: `${basePrefix}/analytics`, label: "Analytics", icon: LineChart, permission: "reports.view" },
      { to: `${basePrefix}/users`, label: "Users", icon: Users, permission: "users.view" },
      { to: `${basePrefix}/roles`, label: "Roles", icon: ShieldCheck, permission: "roles.view" },
      { to: `${basePrefix}/trash`, label: "Trash", icon: Trash2, permission: null }, // Visible to everyone
    ];

    return allItems
      .filter(item => {
        // Explicitly restrict Users and Roles to Admins only
        if (['Users', 'Roles'].includes(item.label)) {
          return isAdmin;
        }
        // Others use permission check
        return !item.permission || hasPermission(item.permission);
      })
      .map(item => ({
        ...item,
        // Admin/Super Admin bypasses all plan locks
        isLocked: !isAdmin && lockedFeatures[plan]?.includes(item.label)
      }));
  }, [user, basePrefix]);

  const footerItems = useMemo(() => {
    return [
      { to: `${basePrefix}/profile`, label: "Profile", icon: User, permission: null },
    ];
  }, [basePrefix]);

  return (
    <div className="min-h-screen bg-background text-foreground font-sans flex overflow-hidden transition-colors duration-300">
      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] lg:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed inset-y-0 left-0 z-[101] lg:relative lg:z-20
        bg-sidebar border-r border-sidebar-border flex flex-col h-screen shrink-0 transition-all duration-300 ease-in-out
        ${isCollapsed ? "w-[80px]" : "w-[260px]"}
        ${isMobileMenuOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
      `}>
        <div className="p-6 flex items-center justify-between overflow-hidden">
          <div className="flex items-center gap-3 cursor-pointer min-w-max" onClick={() => navigate("/")}>
            <img src={logo} alt="Logo" className="w-8 h-8 object-contain shrink-0" />
            {!isCollapsed && <span className="text-xl font-black tracking-tight animate-fade-in">LeadMates</span>}
          </div>
          <button
            onClick={() => setIsMobileMenuOpen(false)}
            className="lg:hidden p-2 text-muted-foreground hover:text-foreground"
          >
            <X size={20} />
          </button>
        </div>

        <nav className="flex-1 px-3 py-4 space-y-8 overflow-y-auto no-scrollbar overflow-x-hidden">
          {isProfileContext ? (
            /* Profile Context Sidebar */
            <div className="space-y-6">
              {!isCollapsed && (
                <p className="px-4 text-[10px] font-black uppercase tracking-[0.3em] text-primary/60 font-mono transition-all">
                  Profile Settings
                </p>
              )}
              <div className="space-y-1.5">
                <NavLink
                  to={basePrefix}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center gap-4 px-4 py-3 rounded-xl text-[11px] font-black transition-all group relative text-primary hover:bg-primary/10 mb-4"
                >
                  <LayoutDashboard size={18} className="shrink-0" />
                  {!isCollapsed && <span className="uppercase tracking-[0.1em] whitespace-nowrap animate-fade-in">Back to Cluster</span>}
                </NavLink>

                {profileItems.map((item) => {
                  const IconComp = item.icon;
                  return (
                    <NavLink
                      key={item.to}
                      to={item.to}
                      end
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={({ isActive }) =>
                        `flex items-center gap-4 px-4 py-3.5 rounded-2xl text-[12px] font-black transition-all group relative ${isActive
                          ? "bg-primary text-primary-foreground shadow-premium"
                          : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                        }`
                      }
                    >
                      <IconComp size={18} className="shrink-0" />
                      {!isCollapsed && <span className="uppercase tracking-[0.1em] whitespace-nowrap animate-fade-in">{item.label}</span>}
                      {isCollapsed && (
                        <div className="absolute left-[calc(100%+20px)] top-1/2 -translate-y-1/2 px-3 py-1.5 bg-primary text-primary-foreground rounded-lg text-[10px] font-black pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-[1000]">
                          {item.label}
                        </div>
                      )}
                    </NavLink>
                  );
                })}
              </div>
            </div>
          ) : (
            /* Main Dashboard Sidebar */
            <>
              {/* Main Controls Section */}
              <div className="space-y-6">
                {!isCollapsed && (
                  <p className="px-4 text-[10px] font-black uppercase tracking-[0.3em] text-primary/60 font-mono transition-all">
                    Main Controls
                  </p>
                )}
                <div className={`space-y-1.5 ${isCollapsed ? 'pt-4' : ''}`}>
                  {navItems.filter(item => !['users', 'roles', 'trash'].some(k => item.to.includes(k))).map((item) => {
                    const IconComp = item.icon;
                    if (item.isLocked) {
                      return (
                        <div
                          key={item.to}
                          onClick={() => navigate('/pricing')}
                          className="flex items-center justify-between gap-4 px-4 py-3 rounded-xl text-[11px] font-black transition-all group relative text-muted-foreground/40 cursor-pointer hover:bg-white/[0.02]"
                        >
                          <div className="flex items-center gap-4">
                            <IconComp size={18} className="shrink-0 grayscale opacity-40" />
                            {!isCollapsed && <span className="uppercase tracking-[0.1em] whitespace-nowrap animate-fade-in">{item.label}</span>}
                          </div>
                          <Sparkles className="w-4 h-4 text-primary animate-pulse" />
                        </div>
                      );
                    }
                    return (
                      <NavLink
                        key={item.to}
                        to={item.to}
                        end={item.to === basePrefix}
                        onClick={() => setIsMobileMenuOpen(false)}
                        className={({ isActive }) =>
                          `flex items-center gap-4 px-4 py-3 rounded-xl text-[11px] font-black transition-all group relative ${isActive
                            ? "bg-primary text-primary-foreground shadow-premium"
                            : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                          }`
                        }
                      >
                        <IconComp size={18} className="shrink-0" />
                        {!isCollapsed && <span className="uppercase tracking-[0.1em] whitespace-nowrap animate-fade-in">{item.label}</span>}
                        {isCollapsed && (
                          <div className="absolute left-[calc(100%+20px)] top-1/2 -translate-y-1/2 px-3 py-1.5 bg-primary text-primary-foreground rounded-lg text-[10px] font-black pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-[1000]">
                            {item.label}
                          </div>
                        )}
                      </NavLink>
                    );
                  })}
                </div>
              </div>

              {/* System Management Section (Admins/Sub-admins only) */}
              {navItems.some(item => ['users', 'roles', 'trash'].some(k => item.to.includes(k))) && (
                <div className="space-y-6">
                  {!isCollapsed && (
                    <p className="px-4 text-[10px] font-black uppercase tracking-[0.3em] text-rose-500/60 font-mono transition-all">
                      System Management
                    </p>
                  )}
                  <div className={`space-y-1.5 ${isCollapsed ? 'pt-4' : ''}`}>
                    {navItems.filter(item => ['users', 'roles', 'trash'].some(k => item.to.includes(k))).map((item) => {
                      const IconComp = item.icon;
                      return (
                        <NavLink
                          key={item.to}
                          to={item.to}
                          onClick={() => setIsMobileMenuOpen(false)}
                          className={({ isActive }) =>
                            `flex items-center gap-4 px-4 py-3 rounded-xl text-[11px] font-black transition-all group relative ${isActive
                              ? "bg-primary text-primary-foreground shadow-premium"
                              : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                            }`
                          }
                        >
                          <IconComp size={18} className="shrink-0" />
                          {!isCollapsed && <span className="uppercase tracking-[0.1em] whitespace-nowrap animate-fade-in">{item.label}</span>}
                          {isCollapsed && (
                            <div className="absolute left-[calc(100%+20px)] top-1/2 -translate-y-1/2 px-3 py-1.5 bg-primary text-primary-foreground rounded-lg text-[10px] font-black pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-[1000]">
                              {item.label}
                            </div>
                          )}
                        </NavLink>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* User Profile Section Links (Main Context) */}
              <div className="space-y-1.5 pt-4 border-t border-border/10">
                {footerItems.map((item) => {
                  const IconComp = item.icon;
                  return (
                    <NavLink
                      key={item.to}
                      to={item.to}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={({ isActive }) =>
                        `flex items-center gap-4 px-4 py-3.5 rounded-2xl text-[12px] font-black transition-all group relative ${isActive
                          ? "bg-primary text-primary-foreground shadow-premium"
                          : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                        }`
                      }
                    >
                      <IconComp size={18} className="shrink-0" />
                      {!isCollapsed && <span className="uppercase tracking-[0.1em] whitespace-nowrap animate-fade-in">{item.label}</span>}
                      {isCollapsed && (
                        <div className="absolute left-[calc(100%+20px)] top-1/2 -translate-y-1/2 px-3 py-1.5 bg-primary text-primary-foreground rounded-lg text-[10px] font-black pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-[1000]">
                          {item.label}
                        </div>
                      )}
                    </NavLink>
                  );
                })}
              </div>
            </>
          )}
        </nav>

        <div className="p-4 border-t border-sidebar-border">
          <button
            onClick={async () => {
              await authService.logout();
              navigate("/");
            }}
            className={`w-full flex items-center gap-4 px-4 py-3 rounded-xl text-[11px] font-black transition-all group relative text-destructive hover:text-foreground hover:bg-destructive/10 ${isCollapsed ? "justify-center" : ""}`}
          >
            <LogOut size={18} className="shrink-0" />
            {!isCollapsed && <span className="uppercase tracking-[0.1em] whitespace-nowrap animate-fade-in">Sign Out</span>}
            {isCollapsed && (
              <div className="absolute left-[calc(100%+20px)] top-1/2 -translate-y-1/2 px-3 py-1.5 bg-destructive text-destructive-foreground rounded-lg text-[10px] font-black pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-[1000]">
                Sign Out
              </div>
            )}
          </button>
        </div>
      </aside>

      <div className="flex-1 flex flex-col h-screen relative overflow-hidden">
        <header className="h-[64px] sm:h-[75px] lg:h-[90px] border-b border-border flex items-center justify-between px-4 sm:px-6 lg:px-10 bg-background/90 backdrop-blur-3xl relative z-10 shrink-0">
          <div className="flex items-center gap-3 sm:gap-4 lg:gap-8 flex-1 min-w-0">
            <button onClick={() => setIsMobileMenuOpen(true)} className="lg:hidden p-2 -ml-1 text-muted-foreground hover:text-foreground hover:bg-secondary rounded-xl transition-colors shrink-0">
              <MenuIcon size={20} />
            </button>
            <button onClick={() => setIsCollapsed(!isCollapsed)} className="hidden lg:block text-muted-foreground hover:text-foreground shrink-0 transition-transform active:scale-90">
              <span className={`text-xl inline-block ${isCollapsed ? "rotate-180" : ""}`}>«</span>
            </button>
            <div className="relative group max-w-[200px] sm:max-w-[400px] flex-1 min-w-0">
              <Search className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary w-3 h-3 sm:w-3.5 sm:h-3.5 opacity-50" size={14} />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search..."
                className="bg-input/10 border border-input/20 rounded-xl sm:rounded-2xl py-2 sm:py-2.5 lg:py-3 pl-9 sm:pl-12 lg:pl-14 pr-3 text-[10px] sm:text-[11px] lg:text-[12px] font-bold w-full text-foreground focus:outline-none focus:border-primary/50 focus:bg-input/20 transition-all placeholder:text-muted-foreground/40 hover:bg-input/20"
              />
            </div>
          </div>

          <div className="flex items-center gap-1.5 sm:gap-3 lg:gap-8 shrink-0">
            <div className="flex items-center gap-1 sm:gap-3">
              <button
                onClick={toggleTheme}
                className="p-2 sm:p-2.5 lg:p-3.5 rounded-xl sm:rounded-2xl bg-secondary border border-border text-muted-foreground hover:text-foreground shadow-lg transition-transform active:scale-95"
              >
                {isDarkMode ? <Sun size={14} className="sm:w-[18px] sm:h-[18px] text-primary" /> : <Moon size={14} className="sm:w-[18px] sm:h-[18px] text-primary" />}
              </button>

              <div className="relative" ref={notifRef}>
                <button
                  onClick={() => {
                    const willOpen = !isNotifOpen;
                    setIsNotifOpen(willOpen);
                    if (willOpen) markAllAsRead();
                  }}
                  className="p-2.5 lg:p-3.5 rounded-xl sm:rounded-2xl bg-secondary border border-border text-muted-foreground hover:text-foreground shadow-lg relative group transition-all"
                >
                  <Bell size={18} className={unreadCount > 0 ? "animate-bounce text-primary" : ""} />
                  {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 w-5 h-5 bg-primary text-primary-foreground text-[10px] font-black rounded-full flex items-center justify-center shadow-lg shadow-primary/20 border-2 border-background">
                      {unreadCount}
                    </span>
                  )}
                </button>

                <AnimatePresence>
                  {isNotifOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      className="absolute right-0 mt-4 w-[320px] sm:w-[380px] bg-card border border-border rounded-[24px] shadow-2xl z-[101] overflow-hidden"
                    >
                      <div className="p-5 border-b border-border flex items-center justify-between bg-muted/20">
                        <h3 className="text-[11px] font-black uppercase tracking-widest text-foreground">Intelligence Feed</h3>
                        <div className="flex gap-3">
                          <button onClick={clearNotifications} className="text-[9px] font-black text-rose-500 uppercase tracking-widest hover:underline">Clear</button>
                        </div>
                      </div>

                      <div className="max-h-[400px] overflow-y-auto no-scrollbar">
                        {notifications.length === 0 ? (
                          <div className="p-10 text-center space-y-3">
                            <Bell size={32} className="mx-auto text-muted-foreground opacity-20" />
                            <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest leading-relaxed">No active signals detected in the stream.</p>
                          </div>
                        ) : (
                          <div className="divide-y divide-border/50">
                            {notifications.map((n) => {
                              const Icon = n.icon || Bell;
                              return (
                                <div key={n.id} className={`p-4 flex gap-4 hover:bg-secondary/30 transition-colors ${n.unread ? 'bg-primary/[0.02]' : ''}`}>
                                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border ${n.type === 'error' ? 'bg-rose-500/10 text-rose-500 border-rose-500/20' : 'bg-primary/10 text-primary border-primary/20'}`}>
                                    <Icon size={18} />
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <div className="flex items-center justify-between gap-2">
                                      <p className="text-[11px] font-black text-foreground uppercase tracking-tight truncate">{n.title}</p>
                                      <span className="text-[8px] font-black text-muted-foreground uppercase whitespace-nowrap opacity-50">
                                        {new Date(n.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                      </span>
                                    </div>
                                    <p className="text-[10px] text-muted-foreground font-bold mt-1 line-clamp-2 uppercase leading-snug tracking-tight">
                                      {n.message}
                                    </p>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        )}
                      </div>

                      {notifications.length > 0 && (
                        <div className="p-4 bg-muted/20 border-t border-border text-center">
                          <p className="text-[8px] font-black text-muted-foreground uppercase tracking-[0.2em] opacity-40">End of secure transmission</p>
                        </div>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            <div className="flex items-center gap-2 sm:gap-3 lg:gap-5 pl-2 sm:pl-4 lg:pl-8 border-l border-border ml-1 sm:ml-0">
              <div className="text-right hidden md:block">
                <div className="text-[12px] lg:text-[14px] font-black uppercase tracking-widest leading-none">{user?.name?.split(' ')[0] || "User"}</div>
                <div className="text-[8px] lg:text-[10px] font-black text-primary uppercase tracking-[0.25em] mt-1">Active</div>
              </div>
              <div className="relative group cursor-pointer shrink-0" onClick={() => navigate(`${basePrefix}/profile`)}>
                {user?.avatar ? (
                  <img src={user.avatar} alt="Avatar" className="w-8 h-8 sm:w-10 sm:h-10 lg:w-11 lg:h-11 rounded-xl sm:rounded-2xl object-cover border border-border" />
                ) : (
                  <div className="w-8 h-8 sm:w-10 sm:h-10 lg:w-11 lg:h-11 rounded-xl sm:rounded-2xl bg-primary flex items-center justify-center font-black text-primary-foreground text-xs sm:text-sm">
                    {user?.name?.[0]?.toUpperCase() || "U"}
                  </div>
                )}
              </div>
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto custom-scrollbar bg-background">
          <div className="p-4 sm:p-8 lg:p-12 max-w-[1600px] mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
      <AnimatePresence>
        {showWelcome && (
          <motion.div initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="fixed bottom-8 right-8 z-[200] max-w-[360px] w-full">
            <div className="bg-card border border-border rounded-[2rem] p-6 shadow-xl overflow-hidden relative">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-600 to-blue-400" />
              <div className="flex gap-4 items-start">
                <div className="w-12 h-12 rounded-2xl bg-blue-500/10 flex items-center justify-center border border-blue-500/20">
                  <Sparkles className="w-6 h-6 text-blue-500" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="text-sm font-black text-foreground uppercase tracking-widest">Access Granted</h3>
                    <button onClick={() => setShowWelcome(false)} className="text-muted-foreground hover:text-foreground"><X size={16} /></button>
                  </div>
                  <p className="text-xs text-muted-foreground font-bold">Welcome to LeadMates. Dashboard active.</p>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div >
  );
}
