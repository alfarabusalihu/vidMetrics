'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useAnalysisStore } from '@/store/useAnalysisStore';
import { YoutubeVideo } from '@/types/youtube';
import { DashboardHeader } from '@/components/layout/DashboardHeader';
import { SearchInput } from '@/components/dashboard/SearchInput';
import { ChannelMarquee } from '@/components/dashboard/ChannelMarquee';
import { VideoGrid } from '@/components/dashboard/VideoGrid';
import { Sidebar } from '@/components/dashboard/Sidebar';
import { ShortsOverview } from '@/components/dashboard/ShortsOverview';
import { DashboardControls } from '@/components/dashboard/Controls';
import { Pagination } from '@/components/dashboard/Pagination';
import { AiReportPanel } from '@/components/dashboard/AiReportPanel';
import { DeepAnalysisModal as VideoModal } from '@/components/DeepAnalysisModal';
import { Footer } from '@/components/layout/Footer';
import { Skeleton } from '@/components/ui/skeleton';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowUp } from 'lucide-react';


export default function Home() {
  const { 
    url, 
    setUrl, 
    loading, 
    result, 
    setResult,
    error, 
    analyzeChannel, 
    reset,
    showAiReport
  } = useAnalysisStore();

  const [currentPage, setCurrentPage] = useState(1);
  const [selectedVideo, setSelectedVideo] = useState<YoutubeVideo | null>(null);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const itemsPerPage = 12;
  const aiSectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 400);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (showAiReport && aiSectionRef.current) {
      aiSectionRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [showAiReport]);

  const handleAnalyze = async () => {
    if (url) {
      await analyzeChannel(url);
      setCurrentPage(1);
    }
  };

  const openModal = (video: YoutubeVideo) => setSelectedVideo(video);
  const closeModal = () => setSelectedVideo(null);

  const paginatedVideos = result?.videos.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  ) || [];

  const totalPages = result ? Math.ceil(result.videos.length / itemsPerPage) : 0;

  return (
    <div className="flex flex-col min-h-screen">
      <main className={`flex flex-col text-neutral-900 font-sans relative w-full flex-grow ${result ? 'overflow-y-auto' : 'h-screen overflow-hidden'}`}>
        <DashboardHeader />

        {/* 🍱 Senior Layout Architecture: Bulletproof Viewport Partitioning */}
        <div className={`w-full mx-auto relative z-10 flex-grow px-4 sm:px-6 md:px-8 flex flex-col transition-all duration-700 ${result ? 'pt-24 sm:pt-32 pb-12 sm:pb-20' : 'h-full pt-48 sm:pt-56 pb-8'}`}>
          
          {/* Interaction Zone: Centered in the remaining space below the Safe Zone */}
          <div className={`w-full flex-grow flex flex-col transition-all duration-1000 ${result ? 'justify-start' : 'justify-center items-center'}`}>
            <div className={`w-full flex flex-col items-center ${result ? '' : 'flex-none z-20 space-y-2'}`}>
              <SearchInput 
                url={url} 
                setUrl={setUrl} 
                loading={loading} 
                result={result} 
                handleReset={reset} 
                onSearch={handleAnalyze}
                error={error} 
              />
              
              <ChannelMarquee />
            </div>
          </div>

          {loading && (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 md:gap-8 lg:gap-12 pt-4 md:pt-8 w-full">
              <div className="md:col-span-1 space-y-4">
                <Skeleton className="h-36 md:h-48 w-full bg-neutral-200 rounded-2xl" />
                <Skeleton className="h-10 w-full bg-neutral-200 rounded-xl" />
              </div>
              <div className="md:col-span-3 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <Skeleton key={i} className="aspect-video w-full bg-neutral-200 rounded-xl" />
                ))}
              </div>
            </div>
          )}

          {result && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-8 lg:gap-12 items-start pt-4 pb-12 sm:pb-16 lg:pb-24">
              <Sidebar onChannelClick={(newUrl: string) => {
                setUrl(newUrl);
                setResult(null); 
              }} />

              <div className="lg:col-span-9 space-y-8 md:space-y-12">
                <ShortsOverview />
                
                <div className="space-y-6 md:space-y-8 lg:space-y-12">
                  <DashboardControls />

                  <VideoGrid videos={paginatedVideos} onVideoClick={openModal} />
                  
                  <Pagination 
                    currentPage={currentPage} 
                    totalPages={totalPages} 
                    setCurrentPage={setCurrentPage} 
                  />
                </div>

                {showAiReport && (
                  <div ref={aiSectionRef} className="pt-4 md:pt-8 scroll-mt-6">
                    <AiReportPanel />
                  </div>
                )}
              </div>
            </div>
          )}

          {/* On Homepage, the footer stays in the document flow of the viewport stack */}
          {!result && <Footer />}
        </div>

        <AnimatePresence>
          {showScrollTop && (
            <motion.button
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="fixed bottom-8 right-8 z-[200] p-4 bg-sky-900 text-white rounded-full shadow-2xl hover:bg-sky-800 transition-all group"
            >
              <ArrowUp className="w-6 h-6 group-hover:-translate-y-1 transition-transform" />
            </motion.button>
          )}
        </AnimatePresence>
      </main>

      {/* Result view maintains a standard footer at page end */}
      {result && <Footer />}
      
      <VideoModal 
        video={selectedVideo} 
        isOpen={!!selectedVideo} 
        onClose={closeModal} 
        channelMedian={result?.medianViews || 0}
      />
    </div>
  );
}
