"use client";

import Nav from "@/components/Nav/Nav";
import { Provider } from "react-redux";
import { store } from "@/store/store";
import styles from "./page.module.css";
import { Box } from "@mui/material";
import AccountInfo from "@/components/AccountInfo/AccountInfo";

export default function Edit() {
  const setSearchText = (text: string) => {};

  return (
    <Provider store={store}>
      <Box component="main" className={styles.main}>
        <Nav setSearchText={setSearchText} />
        <AccountInfo />
      </Box>
    </Provider>
  );
}
