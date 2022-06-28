import React, {useState, useEffect} from "react";
import styles from "./DesignComponents.module.css"
import { Parallax, ParallaxProvider} from 'react-scroll-parallax';
import Lottie from 'react-lottie-player'
import devAnimation from "../../Lotties/lf30_editor_xjwctmnu.json"
import responsiveAnimation from "../../Lotties/52421-adaptive-web-design.json"
import ideaAnimation from "../../Lotties/lf30_editor_7lokitj0.json"
import workAnimation from "../../Lotties/lf30_editor_9frj12dt.json"
import reactAnimation from "../../Lotties/296-react-logo.json"
import githubAnimation from "../../Lotties/lf30_editor_ykq9ghh9.json"
import wordpressAnimation from "../../Lotties/69643-wordpress-logo-grow.json"
import nodeAnimation from "../../Lotties/lf30_editor_s2sdzbo0.json"
import jiraAnimation from "../../Lotties/33563-jira-logo-v2.json"
import domainAnimation from "../../Lotties/29408-domain-whois.json"
import hostingAnimation from "../../Lotties/29413-hosting.json"
import emailAnimation from "../../Lotties/88708-email.json"
import figmaAnimation from "../../Lotties/33564-figma-logo.json"

const Start = (props) => {

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
    <div className={styles.container}>
        {isMobile && 
          <Parallax opacity={[5, -1]}>
            <div className={`${styles.paralax} ${styles.top} ${styles.mobileImage}`} >
              <div className={styles.paralaxContainer}>
                  <Lottie
                    animationData={devAnimation}
                  />
              </div>
            </div>
          </Parallax>
        }
        {!isMobile && <>
          <Parallax opacity={[5, -1]}>
            <div className={`${styles.paralax} ${styles.top}`} >
              <div className={styles.paralaxContainer}>
                  <Lottie
                    loop
                    animationData={devAnimation}
                    play
                  />
              </div>
            </div>
          </Parallax>

       </> }
          <Parallax opacity={[7, -3]}
          translateY={[-400, 200]}>
            <div className={`${styles.paralax} ${styles.mobile}`}>
                <Lottie
                        loop
                        animationData={reactAnimation}
                        play
                      />
                <div className={styles.paralaxContent}>This website was made with <span className={styles.highlight}>React</span>!</div>
            </div>
          </Parallax>


          <Parallax translateX={[-80, 50]} opacity={[-2, 4]}>
            <div className={`${styles.paralax} ${styles.mobile}`} >
            <div className={styles.paralaxContent}>I have <span className={styles.highlight}>creative ideas</span> to make great design solutions</div>
            {isMobile &&
              <Lottie
                animationData={ideaAnimation}
              />
            }
            {!isMobile &&
            <Lottie
                loop
                animationData={ideaAnimation}
                play
              />
            }
            </div>
          </Parallax>


          <Parallax translateX={[50, -80]} opacity={[5, -2] }>
          <div className={`${styles.paralax} ${styles.mobile}`}>
          {isMobile &&
            <Lottie
                animationData={workAnimation}
              />
          }            
          {!isMobile &&
            <Lottie
                loop
                animationData={workAnimation}
                play
              />
          }
              <div className={styles.paralaxContent}>I can then turn those ideas into <span className={styles.highlight}>reality</span>!</div>
            </div>
          </Parallax>

          <Parallax translateY={[100, -100]} opacity={[-2, 5]}>
            <div className={`${styles.paralax} ${styles.mobile}`} >
            <div className={styles.paralaxContent}><span className={styles.highlight}>Responsive</span> on every device!</div>
            {isMobile &&
              <Lottie
                animationData={responsiveAnimation}
              />
            }
            {!isMobile &&
              <Lottie
                loop
                animationData={responsiveAnimation}
                play
              />
            }
            </div>
          </Parallax>

          <Parallax translateY={[-50, 40]}
                  opacity={[-2, 4]}                 >
            <div className={`${styles.paralax} ${styles.mobile}`} >
            {isMobile &&
              <Lottie
                animationData={wordpressAnimation}
              />
              }
            {!isMobile &&
              <Lottie
                loop
                animationData={wordpressAnimation}
                play
              />
              }
              <div className={styles.paralaxContent}>Want it in <span className={styles.highlight}>wordpress</span>? no problem!</div>
            </div>
          </Parallax>

{/* right */}

          <Parallax translateX={[-50, 30]} >
            <div className={styles.horizontalScrollRight}>
                <div className={`${styles.paralax} ${styles.noBackground}`} >
                  <Parallax rotateY = {[0, 720]}>
                    <div  className={styles.rotate}>
                      <Lottie
                          animationData={figmaAnimation}
                        />
                    </div>  
                  </Parallax>
                  <Parallax rotateY = {[0, 720]}>
                    <div  className={styles.rotate}>
                      <Lottie
                          animationData={nodeAnimation}
                        />
                    </div>  
                  </Parallax>
                  <Parallax rotateY = {[0, 720]}>
                    <div  className={styles.rotate}>      
                      <Lottie
                        animationData={jiraAnimation}
                      />
                    </div>  
                  </Parallax>    
                  <Parallax rotateY = {[0, 720]}>
                    <div  className={styles.rotate}>  
                      <Lottie
                        animationData={githubAnimation}
                      />
                    </div>  
                  </Parallax>
                </div>
            </div>
          </Parallax>


          <Parallax  translateX={[100, -100]}
                  opacity={[4, -1]}>
            <div className={`${styles.paralax} ${styles.mobile}`} >
              <div className={styles.paralaxContainer}>
                {isMobile &&
                <Lottie
                  animationData={domainAnimation}
                />                
                }
                {!isMobile &&
                  <Lottie
                    loop
                    animationData={domainAnimation}
                    play
                  />                
                }
                
                  <div className={styles.paralaxContent}>From <span className={styles.highlight}>Domain search</span> to <span className={styles.highlight}>Webhosting</span>, I got you covered!</div>
                {isMobile &&
                  <Lottie
                    animationData={hostingAnimation}
                  />
                }
                {!isMobile &&
                  <Lottie
                    loop
                    animationData={hostingAnimation}
                    play
                  />
                }
              </div>
            </div>
          </Parallax>
        {isMobile && 
          <a href="https://www.linkedin.com/in/rafaelcardosouk/" className={` ${styles.email}`}> 
            <Parallax 
                    translateY={[300, 0]}
                    scale= {[1, 3, 'easeInQuad']}>
              <div className={`${styles.paralax} ${styles.noBackground}`} >
              <Lottie
                        loop
                        animationData={emailAnimation}
                        play
                  />
              </div>
            </Parallax>
            <Parallax >
              <div className={`${styles.paralax} ${styles.contact}`} >
                <div className={styles.paralaxContainer}>
                </div>
              </div>
            </Parallax>
           </a>
        } 
        {!isMobile && 
          <a href="https://www.linkedin.com/in/rafaelcardosouk/" className={` ${styles.email}`}> 
            <Parallax 
                    translateY={[300, 300]}
                    scale= {[3, 8, 'easeInQuad']}>
              <div className={`${styles.paralax} ${styles.noBackground}`} >
              {isMobile &&
                <Lottie
                  animationData={emailAnimation}
                />
              }
              {!isMobile &&
                <Lottie
                  loop
                  animationData={emailAnimation}
                  play
                />
              }
              </div>
            </Parallax>
            <Parallax >
              <div className={`${styles.paralax} ${styles.contact}`} >
                <div className={styles.paralaxContainer}>
                </div>
              </div>
            </Parallax>
            <Parallax >
              <div className={`${styles.paralax} ${styles.contact}`} >
                <div className={styles.paralaxContainer}>
                </div>
              </div>
            </Parallax>
           </a>
        } 
    </div>
    </ParallaxProvider>
  );
}

export default Start;