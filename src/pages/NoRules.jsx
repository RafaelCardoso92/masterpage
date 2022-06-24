import React, {useEffect, useState} from "react";
import styles from "./NoRules.module.css"
import Head from "next/head"
import Space from "../components/NoRules/space"
const Design = (props) => {


  return (
    <div className={styles.container}>

        <Head>
          <title>No_rules</title>
          <meta name="viewport" content="initial-scale=1.0, width=device-width" />
        </Head>
      <div className={styles.start}>
        <Space/>
      </div>
      
    </div>
  );
}

export default Design;