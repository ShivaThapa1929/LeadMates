import { useEffect, useMemo, useState } from "react";
import {
  BriefcaseBusiness, Loader2, CheckCircle, AlertCircle, MapPin, Banknote,
  Clock, Plus, X, Lock, Upload, User, Smartphone, Mail, FileText, Send, Building2, Briefcase, Calendar, Trash2, ChevronDown, ChevronUp, Shield,
  Search, Filter, Sparkles, Tag, ChevronRight
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import authService from "../../api/authService";

export default function Jobs() {
  const navigate = useNavigate();
  const user = authService.getCurrentUser();
  const isAdmin = 
    user?.role?.toLowerCase() === 'admin' || 
    user?.role?.toLowerCase() === 'super admin' ||
    user?.roles?.some(r => r.toLowerCase() === 'admin' || r.toLowerCase() === 'super admin');

  // ─── Plan Status Calculation ───────────────────────────────────────────────
  const userPlan = user?.plan || 'Identity Basic';
  const planStatus = user?.plan_status || 'pending';
  const paymentStatus = user?.payment_status || 'pending';
  const planExpiresAt = user?.plan_expires_at ? new Date(user.plan_expires_at) : null;
  const isPlanExpired = planExpiresAt ? planExpiresAt < new Date() : false;
  const isPaidActive = userPlan !== 'Identity Basic'
    && planStatus === 'active'
    && paymentStatus === 'success'
    && !isPlanExpired;
  const hasActivePlan = isAdmin || isPaidActive;
  // ──────────────────────────────────────────────────────────────────────────

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    location: "",
    salary: "",
    category: "",
  });

  const [selectedJob, setSelectedJob] = useState(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [applyLoading, setApplyLoading] = useState(false);
  const [status, setStatus] = useState({ type: "", message: "" });
  const [applyStatus, setApplyStatus] = useState({ type: "", message: "" });
  const [jobs, setJobs] = useState([]);
  const [appliedJobIds, setAppliedJobIds] = useState(new Set());
  const [jobsLoading, setJobsLoading] = useState(true);
  const [jobsError, setJobsError] = useState("");
  const [applyFieldErrors, setApplyFieldErrors] = useState({});
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("ALL");
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);

  // Application Form State — pre-fill with current user data
  const [applyForm, setApplyForm] = useState({
    full_name: user?.name || "",
    email: user?.email || "",
    phone: user?.phone || "",
    aadhaar_number: "",
    cover_letter: "",
    skills: "",
    resume: null,
    experience_entries: [],   // [{company:'',role:'',duration:''}]
    internship_entries: [],   // [{company:'',role:'',duration:''}]
  });

  // ─── Experience / Internship entry helpers ─────────────────────────────────
  const emptyExp = () => ({ company: '', role: '', duration: '' });

  const addExperience = () =>
    setApplyForm(p => ({ ...p, experience_entries: [...p.experience_entries, emptyExp()] }));

  const removeExperience = (i) =>
    setApplyForm(p => ({ ...p, experience_entries: p.experience_entries.filter((_, idx) => idx !== i) }));

  const updateExperience = (i, field, val) =>
    setApplyForm(p => ({
      ...p,
      experience_entries: p.experience_entries.map((e, idx) => idx === i ? { ...e, [field]: val } : e)
    }));

  const addInternship = () =>
    setApplyForm(p => ({ ...p, internship_entries: [...p.internship_entries, emptyExp()] }));

  const removeInternship = (i) =>
    setApplyForm(p => ({ ...p, internship_entries: p.internship_entries.filter((_, idx) => idx !== i) }));

  const updateInternship = (i, field, val) =>
    setApplyForm(p => ({
      ...p,
      internship_entries: p.internship_entries.map((e, idx) => idx === i ? { ...e, [field]: val } : e)
    }));
  // ──────────────────────────────────────────────────────────────────────────

  const fetchJobs = async () => {
    setJobsError("");
    setJobsLoading(true);
    try {
      const res = await authService.api.get("/jobs");
      let list = res.data?.data || [];
      
      // Let's keep it simple: Show all jobs for everyone now, as requested.
      // Filter by experience could be an optional UI filter instead.
      // list = list.filter(j => ...); // removed strict filter
      
      setJobs(Array.isArray(list) ? list : []);

      // Fetch user's applications to show "Applied" status
      if (!isAdmin) {
          try {
            const appRes = await authService.getUserApplications();
            if (appRes.success) {
              const ids = new Set(appRes.data.map(app => app.job_id));
              setAppliedJobIds(ids);
            }
          } catch (e) { console.error("Could not fetch user applications:", e); }
      }
    } catch (err) {
      setJobsError(err.response?.data?.message || err.message || "Failed to load jobs.");
    } finally {
      setJobsLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  const isValid = useMemo(() => {
    return (
      formData.title.trim().length > 0 &&
      formData.description.trim().length > 0 &&
      formData.location.trim().length > 0 &&
      formData.category.trim().length > 0 &&
      String(formData.salary).trim().length > 0 &&
      Number.isFinite(Number(formData.salary)) &&
      Number(formData.salary) >= 0
    );
  }, [formData]);

  const handleApplyChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'resume') {
      setApplyForm(prev => ({ ...prev, resume: files[0] }));
    } else {
      setApplyForm(prev => ({ ...prev, [name]: value }));
    }
    // Clear field error on change
    if (applyFieldErrors[name]) {
      setApplyFieldErrors(prev => ({ ...prev, [name]: '' }));
    }
    if (applyStatus.message) setApplyStatus({ type: '', message: '' });
  };

  const validateApplyField = (name, value) => {
    switch (name) {
      case 'full_name':
        return value.trim().length >= 2 ? '' : 'Full name is required (min 2 characters)';
      case 'email':
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) ? '' : 'Please enter a valid email address';
      case 'phone':
        return /^\+?[\d\s\-()]{7,15}$/.test(value) ? '' : 'Please enter a valid phone number';
      case 'aadhaar_number':
        return /^\d{12}$/.test(value.replace(/\s/g, '')) ? '' : 'Aadhaar must be exactly 12 numeric digits';
      default:
        return '';
    }
  };

  const handleApplyBlur = (e) => {
    const { name, value } = e.target;
    const error = validateApplyField(name, value);
    setApplyFieldErrors(prev => ({ ...prev, [name]: error }));
  };

  const isApplyFormValid = useMemo(() => {
    const cleanAadhaar = applyForm.aadhaar_number.replace(/\s/g, '');
    return (
      applyForm.full_name.trim().length >= 2 &&
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(applyForm.email) &&
      /^\+?[\d\s\-()]{7,15}$/.test(applyForm.phone) &&
      /^\d{12}$/.test(cleanAadhaar) &&
      applyForm.resume !== null
    );
  }, [applyForm]);

  const handleApplySubmit = async (e) => {
    e.preventDefault();
    if (applyLoading || !isApplyFormValid) return;

    // Run all field validations before submit
    const errors = {
      full_name: validateApplyField('full_name', applyForm.full_name),
      email: validateApplyField('email', applyForm.email),
      phone: validateApplyField('phone', applyForm.phone),
      aadhaar_number: validateApplyField('aadhaar_number', applyForm.aadhaar_number),
    };
    if (Object.values(errors).some(e => e)) {
      setApplyFieldErrors(errors);
      return;
    }
    if (!applyForm.resume) {
      setApplyStatus({ type: 'error', message: 'Please upload your resume before submitting.' });
      return;
    }

    setApplyLoading(true);
    setApplyStatus({ type: "", message: "" });

    try {
        const data = new FormData();
        data.append('full_name', applyForm.full_name.trim());
        data.append('email', applyForm.email.trim());
        data.append('phone', applyForm.phone.trim());
        data.append('aadhaar_number', applyForm.aadhaar_number.replace(/\s/g, ''));
        data.append('cover_letter', applyForm.cover_letter || '');
        data.append('skills', applyForm.skills || '');
        data.append('resume', applyForm.resume);

        // Serialize structured fields as JSON strings
        const validExp = applyForm.experience_entries.filter(e => e.company.trim() || e.role.trim());
        const validIntern = applyForm.internship_entries.filter(e => e.company.trim() || e.role.trim());
        if (validExp.length > 0) data.append('experience_details', JSON.stringify(validExp));
        if (validIntern.length > 0) data.append('internship_details', JSON.stringify(validIntern));

        await authService.applyForJob(selectedJob.id, data);

        setApplyStatus({ type: "success", message: "🎉 Application submitted successfully! We'll be in touch soon." });
        setAppliedJobIds(prev => new Set([...prev, selectedJob.id]));

        setTimeout(() => {
            setIsApplyModalOpen(false);
            setSelectedJob(null);
            setApplyStatus({ type: "", message: "" });
            // Reset optional & sensitive fields, keep name/email/phone
            setApplyForm(prev => ({
              ...prev,
              aadhaar_number: '',
              cover_letter: '',
              skills: '',
              resume: null,
              experience_entries: [],
              internship_entries: [],
            }));
        }, 2500);
    } catch (err) {
        const msg = err?.message || err?.data?.message || 'Application submission failed.';
        if (msg.toLowerCase().includes('already applied') || msg.toLowerCase().includes('duplicate')) {
            setApplyStatus({ type: 'error', message: 'You have already applied for this job.' });
            setAppliedJobIds(prev => new Set([...prev, selectedJob.id]));
        } else {
            setApplyStatus({ type: 'error', message: msg });
        }
    } finally {
        setApplyLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (status.message) setStatus({ type: "", message: "" });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isValid || loading) return;

    // Frontend-side plan gate (mirrors backend)
    if (!hasActivePlan) {
      navigate("/pricing", { state: { message: isPlanExpired ? 'Your plan has expired. Renew to post jobs.' : 'Please purchase a plan to post a job.' } });
      return;
    }

    setLoading(true);
    setStatus({ type: "", message: "" });

    try {
      const res = await authService.api.post("/jobs/post-job", formData);
      setStatus({ type: "success", message: res.data?.message || "Job posted successfully." });
      setFormData({ title: "", description: "", location: "", salary: "", category: "" });
      await fetchJobs();
      setTimeout(() => {
        setIsModalOpen(false);
        setStatus({ type: "", message: "" });
      }, 2000);
    } catch (error) {
      const errMsg = error.response?.data?.message || "Error posting job";
      const errCode = error.response?.data?.errors?.[0]?.errorCode || error.response?.data?.errorCode;

      // If a plan error comes from backend, redirect to pricing
      if (errCode === 'PLAN_REQUIRED' || errCode === 'PLAN_INACTIVE' || errCode === 'PLAN_EXPIRED') {
        navigate("/pricing", { state: { message: errMsg } });
        return;
      }
      setStatus({ type: "error", message: errMsg });
    } finally {
      setLoading(false);
    }
  };
  const filteredJobs = useMemo(() => {
    return jobs.filter(job => {
      const matchesSearch = 
        job.title?.toLowerCase().includes(searchQuery.toLowerCase()) || 
        job.location?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        job.category?.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = categoryFilter === "ALL" || job.category === categoryFilter;
      return matchesSearch && matchesCategory;
    });
  }, [jobs, searchQuery, categoryFilter]);

  const categories = useMemo(() => {
    const cats = new Set(jobs.map(j => j.category).filter(Boolean));
    return ["ALL", ...Array.from(cats)];
  }, [jobs]);

  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-foreground tracking-tight uppercase flex items-center gap-3">
            <BriefcaseBusiness className="text-primary" size={28} />
            {isAdmin ? 'Network' : 'Apply'} <span className="text-primary">Jobs</span>
          </h1>
          <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mt-2 opacity-60">
            {isAdmin ? 'Browse and manage all job opportunities in the ecosystem' : `Relevant opportunities in your field: ${user?.experience || 'General'}`}
          </p>
        </div>

        {isAdmin && (
          <button
            onClick={() => {
              if (!hasActivePlan) {
                const msg = isPlanExpired
                  ? 'Your plan has expired. Please renew to post a job.'
                  : 'Please purchase a plan to post a job.';
                navigate("/pricing", { state: { message: msg } });
                return;
              }
              setIsModalOpen(true);
            }}
            className={`flex items-center gap-3 ${
              hasActivePlan
                ? 'bg-primary hover:bg-primary/90 text-primary-foreground shadow-xl shadow-primary/20 hover:shadow-primary/30'
                : 'bg-rose-500/10 border border-rose-500/30 text-rose-400 hover:bg-rose-500/20'
            } px-6 py-4 rounded-[20px] transition-all duration-300 active:scale-95`}
          >
            {hasActivePlan ? <Plus size={20} /> : <Lock size={18} />}
            <span className="text-[12px] font-black uppercase tracking-[0.2em]">
              {hasActivePlan ? 'Post Job' : isPlanExpired ? 'Plan Expired' : 'Upgrade to Post'}
            </span>
          </button>
        )}
      </div>

      {/* Plan Status Banner — only shown to admins without an active plan */}
      {isAdmin && !hasActivePlan && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className={`flex items-start sm:items-center gap-4 p-5 rounded-[20px] border ${
            isPlanExpired
              ? 'bg-rose-500/10 border-rose-500/20 text-rose-300'
              : 'bg-amber-500/10 border-amber-500/20 text-amber-300'
          }`}
        >
          <AlertCircle size={20} className="shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="text-[11px] font-black uppercase tracking-widest">
              {isPlanExpired
                ? `Your "${userPlan}" plan expired on ${planExpiresAt?.toLocaleDateString()}.`
                : 'You don\'t have an active plan — job creation is restricted.'}
            </p>
            <p className="text-[10px] opacity-70 mt-1 font-bold">
              {isPlanExpired ? 'Renew your subscription to continue posting jobs.' : 'Purchase a plan to unlock job posting.'}
            </p>
          </div>
          <button
            onClick={() => navigate('/pricing', { state: { message: 'Please purchase a plan to post a job.' } })}
            className={`shrink-0 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
              isPlanExpired ? 'bg-rose-500 text-white hover:bg-rose-400' : 'bg-amber-500 text-black hover:bg-amber-400'
            }`}
          >
            {isPlanExpired ? 'Renew Plan' : 'View Plans'}
          </button>
        </motion.div>
      )}

      {/* Stats Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { label: "Total Opportunities", value: jobs.length, icon: BriefcaseBusiness, color: "text-primary", bg: "bg-primary/10" },
            { label: "Active Nodes", value: appliedJobIds.size, icon: Sparkles, color: "text-emerald-500", bg: "bg-emerald-500/10" },
            { label: "Global Locations", value: new Set(jobs.map(j => j.location)).size, icon: MapPin, color: "text-sky-400", bg: "bg-sky-400/10" },
            { label: "Verified Partners", value: "Premium", icon: Shield, color: "text-amber-500", bg: "bg-amber-500/10" }
          ].map((stat, i) => (
            <div key={i} className="bg-card border border-border/50 p-6 rounded-[32px] shadow-sm flex items-center gap-5 hover:border-primary/30 transition-all group">
              <div className={`w-14 h-14 rounded-2xl ${stat.bg} ${stat.color} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                 <stat.icon size={24} />
              </div>
              <div>
                 <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest leading-none mb-1.5 opacity-60">{stat.label}</p>
                 <h4 className="text-xl font-black text-foreground uppercase tracking-tight">{stat.value}</h4>
              </div>
            </div>
          ))}
      </div>

      {/* Control Bar: Search & Filter */}
      <div className="bg-card/50 backdrop-blur-md border border-border p-6 rounded-[32px] flex flex-col lg:flex-row gap-6 shadow-xl">
        <div className="relative flex-1 group">
          <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors" size={20} />
          <input 
            type="text"
            placeholder="Search roles, locations, or specializations..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-secondary/30 border border-border/50 rounded-2xl py-5 pl-16 pr-8 text-[12px] font-black uppercase tracking-widest text-foreground focus:outline-none focus:border-primary transition-all placeholder:text-muted-foreground/30 shadow-inner"
          />
        </div>
        
        <div className="flex gap-4 min-w-max">
           <div className="relative">
              <button 
                onClick={() => setIsCategoryOpen(!isCategoryOpen)}
                className="h-full px-8 bg-secondary/30 border border-border/50 rounded-2xl text-[11px] font-black uppercase tracking-widest text-foreground flex items-center gap-4 hover:border-primary/50 transition-all"
              >
                <Filter size={16} className="text-primary" />
                <span>{categoryFilter === "ALL" ? "All Sectors" : categoryFilter}</span>
                <ChevronDown size={14} className={`transition-transform duration-300 ${isCategoryOpen ? "rotate-180" : ""}`} />
              </button>

              <AnimatePresence>
                {isCategoryOpen && (
                  <>
                    <div className="fixed inset-0 z-[50]" onClick={() => setIsCategoryOpen(false)} />
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      className="absolute top-full mt-3 right-0 w-full min-w-[220px] bg-[#16191E] border border-white/10 rounded-2xl shadow-3xl z-[51] overflow-hidden backdrop-blur-2xl"
                    >
                      {categories.map((cat) => (
                        <button
                          key={cat}
                          onClick={() => {
                            setCategoryFilter(cat);
                            setIsCategoryOpen(false);
                          }}
                          className={`w-full text-left px-6 py-4 text-[10px] font-black uppercase tracking-widest transition-all border-b border-white/[0.03] last:border-0 ${
                            categoryFilter === cat 
                              ? "bg-primary text-primary-foreground" 
                              : "text-muted-foreground hover:bg-white/[0.05] hover:text-white"
                          }`}
                        >
                          {cat === "ALL" ? "All Sectors" : cat}
                        </button>
                      ))}
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
           </div>

           <button
            onClick={fetchJobs}
            disabled={jobsLoading}
            className="px-8 bg-primary/10 border border-primary/20 rounded-2xl text-[11px] font-black uppercase tracking-widest text-primary hover:bg-primary hover:text-white transition-all disabled:opacity-50 shadow-sm"
           >
             {jobsLoading ? "Syncing..." : "Refresh"}
           </button>
        </div>
      </div>

      {/* Jobs Grid */}
      <div className="min-h-[400px]">
        {jobsLoading ? (
          <div className="p-40 flex flex-col items-center justify-center gap-6">
            <div className="relative">
              <Loader2 className="animate-spin text-primary" size={48} />
              <div className="absolute inset-0 blur-2xl bg-primary/30 rounded-full" />
            </div>
            <p className="text-[12px] font-black text-muted-foreground uppercase tracking-[0.3em] animate-pulse">Establishing Secure Uplink…</p>
          </div>
        ) : filteredJobs.length === 0 ? (
          <div className="bg-card border border-border rounded-[40px] p-24 text-center">
            <div className="w-24 h-24 rounded-[2.5rem] bg-secondary border border-border flex items-center justify-center mx-auto mb-8 text-muted-foreground/20 shadow-inner">
              <BriefcaseBusiness size={48} />
            </div>
            <h3 className="text-xl font-black text-foreground uppercase tracking-tight mb-3">No Opportunities Found</h3>
            <p className="text-[11px] font-medium text-muted-foreground uppercase tracking-widest max-w-[280px] mx-auto opacity-60">
              Your search parameters didn't match any active listings. Try broadening your criteria.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredJobs.map((job) => {
              const hasApplied = appliedJobIds.has(job.id);
              return (
                <motion.div 
                  layout
                  key={job.id} 
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  whileHover={{ y: -8 }}
                  className="bg-[#0F1115] border border-white/5 rounded-[40px] p-8 hover:border-primary/40 transition-all group relative overflow-hidden flex flex-col h-full shadow-2xl"
                >
                  <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
                    <Briefcase size={100} />
                  </div>
                  
                  <div className="relative z-10 flex flex-col h-full gap-8">
                    <div className="flex justify-between items-start">
                       <div className="w-16 h-16 rounded-[24px] bg-gradient-to-br from-white/10 to-transparent border border-white/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-500 shadow-lg">
                          <Building2 size={28} />
                       </div>
                       <div className="flex flex-col items-end gap-2">
                          <span className="px-5 py-2 bg-primary/10 border border-primary/20 rounded-full text-[10px] font-black text-primary uppercase tracking-widest">
                             {job.category || 'GENERAL'}
                          </span>
                          {hasApplied && (
                            <span className="flex items-center gap-1.5 text-[9px] font-black text-emerald-500 uppercase tracking-widest">
                               <CheckCircle size={12} /> Verified Application
                            </span>
                          )}
                       </div>
                    </div>

                    <div className="space-y-3">
                       <h3 className="text-[20px] font-black text-white uppercase tracking-tight leading-tight line-clamp-2 min-h-[3rem]">
                          {job.title}
                       </h3>
                       <p className="text-[12px] font-black text-primary uppercase tracking-widest opacity-80">
                          {job.company_name || job.business_name || 'Marketplace Growth'}
                       </p>
                    </div>

                    <div className="grid grid-cols-2 gap-3 pb-6 border-b border-white/5">
                       <div className="flex items-center gap-3 text-muted-foreground bg-white/[0.02] p-4 rounded-3xl border border-white/[0.03]">
                          <MapPin size={16} className="text-primary/70 shrink-0" />
                          <span className="text-[11px] font-bold uppercase tracking-widest truncate">{job.location}</span>
                       </div>
                       <div className="flex items-center gap-3 text-muted-foreground bg-white/[0.02] p-4 rounded-3xl border border-white/[0.03]">
                          <Banknote size={16} className="text-primary/70 shrink-0" />
                          <span className="text-[11px] font-bold uppercase tracking-widest truncate">₹{Number(job.salary).toLocaleString()}</span>
                       </div>
                    </div>

                    <div className="flex-1">
                       <p className="text-[13px] font-medium text-muted-foreground leading-relaxed italic opacity-80 line-clamp-3">
                         "{job.description}"
                       </p>
                    </div>

                    <div className="flex items-center gap-4">
                       <button 
                         onClick={() => {
                           setSelectedJob(job);
                           setIsDetailModalOpen(true);
                         }}
                         className="flex-1 py-5 rounded-[24px] bg-white/[0.05] border border-white/10 text-[11px] font-black uppercase tracking-widest text-white hover:bg-white hover:text-black transition-all"
                       >
                         Details
                       </button>
                       {!isAdmin && (
                         <button 
                           disabled={hasApplied}
                           onClick={() => {
                             setSelectedJob(job);
                             setIsApplyModalOpen(true);
                           }}
                           className={`flex-[2] py-5 rounded-[24px] text-[11px] font-black uppercase tracking-widest transition-all shadow-xl shadow-primary/20 flex items-center justify-center gap-3 ${
                               hasApplied 
                               ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 shadow-none' 
                               : 'bg-primary text-primary-foreground hover:scale-[1.02] active:scale-95'
                           }`}
                         >
                           {hasApplied ? <><CheckCircle size={16} /> Applied</> : <>Apply Now <ChevronRight size={14} /></>}
                         </button>
                       )}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>

      {/* Add Job Modal (Admin) */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[300] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="absolute inset-0 bg-background/80 backdrop-blur-xl"
            />
            
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="w-full max-w-2xl bg-card border border-border rounded-[32px] shadow-2xl relative z-10 overflow-hidden"
            >
              <div className="px-8 py-6 border-b border-border flex items-center justify-between bg-muted/20">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
                    <BriefcaseBusiness size={20} />
                  </div>
                  <div>
                    <h2 className="text-[14px] font-black uppercase tracking-[0.2em] text-foreground">Post New Job</h2>
                    <p className="text-[9px] font-black text-muted-foreground uppercase tracking-widest opacity-60">Complete the details below</p>
                  </div>
                </div>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="p-2 hover:bg-secondary rounded-xl text-muted-foreground hover:text-foreground transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="p-8 space-y-6">
                {status.message && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    className={[
                      "px-4 py-3 rounded-2xl border text-[11px] font-black uppercase tracking-wider flex items-center gap-3",
                      status.type === "success"
                        ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-300"
                        : "bg-rose-500/10 border-rose-500/20 text-rose-300",
                    ].join(" ")}
                  >
                    {status.type === "success" ? <CheckCircle size={16} /> : <AlertCircle size={16} />}
                    <span className="leading-snug">{status.message}</span>
                  </motion.div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">
                      Job Title
                    </label>
                    <input
                      type="text"
                      name="title"
                      placeholder="ENTER JOB TITLE..."
                      value={formData.title}
                      onChange={handleChange}
                      className="w-full bg-secondary/50 border border-border rounded-2xl px-5 py-4 text-[12px] font-black uppercase tracking-widest text-foreground focus:outline-none focus:border-primary/50 transition-colors placeholder:text-muted-foreground/40"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">
                      Location
                    </label>
                    <input
                      type="text"
                      name="location"
                      placeholder="ENTER LOCATION..."
                      value={formData.location}
                      onChange={handleChange}
                      className="w-full bg-secondary/50 border border-border rounded-2xl px-5 py-4 text-[12px] font-black uppercase tracking-widest text-foreground focus:outline-none focus:border-primary/50 transition-colors placeholder:text-muted-foreground/40"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">
                    Job Description
                  </label>
                  <textarea
                    name="description"
                    placeholder="DESCRIBE RESPONSIBILITIES, REQUIREMENTS, AND BENEFITS..."
                    value={formData.description}
                    onChange={handleChange}
                    rows={4}
                    className="w-full bg-secondary/50 border border-border rounded-2xl px-5 py-4 text-[12px] font-bold tracking-wide text-foreground focus:outline-none focus:border-primary/50 transition-colors placeholder:text-muted-foreground/40 resize-none"
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">
                      Salary
                    </label>
                    <input
                      type="number"
                      name="salary"
                      placeholder="e.g., 80000"
                      value={formData.salary}
                      onChange={handleChange}
                      className="w-full bg-secondary/50 border border-border rounded-2xl px-5 py-4 text-[12px] font-black uppercase tracking-widest text-foreground focus:outline-none focus:border-primary/50 transition-colors placeholder:text-muted-foreground/40"
                      required
                    />
                  </div>
                </div>

                <div className="pt-4 flex gap-4">
                   <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="flex-1 bg-secondary hover:bg-secondary/80 text-foreground font-black text-[12px] uppercase tracking-[0.2em] py-5 rounded-[20px] transition-all duration-300"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={loading || !isValid}
                    className="flex-[2] bg-primary hover:bg-primary/90 text-primary-foreground font-black text-[12px] uppercase tracking-[0.2em] py-5 rounded-[20px] transition-all duration-300 shadow-xl shadow-primary/20 flex items-center justify-center gap-3 disabled:opacity-50"
                  >
                    {loading ? (
                      <>
                        <Loader2 size={18} className="animate-spin" />
                        Processing…
                      </>
                    ) : (
                      "Post to Network"
                    )}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* View Job Details Modal */}
      <AnimatePresence>
        {isDetailModalOpen && selectedJob && (
          <div className="fixed inset-0 z-[300] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsDetailModalOpen(false)}
              className="absolute inset-0 bg-background/80 backdrop-blur-xl"
            />
            
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="w-full max-w-2xl bg-card border border-border rounded-[32px] shadow-2xl relative z-10 overflow-hidden"
            >
              <div className="px-8 py-6 border-b border-border flex items-center justify-between bg-muted/20">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
                    <BriefcaseBusiness size={20} />
                  </div>
                  <div>
                    <h2 className="text-[14px] font-black uppercase tracking-[0.2em] text-foreground">Job Opportunity</h2>
                    <p className="text-[9px] font-black text-muted-foreground uppercase tracking-widest opacity-60">Listing Details</p>
                  </div>
                </div>
                <button
                  onClick={() => setIsDetailModalOpen(false)}
                  className="p-2 hover:bg-secondary rounded-xl text-muted-foreground hover:text-foreground transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="p-8 space-y-8">
                <div>
                  <h3 className="text-2xl font-black text-foreground uppercase tracking-tight mb-4">{selectedJob.title}</h3>
                  <div className="flex flex-wrap gap-4">
                    <span className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-muted-foreground bg-secondary px-3 py-1.5 rounded-xl border border-border">
                      <MapPin size={12} className="text-primary" />
                      {selectedJob.location}
                    </span>
                    <span className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-muted-foreground bg-secondary px-3 py-1.5 rounded-xl border border-border">
                      <Banknote size={12} className="text-primary" />
                      ${Number(selectedJob.salary).toLocaleString()}
                    </span>
                    <span className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-muted-foreground bg-secondary px-3 py-1.5 rounded-xl border border-border">
                      <Clock size={12} className="text-primary" />
                      Posted on {new Date(selectedJob.created_at).toLocaleDateString()}
                    </span>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="text-[10px] font-black uppercase tracking-widest text-primary">Detailed Description</h4>
                  <div className="bg-muted/30 border border-border rounded-2xl p-6">
                    <p className="text-[13px] font-bold text-foreground leading-relaxed whitespace-pre-wrap italic">
                      "{selectedJob.description}"
                    </p>
                  </div>
                </div>

                <div className="pt-4 flex gap-4">
                  <button
                    onClick={() => setIsDetailModalOpen(false)}
                    className="flex-1 bg-secondary hover:bg-secondary/80 text-foreground font-black text-[12px] uppercase tracking-[0.2em] py-5 rounded-[20px] transition-all duration-300"
                  >
                    Close
                  </button>
                  {!isAdmin && !appliedJobIds.has(selectedJob.id) && (
                    <button
                        onClick={() => {
                            setIsDetailModalOpen(false);
                            setIsApplyModalOpen(true);
                        }}
                        className="flex-[2] bg-primary hover:bg-primary/90 text-primary-foreground font-black text-[12px] uppercase tracking-[0.2em] py-5 rounded-[20px] transition-all duration-300 shadow-xl shadow-primary/20"
                    >
                        Apply for this Role
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Detailed Application Modal */}
      <AnimatePresence>
        {isApplyModalOpen && selectedJob && (
          <div className="fixed inset-0 z-[400] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsApplyModalOpen(false)}
              className="absolute inset-0 bg-background/80 backdrop-blur-xl"
            />
            
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="w-full max-w-3xl bg-card border border-border rounded-[32px] shadow-2xl relative z-10 overflow-hidden"
            >
              <div className="px-8 py-6 border-b border-border flex items-center justify-between bg-muted/20">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
                    <Send size={20} />
                  </div>
                  <div>
                    <h2 className="text-[14px] font-black uppercase tracking-[0.2em] text-foreground">Apply for Position</h2>
                    <p className="text-[9px] font-black text-muted-foreground uppercase tracking-widest opacity-60">Role: {selectedJob.title}</p>
                  </div>
                </div>
                <button
                  onClick={() => setIsApplyModalOpen(false)}
                  className="p-2 hover:bg-secondary rounded-xl text-muted-foreground hover:text-foreground transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={handleApplySubmit} className="p-8 space-y-8 max-h-[70vh] overflow-y-auto no-scrollbar">
                {/* Status message */}
                {applyStatus.message && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={[
                      "px-6 py-4 rounded-2xl border text-[11px] font-black tracking-wider flex items-center gap-3",
                      applyStatus.type === "success"
                        ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-300"
                        : "bg-rose-500/10 border-rose-500/20 text-rose-300",
                    ].join(" ")}
                  >
                    {applyStatus.type === "success" ? <CheckCircle size={18} /> : <AlertCircle size={18} />}
                    <span className="leading-snug">{applyStatus.message}</span>
                  </motion.div>
                )}

                {/* Pre-fill notice */}
                {(user?.name || user?.email) && (
                  <div className="flex items-center gap-3 px-4 py-3 bg-primary/5 border border-primary/10 rounded-2xl">
                    <User size={14} className="text-primary shrink-0" />
                    <p className="text-[10px] font-black text-primary/70 uppercase tracking-widest">
                      Your profile details have been pre-filled. Please verify before submitting.
                    </p>
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1 flex items-center gap-2">
                        <User size={12} className="text-primary" /> Full Name <span className="text-rose-400">*</span>
                    </label>
                    <input
                      type="text"
                      name="full_name"
                      placeholder="YOUR FULL NAME..."
                      value={applyForm.full_name}
                      onChange={handleApplyChange}
                      onBlur={handleApplyBlur}
                      className={`w-full bg-secondary/50 border rounded-2xl px-5 py-4 text-[12px] font-black uppercase tracking-widest text-foreground focus:outline-none transition-colors ${
                        applyFieldErrors.full_name ? 'border-rose-500/60 focus:border-rose-500' : 'border-border focus:border-primary/50'
                      }`}
                      required
                    />
                    {applyFieldErrors.full_name && (
                      <p className="text-[9px] text-rose-400 font-black uppercase tracking-widest ml-1 flex items-center gap-1">
                        <AlertCircle size={10} /> {applyFieldErrors.full_name}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1 flex items-center gap-2">
                        <Mail size={12} className="text-primary" /> Email Address <span className="text-rose-400">*</span>
                    </label>
                    <input
                      type="email"
                      name="email"
                      placeholder="EMAIL@EXAMPLE.COM..."
                      value={applyForm.email}
                      onChange={handleApplyChange}
                      onBlur={handleApplyBlur}
                      className={`w-full bg-secondary/50 border rounded-2xl px-5 py-4 text-[12px] font-black tracking-widest text-foreground focus:outline-none transition-colors ${
                        applyFieldErrors.email ? 'border-rose-500/60 focus:border-rose-500' : 'border-border focus:border-primary/50'
                      }`}
                      required
                    />
                    {applyFieldErrors.email && (
                      <p className="text-[9px] text-rose-400 font-black uppercase tracking-widest ml-1 flex items-center gap-1">
                        <AlertCircle size={10} /> {applyFieldErrors.email}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1 flex items-center gap-2">
                        <Smartphone size={12} className="text-primary" /> Phone Number <span className="text-rose-400">*</span>
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      placeholder="+1 234 567 8900"
                      value={applyForm.phone}
                      onChange={handleApplyChange}
                      onBlur={handleApplyBlur}
                      className={`w-full bg-secondary/50 border rounded-2xl px-5 py-4 text-[12px] font-black tracking-widest text-foreground focus:outline-none transition-colors ${
                        applyFieldErrors.phone ? 'border-rose-500/60 focus:border-rose-500' : 'border-border focus:border-primary/50'
                      }`}
                      required
                    />
                    {applyFieldErrors.phone && (
                      <p className="text-[9px] text-rose-400 font-black uppercase tracking-widest ml-1 flex items-center gap-1">
                        <AlertCircle size={10} /> {applyFieldErrors.phone}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1 flex items-center gap-2">
                        <Shield size={12} className="text-primary" /> Aadhaar Card Number <span className="text-rose-400">*</span>
                    </label>
                    <input
                      type="text"
                      name="aadhaar_number"
                      placeholder="12 DIGIT AADHAAR NUMBER"
                      maxLength={12}
                      value={applyForm.aadhaar_number}
                      onChange={(e) => {
                        const val = e.target.value.replace(/\D/g, '').slice(0, 12);
                        setApplyForm(prev => ({ ...prev, aadhaar_number: val }));
                        if (applyFieldErrors.aadhaar_number) setApplyFieldErrors(prev => ({ ...prev, aadhaar_number: '' }));
                      }}
                      onBlur={handleApplyBlur}
                      className={`w-full bg-secondary/50 border rounded-2xl px-5 py-4 text-[12px] font-black uppercase tracking-widest text-foreground focus:outline-none transition-colors ${
                        applyFieldErrors.aadhaar_number ? 'border-rose-500/60 focus:border-rose-500' : 'border-border focus:border-primary/50'
                      }`}
                      required
                    />
                    {applyFieldErrors.aadhaar_number && (
                      <p className="text-[9px] text-rose-400 font-black uppercase tracking-widest ml-1 flex items-center gap-1">
                        <AlertCircle size={10} /> {applyFieldErrors.aadhaar_number}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1 flex items-center gap-2">
                        <Upload size={12} className="text-primary" /> Resume <span className="text-rose-400">*</span>
                        <span className="text-[8px] opacity-50 normal-case font-bold">(PDF/DOC/DOCX, max 10MB)</span>
                    </label>
                    <div className="relative">
                        <input
                        type="file"
                        name="resume"
                        onChange={handleApplyChange}
                        accept=".pdf,.doc,.docx"
                        className="hidden"
                        id="resume-upload"
                        required
                        />
                        <label
                            htmlFor="resume-upload"
                            className={`flex items-center justify-center gap-3 w-full border-2 border-dashed rounded-2xl px-5 py-5 cursor-pointer transition-all group ${
                              applyForm.resume
                                ? 'bg-emerald-500/10 border-emerald-500/30 hover:bg-emerald-500/20'
                                : 'bg-primary/5 border-primary/20 hover:bg-primary/10'
                            }`}
                        >
                            {applyForm.resume
                              ? <CheckCircle size={18} className="text-emerald-400 shrink-0" />
                              : <FileText size={18} className="text-primary group-hover:scale-110 transition-transform shrink-0" />
                            }
                            <div className="text-center overflow-hidden">
                              <span className={`text-[10px] font-black uppercase tracking-widest block truncate max-w-[200px] ${
                                applyForm.resume ? 'text-emerald-400' : 'text-primary'
                              }`}>
                                  {applyForm.resume ? applyForm.resume.name : 'CLICK TO UPLOAD RESUME *'}
                              </span>
                              {applyForm.resume && (
                                <span className="text-[9px] text-emerald-400/60 font-bold block mt-0.5">
                                  {(applyForm.resume.size / 1024).toFixed(0)} KB
                                </span>
                              )}
                            </div>
                        </label>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                    <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Cover Letter (Optional)</label>
                    <textarea
                        name="cover_letter"
                        value={applyForm.cover_letter}
                        onChange={handleApplyChange}
                        placeholder="WHY ARE YOU A GOOD FIT FOR THIS ROLE?..."
                        rows={5}
                        className="w-full bg-secondary/50 border border-border rounded-2xl px-5 py-4 text-[12px] font-bold tracking-wide text-foreground focus:outline-none focus:border-primary/50 transition-colors placeholder:text-muted-foreground/40 resize-none"
                    />
                </div>

                <div className="space-y-3">
                    <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Relevant Skills / Experience</label>
                    <input
                      type="text"
                      name="skills"
                      placeholder="E.G. REACT, NODE.JS, AWS..."
                      value={applyForm.skills}
                      onChange={handleApplyChange}
                      className="w-full bg-secondary/50 border border-border rounded-2xl px-5 py-4 text-[12px] font-black uppercase tracking-widest text-foreground focus:outline-none focus:border-primary/50 transition-colors"
                    />
                </div>

                {/* Structured Experience Section */}
                <div className="space-y-6">
                  <div className="flex items-center justify-between px-1">
                    <label className="text-[10px] font-black uppercase tracking-widest text-primary flex items-center gap-2">
                        <Briefcase size={14} /> Previous Work Experience
                    </label>
                    <button
                      type="button"
                      onClick={addExperience}
                      className="text-[9px] font-black uppercase tracking-widest text-primary hover:text-primary/70 flex items-center gap-1 transition-colors"
                    >
                      <Plus size={12} /> Add Entry
                    </button>
                  </div>

                  <div className="space-y-4">
                    {applyForm.experience_entries.map((exp, i) => (
                      <motion.div
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        key={i}
                        className="bg-secondary/30 border border-border rounded-2xl p-6 relative group"
                      >
                        <button
                          type="button"
                          onClick={() => removeExperience(i)}
                          className="absolute top-4 right-4 p-2 text-muted-foreground hover:text-rose-400 transition-colors"
                        >
                          <Trash2 size={14} />
                        </button>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
                          <div className="space-y-2">
                            <label className="text-[8px] font-black uppercase tracking-widest text-muted-foreground ml-1">Company</label>
                            <input
                              type="text"
                              placeholder="COMPANY NAME"
                              value={exp.company}
                              onChange={(e) => updateExperience(i, 'company', e.target.value)}
                              className="w-full bg-background/50 border border-border rounded-xl px-4 py-3 text-[11px] font-bold uppercase tracking-wider focus:outline-none focus:border-primary/30 transition-colors"
                            />
                          </div>
                          <div className="space-y-2">
                            <label className="text-[8px] font-black uppercase tracking-widest text-muted-foreground ml-1">Role</label>
                            <input
                              type="text"
                              placeholder="YOUR POSITION"
                              value={exp.role}
                              onChange={(e) => updateExperience(i, 'role', e.target.value)}
                              className="w-full bg-background/50 border border-border rounded-xl px-4 py-3 text-[11px] font-bold uppercase tracking-wider focus:outline-none focus:border-primary/30 transition-colors"
                            />
                          </div>
                          <div className="space-y-2">
                            <label className="text-[8px] font-black uppercase tracking-widest text-muted-foreground ml-1">Duration</label>
                            <input
                              type="text"
                              placeholder="E.G. 2 YEARS"
                              value={exp.duration}
                              onChange={(e) => updateExperience(i, 'duration', e.target.value)}
                              className="w-full bg-background/50 border border-border rounded-xl px-4 py-3 text-[11px] font-bold uppercase tracking-wider focus:outline-none focus:border-primary/30 transition-colors"
                            />
                          </div>
                        </div>
                      </motion.div>
                    ))}
                    {applyForm.experience_entries.length === 0 && (
                      <div className="py-8 border-2 border-dashed border-border rounded-2xl flex flex-col items-center justify-center opacity-40">
                        <Briefcase size={24} className="mb-2" />
                        <span className="text-[9px] font-black uppercase tracking-widest">No experience entries added</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Structured Internship Section */}
                <div className="space-y-6">
                  <div className="flex items-center justify-between px-1">
                    <label className="text-[10px] font-black uppercase tracking-widest text-primary flex items-center gap-2">
                        <Building2 size={14} /> Previous Internships
                    </label>
                    <button
                      type="button"
                      onClick={addInternship}
                      className="text-[9px] font-black uppercase tracking-widest text-primary hover:text-primary/70 flex items-center gap-1 transition-colors"
                    >
                      <Plus size={12} /> Add Entry
                    </button>
                  </div>

                  <div className="space-y-4">
                    {applyForm.internship_entries.map((intern, i) => (
                      <motion.div
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        key={i}
                        className="bg-secondary/30 border border-border rounded-2xl p-6 relative group"
                      >
                        <button
                          type="button"
                          onClick={() => removeInternship(i)}
                          className="absolute top-4 right-4 p-2 text-muted-foreground hover:text-rose-400 transition-colors"
                        >
                          <Trash2 size={14} />
                        </button>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
                          <div className="space-y-2">
                            <label className="text-[8px] font-black uppercase tracking-widest text-muted-foreground ml-1">Company</label>
                            <input
                              type="text"
                              placeholder="COMPANY NAME"
                              value={intern.company}
                              onChange={(e) => updateInternship(i, 'company', e.target.value)}
                              className="w-full bg-background/50 border border-border rounded-xl px-4 py-3 text-[11px] font-bold uppercase tracking-wider focus:outline-none focus:border-primary/30 transition-colors"
                            />
                          </div>
                          <div className="space-y-2">
                            <label className="text-[8px] font-black uppercase tracking-widest text-muted-foreground ml-1">Role</label>
                            <input
                              type="text"
                              placeholder="INTERN ROLE"
                              value={intern.role}
                              onChange={(e) => updateInternship(i, 'role', e.target.value)}
                              className="w-full bg-background/50 border border-border rounded-xl px-4 py-3 text-[11px] font-bold uppercase tracking-wider focus:outline-none focus:border-primary/30 transition-colors"
                            />
                          </div>
                          <div className="space-y-2">
                            <label className="text-[8px] font-black uppercase tracking-widest text-muted-foreground ml-1">Duration</label>
                            <input
                              type="text"
                              placeholder="E.G. 3 MONTHS"
                              value={intern.duration}
                              onChange={(e) => updateInternship(i, 'duration', e.target.value)}
                              className="w-full bg-background/50 border border-border rounded-xl px-4 py-3 text-[11px] font-bold uppercase tracking-wider focus:outline-none focus:border-primary/30 transition-colors"
                            />
                          </div>
                        </div>
                      </motion.div>
                    ))}
                    {applyForm.internship_entries.length === 0 && (
                      <div className="py-8 border-2 border-dashed border-border rounded-2xl flex flex-col items-center justify-center opacity-40">
                        <Building2 size={24} className="mb-2" />
                        <span className="text-[9px] font-black uppercase tracking-widest">No internship entries added</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="pt-6 flex gap-4 sticky bottom-0 bg-card py-4 mt-auto border-t border-border">
                   <button
                    type="button"
                    onClick={() => setIsApplyModalOpen(false)}
                    className="flex-1 bg-secondary hover:bg-secondary/80 text-foreground font-black text-[12px] uppercase tracking-[0.2em] py-5 rounded-[24px] transition-all duration-300 shadow-sm"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={applyLoading || !isApplyFormValid}
                    className="flex-[2] bg-primary hover:bg-primary/90 text-primary-foreground font-black text-[12px] uppercase tracking-[0.2em] py-5 rounded-[24px] transition-all duration-300 shadow-xl shadow-primary/20 flex items-center justify-center gap-3 disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    {applyLoading ? (
                      <>
                        <Loader2 size={18} className="animate-spin" />
                        SUBMITTING...
                      </>
                    ) : (
                      <>
                        <Send size={18} />
                        SUBMIT APPLICATION
                      </>
                    )}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
