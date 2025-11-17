'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface Track {
  id: string;
  title: string;
  artist: string;
  audioPath: string;
  youtubeUrl: string;
  color: string;
  mood: string;
}

export default function MiniMusicPlayer() {
  const [tracks, setTracks] = useState<Track[]>([]);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.7);
  const [isExpanded, setIsExpanded] = useState(true);
  const [isMinimized, setIsMinimized] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const audioRef = useRef<HTMLAudioElement>(null);

  // Fetch homepage tracks
  useEffect(() => {
    async function fetchTracks() {
      try {
        const response = await fetch('/api/homepage-tracks');
        const data = await response.json();
        setTracks(data);
        setIsLoading(false);

        // Autoplay after loading tracks
        if (data.length > 0) {
          setTimeout(() => {
            if (audioRef.current) {
              audioRef.current.play().then(() => {
                setIsPlaying(true);
              }).catch(() => {
                // Browser blocked autoplay, user will need to click
                console.log('Autoplay blocked by browser');
              });
            }
          }, 1000);
        }
      } catch (error) {
        console.error('Error fetching homepage tracks:', error);
        setIsLoading(false);
      }
    }
    fetchTracks();
  }, []);

  // Audio setup
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  // Update time
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateTime = () => setCurrentTime(audio.currentTime);
    const updateDuration = () => setDuration(audio.duration);
    const handleEnded = () => handleNext();

    audio.addEventListener('timeupdate', updateTime);
    audio.addEventListener('loadedmetadata', updateDuration);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('timeupdate', updateTime);
      audio.removeEventListener('loadedmetadata', updateDuration);
      audio.removeEventListener('ended', handleEnded);
    };
  }, [currentTrackIndex]);

  const currentTrack = tracks[currentTrackIndex];

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleNext = () => {
    setCurrentTrackIndex((prev) => (prev + 1) % tracks.length);
    setIsPlaying(true);
    setTimeout(() => {
      audioRef.current?.play();
    }, 100);
  };

  const handlePrevious = () => {
    setCurrentTrackIndex((prev) => (prev - 1 + tracks.length) % tracks.length);
    setIsPlaying(true);
    setTimeout(() => {
      audioRef.current?.play();
    }, 100);
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTime = parseFloat(e.target.value);
    if (audioRef.current) {
      audioRef.current.currentTime = newTime;
      setCurrentTime(newTime);
    }
  };

  const formatTime = (time: number) => {
    if (isNaN(time)) return '0:00';
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  if (isLoading || tracks.length === 0) return null;

  return (
    <>
      {/* Audio element */}
      {currentTrack && (
        <audio
          ref={audioRef}
          src={currentTrack.audioPath}
          preload="metadata"
        />
      )}

      {/* Mini Player */}
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.5 }}
        className="fixed bottom-6 right-6 z-50"
      >
        <AnimatePresence mode="wait">
          {isMinimized ? (
            // Minimized state - just a floating button
            <motion.button
              key="minimized"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
              onClick={() => setIsMinimized(false)}
              className="w-14 h-14 rounded-full shadow-2xl flex items-center justify-center backdrop-blur-xl border border-white/20"
              style={{
                background: `linear-gradient(135deg, ${currentTrack?.color || '#6366f1'}, ${currentTrack?.color || '#6366f1'}dd)`,
              }}
            >
              <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z" />
              </svg>
            </motion.button>
          ) : (
            // Expanded player
            <motion.div
              key="expanded"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="bg-black/90 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/10 overflow-hidden"
              style={{
                width: isExpanded ? '320px' : '80px',
                transition: 'width 0.3s ease-in-out',
              }}
            >
              {/* Header */}
              <div className="flex items-center justify-between p-3 border-b border-white/10">
                <div className="flex items-center gap-2 flex-1 min-w-0">
                  {/* Music icon instead of image */}
                  <div
                    className="w-10 h-10 rounded-lg flex items-center justify-center"
                    style={{ backgroundColor: `${currentTrack?.color || '#6366f1'}40` }}
                  >
                    <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z" />
                    </svg>
                  </div>
                  {isExpanded && (
                    <div className="flex-1 min-w-0">
                      <h4 className="text-white text-sm font-semibold truncate">
                        {currentTrack?.title}
                      </h4>
                      <p className="text-gray-400 text-xs truncate">
                        {currentTrack?.artist}
                      </p>
                    </div>
                  )}
                </div>
                <div className="flex gap-1">
                  <button
                    onClick={() => setIsExpanded(!isExpanded)}
                    className="text-gray-400 hover:text-white p-1 transition-colors"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      {isExpanded ? (
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      ) : (
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                      )}
                    </svg>
                  </button>
                  <button
                    onClick={() => setIsMinimized(true)}
                    className="text-gray-400 hover:text-white p-1 transition-colors"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Progress bar */}
              {isExpanded && (
                <div className="px-3 pt-2">
                  <input
                    type="range"
                    min="0"
                    max={duration || 0}
                    value={currentTime}
                    onChange={handleSeek}
                    className="w-full h-1 bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
                    style={{
                      background: `linear-gradient(to right, ${currentTrack?.color || '#6366f1'} 0%, ${currentTrack?.color || '#6366f1'} ${(currentTime / duration) * 100}%, #374151 ${(currentTime / duration) * 100}%, #374151 100%)`,
                    }}
                  />
                  <div className="flex justify-between text-xs text-gray-400 mt-1">
                    <span>{formatTime(currentTime)}</span>
                    <span>{formatTime(duration)}</span>
                  </div>
                </div>
              )}

              {/* Controls */}
              {isExpanded && (
                <div className="flex items-center justify-between px-3 py-3">
                  {/* Previous */}
                  <button
                    onClick={handlePrevious}
                    className="text-gray-400 hover:text-white transition-colors p-2"
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M6 6h2v12H6zm3.5 6l8.5 6V6z" />
                    </svg>
                  </button>

                  {/* Play/Pause */}
                  <button
                    onClick={togglePlay}
                    className="rounded-full p-3 transition-all hover:scale-110"
                    style={{
                      background: `linear-gradient(135deg, ${currentTrack?.color || '#6366f1'}, ${currentTrack?.color || '#6366f1'}dd)`,
                    }}
                  >
                    {isPlaying ? (
                      <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
                      </svg>
                    ) : (
                      <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M8 5v14l11-7z" />
                      </svg>
                    )}
                  </button>

                  {/* Next */}
                  <button
                    onClick={handleNext}
                    className="text-gray-400 hover:text-white transition-colors p-2"
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M6 18l8.5-6L6 6v12zM16 6v12h2V6h-2z" />
                    </svg>
                  </button>

                  {/* Volume */}
                  <div className="flex items-center gap-2">
                    <svg className="w-4 h-4 text-gray-400" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02z" />
                    </svg>
                    <input
                      type="range"
                      min="0"
                      max="1"
                      step="0.01"
                      value={volume}
                      onChange={(e) => setVolume(parseFloat(e.target.value))}
                      className="w-16 h-1 bg-gray-700 rounded-lg appearance-none cursor-pointer"
                      style={{
                        background: `linear-gradient(to right, ${currentTrack?.color || '#6366f1'} 0%, ${currentTrack?.color || '#6366f1'} ${volume * 100}%, #374151 ${volume * 100}%, #374151 100%)`,
                      }}
                    />
                  </div>
                </div>
              )}

              {/* Mood tag */}
              {isExpanded && currentTrack?.mood && (
                <div className="px-3 pb-3">
                  <span
                    className="inline-block px-2 py-1 rounded-full text-xs font-medium text-white/90"
                    style={{ backgroundColor: `${currentTrack.color}40` }}
                  >
                    {currentTrack.mood}
                  </span>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      <style jsx>{`
        .slider::-webkit-slider-thumb {
          appearance: none;
          width: 12px;
          height: 12px;
          border-radius: 50%;
          background: white;
          cursor: pointer;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
        }

        .slider::-moz-range-thumb {
          width: 12px;
          height: 12px;
          border-radius: 50%;
          background: white;
          cursor: pointer;
          border: none;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
        }
      `}</style>
    </>
  );
}
