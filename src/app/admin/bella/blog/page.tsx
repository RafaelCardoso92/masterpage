"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Navbar, Footer } from "../../../../components";
import AdminNav from "../../../../components/AdminNav";

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  coverImage: string;
  author: string;
  publishedAt: string;
  updatedAt: string;
  tags: string[];
  isPublished: boolean;
}

interface Toast {
  id: string;
  type: "success" | "error" | "info";
  message: string;
}

export default function BellaBlogAdmin() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authLoading, setAuthLoading] = useState(true);
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [showEditor, setShowEditor] = useState(false);

  // Form state
  const [formData, setFormData] = useState<Partial<BlogPost>>({
    title: "",
    slug: "",
    excerpt: "",
    content: "",
    coverImage: "",
    author: "Rafael Cardoso",
    tags: [],
    isPublished: false,
  });

  const addToast = (type: Toast["type"], message: string) => {
    const id = Date.now().toString();
    setToasts((prev) => [...prev, { id, type, message }]);
    setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 5000);
  };

  // Check authentication
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
      fetchPosts();
    }
  }, [isAuthenticated]);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/bella/blog");
      const data = await res.json();
      setPosts(data);
    } catch (error: any) {
      console.error("Error fetching posts:", error);
      addToast("error", "Failed to load posts");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title?.trim() || !formData.content?.trim()) {
      addToast("error", "Title and content are required");
      return;
    }

    try {
      setLoading(true);
      const url = "/api/bella/blog";
      const method = editingPost ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        throw new Error("Failed to save post");
      }

      await fetchPosts();
      resetForm();
      addToast("success", editingPost ? "Post updated!" : "Post created!");
    } catch (error: any) {
      console.error("Error saving post:", error);
      addToast("error", `Failed to save: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (post: BlogPost) => {
    setEditingPost(post);
    setFormData(post);
    setShowEditor(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Delete "${title}"?`)) return;

    try {
      const res = await fetch(`/api/bella/blog?id=${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete");

      await fetchPosts();
      addToast("success", "Post deleted");
    } catch (error: any) {
      console.error("Error deleting post:", error);
      addToast("error", "Failed to delete post");
    }
  };

  const resetForm = () => {
    setEditingPost(null);
    setFormData({
      title: "",
      slug: "",
      excerpt: "",
      content: "",
      coverImage: "",
      author: "Rafael Cardoso",
      tags: [],
      isPublished: false,
    });
    setShowEditor(false);
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

      {/* Toast Notifications */}
      <div className="fixed top-4 right-4 z-50 space-y-2 max-w-md">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`px-6 py-4 rounded-lg shadow-lg border-2 animate-slide-in ${
              toast.type === "success"
                ? "bg-green-500/90 border-green-400 text-white"
                : toast.type === "error"
                ? "bg-red-500/90 border-red-400 text-white"
                : "bg-blue-500/90 border-blue-400 text-white"
            }`}
          >
            {toast.message}
          </div>
        ))}
      </div>

      <main className="container-custom pt-8 pb-20 px-4">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-4xl font-bold text-white">Bella Blog Admin</h1>
          <div className="flex gap-3">
            {!showEditor && (
              <button
                onClick={() => setShowEditor(true)}
                className="px-6 py-3 bg-purple-600 text-white font-semibold rounded-lg hover:bg-purple-700 transition-colors"
              >
                + New Post
              </button>
            )}
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-dark-300 text-white font-semibold rounded-lg hover:bg-dark-400 transition-colors border border-dark-400"
            >
              Logout 🚪
            </button>
          </div>
        </div>

        {/* Editor */}
        {showEditor && (
          <div className="bg-dark-200 rounded-lg p-6 border border-dark-400 mb-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-white">
                {editingPost ? "Edit Post" : "New Post"}
              </h2>
              <button
                onClick={resetForm}
                className="text-light-100/60 hover:text-white transition-colors"
              >
                ✕ Close
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-6">
              {/* Title */}
              <div>
                <label className="block text-light-100 mb-2 font-semibold">Title *</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-4 py-3 bg-dark-300 text-white border border-dark-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-xl"
                  placeholder="Post title..."
                  required
                />
              </div>

              {/* Slug */}
              <div>
                <label className="block text-light-100 mb-2 font-semibold">Slug (URL)</label>
                <input
                  type="text"
                  value={formData.slug}
                  onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                  className="w-full px-4 py-2 bg-dark-300 text-white border border-dark-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="auto-generated-from-title"
                />
                <p className="text-sm text-light-100/60 mt-1">Leave empty to auto-generate</p>
              </div>

              {/* Excerpt */}
              <div>
                <label className="block text-light-100 mb-2 font-semibold">Excerpt</label>
                <textarea
                  value={formData.excerpt}
                  onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                  className="w-full px-4 py-2 bg-dark-300 text-white border border-dark-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  rows={2}
                  placeholder="Short summary..."
                />
              </div>

              {/* Content */}
              <div>
                <label className="block text-light-100 mb-2 font-semibold">Content * (Markdown)</label>
                <textarea
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  className="w-full px-4 py-3 bg-dark-300 text-white border border-dark-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 font-mono text-sm"
                  rows={20}
                  placeholder="Write your post content in Markdown..."
                  required
                />
              </div>

              {/* Cover Image */}
              <div>
                <label className="block text-light-100 mb-2 font-semibold">Cover Image URL</label>
                <input
                  type="text"
                  value={formData.coverImage}
                  onChange={(e) => setFormData({ ...formData, coverImage: e.target.value })}
                  className="w-full px-4 py-2 bg-dark-300 text-white border border-dark-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="https://..."
                />
              </div>

              {/* Tags */}
              <div>
                <label className="block text-light-100 mb-2 font-semibold">Tags (comma-separated)</label>
                <input
                  type="text"
                  value={formData.tags?.join(", ")}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      tags: e.target.value.split(",").map((t) => t.trim()).filter(Boolean),
                    })
                  }
                  className="w-full px-4 py-2 bg-dark-300 text-white border border-dark-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="AI, Technology, Tutorial"
                />
              </div>

              {/* Published */}
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="published"
                  checked={formData.isPublished || false}
                  onChange={(e) => setFormData({ ...formData, isPublished: e.target.checked })}
                  className="w-5 h-5 text-purple-600 bg-dark-300 border-dark-400 rounded focus:ring-purple-500"
                />
                <label htmlFor="published" className="text-light-100 font-semibold">
                  Publish (make visible to public)
                </label>
              </div>

              {/* Buttons */}
              <div className="flex gap-4 pt-4 border-t border-dark-400">
                <button
                  type="submit"
                  disabled={loading}
                  className="px-8 py-3 bg-purple-600 text-white font-semibold rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50"
                >
                  {loading ? "Saving..." : editingPost ? "Update Post" : "Create Post"}
                </button>
                <button
                  type="button"
                  onClick={resetForm}
                  className="px-8 py-3 bg-dark-400 text-white font-semibold rounded-lg hover:bg-dark-500 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Posts List */}
        <div>
          <h2 className="text-2xl font-bold text-white mb-6">All Posts ({posts.length})</h2>

          {posts.length === 0 ? (
            <div className="bg-dark-200 rounded-lg p-12 text-center border border-dark-400">
              <div className="text-6xl mb-4">📝</div>
              <p className="text-light-100 text-xl">No blog posts yet</p>
              <p className="text-light-100/60 mt-2">Create your first post to get started</p>
            </div>
          ) : (
            <div className="space-y-4">
              {posts.map((post) => (
                <div
                  key={post.id}
                  className="bg-dark-200 rounded-lg p-6 border border-dark-400 hover:border-purple-500/50 transition-colors"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-2xl font-bold text-white">{post.title}</h3>
                        {!post.isPublished && (
                          <span className="px-3 py-1 bg-orange-500/20 border border-orange-500/50 rounded-full text-orange-300 text-xs font-semibold">
                            DRAFT
                          </span>
                        )}
                      </div>
                      <p className="text-light-100/80 mb-3">{post.excerpt}</p>
                      <div className="flex items-center gap-4 text-sm text-light-100/60">
                        <span>/{post.slug}</span>
                        <span>•</span>
                        <span>{new Date(post.publishedAt).toLocaleDateString()}</span>
                        {post.tags && post.tags.length > 0 && (
                          <>
                            <span>•</span>
                            <div className="flex gap-2">
                              {post.tags.map((tag) => (
                                <span key={tag} className="px-2 py-1 bg-purple-500/20 rounded text-xs">
                                  {tag}
                                </span>
                              ))}
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                    <div className="flex gap-2 ml-4">
                      <button
                        onClick={() => handleEdit(post)}
                        className="px-4 py-2 bg-purple-600 text-white font-semibold rounded-lg hover:bg-purple-700 transition-colors"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(post.id, post.title)}
                        className="px-4 py-2 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition-colors"
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
