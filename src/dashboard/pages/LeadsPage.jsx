import React, { useEffect, useMemo, useState } from "react";
import { Plus, Trash2, Loader2, Download, Edit2, Users, X, Search, Activity, Clock, ShieldCheck, Mail, Phone, Calendar, ExternalLink } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import leadService from "../../api/leadService";
import { useSearch } from "../../context/SearchContext.jsx";
import { useNotifications } from "../../context/NotificationContext.jsx";

export default function LeadsPage() {
  const navigate = useNavigate();
  const { addNotification } = useNotifications();
  const location = useLocation();
  const isAdminPath = location.pathname.startsWith('/admin/dashboard');
  const basePrefix = isAdminPath ? '/admin/dashboard' : '/dashboard';
  const { searchQuery } = useSearch();

  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState("add"); // "add" or "edit"
  const [editingId, setEditingId] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    status: "NEW",
    custom_values: {}
  });

  const fetchLeads = async () => {
    try {
      setLoading(true);
      const data = await leadService.getLeads();
      if (data.success) {
        setLeads(data.data);
      }
    } catch (err) {
      setError(err.message || "Failed to fetch leads");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeads();
  }, []);

  const filteredLeads = useMemo(() => {
    if (!searchQuery) return leads;
    const lower = searchQuery.toLowerCase();
    return leads.filter(l =>
      l.name.toLowerCase().includes(lower) ||
      (l.email && l.email.toLowerCase().includes(lower)) ||
      (l.phone && l.phone.toLowerCase().includes(lower)) ||
      l.status.toLowerCase().includes(lower)
    );
  }, [leads, searchQuery]);

  const resetForm = () => {
    setFormData({ name: "", email: "", phone: "", status: "NEW" });
    setEditingId(null);
    setModalMode("add");
  };

  const openAddModal = () => {
    resetForm();
    setModalMode("add");
    setIsModalOpen(true);
  };

  const openEditModal = (lead) => {
    setFormData({
      name: lead.name,
      email: lead.email || "",
      phone: lead.phone || "",
      status: lead.status || "NEW",
      custom_values: lead.custom_values || {}
    });
    setEditingId(lead.id);
    setModalMode("edit");
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.phone.trim()) return;

    try {
      setSubmitting(true);
      if (modalMode === "add") {
        const result = await leadService.createLead({
          ...formData,
          channel: "Direct"
        });
        if (result.success) {
          setLeads([result.data, ...leads]);
          setIsModalOpen(false);
          resetForm();
          addNotification({
            title: "Lead Created",
            message: `${formData.name} has been successfully added.`,
            type: "success",
            icon: Plus
          });
        }
      } else {
        const result = await leadService.updateLead(editingId, formData);
        if (result.success) {
          setLeads(leads.map(l => l.id === editingId ? { ...l, ...result.data } : l));
          setIsModalOpen(false);
          resetForm();
          addNotification({
            title: "Lead Updated",
            message: `The information for ${formData.name} has been updated.`,
            type: "info",
            icon: Edit2
          });
        }
      }
    } catch (err) {
      alert(err.message || `Failed to ${modalMode} lead`);
    } finally {
      setSubmitting(false);
    }
  };

  const removeLead = async (id) => {
    const leadToRemove = leads.find(l => l.id === id);
    if (!window.confirm("Are you sure you want to purge this lead record?")) return;
    try {
      const data = await leadService.deleteLead(id);
      if (data.success) {
        setLeads((prev) => prev.filter((l) => l.id !== id));
        addNotification({
          title: "Lead Deleted",
          message: `${leadToRemove?.name || 'The lead'} has been moved to trash.`,
          type: "warning",
          icon: Trash2
        });
      }
    } catch (err) {
      alert(err.message || "Failed to delete lead");
    }
  };

  const exportCSV = () => {
    const dataToExport = filteredLeads.length ? filteredLeads : leads;
    if (!dataToExport.length) return;
    const headers = ["ID,Name,Email,Phone,Channel,Status,Assignee,Created At"];
    const rows = dataToExport.map(l =>
      [l.id, `"${l.name}"`, l.email, l.phone, l.channel, l.status, l.assignee_name || "Unassigned", l.created_at].join(",")
    );
    const csvContent = "data:text/csv;charset=utf-8," + [headers, ...rows].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `leads_export_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getPriorityColor = (priority) => {
    switch (priority?.toLowerCase()) {
      case 'high': return 'text-rose-500 bg-rose-500/10 border-rose-500/20 shadow-rose-500/10';
      case 'medium': return 'text-amber-500 bg-amber-500/10 border-amber-500/20 shadow-amber-500/10';
      case 'low': return 'text-blue-500 bg-blue-500/10 border-blue-500/20 shadow-blue-500/10';
      default: return 'text-muted-foreground bg-muted/10 border-muted/20';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'NEW': return 'text-blue-500 bg-blue-500/10 border-blue-500/20';
      case 'CONTACTED': return 'text-amber-500 bg-amber-500/10 border-amber-500/20';
      case 'QUALIFIED': return 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20';
      case 'LOST': return 'text-rose-500 bg-rose-500/10 border-rose-500/20';
      default: return 'text-muted-foreground bg-muted/10 border-muted/20';
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-3 text-gray-400">
        <Loader2 className="animate-spin" size={32} />
        <p className="text-[10px] font-black uppercase tracking-widest opacity-60">Synchronizing Lead Database...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div className="flex items-center gap-5">
          <div className="p-3.5 rounded-2xl bg-primary/10 border border-primary/20 text-primary shadow-lg shadow-primary/10">
            <Users size={24} />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-foreground tracking-tight uppercase flex items-center gap-3">
              {/* <Users size={32} className="text-primary hidden sm:block" /> */}
              <span className="text-foreground">Lead</span> <span className="text-primary">Intelligence</span>
            </h1>
            <div className="flex items-center gap-2 mt-1 px-3 py-1 rounded-lg bg-primary/10 border border-primary/20 w-fit">
              <span className="w-1.5 h-1.5 bg-primary rounded-full animate-pulse shadow-[0_0_8px_rgba(37,99,235,0.4)]" />
              <span className="text-[9px] font-black text-primary uppercase tracking-widest">{leads.length} Active Records</span>
            </div>
          </div>
        </div>
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full sm:w-auto">
          <button
            onClick={exportCSV}
            className="flex-1 sm:flex-none flex items-center justify-center gap-3 px-6 py-4 sm:py-3 bg-secondary border border-border text-muted-foreground rounded-xl text-[11px] font-black uppercase tracking-widest hover:text-foreground hover:bg-secondary/80 hover:scale-[1.05] active:scale-95 transition-all cursor-pointer"
          >
            <Download size={18} />
            Export
          </button>
          <button
            onClick={() => navigate(`${basePrefix}/capture-lead`)}
            className="flex-[2] sm:flex-none flex items-center justify-center gap-3 px-6 py-4 sm:py-3 bg-primary text-white rounded-xl text-[11px] font-black uppercase tracking-widest shadow-xl shadow-primary/20 hover:scale-[1.05] active:scale-95 transition-all cursor-pointer group"
          >
            <Plus size={18} className="group-hover:rotate-90 transition-transform" />
            Capture New Lead
          </button>
        </div>
      </div>

      {error && (
        <div className="p-5 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-[10px] font-black uppercase tracking-widest flex items-center gap-3 shadow-lg shadow-rose-500/10">
          <Activity size={16} /> {error}
        </div>
      )}

      {/* Grid Content */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
        <AnimatePresence mode="popLayout">
          {filteredLeads.map((l) => (
            <motion.div
              layout
              key={l.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-card border border-border rounded-[32px] p-8 relative group hover:border-primary/30 transition-all shadow-premium overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 blur-[60px] pointer-events-none group-hover:bg-primary/10 transition-all" />

              <div className="flex items-start justify-between mb-6">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center font-black text-primary uppercase text-xl group-hover:scale-110 transition-transform">
                    {l.name[0]}
                  </div>
                  <div>
                    <h3 className="text-lg font-black text-foreground uppercase tracking-tight group-hover:text-primary transition-colors truncate max-w-[150px]">
                      {l.name}
                    </h3>
                    <div className="flex items-center gap-2 mt-1">
                      <div className={`px-2 py-0.5 rounded-lg border text-[8px] font-black uppercase tracking-widest w-fit ${getStatusColor(l.status)}`}>
                        {l.status}
                      </div>
                      {l.custom_values?.['Lead Priority'] && (
                        <div className={`px-2 py-0.5 rounded-lg border text-[8px] font-black uppercase tracking-widest w-fit ${getPriorityColor(l.custom_values['Lead Priority'])}`}>
                          {l.custom_values['Lead Priority']}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex flex-col gap-1 opacity-100 sm:opacity-0 group-hover:opacity-100 transition-all">
                  <button onClick={() => openEditModal(l)} className="p-2.5 rounded-xl bg-secondary border border-border hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all shadow-sm">
                    <Edit2 size={16} />
                  </button>
                  <button onClick={() => navigate(`${basePrefix}/leads/${l.id}`)} className="p-2.5 rounded-xl bg-secondary border border-border hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all shadow-sm">
                    <ExternalLink size={16} />
                  </button>
                  <button onClick={() => removeLead(l.id)} className="p-2.5 rounded-xl bg-secondary border border-border hover:bg-rose-500 hover:text-white hover:border-rose-500 transition-all shadow-sm">
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>

              <div className="space-y-4 pt-4 border-t border-border/50">
                <div className="flex items-center gap-3">
                  <Mail size={14} className="text-muted-foreground" />
                  <span className="text-[11px] font-bold text-muted-foreground truncate">{l.email || "NO_EMAIL_IDENTIFIED"}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Phone size={14} className="text-muted-foreground" />
                  <span className="text-[11px] font-black text-primary tracking-widest">{l.phone || "UNREACHABLE"}</span>
                </div>

                <div className="flex items-center justify-between pt-2">
                  <div className="flex items-center gap-2">
                    <Calendar size={12} className="text-muted-foreground opacity-50" />
                    <span className="text-[9px] font-black text-muted-foreground/50 uppercase tracking-widest">
                      {new Date(l.created_at).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="text-[9px] font-black text-muted-foreground/40 uppercase tracking-widest">
                    ID: {l.id}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {filteredLeads.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="p-20 text-center rounded-[32px] border border-border bg-card/50 backdrop-blur-sm shadow-premium"
        >
          <div className="w-16 h-16 rounded-3xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary mx-auto mb-6">
            <Users size={32} />
          </div>
          <h3 className="text-lg font-black text-foreground uppercase tracking-widest mb-2">No Leads Identified</h3>
          <p className="text-xs text-muted-foreground font-bold uppercase tracking-widest opacity-60 max-w-[300px] mx-auto leading-relaxed">
            Expand your network by initializing new lead capture protocols.
          </p>
        </motion.div>
      )}

      {/* Create/Edit Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="absolute inset-0 bg-black/80 backdrop-blur-md"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-md max-h-[90vh] overflow-y-auto custom-scrollbar bg-card border border-border rounded-[2rem] sm:rounded-[2.5rem] p-6 sm:p-10 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.6)]"
            >
              <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 blur-[100px] pointer-events-none" />

              <div className="relative z-10">
                <div className="flex items-center justify-between mb-8 sm:mb-10">
                  <div>
                    <h3 className="text-lg sm:text-xl font-black uppercase tracking-tight text-foreground">
                      {modalMode === "add" ? "Data Capture" : "Update Profile"}
                    </h3>
                    <p className="text-[9px] sm:text-[10px] text-muted-foreground font-black uppercase tracking-widest mt-1 opacity-60">
                      High-fidelity lead telemetry synchronization
                    </p>
                  </div>
                  <button
                    onClick={() => setIsModalOpen(false)}
                    className="p-2 sm:p-3 rounded-xl bg-secondary text-muted-foreground hover:text-foreground transition-all border border-border shadow-sm hover:shadow-lg active:scale-95"
                  >
                    <X size={18} className="sm:w-[20px] sm:h-[20px]" />
                  </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.25em] ml-1">Full Identity</label>
                    <input
                      required
                      type="text"
                      placeholder="Enter Lead Name"
                      className="w-full bg-input/50 focus:bg-input border border-border rounded-2xl p-4 text-xs font-bold text-foreground focus:outline-none focus:border-primary/50 transition-all placeholder:text-muted-foreground/30 uppercase tracking-widest shadow-inner"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.25em] ml-1">Channel Address (Email)</label>
                    <input
                      type="email"
                      placeholder="lead@network.com"
                      className="w-full bg-input/50 focus:bg-input border border-border rounded-2xl p-4 text-xs font-bold text-foreground focus:outline-none focus:border-primary/50 transition-all placeholder:text-muted-foreground/30 uppercase tracking-widest shadow-inner"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.25em] ml-1">Direct Link (Phone)</label>
                    <input
                      required
                      type="text"
                      placeholder="+1 (555) 000-0000"
                      className="w-full bg-input/50 focus:bg-input border border-border rounded-2xl p-4 text-xs font-bold text-foreground focus:outline-none focus:border-primary/50 transition-all placeholder:text-muted-foreground/30 uppercase tracking-widest shadow-inner"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.25em] ml-1">Lifecycle Status</label>
                    <div className="grid grid-cols-2 gap-2">
                      {['NEW', 'CONTACTED', 'QUALIFIED', 'LOST'].map(status => (
                        <button
                          key={status}
                          type="button"
                          onClick={() => setFormData({ ...formData, status })}
                          className={`py-3 rounded-xl border text-[9px] font-black uppercase tracking-widest transition-all ${formData.status === status
                            ? 'bg-primary border-primary text-primary-foreground shadow-gradient shadow-primary/20'
                            : 'bg-input/20 border-border text-muted-foreground hover:bg-input/50 hover:text-foreground'
                            }`}
                        >
                          {status}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.25em] ml-1">Priority Level</label>
                    <div className="grid grid-cols-3 gap-2">
                      {['High', 'Medium', 'Low'].map(priority => (
                        <button
                          key={priority}
                          type="button"
                          onClick={() => setFormData({
                            ...formData,
                            custom_values: { ...formData.custom_values, 'Lead Priority': priority }
                          })}
                          className={`py-3 rounded-xl border text-[9px] font-black uppercase tracking-widest transition-all ${formData.custom_values?.['Lead Priority'] === priority
                            ? 'bg-primary border-primary text-primary-foreground shadow-gradient shadow-primary/20'
                            : 'bg-input/20 border-border text-muted-foreground hover:bg-input/50 hover:text-foreground'
                            }`}
                        >
                          {priority}
                        </button>
                      ))}
                    </div>
                  </div>

                  <button
                    disabled={submitting}
                    type="submit"
                    className="w-full bg-primary text-primary-foreground py-5 rounded-2xl text-[12px] font-black uppercase tracking-[0.3em] shadow-[0_20px_40px_-10px_rgba(59,130,246,0.3)] hover:scale-[1.02] active:scale-95 transition-all mt-4 flex items-center justify-center gap-3 disabled:opacity-50"
                  >
                    {submitting ? (
                      <>
                        <Loader2 className="animate-spin" size={18} />
                        Synchronizing...
                      </>
                    ) : (
                      <>
                        <ShieldCheck size={18} />
                        {modalMode === "add" ? 'Synchronize Data' : 'Authorize Update'}
                      </>
                    )}
                  </button>
                </form>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

