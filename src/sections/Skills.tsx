"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { TiltCard } from "../components";

const skills = [
  {
    category: "Frontend",
    items: [
      { name: "React", level: 95 },
      { name: "Next.js", level: 90 },
      { name: "Vue.js", level: 85 },
      { name: "TypeScript", level: 90 },
      { name: "Tailwind CSS", level: 95 },
    ],
  },
  {
    category: "Backend",
    items: [
      { name: "Node.js", level: 85 },
      { name: "PHP", level: 80 },
      { name: "PostgreSQL", level: 85 },
      { name: "REST APIs", level: 90 },
    ],
  },
  {
    category: "CMS & Content",
    items: [
      { name: "WordPress", level: 85 },
      { name: "Sanity CMS", level: 80 },
      { name: "Drupal", level: 75 },
      { name: "SEO", level: 85 },
    ],
  },
  {
    category: "DevOps & Infrastructure",
    items: [
      { name: "Docker", level: 90 },
      { name: "Server Administration", level: 90 },
      { name: "Linux", level: 90 },
      { name: "Git", level: 90 },
    ],
  },
];

const Skills = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section className="section relative" id="skills" ref={ref}>
      <div className="container-custom relative z-20">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12 sm:mb-16"
        >
          <span className="inline-block px-4 py-2 bg-white/5 backdrop-blur-sm border border-white/10 rounded-full text-xs sm:text-sm text-light-100 font-medium mb-4">
            Skills & Expertise
          </span>
          <h2 className="text-display font-bold text-white mb-4 sm:mb-6 px-4">
            Technologies I Work With
          </h2>
          <p className="text-base sm:text-lg text-light-100 max-w-3xl mx-auto text-balance px-4">
            A comprehensive set of modern technologies and tools to bring your ideas to life.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6 sm:gap-8 max-w-6xl mx-auto">
          {skills.map((category, categoryIndex) => (
            <TiltCard key={category.category}>
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
                transition={{ duration: 0.6, delay: categoryIndex * 0.1 }}
                className="card-glass p-8"
              >
              <h3 className="text-2xl font-semibold text-white mb-6">
                {category.category}
              </h3>
              <div className="space-y-6">
                {category.items.map((skill, skillIndex) => (
                  <motion.div
                    key={skill.name}
                    initial={{ opacity: 0, x: -20 }}
                    animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
                    transition={{
                      duration: 0.5,
                      delay: categoryIndex * 0.1 + skillIndex * 0.1,
                    }}
                  >
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium text-light-100">
                        {skill.name}
                      </span>
                      <span className="text-sm text-accent">{skill.level}%</span>
                    </div>
                    <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={isInView ? { width: `${skill.level}%` } : { width: 0 }}
                        transition={{
                          duration: 1,
                          delay: categoryIndex * 0.1 + skillIndex * 0.1 + 0.3,
                          ease: "easeOut",
                        }}
                        className="h-full bg-gradient-to-r from-accent to-accent-dark rounded-full"
                      />
                    </div>
                  </motion.div>
                ))}
              </div>
              </motion.div>
            </TiltCard>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Skills;
