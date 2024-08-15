"use client";

import EditableNote from "@/components/EditableNote/EditableNote";
import { Provider } from "react-redux";
import { store } from "@/store/store";
import { Box } from "@mui/material";
import Nav from "@/components/Nav/Nav";
import styles from "./page.module.css";
import { useParams } from "next/navigation";
import Analysis from "@/components/Analysis/Analysis";
import { useState } from "react";

export default function Edit() {
  const setSearchText = (text: string) => {};
  const { id } = useParams();

  const [metrics, setMetrics] = useState<{
    wordCount: number;
    symbolsCount: number;
    topWords: string;
    tone: string;
  }>({
    wordCount: 0,
    symbolsCount: 0,
    topWords: "",
    tone: "",
  });

  const handleUpdateMetrics = (newMetrics: {
    wordCount: number;
    symbolsCount: number;
    topWords: string;
    tone: string;
  }) => {
    setMetrics(newMetrics);
  };

  return (
    <Provider store={store}>
      <Box component="main" className={styles.main}>
        <Nav setSearchText={setSearchText} />
        <Box className={styles.notesInfo}>
          <EditableNote noteId={id} onUpdateMetrics={handleUpdateMetrics} />
          <Analysis
            wordCount={metrics.wordCount}
            symbolsCount={metrics.symbolsCount}
            topWords={metrics.topWords}
            tone={metrics.tone}
          />
        </Box>
      </Box>
    </Provider>
  );
}
