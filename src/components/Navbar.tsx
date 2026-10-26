import { motion, AnimatePresence } from "motion/react";
import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";
import OrynxLogo from "./OrynxLogo";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu when route changes
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  const navItems = [
    { name: "Home", path: "/" },
    { name: "Services", path: "/services" },
    { name: "Showcase", path: "/showcase" },
    { name: "Trades", path: "/trades" },
    { name: "About", path: "/about" },
    { name: "Review", path: "/review" },
    { name: "Contact", path: "/contact" },
  ];

  return (
    <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${scrolled ? "bg-brand-black/95 backdrop-blur-md border-b border-white/5 py-4" : "bg-transparent py-6"}`}>
      <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
        <Link to="/" className="flex items-center gap-3">
          <OrynxLogo className="w-12 h-12" />
          <div className="flex flex-col leading-none">
            <span className="text-xl font-display font-light tracking-widest text-white">ORYNX</span>
            <span className="text-[10px] font-mono font-medium text-brand-accent uppercase tracking-[0.3em]">digital</span>
          </div>
        </Link>
        
        <div className="hidden md:flex items-center gap-8 text-[11px] font-mono uppercase tracking-[0.2em] text-slate-500">
          {navItems.map((item) => (
            <Link 
              key={item.name} 
              to={item.path} 
              className={`transition-colors hover:text-white ${location.pathname === item.path ? "text-brand-accent font-bold" : ""}`}
            >
              {item.name}
            </Link>
          ))}
          <Link to="/contact" className="ml-4 bg-brand-accent text-white px-6 py-2 rounded-sm font-bold shadow-[0_0_15px_-3px_rgba(139,92,246,0.5)] hover:bg-brand-accent/80 transition-all uppercase text-[10px]">
            Initiate Build
          </Link>
        </div>

        {/* Mobile Menu Toggle */}
        <button 
          className="md:hidden text-white p-2 border border-white/10 rounded-sm"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile Menu Dropdown */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="md:hidden absolute top-full left-0 w-full bg-brand-black border-b border-white/5 py-8 px-6 flex flex-col gap-6 shadow-2xl"
          >
            {navItems.map((item, index) => (
              <Link 
                key={item.name} 
                to={item.path} 
                className={`text-sm font-mono uppercase tracking-widest py-2 border-b border-white/5 transition-colors ${location.pathname === item.path ? "text-brand-accent" : "text-slate-400 hover:text-white"}`}
              >
                <span className="text-[10px] opacity-30 mr-4">{String(index + 1).padStart(2, '0')}</span>
                {item.name}
              </Link>
            ))}
            <Link to="/contact" className="bg-white text-brand-black text-center py-4 mt-4 rounded-sm font-bold text-sm tracking-widest hover:bg-brand-accent hover:text-white transition-all uppercase">
              Initiate build
            </Link>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
