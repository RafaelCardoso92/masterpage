"use client";

import { useState, useRef } from "react";
import { motion, useMotionValue, useTransform, useSpring } from "framer-motion";

interface Project {
  year: string;
  title: string;
  description: string;
  achievement: string;
  icon: string;
  color: string;
}

const projects: Project[] = [
  {
    year: "2019",
    title: "Web Development Journey",
    description: "Started building websites with WordPress and PHP",
    achievement: "Built 5+ client websites",
    icon: "🌱",
    color: "#10b981",
  },
  {
    year: "2020",
    title: "React & Modern Stack",
    description: "Transitioned to React and modern JavaScript frameworks",
    achievement: "Mastered React ecosystem",
    icon: "⚛️",
    color: "#61dafb",
  },
  {
    year: "2021",
    title: "Full-Stack Development",
    description: "Expanded to backend with Node.js and databases",
    achievement: "Built 10+ full-stack apps",
    icon: "🚀",
    color: "#8b5cf6",
  },
  {
    year: "2022",
    title: "DevOps & Infrastructure",
    description: "Learned Docker, CI/CD, and server administration",
    achievement: "Deployed production systems",
    icon: "🐳",
    color: "#2496ed",
  },
  {
    year: "2023",
    title: "Home Server Project",
    description: "Built production-grade home server with RAID, monitoring, automation",
    achievement: "99.9% uptime with 20+ services",
    icon: "🖥️",
    color: "#f59e0b",
  },
  {
    year: "2024",
    title: "Case Analyser Platform",
    description: "Architected and deployed comprehensive case management system",
    achievement: "Production app serving real users",
    icon: "⚖️",
    color: "#ec4899",
  },
  {
    year: "2025",
    title: "Continuous Innovation",
    description: "Expanding skills, building new projects, and pushing boundaries",
    achievement: "Always learning, always building",
    icon: "✨",
    color: "#06b6d4",
  },
];

export const InteractiveTimeline = () => {
  const [activeIndex, setActiveIndex] = useState(6);
  const constraintsRef = useRef(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const xSpring = useSpring(x, { stiffness: 300, damping: 30 });

  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: -400, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: 400, behavior: 'smooth' });
    }
  };

  return (
    <div className="relative w-full overflow-hidden min-h-[700px]">
      {/* Scroll Buttons */}
      <button
        onClick={scrollLeft}
        className="absolute left-4 top-1/2 -translate-y-1/2 z-30 w-12 h-12 rounded-full bg-accent/90 hover:bg-accent text-white flex items-center justify-center shadow-lg hover:scale-110 transition-all"
        aria-label="Scroll left"
      >
        ←
      </button>
      <button
        onClick={scrollRight}
        className="absolute right-4 top-1/2 -translate-y-1/2 z-30 w-12 h-12 rounded-full bg-accent/90 hover:bg-accent text-white flex items-center justify-center shadow-lg hover:scale-110 transition-all"
        aria-label="Scroll right"
      >
        →
      </button>

      {/* Timeline Container */}
      <div ref={scrollContainerRef} className="relative py-20 overflow-x-auto overflow-y-visible scrollbar-thin scrollbar-thumb-accent/50 scrollbar-track-white/5 hover:scrollbar-thumb-accent">
        <motion.div
          drag="x"
          dragConstraints={constraintsRef}
          dragElastic={0.1}
          whileDrag={{ cursor: "grabbing" }}
          className="flex items-center gap-12 px-8 min-w-max cursor-grab active:cursor-grabbing"
        >
          {projects.map((project, index) => {
            const isActive = index === activeIndex;
            const isPast = index < activeIndex;
            const isFuture = index > activeIndex;

            return (
              <div key={project.year} className="relative flex flex-col items-center">
                {/* Connection Line */}
                {index > 0 && (
                  <div
                    className={`absolute left-0 top-[90px] w-full h-2 -translate-x-full transition-all duration-500 ${
                      isPast ? "bg-gradient-to-r from-accent to-accent-dark" : "bg-white/10"
                    }`}
                  />
                )}

                {/* Timeline Node */}
                <motion.div
                  className="relative z-10 cursor-pointer"
                  onHoverStart={() => setActiveIndex(index)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <motion.div
                    className={`relative w-48 h-48 rounded-full flex items-center justify-center border-4 transition-all duration-500 ${
                      isActive
                        ? "border-accent shadow-[0_0_40px_rgba(0,212,255,0.6)]"
                        : isPast
                        ? "border-accent/50"
                        : "border-white/20"
                    }`}
                    style={{ backgroundColor: project.color }}
                    animate={{
                      scale: isActive ? 1 : 0.9,
                      opacity: isFuture ? 0.6 : 1,
                    }}
                  >
                    <span className="text-7xl">{project.icon}</span>

                    {/* Pulse Effect */}
                    {isActive && (
                      <motion.div
                        className="absolute inset-0 rounded-full border-4 border-accent"
                        initial={{ scale: 1, opacity: 1 }}
                        animate={{ scale: 1.5, opacity: 0 }}
                        transition={{ duration: 2, repeat: Infinity }}
                      />
                    )}
                  </motion.div>

                  {/* Year Label */}
                  <div
                    className={`absolute -top-12 left-1/2 -translate-x-1/2 text-2xl font-bold whitespace-nowrap transition-all ${
                      isActive ? "text-accent scale-110" : "text-light-100"
                    }`}
                  >
                    {project.year}
                  </div>
                </motion.div>

                {/* Project Details Card */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{
                    opacity: isActive ? 1 : 0,
                    y: isActive ? 0 : 20,
                    pointerEvents: isActive ? "auto" : "none",
                  }}
                  transition={{ duration: 0.3 }}
                  className="absolute top-56 w-80 bg-dark-200/90 backdrop-blur-sm rounded-xl p-6 border border-white/20 shadow-2xl"
                  style={{ borderColor: project.color }}
                >
                  <div className="flex items-center gap-3 mb-3">
                    <span className="text-3xl">{project.icon}</span>
                    <h3 className="text-xl font-bold text-white">{project.title}</h3>
                  </div>
                  <p className="text-sm text-light-100 mb-4">{project.description}</p>
                  <div
                    className="inline-block px-3 py-1 rounded-full text-xs font-medium"
                    style={{
                      backgroundColor: `${project.color}20`,
                      color: project.color,
                      borderColor: project.color,
                      borderWidth: "1px",
                    }}
                  >
                    {project.achievement}
                  </div>
                </motion.div>
              </div>
            );
          })}
        </motion.div>
      </div>

      {/* Navigation Hint */}
      <div className="text-center mt-8">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="inline-block text-xs text-light-100/60 bg-dark-200/50 backdrop-blur-sm px-4 py-2 rounded-full border border-white/10"
        >
          ← Use arrow buttons, drag, or scroll to explore →
        </motion.div>
      </div>

      {/* Progress Indicator */}
      <div className="flex justify-center gap-2 mt-6">
        {projects.map((_, index) => (
          <button
            key={index}
            onClick={() => setActiveIndex(index)}
            className={`w-2 h-2 rounded-full transition-all duration-300 ${
              index === activeIndex
                ? "bg-accent w-8"
                : index < activeIndex
                ? "bg-accent/50"
                : "bg-white/20"
            }`}
          />
        ))}
      </div>

      <style jsx>{`
        .scrollbar-thin::-webkit-scrollbar {
          height: 8px;
        }
        .scrollbar-thin::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.05);
          border-radius: 10px;
        }
        .scrollbar-thin::-webkit-scrollbar-thumb {
          background: rgba(0, 212, 255, 0.5);
          border-radius: 10px;
        }
        .scrollbar-thin::-webkit-scrollbar-thumb:hover {
          background: rgba(0, 212, 255, 0.8);
        }
      `}</style>
    </div>
  );
};
