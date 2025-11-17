"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";

interface Metric {
  label: string;
  value: number;
  unit: string;
  max: number;
  color: string;
  icon: string;
}

const generateRealisticValue = (base: number, variance: number) => {
  return base + (Math.random() - 0.5) * variance;
};

export const LiveMetricsDashboard = () => {
  const [metrics, setMetrics] = useState<Metric[]>([
    { label: "CPU Usage", value: 25, unit: "%", max: 100, color: "#3b82f6", icon: "💻" },
    { label: "Memory", value: 42, unit: "%", max: 100, color: "#8b5cf6", icon: "🧠" },
    { label: "Network I/O", value: 150, unit: "MB/s", max: 1000, color: "#10b981", icon: "🌐" },
    { label: "Disk Usage", value: 84, unit: "%", max: 100, color: "#f59e0b", icon: "💾" },
    { label: "Active Containers", value: 26, unit: "", max: 30, color: "#06b6d4", icon: "🐳" },
    { label: "Requests/min", value: 845, unit: "", max: 2000, color: "#ec4899", icon: "📊" },
  ]);

  const [logs, setLogs] = useState<Array<{ time: string; message: string; type: string }>>([
    { time: "14:32:15", message: "Health check passed - All systems operational", type: "success" },
    { time: "14:32:10", message: "Database backup completed successfully", type: "info" },
    { time: "14:32:05", message: "SSL certificate renewed for *.rafaelcardoso.co.uk", type: "success" },
  ]);

  // Update metrics in real-time
  useEffect(() => {
    const interval = setInterval(() => {
      setMetrics((prev) =>
        prev.map((metric) => {
          let newValue = metric.value;

          switch (metric.label) {
            case "CPU Usage":
              newValue = generateRealisticValue(25, 10);
              break;
            case "Memory":
              newValue = generateRealisticValue(42, 5);
              break;
            case "Network I/O":
              newValue = generateRealisticValue(150, 100);
              break;
            case "Disk Usage":
              newValue = 84; // Static
              break;
            case "Active Containers":
              newValue = 26; // Static
              break;
            case "Requests/min":
              newValue = generateRealisticValue(845, 200);
              break;
          }

          return { ...metric, value: Math.max(0, Math.min(metric.max, newValue)) };
        })
      );
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  // Add new log entries periodically
  useEffect(() => {
    const logMessages = [
      { message: "Container watchtower updated caseanalyser-backend", type: "info" },
      { message: "RAID sync check completed - 100% healthy", type: "success" },
      { message: "Backup script executed successfully", type: "success" },
      { message: "Traefik certificate renewal in 30 days", type: "info" },
      { message: "Drive health check passed - No errors detected", type: "success" },
      { message: "Uptime milestone reached: 45 days", type: "success" },
    ];

    const interval = setInterval(() => {
      const randomMessage = logMessages[Math.floor(Math.random() * logMessages.length)];
      const now = new Date();
      const time = now.toTimeString().split(" ")[0];

      setLogs((prev) => [{ time, ...randomMessage }, ...prev.slice(0, 4)]);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const getBarColor = (value: number, max: number) => {
    const percentage = (value / max) * 100;
    if (percentage > 80) return "from-red-500 to-red-600";
    if (percentage > 60) return "from-orange-500 to-orange-600";
    if (percentage > 40) return "from-yellow-500 to-yellow-600";
    return "from-green-500 to-green-600";
  };

  return (
    <div className="w-full space-y-6">
      {/* Metrics Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {metrics.map((metric) => (
          <motion.div
            key={metric.label}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-dark-200/50 backdrop-blur-sm rounded-lg p-4 border border-white/10"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-light-100/60">{metric.label}</span>
              <span className="text-2xl">{metric.icon}</span>
            </div>
            <div className="text-2xl font-bold text-white mb-2">
              {metric.value.toFixed(metric.unit === "MB/s" ? 0 : 1)}
              <span className="text-sm text-light-100 ml-1">{metric.unit}</span>
            </div>

            {/* Animated Bar */}
            <div className="h-2 bg-white/5 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${(metric.value / metric.max) * 100}%` }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className={`h-full bg-gradient-to-r ${getBarColor(metric.value, metric.max)} rounded-full`}
              />
            </div>

            {/* Sparkline effect */}
            <div className="mt-2 flex items-end gap-0.5 h-8">
              {Array.from({ length: 20 }).map((_, i) => {
                const height = Math.random() * 100;
                return (
                  <motion.div
                    key={i}
                    initial={{ height: 0 }}
                    animate={{ height: `${height}%` }}
                    transition={{
                      duration: 0.3,
                      delay: i * 0.05,
                      repeat: Infinity,
                      repeatDelay: 2,
                    }}
                    className="flex-1 bg-gradient-to-t from-accent/30 to-accent/60 rounded-sm"
                  />
                );
              })}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Live Logs */}
      <div className="bg-dark-200/50 backdrop-blur-sm rounded-lg border border-white/10 overflow-hidden">
        <div className="bg-dark-100/50 px-4 py-3 border-b border-white/10 flex items-center justify-between">
          <span className="text-sm font-medium text-white">Live System Logs</span>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            <span className="text-xs text-light-100/60">Streaming</span>
          </div>
        </div>
        <div className="p-4 font-mono text-xs space-y-2 h-48 overflow-y-auto">
          {logs.map((log, index) => (
            <motion.div
              key={`${log.time}-${index}`}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3 }}
              className="flex items-start gap-3"
            >
              <span className="text-light-100/40 shrink-0">{log.time}</span>
              <span
                className={`${
                  log.type === "success"
                    ? "text-green-400"
                    : log.type === "error"
                    ? "text-red-400"
                    : "text-blue-400"
                }`}
              >
                {log.type === "success" ? "✓" : log.type === "error" ? "✗" : "ℹ"}
              </span>
              <span className="text-light-100">{log.message}</span>
            </motion.div>
          ))}
        </div>
      </div>

      {/* System Status */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-dark-200/50 backdrop-blur-sm rounded-lg p-4 border border-white/10 text-center">
          <div className="text-3xl mb-2">🟢</div>
          <div className="text-xs text-light-100/60 mb-1">System Status</div>
          <div className="text-sm font-semibold text-green-400">Operational</div>
        </div>
        <div className="bg-dark-200/50 backdrop-blur-sm rounded-lg p-4 border border-white/10 text-center">
          <div className="text-3xl mb-2">⚡</div>
          <div className="text-xs text-light-100/60 mb-1">Response Time</div>
          <div className="text-sm font-semibold text-white">45ms</div>
        </div>
        <div className="bg-dark-200/50 backdrop-blur-sm rounded-lg p-4 border border-white/10 text-center">
          <div className="text-3xl mb-2">🔒</div>
          <div className="text-xs text-light-100/60 mb-1">Security</div>
          <div className="text-sm font-semibold text-green-400">Secured</div>
        </div>
        <div className="bg-dark-200/50 backdrop-blur-sm rounded-lg p-4 border border-white/10 text-center">
          <div className="text-3xl mb-2">🚀</div>
          <div className="text-xs text-light-100/60 mb-1">Deployments</div>
          <div className="text-sm font-semibold text-white">127</div>
        </div>
      </div>
    </div>
  );
};
