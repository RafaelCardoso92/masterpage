import React from "react";
import { Typography } from "@mui/material";
import styles from "./Menu.module.css"
import Link from "next/link";

const Menu = (props) => {

  return (
    <div className={styles.container}>
      <div className={styles.design} >
      <Link href="/Design"><Typography as="h1">Design</Typography></Link>
      </div>
    </div>
  );
}

export default Menu;
