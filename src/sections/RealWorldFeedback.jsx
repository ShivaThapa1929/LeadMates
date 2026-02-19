import { motion } from "framer-motion";
import { ChatBubbleLeftRightIcon, StarIcon, CommandLineIcon, RocketLaunchIcon } from "@heroicons/react/24/outline";

const feedbacks = [
  {
    quote: "LeadMates is part of TechMates' core delivery process for client projects. It provides a reliable foundation for campaigns.",
    author: "TechMates Technologies",
    role: "Internal Use Validation",
    icon: <ChatBubbleLeftRightIcon className="w-6 h-6 text-blue-400" />
  },
  {
    quote: "The modular structure allowed us to deploy a high-converting landing page in record time without compromising on performance.",
    author: "DevStream Agency",
    role: "Performance Review",
    icon: <CommandLineIcon className="w-6 h-6 text-purple-400" />
  },
  {
    quote: "Predictable execution is hard to find. This framework removed the guesswork from our lead generation funnel.",
    author: "Nexus Solutions",
    role: "Operational Efficiency",
    icon: <RocketLaunchIcon className="w-6 h-6 text-cyan-400" />
  }
];

export default function RealWorldFeedback() {
  return (
    <section className="relative py-32 bg-black text-white px-6 overflow-hidden">
      
      {/* Background Glows */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-blue-500/5 blur-[120px] pointer-events-none" />

      <div className="relative max-w-6xl mx-auto z-10 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4">
            Real-World <span className="text-blue-500">Feedback</span>
          </h2>
          <p className="text-gray-400 text-lg italic">
            Built from operational use, not just assumptions.
          </p>
        </motion.div>

        {/* Scrollable Container - Added 'scrollbar-hide' class logic */}
        <div className="flex overflow-x-auto gap-6 pb-12 px-4 snap-x snap-mandatory overflow-y-hidden" 
             style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
          
          {feedbacks.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="min-w-[320px] md:min-w-[450px] snap-center relative p-8 rounded-[2rem] border border-white/10 bg-white/[0.02] backdrop-blur-2xl shadow-2xl flex flex-col justify-between text-left"
            >
              <div>
                <div className="flex gap-1 mb-6">
                  {[...Array(5)].map((_, i) => (
                    <StarIcon key={i} className="w-4 h-4 text-blue-500 fill-blue-500/20" />
                  ))}
                </div>
                
                <blockquote className="text-xl md:text-2xl font-medium text-gray-100 leading-snug italic mb-8">
                  "{item.quote}"
                </blockquote>
              </div>

              <div className="flex items-center gap-4 mt-auto">
                <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center border border-white/10">
                  {item.icon}
                </div>
                <div>
                  <p className="font-bold text-white text-sm tracking-wide">{item.author}</p>
                  <p className="text-[10px] text-blue-500/80 font-semibold uppercase tracking-widest">{item.role}</p>
                </div>
              </div>

              <div className="absolute bottom-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-blue-500/20 to-transparent" />
            </motion.div>
          ))}
        </div>

        <motion.p 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mt-4 text-gray-500 text-sm tracking-wide flex items-center justify-center gap-2"
        >
          <span className="w-8 h-[1px] bg-gray-800" />
          Scroll to explore more
          <span className="w-8 h-[1px] bg-gray-800" />
        </motion.p>
      </div>
    </section>
  );
}
