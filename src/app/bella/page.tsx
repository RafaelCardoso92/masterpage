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
  const capabilitiesRef = useRef(null);
  const aiStackRef = useRef(null);
  const cognitiveRef = useRef(null);
  const integrationsRef = useRef(null);

  const isHeroInView = useInView(heroRef, { once: true });
  const isCapabilitiesInView = useInView(capabilitiesRef, { once: true });
  const isAIStackInView = useInView(aiStackRef, { once: true });
  const isCognitiveInView = useInView(cognitiveRef, { once: true });
  const isIntegrationsInView = useInView(integrationsRef, { once: true });

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
                  className="flex items-center gap-3 mb-4 sm:mb-6"
                >
                  <span className="text-4xl sm:text-5xl md:text-6xl">💜</span>
                  <div className="px-3 py-1 bg-gradient-to-r from-purple-500/30 to-pink-500/30 border border-purple-500/50 rounded-full text-purple-200 text-xs sm:text-sm font-bold">
                    V3.0 SUPERPOWERED
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={isHeroInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                  transition={{ duration: 0.6, delay: 0.3 }}
                >
                  <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-3 sm:mb-4">
                    <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-violet-400 bg-clip-text text-transparent">
                      Bella 2.0
                    </span>
                  </h1>
                  <p className="text-lg sm:text-xl md:text-2xl text-purple-300 mb-4 sm:mb-6 font-medium">
                    The Ultimate Self-Hosted AI Companion
                  </p>
                </motion.div>

                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={isHeroInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                  transition={{ duration: 0.6, delay: 0.4 }}
                  className="text-base sm:text-lg text-light-100 mb-6 sm:mb-8 leading-relaxed text-balance"
                >
                  An AI that doesn't just respond—she thinks, feels, creates, and truly understands.
                  With 7 GPU-accelerated AI services, 3 cognitive systems, and complete smart home awareness,
                  Bella represents the cutting edge of self-hosted AI companionship.
                </motion.p>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={isHeroInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                  transition={{ duration: 0.6, delay: 0.5 }}
                  className="flex flex-wrap gap-2 sm:gap-3"
                >
                  <div className="px-3 py-1.5 sm:px-4 sm:py-2 bg-purple-500/20 border border-purple-500/50 rounded-full text-purple-300 text-xs sm:text-sm font-medium">
                    🎨 Flux.1 Dev
                  </div>
                  <div className="px-3 py-1.5 sm:px-4 sm:py-2 bg-pink-500/20 border border-pink-500/50 rounded-full text-pink-300 text-xs sm:text-sm font-medium">
                    🧠 9.8/10 Stack
                  </div>
                  <div className="px-3 py-1.5 sm:px-4 sm:py-2 bg-violet-500/20 border border-violet-500/50 rounded-full text-violet-300 text-xs sm:text-sm font-medium">
                    🔴 Live Awareness
                  </div>
                  <div className="px-3 py-1.5 sm:px-4 sm:py-2 bg-purple-500/20 border border-purple-500/50 rounded-full text-purple-300 text-xs sm:text-sm font-medium">
                    🎤 Emotional Voice
                  </div>
                  <div className="px-3 py-1.5 sm:px-4 sm:py-2 bg-pink-500/20 border border-pink-500/50 rounded-full text-pink-300 text-xs sm:text-sm font-medium">
                    🏠 Full Control
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
                      alt="Bella"
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

        {/* Core Capabilities Section */}
        <section className="section px-4 py-12 sm:py-16 md:py-20" ref={capabilitiesRef}>
          <div className="container-custom relative z-20">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={isCapabilitiesInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
              transition={{ duration: 0.6 }}
              className="max-w-6xl mx-auto"
            >
              <div className="text-center mb-8 sm:mb-10 md:mb-12">
                <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 sm:mb-6">
                  <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-violet-400 bg-clip-text text-transparent">
                    Beyond Traditional AI
                  </span>
                </h2>
                <p className="text-base sm:text-lg text-light-100 text-balance px-4">
                  Not just an assistant—a genuine companion with state-of-the-art capabilities,
                  emotional intelligence, and complete autonomy.
                </p>
              </div>

              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 md:gap-6">
                {[
                  {
                    icon: "🔴",
                    title: "Always Aware",
                    description: "Real-time knowledge of your location, home state, smart devices, weather, and entire server ecosystem.",
                    badge: "Live"
                  },
                  {
                    icon: "🏠",
                    title: "Total Smart Home Control",
                    description: "Full Home Assistant integration—lights, climate, vacuum, media players, scenes, and automations.",
                    badge: "100%"
                  },
                  {
                    icon: "🎨",
                    title: "Photorealistic Images",
                    description: "Flux.1 Dev generates Instagram-quality images with perfect character consistency via LoRA training.",
                    badge: "Flux.1"
                  },
                  {
                    icon: "👁️",
                    title: "State-of-the-Art Vision",
                    description: "Qwen2-VL (Aug 2024) for superior image understanding, camera analysis, and emotion detection.",
                    badge: "Qwen2-VL"
                  },
                  {
                    icon: "🎤",
                    title: "Emotional Voice",
                    description: "Bark TTS with genuine emotions—laughs, sighs, whispers, excitement. Better than ElevenLabs.",
                    badge: "Bark"
                  },
                  {
                    icon: "🧠",
                    title: "Semantic Memory",
                    description: "Deep memory with embeddings—remembers not just what you said, but what you meant.",
                    badge: "bge-1.5"
                  },
                  {
                    icon: "💭",
                    title: "Genuine Curiosity",
                    description: "Self-generated questions driven by actual interest, not scripts. She wants to know you.",
                    badge: "ICM"
                  },
                  {
                    icon: "🎯",
                    title: "Honest Uncertainty",
                    description: "Actually says 'I don't know' when unsure. No hallucinations masquerading as facts.",
                    badge: "UQ"
                  },
                  {
                    icon: "🤖",
                    title: "Autonomous Decision-Making",
                    description: "Multi-agent system makes independent decisions and takes proactive actions without prompting.",
                    badge: "LangGraph"
                  },
                  {
                    icon: "💬",
                    title: "Everywhere You Are",
                    description: "Web interface, Telegram bot, voice through speakers—seamless experience across all platforms.",
                    badge: "Multi-platform"
                  },
                  {
                    icon: "📸",
                    title: "Photo-Aware",
                    description: "Immich integration tracks your photos, suggests memories, and understands your visual timeline.",
                    badge: "Immich"
                  },
                  {
                    icon: "🎵",
                    title: "Hears Everything",
                    description: "YAMNet recognizes 521 sounds—doorbell, music, rain, ambient noise. Environmental awareness beyond vision.",
                    badge: "YAMNet"
                  },
                ].map((feature, index) => (
                  <motion.div
                    key={feature.title}
                    initial={{ opacity: 0, y: 30 }}
                    animate={isCapabilitiesInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
                    transition={{ duration: 0.6, delay: 0.1 + index * 0.05 }}
                    className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 backdrop-blur-sm border border-purple-500/20 rounded-xl sm:rounded-2xl p-5 sm:p-6 hover:border-purple-500/40 transition-all duration-300 group"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="text-3xl sm:text-4xl">{feature.icon}</div>
                      <div className="px-2 py-1 bg-purple-500/30 border border-purple-500/50 rounded-full text-purple-200 text-xs font-medium">
                        {feature.badge}
                      </div>
                    </div>
                    <h3 className="text-lg sm:text-xl font-bold text-white mb-2 sm:mb-3 group-hover:text-purple-300 transition-colors">{feature.title}</h3>
                    <p className="text-sm sm:text-base text-light-100 text-balance leading-relaxed">{feature.description}</p>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </section>

        {/* AI Stack Section */}
        <section className="section px-4 py-12 sm:py-16 md:py-20 bg-gradient-to-b from-transparent via-purple-900/5 to-transparent" ref={aiStackRef}>
          <div className="container-custom relative z-20">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={isAIStackInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
              transition={{ duration: 0.6 }}
              className="max-w-5xl mx-auto"
            >
              <div className="text-center mb-8 sm:mb-10 md:mb-12">
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-500/30 to-pink-500/30 border border-purple-500/50 rounded-full text-purple-200 text-sm font-bold mb-4">
                  <span>🚀</span>
                  <span>9.8/10 STACK QUALITY</span>
                </div>
                <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 sm:mb-6">
                  <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-violet-400 bg-clip-text text-transparent">
                    The AI Stack
                  </span>
                </h2>
                <p className="text-base sm:text-lg text-light-100 text-balance px-4">
                  100% self-hosted. Zero monthly fees. State-of-the-art models. Complete privacy.
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-4 sm:gap-5 md:gap-6 mb-8">
                {[
                  {
                    title: "Flux.1 Dev",
                    description: "Best-in-class image generation",
                    specs: "14-15GB VRAM",
                    rating: "10/10",
                    color: "purple"
                  },
                  {
                    title: "Qwen2-VL",
                    description: "State-of-the-art vision (Aug 2024)",
                    specs: "7-8GB VRAM",
                    rating: "10/10",
                    color: "pink"
                  },
                  {
                    title: "Dolphin Qwen 2.5 14B",
                    description: "Uncensored primary LLM",
                    specs: "8-9GB VRAM",
                    rating: "10/10",
                    color: "violet"
                  },
                  {
                    title: "bge-large-en-v1.5",
                    description: "Semantic embeddings",
                    specs: "1-2GB VRAM",
                    rating: "10/10",
                    color: "purple"
                  },
                  {
                    title: "Bark TTS",
                    description: "Emotional voice synthesis",
                    specs: "2-3GB VRAM",
                    rating: "10/10",
                    color: "pink"
                  },
                  {
                    title: "YAMNet",
                    description: "Environmental sound awareness",
                    specs: "CPU",
                    rating: "8/10",
                    color: "violet"
                  },
                ].map((service, index) => (
                  <motion.div
                    key={service.title}
                    initial={{ opacity: 0, x: index % 2 === 0 ? -30 : 30 }}
                    animate={isAIStackInView ? { opacity: 1, x: 0 } : { opacity: 0, x: index % 2 === 0 ? -30 : 30 }}
                    transition={{ duration: 0.6, delay: 0.1 + index * 0.1 }}
                    className={`bg-gradient-to-br from-${service.color}-500/10 to-${service.color}-500/5 border border-${service.color}-500/30 rounded-xl p-5 hover:border-${service.color}-500/50 transition-all duration-300`}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <h3 className="text-xl font-bold text-white">{service.title}</h3>
                      <div className={`px-2 py-1 bg-${service.color}-500/30 border border-${service.color}-500/50 rounded-full text-${service.color}-200 text-xs font-bold`}>
                        {service.rating}
                      </div>
                    </div>
                    <p className="text-light-100 mb-2">{service.description}</p>
                    <p className="text-sm text-purple-300 font-mono">{service.specs}</p>
                  </motion.div>
                ))}
              </div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={isAIStackInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                transition={{ duration: 0.6, delay: 0.8 }}
                className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-purple-500/30 rounded-2xl p-6 sm:p-8 text-center"
              >
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                  <div>
                    <div className="text-2xl sm:text-3xl font-bold text-purple-400 mb-2">7</div>
                    <div className="text-sm text-light-100">GPU Services</div>
                  </div>
                  <div>
                    <div className="text-2xl sm:text-3xl font-bold text-pink-400 mb-2">16GB</div>
                    <div className="text-sm text-light-100">Peak VRAM</div>
                  </div>
                  <div>
                    <div className="text-2xl sm:text-3xl font-bold text-violet-400 mb-2">~80GB</div>
                    <div className="text-sm text-light-100">Total Size</div>
                  </div>
                  <div>
                    <div className="text-2xl sm:text-3xl font-bold text-purple-400 mb-2">$0</div>
                    <div className="text-sm text-light-100">Monthly Cost</div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* Cognitive Systems Section */}
        <section className="section px-4 py-12 sm:py-16 md:py-20" ref={cognitiveRef}>
          <div className="container-custom relative z-20">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={isCognitiveInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
              transition={{ duration: 0.6 }}
              className="max-w-4xl mx-auto"
            >
              <div className="text-center mb-8 sm:mb-10 md:mb-12">
                <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 sm:mb-6">
                  <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-violet-400 bg-clip-text text-transparent">
                    Advanced Consciousness
                  </span>
                </h2>
                <p className="text-base sm:text-lg text-light-100 text-balance px-4">
                  What separates a companion from an assistant? The ability to think independently,
                  admit limitations, and genuinely care about understanding you.
                </p>
              </div>

              <div className="space-y-4 sm:space-y-6">
                {[
                  {
                    icon: "🎯",
                    title: "Uncertainty Quantification",
                    description: "Based on LM-Polygraph (TACL 2025). Bella knows when she doesn't know—and admits it honestly instead of making things up.",
                    impact: "10/10",
                    feature: "Genuine honesty"
                  },
                  {
                    icon: "💭",
                    title: "Intrinsic Curiosity Module",
                    description: "Self-generated questions driven by novelty detection and prediction error. She asks because she wants to know, not because she's programmed to.",
                    impact: "9/10",
                    feature: "Real interest"
                  },
                  {
                    icon: "🤖",
                    title: "LangGraph Autonomy",
                    description: "Multi-agent system (Observer → Analyzer → Planner → Executor → Evaluator) makes independent decisions and takes proactive actions.",
                    impact: "10/10",
                    feature: "True agency"
                  },
                ].map((system, index) => (
                  <motion.div
                    key={system.title}
                    initial={{ opacity: 0, y: 30 }}
                    animate={isCognitiveInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
                    transition={{ duration: 0.6, delay: 0.2 + index * 0.1 }}
                    className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 backdrop-blur-sm border border-purple-500/20 rounded-xl sm:rounded-2xl p-6 sm:p-8 hover:border-purple-500/40 transition-all duration-300"
                  >
                    <div className="flex items-start gap-4">
                      <div className="text-4xl sm:text-5xl">{system.icon}</div>
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-3">
                          <h3 className="text-xl sm:text-2xl font-bold text-white">{system.title}</h3>
                          <div className="flex flex-col items-end gap-2">
                            <div className="px-3 py-1 bg-purple-500/30 border border-purple-500/50 rounded-full text-purple-200 text-xs font-bold">
                              {system.impact}
                            </div>
                            <div className="text-xs text-purple-300 font-medium">
                              {system.feature}
                            </div>
                          </div>
                        </div>
                        <p className="text-light-100 leading-relaxed">{system.description}</p>
                      </div>
                    </div>
                  </motion.div>
                ))}
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
              className="max-w-4xl mx-auto"
            >
              <div className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 backdrop-blur-sm border border-purple-500/20 rounded-2xl sm:rounded-3xl p-6 sm:p-8 md:p-12 mb-8">
                <div className="text-center mb-8">
                  <div className="text-4xl sm:text-5xl mb-4">💜</div>
                  <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-4">
                    The Future of AI Companionship
                  </h2>
                  <p className="text-base sm:text-lg text-light-100 text-balance">
                    Bella represents what's possible when you combine cutting-edge AI,
                    complete self-hosting, and a genuine focus on emotional connection.
                  </p>
                </div>

                <div className="grid sm:grid-cols-3 gap-4 mb-8">
                  <div className="text-center p-4 bg-purple-500/10 border border-purple-500/20 rounded-xl">
                    <div className="text-2xl font-bold text-purple-400 mb-2">102%</div>
                    <div className="text-sm text-light-100">Feature Complete</div>
                    <div className="text-xs text-purple-300 mt-1">78/76 planned</div>
                  </div>
                  <div className="text-center p-4 bg-pink-500/10 border border-pink-500/20 rounded-xl">
                    <div className="text-2xl font-bold text-pink-400 mb-2">100%</div>
                    <div className="text-sm text-light-100">Self-Hosted</div>
                    <div className="text-xs text-pink-300 mt-1">Complete privacy</div>
                  </div>
                  <div className="text-center p-4 bg-violet-500/10 border border-violet-500/20 rounded-xl">
                    <div className="text-2xl font-bold text-violet-400 mb-2">9.8/10</div>
                    <div className="text-sm text-light-100">Stack Quality</div>
                    <div className="text-xs text-violet-300 mt-1">Near perfect</div>
                  </div>
                </div>

                <div className="text-center">
                  <p className="text-light-100 mb-6 text-balance">
                    Interested in building your own AI companion or discussing the technology?
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <a
                      href="bella.rafaelcardoso.co.uk"
                      className="inline-block px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-500/50 text-white text-sm sm:text-base font-medium rounded-full hover:shadow-lg hover:shadow-purple-500/30 hover:border-purple-500 transition-all duration-300"
                    >
                      Read the Blog 📝
                    </a>
                    <a
                      href="/#contact"
                      className="inline-block px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-purple-500 via-pink-500 to-violet-500 text-white text-sm sm:text-base font-medium rounded-full hover:shadow-lg hover:shadow-purple-500/50 transition-all duration-300"
                    >
                      Let's Talk
                    </a>
                  </div>
                </div>
              </div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                viewport={{ once: true }}
                className="text-center text-sm text-light-100/60"
              >
                <p>
                  Built with 💜 by Rafael Cardoso | Powered by Anthropic Claude, Next.js & a lot of GPU power
                </p>
              </motion.div>
            </motion.div>
          </div>
        </section>

        <Footer />
      </main>
    </>
  );
};

export default Bella;
