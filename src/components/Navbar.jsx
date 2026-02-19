import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import logo from "../assets/logo-primary.png";
import authService from "../api/authService";
import { useTheme } from "../context/ThemeContext";
import { Sun, Moon } from "lucide-react";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [user, setUser] = useState(null);
  const { isDarkMode, toggleTheme } = useTheme();
  const location = useLocation();

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

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "Why LeadMates", path: "/why-leadmates" },
    { name: "Pricing", path: "/pricing" },
    { name: "Use Cases", path: "/use-cases" },
    { name: "Docs", path: "/docs" },
  ];

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
                      <Link
                        to={item.path}
                        className={`text-[28px] font-bold transition-colors tracking-tight ${isActive ? "text-blue-500" : "text-white"
                          }`}
                      >
                        {item.name}
                      </Link>
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
