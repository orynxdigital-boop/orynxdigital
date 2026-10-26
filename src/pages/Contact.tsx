import React, { useState } from "react";
import { motion } from "motion/react";
import { Mail, Phone, MapPin, Send, Loader2, CheckCircle2 } from "lucide-react";
import { storage } from "../services/storage";

export default function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const success = await storage.addData("ContactSubmissions", formData);
      if (success) {
        setSubmitted(true);
      } else {
        setError("Failed to send message. Please check your connection.");
      }
    } catch (err) {
      console.error("Error sending message:", err);
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="pt-32 pb-24 min-h-screen bg-brand-black flex items-center justify-center px-6">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="industrial-card p-16 text-center max-w-md w-full border-brand-accent/50"
        >
          <div className="w-20 h-20 border border-brand-accent flex items-center justify-center text-brand-accent mx-auto mb-8">
            <CheckCircle2 className="w-10 h-10" />
          </div>
          <h2 className="text-3xl font-display font-light text-white mb-4 tracking-tighter uppercase">TRANSMISSION_COMPLETE</h2>
          <p className="text-slate-500 font-light mb-12 text-sm leading-relaxed uppercase tracking-widest">
            Data received. Our analysts will contact you following system review.
          </p>
          <button 
            onClick={() => setSubmitted(false)}
            className="w-full bg-white text-brand-black py-4 rounded-sm font-bold hover:bg-brand-accent hover:text-white transition-all uppercase tracking-widest text-xs"
          >
            NEW_RECONNECT
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="pt-32 pb-24 bg-brand-black min-h-screen">
      <div className="max-w-7xl mx-auto px-6">
        <div className="mb-24 px-4 md:px-0">
          <span className="section-label">[ 003 // ESTABLISH_CONTACT ]</span>
          <motion.h1 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-6xl md:text-8xl font-display font-light text-white leading-none tracking-tighter"
          >
            Initiate <span className="text-slate-500 italic">Interface</span>.
          </motion.h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
          {/* Contact Info */}
          <div className="space-y-12 order-2 lg:order-1">
            <div className="p-8 border-l border-white/5 space-y-12">
              <div className="flex flex-col gap-4">
                <span className="section-label !mb-0 text-[10px] opacity-40">SYSTEM_COMMS</span>
                <div>
                   <div className="text-xs text-brand-accent font-mono uppercase tracking-[0.2em] mb-2 font-medium">Link_Node</div>
                   <div className="text-white text-xl font-light tracking-tight">orynxdigital@gmail.com</div>
                </div>
              </div>

              <div className="flex flex-col gap-4">
                <span className="section-label !mb-0 text-[10px] opacity-40">SECURE_LINE</span>
                <div>
                  <div className="text-xs text-brand-accent font-mono uppercase tracking-[0.2em] mb-2 font-medium">Internal_Ext</div>
                  <div className="text-white text-xl font-light tracking-tight">01872537867</div>
                </div>
              </div>

              <div className="flex flex-col gap-4">
                <span className="section-label !mb-0 text-[10px] opacity-40">COORD_LOC</span>
                <div>
                  <div className="text-xs text-brand-accent font-mono uppercase tracking-[0.2em] mb-2 font-medium">Physical_Site</div>
                  <div className="text-white text-xl font-light tracking-tight">Varthur Site, B04</div>
                </div>
              </div>
            </div>

            <div className="p-8 bg-white/[0.02] border border-white/5 font-mono text-[10px] text-slate-500 leading-relaxed uppercase tracking-widest">
               NOTICE: All inquiries are processed through high-priority queue. Response times average &lt; 24h.
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2 order-1 lg:order-2">
            <form onSubmit={handleSubmit} className="space-y-10">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                <div className="space-y-3">
                  <label className="text-[10px] font-mono uppercase tracking-widest text-slate-500 block">Identity_Record</label>
                  <input 
                    required
                    type="text" 
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full bg-transparent border-b border-white/10 py-4 text-white focus:outline-none focus:border-brand-accent transition-all font-light placeholder:text-slate-800"
                    placeholder="NAME_ID"
                  />
                </div>
                <div className="space-y-3">
                  <label className="text-[10px] font-mono uppercase tracking-widest text-slate-500 block">Encrypted_Mail</label>
                  <input 
                    required
                    type="email" 
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full bg-transparent border-b border-white/10 py-4 text-white focus:outline-none focus:border-brand-accent transition-all font-light placeholder:text-slate-800"
                    placeholder="ADDRESS_X"
                  />
                </div>
              </div>
              <div className="space-y-3">
                <label className="text-[10px] font-mono uppercase tracking-widest text-slate-500 block">Object_Header</label>
                <input 
                  required
                  type="text" 
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  className="w-full bg-transparent border-b border-white/10 py-4 text-white focus:outline-none focus:border-brand-accent transition-all font-light placeholder:text-slate-800"
                  placeholder="SUBJECT_LITERAL"
                />
              </div>
              <div className="space-y-3">
                <label className="text-[10px] font-mono uppercase tracking-widest text-slate-500 block">Payload_Data</label>
                <textarea 
                  required
                  rows={4}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="w-full bg-transparent border-b border-white/10 py-4 text-white focus:outline-none focus:border-brand-accent transition-all font-light placeholder:text-slate-800 resize-none"
                  placeholder="INPUT_MESSAGE_HERE..."
                />
              </div>
              
              {error && (
                <div className="text-red-400 font-mono text-[9px] uppercase tracking-widest bg-red-400/5 p-4 border-l border-red-400">
                  CRITICAL_ERR: {error}
                </div>
              )}

              <button 
                disabled={isSubmitting}
                className="group relative flex items-center gap-4 bg-white text-brand-black px-10 py-5 rounded-sm font-bold overflow-hidden transition-all hover:bg-brand-accent hover:text-white disabled:opacity-50"
              >
                <span className="relative z-10 font-mono text-xs uppercase tracking-widest">
                  {isSubmitting ? "PROCESSING..." : "TRANSMIT_DATA"}
                </span>
                {!isSubmitting && <Send className="w-3 h-3 relative z-10 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
