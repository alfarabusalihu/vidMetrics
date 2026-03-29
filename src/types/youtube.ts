export interface YoutubeChannel {
  id: string;
  title: string;
  description: string;
  customUrl: string;
  thumbnails: {
    default: { url: string };
    medium: { url: string };
    high: { url: string };
  };
  statistics: {
    viewCount: string;
    subscriberCount: string;
    videoCount: string;
  };
  score?: number;
  avgPerformance?: number;
  avgVirality?: number;
  avgEngagement?: number;
}

export interface YoutubeVideo {
  id: string;
  title: string;
  description: string;
  thumbnails: {
    default: { url: string };
    medium: { url: string };
    high: { url: string };
  };
  publishedAt: string;
  isShort: boolean;
  statistics: {
    viewCount: string;
    likeCount: string;
    commentCount: string;
  };
  scores: {
    performance: number;
    virality: number;
    engagement: number;
  };
  crushingScore: number;
  isCrushing: boolean;
}

export interface AnalysisResult {
  channel: YoutubeChannel;
  videos: YoutubeVideo[];
  medianViews: number;
  similarChannels: YoutubeChannel[];
  shortsCount?: number;
  avgShortsScore?: number;
  aiReport?: {
    summary: string;
    improvements: string[];
    marketPosition: string;
  };
}

export interface YoutubeApiResponseItem {
  id: string;
  snippet: {
    title: string;
    description: string;
    thumbnails: {
      default: { url: string };
      medium: { url: string };
      high: { url: string };
    };
    publishedAt: string;
  };
  statistics: {
    viewCount: string;
    likeCount: string;
    commentCount: string;
  };
}

export interface YoutubeChannelResponseItem {
  id: string;
  snippet: {
    title: string;
    description: string;
    customUrl?: string;
    thumbnails: {
      default: { url: string };
      medium: { url: string };
      high: { url: string };
    };
  };
  statistics: {
    subscriberCount: string;
    viewCount: string;
    videoCount: string;
  };
}
