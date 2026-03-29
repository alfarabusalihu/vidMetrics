import { YoutubeVideo, AnalysisResult } from './youtube';

export interface DeepAnalysisModalProps {
  video: YoutubeVideo | null;
  isOpen: boolean;
  onClose: () => void;
  channelMedian: number;
}

export interface PaginationProps {
  currentPage: number;
  totalPages: number;
  setCurrentPage: (page: number) => void;
}

export interface SidebarProps {
  onChannelClick: (url: string) => void;
}

export interface VideoGridProps {
  videos: YoutubeVideo[];
  onVideoClick: (video: YoutubeVideo) => void;
}

export interface VideoCardProps {
  video: YoutubeVideo;
  onClick: (video: YoutubeVideo) => void;
}

export interface SearchInputProps {
  url: string;
  setUrl: (url: string) => void;
  loading: boolean;
  result: AnalysisResult | null;
  handleReset: () => void;
  onSearch: () => void;
  error: string | null;
}

export interface AnalysisStatsProps {
  video: YoutubeVideo;
  channelMedian: number;
}

export interface AnalysisPlayerProps {
  video: YoutubeVideo;
}

export interface AnalysisChartsProps {
  videos: YoutubeVideo[];
}
