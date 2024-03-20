"use client";

import { motion } from "framer-motion";
import { TypingText } from "../components";
import styles from "../styles";
import { fadeIn, staggerContainer } from "../utils/motion";

const About = () => (
  <section className={`${styles.paddings} relative z-10`}>
    <div className="gradient-02 z-0" />

    <motion.div
      variants={staggerContainer}
      initial="hidden"
      whileInView="show"
      viewport={{ once: false, amount: 0.25 }}
      className={`${styles.innerWidth} mx-auto ${styles.flexCenter} flex-col`}
    >
      <TypingText title="About me" textStyles="text-center" />

      <motion.p
        variants={fadeIn("up", "tween", 0.2, 1)}
        className="mt-[8px] font-normal sm:text-[32px] text-[20px] text-center text-white"
      >
        <span className="font-extrabold">Hello, I'm Rafael</span>, a passionate
        developer with a background in javascript, typescript, react, Next.js,
        CSS/Sass. I've become deeply immersed in crafting robust, scalable web
        applications using powerful frameworks. I've honed my skills in
        leveraging Next.js's capabilities, such as server-side rendering, static
        site generation, and API routes, to deliver high-performance
        applications that prioritize both speed and user experience. Beyond
        technical expertise,{" "}
        <span className="font-extrabold">I bring a collaborative mindset</span>{" "}
        to every team I work with. I thrive in environments where communication
        flows freely, ideas are shared openly, and collective success is
        celebrated.
      </motion.p>

      <motion.img
        variants={fadeIn("up", "tween", 0.3, 1)}
        src="/arrow-down.svg"
        alt="arrow-down"
        className="w-[18px] h-[28px] object-contain mt-[28px]"
      />
    </motion.div>
  </section>
);

export default About;
