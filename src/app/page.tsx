"use client";

import { Box } from "@mui/material";
import Nav from "@/components/Nav/Nav";
import styles from "./page.module.css";
import NoteList from "@/components/NoteList/NoteList";
import { Provider } from "react-redux";
import { store } from "@/store/store";

export default function Home() {
  return (
    <Provider store={store}>
      <Box component="main" className={styles.main}>
        <Nav />
        <Box>
          <NoteList />
        </Box>
      </Box>
    </Provider>
  );
}
