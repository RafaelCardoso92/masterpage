import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

// Extract YouTube video ID from URL
function getYouTubeVideoId(url: string): string | null {
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\?\/]+)/,
    /youtube\.com\/embed\/([^&\?\/]+)/,
    /youtube\.com\/v\/([^&\?\/]+)/,
  ];

  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) return match[1];
  }

  return null;
}

// GET /api/youtube-info?url=<youtube-url>
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const url = searchParams.get('url');

    if (!url) {
      return NextResponse.json({ error: 'YouTube URL required' }, { status: 400 });
    }

    const videoId = getYouTubeVideoId(url);

    if (!videoId) {
      return NextResponse.json({ error: 'Invalid YouTube URL' }, { status: 400 });
    }

    const API_KEY = process.env.YOUTUBE_API_KEY;

    if (!API_KEY) {
      return NextResponse.json({ error: 'YouTube API key not configured' }, { status: 500 });
    }

    // Fetch video info from YouTube API
    const response = await axios.get(
      `https://www.googleapis.com/youtube/v3/videos?part=snippet&id=${videoId}&key=${API_KEY}`
    );

    if (!response.data.items || response.data.items.length === 0) {
      return NextResponse.json({ error: 'Video not found' }, { status: 404 });
    }

    const video = response.data.items[0];
    const snippet = video.snippet;

    return NextResponse.json({
      videoId,
      title: snippet.title,
      artist: snippet.channelTitle,
      thumbnail: snippet.thumbnails.maxres?.url || snippet.thumbnails.high.url,
      thumbnails: {
        default: snippet.thumbnails.default.url,
        medium: snippet.thumbnails.medium.url,
        high: snippet.thumbnails.high.url,
        maxres: snippet.thumbnails.maxres?.url,
      },
    });
  } catch (error: any) {
    console.error('Error fetching YouTube info:', error.message);
    return NextResponse.json({ error: 'Failed to fetch YouTube info' }, { status: 500 });
  }
}
