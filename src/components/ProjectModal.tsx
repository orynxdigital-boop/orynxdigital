import { motion, AnimatePresence } from "motion/react";
import { X, ExternalLink, ArrowRight, Globe, Smartphone, Tag, Calendar } from "lucide-react";
import { ProjectData } from "../services/storage";

interface ProjectModalProps {
  project: ProjectData | null;
  onClose: () => void;
}

export default function ProjectModal({ project, onClose }: ProjectModalProps) {
  if (!project) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-6">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-slate-950/90 backdrop-blur-sm"
        />

        {/* Modal Content */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="relative w-full max-w-5xl max-h-[90vh] overflow-hidden bg-brand-black border border-white/10 shadow-2xl flex flex-col md:flex-row"
        >
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-0 right-0 z-10 w-12 h-12 flex items-center justify-center text-slate-500 hover:text-white transition-colors border-l border-b border-white/10 bg-brand-black"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Image Section */}
          <div className="w-full md:w-3/5 h-64 md:h-auto overflow-hidden bg-black flex items-center justify-center relative group/img">
            <div className="absolute inset-0 opacity-20 pointer-events-none z-10" 
                 style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, #333 1px, transparent 0)', backgroundSize: '24px 24px' }}></div>
            <img
              src={project.image}
              alt={project.title}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover opacity-80 transition-all duration-[800ms] group-hover/img:opacity-100 ease-in-out"
            />
          </div>

          {/* Details Section */}
          <div className="w-full md:w-2/5 p-8 md:p-12 overflow-y-auto custom-scrollbar border-l border-white/10 flex flex-col">
            <div className="mb-10">
              <div className="flex items-center gap-3 mb-6">
                 <span className="text-[10px] font-mono text-brand-accent tracking-[0.2em] uppercase">[ {project.category} ]</span>
              </div>
              <h2 className="text-4xl md:text-5xl font-display font-light text-white mb-6 uppercase tracking-tighter">
                {project.title}
              </h2>
              <p className="text-slate-500 font-light leading-relaxed text-sm">
                {project.description}
              </p>
            </div>

            <div className="space-y-8 mb-auto">
              <div>
                <h4 className="text-[10px] font-mono text-slate-700 uppercase tracking-widest mb-4">ENGINEERING_STACK</h4>
                <div className="flex flex-wrap gap-2">
                  {project.tags.split(',').map(tag => (
                    <span key={tag.trim()} className="text-[11px] text-slate-400 font-mono border border-white/5 px-2 py-1 uppercase">
                      {tag.trim()}
                    </span>
                  ))}
                </div>
              </div>

              {(project.websiteLink || project.appDownload) && (
                <div className="space-y-4">
                  <h4 className="text-[10px] font-mono text-slate-700 uppercase tracking-widest mb-4">ACCESS_POINTS</h4>
                  {project.websiteLink && (
                    <a 
                      href={project.websiteLink} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-white hover:text-brand-accent text-xs transition-colors flex items-center gap-3 group"
                    >
                      <Globe className="w-3.5 h-3.5 text-slate-700 group-hover:text-brand-accent" />
                      <span className="font-mono uppercase tracking-widest">Global_Web_Protocol</span>
                      <ExternalLink className="w-3 h-3 ml-auto opacity-30" />
                    </a>
                  )}
                  {project.appDownload && (
                    <a 
                      href={project.appDownload} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-white hover:text-brand-accent text-xs transition-colors flex items-center gap-3 group"
                    >
                      <Smartphone className="w-3.5 h-3.5 text-slate-700 group-hover:text-brand-accent" />
                      <span className="font-mono uppercase tracking-widest">Mobile_Interface_Sync</span>
                      <ArrowRight className="w-3 h-3 ml-auto opacity-30" />
                    </a>
                  )}
                </div>
              )}
            </div>

            <div className="mt-12 pt-8 border-t border-white/10 grid grid-cols-1 gap-4">
              {project.websiteLink && (
                <a
                  href={project.websiteLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-white text-brand-black px-8 py-5 font-bold text-center hover:bg-brand-accent hover:text-white transition-all flex items-center justify-center gap-3 uppercase tracking-widest text-[10px]"
                >
                  Initiate Build <ExternalLink className="w-4 h-4" />
                </a>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
