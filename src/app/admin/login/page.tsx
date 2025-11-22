"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

// Helper function to get CSRF token from cookie
function getCsrfToken(): string | null {
  const cookies = document.cookie.split(';');
  for (const cookie of cookies) {
    const [name, value] = cookie.trim().split('=');
    if (name === 'csrf_token') {
      return decodeURIComponent(value);
    }
  }
  return null;
}

export default function AdminLogin() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [retryAfter, setRetryAfter] = useState<number | null>(null);
  const [csrfToken, setCsrfToken] = useState<string | null>(null);
  const router = useRouter();

  // Get CSRF token on mount
  useEffect(() => {
    async function getCsrfTokenFromServer() {
      try {
        const res = await fetch("/api/admin/auth");
        const data = await res.json();
        if (data.authenticated) {
          router.push("/admin/vibe");
        } else {
          // Get CSRF token from cookie
          const token = getCsrfToken();
          if (!token) {
            // If no token in cookie, request one
            const tokenRes = await fetch("/api/admin/csrf");
            const tokenData = await tokenRes.json();
            setCsrfToken(tokenData.csrfToken);
          } else {
            setCsrfToken(token);
          }
        }
      } catch (error) {
        console.error("Auth check error:", error);
      }
    }
    getCsrfTokenFromServer();
  }, [router]);

  // Countdown effect for retry after
  useEffect(() => {
    if (retryAfter && retryAfter > 0) {
      const timer = setInterval(() => {
        setRetryAfter((prev) => {
          if (prev && prev > 1) {
            return prev - 1;
          } else {
            setError("");
            return null;
          }
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [retryAfter]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setRetryAfter(null);

    if (!csrfToken) {
      setError("Security token not available. Please refresh the page.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/admin/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password, csrfToken }),
      });

      if (res.ok) {
        router.push("/admin/vibe");
      } else {
        const data = await res.json();

        if (res.status === 429) {
          // Rate limited
          setError(data.error || "Too many login attempts");
          setRetryAfter(data.retryAfter || 3600);
        } else if (res.status === 403) {
          // CSRF token invalid - refresh page to get new token
          setError("Security token expired. Please refresh the page.");
        } else {
          setError(data.error || "Invalid password");
        }
      }
    } catch (error) {
      console.error("Login error:", error);
      setError("Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-dark-100 flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <div className="bg-dark-200 rounded-2xl shadow-2xl p-8 border border-dark-400">
          {/* Header */}
          <div className="text-center mb-8">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="text-5xl mb-4"
            >
              🔐
            </motion.div>
            <h1 className="text-3xl font-bold text-white mb-2">Admin Login</h1>
            <p className="text-light-100/60">Enter your password to continue</p>
          </div>

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="password" className="block text-light-100 mb-2 font-semibold">
                Password
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 bg-dark-300 text-white border border-dark-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition-all"
                placeholder="Enter admin password"
                required
                autoFocus
              />
            </div>

            {/* Error Message */}
            {error && (
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className={`px-4 py-3 rounded-lg text-sm ${
                  retryAfter
                    ? "bg-orange-500/10 border border-orange-500/50 text-orange-400"
                    : "bg-red-500/10 border border-red-500/50 text-red-400"
                }`}
              >
                <div className="flex items-start gap-2">
                  <span>{retryAfter ? "⏱️" : "❌"}</span>
                  <div className="flex-1">
                    <p className="font-semibold">{error}</p>
                    {retryAfter && (
                      <p className="mt-1 text-xs opacity-80">
                        Retry in: {Math.floor(retryAfter / 60)}m {retryAfter % 60}s
                      </p>
                    )}
                  </div>
                </div>
              </motion.div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading || !password || !csrfToken || (retryAfter !== null && retryAfter > 0)}
              className="w-full px-6 py-3 bg-accent text-white font-semibold rounded-lg hover:bg-accent/80 disabled:opacity-50 disabled:cursor-not-allowed transition-all transform hover:scale-[1.02] active:scale-[0.98]"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
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
                  Logging in...
                </span>
              ) : (
                "Login"
              )}
            </button>
          </form>

          {/* Footer */}
          <div className="mt-8 text-center">
            <a
              href="/"
              className="text-light-100/60 hover:text-accent transition-colors text-sm"
            >
              ← Back to Home
            </a>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
