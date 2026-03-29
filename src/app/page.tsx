'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { AnalysisResult, YoutubeVideo } from '@/types/youtube';
import { Skeleton } from '@/components/ui/skeleton';
import { DeepAnalysisModal } from '@/components/DeepAnalysisModal';
import { ArrowUp } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// Modular Components
import { SearchInput } from '@/components/dashboard/SearchInput';
import { Sidebar } from '@/components/dashboard/Sidebar';
import { VideoGrid } from '@/components/dashboard/VideoGrid';
import { Pagination } from '@/components/dashboard/Pagination';

export default function Home() {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [selectedVideo, setSelectedVideo] = useState<YoutubeVideo | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const videosPerPage = 9;

  // Debounced Auto-Analysis
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const handleAnalyze = useCallback(async () => {
    setLoading(true);
    setError(null);
    setResult(null);
    setCurrentPage(1);

    try {
      const res = await fetch(`/api/analyze?url=${encodeURIComponent(url)}`);
      
      const contentType = res.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        const rawBody = await res.text();
        console.error('Server returned non-JSON response:', {
          status: res.status,
          statusText: res.statusText,
          body: rawBody.slice(0, 500) // Show first 500 chars
        });
        throw new Error(`Server error (${res.status}): The analysis service returned an invalid response format.`);
      }

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to analyze channel');
      }

      setResult(data);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    } finally {
      setLoading(false);
    }
  }, [url]);

  useEffect(() => {
    if (!url || result) return;
    
    const isLikelyUrl = url.includes('youtube.com') || url.includes('youtu.be') || (url.startsWith('@') && url.length > 2);
    
    if (isLikelyUrl && !loading) {
      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => {
        handleAnalyze();
      }, 1000);
    }

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [url, result, loading, handleAnalyze]);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 300);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleReset = () => {
    setUrl('');
    setResult(null);
    setError(null);
  };

  const openModal = (video: YoutubeVideo) => {
    setSelectedVideo(video);
    setIsModalOpen(true);
  };

  const paginatedVideos = result?.videos.slice(
    (currentPage - 1) * videosPerPage,
    currentPage * videosPerPage
  ) || [];

  const totalPages = result ? Math.ceil(result.videos.length / videosPerPage) : 0;

  return (
    <>
      <main className="min-h-screen bg-[#0a0a0a] text-neutral-50 px-4 py-12 md:py-24 selection:bg-orange-500/30 font-sans relative overflow-x-hidden">
      {/* Panoramic Background Background Decor */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[200%] h-[1000px] bg-gradient-to-b from-maroon-950/20 via-transparent to-transparent opacity-40 blur-[120px] pointer-events-none rounded-[100%]" />
      
      <div className="max-w-7xl mx-auto space-y-16 relative z-10">
        {/* Header Section */}
        {!result && (
          <div className="text-center space-y-6 pt-12">
            <h1 className="text-7xl md:text-9xl font-black tracking-tighter bg-gradient-to-b from-orange-500 via-orange-400 to-maroon-900 bg-clip-text text-transparent drop-shadow-[0_0_30px_rgba(249,115,22,0.2)]">
              VidMetrics
            </h1>
            <p className="text-neutral-400 text-lg md:text-xl max-w-2xl mx-auto font-medium">
              Identify &quot;crushing&quot; competitor content in seconds. Paste a channel URL to begin.
            </p>
          </div>
        )}

        {/* Search Section */}
        <SearchInput 
          url={url} 
          setUrl={setUrl} 
          loading={loading} 
          result={result} 
          handleReset={handleReset} 
          error={error} 
        />

        {/* Loading State */}
        {loading && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 pt-12">
            <div className="md:col-span-1 space-y-6">
              <Skeleton className="h-48 w-full bg-neutral-900 rounded-3xl" />
              <Skeleton className="h-12 w-full bg-neutral-900 rounded-xl" />
              <Skeleton className="h-12 w-full bg-neutral-900 rounded-xl" />
            </div>
            <div className="md:col-span-3 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <Skeleton key={i} className="aspect-video w-full bg-neutral-900 rounded-3xl" />
              ))}
            </div>
          </div>
        )}

        {/* Results Layout (Sidebar + Grid) */}
        {result && (
          <div className="grid grid-cols-1 md:grid-cols-12 gap-12 items-start">
            <Sidebar result={result} />

            {/* Video List (Grid) */}
            <div className="md:col-span-9 space-y-12">
              <VideoGrid videos={paginatedVideos} onVideoClick={openModal} />
              
              <Pagination 
                currentPage={currentPage} 
                totalPages={totalPages} 
                setCurrentPage={setCurrentPage} 
              />
            </div>
          </div>
        )}
      </div>

      {/* Floating Scroll to Top */}
      <AnimatePresence>
        {showScrollTop && (
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="fixed bottom-8 right-8 p-4 bg-orange-500 text-white rounded-2xl shadow-2xl hover:bg-orange-600 transition-colors z-50 cursor-pointer shadow-orange-500/20"
          >
            <ArrowUp className="h-6 w-6" />
          </motion.button>
        )}
      </AnimatePresence>

      </main>

      <DeepAnalysisModal 
        video={selectedVideo} 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        channelMedian={result?.medianViews || 0}
      />
    </>
  );
}
