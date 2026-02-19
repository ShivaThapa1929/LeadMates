import React, { useEffect, useState, useMemo } from "react";
import { Plus, Trash2, Loader2, Edit2, Megaphone, X, Activity, Clock, ShieldCheck, Calendar, Download, FileText, CheckCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import campaignService from "../../api/campaignService";
import { useSearch } from "../../context/SearchContext.jsx";
import { useNotifications } from "../../context/NotificationContext.jsx";

export default function CampaignsPage() {
  const navigate = useNavigate();
  const { addNotification } = useNotifications();
  const { searchQuery } = useSearch();

  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    status: "ACTIVE"
  });

  const fetchCampaigns = async () => {
    try {
      setLoading(true);
      const data = await campaignService.getCampaigns();
      if (data.success) {
        setCampaigns(data.data);
      }
    } catch (err) {
      setError(err.message || "Failed to fetch campaigns");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCampaigns();
  }, []);

  const filteredCampaigns = useMemo(() => {
    if (!searchQuery) return campaigns;
    const lower = searchQuery.toLowerCase();
    return campaigns.filter(c => c.name.toLowerCase().includes(lower));
  }, [campaigns, searchQuery]);

  const openEditModal = (campaign) => {
    setFormData({
      name: campaign.name,
      status: campaign.status || "ACTIVE"
    });
    setEditingId(campaign.id);
    setIsModalOpen(true);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!formData.name.trim()) return;

    try {
      setSubmitting(true);
      const result = await campaignService.updateCampaign(editingId, formData);
      if (result.success) {
        setCampaigns(campaigns.map(c => c.id === editingId ? result.data : c));
        setIsModalOpen(false);
        addNotification({
          title: "Channel Configured",
          message: `Operational parameters for ${formData.name} updated.`,
          type: "info",
          icon: Edit2
        });
      }
    } catch (err) {
      addNotification({
        title: "Configuration Error",
        message: err.message || "Failed to update campaign",
        type: "error"
      });
    } finally {
      setSubmitting(false);
    }
  };

  const removeCampaign = async (id) => {
    const campaignToRemove = campaigns.find(c => c.id === id);
    if (!window.confirm("Are you sure you want to terminate this campaign node?")) return;
    try {
      const data = await campaignService.deleteCampaign(id);
      if (data.success) {
        setCampaigns((prev) => prev.filter((c) => c.id !== id));
        addNotification({
          title: "Channel Terminated",
          message: `${campaignToRemove?.name || 'A campaign channel'} has been deactivated.`,
          type: "warning",
          icon: Trash2
        });
      }
    } catch (err) {
      addNotification({ title: "System Error", message: "Failed to delete campaign", type: "error" });
    }
  };

  const handleDownloadPDF = (campaign) => {
    const printWindow = window.open('', '_blank');
    const timestamp = new Date().toLocaleString();

    const content = `
        <!DOCTYPE html>
        <html>
        <head>
            <title>Campaign Manifest - ${campaign.name}</title>
            <style>
                body { font-family: 'Inter', sans-serif; background: #0f172a; color: #f8fafc; padding: 40px; }
                .header { border-bottom: 2px solid #8b5cf6; padding-bottom: 20px; margin-bottom: 30px; }
                .title { font-size: 24px; font-weight: 800; text-transform: uppercase; letter-spacing: 2px; }
                .meta { color: #94a3b8; font-size: 10px; text-transform: uppercase; margin-top: 5px; }
                .section { margin-bottom: 30px; }
                .section-title { font-size: 12px; font-weight: 900; color: #8b5cf6; text-transform: uppercase; margin-bottom: 15px; border-left: 4px solid #8b5cf6; padding-left: 10px; }
                .field { background: #1e293b; padding: 15px; border-radius: 12px; border: 1px solid #334155; margin-bottom: 10px; }
                .label { font-size: 9px; color: #64748b; text-transform: uppercase; font-weight: 900; margin-bottom: 5px; }
                .value { font-size: 14px; font-weight: 700; }
                @media print {
                    body { background: white; color: black; padding: 20px; }
                    .field { border: 1px solid #e2e8f0; background: #f8fafc; color: black; }
                    .label { color: #64748b; }
                    .value { color: black; }
                }
            </style>
        </head>
        <body>
            <div class="header">
                <div class="title">Campaign Strategic Manifest</div>
                <div class="meta">Network node status: AUTHENTICATED | ${timestamp}</div>
            </div>
            
            <div class="section">
                <div class="section-title">Operational Identity</div>
                <div class="field"><div class="label">Campaign Name</div><div class="value">${campaign.name}</div></div>
                <div class="field"><div class="label">Deployment Status</div><div class="value">${campaign.status}</div></div>
                <div class="field"><div class="label">System ID</div><div class="value">#${campaign.id}</div></div>
            </div>

            <div class="section">
                <div class="section-title">Timeline Intelligence</div>
                <div class="field"><div class="label">Creation Date</div><div class="value">${new Date(campaign.created_at).toLocaleString()}</div></div>
            </div>

            <script>
                window.onload = () => { window.print(); setTimeout(() => window.close(), 500); }
            </script>
        </body>
        </html>
    `;

    printWindow.document.write(content);
    printWindow.document.close();
  };

  const exportCSV = () => {
    const dataToExport = filteredCampaigns.length ? filteredCampaigns : campaigns;
    if (!dataToExport.length) return;
    const headers = ["ID,Name,Status,Created At"];
    const rows = dataToExport.map(c =>
      [c.id, `"${c.name.replace(/"/g, '""')}"`, c.status, c.created_at].join(",")
    );
    const csvContent = "data:text/csv;charset=utf-8," + [headers, ...rows].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `campaigns_export_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'ACTIVE': return 'text-primary bg-primary/10 border-primary/20 shadow-primary/20';
      case 'PAUSED': return 'text-amber-500 bg-amber-500/10 border-amber-500/20 shadow-primary/30';
      case 'COMPLETED': return 'text-blue-500 bg-blue-500/10 border-blue-500/20 shadow-primary/20';
      default: return 'text-muted-foreground bg-muted/10 border-muted/20';
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-3 text-gray-400">
        <Loader2 className="animate-spin" size={32} />
        <p className="text-[10px] font-black uppercase tracking-widest opacity-60">Scanning Neural Channels...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div className="flex items-center gap-5">
          <div className="p-3.5 rounded-2xl bg-primary/10 border border-primary/20 text-primary shadow-lg shadow-primary/10">
            <Megaphone size={24} />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-foreground tracking-tight uppercase flex items-center gap-3">
              <span className="text-foreground">Campaign</span> <span className="text-primary">Node Sync</span>
            </h1>
            <div className="flex items-center gap-2 mt-1 px-3 py-1 rounded-lg bg-primary/10 border border-primary/20 w-fit">
              <span className="w-1.5 h-1.5 bg-primary rounded-full animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.4)]" />
              <span className="text-[9px] font-black text-primary uppercase tracking-widest">{campaigns.length} Active Channels</span>
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
            onClick={() => navigate('../deploy-campaign')}
            className="flex-[2] sm:flex-none flex items-center justify-center gap-3 px-6 py-4 sm:py-3 bg-primary text-white rounded-xl text-[11px] font-black uppercase tracking-widest shadow-xl shadow-primary/20 hover:scale-[1.05] active:scale-95 transition-all cursor-pointer group"
          >
            <Plus size={18} className="group-hover:rotate-90 transition-transform" />
            Deploy New Campaign
          </button>
        </div>
      </div>

      {error && (
        <div className="p-5 rounded-2xl bg-primary/10 border border-primary/20 text-primary text-[10px] font-black uppercase tracking-widest flex items-center gap-3 shadow-lg shadow-primary/20">
          <Activity size={16} /> {error}
        </div>
      )}

      {/* Grid Content */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
        <AnimatePresence mode="popLayout">
          {filteredCampaigns.map((c) => (
            <motion.div
              layout
              key={c.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-card border border-border rounded-[32px] p-8 relative group hover:border-primary/30 transition-all shadow-premium overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 blur-[60px] pointer-events-none group-hover:bg-primary/10 transition-all" />

              <div className="flex items-start justify-between mb-8">
                <div className={`px-3 py-1.5 rounded-xl border text-[9px] font-black uppercase tracking-widest shadow-sm ${getStatusColor(c.status)}`}>
                  {c.status}
                </div>
                <div className="flex items-center gap-1 opacity-100 sm:opacity-0 group-hover:opacity-100 transition-all">
                  <button onClick={() => handleDownloadPDF(c)} className="p-2.5 rounded-xl bg-secondary border border-border hover:bg-primary hover:text-white hover:border-primary transition-all shadow-sm">
                    <FileText size={16} />
                  </button>
                  <button onClick={() => openEditModal(c)} className="p-2.5 rounded-xl bg-secondary border border-border hover:bg-primary hover:text-white hover:border-primary transition-all shadow-sm">
                    <Edit2 size={16} />
                  </button>
                  <button onClick={() => removeCampaign(c.id)} className="p-2.5 rounded-xl bg-secondary border border-border hover:bg-rose-500 hover:text-white hover:border-rose-500 transition-all shadow-sm">
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-black text-foreground uppercase tracking-tight group-hover:text-primary transition-colors truncate">
                  {c.name}
                </h3>

                <div className="flex items-center gap-5 pt-4 border-t border-border/50">
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 rounded-lg bg-secondary text-muted-foreground group-hover:text-primary transition-colors">
                      <Calendar size={14} />
                    </div>
                    <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">
                      {new Date(c.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 rounded-lg bg-secondary text-muted-foreground group-hover:text-primary transition-colors">
                      <Clock size={14} />
                    </div>
                    <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">
                      {new Date(c.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {filteredCampaigns.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="p-20 text-center rounded-[32px] border border-border bg-card/50 backdrop-blur-sm shadow-premium"
        >
          <div className="w-16 h-16 rounded-3xl bg-primary/10 border border-primary/20 shadow-primary/20 flex items-center justify-center text-primary mx-auto mb-6">
            <Megaphone size={32} />
          </div>
          <h3 className="text-lg font-black text-foreground uppercase tracking-widest mb-2">No Neural Nodes Found</h3>
          <p className="text-xs text-muted-foreground font-bold uppercase tracking-widest opacity-60 max-w-[300px] mx-auto leading-relaxed">
            Initialize new data channels to start tracking campaign activity.
          </p>
        </motion.div>
      )}

      {/* Edit Modal */}
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
                      Configure Channel
                    </h3>
                    <p className="text-[9px] sm:text-[10px] text-muted-foreground font-black uppercase tracking-widest mt-1 opacity-60">
                      Recalibrate campaign parameters
                    </p>
                  </div>
                  <button
                    onClick={() => setIsModalOpen(false)}
                    className="p-2 sm:p-3 rounded-xl bg-secondary text-muted-foreground hover:text-foreground transition-all border border-border shadow-sm hover:shadow-lg active:scale-95"
                  >
                    <X size={18} className="sm:w-[20px] sm:h-[20px]" />
                  </button>
                </div>

                <form onSubmit={handleUpdate} className="space-y-8">
                  <div className="space-y-3">
                    <label className="text-[11px] font-black text-muted-foreground uppercase tracking-[0.2em] ml-1">Campaign Title</label>
                    <div className="relative">
                      <Activity className="absolute left-5 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors" size={18} />
                      <input
                        required
                        type="text"
                        placeholder="Ex: Meta Lead Generation 2024"
                        className="w-full bg-input/50 focus:bg-input border border-border rounded-2xl py-4.5 pl-14 pr-6 text-xs font-bold text-foreground focus:outline-none focus:border-primary/50 transition-all placeholder:text-muted-foreground/30 uppercase tracking-widest shadow-inner"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="space-y-3">
                    <label className="text-[11px] font-black text-muted-foreground uppercase tracking-[0.2em] ml-1">Deployment Status</label>
                    <div className="grid grid-cols-3 gap-3">
                      {['ACTIVE', 'PAUSED', 'COMPLETED'].map(status => (
                        <button
                          key={status}
                          type="button"
                          onClick={() => setFormData({ ...formData, status })}
                          className={`py-3.5 rounded-xl border text-[10px] font-black uppercase tracking-widest transition-all ${formData.status === status
                            ? 'bg-primary border-violet-500 text-white shadow-gradient shadow-primary/20'
                            : 'bg-input/20 border-border text-muted-foreground hover:bg-input/50 hover:text-foreground'
                            }`}
                        >
                          {status}
                        </button>
                      ))}
                    </div>
                  </div>

                  <button
                    disabled={submitting}
                    type="submit"
                    className="w-full bg-primary text-white py-5 rounded-2xl text-[12px] font-black uppercase tracking-[0.3em] shadow-[0_20px_40px_-10px_rgba(139,92,246,0.3)] hover:scale-[1.02] active:scale-95 transition-all mt-6 disabled:opacity-50 disabled:scale-100 flex items-center justify-center gap-3"
                  >
                    {submitting ? (
                      <>
                        <Loader2 className="animate-spin" size={18} />
                        Synchronizing...
                      </>
                    ) : (
                      <>
                        <ShieldCheck size={18} />
                        Confirm Changes
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
