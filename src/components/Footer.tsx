import React, { useState, useEffect } from "react";
import { Twitter, Github, Linkedin, Mail, Share2 } from "lucide-react";
import { Link } from "react-router-dom";
import OrynxLogo from "./OrynxLogo";
import { storage, SocialLinkData } from "../services/storage";

export default function Footer() {
  const [socialLinks, setSocialLinks] = useState<SocialLinkData[]>([]);

  useEffect(() => {
    const fetchSocial = async () => {
      const data = await storage.getSocialLinks();
      setSocialLinks(data);
    };
    fetchSocial();
  }, []);

  return (
    <footer className="py-20 border-t border-white/5 bg-brand-black/50 backdrop-blur-xl relative overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-[1px] bg-gradient-to-r from-transparent via-brand-accent/50 to-transparent" />
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-start gap-16">
          <div className="flex flex-col gap-6">
            <Link to="/" className="flex items-center gap-3">
              <OrynxLogo className="w-10 h-10" />
              <div className="flex flex-col leading-none text-left">
                <span className="text-xl font-display font-light text-white tracking-widest">ORYNX</span>
                <span className="text-[10px] font-mono font-medium text-brand-accent uppercase tracking-[0.3em]">Digital_Studio</span>
              </div>
            </Link>
            <p className="text-slate-500 text-xs font-mono max-w-[240px] leading-relaxed uppercase tracking-wider opacity-60">
              Structural perfection in digital design. Specializing in high-performance digital infrastructure.
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 gap-12 text-left">
            <div className="flex flex-col gap-4">
              <span className="section-label !mb-2">[NAV_LINKS]</span>
              <div className="flex flex-col gap-2 font-mono text-[11px] uppercase tracking-widest text-slate-400">
                <Link to="/services" className="hover:text-white transition-colors">Services</Link>
                <Link to="/showcase" className="hover:text-white transition-colors">Showcase</Link>
                <Link to="/trades" className="hover:text-white transition-colors">Trades</Link>
              </div>
            </div>
            <div className="flex flex-col gap-4">
              <span className="section-label !mb-2">[LEGAL]</span>
              <div className="flex flex-col gap-2 font-mono text-[11px] uppercase tracking-widest text-slate-400">
                <Link to="/privacy-policy" className="hover:text-white transition-colors">Privacy</Link>
                <Link to="/admin" className="hover:text-white transition-colors">System_Admin</Link>
              </div>
            </div>
          </div>

          <div className="flex flex-col items-end gap-6 self-stretch md:self-auto">
            <div className="flex items-center gap-4">
              {socialLinks.length > 0 ? socialLinks.map((link) => (
                <a 
                  key={link.id} 
                  href={link.url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-10 h-10 border border-white/5 flex items-center justify-center text-slate-500 hover:text-brand-accent hover:border-brand-accent transition-all overflow-hidden"
                  title={link.platform}
                >
                  {link.image ? (
                    <img src={link.image} alt={link.platform} className="w-6 h-6 object-contain" />
                  ) : (
                    <Share2 className="w-4 h-4" />
                  )}
                </a>
              )) : (
                <div className="flex gap-2">
                   {[Twitter, Github, Linkedin, Mail].map((Icon, idx) => (
                      <a key={idx} href="#" className="w-10 h-10 border border-white/5 flex items-center justify-center text-slate-500 hover:text-brand-accent hover:border-brand-accent transition-all">
                        <Icon className="w-4 h-4" />
                      </a>
                   ))}
                </div>
              )}
            </div>
            <div className="text-right">
              <div className="text-slate-600 font-mono text-[10px] uppercase tracking-[0.2em]">
                © {new Date().getFullYear()} ORYNX_DIGITAL_SYSTEMS
              </div>
              <div className="text-slate-700 font-mono text-[9px] uppercase tracking-widest mt-1">
                BUILD_ID: 2026.05.03.PATCHED
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
