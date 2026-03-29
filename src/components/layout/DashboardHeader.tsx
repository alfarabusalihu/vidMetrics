'use client';

import { useAnalysisStore } from '@/store/useAnalysisStore';

export function DashboardHeader() {
  const result = useAnalysisStore((state) => state.result);

  return (
    <header className="absolute top-0 left-0 right-0 z-[100] w-full bg-white/70 backdrop-blur-3xl transition-all duration-500 py-3 sm:py-4 border-b border-neutral-200/50 shadow-sm">
      <div className="w-full">
        <div className={`flex items-center gap-4 sm:gap-6 transition-all duration-700 ${result ? 'justify-start pl-4 sm:pl-8' : 'justify-center py-6 sm:py-8'}`}>
          <img 
            src="/favicon.ico" 
            alt="VidMetrics Logo" 
            className={`transition-all duration-700 drop-shadow-md ${result ? 'h-8 w-8 sm:h-10 sm:h-10' : 'h-24 w-24 sm:h-32 sm:h-32 md:h-20 md:w-20'}`} 
          />
          <h1 className={`font-black tracking-tighter text-sky-900 transition-all duration-700 whitespace-nowrap ${result ? 'text-lg sm:text-xl opacity-100' : 'text-4xl sm:text-6xl md:text-7xl lg:text-6xl drop-shadow-sm'}`}>
            VidMetrics
          </h1>
        </div>
      </div>
    </header>
  );
}
