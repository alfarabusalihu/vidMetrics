'use client';

import { YoutubeVideo } from '@/types/youtube';
import { Card, CardContent } from '@/components/ui/card';
import Image from 'next/image';
import Link from 'next/link';
import { BarChart3, ExternalLink } from 'lucide-react';
import { motion } from 'framer-motion';

interface VideoCardProps {
  video: YoutubeVideo;
  onClick: (video: YoutubeVideo) => void;
}

export function VideoCard({ video, onClick }: VideoCardProps) {
  return (
    <Card 
      onClick={() => onClick(video)}
      className={`bg-[#1a1a1a] border-neutral-800/80 overflow-hidden cursor-pointer group rounded-[2rem] transition-all duration-500 hover:border-orange-500/30 hover:shadow-[0_20px_40px_rgba(0,0,0,0.6)] shadow-inner-card relative ${video.isCrushing ? 'ring-1 ring-orange-500/10' : ''}`}
    >
      <div className="relative aspect-video group/thumb overflow-hidden">
        <Link 
          href={`https://youtube.com/watch?v=${video.id}`} 
          target="_blank" 
          rel="noreferrer"
          className="block w-full h-full relative z-10"
        >
          <Image 
            src={video.thumbnails.high.url} 
            alt={video.title}
            fill
            className="object-cover w-full h-full brightness-90 group-hover:brightness-100 transition-all duration-700 group-hover:scale-105" 
          />
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/thumb:opacity-100 transition-opacity flex items-center justify-center z-20">
            <ExternalLink className="h-8 w-8 text-white drop-shadow-2xl" />
          </div>
        </Link>
        {video.isCrushing && (
          <div className="absolute top-4 left-4 bg-orange-500 text-white text-[9px] font-black px-3 py-1 rounded-full uppercase tracking-widest shadow-xl z-30">
            🔥 Crushing
          </div>
        )}
      </div>
      <CardContent className="p-6 space-y-6">
        <h3 className="line-clamp-2 text-sm font-black leading-tight text-white group-hover:text-orange-400 transition-colors h-10">
          {video.title}
        </h3>
        
        <div className="flex items-center justify-between gap-4">
          <div className="space-y-4 flex-1">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-neutral-900 rounded-xl shadow-inner text-neutral-400 group-hover:text-orange-500 transition-colors">
                <BarChart3 className="h-4 w-4" />
              </div>
              <div>
                <div className="text-lg font-black text-white tabular-nums">{parseInt(video.statistics.viewCount).toLocaleString()}</div>
                <div className="text-[9px] text-neutral-500 font-bold uppercase tracking-widest">Views</div>
              </div>
            </div>
          </div>

          <div className="relative w-14 h-14 flex items-center justify-center">
            <svg className="w-full h-full -rotate-90">
              <circle className="text-neutral-900" strokeWidth="6" stroke="currentColor" fill="transparent" r="24" cx="28" cy="28" />
              <motion.circle 
                initial={{ pathLength: 0 }}
                animate={{ pathLength: video.crushingScore / 100 }}
                className="text-orange-500" strokeWidth="6" strokeDasharray="150.8" strokeLinecap="round" stroke="currentColor" fill="transparent" r="24" cx="28" cy="28" 
              />
            </svg>
            <span className="absolute text-sm font-black text-white">{video.crushingScore}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
