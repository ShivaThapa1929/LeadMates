import React, { useState, useEffect } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import authService from "../api/authService";
import GalaxyHero from "../components/GalaxyHero";
import logo from "../assets/logo-primary.png";
import {
    EnvelopeIcon,
    DevicePhoneMobileIcon,
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
    const [step, setStep] = useState('email'); // 'email' | 'mobile'
    const [emailOtp, setEmailOtp] = useState(["", "", "", "", "", ""]);
    const [mobileOtp, setMobileOtp] = useState(["", "", "", "", "", ""]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");
    const [resendTimer, setResendTimer] = useState(30);

    const handleOtpChange = (type, index, value) => {
        if (isNaN(value)) return;
        const newOtp = type === 'email' ? [...emailOtp] : [...mobileOtp];
        newOtp[index] = value;
        if (type === 'email') setEmailOtp(newOtp);
        else setMobileOtp(newOtp);

        if (value && index < 5) {
            document.getElementById(`${type}-otp-${index + 1}`).focus();
        }
    };

    const handleKeyDown = (type, index, e) => {
        if (e.key === "Backspace" && !(type === 'email' ? emailOtp : mobileOtp)[index] && index > 0) {
            document.getElementById(`${type}-otp-${index - 1}`).focus();
        }
    };

    const handlePaste = (type, e) => {
        e.preventDefault();
        const data = e.clipboardData.getData("text").slice(0, 6).split("");
        if (data.length === 6 && data.every(char => !isNaN(char))) {
            if (type === 'email') setEmailOtp(data);
            else setMobileOtp(data);
            document.getElementById(`${type}-otp-5`)?.focus();
        }
    };

    useEffect(() => {
        if (!userId) {
            navigate("/signup");
            return;
        }

        // Persist email/phone if they came in via state
        if (stateParams.email) localStorage.setItem('verify_email', stateParams.email);
        if (stateParams.phone) localStorage.setItem('verify_phone', stateParams.phone);

        // Timer countdown
        const timer = setInterval(() => {
            setResendTimer((prev) => (prev > 0 ? prev - 1 : 0));
        }, 1000);

        return () => clearInterval(timer);
    }, [userId, navigate]);

    // Handle verifying Email OTP
    const handleVerifyEmail = async (e) => {
        e.preventDefault();
        const otpStr = emailOtp.join("");
        if (otpStr.length !== 6) return setError("Enter 6-digit code");

        setError("");
        setIsLoading(true);
        try {
            const response = await authService.verifyOtp(userId, otpStr, undefined);
            if (response.success) {
                if (response.data.status === 'complete') {
                    navigate("/dashboard");
                } else {
                    setStep('mobile');
                    setResendTimer(30);
                }
            }
        } catch (err) {
            setError(err.message || "Email verification failed.");
        } finally {
            setIsLoading(false);
        }
    };

    // Handle verifying Mobile OTP
    const handleVerifyMobile = async (e) => {
        e.preventDefault();
        const otpStr = mobileOtp.join("");
        if (otpStr.length !== 6) return setError("Enter 6-digit code");

        setError("");
        setIsLoading(true);
        try {
            // Use the new standalone verification for mobile Step 2
            const response = await authService.verifyMobileOtp(userId, otpStr);
            if (response.success) {
                navigate("/dashboard");
            }
        } catch (err) {
            setError(err.message || "Mobile verification failed.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleResend = async () => {
        if (resendTimer > 0) return;
        try {
            if (step === 'email') {
                await authService.resendOtp(userId, 'email');
            } else {
                await authService.resendMobileOtp(userId, phone);
            }
            setResendTimer(30);
            setError("");
        } catch (err) {
            setError(err.message || "Failed to resend OTP.");
        }
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
                            {step === 'email' ? 'Verify Email' : 'Verify Mobile'}
                        </h2>
                        <p className="text-gray-400 text-sm">
                            Enter the code sent to <br />
                            <span className="text-blue-400 font-mono">
                                {step === 'email' ? email : phone}
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

                    <AnimatePresence mode="wait">
                        {step === 'email' ? (
                            <motion.form
                                key="email-form"
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 20 }}
                                onSubmit={handleVerifyEmail}
                                className="space-y-8"
                            >
                                <div className="space-y-4">
                                    <div className="flex justify-between items-center mb-2">
                                        <label className="text-xs uppercase tracking-wider text-gray-500 font-bold ml-1">Email OTP</label>
                                        <button
                                            type="button"
                                            onClick={handleResend}
                                            disabled={resendTimer > 0}
                                            className={`text-[10px] font-bold uppercase tracking-wider ${resendTimer > 0 ? 'text-gray-600' : 'text-blue-500 hover:text-blue-400'} transition-colors`}
                                        >
                                            {resendTimer > 0 ? `Resend in ${resendTimer}s` : 'Resend Code'}
                                        </button>
                                    </div>
                                    <div className="flex justify-between gap-2" onPaste={(e) => handlePaste('email', e)}>
                                        {emailOtp.map((digit, index) => (
                                            <input
                                                key={index}
                                                id={`email-otp-${index}`}
                                                type="text"
                                                maxLength="1"
                                                value={digit}
                                                onChange={(e) => handleOtpChange('email', index, e.target.value)}
                                                onKeyDown={(e) => handleKeyDown('email', index, e)}
                                                className="w-10 h-12 bg-white/5 border border-white/10 rounded-xl text-center text-lg font-bold text-white focus:border-blue-500 outline-none transition-all"
                                            />
                                        ))}
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    disabled={isLoading || emailOtp.some(d => !d)}
                                    className="w-full h-14 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-2xl font-black uppercase tracking-widest transition-all flex items-center justify-center gap-3 shadow-xl shadow-blue-600/20"
                                >
                                    {isLoading ? (
                                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    ) : (
                                        <>
                                            VERIFY EMAIL
                                            <ArrowRightIcon className="w-5 h-5" />
                                        </>
                                    )}
                                </button>
                            </motion.form>
                        ) : (
                            <motion.form
                                key="mobile-form"
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 20 }}
                                onSubmit={handleVerifyMobile}
                                className="space-y-8"
                            >
                                <div className="space-y-4">
                                    <div className="flex justify-between items-center mb-2">
                                        <label className="text-xs uppercase tracking-wider text-gray-500 font-bold ml-1">Mobile OTP</label>
                                        <button
                                            type="button"
                                            onClick={handleResend}
                                            disabled={resendTimer > 0}
                                            className={`text-[10px] font-bold uppercase tracking-wider ${resendTimer > 0 ? 'text-gray-600' : 'text-blue-500 hover:text-blue-400'} transition-colors`}
                                        >
                                            {resendTimer > 0 ? `Resend in ${resendTimer}s` : 'Resend Code'}
                                        </button>
                                    </div>
                                    <div className="flex justify-between gap-2" onPaste={(e) => handlePaste('mobile', e)}>
                                        {mobileOtp.map((digit, index) => (
                                            <input
                                                key={index}
                                                id={`mobile-otp-${index}`}
                                                type="text"
                                                maxLength="1"
                                                value={digit}
                                                onChange={(e) => handleOtpChange('mobile', index, e.target.value)}
                                                onKeyDown={(e) => handleKeyDown('mobile', index, e)}
                                                className="w-10 h-12 bg-white/5 border border-white/10 rounded-xl text-center text-lg font-bold text-white focus:border-emerald-500 outline-none transition-all"
                                            />
                                        ))}
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    disabled={isLoading || mobileOtp.some(d => !d)}
                                    className="w-full h-14 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-2xl font-black uppercase tracking-widest transition-all flex items-center justify-center gap-3 shadow-xl shadow-emerald-600/20"
                                >
                                    {isLoading ? (
                                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    ) : (
                                        <>
                                            FINALIZE REGISTRATION
                                            <CheckCircleIcon className="w-5 h-5" />
                                        </>
                                    )}
                                </button>
                            </motion.form>
                        )}
                    </AnimatePresence>

                    {/* Step Indicators */}
                    <div className="flex justify-center gap-2 mt-8">
                        <div className={`h-1.5 rounded-full transition-all duration-300 ${step === 'email' ? 'w-8 bg-blue-500' : 'w-2 bg-gray-700'}`} />
                        <div className={`h-1.5 rounded-full transition-all duration-300 ${step === 'mobile' ? 'w-8 bg-emerald-500' : 'w-2 bg-gray-700'}`} />
                    </div>
                </div>
            </motion.div>
        </div>
    );
}
