// src/pages/Pricing.jsx
import { motion } from "framer-motion";
import { 
  CheckIcon, 
  SparklesIcon,
  BoltIcon,
  RocketLaunchIcon,
  Square3Stack3DIcon
} from "@heroicons/react/24/outline";

const pricingPlans = [
  {
    name: "Basic Plan",
    price: "19",
    desc: "Perfect for individual founders and simple landing pages.",
    features: ["LeadMates system", "Standard components", "Basic documentation"]
  },
  {
    name: "Infrastructure Pro",
    price: "39",
    desc: "The complete package for scaling lead generation.",
    features: ["LeadMates system", "All layouts & components", "Full documentation", "Lifetime updates"],
    popular: true
  },
  {
    name: "Agency Node",
    price: "89",
    desc: "Optimized for multiple client delivery pipelines.",
    features: ["Unlimited system usage", "Whitelabel components", "Priority documentation", "Multi-site license"]
  }
];

export default function Pricing() {
  return (
    <main className="relative bg-[#030405] min-h-screen text-white pt-32 pb-24 px-6 overflow-hidden">
      
      {/* Background Atmosphere - CHANGED TO BLUE */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[500px] bg-blue-600/[0.05] blur-[120px] pointer-events-none rounded-full" />

      <div className="max-w-7xl mx-auto relative z-10">
        
        {/* Header */}
        <motion.section 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="text-center mb-20"
        >
          <h2 className="text-5xl md:text-7xl font-black tracking-tighter mb-6">
            Choose Your <span className="text-blue-500/40">Strategy.</span>
          </h2>
          <p className="text-gray-500 text-[10px] font-black uppercase tracking-[0.5em]">
            One-time purchase • Lifetime usage
          </p>
        </motion.section>

        {/* 3 Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-32">
          {pricingPlans.map((plan, i) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              whileHover={{ y: -10 }}
              className={`relative p-10 rounded-[2.5rem] border ${plan.popular ? 'border-blue-500/30 bg-blue-500/[0.03]' : 'border-white/[0.05] bg-white/[0.01]'} backdrop-blur-3xl flex flex-col`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-blue-600 text-white text-[9px] font-black uppercase tracking-widest rounded-full shadow-[0_0_20px_rgba(37,99,235,0.4)]">
                  Most Popular
                </div>
              )}
              <h3 className="text-gray-400 text-[10px] font-black uppercase tracking-widest mb-2">{plan.name}</h3>
              <div className="flex items-baseline gap-2 mb-6">
                <span className="text-5xl font-black">${plan.price}</span>
                <span className="text-gray-600 text-[10px] font-bold uppercase tracking-widest">/Lifetime</span>
              </div>
              <p className="text-gray-600 text-xs leading-relaxed mb-8 h-12">{plan.desc}</p>
              
              <ul className="space-y-4 mb-12 flex-grow">
                {plan.features.map((feature, idx) => (
                  <li key={idx} className="flex items-center gap-3 text-[11px] font-medium text-gray-400">
                    <CheckIcon className={`w-4 h-4 ${plan.popular ? 'text-blue-500' : 'text-white/40'}`} />
                    {feature}
                  </li>
                ))}
              </ul>

              <button className={`w-full py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all ${plan.popular ? 'bg-blue-600 text-white hover:bg-blue-500' : 'bg-white/5 border border-white/10 hover:bg-white/10'}`}>
                Start Free Trial
              </button>
            </motion.div>
          ))}
        </div>

        {/* UPGRADE SECTION (Blue Theme) */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.98 }}
          whileInView={{ opacity: 1, scale: 1 }}
          className="relative p-12 md:p-20 rounded-[3rem] bg-gradient-to-br from-blue-900/[0.1] to-transparent border border-white/[0.08] overflow-hidden"
        >
          {/* Subtle Blue Accent Glow */}
          <div className="absolute -right-20 -bottom-20 w-80 h-80 bg-blue-600/[0.05] blur-[100px] rounded-full" />
          
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-4xl md:text-5xl font-black tracking-tighter mb-6">
                Upgrade Your <br />
                <span className="text-blue-500/40">Design Workflow</span>
              </h2>
              <p className="text-gray-500 text-sm mb-10 max-w-sm">
                Infrastructure should not require endless subscriptions. Transition your core lead gen to a lifetime asset.
              </p>
              <button className="px-10 py-4 bg-blue-600 text-white rounded-full font-black text-[10px] uppercase tracking-widest hover:scale-105 transition-transform shadow-lg shadow-blue-600/20">
                Buy Now
              </button>
            </div>

            {/* Micro-Award Grid */}
            <div className="grid grid-cols-2 gap-4">
              {[
                { label: "High Performance", icon: BoltIcon },
                { label: "Best Usability", icon: Square3Stack3DIcon },
                { label: "Verified Scale", icon: RocketLaunchIcon },
                { label: "Secure Auth", icon: SparklesIcon }
              ].map((award, i) => (
                <div key={i} className="p-6 rounded-2xl bg-black/40 border border-white/[0.03] text-center flex flex-col items-center group">
                  <award.icon className="w-6 h-6 text-gray-600 mb-3 group-hover:text-blue-500 transition-colors" />
                  <span className="text-[9px] font-black uppercase tracking-widest text-gray-400">{award.label}</span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

      </div>
    </main>
  );
}