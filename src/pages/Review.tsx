import React, { useState } from "react";
import { motion } from "motion/react";
import { Star, Send, Loader2, CheckCircle2, AlertCircle, Upload, Image as ImageIcon } from "lucide-react";
import { storage } from "../services/storage";

export default function Review() {
  const [formData, setFormData] = useState({
    name: "",
    role: "",
    content: "",
    rating: 5,
    image: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const MAX_WIDTH = 150;
        const MAX_HEIGHT = 150;
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > MAX_WIDTH) {
            height *= MAX_WIDTH / width;
            width = MAX_WIDTH;
          }
        } else {
          if (height > MAX_HEIGHT) {
            width *= MAX_HEIGHT / height;
            height = MAX_HEIGHT;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx?.drawImage(img, 0, 0, width, height);
        
        // Compress to JPEG with 0.7 quality to fit in Google Sheets cell limit
        const dataUrl = canvas.toDataURL('image/jpeg', 0.7);
        setFormData({ ...formData, image: dataUrl });
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const success = await storage.addData("Reviews", formData);
      if (success) {
        setSubmitted(true);
      } else {
        setError("Failed to submit review. Please check your Google Sheets API URL.");
      }
    } catch (err) {
      console.error("Error submitting review:", err);
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="pt-32 pb-24 min-h-screen flex items-center justify-center px-6">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="glass-card p-12 text-center max-w-md w-full"
        >
          <div className="w-20 h-20 bg-emerald-500/10 rounded-full flex items-center justify-center text-emerald-400 mx-auto mb-6">
            <CheckCircle2 className="w-10 h-10" />
          </div>
          <h2 className="text-3xl font-display font-bold text-white mb-4">Thank You!</h2>
          <p className="text-slate-400 mb-8">
            Your review has been successfully submitted to our Google Sheet. We appreciate your feedback!
          </p>
          <button 
            onClick={() => setSubmitted(false)}
            className="w-full bg-white text-slate-950 py-4 rounded-xl font-bold hover:bg-cyan-50 transition-all"
          >
            Submit Another Review
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="pt-32 pb-24">
      <div className="max-w-3xl mx-auto px-6">
        <div className="text-center mb-16">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-6xl font-display font-bold text-white mb-6"
          >
            Share Your <span className="text-gradient">Experience</span>
          </motion.h1>
          <p className="text-slate-400 text-lg">
            Your feedback helps us grow. Please take a moment to review our services.
          </p>
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass-card p-8 md:p-12"
        >
          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-400 uppercase tracking-wider">Full Name</label>
                <input 
                  required
                  type="text" 
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-cyan-500 transition-colors"
                  placeholder="John Doe"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-400 uppercase tracking-wider">Role / Company</label>
                <input 
                  type="text" 
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-cyan-500 transition-colors"
                  placeholder="CEO at TechCorp"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-400 uppercase tracking-wider">Star Rating</label>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setFormData({ ...formData, rating: star })}
                    className="focus:outline-none transition-transform active:scale-90"
                  >
                    <Star 
                      className={`w-8 h-8 ${star <= formData.rating ? 'fill-cyan-500 text-cyan-500' : 'text-slate-700'}`} 
                    />
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-400 uppercase tracking-wider">Your Testimonial</label>
              <textarea 
                required
                rows={4}
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-cyan-500 transition-colors resize-none"
                placeholder="Tell us about your experience working with Orynx Digital..."
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-400 uppercase tracking-wider">Your Photo (Optional)</label>
              <div className="flex items-center gap-4">
                {formData.image ? (
                  <div className="relative w-16 h-16 rounded-full overflow-hidden border-2 border-cyan-500 shrink-0">
                    <img src={formData.image} alt="Avatar preview" className="w-full h-full object-cover" />
                  </div>
                ) : (
                  <div className="w-16 h-16 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-slate-500 shrink-0">
                    <ImageIcon className="w-6 h-6" />
                  </div>
                )}
                <div className="flex-grow relative">
                  <input 
                    type="file" 
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                  <div className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white flex items-center gap-2 hover:bg-white/10 transition-colors">
                    <Upload className="w-4 h-4 text-cyan-400" />
                    <span className="text-sm">{formData.image ? "Change Photo" : "Upload Photo"}</span>
                  </div>
                </div>
              </div>
            </div>

            {error && (
              <div className="flex items-center gap-3 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm">
                <AlertCircle className="w-5 h-5 shrink-0" />
                {error}
              </div>
            )}

            <button 
              disabled={isSubmitting}
              className="w-full bg-white text-slate-950 py-4 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-cyan-50 transition-all disabled:opacity-50"
            >
              {isSubmitting ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  <Send className="w-5 h-5" /> Submit Review
                </>
              )}
            </button>
          </form>
        </motion.div>
      </div>
    </div>
  );
}
