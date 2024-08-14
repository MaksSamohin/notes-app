import { Typography, Box, Paper } from "@mui/material";
import React, { useEffect } from "react";
import styles from "./Analysis.module.css";

interface AnalysisProps {
  wordCount: number;
  symbolsCount: number;
  topWords: string;
  emotion: string;
}

export default function Analysis({
  wordCount,
  symbolsCount,
  topWords,
  emotion,
}: AnalysisProps) {
  useEffect(() => {});
  return (
    <Box className={styles.analysis}>
      <Paper className={styles.analysisItems}>
        <Typography className={styles.analysisWords}>
          Количество слов: {wordCount}
        </Typography>
        <Typography className={styles.analysisSymbols}>
          Количество символов: {symbolsCount}
        </Typography>
        <Typography className={styles.analysisOften}>
          Повторяющиеся слова: {topWords}
        </Typography>
        <Typography className={styles.analysisEmotion}>
          Эмоциональная окраска текста: {emotion}
        </Typography>
      </Paper>
    </Box>
  );
}
