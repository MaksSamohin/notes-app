"use client";

import Nav from "@/components/Nav/Nav";
import { Provider } from "react-redux";
import { store } from "@/store/store";
import styles from "./page.module.css";
import { Box } from "@mui/material";
import EditableNote from "@/components/EditableNote/EditableNote";
import Analysis from "@/components/Analysis/Analysis";
import { useState } from "react";

export default function Edit() {
  const [metrics, setMetrics] = useState<{
    wordCount: number;
    symbolsCount: number;
    topWords: string;
    emotion: string;
  }>({
    wordCount: 0,
    symbolsCount: 0,
    topWords: "",
    emotion: "",
  });

  const handleUpdateMetrics = (newMetrics: {
    wordCount: number;
    symbolsCount: number;
    topWords: string;
    emotion: string;
  }) => {
    setMetrics(newMetrics);
  };
  return (
    <Provider store={store}>
      <main className={styles.main}>
        <Nav />
        <Box className={styles.notesInfo}>
          <EditableNote onUpdateMetrics={handleUpdateMetrics} />
          <Analysis
            wordCount={metrics.wordCount}
            symbolsCount={metrics.symbolsCount}
            topWords={metrics.topWords}
            emotion={metrics.emotion}
          />
        </Box>
      </main>
    </Provider>
  );
}
