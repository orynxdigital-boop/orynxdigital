import { motion, AnimatePresence } from "motion/react";
import { ExternalLink, ArrowRight, Loader2, Eye } from "lucide-react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { storage, ProjectData } from "../services/storage";
import ProjectModal from "../components/ProjectModal";

export default function Showcase() {
  const navigate = useNavigate();
  const [projects, setProjects] = useState<ProjectData[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedProject, setSelectedProject] = useState<ProjectData | null>(null);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const data = await storage.getProjects();
        setProjects(data);
      } catch (error) {
        console.error("Error fetching projects:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProjects();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950">
        <Loader2 className="w-12 h-12 text-cyan-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="pt-32 pb-24 bg-brand-black min-h-screen">
      <div className="max-w-7xl mx-auto px-6">
        <div className="mb-24">
          <span className="section-label">[ 001 // UNIT_DEPLOYMENTS ]</span>
          <motion.h1 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-6xl md:text-8xl font-display font-light text-white leading-none tracking-tighter"
          >
            Digital <span className="text-slate-500 italic">Inventory</span>.
          </motion.h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
          {projects.length > 0 ? projects.map((project, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.05 }}
              onClick={() => navigate(`/project/${project.id}`)}
              className="industrial-card group cursor-pointer border-white/5 hover:border-brand-accent/50 transition-all duration-700 h-full flex flex-col"
            >
              <div className="aspect-[4/3] overflow-hidden border-b border-white/5 relative bg-black flex items-center justify-center p-8">
                <img 
                  src={project.image} 
                  alt={project.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-contain group-hover:scale-105 transition-all duration-[800ms] ease-in-out"
                />
              </div>
              <div className="p-8 flex-grow flex flex-col">
                <div className="flex justify-between items-start mb-6">
                   <div>
                     <div className="font-mono text-[9px] uppercase tracking-widest text-brand-accent mb-2">{project.category}</div>
                     <h3 className="text-2xl font-display font-light text-white tracking-tight">{project.title}</h3>
                   </div>
                   <div className="font-mono text-[9px] text-slate-700">VER_0.4</div>
                </div>
                
                <p className="text-slate-500 text-sm font-light leading-relaxed line-clamp-2 mb-8">
                  {project.description}
                </p>
                
                <div className="flex flex-wrap gap-2 mb-8 flex-grow items-start">
                  {project.tags.split(',').map(tag => (
                    <span key={tag.trim()} className="px-2 py-1 border border-white/5 font-mono text-[9px] text-slate-500 uppercase tracking-widest">
                      {tag.trim()}
                    </span>
                  ))}
                </div>

                <div className="flex justify-between items-center pt-8 border-t border-white/5">
                   <div className="flex gap-4">
                      {project.websiteLink && (
                        <a 
                          href={project.websiteLink} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className="text-[10px] font-mono text-slate-400 hover:text-brand-accent transition-colors flex items-center gap-1 uppercase tracking-widest"
                        >
                          LIVE_REP
                        </a>
                      )}
                      {project.appDownload && (
                        <a 
                          href={project.appDownload} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className="text-[10px] font-mono text-slate-400 hover:text-brand-accent transition-colors flex items-center gap-1 uppercase tracking-widest"
                        >
                          EXE_PULL
                        </a>
                      )}
                   </div>
                   <div className="w-8 h-8 border border-white/10 flex items-center justify-center group-hover:bg-brand-accent group-hover:border-brand-accent transition-all">
                      <ArrowRight className="w-3 h-3 text-white -rotate-45 group-hover:rotate-0 transition-transform" />
                   </div>
                </div>
              </div>
            </motion.div>
          )) : (
            <div className="col-span-full text-center py-20 border border-dashed border-white/10 rounded-sm font-mono text-xs text-slate-600 uppercase tracking-widest">
               FETCH_ERROR: NO_RECORDS_INITIALIZED
            </div>
          )}
        </div>
        <ProjectModal 
          project={selectedProject} 
          onClose={() => setSelectedProject(null)} 
        />
      </div>
    </div>
  );
}
