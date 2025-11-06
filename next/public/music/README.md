# Music Directory

This directory contains self-hosted audio files for the "My Vibe" page.

## ⚠️ IMPORTANT: Copyright Notice

**Only download and use music that you:**
- Own the rights to
- Have explicit permission to use
- Is licensed under Creative Commons
- Is your own original creation
- Have purchased/licensed for personal use

Downloading copyrighted music without permission is illegal and violates YouTube's Terms of Service.

## How to Extract Audio from YouTube (Legally)

### Prerequisites

Install `yt-dlp` (a powerful YouTube downloader):

```bash
# On Ubuntu/Debian
sudo apt update
sudo apt install yt-dlp

# Or via pip
pip install yt-dlp

# Or download the latest binary
sudo wget https://github.com/yt-dlp/yt-dlp/releases/latest/download/yt-dlp -O /usr/local/bin/yt-dlp
sudo chmod a+rx /usr/local/bin/yt-dlp
```

### Extract Audio from YouTube Video

**Basic command to extract audio as MP3:**

```bash
# Navigate to the music directory
cd /home/rafael/masterpage/next/public/music

# Download audio from a YouTube video
yt-dlp -x --audio-format mp3 --audio-quality 0 \
  -o "track1.mp3" \
  "https://www.youtube.com/watch?v=VIDEO_ID"
```

**Command breakdown:**
- `-x` : Extract audio only (no video)
- `--audio-format mp3` : Convert to MP3 format
- `--audio-quality 0` : Best audio quality (0-9, where 0 is best)
- `-o "track1.mp3"` : Output filename
- Last argument: YouTube video URL

### Batch Download Multiple Songs

Create a text file with YouTube URLs (one per line):

```bash
# Create a file with URLs
cat > urls.txt << EOF
https://www.youtube.com/watch?v=VIDEO_ID_1
https://www.youtube.com/watch?v=VIDEO_ID_2
https://www.youtube.com/watch?v=VIDEO_ID_3
EOF

# Download all
yt-dlp -x --audio-format mp3 --audio-quality 0 \
  -o "%(title)s.mp3" \
  -a urls.txt
```

### Get Video Metadata (Useful for Track Info)

```bash
# View video info without downloading
yt-dlp --skip-download --print-json "YOUTUBE_URL" | jq '.title, .uploader'
```

### Advanced Options

```bash
# Download with specific filename and normalize audio
yt-dlp -x --audio-format mp3 --audio-quality 0 \
  --postprocessor-args "-ar 44100 -ac 2" \
  -o "my-song.mp3" \
  "YOUTUBE_URL"

# Add metadata to the MP3 file
yt-dlp -x --audio-format mp3 \
  --embed-metadata \
  --add-metadata \
  -o "track.mp3" \
  "YOUTUBE_URL"
```

## File Naming Convention

For the "My Vibe" page, name your files as:
- `track1.mp3`
- `track2.mp3`
- `track3.mp3`
- etc.

Then update `/home/rafael/masterpage/next/src/app/my-vibe/page.tsx` with:
- Track title
- Artist name
- Description
- Mood
- Color theme
- YouTube URL (the original video link)

## Example: Download Royalty-Free Music

Here are some sources for royalty-free music you can legally use:

**YouTube Audio Library:**
```bash
# These are copyright-free tracks provided by YouTube
yt-dlp -x --audio-format mp3 \
  -o "track1.mp3" \
  "https://www.youtube.com/watch?v=AUDIO_LIBRARY_VIDEO_ID"
```

**NoCopyrightSounds (NCS):**
- YouTube channel with copyright-free music
- Allowed for personal and commercial use

**Creative Commons Music:**
- Look for videos with Creative Commons licenses
- Check the description for license details

## Troubleshooting

**yt-dlp not found:**
```bash
# Update yt-dlp
sudo yt-dlp -U
```

**Permission denied:**
```bash
# Make sure you have write permissions
chmod 755 /home/rafael/masterpage/next/public/music
```

**Poor audio quality:**
```bash
# Try different quality settings
yt-dlp -x --audio-format mp3 --audio-quality 0 -o "song.mp3" "URL"
```

## Testing Your Setup

After adding music files:

1. Start the development server:
   ```bash
   cd /home/rafael/masterpage/next
   npm run dev
   ```

2. Visit: http://localhost:3000/my-vibe

3. Scroll through the page to see tracks fade in/out

## Legal Alternatives

If you want to showcase your music taste without copyright concerns:

1. **Spotify Embed**: Use Spotify's embed player (requires internet)
2. **SoundCloud**: Embed SoundCloud tracks
3. **YouTube Embed**: Keep using YouTube embeds (no download needed)
4. **Your Own Music**: Upload tracks you've created
5. **Royalty-Free Libraries**: Use tracks from Audio Library, Epidemic Sound, etc.

---

**Remember**: Always respect copyright laws and only use music you have rights to use!
