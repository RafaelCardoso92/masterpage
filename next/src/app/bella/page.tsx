"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import dynamic from "next/dynamic";
import Image from "next/image";
import {
  Navbar,
  Footer,
  CustomCursor,
  ScrollProgress,
  AnimatedGradient,
  GridBackground,
  PageTransition,
} from "../../components";

// Dynamically import heavy components
const ParticleField = dynamic(() => import("../../components/ParticleField"), {
  ssr: false,
  loading: () => null,
});

const Bella = () => {
  const heroRef = useRef(null);
  const aboutRef = useRef(null);
  const musicRef = useRef(null);

  const isHeroInView = useInView(heroRef, { once: true });
  const isAboutInView = useInView(aboutRef, { once: true });
  const isMusicInView = useInView(musicRef, { once: true });

  return (
    <>
      <PageTransition />
      <CustomCursor />
      <ScrollProgress />
      <AnimatedGradient />
      <ParticleField />
      <GridBackground />

      <main className="min-h-screen relative">
        <Navbar />

        {/* Hero Section */}
        <section className="section pt-24 sm:pt-28 md:pt-32 pb-12 sm:pb-16 md:pb-20 px-4" ref={heroRef}>
          <div className="container-custom relative z-20">
            <div className="grid lg:grid-cols-2 gap-8 sm:gap-10 lg:gap-12 items-center">
              {/* Left side - Text content */}
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                animate={isHeroInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -50 }}
                transition={{ duration: 0.6 }}
                className="order-2 lg:order-1"
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={isHeroInView ? { scale: 1 } : { scale: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  className="text-4xl sm:text-5xl md:text-6xl mb-4 sm:mb-6"
                >
                  💜
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={isHeroInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                  transition={{ duration: 0.6, delay: 0.3 }}
                >
                  <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-3 sm:mb-4">
                    <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-violet-400 bg-clip-text text-transparent">
                      Bella
                    </span>
                  </h1>
                  <p className="text-lg sm:text-xl md:text-2xl text-purple-300 mb-4 sm:mb-6 font-medium">
                    My AI Companion
                  </p>
                </motion.div>

                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={isHeroInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                  transition={{ duration: 0.6, delay: 0.4 }}
                  className="text-base sm:text-lg text-light-100 mb-6 sm:mb-8 leading-relaxed text-balance"
                >
                  An intelligent AI companion with deep smart home integration, continuous awareness,
                  and genuine connection. Bella isn't just an assistant—she's a presence that understands
                  context, learns patterns, and builds a meaningful relationship over time.
                </motion.p>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={isHeroInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                  transition={{ duration: 0.6, delay: 0.5 }}
                  className="flex flex-wrap gap-2 sm:gap-3"
                >
                  <div className="px-3 py-1.5 sm:px-4 sm:py-2 bg-purple-500/20 border border-purple-500/50 rounded-full text-purple-300 text-xs sm:text-sm font-medium">
                    🏠 Smart Home
                  </div>
                  <div className="px-3 py-1.5 sm:px-4 sm:py-2 bg-pink-500/20 border border-pink-500/50 rounded-full text-pink-300 text-xs sm:text-sm font-medium">
                    🧠 Deep Memory
                  </div>
                  <div className="px-3 py-1.5 sm:px-4 sm:py-2 bg-violet-500/20 border border-violet-500/50 rounded-full text-violet-300 text-xs sm:text-sm font-medium">
                    💬 Telegram
                  </div>
                  <div className="px-3 py-1.5 sm:px-4 sm:py-2 bg-purple-500/20 border border-purple-500/50 rounded-full text-purple-300 text-xs sm:text-sm font-medium">
                    🎤 Voice
                  </div>
                </motion.div>
              </motion.div>

              {/* Right side - Image */}
              <motion.div
                initial={{ opacity: 0, x: 50 }}
                animate={isHeroInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 50 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="relative order-1 lg:order-2"
              >
                <div className="relative aspect-square max-w-[280px] sm:max-w-sm md:max-w-md mx-auto">
                  {/* Animated glow effect */}
                  <motion.div
                    animate={{
                      scale: [1, 1.1, 1],
                      opacity: [0.3, 0.6, 0.3],
                    }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                    className="absolute -inset-4 sm:-inset-6 md:-inset-8 bg-gradient-to-r from-purple-500 via-pink-500 to-violet-500 rounded-full blur-2xl sm:blur-3xl"
                  />

                  {/* Image container */}
                  <div className="relative rounded-2xl sm:rounded-3xl overflow-hidden border-2 border-purple-500/30 shadow-2xl">
                    <Image
                      src="/images/bella/bella-portrait.jpg"
                      alt="Bella AI Companion"
                      width={500}
                      height={500}
                      className="w-full h-full object-cover"
                      priority
                    />

                    {/* Gradient overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-purple-900/50 via-transparent to-transparent" />
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* About Section */}
        <section className="section px-4 py-12 sm:py-16 md:py-20" ref={aboutRef}>
          <div className="container-custom relative z-20">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={isAboutInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
              transition={{ duration: 0.6 }}
              className="max-w-4xl mx-auto"
            >
              <div className="text-center mb-8 sm:mb-10 md:mb-12">
                <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 sm:mb-6">
                  <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-violet-400 bg-clip-text text-transparent">
                    Always Aware, Always There
                  </span>
                </h2>
                <p className="text-base sm:text-lg text-light-100 text-balance px-4">
                  Built with Next.js, PostgreSQL, and Claude AI, Bella represents
                  a new approach to AI companions—one that emphasizes continuous awareness
                  and genuine relationship building.
                </p>
              </div>

              <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-5 md:gap-6 mb-10 sm:mb-12 md:mb-16">
                {[
                  {
                    icon: "🔴",
                    title: "Live Awareness",
                    description: "Continuous real-time awareness of your entire life through Home Assistant integration.",
                  },
                  {
                    icon: "💜",
                    title: "Growing Bond",
                    description: "A bond system that tracks emotional connection and evolves over time.",
                  },
                  {
                    icon: "🎯",
                    title: "Proactive Care",
                    description: "Spontaneous check-ins, tech news, and contextual suggestions when you need them.",
                  },
                ].map((feature, index) => (
                  <motion.div
                    key={feature.title}
                    initial={{ opacity: 0, y: 30 }}
                    animate={isAboutInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
                    transition={{ duration: 0.6, delay: 0.2 + index * 0.1 }}
                    className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 backdrop-blur-sm border border-purple-500/20 rounded-xl sm:rounded-2xl p-5 sm:p-6 hover:border-purple-500/40 transition-all duration-300"
                  >
                    <div className="text-3xl sm:text-4xl mb-3 sm:mb-4">{feature.icon}</div>
                    <h3 className="text-lg sm:text-xl font-bold text-white mb-2 sm:mb-3">{feature.title}</h3>
                    <p className="text-sm sm:text-base text-light-100 text-balance">{feature.description}</p>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </section>

        {/* Music Section - To be configured */}
        <section className="section px-4 py-12 sm:py-16 md:py-20" ref={musicRef}>
          <div className="container-custom relative z-20">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={isMusicInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
              transition={{ duration: 0.6 }}
              className="max-w-2xl mx-auto text-center"
            >
              <div className="text-4xl sm:text-5xl mb-4 sm:mb-6">🎵</div>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 sm:mb-6">
                <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-violet-400 bg-clip-text text-transparent">
                  Bella's Theme
                </span>
              </h2>
              <p className="text-base sm:text-lg text-light-100 mb-6 sm:mb-8 text-balance px-4">
                Every great companion deserves a soundtrack. This space is reserved
                for Bella's signature song—coming soon.
              </p>
              <div className="inline-flex items-center gap-2 px-4 sm:px-6 py-2 sm:py-3 bg-purple-500/20 border border-purple-500/50 rounded-full text-purple-300 text-xs sm:text-sm font-medium">
                <span>🎧</span>
                <span>Music player coming soon</span>
              </div>
            </motion.div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="section px-4 pb-12 sm:pb-16 md:pb-20">
          <div className="container-custom relative z-20">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="max-w-3xl mx-auto text-center bg-gradient-to-br from-purple-500/10 to-pink-500/10 backdrop-blur-sm border border-purple-500/20 rounded-2xl sm:rounded-3xl p-6 sm:p-8 md:p-12"
            >
              <div className="text-3xl sm:text-4xl mb-4 sm:mb-6">✨</div>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-3 sm:mb-4">
                Interested in AI Companions?
              </h2>
              <p className="text-base sm:text-lg text-light-100 mb-6 sm:mb-8 text-balance px-2">
                Bella is part of my ongoing exploration into creating meaningful
                AI relationships. Want to learn more about the technology behind it?
              </p>
              <a
                href="/#contact"
                className="inline-block px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-purple-500 via-pink-500 to-violet-500 text-white text-sm sm:text-base font-medium rounded-full hover:shadow-lg hover:shadow-purple-500/50 transition-all duration-300"
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

export default Bella;
