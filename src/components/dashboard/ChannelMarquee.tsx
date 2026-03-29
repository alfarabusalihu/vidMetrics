'use client';

import { motion } from 'framer-motion';
import { useAnalysisStore } from '@/store/useAnalysisStore';

export function ChannelMarquee() {
  const { setUrl, loading, result, popularChannels } = useAnalysisStore();

  const handleChannelClick = (url: string) => {
    if (!loading && !result) {
      setUrl(url);
    }
  };

  return (
    <div className={`w-full overflow-hidden flex flex-col items-center gap-4 sm:gap-6 transition-all duration-700 ${result ? 'opacity-0 h-0 pointer-events-none' : 'opacity-100 py-2 sm:py-4'}`}>
      <style>{`
        @keyframes slide-marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee {
          animation: slide-marquee 90s linear infinite;
        }
      `}</style>
      
      <div className="text-[10px] sm:text-[11px] text-neutral-700 font-black uppercase tracking-[0.2em] mb-4">
        Explore Popular Channels
      </div>

      {/* Mask container with hover-pause trigger */}
      <div className="relative w-full overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_15%,black_85%,transparent)] group/marquee">
        <div className="flex gap-4 sm:gap-8 w-fit min-w-[200%] animate-marquee group-hover/marquee:[animation-play-state:paused] py-3">
          {[...popularChannels, ...popularChannels, ...popularChannels].map((channel, i) => (
            <button
              key={`${channel.name}-${i}`}
              onClick={() => handleChannelClick(channel.url)}
              disabled={loading || !!result}
              className="flex items-center gap-3 sm:gap-5 px-4 sm:px-8 py-3 transition-all cursor-pointer whitespace-nowrap group hover:scale-105"
            >
              <img
                src={channel.avatar}
                alt={channel.name}
                className="w-12 h-12 sm:w-16 sm:h-16 rounded-full object-cover bg-neutral-100 shrink-0 transition-all duration-500 shadow-sm group-hover:shadow-md group-hover:scale-110"
              />
              <span className="text-sm sm:text-base font-black text-neutral-600 group-hover:text-sky-800 transition-all opacity-100 tracking-tight">
                {channel.name}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
