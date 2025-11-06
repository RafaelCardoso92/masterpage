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
  const [startTime] = useState(Date.now());

  // Prevent scrolling while loading
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  useEffect(() => {
    const totalResources = imageUrls.length + audioUrls.length;
    let loadedResources = 0;

    const updateProgress = () => {
      loadedResources++;
      const percentage = Math.round((loadedResources / totalResources) * 100);
      setProgress(percentage);

      // Update loading text based on progress
      if (percentage < 25) {
        setLoadingText("Loading your vibe...");
      } else if (percentage < 50) {
        setLoadingText("Preparing artist images...");
      } else if (percentage < 75) {
        setLoadingText("Loading audio tracks...");
      } else if (percentage < 95) {
        setLoadingText("Almost ready...");
      } else {
        setLoadingText("Get ready to vibe! 🎧");
      }

      if (loadedResources === totalResources) {
        // Ensure minimum display time of 2 seconds for better UX
        const elapsedTime = Date.now() - startTime;
        const minDisplayTime = 2000;
        const remainingTime = Math.max(0, minDisplayTime - elapsedTime);

        setTimeout(() => {
          onLoadComplete();
        }, remainingTime + 500);
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
      transition={{ duration: 0.8 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-dark via-dark to-dark-200"
    >
      {/* Animated background particles */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-accent/20 rounded-full"
            initial={{
              x: Math.random() * window.innerWidth,
              y: Math.random() * window.innerHeight,
            }}
            animate={{
              y: [null, Math.random() * window.innerHeight],
              opacity: [0.2, 0.5, 0.2],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>

      <div className="max-w-md w-full px-8 relative z-10">
        {/* Music Note Icon with pulsing glow */}
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{
            scale: 1,
            rotate: 0,
          }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="relative text-6xl text-accent mb-8 text-center"
        >
          <motion.div
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.5, 0.8, 0.5],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="absolute inset-0 flex items-center justify-center"
          >
            <div className="w-20 h-20 bg-accent/30 rounded-full blur-2xl" />
          </motion.div>
          <motion.span
            animate={{
              rotate: [0, 10, -10, 0],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="relative inline-block"
          >
            🎵
          </motion.span>
        </motion.div>

        {/* Loading Text with fade animation */}
        <motion.p
          key={loadingText}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.5 }}
          className="text-light-100 text-center mb-8 text-lg font-medium"
        >
          {loadingText}
        </motion.p>

        {/* Progress Bar Container */}
        <div className="relative">
          {/* Background bar with glow */}
          <div className="h-3 bg-dark-100 rounded-full overflow-hidden relative">
            {/* Glowing shadow under progress bar */}
            <motion.div
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="absolute -inset-1 bg-accent/20 blur-md"
            />
            {/* Progress fill */}
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="h-full bg-gradient-to-r from-accent via-purple-500 to-accent rounded-full relative overflow-hidden"
            >
              {/* Animated shimmer effect */}
              <motion.div
                animate={{
                  x: ["-100%", "200%"],
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  ease: "linear",
                }}
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent"
              />
              {/* Pulsing glow on top */}
              <motion.div
                animate={{
                  opacity: [0.3, 0.6, 0.3],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent"
              />
            </motion.div>
          </div>

          {/* Percentage Text */}
          <motion.div className="flex items-center justify-center gap-2 mt-4">
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="text-accent text-center text-lg font-bold"
            >
              {progress}%
            </motion.p>
            <motion.span
              animate={{
                rotate: [0, 360],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "linear",
              }}
              className="text-accent text-sm"
            >
              ⏳
            </motion.span>
          </motion.div>
        </div>

        {/* Pulse animation circles */}
        {[...Array(3)].map((_, i) => (
          <motion.div
            key={i}
            animate={{
              scale: [1, 1.5, 1],
              opacity: [0.3, 0, 0.3],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut",
              delay: i * 1,
            }}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-accent pointer-events-none"
            style={{
              width: `${8 + i * 4}rem`,
              height: `${8 + i * 4}rem`,
            }}
          />
        ))}
      </div>
    </motion.div>
  );
};

export default VibeLoader;
