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
  statistics: {
    viewCount: string;
    likeCount: string;
    commentCount: string;
  };
  crushingScore: number;
  isCrushing: boolean;
}

export interface AnalysisResult {
  channel: YoutubeChannel;
  videos: YoutubeVideo[];
  medianViews: number;
}
