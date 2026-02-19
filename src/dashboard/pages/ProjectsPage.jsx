import React, { useEffect, useState, useMemo } from "react";
import { Plus, Trash2, Loader2, Edit2, FolderKanban, X, Search, Activity, Clock, ShieldCheck, MoreVertical, Calendar, BarChart3 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import projectService from "../../api/projectService";
import { useSearch } from "../../context/SearchContext.jsx";
import { useNotifications } from "../../context/NotificationContext.jsx";

export default function ProjectsPage() {
  const { addNotification } = useNotifications();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState("add"); // "add" or "edit"
  const [editingId, setEditingId] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const { searchQuery } = useSearch();

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    status: "ACTIVE"
  });

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const data = await projectService.getProjects();
      if (data.success) {
        setProjects(data.data);
      }
    } catch (err) {
      setError(err.message || "Failed to fetch projects");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const filteredProjects = useMemo(() => {
    if (!searchQuery) return projects;
    const lower = searchQuery.toLowerCase();
    return projects.filter(p => p.name.toLowerCase().includes(lower));
  }, [projects, searchQuery]);

  const resetForm = () => {
    setFormData({ name: "", description: "", status: "ACTIVE" });
    setEditingId(null);
    setModalMode("add");
  };

  const openAddModal = () => {
    resetForm();
    setModalMode("add");
    setIsModalOpen(true);
  };

  const openEditModal = (project) => {
    setFormData({
      name: project.name,
      description: project.description || "",
      status: project.status || "ACTIVE"
    });
    setEditingId(project.id);
    setModalMode("edit");
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim()) return;

    try {
      setSubmitting(true);
      if (modalMode === "add") {
        const result = await projectService.createProject(formData);
        if (result.success) {
          setProjects([result.data, ...projects]);
          setIsModalOpen(false);
          resetForm();
          addNotification({
            title: "Project Initialized",
            message: `${formData.name} is now online.`,
            type: "success",
            icon: Plus
          });
        }
      } else {
        const result = await projectService.updateProject(editingId, formData);
        if (result.success) {
          setProjects(projects.map(p => p.id === editingId ? result.data : p));
          setIsModalOpen(false);
          resetForm();
          addNotification({
            title: "Project Recalibrated",
            message: `System configurations for ${formData.name} updated.`,
            type: "info",
            icon: Edit2
          });
        }
      }
    } catch (err) {
      alert(err.message || `Failed to ${modalMode} project`);
    } finally {
      setSubmitting(false);
    }
  };

  const removeProject = async (id) => {
    const projectToRemove = projects.find(p => p.id === id);
    if (!window.confirm("Are you sure you want to decommission this project node?")) return;
    try {
      const data = await projectService.deleteProject(id);
      if (data.success) {
        setProjects((prev) => prev.filter((p) => p.id !== id));
        addNotification({
          title: "Node Decommissioned",
          message: `${projectToRemove?.name || 'A project node'} has been purged.`,
          type: "warning",
          icon: Trash2
        });
      }
    } catch (err) {
      alert(err.message || "Failed to delete project");
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-3 text-gray-400">
        <Loader2 className="animate-spin" size={32} />
        <p className="text-[10px] font-black uppercase tracking-widest opacity-60">Initializing Project Context...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div className="flex items-center gap-5">
          <div className="p-3.5 rounded-2xl bg-primary/10 border border-primary/20 text-primary shadow-lg shadow-primary/20">
            <FolderKanban size={24} />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-foreground tracking-tight uppercase flex items-center gap-3">
              <span className="text-foreground">Project</span> <span className="text-primary">Repository</span>
            </h1>
            <div className="flex items-center gap-2 mt-1 px-3 py-1 rounded-lg bg-primary/10 border border-primary/20 w-fit">
              <span className="w-1.5 h-1.5 bg-primary rounded-full animate-pulse shadow-[0_0_8px_rgba(59,130,246,0.4)]" />
              <span className="text-[9px] font-black text-primary uppercase tracking-widest">{projects.length} Nodes Online</span>
            </div>
          </div>
        </div>
        <button
          onClick={openAddModal}
          className="w-full sm:w-auto flex items-center justify-center gap-3 px-6 py-3 bg-primary text-white rounded-xl text-[11px] font-black uppercase tracking-widest shadow-xl shadow-primary/20 hover:scale-[1.05] active:scale-95 transition-all cursor-pointer group"
        >
          <Plus size={18} className="group-hover:rotate-90 transition-transform" />
          Initialize New Project
        </button>
      </div>

      {error && (
        <div className="p-5 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-[10px] font-black uppercase tracking-widest flex items-center gap-3 shadow-lg shadow-rose-500/10">
          <Activity size={16} /> {error}
        </div>
      )}

      {/* Grid Content */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
        <AnimatePresence mode="popLayout">
          {filteredProjects.map((p) => (
            <motion.div
              layout
              key={p.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-card border border-border rounded-[32px] p-8 relative group hover:border-primary/30 transition-all shadow-premium overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 blur-[60px] pointer-events-none group-hover:bg-primary/10 transition-all" />

              <div className="flex items-start justify-between mb-8">
                <div className="w-12 h-12 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                  <BarChart3 size={20} />
                </div>
                <div className="flex items-center gap-1 opacity-10 sm:opacity-0 group-hover:opacity-100 transition-all">
                  <button onClick={() => openEditModal(p)} className="p-2.5 rounded-xl bg-secondary border border-border hover:bg-primary hover:text-white hover:border-primary transition-all shadow-sm">
                    <Edit2 size={16} />
                  </button>
                  <button onClick={() => removeProject(p.id)} className="p-2.5 rounded-xl bg-secondary border border-border hover:bg-rose-500 hover:text-white hover:border-rose-500 transition-all shadow-sm">
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-black text-foreground uppercase tracking-tight group-hover:text-primary transition-colors truncate">
                  {p.name}
                </h3>

                <p className="text-[11px] text-muted-foreground font-bold uppercase tracking-widest line-clamp-2 min-h-[32px] opacity-70">
                  {p.description || "No tactical description provided for this project node."}
                </p>

                <div className="flex items-center justify-between pt-4 border-t border-border/50 mt-6">
                  <div className="flex items-center gap-2">
                    <Calendar size={12} className="text-muted-foreground" />
                    <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">
                      {new Date(p.created_at).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="px-2.5 py-1 rounded-lg bg-secondary border border-border text-[9px] font-black uppercase tracking-widest text-muted-foreground">
                    Secure Node
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {filteredProjects.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="p-20 text-center rounded-[32px] border border-border bg-card/50 backdrop-blur-sm shadow-premium"
        >
          <div className="w-16 h-16 rounded-3xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary mx-auto mb-6">
            <FolderKanban size={32} />
          </div>
          <h3 className="text-lg font-black text-foreground uppercase tracking-widest mb-2">No Projects Detected</h3>
          <p className="text-xs text-muted-foreground font-bold uppercase tracking-widest opacity-60 max-w-[300px] mx-auto leading-relaxed">
            Initialize new project nodes to start managing your strategic assets.
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
              className="relative w-full max-w-md bg-card border border-border rounded-[2rem] sm:rounded-[2.5rem] p-6 sm:p-10 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.6)] overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 blur-[100px] pointer-events-none" />

              <div className="relative z-10">
                <div className="flex items-center justify-between mb-8 sm:mb-10">
                  <div>
                    <h3 className="text-lg sm:text-xl font-black uppercase tracking-tight text-foreground">
                      {modalMode === "add" ? "Initialize Project" : "Recalibrate Project"}
                    </h3>
                    <p className="text-[9px] sm:text-[10px] text-muted-foreground font-black uppercase tracking-widest mt-1 opacity-60">
                      System-wide asset initialization protocol
                    </p>
                  </div>
                  <button
                    onClick={() => setIsModalOpen(false)}
                    className="p-2 sm:p-3 rounded-xl bg-secondary text-muted-foreground hover:text-foreground transition-all border border-border shadow-sm hover:shadow-lg active:scale-95"
                  >
                    <X size={18} className="sm:w-[20px] sm:h-[20px]" />
                  </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-8">
                  <div className="space-y-3">
                    <label className="text-[11px] font-black text-muted-foreground uppercase tracking-[0.2em] ml-1">Project Identifier</label>
                    <input
                      required
                      type="text"
                      placeholder="Ex: Strategic Lead Acquisition Q4"
                      className="w-full bg-input/50 focus:bg-input border border-border rounded-2xl p-4.5 text-xs font-bold text-foreground focus:outline-none focus:border-primary/50 transition-all placeholder:text-muted-foreground/30 uppercase tracking-widest shadow-inner"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    />
                  </div>

                  <div className="space-y-3">
                    <label className="text-[11px] font-black text-muted-foreground uppercase tracking-[0.2em] ml-1">Tactical Description</label>
                    <textarea
                      placeholder="Enter project scope and objectives..."
                      className="w-full bg-input/50 focus:bg-input border border-border rounded-2xl p-4.5 text-xs font-bold text-foreground focus:outline-none focus:border-primary/50 transition-all placeholder:text-muted-foreground/30 uppercase tracking-widest shadow-inner min-h-[120px] resize-none"
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    />
                  </div>

                  <button
                    disabled={submitting}
                    type="submit"
                    className="w-full bg-primary text-white py-5 rounded-2xl text-[12px] font-black uppercase tracking-[0.3em] shadow-[0_20px_40px_-10px_rgba(16,185,129,0.3)] hover:scale-[1.02] active:scale-95 transition-all mt-6 flex items-center justify-center gap-3 disabled:opacity-50"
                  >
                    {submitting ? (
                      <>
                        <Loader2 className="animate-spin" size={18} />
                        Processing...
                      </>
                    ) : (
                      <>
                        <ShieldCheck size={18} />
                        {modalMode === "add" ? 'Confirm Initialization' : 'Authorize Changes'}
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

