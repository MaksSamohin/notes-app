import { Box, Button, CircularProgress } from "@mui/material";
import Note from "../Note/Note";
import styles from "./NoteList.module.css";
import { AddCircleOutline } from "@mui/icons-material";
import Link from "next/link";
import { useEffect, useState } from "react";
import { collection, getDocs, orderBy, query, where } from "firebase/firestore";
import { db } from "@/firebaseConfig";
import { RootState } from "@/store/store";
import { useSelector } from "react-redux";

interface Note {
  id: string;
  title: string;
  content: string;
  wordCount: number;
  topWords: string;
  tone: string;
}

export default function NoteList() {
  const [notes, setNotes] = useState([]);
  const user = useSelector((state: RootState) => state.user);
  const [loading, setLoading] = useState(true);
  const [userLoading, setUserLoading] = useState(true);

  useEffect(() => {
    if (!user.uid) {
      setUserLoading(true);
      return;
    }
    setUserLoading(false);
    const fetchNotes = async () => {
      setLoading(true);
      try {
        const uid = user.uid;

        const q = query(
          collection(db, "notes"),
          orderBy("createdAt", "desc"),
          where("uid", "==", uid)
        );
        const querySnapshot = await getDocs(q);
        const notesData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setNotes(notesData as Note[]);
      } catch (error) {
        console.error("Error fetching notes: ", error);
      } finally {
        setLoading(false);
      }
    };

    if (user.uid) {
      fetchNotes();
    }
  }, [user.uid]);

  const handleDelete = (id: string) => {
    setNotes((prevNotes) => prevNotes.filter((note) => note.id !== id));
  };

  if (userLoading || loading) {
    return (
      <Box className={styles.loadingContainer}>
        <CircularProgress />
      </Box>
    );
  }
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
          tone={note.tone}
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
