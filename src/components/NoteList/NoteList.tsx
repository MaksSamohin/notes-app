import { Box, Button } from "@mui/material";
import Note from "../Note/Note";
import styles from "./NoteList.module.css";
import { AddCircleOutline } from "@mui/icons-material";
import Link from "next/link";
import { useEffect, useState } from "react";
import { collection, getDocs, orderBy, query } from "firebase/firestore";
import { db } from "@/firebaseConfig";

interface Note {
  id: string;
  title: string;
  content: string;
  wordCount: number;
  topWords: string;
  emotion: string;
}

export default function NoteList() {
  const [notes, setNotes] = useState<Note[]>([]);

  useEffect(() => {
    const fetchNotes = async () => {
      const q = query(collection(db, "notes"), orderBy("createdAt", "desc"));
      const querySnapshot = await getDocs(q);
      const notesData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setNotes(notesData as Note[]);
    };
    fetchNotes();
  }, []);

  const handleDelete = (id: string) => {
    setNotes((prevNotes) => prevNotes.filter((note) => note.id !== id));
  };

  return (
    <Box className={styles.noteList}>
      {notes.map((note) => (
        <Note
          key={note.id}
          id={note.id}
          title={note.title}
          content={note.content}
          wordCount={note.wordCount}
          topWords={note.topWords}
          emotion={note.emotion}
          onDelete={handleDelete}
        />
      ))}
      <Link href="/edit">
        <Button className={styles.addNote}>
          <AddCircleOutline sx={{ fontSize: 40 }} />
        </Button>
      </Link>
    </Box>
  );
}
