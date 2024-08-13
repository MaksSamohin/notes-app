"use client";

import Nav from "@/components/Nav/Nav";
import { Provider } from "react-redux";
import { store } from "@/store/store";
import styles from "./page.module.css";
import { Box } from "@mui/material";
import EditableNote from "@/components/EditableNote/EditableNote";
import Analysis from "@/components/Analysis/Analysis";

export default function Edit() {
  return (
    <Provider store={store}>
      <main className={styles.main}>
        <Nav />
        <Box className={styles.notesInfo}>
          <EditableNote />
          <Analysis />
        </Box>
      </main>
    </Provider>
  );
}
