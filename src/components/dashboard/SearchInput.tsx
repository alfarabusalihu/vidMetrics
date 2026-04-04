'use client';

import React, { useEffect } from 'react';

import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { AnimatePresence, motion } from 'framer-motion';
import { LoadingDiamond } from '@/components/ui/LoadingDiamond';

import { SearchInputProps } from '@/types/components';

import { toast } from 'sonner';

export function SearchInput({ url, setUrl, loading, result, handleReset, onSearch, error }: SearchInputProps) {
  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (url && !loading && !result) {
      onSearch();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    const pastedData = e.clipboardData.getData('text').trim();
    if (pastedData) {
      // Basic check: if it looks like a YouTube link or a handle, trigger search
      if (pastedData.includes('youtube.com') || pastedData.includes('youtu.be') || pastedData.startsWith('@')) {
        setUrl(pastedData);
        onSearch(pastedData);
      } else if (pastedData.length > 3) {
        // Even if it's just a name, if it's long enough, maybe they want to search?
        // But let's be conservative to avoid accidental searches.
        // Actually, the user asked for "backup method when the url is invalid".
        // So we should probably allow pasting names too.
        setUrl(pastedData);
        onSearch(pastedData);
      } else {
        toast.error('Invalid search term pasted');
      }
    }
  };

  return (
    <div className={`transition-all duration-700 w-full px-4 sm:px-6 ${result ? 'mt-8 sm:mt-12 md:mt-16 mb-4 sm:mb-6' : 'py-0'}`}>
      <div className="w-full max-w-2xl mx-auto">
        <form 
          onSubmit={handleSubmit} 
          className="relative group w-full"
          role="search"
          aria-label="YouTube Channel Search"
        >
          <Search 
            className="absolute left-5 top-1/2 -translate-y-1/2 h-5 w-5 text-neutral-500 group-focus-within:text-sky-500 transition-colors pointer-events-none z-10" 
            aria-hidden="true" 
          />
          <Input
            placeholder={result ? "Channel URL" : "https://youtube.com/@channel"}
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            onPaste={handlePaste}
            disabled={loading || !!result}
            className="pl-12 pr-12 md:pl-14 bg-white border-neutral-300 focus-visible:ring-sky-500/50 h-14 md:h-16 text-sm sm:text-base md:text-lg lg:text-xl rounded-xl transition-all shadow-md cursor-pointer disabled:opacity-80 text-neutral-900 placeholder:text-neutral-400 w-full"
            aria-label="YouTube Channel URL"
            aria-required="true"
          />
          <div className="absolute right-4 top-1/2 -translate-y-1/2 z-20">
            {(loading || result) && (
              <LoadingDiamond 
                loading={loading} 
                onClick={handleReset} 
                className={result ? 'hover:bg-red-50' : ''}
                size={loading ? 'md' : 'sm'}
              />
            )}
          </div>
        </form>

        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="mt-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-center gap-3 text-red-600 shadow-sm"
            >
              <div className="h-5 w-5 shrink-0 bg-red-100 rounded-md flex items-center justify-center">
                <span className="text-xs font-bold text-red-700">!</span>
              </div>
              <p className="font-medium text-sm">{error}</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
