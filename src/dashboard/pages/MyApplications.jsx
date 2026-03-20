import { useState, useEffect } from "react";
import { 
  FileText, Search, Filter, AlertCircle, 
  Briefcase, Building2, MapPin, Calendar, 
  ExternalLink, User, Mail, Phone, Shield, 
  Sparkles, Download, ChevronRight, X, Clock, ChevronDown
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import authService from "../../api/authService";

const StatusBadge = ({ status }) => {
  const styles = {
    PENDING: "bg-amber-500/10 text-amber-500 border-amber-500/20",
    REVIEWED: "bg-blue-500/10 text-blue-500 border-blue-500/20",
    ACCEPTED: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
    REJECTED: "bg-rose-500/10 text-rose-500 border-rose-500/20",
  };
  return (
    <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border ${styles[status]}`}>
      {status}
    </span>
  );
};

export default function MyApplications() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [isStatusDropdownOpen, setIsStatusDropdownOpen] = useState(false);
  const [selectedApp, setSelectedApp] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetchMyApplications();
  }, []);

  const fetchMyApplications = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await authService.api.get("/jobs/applications");
      setApplications(res.data?.data || []);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load your applications.");
    } finally {
      setLoading(false);
    }
  };

  const filteredApplications = applications.filter(app => {
    const matchesSearch = 
      app.job_title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.job_company?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "ALL" || app.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const stats = {
    total: applications.length,
    pending: applications.filter(a => a.status === 'PENDING').length,
    accepted: applications.filter(a => a.status === 'ACCEPTED').length,
    rejected: applications.filter(a => a.status === 'REJECTED').length,
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
        <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
        <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Loading Your Journey...</p>
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
                <Briefcase className="w-6 h-6" />
             </div>
             <div>
                <h1 className="text-3xl font-black text-white uppercase tracking-tight">My Applications</h1>
                <p className="text-[11px] font-medium text-muted-foreground uppercase tracking-[0.2em] opacity-60">Track your professional opportunities</p>
             </div>
          </div>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 flex-1 max-w-2xl">
          {[
            { label: 'Total', value: stats.total, color: 'text-primary' },
            { label: 'Pending', value: stats.pending, color: 'text-amber-500' },
            { label: 'Accepted', value: stats.accepted, color: 'text-emerald-500' },
            { label: 'Rejected', value: stats.rejected, color: 'text-rose-500' },
          ].map((s) => (
            <div key={s.label} className="bg-secondary/30 border border-border/50 p-4 rounded-3xl flex flex-col items-center justify-center">
               <span className="text-[10px] font-black uppercase tracking-widest opacity-40 mb-1">{s.label}</span>
               <span className={`text-xl font-black ${s.color}`}>{s.value}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Filters */}
      <div className="bg-card border border-border p-6 rounded-[32px] flex flex-col lg:flex-row gap-6">
        <div className="relative flex-1 group">
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors" size={18} />
          <input 
            type="text"
            placeholder="SEARCH BY JOB TITLE OR COMPANY..."
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

      {/* Applications Grid */}
      {filteredApplications.length === 0 ? (
        <div className="bg-card border border-border rounded-[40px] p-20 flex flex-col items-center gap-6 text-center">
          <div className="w-20 h-20 rounded-full bg-secondary/50 flex items-center justify-center text-muted-foreground">
            <Briefcase size={40} />
          </div>
          <div className="space-y-2">
             <h2 className="text-xl font-black text-white uppercase tracking-tight">No Applications Found</h2>
             <p className="text-[12px] font-medium text-muted-foreground uppercase tracking-widest max-w-xs mx-auto opacity-60">
                You have not applied to any jobs yet. Start your journey today!
             </p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredApplications.map((app) => (
            <motion.div 
              layout
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              key={app.id}
              className="bg-card border border-border rounded-[32px] p-8 hover:border-primary/40 transition-all group relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-10 transition-opacity">
                 <Briefcase size={80} />
              </div>

              <div className="flex flex-col h-full gap-6">
                <div className="flex justify-between items-start">
                   <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary border border-primary/20">
                      <Building2 size={24} />
                   </div>
                   <StatusBadge status={app.status} />
                </div>

                <div>
                   <h3 className="text-lg font-black text-white uppercase tracking-tight line-clamp-1 mb-1">{app.job_title}</h3>
                   <p className="text-[11px] font-black text-primary uppercase tracking-widest">{app.job_company}</p>
                </div>

                <div className="space-y-3 py-4 border-y border-border/40">
                   <div className="flex items-center gap-3 text-muted-foreground">
                      <MapPin size={14} className="text-muted-foreground/40" />
                      <span className="text-[11px] font-medium uppercase tracking-widest">{app.job_location || 'REMOTE'}</span>
                   </div>
                   <div className="flex items-center gap-3 text-muted-foreground">
                      <Clock size={14} className="text-muted-foreground/40" />
                      <span className="text-[11px] font-medium uppercase tracking-widest">Applied: {new Date(app.created_at).toLocaleDateString()}</span>
                   </div>
                </div>

                <button 
                  onClick={() => {
                    setSelectedApp(app);
                    setIsModalOpen(true);
                  }}
                  className="w-full py-4 bg-secondary/50 text-[11px] font-black uppercase tracking-[0.2em] text-white rounded-2xl border border-border hover:bg-primary hover:text-primary-foreground hover:border-transparent transition-all flex items-center justify-center gap-2 group/btn"
                >
                  View Details <ChevronRight size={14} className="group-hover/btn:translate-x-1 transition-transform" />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}

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
              <div className="p-8 border-b border-white/5 bg-white/[0.02] flex flex-col md:flex-row md:items-center justify-between gap-6 shrink-0">
                <div className="flex items-center gap-5">
                   <div className="w-16 h-16 rounded-3xl bg-primary flex items-center justify-center text-primary-foreground">
                      <Briefcase size={28} />
                   </div>
                   <div>
                      <h2 className="text-2xl font-black text-white uppercase tracking-tight">{selectedApp.job_title}</h2>
                      <p className="text-[11px] font-black text-muted-foreground uppercase tracking-widest mt-1 opacity-60">
                         {selectedApp.job_company} • Applied on {new Date(selectedApp.created_at).toLocaleDateString()}
                      </p>
                   </div>
                </div>
                <div className="flex items-center gap-3">
                   <StatusBadge status={selectedApp.status} />
                   <button onClick={() => setIsModalOpen(false)} className="p-4 bg-white/[0.05] text-muted-foreground hover:text-white rounded-2xl transition-all"><X size={20} /></button>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto no-scrollbar p-8">
                 <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                    <div className="lg:col-span-4 space-y-8">
                       <section className="space-y-6 bg-white/[0.02] p-6 rounded-[32px] border border-white/5">
                          <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-primary/60 border-b border-white/5 pb-3 flex items-center gap-2">
                             <User size={14} /> My Submission Info
                          </h3>
                          <div className="space-y-6 px-1">
                             <div className="flex items-center gap-5">
                                <div className="w-12 h-12 rounded-[20px] bg-white/5 border border-white/5 flex items-center justify-center text-sky-400 shrink-0"><User size={20}/></div>
                                <div>
                                   <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest opacity-40 mb-1">Full Name</p>
                                   <p className="text-[14px] font-black uppercase text-white tracking-tight leading-none">{selectedApp.full_name || selectedApp.applicant_name}</p>
                                </div>
                             </div>
                             <div className="flex items-center gap-5">
                                <div className="w-12 h-12 rounded-[20px] bg-white/5 border border-white/5 flex items-center justify-center text-amber-400 shrink-0"><Mail size={20}/></div>
                                <div className="min-w-0 flex-1">
                                   <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest opacity-40 mb-1">Email Address</p>
                                   <p className="text-[14px] font-black text-white lowercase break-all leading-tight">{selectedApp.email || selectedApp.applicant_email}</p>
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
                             <Download size={14} /> Submitted Documents
                          </h3>
                          <a href={selectedApp.resume_url} target="_blank" rel="noopener noreferrer" className="flex items-center justify-between p-4 bg-white/[0.03] border border-white/5 rounded-2xl group hover:bg-primary transition-all duration-500">
                            <div className="flex items-center gap-3">
                               <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-500 group-hover:bg-white/20 group-hover:text-white transition-all"><ExternalLink size={18}/></div>
                               <span className="text-[11px] font-black uppercase tracking-widest text-white">Resume.pdf</span>
                            </div>
                            <ChevronRight size={16} className="text-muted-foreground group-hover:text-white" />
                          </a>
                       </section>
                    </div>

                    <div className="lg:col-span-8 space-y-10">
                       <section>
                          <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-primary/60 border-b border-white/5 pb-3 flex items-center gap-2 mb-6">
                             <FileText size={14} /> My Cover Letter
                          </h3>
                          <div className="bg-white/[0.02] p-8 rounded-[40px] border border-white/5 italic text-[14px] leading-relaxed text-white opacity-80 whitespace-pre-wrap">
                            "{selectedApp.cover_letter || 'No cover letter was submitted for this application.'}"
                          </div>
                       </section>

                       {selectedApp.skills && (
                         <section>
                            <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-primary/60 border-b border-white/5 pb-3 flex items-center gap-2 mb-6">
                               <Sparkles size={14} /> Skills Provided
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
                           {(() => {
                              let exps = [];
                              try { exps = typeof selectedApp.experience_details === 'string' ? JSON.parse(selectedApp.experience_details) : (selectedApp.experience_details || []); } catch(e) { exps = []; }
                              if (!Array.isArray(exps) || exps.length === 0) return null;
                              return (
                                <section className="space-y-6">
                                   <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-primary/60 border-b border-white/5 pb-3 flex items-center gap-2">
                                      <Briefcase size={14} /> Work Experience
                                   </h3>
                                   <div className="space-y-3">
                                      {exps.map((exp, i) => (
                                        <div key={i} className="p-4 bg-white/[0.03] border border-white/5 rounded-2xl">
                                           <div className="flex items-center gap-3 mb-1"><Building2 size={14} className="text-primary" /><span className="text-[12px] font-black text-white uppercase">{exp.company}</span></div>
                                           <div className="flex justify-between items-center ml-6"><span className="text-[10px] font-bold text-muted-foreground uppercase">{exp.role}</span><span className="text-[9px] font-black text-primary/60 uppercase">{exp.duration}</span></div>
                                        </div>
                                      ))}
                                   </div>
                                </section>
                              );
                           })()}

                           {(() => {
                              let interns = [];
                              try { interns = typeof selectedApp.internship_details === 'string' ? JSON.parse(selectedApp.internship_details) : (selectedApp.internship_details || []); } catch(e) { interns = []; }
                              if (!Array.isArray(interns) || interns.length === 0) return null;
                              return (
                                <section className="space-y-6">
                                   <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-primary/60 border-b border-white/5 pb-3 flex items-center gap-2">
                                      <Sparkles size={14} /> Internships
                                   </h3>
                                   <div className="space-y-3">
                                      {interns.map((intern, i) => (
                                        <div key={i} className="p-4 bg-white/[0.03] border border-white/5 rounded-2xl">
                                           <div className="flex items-center gap-3 mb-1"><Building2 size={14} className="text-emerald-500" /><span className="text-[12px] font-black text-white uppercase">{intern.company}</span></div>
                                           <div className="flex justify-between items-center ml-6"><span className="text-[10px] font-bold text-muted-foreground uppercase">{intern.role}</span><span className="text-[9px] font-black text-emerald-500/60 uppercase">{intern.duration}</span></div>
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
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
