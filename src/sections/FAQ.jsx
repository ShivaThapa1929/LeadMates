// src/sections/FAQ.jsx
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDownIcon, QuestionMarkCircleIcon } from "@heroicons/react/24/outline";

const faqs = [
  {
    question: "What exactly am I buying?",
    answer: "You are getting the LeadMates conversion infrastructure—a system of proven page structures, lead capture flows, and reusable logic designed to be installed and deployed in minutes."
  },
  {
    question: "Is this a website builder or a template?",
    answer: "LeadMates is a conversion-first system. Unlike generic templates built for looks, this is a 'Developer Paste-Ready' infrastructure designed for operational use and predictable execution."
  },
  {
    question: "Who is LeadMates for?",
    answer: "It is built for Developers, Agencies, and Technical Founders who need a reliable foundation to launch lead-driven websites without rebuilding logic from scratch for every campaign."
  },
  {
    question: "Do I get lifetime updates?",
    answer: "Yes. Your purchase includes lifetime usage rights for the LeadMates system, including documentation and the core component library."
  },
  {
    question: "Does it include hosting or custom development?",
    answer: "No. As stated in our pricing philosophy, LeadMates is infrastructure-only. We provide the system; you handle the hosting. Optional setup services are available if needed."
  }
];

export default function FAQ() {
  const [activeIndex, setActiveIndex] = useState(null);

  return (
    <section className="relative py-32 bg-black text-white px-6 overflow-hidden">
      
      {/* Galaxy Background Glow */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-blue-600/5 blur-[120px] pointer-events-none" />

      <div className="relative max-w-3xl mx-auto z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-bold uppercase tracking-widest mb-4">
            <QuestionMarkCircleIcon className="w-4 h-4" />
            Support
          </div>
          <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight">
            Common <span className="text-blue-500">Questions</span>
          </h2>
        </motion.div>

        <div className="space-y-4">
          {faqs.map((faq, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="rounded-2xl border border-white/10 bg-white/[0.02] backdrop-blur-xl overflow-hidden"
            >
              <button
                onClick={() => setActiveIndex(activeIndex === i ? null : i)}
                className="w-full p-6 flex items-center justify-between text-left transition-colors hover:bg-white/[0.03]"
              >
                <span className="text-lg font-bold text-gray-200">{faq.question}</span>
                <ChevronDownIcon 
                  className={`w-5 h-5 text-blue-500 transition-transform duration-300 ${
                    activeIndex === i ? "rotate-180" : ""
                  }`} 
                />
              </button>

              <AnimatePresence>
                {activeIndex === i && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                  >
                    <div className="px-6 pb-6 text-gray-400 leading-relaxed border-t border-white/5 pt-4">
                      {faq.answer}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>

        <motion.p 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          className="mt-12 text-center text-gray-500 text-sm"
        >
          Have more questions? <a href="/docs" className="text-blue-400 hover:underline">Read the full documentation</a>.
        </motion.p>
      </div>
    </section>
  );
}
