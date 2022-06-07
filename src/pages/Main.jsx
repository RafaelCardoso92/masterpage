import React from "react";
import styles from "./Main.module.css"
import MainComponent from "../components/Main/MainComponent"

const Menu = (props) => {

  return (
    <div className={styles.container}>
      <MainComponent/>
    </div>
  );
}

export default Menu;
