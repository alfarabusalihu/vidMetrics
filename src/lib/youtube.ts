import { YoutubeChannel, YoutubeVideo, AnalysisResult } from '@/types/youtube';

const API_KEY = process.env.YOUTUBE_API_KEY;
const BASE_URL = 'https://www.googleapis.com/youtube/v3';

export async function resolveChannelId(url: string): Promise<string | null> {
  // Handle different URL formats: @handle, channel ID, direct link
  if (url.includes('youtube.com/channel/')) {
    return url.split('channel/')[1].split('/')[0];
  }

  if (url.includes('youtube.com/@')) {
    const handle = url.split('@')[1].split('/')[0];
    const res = await fetch(`${BASE_URL}/search?part=snippet&type=channel&q=${handle}&key=${API_KEY}`);
    if (!res.ok) {
      const errorText = await res.text();
      console.error('YouTube API Search Error:', errorText);
      return null;
    }
    const data = (await res.json()) as { items?: { id: { channelId: string } }[] };
    return data.items?.[0]?.id?.channelId || null;
  }

  // Fallback: try search if it's just a handle/name
  const res = await fetch(`${BASE_URL}/search?part=snippet&type=channel&q=${url}&key=${API_KEY}`);
  if (!res.ok) return null;
  const data = (await res.json()) as { items?: { id: { channelId: string } }[] };
  return data.items?.[0]?.id?.channelId || null;
}

export async function fetchChannelDetails(channelId: string): Promise<YoutubeChannel | null> {
  const res = await fetch(`${BASE_URL}/channels?part=snippet,statistics&id=${channelId}&key=${API_KEY}`);
  if (!res.ok) return null;
  const data = await res.json();
  const channel = data.items?.[0];
  if (!channel) return null;

  return {
    id: channel.id,
    title: channel.snippet.title,
    description: channel.snippet.description,
    customUrl: channel.snippet.customUrl || '',
    thumbnails: channel.snippet.thumbnails,
    statistics: channel.statistics,
  };
}

interface YoutubeApiResponseItem {
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

export async function fetchRecentVideos(channelId: string, limit = 20): Promise<YoutubeVideo[]> {
  // 1. Get recent video IDs
  const searchRes = await fetch(`${BASE_URL}/search?part=id,snippet&channelId=${channelId}&maxResults=${limit}&order=date&type=video&key=${API_KEY}`);
  if (!searchRes.ok) return [];
  const searchData = (await searchRes.json()) as { items?: { id: { videoId: string } }[] };
  const videoIds = searchData.items?.map((item) => item.id.videoId).join(',') || '';

  if (!videoIds) return [];

  // 2. Get detailed stats for those videos
  const statsRes = await fetch(`${BASE_URL}/videos?part=snippet,statistics&id=${videoIds}&key=${API_KEY}`);
  if (!statsRes.ok) return [];
  const statsData = (await statsRes.json()) as { items: YoutubeApiResponseItem[] };

  return statsData.items.map((item) => ({
    id: item.id,
    title: item.snippet.title,
    description: item.snippet.description,
    thumbnails: item.snippet.thumbnails,
    publishedAt: item.snippet.publishedAt,
    statistics: item.statistics,
    crushingScore: 0,
    isCrushing: false,
  }));
}

export function calculateMetrics(channel: YoutubeChannel, videos: YoutubeVideo[]): AnalysisResult {
  const subscriberCount = parseInt(channel.statistics.subscriberCount) || 1;
  const viewCounts = videos.map(v => parseInt(v.statistics.viewCount) || 0).sort((a, b) => a - b);

  // Median calculation
  const mid = Math.floor(viewCounts.length / 2);
  const medianViews = viewCounts.length % 2 !== 0 ? viewCounts[mid] : (viewCounts[mid - 1] + viewCounts[mid]) / 2;

  const analyzedVideos = videos.map(video => {
    const views = parseInt(video.statistics.viewCount) || 0;
    const likes = parseInt(video.statistics.likeCount) || 0;
    const comments = parseInt(video.statistics.commentCount) || 0;

    // 1. Performance vs Baseline (40%)
    const performanceScore = Math.min((views / (medianViews || 1)) * 30, 40);

    // 2. Virality: Views relative to Subs (40%)
    const viralityScore = Math.min((views / subscriberCount) * 100, 40);

    // 3. Engagement: Likes+Comments relative to Views (20%)
    const engagementRate = ((likes + comments) / (views || 1)) * 100;
    const engagementScore = Math.min(engagementRate * 4, 20); // 5% engagement = 20 points

    const totalScore = Math.round(performanceScore + viralityScore + engagementScore);

    return {
      ...video,
      crushingScore: totalScore,
      isCrushing: totalScore >= 70, // 70+ is "Crushing"
    };
  });

  return {
    channel,
    videos: analyzedVideos.sort((a, b) => b.crushingScore - a.crushingScore),
    medianViews,
  };
}
