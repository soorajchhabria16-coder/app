import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, ScanFace } from 'lucide-react';
import { Hologram } from './Hologram';

interface HeroProps {
  onGetStarted: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onGetStarted }) => {
  return (
    <div className="relative min-h-[85vh] flex items-center justify-center overflow-hidden bg-slate-950">
      
      {/* 3D Background Layer */}
      <div className="absolute inset-0 z-0 opacity-60">
        <Hologram type="hero" color="#8b5cf6" />
      </div>

      {/* Gradient Overlays for integration */}
      <div className="absolute inset-0 z-0 bg-gradient-to-t from-slate-950 via-slate-950/50 to-transparent" />
      <div className="absolute inset-0 z-0 bg-gradient-to-b from-slate-950 via-transparent to-transparent" />

      <div className="relative z-10 max-w-5xl mx-auto px-6 text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900/80 border border-violet-500/30 text-sm text-violet-300 mb-8 backdrop-blur-xl shadow-[0_0_20px_rgba(139,92,246,0.3)]"
        >
          <span className="w-2 h-2 rounded-full bg-violet-500 animate-pulse shadow-[0_0_10px_#8b5cf6]"></span>
          Now supporting Gaussian Splatting v2.0
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-6xl md:text-8xl font-bold text-white font-space-grotesk tracking-tighter mb-6 leading-[0.9]"
        >
          Immortalize <br/> 
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-violet-400 via-fuchsia-400 to-white animate-gradient-x">
            Your Presence
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="text-xl text-slate-300 max-w-2xl mx-auto mb-10 leading-relaxed font-light"
        >
          Spectra connects high-fidelity digital humans with global film & game studios.
          License your likeness as a background extra and earn passive royalties without leaving your home.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          <button 
            onClick={onGetStarted}
            className="group px-8 py-4 bg-white text-slate-950 font-bold rounded-xl hover:bg-violet-50 transition-all flex items-center justify-center gap-2 shadow-[0_0_30px_rgba(255,255,255,0.2)] hover:shadow-[0_0_40px_rgba(139,92,246,0.4)]"
          >
            Create Digital Twin
            <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
          </button>
          <button className="px-8 py-4 bg-slate-900/50 border border-white/10 text-white font-bold rounded-xl hover:bg-white/10 transition-all flex items-center justify-center gap-2 backdrop-blur-md">
            <ScanFace size={20} className="text-violet-400" />
            Browse Talent
          </button>
        </motion.div>
      </div>
      
      {/* Decorative Grid */}
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 z-0 pointer-events-none mix-blend-overlay"></div>
    </div>
  );
};
