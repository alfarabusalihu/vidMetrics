'use client';

import Image from 'next/image';
import { AnalysisResult } from '@/types/youtube';
import { Badge } from '@/components/ui/badge';
import { motion } from 'framer-motion';

interface SidebarProps {
  result: AnalysisResult;
}

export function Sidebar({ result }: SidebarProps) {
  return (
    <motion.aside 
      initial={{ opacity: 0, x: -30 }}
      animate={{ opacity: 1, x: 0 }}
      className="md:col-span-3 space-y-8 sticky top-8"
    >
      <div className="bg-[#121212] backdrop-blur-3xl border border-neutral-800/40 p-8 rounded-[2.5rem] shadow-inner-xl space-y-8">
        <div className="relative w-32 h-32 mx-auto">
          <Image 
            src={result.channel.thumbnails.high.url} 
            alt={result.channel.title}
            fill
            className="rounded-full shadow-2xl relative z-10 border-2 border-orange-500/20 object-cover" 
          />
          <div className="absolute inset-0 bg-orange-500/10 blur-2xl rounded-full scale-125" />
        </div>
        
        <div className="text-center space-y-3">
          <h2 className="text-2xl font-black text-white">{result.channel.title}</h2>
          <Badge className="bg-orange-500/10 text-orange-500 border-none px-4 py-1 rounded-full cursor-default">Active Niche</Badge>
        </div>

        <div className="space-y-6 pt-6 border-t border-neutral-800/50">
          <div className="space-y-1">
            <div className="text-[10px] text-neutral-500 uppercase tracking-widest font-black">Subscribers</div>
            <div className="text-2xl font-black text-white">{parseInt(result.channel.statistics.subscriberCount).toLocaleString()}</div>
          </div>
          <div className="space-y-1">
            <div className="text-[10px] text-neutral-500 uppercase tracking-widest font-black">Median Performance</div>
            <div className="text-2xl font-black text-white">{result.medianViews.toLocaleString()} <span className="text-xs text-neutral-500">views</span></div>
          </div>
        </div>

        <p className="text-neutral-400 text-xs leading-relaxed line-clamp-4 font-medium italic opacity-70">
          {result.channel.description}
        </p>
      </div>
    </motion.aside>
  );
}
