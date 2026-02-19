import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import logo from "../assets/Leadmate-Logo.png"; 

export default function Footer() {
  const currentYear = new Date().getFullYear();

  // Updated paths to ensure they match your routing
  const footerLinks = [
    { name: "Home", path: "/" },
    { name: "Pricing", path: "/pricing" },
    { name: "Use Cases", path: "/use-cases" },
    { name: "Documentation", path: "/docs" },
    { name: "Privacy Policy", path: "/privacy" },
  ];

  return (
    <footer className="relative bg-black pt-24 pb-10 px-6 overflow-hidden">
      {/* 3D Theme Accent: Gradient Divider */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-px bg-gradient-to-r from-transparent via-blue-500/40 to-transparent" />
      
      <div className="max-w-7xl mx-auto flex flex-col items-center">
        
        {/* Brand Section with 3D Float */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex flex-col items-center mb-12"
        >
          <Link to="/" className="flex items-center gap-3 mb-4 group">
            <motion.img 
              whileHover={{ rotateY: 180 }}
              transition={{ duration: 0.6 }}
              src={logo} 
              alt="LeadMates Logo" 
              className="w-10 h-10 object-contain" 
            />
            <span className="text-2xl font-black text-white tracking-tighter">
              Lead<span className="text-blue-500">Mates</span>
            </span>
          </Link>
          <p className="text-gray-500 text-center max-w-sm text-sm leading-relaxed">
            The conversion infrastructure for teams that depend on <br />
            <span className="text-gray-300">predictable inquiries and repeatable execution.</span>
          </p>
        </motion.div>

        {/* Navigation Links with Kinetic Hover */}
        <nav className="flex flex-wrap justify-center gap-x-10 gap-y-4 mb-16">
          {footerLinks.map((link) => (
            <Link
              key={link.name}
              to={link.path}
              className="relative group text-xs uppercase tracking-[0.25em] font-bold text-gray-500 hover:text-white transition-colors duration-300"
            >
              {link.name}
              <span className="absolute -bottom-1 left-0 w-0 h-px bg-blue-500 transition-all duration-300 group-hover:w-full" />
            </Link>
          ))}
        </nav>

        {/* Bottom Bar: Copyright & Infrastructure Status */}
        <div className="w-full pt-10 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="text-[11px] text-gray-600 uppercase tracking-[0.15em] font-medium text-center md:text-left">
            © {currentYear} <span className="text-gray-400">LeadMates</span>. 
            A division of the <span className="text-blue-500/80">TechMates Technologies</span> ecosystem.
          </div>

          <div className="flex items-center gap-6">
            {/* Status Indicator */}
            <div className="flex items-center gap-2.5 px-3 py-1.5 rounded-full bg-white/[0.03] border border-white/5">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
              </span>
              <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">
                Nodes Operational
              </span>
            </div>

            {/* Back to Top */}
            <motion.button
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              whileHover={{ y: -3 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center gap-2 text-[10px] text-blue-500 font-black uppercase tracking-tighter hover:text-blue-400 transition-colors"
            >
              Elevate <span className="text-lg">↑</span>
            </motion.button>
          </div>
        </div>
      </div>

      {/* Deep Background Glow */}
      <div className="absolute -bottom-24 left-1/2 -translate-x-1/2 w-[800px] h-[300px] bg-blue-600/[0.03] blur-[150px] pointer-events-none" />
    </footer>
  );
}
