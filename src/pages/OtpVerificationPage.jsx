import React, { useState, useEffect } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import authService from "../api/authService";
import GalaxyHero from "../components/GalaxyHero";
import logo from "../assets/logo-primary.png";
import {
    EnvelopeIcon,
    ArrowRightIcon,
    CheckCircleIcon,
    ExclamationCircleIcon
} from "@heroicons/react/24/outline";

export default function OtpVerificationPage() {
    const navigate = useNavigate();
    const location = useLocation();

    // Support both state (navigation) and query params (direct link/redirect)
    const stateParams = location.state || {};
    const queryParams = new URLSearchParams(location.search);

    const userId = stateParams.userId || queryParams.get('userId');
    const [email, setEmail] = useState(stateParams.email || localStorage.getItem('verify_email') || "");
    const [phone, setPhone] = useState(stateParams.phone || localStorage.getItem('verify_phone') || "");

    // Use step logic to guide the user
    // Default to email step if not specified
    const [otp, setOtp] = useState(["", "", "", "", "", ""]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");
    const [resendTimer, setResendTimer] = useState(300); // 5 minutes as per requirement
    const [successMsg, setSuccessMsg] = useState("");

    const handleOtpChange = (index, value) => {
        if (isNaN(value)) return;
        const newOtp = [...otp];
        newOtp[index] = value;
        setOtp(newOtp);

        if (value && index < 5) {
            document.getElementById(`otp-${index + 1}`).focus();
        }
    };

    const handleKeyDown = (index, e) => {
        if (e.key === "Backspace" && !otp[index] && index > 0) {
            document.getElementById(`otp-${index - 1}`).focus();
        }
    };

    const handlePaste = (e) => {
        e.preventDefault();
        const data = e.clipboardData.getData("text").trim().slice(0, 6).split("");
        if (data.length === 6 && data.every(char => !isNaN(char))) {
            setOtp(data);
            document.getElementById(`otp-5`)?.focus();
        }
    };

    useEffect(() => {
        if (!userId) {
            navigate("/signup");
            return;
        }

        // Persist email/phone if they came in via state
        if (stateParams.email) localStorage.setItem('verify_email', stateParams.email);

        // Timer countdown
        const timer = setInterval(() => {
            setResendTimer((prev) => (prev > 0 ? prev - 1 : 0));
        }, 1000);

        return () => clearInterval(timer);
    }, [userId, navigate]);

    // Handle verifying OTP
    const handleVerify = async (e) => {
        e.preventDefault();
        const otpStr = otp.join("");
        if (otpStr.length !== 6) return setError("Enter 6-digit code");

        setError("");
        setSuccessMsg("");
        setIsLoading(true);
        try {
            const response = await authService.verifyOtp(userId, otpStr, undefined);
            if (response.success && response.data.status === 'complete') {
                const user = response.data.user;
                const role = user?.role || (user?.roles && user.roles[0]);

                if (role === 'admin' || role === 'Admin') {
                    navigate("/admin/dashboard");
                } else {
                    navigate("/dashboard");
                }
            } else if (response.success) {
                // Should not happen with current backend but good for safety
                navigate("/login", { state: { message: "Account verified successfully. Please login." } });
            }
        } catch (err) {
            setError(err.message || "Verification failed.");
        } finally {
            setIsLoading(false);
        }
    };



    const handleResend = async () => {
        if (resendTimer > 0) return;
        setError("");
        setSuccessMsg("");
        try {
            await authService.resendOtp(userId, 'email');
            setResendTimer(300); // Reset to 5 minutes
            setSuccessMsg("A new verification code has been sent.");
        } catch (err) {
            setError(err.message || "Failed to resend OTP.");
        }
    };

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    return (
        <div className="min-h-screen w-full flex items-center justify-center bg-background relative overflow-hidden px-4">
            <div className="absolute inset-0 z-0">
                <GalaxyHero simple={true} />
            </div>

            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="relative w-full max-w-md z-10"
            >
                <div className="flex flex-col items-center mb-8">
                    <Link to="/" className="flex items-center gap-2 mb-2">
                        <img src={logo} alt="LeadMates Logo" className="w-10 h-10 object-contain" />
                        <span className="text-2xl font-black text-white tracking-tighter">
                            Lead<span className="text-blue-500">Mates</span>
                        </span>
                    </Link>
                    <p className="text-gray-500 text-[10px] font-black uppercase tracking-[0.4em]">Secure Verification</p>
                </div>

                <div className="bg-background border border-blue-500/20 rounded-[2rem] p-8 shadow-2xl backdrop-blur-xl transition-all duration-500">
                    <div className="text-center mb-8">
                        <h2 className="text-xl font-bold text-white mb-2">
                            Verify Your Account
                        </h2>
                        <p className="text-gray-400 text-sm">
                            Enter the 6-digit code sent to <br />
                            <span className="text-blue-400 font-mono">
                                {email}
                            </span>
                        </p>
                    </div>

                    {error && (
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="mb-6 p-3 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center gap-3 text-red-400 text-sm font-bold"
                        >
                            <ExclamationCircleIcon className="w-5 h-5 shrink-0" />
                            {error}
                        </motion.div>
                    )}

                    {successMsg && (
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="mb-6 p-3 bg-green-500/10 border border-green-500/20 rounded-xl flex items-center gap-3 text-green-400 text-sm font-bold"
                        >
                            <CheckCircleIcon className="w-5 h-5 shrink-0" />
                            {successMsg}
                        </motion.div>
                    )}

                    <form
                        onSubmit={handleVerify}
                        className="space-y-8"
                    >
                        <div className="space-y-4">
                            <div className="flex justify-between items-center mb-2">
                                <label className="text-xs uppercase tracking-wider text-gray-500 font-bold ml-1">Verification Code</label>
                                <button
                                    type="button"
                                    onClick={handleResend}
                                    disabled={resendTimer > 0}
                                    className={`text-[10px] font-bold uppercase tracking-wider ${resendTimer > 0 ? 'text-gray-600' : 'text-blue-500 hover:text-blue-400'} transition-colors`}
                                >
                                    {resendTimer > 0 ? `Resend in ${formatTime(resendTimer)}` : 'Resend Code'}
                                </button>
                            </div>
                            <div className="flex justify-between gap-2" onPaste={handlePaste}>
                                {otp.map((digit, index) => (
                                    <input
                                        key={index}
                                        id={`otp-${index}`}
                                        type="text"
                                        maxLength="1"
                                        value={digit}
                                        onChange={(e) => handleOtpChange(index, e.target.value)}
                                        onKeyDown={(e) => handleKeyDown(index, e)}
                                        className="w-10 h-12 bg-white/5 border border-white/10 rounded-xl text-center text-lg font-bold text-white focus:border-blue-500 outline-none transition-all"
                                    />
                                ))}
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading || otp.some(d => !d)}
                            className="w-full h-14 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-2xl font-black uppercase tracking-widest transition-all flex items-center justify-center gap-3 shadow-xl shadow-blue-600/20"
                        >
                            {isLoading ? (
                                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            ) : (
                                <>
                                    VERIFY ACCOUNT
                                    <ArrowRightIcon className="w-5 h-5" />
                                </>
                            )}
                        </button>
                    </form>


                </div>
            </motion.div>
        </div>
    );
}
