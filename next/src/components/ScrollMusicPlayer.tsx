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
  const hasSetInitialPosition = useRef(false); // Track if we've set the 1/5th position
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

  // Smooth volume control based on scroll position for fluid audio crossfading
  // Volume peaks when track is centered (scrollYProgress = 0.5)
  // Gradually fades out as user scrolls away
  const scrollBasedVolume = useTransform(
    scrollYProgress,
    [0, 0.3, 0.5, 0.7, 1],      // Scroll positions
    [0, 0.8, 1, 0.8, 0],         // Volume levels (0-1)
    { clamp: true }
  );

  // Reset initial position flag when track changes
  useEffect(() => {
    hasSetInitialPosition.current = false;
  }, [track.id]);

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

  // Handle play/pause based on scroll position (no manual fading - scroll-based volume handles it)
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    // Immediately pause all other songs when this one becomes active
    if (isActive && isInView && !isManuallyPaused) {
      // Pause all other audio elements immediately
      const allAudioElements = document.querySelectorAll("audio");
      allAudioElements.forEach((otherAudio) => {
        if (otherAudio !== audio && !otherAudio.paused) {
          otherAudio.pause();
        }
      });

      // Try to play this audio
      const playPromise = audio.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            setIsPlaying(true);
          })
          .catch((error) => {
            // Auto-play was prevented (browser restriction)
            console.log("Auto-play prevented, waiting for user interaction:", error);

            // Set up one-time click handler to enable playback
            const enableAudio = () => {
              audio.play().then(() => {
                setIsPlaying(true);
                document.removeEventListener("click", enableAudio);
                document.removeEventListener("touchstart", enableAudio);
              });
            };

            document.addEventListener("click", enableAudio, { once: true });
            document.addEventListener("touchstart", enableAudio, { once: true });
          });
      }
    } else if (isPlaying && (!isInView || !isActive || isManuallyPaused)) {
      // Simply pause - scroll-based volume already faded it out
      audio.pause();
      setIsPlaying(false);
    }
  }, [isInView, isActive, isPlaying, isManuallyPaused]);

  // Apply scroll-based volume for smooth crossfading
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !isPlaying || isManuallyPaused) return;

    const unsubscribe = scrollBasedVolume.on("change", (v) => {
      // Apply user's volume preference multiplied by scroll-based volume
      audio.volume = v * volume;
    });

    return () => unsubscribe();
  }, [scrollBasedVolume, isPlaying, isManuallyPaused, volume]);

  // Update time and set initial position
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateTime = () => setCurrentTime(audio.currentTime);

    const setInitialPosition = () => {
      if (audio.duration && !hasSetInitialPosition.current && audio.currentTime < 1) {
        // Only set if we're near the beginning (< 1 second)
        audio.currentTime = audio.duration / 5;
        hasSetInitialPosition.current = true;
        console.log(`Set initial position for track ${track.id} to ${audio.duration / 5}s`);
      }
    };

    const updateDuration = () => {
      setDuration(audio.duration);
      setInitialPosition();
    };

    // Set position when audio is ready to play
    const handleCanPlay = () => {
      setInitialPosition();
    };

    // CRITICAL for iOS: Also set position when play event fires
    const handlePlay = () => {
      setInitialPosition();
    };

    audio.addEventListener("timeupdate", updateTime);
    audio.addEventListener("loadedmetadata", updateDuration);
    audio.addEventListener("canplay", handleCanPlay);
    audio.addEventListener("play", handlePlay);

    // Try to set immediately if duration is already available
    if (audio.duration) {
      setInitialPosition();
    }

    return () => {
      audio.removeEventListener("timeupdate", updateTime);
      audio.removeEventListener("loadedmetadata", updateDuration);
      audio.removeEventListener("canplay", handleCanPlay);
      audio.removeEventListener("play", handlePlay);
    };
  }, [track.id]); // Reset when track changes

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

  // Also handle touch events for mobile slider
  const handleSeekTouch = useCallback((e: React.TouchEvent<HTMLInputElement>) => {
    const input = e.currentTarget;
    const time = parseFloat(input.value);
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
                  rotate: isPlaying ? 360 : 0,
                }}
                transition={{
                  rotate: { duration: 4, repeat: isPlaying ? Infinity : 0, ease: "linear" },
                }}
                className="w-40 h-40 sm:w-52 sm:h-52 md:w-64 md:h-64 relative"
                style={{
                  willChange: isPlaying ? "transform" : "auto",
                }}
              >
                {/* Vinyl Record */}
                <div className="w-full h-full rounded-full relative overflow-hidden" style={{
                  background: `radial-gradient(circle at center,
                    ${track.color} 0%,
                    ${track.color} 18%,
                    #0a0a0a 18%,
                    #0a0a0a 18.5%,
                    #1a1a1a 18.5%,
                    #0a0a0a 19%,
                    #1a1a1a 19%,
                    #0a0a0a 19.5%,
                    #1a1a1a 19.5%,
                    #0a0a0a 20%,
                    #121212 20%,
                    #0a0a0a 95%,
                    #1a1a1a 95%,
                    #0a0a0a 100%)`,
                  boxShadow: `
                    0 0 0 3px ${track.color}60,
                    0 8px 24px rgba(0,0,0,0.6),
                    inset 0 0 60px rgba(0,0,0,0.9),
                    inset 0 2px 4px rgba(255,255,255,0.05)
                  `,
                }}>
                  {/* Realistic Grooves - Concentric circles */}
                  <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ opacity: 0.4 }}>
                    <defs>
                      <radialGradient id={`vinyl-gradient-${track.id}`}>
                        <stop offset="0%" stopColor="rgba(255,255,255,0.1)" />
                        <stop offset="50%" stopColor="rgba(255,255,255,0.02)" />
                        <stop offset="100%" stopColor="rgba(0,0,0,0.3)" />
                      </radialGradient>
                    </defs>
                    {/* Create concentric groove circles */}
                    {Array.from({ length: 40 }).map((_, i) => {
                      const radius = 20 + (i * 1.5);
                      return (
                        <circle
                          key={i}
                          cx="50%"
                          cy="50%"
                          r={`${radius}%`}
                          fill="none"
                          stroke="rgba(255,255,255,0.03)"
                          strokeWidth="0.5"
                        />
                      );
                    })}
                  </svg>

                  {/* Vinyl shine effect - stays fixed while vinyl rotates */}
                  <div
                    className="absolute inset-0 rounded-full pointer-events-none"
                    style={{
                      background: `linear-gradient(135deg,
                        transparent 0%,
                        rgba(255,255,255,0.1) 30%,
                        transparent 50%,
                        rgba(0,0,0,0.2) 70%,
                        transparent 100%)`,
                    }}
                  />

                  {/* Center Label with album art */}
                  <div
                    className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-14 h-14 sm:w-20 sm:h-20 md:w-24 md:h-24 rounded-full overflow-hidden"
                    style={{
                      boxShadow: `
                        0 4px 12px rgba(0,0,0,0.6),
                        inset 0 1px 3px rgba(255,255,255,0.4),
                        inset 0 -2px 6px rgba(0,0,0,0.3),
                        0 0 0 2px ${track.color}aa
                      `,
                    }}
                  >
                    {/* Artist Album Art */}
                    <div className="relative w-full h-full">
                      <Image
                        src={track.artistImages?.[0] || track.artistImage || ""}
                        alt={track.artist}
                        fill
                        className="object-cover"
                        sizes="(max-width: 640px) 56px, (max-width: 768px) 80px, 96px"
                      />
                      {/* Subtle gradient overlay for depth */}
                      <div
                        className="absolute inset-0"
                        style={{
                          background: `radial-gradient(circle at 30% 30%,
                            transparent 0%,
                            rgba(0,0,0,0.1) 100%)`,
                        }}
                      />
                    </div>

                    {/* Center hole */}
                    <div
                      className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5 rounded-full z-10"
                      style={{
                        background: '#000',
                        boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.8), 0 0 0 1px rgba(255,255,255,0.1)',
                      }}
                    />
                  </div>
                </div>
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
                    onTouchEnd={handleSeekTouch}
                    onInput={handleSeek}
                    className="flex-1 h-1.5 sm:h-2 rounded-full appearance-none cursor-pointer touch-none"
                    style={{
                      background: `linear-gradient(to right, ${track.color} ${
                        (currentTime / duration) * 100
                      }%, rgba(255,255,255,0.1) ${(currentTime / duration) * 100}%)`,
                      touchAction: 'none',
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
