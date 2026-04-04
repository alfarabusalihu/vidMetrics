'use client';

import { useAnalysisStore } from '@/store/useAnalysisStore';
import { toast } from 'sonner';

export function DashboardControls() {
  const { 
    sortBy, 
    setSortBy, 
    showAiReport, 
    setShowAiReport, 
    aiLoading, 
    setAiLoading, 
    setAiReport,
    result 
  } = useAnalysisStore();

  const handleGenerateAiReport = async () => {
    if (!result || aiLoading) return;
    
    setAiLoading(true);
    setShowAiReport(true);
    
    try {
      const res = await fetch('/api/ai-report', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(result)
      });
      
      if (!res.ok) throw new Error('AI Analysis Service unavailable');
      
      const data = await res.json();
      setAiReport(data);
      toast.success('AI Report Generated Successfully');
    } catch (err) {
      console.error('AI Report Error:', err);
      toast.error('Failed to generate AI report');
      setShowAiReport(false);
    } finally {
      setAiLoading(false);
    }
  };

  return (
    <div className="flex flex-row items-center justify-between gap-2 sm:gap-4 pb-4 sm:pb-6 border-b border-neutral-200 w-full overflow-hidden">
      <div 
        role="group" 
        aria-label="Sort videos by"
        className="flex items-center gap-1 bg-white p-1 rounded-xl border border-neutral-200 shrink-0 shadow-sm"
      >
        {(['score', 'views', 'likes', 'date'] as const).map((type) => (
          <button
            key={type}
            onClick={() => setSortBy(type)}
            aria-pressed={sortBy === type}
            className={`px-2 sm:px-3 py-1.5 rounded-lg text-[7px] sm:text-[9px] font-black uppercase tracking-widest transition-all cursor-pointer ${sortBy === type ? 'bg-sky-950 text-white shadow-md shadow-sky-950/20' : 'text-neutral-500 hover:text-neutral-900'}`}
          >
            {type}
          </button>
        ))}
      </div>
      
      <button 
        onClick={handleGenerateAiReport}
        disabled={aiLoading}
        aria-busy={aiLoading}
        aria-label={showAiReport ? 'Report analysis active' : 'Generate AI market analysis'}
        className={`px-3 sm:px-6 py-2.5 sm:py-3 rounded-xl text-[8px] sm:text-[10px] font-black uppercase tracking-widest transition-all cursor-pointer border flex items-center gap-2 sm:gap-3 shrink-0 justify-center ${showAiReport ? 'bg-sky-50/50 border-sky-950 text-sky-950 shadow-sm' : 'bg-white border-neutral-200 text-neutral-600 hover:text-neutral-900 hover:border-sky-950/30'}`}
      >
        {aiLoading && <div className="flex items-center justify-center animate-spin"><div className="h-2 w-2 bg-sky-950 rounded-[2px] rotate-45" /></div>}
        {showAiReport ? 'Report Active' : 'Strategic AI'}
      </button>
    </div>
  );
}
