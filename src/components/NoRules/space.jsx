import React, {useEffect, useState} from "react";
import styles from "./space.module.css"
import Lottie from 'react-lottie-player'
import { Parallax, ParallaxProvider} from 'react-scroll-parallax';


const Design = (props) => {

  return (
    <ParallaxProvider>
        <div className={styles.container}>

        <Parallax>
            <div className={styles.parallaxTop}>
                <Lottie
                    loop
                    animationData={reactAnimation}
                    play
                />                
            </div>
        </Parallax>

        <Parallax>
            <div className={styles.parallaxDiv}>
                <Parallax>
                    <div className={styles.parallaxContent}>

                    </div>
                </Parallax>
                <Parallax>
                    <div className={styles.parallaxContent}>

                    </div>
                </Parallax>
                <Parallax>
                    <div className={styles.parallaxContent}>

                    </div>
                </Parallax>
            </div>
        </Parallax>
        <Parallax>
            <div className={styles.parallaxFull}>
            </div>
        </Parallax>







        <Parallax>
            <div className={styles.parallaxTest}>

            </div>
        </Parallax>

        <Parallax>
            <div className={styles.parallaxTest}>

            </div>
        </Parallax>

        </div>
    </ParallaxProvider>
  );
}

export default Design;