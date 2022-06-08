import React from "react";
import styles from "./MainComponent.module.css"
import { Parallax, ParallaxProvider} from 'react-scroll-parallax';
import Lottie from 'react-lottie-player'
import developerAnimation from "../../Lotties/lf30_editor_i5kczg39.json"
import loadingAnimation from "../../Lotties/9844-loading-40-paperplane.json"
import arrowAnimation from "../../Lotties/lf30_editor_4mne7z5r.json"
import Link from "next/link";

const Main = (props) => {
  return (
    <ParallaxProvider>
    <div className={styles.container}>
    <Parallax translateX={[-200, 50]} translateY={[-200, 100]} scale={[0.1, 4, 'easeInQuad']} opacity={[5, -1]}>
            <div className={`${styles.paralax} ${styles.noBackground}`}>
                <Lottie
                        loop
                        animationData={loadingAnimation}
                        play
                      />
            </div>
          </Parallax>
      <Parallax translateX={[100, -50]} opacity={[5, -1]}>
            <div className={styles.paralax}>
 
                <div className={styles.paralaxContent}>Hi there! welcome to my website!</div>

            </div>
      </Parallax>


          <Parallax translateX={[-150, 100]} opacity={[5, -1]}>
            <div className={styles.paralax}>
 
            <div className={styles.paralaxTextWrap}>
                  <div className={styles.paralaxContent}>
                    I'm Rafael, and developing websites is what I do!
                  </div>
                  <div className={styles.paralaxContent}>Any questions?</div>
                  <div className={styles.paralaxContent}>No? great!</div>
                  <div className={styles.paralaxContent}>contact me then! I'm but a click away</div>
            </div>
            </div>
          </Parallax>

          <Parallax translateX={[-80, -20]}>
            <div className={`${styles.paralax} ${styles.noBackground}`}>
                <Lottie
                        loop
                        animationData={developerAnimation}
                        play
                      />
            </div>
          </Parallax>
          
          <Parallax translateX={[50, 0]} translateY={[-130, -130]}>
            <div className={`${styles.paralax} ${styles.noBackground}`}>
              <div className={styles.paralaxTextWrap}>
                  <Parallax translateX={[30, 10]} opacity={[-4, 7]}>
                    <div className={styles.paralaxContent}><h2>Elegant</h2></div>
                  </Parallax>
                  <Parallax translateX={[60, 10]} opacity={[-5, 8]}>
                    <div className={styles.paralaxContent}><h2>Intuitive</h2></div>
                  </Parallax>
                  <Parallax translateX={[90, 10]} opacity={[-6, 9]}>
                    <div className={styles.paralaxContent}><h2>Responsive</h2></div>
                  </Parallax>
              </div>
            </div>
          </Parallax>

          <Link href="/Design">
            <Parallax translateY={[-80, -500]} scale={[1, 6, 'easeInQuad']}>
              <div className={`${styles.paralax} ${styles.noBackground} ${styles.arrow}`}>
                    <h1>Check my designs</h1>
                  <Lottie
                    loop
                    animationData={arrowAnimation}
                    play
                    style={{ width: 100, height: 100 }}
                  />
              </div>
            </Parallax>
          </Link>
    </div>
    </ParallaxProvider>
  );
}

export default Main;