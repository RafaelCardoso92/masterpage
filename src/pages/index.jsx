import styles from "./index.module.css";
import Main from "./Main"
import React from "react";
import Head from "next/head"
import Script from "next/script"

function App() {
  return (
      <div className={styles.App}>
        <Head>
          <title>Rafael Cardoso</title>
          <meta name="viewport" content="initial-scale=1.0, width=device-width" />
          <Script strategy="lazyOnload" src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS}`} />
          <Script strategy="lazyOnload">
              {`
                  window.dataLayer = window.dataLayer || [];
                  function gtag(){dataLayer.push(arguments);}
                  gtag('js', new Date());
                  gtag('config', '${process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS}', {
                  page_path: window.location.pathname,
                  });
              `}
          </Script>
        </Head>
        <div className={styles.menu}>
            <Main/>
        </div>
      </div>
  );
}

export default App;
