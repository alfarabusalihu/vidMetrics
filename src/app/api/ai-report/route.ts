import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

export async function POST(request: NextRequest) {
  try {
    const { channel, medianViews } = await request.json();

    const apiKey = process.env.GEMINI_API_KEY;

    // Graceful Fallback Mode & Demo Simulation
    if (!apiKey || apiKey === '') {
      console.warn('[AI API] No GEMINI_API_KEY detected. Returning simulated enterprise demonstration data.');
      // Simulate API Latency (1.5 seconds)
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const lowerCPM = Math.round((medianViews * 3.5) / 1000).toLocaleString();
      const upperCPM = Math.round((medianViews * 8) / 1000).toLocaleString();

      return NextResponse.json({
        marketPosition: `${channel.title} holds a hyper-optimized retention footprint, reliably scaling algorithmic authority beyond their current subscriber threshold.`,
        summary: `The channel operates at an elite ${channel.score}/100 efficiency tier. Core formats routinely eclipse baseline medians, establishing deep audience moat dynamics.`,
        revenueEstimate: `$${lowerCPM} - $${upperCPM}`,
        improvements: [
          `Leverage the 1.5x+ "Crushing" video formats to accelerate sponsor RPMs.`,
          `Re-package legacy mid-tier content with new CTR-optimized thumbnails to reactivate algorithmic sweeps.`,
          `Increase production velocity by 12% to compound on the current momentum trajectory without sacrificing retention.`
        ]
      });
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

    const prompt = `
      Act as a high-level YouTube Growth Strategist and Financial Analyst for VidMetrics. 
      Analyze this comprehensive channel data and provide a "Brand Brief".

      Channel: ${channel.title}
      Subscribers: ${parseInt(channel.statistics.subscriberCount).toLocaleString()}
      Median Views (6mo): ${medianViews.toLocaleString()}
      Aggregated Crushing Score: ${channel.score}/100

      The analysis should be about the CHANNEL STRATEGY, not individual videos.
      Estimate "Potential Monthly Revenue" based on a conservative $3-$8 CPM range applied to the median performance and upload frequency.

      Provide the response in the following JSON format ONLY:
      {
        "marketPosition": "1-sentence elite positioning statement.",
        "summary": "2-sentence strategic health summary.",
        "revenueEstimate": "$X,XXX - $X,XXX",
        "improvements": [
          "Strategic Action 1",
          "Strategic Action 2",
          "Strategic Action 3"
        ]
      }

      Focus on retention efficiency, algorithmic authority, and scalability.
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    // Clean up potential markdown formatting from AI
    const jsonStr = text.replace(/```json/g, '').replace(/```/g, '').trim();
    const data = JSON.parse(jsonStr);

    return NextResponse.json(data);
  } catch (error) {
    console.error('[AI API] Error:', error);
    return NextResponse.json({ 
      error: 'Failed to generate AI report',
      details: error instanceof Error ? error.message : 'Unknown'
    }, { status: 500 });
  }
}
