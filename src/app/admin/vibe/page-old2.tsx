"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Navbar, Footer } from "../../../components";

interface Track {
  id: string;
  title: string;
  artist: string;
  audioPath: string;
  youtubeUrl: string;
  artistImage: string;
  artistImages: string[];
  color: string;
  mood: string;
  description: string;
  isFavorite?: boolean;
}

const MOODS = [
  "Passion",
  "Chill 😌",
  "Focus 🎯",
  "Creative 🎨",
  "Inspired ✨",
  "Intense 🔥",
  "Smooth 😎",
  "Uplifting 🌟",
  "Energetic ⚡",
  "Soulful 💜",
  "Romantic 💕",
  "Favorite",
];

const COLORS = [
  "#ff006e",
  "#8338ec",
  "#3a86ff",
  "#06ffa5",
  "#ffbe0b",
  "#c71f37",
  "#fb8500",
  "#06a77d",
  "#d81159",
  "#6a4c93",
  "#ef476f",
  "#0466c8",
];

export default function VibeAdmin() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authLoading, setAuthLoading] = useState(true);
  const [tracks, setTracks] = useState<Track[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingTrack, setEditingTrack] = useState<Track | null>(null);
  const [youtubeUrl, setYoutubeUrl] = useState("");
  const [loadingYoutube, setLoadingYoutube] = useState(false);
  const [uploadingImages, setUploadingImages] = useState(false);
  const [uploadProgress, setUploadProgress] = useState("");

  // Form state
  const [formData, setFormData] = useState<Partial<Track>>({
    title: "",
    artist: "",
    audioPath: "",
    youtubeUrl: "",
    artistImage: "",
    artistImages: ["", "", "", "", ""],
    color: COLORS[0],
    mood: MOODS[0],
    description: "",
    isFavorite: false,
  });

  // Check authentication on mount
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
      const res = await fetch("/api/tracks");
      const data = await res.json();
      setTracks(data);
    } catch (error) {
      console.error("Error fetching tracks:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchYoutubeInfo = async () => {
    if (!youtubeUrl) return;

    setLoadingYoutube(true);
    setUploadProgress("Fetching YouTube info and downloading audio...");

    try {
      const res = await fetch(`/api/youtube/download`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: youtubeUrl }),
      });

      const data = await res.json();

      if (res.ok) {
        setFormData((prev) => ({
          ...prev,
          title: data.title,
          artist: data.artist,
          youtubeUrl: youtubeUrl,
          audioPath: data.audioPath || "",
          artistImage: data.thumbnail,
        }));

        setUploadProgress(data.audioDownloaded ? "✅ Audio downloaded and optimized!" : "✅ Info fetched (audio streaming from YouTube)");
        setTimeout(() => setUploadProgress(""), 3000);
      } else {
        alert(data.error || "Failed to fetch YouTube info");
        setUploadProgress("");
      }
    } catch (error) {
      console.error("Error fetching YouTube info:", error);
      alert("Failed to fetch YouTube info");
      setUploadProgress("");
    } finally {
      setLoadingYoutube(false);
    }
  };

  const handleImageUpload = async (files: FileList | null, index?: number) => {
    if (!files || files.length === 0) return;

    setUploadingImages(true);
    setUploadProgress(`Uploading ${files.length} image(s)...`);

    try {
      const uploadedUrls: string[] = [];

      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const formData = new FormData();
        formData.append("file", file);

        setUploadProgress(`Uploading and optimizing image ${i + 1}/${files.length}...`);

        const res = await fetch("/api/upload/image", {
          method: "POST",
          body: formData,
        });

        if (res.ok) {
          const data = await res.json();
          uploadedUrls.push(data.url);
        } else {
          const error = await res.json();
          alert(`Failed to upload ${file.name}: ${error.error}`);
        }
      }

      if (uploadedUrls.length > 0) {
        setFormData((prev) => {
          const newImages = [...(prev.artistImages || ["", "", "", "", ""])];

          // If index specified, replace that image
          if (index !== undefined) {
            newImages[index] = uploadedUrls[0];
            return {
              ...prev,
              artistImages: newImages,
              // If it's the first image (index 0), also set as main image
              artistImage: index === 0 ? uploadedUrls[0] : prev.artistImage,
            };
          }

          // Otherwise, fill in empty slots
          let slot = 0;
          for (const url of uploadedUrls) {
            while (slot < newImages.length && newImages[slot]) {
              slot++;
            }
            if (slot < newImages.length) {
              newImages[slot] = url;
            }
          }

          // Set first uploaded image as main image if not set
          return {
            ...prev,
            artistImages: newImages,
            artistImage: prev.artistImage || uploadedUrls[0],
          };
        });

        setUploadProgress(`✅ ${uploadedUrls.length} image(s) uploaded and optimized!`);
        setTimeout(() => setUploadProgress(""), 3000);
      }
    } catch (error) {
      console.error("Error uploading images:", error);
      alert("Failed to upload images");
      setUploadProgress("");
    } finally {
      setUploadingImages(false);
    }
  };

  const setAsMainImage = (url: string) => {
    setFormData({ ...formData, artistImage: url });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const url = editingTrack ? "/api/tracks" : "/api/tracks";
      const method = editingTrack ? "PUT" : "POST";

      const payload = editingTrack
        ? { ...formData, id: editingTrack.id }
        : formData;

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        fetchTracks();
        resetForm();
        alert(editingTrack ? "Track updated!" : "Track added!");
      } else {
        alert("Failed to save track");
      }
    } catch (error) {
      console.error("Error saving track:", error);
      alert("Failed to save track");
    }
  };

  const handleEdit = (track: Track) => {
    setEditingTrack(track);
    setFormData(track);
    setYoutubeUrl(track.youtubeUrl);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this track?")) return;

    try {
      const res = await fetch(`/api/tracks?id=${id}`, { method: "DELETE" });

      if (res.ok) {
        fetchTracks();
        alert("Track deleted!");
      } else {
        alert("Failed to delete track");
      }
    } catch (error) {
      console.error("Error deleting track:", error);
      alert("Failed to delete track");
    }
  };

  const resetForm = () => {
    setEditingTrack(null);
    setFormData({
      title: "",
      artist: "",
      audioPath: "",
      youtubeUrl: "",
      artistImage: "",
      artistImages: ["", "", "", "", ""],
      color: COLORS[0],
      mood: MOODS[0],
      description: "",
      isFavorite: false,
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
          <div className="text-4xl mb-4">🔐</div>
          <p className="text-white text-xl">Checking authentication...</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-dark-100">
        <div className="text-center">
          <div className="text-4xl mb-4">🎵</div>
          <p className="text-white text-xl">Loading tracks...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-dark-100">
      <Navbar />

      <main className="container-custom pt-32 pb-20 px-4">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-4xl font-bold text-white">Vibe Admin</h1>
          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-dark-300 text-white font-semibold rounded-lg hover:bg-dark-400 transition-colors flex items-center gap-2 border border-dark-400"
          >
            <span>Logout</span>
            <span>🚪</span>
          </button>
        </div>

        {/* Upload Progress */}
        {uploadProgress && (
          <div className="mb-6 px-4 py-3 bg-accent/10 border border-accent/50 rounded-lg text-accent">
            {uploadProgress}
          </div>
        )}

        {/* Add/Edit Form */}
        <div className="bg-dark-200 p-6 rounded-lg mb-12 shadow-xl">
          <h2 className="text-2xl font-bold text-white mb-6">
            {editingTrack ? "Edit Track" : "Add New Track"}
          </h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* YouTube URL Input */}
            <div>
              <label className="block text-light-100 mb-2 font-semibold">
                YouTube URL *
              </label>
              <div className="flex gap-2">
                <input
                  type="url"
                  value={youtubeUrl}
                  onChange={(e) => setYoutubeUrl(e.target.value)}
                  className="flex-1 px-4 py-2 bg-dark-300 text-white border border-dark-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
                  placeholder="https://www.youtube.com/watch?v=..."
                  required
                />
                <button
                  type="button"
                  onClick={fetchYoutubeInfo}
                  disabled={loadingYoutube || !youtubeUrl}
                  className="px-6 py-2 bg-accent text-white font-semibold rounded-lg hover:bg-accent/80 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loadingYoutube ? "Downloading..." : "Download"}
                </button>
              </div>
              <p className="text-sm text-light-100/60 mt-1">
                Paste YouTube URL and click Download to auto-fill info and download audio
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Title */}
              <div>
                <label className="block text-light-100 mb-2 font-semibold">Title *</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-4 py-2 bg-dark-300 text-white border border-dark-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
                  required
                />
              </div>

              {/* Artist */}
              <div>
                <label className="block text-light-100 mb-2 font-semibold">Artist *</label>
                <input
                  type="text"
                  value={formData.artist}
                  onChange={(e) => setFormData({ ...formData, artist: e.target.value })}
                  className="w-full px-4 py-2 bg-dark-300 text-white border border-dark-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
                  required
                />
              </div>

              {/* Mood */}
              <div>
                <label className="block text-light-100 mb-2 font-semibold">Mood *</label>
                <select
                  value={formData.mood}
                  onChange={(e) => setFormData({ ...formData, mood: e.target.value })}
                  className="w-full px-4 py-2 bg-dark-300 text-white border border-dark-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
                  required
                >
                  {MOODS.map((mood) => (
                    <option key={mood} value={mood}>
                      {mood}
                    </option>
                  ))}
                </select>
              </div>

              {/* Color */}
              <div>
                <label className="block text-light-100 mb-2 font-semibold">Color *</label>
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
                      <option key={color} value={color}>
                        {color}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Image Upload Section */}
            <div>
              <label className="block text-light-100 mb-2 font-semibold">
                Artist Images (Upload Photos)
              </label>
              <p className="text-sm text-light-100/60 mb-3">
                Upload 1-5 images. First image will be the main spinning disk image. All formats supported (JPG, PNG, GIF, WEBP, HEIC, etc.)
              </p>

              {/* Bulk Upload */}
              <div className="mb-4">
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={(e) => handleImageUpload(e.target.files)}
                  className="hidden"
                  id="bulk-upload"
                  disabled={uploadingImages}
                />
                <label
                  htmlFor="bulk-upload"
                  className={`inline-block px-6 py-3 bg-accent text-white font-semibold rounded-lg cursor-pointer hover:bg-accent/80 transition-colors ${
                    uploadingImages ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                >
                  📤 Upload Multiple Images
                </label>
              </div>

              {/* Image Preview Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-4">
                {[0, 1, 2, 3, 4].map((index) => (
                  <div key={index} className="relative">
                    <div className="aspect-square bg-dark-300 rounded-lg border-2 border-dark-400 overflow-hidden">
                      {formData.artistImages?.[index] ? (
                        <div className="relative h-full group">
                          <img
                            src={formData.artistImages[index]}
                            alt={`Artist ${index + 1}`}
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2">
                            <button
                              type="button"
                              onClick={() => setAsMainImage(formData.artistImages![index])}
                              className={`px-3 py-1 rounded text-xs font-semibold ${
                                formData.artistImage === formData.artistImages![index]
                                  ? "bg-accent text-white"
                                  : "bg-white text-dark-100"
                              }`}
                            >
                              {formData.artistImage === formData.artistImages![index] ? "★ Main" : "Set Main"}
                            </button>
                            <input
                              type="file"
                              accept="image/*"
                              onChange={(e) => handleImageUpload(e.target.files, index)}
                              className="hidden"
                              id={`replace-${index}`}
                              disabled={uploadingImages}
                            />
                            <label
                              htmlFor={`replace-${index}`}
                              className="px-3 py-1 bg-white text-dark-100 rounded text-xs font-semibold cursor-pointer"
                            >
                              Replace
                            </label>
                          </div>
                        </div>
                      ) : (
                        <div className="h-full flex items-center justify-center">
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => handleImageUpload(e.target.files, index)}
                            className="hidden"
                            id={`upload-${index}`}
                            disabled={uploadingImages}
                          />
                          <label
                            htmlFor={`upload-${index}`}
                            className="cursor-pointer text-center p-4"
                          >
                            <div className="text-4xl mb-2">📸</div>
                            <div className="text-xs text-light-100/60">
                              Image {index + 1}
                            </div>
                          </label>
                        </div>
                      )}
                    </div>
                    {index === 0 && formData.artistImages?.[0] && (
                      <div className="absolute -top-2 -right-2 bg-accent text-white text-xs px-2 py-1 rounded-full font-semibold">
                        Main
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block text-light-100 mb-2 font-semibold">Description</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-4 py-2 bg-dark-300 text-white border border-dark-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
                rows={3}
                placeholder="Short description of this track..."
              />
            </div>

            {/* Favorite */}
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="favorite"
                checked={formData.isFavorite || false}
                onChange={(e) => setFormData({ ...formData, isFavorite: e.target.checked })}
                className="w-5 h-5 text-accent bg-dark-300 border-dark-400 rounded focus:ring-accent"
              />
              <label htmlFor="favorite" className="text-light-100 font-semibold">
                Mark as Favorite ⭐
              </label>
            </div>

            {/* Submit Buttons */}
            <div className="flex gap-4">
              <button
                type="submit"
                className="px-8 py-3 bg-accent text-white font-semibold rounded-lg hover:bg-accent/80 transition-colors"
              >
                {editingTrack ? "Update Track" : "Add Track"}
              </button>

              {editingTrack && (
                <button
                  type="button"
                  onClick={resetForm}
                  className="px-8 py-3 bg-dark-400 text-white font-semibold rounded-lg hover:bg-dark-500 transition-colors"
                >
                  Cancel
                </button>
              )}
            </div>
          </form>
        </div>

        {/* Tracks List */}
        <div>
          <h2 className="text-2xl font-bold text-white mb-6">All Tracks ({tracks.length})</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tracks.map((track) => (
              <div
                key={track.id}
                className="bg-dark-200 rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow"
                style={{ borderTop: `4px solid ${track.color}` }}
              >
                {track.artistImage && (
                  <img
                    src={track.artistImage}
                    alt={track.artist}
                    className="w-full h-48 object-cover"
                  />
                )}

                <div className="p-4">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h3 className="text-xl font-bold text-white">{track.title}</h3>
                      <p className="text-light-100/80">{track.artist}</p>
                    </div>
                    {track.isFavorite && <span className="text-2xl">⭐</span>}
                  </div>

                  <p className="text-sm text-light-100/60 mb-3 line-clamp-2">
                    {track.description}
                  </p>

                  <div className="flex items-center gap-2 mb-4">
                    <span className="px-3 py-1 bg-dark-300 text-white text-xs rounded-full">
                      {track.mood}
                    </span>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(track)}
                      className="flex-1 px-4 py-2 bg-accent text-white font-semibold rounded-lg hover:bg-accent/80 transition-colors"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(track.id)}
                      className="flex-1 px-4 py-2 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition-colors"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
