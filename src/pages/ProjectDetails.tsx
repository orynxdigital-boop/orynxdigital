import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { motion } from "motion/react";
import { ArrowLeft, ExternalLink, Download, Loader2, Calendar, Tag } from "lucide-react";
import { storage, ProjectData } from "../services/storage";

export default function ProjectDetails() {
  const { id } = useParams<{ id: string }>();
  const [project, setProject] = useState<ProjectData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const projects = await storage.getProjects();
        const found = projects.find(p => p.id === id);
        setProject(found || null);
      } catch (error) {
        console.error("Error fetching project:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProject();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950">
        <Loader2 className="w-12 h-12 text-cyan-500 animate-spin" />
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen pt-32 pb-24 flex flex-col items-center justify-center text-center px-6">
        <h1 className="text-4xl font-bold text-white mb-4">Project Not Found</h1>
        <p className="text-slate-400 mb-8">The project you're looking for doesn't exist or has been removed.</p>
        <Link to="/showcase" className="px-6 py-3 bg-cyan-600 text-white rounded-xl font-bold hover:bg-cyan-500 transition-colors">
          Back to Showcase
        </Link>
      </div>
    );
  }

  return (
    <div className="pt-32 pb-24 min-h-screen bg-slate-950">
      <div className="max-w-5xl mx-auto px-6">
        <Link to="/showcase" className="inline-flex items-center gap-2 text-slate-400 hover:text-white transition-colors mb-8">
          <ArrowLeft className="w-4 h-4" /> Back to Showcase
        </Link>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card overflow-hidden rounded-3xl"
        >
          <div className="w-full h-64 md:h-96 bg-slate-900 flex items-center justify-center p-8 border-b border-white/5">
            <img 
              src={project.image} 
              alt={project.title}
              referrerPolicy="no-referrer"
              className="w-full h-full object-contain"
            />
          </div>

          <div className="p-8 md:p-12">
            <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 mb-8">
              <div>
                <span className="inline-block px-3 py-1 bg-cyan-500/10 text-cyan-400 text-[10px] font-bold uppercase tracking-widest rounded-full mb-4">
                  {project.category}
                </span>
                <h1 className="text-3xl md:text-5xl font-display font-bold text-white mb-4">
                  {project.title}
                </h1>
                <div className="flex flex-wrap gap-2">
                  {project.tags.split(',').map(tag => (
                    <span key={tag.trim()} className="px-3 py-1 bg-white/5 rounded-full text-xs text-slate-300 border border-white/10 flex items-center gap-1">
                      <Tag className="w-3 h-3" /> {tag.trim()}
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex flex-col gap-3 min-w-[200px]">
                {project.websiteLink && (
                  <a 
                    href={project.websiteLink} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="w-full px-6 py-3 bg-cyan-600 text-white rounded-xl font-bold hover:bg-cyan-500 transition-all shadow-lg shadow-cyan-600/20 flex items-center justify-center gap-2"
                  >
                    Visit Website <ExternalLink className="w-4 h-4" />
                  </a>
                )}
                {project.appDownload && (
                  <a 
                    href={project.appDownload} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="w-full px-6 py-3 bg-white/10 text-white rounded-xl font-bold hover:bg-white/20 transition-all border border-white/5 flex items-center justify-center gap-2"
                  >
                    Download App <Download className="w-4 h-4" />
                  </a>
                )}
              </div>
            </div>

            <div className="prose prose-invert max-w-none">
              <h3 className="text-xl font-bold text-white mb-4">About the Project</h3>
              <p className="text-slate-300 leading-relaxed text-lg whitespace-pre-wrap">
                {project.description}
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
