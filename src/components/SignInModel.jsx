import React from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function SignInModal({ isOpen, onClose }) {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          {/* Animated Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-md"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            className="relative w-full max-w-md overflow-hidden rounded-3xl border border-white/10 bg-[#0B0D10]/80 p-1 shadow-2xl backdrop-blur-2xl"
          >
            {/* Subtle Top Gradient Glow */}
            <div className="absolute -top-24 -left-24 h-48 w-48 rounded-full bg-blue-600/20 blur-[80px]" />
            <div className="absolute -bottom-24 -right-24 h-48 w-48 rounded-full bg-purple-600/20 blur-[80px]" />

            <div className="relative p-8">
              {/* Close Button */}
              <button
                onClick={onClose}
                className="absolute top-4 right-4 flex h-8 w-8 items-center justify-center rounded-full bg-white/5 text-gray-400 transition-all hover:bg-white/10 hover:text-white"
              >
                ✕
              </button>

              {/* Header */}
              <div className="mb-8 text-center">
                <h2 className="text-3xl font-bold tracking-tight text-white">
                  Welcome back
                </h2>
                <p className="mt-2 text-sm text-gray-400">
                  Enter your details to access your dashboard
                </p>
              </div>

              {/* Social Logins */}
              <div className="grid grid-cols-2 gap-4">
                <button className="flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 py-2.5 text-sm font-medium text-white transition-all hover:bg-white/10">
                  <img src="https://www.svgrepo.com/show/355037/google.svg" className="h-4 w-4" alt="Google" />
                  Google
                </button>
                <button className="flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 py-2.5 text-sm font-medium text-white transition-all hover:bg-white/10">
                  <img src="https://www.svgrepo.com/show/512317/github-142.svg" className="h-4 w-4 invert" alt="GitHub" />
                  GitHub
                </button>
              </div>

              <div className="relative my-8 flex items-center justify-center">
                <span className="absolute w-full border-t border-white/10"></span>
                <span className="relative bg-[#0B0D10] px-4 text-xs uppercase tracking-widest text-gray-500">
                  Or continue with email
                </span>
              </div>

              {/* Form */}
              <form className="space-y-5" onSubmit={(e) => e.preventDefault()}>
                <div className="space-y-2">
                  <label className="text-xs font-semibold uppercase tracking-widest text-gray-400 ml-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="name@company.com"
                    className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none ring-blue-500/20 transition-all focus:border-blue-500 focus:ring-4"
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between px-1">
                    <label className="text-xs font-semibold uppercase tracking-widest text-gray-400">
                      Password
                    </label>
                    <a href="#" className="text-xs text-blue-500 hover:underline">Forgot?</a>
                  </div>
                  <input
                    type="password"
                    required
                    placeholder="••••••••"
                    className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none ring-blue-500/20 transition-all focus:border-blue-500 focus:ring-4"
                  />
                </div>

                <motion.button
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  className="mt-4 w-full rounded-xl bg-blue-600 py-4 text-sm font-bold text-white shadow-lg shadow-blue-600/20 transition-all hover:bg-blue-500 hover:shadow-blue-600/40"
                >
                  SIGN IN TO LEADMATES
                </motion.button>
              </form>

              {/* Footer */}
              <p className="mt-8 text-center text-sm text-gray-500">
                Don't have an account?{" "}
                <button className="font-semibold text-blue-500 hover:text-blue-400">
                  Get Access
                </button>
              </p>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}