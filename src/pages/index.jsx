import styles from "./index.module.css";
import Menu from "./Menu"
import React from "react";



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
