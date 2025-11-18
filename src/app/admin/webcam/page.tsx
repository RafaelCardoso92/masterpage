"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Navbar, Footer } from "../../../components";
import AdminNav from "../../../components/AdminNav";

interface Snapshot {
  id: string;
  cameraEntity: string;
  imageUrl: string;
  analysis: string;
  detectedObjects: {
    people: number;
    packages: number;
    pets: number;
    vehicles: number;
  };
  motion: boolean;
  alert: boolean;
  alertType: string | null;
  createdAt: Date;
}

// Use local proxy API instead of calling Bella directly
const API_BASE = "/api";

export default function AdminWebcamPage() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authLoading, setAuthLoading] = useState(true);
  const [snapshots, setSnapshots] = useState<Snapshot[]>([]);
  const [loading, setLoading] = useState(false);
  const [liveSnapshot, setLiveSnapshot] = useState<string | null>(null);
  const [capturing, setCapturing] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [motionCheck, setMotionCheck] = useState(false);

  useEffect(() => {
    async function checkAuth() {
      try {
        const res = await fetch("/api/admin/auth");
        const data = await res.json();

        if (data.authenticated) {
          setIsAuthenticated(true);
          setAuthLoading(false);
          fetchRecentSnapshots();
        } else {
          router.push("/admin/login");
        }
      } catch (error) {
        router.push("/admin/login");
      }
    }
    checkAuth();
  }, [router]);

  const fetchRecentSnapshots = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_BASE}/webcam/motion`);
      const data = await res.json();

      if (data.success) {
        setSnapshots(data.recentMotion);
      }
    } catch (error) {
      console.error("Error fetching snapshots:", error);
    } finally {
      setLoading(false);
    }
  };

  const captureLiveSnapshot = async () => {
    try {
      setCapturing(true);
      const res = await fetch(`${API_BASE}/webcam/snapshot`);
      const data = await res.json();

      if (data.success) {
        setLiveSnapshot(data.image);
      }
    } catch (error) {
      console.error("Error capturing snapshot:", error);
    } finally {
      setCapturing(false);
    }
  };

  const analyzeCurrentView = async () => {
    try {
      setAnalyzing(true);
      const res = await fetch(`${API_BASE}/webcam/snapshot`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          analyze: true,
          saveToDb: true,
          context: "Manual admin check from rafaelcardoso.co.uk",
        }),
      });

      const data = await res.json();

      if (data.success) {
        setLiveSnapshot(data.snapshot.image);
        await fetchRecentSnapshots();
        alert(
          `Analysis: ${data.analysis.description}\n\nDetected:\nPeople: ${data.analysis.detected.people}\nPets: ${data.analysis.detected.pets}\nPackages: ${data.analysis.detected.packages}\nVehicles: ${data.analysis.detected.vehicles}`
        );
      }
    } catch (error) {
      console.error("Error analyzing:", error);
    } finally {
      setAnalyzing(false);
    }
  };

  const runMotionDetection = async () => {
    try {
      setMotionCheck(true);
      const res = await fetch(`${API_BASE}/webcam/motion`, {
        method: "POST",
      });

      const data = await res.json();

      if (data.success) {
        if (data.motionDetected) {
          alert(
            `Motion detected!\n\n${data.analysis.description}\n\nMemory created: ${data.memoryCreated ? "Yes" : "No"}`
          );
          await fetchRecentSnapshots();
        } else {
          alert("No motion detected");
        }
      }
    } catch (error) {
      console.error("Error running motion detection:", error);
    } finally {
      setMotionCheck(false);
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
          <div className="text-4xl mb-4 animate-pulse">📷</div>
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

      <main className="container-custom pt-8 pb-20 px-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">
              📷 Webcam Monitor
            </h1>
            <p className="text-light-100/60">Bella's eyes on the house</p>
          </div>
          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-dark-300 text-white font-semibold rounded-lg hover:bg-dark-400 transition-colors flex items-center gap-2 border border-dark-400"
          >
            <span>Logout</span>
            <span>🚪</span>
          </button>
        </div>

        {/* Live View */}
        <div className="bg-dark-200 border border-dark-400 rounded-lg p-6 mb-6">
          <h2 className="text-2xl font-bold text-white mb-4">Live View</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-black rounded-lg overflow-hidden aspect-video flex items-center justify-center">
              {liveSnapshot ? (
                <img
                  src={liveSnapshot}
                  alt="Live webcam snapshot"
                  className="w-full h-full object-contain"
                />
              ) : (
                <div className="text-white/50 text-center">
                  <div className="text-6xl mb-2">📷</div>
                  <p>No snapshot captured yet</p>
                </div>
              )}
            </div>
            <div className="flex flex-col gap-3">
              <button
                onClick={captureLiveSnapshot}
                disabled={capturing}
                className="px-6 py-4 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white font-semibold rounded-lg transition-all"
              >
                {capturing ? "📸 Capturing..." : "📸 Capture Snapshot"}
              </button>
              <button
                onClick={analyzeCurrentView}
                disabled={analyzing}
                className="px-6 py-4 bg-accent hover:bg-accent-dark disabled:bg-gray-600 text-white font-semibold rounded-lg transition-all"
              >
                {analyzing ? "🔍 Analyzing..." : "🔍 Capture & Analyze"}
              </button>
              <button
                onClick={runMotionDetection}
                disabled={motionCheck}
                className="px-6 py-4 bg-green-600 hover:bg-green-700 disabled:bg-gray-600 text-white font-semibold rounded-lg transition-all"
              >
                {motionCheck ? "🎯 Checking..." : "🎯 Run Motion Detection"}
              </button>
              <button
                onClick={fetchRecentSnapshots}
                disabled={loading}
                className="px-6 py-4 bg-dark-300 hover:bg-dark-400 border border-dark-400 text-white font-semibold rounded-lg transition-all"
              >
                {loading ? "🔄 Loading..." : "🔄 Refresh History"}
              </button>
            </div>
          </div>
        </div>

        {/* Recent Snapshots */}
        <div className="bg-dark-200 border border-dark-400 rounded-lg p-6">
          <h2 className="text-2xl font-bold text-white mb-6">
            Recent Motion Events ({snapshots.length})
          </h2>

          {loading ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4 animate-pulse">📷</div>
              <p className="text-white text-xl">Loading snapshots...</p>
            </div>
          ) : snapshots.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">📷</div>
              <p className="text-white text-xl">No motion events yet</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {snapshots.map((snapshot) => (
                <div
                  key={snapshot.id}
                  className={`bg-dark-300 rounded-lg overflow-hidden border-2 ${
                    snapshot.alert ? "border-red-500/50" : "border-dark-400"
                  }`}
                >
                  <div className="aspect-video bg-black">
                    <img
                      src={snapshot.imageUrl}
                      alt="Snapshot"
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <div className="p-4">
                    {snapshot.alert && (
                      <div className="mb-2 px-3 py-1 bg-red-500/20 border border-red-500/50 rounded-full inline-block">
                        <span className="text-red-200 text-xs font-semibold">
                          🚨 {snapshot.alertType?.toUpperCase()}
                        </span>
                      </div>
                    )}
                    <p className="text-white text-sm mb-3">
                      {snapshot.analysis}
                    </p>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      {snapshot.detectedObjects.people > 0 && (
                        <div className="bg-blue-500/20 px-2 py-1 rounded">
                          <span className="text-blue-200">
                            👤 {snapshot.detectedObjects.people} person
                            {snapshot.detectedObjects.people > 1 ? "s" : ""}
                          </span>
                        </div>
                      )}
                      {snapshot.detectedObjects.pets > 0 && (
                        <div className="bg-green-500/20 px-2 py-1 rounded">
                          <span className="text-green-200">
                            🐱 {snapshot.detectedObjects.pets} pet
                            {snapshot.detectedObjects.pets > 1 ? "s" : ""}
                          </span>
                        </div>
                      )}
                      {snapshot.detectedObjects.packages > 0 && (
                        <div className="bg-yellow-500/20 px-2 py-1 rounded">
                          <span className="text-yellow-200">
                            📦 {snapshot.detectedObjects.packages} package
                            {snapshot.detectedObjects.packages > 1 ? "s" : ""}
                          </span>
                        </div>
                      )}
                      {snapshot.detectedObjects.vehicles > 0 && (
                        <div className="bg-purple-500/20 px-2 py-1 rounded">
                          <span className="text-purple-200">
                            🚗 {snapshot.detectedObjects.vehicles} vehicle
                            {snapshot.detectedObjects.vehicles > 1 ? "s" : ""}
                          </span>
                        </div>
                      )}
                    </div>
                    <p className="text-light-100/50 text-xs mt-3">
                      {new Date(snapshot.createdAt).toLocaleString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
