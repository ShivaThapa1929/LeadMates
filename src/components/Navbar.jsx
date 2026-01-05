// src/components/Navbar.jsx
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import logo from "../assets/Leadmate-Logo.png"; 
import SignInModal from "../components/SignInModel"; 

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isSignInOpen, setIsSignInOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
    setMobileMenuOpen(false);
  }, [location]);

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

  return (
    <>
      <header 
        className={`fixed top-0 left-0 w-full z-[100] transition-all duration-500 ${
          mobileMenuOpen 
            ? "bg-[#0B0D10] py-4" 
            : scrolled 
              ? "bg-transparent backdrop-blur-sm py-4" 
              : "bg-transparent py-6"
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between relative z-[110]">
          
          <Link to="/" className="flex items-center gap-2 group">
            <img src={logo} alt="Logo" className="w-6 h-6 object-contain" />
            <span className="text-base font-bold text-white tracking-tight">
              Lead<span className="text-blue-500">Mates</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-8">
            {navLinks.map((item) => (
              <Link 
                key={item.name} 
                to={item.path} 
                className="relative text-[10px] font-bold uppercase tracking-widest text-gray-400 hover:text-white transition-colors group py-1"
              >
                {item.name}
                <span className="absolute bottom-0 left-0 w-0 h-[2px] bg-blue-500 transition-all duration-300 ease-out group-hover:w-full" />
              </Link>
            ))}
          </nav>

          <div className="hidden lg:flex items-center gap-4">
            <button 
              onClick={() => setIsSignInOpen(true)}
              className="h-10 px-6 text-gray-400 text-[10px] font-bold tracking-widest uppercase hover:text-white transition-all"
            >
              Sign In
            </button>
            
            {/* DESKTOP REDIRECT LINK - UPDATED TO PRICING */}
            <Link
              to="/pricing"
              className="h-10 px-6 bg-blue-600 text-white rounded-full text-[10px] font-black uppercase tracking-widest shadow-lg shadow-blue-600/20 hover:bg-blue-500 transition-all flex items-center justify-center"
            >
              Get Access
            </Link>
          </div>

          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden flex flex-col gap-1.5 items-end p-2"
          >
            <motion.span animate={mobileMenuOpen ? { rotate: 45, y: 6 } : { rotate: 0, y: 0 }} className="w-6 h-0.5 bg-white rounded-full" />
            <motion.span animate={mobileMenuOpen ? { opacity: 0 } : { opacity: 1 }} className="w-4 h-0.5 bg-white rounded-full" />
            <motion.span animate={mobileMenuOpen ? { rotate: -45, y: -6 } : { rotate: 0, y: 0 }} className="w-6 h-0.5 bg-white rounded-full" />
          </button>
        </div>

        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[105] bg-[#0B0D10] flex flex-col overflow-y-auto custom-scrollbar"
            >
              <div className="flex flex-col min-h-full pt-28 pb-12 px-8">
                {/* 1. NAVIGATION LINKS CONTAINER */}
                <nav className="flex flex-col items-center gap-9">
                  {navLinks.map((item, i) => (
                    <motion.div
                      key={item.name}
                      initial={{ y: 10, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: i * 0.05 }}
                    >
                      <Link 
                        to={item.path} 
                        className="text-[28px] font-bold text-white transition-colors active:text-blue-500 tracking-tight"
                      >
                        {item.name}
                      </Link>
                    </motion.div>
                  ))}
                </nav>

                {/* 2. BUTTONS CONTAINER WITH TOP PADDING */}
                {/* 'pt-14' creates the space between "Docs" and the buttons seen in your image */}
                <div className="mt-auto pt-14 flex flex-col items-center gap-4 w-full">
                  
                  {/* SIGN IN BUTTON */}
                  <motion.button 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    onClick={() => { setIsSignInOpen(true); setMobileMenuOpen(false); }}
                    className="w-full max-w-sm h-14 border border-white/10 text-gray-400 rounded-2xl font-bold text-xs uppercase tracking-[0.2em] active:bg-white/5 transition-all"
                  >
                    Sign In
                  </motion.button>

                  {/* GET ACCESS BUTTON */}
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="w-full max-w-sm"
                  >
                    <Link 
                      to="/pricing" 
                      className="w-full h-14 bg-blue-600 text-white rounded-2xl flex items-center justify-center font-bold text-xs uppercase tracking-[0.2em] shadow-[0_10px_40px_-10px_rgba(37,99,235,0.5)] active:scale-[0.98] transition-all"
                    >
                      Get Access
                    </Link>
                  </motion.div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      <SignInModal isOpen={isSignInOpen} onClose={() => setIsSignInOpen(false)} />
    </>
  );
}