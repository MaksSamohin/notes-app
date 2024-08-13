import { Typography, Box, Paper } from "@mui/material";
import React from "react";
import styles from "./Analysis.module.css";

export default function Analysis() {
  return (
    <Box className={styles.analysis}>
      <Paper className={styles.analysisItems}>
        <Typography className={styles.analysisWords}>
          Количество слов:
        </Typography>
        <Typography className={styles.analysisSymbols}>
          Количество символов:
        </Typography>
        <Typography className={styles.analysisOften}>
          Повторяющиеся слова:
        </Typography>
        <Typography className={styles.analysisEmotion}>
          Эмоциональная окраска текста:
        </Typography>
      </Paper>
    </Box>
  );
}
