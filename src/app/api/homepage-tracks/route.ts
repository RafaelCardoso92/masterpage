import { NextRequest, NextResponse } from 'next/server';
import { readFile, writeFile } from 'fs/promises';
import path from 'path';
import { exec } from 'child_process';
import { promisify } from 'util';
import axios from 'axios';

const execAsync = promisify(exec);

interface HomePageTrack {
  id: string;
  title: string;
  artist: string;
  audioPath: string;
  youtubeUrl: string;
  color: string;
  mood: string;
}

const DATA_FILE = path.join(process.cwd(), 'src/data/homepage-tracks.json');

// Helper: Read tracks
async function readTracks(): Promise<HomePageTrack[]> {
  try {
    const data = await readFile(DATA_FILE, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    return [];
  }
}

// Helper: Write tracks
async function writeTracks(tracks: HomePageTrack[]): Promise<void> {
  await writeFile(DATA_FILE, JSON.stringify(tracks, null, 2), 'utf-8');
}

// Helper: Extract YouTube video ID
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

// GET - Fetch all homepage tracks
export async function GET(request: NextRequest) {
  try {
    const tracks = await readTracks();
    return NextResponse.json(tracks);
  } catch (error: any) {
    console.error('Error reading homepage tracks:', error);
    return NextResponse.json(
      { error: 'Failed to read homepage tracks' },
      { status: 500 }
    );
  }
}

// POST - Add new track or download from YouTube
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // If it's a YouTube download request
    if (body.youtubeUrl && !body.title) {
      const { youtubeUrl } = body;

      const videoId = getYouTubeVideoId(youtubeUrl);
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

      // Generate filename
      const timestamp = Date.now();
      const sanitizedTitle = snippet.title
        .replace(/[^a-zA-Z0-9]/g, '-')
        .replace(/-+/g, '-')
        .substring(0, 50);
      const audioFilename = `${timestamp}-${sanitizedTitle}.mp3`;
      const audioPath = path.join(process.cwd(), 'public/uploads/audio', audioFilename);

      // Download audio using yt-dlp
      let audioDownloaded = false;
      try {
        await execAsync(
          `yt-dlp -f bestaudio --extract-audio --audio-format mp3 --audio-quality 128K -o "${audioPath}" "https://www.youtube.com/watch?v=${videoId}"`,
          { timeout: 120000 }
        );
        audioDownloaded = true;
      } catch (error: any) {
        console.error('yt-dlp error:', error);
      }

      // Return metadata
      return NextResponse.json({
        success: true,
        audioDownloaded,
        title: snippet.title,
        artist: snippet.channelTitle,
        youtubeUrl,
        audioPath: audioDownloaded ? `/uploads/audio/${audioFilename}` : '',
      });
    }

    // If it's a track save request
    const { title, artist, audioPath, youtubeUrl, color, mood } = body;

    if (!title || !artist || !youtubeUrl) {
      return NextResponse.json(
        { error: 'Title, artist, and YouTube URL are required' },
        { status: 400 }
      );
    }

    const tracks = await readTracks();
    const newTrack: HomePageTrack = {
      id: Date.now().toString(),
      title,
      artist,
      audioPath: audioPath || '',
      youtubeUrl,
      color: color || '#6366f1',
      mood: mood || 'Chill',
    };

    tracks.push(newTrack);
    await writeTracks(tracks);

    return NextResponse.json({ success: true, track: newTrack });
  } catch (error: any) {
    console.error('Error adding homepage track:', error);
    return NextResponse.json(
      { error: 'Failed to add track', details: error.message },
      { status: 500 }
    );
  }
}

// PUT - Update existing track
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, title, artist, audioPath, youtubeUrl, color, mood } = body;

    if (!id) {
      return NextResponse.json({ error: 'Track ID required' }, { status: 400 });
    }

    const tracks = await readTracks();
    const trackIndex = tracks.findIndex((t) => t.id === id);

    if (trackIndex === -1) {
      return NextResponse.json({ error: 'Track not found' }, { status: 404 });
    }

    tracks[trackIndex] = {
      ...tracks[trackIndex],
      title: title || tracks[trackIndex].title,
      artist: artist || tracks[trackIndex].artist,
      audioPath: audioPath !== undefined ? audioPath : tracks[trackIndex].audioPath,
      youtubeUrl: youtubeUrl || tracks[trackIndex].youtubeUrl,
      color: color || tracks[trackIndex].color,
      mood: mood || tracks[trackIndex].mood,
    };

    await writeTracks(tracks);

    return NextResponse.json({ success: true, track: tracks[trackIndex] });
  } catch (error: any) {
    console.error('Error updating homepage track:', error);
    return NextResponse.json(
      { error: 'Failed to update track', details: error.message },
      { status: 500 }
    );
  }
}

// DELETE - Remove track
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Track ID required' }, { status: 400 });
    }

    const tracks = await readTracks();
    const filteredTracks = tracks.filter((t) => t.id !== id);

    if (filteredTracks.length === tracks.length) {
      return NextResponse.json({ error: 'Track not found' }, { status: 404 });
    }

    await writeTracks(filteredTracks);

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Error deleting homepage track:', error);
    return NextResponse.json(
      { error: 'Failed to delete track', details: error.message },
      { status: 500 }
    );
  }
}
