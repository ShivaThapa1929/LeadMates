import React, { useEffect, useState, useMemo } from "react";
import { UserPlus, Trash2, Loader2, ShieldCheck, X, Mail, Lock, User as UserIcon, Shield, Edit3, Camera, Activity, Globe, Zap, MoreVertical } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import userService from "../../api/userService";
import { useSearch } from "../../context/SearchContext.jsx";
import { useNotifications } from "../../context/NotificationContext.jsx";

export default function UsersPage() {
  const { addNotification } = useNotifications();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState("add"); // "add" or "edit"
  const [editingUserId, setEditingUserId] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const { searchQuery } = useSearch();
  const [filterStatus, setFilterStatus] = useState("all"); // all, verified, pending

  // Derived Stats
  const stats = useMemo(() => {
    return {
      total: users.length,
      verified: users.filter(u => u.is_verified).length,
      pending: users.filter(u => !u.is_verified).length
    };
  }, [users]);

  // Form State
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "User"
  });

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const data = await userService.getUsers();
      if (data.success) {
        setUsers(data.data);
      }
    } catch (err) {
      setError(err.message || "Failed to fetch users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const filteredUsers = useMemo(() => {
    let result = users;

    // 1. Status Filter
    if (filterStatus === 'verified') {
      result = result.filter(u => u.is_verified);
    } else if (filterStatus === 'pending') {
      result = result.filter(u => !u.is_verified);
    }

    // 2. Search Filter
    if (!searchQuery) return result;
    const lower = searchQuery.toLowerCase();
    return result.filter(u =>
      u.name.toLowerCase().includes(lower) ||
      u.email.toLowerCase().includes(lower) ||
      (u.role && u.role.toLowerCase().includes(lower))
    );
  }, [users, searchQuery, filterStatus]);

  const resetForm = () => {
    setFormData({ name: "", email: "", password: "", role: "User" });
    setEditingUserId(null);
    setModalMode("add");
  };

  const openAddModal = () => {
    resetForm();
    setModalMode("add");
    setIsModalOpen(true);
  };

  const openEditModal = (user) => {
    setFormData({
      name: user.name,
      email: user.email,
      password: "", // Don't show password
      role: user.role || "User"
    });
    setEditingUserId(user.id);
    setModalMode("edit");
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      if (modalMode === "add") {
        const result = await userService.createUser(formData);
        if (result.success) {
          setUsers([...users, result.data]);
          setIsModalOpen(false);
          resetForm();
          addNotification({
            title: "Operative Enrolled",
            message: `${formData.name} has been granted system access.`,
            type: "success",
            icon: UserPlus
          });
        }
      } else {
        const result = await userService.updateUser(editingUserId, formData);
        if (result.success) {
          setUsers(users.map(u => u.id === editingUserId ? result.data : u));
          setIsModalOpen(false);
          resetForm();
          addNotification({
            title: "Node Reconfigured",
            message: `Permissions for ${formData.name} have been updated.`,
            type: "info",
            icon: Edit3
          });
        }
      }
    } catch (err) {
      alert(err.message || `Failed to ${modalMode} user`);
    } finally {
      setSubmitting(false);
    }
  };

  const handleAvatarChange = async (userId, e) => {
    const file = e.target.files?.[0];
    const userToUpdate = users.find(u => u.id === userId);
    if (!file) return;

    const formData = new FormData();
    formData.append('avatar', file);

    try {
      const response = await userService.updateUserAvatar(userId, formData);
      if (response.success) {
        setUsers(users.map(u => u.id === userId ? { ...u, avatar: response.data.avatar } : u));

        addNotification({
          title: "Photo Updated",
          message: `Biometric data updated for ${userToUpdate?.name}.`,
          type: "info",
          icon: Camera
        });

        const currentUser = JSON.parse(localStorage.getItem('user'));
        if (currentUser?.id === userId) {
          localStorage.setItem('user', JSON.stringify({ ...currentUser, avatar: response.data.avatar }));
          window.dispatchEvent(new Event('auth-update'));
        }
      }
    } catch (err) {
      alert(err.message || "Failed to update user photo");
    }
  };

  const removeUser = async (id) => {
    const userToRemove = users.find(u => u.id === id);
    if (!window.confirm("Are you sure you want to decommission this operative node?")) return;
    try {
      const data = await userService.deleteUser(id);
      if (data.success) {
        setUsers((prev) => prev.filter((u) => u.id !== id));
        addNotification({
          title: "Node Decommissioned",
          message: `${userToRemove?.name || 'An operative'} has been purged.`,
          type: "warning",
          icon: Trash2
        });
      }
    } catch (err) {
      alert(err.message || "Failed to delete user");
    }
  };

  const getRoleBadges = (roleStr) => {
    if (!roleStr) return ["USER"];
    return roleStr.split(',').map(r => r.trim().toUpperCase());
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-3 text-gray-400">
        <Loader2 className="animate-spin" size={32} />
        <p className="text-[10px] font-black uppercase tracking-widest opacity-60">Synchronizing Operative Records...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div className="flex items-center gap-5">
          <div className="p-3.5 rounded-2xl bg-primary/10 border border-primary/20 text-primary shadow-lg shadow-primary/20">
            <Zap size={24} />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-foreground tracking-tight uppercase flex items-center gap-3">
              {/* <Zap size={32} className="text-primary hidden sm:block" /> */}
              <span className="text-foreground">Operative</span> <span className="text-primary">Directory</span>
            </h1>
            <div className="flex items-center gap-2 mt-1 px-3 py-1 rounded-lg bg-primary/10 border border-primary/20 w-fit">
              <span className="w-1.5 h-1.5 bg-primary rounded-full animate-pulse shadow-[0_0_8px_rgba(37,99,235,0.4)]" />
              <span className="text-[9px] font-black text-primary uppercase tracking-widest">{users.length} Active Nodes</span>
            </div>
          </div>
        </div>
        {/* Filter Tabs */}
        <div className="flex gap-2 p-1 bg-white/5 border border-white/10 rounded-xl overflow-hidden self-start sm:self-center">
          {['all', 'verified', 'pending'].map(status => (
            <button
              key={status}
              onClick={() => setFilterStatus(status)}
              className={`px-4 py-2 text-[10px] font-black uppercase tracking-widest rounded-lg transition-all ${filterStatus === status
                ? 'bg-blue-600 text-white shadow-lg'
                : 'text-gray-500 hover:text-white hover:bg-white/5'
                }`}
            >
              {status} <span className="opacity-50 ml-1">({
                status === 'all' ? stats.total :
                  status === 'verified' ? stats.verified : stats.pending
              })</span>
            </button>
          ))}
        </div>

        <button
          onClick={openAddModal}
          className="w-full sm:w-auto flex items-center justify-center gap-3 px-6 py-3 bg-primary text-white rounded-xl text-[11px] font-black uppercase tracking-widest shadow-xl shadow-primary/20 hover:scale-[1.05] active:scale-95 transition-all cursor-pointer group"
        >
          <UserPlus size={18} className="group-hover:rotate-12 transition-transform" />
          Authorize New Operative
        </button>
      </div>

      {
        error && (
          <div className="p-5 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-[10px] font-black uppercase tracking-widest flex items-center gap-3 shadow-lg shadow-rose-500/10">
            <Activity size={16} /> {error}
          </div>
        )
      }

      {/* Grid Content */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
        <AnimatePresence mode="popLayout">
          {filteredUsers.map((u) => (
            <motion.div
              layout
              key={u.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-card border border-border rounded-[32px] p-8 relative group hover:border-primary/30 transition-all shadow-premium overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 blur-[60px] pointer-events-none group-hover:bg-primary/10 transition-all" />

              <div className="flex items-start justify-between mb-8">
                <div className="relative group/avatar cursor-pointer">
                  <input
                    type="file"
                    id={`avatar-${u.id}`}
                    className="hidden"
                    accept="image/*"
                    onChange={(e) => handleAvatarChange(u.id, e)}
                  />
                  {u.avatar ? (
                    <img
                      src={u.avatar}
                      alt={u.name}
                      className="w-16 h-16 rounded-[24px] object-cover border-2 border-border/50 shadow-inner group-hover:scale-110 transition-transform"
                    />
                  ) : (
                    <div className="w-16 h-16 rounded-[24px] bg-primary/10 border-2 border-primary/20 flex items-center justify-center text-primary text-2xl font-black shadow-inner group-hover:scale-110 transition-transform">
                      {u.name.charAt(0).toUpperCase()}
                    </div>
                  )}
                  <label
                    htmlFor={`avatar-${u.id}`}
                    className="absolute inset-0 flex items-center justify-center bg-primary/40 rounded-[24px] opacity-0 group-hover/avatar:opacity-100 transition-opacity cursor-pointer border-2 border-primary/20"
                  >
                    <Camera size={20} className="text-white drop-shadow-lg" />
                  </label>
                </div>
                <div className="flex gap-1 opacity-10 sm:opacity-0 group-hover:opacity-100 transition-all">
                  <button onClick={() => openEditModal(u)} className="p-2.5 rounded-xl bg-secondary border border-border hover:bg-indigo-500 hover:text-white hover:border-indigo-500 transition-all shadow-sm">
                    <Edit3 size={16} />
                  </button>
                  <button onClick={() => removeUser(u.id)} className="p-2.5 rounded-xl bg-secondary border border-border hover:bg-rose-500 hover:text-white hover:border-rose-500 transition-all shadow-sm">
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>

              <div className="space-y-5">
                <div>
                  <h3 className="text-xl font-black text-foreground uppercase tracking-tight group-hover:text-indigo-500 transition-colors truncate">
                    {u.name}
                  </h3>
                  <div className="flex items-center gap-2 mt-1">
                    <Mail size={12} className="text-muted-foreground opacity-50" />
                    <span className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest truncate max-w-[180px]">
                      {u.email}
                    </span>
                  </div>
                  {/* Verification Status Badge */}
                  <div className="mt-2 flex items-center gap-2">
                    <div className={`px-2 py-0.5 rounded-md border text-[8px] font-black uppercase tracking-wider ${u.is_verified
                      ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20'
                      : 'bg-amber-500/10 text-amber-500 border-amber-500/20'
                      }`}>
                      {u.is_verified ? 'Verified' : 'Pending'}
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2">
                  {getRoleBadges(u.role).map((role, idx) => (
                    <div key={idx} className="px-3 py-1.5 rounded-xl bg-primary/10 border border-primary/20 text-[9px] text-primary uppercase tracking-[0.2em] font-black shadow-sm">
                      {role}
                    </div>
                  ))}
                </div>

                <div className="flex items-center justify-between pt-5 border-t border-border/50 mt-6">
                  {(() => {
                    const isOnline = u.last_login_at && new Date() - new Date(u.last_login_at) < 5 * 60 * 1000;
                    return (
                      <div className={`px-3 py-1.5 rounded-xl border text-[9px] uppercase tracking-[0.2em] font-black flex items-center gap-2 ${isOnline
                        ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20 shadow-[0_0_12px_rgba(16,185,129,0.2)] animate-pulse'
                        : 'bg-secondary text-muted-foreground/60 border-border opacity-60'
                        }`}>
                        <div className={`w-1.5 h-1.5 rounded-full ${isOnline ? 'bg-emerald-500' : 'bg-muted-foreground/40'}`} />
                        {isOnline ? 'Active' : 'Offline'}
                      </div>
                    );
                  })()}
                  <div className="text-[10px] font-black text-muted-foreground/40 uppercase tracking-widest">
                    ID: {u.id.toString().padStart(4, '0')}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {
        filteredUsers.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="p-20 text-center rounded-[32px] border border-border bg-card/50 backdrop-blur-sm shadow-premium"
          >
            <div className="w-16 h-16 rounded-3xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-500 mx-auto mb-6">
              <UserIcon size={32} />
            </div>
            <h3 className="text-lg font-black text-foreground uppercase tracking-widest mb-2">No Operatives Detected</h3>
            <p className="text-xs text-muted-foreground font-bold uppercase tracking-widest opacity-60 max-w-[300px] mx-auto leading-relaxed">
              Authorize new operatives to expand your intelligence command network.
            </p>
          </motion.div>
        )
      }

      {/* Form Modal */}
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
              className="relative w-full max-w-md bg-card border border-border rounded-[2.5rem] p-10 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.6)] overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 blur-[100px] pointer-events-none" />

              <div className="relative z-10">
                <div className="flex items-center justify-between mb-10">
                  <div>
                    <h3 className="text-xl font-black uppercase tracking-tight text-foreground">
                      {modalMode === "add" ? "Operative Enrollment" : "Reconfigure Node"}
                    </h3>
                    <p className="text-[10px] text-muted-foreground font-black uppercase tracking-widest mt-1 opacity-60">
                      Centralized personnel authorization protocol
                    </p>
                  </div>
                  <button
                    onClick={() => setIsModalOpen(false)}
                    className="p-3 rounded-xl bg-secondary text-muted-foreground hover:text-foreground transition-all border border-border shadow-sm hover:shadow-lg active:scale-95"
                  >
                    <X size={20} />
                  </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.25em] ml-1">Operational ID (Name)</label>
                    <div className="relative">
                      <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground/50" size={16} />
                      <input
                        required
                        type="text"
                        placeholder="EX: AGENT SMITH"
                        className="w-full bg-input/50 focus:bg-input border border-border rounded-2xl py-4 pl-12 pr-4 text-xs font-bold text-foreground focus:outline-none focus:border-indigo-500/50 transition-all placeholder:text-muted-foreground/30 uppercase tracking-widest shadow-inner"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.25em] ml-1">Secure Channel (Email)</label>
                    <div className="relative">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground/50" size={16} />
                      <input
                        required
                        type="email"
                        placeholder="OPERATIVE@LEADMATES.COM"
                        className="w-full bg-input/50 focus:bg-input border border-border rounded-2xl py-4 pl-12 pr-4 text-xs font-bold text-foreground focus:outline-none focus:border-indigo-500/50 transition-all placeholder:text-muted-foreground/30 uppercase tracking-widest shadow-inner"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.25em] ml-1">
                      Encryption Key {modalMode === "edit" ? "(Bypass if unchanged)" : "(Password)"}
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground/50" size={16} />
                      <input
                        required={modalMode === "add"}
                        type="password"
                        placeholder="••••••••"
                        className="w-full bg-input/50 focus:bg-input border border-border rounded-2xl py-4 pl-12 pr-4 text-xs font-bold text-foreground focus:outline-none focus:border-indigo-500/50 transition-all placeholder:text-muted-foreground/30 shadow-inner"
                        value={formData.password}
                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.25em] ml-1">Clearance Level (Role)</label>
                    <div className="grid grid-cols-2 gap-2">
                      {['Admin', 'Manager', 'Sales', 'User'].map(role => (
                        <button
                          key={role}
                          type="button"
                          onClick={() => setFormData({ ...formData, role })}
                          className={`py-3.5 rounded-xl border text-[9px] font-black uppercase tracking-widest transition-all ${formData.role === role
                            ? 'bg-indigo-500 border-indigo-500 text-white shadow-gradient shadow-indigo-500/20'
                            : 'bg-input/20 border-border text-muted-foreground hover:bg-input/50 hover:text-foreground'
                            }`}
                        >
                          {role}
                        </button>
                      ))}
                    </div>
                  </div>

                  <button
                    disabled={submitting}
                    type="submit"
                    className="w-full bg-indigo-500 text-white py-5 rounded-2xl text-[12px] font-black uppercase tracking-[0.3em] shadow-[0_20px_40px_-10px_rgba(99,102,241,0.3)] hover:scale-[1.02] active:scale-95 transition-all mt-6 flex items-center justify-center gap-3 disabled:opacity-50"
                  >
                    {submitting ? (
                      <>
                        <Loader2 className="animate-spin" size={18} />
                        Processing...
                      </>
                    ) : (
                      <>
                        <ShieldCheck size={18} />
                        {modalMode === "add" ? 'Confirm Enrollment' : 'Authorize Update'}
                      </>
                    )}
                  </button>
                </form>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div >
  );
}


