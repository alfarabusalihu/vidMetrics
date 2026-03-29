'use client';

import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { YoutubeVideo } from '@/types/youtube';
import { BarChart3, ExternalLink } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { AnalysisPlayer } from './analysis/AnalysisPlayer';
import { AnalysisStats } from './analysis/AnalysisStats';
import { AnalysisCharts } from './analysis/AnalysisCharts';
import { useAnalysisStore } from '@/store/useAnalysisStore';

import { DeepAnalysisModalProps } from '@/types/components';

export function DeepAnalysisModal({ video, isOpen, onClose, channelMedian }: DeepAnalysisModalProps) {
  const result = useAnalysisStore((state) => state.result);
  if (!video || !result) return null;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-6xl w-[95vw] h-[90vh] bg-white/95 backdrop-blur-3xl border border-neutral-200 rounded-2xl shadow-canvas p-0 overflow-hidden">
        <div className="h-full overflow-y-auto custom-scrollbar p-4 sm:p-6 md:p-10">
          <div className="space-y-6 sm:space-y-10">
            {/* Header */}
            <DialogHeader className="space-y-3 sm:space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-6 pr-8 sm:pr-16">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-sky-500/10 rounded-2xl border border-sky-500/20 shadow-inner">
                    <BarChart3 className="h-6 w-6 text-sky-500" />
                  </div>
                  <DialogTitle className="text-xl sm:text-2xl md:text-3xl font-black tracking-tight text-neutral-900 leading-tight">
                    {video.title}
                  </DialogTitle>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <Badge 
                    className="bg-sky-500 text-white border-none py-2 px-6 rounded-md text-[10px] font-black uppercase tracking-widest shadow-lg shadow-sky-500/20 cursor-default"
                    role="status"
                    aria-label="Status: Enterprise Analysis Active"
                  >
                    Enterprise Analysis
                  </Badge>
                  <Link 
                    href={`https://youtube.com/watch?v=${video.id}`} 
                    target="_blank" 
                    className="p-3 bg-neutral-100 hover:bg-neutral-200 rounded-2xl transition-all cursor-pointer border border-neutral-200 shadow-sm group"
                    rel="noreferrer"
                    aria-label={`Watch ${video.title} on YouTube`}
                  >
                    <ExternalLink className="h-4 w-4 text-neutral-500 group-hover:text-neutral-900" aria-hidden="true" />
                  </Link>
                </div>
              </div>
            </DialogHeader>

            {/* Content grid — on mobile: Stats first, Player second, Charts last */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 lg:gap-12">
              {/* Stats — order-first on mobile so it appears at top */}
              <div className="lg:col-span-4 order-first lg:order-last">
                <AnalysisStats video={video} channelMedian={channelMedian} />
              </div>
              {/* Player + Charts — pushed below stats on mobile */}
              <div className="lg:col-span-8 order-last lg:order-first space-y-6 sm:space-y-10">
                <AnalysisPlayer video={video} />
                <AnalysisCharts videos={result.videos} />
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
