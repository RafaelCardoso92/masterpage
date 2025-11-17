"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Navbar, Footer } from "../../../components";
import AdminNav from "../../../components/AdminNav";

interface Track {
  id: string;
  title: string;
  artist: string;
  audioPath: string;
  youtubeUrl: string;
  color: string;
  mood: string;
}

interface Toast {
  id: string;
  type: "success" | "error" | "info";
  message: string;
}

const MOODS = ["Chill", "Focus", "Energy", "Calm", "Upbeat", "Dark", "Smooth"];
const COLORS = [
  "#6366f1", "#8b5cf6", "#ec4899", "#f43f5e", "#f59e0b",
  "#10b981", "#06b6d4", "#3b82f6", "#6366f1", "#a855f7"
];

export default function HomePageMusicAdmin() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authLoading, setAuthLoading] = useState(true);
  const [tracks, setTracks] = useState<Track[]>([]);
  const [loading, setLoading] = useState(false);
  const [youtubeUrl, setYoutubeUrl] = useState("");
  const [loadingYoutube, setLoadingYoutube] = useState(false);
  const [toasts, setToasts] = useState<Toast[]>([]);

  const [formData, setFormData] = useState({
    title: "",
    artist: "",
    audioPath: "",
    youtubeUrl: "",
    color: COLORS[0],
    mood: MOODS[0],
  });

  const addToast = (type: Toast["type"], message: string) => {
    const id = Date.now().toString();
    setToasts((prev) => [...prev, { id, type, message }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 5000);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  useEffect(() => {
    async function checkAuth() {
      try {
        const res = await fetch("/api/admin/auth");
        const data = await res.json();

        if (data.authenticated) {
          setIsAuthenticated(true);
          setAuthLoading(false);
        } else {
          router.push("/admin/login");
        }
      } catch (error) {
        console.error("Auth check error:", error);
        router.push("/admin/login");
      }
    }
    checkAuth();
  }, [router]);

  useEffect(() => {
    if (isAuthenticated) {
      fetchTracks();
    }
  }, [isAuthenticated]);

  const fetchTracks = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/homepage-tracks");
      if (!res.ok) throw new Error("Failed to fetch tracks");
      const data = await res.json();
      setTracks(data);
    } catch (error: any) {
      addToast("error", `Failed to load tracks: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const fetchYoutubeInfo = async () => {
    if (!youtubeUrl) {
      addToast("error", "Please enter a YouTube URL");
      return;
    }

    setLoadingYoutube(true);

    try {
      const res = await fetch("/api/homepage-tracks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ youtubeUrl }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Failed to fetch YouTube info");
      }

      const data = await res.json();

      setFormData((prev) => ({
        ...prev,
        title: data.title,
        artist: data.artist,
        youtubeUrl: youtubeUrl,
        audioPath: data.audioPath || "",
      }));

      if (data.audioDownloaded) {
        addToast("success", "YouTube audio downloaded successfully!");
      } else {
        addToast("info", "Audio download failed - will stream from YouTube");
      }
    } catch (error: any) {
      addToast("error", `YouTube download failed: ${error.message}`);
    } finally {
      setLoadingYoutube(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title || !formData.artist || !formData.youtubeUrl) {
      addToast("error", "Title, artist, and YouTube URL are required");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/homepage-tracks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Failed to save track");
      }

      await fetchTracks();
      resetForm();
      addToast("success", "Track added successfully!");
    } catch (error: any) {
      addToast("error", `Failed to save track: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Delete "${title}"?`)) return;

    try {
      const res = await fetch(`/api/homepage-tracks?id=${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete track");
      await fetchTracks();
      addToast("success", `"${title}" deleted`);
    } catch (error: any) {
      addToast("error", `Failed to delete: ${error.message}`);
    }
  };

  const resetForm = () => {
    setFormData({
      title: "",
      artist: "",
      audioPath: "",
      youtubeUrl: "",
      color: COLORS[0],
      mood: MOODS[0],
    });
    setYoutubeUrl("");
  };

  const handleLogout = async () => {
    try {
      await fetch("/api/admin/auth", { method: "DELETE" });
      router.push("/admin/login");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  if (authLoading || !isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-dark-100">
        <div className="text-center">
          <div className="text-4xl mb-4 animate-pulse">🔐</div>
          <p className="text-white text-xl">Checking authentication...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-dark-100">
      <Navbar />
      <div className="pt-20">
        <AdminNav />
      </div>

      {/* Toasts */}
      <div className="fixed top-4 right-4 z-50 space-y-2 max-w-md">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`px-6 py-4 rounded-lg shadow-lg border-2 backdrop-blur-sm animate-slide-in flex items-start gap-3 ${
              toast.type === "success"
                ? "bg-green-500/90 border-green-400 text-white"
                : toast.type === "error"
                ? "bg-red-500/90 border-red-400 text-white"
                : "bg-blue-500/90 border-blue-400 text-white"
            }`}
          >
            <span className="text-2xl">
              {toast.type === "success" && "✅"}
              {toast.type === "error" && "❌"}
              {toast.type === "info" && "ℹ️"}
            </span>
            <div className="flex-1">
              <p className="font-semibold">{toast.message}</p>
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              className="text-white hover:text-gray-200 font-bold"
            >
              ×
            </button>
          </div>
        ))}
      </div>

      <main className="container-custom pt-8 pb-20 px-4">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-4xl font-bold text-white">Homepage Music</h1>
          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-dark-300 text-white font-semibold rounded-lg hover:bg-dark-400 transition-colors"
          >
            Logout
          </button>
        </div>

        {/* Add Form */}
        <div className="bg-dark-200 p-6 rounded-lg mb-12 shadow-xl">
          <h2 className="text-2xl font-bold text-white mb-6">Add Track from YouTube</h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* YouTube URL */}
            <div>
              <label className="block text-light-100 mb-2 font-semibold">YouTube URL</label>
              <div className="flex gap-2">
                <input
                  type="url"
                  value={youtubeUrl}
                  onChange={(e) => setYoutubeUrl(e.target.value)}
                  className="flex-1 px-4 py-2 bg-dark-300 text-white border border-dark-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
                  placeholder="https://www.youtube.com/watch?v=..."
                  disabled={loadingYoutube}
                />
                <button
                  type="button"
                  onClick={fetchYoutubeInfo}
                  disabled={loadingYoutube || !youtubeUrl}
                  className="px-6 py-2 bg-accent text-white font-semibold rounded-lg hover:bg-accent/80 disabled:opacity-50 transition-all"
                >
                  {loadingYoutube ? "Downloading..." : "Download"}
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Title */}
              <div>
                <label className="block text-light-100 mb-2 font-semibold">Title</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-4 py-2 bg-dark-300 text-white border border-dark-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
                />
              </div>

              {/* Artist */}
              <div>
                <label className="block text-light-100 mb-2 font-semibold">Artist</label>
                <input
                  type="text"
                  value={formData.artist}
                  onChange={(e) => setFormData({ ...formData, artist: e.target.value })}
                  className="w-full px-4 py-2 bg-dark-300 text-white border border-dark-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
                />
              </div>

              {/* Mood */}
              <div>
                <label className="block text-light-100 mb-2 font-semibold">Mood</label>
                <select
                  value={formData.mood}
                  onChange={(e) => setFormData({ ...formData, mood: e.target.value })}
                  className="w-full px-4 py-2 bg-dark-300 text-white border border-dark-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
                >
                  {MOODS.map((mood) => (
                    <option key={mood} value={mood}>{mood}</option>
                  ))}
                </select>
              </div>

              {/* Color */}
              <div>
                <label className="block text-light-100 mb-2 font-semibold">Color</label>
                <div className="flex gap-2">
                  <input
                    type="color"
                    value={formData.color}
                    onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                    className="w-16 h-10 bg-dark-300 border border-dark-400 rounded-lg cursor-pointer"
                  />
                  <select
                    value={formData.color}
                    onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                    className="flex-1 px-4 py-2 bg-dark-300 text-white border border-dark-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
                  >
                    {COLORS.map((color) => (
                      <option key={color} value={color}>{color}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading || loadingYoutube}
              className="px-8 py-3 bg-accent text-white font-semibold rounded-lg hover:bg-accent/80 transition-colors disabled:opacity-50"
            >
              {loading ? "Saving..." : "Add Track"}
            </button>
          </form>
        </div>

        {/* Tracks List */}
        <div>
          <h2 className="text-2xl font-bold text-white mb-6">Tracks ({tracks.length})</h2>

          {loading && tracks.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-4xl mb-4 animate-spin">🎵</div>
              <p className="text-white">Loading tracks...</p>
            </div>
          ) : tracks.length === 0 ? (
            <div className="bg-dark-200 rounded-lg p-12 text-center">
              <div className="text-6xl mb-4">🎵</div>
              <p className="text-light-100 text-xl mb-2">No tracks yet</p>
              <p className="text-light-100/60">Add your first track above</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {tracks.map((track) => (
                <div
                  key={track.id}
                  className="bg-dark-200 rounded-lg p-6 shadow-lg hover:shadow-xl transition-shadow"
                  style={{ borderTop: `4px solid ${track.color}` }}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-white mb-1">{track.title}</h3>
                      <p className="text-light-100/80 text-sm">{track.artist}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 mb-4">
                    <span
                      className="px-3 py-1 rounded-full text-xs font-medium text-white"
                      style={{ backgroundColor: `${track.color}40` }}
                    >
                      {track.mood}
                    </span>
                  </div>

                  <div className="flex gap-2">
                    <a
                      href={track.youtubeUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 px-4 py-2 bg-dark-300 text-white text-center font-semibold rounded-lg hover:bg-dark-400 transition-colors"
                    >
                      View on YouTube
                    </a>
                    <button
                      onClick={() => handleDelete(track.id, track.title)}
                      className="px-4 py-2 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition-colors"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      <Footer />

      <style jsx>{`
        @keyframes slide-in {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }

        .animate-slide-in {
          animation: slide-in 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}
