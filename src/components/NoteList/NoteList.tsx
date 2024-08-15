import { Box, Button, CircularProgress, Typography } from "@mui/material";
import Note from "../Note/Note";
import styles from "./NoteList.module.css";
import { AddCircleOutline } from "@mui/icons-material";
import Link from "next/link";
import { useEffect, useState } from "react";
import { RootState, useAppDispatch } from "@/store/store";
import { useSelector } from "react-redux";
import { fetchNotes, fetchSharedNotes } from "@/store/noteSlice";

interface Note {
  id: string;
  title: string;
  content: string;
  wordCount: number;
  topWords: string;
  tone: string;
  sharedWith?: string[];
  uid: string;
  createdAt: string;
}
interface NoteListProps {
  searchText: string;
}
export default function NoteList({ searchText }: NoteListProps) {
  const dispatch = useAppDispatch();
  const [notes, setNotes] = useState<Note[]>([]);
  const [sharedNotes, setSharedNotes] = useState<Note[]>([]);
  const user = useSelector((state: RootState) => state.user);
  const [loading, setLoading] = useState(true);
  const [userLoading, setUserLoading] = useState(true);

  useEffect(() => {
    if (!user.uid) {
      setUserLoading(true);
      return;
    }
    setUserLoading(false);

    if (user.uid && user.email) {
      dispatch(fetchNotes(user.uid) as any)
        .unwrap()
        .then((res) => {
          setNotes(res);
          setLoading(false);
        });

      dispatch(fetchSharedNotes(user.email))
        .unwrap()
        .then((res) => setSharedNotes(res))
        .finally(() => setLoading(false));
    }
  }, [user.uid, user.email, dispatch]);

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
    <>
      <Box className={styles.noteList}>
        {notes
          .filter(
            (note) =>
              note.title.toLowerCase().includes(searchText) ||
              note.content.toLowerCase().includes(searchText)
          )
          .map((note) => (
            <Note
              key={note.id}
              id={note.id}
              title={note.title}
              content={note.content}
              wordCount={note.wordCount}
              topWords={note.topWords}
              tone={note.tone}
              onDelete={handleDelete}
              sharedWith={note.sharedWith}
              ownerId={note.uid}
              currentUserId={user.uid}
            />
          ))}
        <Link href="/edit">
          <Button className={styles.addNote}>
            <AddCircleOutline sx={{ fontSize: 40 }} />
          </Button>
        </Link>
      </Box>
      <Typography className={styles.shared}>Shared from others</Typography>
      <Box className={styles.noteList}>
        {sharedNotes
          .filter(
            (note) =>
              note.title.toLowerCase().includes(searchText) ||
              note.content.toLowerCase().includes(searchText)
          )
          .map((note) => (
            <Note
              key={note.id}
              id={note.id}
              title={note.title}
              content={note.content}
              wordCount={note.wordCount}
              topWords={note.topWords}
              tone={note.tone}
              ownerId={note.uid}
              currentUserId={user.uid}
            />
          ))}
      </Box>
    </>
  );
}
