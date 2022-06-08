import React from "react";
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

const Start = (props) => {


  
  return (
    <ParallaxProvider>
    <div className={styles.container}>
          <Parallax opacity={[8, 0]}>
            <div className={`${styles.paralax} ${styles.top}`} >
              <div className={styles.paralaxContainer}>
  
                  <Lottie
                    loop
                    animationData={devAnimation}
                    play
                    // style={{ width: 200, height: 300 }}
                  />
        
              </div>
            </div>
          </Parallax>


          <Parallax opacity={[7, -3]}
          translateY={[-400, 200]}>
            <div className={styles.paralax}>
                <Lottie
                        loop
                        animationData={reactAnimation}
                        play
                      />
                <div className={styles.paralaxContent}>This website was made with <span className={styles.highlight}>React</span>!</div>

            </div>
          </Parallax>


          <Parallax translateX={[-200, 100]}>
            <div className={`${styles.paralax} `} >
            <div className={styles.paralaxContent}>I have <span className={styles.highlight}>creative ideas</span> to make great design solutions</div>
            <Lottie
                loop
                animationData={ideaAnimation}
                play
                
              />
            </div>
          </Parallax>


          <Parallax translateX={[200, -350]}>
          <div className={`${styles.paralax} `} >
            <Lottie
                loop
                animationData={workAnimation}
                play
               
              />
              <div className={styles.paralaxContent}>I can then turn those ideas in to <span className={styles.highlight}>reality</span>!</div>
            </div>
          </Parallax>

          <Parallax translateY={[100, -100]}
                  opacity={[-2, 5]}                 >
            <div className={`${styles.paralax}`} >
            <div className={styles.paralaxContent}><span className={styles.highlight}>Responsivess</span> for every device!</div>
              <Lottie
                loop
                animationData={responsiveAnimation}
                play
                // style={{ width: 200, height: 300 }}
              />
            </div>
          </Parallax>

          <Parallax translateY={[-70, 40]}
                  opacity={[-2, 4]}                 >
            <div className={styles.paralax} >
            <Lottie
                loop
                animationData={wordpressAnimation}
                play
              />
              <div className={styles.paralaxContent}>Want it in <span className={styles.highlight}>wordpress</span>? no problem!</div>
            </div>
          </Parallax>

{/* right */}

          <Parallax translateX={[-100, 100]} strength={-500}>
            <div className={styles.horizontalScrollRight}>
              <Parallax>
                <div className={`${styles.paralax} ${styles.noBackground}`} >
                <Lottie
                    loop
                    animationData={nodeAnimation}
                    play
                  />
                  <Lottie
                    loop
                    animationData={jiraAnimation}
                    play
                  />
                  <Lottie
                    loop
                    animationData={githubAnimation}
                    play
                  />
                </div>
              </Parallax>
            </div>
          </Parallax>


          <Parallax  translateX={[100, -100]}
                  strength={-200}>
            <div className={styles.paralax} >
              <div className={styles.paralaxContainer}>
                <Lottie
                      loop
                      animationData={domainAnimation}
                      play
                />
                
                  <div className={styles.paralaxContent}>From <span className={styles.highlight}>domain search</span> to <span className={styles.highlight}>webhosting</span>, I got you covered!</div>
                
                <Lottie
                      loop
                      animationData={hostingAnimation}
                      play
                />
              </div>
            </div>
          </Parallax>


          <Parallax translateY={[100, -100]}
                  scale= {[5, 10, 'easeInQuad']}>
            <div className={`${styles.paralax} ${styles.noBackground} ${styles.email}`} >
            <Lottie
                      loop
                      animationData={emailAnimation}
                      play
                />
            </div>
            
          </Parallax>



{/* border test */}
          <Parallax 
                  blur={{ min: -15, max: 15 }}
                  strength={-200}>
            <div className={styles.paralax} >
              <div className={styles.paralaxContainer}>
                <div className={styles.paralaxContent}>Contact me!</div>
              </div>
            </div>
            
          </Parallax>
          <Parallax 
                  blur={{ min: -15, max: 15 }}
                  strength={-200}>
            <div className={styles.paralax} >
              <div className={styles.paralaxContainer}>
                <div className={styles.paralaxContent}>HTML inside the parallax</div>
              </div>
            </div>
            
          </Parallax>


    </div>
    </ParallaxProvider>
  );
}

export default Start;