import { motion, AnimatePresence } from "motion/react";
import { ArrowRight, ChevronRight, ExternalLink, Star, Quote, ChevronLeft, Layers, Eye } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { storage, ReviewData, ServiceData, ProjectData, SocialLinkData, TradeData, StatData } from "../services/storage";
import OrynxLogo from "../components/OrynxLogo";
import ProjectModal from "../components/ProjectModal";

export default function Home() {
  const navigate = useNavigate();
  const [currentReview, setCurrentReview] = useState(0);
  const [reviews, setReviews] = useState<ReviewData[]>([]);
  const [services, setServices] = useState<ServiceData[]>([]);
  const [projects, setProjects] = useState<ProjectData[]>([]);
  const [socialLinks, setSocialLinks] = useState<SocialLinkData[]>([]);
  const [trades, setTrades] = useState<TradeData[]>([]);
  const [stats, setStats] = useState<StatData[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedProject, setSelectedProject] = useState<ProjectData | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [revs, servs, projs, socs, trds, stts] = await Promise.all([
          storage.getReviews(),
          storage.getServices(),
          storage.getProjects(),
          storage.getSocialLinks(),
          storage.getTrades(),
          storage.getStats()
        ]);
        
        if (revs.length > 0) setReviews(revs);
        setServices(servs);
        setProjects(projs);
        setSocialLinks(socs);
        setTrades(trds.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).slice(0, 3));
        setStats(stts);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (reviews.length <= 1) return;
    const timer = setInterval(() => {
      setCurrentReview((prev) => (prev + 1) % reviews.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [reviews.length]);

  const nextReview = () => setCurrentReview((prev) => (prev + 1) % reviews.length);
  const prevReview = () => setCurrentReview((prev) => (prev - 1 + reviews.length) % reviews.length);

  return (
    <div className="pt-20 bg-brand-black">
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 md:pt-40 md:pb-32 overflow-hidden border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6">
          <div className="max-w-4xl">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
            >
              <span className="section-label">
                [ 001 // CREATIVE_LAB ]
              </span>
              <h1 className="text-6xl md:text-8xl font-display font-light text-white leading-[0.95] mb-8 tracking-tighter">
                Engineering <span className="text-brand-accent italic">Exceptional</span> <br /> 
                <span className="text-gradient">Digital</span> Experiences.
              </h1>
              <p className="text-xl md:text-2xl text-slate-500 font-light leading-relaxed mb-12 max-w-2xl border-l border-brand-accent/30 pl-6">
                A specialized creative agency building high-performance digital products that merge technical precision with visionary design.
              </p>
              <div className="flex flex-wrap gap-6">
                <Link to="/showcase" className="px-10 py-4 bg-brand-accent text-white font-bold text-sm uppercase tracking-widest hover:bg-brand-accent/80 transition-all duration-300 shadow-[0_0_20px_-5px_rgba(139,92,246,0.5)]">
                  Explore Systems
                </Link>
                <Link to="/contact" className="px-10 py-4 border border-white/10 text-white font-bold text-sm uppercase tracking-widest hover:border-brand-accent/30 transition-all duration-300">
                  Initiate Build
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats Section - Industrial Bar */}
      {stats.length > 0 && (
        <section className="py-0 border-b border-white/5">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-white/5">
              {stats.map((stat, index) => (
                <div key={stat.id} className="p-10 flex flex-col items-center justify-center group hover:bg-white/[0.02] transition-colors">
                  <div className="font-mono text-[10px] text-slate-600 mb-2 tracking-widest">METRIC_{String(index + 1).padStart(2, '0')}</div>
                  <div className="text-4xl md:text-5xl font-display font-light text-white mb-1 tracking-tighter">{stat.value}</div>
                  <div className="text-[10px] text-brand-accent font-bold uppercase tracking-[0.2em]">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Featured Showcase Preview */}
      <section className="py-32 bg-brand-black">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-baseline mb-20 gap-8">
            <div>
              <span className="section-label">[ 002 // SYSTEM_SHOWCASE ]</span>
              <h2 className="text-4xl md:text-6xl font-display font-light text-white tracking-tighter">Strategic Deployments</h2>
            </div>
            <Link to="/showcase" className="group flex items-center gap-4 text-xs font-mono uppercase tracking-[0.3em] text-slate-500 hover:text-brand-accent transition-colors">
              VIEW_ALL_RECORDS <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {projects.length > 0 ? projects.map((project, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                onClick={() => setSelectedProject(project)}
                className="industrial-card group cursor-pointer border-white/5 hover:border-brand-accent/50 transition-all duration-700"
              >
                <div className="aspect-[16/11] overflow-hidden relative group-hover:shadow-[0_0_40px_-10px_rgba(139,92,246,0.3)] transition-all duration-700">
                  <img 
                    src={project.image} 
                    alt={project.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-105 transition-all duration-[800ms] ease-in-out"
                  />
                </div>
                <div className="p-8 border-t border-white/5 bg-brand-black">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <div className="font-mono text-[9px] uppercase tracking-widest text-brand-accent mb-2">{project.category}</div>
                      <h3 className="text-3xl font-display font-light text-white tracking-tight group-hover:translate-x-2 transition-transform duration-500">{project.title}</h3>
                    </div>
                    <div className="w-10 h-10 border border-white/10 flex items-center justify-center group-hover:bg-brand-accent group-hover:border-brand-accent transition-all duration-500">
                      <ArrowRight className="w-4 h-4 text-white -rotate-45 group-hover:rotate-0 transition-transform" />
                    </div>
                  </div>
                  <p className="text-slate-500 text-sm font-light leading-relaxed max-w-md line-clamp-2">
                    {project.description}
                  </p>
                </div>
              </motion.div>
            )) : (
              <div className="col-span-2 text-center py-20 border border-dashed border-white/10 rounded-sm font-mono text-xs text-slate-600">
                SYSTEM_ERROR: NO_RECORDS_FOUND
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Trades Preview Section */}
      {trades.length > 0 && (
        <section className="py-32 border-y border-white/5">
          <div className="max-w-7xl mx-auto px-6">
            <div className="flex flex-col md:flex-row justify-between items-baseline mb-20 gap-8">
              <div>
                <span className="section-label">[ 003 // INTEL_FEED ]</span>
                <h2 className="text-4xl md:text-6xl font-display font-light text-white tracking-tighter">Latest Intelligence</h2>
              </div>
              <Link to="/trades" className="group flex items-center gap-4 text-xs font-mono uppercase tracking-[0.3em] text-slate-500 hover:text-brand-accent transition-colors">
                READ_MODULES <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {trades.map((trade, index) => (
                <motion.div
                  key={trade.id}
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  onClick={() => navigate('/trades')}
                  className="industrial-card group cursor-pointer flex flex-col h-full hover:border-white/20 transition-all"
                >
                  {trade.image && (
                    <div className="aspect-video overflow-hidden border-b border-white/5">
                      <img 
                        src={trade.image} 
                        alt={trade.title}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover group-hover:scale-105 transition-all duration-1000"
                      />
                    </div>
                  )}
                  <div className="p-8 flex-grow flex flex-col bg-brand-black">
                      <div className="font-mono text-[9px] text-slate-600 mb-2 uppercase tracking-widest">
                        FILE_{String(index + 1).padStart(3, '0')}
                      </div>
                    <h3 className="text-xl font-display font-light text-white mb-4 group-hover:text-brand-accent transition-colors">{trade.title}</h3>
                    <p className="text-slate-500 text-sm font-light leading-relaxed line-clamp-3 mb-8 flex-grow">
                      {trade.content}
                    </p>
                    <div className="flex justify-between items-center pt-6 border-t border-white/5 font-mono text-[10px] text-slate-600 uppercase tracking-wider">
                      <span>{new Date(trade.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}</span>
                      <span className="text-slate-400">DATA_LOCKED</span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Services Section */}
      {services.length > 0 && (
        <section className="py-32">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-24">
              <span className="section-label">[ 004 // CAPABILITIES ]</span>
              <h2 className="text-5xl md:text-7xl font-display font-light text-white tracking-tighter">Strategic Solutions</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 border-t border-white/5">
              {services.map((service, index) => (
                <div key={service.id} className={`p-12 group hover:bg-white/[0.02] transition-all border-b border-white/5 ${index % 3 !== 2 ? 'md:border-r' : ''}`}>
                  <div className="w-12 h-12 border border-brand-accent/30 flex items-center justify-center text-brand-accent mb-8 group-hover:bg-brand-accent group-hover:text-white transition-all transform group-hover:rotate-12">
                    <Layers className="w-5 h-5" />
                  </div>
                  <div className="font-mono text-[9px] text-slate-600 mb-4 uppercase tracking-[0.3em]">SERVICE_ID_{String(index + 1).padStart(2, '0')}</div>
                  <h3 className="text-2xl font-display font-light text-white mb-4 tracking-tight">{service.title}</h3>
                  <p className="text-slate-500 text-sm font-light leading-relaxed">{service.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Reviews Section - Editorial Style */}
      {reviews.length > 0 && (
        <section className="py-32 bg-brand-black border-t border-white/5">
          <div className="max-w-7xl mx-auto px-6">
            <div className="flex flex-col md:flex-row gap-20">
              <div className="md:w-1/3">
                <span className="section-label">[ 005 // VERIFICATION ]</span>
                <h2 className="text-4xl md:text-5xl font-display font-light text-white tracking-tighter leading-tight mb-8">
                  Validated by Industry Leaders.
                </h2>
                <div className="flex gap-4">
                  <button onClick={prevReview} className="w-12 h-12 border border-white/10 flex items-center justify-center text-white hover:bg-white/10 transition-all">
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <button onClick={nextReview} className="w-12 h-12 border border-white/10 flex items-center justify-center text-white hover:bg-white/10 transition-all">
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
              </div>

              <div className="md:w-2/3">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentReview}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.5 }}
                  >
                    <div className="flex flex-col gap-10">
                      <Quote className="w-12 h-12 text-brand-accent/20" />
                      <p className="text-2xl md:text-4xl font-display font-light text-white leading-relaxed tracking-tight italic">
                        "{reviews[currentReview]?.content}"
                      </p>
                      <div className="flex items-center gap-6 pt-10 border-t border-white/5">
                        <div className="w-16 h-16 rounded-sm overflow-hidden border border-white/10">
                          <img 
                            src={reviews[currentReview]?.image || "https://i.pravatar.cc/150?u=fallback"} 
                            alt={reviews[currentReview]?.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div>
                          <h4 className="text-lg font-bold text-white tracking-widest uppercase text-sm">{reviews[currentReview]?.name}</h4>
                          <p className="text-brand-accent font-mono text-[10px] uppercase tracking-[0.2em]">{reviews[currentReview]?.role}</p>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>
          </div>
        </section>
      )}


      <ProjectModal 
        project={selectedProject} 
        onClose={() => setSelectedProject(null)} 
      />
    </div>
  );
}
