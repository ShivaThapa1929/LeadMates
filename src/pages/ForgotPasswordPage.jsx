import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { EnvelopeIcon, ArrowLeftIcon, CheckCircleIcon } from "@heroicons/react/24/outline";
import logo from "../assets/logo-primary.png";
import authService from "../api/authService";

export default function ForgotPasswordPage() {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [error, setError] = useState("");

    const handleEmailChange = (e) => {
        setEmail(e.target.value);
        if (error) setError("");
    };

    const validateEmail = (email) => {
        return email.includes("@") && email.includes(".");
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateEmail(email)) {
            setError("Please enter a valid email address");
            return;
        }

        setIsLoading(true);
        setError("");

        try {
            await authService.forgotPassword(email);
            setIsSubmitted(true);
        } catch (err) {
            setError(err.message || "Something went wrong. Please try again later.");
        } finally {
            setIsLoading(false);
        }
    };

    const isEmailValid = validateEmail(email);

    return (
        <div className="min-h-screen w-full flex items-center justify-center bg-[#0B0D10] relative overflow-hidden px-4">
            {/* Background Ambience */}
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/10 blur-[120px] rounded-full" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-900/10 blur-[120px] rounded-full" />

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
                    <p className="text-gray-500 text-[10px] font-black uppercase tracking-[0.4em]">Security Node</p>
                </div>

                {/* Card */}
                <div className="bg-[#121418] border border-white/10 rounded-[2rem] p-6 sm:p-10 shadow-2xl backdrop-blur-3xl relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-600 to-blue-400" />

                    <AnimatePresence mode="wait">
                        {!isSubmitted ? (
                            <motion.div
                                key="request"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                transition={{ duration: 0.3 }}
                            >
                                <div className="text-center mb-8 sm:mb-10">
                                    <h1 className="text-xl sm:text-2xl font-black text-white mb-2 tracking-tight">Forgot Password?</h1>
                                    <p className="text-gray-400 text-xs sm:text-sm">
                                        Enter your registered email to receive a password reset link
                                    </p>
                                </div>

                                {error && (
                                    <motion.div
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: "auto" }}
                                        className="mb-6 overflow-hidden"
                                    >
                                        <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs font-bold text-center">
                                            {error}
                                        </div>
                                    </motion.div>
                                )}

                                <form onSubmit={handleSubmit} className="space-y-6">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 ml-1">Work Email</label>
                                        <div className="relative group">
                                            <EnvelopeIcon className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-600 group-focus-within:text-blue-500 transition-colors" />
                                            <input
                                                type="email"
                                                name="email"
                                                required
                                                value={email}
                                                onChange={handleEmailChange}
                                                placeholder="name@company.com"
                                                className="w-full h-14 bg-white/5 border border-white/10 rounded-2xl pl-12 pr-5 text-white text-sm outline-none focus:border-blue-500/50 focus:ring-4 focus:ring-blue-500/10 transition-all placeholder:text-gray-700"
                                            />
                                        </div>
                                    </div>

                                    <motion.button
                                        disabled={isLoading || !isEmailValid}
                                        whileHover={{ scale: 1.01 }}
                                        whileTap={{ scale: 0.99 }}
                                        type="submit"
                                        className="w-full h-14 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl font-black text-sm uppercase tracking-[0.2em] transition-all shadow-xl shadow-blue-600/20 disabled:opacity-40 flex items-center justify-center gap-3"
                                    >
                                        {isLoading ? (
                                            <>
                                                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                                Processing...
                                            </>
                                        ) : "Send Reset Link"}
                                    </motion.button>
                                </form>
                            </motion.div>
                        ) : (
                            <motion.div
                                key="success"
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 0.4 }}
                                className="text-center py-4"
                            >
                                <div className="w-16 h-16 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl flex items-center justify-center mx-auto mb-6">
                                    <CheckCircleIcon className="w-10 h-10 text-emerald-500" />
                                </div>
                                <h1 className="text-xl sm:text-2xl font-black text-white mb-3 tracking-tight">Email Dispatched</h1>
                                <p className="text-gray-400 text-sm leading-relaxed mb-8">
                                    If this email exists in our secure cluster, a password reset link has been sent to <span className="text-white font-bold">{email}</span>.
                                </p>
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: 0.5 }}
                                >
                                    <Link
                                        to="/login"
                                        className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-blue-500 hover:text-blue-400 underline underline-offset-8 decoration-blue-500/30"
                                    >
                                        Proceed to Login
                                    </Link>
                                </motion.div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {!isSubmitted && (
                        <div className="mt-8 sm:mt-10 text-center">
                            <Link
                                to="/login"
                                className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-gray-500 hover:text-white transition-colors group"
                            >
                                <ArrowLeftIcon className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform" />
                                Back to Login
                            </Link>
                        </div>
                    )}
                </div>

                <div className="mt-8 text-center flex items-center justify-center gap-6">
                    <span className="text-[10px] font-black text-gray-600 uppercase tracking-widest">v2.4.0 Static</span>
                    <span className="w-1 h-1 bg-gray-800 rounded-full" />
                    <span className="text-[10px] font-black text-gray-600 uppercase tracking-widest text-blue-500">Encrypted</span>
                </div>
            </motion.div>
        </div>
    );
}
