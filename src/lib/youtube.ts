import { z } from 'zod';
import { YoutubeChannel, YoutubeVideo, AnalysisResult, YoutubeApiResponseItem, YoutubeChannelResponseItem } from '@/types/youtube';

const API_KEY = process.env.YOUTUBE_API_KEY;
const BASE_URL = 'https://www.googleapis.com/youtube/v3';

// --- Zod Schemas for API Safety ---
const YoutubeSearchSchema = z.object({
  items: z.array(z.object({
    id: z.object({
      channelId: z.string().optional(),
      videoId: z.string().optional(),
    }),
  })).optional(),
  nextPageToken: z.string().optional(),
});

const YoutubeChannelSchema = z.object({
  items: z.array(z.object({
    id: z.string(),
    snippet: z.object({
      title: z.string(),
      description: z.string(),
      customUrl: z.string().optional(),
      thumbnails: z.any(),
    }),
    statistics: z.object({
      viewCount: z.string(),
      subscriberCount: z.string(),
      videoCount: z.string(),
    }),
  })).optional(),
});

const YoutubeVideoDetailsSchema = z.object({
  items: z.array(z.object({
    id: z.string(),
    snippet: z.object({
      title: z.string(),
      description: z.string(),
      thumbnails: z.any(),
      publishedAt: z.string(),
      tags: z.array(z.string()).optional(),
    }),
    contentDetails: z.object({
      duration: z.string(),
    }),
    statistics: z.object({
      viewCount: z.string(),
      likeCount: z.string().optional(),
      commentCount: z.string().optional(),
    }),
  })),
});
// ----------------------------------

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
    const data = YoutubeSearchSchema.parse(await res.json());
    return data.items?.[0]?.id?.channelId || null;
  }

  // Fallback: try search if it's just a handle/name
  const res = await fetch(`${BASE_URL}/search?part=snippet&type=channel&q=${url}&key=${API_KEY}`);
  if (!res.ok) return null;
  const data = YoutubeSearchSchema.parse(await res.json());
  return data.items?.[0]?.id?.channelId || null;
}

export async function fetchChannelDetails(channelId: string): Promise<YoutubeChannel | null> {
  const res = await fetch(`${BASE_URL}/channels?part=snippet,statistics&id=${channelId}&key=${API_KEY}`);
  if (!res.ok) return null;
  const data = YoutubeChannelSchema.parse(await res.json());
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

export async function fetchRecentVideos(channelId: string, limit = 500): Promise<YoutubeVideo[]> {
  const allVideoIds: string[] = [];
  let nextPageToken = '';
  const sixMonthsAgo = new Date();
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
  const publishedAfter = sixMonthsAgo.toISOString();

  // 1. Get video IDs with pagination (max 50 per request)
  try {
    while (allVideoIds.length < limit) {
      const maxResults = Math.min(50, limit - allVideoIds.length);
      const url = `${BASE_URL}/search?part=id&channelId=${channelId}&maxResults=${maxResults}&order=date&type=video&publishedAfter=${publishedAfter}&key=${API_KEY}${nextPageToken ? `&pageToken=${nextPageToken}` : ''}`;
      
      const res = await fetch(url);
      if (!res.ok) {
        const err = await res.text();
        console.error('YouTube Search Error:', err);
        break;
      }
      
      const data = YoutubeSearchSchema.parse(await res.json());
      const ids = data.items
        ?.map(item => item.id.videoId)
        .filter((id): id is string => !!id) || [];
      
      allVideoIds.push(...ids);
      
      nextPageToken = data.nextPageToken || '';
      if (!nextPageToken || ids.length === 0) break;
    }
  } catch (err) {
    console.error('Pagination Error:', err);
  }

  if (allVideoIds.length === 0) return [];

  // 2. Get detailed stats in batches of 50
  const detailChunks = [];
  for (let i = 0; i < allVideoIds.length; i += 50) {
    detailChunks.push(allVideoIds.slice(i, i + 50).join(','));
  }

  const allVideoDetails: YoutubeVideo[] = [];
  
  await Promise.all(detailChunks.map(async (ids) => {
    const res = await fetch(`${BASE_URL}/videos?part=snippet,statistics,contentDetails&id=${ids}&key=${API_KEY}`);
    if (!res.ok) return;
    
    const data = YoutubeVideoDetailsSchema.parse(await res.json());
    const videos = data.items.map((item) => {
      // Basic ISO8601 duration parser (e.g. PT1M30S -> seconds)
      const duration = item.contentDetails.duration;
      const match = duration.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
      const seconds = (parseInt(match?.[1] || '0') * 3600) + (parseInt(match?.[2] || '0') * 60) + parseInt(match?.[3] || '0');
      const isShort = seconds < 60;

      return {
        id: item.id,
        title: item.snippet.title,
        description: item.snippet.description,
        thumbnails: item.snippet.thumbnails,
        publishedAt: item.snippet.publishedAt,
        isShort,
        statistics: {
          viewCount: item.statistics.viewCount,
          likeCount: item.statistics.likeCount || '0',
          commentCount: item.statistics.commentCount || '0',
        },
        scores: {
          performance: 0,
          virality: 0,
          engagement: 0,
        },
        crushingScore: 0,
        isCrushing: false,
      };
    });
    allVideoDetails.push(...videos);
  }));

  // Sort by date (descending) as result might be merged from parallel catches
  return allVideoDetails.sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());
}

export async function fetchSimilarChannels(channelId: string, limit = 5): Promise<YoutubeChannel[]> {
  // 1. Get channel tags/keywords from a recent video
  const recentVideos = await fetchRecentVideos(channelId, 1);
  if (recentVideos.length === 0) return [];
  
  const videoDetailsRes = await fetch(`${BASE_URL}/videos?part=snippet&id=${recentVideos[0].id}&key=${API_KEY}`);
  if (!videoDetailsRes.ok) return [];
  const videoDetails = await videoDetailsRes.json();
  const tags = videoDetails.items?.[0]?.snippet?.tags?.slice(0, 3).join(' ') || 'technology';

  // 2. Search for channels with similar keywords
  const searchRes = await fetch(`${BASE_URL}/search?part=snippet&type=channel&q=${encodeURIComponent(tags)}&maxResults=${limit + 1}&key=${API_KEY}`);
  if (!searchRes.ok) return [];
  const searchData = await searchRes.json();
  
  const channelIds = searchData.items
    ?.map((item: { id: { channelId: string } }) => item.id.channelId)
    .filter((id: string) => id !== channelId)
    .slice(0, limit)
    .join(',') || '';

  if (!channelIds) return [];

  // 3. Get detailed stats for those channels
  const channelsRes = await fetch(`${BASE_URL}/channels?part=snippet,statistics&id=${channelIds}&key=${API_KEY}`);
  if (!channelsRes.ok) return [];
  const channelsData = YoutubeChannelSchema.parse(await channelsRes.json());

  return channelsData.items?.map((item) => ({
    id: item.id,
    title: item.snippet.title,
    description: item.snippet.description,
    customUrl: item.snippet.customUrl || '',
    thumbnails: item.snippet.thumbnails,
    statistics: item.statistics,
  })) || [];
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

    // 1. Performance vs Baseline (40%) - Industry Standard: How much better than typical?
    const performance = Math.min((views / (medianViews || 1)) * 30, 40);

    // 2. Virality: Views relative to Subs (40%) - Industry Standard: Impact beyond core audience
    const virality = Math.min((views / subscriberCount) * 100, 40);

    // 3. Engagement: (L+C)/V (20%) - Industry Standard: Audience retention/action
    const engagementRate = ((likes + comments) / (views || 1)) * 100;
    const engagement = Math.min(engagementRate * 4, 20);

    const totalScore = Math.round(performance + virality + engagement);

    return {
      ...video,
      scores: {
        performance: Math.round(performance),
        virality: Math.round(virality),
        engagement: Math.round(engagement),
      },
      crushingScore: totalScore,
      isCrushing: totalScore >= 70,
    };
  });

  // Calculate Channel Score (Average of top 10 videos weighted for consistency)
  const topVideos = analyzedVideos.slice(0, 10);
  const avgScore = topVideos.reduce((acc, v) => acc + v.crushingScore, 0) / (topVideos.length || 1);
  const avgPerformance = topVideos.reduce((acc, v) => acc + v.scores.performance, 0) / (topVideos.length || 1);
  const avgVirality = topVideos.reduce((acc, v) => acc + v.scores.virality, 0) / (topVideos.length || 1);
  const avgEngagement = topVideos.reduce((acc, v) => acc + v.scores.engagement, 0) / (topVideos.length || 1);
  
  const shortsCount = analyzedVideos.filter(v => v.isShort).length;
  const avgShortsScore = analyzedVideos.filter(v => v.isShort).reduce((acc, v) => acc + v.crushingScore, 0) / (shortsCount || 1);

  const channelScore = Math.round(avgScore);

  return {
    channel: { 
      ...channel, 
      score: channelScore,
      avgPerformance: Math.round(avgPerformance),
      avgVirality: Math.round(avgVirality),
      avgEngagement: Math.round(avgEngagement),
    },
    videos: analyzedVideos.sort((a, b) => b.crushingScore - a.crushingScore),
    medianViews,
    similarChannels: [],
    shortsCount,
    avgShortsScore: Math.round(avgShortsScore),
  };
}
