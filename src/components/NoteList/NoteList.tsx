import { Box, Button } from "@mui/material";
import Note from "../Note/Note";
import styles from "./NoteList.module.css";
import { AddCircleOutline } from "@mui/icons-material";

export default function NoteList() {
  return (
    <Box className={styles.noteList}>
      <Note />

      <Button className={styles.addNote}>
        <AddCircleOutline sx={{ fontSize: 40 }} />
      </Button>
    </Box>
  );
}
