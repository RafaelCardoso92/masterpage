"use client";

import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";

interface Skill {
  id: string;
  name: string;
  category: string;
  x: number;
  y: number;
  color: string;
}

const skills: Omit<Skill, "x" | "y">[] = [
  { id: "react", name: "React", category: "Frontend", color: "#61dafb" },
  { id: "nextjs", name: "Next.js", category: "Frontend", color: "#000000" },
  { id: "vue", name: "Vue.js", category: "Frontend", color: "#42b883" },
  { id: "typescript", name: "TypeScript", category: "Frontend", color: "#3178c6" },
  { id: "nodejs", name: "Node.js", category: "Backend", color: "#339933" },
  { id: "php", name: "PHP", category: "Backend", color: "#777bb4" },
  { id: "postgres", name: "PostgreSQL", category: "Backend", color: "#336791" },
  { id: "docker", name: "Docker", category: "DevOps", color: "#2496ed" },
  { id: "linux", name: "Linux", category: "DevOps", color: "#fcc624" },
  { id: "traefik", name: "Traefik", category: "DevOps", color: "#24a1c1" },
  { id: "wordpress", name: "WordPress", category: "CMS", color: "#21759b" },
  { id: "sanity", name: "Sanity", category: "CMS", color: "#f03e2f" },
];

const connections = [
  ["react", "nextjs"],
  ["nextjs", "typescript"],
  ["vue", "typescript"],
  ["react", "typescript"],
  ["nodejs", "nextjs"],
  ["nodejs", "postgres"],
  ["nodejs", "php"],
  ["docker", "nodejs"],
  ["docker", "linux"],
  ["docker", "traefik"],
  ["linux", "traefik"],
  ["wordpress", "php"],
  ["sanity", "nextjs"],
  ["nextjs", "docker"],
];

export const SkillConstellation = () => {
  const [hoveredSkill, setHoveredSkill] = useState<string | null>(null);
  const [positionedSkills, setPositionedSkills] = useState<Skill[]>([]);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  // Initialize skill positions
  useEffect(() => {
    const positions = skills.map((skill, index) => {
      const angle = (index / skills.length) * Math.PI * 2;
      const radius = 180;
      return {
        ...skill,
        x: 250 + Math.cos(angle) * radius,
        y: 250 + Math.sin(angle) * radius,
      };
    });
    setPositionedSkills(positions);
  }, []);

  // Track mouse position
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        setMousePosition({
          x: e.clientX - rect.left,
          y: e.clientY - rect.top,
        });
      }
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  const getConnectedSkills = (skillId: string) => {
    return connections
      .filter((conn) => conn.includes(skillId))
      .flat()
      .filter((id) => id !== skillId);
  };

  const isConnected = (skill1: string, skill2: string) => {
    return connections.some(
      (conn) => (conn[0] === skill1 && conn[1] === skill2) || (conn[0] === skill2 && conn[1] === skill1)
    );
  };

  return (
    <div
      ref={containerRef}
      className="relative w-full h-[500px] bg-dark-200/30 rounded-lg border border-white/10 overflow-hidden"
    >
      <svg className="absolute inset-0 w-full h-full">
        <defs>
          <filter id="glow">
            <feGaussianBlur stdDeviation="3" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Connection Lines */}
        {connections.map(([skill1, skill2], index) => {
          const s1 = positionedSkills.find((s) => s.id === skill1);
          const s2 = positionedSkills.find((s) => s.id === skill2);

          if (!s1 || !s2) return null;

          const isHighlighted =
            hoveredSkill === skill1 || hoveredSkill === skill2;

          return (
            <motion.line
              key={`${skill1}-${skill2}`}
              x1={s1.x}
              y1={s1.y}
              x2={s2.x}
              y2={s2.y}
              stroke={isHighlighted ? "#00d4ff" : "#ffffff"}
              strokeWidth={isHighlighted ? "2" : "1"}
              opacity={isHighlighted ? 0.8 : 0.1}
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 1, delay: index * 0.05 }}
            />
          );
        })}

        {/* Skill Nodes */}
        {positionedSkills.map((skill) => {
          const connectedSkills = getConnectedSkills(skill.id);
          const isHighlighted =
            hoveredSkill === skill.id ||
            (hoveredSkill && connectedSkills.includes(hoveredSkill));

          return (
            <g key={skill.id}>
              <motion.circle
                cx={skill.x}
                cy={skill.y}
                r={isHighlighted ? 25 : 20}
                fill={skill.color}
                opacity={hoveredSkill && !isHighlighted ? 0.3 : 1}
                className="cursor-pointer"
                onMouseEnter={() => setHoveredSkill(skill.id)}
                onMouseLeave={() => setHoveredSkill(null)}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                filter={isHighlighted ? "url(#glow)" : "none"}
              />
              <motion.circle
                cx={skill.x}
                cy={skill.y}
                r={isHighlighted ? 30 : 0}
                fill="none"
                stroke={skill.color}
                strokeWidth="2"
                opacity={0.5}
                animate={{
                  scale: isHighlighted ? [1, 1.2, 1] : 0,
                  opacity: isHighlighted ? [0.5, 0.2, 0.5] : 0,
                }}
                transition={{ duration: 2, repeat: Infinity }}
              />
            </g>
          );
        })}
      </svg>

      {/* Skill Labels */}
      {positionedSkills.map((skill) => {
        const connectedSkills = getConnectedSkills(skill.id);
        const isHighlighted =
          hoveredSkill === skill.id ||
          (hoveredSkill && connectedSkills.includes(hoveredSkill));

        return (
          <motion.div
            key={`label-${skill.id}`}
            className="absolute pointer-events-none"
            style={{
              left: skill.x,
              top: skill.y,
              transform: "translate(-50%, -50%)",
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <div
              className={`text-xs font-medium whitespace-nowrap transition-all ${
                isHighlighted
                  ? "text-white scale-110"
                  : hoveredSkill
                  ? "text-light-100/40"
                  : "text-light-100"
              }`}
            >
              {skill.name}
            </div>
          </motion.div>
        );
      })}

      {/* Info Box */}
      {hoveredSkill && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute bottom-4 left-4 right-4 bg-dark-200/90 backdrop-blur-sm rounded-lg p-4 border border-white/20"
        >
          <div className="text-white font-semibold mb-1">
            {positionedSkills.find((s) => s.id === hoveredSkill)?.name}
          </div>
          <div className="text-xs text-light-100 mb-2">
            {positionedSkills.find((s) => s.id === hoveredSkill)?.category}
          </div>
          <div className="text-xs text-light-100/60">
            Connected to:{" "}
            {getConnectedSkills(hoveredSkill)
              .map((id) => positionedSkills.find((s) => s.id === id)?.name)
              .join(", ")}
          </div>
        </motion.div>
      )}

      {/* Instructions */}
      {!hoveredSkill && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="absolute top-4 left-1/2 -translate-x-1/2 text-center"
        >
          <div className="text-xs text-light-100/60 bg-dark-200/50 backdrop-blur-sm px-4 py-2 rounded-full border border-white/10">
            ✨ Hover over skills to see connections
          </div>
        </motion.div>
      )}
    </div>
  );
};
