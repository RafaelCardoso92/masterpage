"use client";

import { motion, useInView } from "framer-motion";
import { useRef, useState } from "react";
import Image from "next/image";
import { TiltCard } from "../components";

const projects = [
  {
    id: 1,
    title: "Case Analyser",
    description:
      "Comprehensive divorce case management platform with intelligent analytics and automated workflows for legal professionals.",
    tags: ["Next.js", "TypeScript", "PostgreSQL", "Docker"],
    image: "/projects/caseanalyser.png",
    link: "https://caseanalyser.co.uk",
  },
  {
    id: 2,
    title: "Doncaster Road Garage",
    description:
      "Modern automotive service website featuring online booking, service tracking, and expert auto repair solutions in Sheffield.",
    tags: ["Next.js", "Tailwind", "Framer Motion"],
    image: "/projects/garage.png",
    link: "https://garage.rafaelcardoso.co.uk",
  },
  {
    id: 3,
    title: "Let Rent",
    description:
      "Elegant property rental management platform with advanced search, filtering, and modern UI for seamless tenant experience.",
    tags: ["Next.js", "Sanity CMS", "TypeScript"],
    image: "/projects/let.png",
    link: "https://let.rafaelcardoso.co.uk",
  },
  {
    id: 4,
    title: "Meagan Portfolio",
    description:
      "Creative portfolio showcase with stunning animations and visual effects, highlighting design excellence and modern web capabilities.",
    tags: ["Next.js", "Framer Motion", "Tailwind"],
    image: "/projects/meags.png",
    link: "https://meags.rafaelcardoso.co.uk",
  },
  {
    id: 5,
    title: "Electric",
    description:
      "Modern electrical services platform showcasing professional solutions with sleek design and intuitive user experience.",
    tags: ["Next.js", "TypeScript", "Tailwind"],
    image: "/projects/electric.png",
    link: "https://electric.rafaelcardoso.co.uk",
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

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 max-w-6xl mx-auto">
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
              {}
              <div className="relative h-64 bg-dark-200 overflow-hidden">
                <motion.div
                  animate={{
                    scale: hoveredIndex === index ? 1.1 : 1,
                  }}
                  transition={{ duration: 0.6, ease: "easeOut" }}
                  className="w-full h-full relative"
                >
                  <Image
                    src={project.image}
                    alt={project.title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-br from-accent/10 to-transparent" />
                </motion.div>

                {}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: hoveredIndex === index ? 1 : 0 }}
                  className="absolute inset-0 bg-gradient-to-t from-dark/90 to-transparent flex items-end justify-center pb-6"
                >
                  <a
                    href={project.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-secondary text-sm"
                  >
                    View Project
                  </a>
                </motion.div>
              </div>

              {}
              <div className="p-6">
                <h3 className="text-xl font-semibold text-white mb-3">
                  {project.title}
                </h3>
                <p className="text-light-100 text-sm leading-relaxed mb-4">
                  {project.description}
                </p>

                {}
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
