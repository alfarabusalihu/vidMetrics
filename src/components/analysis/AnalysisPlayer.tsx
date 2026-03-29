'use client';

import { YoutubeVideo } from '@/types/youtube';

import { AnalysisPlayerProps } from '@/types/components';

export function AnalysisPlayer({ video }: AnalysisPlayerProps) {
  return (
    <div className="lg:col-span-8">
      <div className="aspect-video w-full rounded-2xl overflow-hidden bg-black shadow-lg border-4 border-neutral-200 relative group">
        <iframe
          className="w-full h-full"
          src={`https://www.youtube.com/embed/${video.id}?autoplay=0`}
          title="YouTube video player"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>
    </div>
  );
}
