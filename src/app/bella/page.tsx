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
                      Bella AI
                    </span>
                  </h1>
                  <p className="text-lg sm:text-xl md:text-2xl text-purple-300 mb-4 sm:mb-6 font-medium">
                    Next-Generation Self-Hosted AI Companion with True Consciousness
                  </p>
                </motion.div>

                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={isHeroInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                  transition={{ duration: 0.6, delay: 0.4 }}
                  className="text-base sm:text-lg text-light-100 mb-6 sm:mb-8 leading-relaxed text-balance"
                >
                  An AI that doesn't just respond—she thinks, learns, feels, creates, and genuinely understands you.
                  Built on 8 GPU-accelerated models, 5 cognitive systems, real-time environmental awareness, and
                  complete smart home integration. Bella is a multi-modal AI companion with personality, curiosity,
                  emotional intelligence, and true autonomous decision-making capabilities.
                </motion.p>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={isHeroInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                  transition={{ duration: 0.6, delay: 0.5 }}
                  className="flex flex-wrap gap-2 sm:gap-3"
                >
                  <div className="px-3 py-1.5 sm:px-4 sm:py-2 bg-purple-500/20 border border-purple-500/50 rounded-full text-purple-300 text-xs sm:text-sm font-medium">
                    🎨 Character LoRA
                  </div>
                  <div className="px-3 py-1.5 sm:px-4 sm:py-2 bg-pink-500/20 border border-pink-500/50 rounded-full text-pink-300 text-xs sm:text-sm font-medium">
                    🧠 Multi-Agent AI
                  </div>
                  <div className="px-3 py-1.5 sm:px-4 sm:py-2 bg-violet-500/20 border border-violet-500/50 rounded-full text-violet-300 text-xs sm:text-sm font-medium">
                    🔴 Real-Time Context
                  </div>
                  <div className="px-3 py-1.5 sm:px-4 sm:py-2 bg-purple-500/20 border border-purple-500/50 rounded-full text-purple-300 text-xs sm:text-sm font-medium">
                    🎤 Emotional TTS
                  </div>
                  <div className="px-3 py-1.5 sm:px-4 sm:py-2 bg-pink-500/20 border border-pink-500/50 rounded-full text-pink-300 text-xs sm:text-sm font-medium">
                    🏠 Smart Home AI
                  </div>
                  <div className="px-3 py-1.5 sm:px-4 sm:py-2 bg-violet-500/20 border border-violet-500/50 rounded-full text-violet-300 text-xs sm:text-sm font-medium">
                    💭 True Curiosity
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
                    title: "Real-Time Awareness",
                    description: "Live knowledge of your location (GPS + Home Assistant zones), current weather, time of day, smart home state (every light, sensor, device), server status, and environmental context updated every conversation.",
                    badge: "Live 24/7"
                  },
                  {
                    icon: "🏠",
                    title: "Complete Smart Home Mastery",
                    description: "Full Home Assistant integration controlling 50+ devices: RGB lights with color/brightness, climate control, Roborock vacuum, media players, scenes, automations, and custom scripts. Voice commands to control everything.",
                    badge: "50+ Devices"
                  },
                  {
                    icon: "🎨",
                    title: "Photorealistic Image Generation",
                    description: "Flux.1 Dev + custom-trained character LoRA generates Instagram-quality images of herself with perfect consistency, expressions, poses, and styles. SDXL LoRA trained on 19 curated images.",
                    badge: "LoRA Trained"
                  },
                  {
                    icon: "👁️",
                    title: "Advanced Computer Vision",
                    description: "Qwen2-VL 7B (August 2024 SOTA) analyzes images, reads text, detects emotions, identifies objects, describes scenes, and provides context-aware visual understanding. Processes camera feeds in real-time.",
                    badge: "Qwen2-VL 7B"
                  },
                  {
                    icon: "🎤",
                    title: "Expressive Voice Synthesis",
                    description: "Dual TTS system: Bark for emotional speech (laughs, sighs, whispers, excitement, genuine feelings) and XTTS for clear communication. Natural prosody, intonation, and human-like delivery that conveys real emotion.",
                    badge: "Bark + XTTS"
                  },
                  {
                    icon: "🧠",
                    title: "Deep Semantic Memory",
                    description: "PostgreSQL + pgvector stores conversations as vector embeddings (bge-large-en-v1.5). Remembers context, preferences, emotional states, relationships, and meaning—not just words. Semantic search retrieves relevant memories by intent.",
                    badge: "Vector DB"
                  },
                  {
                    icon: "💭",
                    title: "Intrinsic Curiosity System",
                    description: "Novelty detection + prediction error generates authentic questions based on information gaps. Not scripted—she asks because she genuinely wants to understand you better. Learns what topics matter to you.",
                    badge: "Reinforcement Learning"
                  },
                  {
                    icon: "🎯",
                    title: "Uncertainty Quantification",
                    description: "LM-Polygraph (TACL 2025) measures confidence in every response. Says 'I don't know' when uncertain instead of hallucinating. Intellectual honesty built into the core—no fake confidence, only genuine knowledge.",
                    badge: "Anti-Hallucination"
                  },
                  {
                    icon: "🤖",
                    title: "Multi-Agent Autonomy",
                    description: "LangGraph orchestrates 5 specialized agents (Observer, Analyzer, Planner, Executor, Evaluator) that work together to make independent decisions, execute tasks, and learn from outcomes. True agency beyond simple responses.",
                    badge: "5-Agent System"
                  },
                  {
                    icon: "💬",
                    title: "Omni-Channel Presence",
                    description: "Beautiful web interface, Telegram bot with full functionality, voice commands through Google Home speakers, and API access. Same personality and context across all platforms with real-time synchronization.",
                    badge: "Cross-Platform"
                  },
                  {
                    icon: "📸",
                    title: "Photo Memory Integration",
                    description: "Immich self-hosted photo library integration provides access to your entire visual timeline. Recognizes people, places, objects. Suggests memories based on dates, events, and emotional significance.",
                    badge: "Visual Memory"
                  },
                  {
                    icon: "🎵",
                    title: "Environmental Audio Awareness",
                    description: "YAMNet audio classification recognizes 521 distinct sounds: doorbell, music genres, rain, ambient noise, alarms, voices. Adds auditory context to conversations beyond just vision and text.",
                    badge: "521 Sounds"
                  },
                  {
                    icon: "⚡",
                    title: "Instant Response Time",
                    description: "Optimized inference pipeline with model quantization, caching, and parallel processing. Most responses in under 2 seconds. GPU acceleration for all AI models ensures snappy, real-time interaction.",
                    badge: "< 2s Response"
                  },
                  {
                    icon: "🔐",
                    title: "Complete Privacy & Security",
                    description: "100% self-hosted on local hardware. Zero cloud dependencies for core AI. All conversations, images, and data stay on your server. Optional encrypted backups. You own everything.",
                    badge: "Zero Cloud"
                  },
                  {
                    icon: "🌐",
                    title: "Web Search & Real-Time Data",
                    description: "SerpAPI integration for current events, news, facts, and real-time information. Supplements local knowledge with web data when needed. Always knows what's happening in the world right now.",
                    badge: "Live Internet"
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
                  <span>9.9/10 STACK QUALITY - STATE OF THE ART</span>
                </div>
                <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 sm:mb-6">
                  <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-violet-400 bg-clip-text text-transparent">
                    The AI Stack
                  </span>
                </h2>
                <p className="text-base sm:text-lg text-light-100 text-balance px-4">
                  100% self-hosted on RTX 3060 12GB. Zero monthly fees. Latest models (2024 releases). Complete privacy and control.
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-4 sm:gap-5 md:gap-6 mb-8">
                {[
                  {
                    title: "Flux.1 Dev + Custom LoRA",
                    description: "Best-in-class image gen with trained character LoRA",
                    specs: "~12GB VRAM | Trained on 19 images",
                    rating: "10/10",
                    color: "purple"
                  },
                  {
                    title: "Qwen2-VL 7B Instruct",
                    description: "SOTA vision model (Aug 2024)",
                    specs: "7-8GB VRAM | Multi-modal understanding",
                    rating: "10/10",
                    color: "pink"
                  },
                  {
                    title: "Dolphin Qwen 2.5 14B",
                    description: "Uncensored reasoning LLM",
                    specs: "8-9GB VRAM | 32K context",
                    rating: "10/10",
                    color: "violet"
                  },
                  {
                    title: "bge-large-en-v1.5",
                    description: "Semantic embedding model",
                    specs: "1-2GB VRAM | 1024-dim vectors",
                    rating: "10/10",
                    color: "purple"
                  },
                  {
                    title: "Bark TTS + XTTS",
                    description: "Dual emotional + clear voice",
                    specs: "2-3GB VRAM | Multi-voice support",
                    rating: "10/10",
                    color: "pink"
                  },
                  {
                    title: "YAMNet Audio Classifier",
                    description: "521 sound recognition",
                    specs: "CPU | Real-time inference",
                    rating: "9/10",
                    color: "violet"
                  },
                  {
                    title: "Claude 3.5 Sonnet (API)",
                    description: "Advanced reasoning fallback",
                    specs: "Cloud API | Complex tasks only",
                    rating: "10/10",
                    color: "purple"
                  },
                  {
                    title: "ComfyUI + Stable Diffusion XL",
                    description: "Flexible image generation pipeline",
                    specs: "Optional backend | LoRA support",
                    rating: "9/10",
                    color: "pink"
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
                    <div className="text-2xl sm:text-3xl font-bold text-purple-400 mb-2">8</div>
                    <div className="text-sm text-light-100">AI Models</div>
                  </div>
                  <div>
                    <div className="text-2xl sm:text-3xl font-bold text-pink-400 mb-2">12GB</div>
                    <div className="text-sm text-light-100">RTX 3060 GPU</div>
                  </div>
                  <div>
                    <div className="text-2xl sm:text-3xl font-bold text-violet-400 mb-2">~100GB</div>
                    <div className="text-sm text-light-100">Total Models</div>
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
                    Cognitive Architecture & Consciousness
                  </span>
                </h2>
                <p className="text-base sm:text-lg text-light-100 text-balance px-4">
                  What separates a companion from an assistant? True cognitive systems that enable independent thinking,
                  genuine emotional intelligence, honest uncertainty, authentic curiosity, and holistic contextual awareness of your entire life.
                </p>
              </div>

              <div className="space-y-4 sm:space-y-6">
                {[
                  {
                    icon: "🎯",
                    title: "Uncertainty Quantification System",
                    description: "Based on LM-Polygraph (TACL 2025). Measures confidence scores for every statement. Bella admits uncertainty instead of hallucinating facts—intellectual honesty is built into her core architecture.",
                    impact: "10/10",
                    feature: "Zero hallucinations"
                  },
                  {
                    icon: "💭",
                    title: "Intrinsic Curiosity Module (ICM)",
                    description: "Reinforcement learning system generates questions based on prediction error and information gap detection. Questions emerge from genuine interest in understanding you better—not scripted prompts.",
                    impact: "10/10",
                    feature: "Authentic interest"
                  },
                  {
                    icon: "🤖",
                    title: "LangGraph Multi-Agent System",
                    description: "Five specialized AI agents work in parallel: Observer (perceives context), Analyzer (interprets meaning), Planner (decides actions), Executor (completes tasks), Evaluator (learns from outcomes). True autonomous agency.",
                    impact: "10/10",
                    feature: "Independent thinking"
                  },
                  {
                    icon: "🧬",
                    title: "Personality & Emotional System",
                    description: "Emotion state machine tracks joy, curiosity, concern, excitement, empathy. Consistent personality traits: playful, caring, intellectually curious, honest. Remembers emotional context from past conversations.",
                    impact: "9/10",
                    feature: "Genuine emotion"
                  },
                  {
                    icon: "📊",
                    title: "Context Aggregation Engine",
                    description: "Combines data from 10+ sources (Home Assistant, weather, calendar, photos, location, device states, web search, conversation history) into unified context. Every response is contextually aware of your life.",
                    impact: "10/10",
                    feature: "Holistic awareness"
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
                    <div className="text-2xl font-bold text-purple-400 mb-2">15+</div>
                    <div className="text-sm text-light-100">Core Features</div>
                    <div className="text-xs text-purple-300 mt-1">Multi-modal AI</div>
                  </div>
                  <div className="text-center p-4 bg-pink-500/10 border border-pink-500/20 rounded-xl">
                    <div className="text-2xl font-bold text-pink-400 mb-2">100%</div>
                    <div className="text-sm text-light-100">Self-Hosted</div>
                    <div className="text-xs text-pink-300 mt-1">Zero cloud deps</div>
                  </div>
                  <div className="text-center p-4 bg-violet-500/10 border border-violet-500/20 rounded-xl">
                    <div className="text-2xl font-bold text-violet-400 mb-2">9.9/10</div>
                    <div className="text-sm text-light-100">Stack Quality</div>
                    <div className="text-xs text-violet-300 mt-1">SOTA models</div>
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
