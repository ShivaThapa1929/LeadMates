
import React, { useEffect, useState } from "react";
import { ShieldCheck, Loader2, Plus, Edit3, X, Save, Lock, Info } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import roleService from "../../api/roleService";

const MODULES = ['Dashboard', 'Users', 'Leads', 'Campaigns', 'Reports', 'Settings', 'Billing', 'Roles', 'Integrations', 'Logs'];
const ACTIONS = ['View', 'Create', 'Edit', 'Delete', 'Approve', 'Export'];

export default function RolesPage() {
    const [roles, setRoles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [user, setUser] = useState(() => {
        try {
            const raw = localStorage.getItem("user");
            return raw ? JSON.parse(raw) : {};
        } catch {
            return {};
        }
    });

    // UI State
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalMode, setModalMode] = useState("add"); // "add" or "edit"
    const [editingRoleId, setEditingRoleId] = useState(null);
    const [submitting, setSubmitting] = useState(false);

    // Form State
    const [formData, setFormData] = useState({
        name: "",
        description: "",
        status: "active",
        permissions: {}
    });

    const fetchRoles = async () => {
        try {
            setLoading(true);
            const data = await roleService.getRoles();
            if (data.success) {
                setRoles(data.data);
            }
        } catch (err) {
            setError(err.message || "Failed to fetch roles");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchRoles();
    }, []);

    const resetForm = () => {
        setFormData({ name: "", description: "", status: "active", permissions: {} });
        setEditingRoleId(null);
        setModalMode("add");
    };

    const openAddModal = () => {
        resetForm();
        setModalMode("add");
        // Initialize permissions with false
        const initialPerms = {};
        MODULES.forEach(m => {
            initialPerms[m.toLowerCase()] = {};
            ACTIONS.forEach(a => initialPerms[m.toLowerCase()][a.toLowerCase()] = false);
        });
        setFormData(prev => ({ ...prev, permissions: initialPerms }));
        setIsModalOpen(true);
    };

    const openEditModal = (role) => {
        // Parse permissions if string
        let perms = role.permissions;
        if (typeof perms === 'string') {
            try { perms = JSON.parse(perms); } catch { perms = {}; }
        }

        // Ensure structure matches
        const structuredPerms = {};
        MODULES.forEach(m => {
            const mKey = m.toLowerCase();
            structuredPerms[mKey] = {};
            ACTIONS.forEach(a => {
                const aKey = a.toLowerCase();
                structuredPerms[mKey][aKey] = perms[mKey]?.[aKey] || false;
            });
        });

        setFormData({
            name: role.name,
            description: role.description || "",
            status: role.status || "active",
            permissions: structuredPerms
        });
        setEditingRoleId(role.id);
        setModalMode("edit");
        setIsModalOpen(true);
    };

    const handlePermissionChange = (module, action, value) => {
        setFormData(prev => ({
            ...prev,
            permissions: {
                ...prev.permissions,
                [module]: {
                    ...prev.permissions[module],
                    [action]: value
                }
            }
        }));
    };

    const toggleAllModule = (module, value) => {
        setFormData(prev => {
            const newModulePerms = {};
            ACTIONS.forEach(a => newModulePerms[a.toLowerCase()] = value);
            return {
                ...prev,
                permissions: {
                    ...prev.permissions,
                    [module]: newModulePerms
                }
            };
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            setSubmitting(true);
            if (modalMode === "add") {
                const result = await roleService.createRole(formData);
                if (result.success) {
                    // Refresh completely to get ID etc
                    fetchRoles();
                    setIsModalOpen(false);
                    resetForm();
                }
            } else {
                const result = await roleService.updateRole(editingRoleId, formData);
                if (result.success) {
                    fetchRoles();
                    setIsModalOpen(false);
                    resetForm();
                }
            }
        } catch (err) {
            alert(err.message || `Failed to ${modalMode} role`);
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[400px] gap-3 text-gray-400">
                <Loader2 className="animate-spin" size={32} />
                <p className="text-sm">Loading roles & protocols...</p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                <div>
                    <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-foreground tracking-tight uppercase flex items-center gap-3">
                        <ShieldCheck size={32} className="text-primary hidden sm:block" />
                        <span className="text-foreground">Access</span> <span className="text-primary">Control</span>
                    </h1>
                    <p className="text-[9px] sm:text-[10px] font-black text-muted-foreground uppercase tracking-[0.3em] mt-1 ml-1 opacity-60">Manage roles and security clearance</p>
                </div>
                {user?.roles?.includes('Super Admin') && (
                    <button
                        onClick={openAddModal}
                        className="w-full sm:w-auto flex items-center justify-center gap-3 px-6 py-3 rounded-xl bg-primary text-white text-[11px] font-black uppercase tracking-widest shadow-xl shadow-primary/20 hover:scale-[1.05] active:scale-95 transition-all cursor-pointer group"
                    >
                        <Plus size={16} className="group-hover:rotate-90 transition-transform" />
                        New Role
                    </button>
                )}
            </div>

            {error && (
                <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs font-bold flex items-center gap-2">
                    <Info size={14} /> {error}
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {roles.map((role) => (
                    <motion.div
                        key={role.id}
                        layout
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="group relative rounded-3xl border border-border bg-card hover:bg-muted/30 p-6 transition-all duration-500 shadow-sm hover:shadow-lg"
                    >
                        <div className="flex items-start justify-between">
                            <div className="flex items-center gap-4">
                                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-xl font-black shadow-inner border border-white/5 ${role.name === 'Super Admin' ? 'bg-amber-500/10 text-amber-500' : 'bg-primary/10 text-primary'
                                    }`}>
                                    <ShieldCheck size={28} />
                                </div>
                                <div>
                                    <div className="text-sm font-black flex items-center gap-2 uppercase tracking-wide">
                                        {role.name}
                                        {role.name === 'Super Admin' && <Lock size={12} className="text-amber-500" />}
                                    </div>
                                    <div className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest opacity-60 mt-1 line-clamp-1">
                                        {role.description || 'No description'}
                                    </div>
                                    <div className="mt-3 flex items-center gap-2">
                                        <div className={`px-2.5 py-1 rounded-lg text-[9px] uppercase tracking-[0.2em] font-black border ${role.status === 'inactive' ? 'bg-rose-500/10 text-primary border-rose-500/20' : 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20'
                                            }`}>
                                            {role.status || 'Active'}
                                        </div>
                                    </div>
                                </div>
                            </div>
                            {user?.roles?.includes('Super Admin') && role.name !== 'Super Admin' && (
                                <button
                                    onClick={() => openEditModal(role)}
                                    className="text-primary hover:bg-primary/10 opacity-0 group-hover:opacity-100 transition-all duration-300"
                                >
                                    <Edit3 size={16} />
                                </button>
                            )}
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Role Modal */}
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
                            className="relative w-full max-w-5xl max-h-[90vh] overflow-hidden flex flex-col bg-card border border-border rounded-[2.5rem] shadow-[0_32px_64px_-16px_rgba(0,0,0,0.6)]"
                        >
                            <div className="p-8 border-b border-border flex items-center justify-between shrink-0">
                                <div>
                                    <h3 className="text-xl font-black italic uppercase tracking-tighter text-foreground">
                                        {modalMode === "add" ? "Define New Protocol" : "Modify Clearance"}
                                    </h3>
                                    <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest mt-1 opacity-60">
                                        {modalMode === "add" ? "Create a new access level" : "Update permission matrix"}
                                    </p>
                                </div>
                                <button
                                    onClick={() => setIsModalOpen(false)}
                                    className="p-2 text-muted-foreground hover:text-foreground transition-colors"
                                >
                                    <X size={20} />
                                </button>
                            </div>

                            <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
                                <form id="roleForm" onSubmit={handleSubmit} className="space-y-8">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-1.5">
                                            <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest ml-1">Role Name</label>
                                            <input
                                                required
                                                type="text"
                                                placeholder="e.g. Sales Manager"
                                                className="w-full bg-input/50 focus:bg-input border border-border rounded-2xl py-3.5 px-4 text-xs font-bold text-foreground focus:outline-none focus:border-primary/50 transition-all placeholder:text-muted-foreground/50"
                                                value={formData.name}
                                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                            />
                                        </div>
                                        <div className="space-y-1.5">
                                            <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest ml-1">Description</label>
                                            <input
                                                type="text"
                                                placeholder="Brief description of responsibilities"
                                                className="w-full bg-input/50 focus:bg-input border border-border rounded-2xl py-3.5 px-4 text-xs font-bold text-foreground focus:outline-none focus:border-primary/50 transition-all placeholder:text-muted-foreground/50"
                                                value={formData.description}
                                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                            />
                                        </div>
                                        <div className="space-y-1.5">
                                            <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest ml-1">Status</label>
                                            <div className="flex items-center gap-2">
                                                {['active', 'inactive'].map(status => (
                                                    <button
                                                        key={status}
                                                        type="button"
                                                        onClick={() => setFormData({ ...formData, status })}
                                                        className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest border transition-all ${formData.status === status
                                                            ? 'bg-primary border-primary text-primary-foreground'
                                                            : 'bg-transparent border-border text-muted-foreground hover:bg-input/50'
                                                            }`}
                                                    >
                                                        {status}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest ml-1">Permission Matrix</label>
                                        <div className="border border-border rounded-2xl overflow-hidden bg-card/50">
                                            <div className="overflow-x-auto custom-scrollbar">
                                                <div className="min-w-[800px]">
                                                    <div className="grid grid-cols-[150px_repeat(6,1fr)] sm:grid-cols-[200px_repeat(6,1fr)] bg-muted/30 border-b border-border">
                                                        <div className="p-4 text-[9px] sm:text-[10px] font-black uppercase tracking-widest text-muted-foreground">Module</div>
                                                        {ACTIONS.map(action => (
                                                            <div key={action} className="p-4 text-[9px] sm:text-[10px] font-black uppercase tracking-widest text-center text-muted-foreground border-l border-border">
                                                                {action}
                                                            </div>
                                                        ))}
                                                    </div>
                                                    {MODULES.map(module => {
                                                        const mKey = module.toLowerCase();
                                                        const allChecked = ACTIONS.every(a => formData.permissions[mKey]?.[a.toLowerCase()]);

                                                        return (
                                                            <div key={module} className="grid grid-cols-[150px_repeat(6,1fr)] sm:grid-cols-[200px_repeat(6,1fr)] border-b border-border last:border-0 hover:bg-muted/20 transition-colors">
                                                                <div className="p-4 flex items-center gap-2">
                                                                    <div className="relative flex items-center justify-center">
                                                                        <input
                                                                            type="checkbox"
                                                                            className="peer appearance-none w-4 h-4 rounded-md border border-input bg-input/20 checked:bg-primary checked:border-primary transition-all cursor-pointer"
                                                                            checked={allChecked}
                                                                            onChange={(e) => toggleAllModule(mKey, e.target.checked)}
                                                                        />
                                                                        <svg className="w-2.5 h-2.5 pointer-events-none absolute text-black opacity-0 peer-checked:opacity-100 transition-opacity" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="4">
                                                                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                                                        </svg>
                                                                    </div>
                                                                    <span className="text-xs font-black uppercase tracking-wider text-foreground">{module}</span>
                                                                </div>
                                                                {ACTIONS.map(action => {
                                                                    const aKey = action.toLowerCase();
                                                                    const checked = formData.permissions[mKey]?.[aKey] || false;
                                                                    return (
                                                                        <div key={action} className="p-4 flex justify-center border-l border-border">
                                                                            <div className="relative flex items-center justify-center">
                                                                                <input
                                                                                    type="checkbox"
                                                                                    className="peer appearance-none w-5 h-5 rounded-md border border-input bg-input/20 checked:bg-emerald-500 checked:border-emerald-500 transition-all cursor-pointer"
                                                                                    checked={checked}
                                                                                    onChange={(e) => handlePermissionChange(mKey, aKey, e.target.checked)}
                                                                                />
                                                                                <svg className="w-3.5 h-3.5 pointer-events-none absolute text-white opacity-0 peer-checked:opacity-100 transition-opacity" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="4">
                                                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                                                                </svg>
                                                                            </div>
                                                                        </div>
                                                                    );
                                                                })}
                                                            </div>
                                                        );
                                                    })}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </form>
                            </div>

                            <div className="p-6 border-t border-border bg-card shrink-0">
                                <button
                                    form="roleForm"
                                    disabled={submitting}
                                    type="submit"
                                    className="w-full bg-primary text-primary-foreground py-4 rounded-2xl text-xs font-black uppercase tracking-[0.2em] shadow-2xl shadow-primary/30 hover:scale-[1.01] active:scale-95 transition-all disabled:opacity-50"
                                >
                                    {submitting ? <Loader2 className="animate-spin inline mr-2" /> : <Save className="inline mr-2 w-4 h-4" />}
                                    {modalMode === "add" ? 'Create Protocol' : 'Save Changes'}
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}
