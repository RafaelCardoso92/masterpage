import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

const TRACKS_FILE = path.join(process.cwd(), 'src/data/tracks.json');

// GET /api/tracks - Fetch all tracks (newest first for public display)
export async function GET() {
  try {
    const data = await fs.readFile(TRACKS_FILE, 'utf-8');
    const tracks = JSON.parse(data);
    // Return reversed array so newest tracks appear first
    return NextResponse.json([...tracks].reverse());
  } catch (error) {
    console.error('Error reading tracks:', error);
    return NextResponse.json({ error: 'Failed to fetch tracks' }, { status: 500 });
  }
}

// POST /api/tracks - Add new track
export async function POST(request: NextRequest) {
  try {
    const newTrack = await request.json();

    // Validate required fields
    if (!newTrack.title?.trim()) {
      return NextResponse.json({ error: 'Title is required' }, { status: 400 });
    }
    if (!newTrack.artist?.trim()) {
      return NextResponse.json({ error: 'Artist is required' }, { status: 400 });
    }
    if (!newTrack.youtubeUrl?.trim()) {
      return NextResponse.json({ error: 'YouTube URL is required' }, { status: 400 });
    }

    // Read existing tracks
    const data = await fs.readFile(TRACKS_FILE, 'utf-8');
    const tracks = JSON.parse(data);

    // Generate new ID
    const maxId = tracks.reduce((max: number, track: any) =>
      Math.max(max, parseInt(track.id) || 0), 0);
    newTrack.id = String(maxId + 1);

    // Add new track
    tracks.push(newTrack);

    // Write back to file
    await fs.writeFile(TRACKS_FILE, JSON.stringify(tracks, null, 2));

    return NextResponse.json(newTrack, { status: 201 });
  } catch (error: any) {
    console.error('Error adding track:', error);
    return NextResponse.json({
      error: 'Failed to add track',
      details: error.message
    }, { status: 500 });
  }
}

// PUT /api/tracks - Update track
export async function PUT(request: NextRequest) {
  try {
    const updatedTrack = await request.json();

    // Read existing tracks
    const data = await fs.readFile(TRACKS_FILE, 'utf-8');
    const tracks = JSON.parse(data);

    // Find and update track
    const index = tracks.findIndex((t: any) => t.id === updatedTrack.id);
    if (index === -1) {
      return NextResponse.json({ error: 'Track not found' }, { status: 404 });
    }

    tracks[index] = updatedTrack;

    // Write back to file
    await fs.writeFile(TRACKS_FILE, JSON.stringify(tracks, null, 2));

    return NextResponse.json(updatedTrack);
  } catch (error) {
    console.error('Error updating track:', error);
    return NextResponse.json({ error: 'Failed to update track' }, { status: 500 });
  }
}

// DELETE /api/tracks?id=123 - Delete track
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Track ID required' }, { status: 400 });
    }

    // Read existing tracks
    const data = await fs.readFile(TRACKS_FILE, 'utf-8');
    const tracks = JSON.parse(data);

    // Filter out the track
    const filteredTracks = tracks.filter((t: any) => t.id !== id);

    if (filteredTracks.length === tracks.length) {
      return NextResponse.json({ error: 'Track not found' }, { status: 404 });
    }

    // Write back to file
    await fs.writeFile(TRACKS_FILE, JSON.stringify(filteredTracks, null, 2));

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting track:', error);
    return NextResponse.json({ error: 'Failed to delete track' }, { status: 500 });
  }
}

// PATCH /api/tracks - Reorder tracks
export async function PATCH(request: NextRequest) {
  try {
    const { trackId, direction } = await request.json();

    if (!trackId || !direction) {
      return NextResponse.json({ error: 'Track ID and direction required' }, { status: 400 });
    }

    if (direction !== 'up' && direction !== 'down') {
      return NextResponse.json({ error: 'Invalid direction. Must be "up" or "down"' }, { status: 400 });
    }

    // Read existing tracks
    const data = await fs.readFile(TRACKS_FILE, 'utf-8');
    const tracks = JSON.parse(data);

    // Find track index
    const index = tracks.findIndex((t: any) => t.id === trackId);
    if (index === -1) {
      return NextResponse.json({ error: 'Track not found' }, { status: 404 });
    }

    // Calculate new index (remember: array is stored oldest-first, but displayed newest-first)
    // Moving "up" in display = moving to higher index in storage (toward end)
    // Moving "down" in display = moving to lower index in storage (toward beginning)
    const newIndex = direction === 'up' ? index + 1 : index - 1;

    // Check bounds
    if (newIndex < 0 || newIndex >= tracks.length) {
      return NextResponse.json({ error: 'Cannot move track beyond list bounds' }, { status: 400 });
    }

    // Swap tracks
    [tracks[index], tracks[newIndex]] = [tracks[newIndex], tracks[index]];

    // Write back to file
    await fs.writeFile(TRACKS_FILE, JSON.stringify(tracks, null, 2));

    return NextResponse.json({ success: true, tracks: [...tracks].reverse() });
  } catch (error) {
    console.error('Error reordering tracks:', error);
    return NextResponse.json({ error: 'Failed to reorder tracks' }, { status: 500 });
  }
}
