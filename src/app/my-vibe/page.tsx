"use client";

import { useRef, useState, useEffect } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import dynamic from "next/dynamic";
import {
  Navbar,
  Footer,
  CustomCursor,
  ScrollProgress,
  AnimatedGradient,
  GridBackground,
  PageTransition,
} from "../../components";
import VibeLoader from "../../components/VibeLoader";

// Dynamically import heavy components
const ParticleField = dynamic(() => import("../../components/ParticleField"), {
  ssr: false,
  loading: () => null,
});

const ScrollMusicPlayer = dynamic(
  () => import("../../components/ScrollMusicPlayer").then((mod) => ({ default: mod.ScrollMusicPlayer })),
  { ssr: false, loading: () => null }
);

const MyVibe = () => {
  const heroRef = useRef(null);
  const isHeroInView = useInView(heroRef, { once: true });
  const [isLoading, setIsLoading] = useState(true);
  const [tracks, setTracks] = useState<any[]>([]);
  const [activeTrackId, setActiveTrackId] = useState<string>("");

  // Fetch tracks from API
  useEffect(() => {
    async function fetchTracks() {
      try {
        const res = await fetch('/api/tracks');
        const data = await res.json();
        setTracks(data);
        if (data.length > 0) {
          setActiveTrackId(data[0].id);
        }
      } catch (error) {
        console.error('Error fetching tracks:', error);
      }
    }
    fetchTracks();
  }, []);

  // Collect all image and audio URLs for preloading
  const allImageUrls = tracks.flatMap((track) => track.artistImages || [track.artistImage || ""]).filter(Boolean);
  const allAudioUrls = tracks.map((track) => track.audioPath).filter(Boolean);

  return (
    <>
      <AnimatePresence mode="wait">
        {isLoading && (
          <VibeLoader
            key="loader"
            onLoadComplete={() => setIsLoading(false)}
            imageUrls={allImageUrls}
            audioUrls={allAudioUrls}
          />
        )}
      </AnimatePresence>

      {!isLoading && (
        <>
          <PageTransition />
          <CustomCursor />
          <ScrollProgress />
          <AnimatedGradient />
          <ParticleField />
          <GridBackground />
        </>
      )}

      <main className={`min-h-screen relative ${isLoading ? 'hidden' : ''}`}>
        <Navbar />

        {/* Hero Section */}
        <section className="section pt-24 sm:pt-28 md:pt-32 pb-12 sm:pb-16 px-4" ref={heroRef}>
          <div className="container-custom relative z-20">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={isHeroInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
              transition={{ duration: 0.6 }}
              className="text-center max-w-4xl mx-auto"
            >
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={isHeroInView ? { scale: 1, rotate: 0 } : { scale: 0, rotate: -180 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="text-4xl sm:text-5xl md:text-6xl mb-4 sm:mb-6"
              >
                🎵
              </motion.div>
              <h1 className="text-4xl sm:text-5xl md:text-display font-bold text-white mb-4 sm:mb-6">
                My Vibe
              </h1>
              <p className="text-base sm:text-lg md:text-xl text-light-100 mb-6 sm:mb-8 text-balance px-4">
                The soundtrack to my coding journey. Scroll to explore my favorite tracks.
              </p>
              <motion.div
                initial={{ opacity: 0 }}
                animate={isHeroInView ? { opacity: 1 } : { opacity: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="inline-flex items-center gap-2 px-4 py-2 sm:px-6 sm:py-3 bg-accent/20 border border-accent/50 rounded-full text-accent text-sm sm:text-base font-medium"
              >
                <span>🎧</span>
                <span>Headphones recommended</span>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* Scroll Instructions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1, duration: 0.6 }}
          className="text-center pb-12 sm:pb-16"
        >
          <div className="inline-flex flex-col items-center gap-2 text-light-100/60">
            <span className="text-xs sm:text-sm">Scroll to explore</span>
            <motion.div
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              ↓
            </motion.div>
          </div>
        </motion.div>

        {/* Music Players */}
        <div className="relative">
          {tracks.map((track, index) => (
            <ScrollMusicPlayer
              key={track.id}
              track={track}
              isActive={activeTrackId === track.id}
              index={index}
              onBecomeActive={() => setActiveTrackId(track.id)}
            />
          ))}
        </div>

        {/* End Section */}
        <section className="section px-4">
          <div className="container-custom relative z-20">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="text-center max-w-3xl mx-auto"
            >
              <div className="text-4xl sm:text-5xl mb-4 sm:mb-6">🎶</div>
              <h2 className="text-3xl sm:text-4xl font-bold text-white mb-3 sm:mb-4">
                That's My Vibe
              </h2>
              <p className="text-base sm:text-lg text-light-100 mb-6 sm:mb-8 px-4">
                Music fuels creativity. What's yours?
              </p>
              <a
                href="/#contact"
                className="btn-primary inline-block"
              >
                Let's Connect
              </a>
            </motion.div>
          </div>
        </section>

        <Footer />
      </main>
    </>
  );
};

export default MyVibe;
