import React from "react";
import styles from "./Main.module.css"
import MainComponent from "../components/Main/MainComponent"
import Start from "../components/Design/Start";
const Menu = (props) => {

  return (
    <div className={styles.container}>
      <MainComponent/>
      <Start/>
    </div>
  );
}

export default Menu;
