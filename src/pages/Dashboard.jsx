import React, { useEffect, useState, useMemo, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { motion as Motion, AnimatePresence } from "framer-motion";
import {
  Users, Phone, MessageCircle, AlertTriangle,
  CheckCircle, Clock, TrendingUp, ChevronDown,
  LayoutGrid, Check, Activity, Shield, Mail,
  MessageSquare, MoreHorizontal, Plus,
  UserCheck, Trash2, Edit3, Layers, LayoutDashboard
} from "lucide-react";

const leadStats = [
  { label: "Today's Leads", value: "12", icon: Clock, color: "text-blue-500", bg: "bg-blue-500/10", border: "border-blue-500/20" },
  { label: "New Leads", value: "45", icon: Users, color: "text-purple-500", bg: "bg-purple-500/10", border: "border-purple-500/20" },
  { label: "Contacted", value: "28", icon: CheckCircle, color: "text-emerald-500", bg: "bg-emerald-500/10", border: "border-emerald-500/20" },
  { label: "Suspected (Fake)", value: "3", icon: AlertTriangle, color: "text-rose-500", bg: "bg-rose-500/10", border: "border-rose-500/20" }
];

const mockLeads = [
  { id: 1, name: "Rahul Sharma", phone: "+91 98765 43210", channel: "SOCIAL / FB ADS", state: "ACTIVE SYNC", stateColor: "text-emerald-500" },
  { id: 2, name: "Rahul Sharma", phone: "+91 98765 43210", channel: "SOCIAL / FB ADS", state: "ACTIVE SYNC", stateColor: "text-emerald-500" },
  { id: 3, name: "Rahul Sharma", phone: "+91 98765 43210", channel: "SOCIAL / FB ADS", state: "ACTIVE SYNC", stateColor: "text-emerald-500" },
  { id: 4, name: "Rahul Sharma", phone: "+91 98765 43210", channel: "SOCIAL / FB ADS", state: "ACTIVE SYNC", stateColor: "text-emerald-500" },
];

import leadService from "../api/leadService";
import userService from "../api/userService";
import adminService from "../api/adminService";

const CustomDropdown = ({ label, options, value, onChange, placeholder }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = React.useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const selectedOption = options.find(opt => opt.value === value);

  return (
    <div className="space-y-2 relative" ref={dropdownRef}>
      <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest ml-1">{label}</label>
      <div
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full bg-input/50 border rounded-2xl p-4 flex items-center justify-between cursor-pointer transition-all ${isOpen ? 'border-primary shadow-lg shadow-primary/10 bg-input' : 'border-border hover:border-primary/50'
          }`}
      >
        <span className={`text-[11px] font-black uppercase tracking-widest ${selectedOption ? 'text-foreground' : 'text-muted-foreground/50'}`}>
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <ChevronDown size={14} className={`text-muted-foreground transition-transform duration-300 ${isOpen ? 'rotate-180 text-primary' : ''}`} />
      </div>

      <AnimatePresence>
        {isOpen && (
          <Motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="absolute z-[210] top-[calc(100%+8px)] left-0 w-full bg-card/95 backdrop-blur-xl border border-border rounded-2xl overflow-hidden shadow-2xl"
          >
            <div className="max-h-60 overflow-y-auto custom-scrollbar py-2">
              {options.map((opt) => (
                <div
                  key={opt.value}
                  onClick={() => {
                    onChange(opt.value);
                    setIsOpen(false);
                  }}
                  className={`px-5 py-3.5 text-[10px] font-black uppercase tracking-widest cursor-pointer transition-all flex items-center justify-between group ${value === opt.value
                    ? 'text-primary bg-primary/10'
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                    }`}
                >
                  <span>{opt.label}</span>
                  {value === opt.value && <div className="w-1.5 h-1.5 rounded-full bg-primary shadow-[0_0_10px_rgba(59,130,246,0.5)]" />}
                </div>
              ))}
            </div>
          </Motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

import { useNotifications } from "../context/NotificationContext.jsx";

export default function Dashboard() {
  const navigate = useNavigate();
  const location = useLocation();
  const isAdminPath = location.pathname.startsWith('/admin/dashboard');
  const basePrefix = isAdminPath ? '/admin/dashboard' : '/dashboard';
  const { addNotification } = useNotifications();
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [team, setTeam] = useState([]);
  const [newLead, setNewLead] = useState({
    name: "", email: "", phone: "", channel: "Social / FB Ads", status: "NEW", notes: "", assigned_to: ""
  });
  const [activityLogs, setActivityLogs] = useState([]);

  const [user, setUser] = useState(() => {
    try {
      const raw = localStorage.getItem("user");
      return raw ? JSON.parse(raw) : null;
    } catch { return null; }
  });

  useEffect(() => {
    const handleAuth = () => {
      const raw = localStorage.getItem("user");
      if (raw) setUser(JSON.parse(raw));
    };
    window.addEventListener('auth-update', handleAuth);
    return () => window.removeEventListener('auth-update', handleAuth);
  }, []);

  const isAdmin = useMemo(() => {
    return user?.roles?.some(r => r.toLowerCase() === 'admin');
  }, [user]);

  const hasPermission = (permission) => {
    return user?.permissions?.includes(permission) || isAdmin;
  };

  const filteredStats = useMemo(() => {
    return leadStats.filter(stat => {
      if (stat.label.includes('Suspected')) return hasPermission('manage_users') || user?.roles?.includes('Admin');
      return true;
    });
  }, [user]);

  const fetchLeads = async () => {
    try {
      setLoading(true);
      const data = await leadService.getLeads();
      if (data.success) {
        setLeads(data.data);
      }
    } catch (error) {
      console.error("Error fetching leads:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchTeam = async () => {
    try {
      const data = await userService.getUsers();
      if (data.success) setTeam(data.data);
    } catch (err) { console.error("Error fetching team:", err); }
  };

  const fetchActivity = async () => {
    try {
      const data = await adminService.getActivityLogs();
      if (data.success) setActivityLogs(data.data);
    } catch (err) { console.error("Error fetching activity:", err); }
  };

  useEffect(() => {
    if (user) {
      fetchLeads();
      if (isAdmin) {
        fetchTeam();
        fetchActivity();
      }
    }
  }, [user, isAdmin]);

  const handleAddLead = async (e) => {
    e.preventDefault();
    try {
      const response = await leadService.createLead(newLead);
      if (response.success) {
        setLeads([response.data, ...leads]);
        setIsAddModalOpen(false);
        addNotification({
          title: "Lead Created",
          message: `${newLead.name} has been successfully added.`,
          type: "success",
          icon: Plus
        });
        setNewLead({ name: "", email: "", phone: "", channel: "Social / FB Ads", status: "NEW", notes: "", assigned_to: "" });
      }
    } catch (error) {
      alert(error.message || "Failed to add lead");
    }
  };

  const handleAssignLead = async (leadId, userId) => {
    try {
      const response = await leadService.updateLead(leadId, { assigned_to: userId });
      if (response.success) {
        const assignedMember = team.find(u => u.id === parseInt(userId));
        const lead = leads.find(l => l.id === leadId);

        setLeads(prev => prev.map(l => l.id === leadId ? { ...l, assigned_to: userId, assignee_name: assignedMember?.name } : l));

        addNotification({
          title: "Lead Assigned",
          message: `${lead?.name} has been assigned to ${assignedMember?.name || 'the team member'}.`,
          type: "info",
          icon: UserCheck
        });
      }
    } catch (err) {
      alert(err.message || "Failed to assign lead");
    }
  };

  return (
    <div className="space-y-12 transition-colors duration-300">
      {/* Page Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8 lg:gap-0">
        <div className="flex items-center">
          <div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-foreground tracking-tight uppercase flex items-center gap-3">
              <LayoutDashboard size={32} className="text-primary hidden sm:block" />
              <span className="text-foreground">Lead</span> <span className="text-primary">Mates Central</span>
            </h1>
            <div className="flex flex-wrap items-center gap-3 sm:gap-4 mt-1 sm:mt-2">
              <span className="text-[9px] sm:text-[10px] font-black text-muted-foreground uppercase tracking-[0.3em]">Intelligence Command Center</span>
              <div className="flex items-center gap-2 px-2 sm:px-3 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-[7px] sm:text-[8px] font-black text-emerald-500 uppercase tracking-widest animate-pulse">
                <span className="w-1 h-1 sm:w-1.5 sm:h-1.5 bg-emerald-500 rounded-full" />
                Live System
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {filteredStats.map((stat, i) => (
          <Motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-card border border-border rounded-[24px] p-6 sm:p-8 relative group hover:border-primary/30 transition-all cursor-pointer shadow-premium"
          >
            <div className="flex items-start justify-between">
              <div className={`w-12 h-12 sm:w-14 sm:h-14 rounded-2xl ${stat.bg} flex items-center justify-center ${stat.color} shadow-lg shadow-black/5 group-hover:scale-110 transition-transform`}>
                <stat.icon size={22} className="sm:w-[26px] sm:h-[26px]" />
              </div>
              <div className="flex items-center gap-1 text-[9px] sm:text-[11px] font-black text-emerald-500 bg-emerald-500/10 px-2 py-1 rounded-lg">
                <TrendingUp size={12} /> +12%
              </div>
            </div>

            <div className="mt-6 sm:mt-8">
              <p className="text-[9px] sm:text-[11px] font-black text-muted-foreground uppercase tracking-[0.2em]">{stat.label}</p>
              <h3 className="text-2xl sm:text-3xl font-black text-foreground mt-1 tracking-tighter">{stat.value}</h3>
            </div>

            <div className="absolute bottom-4 left-8 right-8 h-px bg-gradient-to-r from-transparent via-border to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          </Motion.div>
        ))}
      </div>

      {/* Intelligence & Activity Sections */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
        {/* Live Intelligence Activity */}
        <div className="lg:col-span-2 bg-card rounded-[24px] sm:rounded-[32px] border border-border p-6 sm:p-8 relative overflow-hidden group shadow-premium">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 sm:mb-8 gap-4 sm:gap-0">
            <div>
              <div className="flex items-center gap-3">
                <Activity size={18} className="text-primary" />
                <h3 className="text-[11px] sm:text-[13px] font-black text-foreground uppercase tracking-[0.3em]">Live Intelligence Activity</h3>
              </div>
              <p className="text-[9px] sm:text-[10px] text-muted-foreground font-bold mt-1 uppercase">Real-time traffic analysis</p>
            </div>
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-primary/10 border border-primary/20 text-[9px] font-black text-primary uppercase animate-pulse">
              <Activity size={12} /> Active Node
            </div>
          </div>

          <div className="space-y-4">
            {user?.roles?.includes('Admin') && activityLogs.length > 0 ? (
              activityLogs.map((log, i) => (
                <div key={log.id} className="flex items-center justify-between p-5 rounded-2xl bg-secondary/30 border border-border/50 hover:bg-secondary/50 transition-all cursor-default group/item">
                  <div className="flex items-center gap-5">
                    <div className={`w-11 h-11 rounded-xl bg-background border border-border flex items-center justify-center text-blue-500 shadow-sm group-hover/item:scale-105 transition-transform`}>
                      <Shield size={20} />
                    </div>
                    <div>
                      <h4 className="text-[12px] font-black text-foreground uppercase tracking-wider">{log.user}</h4>
                      <p className="text-[10px] text-muted-foreground mt-1 font-bold uppercase tracking-tight">{log.desc}</p>
                    </div>
                  </div>
                  <span className="text-[10px] font-black text-muted-foreground uppercase">
                    {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              ))
            ) : (
              [
                { title: "High Value Lead Detected", time: "2m ago", desc: "Meta Campaign: Q4 Retail", icon: MessageCircle, color: "text-blue-500" },
                { title: "Campaign Milestone Reached", time: "14m ago", desc: "50+ qualified leads from LinkedIn", icon: Shield, color: "text-emerald-500" },
                { title: "System Integrity Check", time: "1h ago", desc: "All security protocols active", icon: Shield, color: "text-emerald-500" },
                { title: "New Suspect Filtered", time: "3h ago", desc: "Bot traffic from unknown source", icon: AlertTriangle, color: "text-rose-500" }
              ].map((item, i) => (
                <div key={i} className="flex items-center justify-between p-5 rounded-2xl bg-secondary/30 border border-border/50 hover:bg-secondary/50 transition-all cursor-default group/item">
                  <div className="flex items-center gap-5">
                    <div className={`w-11 h-11 rounded-xl bg-background border border-border flex items-center justify-center ${item.color} shadow-sm group-hover/item:scale-105 transition-transform`}>
                      <item.icon size={20} />
                    </div>
                    <div>
                      <h4 className="text-[12px] font-black text-foreground uppercase tracking-wider">{item.title}</h4>
                      <p className="text-[10px] text-muted-foreground mt-1 font-bold uppercase tracking-tight">{item.desc}</p>
                    </div>
                  </div>
                  <span className="text-[10px] font-black text-muted-foreground uppercase">{item.time}</span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Intelligence Summary & Quota */}
        <div className="space-y-8">
          {isAdmin && (
            <div className="bg-card rounded-[32px] border border-border p-8 relative overflow-hidden shadow-premium">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <Users size={16} className="text-primary" />
                  <h3 className="text-[12px] font-black text-foreground uppercase tracking-[0.3em]">Quick Team View</h3>
                </div>
                <button
                  onClick={() => navigate('/admin/dashboard/users')}
                  className="text-primary hover:scale-110 transition-transform"
                >
                  <MoreHorizontal size={20} />
                </button>
              </div>
              <div className="space-y-4">
                {team.length > 0 ? (
                  team.slice(0, 4).map((member) => (
                    <div key={member.id} className="flex items-center justify-between group/member">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center font-black text-primary text-[10px] border border-primary/20">
                          {member.name[0]}
                        </div>
                        <div>
                          <div className="text-[11px] font-black text-foreground uppercase tracking-wider">{member.name}</div>
                          <div className="text-[9px] text-primary font-bold uppercase tracking-widest">{member.role}</div>
                        </div>
                      </div>
                      <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.4)]" />
                    </div>
                  ))
                ) : (
                  <div className="py-4 text-center">
                    <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest opacity-40">No team members online</p>
                  </div>
                )}
              </div>
            </div>
          )}

          <div className="bg-card rounded-[32px] border border-border p-8 relative overflow-hidden shadow-premium">
            <div className="flex items-center gap-3 mb-6">
              <Shield size={16} className="text-primary" />
              <h3 className="text-[12px] font-black text-foreground uppercase tracking-[0.3em]">Security Module</h3>
            </div>
            <div className="flex items-center gap-4 mb-6">
              <div className="w-14 h-14 rounded-full border-2 border-emerald-500/20 flex items-center justify-center text-emerald-500 bg-emerald-500/10 shadow-lg shadow-emerald-500/10">
                <Shield size={26} />
              </div>
              <div>
                <div className="text-[14px] font-black text-foreground uppercase tracking-widest leading-none">Encrypted</div>
                <div className="text-[10px] font-black text-emerald-500 uppercase tracking-widest mt-1.5">Direct Access</div>
              </div>
            </div>
            <p className="text-[11px] text-muted-foreground leading-relaxed font-bold uppercase tracking-tight">
              All system logs are encrypted. Session active for {user?.roles?.includes('Admin') ? '12' : '4'} hours.
            </p>
          </div>

          <div className="bg-primary/5 rounded-[32px] border border-primary/20 p-8 relative overflow-hidden shadow-premium">
            <div className="flex items-center gap-3 mb-5">
              <Layers size={16} className="text-primary" />
              <h3 className="text-[12px] font-black text-foreground uppercase tracking-[0.3em]">Lead Quota</h3>
            </div>
            <div className="h-2 w-full bg-secondary rounded-full overflow-hidden mb-5">
              <Motion.div
                initial={{ width: 0 }}
                animate={{ width: "65%" }}
                transition={{ duration: 1.5, ease: "circOut" }}
                className="h-full bg-primary shadow-[0_0_15px_rgba(0,102,255,0.4)]"
              />
            </div>
            <div className="flex justify-between items-center text-[11px] font-black uppercase">
              <span className="text-primary tracking-widest">809 / 1,245 Leads</span>
              <span className="text-muted-foreground">{user?.plan || "Premium Tier"}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Table Section */}
      <div className="bg-card rounded-[24px] sm:rounded-[32px] border border-border overflow-hidden shadow-premium">
        {/* Table Header */}
        <div className="px-6 sm:px-10 py-6 sm:py-8 border-b border-border flex flex-col sm:flex-row sm:items-center justify-between gap-4 sm:gap-0 bg-muted/20">
          <div className="flex items-center gap-4">
            <div className="p-2 sm:p-3 rounded-2xl bg-primary/10 text-primary">
              <Shield size={20} className="sm:w-[22px] sm:h-[22px]" />
            </div>
            <h3 className="text-[11px] sm:text-[13px] font-black text-foreground uppercase tracking-[0.3em]">Real-Time Lead Stream</h3>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-[9px] sm:text-[10px] font-black text-muted-foreground uppercase tracking-widest">{leads.length} Records Detected</span>
          </div>
        </div>

        {/* Mobile Lead Cards (Visible on mobile only) */}
        <div className="md:hidden divide-y divide-border">
          {!hasPermission('view_lead') ? (
            <div className="px-6 py-20 text-center">
              <div className="flex flex-col items-center gap-4 grayscale opacity-50">
                <Shield size={40} className="text-muted-foreground" />
                <div className="space-y-1">
                  <p className="text-[11px] font-black text-foreground uppercase tracking-[0.2em]">Clearance Required</p>
                  <p className="text-[9px] text-muted-foreground font-bold uppercase tracking-widest leading-tight">Access restricted by role.</p>
                </div>
              </div>
            </div>
          ) : loading ? (
            <div className="px-6 py-20 text-center">
              <div className="flex flex-col items-center gap-4">
                <div className="w-10 h-10 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
                <span className="text-[9px] font-black text-muted-foreground uppercase tracking-widest">Scanning Network..</span>
              </div>
            </div>
          ) : leads.length === 0 ? (
            <div className="px-6 py-20 text-center text-muted-foreground text-[10px] font-black uppercase tracking-widest">
              No intelligence nodes found.
            </div>
          ) : leads.map((lead) => (
            <div key={lead.id} className="p-6 space-y-4 hover:bg-muted/30 transition-colors">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center font-black text-primary uppercase text-sm">
                    {lead.name[0]}
                  </div>
                  <div className="min-w-0">
                    <p className="text-[12px] font-black text-foreground tracking-wide uppercase truncate max-w-[150px]">{lead.name}</p>
                    <p className="text-[9px] font-bold text-muted-foreground uppercase opacity-60">{lead.phone}</p>
                  </div>
                </div>
                <div className={`px-2 py-1 rounded-lg text-[8px] font-black uppercase tracking-widest border ${lead.status === 'SUSPECTED' ? 'bg-rose-500/10 text-rose-500 border-rose-500/20' : 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20'}`}>
                  {lead.status}
                </div>
              </div>
              <div className="flex items-center justify-between pt-2">
                <div className="flex items-center gap-2">
                  <span className="text-[9px] font-black text-primary bg-primary/10 px-2 py-0.5 rounded-md uppercase tracking-widest">{lead.channel}</span>
                  <span className="text-[9px] font-bold text-muted-foreground/50 uppercase tracking-tighter">via {lead.creator_name || 'System'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={() => lead.phone ? window.location.href = `tel:${lead.phone}` : alert("No phone number recorded")} className="p-2.5 rounded-lg bg-secondary border border-border text-muted-foreground"><Phone size={12} /></button>
                  <button onClick={() => lead.email ? window.location.href = `mailto:${lead.email}` : alert("No email address recorded")} className="p-2.5 rounded-lg bg-secondary border border-border text-muted-foreground"><Mail size={12} /></button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Lead Table (Hidden on mobile) */}
        <div className="hidden md:block overflow-x-auto custom-scrollbar">
          <table className="w-full">
            <thead>
              <tr className="bg-muted/50 text-nowrap">
                <th className="px-6 sm:px-10 py-6 text-left text-[9px] sm:text-[10px] font-black text-muted-foreground uppercase tracking-[0.3em]">Identity Node</th>
                <th className="hidden md:table-cell px-6 sm:px-10 py-6 text-left text-[9px] sm:text-[10px] font-black text-muted-foreground uppercase tracking-[0.3em]">Creator</th>
                <th className="hidden lg:table-cell px-6 sm:px-10 py-6 text-left text-[9px] sm:text-[10px] font-black text-muted-foreground uppercase tracking-[0.3em]">Channel</th>
                <th className="hidden sm:table-cell px-6 sm:px-10 py-6 text-left text-[9px] sm:text-[10px] font-black text-muted-foreground uppercase tracking-[0.3em]">Assignee</th>
                <th className="px-6 sm:px-10 py-6 text-left text-[9px] sm:text-[10px] font-black text-muted-foreground uppercase tracking-[0.3em]">Status</th>
                <th className="px-6 sm:px-10 py-6 text-right text-[9px] sm:text-[10px] font-black text-muted-foreground uppercase tracking-[0.3em]">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {!hasPermission('view_lead') ? (
                <tr>
                  <td colSpan="6" className="px-10 py-20 text-center">
                    <div className="flex flex-col items-center gap-4 py-10 grayscale opacity-50">
                      <Shield size={48} className="text-muted-foreground" />
                      <div className="space-y-1">
                        <p className="text-[12px] font-black text-foreground uppercase tracking-[0.2em]">Clearance Required</p>
                        <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest">Access to lead stream is restricted by role.</p>
                      </div>
                    </div>
                  </td>
                </tr>
              ) : loading ? (
                <tr>
                  <td colSpan="6" className="px-10 py-20 text-center">
                    <div className="flex flex-col items-center gap-4">
                      <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
                      <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Scanning Network..</span>
                    </div>
                  </td>
                </tr>
              ) : leads.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-10 py-20 text-center text-muted-foreground text-[12px] font-black uppercase tracking-widest">
                    No intelligence nodes found. Add your first data point.
                  </td>
                </tr>
              ) : leads.map((lead) => (
                <tr key={lead.id} className="hover:bg-muted/30 transition-colors group">
                  <td className="px-6 sm:px-10 py-6 sm:py-8">
                    <span className="flex items-center gap-4 sm:gap-5">
                      <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center font-black text-primary group-hover:scale-105 transition-transform uppercase text-sm sm:text-base">
                        {lead.name[0]}
                      </div>
                      <div className="min-w-0">
                        <p className="text-[12px] sm:text-[14px] font-black text-foreground tracking-wide uppercase truncate">{lead.name}</p>
                        <p className="text-[9px] sm:text-[10px] font-bold text-muted-foreground mt-0.5 sm:mt-1 uppercase tracking-tighter truncate">{lead.phone}</p>
                      </div>
                    </span>
                  </td>
                  <td className="hidden md:table-cell px-6 sm:px-10 py-8">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-secondary flex items-center justify-center text-[10px] font-black text-primary border border-primary/20">
                        {lead.creator_name?.charAt(0) || "U"}
                      </div>
                      <span className="text-[11px] font-black text-foreground uppercase tracking-wider">{lead.creator_name || "System"}</span>
                    </div>
                  </td>
                  <td className="hidden lg:table-cell px-6 sm:px-10 py-8">
                    <span className="text-[10px] font-black text-primary bg-primary/10 border border-primary/20 px-3 py-1.5 rounded-lg uppercase tracking-widest whitespace-nowrap">
                      {lead.channel}
                    </span>
                  </td>
                  <td className="hidden sm:table-cell px-6 sm:px-10 py-8">
                    {user?.roles?.includes('Admin') ? (
                      <div className="relative group/assign">
                        <select
                          value={lead.assigned_to || ""}
                          onChange={(e) => handleAssignLead(lead.id, e.target.value)}
                          className="bg-secondary/50 border border-border rounded-xl px-3 py-1.5 text-[10px] font-black text-foreground uppercase tracking-wider focus:outline-none focus:border-primary transition-all appearance-none cursor-pointer pr-8"
                        >
                          <option value="">Unassigned</option>
                          {team.map(u => (
                            <option key={u.id} value={u.id} className="text-foreground bg-background">{u.name}</option>
                          ))}
                        </select>
                        <ChevronDown size={14} className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <UserCheck size={14} className={lead.assigned_to ? "text-primary" : "text-muted-foreground opacity-50"} />
                        <span className={`text-[10px] font-black uppercase tracking-widest ${lead.assigned_to ? 'text-foreground' : 'text-muted-foreground'}`}>
                          {lead.assignee_name || "Unassigned"}
                        </span>
                      </div>
                    )}
                  </td>
                  <td className="px-6 sm:px-10 py-6 sm:py-8">
                    <div className="flex items-center gap-2 sm:gap-3">
                      <div className={`w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full shadow-[0_0_10px_rgba(16,185,129,0.5)] ${lead.status === 'SUSPECTED' ? 'bg-rose-500 shadow-rose-500/50' : 'bg-emerald-500 shadow-emerald-500/50'}`} />
                      <span className={`text-[9px] sm:text-[10px] font-black uppercase tracking-[0.2em] ${lead.status === 'SUSPECTED' ? 'text-rose-500' : 'text-emerald-500'}`}>
                        {lead.status}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 sm:px-10 py-6 sm:py-8">
                    <div className="flex items-center justify-end gap-2 sm:gap-3 transition-all">
                      <button
                        onClick={() => lead.phone ? window.location.href = `tel:${lead.phone}` : alert("No phone number available")}
                        className="p-2 sm:p-3 rounded-xl bg-secondary border border-border text-muted-foreground hover:text-foreground hover:bg-primary transition-all shadow-lg cursor-pointer"
                      >
                        <Phone size={12} className="sm:w-[14px] sm:h-[14px]" />
                      </button>
                      <button
                        onClick={() => lead.email ? window.location.href = `mailto:${lead.email}` : alert("No email address available")}
                        className="p-2 sm:p-3 rounded-xl bg-secondary border border-border text-muted-foreground hover:text-foreground hover:bg-primary transition-all shadow-lg cursor-pointer"
                      >
                        <Mail size={12} className="sm:w-[14px] sm:h-[14px]" />
                      </button>
                      {hasPermission('delete_lead') && (
                        <button
                          onClick={async () => {
                            if (window.confirm("Are you sure you want to delete this lead?")) {
                              const leadToRemove = lead;
                              await leadService.deleteLead(lead.id);
                              fetchLeads();
                              addNotification({
                                title: "Lead Deleted",
                                message: `${leadToRemove?.name || 'The lead'} has been successfully deleted.`,
                                type: "warning",
                                icon: Trash2
                              });
                            }
                          }}
                          className="p-2 sm:p-3 rounded-xl bg-secondary border border-border text-muted-foreground hover:text-rose-500 hover:bg-destructive/10 transition-all shadow-lg cursor-pointer"
                        >
                          <Trash2 size={12} className="sm:w-[14px] sm:h-[14px]" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Table Footer */}
        <div className="px-6 sm:px-10 py-6 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-6 sm:gap-0 text-[10px] sm:text-[11px] font-black text-muted-foreground uppercase tracking-widest bg-muted/20">
          <div>Showing {leads.length} of {leads.length} Leads</div>
          <div className="flex items-center gap-4">
            <button className="hover:text-foreground transition-colors cursor-pointer">Prev</button>
            <div className="flex items-center gap-1">
              <button className="w-8 h-8 rounded-lg bg-primary text-primary-foreground flex items-center justify-center">1</button>
              <button className="w-8 h-8 rounded-lg hover:bg-secondary flex items-center justify-center transition-colors cursor-pointer">2</button>
              <button className="w-8 h-8 rounded-lg hover:bg-secondary flex items-center justify-center transition-colors cursor-pointer">3</button>
            </div>
            <button className="hover:text-foreground transition-colors cursor-pointer">Next</button>
          </div>
        </div>
      </div>

      {/* Add Lead Modal */}
      <AnimatePresence>
        {isAddModalOpen && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
            <Motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsAddModalOpen(false)}
              className="absolute inset-0 bg-black/80 backdrop-blur-md"
            />
            <Motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-md bg-card border border-border rounded-[2rem] sm:rounded-[2.5rem] p-6 sm:p-10 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.6)] overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 blur-[100px] pointer-events-none" />

              <div className="relative z-10">
                <div className="flex items-center gap-3 sm:gap-4 mb-6 sm:mb-10">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                    <Activity size={20} className="sm:w-[24px] sm:h-[24px]" />
                  </div>
                  <div>
                    <h2 className="text-lg sm:text-2xl font-black text-foreground uppercase tracking-tight">Add Intelligence</h2>
                    <p className="text-[8px] sm:text-[10px] text-muted-foreground font-black uppercase tracking-widest mt-1">New Entry Node</p>
                  </div>
                </div>

                <form onSubmit={handleAddLead} className="space-y-4 sm:space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest ml-1">Full Name</label>
                      <input
                        required
                        type="text"
                        placeholder="Ex: Gaurav"
                        value={newLead.name}
                        onChange={(e) => setNewLead({ ...newLead, name: e.target.value })}
                        className="w-full bg-input/50 focus:bg-input border border-border rounded-2xl p-4 text-[12px] font-bold text-foreground focus:outline-none focus:border-primary/50 transition-all uppercase tracking-widest placeholder:text-muted-foreground/50"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest ml-1">Phone Status</label>
                      <input
                        required
                        type="tel"
                        placeholder="+91 00000 00000"
                        value={newLead.phone}
                        onChange={(e) => setNewLead({ ...newLead, phone: e.target.value })}
                        className="w-full bg-input/50 focus:bg-input border border-border rounded-2xl p-4 text-[12px] font-bold text-foreground focus:outline-none focus:border-primary/50 transition-all tracking-widest placeholder:text-muted-foreground/50"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest ml-1">Email Address (Optional)</label>
                    <input
                      type="email"
                      placeholder="address@intelligence.com"
                      value={newLead.email}
                      onChange={(e) => setNewLead({ ...newLead, email: e.target.value })}
                      className="w-full bg-input/50 focus:bg-input border border-border rounded-2xl p-4 text-[12px] font-bold text-foreground focus:outline-none focus:border-primary/50 transition-all tracking-widest placeholder:text-muted-foreground/50"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                    <CustomDropdown
                      label="Traffic Channel"
                      value={newLead.channel}
                      onChange={(val) => setNewLead({ ...newLead, channel: val })}
                      options={[
                        { label: "Social / FB Ads", value: "Social / FB Ads" },
                        { label: "Google Search", value: "Google Search" },
                        { label: "LinkedIn B2B", value: "LinkedIn B2B" },
                        { label: "Direct Sync", value: "Direct Sync" }
                      ]}
                    />
                    <CustomDropdown
                      label="Entry Status"
                      value={newLead.status}
                      onChange={(val) => setNewLead({ ...newLead, status: val })}
                      options={[
                        { label: "New Entry", value: "NEW" },
                        { label: "Active Contact", value: "CONTACTED" },
                        { label: "Suspected Bot", value: "SUSPECTED" },
                        { label: "Closed Lead", value: "CONVERTED" }
                      ]}
                    />
                  </div>

                  <CustomDropdown
                    label="Assign To"
                    value={newLead.assigned_to}
                    onChange={(val) => setNewLead({ ...newLead, assigned_to: val })}
                    placeholder="Self (Unassigned)"
                    options={[
                      { label: "Self (Unassigned)", value: "" },
                      ...team.map(u => ({ label: u.name, value: u.id.toString() }))
                    ]}
                  />

                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest ml-1">Additional Intelligence (Notes)</label>
                    <textarea
                      placeholder="Enter lead details, context, or requirements..."
                      value={newLead.notes}
                      onChange={(e) => setNewLead({ ...newLead, notes: e.target.value })}
                      className="w-full bg-input/50 focus:bg-input border border-border rounded-2xl p-4 text-[11px] font-bold text-foreground focus:outline-none focus:border-primary/50 transition-all tracking-widest placeholder:text-muted-foreground/50 min-h-[100px] resize-none"
                    />
                  </div>

                  <div className="flex gap-4 pt-6">
                    <button
                      type="button"
                      onClick={() => setIsAddModalOpen(false)}
                      className="flex-1 bg-secondary text-foreground py-3.5 sm:py-4 rounded-xl sm:rounded-2xl font-black text-[11px] sm:text-[12px] uppercase tracking-[0.2em] border border-border hover:bg-background transition-all"
                    >
                      Abort
                    </button>
                    <button
                      type="submit"
                      className="flex-[2] bg-primary text-white py-3.5 sm:py-3 rounded-xl font-black text-[11px] uppercase tracking-[0.2em] shadow-xl shadow-primary/20 hover:scale-[1.05] active:scale-[0.95] transition-all cursor-pointer"
                    >
                      Authenticate & Save
                    </button>
                  </div>
                </form>
              </div>
            </Motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
