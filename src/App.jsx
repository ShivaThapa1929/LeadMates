import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from "react-router-dom";
import React, { useMemo, useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

import logo from "./assets/logo-primary.png";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import OtpVerificationPage from "./pages/OtpVerificationPage";

import Login2FAPage from "./pages/Login2FAPage";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import ResetPasswordPage from "./pages/ResetPasswordPage";
import UseCases from "./pages/UseCases";
import Pricing from "./pages/Pricing";
import Docs from "./pages/Docs";
import Contact from "./pages/Contact";
import FeaturesPage from "./sections/Features";
import WhyLeadMates from "./sections/WhyLeadMates";
import SocialProof from "./sections/SocialProof";
import LegalPolicy from "./pages/LegalPolicy";
import WorkflowPage from "./pages/WorkFlow";
import Checkout from "./pages/Checkout";
import NotFound from "./pages/NotFound";
import RequireAuth from "./components/RequireAuth";
import RequirePermission from "./components/RequirePermission";
import RequireRole from "./components/RequireRole";
import PublicRoute from "./components/PublicRoute";
import DashboardApp from "./dashboard/DashboardApp";
import DashboardPage from "./pages/Dashboard";
import AnalyticsPage from "./dashboard/pages/AnalyticsPage";
import LeadsPage from "./dashboard/pages/LeadsPage";
import LeadDetailsPage from "./dashboard/pages/LeadDetailsPage";
import ProjectsPage from "./dashboard/pages/ProjectsPage";
import CampaignsPage from "./dashboard/pages/CampaignsPage";
import SecuritySettings from "./dashboard/pages/SecurityPage";
import SettingsPage from "./dashboard/pages/SettingsPage";
import NotificationsPage from "./dashboard/pages/NotificationsPage";
import BillingPage from "./dashboard/pages/BillingPage";
import SuspectBlendPage from "./dashboard/pages/SuspectBlendsPage";
import ProfilePage from "./dashboard/pages/ProfilePage";
import UsersPage from "./dashboard/pages/UsersPage";
import RolesPage from "./dashboard/pages/RolesPage";
import TrashPage from "./dashboard/pages/TrashPage";
import CaptureLead from "./dashboard/pages/CaptureLead";
import DeployCampaign from "./dashboard/pages/DeployCampaign";

import CustomCursor from "./components/CustomCursor";
import { ThemeProvider } from "./context/ThemeContext";
import { SearchProvider } from "./context/SearchContext";
import { NotificationProvider } from "./context/NotificationContext";

import { ShieldCheck, X } from "lucide-react";

function Shell() {
  const location = useLocation();
  const isDashboardRoute = location.pathname.startsWith("/dashboard") || location.pathname.startsWith("/admin/dashboard");
  const isAuthRoute = ["/login", "/signup", "/forgot-password", "/checkout"].includes(location.pathname);
  const hideNavAndFooter = isDashboardRoute || isAuthRoute;
  const [showWelcome, setShowWelcome] = useState(false);

  useEffect(() => {
    const welcomeFlag = sessionStorage.getItem('siteWelcomeShown');
    if (!welcomeFlag && !isDashboardRoute) {
      const timer = setTimeout(() => {
        setShowWelcome(true);
        sessionStorage.setItem('siteWelcomeShown', 'true');
      }, 1000);
      const autoHide = setTimeout(() => setShowWelcome(false), 6000);
      return () => {
        clearTimeout(timer);
        clearTimeout(autoHide);
      };
    }
  }, [isDashboardRoute]);

  return (
    <motion.div
      key="main-site"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
      className={`relative min-h-screen flex flex-col${isDashboardRoute ? "" : " cursor-none overflow-hidden"}`}
    >
      {!hideNavAndFooter && <Navbar />}
      <main className={hideNavAndFooter ? "grow" : "grow pt-20"}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route element={<PublicRoute />}>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
            <Route path="/verify-otp" element={<OtpVerificationPage />} />
            <Route path="/auth/2fa" element={<Login2FAPage />} />
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />
            <Route path="/reset-password" element={<ResetPasswordPage />} />
          </Route>
          <Route path="/features" element={<FeaturesPage />} />
          <Route path="/socialproof" element={<SocialProof />} />
          <Route path="/use-cases" element={<UseCases />} />
          <Route path="/pricing" element={<Pricing />} />
          <Route path="/why-leadmates" element={<WhyLeadMates />} />
          <Route path="/docs" element={<Docs />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/privacy" element={<LegalPolicy />} />
          <Route path="/get-access" element={<WorkflowPage />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route element={<RequireAuth />}>
            {/* Admin Dashboard Routes */}
            <Route element={<RequireRole role="Admin" />}>
              <Route path="/admin/dashboard/*" element={<DashboardApp />}>
                <Route index element={<DashboardPage />} />
                <Route path="overview" element={<DashboardPage />} />
                <Route path="capture-lead" element={<CaptureLead />} />
                <Route path="leads" element={<LeadsPage />} />
                <Route path="leads/:id" element={<LeadDetailsPage />} />
                <Route path="projects" element={<ProjectsPage />} />
                <Route path="campaigns" element={<CampaignsPage />} />
                <Route path="deploy-campaign" element={<DeployCampaign />} />
                <Route path="analytics" element={<AnalyticsPage />} />
                <Route path="users" element={<UsersPage />} />
                <Route path="roles" element={<RolesPage />} />
                <Route path="trash" element={<TrashPage />} />
                <Route path="security" element={<SecuritySettings />} />
                <Route path="security" element={<SecuritySettings />} />
                <Route path="profile" element={<ProfilePage />} />
                <Route path="profile/settings" element={<SettingsPage />} />
                <Route path="profile/notifications" element={<NotificationsPage />} />
                <Route path="profile/billing" element={<BillingPage />} />
                <Route path="profile/security" element={<SecuritySettings />} />
              </Route>
            </Route>

            {/* User Dashboard Routes */}
            <Route path="/dashboard/*" element={<DashboardApp />}>
              <Route index element={<DashboardPage />} />
              <Route path="overview" element={<DashboardPage />} />
              <Route path="capture-lead" element={<CaptureLead />} />
              <Route path="leads" element={<LeadsPage />} />
              <Route path="leads/:id" element={<LeadDetailsPage />} />
              <Route path="projects" element={<ProjectsPage />} />
              <Route path="campaigns" element={<CampaignsPage />} />
              <Route path="deploy-campaign" element={<DeployCampaign />} />
              <Route path="analytics" element={<AnalyticsPage />} />
              <Route path="security" element={<SecuritySettings />} />
              <Route path="profile" element={<ProfilePage />} />
              <Route path="profile/settings" element={<SettingsPage />} />
              <Route path="profile/notifications" element={<NotificationsPage />} />
              <Route path="profile/billing" element={<BillingPage />} />
              <Route path="profile/security" element={<SecuritySettings />} />
            </Route>
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      {!hideNavAndFooter && <Footer />}

      {/* Main Site Welcome Notification */}
      <AnimatePresence>
        {showWelcome && (
          <motion.div
            initial={{ opacity: 0, x: 50, filter: "blur(10px)" }}
            animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
            exit={{ opacity: 0, x: 20, filter: "blur(10px)" }}
            className="fixed top-24 right-6 z-[200] max-w-[320px] w-full hidden md:block"
          >
            <div className="bg-[#121418]/80 border border-white/10 rounded-2xl p-5 shadow-2xl backdrop-blur-2xl relative overflow-hidden group">
              <div className="absolute top-0 left-0 w-1 h-full bg-blue-500" />
              <div className="flex gap-4 items-center">
                <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center shrink-0 border border-blue-500/20">
                  <ShieldCheck className="w-5 h-5 text-blue-500" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-0.5">
                    <h3 className="text-[10px] font-black text-white uppercase tracking-widest">Protocol Active</h3>
                    <button onClick={() => setShowWelcome(false)} className="text-gray-600 hover:text-white transition-colors">
                      <X size={14} />
                    </button>
                  </div>
                  <p className="text-[11px] text-gray-400 font-bold">
                    System decrypted. Welcome back to <span className="text-white">LeadMates</span>.
                  </p>
                </div>
              </div>

              <motion.div
                initial={{ scaleX: 1 }}
                animate={{ scaleX: 0 }}
                transition={{ duration: 5, ease: "linear" }}
                className="absolute bottom-0 left-0 w-full h-[1px] bg-blue-500/40 origin-left"
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default function App() {
  const [loading, setLoading] = useState(() => {
    return !sessionStorage.getItem("hasLoadedOnce");
  });

  useEffect(() => {
    if (loading) {
      const timer = setTimeout(() => {
        setLoading(false);
        sessionStorage.setItem("hasLoadedOnce", "true");
      }, 2400);
      return () => clearTimeout(timer);
    }
  }, [loading]);

  return (
    <ThemeProvider>
      <NotificationProvider>
        <SearchProvider>
          <Router>
            {!loading && <CustomCursor />}

            <AnimatePresence mode="wait">
              {loading ? (
                <motion.div
                  key="loader"
                  initial={{ opacity: 1 }}
                  exit={{ opacity: 0, scale: 1.1, filter: "blur(10px)" }}
                  transition={{ duration: 0.8, ease: "circOut" }}
                  className="fixed inset-0 bg-[#0B0D10] flex flex-col justify-center items-center z-999 overflow-hidden"
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
                <Shell key="app-shell" />
              )}
            </AnimatePresence>
          </Router>
        </SearchProvider>
      </NotificationProvider>
    </ThemeProvider>
  );
}
