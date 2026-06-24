import React from 'react';
import { motion } from 'motion/react';
import { Globe, ExternalLink, Sparkles } from 'lucide-react';

export const PortfolioButton: React.FC = () => {
  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className="relative group mt-4 sm:mt-0"
    >
      {/* Heavy Breathing Color Halo Effect */}
      <motion.div
        animate={{
          opacity: [0.3, 0.6, 0.3],
          scale: [1, 1.05, 1],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute -inset-1 bg-gradient-to-r from-[#e8cc34]/30 via-[#ff3366]/30 to-[#33ffff]/30 rounded-full blur-xl group-hover:blur-2xl transition-all duration-500"
      />

      <a
        href="https://ganeshraikwar.vercel.app"
        target="_blank"
        rel="noopener noreferrer"
        className="relative block p-[2px] rounded-full overflow-hidden shadow-[0_0_40px_rgba(0,0,0,0.8)]"
      >
        {/* Dynamic border lighting that accelerates & lights up on hover */}
        <div className="absolute left-[50%] top-[50%] aspect-square w-[300%] -translate-x-1/2 -translate-y-1/2">
          <motion.div
            animate={{ rotate: [0, 360] }}
            transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
            className="w-full h-full bg-[conic-gradient(from_0deg,transparent_0_180deg,#e8cc34_240deg,#ffd700_300deg,#f59e0b_360deg)] opacity-70 group-hover:opacity-100 transition-opacity duration-500"
          />
        </div>

        {/* Glossy Core button with blurred dark overlay */}
        <div className="relative flex items-center justify-center gap-4 px-8 md:px-10 py-3.5 md:py-4 bg-[#0a0a0c] group-hover:bg-[#121118] backdrop-blur-3xl rounded-full overflow-hidden transition-all duration-500">
          
          {/* Tilting & Oscillating Globe Icon */}
          <motion.div
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            className="relative z-10"
          >
            <Globe className="w-5 h-5 text-[#e8cc34]/50 group-hover:text-[#e8cc34] transition-colors duration-300 drop-shadow-[0_0_8px_rgba(232,204,52,0.5)]" />
          </motion.div>

          {/* Dynamic Metallic / Multicolored Text */}
          <span className="text-[11px] md:text-sm font-black tracking-[0.3em] uppercase text-transparent bg-clip-text bg-gradient-to-r from-white via-white/80 to-white/50 group-hover:from-[#e8cc34] group-hover:via-[#ff3366] group-hover:to-[#33ffff] transition-all duration-500 relative z-10 drop-shadow-sm">
            VISIT PORTFOLIO
          </span>

          {/* Gliding Arrow Icon */}
          <motion.div
            animate={{ x: [0, 4, 0] }}
            transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
            className="relative z-10"
          >
            <ExternalLink className="w-5 h-5 text-white/30 group-hover:text-[#33ffff] transition-colors duration-300 drop-shadow-[0_0_8px_rgba(51,255,255,0.5)]" />
          </motion.div>
        </div>
      </a>
    </motion.div>
  );
};

export const GaneshBadge: React.FC = () => {
  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      className="relative group flex-shrink-0 cursor-default"
    >
      {/* Background Animated Glowing Aura */}
      <motion.div
        animate={{
          opacity: [0.2, 0.5, 0.2],
          scale: [1, 1.05, 1],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute -inset-1 bg-gradient-to-r from-[#e8cc34]/20 via-[#ff3366]/20 to-[#33ffff]/20 rounded-full blur-xl group-hover:blur-2xl transition-all duration-500"
      />

      {/* Main Container Wrapper with Rotating Border Effect */}
      <div className="relative block p-[2px] rounded-full overflow-hidden shadow-[0_0_40px_rgba(0,0,0,0.8)]">
        {/* Border Conic Rotating Gradient (Anti-clockwise) */}
        <div className="absolute left-[50%] top-[50%] aspect-square w-[300%] -translate-x-1/2 -translate-y-1/2">
          <motion.div
            animate={{ rotate: [0, -360] }}
            transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
            className="w-full h-full bg-[conic-gradient(from_0deg,transparent_0_180deg,#e8cc34_240deg,#ff3366_300deg,#33ffff_360deg)] opacity-60 group-hover:opacity-100 transition-colors duration-700"
          />
        </div>

        {/* Content Container (Sleek dark background with backdrop blur) */}
        <div className="relative flex md:flex-row flex-col items-center justify-center gap-2 md:gap-4 px-6 md:px-10 py-3 md:py-4 bg-[#0a0a0c] group-hover:bg-[#121118] backdrop-blur-3xl rounded-full overflow-hidden transition-all duration-500">
          
          {/* Sparkles Icon with Gradient and Infinite Rotation & Pulse */}
          <motion.div
            animate={{ 
              rotate: [0, 180, 360],
              scale: [1, 1.2, 1]
            }}
            transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
            className="flex items-center justify-center w-6 h-6 rounded-full bg-gradient-to-tr from-[#ff3366]/20 to-[#33ffff]/20 border border-[#ff3366]/40 relative z-10 hidden md:flex"
          >
            <Sparkles className="w-3 h-3 text-[#ff3366] drop-shadow-[0_0_8px_rgba(255,51,102,0.8)]" />
          </motion.div>

          {/* Subtext */}
          <span className="text-white/40 group-hover:text-white/60 text-[10px] md:text-xs font-mono tracking-widest uppercase transition-colors duration-300 relative z-10 text-center">
            Designed & Architected By
          </span>

          {/* Main Name with Vivid Neon Color Shift */}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#e8cc34] via-[#ff3366] to-[#33ffff] font-black text-xs md:text-sm tracking-[0.2em] drop-shadow-[0_0_10px_rgba(255,51,102,0.6)] uppercase relative z-10 group-hover:brightness-125 transition-all duration-300 text-center">
            Ganesh Raikwar
          </span>
        </div>
      </div>
    </motion.div>
  );
};
