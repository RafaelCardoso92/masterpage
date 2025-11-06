#!/bin/bash
###############################################
# Music Downloader for "My Vibe" Page
#
# ⚠️  IMPORTANT: Only download music you have
# rights to use! This script is for legal,
# royalty-free, or your own content only.
###############################################

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${YELLOW}========================================${NC}"
echo -e "${YELLOW}  My Vibe Music Downloader${NC}"
echo -e "${YELLOW}========================================${NC}"
echo ""

# Check if yt-dlp is installed
if ! command -v yt-dlp &> /dev/null; then
    echo -e "${RED}Error: yt-dlp is not installed${NC}"
    echo "Install it with:"
    echo "  sudo apt install yt-dlp"
    echo "  OR"
    echo "  pip install yt-dlp"
    exit 1
fi

# Music directory
MUSIC_DIR="/home/rafael/masterpage/next/public/music"

# Create directory if it doesn't exist
mkdir -p "$MUSIC_DIR"

echo -e "${GREEN}Music will be saved to: $MUSIC_DIR${NC}"
echo ""

# Function to download a track
download_track() {
    local url=$1
    local output_name=$2

    echo -e "${YELLOW}Downloading: $output_name${NC}"
    echo "From: $url"
    echo ""

    yt-dlp -x --audio-format mp3 --audio-quality 0 \
        --embed-thumbnail \
        --add-metadata \
        -o "$MUSIC_DIR/$output_name" \
        "$url"

    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✓ Successfully downloaded: $output_name${NC}"
        echo ""
    else
        echo -e "${RED}✗ Failed to download: $output_name${NC}"
        echo ""
    fi
}

# Example: Download royalty-free music from NCS (NoCopyrightSounds)
# These are copyright-free and can be used legally
echo -e "${YELLOW}Example: Downloading sample tracks...${NC}"
echo ""
echo "Replace these URLs with your chosen tracks:"
echo ""

# REPLACE THESE WITH YOUR YOUTUBE URLS
# Example tracks (you need to replace with actual URLs)

# Uncomment and edit these lines with your actual YouTube URLs:
# IMPORTANT: Keep track of these URLs to add to the My Vibe page!

# Track 1
# URL="https://www.youtube.com/watch?v=YOUR_VIDEO_ID_1"
# download_track "$URL" "track1.mp3"

# Track 2
# URL="https://www.youtube.com/watch?v=YOUR_VIDEO_ID_2"
# download_track "$URL" "track2.mp3"

# Track 3
# URL="https://www.youtube.com/watch?v=YOUR_VIDEO_ID_3"
# download_track "$URL" "track3.mp3"

# Track 4
# URL="https://www.youtube.com/watch?v=YOUR_VIDEO_ID_4"
# download_track "$URL" "track4.mp3"

# Track 5
# URL="https://www.youtube.com/watch?v=YOUR_VIDEO_ID_5"
# download_track "$URL" "track5.mp3"

echo -e "${YELLOW}========================================${NC}"
echo -e "${YELLOW}Instructions:${NC}"
echo ""
echo "1. Edit this script and uncomment the download_track lines"
echo "2. Replace the YouTube URLs with your chosen tracks"
echo "3. Run: bash download-music-example.sh"
echo ""
echo -e "${YELLOW}Legal music sources:${NC}"
echo "  • NoCopyrightSounds (NCS): https://www.youtube.com/@NoCopyrightSounds"
echo "  • YouTube Audio Library: https://www.youtube.com/audiolibrary"
echo "  • Free Music Archive: https://freemusicarchive.org/"
echo "  • Your own music uploads"
echo ""
echo -e "${YELLOW}After downloading:${NC}"
echo "1. Update track info in: src/app/my-vibe/page.tsx"
echo "   - title, artist, description, mood, color"
echo "   - youtubeUrl: Use the SAME YouTube URL you downloaded from"
echo "2. Start dev server: npm run dev"
echo "3. Visit: http://localhost:3000/my-vibe"
echo ""
echo "Each track will show a YouTube button that links back to the original video!"
echo ""
echo -e "${GREEN}Done!${NC}"
