import React, { useMemo, useRef, useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import logo from "../assets/logo-primary.png";
import captureLeadImg from "../assets/product-capture-lead.svg";
import captureJobsImg from "../assets/product-capture-jobs.svg";
import authService from "../api/authService";
import { useTheme } from "../context/ThemeContext";
import { ChevronDown } from "lucide-react";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [user, setUser] = useState(null);
  const { isDarkMode, toggleTheme } = useTheme();
  const location = useLocation();
  const [productsOpen, setProductsOpen] = useState(false);
  const productsCloseTimer = useRef(null);

  useEffect(() => {
    const currentUser = authService.getCurrentUser();
    setUser(currentUser);
  }, [location]);

  const handleLogout = async () => {
    await authService.logout();
    setUser(null);
    window.location.href = "/";
  };

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Scroll to top on route change, but SKIP initial load to allow browser scroll restoration
  const isFirstRun = React.useRef(true);
  useEffect(() => {
    if (isFirstRun.current) {
      isFirstRun.current = false;
      return;
    }
    window.scrollTo(0, 0);
    setMobileMenuOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    document.body.style.overflow = mobileMenuOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [mobileMenuOpen]);

  const navLinks = useMemo(() => {
    return [
      { name: "Home", path: "/" },
      { name: "Why LeadMates", path: "/why-leadmates" },
      { name: "Our Products", path: "/our-products", kind: "dropdown" },
      { name: "Pricing", path: "/pricing" },
      { name: "Use Cases", path: "/use-cases" },
      { name: "Docs", path: "/docs" },
    ];
  }, []);

  const productLinks = useMemo(() => {
    return [
      {
        name: "CaptureLead",
        description: "Add leads into your mainframe",
        path: "/dashboard/capture-lead",
        image: captureLeadImg,
      },
      {
        name: "CaptureJobs",
        description: "Publish job listings to the network",
        path: "/dashboard/post-job",
        image: captureJobsImg,
      },
    ];
  }, []);

  const openProducts = () => {
    if (productsCloseTimer.current) clearTimeout(productsCloseTimer.current);
    setProductsOpen(true);
  };

  const closeProductsSoon = () => {
    if (productsCloseTimer.current) clearTimeout(productsCloseTimer.current);
    productsCloseTimer.current = setTimeout(() => setProductsOpen(false), 120);
  };

  const isHomePage = location.pathname === "/";

  return (
    <>
      <header
        className={`fixed top-0 left-0 w-full z-[100] transition-all duration-500 ${mobileMenuOpen
          ? "bg-background py-4"
          : (scrolled || !isHomePage)
            ? "bg-background/95 backdrop-blur-md py-4 border-b border-white/5"
            : "bg-transparent py-6"
          }`}
      >
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between relative z-[110]">

          <Link to="/" className="flex items-center gap-2 group">
            <img src={logo} alt="Logo" className="w-6 h-6 object-contain" />
            <span className="text-base font-bold text-foreground tracking-tight">
              Lead<span className="text-blue-500">Mates</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-8">
            {navLinks.map((item) => {
              const isActive = location.pathname === item.path;
              if (item.kind === "dropdown") {
                const isProductsActive = location.pathname === item.path;
                return (
                  <div
                    key={item.name}
                    className="relative"
                    onMouseEnter={openProducts}
                    onMouseLeave={closeProductsSoon}
                    onFocus={openProducts}
                    onBlur={closeProductsSoon}
                  >
                    <Link
                      to={item.path}
                      className={`relative text-xs font-bold uppercase tracking-widest transition-colors group py-1 inline-flex items-center gap-2 ${isProductsActive ? "text-foreground" : "text-muted-foreground hover:text-foreground"
                        }`}
                      aria-haspopup="menu"
                      aria-expanded={productsOpen}
                    >
                      {item.name}
                      <ChevronDown
                        size={14}
                        className={`transition-transform duration-200 ${productsOpen ? "rotate-180" : ""}`}
                      />
                      <span
                        className={`absolute bottom-0 left-0 h-[2px] bg-blue-500 transition-all duration-300 ease-out ${isProductsActive ? "w-full" : "w-0 group-hover:w-full"
                          }`}
                      />
                    </Link>

                    <AnimatePresence>
                      {productsOpen && (
                        <motion.div
                          initial={{ opacity: 0, y: 10, scale: 0.98, filter: "blur(8px)" }}
                          animate={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
                          exit={{ opacity: 0, y: 8, scale: 0.99, filter: "blur(8px)" }}
                          transition={{ duration: 0.22, ease: "easeOut" }}
                          className="absolute left-1/2 -translate-x-1/2 top-[calc(100%+18px)] w-[560px] rounded-3xl bg-background/95 backdrop-blur-xl border border-white/10 shadow-2xl overflow-hidden"
                          role="menu"
                        >
                          <div className="p-5 bg-white/[0.02] border-b border-white/10">
                            <p className="text-[10px] font-black uppercase tracking-[0.35em] text-muted-foreground">
                              Products
                            </p>
                          </div>

                          <div className="p-5 grid grid-cols-2 gap-4">
                            {productLinks.map((p) => (
                              <Link
                                key={p.name}
                                to={p.path}
                                role="menuitem"
                                className="group rounded-2xl border border-white/10 bg-white/[0.02] hover:bg-white/[0.04] transition-colors overflow-hidden"
                                onClick={() => setProductsOpen(false)}
                              >
                                <div className="h-28 w-full overflow-hidden bg-black/20">
                                  <img
                                    src={p.image}
                                    alt={`${p.name} preview`}
                                    className="w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-opacity"
                                    loading="lazy"
                                  />
                                </div>
                                <div className="p-4">
                                  <div className="flex items-center justify-between gap-3">
                                    <h4 className="text-[12px] font-black uppercase tracking-widest text-foreground">
                                      {p.name}
                                    </h4>
                                    <span className="text-[9px] font-black uppercase tracking-widest text-blue-400 opacity-70 group-hover:opacity-100 transition-opacity">
                                      Open
                                    </span>
                                  </div>
                                  <p className="mt-2 text-[10px] font-bold text-muted-foreground uppercase tracking-tight opacity-80 leading-snug">
                                    {p.description}
                                  </p>
                                </div>
                              </Link>
                            ))}
                          </div>

                          <div className="px-5 pb-5">
                            <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-4 flex items-center justify-between gap-4">
                              <div>
                                <p className="text-[10px] font-black uppercase tracking-widest text-foreground">
                                  Looking for all modules?
                                </p>
                                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-tight opacity-70 mt-1">
                                  Browse full catalog on the products page.
                                </p>
                              </div>
                              <Link
                                to="/our-products"
                                className="shrink-0 h-10 px-5 rounded-full bg-blue-600 text-white text-[10px] font-black uppercase tracking-widest flex items-center justify-center hover:bg-blue-500 transition-colors"
                                onClick={() => setProductsOpen(false)}
                              >
                                View All
                              </Link>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              }

              return (
                <Link
                  key={item.name}
                  to={item.path}
                  className={`relative text-xs font-bold uppercase tracking-widest transition-colors group py-1 ${isActive ? "text-foreground" : "text-muted-foreground hover:text-foreground"
                    }`}
                >
                  {item.name}
                  <span
                    className={`absolute bottom-0 left-0 h-[2px] bg-blue-500 transition-all duration-300 ease-out ${isActive ? "w-full" : "w-0 group-hover:w-full"
                      }`}
                  />
                </Link>
              );
            })}
          </nav>

          <div className="hidden lg:flex items-center gap-4">

            {user ? (
              <>
                <Link
                  to="/dashboard"
                  className="h-10 px-6 text-muted-foreground text-xs font-bold tracking-widest uppercase hover:text-foreground transition-all flex items-center justify-center"
                >
                  Dashboard
                </Link>
                <button
                  onClick={handleLogout}
                  className="h-10 px-6 bg-red-600/10 border border-red-500/20 text-red-500 rounded-full text-xs font-black uppercase tracking-widest hover:bg-red-500 hover:text-white transition-all flex items-center justify-center"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="h-10 px-6 text-muted-foreground text-xs font-bold tracking-widest uppercase hover:text-foreground transition-all flex items-center justify-center"
                >
                  Sign In
                </Link>
                <Link
                  to="/signup"
                  className="h-10 px-6 bg-blue-600 text-white rounded-full text-xs font-black uppercase tracking-widest shadow-lg shadow-blue-600/20 hover:bg-blue-500 transition-all flex items-center justify-center"
                >
                  Get Access
                </Link>
              </>
            )}
          </div>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden flex flex-col gap-1.5 items-end p-2"
          >
            <motion.span animate={mobileMenuOpen ? { rotate: 45, y: 6 } : { rotate: 0, y: 0 }} className="w-6 h-0.5 bg-foreground rounded-full" />
            <motion.span animate={mobileMenuOpen ? { opacity: 0 } : { opacity: 1 }} className="w-4 h-0.5 bg-foreground rounded-full" />
            <motion.span animate={mobileMenuOpen ? { rotate: -45, y: -6 } : { rotate: 0, y: 0 }} className="w-6 h-0.5 bg-foreground rounded-full" />
          </button>
        </div>

        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[105] bg-background flex flex-col overflow-y-auto custom-scrollbar"
            >
              <div className="flex flex-col min-h-full pt-28 pb-12 px-8">
                {/* 1. NAVIGATION LINKS CONTAINER */}
                {navLinks.map((item, i) => {
                  const isActive = location.pathname === item.path;
                  return (
                    <motion.div
                      key={item.name}
                      initial={{ y: 10, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: i * 0.05 }}
                    >
                      {item.kind === "dropdown" ? (
                        <div className="mt-2">
                          <Link
                            to={item.path}
                            className={`text-[28px] font-bold transition-colors tracking-tight ${isActive ? "text-blue-500" : "text-white"
                              }`}
                          >
                            {item.name}
                          </Link>
                          <div className="mt-5 grid grid-cols-1 gap-4">
                            {productLinks.map((p) => (
                              <Link
                                key={p.name}
                                to={p.path}
                                className="rounded-2xl border border-white/10 bg-white/[0.02] overflow-hidden hover:bg-white/[0.04] transition-colors"
                              >
                                <div className="h-24 overflow-hidden bg-black/20">
                                  <img src={p.image} alt={`${p.name} preview`} className="w-full h-full object-cover opacity-95" loading="lazy" />
                                </div>
                                <div className="p-4">
                                  <div className="text-[12px] font-black uppercase tracking-widest text-white">{p.name}</div>
                                  <div className="text-[10px] font-bold uppercase tracking-tight text-white/60 mt-1">{p.description}</div>
                                </div>
                              </Link>
                            ))}
                          </div>
                        </div>
                      ) : (
                        <Link
                          to={item.path}
                          className={`text-[28px] font-bold transition-colors tracking-tight ${isActive ? "text-blue-500" : "text-white"
                            }`}
                        >
                          {item.name}
                        </Link>
                      )}
                    </motion.div>
                  );
                })}

                {/* 2. BUTTONS CONTAINER WITH TOP PADDING */}
                <div className="mt-auto pt-14 flex flex-col items-center gap-4 w-full">
                  {user ? (
                    <>
                      <Link
                        to="/dashboard"
                        className="w-full max-w-sm h-14 bg-blue-600 text-white rounded-2xl flex items-center justify-center font-bold text-xs uppercase tracking-[0.2em] shadow-[0_10px_40px_-10px_rgba(37,99,235,0.5)] active:scale-[0.98] transition-all"
                      >
                        Dashboard
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="w-full max-w-sm h-14 border border-red-500/20 text-red-500 rounded-2xl font-bold text-xs uppercase tracking-[0.2em] active:bg-red-500/10 transition-all flex items-center justify-center"
                      >
                        Sign Out
                      </button>
                    </>
                  ) : (
                    <>
                      <Link
                        to="/login"
                        className="w-full max-w-sm h-14 border border-white/10 text-white rounded-2xl font-bold text-xs uppercase tracking-[0.2em] active:bg-white/5 transition-all flex items-center justify-center"
                      >
                        Sign In
                      </Link>

                      <Link
                        to="/signup"
                        className="w-full h-14 bg-blue-600 text-white rounded-2xl flex items-center justify-center font-bold text-xs uppercase tracking-[0.2em] shadow-[0_10px_40px_-10px_rgba(37,99,235,0.5)] active:scale-[0.98] transition-all"
                      >
                        Get Access
                      </Link>
                    </>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>
    </>
  );
}
