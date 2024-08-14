"use client";

import { Provider } from "react-redux";
import styles from "./page.module.css";
import Login from "@/components/Login/Login";
import { store } from "@/store/store";
import { Box } from "@mui/material";

export default function LoginPage() {
  return (
    <Provider store={store}>
      <Box component="main" className={styles.main}>
        <Login />
      </Box>
    </Provider>
  );
}
