import React, {useEffect, useState} from "react";
import styles from "./Design.module.css"
import Start from "../components/Design/Start";
import Lottie from 'react-lottie-player'
import loadingAnimation from "../Lotties/9844-loading-40-paperplane"
import Head from "next/head"

const Design = (props) => {
  const [count, setCount] = useState();
  useEffect(() => {
    setTimeout(() => {
      setCount(false)
    }, 1400);
    setCount(true)
  },[])

  return (
    <div className={styles.container}>

        <Head>
          <title>Rafael Cardoso</title>
          <meta name="viewport" content="initial-scale=1.0, width=device-width" />
        </Head>
      {count &&
      <div className={styles.lottie}>
        <Lottie
          loop
          animationData={loadingAnimation}
          play

        />
      </div>
      }
      {!count &&
      <div className={styles.start}>
        <Start/>
      </div>
      }
    </div>
  );
}

export default Design;