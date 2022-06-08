import styles from "./index.module.css";
import Main from "./Main"
import React from "react";
import Head from "next/head"


function App() {
  return (
      <div className={styles.App}>

        <Head>
          <title>Rafael Cardoso</title>
          <meta name="viewport" content="initial-scale=1.0, width=device-width" />
          <link rel="icon" sizes="32x32" href="../images.favIcon.png" />
        </Head>

        <div className={styles.menu}>
            <Main/>
        </div>
    </div>

  );
}

export default App;
