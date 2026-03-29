import { create } from 'zustand';
import { YoutubeVideo, AnalysisResult } from '@/types/youtube';

interface AnalysisState {
  // Search & Results
  url: string;
  loading: boolean;
  result: AnalysisResult | null;
  error: string | null;
  
  // UI State
  sortBy: 'date' | 'views' | 'likes' | 'score';
  showAiReport: boolean;
  aiLoading: boolean;
  aiReport: { summary: string; marketPosition: string; revenueEstimate: string; improvements: string[] } | null;
  currentPage: number;
  popularChannels: { name: string; url: string; avatar: string }[];
  
  // Modal State
  selectedVideo: YoutubeVideo | null;
  isModalOpen: boolean;
  
  // Actions
  setUrl: (url: string) => void;
  setResult: (result: AnalysisResult | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  setSortBy: (sortBy: 'date' | 'views' | 'likes' | 'score') => void;
  setShowAiReport: (show: boolean) => void;
  setAiLoading: (loading: boolean) => void;
  setAiReport: (report: { summary: string; marketPosition: string; revenueEstimate: string; improvements: string[] } | null) => void;
  setCurrentPage: (page: number) => void;
  setSelectedVideo: (video: YoutubeVideo | null) => void;
  setIsModalOpen: (open: boolean) => void;
  analyzeChannel: (url: string) => Promise<void>;
  reset: () => void;
}

export const useAnalysisStore = create<AnalysisState>((set, get) => ({
  url: '',
  loading: false,
  result: null,
  error: null,
  
  sortBy: 'score',
  showAiReport: false,
  aiLoading: false,
  aiReport: null,
  currentPage: 1,
  popularChannels: [
    { name: 'MrBeast', url: 'https://youtube.com/@MrBeast', avatar: 'https://unavatar.io/youtube/MrBeast' },
    { name: 'Marques Brownlee', url: 'https://youtube.com/@mkbhd', avatar: 'https://unavatar.io/youtube/mkbhd' },
    { name: 'Colin and Samir', url: 'https://youtube.com/@ColinAndSamir', avatar: 'https://unavatar.io/youtube/ColinAndSamir' },
    { name: 'Ali Abdaal', url: 'https://youtube.com/@aliabdaal', avatar: 'https://unavatar.io/youtube/aliabdaal' },
    { name: 'Fireship', url: 'https://youtube.com/@Fireship', avatar: 'https://unavatar.io/youtube/Fireship' },
    { name: 'Vercel', url: 'https://youtube.com/@Vercel', avatar: 'https://unavatar.io/youtube/Vercel' },
    { name: 'Theo - t3.gg', url: 'https://youtube.com/@t3dotgg', avatar: 'https://unavatar.io/youtube/t3dotgg' },
    { name: 'Iman Gadzhi', url: 'https://youtube.com/@ImanGadzhi', avatar: 'https://unavatar.io/youtube/ImanGadzhi' },
  ],
  
  selectedVideo: null,
  isModalOpen: false,
  
  setUrl: (url) => set({ url }),
  setResult: (result) => set({ result }),
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),
  setSortBy: (sortBy) => set({ sortBy }),
  setShowAiReport: (showAiReport) => set({ showAiReport }),
  setAiLoading: (aiLoading) => set({ aiLoading }),
  setAiReport: (aiReport) => set({ aiReport }),
  setCurrentPage: (currentPage) => set({ currentPage }),
  setSelectedVideo: (selectedVideo) => set({ selectedVideo }),
  setIsModalOpen: (isModalOpen) => set({ isModalOpen }),
  
  analyzeChannel: async (url: string) => {
    if (!url) return;
    
    set({ loading: true, error: null, result: null, showAiReport: false, aiReport: null });
    
    try {
      const res = await fetch(`/api/analyze?url=${encodeURIComponent(url)}`);
      
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to analyze channel');
      }
      
      const data = await res.json();
      set({ result: data, error: null });
    } catch (err) {
      console.error('Analysis Error:', err);
      set({ error: err instanceof Error ? err.message : 'Analysis failed', result: null });
    } finally {
      set({ loading: false });
    }
  },
  
  reset: () => set({ 
    url: '', 
    result: null, 
    error: null, 
    showAiReport: false, 
    aiReport: null, 
    currentPage: 1, 
    isModalOpen: false 
  }),
}));
