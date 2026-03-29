'use client';


import { Card, CardContent } from '@/components/ui/card';
import Image from 'next/image';
import Link from 'next/link';
import { BarChart3, ExternalLink } from 'lucide-react';
import { motion } from 'framer-motion';

import { memo } from 'react';

import { VideoCardProps } from '@/types/components';

export const VideoCard = memo(function VideoCard({ video, onClick }: VideoCardProps) {
  return (
    <Card 
      onClick={() => onClick(video)}
      className={`bg-white border-neutral-200 overflow-hidden cursor-pointer group rounded-xl p-0 gap-0 flex flex-col h-full transition-all duration-500 hover:border-blue-900/20 hover:shadow-[0_20px_40px_rgba(0,0,0,0.1)] shadow-inner-card relative ${video.isCrushing ? 'ring-1 ring-orange-500/10' : ''}`}
    >
      <article aria-label={`Metrics for: ${video.title}`} className="flex flex-col flex-1">
      <div className="relative aspect-video group/thumb overflow-hidden">
        <Link 
          href={`https://youtube.com/watch?v=${video.id}`} 
          target="_blank" 
          rel="noreferrer"
          className="block w-full h-full relative z-10"
          aria-label={`Watch ${video.title} on YouTube`}
        >
          <Image 
            src={video.thumbnails.high.url} 
            alt={`Video Thumbnail for ${video.title}`}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover w-full h-full brightness-90 group-hover:brightness-100 transition-all duration-700 group-hover:scale-105" 
          />
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/thumb:opacity-100 transition-opacity flex items-center justify-center z-20">
            <ExternalLink className="h-8 w-8 text-white drop-shadow-2xl" aria-hidden="true" />
          </div>
        </Link>
        {video.isCrushing && (
          <div className="absolute top-4 left-4 bg-orange-500 text-white text-[9px] font-black px-3 py-1 rounded-full uppercase tracking-widest shadow-xl z-30">
            🔥 Crushing
          </div>
        )}
      </div>
      <CardContent className="p-4 sm:p-6 space-y-4 sm:space-y-6">
        <h3 className="text-sm font-black leading-tight text-neutral-900 group-hover:text-blue-900 transition-colors min-h-[2.5rem]">
          {video.title}
        </h3>
        
        <div className="flex items-center justify-between gap-4">
          <div className="space-y-4 flex-1">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-neutral-100 rounded-xl shadow-inner text-neutral-500 group-hover:text-sky-500 transition-colors">
                <BarChart3 className="h-4 w-4" />
              </div>
              <div>
                <div className="text-lg font-black text-neutral-900 tabular-nums">{parseInt(video.statistics.viewCount).toLocaleString()}</div>
                <div className="text-[9px] text-neutral-500 font-bold uppercase tracking-widest">Views</div>
              </div>
            </div>
          </div>

          <div className="relative w-14 h-14 flex items-center justify-center">
            <svg className="w-full h-full -rotate-90">
              <circle className="text-neutral-100" strokeWidth="6" stroke="currentColor" fill="transparent" r="24" cx="28" cy="28" />
              <motion.circle 
                initial={{ pathLength: 0 }}
                animate={{ pathLength: video.crushingScore / 100 }}
                className="text-orange-500 max-[768px]:drop-shadow-[0_0_8px_rgba(249,115,22,0.4)]" strokeWidth="6" strokeDasharray="150.8" strokeLinecap="round" stroke="currentColor" fill="transparent" r="24" cx="28" cy="28" 
              />
            </svg>
            <span className="absolute text-sm font-black text-neutral-900">{video.crushingScore}</span>
          </div>
        </div>
      </CardContent>
      </article>
    </Card>
  );
});
