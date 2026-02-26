import React, { useState, useEffect } from "react";
import {
    Plus, Megaphone, ChevronRight,
    Sparkles, Shield, AlertCircle, CheckCircle,
    Loader2, X, Download, FileText, Activity
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import customFieldApi from "../../api/customFieldApi";
import campaignService from "../../api/campaignService";
import DynamicField from "../components/DynamicField";
import { useNotifications } from "../../context/NotificationContext.jsx";
import { useNavigate } from "react-router-dom";

const DeployCampaign = () => {
    const navigate = useNavigate();
    const { addNotification } = useNotifications();
    const [formData, setFormData] = useState({
        name: "",
        status: "ACTIVE",
        custom_values: {}
    });
    const [customFields, setCustomFields] = useState([]);
    const [loading, setLoading] = useState(false);
    const [fetchingFields, setFetchingFields] = useState(true);
    const [errors, setErrors] = useState({});
    const [isAddFieldModalOpen, setIsAddFieldModalOpen] = useState(false);
    const [newField, setNewField] = useState({ field_name: "", field_type: "text", options: [] });
    const [lastDeployedCampaign, setLastDeployedCampaign] = useState(null);

    const loadFields = async () => {
        try {
            setFetchingFields(true);
            const response = await customFieldApi.getCustomFields();
            if (response.success) {
                // For campaigns, we might want different fields? 
                // But for now, using the global custom fields as requested ("same things")
                setCustomFields(response.data);
            }
        } catch (err) {
            console.error("Failed to load custom fields:", err);
        } finally {
            setFetchingFields(false);
        }
    };

    useEffect(() => {
        loadFields();
    }, []);

    const validateForm = () => {
        const newErrors = {};
        if (!formData.name.trim()) newErrors.name = "CAMPAIGN TITLE IS REQUIRED";
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleInputChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        if (errors[field]) {
            setErrors(prev => {
                const updated = { ...prev };
                delete updated[field];
                return updated;
            });
        }
    };

    const handleCustomValueChange = (fieldName, value) => {
        setFormData(prev => ({
            ...prev,
            custom_values: {
                ...prev.custom_values,
                [fieldName]: value
            }
        }));
    };

    const handleAddField = async (e) => {
        e.preventDefault();
        if (!newField.field_name.trim()) return;

        try {
            const response = await customFieldApi.createCustomField(newField);
            if (response.success) {
                addNotification({
                    title: "Field Added",
                    message: "The new custom field has been successfully added.",
                    type: "success",
                    icon: Shield
                });
                setIsAddFieldModalOpen(false);
                setNewField({ field_name: "", field_type: "text", options: [] });
                loadFields();
            }
        } catch (err) {
            addNotification({
                title: "Error",
                message: "Failed to add the custom field.",
                type: "error"
            });
        }
    };

    const handleDownloadPDF = (data = formData) => {
        const printWindow = window.open('', '_blank');
        const timestamp = new Date().toLocaleString();

        const content = `
            <!DOCTYPE html>
            <html>
            <head>
                <title>Campaign Manifest - ${data.name}</title>
                <style>
                    body { font-family: 'Inter', sans-serif; background: #0f172a; color: #f8fafc; padding: 40px; }
                    .header { border-bottom: 2px solid #8b5cf6; padding-bottom: 20px; margin-bottom: 30px; }
                    .title { font-size: 24px; font-weight: 800; text-transform: uppercase; letter-spacing: 2px; }
                    .meta { color: #94a3b8; font-size: 10px; text-transform: uppercase; margin-top: 5px; }
                    .section { margin-bottom: 30px; }
                    .section-title { font-size: 12px; font-weight: 900; color: #8b5cf6; text-transform: uppercase; margin-bottom: 15px; border-left: 4px solid #8b5cf6; padding-left: 10px; }
                    .grid { display: grid; grid-template-cols: 1fr 1fr; gap: 20px; }
                    .field { background: #1e293b; padding: 15px; border-radius: 12px; border: 1px solid #334155; }
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
                    <div class="grid">
                        <div class="field"><div class="label">Campaign Name</div><div class="value">${data.name || 'N/A'}</div></div>
                        <div class="field"><div class="label">Deployment Status</div><div class="value">${data.status || 'N/A'}</div></div>
                    </div>
                </div>

                <div class="section">
                    <div class="section-title">Enhanced Parameters</div>
                    <div class="grid">
                        ${customFields.map(f => `
                            <div class="field">
                                <div class="label">${f.field_name}</div>
                                <div class="value">${data.custom_values[f.field_name] || 'NOT DEFINED'}</div>
                            </div>
                        `).join('')}
                    </div>
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

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        setLoading(true);
        try {
            const response = await campaignService.createCampaign(formData);
            if (response.success) {
                setLastDeployedCampaign({ ...formData });
                addNotification({
                    title: "Campaign Created",
                    message: "The campaign has been successfully created.",
                    type: "success",
                    icon: CheckCircle
                });
                // Reset form
                setFormData({
                    name: "",
                    status: "ACTIVE",
                    custom_values: {}
                });
            } else {
                addNotification({
                    title: "Creation Error",
                    message: response.message || "Something went wrong while creating the campaign.",
                    type: "error",
                    icon: AlertCircle
                });
            }
        } catch (err) {
            addNotification({
                title: "Error",
                message: err.message || "An unexpected error occurred during campaign creation.",
                type: "error",
                icon: AlertCircle
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-5xl mx-auto space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Header Section */}
            <div className="flex flex-col sm:flex-row sm:items-start lg:items-center justify-between gap-6">
                <div className="flex items-center gap-4 sm:gap-5">
                    <button
                        onClick={() => navigate(-1)}
                        className="p-3 rounded-2xl bg-secondary border border-border text-muted-foreground hover:text-white transition-all mb-1 shrink-0"
                    >
                        <ChevronRight size={24} className="rotate-180" />
                    </button>
                    <div>
                        <h1 className="text-3xl md:text-4xl lg:text-5xl font-black text-white tracking-tighter uppercase flex items-center gap-3 sm:gap-4">
                            <Megaphone size={32} className="text-primary lg:w-10 lg:h-10 shrink-0" />
                            <span>Campaign <span className="text-primary">Deployment</span></span>
                        </h1>
                        <p className="text-[11px] font-black text-muted-foreground uppercase tracking-[0.4em] mt-3 ml-1 leading-relaxed">
                            Strategic node initialization for marketing channels
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-3 bg-card border border-border px-5 py-3 rounded-2xl w-fit">
                    <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                    <span className="text-[10px] font-black text-foreground uppercase tracking-widest">Network Synchronized</span>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                {/* Left Side: Context */}
                <div className="lg:col-span-4 space-y-6">
                    <div className="bg-card border border-border rounded-[32px] p-8 shadow-premium">
                        <h3 className="text-[12px] font-black text-white uppercase tracking-widest mb-6 flex items-center gap-2">
                            <Sparkles size={16} className="text-primary" /> Strategy Protocol
                        </h3>
                        <ul className="space-y-4">
                            {[
                                "Define clear campaign objectives",
                                "Configure tactical status parameters",
                                "Initialize dynamic intelligence fields",
                                "Verify network node availability"
                            ].map((rule, idx) => (
                                <li key={idx} className="flex gap-3 text-[11px] font-bold text-muted-foreground">
                                    <ChevronRight size={14} className="text-primary shrink-0 mt-0.5" />
                                    {rule.toUpperCase()}
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className="bg-primary/5 border border-primary/10 rounded-[32px] p-8">
                        <h3 className="text-[12px] font-black text-primary uppercase tracking-widest mb-4">Command Advisory</h3>
                        <p className="text-[10px] font-medium text-muted-foreground leading-relaxed">
                            Deployed nodes will begin broadcasting immediately across all selected sub-channels.
                        </p>
                    </div>
                </div>

                {/* Right Side: Deployment Form */}
                <div className="lg:col-span-8">
                    <form onSubmit={handleSubmit} className="bg-card border border-border rounded-[40px] p-10 shadow-premium relative overflow-hidden group">
                        {/* Background Accents */}
                        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 blur-[100px] pointer-events-none" />
                        <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-500/5 blur-[100px] pointer-events-none" />

                        <div className="relative z-10 space-y-8">
                            <AnimatePresence>
                                {lastDeployedCampaign && (
                                    <motion.div
                                        initial={{ opacity: 0, scale: 0.95 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 0.95 }}
                                        className="absolute inset-0 z-50 bg-background/80 backdrop-blur-xl flex flex-col items-center justify-center p-10 text-center rounded-[40px] border-4 border-primary/20"
                                    >
                                        <div className="w-20 h-20 rounded-full bg-primary/20 flex items-center justify-center mb-6">
                                            <CheckCircle size={40} className="text-primary" />
                                        </div>
                                        <h3 className="text-2xl font-black text-white uppercase tracking-tighter mb-2">Campaign Deployed</h3>
                                        <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest mb-8 max-w-[280px]">
                                            {lastDeployedCampaign.name} is now broadcasting on the network.
                                        </p>
                                        <div className="flex flex-col w-full gap-3">
                                            <button
                                                type="button"
                                                onClick={() => handleDownloadPDF(lastDeployedCampaign)}
                                                className="w-full bg-primary py-4 rounded-2xl text-[12px] font-black uppercase tracking-[0.2em] text-white flex items-center justify-center gap-3 shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all"
                                            >
                                                <Download size={18} />
                                                Export Manifest PDF
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => setLastDeployedCampaign(null)}
                                                className="w-full bg-secondary py-4 rounded-2xl text-[12px] font-black uppercase tracking-[0.2em] text-muted-foreground hover:text-white transition-all"
                                            >
                                                Deploy Another
                                            </button>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                {/* Campaign Name */}
                                <div className="space-y-3">
                                    <label className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] ml-1">Campaign Title</label>
                                    <div className="relative group/input">
                                        <div className={`absolute left-5 top-1/2 -translate-y-1/2 transition-colors duration-300 ${errors.name ? 'text-rose-500' : 'text-muted-foreground group-focus-within/input:text-primary'}`}>
                                            <Activity size={18} />
                                        </div>
                                        <input
                                            type="text"
                                            placeholder="ENTER CAMPAIGN NAME..."
                                            value={formData.name}
                                            onChange={(e) => handleInputChange('name', e.target.value)}
                                            className={`w-full bg-secondary/50 border rounded-2xl pl-14 pr-5 py-4 text-[12px] font-black uppercase tracking-widest focus:outline-none transition-all duration-300 ${errors.name ? 'border-rose-500/50 focus:border-rose-500' : 'border-border focus:border-primary/50'}`}
                                        />
                                    </div>
                                    {errors.name && <p className="text-[9px] font-black text-rose-500 uppercase tracking-widest ml-1">{errors.name}</p>}
                                </div>

                                {/* Status */}
                                <div className="space-y-3">
                                    <label className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] ml-1">Tactical Status</label>
                                    <div className="grid grid-cols-3 gap-2">
                                        {['ACTIVE', 'PAUSED', 'COMPLETED'].map(status => (
                                            <button
                                                key={status}
                                                type="button"
                                                onClick={() => handleInputChange('status', status)}
                                                className={`py-4 rounded-xl border text-[9px] font-black uppercase tracking-widest transition-all ${formData.status === status
                                                    ? 'bg-primary border-primary text-white shadow-gradient shadow-primary/20'
                                                    : 'bg-secondary/50 border-border text-muted-foreground hover:text-white hover:bg-secondary'
                                                    }`}
                                            >
                                                {status}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* Dynamic Parameters Section */}
                            <div className="pt-6 border-t border-border/50">
                                <div className="flex items-center justify-between mb-8">
                                    <div className="flex items-center gap-3">
                                        <Shield size={16} className="text-primary/60" />
                                        <h4 className="text-[11px] font-black text-white uppercase tracking-[0.3em]">Enhanced Parameters</h4>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <button
                                            type="button"
                                            onClick={() => handleDownloadPDF()}
                                            className="p-2.5 rounded-xl bg-secondary border border-border text-muted-foreground hover:text-primary transition-all flex items-center gap-2"
                                            title="Export Manifest PDF"
                                        >
                                            <FileText size={16} />
                                            <span className="text-[9px] font-black uppercase tracking-widest px-1">PDF</span>
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setIsAddFieldModalOpen(true)}
                                            className="p-2.5 rounded-xl bg-primary/10 border border-primary/20 text-primary hover:bg-primary hover:text-white transition-all flex items-center gap-2"
                                            title="Add Custom Strategic Parameter"
                                        >
                                            <Plus size={16} />
                                            <span className="text-[9px] font-black uppercase tracking-widest px-1">Add Field</span>
                                        </button>
                                    </div>
                                </div>

                                {fetchingFields ? (
                                    <div className="flex items-center gap-3 p-6 bg-secondary/20 rounded-2xl animate-pulse">
                                        <Loader2 className="animate-spin text-primary" size={16} />
                                        <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Fetching Strategic Parameters...</span>
                                    </div>
                                ) : customFields.length === 0 ? (
                                    <p className="text-[10px] font-bold text-muted-foreground/40 uppercase tracking-widest text-center py-4 italic">
                                        No custom tactical parameters defined
                                    </p>
                                ) : (
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                        {customFields.map((field) => (
                                            <DynamicField
                                                key={field.id}
                                                field={field}
                                                value={formData.custom_values[field.field_name]}
                                                onChange={(val) => handleCustomValueChange(field.field_name, val)}
                                            />
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* Deploy Button */}
                            <div className="pt-8">
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full bg-primary hover:bg-primary/90 text-white font-black text-[12px] uppercase tracking-[0.3em] py-5 rounded-[20px] transition-all duration-300 shadow-xl shadow-primary/20 hover:shadow-primary/30 active:scale-95 disabled:opacity-50 disabled:pointer-events-none flex items-center justify-center gap-4"
                                >
                                    {loading ? (
                                        <>
                                            <Loader2 size={20} className="animate-spin" />
                                            Initializing Deployment...
                                        </>
                                    ) : (
                                        <>
                                            Deploy Campaign Node
                                            <ChevronRight size={20} />
                                        </>
                                    )}
                                </button>
                                <p className="text-center text-[9px] font-bold text-muted-foreground uppercase tracking-widest mt-5 opacity-60">
                                    By deploying, you acknowledge this node will operate under active strategic protocol.
                                </p>
                            </div>
                        </div>
                    </form>
                </div>
            </div>

            {/* Add Field Modal */}
            <AnimatePresence>
                {isAddFieldModalOpen && (
                    <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsAddFieldModalOpen(false)}
                            className="absolute inset-0 bg-black/80 backdrop-blur-md"
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            className="relative w-full max-w-md bg-card border border-border rounded-[2.5rem] p-10 shadow-2xl overflow-hidden"
                        >
                            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 blur-[100px] pointer-events-none" />

                            <div className="relative z-10">
                                <div className="flex items-center justify-between mb-8">
                                    <div>
                                        <h3 className="text-xl font-black uppercase tracking-tight text-white">Add strategic field</h3>
                                        <p className="text-[10px] text-muted-foreground font-black uppercase tracking-widest mt-1 opacity-60">
                                            Define new tactical mapping protocol
                                        </p>
                                    </div>
                                    <button onClick={() => setIsAddFieldModalOpen(false)} className="p-2 hover:text-white transition-colors">
                                        <X size={24} />
                                    </button>
                                </div>

                                <form onSubmit={handleAddField} className="space-y-6">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] ml-1">Field Name</label>
                                        <input
                                            type="text"
                                            required
                                            placeholder="e.g., TARGET SEGMENT"
                                            value={newField.field_name}
                                            onChange={(e) => setNewField({ ...newField, field_name: e.target.value })}
                                            className="w-full bg-secondary border border-border rounded-2xl px-5 py-4 text-[12px] font-black uppercase tracking-widest focus:outline-none focus:border-primary/50"
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] ml-1">Field Type</label>
                                        <div className="grid grid-cols-2 gap-3">
                                            {['text', 'select'].map(type => (
                                                <button
                                                    key={type}
                                                    type="button"
                                                    onClick={() => setNewField({ ...newField, field_type: type })}
                                                    className={`py-3 rounded-xl border text-[10px] font-black uppercase tracking-widest transition-all ${newField.field_type === type ? 'bg-primary border-primary text-white shadow-lg' : 'bg-secondary border-border text-muted-foreground hover:text-white'}`}
                                                >
                                                    {type.toUpperCase()}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    {newField.field_type === 'select' && (
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] ml-1">Options (comma-separated)</label>
                                            <input
                                                type="text"
                                                required
                                                placeholder="OPTION 1, OPTION 2, OPTION 3"
                                                onChange={(e) => setNewField({ ...newField, options: e.target.value.split(',').map(s => s.trim()) })}
                                                className="w-full bg-secondary border border-border rounded-2xl px-5 py-4 text-[12px] font-black uppercase tracking-widest focus:outline-none focus:border-primary/50"
                                            />
                                        </div>
                                    )}

                                    <button type="submit" className="w-full bg-primary py-5 rounded-2xl text-[12px] font-black uppercase tracking-widest text-white shadow-xl shadow-primary/20 mt-4">
                                        Register Strategic Protocol
                                    </button>
                                </form>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default DeployCampaign;
