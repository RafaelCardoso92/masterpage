"use client";

import { motion } from "framer-motion";
import styles from "../styles";
import { slideIn, staggerContainer, textVariant } from "../utils/motion";
import Lottie from "react-lottie";
import * as animationData from "../lotties/dev.json";
import Playlist from "../components/Playlist";
const defaultOptions = {
  loop: true,
  autoplay: true,
  animationData: animationData,
  rendererSettings: {
    preserveAspectRatio: "xMidYMid slice",
  },
};
const videos = [
  {
    id: "uV_Ks8tWH7M",
    title: "https://youtu.be/uV_Ks8tWH7M?si=RaBPpqc3nBkGzN68",
  },
  {
    id: "FtrbnsZZdQs",
    title: "https://youtu.be/FtrbnsZZdQs?si=3DCnlKMYmzhcFwd5",
  },
  // Add more videos as needed
];

const Hero = () => (
  <section className={`${styles.yPaddings} sm:pl-16 pl-6`}>
    <motion.div
      variants={staggerContainer}
      initial="hidden"
      whileInView="show"
      viewport={{ once: false, amount: 0.25 }}
      className={`${styles.innerWidth2} mx-auto flex flex-col`}
    >
      <div className="relative z-10 flex flex-col items-center justify-center">
        <motion.h1 variants={textVariant(1.1)} className={styles.heroHeading}>
          This is me
        </motion.h1>
      </div>

      <motion.div
        variants={slideIn("right", "tween", 0.2, 1)}
        className="relative w-full lg:-mt-[30px] md:-mt-[18px] -mt-[15px]"
      >
        <Lottie options={defaultOptions} height={400} width={400} />

        <div className="w-full flex  justify-end sm:-mt-[70px] -mt-[50px] pr-[40px] relative z-10 2xl:-ml-[100px]">
          <Playlist videos={videos} />
        </div>
      </motion.div>
    </motion.div>
  </section>
);

export default Hero;
