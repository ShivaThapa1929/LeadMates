import React, { useState, useEffect } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import authService from "../api/authService";
import logo from "../assets/logo-primary.png";
import GalaxyHero from "../components/GalaxyHero";

import { EyeIcon, EyeSlashIcon, ArrowRightIcon } from "@heroicons/react/24/outline";

export default function LoginPage() {
    const navigate = useNavigate();
    const location = useLocation();
    const { selectedPlan, roleType } = location.state || {};

    const [formData, setFormData] = useState({ email: "", password: "" });
    const [fieldErrors, setFieldErrors] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [statusMsg, setStatusMsg] = useState(location.state?.message || "");

    useEffect(() => {
        if (location.state?.message) {
            setStatusMsg(location.state.message);
            // Clear location state after reading
            window.history.replaceState({}, document.title);
        }
    }, [location.state]);

    const validateField = (name, value) => {
        if (!value.trim()) return "Email and password are required";
        if (name === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return "Email and password are required";
        if (name === 'password' && value.length < 8) return "Email and password are required";
        return "";
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
        if (fieldErrors[name]) {
            setFieldErrors({ ...fieldErrors, [name]: "" });
        }
    };

    const handleBlur = (e) => {
        const { name, value } = e.target;
        const error = validateField(name, value);
        setFieldErrors(prev => ({ ...prev, [name]: error }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.email || !formData.password || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email) || formData.password.length < 8) {
            setError("Email and password are required");
            setFieldErrors({
                email: !formData.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email) ? "Email and password are required" : "",
                password: !formData.password || formData.password.length < 8 ? "Email and password are required" : ""
            });
            return;
        }

        setIsLoading(true);
        setError("");
        try {
            const response = await authService.login(formData.email, formData.password);
            
            let user = response.data.user;

            sessionStorage.setItem('showWelcome', 'true');

            if (selectedPlan) {
                navigate('/checkout', { state: { plan: selectedPlan, roleType: roleType } });
            } else if (user.roles.includes('Admin') || roleType === 'admin') {
                navigate("/admin/dashboard");
            } else {
                navigate("/dashboard");
            }
        } catch (err) {
            const errorMessage = err.errors && Array.isArray(err.errors) && err.errors.length > 0
                ? err.errors[0].message || err.errors[0].msg
                : err.message || "Invalid email or password";
            setError(errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    const loginValid = formData.email && formData.password && !fieldErrors.email && !fieldErrors.password;

    return (
        <div className="min-h-screen w-full flex items-center justify-center bg-background relative overflow-hidden px-4">
            {/* Background Animation */}
            <div className="absolute inset-0 z-0">
                <GalaxyHero simple={true} />
            </div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="relative w-full max-w-[440px] z-10"
            >
                {/* Logo Section */}
                <div className="flex flex-col items-center mb-8">
                    <Link to="/" className="flex items-center gap-2 mb-2">
                        <img src={logo} alt="LeadMates Logo" className="w-10 h-10 object-contain" />
                        <span className="text-2xl font-black text-white tracking-tighter">
                            Lead<span className="text-blue-500">Mates</span>
                        </span>
                    </Link>
                    <p className="text-gray-500 text-xs font-bold uppercase tracking-[0.3em]">Operational Portal</p>
                </div>

                {/* Card */}
                <div className="bg-background border border-blue-500/20 rounded-[2.5rem] p-6 sm:p-10 shadow-[0_0_50px_-12px_rgba(59,130,246,0.15)] backdrop-blur-3xl relative overflow-visible">

                    <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 px-4 py-1 bg-blue-600 text-white text-[9px] font-black uppercase tracking-widest rounded-full shadow-[0_0_20px_rgba(37,99,235,0.4)]">
                        {selectedPlan ? `AUTHENTICATING FOR ${selectedPlan}` : "SECURE ACCESS"}
                    </div>

                    <div className="text-center mb-8 sm:mb-10">
                        <h1 className="text-xl sm:text-2xl font-black text-white mb-2 tracking-tight">Welcome Back</h1>
                        <p className="text-gray-400 text-xs sm:text-sm">Access your lead management dashboard</p>
                    </div>

                    <AnimatePresence mode="wait">
                        {error && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: "auto" }}
                                exit={{ opacity: 0, height: 0 }}
                                className="mb-6 overflow-hidden"
                            >
                                <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs font-bold text-center">
                                    {error}
                                </div>
                            </motion.div>
                        )}

                        {statusMsg && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: "auto" }}
                                exit={{ opacity: 0, height: 0 }}
                                className="mb-6 overflow-hidden"
                            >
                                <div className="p-4 rounded-xl bg-green-500/10 border border-green-500/20 text-green-400 text-[10px] font-black uppercase tracking-wider text-center">
                                    {statusMsg}
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-1">
                            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-600 ml-1">Email Address</label>
                            <input
                                type="email"
                                name="email"
                                required
                                value={formData.email}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                placeholder="name@company.com"
                                className={`w-full h-14 bg-white/[0.03] border rounded-2xl px-5 text-white text-sm outline-none transition-all placeholder:text-gray-800 ${fieldErrors.email ? 'border-rose-500/50 ring-4 ring-rose-500/10' : 'border-white/5 focus:border-blue-500/50 focus:ring-4 focus:ring-blue-500/10'}`}
                            />
                            {fieldErrors.email && <p className="text-[10px] text-rose-500 font-bold ml-1">{fieldErrors.email}</p>}
                        </div>

                        <div className="space-y-1">
                            <div className="flex justify-between items-center ml-1">
                                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-600">Password</label>
                                <Link to="/forgot-password" title="Recover Access" className="text-[10px] font-black uppercase tracking-[0.1em] text-blue-500 hover:text-blue-400 transition-colors">Forgot?</Link>
                            </div>
                            <div className="relative group">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    name="password"
                                    required
                                    value={formData.password}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    placeholder="••••••••••••"
                                    className={`w-full h-14 bg-white/[0.03] border rounded-2xl pl-5 pr-12 text-white text-sm outline-none transition-all placeholder:text-gray-800 ${fieldErrors.password ? 'border-rose-500/50 ring-4 ring-rose-500/10' : 'border-white/5 focus:border-blue-500/50 focus:ring-4 focus:ring-blue-500/10'}`}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-700 hover:text-blue-500 transition-colors"
                                >
                                    {showPassword ? <EyeSlashIcon className="w-5 h-5" /> : <EyeIcon className="w-5 h-5" />}
                                </button>
                            </div>
                            {fieldErrors.password && <p className="text-[10px] text-rose-500 font-bold ml-1">{fieldErrors.password}</p>}
                        </div>

                        <motion.button
                            disabled={isLoading || !loginValid}
                            whileHover={{ scale: 1.01 }}
                            whileTap={{ scale: 0.99 }}
                            type="submit"
                            className="w-full h-14 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl font-black text-[10px] sm:text-sm uppercase tracking-[0.2em] transition-all shadow-xl shadow-blue-600/20 disabled:opacity-40 flex items-center justify-center gap-3"
                        >
                            {isLoading ? (
                                <>
                                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    AUTHENTICATING...
                                </>
                            ) : (
                                <>
                                    LOGIN
                                    <ArrowRightIcon className="w-4 h-4" />
                                </>
                            )}
                        </motion.button>
                    </form>

                    <div className="mt-8 sm:mt-10 text-center">
                        <p className="text-gray-600 text-[10px] sm:text-xs font-bold uppercase tracking-wider">
                            Don't have an account?{" "}
                            <Link to="/signup" className="text-blue-500 hover:text-blue-400 font-black transition-colors">Sign Up</Link>
                        </p>
                    </div>
                </div>

                <div className="mt-8 text-center flex items-center justify-center gap-6">
                    <span className="text-[10px] font-black text-gray-600 uppercase tracking-widest">v2.4.0 Stable</span>
                    <span className="w-1 h-1 bg-gray-800 rounded-full" />
                    <span className="text-[10px] font-black text-gray-600 uppercase tracking-widest text-[#22C55E]">System Online</span>
                </div>
            </motion.div>
        </div>
    );
}
