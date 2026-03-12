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
    SparklesIcon,
    BoltIcon
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
        confirmPassword: "",
        role: roleType || "user"
    });
    const [fieldErrors, setFieldErrors] = useState({});

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
        if (fieldErrors[name]) {
            setFieldErrors({ ...fieldErrors, [name]: "" });
        }
    };

    const validateField = (name, value) => {
        let error = "";
        switch (name) {
            case 'name':
                if (!value.trim()) error = "Full name is required";
                else if (value.length < 3 || !/^[A-Za-z ]+$/.test(value)) error = "Full name must be at least 3 characters and contain only letters";
                break;
            case 'email':
                if (!value.trim()) error = "Enter a valid email address";
                else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) error = "Enter a valid email address";
                break;
            case 'phone':
                if (!value.trim()) error = "Enter a valid 10-digit phone number";
                else if (!/^\d{10}$/.test(value)) error = "Enter a valid 10-digit phone number";
                break;
            case 'businessName':
                if (!value.trim()) error = "Business name is required";
                break;
            case 'website':
                if (!value.trim()) error = "Website is required";
                else if (!/^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})/.test(value)) error = "Enter a valid website URL";
                break;
            case 'password': {
                const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/;
                if (!value) error = "Password is required";
                else if (!regex.test(value)) error = "Password must be 8+ characters with uppercase, lowercase, number and special character";
                break;
            }
            case 'confirmPassword':
                if (!value) error = "Confirm Password is required";
                else if (value !== formData.password) error = "Passwords do not match";
                break;
            default:
                break;
        }
        return error;
    };

    const handleBlur = (e) => {
        const { name, value } = e.target;
        const error = validateField(name, value);
        setFieldErrors(prev => ({ ...prev, [name]: error }));
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
        const errors = {};
        let isValid = true;

        if (step === 1) {
            const nameError = validateField('name', formData.name);
            const emailError = validateField('email', formData.email);
            const phoneError = validateField('phone', formData.phone);
            if (nameError) { errors.name = nameError; isValid = false; }
            if (emailError) { errors.email = emailError; isValid = false; }
            if (phoneError) { errors.phone = phoneError; isValid = false; }
        } else if (step === 2) {
            const bizError = validateField('businessName', formData.businessName);
            const webError = validateField('website', formData.website);
            if (bizError) { errors.businessName = bizError; isValid = false; }
            if (webError) { errors.website = webError; isValid = false; }
            if (!formData.experience) {
                errors.experience = "Industry sector must be selected";
                isValid = false;
            }
        } else if (step === 3) {
            const passError = validateField('password', formData.password);
            const confError = validateField('confirmPassword', formData.confirmPassword);
            if (passError) { errors.password = passError; isValid = false; }
            if (confError) { errors.confirmPassword = confError; isValid = false; }
        }

        setFieldErrors(errors);
        if (!isValid) {
            const firstError = Object.values(errors)[0];
            setError(firstError);
        }
        return isValid;
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

            // Log in the user immediately (OTP is now skipped on backend)
            let user = response.data.user;
            sessionStorage.setItem('showWelcome', 'true');

            if (selectedPlan) {
                navigate('/checkout', { state: { plan: selectedPlan, roleType: signupData.role } });
            } else if (user.roles.includes('Admin') || signupData.role === 'admin') {
                navigate("/admin/dashboard");
            } else {
                navigate("/dashboard");
            }
        } catch (err) {
            console.error('Signup Error Data:', err);

            let errorMessage = "An unexpected error occurred during signup.";

            if (err.errors && Array.isArray(err.errors) && err.errors.length > 0) {
                // Validation errors from express-validator (formattedErrors in auth.middleware)
                errorMessage = err.errors[0].message || err.errors[0].msg || "Validation failed";
            } else if (err.message) {
                // Standard error message or conflict message
                errorMessage = err.message;
            }

            setError(errorMessage);
            // Scroll to error
            window.scrollTo({ top: 0, behavior: 'smooth' });
        } finally {
            setIsLoading(false);
        }
    };

    const stepVariants = {
        hidden: { opacity: 0, x: 20 },
        visible: { opacity: 1, x: 0 },
        exit: { opacity: 0, x: -20 }
    };

    const industries = ["SaaS / Software", "Real Estate", "Healthcare", "E-commerce","Hospital"];

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



                    <form onSubmit={handleSubmit} className="space-y-6">
                        <AnimatePresence>
                            {error && (
                                <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    exit={{ opacity: 0, height: 0 }}
                                    className="p-4 bg-rose-500/10 border border-rose-500/20 rounded-2xl flex items-start gap-4"
                                >
                                    <div className="w-5 h-5 rounded-full bg-rose-500/20 flex items-center justify-center shrink-0 mt-0.5">
                                        <div className="w-1.5 h-1.5 rounded-full bg-rose-500" />
                                    </div>
                                    <p className="text-xs font-bold text-rose-500 uppercase tracking-wider leading-relaxed">
                                        {error}
                                    </p>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        <AnimatePresence mode="wait">

                            {step === 1 && (
                                <motion.div key="step1" variants={stepVariants} initial="hidden" animate="visible" exit="exit" transition={{ duration: 0.3 }} className="space-y-4">
                                    <div className="space-y-1">
                                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 ml-1">Full Name</label>
                                        <div className="relative group">
                                            <UserIcon className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-600 group-focus-within:text-blue-500 transition-colors" />
                                            <input
                                                type="text"
                                                name="name"
                                                required
                                                value={formData.name}
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                                placeholder="John Doe"
                                                className={`w-full h-14 bg-white/5 border rounded-2xl pl-12 pr-5 text-white text-sm outline-none transition-all placeholder:text-gray-700 ${fieldErrors.name ? 'border-rose-500/50 ring-4 ring-rose-500/10' : 'border-white/10 focus:border-blue-500/50 focus:ring-4 focus:ring-blue-500/10'}`}
                                            />
                                        </div>
                                        {fieldErrors.name && <p className="text-[10px] text-rose-500 font-bold ml-1">{fieldErrors.name}</p>}
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 ml-1">Work Email</label>
                                        <div className="relative group">
                                            <EnvelopeIcon className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-600 group-focus-within:text-blue-500 transition-colors" />
                                            <input
                                                type="email"
                                                name="email"
                                                required
                                                value={formData.email}
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                                placeholder="john@company.com"
                                                className={`w-full h-14 bg-white/5 border rounded-2xl pl-12 pr-5 text-white text-sm outline-none transition-all placeholder:text-gray-700 ${fieldErrors.email ? 'border-rose-500/50 ring-4 ring-rose-500/10' : 'border-white/10 focus:border-blue-500/50 focus:ring-4 focus:ring-blue-500/10'}`}
                                            />
                                        </div>
                                        {fieldErrors.email && <p className="text-[10px] text-rose-500 font-bold ml-1">{fieldErrors.email}</p>}
                                    </div>

                                    <div className="space-y-1">
                                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 ml-1">Account Role</label>
                                        <div className="flex gap-2 p-1 bg-white/5 border border-white/10 rounded-2xl h-14">
                                            {['user', 'admin'].map((r) => (
                                                <button
                                                    key={r}
                                                    type="button"
                                                    onClick={() => setFormData({ ...formData, role: r })}
                                                    className={`flex-1 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${formData.role === r ? 'bg-blue-600 text-white shadow-lg' : 'text-gray-500 hover:text-white'}`}
                                                >
                                                    {r}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 ml-1">Phone Number</label>
                                        <div className="relative group">
                                            <PhoneIcon className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-600 group-focus-within:text-blue-500 transition-colors" />
                                            <input
                                                type="tel"
                                                name="phone"
                                                required
                                                value={formData.phone}
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                                placeholder="10-digit number"
                                                className={`w-full h-14 bg-white/5 border rounded-2xl pl-12 pr-5 text-white text-sm outline-none transition-all placeholder:text-gray-700 ${fieldErrors.phone ? 'border-rose-500/50 ring-4 ring-rose-500/10' : 'border-white/10 focus:border-blue-500/50 focus:ring-4 focus:ring-blue-500/10'}`}
                                            />
                                        </div>
                                        {fieldErrors.phone && <p className="text-[10px] text-rose-500 font-bold ml-1">{fieldErrors.phone}</p>}
                                    </div>
                                </motion.div>
                            )}

                            {step === 2 && (
                                <motion.div key="step2" variants={stepVariants} initial="hidden" animate="visible" exit="exit" transition={{ duration: 0.3 }} className="space-y-4">
                                    <div className="space-y-1">
                                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 ml-1">Business Name</label>
                                        <div className="relative group">
                                            <BuildingOfficeIcon className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-600 group-focus-within:text-blue-500 transition-colors" />
                                            <input
                                                type="text"
                                                name="businessName"
                                                required
                                                value={formData.businessName}
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                                placeholder="Acme Global Inc."
                                                className={`w-full h-14 bg-white/5 border rounded-2xl pl-12 pr-5 text-white text-sm outline-none transition-all placeholder:text-gray-700 ${fieldErrors.businessName ? 'border-rose-500/50 ring-4 ring-rose-500/10' : 'border-white/10 focus:border-blue-500/50 focus:ring-4 focus:ring-blue-500/10'}`}
                                            />
                                        </div>
                                        {fieldErrors.businessName && <p className="text-[10px] text-rose-500 font-bold ml-1">{fieldErrors.businessName}</p>}
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 ml-1">Company Website</label>
                                        <div className="relative group">
                                            <GlobeAltIcon className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-600 group-focus-within:text-blue-500 transition-colors" />
                                            <input
                                                type="url"
                                                name="website"
                                                required
                                                value={formData.website}
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                                placeholder="https://acme.com"
                                                className={`w-full h-14 bg-white/5 border rounded-2xl pl-12 pr-5 text-white text-sm outline-none transition-all placeholder:text-gray-700 ${fieldErrors.website ? 'border-rose-500/50 ring-4 ring-rose-500/10' : 'border-white/10 focus:border-blue-500/50 focus:ring-4 focus:ring-blue-500/10'}`}
                                            />
                                        </div>
                                        {fieldErrors.website && <p className="text-[10px] text-rose-500 font-bold ml-1">{fieldErrors.website}</p>}
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 ml-1">Industry / Sector</label>
                                        <div className="relative">
                                            <button
                                                type="button"
                                                onClick={() => setDropdownOpen(!dropdownOpen)}
                                                className={`w-full h-14 bg-white/5 border rounded-2xl px-5 text-white text-sm outline-none transition-all flex items-center justify-between group ${fieldErrors.experience ? 'border-rose-500/50 ring-4 ring-rose-500/10' : 'border-white/10 focus:border-blue-500/50 focus:ring-4 focus:ring-blue-500/10'}`}
                                            >
                                                <span className={formData.experience ? "text-white" : "text-gray-700"}>
                                                    {formData.experience || "Select Segment"}
                                                </span>
                                                <ChevronDownIcon className={`w-4 h-4 text-gray-600 transition-transform duration-300 ${dropdownOpen ? "rotate-180" : ""}`} />
                                            </button>
                                            {fieldErrors.experience && <p className="text-[10px] text-rose-500 font-bold ml-1">{fieldErrors.experience}</p>}

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
                                    <div className="space-y-1">
                                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 ml-1">Portal Password</label>
                                        <div className="relative group">
                                            <LockClosedIcon className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-600 group-focus-within:text-blue-500 transition-colors" />
                                            <input
                                                type={showPassword ? "text" : "password"}
                                                name="password"
                                                required
                                                value={formData.password}
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                                placeholder="••••••••••••"
                                                className={`w-full h-14 bg-white/5 border rounded-2xl pl-12 pr-12 text-white text-sm outline-none transition-all placeholder:text-gray-700 ${fieldErrors.password ? 'border-rose-500/50 ring-4 ring-rose-500/10' : 'border-white/10 focus:border-blue-500/50 focus:ring-4 focus:ring-blue-500/10'}`}
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setShowPassword(!showPassword)}
                                                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-600 hover:text-blue-500 transition-colors"
                                            >
                                                {showPassword ? <EyeSlashIcon className="w-5 h-5" /> : <EyeIcon className="w-5 h-5" />}
                                            </button>
                                        </div>
                                        {fieldErrors.password && <p className="text-[10px] text-rose-500 font-bold ml-1 leading-tight">{fieldErrors.password}</p>}
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 ml-1">Confirm Security Key</label>
                                        <div className="relative group">
                                            <LockClosedIcon className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-600 group-focus-within:text-blue-500 transition-colors" />
                                            <input
                                                type={showConfirmPassword ? "text" : "password"}
                                                name="confirmPassword"
                                                required
                                                value={formData.confirmPassword}
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                                placeholder="••••••••••••"
                                                className={`w-full h-14 bg-white/5 border rounded-2xl pl-12 pr-12 text-white text-sm outline-none transition-all placeholder:text-gray-700 ${fieldErrors.confirmPassword ? 'border-rose-500/50 ring-4 ring-rose-500/10' : 'border-white/10 focus:border-blue-500/50 focus:ring-4 focus:ring-blue-500/10'}`}
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-600 hover:text-blue-500 transition-colors"
                                            >
                                                {showConfirmPassword ? <EyeSlashIcon className="w-5 h-5" /> : <EyeIcon className="w-5 h-5" />}
                                            </button>
                                        </div>
                                        {fieldErrors.confirmPassword && <p className="text-[10px] text-rose-500 font-bold ml-1">{fieldErrors.confirmPassword}</p>}
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
                                    disabled={
                                        (step === 1 && (!formData.name || !formData.email || !formData.phone || fieldErrors.name || fieldErrors.email || fieldErrors.phone)) ||
                                        (step === 2 && (!formData.businessName || !formData.website || !formData.experience || fieldErrors.businessName || fieldErrors.website))
                                    }
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    className="flex-[2] h-14 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl font-black text-[10px] sm:text-sm uppercase tracking-[0.2em] transition-all shadow-xl shadow-blue-600/20 flex items-center justify-center gap-2 disabled:opacity-40"
                                >
                                    NEXT
                                    <ArrowRightIcon className="w-4 h-4" />
                                </motion.button>
                            ) : (
                                <motion.button
                                    disabled={isLoading || !formData.password || !formData.confirmPassword || fieldErrors.password || fieldErrors.confirmPassword}
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
