// pages/api/youtube.js
import axios from "axios";

export default async function handler(req, res) {
  const { query } = req;
  const API_KEY = process.env.YOUTUBE_API_KEY; // Your YouTube API key

  try {
    const response = await axios.get(
      `https://www.googleapis.com/youtube/v3/search?key=${API_KEY}&part=snippet&type=video&q=${query.q}`
    );
    const videos = response.data.items.map((item) => ({
      id: item.id.videoId,
      title: item.snippet.title,
    }));
    res.status(200).json(videos);
  } catch (error) {
    console.error("Error fetching YouTube videos:", error.message);
    res.status(500).json({ error: "Failed to fetch YouTube videos" });
  }
}
