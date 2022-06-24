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
import figmaAnimation from "../../Lotties/33564-figma-logo.json"
const Start = (props) => {
  return (
    <ParallaxProvider>
    <div className={styles.container}>
          <Parallax opacity={[5, -1]} translateY={[-100, 150]}>
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


          <Parallax translateX={[-80, 50]} opacity={[-2, 4]}>
            <div className={`${styles.paralax} `} >
            <div className={styles.paralaxContent}>I have <span className={styles.highlight}>creative ideas</span> to make great design solutions</div>
            <Lottie
                loop
                animationData={ideaAnimation}
                play
              />
            </div>
          </Parallax>


          <Parallax translateX={[50, -80]} opacity={[5, -2] }>
          <div className={styles.paralax} >
            <Lottie
                loop
                animationData={workAnimation}
                play
               
              />
              <div className={styles.paralaxContent}>I can then turn those ideas into <span className={styles.highlight}>reality</span>!</div>
            </div>
          </Parallax>

          <Parallax translateY={[100, -100]} opacity={[-2, 5]}>
            <div className={`${styles.paralax}`} >
            <div className={styles.paralaxContent}><span className={styles.highlight}>Responsiveness</span> for every device!</div>
              <Lottie
                loop
                animationData={responsiveAnimation}
                play
              />
            </div>
          </Parallax>

          <Parallax translateY={[-50, 40]}
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

          <Parallax translateX={[-50, 30]} >
            <div className={styles.horizontalScrollRight}>
              <Parallax>
                <div className={`${styles.paralax} ${styles.noBackground}`} >
                  <Parallax rotateY = {[0, 720]}>
                    <div  className={styles.rotate}>
                      <Lottie
                          loop
                          animationData={figmaAnimation}
                          play
                        />
                    </div>  
                  </Parallax>
                  <Parallax rotateY = {[0, 720]}>
                    <div  className={styles.rotate}>
                      <Lottie
                          loop
                          animationData={nodeAnimation}
                          play
                        />
                    </div>  
                  </Parallax>
                  <Parallax rotateY = {[0, 720]}>
                    <div  className={styles.rotate}>      
                      <Lottie
                        loop
                        animationData={jiraAnimation}
                        play
                      />
                    </div>  
                  </Parallax>    
                  <Parallax rotateY = {[0, 720]}>
                    <div  className={styles.rotate}>  
                      <Lottie
                        loop
                        animationData={githubAnimation}
                        play
                      />
                    </div>  
                  </Parallax>
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
                
                  <div className={styles.paralaxContent}>From <span className={styles.highlight}>Domain search</span> to <span className={styles.highlight}>Webhosting</span>, I got you covered!</div>
                
                <Lottie
                      loop
                      animationData={hostingAnimation}
                      play
                />
              </div>
            </div>
          </Parallax>

          <a href="https://www.linkedin.com/in/rafaelcardosouk/" className={` ${styles.email}`}> 
      
            <Parallax 
                    translateY={[300, 300]}
                    scale= {[3, 8, 'easeInQuad']}>
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
            <Parallax >
              <div className={`${styles.paralax} ${styles.contact}`} >
                <div className={styles.paralaxContainer}>
                </div>
              </div>
            </Parallax>
           </a>
          
    </div>
    </ParallaxProvider>
  );
}

export default Start;