'use client';

import NextImage from 'next/image';
import { useState, useEffect } from 'react';
import { YoutubeChannel } from '@/types/youtube';
import { Badge } from '@/components/ui/badge';
import { motion } from 'framer-motion';
import { Users, Activity, ChevronDown, BarChart3, Zap, Target } from 'lucide-react';
import { useAnalysisStore } from '@/store/useAnalysisStore';

import { SidebarProps } from '@/types/components';

export function Sidebar({ onChannelClick: _onChannelClick }: SidebarProps) {
  const { result, setUrl, analyzeChannel } = useAnalysisStore();
  const [loadingMore, setLoadingMore] = useState(false);
  const [extraChannels, setExtraChannels] = useState<YoutubeChannel[]>([]);
  const [hasMore, setHasMore] = useState(true);

  // Clear extra channels when the channel result changes
  useEffect(() => {
    setExtraChannels([]);
    setHasMore(true);
  }, [result?.channel.id]);

  if (!result) return null;

  const allSimilarChannels = Array.from(new Map([...result.similarChannels, ...extraChannels].map(c => [c.id, c])).values());

  const handleLoadMore = async () => {
    setLoadingMore(true);
    try {
      const res = await fetch(`/api/similar-channels?channelId=${result.channel.id}&offset=${allSimilarChannels.length}&limit=10`);
      if (res.ok) {
        const data: YoutubeChannel[] = await res.json();
        setExtraChannels((prev) => [...prev, ...data]);
        if (data.length < 10) setHasMore(false);
      } else {
        setHasMore(false);
      }
    } catch (e) {
      console.error('Load more similar channels failed:', e);
      setHasMore(false);
    } finally {
      setLoadingMore(false);
    }
  };

  return (
    <motion.aside
      initial={{ opacity: 0, x: -30 }}
      animate={{ opacity: 1, x: 0 }}
      className="lg:col-span-3 lg:sticky lg:top-6 w-full"
    >
      <div className="bg-white border border-neutral-200 rounded-3xl shadow-xl overflow-hidden flex flex-col md:flex-row lg:flex-col">
        
        {/* Left/Top Section: Channel Info & Metrics (3/4 on tablet) */}
        <div className="flex-[3] p-5 sm:p-8 border-b md:border-b-0 md:border-r lg:border-r-0 lg:border-b border-neutral-100 flex flex-col">
          <div className="flex items-center gap-4 mb-8">
            <div className="relative w-20 h-20 shrink-0">
              <NextImage
                src={result.channel.thumbnails.high.url}
                alt={result.channel.title}
                fill
                priority
                sizes="(max-width: 768px) 80px, 120px"
                className="rounded-2xl shadow-lg border border-neutral-100 object-cover"
              />
            </div>
            <div className="space-y-1.5 flex-1 min-w-0">
              <h2 className="text-xl md:text-2xl font-black text-neutral-900 leading-tight truncate">
                {result.channel.title}
              </h2>
              <Badge className="bg-sky-800 text-white border-none font-black px-3 py-1 flex items-center gap-1.5 w-fit">
                <Activity className="h-3.5 w-3.5" /> Score: {result.channel.score}
              </Badge>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6 mb-8">
            <div className="space-y-1">
              <div className="text-[10px] text-neutral-400 uppercase tracking-widest font-black flex items-center gap-2">
                <Users className="h-3.5 w-3.5" /> Subs
              </div>
              <div className="text-base font-black text-neutral-900 tabular-nums">
                {parseInt(result.channel.statistics.subscriberCount).toLocaleString()}
              </div>
            </div>
            <div className="space-y-1">
              <div className="text-[10px] text-neutral-400 uppercase tracking-widest font-black flex items-center gap-2">
                <BarChart3 className="h-3.5 w-3.5" /> Avg Views
              </div>
              <div className="text-base font-black text-neutral-900 tabular-nums">
                {result.medianViews.toLocaleString()}
              </div>
            </div>
          </div>

          {/* New Scoring Breakdown Metrics */}
          <div className="space-y-5 pt-6 border-t border-neutral-50">
            <h3 className="text-[10px] text-neutral-500 font-black uppercase tracking-[0.2em] flex items-center gap-2">
              <Target className="h-3 w-3" /> Channel Power Breakdown
            </h3>
            
            <div className="space-y-4">
              <div className="space-y-1.5">
                <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-wider text-neutral-500">
                  <span>Performance</span>
                  <span className="text-sky-800">{result.channel.avgPerformance}/40</span>
                </div>
                <div className="h-1.5 w-full bg-neutral-100 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${(result.channel.avgPerformance || 0) / 40 * 100}%` }}
                    className="h-full bg-sky-800"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-wider text-neutral-500">
                  <span>Virality</span>
                  <span className="text-orange-500">{result.channel.avgVirality}/40</span>
                </div>
                <div className="h-1.5 w-full bg-neutral-100 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${(result.channel.avgVirality || 0) / 40 * 100}%` }}
                    className="h-full bg-orange-500"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-wider text-neutral-500">
                  <span>Engagement</span>
                  <span className="text-emerald-500">{result.channel.avgEngagement}/20</span>
                </div>
                <div className="h-1.5 w-full bg-neutral-100 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${(result.channel.avgEngagement || 0) / 20 * 100}%` }}
                    className="h-full bg-emerald-500"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right/Bottom Section: Similar Channels (1/4 on tablet) */}
        <div className="flex-1 bg-neutral-50 p-6 flex flex-col min-w-0">
          <div className="text-[10px] text-neutral-500 font-black uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
            <Zap className="h-3.5 w-3.5 text-orange-400" /> Similar Benchmarks
          </div>
          <div className="space-y-2 flex-1 overflow-y-auto custom-scrollbar pr-1 max-h-[300px] md:max-h-none lg:max-h-[400px]">
            {allSimilarChannels.map((channel) => (
              <button
                key={channel.id}
                onClick={async () => {
                  const newUrl = `https://youtube.com/channel/${channel.id}`;
                  setUrl(newUrl);
                  _onChannelClick?.(newUrl);
                  await analyzeChannel(newUrl);
                }}
                aria-label={`Analyze ${channel.title}`}
                className="w-full text-left flex items-center gap-3 p-3 bg-white hover:bg-sky-50 rounded-xl transition-all group cursor-pointer border border-transparent shadow-sm hover:border-sky-500/20"
              >
                <div className="relative w-8 h-8 shrink-0">
                  <NextImage
                    src={channel.thumbnails.default.url}
                    alt={`${channel.title} avatar`}
                    fill
                    sizes="32px"
                    className="rounded-lg object-cover transition-all border border-neutral-100 group-hover:scale-110"
                  />
                </div>
                <span className="text-xs font-bold text-neutral-700 group-hover:text-sky-800 transition-colors truncate flex-1">
                  {channel.title}
                </span>
              </button>
            ))}
          </div>
          {hasMore && (
            <button
              onClick={handleLoadMore}
              disabled={loadingMore}
              className="mt-4 w-full flex items-center justify-center gap-2 py-2.5 border border-neutral-200 bg-white rounded-xl text-[10px] font-black uppercase tracking-widest text-neutral-500 hover:text-sky-500 hover:border-sky-500/30 hover:bg-sky-50/50 transition-all cursor-pointer disabled:opacity-50"
              aria-label={loadingMore ? "Loading more channels" : "Load more similar channels"}
              aria-busy={loadingMore}
            >
              {loadingMore ? (
                <div className="animate-spin h-3 w-3 bg-sky-500 rounded-[2px] rotate-45" aria-hidden="true" />
              ) : (
                <><ChevronDown className="h-4 w-4" aria-hidden="true" /> More</>
              )}
            </button>
          )}
        </div>
      </div>
    </motion.aside>
  );
}
