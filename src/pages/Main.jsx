import React, {useState} from "react";
import styles from "./Main.module.css"
import MainComponent from "../components/Main/MainComponent"

const Start = React.lazy(() => import('../components/Design/Start'));

const Menu = (props) => {

  const [isVisible, setIsVisible] = useState(false);
  return (
    <div className={styles.container}>
      <MainComponent
        setIsVisible={setIsVisible}
      />
      {isVisible &&
        <Start/>
      }
    </div>
  );
}

export default Menu;
