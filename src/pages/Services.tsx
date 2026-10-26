import { motion } from "motion/react";
import { Globe, Smartphone, Cpu, Layers, Loader2 } from "lucide-react";
import { useState, useEffect } from "react";
import { storage, ServiceData } from "../services/storage";

const IconMap: Record<string, any> = {
  Globe,
  Smartphone,
  Cpu,
  Layers,
};

export default function Services() {
  const [services, setServices] = useState<ServiceData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const data = await storage.getServices();
        setServices(data);
      } catch (error) {
        console.error("Error fetching services:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchServices();
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
          <span className="section-label">[ 001 // CORE_CAPABILITIES ]</span>
          <motion.h1 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-6xl md:text-8xl font-display font-light text-white leading-none tracking-tighter"
          >
            Our <span className="text-slate-500 italic">Precision</span> Engineering.
          </motion.h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 border-t border-white/5">
          {services.length > 0 ? services.map((service, index) => {
            const IconComponent = IconMap[service.icon] || Layers;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="p-12 border-b border-white/5 hover:bg-white/[0.02] transition-all group relative overflow-hidden"
              >
                <div className="absolute top-0 left-0 w-8 h-[1px] bg-brand-accent transform -translate-x-full group-hover:translate-x-0 transition-transform duration-500" />
                <div className="flex justify-between items-start mb-12">
                   <div className="w-14 h-14 border border-brand-accent/30 flex items-center justify-center text-brand-accent group-hover:bg-brand-accent group-hover:text-white transition-all">
                      <IconComponent className="w-6 h-6" />
                    </div>
                    <div className="font-mono text-[10px] text-slate-600 uppercase tracking-widest">
                       MODULE_ID_{String(index + 1).padStart(2, '0')}
                    </div>
                </div>
                <h3 className="text-3xl font-display font-light text-white mb-6 tracking-tight group-hover:translate-x-2 transition-transform duration-500">{service.title}</h3>
                <p className="text-slate-500 font-light leading-relaxed max-w-md">
                  {service.description}
                </p>
              </motion.div>
            );
          }) : (
            <div className="col-span-full text-center py-20 border border-dashed border-white/10 rounded-sm font-mono text-xs text-slate-600 uppercase tracking-widest">
               FETCH_ERROR: NO_SERVICES_DEFINED
            </div>
          )}
        </div>

        {/* Process Section */}
        <div className="mt-48">
          <div className="mb-24">
             <span className="section-label text-center mx-auto">[ 002 // DEVELOPMENT_LIFECYCLE ]</span>
             <h2 className="text-4xl md:text-6xl font-display font-light text-white tracking-tighter text-center">Engineered For Scale</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 border border-white/5">
            {[
              { step: "01", title: "Discovery", desc: "Rigorous research and architectural planning to ensure long-term stability." },
              { step: "02", title: "Execution", desc: "Technical implementation using modern benchmarks and industrial-grade standards." },
              { step: "03", title: "Deployment", desc: "Global asset delivery with ongoing monitoring and system optimization." }
            ].map((item, i) => (
              <div key={i} className={`p-12 flex flex-col group hover:bg-white/[0.02] transition-colors ${i < 2 ? 'md:border-r border-white/5' : ''}`}>
                <div className="text-5xl font-display font-light text-white/10 mb-8 font-mono group-hover:text-brand-accent/20 transition-colors uppercase tracking-tighter">PHASE_{item.step}</div>
                <h4 className="text-xl font-display font-light text-white mb-4 tracking-widest uppercase text-sm">{item.title}</h4>
                <p className="text-slate-500 text-sm font-light leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
