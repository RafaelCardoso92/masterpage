import { NextRequest, NextResponse } from 'next/server';
import { exec } from 'child_process';
import { promisify } from 'util';
import { writeFile, unlink } from 'fs/promises';
import path from 'path';
import axios from 'axios';

const execAsync = promisify(exec);

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

export async function POST(request: NextRequest) {
  try {
    const { url } = await request.json();

    if (!url) {
      return NextResponse.json({ error: 'YouTube URL required' }, { status: 400 });
    }

    const videoId = getYouTubeVideoId(url);

    if (!videoId) {
      return NextResponse.json({ error: 'Invalid YouTube URL' }, { status: 400 });
    }

    // Fetch video info from YouTube API
    const API_KEY = process.env.YOUTUBE_API_KEY;

    if (!API_KEY) {
      return NextResponse.json({ error: 'YouTube API key not configured' }, { status: 500 });
    }

    const response = await axios.get(
      `https://www.googleapis.com/youtube/v3/videos?part=snippet&id=${videoId}&key=${API_KEY}`
    );

    if (!response.data.items || response.data.items.length === 0) {
      return NextResponse.json({ error: 'Video not found' }, { status: 404 });
    }

    const video = response.data.items[0];
    const snippet = video.snippet;

    // Generate filenames
    const timestamp = Date.now();
    const sanitizedTitle = snippet.title
      .replace(/[^a-zA-Z0-9]/g, '-')
      .replace(/-+/g, '-')
      .substring(0, 50);
    const audioFilename = `${timestamp}-${sanitizedTitle}.mp3`;
    const audioPath = path.join(process.cwd(), 'public/uploads/audio', audioFilename);

    // Download audio using yt-dlp (must be installed on server)
    // Alternative: Use ytdl-core library, but yt-dlp is more reliable
    try {
      await execAsync(
        `yt-dlp -f bestaudio --extract-audio --audio-format mp3 --audio-quality 128K -o "${audioPath}" "https://www.youtube.com/watch?v=${videoId}"`,
        { timeout: 120000 } // 2 minute timeout
      );
    } catch (error: any) {
      console.error('yt-dlp error:', error);

      // Fallback: Return metadata without audio file
      return NextResponse.json({
        success: true,
        audioDownloaded: false,
        videoId,
        title: snippet.title,
        artist: snippet.channelTitle,
        youtubeUrl: url,
        thumbnail: snippet.thumbnails.maxres?.url || snippet.thumbnails.high.url,
        thumbnails: {
          default: snippet.thumbnails.default.url,
          medium: snippet.thumbnails.medium.url,
          high: snippet.thumbnails.high.url,
          maxres: snippet.thumbnails.maxres?.url,
        },
        message: 'Audio download not available. Please use YouTube link instead.',
      });
    }

    // Return success with audio file path
    return NextResponse.json({
      success: true,
      audioDownloaded: true,
      videoId,
      title: snippet.title,
      artist: snippet.channelTitle,
      youtubeUrl: url,
      audioPath: `/uploads/audio/${audioFilename}`,
      thumbnail: snippet.thumbnails.maxres?.url || snippet.thumbnails.high.url,
      thumbnails: {
        default: snippet.thumbnails.default.url,
        medium: snippet.thumbnails.medium.url,
        high: snippet.thumbnails.high.url,
        maxres: snippet.thumbnails.maxres?.url,
      },
    });
  } catch (error: any) {
    console.error('Error processing YouTube download:', error.message);
    return NextResponse.json(
      { error: 'Failed to process YouTube video', details: error.message },
      { status: 500 }
    );
  }
}
