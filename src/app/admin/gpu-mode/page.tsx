"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Navbar, Footer } from "../../../components";
import AdminNav from "../../../components/AdminNav";

interface GPUMode {
  name: string;
  description: string;
  containers: {
    start: string[];
    stop: string[];
  };
}

interface ContainerState {
  name: string;
  running: boolean;
  hasGPU: boolean;
  status: string;
}

interface GPUStatus {
  currentMode: string;
  modes: Record<string, GPUMode>;
  trainingStatus: {
    isTraining: boolean;
    queueSize: number;
    gpuMemory?: string;
  };
  containerStates: Record<string, ContainerState>;
  health: {
    gpuAccessible: boolean;
    issues: string[];
  };
}

export default function GPUModeAdmin() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authLoading, setAuthLoading] = useState(true);
  const [gpuStatus, setGpuStatus] = useState<GPUStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [switching, setSwitching] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

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

  // Fetch GPU status
  const fetchGPUStatus = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/admin/gpu-mode");

      if (!res.ok) {
        throw new Error("Failed to fetch GPU status");
      }

      const data = await res.json();
      setGpuStatus(data);
    } catch (error: any) {
      console.error("Error fetching GPU status:", error);
      setMessage({ type: "error", text: `Failed to load GPU status: ${error.message}` });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchGPUStatus();
      // Refresh status every 10 seconds
      const interval = setInterval(fetchGPUStatus, 10000);
      return () => clearInterval(interval);
    }
  }, [isAuthenticated]);

  const switchMode = async (mode: string) => {
    if (!confirm(`Switch to ${gpuStatus?.modes[mode].name}?`)) return;

    setSwitching(true);
    setMessage(null);

    try {
      const res = await fetch("/api/admin/gpu-mode", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mode }),
      });

      const data = await res.json();

      if (res.ok) {
        setMessage({ type: "success", text: data.message });
        setTimeout(fetchGPUStatus, 2000);
      } else {
        setMessage({ type: "error", text: data.error || "Failed to switch mode" });
      }
    } catch (error: any) {
      setMessage({ type: "error", text: `Failed to switch mode: ${error.message}` });
    } finally {
      setSwitching(false);
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

  if (loading && !gpuStatus) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-dark-100">
        <div className="text-center">
          <div className="text-4xl mb-4 animate-spin">🎮</div>
          <p className="text-white text-xl">Loading GPU status...</p>
        </div>
      </div>
    );
  }

  const getModeIcon = (mode: string) => {
    switch (mode) {
      case "bella": return "🤖";
      case "training": return "🎨";
      case "gaming": return "🎮";
      default: return "⚙️";
    }
  };

  const getModeColor = (mode: string) => {
    switch (mode) {
      case "bella": return "from-blue-500 to-purple-500";
      case "training": return "from-pink-500 to-orange-500";
      case "gaming": return "from-green-500 to-cyan-500";
      default: return "from-gray-500 to-gray-700";
    }
  };

  const getContainerStatusColor = (status: string) => {
    if (status.startsWith("Up")) return "text-green-400";
    if (status.startsWith("Exited")) return "text-gray-400";
    return "text-yellow-400";
  };

  return (
    <div className="min-h-screen bg-dark-100">
      <Navbar />
      <div className="pt-20">
        <AdminNav />
      </div>

      <main className="container-custom pt-8 pb-20 px-4">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">GPU Mode Control</h1>
            <p className="text-light-100/60">Manage GPU resource allocation for different tasks</p>
          </div>
          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-dark-300 text-white font-semibold rounded-lg hover:bg-dark-400 transition-colors flex items-center gap-2 border border-dark-400"
          >
            <span>Logout</span>
            <span>🚪</span>
          </button>
        </div>

        {/* Health Status Warning */}
        {gpuStatus && !gpuStatus.health.gpuAccessible && (
          <div className="mb-6 px-6 py-4 rounded-lg border-2 bg-yellow-500/20 border-yellow-500 text-yellow-300">
            <div className="flex items-start gap-3">
              <span className="text-2xl">⚠️</span>
              <div className="flex-1">
                <p className="font-bold mb-1">GPU Access Issues Detected</p>
                {gpuStatus.health.issues.map((issue, idx) => (
                  <p key={idx} className="text-sm">{issue}</p>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Status Message */}
        {message && (
          <div className={`mb-6 px-6 py-4 rounded-lg border-2 ${
            message.type === "success"
              ? "bg-green-500/20 border-green-500 text-green-300"
              : "bg-red-500/20 border-red-500 text-red-300"
          }`}>
            <p className="font-semibold">{message.text}</p>
          </div>
        )}

        {/* Current Mode Display */}
        <div className="mb-8 bg-gradient-to-r from-dark-200 to-dark-300 p-6 rounded-lg border border-accent/30">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="text-6xl">{getModeIcon(gpuStatus?.currentMode || "bella")}</div>
              <div>
                <p className="text-light-100/60 text-sm mb-1">Current Mode</p>
                <h2 className="text-3xl font-bold text-white">
                  {gpuStatus?.modes[gpuStatus.currentMode]?.name || "Unknown"}
                </h2>
                <p className="text-light-100/80 mt-1">
                  {gpuStatus?.modes[gpuStatus.currentMode]?.description}
                </p>
              </div>
            </div>
            <div className="text-right">
              <div className="px-4 py-2 bg-accent/20 rounded-lg border border-accent">
                <p className="text-accent font-bold">Active</p>
              </div>
            </div>
          </div>
        </div>

        {/* Mode Selection */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {gpuStatus && Object.entries(gpuStatus.modes).map(([key, mode]) => {
            const isCurrentMode = key === gpuStatus.currentMode;

            return (
              <div
                key={key}
                className={`relative bg-dark-200 rounded-lg overflow-hidden transition-all ${
                  isCurrentMode
                    ? "ring-2 ring-accent shadow-xl shadow-accent/20"
                    : "hover:shadow-lg"
                }`}
              >
                <div className={`h-2 bg-gradient-to-r ${getModeColor(key)}`} />

                <div className="p-6">
                  <div className="text-5xl mb-4">{getModeIcon(key)}</div>

                  <h3 className="text-2xl font-bold text-white mb-2">{mode.name}</h3>
                  <p className="text-light-100/70 mb-4">{mode.description}</p>

                  <div className="mb-4 text-sm">
                    {mode.containers.start.length > 0 && (
                      <div className="mb-2">
                        <p className="text-green-400 font-semibold mb-1">Running:</p>
                        <ul className="text-light-100/60 space-y-1">
                          {mode.containers.start.map(container => (
                            <li key={container} className="truncate">• {container}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                    {mode.containers.stop.length > 0 && (
                      <div>
                        <p className="text-red-400 font-semibold mb-1">Stopped:</p>
                        <ul className="text-light-100/60 space-y-1">
                          {mode.containers.stop.map(container => (
                            <li key={container} className="truncate">• {container}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>

                  <button
                    onClick={() => switchMode(key)}
                    disabled={isCurrentMode || switching}
                    className={`w-full px-6 py-3 rounded-lg font-semibold transition-all ${
                      isCurrentMode
                        ? "bg-accent/20 text-accent cursor-not-allowed"
                        : "bg-accent text-white hover:bg-accent/80"
                    } ${switching ? "opacity-50 cursor-not-allowed" : ""}`}
                  >
                    {switching ? "Switching..." : isCurrentMode ? "Active" : `Switch to ${mode.name}`}
                  </button>
                </div>

                {isCurrentMode && (
                  <div className="absolute top-4 right-4">
                    <span className="px-3 py-1 bg-accent text-white text-xs font-bold rounded-full">
                      ACTIVE
                    </span>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Container Status Table */}
        <div className="bg-dark-200 rounded-lg p-6">
          <h3 className="text-2xl font-bold text-white mb-4">Container Status</h3>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-dark-400">
                  <th className="text-left py-3 px-4 text-light-100 font-semibold">Container</th>
                  <th className="text-left py-3 px-4 text-light-100 font-semibold">Status</th>
                  <th className="text-left py-3 px-4 text-light-100 font-semibold">GPU</th>
                </tr>
              </thead>
              <tbody>
                {gpuStatus && Object.entries(gpuStatus.containerStates)
                  .filter(([name]) => name.startsWith('chanceapp-') || name === 'plex')
                  .map(([name, state]) => (
                    <tr key={name} className="border-b border-dark-400/50">
                      <td className="py-3 px-4 text-white font-mono text-sm">{name}</td>
                      <td className={`py-3 px-4 font-semibold ${getContainerStatusColor(state.status)}`}>
                        {state.running ? '✓ Running' : `✗ ${state.status}`}
                      </td>
                      <td className="py-3 px-4">
                        {state.hasGPU ? (
                          <span className="px-2 py-1 bg-green-500/20 text-green-300 rounded text-xs font-semibold">
                            ✓ GPU
                          </span>
                        ) : (
                          <span className="px-2 py-1 bg-red-500/20 text-red-300 rounded text-xs font-semibold">
                            ✗ No GPU
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Training Status (if in training mode) */}
        {gpuStatus?.currentMode === "training" && (
          <div className="mt-6 bg-gradient-to-r from-pink-500/10 to-orange-500/10 border border-pink-500/30 rounded-lg p-6">
            <h3 className="text-xl font-bold text-white mb-2">Training Status</h3>
            <p className="text-light-100/70">
              {gpuStatus.trainingStatus.isTraining
                ? "Training in progress..."
                : "No active training detected"}
            </p>
            {gpuStatus.trainingStatus.gpuMemory && (
              <p className="text-sm text-light-100/70 mt-2">
                <span className="font-semibold">GPU Memory:</span> {gpuStatus.trainingStatus.gpuMemory}
              </p>
            )}
            {gpuStatus.trainingStatus.isTraining && (
              <p className="text-sm text-light-100/50 mt-2">
                ⚡ Will automatically switch back to Bella Mode when training completes
              </p>
            )}
          </div>
        )}

        {/* Gaming Optimizations (if in gaming mode) */}
        {gpuStatus?.currentMode === "gaming" && (
          <div className="mt-6 space-y-6">
            <div className="bg-gradient-to-r from-green-500/10 to-cyan-500/10 border border-green-500/30 rounded-lg p-6">
              <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <span>⚡</span>
                Performance Optimizations Active
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div className="bg-dark-300/50 rounded-lg p-4">
                  <h4 className="text-sm font-semibold text-green-400 mb-2">🖥️ CPU</h4>
                  <ul className="text-sm text-light-100/70 space-y-1">
                    <li>✓ Performance governor enabled</li>
                    <li>✓ Turbo Boost active (no throttling)</li>
                    <li>✓ All cores max frequency</li>
                  </ul>
                </div>

                <div className="bg-dark-300/50 rounded-lg p-4">
                  <h4 className="text-sm font-semibold text-green-400 mb-2">🎮 GPU</h4>
                  <ul className="text-sm text-light-100/70 space-y-1">
                    <li>✓ Max performance mode (220W)</li>
                    <li>✓ Persistence mode enabled</li>
                    <li>✓ No adaptive throttling</li>
                  </ul>
                </div>

                <div className="bg-dark-300/50 rounded-lg p-4">
                  <h4 className="text-sm font-semibold text-green-400 mb-2">⚙️ System</h4>
                  <ul className="text-sm text-light-100/70 space-y-1">
                    <li>✓ Display compositor disabled</li>
                    <li>✓ I/O scheduler optimized</li>
                    <li>✓ VRR/G-SYNC enabled</li>
                  </ul>
                </div>

                <div className="bg-dark-300/50 rounded-lg p-4">
                  <h4 className="text-sm font-semibold text-green-400 mb-2">📊 Expected Boost</h4>
                  <ul className="text-sm text-light-100/70 space-y-1">
                    <li>• CPU: +5-10% FPS</li>
                    <li>• GPU: +10-15% FPS</li>
                    <li>• Total: 15-25% boost</li>
                  </ul>
                </div>
              </div>

              <div className="bg-cyan-500/10 border border-cyan-500/30 rounded-lg p-4 mt-4">
                <h4 className="text-sm font-semibold text-cyan-300 mb-2">💡 Pro Tips for 4K 120fps:</h4>
                <ul className="text-sm text-light-100/70 space-y-2">
                  <li>
                    <span className="font-semibold text-white">Use Gamescope for FSR upscaling:</span>
                    <code className="block bg-dark-400 px-3 py-2 rounded mt-1 text-xs overflow-x-auto">
                      gamescope -W 3840 -H 2160 -w 1920 -h 1080 --fsr-upscaling -r 120 -- &lt;game&gt;
                    </code>
                    <span className="text-xs text-light-100/50">Renders at 1080p, upscales to 4K with FSR (+50-70% FPS)</span>
                  </li>
                  <li>
                    <span className="font-semibold text-white">Combine with GameMode:</span>
                    <code className="block bg-dark-400 px-3 py-2 rounded mt-1 text-xs overflow-x-auto">
                      gamemoderun gamescope -W 3840 -H 2160 -w 1920 -h 1080 --fsr-upscaling -r 120 -- %command%
                    </code>
                  </li>
                  <li className="text-xs text-light-100/50">
                    • Enable native DLSS/FSR in game settings when available<br/>
                    • Use quality mode for best visual fidelity<br/>
                    • Expect 60-120fps in most AAA games at 4K with upscaling
                  </li>
                </ul>
              </div>
            </div>

            {/* PS5 Controller Setup */}
            <div className="bg-gradient-to-r from-purple-500/10 to-blue-500/10 border border-purple-500/30 rounded-lg p-6">
              <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <span>🎮</span>
                PS5 DualSense Controller Setup
              </h3>

              <div className="space-y-4">
                <div className="bg-dark-300/50 rounded-lg p-4">
                  <h4 className="text-sm font-semibold text-purple-400 mb-2">Connection Methods</h4>
                  <div className="space-y-3 text-sm text-light-100/70">
                    <div>
                      <p className="font-semibold text-white mb-1">Option 1: Bluetooth (Wireless)</p>
                      <ol className="list-decimal list-inside space-y-1 ml-2">
                        <li>Hold PS + Share buttons until light bar flashes blue</li>
                        <li>Open Bluetooth settings and select "Wireless Controller"</li>
                        <li>Controller will connect automatically in the future</li>
                      </ol>
                    </div>

                    <div>
                      <p className="font-semibold text-white mb-1">Option 2: USB-C (Wired - Lower Latency)</p>
                      <ol className="list-decimal list-inside space-y-1 ml-2">
                        <li>Connect controller via USB-C cable</li>
                        <li>Works immediately, no setup required</li>
                        <li>Recommended for competitive gaming (lower input lag)</li>
                      </ol>
                    </div>
                  </div>
                </div>

                <div className="bg-dark-300/50 rounded-lg p-4">
                  <h4 className="text-sm font-semibold text-purple-400 mb-2">Features on Linux</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm text-light-100/70">
                    <div>
                      <p className="font-semibold text-green-400 mb-1">✓ Fully Supported:</p>
                      <ul className="space-y-1 ml-2">
                        <li>• All buttons and triggers</li>
                        <li>• Touchpad (as mouse/button)</li>
                        <li>• Motion controls (gyro/accel)</li>
                        <li>• Battery status</li>
                      </ul>
                    </div>
                    <div>
                      <p className="font-semibold text-yellow-400 mb-1">⚠️ Partially Supported:</p>
                      <ul className="space-y-1 ml-2">
                        <li>• Haptic feedback (basic rumble)</li>
                        <li>• Adaptive triggers (via DSU)</li>
                        <li>• LED light bar (limited control)</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="bg-dark-300/50 rounded-lg p-4">
                  <h4 className="text-sm font-semibold text-purple-400 mb-2">Steam Configuration</h4>
                  <ol className="list-decimal list-inside space-y-2 text-sm text-light-100/70 ml-2">
                    <li>Open Steam → Settings → Controller → General Controller Settings</li>
                    <li>Enable "PlayStation Configuration Support"</li>
                    <li>Recommended: Enable "Use Nintendo Button Layout" for proper button labels</li>
                    <li>Test in Big Picture Mode controller test</li>
                  </ol>
                </div>

                <div className="bg-cyan-500/10 border border-cyan-500/30 rounded-lg p-3">
                  <p className="text-sm text-cyan-300">
                    <span className="font-semibold">💡 Pro tip:</span> For best compatibility and features, use wired USB-C connection.
                    The controller is instantly recognized and has ~2-3ms lower input lag vs Bluetooth.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
