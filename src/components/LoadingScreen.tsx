import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import OrynxLogo from './OrynxLogo';

interface LoadingScreenProps {
  isReady?: boolean;
}

const LoadingScreen: React.FC<LoadingScreenProps> = ({ isReady = true }) => {
  const [percent, setPercent] = useState(0);
  const [isVisible, setIsVisible] = useState(true);
  const [currentStep, setCurrentStep] = useState("INITIALIZING_CORE");

  // Handle re-showing the screen on re-sync
  useEffect(() => {
    if (!isReady) {
      setIsVisible(true);
      // If we were already finished, reset slightly to show progress
      setPercent(prev => prev >= 100 ? 92 : prev);
    }
  }, [isReady]);

  const syncSteps = [
    { threshold: 0, label: "BOOT_SEQUENCE_INITIATED" },
    { threshold: 15, label: "ESTABLISHING_DB_HANDSHAKE" },
    { threshold: 35, label: "SYNCHRONIZING_CORE_DATASETS" },
    { threshold: 55, label: "CALIBRATING_VISUAL_RESOURCES" },
    { threshold: 75, label: "OPTIMIZING_INTERFACE_BUFFERS" },
    { threshold: 95, label: "FINALIZING_SYNC_PROTOCOLS" }
  ];

  useEffect(() => {
    if (!isVisible) return;

    const interval = setInterval(() => {
      setPercent(prev => {
        // If data isn't ready, cap at 92% to wait for sync
        if (!isReady && prev >= 92) {
          return 92;
        }

        const next = prev + Math.floor(Math.random() * 20) + 10;
        
        // Update step based on progress
        const step = [...syncSteps].reverse().find(s => next >= s.threshold);
        if (step) setCurrentStep(step.label);

        if (next >= 100) {
          clearInterval(interval);
          setTimeout(() => setIsVisible(false), 400); // Reduced delay before hiding
          return 100;
        }
        return next;
      });
    }, 30); // Faster update interval (from 120ms to 30ms)

    return () => clearInterval(interval);
  }, [isReady, isVisible]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1, ease: "easeInOut" }}
          className="fixed inset-0 z-[9999] bg-brand-black flex flex-col items-center justify-center p-6 overflow-hidden md:cursor-wait"
        >
          {/* Background Grid Accent */}
          <div className="absolute inset-0 opacity-10 pointer-events-none" 
               style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, #333 1px, transparent 0)', backgroundSize: '32px 32px' }}></div>
          
          <div className="relative flex flex-col items-center max-w-sm w-full">
            {/* Logo Container */}
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="mb-12 relative flex flex-col items-center gap-4"
            >
              <div className="w-20 h-20 relative flex items-center justify-center">
                <OrynxLogo className="w-full h-full text-white opacity-80" />
                
                {/* Scan Line Animation */}
                <motion.div 
                  animate={{ top: ['-10%', '110%', '-10%'] }}
                  transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                  className="absolute left-[-20%] right-[-20%] h-[1px] bg-brand-accent/60 shadow-[0_0_15px_rgba(139,92,246,1)] z-10"
                />
              </div>

              <div className="flex flex-col items-center text-center">
                <span className="text-2xl font-display font-light tracking-[0.4em] text-white">ORYNX</span>
                <span className="text-[10px] font-mono font-medium text-brand-accent uppercase tracking-[0.5em] mt-1">digital</span>
              </div>
              
              {/* Corner Accents */}
              <div className="absolute -top-10 -left-10 w-8 h-8 border-t border-l border-white/5" />
              <div className="absolute -bottom-10 -right-10 w-8 h-8 border-b border-r border-white/5" />
            </motion.div>

            {/* Status & Progress */}
            <div className="w-full space-y-4">
              <div className="flex justify-between items-end font-mono text-[9px] uppercase tracking-[0.2em] text-slate-500">
                <div className="flex items-center gap-2">
                  <motion.div 
                    animate={{ scale: [1, 1.5, 1], opacity: [1, 0.5, 1] }}
                    transition={{ duration: 1, repeat: Infinity }}
                    className="w-1 h-1 bg-brand-accent rounded-full"
                  />
                  <span>{currentStep}</span>
                </div>
                <span className="text-brand-accent font-bold">{Math.min(percent, 100)}%</span>
              </div>
              
              <div className="h-[1px] w-full bg-white/5 relative overflow-hidden">
                <motion.div 
                  className="absolute inset-y-0 left-0 bg-brand-accent shadow-[0_0_10px_rgba(139,92,246,0.5)]"
                  initial={{ width: "0%" }}
                  animate={{ width: `${Math.min(percent, 100)}%` }}
                  transition={{ duration: 0.2 }}
                />
              </div>

              {/* Technical Detail Text */}
              <div className="font-mono text-[7px] text-slate-700 uppercase tracking-widest leading-relaxed flex flex-col gap-1">
                <div className="flex justify-between">
                  <span>Core: 0x8B5CF6 // Active</span>
                  <span className="text-right">SECURE_LINK: ESTABLISHED</span>
                </div>
                {percent > 20 && <div className="text-[6px] text-slate-800 opacity-60">{" >> "} FETCHING_COLLECTION: PROJECTS_METADATA</div>}
                {percent > 50 && <div className="text-[6px] text-slate-800 opacity-60">{" >> "} SYNC_RESOURCES: [SUCCESS] 204.2KB_RECVD</div>}
                {percent > 80 && <div className="text-[6px] text-slate-800 opacity-60">{" >> "} DECOMPRESSING_UI_ASSETS: OK</div>}
              </div>
            </div>
          </div>
          
          {/* Decorative Elements */}
          <div className="absolute bottom-12 left-12 font-mono text-[7px] text-slate-800 uppercase vertical-text tracking-[0.5em] hidden lg:block opacity-40">
            Architectural Intelligence System v4.0.2
          </div>
          
          <div className="absolute top-12 right-12 font-mono text-[7px] text-slate-800 uppercase text-right tracking-[0.2em] hidden lg:block opacity-40">
            SYSTEM_ID: AA-6C-5R-JQ<br/>
            UPTIME: 99.98%
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default LoadingScreen;
