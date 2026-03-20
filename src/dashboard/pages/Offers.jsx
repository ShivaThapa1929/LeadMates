import { useEffect, useMemo, useState } from "react";
import { Tag, Loader2, CheckCircle, AlertCircle, ShoppingBag, Banknote, Clock, Plus, X, Laptop } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import authService from "../../api/authService";

export default function Offers() {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    price: "",
  });

  const [selectedOffer, setSelectedOffer] = useState(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);


  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState({ type: "", message: "" });
  const [offers, setOffers] = useState([]);
  const [offersLoading, setOffersLoading] = useState(true);
  const [offersError, setOffersError] = useState("");

  const fetchOffers = async () => {
    setOffersError("");
    setOffersLoading(true);
    try {
      const res = await authService.api.get("/offers");
      const list = res.data?.data || [];
      setOffers(Array.isArray(list) ? list : []);
    } catch (err) {
      setOffersError(err.response?.data?.message || "Failed to load offers.");
    } finally {
      setOffersLoading(false);
    }
  };

  useEffect(() => {
    fetchOffers();
  }, []);

  const isValid = useMemo(() => {
    return (
      formData.title.trim().length > 0 &&
      formData.description.trim().length > 0 &&
      formData.category.trim().length > 0 &&
      String(formData.price).trim().length > 0
    );
  }, [formData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (status.message) setStatus({ type: "", message: "" });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isValid || loading) return;

    setLoading(true);
    setStatus({ type: "", message: "" });

    try {
      const res = await authService.api.post("/offers/post-offer", formData);
      setStatus({ type: "success", message: res.data?.message || "Offer posted successfully." });
      setFormData({ title: "", description: "", category: "", price: "" });
      await fetchOffers();
      // Close modal after a short delay on success
      setTimeout(() => {
        setIsModalOpen(false);
        setStatus({ type: "", message: "" });
      }, 2000);
    } catch (error) {
      setStatus({
        type: "error",
        message: error.response?.data?.message || "Error posting offer",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-foreground tracking-tight uppercase flex items-center gap-3">
            <Tag className="text-primary" size={28} />
            Network <span className="text-primary">Offers</span>
          </h1>
          <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mt-2 opacity-60">
            Browse exclusive deals and service offers in the ecosystem
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-3 bg-primary hover:bg-primary/90 text-primary-foreground px-6 py-4 rounded-[20px] transition-all duration-300 shadow-xl shadow-primary/20 hover:shadow-primary/30 active:scale-95"
        >
          <Plus size={20} className="font-black" />
          <span className="text-[12px] font-black uppercase tracking-[0.2em]">Add Offer</span>
        </button>
      </div>

      {/* Stats / Status Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
         <div className="bg-card border border-border p-6 rounded-[24px] shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
               <ShoppingBag size={24} />
            </div>
            <div>
               <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Total Offers</p>
               <h3 className="text-xl font-black text-foreground">{offers.length}</h3>
            </div>
         </div>
      </div>

      {/* Offers List Section */}
      <div className="bg-card border border-border rounded-[32px] overflow-hidden shadow-premium min-h-[400px]">
        <div className="px-6 sm:px-8 py-6 border-b border-border flex items-center justify-between bg-muted/20">
          <div>
            <h2 className="text-[12px] font-black uppercase tracking-[0.3em] text-foreground">
              Marketplace Deals
            </h2>
            <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mt-1 opacity-60">
              {offersLoading ? "Synchronizing database..." : `${offers.length} offers available`}
            </p>
          </div>
          <button
            type="button"
            onClick={fetchOffers}
            disabled={offersLoading}
            className="h-10 px-5 rounded-2xl bg-secondary border border-border text-muted-foreground hover:text-foreground transition-all text-[10px] font-black uppercase tracking-widest disabled:opacity-60"
          >
            {offersLoading ? "Refreshing…" : "Refresh List"}
          </button>
        </div>

        {offersError && (
          <div className="px-6 sm:px-8 py-4 border-b border-border bg-rose-500/10 text-rose-300 text-[11px] font-black uppercase tracking-wider flex items-center gap-3">
            <AlertCircle size={16} />
            {offersError}
          </div>
        )}

        {offersLoading ? (
          <div className="p-32 flex flex-col items-center justify-center gap-4">
            <div className="relative">
              <Loader2 className="animate-spin text-primary" size={40} />
              <div className="absolute inset-0 blur-xl bg-primary/20 rounded-full" />
            </div>
            <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest animate-pulse">
              Fetching Network Data…
            </span>
          </div>
        ) : offers.length === 0 ? (
          <div className="p-32 text-center">
            <div className="w-20 h-20 rounded-[2rem] bg-secondary border border-border flex items-center justify-center mx-auto mb-6 text-muted-foreground/20">
              <Tag size={40} />
            </div>
            <h3 className="text-[14px] font-black text-foreground uppercase tracking-[0.2em] mb-2">No Offers Found</h3>
            <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest max-w-[200px] mx-auto opacity-60">
              Be the first to post a special offer to the network.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-0 divide-y divide-x divide-border/50">
            {offers.map((offer) => (
              <div key={offer.id} className="p-8 hover:bg-muted/10 transition-all group relative overflow-hidden flex flex-col h-full border-b border-r last:border-r-0">
                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 blur-[50px] opacity-0 group-hover:opacity-100 transition-opacity" />
                
                <div className="relative z-10 flex flex-col h-full">
                  <div className="flex items-start justify-between mb-6">
                    <div className="w-12 h-12 rounded-2xl bg-secondary border border-border flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors duration-300 shadow-sm">
                      <Tag size={20} />
                    </div>
                    <div className="px-3 py-1 bg-primary/10 border border-primary/20 rounded-lg">
                       <span className="text-[9px] font-black text-primary uppercase tracking-widest">Active Deal</span>
                    </div>
                  </div>

                  <div className="space-y-4 flex-1">
                    <div>
                      <h3 className="text-[16px] font-black text-foreground uppercase tracking-tight leading-tight group-hover:text-primary transition-colors">
                        {offer.title}
                      </h3>
                      <div className="mt-2 flex flex-wrap gap-3">
                         <span className="inline-flex items-center gap-1.5 text-[9px] font-black uppercase tracking-widest text-muted-foreground bg-secondary/50 px-2 py-0.5 rounded-md">
                            <Laptop size={10} className="text-primary/70" />
                            {offer.category}
                         </span>
                         <span className="inline-flex items-center gap-1.5 text-[9px] font-black uppercase tracking-widest text-muted-foreground bg-secondary/50 px-2 py-0.5 rounded-md">
                            <Banknote size={10} className="text-primary/70" />
                            {Number(offer.price).toLocaleString()}
                         </span>
                      </div>
                    </div>

                    <p className="text-[12px] font-bold text-muted-foreground leading-relaxed line-clamp-3 italic opacity-80">
                      "{offer.description}"
                    </p>
                  </div>

                  <div className="mt-8 pt-6 border-t border-border/50 flex items-center justify-between">
                     <span className="text-[9px] font-black text-muted-foreground/50 uppercase tracking-widest flex items-center gap-2">
                        <Clock size={10} />
                        {offer.created_at ? new Date(offer.created_at).toLocaleDateString() : "—"}
                     </span>
                      <button 
                        onClick={() => {
                          setSelectedOffer(offer);
                          setIsDetailModalOpen(true);
                        }}
                        className="text-[10px] font-black text-primary uppercase tracking-widest hover:underline active:scale-95 transition-all"
                      >
                        View Details
                      </button>

                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add Offer Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
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
                    <Tag size={20} />
                  </div>
                  <div>
                    <h2 className="text-[14px] font-black uppercase tracking-[0.2em] text-foreground">Post New Offer</h2>
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
                      Offer Title
                    </label>
                    <input
                      type="text"
                      name="title"
                      placeholder="ENTER OFFER TITLE..."
                      value={formData.title}
                      onChange={handleChange}
                      className="w-full bg-secondary/50 border border-border rounded-2xl px-5 py-4 text-[12px] font-black uppercase tracking-widest text-foreground focus:outline-none focus:border-primary/50 transition-colors placeholder:text-muted-foreground/40"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">
                      Category
                    </label>
                    <input
                      type="text"
                      name="category"
                      placeholder="ENTER CATEGORY (e.g. Software, Service)..."
                      value={formData.category}
                      onChange={handleChange}
                      className="w-full bg-secondary/50 border border-border rounded-2xl px-5 py-4 text-[12px] font-black uppercase tracking-widest text-foreground focus:outline-none focus:border-primary/50 transition-colors placeholder:text-muted-foreground/40"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">
                    Offer Description
                  </label>
                  <textarea
                    name="description"
                    placeholder="DESCRIBE THE OFFER, TERMS, AND HOW TO CLAIM..."
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
                      Price / Discount Value
                    </label>
                    <input
                      type="number"
                      name="price"
                      placeholder="e.g., 999"
                      value={formData.price}
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

      {/* View Offer Details Modal */}
      <AnimatePresence>
        {isDetailModalOpen && selectedOffer && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
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
                    <Tag size={20} />
                  </div>
                  <div>
                    <h2 className="text-[14px] font-black uppercase tracking-[0.2em] text-foreground">Special Offer</h2>
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
                  <h3 className="text-2xl font-black text-foreground uppercase tracking-tight mb-4">{selectedOffer.title}</h3>
                  <div className="flex flex-wrap gap-4">
                    <span className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-muted-foreground bg-secondary px-3 py-1.5 rounded-xl border border-border">
                      <Laptop size={12} className="text-primary" />
                      {selectedOffer.category}
                    </span>
                    <span className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-muted-foreground bg-secondary px-3 py-1.5 rounded-xl border border-border">
                      <Banknote size={12} className="text-primary" />
                      ${Number(selectedOffer.price).toLocaleString()}
                    </span>
                    <span className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-muted-foreground bg-secondary px-3 py-1.5 rounded-xl border border-border">
                      <Clock size={12} className="text-primary" />
                      Posted on {new Date(selectedOffer.created_at).toLocaleDateString()}
                    </span>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="text-[10px] font-black uppercase tracking-widest text-primary">Detailed Description</h4>
                  <div className="bg-muted/30 border border-border rounded-2xl p-6">
                    <p className="text-[13px] font-bold text-foreground leading-relaxed whitespace-pre-wrap italic">
                      "{selectedOffer.description}"
                    </p>
                  </div>
                </div>

                <div className="pt-4">
                  <button
                    onClick={() => setIsDetailModalOpen(false)}
                    className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-black text-[12px] uppercase tracking-[0.2em] py-5 rounded-[20px] transition-all duration-300 shadow-xl shadow-primary/20"
                  >
                    Close Details
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>

  );
}
