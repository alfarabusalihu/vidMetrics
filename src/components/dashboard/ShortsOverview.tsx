'use client';

import { useAnalysisStore } from '@/store/useAnalysisStore';
import { Zap, Video } from 'lucide-react';
import { motion } from 'framer-motion';

export function ShortsOverview() {
  const result = useAnalysisStore((state) => state.result);

  if (!result || !result.shortsCount) return null;

  const { shortsCount, avgShortsScore } = result;
  
  return (
    <motion.div 
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full bg-gradient-to-r from-orange-500/10 via-sky-800/5 to-transparent border border-orange-500/20 rounded-3xl p-4 sm:p-6 mb-8 flex flex-col sm:flex-row items-center gap-6 sm:gap-10 relative overflow-hidden group"
      role="region"
      aria-label="Shorts Content Performance Summary"
    >
      <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/5 blur-[50px] rounded-full translate-x-16 -translate-y-16 group-hover:bg-orange-500/10 transition-all duration-700" />
      
      <div className="flex-1 space-y-2">
        <div className="flex items-center gap-2 text-orange-500 font-black uppercase tracking-[0.2em] text-[10px]">
          <Zap className="h-4 w-4 fill-orange-500" aria-hidden="true" /> 
          Shorts Performance Analysis
        </div>
        <h3 className="text-xl sm:text-2xl font-black text-neutral-900 tracking-tight">
          Vertical Content Mastery: <span className="text-sky-800">{shortsCount}</span> Recent Shorts
        </h3>
        <p className="text-xs text-neutral-500 font-medium leading-relaxed max-w-2xl">
          Shorts are currently your most consistent growth lever. Your vertical content is averaging a 
          <span className="text-orange-600 font-bold mx-1"> {avgShortsScore}% </span> 
          crushing score, significantly impacting your channel&apos;s virality.
        </p>
      </div>

      <div className="flex items-center gap-6 shrink-0 bg-white/50 backdrop-blur-sm p-4 rounded-2xl border border-white/50 shadow-sm">
        <div className="text-center space-y-1">
          <div className="text-[9px] text-neutral-400 font-black uppercase tracking-widest">Avg Score</div>
          <div className="text-2xl font-black text-orange-500">{avgShortsScore}</div>
        </div>
        <div className="h-10 w-px bg-neutral-200" />
        <div className="text-center space-y-1">
          <div className="text-[9px] text-neutral-400 font-black uppercase tracking-widest">Quantity</div>
          <div className="text-2xl font-black text-neutral-900">{shortsCount}</div>
        </div>
      </div>

      <div className="hidden lg:flex items-center gap-2 absolute -right-2 top-1/2 -translate-y-1/2 opacity-10 group-hover:opacity-20 transition-opacity">
        <Video className="h-20 w-20 text-neutral-900" />
      </div>
    </motion.div>
  );
}
