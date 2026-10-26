import { motion } from "motion/react";
import { Shield, Zap, Heart, Users } from "lucide-react";

export default function About() {
  return (
    <div className="pt-32 pb-24">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mb-32">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <h1 className="text-4xl md:text-6xl font-display font-bold text-white mb-8">
              We are <span className="text-gradient">Orynx Digital</span>
            </h1>
            <p className="text-slate-400 text-lg leading-relaxed mb-6">
              Founded in 2020, Orynx Digital was born out of a passion for creating digital experiences that don't just work—they inspire. We are a team of designers, developers, and strategists dedicated to pushing the boundaries of what's possible online.
            </p>
            <p className="text-slate-400 text-lg leading-relaxed">
              Our mission is to empower brands through innovative technology and exceptional design. We believe that every digital touchpoint is an opportunity to build trust and deliver value.
            </p>
          </motion.div>
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative"
          >
            <div className="aspect-square rounded-3xl overflow-hidden glass-card p-2">
              <img 
                src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80&w=1000" 
                alt="Our Team" 
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover rounded-2xl opacity-80"
              />
            </div>
            <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-indigo-600/20 blur-3xl rounded-full -z-10" />
          </motion.div>
        </div>

        {/* Values */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {[
            { icon: <Zap />, title: "Innovation", desc: "Always exploring new technologies and creative approaches." },
            { icon: <Shield />, title: "Quality", desc: "Uncompromising standards in every line of code and pixel." },
            { icon: <Heart />, title: "Passion", desc: "We love what we do, and it shows in the products we build." },
            { icon: <Users />, title: "Collaboration", desc: "Your success is our success. We work as an extension of your team." }
          ].map((value, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="glass-card p-8 text-center"
            >
              <div className="w-12 h-12 bg-indigo-500/10 rounded-xl flex items-center justify-center text-indigo-400 mx-auto mb-6">
                {value.icon}
              </div>
              <h3 className="text-xl font-bold text-white mb-3">{value.title}</h3>
              <p className="text-slate-400 text-sm leading-relaxed">{value.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
