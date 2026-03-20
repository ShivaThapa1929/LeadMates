import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import captureLeadImg from "../assets/product-capture-lead.svg";
import captureJobsImg from "../assets/product-capture-jobs.svg";

export default function OurProducts() {
  const products = [
    {
      name: "CaptureLead",
      description: "Capture new entities into your lead stream with structured fields and validation.",
      href: "/dashboard/capture-lead",
      image: captureLeadImg,
      accent: "from-blue-600/30 to-cyan-400/10",
    },
    {
      name: "CaptureJobs",
      description: "Post job listings with a consistent, branded workflow inside your dashboard.",
      href: "/dashboard/post-job",
      image: captureJobsImg,
      accent: "from-blue-600/30 to-indigo-400/10",
    },
  ];

  return (
    <main className="relative bg-background min-h-screen text-foreground pt-36 pb-32 overflow-hidden">
      {/* Ambient background */}
      <motion.div
        animate={{ opacity: [0.05, 0.12, 0.05], scale: [1, 1.15, 1] }}
        transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-0 right-1/4 w-[620px] h-[620px] bg-blue-600/10 blur-[170px] pointer-events-none"
      />
      <motion.div
        animate={{ opacity: [0.04, 0.14, 0.04], scale: [1.2, 1, 1.2] }}
        transition={{ duration: 16, repeat: Infinity, ease: "easeInOut" }}
        className="absolute bottom-0 left-1/4 w-[520px] h-[520px] bg-indigo-600/10 blur-[160px] pointer-events-none"
      />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <motion.section
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-[10px] font-black uppercase tracking-[0.3em] mb-6 shadow-[0_0_20px_rgba(59,130,246,0.15)]">
            View All
          </div>
          <h1 className="text-5xl md:text-6xl font-black tracking-tighter leading-tight">
            Our <span className="text-blue-500">Products</span>
          </h1>
          <p className="mt-5 text-muted-foreground max-w-2xl mx-auto text-base md:text-lg font-bold opacity-80 leading-relaxed">
            Two core modules to power lead capture and job publishing, designed to match your LeadMates theme.
          </p>
        </motion.section>

        <section className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {products.map((p, i) => (
            <motion.div
              key={p.name}
              initial={{ opacity: 0, y: 26 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08, duration: 0.6 }}
              whileHover={{ y: -8 }}
              className="group relative rounded-[2.5rem] border border-white/10 bg-white/[0.01] backdrop-blur-3xl overflow-hidden"
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${p.accent} opacity-60 pointer-events-none`} />

              <div className="relative">
                <div className="h-56 w-full overflow-hidden bg-black/20">
                  <img
                    src={p.image}
                    alt={`${p.name} preview`}
                    className="w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-opacity"
                    loading="lazy"
                  />
                </div>

                <div className="p-8">
                  <div className="flex items-center justify-between gap-4">
                    <h3 className="text-xl md:text-2xl font-black tracking-tight text-white uppercase">
                      {p.name}
                    </h3>
                    <span className="text-[10px] font-black uppercase tracking-[0.3em] text-blue-400 opacity-70 group-hover:opacity-100 transition-opacity">
                      Module
                    </span>
                  </div>

                  <p className="mt-4 text-[12px] md:text-sm font-bold text-gray-400 leading-relaxed">
                    {p.description}
                  </p>

                  <div className="mt-8 flex items-center gap-4">
                    <Link
                      to={p.href}
                      className="h-11 px-6 rounded-full bg-blue-600 text-white text-[11px] font-black uppercase tracking-widest shadow-lg shadow-blue-600/20 hover:bg-blue-500 transition-colors inline-flex items-center justify-center"
                    >
                      Open
                    </Link>
                    <Link
                      to="/our-products"
                      className="h-11 px-6 rounded-full border border-white/10 text-white/80 text-[11px] font-black uppercase tracking-widest hover:bg-white/[0.03] transition-colors inline-flex items-center justify-center"
                    >
                      Details
                    </Link>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </section>

        <div className="mt-20 pt-16 border-t border-white/5 text-center">
          <p className="text-gray-600 text-[10px] font-black uppercase tracking-[0.5em]">
            LeadMates product catalog — core modules
          </p>
        </div>
      </div>
    </main>
  );
}

