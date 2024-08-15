"use client";

import Nav from "@/components/Nav/Nav";
import { Provider } from "react-redux";
import { store } from "@/store/store";
import styles from "./page.module.css";
import { Box } from "@mui/material";

export default function Edit() {
  return (
    <Provider store={store}>
      <Box component="main" className={styles.main}>
        <Nav />
        <Box className={styles.accountInfo}>
          <Box className={styles.accountChangeName}>Change name</Box>
        </Box>
      </Box>
    </Provider>
  );
}
