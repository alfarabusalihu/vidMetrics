'use client';

import { Search, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { AnimatePresence, motion } from 'framer-motion';
import { AnalysisResult } from '@/types/youtube';

interface SearchInputProps {
  url: string;
  setUrl: (url: string) => void;
  loading: boolean;
  result: AnalysisResult | null;
  handleReset: () => void;
  error: string | null;
}

export function SearchInput({ url, setUrl, loading, result, handleReset, error }: SearchInputProps) {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // No-op because handleAnalyze is already triggered by useEffect on URL change.
    // However, this form allows the 'Enter' key to proceed without browser warnings.
  };

  return (
    <div className={`max-w-2xl mx-auto transition-all duration-700 ${result ? 'mt-0 mb-12 translate-y-[-20px]' : 'mt-12'}`}>
      <form onSubmit={handleSubmit} className="relative group">
        <Search className="absolute left-5 top-1/2 -translate-y-1/2 h-5 w-5 text-neutral-500 group-focus-within:text-orange-500 transition-colors pointer-events-none" />
        <Input
          placeholder="https://youtube.com/@channel"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          disabled={loading || !!result}
          className="pl-14 pr-14 bg-neutral-900/40 backdrop-blur-xl border-neutral-800/50 focus-visible:ring-orange-500/50 h-16 text-xl rounded-2xl transition-all shadow-inner-lg cursor-pointer disabled:opacity-80"
        />
        
        {/* Auto-loading & Reset */}
        <div className="absolute right-5 top-1/2 -translate-y-1/2 flex items-center gap-3">
          {loading && <div className="h-5 w-5 border-2 border-orange-500 border-t-transparent rounded-full animate-spin" />}
          {result && (
            <button 
              type="button"
              onClick={handleReset}
              className="p-2 hover:bg-neutral-800 rounded-lg transition-colors cursor-pointer group"
              aria-label="Clear results"
            >
              <X className="h-5 w-5 text-neutral-500 group-hover:text-white" />
            </button>
          )}
        </div>
      </form>

      <AnimatePresence>
        {error && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="mt-6 p-4 bg-maroon-950/20 border border-maroon-900/30 rounded-2xl flex items-center gap-3 text-red-400"
          >
            <div className="h-5 w-5 shrink-0 bg-red-500/10 rounded-full flex items-center justify-center">
              <span className="text-xs font-bold">!</span>
            </div>
            <p className="font-medium text-sm">{error}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
