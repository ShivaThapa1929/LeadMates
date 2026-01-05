// src/App.js
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

import logo from "./assets/logo (1).png"; 
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import UseCases from "./pages/UseCases";
import Pricing from "./pages/Pricing";
import Docs from "./pages/Docs";
import Contact from "./pages/Contact";
import FeaturesPage from "./sections/Features";
import WhyLeadMates from "./sections/WhyLeadMates";
import SocialProof from "./sections/SocialProof";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import WorkflowPage from "./pages/WorkFlow";
import NotFound from "./pages/NotFound";

// 1. IMPORT THE NEW CURSOR
import CustomCursor from "./components/CustomCursor"; 

export default function App() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 2400); 
    return () => clearTimeout(timer);
  }, []);

  return (
    <Router>
      {/* 2. ADD CURSOR HERE - It should only show after loading */}
      {!loading && <CustomCursor />}

      <AnimatePresence mode="wait">
        {loading ? (
          <motion.div
            key="loader"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 1.1, filter: "blur(10px)" }}
            transition={{ duration: 0.8, ease: "circOut" }}
            className="fixed inset-0 bg-[#0B0D10] flex flex-col justify-center items-center z-[999] overflow-hidden"
          >
            {/* AMBIENCE */}
            <motion.div 
              animate={{ 
                scale: [1, 1.2, 1],
                backgroundColor: ["rgba(37, 99, 235, 0.15)", "rgba(37, 99, 235, 0.30)", "rgba(37, 99, 235, 0.15)"]
              }}
              transition={{ duration: 4, repeat: Infinity }}
              className="absolute w-64 h-64 md:w-125 md:h-125 blur-[100px] rounded-full"
            />

            {/* SCANNING LINE */}
            <motion.div 
              initial={{ top: "-10%" }}
              animate={{ top: "110%" }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              style={{ background: "linear-gradient(to right, transparent, rgba(59, 130, 246, 0.4), transparent)" }}
              className="absolute left-0 w-full h-0.5 z-10"
            />

            {/* LOGO & TEXT */}
            <div className="relative flex flex-col items-center z-20">
              <div className="relative">
                <motion.img
                  src={logo}
                  alt="LeadMates Logo"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="w-20 h-20 md:w-28 md:h-28 object-contain relative z-20"
                />
                <motion.div 
                  animate={{ rotate: 360 }}
                  transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                  style={{ borderColor: "rgba(59, 130, 246, 0.3)" }}
                  className="absolute -inset-4 border rounded-full border-t-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.2)]"
                />
              </div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="mt-10 text-center"
              >
                <h1 className="text-3xl md:text-5xl font-black text-white tracking-[-0.05em]">
                  Lead<span className="text-blue-500">Mates</span>
                </h1>
                <motion.p 
                  animate={{ opacity: [0, 1, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                  className="mt-4 text-[10px] text-blue-400 font-bold uppercase tracking-[0.6em] ml-2"
                >
                  Initializing Cluster...
                </motion.p>
              </motion.div>

              {/* Precise Loading Bar */}
              <div className="mt-8 w-48 h-px bg-white/10 relative overflow-hidden">
                <motion.div 
                  initial={{ left: "-100%" }}
                  animate={{ left: "100%" }}
                  transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                  style={{ background: "linear-gradient(to right, transparent, #3b82f6, transparent)" }}
                  className="absolute top-0 w-24 h-full"
                />
              </div>
            </div>

            <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center opacity-[0.03] pointer-events-none" />
          </motion.div>
        ) : (
    <motion.div 
        key="main-site"
        initial={{ opacity: 0 }} 
        animate={{ opacity: 1 }} 
        transition={{ duration: 1 }}
        className="relative min-h-screen flex flex-col cursor-none overflow-hidden" 
      >
            <Navbar />
            <main className="flex-grow pt-20">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/features" element={<FeaturesPage />} />
                <Route path="/socialproof" element={<SocialProof />} />
                <Route path="/use-cases" element={<UseCases />} />
                <Route path="/pricing" element={<Pricing />} />
                <Route path="/why-leadmates" element={<WhyLeadMates />} />
                <Route path="/docs" element={<Docs />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/privacy" element={<PrivacyPolicy />} />
                <Route path="/get-access" element={<WorkflowPage />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </main>
            <Footer />
          </motion.div>
        )}
      </AnimatePresence>
    </Router>
  );
}