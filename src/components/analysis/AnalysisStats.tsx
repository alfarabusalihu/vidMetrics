'use client';

import { YoutubeVideo } from '@/types/youtube';
import { TrendingUp, BarChart3, Users, Heart, MessageSquare, Calendar } from 'lucide-react';

interface AnalysisStatsProps {
  video: YoutubeVideo;
  channelMedian: number;
}

export function AnalysisStats({ video, channelMedian }: AnalysisStatsProps) {
  const views = parseInt(video.statistics.viewCount);
  const performanceVsMedian = (views / (channelMedian || 1)).toFixed(1);

  return (
    <div className="lg:col-span-4 space-y-8">
      <div className="grid grid-cols-1 gap-6">
        {/* Performance Card */}
        <div className="bg-[#1a1a1a] p-6 rounded-[2rem] border border-neutral-800/50 shadow-inner-card space-y-4">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-orange-500/10 rounded-xl">
              <TrendingUp className="h-5 w-5 text-orange-500" />
            </div>
            <div>
              <div className="text-3xl font-black text-white tabular-nums">{performanceVsMedian}x</div>
              <div className="text-[10px] text-neutral-500 font-black uppercase tracking-widest">vs Median Performance</div>
            </div>
          </div>
        </div>

        {/* Crushing Score Card */}
        <div className="bg-[#1a1a1a] p-6 rounded-[2rem] border border-neutral-800/50 shadow-inner-card space-y-4">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-maroon-900/20 rounded-xl">
              <BarChart3 className="h-5 w-5 text-red-500" />
            </div>
            <div>
              <div className="text-3xl font-black text-white tabular-nums">{video.crushingScore}/100</div>
              <div className="text-[10px] text-neutral-500 font-black uppercase tracking-widest">Overall Analysis Score</div>
            </div>
          </div>
        </div>

        {/* Secondary Stats Grid */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-[#121212] p-5 rounded-3xl border border-neutral-800/30 space-y-2">
             <Users className="h-4 w-4 text-neutral-500" />
             <div className="text-xl font-black text-white">{parseInt(video.statistics.viewCount).toLocaleString()}</div>
             <div className="text-[9px] text-neutral-500 font-bold uppercase tracking-widest">Views</div>
          </div>
          <div className="bg-[#121212] p-5 rounded-3xl border border-neutral-800/30 space-y-2">
             <Heart className="h-4 w-4 text-orange-500" />
             <div className="text-xl font-black text-white">{parseInt(video.statistics.likeCount).toLocaleString()}</div>
             <div className="text-[9px] text-neutral-500 font-bold uppercase tracking-widest">Likes</div>
          </div>
          <div className="bg-[#121212] p-5 rounded-3xl border border-neutral-800/30 space-y-2">
             <MessageSquare className="h-4 w-4 text-neutral-500" />
             <div className="text-xl font-black text-white">{parseInt(video.statistics.commentCount).toLocaleString()}</div>
             <div className="text-[9px] text-neutral-500 font-bold uppercase tracking-widest">Comments</div>
          </div>
          <div className="bg-[#121212] p-5 rounded-3xl border border-neutral-800/30 space-y-2">
             <Calendar className="h-4 w-4 text-neutral-500" />
             <div className="text-xs font-black text-white">{new Date(video.publishedAt).toLocaleDateString()}</div>
             <div className="text-[9px] text-neutral-500 font-bold uppercase tracking-widest">Published</div>
          </div>
        </div>
      </div>

      {/* AI Insight Placeholder */}
      <div className="bg-orange-950/20 border border-orange-900/30 p-6 rounded-[2rem] space-y-4">
        <h4 className="text-[10px] text-orange-500 font-black uppercase tracking-widest">Quick Insight</h4>
        <p className="text-neutral-300 text-sm leading-relaxed italic font-medium">
          &quot;This video strategy is highly effective. It has achieved a {performanceVsMedian}x multiplier compared to the channel baseline, indicating high algorithmic favor.&quot;
        </p>
      </div>
    </div>
  );
}
