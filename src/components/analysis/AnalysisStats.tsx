'use client';

import { YoutubeVideo } from '@/types/youtube';
import { TrendingUp, BarChart3, Users, Heart, MessageSquare, Calendar } from 'lucide-react';

import { AnalysisStatsProps } from '@/types/components';

export function AnalysisStats({ video, channelMedian }: AnalysisStatsProps) {
  const views = parseInt(video.statistics.viewCount);
  const performanceVsMedian = (views / (channelMedian || 1)).toFixed(1);

  return (
    <div className="lg:col-span-4 space-y-8">
      <div className="grid grid-cols-1 gap-6">
        {/* Performance Card */}
        <div className="bg-white p-6 rounded-2xl border border-neutral-200 shadow-sm space-y-4">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-sky-500/10 rounded-xl">
              <TrendingUp className="h-5 w-5 text-sky-500" />
            </div>
            <div>
              <div className="text-3xl font-black text-neutral-900 tabular-nums">{performanceVsMedian}x</div>
              <div className="text-[10px] text-neutral-500 font-black uppercase tracking-widest">vs Median Performance</div>
            </div>
          </div>
        </div>

        {/* Overall Crushing Score */}
        <div className="bg-white p-8 rounded-2xl border border-orange-500/20 shadow-xl space-y-6 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/5 blur-3xl rounded-full translate-x-16 -translate-y-16" />
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <div className="text-[10px] text-orange-500 font-black uppercase tracking-widest">Crushing Score v2</div>
              <div className="text-5xl font-black text-neutral-900 tabular-nums tracking-tighter">{video.crushingScore}<span className="text-lg text-neutral-400">/100</span></div>
            </div>
            <div className={`h-16 w-16 rounded-xl flex items-center justify-center border ${video.isCrushing ? 'bg-orange-500/10 border-orange-500/50 shadow-[0_0_30px_rgba(249,115,22,0.2)]' : 'bg-neutral-100 border-neutral-200'}`}>
              <BarChart3 className={`h-8 w-8 ${video.isCrushing ? 'text-orange-500' : 'text-neutral-500'}`} />
            </div>
          </div>

          <div className="space-y-4">
            {[
              { label: 'Performance', value: video.scores.performance, max: 40, color: 'bg-orange-500' },
              { label: 'Virality', value: video.scores.virality, max: 40, color: 'bg-orange-400' },
              { label: 'Engagement', value: video.scores.engagement, max: 20, color: 'bg-neutral-800' },
            ].map((score) => (
              <div key={score.label} className="space-y-1.5">
                <div className="flex justify-between text-[9px] font-black uppercase tracking-widest">
                  <span className="text-neutral-500">{score.label}</span>
                  <span className="text-neutral-900">{score.value}<span className="text-neutral-400">/{score.max}</span></span>
                </div>
                <div className="h-1 bg-neutral-200 rounded-full overflow-hidden">
                  <div 
                    className={`h-full ${score.color} transition-all duration-1000 ease-out`} 
                    style={{ width: `${(score.value / score.max) * 100}%` }} 
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Secondary Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="bg-neutral-50 p-5 rounded-xl border border-neutral-200 space-y-2 relative shadow-sm">
             <Users className="h-4 w-4 text-neutral-500" />
             <div className="text-xl font-black text-neutral-900">{parseInt(video.statistics.viewCount).toLocaleString()}</div>
             <div className="text-[9px] text-neutral-500 font-bold uppercase tracking-widest">Views</div>
          </div>
          <div className="bg-neutral-50 p-5 rounded-xl border border-neutral-200 space-y-2 relative shadow-sm">
             <Heart className="h-4 w-4 text-sky-500" />
             <div className="text-xl font-black text-neutral-900">{parseInt(video.statistics.likeCount).toLocaleString()}</div>
             <div className="text-[9px] text-neutral-500 font-bold uppercase tracking-widest">Likes</div>
          </div>
          <div className="bg-neutral-50 p-5 rounded-xl border border-neutral-200 space-y-2 relative shadow-sm">
             <MessageSquare className="h-4 w-4 text-neutral-500" />
             <div className="text-xl font-black text-neutral-900">{parseInt(video.statistics.commentCount).toLocaleString()}</div>
             <div className="text-[9px] text-neutral-500 font-bold uppercase tracking-widest">Comments</div>
          </div>
          <div className="bg-neutral-50 p-5 rounded-xl border border-neutral-200 space-y-2 relative shadow-sm">
             <Calendar className="h-4 w-4 text-neutral-500" />
             <div className="text-xs font-black text-neutral-900">{new Date(video.publishedAt).toLocaleDateString()}</div>
             <div className="text-[9px] text-neutral-500 font-bold uppercase tracking-widest">Published</div>
          </div>
        </div>
      </div>

      {/* AI Insight Placeholder */}
      <div className="bg-sky-50 border border-sky-200 p-6 rounded-2xl space-y-4 shadow-sm relative">
        <h4 className="text-[10px] text-sky-600 font-black uppercase tracking-widest">Quick Insight</h4>
        <p className="text-neutral-700 text-sm leading-relaxed italic font-medium">
          &quot;This video strategy is highly effective. It has achieved a {performanceVsMedian}x multiplier compared to the channel baseline, indicating high algorithmic favor.&quot;
        </p>
      </div>
    </div>
  );
}
