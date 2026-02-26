import React, { useState, useEffect } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import authService from "../api/authService";
import logo from "../assets/logo-primary.png";
import GalaxyHero from "../components/GalaxyHero";
import { ArrowRightIcon, ArrowPathIcon } from "@heroicons/react/24/outline";

export default function Login2FAPage() {
    const navigate = useNavigate();
    const location = useLocation();
    // Support both state (navigation) and persistent storage (refresh)
    const stored2fa = JSON.parse(localStorage.getItem('temp2fa') || "{}");
    const tempToken = location.state?.tempToken || stored2fa.tempToken;
    const userId = location.state?.userId || stored2fa.userId;
    const email = location.state?.email || stored2fa.email;
    const channel = location.state?.channel || stored2fa.channel;
    const initialMessage = location.state?.message || stored2fa.message;

    const [otp, setOtp] = useState(["", "", "", "", "", ""]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [timeLeft, setTimeLeft] = useState(30);

    // Redirect if no token found even after checking storage
    useEffect(() => {
        if (!tempToken) {
            navigate("/login");
        }
    }, [tempToken, navigate]);

    // Countdown timer for Resend
    useEffect(() => {
        if (timeLeft > 0) {
            const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
            return () => clearTimeout(timer);
        }
    }, [timeLeft]);

    const handleChange = (index, value) => {
        if (isNaN(value)) return;
        const newOtp = [...otp];
        newOtp[index] = value;
        setOtp(newOtp);

        if (value && index < 5) {
            document.getElementById(`otp-${index + 1}`).focus();
        }
    };

    const handlePaste = (e) => {
        e.preventDefault();
        const data = e.clipboardData.getData("text").slice(0, 6).split("");
        if (data.length === 6 && data.every(char => !isNaN(char))) {
            setOtp(data);
            document.getElementById(`otp-5`)?.focus();
        }
    };

    const handleKeyDown = (index, e) => {
        if (e.key === "Backspace" && !otp[index] && index > 0) {
            document.getElementById(`otp-${index - 1}`).focus();
        }
    };

    const handleResend = async () => {
        if (timeLeft > 0) return;
        try {
            setIsLoading(true);
            setError("");
            setSuccess("");
            // If channel is 'both', we default resend to email for simplicity, 
            // or we could show a modal to choose. Let's send to email as primary.
            const resendType = 'login';
            const response = await authService.resendOtp(userId, resendType);
            setSuccess(response.message || "Verification code resent successfully!");
            setTimeLeft(30);
        } catch (err) {
            setError(err.message || 'Failed to resend OTP');
            setSuccess("");
        } finally {
            setIsLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (otp.some(digit => !digit)) return;

        setIsLoading(true);
        setError("");
        try {
            await authService.verifyLogin2FA(tempToken, otp.join(""));
            sessionStorage.setItem('showWelcome', 'true');
            localStorage.removeItem('temp2fa'); // Clear temp storage on success
            const user = JSON.parse(localStorage.getItem('user'));
            if (user?.roles?.includes('Admin')) {
                navigate("/admin/dashboard");
            } else {
                navigate("/dashboard");
            }
        } catch (err) {
            setError(err.message || "Invalid OTP Code");
        } finally {
            setIsLoading(false);
        }
    };

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
                {/* Logo Section */}
                <div className="flex flex-col items-center mb-8">
                    <Link to="/" className="flex items-center gap-2 mb-2">
                        <img src={logo} alt="LeadMates Logo" className="w-10 h-10 object-contain" />
                        <span className="text-2xl font-black text-white tracking-tighter">
                            Lead<span className="text-blue-500">Mates</span>
                        </span>
                    </Link>
                    <p className="text-gray-500 text-xs font-bold uppercase tracking-[0.3em]">Security Check</p>
                </div>

                {/* Card */}
                <div className="bg-background border border-blue-500/20 rounded-[2.5rem] p-6 sm:p-10 shadow-[0_0_50px_-12px_rgba(59,130,246,0.15)] backdrop-blur-3xl">
                    <div className="text-center mb-8">
                        <h1 className="text-xl sm:text-2xl font-black text-white mb-2 tracking-tight">Two-Factor Authentication</h1>
                        <p className="text-gray-400 text-xs sm:text-sm">
                            {initialMessage || "Enter the 6-digit verification code sent to you."}
                        </p>
                    </div>

                    <AnimatePresence mode="wait">
                        {error && (
                            <motion.div
                                key="error-msg"
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
                        {success && !error && (
                            <motion.div
                                key="success-msg"
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: "auto" }}
                                exit={{ opacity: 0, height: 0 }}
                                className="mb-6 overflow-hidden"
                            >
                                <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold text-center">
                                    {success}
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    <form onSubmit={handleSubmit} className="space-y-8">
                        {/* OTP Input */}
                        <div className="flex justify-between gap-2" onPaste={handlePaste}>
                            {otp.map((digit, index) => (
                                <input
                                    key={index}
                                    id={`otp-${index}`}
                                    type="text"
                                    maxLength="1"
                                    value={digit}
                                    onChange={(e) => handleChange(index, e.target.value)}
                                    onKeyDown={(e) => handleKeyDown(index, e)}
                                    className="w-10 h-12 sm:w-12 sm:h-14 bg-white/[0.03] border border-white/10 rounded-xl text-center text-lg font-bold text-white outline-none focus:border-blue-500 focus:bg-white/[0.08] transition-all"
                                />
                            ))}
                        </div>

                        <motion.button
                            disabled={isLoading || otp.some(d => !d)}
                            whileHover={{ scale: 1.01 }}
                            whileTap={{ scale: 0.99 }}
                            type="submit"
                            className="w-full h-14 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl font-black text-[10px] sm:text-sm uppercase tracking-[0.2em] transition-all shadow-xl shadow-blue-600/20 disabled:opacity-40 flex items-center justify-center gap-3"
                        >
                            {isLoading ? (
                                <>
                                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    VERIFYING...
                                </>
                            ) : (
                                <>
                                    VERIFY LOGIN
                                    <ArrowRightIcon className="w-4 h-4" />
                                </>
                            )}
                        </motion.button>
                    </form>

                    <div className="mt-8 text-center">
                        <button
                            onClick={handleResend}
                            disabled={timeLeft > 0 || isLoading}
                            className="flex items-center justify-center gap-2 mx-auto text-[10px] font-black uppercase tracking-widest text-gray-500 hover:text-white transition-colors disabled:opacity-50"
                        >
                            <ArrowPathIcon className={`w-3 h-3 ${isLoading ? 'animate-spin' : ''}`} />
                            {timeLeft > 0 ? `Resend Code in 00:${timeLeft < 10 ? `0${timeLeft}` : timeLeft}` : "Resend Verification Code"}
                        </button>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}
