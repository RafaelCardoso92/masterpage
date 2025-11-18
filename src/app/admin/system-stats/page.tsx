"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Navbar, Footer } from "../../../components";
import AdminNav from "../../../components/AdminNav";

interface DiskInfo {
  filesystem: string;
  size: string;
  used: string;
  available: string;
  usePercent: string;
  mountpoint: string;
}

interface SystemStats {
  cpu: {
    usage: number;
    cores: number;
    model: string;
  };
  memory: {
    total: string;
    used: string;
    free: string;
    usedPercent: number;
  };
  gpu: {
    name: string;
    memoryUsed: string;
    memoryTotal: string;
    memoryPercent: number;
    temperature: string;
    utilization: string;
  } | null;
  disks: DiskInfo[];
  warnings: string[];
}

export default function SystemStatsAdmin() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authLoading, setAuthLoading] = useState(true);
  const [stats, setStats] = useState<SystemStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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

  // Fetch system stats
  const fetchStats = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/admin/system-stats");

      if (!res.ok) {
        throw new Error("Failed to fetch system stats");
      }

      const data = await res.json();
      setStats(data);
      setError(null);
    } catch (err: any) {
      console.error("Error fetching stats:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchStats();
      // Refresh every 5 seconds
      const interval = setInterval(fetchStats, 5000);
      return () => clearInterval(interval);
    }
  }, [isAuthenticated]);

  const handleLogout = async () => {
    try {
      await fetch("/api/admin/auth", { method: "DELETE" });
      router.push("/admin/login");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const getUsageColor = (percent: number) => {
    if (percent >= 95) return "text-red-400";
    if (percent >= 85) return "text-orange-400";
    if (percent >= 70) return "text-yellow-400";
    return "text-green-400";
  };

  const getProgressBarColor = (percent: number) => {
    if (percent >= 95) return "bg-red-500";
    if (percent >= 85) return "bg-orange-500";
    if (percent >= 70) return "bg-yellow-500";
    return "bg-green-500";
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

  if (loading && !stats) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-dark-100">
        <div className="text-center">
          <div className="text-4xl mb-4 animate-spin">📊</div>
          <p className="text-white text-xl">Loading system stats...</p>
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

      <main className="container-custom pt-8 pb-20 px-4">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">System Monitor</h1>
            <p className="text-light-100/60">Real-time server resource usage and health</p>
          </div>
          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-dark-300 text-white font-semibold rounded-lg hover:bg-dark-400 transition-colors flex items-center gap-2 border border-dark-400"
          >
            <span>Logout</span>
            <span>🚪</span>
          </button>
        </div>

        {/* Warnings */}
        {stats && stats.warnings.length > 0 && (
          <div className="mb-6 px-6 py-4 rounded-lg border-2 bg-red-500/20 border-red-500">
            <div className="flex items-start gap-3">
              <span className="text-2xl">⚠️</span>
              <div className="flex-1">
                <p className="font-bold text-red-300 mb-2">System Warnings</p>
                {stats.warnings.map((warning, idx) => (
                  <p key={idx} className="text-sm text-red-200">• {warning}</p>
                ))}
              </div>
            </div>
          </div>
        )}

        {error && (
          <div className="mb-6 px-6 py-4 rounded-lg border-2 bg-red-500/20 border-red-500">
            <p className="text-red-300">Error: {error}</p>
          </div>
        )}

        {stats && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* CPU Usage */}
            <div className="bg-dark-200 rounded-lg p-6 border border-dark-400">
              <div className="flex items-center gap-3 mb-4">
                <span className="text-3xl">🖥️</span>
                <div>
                  <h2 className="text-xl font-bold text-white">CPU</h2>
                  <p className="text-sm text-light-100/60">{stats.cpu.cores} Cores</p>
                </div>
              </div>

              <div className="mb-4">
                <div className="flex justify-between mb-2">
                  <span className="text-light-100/80">Usage</span>
                  <span className={`font-bold ${getUsageColor(stats.cpu.usage)}`}>
                    {stats.cpu.usage.toFixed(1)}%
                  </span>
                </div>
                <div className="w-full bg-dark-300 rounded-full h-3">
                  <div
                    className={`h-3 rounded-full transition-all ${getProgressBarColor(stats.cpu.usage)}`}
                    style={{ width: `${Math.min(stats.cpu.usage, 100)}%` }}
                  />
                </div>
              </div>

              <p className="text-xs text-light-100/50 font-mono">{stats.cpu.model}</p>
            </div>

            {/* Memory Usage */}
            <div className="bg-dark-200 rounded-lg p-6 border border-dark-400">
              <div className="flex items-center gap-3 mb-4">
                <span className="text-3xl">💾</span>
                <div>
                  <h2 className="text-xl font-bold text-white">Memory</h2>
                  <p className="text-sm text-light-100/60">RAM</p>
                </div>
              </div>

              <div className="mb-4">
                <div className="flex justify-between mb-2">
                  <span className="text-light-100/80">Usage</span>
                  <span className={`font-bold ${getUsageColor(stats.memory.usedPercent)}`}>
                    {stats.memory.usedPercent}%
                  </span>
                </div>
                <div className="w-full bg-dark-300 rounded-full h-3">
                  <div
                    className={`h-3 rounded-full transition-all ${getProgressBarColor(stats.memory.usedPercent)}`}
                    style={{ width: `${Math.min(stats.memory.usedPercent, 100)}%` }}
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4 text-sm">
                <div>
                  <p className="text-light-100/60">Total</p>
                  <p className="text-white font-semibold">{stats.memory.total}</p>
                </div>
                <div>
                  <p className="text-light-100/60">Used</p>
                  <p className="text-white font-semibold">{stats.memory.used}</p>
                </div>
                <div>
                  <p className="text-light-100/60">Free</p>
                  <p className="text-white font-semibold">{stats.memory.free}</p>
                </div>
              </div>
            </div>

            {/* GPU Usage */}
            {stats.gpu && (
              <div className="bg-dark-200 rounded-lg p-6 border border-dark-400 lg:col-span-2">
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-3xl">🎮</span>
                  <div>
                    <h2 className="text-xl font-bold text-white">GPU</h2>
                    <p className="text-sm text-light-100/60">{stats.gpu.name}</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-light-100/80">Memory Usage</span>
                      <span className={`font-bold ${getUsageColor(stats.gpu.memoryPercent)}`}>
                        {stats.gpu.memoryPercent}%
                      </span>
                    </div>
                    <div className="w-full bg-dark-300 rounded-full h-3 mb-2">
                      <div
                        className={`h-3 rounded-full transition-all ${getProgressBarColor(stats.gpu.memoryPercent)}`}
                        style={{ width: `${Math.min(stats.gpu.memoryPercent, 100)}%` }}
                      />
                    </div>
                    <p className="text-sm text-light-100/60">
                      {stats.gpu.memoryUsed} / {stats.gpu.memoryTotal}
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-light-100/60 text-sm mb-1">Utilization</p>
                      <p className="text-white font-bold text-lg">{stats.gpu.utilization}</p>
                    </div>
                    <div>
                      <p className="text-light-100/60 text-sm mb-1">Temperature</p>
                      <p className="text-white font-bold text-lg">{stats.gpu.temperature}</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Disk Usage */}
            <div className="bg-dark-200 rounded-lg p-6 border border-dark-400 lg:col-span-2">
              <div className="flex items-center gap-3 mb-4">
                <span className="text-3xl">💿</span>
                <h2 className="text-xl font-bold text-white">Disk Usage</h2>
              </div>

              <div className="space-y-4">
                {stats.disks.map((disk, idx) => (
                  <div key={idx} className="border-b border-dark-400 pb-4 last:border-0 last:pb-0">
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <p className="text-white font-semibold">{disk.mountpoint}</p>
                        <p className="text-xs text-light-100/50 font-mono">{disk.filesystem}</p>
                      </div>
                      <span className={`font-bold ${getUsageColor(parseInt(disk.usePercent))}`}>
                        {disk.usePercent}
                      </span>
                    </div>

                    <div className="w-full bg-dark-300 rounded-full h-2 mb-2">
                      <div
                        className={`h-2 rounded-full transition-all ${getProgressBarColor(parseInt(disk.usePercent))}`}
                        style={{ width: disk.usePercent }}
                      />
                    </div>

                    <div className="grid grid-cols-3 gap-4 text-sm">
                      <div>
                        <p className="text-light-100/60">Total</p>
                        <p className="text-white">{disk.size}</p>
                      </div>
                      <div>
                        <p className="text-light-100/60">Used</p>
                        <p className="text-white">{disk.used}</p>
                      </div>
                      <div>
                        <p className="text-light-100/60">Available</p>
                        <p className="text-white">{disk.available}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        <div className="mt-6 text-center text-light-100/50 text-sm">
          <p>Updates every 5 seconds • Last update: {new Date().toLocaleTimeString()}</p>
        </div>
      </main>

      <Footer />
    </div>
  );
}
