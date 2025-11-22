"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Navbar, Footer } from "../../../components";
import AdminNav from "../../../components/AdminNav";

interface Analytics {
  summary: {
    totalVisits: number;
    uniqueVisitors: number;
    lastUpdated: string | null;
  };
  byPage: Record<string, number>;
  byCountry: Record<string, number>;
  byCity: Record<string, number>;
  byReferrer: Record<string, number>;
  byHour: number[];
  byDay: number[];
  recentVisits: any[];
}

export default function MetricsAdmin() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authLoading, setAuthLoading] = useState(true);
  const [analytics, setAnalytics] = useState<Analytics | null>(null);
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState("all");
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  // Helper to format relative time
  const getRelativeTime = (timestamp: string) => {
    const now = new Date();
    const then = new Date(timestamp);
    const diffMs = now.getTime() - then.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return "just now";
    if (diffMins < 60) return `${diffMins} minute${diffMins !== 1 ? "s" : ""} ago`;
    if (diffHours < 24) return `${diffHours} hour${diffHours !== 1 ? "s" : ""} ago`;
    return `${diffDays} day${diffDays !== 1 ? "s" : ""} ago`;
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
      fetchMetrics();

      // Auto-refresh every 30 seconds
      const interval = setInterval(() => {
        fetchMetrics();
      }, 30000);

      return () => clearInterval(interval);
    }
  }, [isAuthenticated, period]);

  const fetchMetrics = async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/metrics?period=${period}`);

      if (!res.ok) {
        throw new Error("Failed to fetch metrics");
      }

      const data = await res.json();
      setAnalytics(data);
    } catch (error: any) {
      console.error("Error fetching metrics:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleClearMetrics = async () => {
    try {
      const res = await fetch("/api/metrics", { method: "DELETE" });

      if (!res.ok) {
        throw new Error("Failed to clear metrics");
      }

      setShowClearConfirm(false);
      fetchMetrics();
    } catch (error: any) {
      console.error("Error clearing metrics:", error);
    }
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

  if (loading && !analytics) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-dark-100">
        <div className="text-center">
          <div className="text-4xl mb-4 animate-spin">📊</div>
          <p className="text-white text-xl">Loading metrics...</p>
        </div>
      </div>
    );
  }

  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  return (
    <div className="min-h-screen bg-dark-100">
      <Navbar />
      <div className="pt-20">
        <AdminNav />
      </div>

      <main className="container-custom pt-8 pb-20 px-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">
              Analytics Dashboard
              {loading && <span className="ml-3 text-sm text-accent animate-pulse">Refreshing...</span>}
            </h1>
            <p className="text-light-100/60">
              {analytics?.summary.lastUpdated
                ? `Last updated: ${getRelativeTime(analytics.summary.lastUpdated)} (${new Date(analytics.summary.lastUpdated).toLocaleString()})`
                : "No data yet"}
            </p>
            <p className="text-light-100/40 text-sm mt-1">Auto-refreshes every 30 seconds</p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-dark-300 text-white font-semibold rounded-lg hover:bg-dark-400 transition-colors border border-dark-400"
            >
              Logout 🚪
            </button>
          </div>
        </div>

        {/* Period Filter */}
        <div className="mb-8 flex gap-3 flex-wrap">
          {["today", "week", "month", "all"].map((p) => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              className={`px-6 py-2 font-semibold rounded-lg transition-colors ${
                period === p
                  ? "bg-accent text-white"
                  : "bg-dark-200 text-light-100 hover:bg-dark-300 border border-dark-400"
              }`}
            >
              {p.charAt(0).toUpperCase() + p.slice(1)}
            </button>
          ))}
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <div className="bg-dark-200 rounded-lg p-6 border border-dark-400">
            <div className="text-4xl mb-2">👥</div>
            <div className="text-light-100/60 text-sm mb-1">Total Visits</div>
            <div className="text-4xl font-bold text-white">{analytics?.summary.totalVisits || 0}</div>
          </div>

          <div className="bg-dark-200 rounded-lg p-6 border border-dark-400">
            <div className="text-4xl mb-2">🌟</div>
            <div className="text-light-100/60 text-sm mb-1">Unique Visitors</div>
            <div className="text-4xl font-bold text-white">{analytics?.summary.uniqueVisitors || 0}</div>
          </div>

          <div className="bg-dark-200 rounded-lg p-6 border border-dark-400">
            <div className="text-4xl mb-2">📄</div>
            <div className="text-light-100/60 text-sm mb-1">Pages Tracked</div>
            <div className="text-4xl font-bold text-white">
              {analytics ? Object.keys(analytics.byPage).length : 0}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Top Pages */}
          <div className="bg-dark-200 rounded-lg p-6 border border-dark-400">
            <h2 className="text-2xl font-bold text-white mb-4">📊 Top Pages</h2>
            <div className="space-y-3">
              {analytics && Object.entries(analytics.byPage).length > 0 ? (
                Object.entries(analytics.byPage)
                  .sort(([, a], [, b]) => b - a)
                  .slice(0, 10)
                  .map(([page, count]) => (
                    <div key={page} className="flex items-center justify-between">
                      <span className="text-light-100 truncate flex-1 mr-4">{page}</span>
                      <div className="flex items-center gap-2">
                        <div className="h-2 bg-dark-400 rounded-full overflow-hidden w-24">
                          <div
                            className="h-full bg-accent rounded-full"
                            style={{
                              width: `${(count / Math.max(...Object.values(analytics.byPage))) * 100}%`,
                            }}
                          />
                        </div>
                        <span className="text-white font-semibold w-12 text-right">{count}</span>
                      </div>
                    </div>
                  ))
              ) : (
                <p className="text-light-100/60 text-center py-4">No data yet</p>
              )}
            </div>
          </div>

          {/* Top Countries */}
          <div className="bg-dark-200 rounded-lg p-6 border border-dark-400">
            <h2 className="text-2xl font-bold text-white mb-4">🌍 Top Countries</h2>
            <div className="space-y-3">
              {analytics && Object.entries(analytics.byCountry).length > 0 ? (
                Object.entries(analytics.byCountry)
                  .sort(([, a], [, b]) => b - a)
                  .slice(0, 10)
                  .map(([country, count]) => (
                    <div key={country} className="flex items-center justify-between">
                      <span className="text-light-100 truncate flex-1 mr-4">{country}</span>
                      <div className="flex items-center gap-2">
                        <div className="h-2 bg-dark-400 rounded-full overflow-hidden w-24">
                          <div
                            className="h-full bg-accent rounded-full"
                            style={{
                              width: `${(count / Math.max(...Object.values(analytics.byCountry))) * 100}%`,
                            }}
                          />
                        </div>
                        <span className="text-white font-semibold w-12 text-right">{count}</span>
                      </div>
                    </div>
                  ))
              ) : (
                <p className="text-light-100/60 text-center py-4">No data yet</p>
              )}
            </div>
          </div>

          {/* Top Cities */}
          <div className="bg-dark-200 rounded-lg p-6 border border-dark-400">
            <h2 className="text-2xl font-bold text-white mb-4">🏙️ Top Cities</h2>
            <div className="space-y-3">
              {analytics && Object.entries(analytics.byCity).length > 0 ? (
                Object.entries(analytics.byCity)
                  .sort(([, a], [, b]) => b - a)
                  .slice(0, 10)
                  .map(([city, count]) => (
                    <div key={city} className="flex items-center justify-between">
                      <span className="text-light-100 truncate flex-1 mr-4">{city}</span>
                      <div className="flex items-center gap-2">
                        <div className="h-2 bg-dark-400 rounded-full overflow-hidden w-24">
                          <div
                            className="h-full bg-accent rounded-full"
                            style={{
                              width: `${(count / Math.max(...Object.values(analytics.byCity))) * 100}%`,
                            }}
                          />
                        </div>
                        <span className="text-white font-semibold w-12 text-right">{count}</span>
                      </div>
                    </div>
                  ))
              ) : (
                <p className="text-light-100/60 text-center py-4">No data yet</p>
              )}
            </div>
          </div>

          {/* Top Referrers */}
          <div className="bg-dark-200 rounded-lg p-6 border border-dark-400">
            <h2 className="text-2xl font-bold text-white mb-4">🔗 Top Referrers</h2>
            <div className="space-y-3">
              {analytics && Object.entries(analytics.byReferrer).length > 0 ? (
                Object.entries(analytics.byReferrer)
                  .sort(([, a], [, b]) => b - a)
                  .slice(0, 10)
                  .map(([referrer, count]) => (
                    <div key={referrer} className="flex items-center justify-between">
                      <span className="text-light-100 truncate flex-1 mr-4">
                        {referrer === "Direct" ? "Direct" : new URL(referrer).hostname}
                      </span>
                      <div className="flex items-center gap-2">
                        <div className="h-2 bg-dark-400 rounded-full overflow-hidden w-24">
                          <div
                            className="h-full bg-accent rounded-full"
                            style={{
                              width: `${(count / Math.max(...Object.values(analytics.byReferrer))) * 100}%`,
                            }}
                          />
                        </div>
                        <span className="text-white font-semibold w-12 text-right">{count}</span>
                      </div>
                    </div>
                  ))
              ) : (
                <p className="text-light-100/60 text-center py-4">No data yet</p>
              )}
            </div>
          </div>
        </div>

        {/* Time Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* By Hour */}
          <div className="bg-dark-200 rounded-lg p-6 border border-dark-400">
            <h2 className="text-2xl font-bold text-white mb-4">⏰ Visits by Hour</h2>
            <div className="flex items-end justify-between h-48 gap-1">
              {analytics?.byHour.map((count, hour) => {
                const maxHour = Math.max(...(analytics?.byHour || [1]));
                const height = maxHour > 0 ? (count / maxHour) * 100 : 0;
                return (
                  <div key={hour} className="flex-1 flex flex-col items-center gap-1">
                    <div
                      className="w-full bg-accent rounded-t transition-all hover:bg-accent/80"
                      style={{ height: `${height}%`, minHeight: count > 0 ? "4px" : "0" }}
                      title={`${hour}:00 - ${count} visits`}
                    />
                    <span className="text-xs text-light-100/60">{hour}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* By Day */}
          <div className="bg-dark-200 rounded-lg p-6 border border-dark-400">
            <h2 className="text-2xl font-bold text-white mb-4">📅 Visits by Day</h2>
            <div className="flex items-end justify-between h-48 gap-2">
              {analytics?.byDay.map((count, day) => {
                const maxDay = Math.max(...(analytics?.byDay || [1]));
                const height = maxDay > 0 ? (count / maxDay) * 100 : 0;
                return (
                  <div key={day} className="flex-1 flex flex-col items-center gap-1">
                    <div
                      className="w-full bg-accent rounded-t transition-all hover:bg-accent/80"
                      style={{ height: `${height}%`, minHeight: count > 0 ? "4px" : "0" }}
                      title={`${dayNames[day]} - ${count} visits`}
                    />
                    <span className="text-xs text-light-100/60">{dayNames[day]}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Recent Visits */}
        <div className="bg-dark-200 rounded-lg p-6 border border-dark-400 mb-8">
          <h2 className="text-2xl font-bold text-white mb-4">🕒 Recent Visits (Last 20)</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-dark-400">
                  <th className="py-3 px-4 text-light-100/60 font-semibold">Time</th>
                  <th className="py-3 px-4 text-light-100/60 font-semibold">Page</th>
                  <th className="py-3 px-4 text-light-100/60 font-semibold">Location</th>
                  <th className="py-3 px-4 text-light-100/60 font-semibold">Referrer</th>
                  <th className="py-3 px-4 text-light-100/60 font-semibold">Device</th>
                </tr>
              </thead>
              <tbody>
                {analytics && analytics.recentVisits.length > 0 ? (
                  analytics.recentVisits.slice(0, 20).map((visit) => (
                    <tr key={visit.id} className="border-b border-dark-400/50 hover:bg-dark-300/30">
                      <td className="py-3 px-4 text-light-100">
                        <div className="flex flex-col">
                          <span className="font-medium">{getRelativeTime(visit.timestamp)}</span>
                          <span className="text-xs text-light-100/60">
                            {new Date(visit.timestamp).toLocaleString()}
                          </span>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-light-100">{visit.page}</td>
                      <td className="py-3 px-4 text-light-100">
                        {visit.city}, {visit.country}
                      </td>
                      <td className="py-3 px-4 text-light-100 truncate max-w-xs">
                        {visit.referrer === "Direct" ? "Direct" : visit.referrer}
                      </td>
                      <td className="py-3 px-4 text-light-100 text-sm">
                        {visit.screenResolution} • {visit.language}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="py-8 text-center text-light-100/60">
                      No visits recorded yet
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Danger Zone */}
        <div className="bg-red-950/20 border-2 border-red-500/50 rounded-lg p-6">
          <h2 className="text-2xl font-bold text-red-400 mb-4">⚠️ Danger Zone</h2>
          <p className="text-light-100/80 mb-4">
            Clear all analytics data. This action cannot be undone.
          </p>
          {!showClearConfirm ? (
            <button
              onClick={() => setShowClearConfirm(true)}
              className="px-6 py-3 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition-colors"
            >
              Clear All Data
            </button>
          ) : (
            <div className="flex gap-3">
              <button
                onClick={handleClearMetrics}
                className="px-6 py-3 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition-colors"
              >
                Yes, Clear Everything
              </button>
              <button
                onClick={() => setShowClearConfirm(false)}
                className="px-6 py-3 bg-dark-400 text-white font-semibold rounded-lg hover:bg-dark-500 transition-colors"
              >
                Cancel
              </button>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
