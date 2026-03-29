'use client';

import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { YoutubeVideo } from '@/types/youtube';
import { BarChart3, ExternalLink } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { AnalysisPlayer } from './analysis/AnalysisPlayer';
import { AnalysisStats } from './analysis/AnalysisStats';

interface DeepAnalysisModalProps {
  video: YoutubeVideo | null;
  isOpen: boolean;
  onClose: () => void;
  channelMedian: number;
}

export function DeepAnalysisModal({ video, isOpen, onClose, channelMedian }: DeepAnalysisModalProps) {
  if (!video) return null;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="h-full border-none shadow-none">
        <div className="h-full overflow-y-auto custom-scrollbar">
          <div className="p-8 md:p-12 space-y-12">
            {/* Header */}
            <DialogHeader className="space-y-6">
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 pr-16">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-orange-500/10 rounded-2xl shadow-inner-card">
                    <BarChart3 className="h-6 w-6 text-orange-500" />
                  </div>
                  <DialogTitle className="text-3xl md:text-4xl font-black tracking-tight text-white leading-tight">
                    {video.title}
                  </DialogTitle>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <Badge className="bg-orange-500 text-white border-none py-2 px-6 rounded-full text-[12px] font-black uppercase tracking-widest shadow-lg shadow-orange-500/20 cursor-default">
                    Deep Analysis
                  </Badge>
                  <Link 
                    href={`https://youtube.com/watch?v=${video.id}`} 
                    target="_blank" 
                    className="p-3 bg-neutral-900 hover:bg-neutral-800 rounded-2xl transition-all cursor-pointer border border-neutral-800 shadow-inner-lg group"
                    rel="noreferrer"
                  >
                    <ExternalLink className="h-5 w-5 text-neutral-400 group-hover:text-white" />
                  </Link>
                </div>
              </div>
            </DialogHeader>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
              <AnalysisPlayer video={video} />
              <AnalysisStats video={video} channelMedian={channelMedian} />
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
