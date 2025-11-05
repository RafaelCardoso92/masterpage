"use client";

import { motion } from "framer-motion";

const AnimatedGradient = () => {
  return (
    <div className="fixed inset-0 z-0 overflow-hidden">
      {/* Animated gradient orbs - optimized for performance */}
      <motion.div
        animate={{
          x: [0, 100, 0],
          y: [0, -100, 0],
          scale: [1, 1.2, 1],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "easeInOut",
          repeatType: "loop",
        }}
        className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-accent/20 rounded-full blur-[150px] will-change-transform"
      />

      <motion.div
        animate={{
          x: [0, -100, 0],
          y: [0, 100, 0],
          scale: [1, 1.3, 1],
        }}
        transition={{
          duration: 25,
          repeat: Infinity,
          ease: "easeInOut",
          repeatType: "loop",
        }}
        className="absolute bottom-0 right-1/4 w-[600px] h-[600px] bg-accent/10 rounded-full blur-[150px] will-change-transform"
      />
    </div>
  );
};

export default AnimatedGradient;
