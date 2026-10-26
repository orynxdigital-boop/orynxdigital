import { motion } from "motion/react";
import { Shield, Lock, Eye, FileText } from "lucide-react";

export default function PrivacyPolicy() {
  const sections = [
    {
      icon: <Eye className="w-6 h-6 text-cyan-400" />,
      title: "Information We Collect",
      content: "We collect information you provide directly to us, such as when you create an account, submit a review, or contact us for support. This may include your name, email address, and any other information you choose to provide."
    },
    {
      icon: <Lock className="w-6 h-6 text-cyan-400" />,
      title: "How We Use Your Information",
      content: "We use the information we collect to provide, maintain, and improve our services, to develop new ones, and to protect Orynx Digital and our users. We also use this information to offer you tailored content – like giving you more relevant search results and ads."
    },
    {
      icon: <Shield className="w-6 h-6 text-cyan-400" />,
      title: "Information Security",
      content: "We work hard to protect Orynx Digital and our users from unauthorized access to or unauthorized alteration, disclosure, or destruction of information we hold. We restrict access to personal information to Orynx Digital employees, contractors, and agents who need to know that information."
    },
    {
      icon: <FileText className="w-6 h-6 text-cyan-400" />,
      title: "Changes to This Policy",
      content: "Our Privacy Policy may change from time to time. We will not reduce your rights under this Privacy Policy without your explicit consent. We will post any privacy policy changes on this page and, if the changes are significant, we will provide a more prominent notice."
    }
  ];

  return (
    <div className="pt-32 pb-24">
      <div className="max-w-4xl mx-auto px-6">
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-16 h-16 bg-cyan-500/10 rounded-2xl flex items-center justify-center text-cyan-400 mx-auto mb-6 border border-cyan-500/20"
          >
            <Shield className="w-8 h-8" />
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-6xl font-display font-bold text-white mb-6"
          >
            Privacy <span className="text-gradient">Policy</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-slate-400 text-lg"
          >
            Last updated: April 5, 2026. Your privacy is our top priority.
          </motion.p>
        </div>

        <div className="space-y-8">
          {sections.map((section, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="glass-card p-8 md:p-10"
            >
              <div className="flex items-start gap-6">
                <div className="shrink-0 p-3 bg-cyan-500/10 rounded-xl border border-cyan-500/20">
                  {section.icon}
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white mb-4">{section.title}</h2>
                  <p className="text-slate-400 leading-relaxed">
                    {section.content}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mt-16 p-8 rounded-3xl bg-white/[0.02] border border-white/5 text-center"
        >
          <p className="text-slate-500 text-sm">
            If you have any questions about this Privacy Policy, please contact us at{" "}
            <a href="mailto:privacy@orynx.digital" className="text-cyan-400 hover:underline">
              privacy@orynx.digital
            </a>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
