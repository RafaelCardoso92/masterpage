"use client";

import { motion, useInView } from "framer-motion";
import { useRef, useState } from "react";
import Image from "next/image";
import { TiltCard } from "../components";

const projects = [
  {
    id: 1,
    title: "E-Commerce Platform",
    description:
      "A modern, high-performance e-commerce solution built with Next.js and Stripe integration.",
    tags: ["Next.js", "TypeScript", "Stripe", "Tailwind"],
    image: "/placeholder-project.jpg",
    link: "#",
  },
  {
    id: 2,
    title: "SaaS Dashboard",
    description:
      "Intuitive analytics dashboard with real-time data visualization and user management.",
    tags: ["React", "Node.js", "MongoDB", "Chart.js"],
    image: "/placeholder-project.jpg",
    link: "#",
  },
  {
    id: 3,
    title: "Portfolio Website",
    description:
      "Creative portfolio showcase with smooth animations and stunning visual effects.",
    tags: ["Next.js", "Framer Motion", "GSAP"],
    image: "/placeholder-project.jpg",
    link: "#",
  },
];

const Work = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  return (
    <section className="section relative" id="work" ref={ref}>
      <div className="container-custom relative z-20">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12 sm:mb-16"
        >
          <span className="inline-block px-4 py-2 bg-white/5 backdrop-blur-sm border border-white/10 rounded-full text-xs sm:text-sm text-light-100 font-medium mb-4">
            Featured Work
          </span>
          <h2 className="text-display font-bold text-white mb-4 sm:mb-6 px-4">
            Selected Projects
          </h2>
          <p className="text-base sm:text-lg text-light-100 max-w-3xl mx-auto text-balance px-4">
            A collection of projects that showcase my expertise in building modern web applications.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 max-w-7xl mx-auto">
          {projects.map((project, index) => (
            <TiltCard key={project.id}>
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
                className="group relative card-glass overflow-hidden"
              >
              {/* Image Container */}
              <div className="relative h-64 bg-dark-200 overflow-hidden">
                <motion.div
                  animate={{
                    scale: hoveredIndex === index ? 1.1 : 1,
                  }}
                  transition={{ duration: 0.6, ease: "easeOut" }}
                  className="w-full h-full bg-gradient-to-br from-accent/20 to-accent/5 flex items-center justify-center"
                >
                  <svg
                    className="w-20 h-20 text-white/20"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                </motion.div>

                {/* Overlay on hover */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: hoveredIndex === index ? 1 : 0 }}
                  className="absolute inset-0 bg-gradient-to-t from-dark/90 to-transparent flex items-end justify-center pb-6"
                >
                  <a
                    href={project.link}
                    className="btn-secondary text-sm"
                  >
                    View Project
                  </a>
                </motion.div>
              </div>

              {/* Content */}
              <div className="p-6">
                <h3 className="text-xl font-semibold text-white mb-3">
                  {project.title}
                </h3>
                <p className="text-light-100 text-sm leading-relaxed mb-4">
                  {project.description}
                </p>

                {/* Tags */}
                <div className="flex flex-wrap gap-2">
                  {project.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-3 py-1 text-xs font-medium bg-white/5 text-light-100 rounded-full border border-white/10"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
              </motion.div>
            </TiltCard>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Work;
