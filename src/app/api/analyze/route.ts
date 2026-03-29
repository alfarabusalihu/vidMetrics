import { NextRequest, NextResponse } from 'next/server';
import { resolveChannelId, fetchChannelDetails, fetchRecentVideos, calculateMetrics, fetchSimilarChannels } from '@/lib/youtube';
import { YoutubeChannel, AnalysisResult } from '@/types/youtube';
import { serverCache } from '@/lib/cache';

const CACHE_TTL = 24 * 60 * 60 * 1000; // 24 Hours

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const url = searchParams.get('url');

  if (!url) {
    return NextResponse.json({ error: 'URL is required' }, { status: 400 });
  }

  // 1. Check Cache
  const cachedResult = serverCache.get<AnalysisResult>(url);
  if (cachedResult) {
    console.log('[API] Cache Hit for:', url);
    return NextResponse.json(cachedResult);
  }

  try {
    console.log('[API] Analyzing URL:', url);
    const channelId = await resolveChannelId(url);
    console.log('[API] Resolved Channel ID:', channelId);
    
    if (!channelId) {
      return NextResponse.json({ error: 'Channel not found' }, { status: 404 });
    }

    const [channel, videos] = await Promise.all([
      fetchChannelDetails(channelId),
      fetchRecentVideos(channelId),
    ]);

    if (!channel) {
      return NextResponse.json({ error: 'Failed to fetch channel details' }, { status: 500 });
    }

    // Secondary data (non-blocking)
    let similarChannels: YoutubeChannel[] = [];
    try {
      similarChannels = await fetchSimilarChannels(channelId, 5);
    } catch (simError) {
      console.error('[API] Similarity Fetch Error:', simError);
    }
    
    const analysis = calculateMetrics(channel, videos);
    analysis.similarChannels = similarChannels;

    // Save to Cache
    serverCache.set(url, analysis, CACHE_TTL);

    console.log('[API] Analysis Complete');
    return NextResponse.json(analysis);
  } catch (error) {
    console.error('[API] Critical Analysis Error:', error);
    return NextResponse.json({ 
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown'
    }, { status: 500 });
  }
}
