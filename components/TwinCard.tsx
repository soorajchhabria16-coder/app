import React, { useState } from 'react';
import { Twin } from '../types';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, ShieldCheck, Cpu, Box, Image as ImageIcon, Move3d } from 'lucide-react';
import { Hologram } from './Hologram';

interface TwinCardProps {
  twin: Twin;
  onLicense: (twin: Twin) => void;
}

export const TwinCard: React.FC<TwinCardProps> = ({ twin, onLicense }) => {
  const [is3DMode, setIs3DMode] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02, boxShadow: "0px 0px 30px rgba(139, 92, 246, 0.2)" }}
      className="relative group overflow-hidden rounded-2xl bg-slate-900/50 border border-white/10 backdrop-blur-md transition-all duration-300 h-full flex flex-col"
    >
      <div className="relative h-72 overflow-hidden bg-slate-950">
        <AnimatePresence mode="wait" initial={false}>
          {!is3DMode ? (
            <motion.div 
              key="image"
              initial={{ opacity: 0, scale: 1.1, filter: "blur(10px)" }}
              animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
              exit={{ opacity: 0, scale: 1.1, filter: "blur(10px)" }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              className="h-full w-full relative"
            >
               <img 
                src={twin.imageUrl} 
                alt={twin.name} 
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent opacity-90" />
            </motion.div>
          ) : (
             <motion.div 
              key="3d"
              initial={{ opacity: 0, scale: 0.9, filter: "blur(10px)" }}
              animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
              exit={{ opacity: 0, scale: 0.9, filter: "blur(10px)" }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="h-full w-full cursor-grab active:cursor-grabbing bg-slate-900"
            >
              {/* Radial gradient background for depth */}
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-violet-900/20 via-slate-950/60 to-slate-950 pointer-events-none"></div>
              
              <Hologram type="preview" color="#a78bfa" />
              
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-950/80 border border-violet-500/30 backdrop-blur-md pointer-events-none shadow-lg shadow-violet-500/10"
              >
                <Move3d size={14} className="text-violet-400 animate-pulse" />
                <span className="text-[10px] font-bold text-violet-200 uppercase tracking-wider">Interactive 3D</span>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
        
        {/* Badges / Controls */}
        <div className="absolute top-3 right-3 flex gap-2 z-20">
           <div className="relative">
             <motion.button 
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={(e) => { e.stopPropagation(); setIs3DMode(!is3DMode); }}
              onMouseEnter={() => setShowTooltip(true)}
              onMouseLeave={() => setShowTooltip(false)}
              className={`p-2 rounded-full backdrop-blur-md border transition-colors duration-300 ${
                is3DMode 
                  ? 'bg-violet-600 border-violet-500 text-white shadow-[0_0_15px_rgba(139,92,246,0.5)]' 
                  : 'bg-slate-950/60 border-white/20 text-slate-300 hover:bg-slate-800'
              }`}
              aria-label={is3DMode ? "Switch to 2D Image" : "View 3D Model"}
             >
              <AnimatePresence mode="wait" initial={false}>
                {is3DMode ? (
                  <motion.div 
                    key="img-icon"
                    initial={{ rotate: -90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: 90, opacity: 0 }}
                  >
                    <ImageIcon size={16} />
                  </motion.div>
                ) : (
                  <motion.div 
                    key="3d-icon"
                    initial={{ rotate: 90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: -90, opacity: 0 }}
                  >
                    <Box size={16} />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.button>

            <AnimatePresence>
              {showTooltip && (
                <motion.div
                  initial={{ opacity: 0, x: 10, scale: 0.9 }}
                  animate={{ opacity: 1, x: 0, scale: 1 }}
                  exit={{ opacity: 0, x: 10, scale: 0.9 }}
                  className="absolute right-full top-1/2 -translate-y-1/2 mr-3 px-3 py-1.5 bg-slate-900/90 border border-white/20 rounded-lg whitespace-nowrap backdrop-blur-xl pointer-events-none shadow-xl z-50"
                >
                  <span className="text-xs font-medium text-slate-200">
                    {is3DMode ? "Switch to 2D Image" : "View 3D Model"}
                  </span>
                  <div className="absolute top-1/2 -translate-y-1/2 -right-1 border-[4px] border-transparent border-l-slate-900/90" />
                </motion.div>
              )}
            </AnimatePresence>
           </div>
        </div>

        {twin.isVerified && (
          <div className="absolute top-3 left-3 z-20">
            <div className="flex items-center gap-1.5 bg-emerald-500/20 backdrop-blur-md border border-emerald-500/30 px-2.5 py-1 rounded-full text-emerald-300 shadow-sm">
              <ShieldCheck size={12} />
              <span className="text-[10px] font-bold uppercase tracking-wide">Verified</span>
            </div>
          </div>
        )}

        {/* Text Overlay */}
        <div className="absolute bottom-3 left-3 right-3 pointer-events-none z-10">
          <h3 className="text-xl font-bold text-white mb-1 font-space-grotesk drop-shadow-lg">{twin.name}</h3>
          <div className="flex flex-wrap gap-1 mb-2">
            {twin.genres.slice(0, 2).map((genre, i) => (
              <span key={i} className="text-[10px] px-2 py-0.5 rounded-full bg-white/10 text-slate-200 border border-white/5 backdrop-blur-sm shadow-sm">
                {genre}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
        <div>
          <div className="flex justify-between items-center text-sm text-slate-400 mb-2">
            <div className="flex items-center gap-1">
              <Star size={14} className="text-yellow-500 fill-yellow-500" />
              <span className="font-medium text-slate-200">{twin.rating.toFixed(1)}</span>
            </div>
            <div className="flex items-center gap-1 bg-cyan-950/30 px-2 py-0.5 rounded text-cyan-400 border border-cyan-500/20">
              <Cpu size={12} />
              <span className="text-xs font-bold">HIGH POLY</span>
            </div>
          </div>

          <p className="text-sm text-slate-300 line-clamp-2 leading-relaxed">
            {twin.bio}
          </p>
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-white/5 mt-auto">
          <div>
            <p className="text-[10px] text-slate-500 uppercase tracking-wider font-bold">License Fee</p>
            <p className="text-lg font-bold text-violet-400 font-space-grotesk">${twin.pricePerUse.toFixed(2)}</p>
          </div>
          <button 
            onClick={() => onLicense(twin)}
            className="px-5 py-2.5 bg-slate-100 text-slate-950 text-sm font-bold rounded-xl hover:bg-white hover:shadow-[0_0_15px_rgba(255,255,255,0.3)] transition-all transform hover:-translate-y-0.5 active:scale-95"
          >
            License Asset
          </button>
        </div>
      </div>
    </motion.div>
  );
};