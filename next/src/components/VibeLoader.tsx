"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";

interface VibeLoaderProps {
  onLoadComplete: () => void;
  imageUrls: string[];
  audioUrls: string[];
}

const VibeLoader = ({ onLoadComplete, imageUrls, audioUrls }: VibeLoaderProps) => {
  const [progress, setProgress] = useState(0);
  const [loadingText, setLoadingText] = useState("Loading your vibe...");

  useEffect(() => {
    const totalResources = imageUrls.length + audioUrls.length;
    let loadedResources = 0;

    const updateProgress = () => {
      loadedResources++;
      const percentage = Math.round((loadedResources / totalResources) * 100);
      setProgress(percentage);

      // Update loading text based on progress
      if (percentage < 30) {
        setLoadingText("Loading your vibe...");
      } else if (percentage < 60) {
        setLoadingText("Preparing artist images...");
      } else if (percentage < 90) {
        setLoadingText("Loading audio tracks...");
      } else {
        setLoadingText("Almost ready...");
      }

      if (loadedResources === totalResources) {
        setTimeout(() => {
          onLoadComplete();
        }, 500);
      }
    };

    // Preload images
    const imagePromises = imageUrls.map((url) => {
      return new Promise((resolve) => {
        const img = new Image();
        img.onload = () => {
          updateProgress();
          resolve(null);
        };
        img.onerror = () => {
          updateProgress();
          resolve(null);
        };
        img.src = url;
      });
    });

    // Preload audio
    const audioPromises = audioUrls.map((url) => {
      return new Promise((resolve) => {
        const audio = new Audio();
        audio.addEventListener("canplaythrough", () => {
          updateProgress();
          resolve(null);
        });
        audio.addEventListener("error", () => {
          updateProgress();
          resolve(null);
        });
        audio.src = url;
      });
    });

    Promise.all([...imagePromises, ...audioPromises]);
  }, [imageUrls, audioUrls, onLoadComplete]);

  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-dark"
    >
      <div className="max-w-md w-full px-8">
        {/* Music Note Icon */}
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-6xl text-accent mb-8 text-center"
        >
          🎵
        </motion.div>

        {/* Loading Text */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-light-100 text-center mb-8 text-lg"
        >
          {loadingText}
        </motion.p>

        {/* Progress Bar Container */}
        <div className="relative">
          {/* Background bar */}
          <div className="h-2 bg-dark-100 rounded-full overflow-hidden">
            {/* Progress fill */}
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="h-full bg-gradient-to-r from-accent via-accent to-accent/80 rounded-full relative"
            >
              {/* Animated glow effect */}
              <motion.div
                animate={{
                  x: ["-100%", "200%"],
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  ease: "linear",
                }}
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
              />
            </motion.div>
          </div>

          {/* Percentage Text */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-light-200 text-center mt-4 text-sm font-medium"
          >
            {progress}%
          </motion.p>
        </div>

        {/* Pulse animation around music note */}
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.5, 0, 0.5],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 rounded-full border-2 border-accent pointer-events-none"
        />
      </div>
    </motion.div>
  );
};

export default VibeLoader;
