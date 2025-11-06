"use client";

import { useEffect, useRef, useState, memo, useCallback } from "react";
import { motion, useInView, useScroll, useTransform, AnimatePresence } from "framer-motion";
import Image from "next/image";

interface Track {
  id: string;
  title: string;
  artist: string;
  audioPath: string;
  color: string;
  mood: string;
  description: string;
  youtubeUrl: string;
  artistImage?: string;
  artistImages?: string[];
  isFavorite?: boolean;
}

interface ScrollMusicPlayerProps {
  track: Track;
  isActive: boolean;
  index: number;
  onBecomeActive: () => void;
}

const ScrollMusicPlayerComponent = ({ track, isActive, index, onBecomeActive }: ScrollMusicPlayerProps) => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.7);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isManuallyPaused, setIsManuallyPaused] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { margin: "-30% 0px -30% 0px", once: false });

  // Only create scroll listener when in view for performance
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
    layoutEffect: false, // Use useEffect instead of useLayoutEffect for better performance
  });

  // Smooth fade in/out with longer "fully visible" period (60% vs 40%) for better UX
  const backgroundOpacity = useTransform(
    scrollYProgress,
    [0, 0.2, 0.8, 1],
    [0, 1, 1, 0],
    { clamp: true }
  );

  // Subtle parallax effect for depth
  const backgroundY = useTransform(scrollYProgress, [0, 1], ["0%", "10%"]);

  // Gentle zoom effect as you scroll through for visual interest
  const backgroundScale = useTransform(scrollYProgress, [0, 0.5, 1], [1.05, 1, 1.05]);

  // Detect when this section is in the center of the viewport and make it active
  useEffect(() => {
    if (!containerRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          // If more than 40% of this section is visible, make it active
          if (entry.isIntersecting && entry.intersectionRatio > 0.4) {
            onBecomeActive();
          }
        });
      },
      {
        threshold: [0, 0.2, 0.4, 0.6, 0.8, 1.0],
        rootMargin: "-20% 0px -20% 0px", // Section needs to be near center
      }
    );

    observer.observe(containerRef.current);

    return () => {
      observer.disconnect();
    };
  }, [onBecomeActive]);

  // Handle fade in/out based on scroll position
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    let fadeInterval: NodeJS.Timeout;

    // Immediately pause all other songs when this one becomes active
    if (isActive && isInView && !isManuallyPaused) {
      // Pause all other audio elements immediately (mobile-friendly)
      const allAudioElements = document.querySelectorAll("audio");
      allAudioElements.forEach((otherAudio) => {
        if (otherAudio !== audio && !otherAudio.paused) {
          // Fast fade out for mobile
          const fadeOut = () => {
            if (otherAudio.volume > 0.1) {
              otherAudio.volume = Math.max(0, otherAudio.volume - 0.2);
              requestAnimationFrame(fadeOut);
            } else {
              otherAudio.volume = 0;
              otherAudio.pause();
            }
          };
          fadeOut();
        }
      });
    }

    // Only auto-play if not manually paused
    if (isInView && isActive && !isManuallyPaused) {
      // Fade in
      audio.volume = 0;

      // Try to play with better error handling
      const playPromise = audio.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            // Auto-play started successfully
            setIsPlaying(true);

            let currentVol = 0;
            const targetVolume = volume;

            fadeInterval = setInterval(() => {
              currentVol += 0.05;
              if (currentVol >= targetVolume) {
                currentVol = targetVolume;
                clearInterval(fadeInterval);
              }
              if (audio) {
                audio.volume = currentVol;
              }
            }, 50);
          })
          .catch((error) => {
            // Auto-play was prevented (browser restriction)
            // User needs to interact first
            console.log("Auto-play prevented, waiting for user interaction:", error);

            // Set up one-time click handler to enable playback
            const enableAudio = () => {
              audio.play().then(() => {
                setIsPlaying(true);

                let currentVol = 0;
                const targetVolume = volume;

                fadeInterval = setInterval(() => {
                  currentVol += 0.05;
                  if (currentVol >= targetVolume) {
                    currentVol = targetVolume;
                    clearInterval(fadeInterval);
                  }
                  if (audio) {
                    audio.volume = currentVol;
                  }
                }, 50);

                document.removeEventListener("click", enableAudio);
                document.removeEventListener("touchstart", enableAudio);
              });
            };

            document.addEventListener("click", enableAudio, { once: true });
            document.addEventListener("touchstart", enableAudio, { once: true });
          });
      }
    } else if (isPlaying && (!isInView || !isActive || isManuallyPaused)) {
      // Faster fade out for better mobile experience (30ms vs 50ms)
      let currentVol = audio.volume;

      fadeInterval = setInterval(() => {
        currentVol -= 0.1; // Faster fade (0.1 vs 0.05)
        if (currentVol <= 0) {
          currentVol = 0;
          clearInterval(fadeInterval);
          if (audio) {
            audio.pause();
            setIsPlaying(false);
          }
        }
        if (audio) {
          audio.volume = currentVol;
        }
      }, 30); // Faster interval (30ms vs 50ms)
    }

    return () => {
      if (fadeInterval) clearInterval(fadeInterval);
    };
  }, [isInView, isActive, volume, isPlaying, isManuallyPaused]);

  // Update time
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateTime = () => setCurrentTime(audio.currentTime);
    const updateDuration = () => {
      setDuration(audio.duration);
      // Start audio at 1/5th (20%) of the song
      if (audio.duration && audio.currentTime === 0) {
        audio.currentTime = audio.duration / 5;
      }
    };

    audio.addEventListener("timeupdate", updateTime);
    audio.addEventListener("loadedmetadata", updateDuration);

    return () => {
      audio.removeEventListener("timeupdate", updateTime);
      audio.removeEventListener("loadedmetadata", updateDuration);
    };
  }, []);

  // Cycle through artist images
  useEffect(() => {
    if (!track.artistImages || track.artistImages.length <= 1 || !isInView) return;

    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % track.artistImages!.length);
    }, 12000); // Change image every 12 seconds

    return () => clearInterval(interval);
  }, [isInView, track.artistImages]);

  const formatTime = useCallback((time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  }, []);

  const handleSeek = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const time = parseFloat(e.target.value);
    if (audioRef.current) {
      audioRef.current.currentTime = time;
      setCurrentTime(time);
    }
  }, []);

  const togglePlay = useCallback(() => {
    if (audioRef.current) {
      if (isPlaying) {
        // User manually paused
        audioRef.current.pause();
        setIsPlaying(false);
        setIsManuallyPaused(true);
      } else {
        // User manually resumed - clear the manual pause flag
        audioRef.current.play();
        setIsPlaying(true);
        setIsManuallyPaused(false);
      }
    }
  }, [isPlaying]);

  const handleVolumeChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const vol = parseFloat(e.target.value);
    setVolume(vol);
    if (audioRef.current) {
      audioRef.current.volume = vol;
    }
  }, []);

  return (
    <motion.div
      ref={containerRef}
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{
        opacity: isInView ? 1 : 0.1,
        scale: isInView ? 1 : 0.95,
      }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="relative min-h-screen sm:min-h-[120vh] md:min-h-[140vh] flex items-center justify-center px-3 sm:px-4 overflow-hidden"
      style={{ willChange: isInView ? "transform" : "auto" }}
    >
      {/* Background Image - Absolute positioning for better performance */}
      {(track.artistImages || track.artistImage) && isInView && (
        <motion.div
          className="absolute inset-0 z-0 pointer-events-none"
          style={{
            opacity: backgroundOpacity,
            y: backgroundY,
            scale: backgroundScale,
            willChange: "opacity, transform",
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <div className="relative w-full h-full pointer-events-none">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentImageIndex}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 1.5, ease: "easeInOut" }}
                className="absolute inset-0"
              >
                <Image
                  src={track.artistImages?.[currentImageIndex] || track.artistImage || ""}
                  alt={track.artist}
                  fill
                  className="object-cover"
                  priority={index === 0}
                  loading={index === 0 ? "eager" : "lazy"}
                  quality={75}
                  sizes="100vw"
                />
              </motion.div>
            </AnimatePresence>
          </div>
        </motion.div>
      )}

      <div className="max-w-4xl w-full relative z-10">
        {/* Audio Element with metadata preload for better autoplay */}
        <audio
          ref={audioRef}
          src={track.audioPath}
          loop
          preload={index < 3 ? "auto" : "metadata"}
          playsInline
        />

        {/* Player Card */}
        <div className="relative">
          {/* Favorite Track - Extra Pulsing Glow */}
          {track.isFavorite && isInView && (
            <>
              <motion.div
                animate={{
                  opacity: [0.4, 0.8, 0.4],
                  scale: [1, 1.05, 1],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="absolute -inset-8 sm:-inset-12 md:-inset-16 rounded-3xl blur-3xl pointer-events-none"
                style={{
                  background: `radial-gradient(circle, ${track.color}80 0%, ${track.color}40 50%, transparent 100%)`,
                  willChange: "opacity, transform",
                }}
              />
              <motion.div
                animate={{
                  opacity: [0.2, 0.5, 0.2],
                  rotate: [0, 360],
                }}
                transition={{
                  duration: 8,
                  repeat: Infinity,
                  ease: "linear",
                }}
                className="absolute -inset-12 rounded-3xl pointer-events-none"
                style={{
                  background: `conic-gradient(from 0deg, transparent 0%, ${track.color}60 25%, transparent 50%, ${track.color}60 75%, transparent 100%)`,
                  filter: "blur(40px)",
                  willChange: "opacity, transform",
                }}
              />
            </>
          )}
          {/* Background Glow - Simplified for performance */}
          {isInView && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: track.isFavorite ? 0.5 : 0.3 }}
              transition={{ duration: 1 }}
              className="absolute -inset-4 sm:-inset-6 md:-inset-8 rounded-3xl blur-2xl pointer-events-none"
              style={{
                backgroundColor: track.color,
                willChange: "opacity",
              }}
            />
          )}

          {/* Main Card */}
          <div
            className={`relative bg-dark-200/80 backdrop-blur-sm rounded-2xl sm:rounded-3xl overflow-hidden shadow-2xl ${
              track.isFavorite ? 'border-2' : 'border border-white/10'
            }`}
            style={track.isFavorite ? {
              borderColor: track.color,
              boxShadow: `0 0 40px ${track.color}80, 0 0 80px ${track.color}40`,
            } : undefined}
          >
            {/* Album Art Area */}
            <div
              className="relative h-64 sm:h-80 md:h-96 flex items-center justify-center"
              style={{
                background: `linear-gradient(135deg, ${track.color}20 0%, transparent 100%)`,
              }}
            >
              <motion.div
                animate={{
                  scale: isInView ? [1, 1.05, 1] : 1,
                  rotate: isInView && isPlaying ? [0, 360] : 0,
                }}
                transition={{
                  scale: { duration: 3, repeat: isInView ? Infinity : 0, ease: "easeInOut" },
                  rotate: { duration: 20, repeat: isInView && isPlaying ? Infinity : 0, ease: "linear" },
                }}
                className="w-40 h-40 sm:w-52 sm:h-52 md:w-64 md:h-64 rounded-full flex items-center justify-center border-2 sm:border-4"
                style={{
                  borderColor: track.color,
                  backgroundColor: `${track.color}40`,
                  willChange: isInView && isPlaying ? "transform" : "auto",
                }}
              >
                <div className="text-5xl sm:text-7xl md:text-8xl">{isPlaying ? "🎵" : "🎧"}</div>
              </motion.div>

              {/* Now Playing Indicator */}
              {isInView && isPlaying && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="absolute top-3 left-3 sm:top-6 sm:left-6 md:top-8 md:left-8 flex items-center gap-2 sm:gap-3 bg-dark/80 backdrop-blur-sm rounded-full px-3 py-1.5 sm:px-4 sm:py-2 border border-white/10"
                >
                  <div className="flex gap-1 items-end h-5">
                    {[0, 1, 2].map((i) => (
                      <motion.div
                        key={i}
                        animate={{ height: [8, 20, 8] }}
                        transition={{
                          duration: 0.8,
                          repeat: Infinity,
                          delay: i * 0.2,
                          ease: "easeInOut",
                        }}
                        className="w-1 rounded-full"
                        style={{
                          backgroundColor: track.color,
                          willChange: "height",
                        }}
                      />
                    ))}
                  </div>
                  <span className="text-xs sm:text-sm font-medium text-white hidden xs:inline">Now Playing</span>
                </motion.div>
              )}

              {/* Mood Badge */}
              <div className="absolute top-3 right-3 sm:top-6 sm:right-6 md:top-8 md:right-8">
                {track.isFavorite && (
                  <>
                    {/* Sparkle effects around favorite badge */}
                    <motion.div
                      animate={{
                        scale: [1, 1.3, 1],
                        opacity: [0.5, 1, 0.5],
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: "easeInOut",
                      }}
                      className="absolute -inset-2 rounded-full"
                      style={{
                        background: `radial-gradient(circle, ${track.color}40 0%, transparent 70%)`,
                        filter: "blur(8px)",
                      }}
                    />
                    <motion.div
                      animate={{
                        rotate: [0, 360],
                      }}
                      transition={{
                        duration: 4,
                        repeat: Infinity,
                        ease: "linear",
                      }}
                      className="absolute -inset-1 text-yellow-300 text-2xl pointer-events-none"
                      style={{ textShadow: `0 0 10px ${track.color}` }}
                    >
                      <span className="absolute -top-1 -left-1">✨</span>
                      <span className="absolute -top-1 -right-1">✨</span>
                      <span className="absolute -bottom-1 -left-1">✨</span>
                      <span className="absolute -bottom-1 -right-1">✨</span>
                    </motion.div>
                  </>
                )}
                <div
                  className={`relative px-3 py-1.5 sm:px-4 sm:py-2 rounded-full text-xs sm:text-sm font-medium border ${
                    track.isFavorite ? 'font-bold' : ''
                  }`}
                  style={{
                    backgroundColor: `${track.color}${track.isFavorite ? '40' : '20'}`,
                    color: track.isFavorite ? 'white' : track.color,
                    borderColor: track.color,
                    boxShadow: track.isFavorite ? `0 0 20px ${track.color}80` : undefined,
                  }}
                >
                  {track.mood}
                </div>
              </div>
            </div>

            {/* Track Info */}
            <div className="p-4 sm:p-6 md:p-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: isInView ? 1 : 0, y: isInView ? 0 : 20 }}
                transition={{ delay: 0.2 }}
              >
                <h2
                  className={`text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-2 ${
                    track.isFavorite ? 'relative' : ''
                  }`}
                  style={track.isFavorite ? {
                    textShadow: `0 0 20px ${track.color}80, 0 0 40px ${track.color}40`,
                  } : undefined}
                >
                  {track.isFavorite && (
                    <span className="inline-block mr-2 text-yellow-300 animate-pulse">⭐</span>
                  )}
                  {track.title}
                </h2>
                <p className="text-lg sm:text-xl text-light-100 mb-3 sm:mb-4">{track.artist}</p>
                <p className={`text-light-100/60 text-xs sm:text-sm mb-3 sm:mb-4 ${
                  track.isFavorite ? 'font-medium' : ''
                }`}>{track.description}</p>

                {/* YouTube Link */}
                <a
                  href={track.youtubeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-3 py-2 sm:px-4 sm:py-2 bg-[#FF0000] hover:bg-[#CC0000] rounded-lg text-white text-xs sm:text-sm font-medium transition-all hover:scale-105 shadow-lg"
                >
                  <svg
                    className="w-4 h-4 sm:w-5 sm:h-5"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                  </svg>
                  <span>Watch on YouTube</span>
                </a>
              </motion.div>

              {/* Progress Bar */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: isInView ? 1 : 0 }}
                transition={{ delay: 0.4 }}
                className="mt-4 sm:mt-6 md:mt-8"
              >
                <div className="flex items-center gap-2 sm:gap-3 md:gap-4 mb-2">
                  <span className="text-xs text-light-100/60 w-10 sm:w-12 text-right">
                    {formatTime(currentTime)}
                  </span>
                  <input
                    type="range"
                    min="0"
                    max={duration || 0}
                    value={currentTime}
                    onChange={handleSeek}
                    className="flex-1 h-1.5 sm:h-2 rounded-full appearance-none cursor-pointer"
                    style={{
                      background: `linear-gradient(to right, ${track.color} ${
                        (currentTime / duration) * 100
                      }%, rgba(255,255,255,0.1) ${(currentTime / duration) * 100}%)`,
                    }}
                  />
                  <span className="text-xs text-light-100/60 w-10 sm:w-12">
                    {formatTime(duration)}
                  </span>
                </div>
              </motion.div>

              {/* Controls */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: isInView ? 1 : 0, y: isInView ? 0 : 20 }}
                transition={{ delay: 0.6 }}
                className="flex items-center justify-between mt-4 sm:mt-6"
              >
                <div className="flex items-center gap-2 sm:gap-3 md:gap-4">
                  <button
                    onClick={togglePlay}
                    className="w-12 h-12 sm:w-14 sm:h-14 rounded-full flex items-center justify-center transition-all hover:scale-110"
                    style={{ backgroundColor: track.color }}
                  >
                    <span className="text-xl sm:text-2xl">{isPlaying ? "⏸" : "▶"}</span>
                  </button>
                  <div className="flex items-center gap-1.5 sm:gap-2">
                    <span className="text-xs sm:text-sm text-light-100/60">🔊</span>
                    <input
                      type="range"
                      min="0"
                      max="1"
                      step="0.01"
                      value={volume}
                      onChange={handleVolumeChange}
                      className="w-16 sm:w-20 md:w-24 h-1 rounded-full appearance-none cursor-pointer"
                      style={{
                        background: `linear-gradient(to right, ${track.color} ${
                          volume * 100
                        }%, rgba(255,255,255,0.1) ${volume * 100}%)`,
                      }}
                    />
                  </div>
                </div>

                <div className="text-xs text-light-100/40">
                  Track {index + 1}
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        input[type="range"]::-webkit-slider-thumb {
          appearance: none;
          width: 16px;
          height: 16px;
          border-radius: 50%;
          background: white;
          cursor: pointer;
          box-shadow: 0 0 10px rgba(0, 0, 0, 0.3);
        }
        input[type="range"]::-moz-range-thumb {
          width: 16px;
          height: 16px;
          border-radius: 50%;
          background: white;
          cursor: pointer;
          border: none;
          box-shadow: 0 0 10px rgba(0, 0, 0, 0.3);
        }
      `}</style>
    </motion.div>
  );
};

export const ScrollMusicPlayer = memo(ScrollMusicPlayerComponent);
