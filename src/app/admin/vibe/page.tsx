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
  artistImage: string;
  artistImages: string[];
  color: string;
  mood: string;
  description: string;
  isFavorite?: boolean;
}

interface Toast {
  id: string;
  type: "success" | "error" | "info" | "warning";
  message: string;
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
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadStatus, setUploadStatus] = useState("");
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

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

  // Toast notification system
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
      setLoading(true);
      const res = await fetch("/api/tracks");

      if (!res.ok) {
        throw new Error("Failed to fetch tracks");
      }

      const data = await res.json();
      // API returns tracks newest-first
      setTracks(data);
    } catch (error: any) {
      console.error("Error fetching tracks:", error);
      addToast("error", `Failed to load tracks: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};

    if (!formData.title?.trim()) {
      errors.title = "Title is required";
    }

    if (!formData.artist?.trim()) {
      errors.artist = "Artist is required";
    }

    if (!formData.youtubeUrl?.trim()) {
      errors.youtubeUrl = "YouTube URL is required";
    } else {
      // Validate YouTube URL format
      const youtubeRegex = /^(https?:\/\/)?(www\.)?(youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
      if (!youtubeRegex.test(formData.youtubeUrl)) {
        errors.youtubeUrl = "Invalid YouTube URL";
      }
    }

    if (!formData.mood) {
      errors.mood = "Mood is required";
    }

    if (!formData.color) {
      errors.color = "Color is required";
    }

    // Check if at least one image is uploaded
    const hasImages = formData.artistImages?.some(img => img.trim() !== "");
    if (!hasImages && !formData.artistImage) {
      errors.images = "Please upload at least one image";
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const fetchYoutubeInfo = async () => {
    if (!youtubeUrl) {
      addToast("warning", "Please enter a YouTube URL");
      return;
    }

    // Validate YouTube URL
    const youtubeRegex = /^(https?:\/\/)?(www\.)?(youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
    if (!youtubeRegex.test(youtubeUrl)) {
      addToast("error", "Invalid YouTube URL format");
      return;
    }

    setLoadingYoutube(true);
    setUploadProgress(0);
    setUploadStatus("Fetching video information...");

    try {
      // Simulate progress
      const progressInterval = setInterval(() => {
        setUploadProgress((prev) => Math.min(prev + 5, 90));
      }, 500);

      const res = await fetch(`/api/youtube/download`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: youtubeUrl }),
      });

      clearInterval(progressInterval);

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Failed to fetch YouTube info");
      }

      const data = await res.json();
      setUploadProgress(100);

      setFormData((prev) => ({
        ...prev,
        title: data.title,
        artist: data.artist,
        youtubeUrl: youtubeUrl,
        audioPath: data.audioPath || "",
        artistImage: data.thumbnail,
      }));

      if (data.audioDownloaded) {
        setUploadStatus("✅ Audio downloaded and optimized!");
        addToast("success", "YouTube audio downloaded successfully!");
      } else {
        setUploadStatus("✅ Info fetched (streaming from YouTube)");
        addToast("info", "Video info fetched. Will stream from YouTube.");
      }

      setTimeout(() => {
        setUploadStatus("");
        setUploadProgress(0);
      }, 3000);
    } catch (error: any) {
      console.error("Error fetching YouTube info:", error);
      setUploadProgress(0);
      setUploadStatus("");
      addToast("error", `YouTube download failed: ${error.message}`);
    } finally {
      setLoadingYoutube(false);
    }
  };

  const handleImageUpload = async (files: FileList | null, index?: number) => {
    if (!files || files.length === 0) return;

    // Validate files
    const validTypes = ["image/jpeg", "image/jpg", "image/png", "image/gif", "image/webp", "image/avif", "image/heic", "image/heif"];
    const invalidFiles = Array.from(files).filter(f => !validTypes.includes(f.type));

    if (invalidFiles.length > 0) {
      addToast("error", `Invalid file type(s): ${invalidFiles.map(f => f.name).join(", ")}`);
      return;
    }

    // Check file sizes (max 10MB per file)
    const largeFiles = Array.from(files).filter(f => f.size > 10 * 1024 * 1024);
    if (largeFiles.length > 0) {
      addToast("error", `File(s) too large (max 10MB): ${largeFiles.map(f => f.name).join(", ")}`);
      return;
    }

    setUploadingImages(true);
    setUploadProgress(0);
    setUploadStatus(`Uploading ${files.length} image(s)...`);

    try {
      const uploadedUrls: string[] = [];
      const totalFiles = files.length;

      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const formData = new FormData();
        formData.append("file", file);

        setUploadStatus(`Optimizing ${file.name} (${i + 1}/${totalFiles})...`);
        setUploadProgress(((i) / totalFiles) * 100);

        try {
          const res = await fetch("/api/upload/image", {
            method: "POST",
            body: formData,
          });

          if (!res.ok) {
            const error = await res.json();
            throw new Error(error.error || "Upload failed");
          }

          const data = await res.json();
          uploadedUrls.push(data.url);

          addToast("success", `${file.name} uploaded (saved ${data.compressionRatio})`);
        } catch (error: any) {
          console.error(`Error uploading ${file.name}:`, error);
          addToast("error", `Failed to upload ${file.name}: ${error.message}`);
        }
      }

      setUploadProgress(100);

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

        setUploadStatus(`✅ ${uploadedUrls.length} image(s) uploaded!`);
        setTimeout(() => {
          setUploadStatus("");
          setUploadProgress(0);
        }, 3000);
      }
    } catch (error: any) {
      console.error("Error uploading images:", error);
      addToast("error", `Upload failed: ${error.message}`);
      setUploadStatus("");
      setUploadProgress(0);
    } finally {
      setUploadingImages(false);
    }
  };

  const setAsMainImage = (url: string) => {
    setFormData((prev) => ({ ...prev, artistImage: url }));
    addToast("info", "Main image updated");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate form
    if (!validateForm()) {
      addToast("error", "Please fix the errors before submitting");
      return;
    }

    setLoading(true);

    try {
      const url = "/api/tracks";
      const method = editingTrack ? "PUT" : "POST";

      const payload = editingTrack
        ? { ...formData, id: editingTrack.id }
        : formData;

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Failed to save track");
      }

      await fetchTracks();
      resetForm();
      addToast("success", editingTrack ? "Track updated successfully!" : "Track added successfully!");
    } catch (error: any) {
      console.error("Error saving track:", error);
      addToast("error", `Failed to save track: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (track: Track) => {
    setEditingTrack(track);
    setFormData(track);
    setYoutubeUrl(track.youtubeUrl);
    setValidationErrors({});
    window.scrollTo({ top: 0, behavior: "smooth" });
    addToast("info", `Editing: ${track.title}`);
  };

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Are you sure you want to delete "${title}"?`)) return;

    try {
      const res = await fetch(`/api/tracks?id=${id}`, { method: "DELETE" });

      if (!res.ok) {
        throw new Error("Failed to delete track");
      }

      await fetchTracks();
      addToast("success", `"${title}" deleted successfully`);
    } catch (error: any) {
      console.error("Error deleting track:", error);
      addToast("error", `Failed to delete track: ${error.message}`);
    }
  };

  const handleReorder = async (trackId: string, direction: 'up' | 'down') => {
    try {
      const res = await fetch('/api/tracks', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ trackId, direction }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to reorder track');
      }

      const data = await res.json();
      setTracks(data.tracks);
      addToast("success", `Track moved ${direction}`);
    } catch (error: any) {
      console.error("Error reordering track:", error);
      addToast("error", `Failed to reorder: ${error.message}`);
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
    setValidationErrors({});
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

  if (loading && tracks.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-dark-100">
        <div className="text-center">
          <div className="text-4xl mb-4 animate-spin">🎵</div>
          <p className="text-white text-xl">Loading tracks...</p>
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

      {/* Toast Notifications */}
      <div className="fixed top-4 right-4 z-50 space-y-2 max-w-md">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`px-6 py-4 rounded-lg shadow-lg border-2 backdrop-blur-sm animate-slide-in flex items-start gap-3 ${
              toast.type === "success"
                ? "bg-green-500/90 border-green-400 text-white"
                : toast.type === "error"
                ? "bg-red-500/90 border-red-400 text-white"
                : toast.type === "warning"
                ? "bg-orange-500/90 border-orange-400 text-white"
                : "bg-blue-500/90 border-blue-400 text-white"
            }`}
          >
            <span className="text-2xl">
              {toast.type === "success" && "✅"}
              {toast.type === "error" && "❌"}
              {toast.type === "warning" && "⚠️"}
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
          <h1 className="text-4xl font-bold text-white">Vibe Admin</h1>
          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-dark-300 text-white font-semibold rounded-lg hover:bg-dark-400 transition-colors flex items-center gap-2 border border-dark-400"
          >
            <span>Logout</span>
            <span>🚪</span>
          </button>
        </div>

        {/* Progress Bar */}
        {(uploadingImages || loadingYoutube) && (
          <div className="mb-6 px-6 py-4 bg-dark-200 border border-accent/50 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="text-light-100 font-semibold">{uploadStatus}</span>
              <span className="text-accent font-bold">{Math.round(uploadProgress)}%</span>
            </div>
            <div className="w-full bg-dark-400 rounded-full h-3 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-accent to-accent/60 transition-all duration-300 rounded-full"
                style={{ width: `${uploadProgress}%` }}
              />
            </div>
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
                  onChange={(e) => {
                    setYoutubeUrl(e.target.value);
                    setValidationErrors((prev) => ({ ...prev, youtubeUrl: "" }));
                  }}
                  className={`flex-1 px-4 py-2 bg-dark-300 text-white border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent ${
                    validationErrors.youtubeUrl ? "border-red-500" : "border-dark-400"
                  }`}
                  placeholder="https://www.youtube.com/watch?v=..."
                  disabled={loadingYoutube}
                />
                <button
                  type="button"
                  onClick={fetchYoutubeInfo}
                  disabled={loadingYoutube || !youtubeUrl}
                  className="px-6 py-2 bg-accent text-white font-semibold rounded-lg hover:bg-accent/80 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                  {loadingYoutube ? (
                    <span className="flex items-center gap-2">
                      <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                          fill="none"
                        />
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        />
                      </svg>
                      Downloading...
                    </span>
                  ) : (
                    "Download"
                  )}
                </button>
              </div>
              {validationErrors.youtubeUrl && (
                <p className="text-red-400 text-sm mt-1">{validationErrors.youtubeUrl}</p>
              )}
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
                  onChange={(e) => {
                    setFormData({ ...formData, title: e.target.value });
                    setValidationErrors((prev) => ({ ...prev, title: "" }));
                  }}
                  className={`w-full px-4 py-2 bg-dark-300 text-white border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent ${
                    validationErrors.title ? "border-red-500" : "border-dark-400"
                  }`}
                />
                {validationErrors.title && (
                  <p className="text-red-400 text-sm mt-1">{validationErrors.title}</p>
                )}
              </div>

              {/* Artist */}
              <div>
                <label className="block text-light-100 mb-2 font-semibold">Artist *</label>
                <input
                  type="text"
                  value={formData.artist}
                  onChange={(e) => {
                    setFormData({ ...formData, artist: e.target.value });
                    setValidationErrors((prev) => ({ ...prev, artist: "" }));
                  }}
                  className={`w-full px-4 py-2 bg-dark-300 text-white border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent ${
                    validationErrors.artist ? "border-red-500" : "border-dark-400"
                  }`}
                />
                {validationErrors.artist && (
                  <p className="text-red-400 text-sm mt-1">{validationErrors.artist}</p>
                )}
              </div>

              {/* Mood */}
              <div>
                <label className="block text-light-100 mb-2 font-semibold">Mood *</label>
                <select
                  value={formData.mood}
                  onChange={(e) => setFormData({ ...formData, mood: e.target.value })}
                  className="w-full px-4 py-2 bg-dark-300 text-white border border-dark-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
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
                Artist Images (Upload Photos) *
              </label>
              <p className="text-sm text-light-100/60 mb-3">
                Upload 1-5 images. First image will be the main spinning disk image. All formats supported (JPG, PNG, GIF, WEBP, HEIC, etc.)
              </p>

              {validationErrors.images && (
                <p className="text-red-400 text-sm mb-3">{validationErrors.images}</p>
              )}

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
                                  : "bg-white text-dark-100 hover:bg-gray-200"
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
                              className="px-3 py-1 bg-white text-dark-100 rounded text-xs font-semibold cursor-pointer hover:bg-gray-200"
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
                            className="cursor-pointer text-center p-4 hover:bg-dark-400 w-full h-full flex flex-col items-center justify-center transition-colors"
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
                disabled={loading || uploadingImages || loadingYoutube}
                className="px-8 py-3 bg-accent text-white font-semibold rounded-lg hover:bg-accent/80 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "Saving..." : editingTrack ? "Update Track" : "Add Track"}
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

          {tracks.length === 0 ? (
            <div className="bg-dark-200 rounded-lg p-12 text-center">
              <div className="text-6xl mb-4">🎵</div>
              <p className="text-light-100 text-xl mb-2">No tracks yet</p>
              <p className="text-light-100/60">Add your first track using the form above</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {tracks.map((track, index) => (
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
                      onError={(e) => {
                        e.currentTarget.src = "/placeholder-image.jpg";
                      }}
                    />
                  )}

                  <div className="p-4">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <h3 className="text-xl font-bold text-white">{track.title}</h3>
                        <p className="text-light-100/80">{track.artist}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        {track.isFavorite && <span className="text-2xl">⭐</span>}
                        <div className="flex flex-col gap-1">
                          <button
                            onClick={() => handleReorder(track.id, 'up')}
                            disabled={index === 0}
                            className="px-2 py-1 bg-dark-300 text-white rounded hover:bg-dark-400 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                            title="Move up"
                          >
                            ↑
                          </button>
                          <button
                            onClick={() => handleReorder(track.id, 'down')}
                            disabled={index === tracks.length - 1}
                            className="px-2 py-1 bg-dark-300 text-white rounded hover:bg-dark-400 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                            title="Move down"
                          >
                            ↓
                          </button>
                        </div>
                      </div>
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
                        onClick={() => handleDelete(track.id, track.title)}
                        className="flex-1 px-4 py-2 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition-colors"
                      >
                        Delete
                      </button>
                    </div>
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
