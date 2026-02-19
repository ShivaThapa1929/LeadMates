// src/pages/Pricing.jsx
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  CheckIcon,
  SparklesIcon,
  BoltIcon,
  RocketLaunchIcon,
  Square3Stack3DIcon,
  ShieldCheckIcon,
  UserIcon,
  BuildingOfficeIcon,
  ArrowRightOnRectangleIcon
} from "@heroicons/react/24/outline";
import { useNavigate } from "react-router-dom";
import authService from "../api/authService";

const adminPlans = [
  {
    name: "Starter Node",
    price: "49",
    desc: "Perfect for small teams starting their lead generation journey.",
    features: ["Manage up to 5 Users", "Basic Lead Assignment", "Live Activity Feed", "Standard Documentation"],
    popular: false
  },
  {
    name: "Infrastructure Pro",
    price: "99",
    desc: "The complete command center for growing agencies.",
    features: ["Manage up to 25 Users", "Advanced Lead Scoring", "Team Performance Analytics", "Role-Based Access Control", "Priority Support"],
    popular: true
  },
  {
    name: "Agency Sovereign",
    price: "199",
    desc: "Unlimited power for large scale lead operations.",
    features: ["Unlimited User Nodes", "Full Whitelabeling", "API & Webhook Access", "Dedicated Infrastructure", "Custom Training"],
    popular: false
  }
];

const userPlans = [
  {
    name: "Identity Basic",
    price: "0",
    desc: "Essential tools for individual sales professionals.",
    features: ["Receive Assigned Leads", "Mobile App Dashboard", "Basic CRM Tools", "Standard Notifications"],
    popular: false
  },
  {
    name: "Pro Operative",
    price: "29",
    desc: "Enhanced productivity for top-tier lead conversion.",
    features: ["Priority Lead Alerts", "Personal Lead Management", "Advanced Filtering", "Export Capabilities", "Detailed History"],
    popular: true
  },
  {
    name: "Lifetime Elite",
    price: "59",
    desc: "The ultimate personal toolset for sales masters.",
    features: ["AI Lead Insights", "Unlimited Manual Entries", "Custom CRM Pipelines", "Early Feature Access", "Lifetime Updates"],
    popular: false
  }
];

export default function Pricing() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("admin"); // "admin" or "user"
  const [loadingPlan, setLoadingPlan] = useState(null);
  const currentPlans = activeTab === "admin" ? adminPlans : userPlans;

  const user = authService.getCurrentUser();

  const handleSelectPlan = async (plan) => {
    if (!user) {
      navigate('/signup', { state: { selectedPlan: plan.name, roleType: activeTab } });
      return;
    }

    navigate('/checkout', { state: { plan: plan.name, roleType: activeTab } });
  };

  return (
    <main className="relative bg-[#030405] min-h-screen text-white pt-32 pb-24 px-6 overflow-hidden">

      {/* Background Atmosphere */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[500px] bg-blue-600/[0.05] blur-[120px] pointer-events-none rounded-full" />

      <div className="max-w-7xl mx-auto relative z-10">

        {/* Header */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl md:text-5xl font-black tracking-tighter mb-8 uppercase">
            CHOOSE YOUR <span className="text-blue-500/50">STRATEGY.</span>
          </h2>

          {/* Role Toggle */}
          <div className="inline-flex p-1.5 bg-white/[0.03] border border-white/10 rounded-2xl relative mb-8">
            <motion.div
              layoutId="tab-bg"
              className="absolute bg-blue-600 inset-y-1.5 rounded-xl shadow-lg shadow-blue-600/20"
              style={{
                left: activeTab === "admin" ? "6px" : "auto",
                right: activeTab === "user" ? "6px" : "auto",
                width: "calc(50% - 6px)"
              }}
            />
            <button
              onClick={() => setActiveTab("admin")}
              className={`relative z-10 flex items-center gap-2 px-8 py-3 text-[9px] font-black uppercase tracking-widest transition-colors ${activeTab === "admin" ? "text-white" : "text-gray-500"}`}
            >
              <BuildingOfficeIcon className="w-3.5 h-3.5" />
              For Admins
            </button>
            <button
              onClick={() => setActiveTab("user")}
              className={`relative z-10 flex items-center gap-2 px-8 py-3 text-[9px] font-black uppercase tracking-widest transition-colors ${activeTab === "user" ? "text-white" : "text-gray-500"}`}
            >
              <UserIcon className="w-3.5 h-3.5" />
              For Users
            </button>
          </div>

          <p className="text-gray-500 text-[10px] font-black uppercase tracking-[0.5em] block">
            One-time purchase • Lifetime usage
          </p>
        </motion.section>

        {/* Pricing Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-32 relative">
          <AnimatePresence>
            {currentPlans.map((plan, i) => (
              <motion.div
                key={`${activeTab}-${plan.name}`}
                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -20, scale: 0.95 }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
                whileHover={{ y: -10 }}
                className={`flex flex-col relative p-8 rounded-[2rem] border ${plan.popular ? 'border-blue-500/30 bg-blue-500/[0.03]' : 'border-white/[0.05] bg-white/[0.01]'} backdrop-blur-3xl`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-blue-600 text-white text-[9px] font-black uppercase tracking-widest rounded-full shadow-[0_0_20px_rgba(37,99,235,0.4)]">
                    Most Popular
                  </div>
                )}

                <div className="mb-6">
                  <h3 className="text-gray-400 text-[8px] font-black uppercase tracking-widest mb-3 flex items-center gap-2">
                    {activeTab === "admin" ? <BuildingOfficeIcon className="w-2.5 h-2.5 text-blue-500/50" /> : <UserIcon className="w-2.5 h-2.5 text-blue-500/50" />}
                    {plan.name}
                  </h3>
                  <div className="flex items-baseline gap-2">
                    <span className="text-4xl font-black tracking-tighter">${plan.price}</span>
                    <span className="text-gray-600 text-[8px] font-bold uppercase tracking-widest">{plan.price === "0" ? "/Forever" : "/Lifetime"}</span>
                  </div>
                </div>

                <p className="text-gray-500 text-xs leading-relaxed mb-10 h-12 italic opacity-80">{plan.desc}</p>

                <ul className="space-y-3.5 mb-10 flex-grow">
                  {plan.features.map((feature, idx) => (
                    <li key={idx} className="flex items-center gap-2 text-[10px] font-bold text-gray-400 group">
                      <div className={`w-4 h-4 rounded-md flex items-center justify-center transition-colors ${plan.popular ? 'bg-blue-500/10 text-blue-500' : 'bg-white/5 text-white/20'}`}>
                        <CheckIcon className="w-2.5 h-2.5" />
                      </div>
                      <span className="group-hover:text-gray-200 transition-colors uppercase tracking-tight">{feature}</span>
                    </li>
                  ))}
                </ul>

                <button
                  onClick={() => handleSelectPlan(plan)}
                  disabled={loadingPlan === plan.name}
                  className={`w-full py-3.5 rounded-xl font-black text-[9px] uppercase tracking-widest transition-all ${plan.popular ? 'bg-blue-600 text-white hover:bg-blue-500 shadow-lg shadow-blue-600/20' : 'bg-white/5 border border-white/10 hover:bg-white/10 text-gray-300'} disabled:opacity-50`}
                >
                  {loadingPlan === plan.name ? "Processing..." : (plan.price === "0" ? "Get Started Now" : "Authorize Access")}
                </button>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Upgrade / Call to Action Section */}
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          whileInView={{ opacity: 1, scale: 1 }}
          className="relative p-12 md:p-20 rounded-[3rem] bg-gradient-to-br from-blue-900/[0.1] to-transparent border border-white/[0.08] overflow-hidden"
        >
          <div className="absolute -right-20 -bottom-20 w-80 h-80 bg-blue-600/[0.05] blur-[100px] rounded-full" />

          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-[9px] font-black uppercase tracking-[0.2em] mb-6">
                <ShieldCheckIcon className="w-4 h-4" />
                Enterprise Ready Infrastructure
              </div>
              <h2 className="text-3xl md:text-4xl font-black tracking-tighter mb-6 uppercase">
                {activeTab === "admin" ? "Scale Your Agency" : "Boost Your Sales"} <br />
                <span className="text-blue-500/30">Optimization Hub</span>
              </h2>
              <p className="text-gray-500 text-xs mb-10 max-w-sm uppercase font-bold tracking-tight">
                Stop paying endless subscriptions. Transition your {activeTab === "admin" ? "team management" : "personal workflow"} to a lifetime elite asset.
              </p>
              <button className="px-10 py-4 bg-blue-600 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest hover:scale-105 transition-transform shadow-xl shadow-blue-600/30">
                Talk to Intelligence
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {[
                { label: "High Performance", icon: BoltIcon },
                { label: "Best Usability", icon: Square3Stack3DIcon },
                { label: "Verified Scale", icon: RocketLaunchIcon },
                { label: "Secure Auth", icon: SparklesIcon }
              ].map((award, i) => (
                <div key={i} className="p-6 rounded-3xl bg-black/40 border border-white/[0.03] text-center flex flex-col items-center group transition-colors hover:border-blue-500/20">
                  <award.icon className="w-5 h-5 text-gray-700 mb-3 group-hover:text-blue-500 transition-colors" />
                  <span className="text-[8px] font-black uppercase tracking-[0.2em] text-gray-500 group-hover:text-gray-300 transition-colors">{award.label}</span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

      </div>
    </main >
  );
}
