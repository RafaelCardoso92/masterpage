import React from "react";
import styles from "./Navigation.module.css";
import { Typography } from "@mui/material";
import Link from "next/link";

const Navigation = (props) => {
  return (
    <div className={styles.container}>
      <Link href="/Design"><Typography as="h1">Design</Typography></Link>
    </div>
  );
}

export default Navigation;