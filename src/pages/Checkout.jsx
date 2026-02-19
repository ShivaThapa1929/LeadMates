import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
    CreditCardIcon,
    ShieldCheckIcon,
    ArrowRightIcon,
    CheckCircleIcon,
    LockClosedIcon
} from "@heroicons/react/24/outline";
import GalaxyHero from "../components/GalaxyHero";
import authService from "../api/authService";

export default function Checkout() {
    const location = useLocation();
    const navigate = useNavigate();
    const { plan, roleType } = location.state || {};
    const [isProcessing, setIsProcessing] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    const user = authService.getCurrentUser();

    useEffect(() => {
        if (!plan) {
            navigate("/pricing");
        }
    }, [plan, navigate]);

    const handlePayment = async (e) => {
        e.preventDefault();
        setIsProcessing(true);

        // Simulate payment processing
        await new Promise(resolve => setTimeout(resolve, 2000));

        setIsProcessing(false);
        setIsSuccess(true);

        // Update user plan
        if (user) {
            const updatedUser = { ...user, plan: plan, role_type: roleType || user.role_type };
            localStorage.setItem('user', JSON.stringify(updatedUser));
            window.dispatchEvent(new Event('auth-update'));
        }

        // Redirect after success
        setTimeout(() => {
            sessionStorage.setItem('showWelcome', 'true');
            navigate(roleType === 'admin' ? "/admin/dashboard" : "/dashboard");
        }, 2000);
    };

    return (
        <div className="min-h-screen w-full flex items-center justify-center bg-background relative overflow-hidden px-4 py-20">
            <div className="absolute inset-0 z-0">
                <GalaxyHero simple={true} />
            </div>

            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="relative w-full max-w-xl z-10"
            >
                <div className="bg-background/80 border border-blue-500/20 rounded-[3rem] p-8 md:p-12 shadow-[0_0_80px_-20px_rgba(59,130,246,0.2)] backdrop-blur-3xl">

                    <AnimatePresence mode="wait">
                        {!isSuccess ? (
                            <motion.div
                                key="payment"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0, y: -20 }}
                            >
                                <div className="text-center mb-10">
                                    <h1 className="text-3xl font-black text-white tracking-tighter uppercase mb-2">Finalize <span className="text-blue-500">Access</span></h1>
                                    <p className="text-gray-500 text-xs font-bold uppercase tracking-[0.3em]">Secure Infrastructure Authorization</p>
                                </div>

                                <div className="p-6 rounded-2xl bg-blue-600/5 border border-blue-500/10 mb-8 flex items-center justify-between">
                                    <div>
                                        <p className="text-[10px] font-black text-blue-500 uppercase tracking-widest mb-1">Selected Strategy</p>
                                        <h3 className="text-xl font-black text-white uppercase tracking-tight">{plan}</h3>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-1">One-Time Fee</p>
                                        <p className="text-2xl font-black text-white">$49</p>
                                    </div>
                                </div>

                                <form onSubmit={handlePayment} className="space-y-6">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-600 ml-1">Card Details (Mock)</label>
                                        <div className="relative">
                                            <CreditCardIcon className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-700" />
                                            <input
                                                type="text"
                                                placeholder="4242 4242 4242 4242"
                                                disabled
                                                className="w-full h-14 bg-white/[0.03] border border-white/5 rounded-2xl pl-14 pr-5 text-white/40 text-sm outline-none cursor-not-allowed"
                                            />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-600 ml-1">Expiry</label>
                                            <input
                                                type="text"
                                                placeholder="MM/YY"
                                                disabled
                                                className="w-full h-14 bg-white/[0.03] border border-white/5 rounded-2xl px-5 text-white/40 text-sm outline-none cursor-not-allowed"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-600 ml-1">CVC</label>
                                            <input
                                                type="password"
                                                placeholder="•••"
                                                disabled
                                                className="w-full h-14 bg-white/[0.03] border border-white/5 rounded-2xl px-5 text-white/40 text-sm outline-none cursor-not-allowed"
                                            />
                                        </div>
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={isProcessing}
                                        className="w-full h-16 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl font-black text-sm uppercase tracking-[0.2em] transition-all shadow-xl shadow-blue-600/20 flex items-center justify-center gap-3 disabled:opacity-50"
                                    >
                                        {isProcessing ? (
                                            <>
                                                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                                AUTHORIZING...
                                            </>
                                        ) : (
                                            <>
                                                CONFIRM & DEPLOY
                                                <ArrowRightIcon className="w-5 h-5" />
                                            </>
                                        )}
                                    </button>
                                </form>

                                <div className="mt-8 flex items-center justify-center gap-6 opacity-30">
                                    <div className="flex items-center gap-2">
                                        <ShieldCheckIcon className="w-4 h-4" />
                                        <span className="text-[8px] font-black uppercase tracking-widest">AES-256</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <LockClosedIcon className="w-4 h-4" />
                                        <span className="text-[8px] font-black uppercase tracking-widest">SSL Secure</span>
                                    </div>
                                </div>
                            </motion.div>
                        ) : (
                            <motion.div
                                key="success"
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="text-center py-10"
                            >
                                <div className="w-24 h-24 bg-emerald-500/10 border border-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-8 shadow-[0_0_50px_rgba(16,185,129,0.2)]">
                                    <CheckCircleIcon className="w-12 h-12 text-emerald-500" />
                                </div>
                                <h2 className="text-3xl font-black text-white tracking-tighter uppercase mb-4">Authorization <span className="text-emerald-500">Confirmed</span></h2>
                                <p className="text-gray-400 text-sm font-bold uppercase tracking-widest leading-relaxed">
                                    Redirecting to your command center... <br />
                                    Welcome to the elite tier.
                                </p>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </motion.div>
        </div>
    );
}
