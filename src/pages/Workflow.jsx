// src/pages/Workflow.jsx
import { motion, useScroll, useSpring } from "framer-motion";
import { 
  CursorArrowRaysIcon, 
  EnvelopeOpenIcon, 
  PaintBrushIcon, 
  SparklesIcon 
} from "@heroicons/react/24/outline";

const steps = [
  {
    id: 1,
    title: "Subscribe",
    desc: "Subscribe and instantly get access to your dedicated Trello board and Slack channel.",
    icon: CursorArrowRaysIcon,
  },
  {
    id: 2,
    title: "Send me your design request",
    desc: "List your first task within seconds by specifying the requirements.",
    icon: EnvelopeOpenIcon,
  },
  {
    id: 3,
    title: "Receive your designs",
    desc: "You will receive your first design updates within 48 hours.",
    icon: PaintBrushIcon,
  },
  {
    id: 4,
    title: "Simplifying revisions",
    desc: "I offer unlimited revisions to ensure that the final design meets your expectations.",
    icon: SparklesIcon,
  }
];

export default function Workflow() {
  const { scrollYProgress } = useScroll();
  const scaleY = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  return (
    <main className="bg-[#030405] min-h-screen text-white font-sans selection:bg-blue-500/30">
      
      {/* BLUE DARK ATMOSPHERE */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-[-5%] left-[-5%] w-[30%] h-[30%] bg-blue-600/10 blur-[100px] rounded-full" />
        <div className="absolute bottom-[-5%] right-[-5%] w-[30%] h-[30%] bg-blue-900/5 blur-[100px] rounded-full" />
      </div>

      {/* HERO SECTION - BUTTON REMOVED */}
      <section className="relative h-[60vh] flex flex-col items-center justify-center px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-4xl"
        >
          <span className="text-blue-500 font-black text-[10px] uppercase tracking-[0.5em] mb-4 block">
            The Process
          </span>
          <h1 className="text-5xl md:text-7xl font-black tracking-tighter mb-8 leading-tight">
            Design, <br />
            <span className=" text-blue-500">without the hassle</span>
          </h1>
          <p className="text-blue-500 text-sm tracking-[0.2em] font-medium uppercase">
            A streamlined workflow for modern builders.
          </p>
        </motion.div>
      </section>

      {/* STEP-BY-STEP */}
      <section className="relative max-w-5xl mx-auto py-16 px-6">
        {/* Progress Line */}
        <div className="absolute left-1/2 top-0 bottom-0 w-[1px] bg-white/5 hidden md:block">
          <motion.div 
            className="w-full bg-gradient-to-b from-blue-500 to-blue-700 origin-top"
            style={{ scaleY }}
          />
        </div>

        <div className="space-y-20">
          {steps.map((step, i) => (
            <motion.div 
              key={step.id}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              className={`relative flex flex-col md:flex-row items-center gap-10 ${
                i % 2 !== 0 ? "md:flex-row-reverse" : ""
              }`}
            >
              {/* Glass Card */}
              <div className="flex-1 w-full">
                <div className="aspect-video rounded-[1.5rem] bg-white/[0.02] border border-white/5 backdrop-blur-3xl shadow-xl flex items-center justify-center group overflow-hidden">
                  <step.icon className="w-12 h-12 text-white/10 group-hover:text-blue-500/40 transition-all duration-700 group-hover:scale-110" />
                  <div className="absolute inset-0 bg-gradient-to-tr from-blue-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              </div>

              {/* Center Node */}
              <div className="absolute left-1/2 -translate-x-1/2 w-10 h-10 bg-[#030405] border border-white/10 rounded-full hidden md:flex items-center justify-center z-20">
                <div className="text-[9px] font-black text-white/30">{step.id}</div>
                <motion.div 
                  initial={{ height: 0 }}
                  whileInView={{ height: "100%" }}
                  className="absolute inset-0 bg-blue-600/10"
                />
              </div>

              {/* Content */}
              <div className={`flex-1 text-center ${i % 2 !== 0 ? "md:text-right" : "md:text-left"}`}>
                <span className="text-blue-500 font-black text-[9px] uppercase tracking-[0.4em] mb-3 block">
                  Phase 0{step.id}
                </span>
                <h3 className="text-xl md:text-2xl font-bold mb-3 tracking-tight">
                  {step.title}
                </h3>
                <p className="text-gray-500 leading-relaxed text-xs md:text-sm max-w-sm mx-auto md:mx-0">
                  {step.desc}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* FOOTER */}
      <footer className="py-12 text-center border-t border-white/5">
        <p className="text-[8px] text-gray-700 font-black uppercase tracking-[0.8em] mb-2">
          Pure Infrastructure
        </p>
        <p className="text-gray-600 text-[10px] max-w-xs mx-auto opacity-60">
          Unlimited revisions to ensure project perfection.
        </p>
      </footer>
    </main>
  );
} 