import { Box, Paper, Typography, Button } from "@mui/material";
import Nav from "@/components/Nav/Nav";
import styles from "./page.module.css";
import NoteList from "@/components/NoteList/NoteList";

export default function Home() {
  return (
    <main className={styles.main}>
      <Nav />
      <Box>
        <NoteList />
      </Box>
    </main>
  );
}
