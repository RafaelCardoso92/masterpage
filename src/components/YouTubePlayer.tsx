"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";

interface YouTubePlayerProps {
  videoId: string;
  title: string;
  artist: string;
  isActive: boolean;
  onReady?: () => void;
}

declare global {
  interface Window {
    YT: any;
    onYouTubeIframeAPIReady: () => void;
  }
}

export const YouTubePlayer = ({
  videoId,
  title,
  artist,
  isActive,
  onReady,
}: YouTubePlayerProps) => {
  const playerRef = useRef<any>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    // Load YouTube IFrame API
    if (!window.YT) {
      const tag = document.createElement("script");
      tag.src = "https://www.youtube.com/iframe_api";
      const firstScriptTag = document.getElementsByTagName("script")[0];
      firstScriptTag.parentNode?.insertBefore(tag, firstScriptTag);
    }

    return () => {
      if (playerRef.current) {
        playerRef.current.destroy();
      }
    };
  }, []);

  useEffect(() => {
    if (isActive && playerRef.current && !isPlaying) {
      playerRef.current.playVideo();
      setIsPlaying(true);
    } else if (!isActive && playerRef.current && isPlaying) {
      playerRef.current.pauseVideo();
      setIsPlaying(false);
    }
  }, [isActive, isPlaying]);

  return (
    <motion.div
      ref={containerRef}
      initial={{ opacity: 0 }}
      animate={{ opacity: isActive ? 1 : 0.3 }}
      transition={{ duration: 0.8, ease: "easeInOut" }}
      className="relative w-full"
    >
      <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-white/10">
        {/* Video Container */}
        <div className="relative aspect-video bg-dark-200">
          <iframe
            src={`https://www.youtube.com/embed/${videoId}?enablejsapi=1&controls=1&rel=0&modestbranding=1`}
            className="absolute inset-0 w-full h-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>

        {/* Song Info Overlay */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: isActive ? 1 : 0.5 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-dark via-dark/90 to-transparent p-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-2xl font-bold text-white mb-1">{title}</h3>
              <p className="text-light-100">{artist}</p>
            </div>
            <div className="flex items-center gap-2">
              {isActive && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="flex items-center gap-2 bg-accent/20 border border-accent/50 rounded-full px-4 py-2"
                >
                  <div className="flex gap-1">
                    <motion.div
                      animate={{ height: [8, 16, 8] }}
                      transition={{ duration: 0.6, repeat: Infinity }}
                      className="w-1 bg-accent rounded-full"
                    />
                    <motion.div
                      animate={{ height: [16, 8, 16] }}
                      transition={{ duration: 0.6, repeat: Infinity, delay: 0.1 }}
                      className="w-1 bg-accent rounded-full"
                    />
                    <motion.div
                      animate={{ height: [8, 16, 8] }}
                      transition={{ duration: 0.6, repeat: Infinity, delay: 0.2 }}
                      className="w-1 bg-accent rounded-full"
                    />
                  </div>
                  <span className="text-accent text-sm font-medium">Now Playing</span>
                </motion.div>
              )}
            </div>
          </div>
        </motion.div>

        {/* Glow Effect */}
        {isActive && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute -inset-0.5 bg-gradient-to-r from-accent/50 to-accent-dark/50 blur-xl -z-10"
          />
        )}
      </div>
    </motion.div>
  );
};
