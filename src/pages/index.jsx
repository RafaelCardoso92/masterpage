import styles from "./index.module.css";
import Menu from "./Menu"
import React, {useState} from "react";
import Design from "./Design"
import Lottie from 'react-lottie-player'


function App() {
  return (
      <div className={styles.App}>
     
          <div className={styles.menu}>
            <Menu/>
          </div>
    </div>

  );
}

export default App;
