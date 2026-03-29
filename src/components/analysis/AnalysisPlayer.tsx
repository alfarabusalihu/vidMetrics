'use client';

import { YoutubeVideo } from '@/types/youtube';

interface AnalysisPlayerProps {
  video: YoutubeVideo;
}

export function AnalysisPlayer({ video }: AnalysisPlayerProps) {
  return (
    <div className="lg:col-span-8 space-y-8">
      <div className="aspect-video w-full rounded-[2.5rem] overflow-hidden bg-black shadow-inner-xl border-4 border-neutral-900/50 relative group">
        <iframe
          className="w-full h-full"
          src={`https://www.youtube.com/embed/${video.id}?autoplay=0`}
          title="YouTube video player"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>
      
      <div className="bg-[#1a1a1a] backdrop-blur-xl border border-neutral-800/50 p-8 rounded-[2rem] space-y-4">
        <h4 className="text-[10px] text-neutral-500 font-black uppercase tracking-widest">Video Description</h4>
        <p className="text-neutral-400 text-sm leading-relaxed line-clamp-6 font-medium">
          {video.description}
        </p>
      </div>
    </div>
  );
}
