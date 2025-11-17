"use client";

import { motion } from "framer-motion";

const GridBackground = () => {
  return (
    <div className="fixed inset-0 z-10 overflow-hidden pointer-events-none">
      {}
      <div
        className="absolute inset-0 opacity-[0.15]"
        style={{
          backgroundImage: `radial-gradient(circle, rgba(255, 255, 255, 0.15) 1px, transparent 1px)`,
          backgroundSize: "40px 40px",
        }}
      />

      {/* Animated Grid Lines */}
      <svg className="absolute inset-0 w-full h-full">
        <defs>
          <pattern
            id="grid"
            width="80"
            height="80"
            patternUnits="userSpaceOnUse"
          >
            <motion.path
              d="M 80 0 L 0 0 0 80"
              fill="none"
              stroke="rgba(255, 255, 255, 0.05)"
              strokeWidth="0.5"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 1 }}
              transition={{ duration: 2, ease: "easeInOut" }}
            />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid)" />
      </svg>
    </div>
  );
};

export default GridBackground;
