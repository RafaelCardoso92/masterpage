"use client";

import { useState, useEffect } from "react";
import AdminNav from "../../../../components/AdminNav";

interface ChatFeature {
  id: string;
  featureKey: string;
  name: string;
  description?: string;
  enabledForPublic: boolean;
  enabledForRafael: boolean;
  category?: string;
}

export default function ChatFeaturesPage() {
  const [features, setFeatures] = useState<ChatFeature[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<string | null>(null);

  useEffect(() => {
    fetchFeatures();
  }, []);

  const fetchFeatures = async () => {
    try {
      const response = await fetch("/api/bella/features");
      const data = await response.json();
      setFeatures(data.features || []);
    } catch (error) {
      console.error("Error fetching features:", error);
    } finally {
      setLoading(false);
    }
  };

  const initializeFeatures = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/bella/features", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "initialize" }),
      });
      const data = await response.json();
      setFeatures(data.features || []);
    } catch (error) {
      console.error("Error initializing features:", error);
    } finally {
      setLoading(false);
    }
  };

  const toggleFeature = async (
    featureKey: string,
    field: "enabledForPublic" | "enabledForRafael",
    currentValue: boolean
  ) => {
    try {
      setUpdating(featureKey);
      const response = await fetch("/api/bella/features", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          featureKey,
          [field]: !currentValue,
        }),
      });

      if (response.ok) {
        // Update local state
        setFeatures(features.map(f =>
          f.featureKey === featureKey
            ? { ...f, [field]: !currentValue }
            : f
        ));
      }
    } catch (error) {
      console.error("Error updating feature:", error);
    } finally {
      setUpdating(null);
    }
  };

  const groupedFeatures = features.reduce((acc, feature) => {
    const category = feature.category || "Other";
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(feature);
    return acc;
  }, {} as Record<string, ChatFeature[]>);

  if (loading) {
    return (
      <div className="min-h-screen bg-dark-100">
        <AdminNav />
        <div className="max-w-6xl mx-auto p-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent mb-8">
            Loading...
          </h1>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-dark-100">
      <AdminNav />
      <div className="max-w-6xl mx-auto p-8">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent mb-2">
              Bella Chat Features
            </h1>
            <p className="text-purple-700">
              Manage which features are available to public users vs Rafael
            </p>
          </div>
          <button
            onClick={initializeFeatures}
            className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold rounded-lg hover:from-purple-600 hover:to-pink-600 transition-all shadow-lg"
          >
            Initialize Default Features
          </button>
        </div>

        {features.length === 0 ? (
          <div className="bg-white/60 backdrop-blur-sm rounded-3xl p-12 border-4 border-pink-200 text-center">
            <div className="text-6xl mb-4">✨</div>
            <p className="text-xl text-purple-700 mb-6">
              No features configured yet. Click "Initialize Default Features" to get started.
            </p>
          </div>
        ) : (
          <div className="space-y-8">
            {Object.entries(groupedFeatures).map(([category, categoryFeatures]) => (
              <div key={category} className="bg-white/60 backdrop-blur-sm rounded-3xl p-6 border-4 border-pink-200 shadow-xl">
                <h2 className="text-2xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent mb-6 capitalize">
                  {category}
                </h2>
                <div className="space-y-4">
                  {categoryFeatures.map((feature) => (
                    <div
                      key={feature.id}
                      className="bg-white rounded-2xl p-6 border-2 border-pink-100 hover:border-purple-200 transition-all"
                    >
                      <div className="flex items-start justify-between gap-6">
                        <div className="flex-1">
                          <h3 className="text-lg font-bold text-purple-900 mb-1">
                            {feature.name}
                          </h3>
                          {feature.description && (
                            <p className="text-sm text-purple-600 mb-4">
                              {feature.description}
                            </p>
                          )}
                          <code className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded">
                            {feature.featureKey}
                          </code>
                        </div>
                        <div className="flex gap-6">
                          {/* Public Users Toggle */}
                          <div className="flex flex-col items-center gap-2">
                            <span className="text-xs font-bold text-purple-700 uppercase">
                              Public Users
                            </span>
                            <button
                              onClick={() =>
                                toggleFeature(
                                  feature.featureKey,
                                  "enabledForPublic",
                                  feature.enabledForPublic
                                )
                              }
                              disabled={updating === feature.featureKey}
                              className={`relative w-14 h-8 rounded-full transition-all ${
                                feature.enabledForPublic
                                  ? "bg-green-500"
                                  : "bg-gray-300"
                              } ${
                                updating === feature.featureKey
                                  ? "opacity-50 cursor-not-allowed"
                                  : "cursor-pointer"
                              }`}
                            >
                              <div
                                className={`absolute top-1 left-1 w-6 h-6 bg-white rounded-full transition-transform ${
                                  feature.enabledForPublic
                                    ? "translate-x-6"
                                    : "translate-x-0"
                                }`}
                              />
                            </button>
                            <span className="text-xs font-medium text-purple-600">
                              {feature.enabledForPublic ? "Enabled" : "Disabled"}
                            </span>
                          </div>

                          {/* Rafael Toggle */}
                          <div className="flex flex-col items-center gap-2">
                            <span className="text-xs font-bold text-pink-700 uppercase">
                              Rafael
                            </span>
                            <button
                              onClick={() =>
                                toggleFeature(
                                  feature.featureKey,
                                  "enabledForRafael",
                                  feature.enabledForRafael
                                )
                              }
                              disabled={updating === feature.featureKey}
                              className={`relative w-14 h-8 rounded-full transition-all ${
                                feature.enabledForRafael
                                  ? "bg-pink-500"
                                  : "bg-gray-300"
                              } ${
                                updating === feature.featureKey
                                  ? "opacity-50 cursor-not-allowed"
                                  : "cursor-pointer"
                              }`}
                            >
                              <div
                                className={`absolute top-1 left-1 w-6 h-6 bg-white rounded-full transition-transform ${
                                  feature.enabledForRafael
                                    ? "translate-x-6"
                                    : "translate-x-0"
                                }`}
                              />
                            </button>
                            <span className="text-xs font-medium text-pink-600">
                              {feature.enabledForRafael ? "Enabled" : "Disabled"}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Legend */}
        <div className="mt-8 bg-white/60 backdrop-blur-sm rounded-2xl p-6 border-2 border-purple-200">
          <h3 className="text-lg font-bold text-purple-900 mb-4">Legend</h3>
          <div className="grid md:grid-cols-2 gap-4 text-sm">
            <div>
              <span className="font-bold text-purple-700">Public Users:</span>
              <p className="text-purple-600">
                Features available to anyone using Bella's chat (bella.rafaelcardoso.co.uk)
              </p>
            </div>
            <div>
              <span className="font-bold text-pink-700">Rafael:</span>
              <p className="text-pink-600">
                Features available to Rafael (identified by email: rafaell.cardoso.O.o@gmail.com)
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
