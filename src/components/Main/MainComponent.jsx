import React, {useState, useEffect} from "react";
import styles from "./MainComponent.module.css"
import { Parallax, ParallaxProvider} from 'react-scroll-parallax';
import Lottie from 'react-lottie-player'
import developerAnimation from "../../Lotties/lf30_editor_i5kczg39.json"
import loadingAnimation from "../../Lotties/9844-loading-40-paperplane.json"
import arrowAnimation from "../../Lotties/lf30_editor_4mne7z5r.json"



const Main = (props) => {
const [isMobile, setIsMobile] = useState(false)

const handleResize = () => {
  if (window.innerWidth < 1024) {
      setIsMobile(true)
  } else {
      setIsMobile(false)
  }
}

useEffect(() => {
  window.addEventListener("resize", handleResize)
})


  return (
    <ParallaxProvider>
        
    <div className={`${styles.container}`}>
        {isMobile && 
                <Parallax translateX={[-350, 50]} translateY={[-500, 100]} scale={[0.1, 3, 'easeInQuad']} opacity={[4, 0]}>
                <div className={`${styles.paralax} ${styles.noBackground}`}>
                    <Lottie
                      animationData={loadingAnimation}
                    />
                </div>
              </Parallax>}
          {!isMobile &&
            <Parallax translateX={[-200, 50]} translateY={[-200, 100]} scale={[0.1, 4, 'easeInQuad']} opacity={[5, -1]}>
              <div className={`${styles.paralax} ${styles.noBackground}`}>
                  <Lottie
                    loop
                    animationData={loadingAnimation}
                    play
                  />
              </div>
            </Parallax>
        }
        {isMobile && 
          <Parallax translateX={[90, -50]} opacity={[5, -1]}>
            <div className={`${styles.paralax} ${styles.paralaxPop}`}>
                <div className={styles.paralaxContent}><h2>Hi there! welcome to my website!</h2></div>
            </div>
          </Parallax>
        }
        {!isMobile && 
          <Parallax translateX={[100, -50]} opacity={[5, -1]}>
            <div className={`${styles.paralax} ${styles.paralaxPop}`}>
                <div className={styles.paralaxContent}><h2>Hi there! welcome to my website!</h2></div>
            </div>
          </Parallax>
        }
        {isMobile && 
          <Parallax translateX={[-450, 50]} easing={'easeOutQuad'} opacity={[10, 0]}>
            <div className={styles.paralax}>
              <div className={styles.paralaxTextWrap}>
                    <div className={styles.paralaxContent}>
                      <h2>I'm Rafael, and developing websites is what I do!</h2>
                    </div>
                    <div className={styles.paralaxContent}><h2>If you like what you see</h2></div>
                    <a href="https://www.linkedin.com/in/rafaelcardosouk/">
                    <div className={`${styles.paralaxContent} ${styles.highlight}`}><h2>Contact me! I'm but a click away</h2></div></a>
              </div>
            </div>
          </Parallax>
        }
        {!isMobile && 
          <Parallax translateX={[-300, 50]} easing={'easeOutQuad'} opacity={[5, 0]}>
            <div className={styles.paralax}>
              <div className={styles.paralaxTextWrap}>
                    <div className={styles.paralaxContent}>
                      <h2>I'm Rafael, and developing websites is what I do!</h2>
                    </div>
                    <div className={styles.paralaxContent}><h2>If you like what you see</h2></div>
                    <a href="https://www.linkedin.com/in/rafaelcardosouk/">
                    <div className={`${styles.paralaxContent} ${styles.highlight}`}><h2>Contact me! I'm but a click away</h2></div></a>
              </div>
            </div>
          </Parallax>
        }
        
          <Parallax translateX={[-80, 0]}>
            <div className={`${styles.paralax} ${styles.noBackground}`}>
            {isMobile && 
                <Lottie
                  animationData={developerAnimation}
                />
            }
            {!isMobile && 
                <Lottie
                  loop
                  animationData={developerAnimation}
                  play
                />
            }
            </div>
          </Parallax>
          <Parallax translateX={[50, 15]} translateY={[-120, -120]} opacity={[3, -2]}>
            <div className={`${styles.paralax} ${styles.noBackground}`}>
              <div className={styles.paralaxTextWrap}>
                  <Parallax  opacity={[-4, 7]}>
                    <div className={`${styles.paralaxContent} ${styles.highlight}`}><h2>Elegant</h2></div>
                  </Parallax>
                  <Parallax opacity={[-5, 8]}>
                    <div className={`${styles.paralaxContent} ${styles.highlight}`}><h2>Intuitive</h2></div>
                  </Parallax>
                  <Parallax  opacity={[-6, 9]}>
                    <div className={`${styles.paralaxContent} ${styles.highlight}`}><h2>Responsive</h2></div>
                  </Parallax>
              </div>
            </div>
          </Parallax>

          {isMobile && 
            <Parallax translateY={[-80, -200]} scale={[0.5, 2, 'easeInQuad']} opacity={[2, -1]}>
              <div className={`${styles.paralax} ${styles.noBackground} ${styles.arrow} ${styles.mobile}`}>
                    <h1>Check my designs</h1>
                  <Lottie
                    animationData={arrowAnimation}
                    style={{ width: 100, height: 100 }}
                  />
              </div>
            </Parallax>
          }  
          {!isMobile && 
            <Parallax translateY={[-80, -500]} scale={[1, 6, 'easeInQuad']} opacity={[2, -1]}>
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
          }  
    </div>
    </ParallaxProvider>
  );
}

export default Main;