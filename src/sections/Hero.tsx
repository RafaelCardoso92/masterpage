"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { TextReveal } from "../components";

const Hero = () => {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], ["0%", "40%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.6, 1], [1, 0.6, 0]);
  const scale = useTransform(scrollYProgress, [0, 1], [1, 0.95]);

  return (
    <section
      ref={ref}
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
      id="home"
    >
      {/* Deep dark background with warmth */}
      <div className="absolute inset-0 z-0 bg-gradient-to-br from-dark via-dark-100 to-sensual-wine/20" />

      {/* Simplified glow effects - CSS only for performance */}
      <motion.div
        style={{ y, opacity }}
        className="absolute inset-0 z-0 pointer-events-none"
      >
        <div className="absolute top-1/3 left-1/4 w-[450px] h-[450px] bg-accent/20 rounded-full blur-[140px] animate-pulse" />
        <div className="absolute bottom-1/4 right-1/3 w-[400px] h-[400px] bg-sensual-rose/12 rounded-full blur-[130px]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-passion-flame/8 rounded-full blur-[160px]" />
      </motion.div>

      {/* Content */}
      <motion.div
        style={{ y, opacity, scale }}
        className="container-custom relative z-20 text-center pt-20 px-4"
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, delay: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
          className="mb-10"
        >
          <span className="inline-block px-6 py-3 bg-gradient-to-r from-accent/15 via-sensual-rose/10 to-passion-flame/10 backdrop-blur-md border border-white/8 rounded-full text-sm text-light-100/90 font-medium tracking-wider uppercase">
            Full-Stack Developer & Creative Technologist
          </span>
        </motion.div>

        <h1 className="text-display-large font-bold mb-10 text-white px-2 leading-[0.95]">
          <TextReveal text="I Build What" delay={0.5} />
          <br />
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, delay: 0.9 }}
            className="inline-block"
          >
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent-warm via-sensual-rose to-passion-flame drop-shadow-[0_0_30px_rgba(244,63,94,0.3)]">
              Others Dream
            </span>
          </motion.span>
        </h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 1.2, ease: [0.25, 0.1, 0.25, 1] }}
          className="text-lg sm:text-xl text-light-100/75 max-w-2xl mx-auto mb-16 leading-relaxed px-4"
        >
          Turning complex visions into{" "}
          <span className="text-white/90 font-medium">elegant realities</span>.
          <br className="hidden sm:block" />
          Every line of code written with{" "}
          <span className="text-sensual-rose">intention</span>,{" "}
          <span className="text-accent-warm">precision</span>, and{" "}
          <span className="text-passion-flame">soul</span>.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 1.5, ease: [0.25, 0.1, 0.25, 1] }}
          className="flex flex-col sm:flex-row gap-6 justify-center items-center"
        >
          <motion.a
            href="#work"
            className="group relative px-10 py-4 bg-gradient-to-r from-sensual-light to-accent text-white font-semibold rounded-xl overflow-hidden transition-all duration-700 shadow-xl shadow-sensual-rose/20 hover:shadow-sensual-rose/40"
            whileHover={{ scale: 1.04, y: -3 }}
            whileTap={{ scale: 0.98 }}
          >
            <span className="relative z-10 tracking-wide">Experience My Work</span>
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-passion-glow to-sensual-rose"
              initial={{ x: "-100%" }}
              whileHover={{ x: "0%" }}
              transition={{ duration: 0.6, ease: "easeOut" }}
            />
          </motion.a>
          <motion.a
            href="#contact"
            className="px-10 py-4 bg-white/5 backdrop-blur-sm text-white font-semibold rounded-xl border border-white/10 hover:border-sensual-rose/40 hover:bg-sensual-wine/10 transition-all duration-700 tracking-wide"
            whileHover={{ scale: 1.04, y: -3 }}
            whileTap={{ scale: 0.98 }}
          >
            Let&apos;s Create Together
          </motion.a>
        </motion.div>

        {/* Subtle tech signature */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 2, delay: 2.5 }}
          className="mt-20 flex justify-center gap-8 text-xs text-white/30 font-mono tracking-widest uppercase"
        >
          <span>React</span>
          <span className="text-sensual-rose/50">•</span>
          <span>Next.js</span>
          <span className="text-accent-warm/50">•</span>
          <span>TypeScript</span>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.5, delay: 3 }}
          className="absolute bottom-12 left-1/2 -translate-x-1/2"
        >
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
            className="w-7 h-11 border border-white/15 rounded-full p-2 flex justify-center backdrop-blur-sm"
          >
            <motion.div
              animate={{ y: [0, 14, 0], opacity: [0.8, 0.2, 0.8] }}
              transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
              className="w-1.5 h-1.5 bg-gradient-to-b from-sensual-rose to-passion-flame rounded-full"
            />
          </motion.div>
        </motion.div>
      </motion.div>
    </section>
  );
};

export default Hero;
