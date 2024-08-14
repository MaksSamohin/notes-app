import { Typography, Box, Paper } from "@mui/material";
import styles from "./Analysis.module.css";

interface AnalysisProps {
  wordCount: number;
  symbolsCount: number;
  topWords: string;
  tone: string;
}

export default function Analysis({
  wordCount,
  symbolsCount,
  topWords,
  tone,
}: AnalysisProps) {
  return (
    <Box className={styles.analysis}>
      <Paper className={styles.analysisItems}>
        <Typography className={styles.analysisWords}>
          Word count: {wordCount}
        </Typography>
        <Typography className={styles.analysisSymbols}>
          Symbols count: {symbolsCount}
        </Typography>
        <Typography className={styles.analysisOften}>
          Top words: {topWords}
        </Typography>
        <Typography className={styles.analysisTone}>
          Text tone: {tone}
        </Typography>
      </Paper>
    </Box>
  );
}
