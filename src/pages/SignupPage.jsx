import React, { useState } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import authService from "../api/authService";
import logo from "../assets/logo-primary.png";
import GalaxyHero from "../components/GalaxyHero";
import {
    UserIcon,
    EnvelopeIcon,
    LockClosedIcon,
    BuildingOfficeIcon,
    GlobeAltIcon,
    PhoneIcon,
    ArrowRightIcon,
    ArrowLeftIcon,
    CheckCircleIcon,
    EyeIcon,
    EyeSlashIcon,
    ChevronDownIcon,
    SparklesIcon
} from "@heroicons/react/24/outline";

export default function SignupPage() {
    const navigate = useNavigate();
    const location = useLocation();
    const { selectedPlan, roleType } = location.state || {};

    const [step, setStep] = useState(1);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        businessName: "",
        website: "",
        experience: "",
        password: "",
        confirmPassword: ""
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const nextStep = () => {
        if (validateCurrentStep()) {
            setStep(s => s + 1);
            setError("");
        }
    };

    const prevStep = () => {
        setStep(s => s - 1);
        setError("");
    };

    const validateCurrentStep = () => {
        if (step === 1) {
            if (!formData.name || !formData.email || !formData.phone) {
                setError("Please fill in all personal details");
                return false;
            }
            if (!formData.email.includes("@")) {
                setError("Please enter a valid email address");
                return false;
            }
            if (!/^\+?[1-9]\d{1,14}$/.test(formData.phone)) {
                setError("Please enter a valid phone number (e.g., +15550000000)");
                return false;
            }
        } else if (step === 2) {
            if (!formData.businessName || !formData.website || !formData.experience) {
                setError("Please fill in all business details and select an industry");
                return false;
            }
            if (!/^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-])*\/?$/.test(formData.website)) {
                setError("Please enter a valid website URL");
                return false;
            }
        } else if (step === 3) {
            if (formData.password.length < 8) {
                setError("Password must be at least 8 characters");
                return false;
            }
            if (!/[a-z]/.test(formData.password)) {
                setError("Password must contain at least one lowercase letter");
                return false;
            }
            if (!/[A-Z]/.test(formData.password)) {
                setError("Password must contain at least one uppercase letter");
                return false;
            }
            if (!/[0-9]/.test(formData.password)) {
                setError("Password must contain at least one number");
                return false;
            }
            if (!/[!@#$%^&*]/.test(formData.password)) {
                setError("Password must contain at least one special character (!@#$%^&*)");
                return false;
            }
            if (formData.password !== formData.confirmPassword) {
                setError("Passwords do not match");
                return false;
            }
        }
        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateCurrentStep()) return;

        setIsLoading(true);
        setError("");
        try {
            const signupData = {
                name: formData.name,
                email: formData.email,
                password: formData.password,
                role: roleType || 'user',
                phone: formData.phone,
                businessName: formData.businessName,
                website: formData.website,
                experience: formData.experience,
                plan: selectedPlan
            };

            const response = await authService.signup(
                signupData.name,
                signupData.email,
                signupData.password,
                signupData.role,
                signupData.phone,
                signupData.businessName,
                signupData.website,
                signupData.experience,
                signupData.plan
            );

            // Navigate to OTP Verification with userId in URL to survive refreshes
            navigate(`/verify-otp?userId=${response.data?.userId}`, {
                state: {
                    userId: response.data?.userId,
                    email: signupData.email,
                    phone: signupData.phone
                }
            });
        } catch (err) {
            console.error('Signup Error Data:', err); // Log full error for debugging

            // Extract the most relevant error message
            let errorMessage = "An unexpected error occurred during signup.";

            if (err.errors && Array.isArray(err.errors)) {
                // validation errors from express-validator
                errorMessage = err.errors[0].msg || err.errors[0].message;
            } else if (err.message) {
                // standard error message
                errorMessage = err.message;
            }

            setError(errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    const stepVariants = {
        hidden: { opacity: 0, x: 20 },
        visible: { opacity: 1, x: 0 },
        exit: { opacity: 0, x: -20 }
    };

    const industries = ["SaaS / Software", "Real Estate", "Healthcare", "E-commerce"];

    return (
        <div className="min-h-screen w-full flex items-center justify-center bg-background relative overflow-hidden px-4 py-10 sm:py-20">
            {/* Background Animation */}
            <div className="absolute inset-0 z-0">
                <GalaxyHero simple={true} />
            </div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="relative w-full max-w-[550px] z-10"
            >
                {/* Logo Section */}
                <div className="flex flex-col items-center mb-8">
                    <Link to="/" className="flex items-center gap-2 mb-2">
                        <img src={logo} alt="LeadMates Logo" className="w-10 h-10 object-contain" />
                        <span className="text-2xl font-black text-white tracking-tighter">
                            Lead<span className="text-blue-500">Mates</span>
                        </span>
                    </Link>
                    <p className="text-gray-500 text-[10px] font-black uppercase tracking-[0.4em]">Initialize Connection</p>
                </div>

                {/* Card */}
                <div className="bg-background border border-blue-500/20 rounded-[3rem] p-6 sm:p-10 md:p-12 shadow-[0_0_60px_-15px_rgba(59,130,246,0.15)] backdrop-blur-3xl relative overflow-visible">

                    <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 px-4 py-1 bg-blue-600 text-white text-[9px] font-black uppercase tracking-widest rounded-full shadow-[0_0_20px_rgba(37,99,235,0.4)] whitespace-nowrap">
                        {selectedPlan ? `PHASE: ${selectedPlan}` : "PHASE INITIALIZE"}
                    </div>

                    {/* Header */}
                    <div className="mb-8 sm:mb-10">
                        <div className="flex items-baseline justify-between mb-2">
                            <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">Create Account</h1>
                            <span className="text-[9px] sm:text-[10px] font-black text-blue-500 uppercase tracking-widest">Phase 0{step} / 03</span>
                        </div>
                        <p className="text-gray-400 text-xs sm:text-sm">
                            {step === 1 ? "Start with your basic details" : step === 2 ? "Tell us about your business" : "Secure your operational portal"}
                        </p>
                    </div>

                    {/* Step Indicator */}
                    <div className="flex gap-2 mb-10">
                        {[1, 2, 3].map(i => (
                            <div
                                key={i}
                                className={`h-1 flex-1 rounded-full transition-all duration-500 ${step >= i ? "bg-blue-600 shadow-[0_0_10px_rgba(37,99,235,0.4)]" : "bg-white/5"}`}
                            />
                        ))}
                    </div>

                    <AnimatePresence mode="wait">
                        {error && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: "auto" }}
                                exit={{ opacity: 0, height: 0 }}
                                className="mb-8 overflow-hidden"
                            >
                                <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-[10px] font-bold uppercase tracking-widest text-center">
                                    {error}
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <AnimatePresence mode="wait">
                            {step === 1 && (
                                <motion.div key="step1" variants={stepVariants} initial="hidden" animate="visible" exit="exit" transition={{ duration: 0.3 }} className="space-y-4">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 ml-1">Full Name</label>
                                        <div className="relative group">
                                            <UserIcon className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-600 group-focus-within:text-blue-500 transition-colors" />
                                            <input
                                                type="text"
                                                name="name"
                                                required
                                                value={formData.name}
                                                onChange={handleChange}
                                                placeholder="John Doe"
                                                className="w-full h-14 bg-white/5 border border-white/10 rounded-2xl pl-12 pr-5 text-white text-sm outline-none focus:border-blue-500/50 focus:ring-4 focus:ring-blue-500/10 transition-all placeholder:text-gray-700"
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 ml-1">Work Email</label>
                                        <div className="relative group">
                                            <EnvelopeIcon className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-600 group-focus-within:text-blue-500 transition-colors" />
                                            <input
                                                type="email"
                                                name="email"
                                                required
                                                value={formData.email}
                                                onChange={handleChange}
                                                placeholder="john@company.com"
                                                className="w-full h-14 bg-white/5 border border-white/10 rounded-2xl pl-12 pr-5 text-white text-sm outline-none focus:border-blue-500/50 focus:ring-4 focus:ring-blue-500/10 transition-all placeholder:text-gray-700"
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 ml-1">Phone Number</label>
                                        <div className="relative group">
                                            <PhoneIcon className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-600 group-focus-within:text-blue-500 transition-colors" />
                                            <input
                                                type="tel"
                                                name="phone"
                                                required
                                                value={formData.phone}
                                                onChange={handleChange}
                                                placeholder="+1 (555) 000-0000"
                                                className="w-full h-14 bg-white/5 border border-white/10 rounded-2xl pl-12 pr-5 text-white text-sm outline-none focus:border-blue-500/50 focus:ring-4 focus:ring-blue-500/10 transition-all placeholder:text-gray-700"
                                            />
                                        </div>
                                    </div>
                                </motion.div>
                            )}

                            {step === 2 && (
                                <motion.div key="step2" variants={stepVariants} initial="hidden" animate="visible" exit="exit" transition={{ duration: 0.3 }} className="space-y-4">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 ml-1">Business Name</label>
                                        <div className="relative group">
                                            <BuildingOfficeIcon className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-600 group-focus-within:text-blue-500 transition-colors" />
                                            <input
                                                type="text"
                                                name="businessName"
                                                required
                                                value={formData.businessName}
                                                onChange={handleChange}
                                                placeholder="Acme Global Inc."
                                                className="w-full h-14 bg-white/5 border border-white/10 rounded-2xl pl-12 pr-5 text-white text-sm outline-none focus:border-blue-500/50 focus:ring-4 focus:ring-blue-500/10 transition-all placeholder:text-gray-700"
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 ml-1">Company Website</label>
                                        <div className="relative group">
                                            <GlobeAltIcon className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-600 group-focus-within:text-blue-500 transition-colors" />
                                            <input
                                                type="url"
                                                name="website"
                                                required
                                                value={formData.website}
                                                onChange={handleChange}
                                                placeholder="https://acme.com"
                                                className="w-full h-14 bg-white/5 border border-white/10 rounded-2xl pl-12 pr-5 text-white text-sm outline-none focus:border-blue-500/50 focus:ring-4 focus:ring-blue-500/10 transition-all placeholder:text-gray-700"
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 ml-1">Industry / Sector</label>
                                        <div className="relative">
                                            <button
                                                type="button"
                                                onClick={() => setDropdownOpen(!dropdownOpen)}
                                                className="w-full h-14 bg-white/5 border border-white/10 rounded-2xl px-5 text-white text-sm outline-none focus:border-blue-500/50 focus:ring-4 focus:ring-blue-500/10 transition-all flex items-center justify-between group"
                                            >
                                                <span className={formData.experience ? "text-white" : "text-gray-700"}>
                                                    {formData.experience || "Select Segment"}
                                                </span>
                                                <ChevronDownIcon className={`w-4 h-4 text-gray-600 transition-transform duration-300 ${dropdownOpen ? "rotate-180" : ""}`} />
                                            </button>

                                            <AnimatePresence>
                                                {dropdownOpen && (
                                                    <motion.div
                                                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                                        animate={{ opacity: 1, y: 0, scale: 1 }}
                                                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                                        className="absolute top-full left-0 w-full mt-2 bg-background border border-white/10 rounded-2xl shadow-2xl z-[100] overflow-hidden backdrop-blur-3xl"
                                                    >
                                                        {industries.map((opt) => (
                                                            <button
                                                                key={opt}
                                                                type="button"
                                                                onClick={() => {
                                                                    setFormData({ ...formData, experience: opt });
                                                                    setDropdownOpen(false);
                                                                }}
                                                                className="w-full px-5 py-4 text-left text-sm text-gray-400 hover:text-white hover:bg-white/5 transition-all border-b border-white/5 last:border-0"
                                                            >
                                                                {opt}
                                                            </button>
                                                        ))}
                                                    </motion.div>
                                                )}
                                            </AnimatePresence>
                                        </div>
                                    </div>
                                </motion.div>
                            )}

                            {step === 3 && (
                                <motion.div key="step3" variants={stepVariants} initial="hidden" animate="visible" exit="exit" transition={{ duration: 0.3 }} className="space-y-4">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 ml-1">Portal Password</label>
                                        <div className="relative group">
                                            <LockClosedIcon className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-600 group-focus-within:text-blue-500 transition-colors" />
                                            <input
                                                type={showPassword ? "text" : "password"}
                                                name="password"
                                                required
                                                value={formData.password}
                                                onChange={handleChange}
                                                placeholder="••••••••••••"
                                                className="w-full h-14 bg-white/5 border border-white/10 rounded-2xl pl-12 pr-12 text-white text-sm outline-none focus:border-blue-500/50 focus:ring-4 focus:ring-blue-500/10 transition-all placeholder:text-gray-700"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setShowPassword(!showPassword)}
                                                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-600 hover:text-blue-500 transition-colors"
                                            >
                                                {showPassword ? <EyeSlashIcon className="w-5 h-5" /> : <EyeIcon className="w-5 h-5" />}
                                            </button>
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 ml-1">Confirm Security Key</label>
                                        <div className="relative group">
                                            <LockClosedIcon className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-600 group-focus-within:text-blue-500 transition-colors" />
                                            <input
                                                type={showConfirmPassword ? "text" : "password"}
                                                name="confirmPassword"
                                                required
                                                value={formData.confirmPassword}
                                                onChange={handleChange}
                                                placeholder="••••••••••••"
                                                className="w-full h-14 bg-white/5 border border-white/10 rounded-2xl pl-12 pr-12 text-white text-sm outline-none focus:border-blue-500/50 focus:ring-4 focus:ring-blue-500/10 transition-all placeholder:text-gray-700"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-600 hover:text-blue-500 transition-colors"
                                            >
                                                {showConfirmPassword ? <EyeSlashIcon className="w-5 h-5" /> : <EyeIcon className="w-5 h-5" />}
                                            </button>
                                        </div>
                                    </div>
                                    <div className="pt-4 flex items-start gap-4 p-4 rounded-2xl bg-blue-600/5 border border-blue-500/10">
                                        <CheckCircleIcon className="w-5 h-5 text-blue-500 mt-0.5 shrink-0" />
                                        <p className="text-[10px] text-gray-500 leading-relaxed font-bold uppercase tracking-wider">
                                            By confirming, you agree to our strictly operational service agreement and internal data governance protocols.
                                        </p>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        <div className="flex flex-row gap-2 sm:gap-4 pt-4">
                            {step > 1 && (
                                <motion.button
                                    type="button"
                                    onClick={prevStep}
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    className="flex-1 h-14 bg-white/5 border border-white/10 hover:bg-white/10 text-white rounded-2xl font-black text-[10px] sm:text-sm uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-2"
                                >
                                    <ArrowLeftIcon className="w-4 h-4" />
                                    PREV
                                </motion.button>
                            )}

                            {step < 3 ? (
                                <motion.button
                                    type="button"
                                    onClick={nextStep}
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    className="flex-[2] h-14 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl font-black text-[10px] sm:text-sm uppercase tracking-[0.2em] transition-all shadow-xl shadow-blue-600/20 flex items-center justify-center gap-2"
                                >
                                    NEXT
                                    <ArrowRightIcon className="w-4 h-4" />
                                </motion.button>
                            ) : (
                                <motion.button
                                    disabled={isLoading}
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    type="submit"
                                    className="flex-[2] h-14 bg-emerald-600 hover:bg-emerald-500 text-white rounded-2xl font-black text-[10px] sm:text-sm uppercase tracking-[0.2em] transition-all shadow-xl shadow-emerald-600/20 flex items-center justify-center gap-3 disabled:opacity-40"
                                >
                                    {isLoading ? (
                                        <>
                                            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                            INITIALIZING...
                                        </>
                                    ) : (
                                        <>
                                            CONFIRM & LAUNCH
                                            <ArrowRightIcon className="w-4 h-4" />
                                        </>
                                    )}
                                </motion.button>
                            )}
                        </div>
                    </form>

                    <div className="mt-10 text-center">
                        <p className="text-gray-500 text-xs font-bold">
                            Already have an account?{" "}
                            <Link to="/login" className="text-blue-500 hover:text-blue-400 underline decoration-blue-500/30 underline-offset-4">Login</Link>
                        </p>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}
