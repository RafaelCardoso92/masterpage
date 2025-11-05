"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { TiltCard } from "../components";

const About = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut",
      },
    },
  };

  return (
    <section className="section relative overflow-hidden" id="about" ref={ref}>
      <div className="container-custom relative z-20">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="max-w-5xl mx-auto"
        >
          <motion.div variants={itemVariants} className="text-center mb-12 sm:mb-16">
            <span className="inline-block px-4 py-2 bg-white/5 backdrop-blur-sm border border-white/10 rounded-full text-xs sm:text-sm text-light-100 font-medium mb-4">
              About Me
            </span>
            <h2 className="text-display font-bold text-white mb-4 sm:mb-6 px-4">
              Turning Vision Into Reality
            </h2>
            <p className="text-base sm:text-lg text-light-100 max-w-3xl mx-auto text-balance px-4">
              I'm a passionate full-stack developer with expertise in modern web technologies.
              I specialize in creating seamless user experiences and robust applications that
              make a difference.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8">
            <TiltCard>
              <motion.div variants={itemVariants} className="card-glass p-8">
              <div className="w-12 h-12 bg-accent/20 rounded-2xl flex items-center justify-center mb-4">
                <svg
                  className="w-6 h-6 text-accent"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 10V3L4 14h7v7l9-11h-7z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">Fast Performance</h3>
              <p className="text-light-100 leading-relaxed">
                Optimized applications with lightning-fast load times and smooth interactions.
              </p>
              </motion.div>
            </TiltCard>

            <TiltCard>
              <motion.div variants={itemVariants} className="card-glass p-8">
              <div className="w-12 h-12 bg-accent/20 rounded-2xl flex items-center justify-center mb-4">
                <svg
                  className="w-6 h-6 text-accent"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">Responsive Design</h3>
              <p className="text-light-100 leading-relaxed">
                Beautiful interfaces that work flawlessly across all devices and screen sizes.
              </p>
              </motion.div>
            </TiltCard>

            <TiltCard>
              <motion.div variants={itemVariants} className="card-glass p-8">
              <div className="w-12 h-12 bg-accent/20 rounded-2xl flex items-center justify-center mb-4">
                <svg
                  className="w-6 h-6 text-accent"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">Clean Code</h3>
              <p className="text-light-100 leading-relaxed">
                Maintainable, scalable code following best practices and modern standards.
              </p>
              </motion.div>
            </TiltCard>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default About;
