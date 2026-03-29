import { NextRequest, NextResponse } from 'next/server';
import { fetchSimilarChannels } from '@/lib/youtube';

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const channelId = searchParams.get('channelId');
  const limit = parseInt(searchParams.get('limit') || '10');

  if (!channelId) {
    return NextResponse.json({ error: 'channelId is required' }, { status: 400 });
  }

  try {
    const channels = await fetchSimilarChannels(channelId, limit);
    return NextResponse.json(channels);
  } catch (error) {
    console.error('[Similar Channels API] Error:', error);
    return NextResponse.json([], { status: 200 });
  }
}
