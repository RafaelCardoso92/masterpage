"use client";

import { useRef, useState } from "react";
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

// Configure your favorite tracks here
const tracks = [
  {
    id: "1",
    title: "(un)Folded",
    artist: "Kehlani",
    audioPath: "/music/track1.mp3",
    youtubeUrl: "https://www.youtube.com/watch?v=g5WXFVF9sgk",
    artistImage: "/images/artists/kehlani/1.jpg", // Main background image
    artistImages: [
      "/images/artists/kehlani/1.jpg",
      "/images/artists/kehlani/2.jpg",
      "/images/artists/kehlani/3.jpg",
      "/images/artists/kehlani/4.jpg",
      "/images/artists/kehlani/5.jpg",
    ],
    color: "#ff006e",
    mood: "Passion",
    description: "Perfect for deep focus sessions.",
  },
  {
    id: "2",
    title: "𝑺𝑯𝑶𝑻𝑻𝒀 ",
    artist: "HYOLYN",
    audioPath: "/music/track2.mp3",
    youtubeUrl: "https://www.youtube.com/watch?v=gtC5UgMaRO4&list=RDgtC5UgMaRO4",
    artistImage: "/images/artists/hyolyn/1.jpg",
    artistImages: [
      "/images/artists/hyolyn/1.jpg",
      "/images/artists/hyolyn/2.jpg",
      "/images/artists/hyolyn/3.jpg",
      "/images/artists/hyolyn/4.jpg",
      "/images/artists/hyolyn/5.jpg",
    ],
    color: "#8338ec",
    mood: "Chill 😌",
    description: "Late night coding vibes. Smooth beats that help me think clearly.",
  },
  {
    id: "3",
    title: "80/20 Rule",
    artist: "Larissa Lambert",
    audioPath: "/music/track3.mp3",
    youtubeUrl: "https://www.youtube.com/watch?v=qrIw-jRg1jk",
    artistImage: "/images/artists/larissa/1.jpg",
    artistImages: [
      "/images/artists/larissa/1.jpg",
      "/images/artists/larissa/2.jpg",
      "/images/artists/larissa/3.jpg",
      "/images/artists/larissa/4.jpg",
      "/images/artists/larissa/5.jpg",
    ],
    color: "#3a86ff",
    mood: "Focus 🎯",
    description: "Maximum concentration mode. This is my go-to for solving complex problems.",
  },
  {
    id: "4",
    title: "Layin' Low (feat. Jooyoung)",
    artist: "HYOLYN",
    audioPath: "/music/track4.mp3",
    youtubeUrl: "https://www.youtube.com/watch?v=-CXgH2HrdQA",
    artistImage: "/images/artists/hyolyn/1.jpg",
    artistImages: [
      "/images/artists/hyolyn/1.jpg",
      "/images/artists/hyolyn/2.jpg",
      "/images/artists/hyolyn/3.jpg",
      "/images/artists/hyolyn/4.jpg",
      "/images/artists/hyolyn/5.jpg",
    ],
    color: "#06ffa5",
    mood: "Creative 🎨",
    description: "When I need to think outside the box. Sparks creativity and innovation.",
  },
  {
    id: "5",
    title: "butterflies (2 a.m. Version)",
    artist: "Denise Julia",
    audioPath: "/music/track5.mp3",
    youtubeUrl: "https://www.youtube.com/watch?v=KzrlWYxwN88",
    artistImage: "/images/artists/denise/1.jpg",
    artistImages: [
      "/images/artists/denise/1.jpg",
      "/images/artists/denise/2.jpg",
      "/images/artists/denise/3.jpg",
      "/images/artists/denise/4.jpg",
      "/images/artists/denise/5.jpg",
    ],
    color: "#ffbe0b",
    mood: "Inspired ✨",
    description: "Building something amazing? This track fuels my passion and drive.",
  },
  {
    id: "6",
    title: "worst behaviour",
    artist: "kwn ft. Kehlani",
    audioPath: "/music/track6.mp3",
    youtubeUrl: "https://www.youtube.com/watch?v=VHsJCGh4gr4",
    artistImage: "/images/artists/kwn/1.jpg",
    artistImages: [
      "/images/artists/kwn/1.jpg",
      "/images/artists/kwn/2.jpg",
      "/images/artists/kwn/3.jpg",
      "/images/artists/kwn/4.jpg",
      "/images/artists/kwn/5.jpg",
    ],
    color: "#c71f37",
    mood: "Intense 🔥",
    description: "Raw energy and emotion. Perfect for when you need that fire.",
  },
  {
    id: "7",
    title: "It Depends",
    artist: "Chris Brown ft. Bryson Tiller",
    audioPath: "/music/track7.mp3",
    youtubeUrl: "https://www.youtube.com/watch?v=MueOsq3_OVg",
    artistImage: "/images/artists/chris-brown/1.jpg",
    artistImages: [
      "/images/artists/chris-brown/1.jpg",
      "/images/artists/chris-brown/2.jpg",
      "/images/artists/chris-brown/3.jpg",
      "/images/artists/chris-brown/4.jpg",
      "/images/artists/chris-brown/5.jpg",
    ],
    color: "#fb8500",
    mood: "Smooth 😎",
    description: "Laid-back vibes and smooth rhythms. Pure R&B excellence.",
  },
  {
    id: "8",
    title: "Better",
    artist: "Khalid",
    audioPath: "/music/track8.mp3",
    youtubeUrl: "https://www.youtube.com/watch?v=x3bfa3DZ8JM",
    artistImage: "/images/artists/khalid/1.jpg",
    artistImages: [
      "/images/artists/khalid/1.jpg",
      "/images/artists/khalid/2.jpg",
      "/images/artists/khalid/3.jpg",
      "/images/artists/khalid/4.jpg",
      "/images/artists/khalid/5.jpg",
    ],
    color: "#06a77d",
    mood: "Uplifting 🌟",
    description: "Positive energy and hopeful melodies. Makes everything better.",
  },
  {
    id: "9",
    title: "HOWLING",
    artist: "XG",
    audioPath: "/music/track9.mp3",
    youtubeUrl: "https://www.youtube.com/watch?v=rGqEuk8Om-4",
    artistImage: "/images/artists/xg/1.jpg",
    artistImages: [
      "/images/artists/xg/1.jpg",
      "/images/artists/xg/2.jpg",
      "/images/artists/xg/3.jpg",
      "/images/artists/xg/4.jpg",
      "/images/artists/xg/5.jpg",
    ],
    color: "#d81159",
    mood: "Energetic ⚡",
    description: "High energy and powerful vocals. When you need that boost.",
  },
  {
    id: "10",
    title: "Like I Want You",
    artist: "GIVĒON",
    audioPath: "/music/track10.mp3",
    youtubeUrl: "https://www.youtube.com/watch?v=yNNMKN9BUmU",
    artistImage: "/images/artists/giveon/1.jpg",
    artistImages: [
      "/images/artists/giveon/1.jpg",
      "/images/artists/giveon/2.jpg",
      "/images/artists/giveon/3.jpg",
      "/images/artists/giveon/4.jpg",
      "/images/artists/giveon/5.jpg",
    ],
    color: "#6a4c93",
    mood: "Soulful 💜",
    description: "Deep, rich vocals that hit different. Perfect for late night vibes.",
  },
  {
    id: "11",
    title: "Get You",
    artist: "Daniel Caesar ft. Kali Uchis",
    audioPath: "/music/track11.mp3",
    youtubeUrl: "https://www.youtube.com/watch?v=uQFVqltOXRg",
    artistImage: "/images/artists/daniel-caesar/1.jpg",
    artistImages: [
      "/images/artists/daniel-caesar/1.jpg",
      "/images/artists/daniel-caesar/2.jpg",
      "/images/artists/daniel-caesar/3.jpg",
      "/images/artists/daniel-caesar/4.jpg",
      "/images/artists/daniel-caesar/5.jpg",
    ],
    color: "#ef476f",
    mood: "Romantic 💕",
    description: "Smooth R&B perfection. The ultimate love song.",
  },
  {
    id: "12",
    title: "SLOW DANCING IN THE DARK",
    artist: "Joji",
    audioPath: "/music/track12.mp3",
    youtubeUrl: "https://www.youtube.com/watch?v=K3Qzzggn--s",
    artistImage: "/images/artists/joji/1.jpg",
    artistImages: [
      "/images/artists/joji/1.jpg",
      "/images/artists/joji/2.jpg",
      "/images/artists/joji/3.jpg",
      "/images/artists/joji/4.jpg",
      "/images/artists/joji/5.jpg",
    ],
    color: "#0466c8",
    mood: "Favorite",
    description: "My absolute favorite. Emotional, beautiful, and unforgettable.",
    isFavorite: true,
  },
];

const MyVibe = () => {
  const heroRef = useRef(null);
  const isHeroInView = useInView(heroRef, { once: true });
  const [isLoading, setIsLoading] = useState(true);
  const [activeTrackId, setActiveTrackId] = useState<string>(tracks[0].id);

  // Collect all image and audio URLs for preloading
  const allImageUrls = tracks.flatMap((track) => track.artistImages || [track.artistImage || ""]).filter(Boolean);
  const allAudioUrls = tracks.map((track) => track.audioPath);

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
