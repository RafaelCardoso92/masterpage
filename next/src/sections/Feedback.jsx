"use client";
import Image from "next/image";
import { motion } from "framer-motion";
import styles from "../styles";
import { fadeIn, staggerContainer, zoomIn } from "../utils/motion";
import style from "../styles/styles.module.css";
const Feedback = () => (
  <section className={`${styles.paddings} relative z-10`}>
    <motion.div
      variants={staggerContainer}
      initial="hidden"
      whileInView="show"
      viewport={{ once: false, amount: 0.25 }}
      className={`${styles.innerWidth} mx-auto flex lg:flex-row flex-col gap-6 `}
    >
      <motion.div
        variants={fadeIn("right", "tweeen", 0.2, 1)}
        className={
          "flex-[0.4] lg:max-[370px] flex justify-end lg:justify-center flex-col gradient-05 sm:p-8 p-4 rounded-[32px] border-[1px] border-[#6a6a6a] relative " +
          style.transform
        }
      >
        <div className="feedback-gradient" />
        <div>
          <h4 className="font-bold sm:text-[32px] text-[26px] sm:leading-[40px] leading-[36px] text-white">
            {"It's really me"}
          </h4>
          <p className="mt-[8px] font-normal sm:text-[18px] text-[12px] sm:leading-[22px] leading-[16px] text-white">
            Rafael Cardoso
          </p>
        </div>
        <p className="mt-[24px] font-normal sm:text-[24px] text-[18px] sm:leading-[45px] leading-[39px] text-white">
          “Code is the language through which we shape the digital universe, but
          it is in the thoughtful design and elegant solutions that we reveal
          the true essence of our humanity”
        </p>
      </motion.div>

      <motion.div
        variants={fadeIn("left", "tween", 0.2, 1)}
        className="relative flex-1 flex justify-center item-center"
      >
        <Image
          width={600}
          height={600}
          src="/me.webp"
          alt="me"
          className="w-full sm:h-[400] lg:h-[610px] h-auto min-h-[210px] object-cover rounded-[40px]"
        />
        <motion.div
          variants={zoomIn(0.4, 1)}
          className="lg:block hidden absolute -left-[10%] top-[3%]"
        ></motion.div>
      </motion.div>
    </motion.div>
  </section>
);

export default Feedback;
