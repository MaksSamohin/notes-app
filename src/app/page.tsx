"use client";

import { Box } from "@mui/material";
import Nav from "@/components/Nav/Nav";
import styles from "./page.module.css";
import NoteList from "@/components/NoteList/NoteList";
import { Provider } from "react-redux";
import { store } from "@/store/store";
import { useState } from "react";

export default function Home() {
  const [searchText, setSearchText] = useState<string>("");
  return (
    <Provider store={store}>
      <Box component="main" className={styles.main}>
        <Nav setSearchText={setSearchText} />
        <Box>
          <NoteList searchText={searchText} />
        </Box>
      </Box>
    </Provider>
  );
}
