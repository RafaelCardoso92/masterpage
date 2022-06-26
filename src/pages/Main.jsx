import React, {Suspense} from "react";
import styles from "./Main.module.css"
import MainComponent from "../components/Main/MainComponent"
const Start = React.lazy(() => import('../components/Design/Start'));
const Menu = (props) => {

  return (
    <div className={styles.container}>
      <MainComponent/>
      <Suspense fallback={<div>Loading...</div>}>
        <Start/>
      </Suspense>
    </div>
  );
}

export default Menu;
