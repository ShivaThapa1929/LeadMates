import React, { useState, useEffect, useMemo } from 'react';
import {
  FileText, Search, Filter, CheckCircle, XCircle, Clock, Eye, Download,
  Trash2, User, Mail, Phone, ExternalLink, Briefcase, Calendar, ChevronRight, AlertCircle, Loader2, X, Sparkles, Shield, Building2, ChevronDown
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import authService from '../../api/authService';

export default function JobApplications() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [isStatusDropdownOpen, setIsStatusDropdownOpen] = useState(false);
  const [selectedApp, setSelectedApp] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [actionLoading, setActionLoading] = useState(null); // 'accept', 'reject', 'delete'

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      setLoading(true);
      const res = await authService.getAdminApplications();
      if (res.success) {
        setApplications(res.data);
      }
    } catch (err) {
      setError(err.message || 'Failed to load applications');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (id, status) => {
    try {
      setActionLoading(id);
      const res = await authService.updateApplicationStatus(id, status);
      if (res.success) {
        setApplications(apps => apps.map(a => a.id === id ? { ...a, status } : a));
        if (selectedApp?.id === id) setSelectedApp(prev => ({ ...prev, status }));
      }
    } catch (err) {
      console.error('Update failed:', err);
    } finally {
      setActionLoading(null);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this application?')) return;
    try {
      setActionLoading(id);
      const res = await authService.deleteApplication(id);
      if (res.success) {
        setApplications(apps => apps.filter(a => a.id !== id));
        setIsModalOpen(false);
      }
    } catch (err) {
      console.error('Delete failed:', err);
    } finally {
      setActionLoading(null);
    }
  };

  const filteredApplications = useMemo(() => {
    return applications.filter(app => {
      const matchesSearch = 
        app.full_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        app.job_title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        app.applicant_email?.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesStatus = statusFilter === 'ALL' || app.status === statusFilter;
      
      return matchesSearch && matchesStatus;
    });
  }, [applications, searchQuery, statusFilter]);

  const stats = useMemo(() => {
    return {
      total: applications.length,
      pending: applications.filter(a => a.status === 'PENDING').length,
      reviewed: applications.filter(a => a.status === 'REVIEWED').length,
      accepted: applications.filter(a => a.status === 'ACCEPTED').length,
    };
  }, [applications]);

  const StatusBadge = ({ status }) => {
    const configs = {
      'PENDING': { color: 'text-amber-500 bg-amber-500/10 border-amber-500/20', icon: Clock },
      'REVIEWED': { color: 'text-blue-500 bg-blue-500/10 border-blue-500/20', icon: Eye },
      'ACCEPTED': { color: 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20', icon: CheckCircle },
      'REJECTED': { color: 'text-rose-500 bg-rose-500/10 border-rose-500/20', icon: XCircle },
    };
    const { color, icon: Icon } = configs[status] || configs['PENDING'];
    return (
      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${color}`}>
        <Icon size={12} />
        {status}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
        <Loader2 size={40} className="text-primary animate-spin" />
        <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Syncing Database...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-6 text-center">
        <div className="w-20 h-20 rounded-full bg-rose-500/10 flex items-center justify-center text-rose-500 border border-rose-500/20">
          <AlertCircle size={40} />
        </div>
        <div className="space-y-2">
          <h2 className="text-xl font-black text-white uppercase tracking-tight">Access Restricted or Error</h2>
          <p className="text-[11px] font-medium text-muted-foreground uppercase tracking-[0.1em] max-w-md mx-auto leading-relaxed">
            {error}. If you believe this is a mistake, please contact system support or check your admin permissions.
          </p>
        </div>
        <button 
          onClick={fetchApplications}
          className="px-8 py-4 bg-primary text-primary-foreground rounded-[24px] text-[11px] font-black uppercase tracking-widest hover:bg-primary/90 transition-all shadow-xl shadow-primary/20"
        >
          Try Syncing Again
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-20">
      {/* Header & Stats */}
      <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
             <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary border border-primary/20">
                <FileText className="w-6 h-6" />
             </div>
             <div>
               <h1 className="text-2xl font-black tracking-tight text-foreground uppercase text-white">Job Applications</h1>
               <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Master Control Dashboard</p>
             </div>
          </div>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 flex-1 max-w-4xl">
          {[
            { label: 'Total', value: stats.total, color: 'text-primary' },
            { label: 'Pending', value: stats.pending, color: 'text-amber-500' },
            { label: 'Reviewed', value: stats.reviewed, color: 'text-blue-500' },
            { label: 'Accepted', value: stats.accepted, color: 'text-emerald-500' },
          ].map((s) => (
            <div key={s.label} className="bg-secondary/30 border border-border/50 p-4 rounded-3xl flex flex-col items-center justify-center">
               <span className="text-[10px] font-black uppercase tracking-widest opacity-40 mb-1">{s.label}</span>
               <span className={`text-xl font-black ${s.color}`}>{s.value}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Primary Filters */}
      <div className="bg-card border border-border p-6 rounded-[32px] flex flex-col lg:flex-row gap-6">
        <div className="relative flex-1 group">
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors" size={18} />
          <input 
            type="text"
            placeholder="SEARCH BY NAME, EMAIL OR JOB TITLE..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-secondary/50 border border-border/50 rounded-2xl py-4 pl-14 pr-6 text-[11px] font-black tracking-widest text-foreground focus:outline-none focus:border-primary transition-all placeholder:text-muted-foreground/30"
          />
        </div>
        <div className="flex gap-4">
          <div className="relative">
            <button
               onClick={() => setIsStatusDropdownOpen(!isStatusDropdownOpen)}
               className="bg-secondary/50 border border-border/50 rounded-2xl py-4 pl-12 pr-6 text-[11px] font-black tracking-widest text-foreground hover:border-primary transition-all flex items-center justify-between min-w-[200px]"
            >
               <div className="flex items-center gap-3">
                  <Filter className="text-muted-foreground" size={16} />
                  <span>{statusFilter === "ALL" ? "ALL STATUS" : statusFilter}</span>
               </div>
               <ChevronDown size={14} className={`transition-transform duration-300 ${isStatusDropdownOpen ? "rotate-180" : ""}`} />
            </button>

            <AnimatePresence>
               {isStatusDropdownOpen && (
                 <>
                   <div className="fixed inset-0 z-[10]" onClick={() => setIsStatusDropdownOpen(false)} />
                   <motion.div
                     initial={{ opacity: 0, y: 10, scale: 0.95 }}
                     animate={{ opacity: 1, y: 0, scale: 1 }}
                     exit={{ opacity: 0, y: 10, scale: 0.95 }}
                     className="absolute top-full mt-3 right-0 w-full min-w-[200px] bg-[#16191E] border border-white/10 rounded-2xl shadow-2xl z-[11] overflow-hidden backdrop-blur-xl"
                   >
                     {['ALL', 'PENDING', 'REVIEWED', 'ACCEPTED', 'REJECTED'].map((status) => (
                       <button
                         key={status}
                         onClick={() => {
                           setStatusFilter(status);
                           setIsStatusDropdownOpen(false);
                         }}
                         className={`w-full text-left px-5 py-3.5 text-[10px] font-black uppercase tracking-widest transition-all border-b border-white/[0.03] last:border-0 ${
                           statusFilter === status 
                             ? "bg-primary text-primary-foreground" 
                             : "text-muted-foreground hover:bg-white/[0.05] hover:text-white"
                         }`}
                       >
                         {status === 'ALL' ? 'ALL STATUS' : status}
                       </button>
                     ))}
                   </motion.div>
                 </>
               )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Main Table */}
      <div className="bg-card border border-border rounded-[40px] overflow-hidden shadow-2xl">
        <div className="overflow-x-auto no-scrollbar">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-muted/30 border-b border-border">
                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">Applicant</th>
                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">Target Role</th>
                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">Identification</th>
                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">Status</th>
                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">Applied Date</th>
                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/40">
              {filteredApplications.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-8 py-20 text-center">
                    <div className="flex flex-col items-center gap-3 opacity-40">
                      <AlertCircle size={40} />
                      <p className="text-[12px] font-black uppercase tracking-widest">No matching applications found</p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredApplications.map((app) => (
                  <motion.tr 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    key={app.id} 
                    className="group hover:bg-muted/10 transition-colors"
                  >
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center font-black text-primary border border-border group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300">
                          {app.full_name?.[0] || 'U'}
                        </div>
                        <div>
                          <div className="text-[13px] font-black text-foreground uppercase tracking-tight">
                            {app.full_name || app.applicant_name || 'ANONYMOUS APPLICANT'}
                          </div>
                          <div className="text-[10px] font-medium text-muted-foreground opacity-60 leading-none mt-0.5 break-all max-w-[150px]">
                            {app.email || app.applicant_email || 'NO EMAIL PROVIDED'}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <div>
                        <div className="text-[13px] font-black text-foreground uppercase tracking-tight">{app.job_title}</div>
                        <div className="text-[10px] font-black text-primary/60 uppercase tracking-widest mt-0.5">{app.job_company || 'LeadMates'}</div>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-2 group/id">
                        <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary border border-primary/20 shrink-0">
                          <Shield size={14} />
                        </div>
                        <div className="text-[11px] font-black text-foreground uppercase tracking-widest whitespace-nowrap">
                          {app.aadhaar_number?.replace(/(\d{4})(\d{4})(\d{4})/, '$1 $2 $3') || 'NOT PROVIDED'}
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <StatusBadge status={app.status} />
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-2 text-[11px] font-black text-muted-foreground uppercase opacity-60">
                         <Calendar size={12} />
                         {new Date(app.created_at).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="px-8 py-6 text-right">
                      <div className="flex justify-end gap-2">
                        <button 
                          onClick={() => {
                            setSelectedApp(app);
                            setIsModalOpen(true);
                          }}
                          className="p-3 rounded-xl bg-secondary border border-border text-muted-foreground hover:text-primary hover:border-primary transition-all active:scale-95 shadow-sm"
                        >
                          <Eye size={18} />
                        </button>
                        <a 
                          href={app.resume_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-3 rounded-xl bg-secondary border border-border text-muted-foreground hover:text-emerald-500 hover:border-emerald-500 transition-all active:scale-95 shadow-sm"
                        >
                          <Download size={18} />
                        </a>
                      </div>
                    </td>
                  </motion.tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Application Detail Modal */}
      <AnimatePresence>
        {isModalOpen && selectedApp && (
          <div className="fixed inset-0 z-[1000] flex items-center justify-center pointer-events-none p-4 md:p-10">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="absolute inset-0 bg-background/80 backdrop-blur-xl pointer-events-auto"
            />
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 30 }}
              className="relative w-full max-w-5xl bg-[#0F1115] border border-white/10 shadow-3xl rounded-[40px] overflow-hidden pointer-events-auto max-h-[90vh] flex flex-col"
            >
              {/* Modal Header */}
              <div className="p-8 border-b border-white/5 bg-white/[0.02] flex flex-col md:flex-row md:items-center justify-between gap-6 shrink-0">
                <div className="flex items-center gap-5">
                   <div className="w-16 h-16 rounded-3xl bg-primary flex items-center justify-center text-primary-foreground shadow-2xl shadow-primary/20">
                      <Briefcase size={28} />
                   </div>
                   <div>
                      <h2 className="text-2xl font-black text-white uppercase tracking-tight leading-tight">
                        {selectedApp.job_title}
                      </h2>
                      <p className="text-[11px] font-black text-muted-foreground uppercase tracking-widest leading-none mt-1 opacity-60">
                         {selectedApp.job_company || 'LeadMates Marketplace'} • ID: {selectedApp.job_id}
                      </p>
                   </div>
                </div>
                <div className="flex items-center gap-3">
                   <StatusBadge status={selectedApp.status} />
                   <button 
                    onClick={() => setIsModalOpen(false)}
                    className="p-4 bg-white/[0.05] text-muted-foreground hover:text-white rounded-2xl transition-all"
                   >
                     <X size={20} />
                   </button>
                </div>
              </div>

              {/* Modal Content - Scrollable */}
              <div className="flex-1 overflow-y-auto no-scrollbar p-8">
                 <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                    {/* Left: Applicant Details */}
                    <div className="lg:col-span-4 space-y-8">
                       <section className="space-y-6 bg-white/[0.02] p-6 rounded-[32px] border border-white/5">
                          <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-primary/60 border-b border-white/5 pb-3 flex items-center gap-2">
                             <User size={14} /> Contact Information
                          </h3>
                          <div className="space-y-6 px-1">
                             <div className="flex items-center gap-5">
                                <div className="w-12 h-12 rounded-[20px] bg-white/5 border border-white/5 flex items-center justify-center text-sky-400 shrink-0"><User size={20}/></div>
                                <div>
                                   <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest opacity-40 mb-1">Full Name</p>
                                   <p className="text-[14px] font-black uppercase text-white tracking-tight leading-none">
                                      {selectedApp.full_name || selectedApp.applicant_name}
                                   </p>
                                </div>
                             </div>

                             <div className="flex items-center gap-5">
                                <div className="w-12 h-12 rounded-[20px] bg-white/5 border border-white/5 flex items-center justify-center text-amber-400 shrink-0"><Mail size={20}/></div>
                                <div className="min-w-0 flex-1">
                                   <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest opacity-40 mb-1">Email Address</p>
                                   <p className="text-[13px] font-black text-white lowercase leading-tight break-all">
                                      {selectedApp.email || selectedApp.applicant_email}
                                   </p>
                                </div>
                             </div>

                             <div className="flex items-center gap-5">
                                <div className="w-12 h-12 rounded-[20px] bg-white/5 border border-white/5 flex items-center justify-center text-emerald-400 shrink-0"><Phone size={20}/></div>
                                <div>
                                   <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest opacity-40 mb-1">Phone Number</p>
                                   <p className="text-[14px] font-black text-white tracking-[0.1em] leading-none">{selectedApp.phone}</p>
                                </div>
                             </div>

                             {selectedApp.aadhaar_number && (
                               <div className="flex items-center gap-5">
                                  <div className="w-12 h-12 rounded-[20px] bg-primary/10 border border-primary/20 flex items-center justify-center text-primary shrink-0"><Shield size={20}/></div>
                                  <div>
                                     <p className="text-[10px] font-black text-primary uppercase tracking-widest opacity-60 mb-1">Aadhaar Verification</p>
                                     <p className="text-[14px] font-black text-white tracking-[0.1em] leading-none">
                                        {selectedApp.aadhaar_number.replace(/(\d{4})(\d{4})(\d{4})/, '$1 $2 $3')}
                                     </p>
                                  </div>
                               </div>
                             )}
                          </div>
                       </section>

                       <section className="bg-primary/5 p-6 rounded-[32px] border border-primary/10">
                          <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-primary mb-5 flex items-center gap-2">
                             <Download size={14} /> Document Center
                          </h3>
                          <a 
                            href={selectedApp.resume_url} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="flex items-center justify-between p-4 bg-white/[0.03] border border-white/5 rounded-2xl group hover:bg-primary transition-all duration-500"
                          >
                            <div className="flex items-center gap-3">
                               <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-500 group-hover:bg-white/20 group-hover:text-white transition-all"><ExternalLink size={18}/></div>
                               <span className="text-[11px] font-black uppercase tracking-widest text-white">View Resume</span>
                            </div>
                            <ChevronRight size={16} className="text-muted-foreground group-hover:text-white" />
                          </a>
                       </section>
                    </div>

                    {/* Right: Cover Letter, Skills, Experience */}
                    <div className="lg:col-span-8 space-y-10">
                       <section>
                          <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-primary/60 border-b border-white/5 pb-3 flex items-center gap-2 mb-6">
                             <Briefcase size={14} /> Cover Letter
                          </h3>
                          <div className="bg-white/[0.02] p-8 rounded-[40px] border border-white/5 italic text-[14px] leading-relaxed text-white opacity-80 whitespace-pre-wrap">
                            "{selectedApp.cover_letter || 'The applicant did not provide a cover letter for this position.'}"
                          </div>
                       </section>

                       {selectedApp.skills && (
                         <section>
                             <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-primary/60 border-b border-white/5 pb-3 flex items-center gap-2 mb-6">
                                <Sparkles size={14} /> Skills & Qualifications
                             </h3>
                            <div className="flex flex-wrap gap-2">
                               {selectedApp.skills.split(',').map((skill, idx) => (
                                 <span key={idx} className="px-4 py-2 bg-white/[0.05] border border-white/5 text-[10px] font-black uppercase tracking-widest text-white rounded-xl">
                                    {skill.trim()}
                                 </span>
                               ))}
                            </div>
                         </section>
                       )}

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                           {/* Experience Details */}
                           {(() => {
                              let exps = [];
                              try { 
                                exps = typeof selectedApp.experience_details === 'string' 
                                  ? JSON.parse(selectedApp.experience_details) 
                                  : (selectedApp.experience_details || []);
                              } catch(e) { exps = []; }
                              
                              if (!Array.isArray(exps) || exps.length === 0) return null;

                              return (
                                <section className="space-y-6">
                                   <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-primary/60 border-b border-white/5 pb-3 flex items-center gap-2">
                                      <Briefcase size={14} /> Work Experience
                                   </h3>
                                   <div className="space-y-3">
                                      {exps.map((exp, i) => (
                                        <div key={i} className="p-4 bg-white/[0.03] border border-white/5 rounded-2xl">
                                           <div className="flex items-center gap-3 mb-1">
                                              <Building2 size={14} className="text-primary" />
                                              <span className="text-[12px] font-black text-white uppercase">{exp.company}</span>
                                           </div>
                                           <div className="flex justify-between items-center ml-6">
                                              <span className="text-[10px] font-bold text-muted-foreground uppercase">{exp.role}</span>
                                              <span className="text-[9px] font-black text-primary/60 uppercase">{exp.duration}</span>
                                           </div>
                                        </div>
                                      ))}
                                   </div>
                                </section>
                              );
                           })()}

                           {/* Internship Details */}
                           {(() => {
                              let interns = [];
                              try { 
                                interns = typeof selectedApp.internship_details === 'string' 
                                  ? JSON.parse(selectedApp.internship_details) 
                                  : (selectedApp.internship_details || []);
                              } catch(e) { interns = []; }
                              
                              if (!Array.isArray(interns) || interns.length === 0) return null;

                              return (
                                <section className="space-y-6">
                                   <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-primary/60 border-b border-white/5 pb-3 flex items-center gap-2">
                                      <Sparkles size={14} /> Internships
                                   </h3>
                                   <div className="space-y-3">
                                      {interns.map((intern, i) => (
                                        <div key={i} className="p-4 bg-white/[0.03] border border-white/5 rounded-2xl">
                                           <div className="flex items-center gap-3 mb-1">
                                              <Building2 size={14} className="text-emerald-500" />
                                              <span className="text-[12px] font-black text-white uppercase">{intern.company}</span>
                                           </div>
                                           <div className="flex justify-between items-center ml-6">
                                              <span className="text-[10px] font-bold text-muted-foreground uppercase">{intern.role}</span>
                                              <span className="text-[9px] font-black text-emerald-500/60 uppercase">{intern.duration}</span>
                                           </div>
                                        </div>
                                      ))}
                                   </div>
                                </section>
                              );
                           })()}
                        </div>
                    </div>
                 </div>
              </div>

              {/* Modal Footer - Actions */}
              <div className="p-8 border-t border-white/5 bg-white/[0.02] shrink-0">
                 <div className="flex flex-col md:flex-row items-center gap-4">
                    <div className="flex items-center bg-black/40 bg-opacity-40 p-1.5 rounded-3xl border border-white/5 w-full md:w-auto">
                       {['PENDING', 'REVIEWED', 'ACCEPTED', 'REJECTED'].map((status) => (
                         <button
                           key={status}
                           onClick={() => handleStatusUpdate(selectedApp.id, status)}
                           disabled={actionLoading === selectedApp.id}
                           className={`px-5 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${
                             selectedApp.status === status 
                             ? status === 'ACCEPTED' ? 'bg-emerald-500 text-white shadow-lg' :
                               status === 'REJECTED' ? 'bg-rose-500 text-white shadow-lg' :
                               status === 'REVIEWED' ? 'bg-blue-500 text-white shadow-lg' :
                               'bg-amber-500 text-white shadow-lg'
                             : 'text-muted-foreground hover:bg-white/5 opacity-50 hover:opacity-100'
                           }`}
                         >
                           {status}
                         </button>
                       ))}
                    </div>
                    
                    <div className="flex-1 w-full flex justify-end gap-4">
                       <button 
                        onClick={() => handleDelete(selectedApp.id)}
                        disabled={actionLoading === selectedApp.id}
                        className="px-8 py-4 bg-rose-500/10 text-rose-500 border border-rose-500/20 hover:bg-rose-500 hover:text-white rounded-[24px] text-[11px] font-black uppercase tracking-widest transition-all flex items-center gap-2"
                       >
                         <Trash2 size={16} /> Delete Submission
                       </button>
                       <button 
                        onClick={() => setIsModalOpen(false)}
                        className="px-8 py-4 bg-white/[0.05] text-white border border-white/10 hover:bg-white/[0.1] rounded-[24px] text-[11px] font-black uppercase tracking-widest transition-all"
                       >
                         Close Detail
                       </button>
                    </div>
                 </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

