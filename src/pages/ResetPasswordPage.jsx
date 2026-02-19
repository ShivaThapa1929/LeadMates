import React, { useState, useEffect } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { EyeIcon, EyeSlashIcon, CheckCircleIcon, XMarkIcon } from "@heroicons/react/24/outline";
import logo from "../assets/logo-primary.png";
import authService from "../api/authService";
import GalaxyHero from "../components/GalaxyHero";

export default function ResetPasswordPage() {
    const navigate = useNavigate();
    const location = useLocation();
    const [token, setToken] = useState("");

    const [formData, setFormData] = useState({
        password: "",
        confirmPassword: ""
    });
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        const queryParams = new URLSearchParams(location.search);
        const tokenParam = queryParams.get("token");
        if (tokenParam) {
            setToken(tokenParam);
        } else {
            setError("Invalid or missing reset token.");
        }
    }, [location]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        if (error) setError("");
    };

    // Password Validation Rules
    const validationRules = [
        { label: "At least 8 characters", valid: formData.password.length >= 8 },
        { label: "One uppercase letter", valid: /[A-Z]/.test(formData.password) },
        { label: "One lowercase letter", valid: /[a-z]/.test(formData.password) },
        { label: "One number", valid: /[0-9]/.test(formData.password) },
        { label: "One special character (!@#$%^&*)", valid: /[!@#$%^&*]/.test(formData.password) },
    ];

    const isPasswordValid = validationRules.every((rule) => rule.valid);
    const passwordsMatch = formData.password === formData.confirmPassword && formData.password !== "";

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!isPasswordValid || !passwordsMatch) return;

        setIsLoading(true);
        setError("");

        try {
            await authService.resetPassword(token, formData.password);
            setIsSuccess(true);
            setTimeout(() => navigate("/login"), 3000);
        } catch (err) {
            setError(err.message || "Failed to reset password. Token may be expired.");
        } finally {
            setIsLoading(false);
        }
    };

    if (isSuccess) {
        return (
            <div className="min-h-screen w-full flex items-center justify-center bg-background relative overflow-hidden px-4">
                <div className="absolute inset-0 z-0">
                    <GalaxyHero simple={true} />
                </div>
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="relative z-10 w-full max-w-[440px] bg-background border border-emerald-500/20 rounded-[2.5rem] p-10 text-center shadow-2xl backdrop-blur-3xl"
                >
                    <div className="w-20 h-20 bg-emerald-500/10 border border-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                        <CheckCircleIcon className="w-10 h-10 text-emerald-500" />
                    </div>
                    <h1 className="text-2xl font-black text-white mb-4 tracking-tight">Password Reset Successful</h1>
                    <p className="text-gray-400 text-sm mb-8">
                        Your password has been securely updated. Redirecting you to login...
                    </p>
                    <Link
                        to="/login"
                        className="inline-block px-8 py-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-bold uppercase tracking-widest text-xs transition-colors"
                    >
                        Login Now
                    </Link>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="min-h-screen w-full flex items-center justify-center bg-background relative overflow-hidden px-4">
            <div className="absolute inset-0 z-0">
                <GalaxyHero simple={true} />
            </div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="relative w-full max-w-[440px] z-10"
            >
                {/* Logo */}
                <div className="flex flex-col items-center mb-8">
                    <Link to="/" className="flex items-center gap-2 mb-2">
                        <img src={logo} alt="Logo" className="w-10 h-10 object-contain" />
                        <span className="text-2xl font-black text-white tracking-tighter">
                            Lead<span className="text-blue-500">Mates</span>
                        </span>
                    </Link>
                </div>

                {/* Card */}
                <div className="bg-background border border-blue-500/20 rounded-[2.5rem] p-6 sm:p-10 shadow-[0_0_50px_-12px_rgba(59,130,246,0.15)] backdrop-blur-3xl">
                    <div className="text-center mb-8">
                        <h1 className="text-xl sm:text-2xl font-black text-white mb-2 tracking-tight">Reset Password</h1>
                        <p className="text-gray-400 text-xs sm:text-sm">Create a new secure password for your account</p>
                    </div>

                    <AnimatePresence>
                        {error && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: "auto" }}
                                exit={{ opacity: 0, height: 0 }}
                                className="mb-6 overflow-hidden"
                            >
                                <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs font-bold text-center flex items-center justify-center gap-2">
                                    <XMarkIcon className="w-4 h-4" />
                                    {error}
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-4">
                            {/* New Password */}
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 ml-1">New Password</label>
                                <div className="relative">
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        name="password"
                                        value={formData.password}
                                        onChange={handleChange}
                                        className="w-full h-12 bg-white/[0.03] border border-white/10 rounded-xl px-4 pr-12 text-white text-sm outline-none focus:border-blue-500 transition-all"
                                        placeholder="••••••••••••"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white"
                                    >
                                        {showPassword ? <EyeSlashIcon className="w-4 h-4" /> : <EyeIcon className="w-4 h-4" />}
                                    </button>
                                </div>
                            </div>

                            {/* Password Strength Indicators */}
                            <div className="grid grid-cols-1 gap-2 pl-1">
                                {validationRules.map((rule, idx) => (
                                    <div key={idx} className="flex items-center gap-2">
                                        <div className={`w-1.5 h-1.5 rounded-full ${rule.valid ? "bg-emerald-500" : "bg-gray-700"}`} />
                                        <span className={`text-[10px] uppercase font-bold tracking-wider ${rule.valid ? "text-emerald-500" : "text-gray-600"}`}>
                                            {rule.label}
                                        </span>
                                    </div>
                                ))}
                            </div>

                            {/* Confirm Password */}
                            <div className="space-y-2 pt-2">
                                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 ml-1">Confirm Password</label>
                                <input
                                    type="password"
                                    name="confirmPassword"
                                    value={formData.confirmPassword}
                                    onChange={handleChange}
                                    className={`w-full h-12 bg-white/[0.03] border rounded-xl px-4 text-white text-sm outline-none transition-all ${formData.confirmPassword && !passwordsMatch ? "border-rose-500/50 focus:border-rose-500" : "border-white/10 focus:border-blue-500"
                                        }`}
                                    placeholder="••••••••••••"
                                />
                                {formData.confirmPassword && !passwordsMatch && (
                                    <p className="text-[10px] text-rose-500 font-bold ml-1 uppercase tracking-wider">Passwords do not match</p>
                                )}
                            </div>
                        </div>

                        <motion.button
                            disabled={isLoading || !isPasswordValid || !passwordsMatch || !token}
                            whileHover={{ scale: 1.01 }}
                            whileTap={{ scale: 0.99 }}
                            type="submit"
                            className="w-full h-14 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl font-black text-xs uppercase tracking-[0.2em] transition-all shadow-xl shadow-blue-600/20 disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-3"
                        >
                            {isLoading ? (
                                <>
                                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    RESETTING...
                                </>
                            ) : "RESET PASSWORD"}
                        </motion.button>
                    </form>
                </div>
            </motion.div>
        </div>
    );
}
