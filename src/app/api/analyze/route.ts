import { NextRequest, NextResponse } from 'next/server';
import { resolveChannelId, fetchChannelDetails, fetchRecentVideos, calculateMetrics } from '@/lib/youtube';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const url = searchParams.get('url');

  if (!url) {
    return NextResponse.json({ error: 'URL is required' }, { status: 400 });
  }

  try {
    console.log('[API] Analyzing URL:', url);
    const channelId = await resolveChannelId(url);
    console.log('[API] Resolved Channel ID:', channelId);
    
    if (!channelId) {
      return NextResponse.json({ error: 'Channel not found' }, { status: 404 });
    }

    const channel = await fetchChannelDetails(channelId);
    console.log('[API] Fetched Channel:', channel?.title);
    
    if (!channel) {
      return NextResponse.json({ error: 'Failed to fetch channel details' }, { status: 500 });
    }

    const videos = await fetchRecentVideos(channelId);
    console.log('[API] Fetched Videos:', videos.length);
    
    const analysis = calculateMetrics(channel, videos);
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
