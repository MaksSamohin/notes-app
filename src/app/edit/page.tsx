"use client";

import Nav from "@/components/Nav/Nav";
import { useState } from "react";
import { Provider } from "react-redux";
import { store } from "@/store/store";
import styles from "./page.module.css";
import { Box, Input, Paper, TextareaAutosize, Button } from "@mui/material";
import { useRouter } from "next/navigation";
import { db } from "@/firebaseConfig";
import { addDoc, collection, updateDoc, doc } from "firebase/firestore";

export default function Edit({ noteId = null }) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const router = useRouter();

  const handleSave = async () => {
    if (!title || !content) return;

    try {
      if (noteId) {
        const noteRef = doc(db, "notes", noteId);
        await updateDoc(noteRef, { title, content });
      } else {
        const docRef = await addDoc(collection(db, "notes"), {
          title,
          content,
          createdAt: new Date(),
        });
      }
      router.push("/");
    } catch (error) {
      console.log("Error:", error);
    }
  };

  const handleReset = () => {
    setTitle("");
    setContent("");
  };

  return (
    <Provider store={store}>
      <main className={styles.main}>
        <Nav />
        <Box className={styles.editNotes}>
          <Paper className={styles.editableNote}>
            <Input
              className={styles.editableNoteTitle}
              placeholder="Note Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
            <hr />
            <TextareaAutosize
              minRows="40"
              className={styles.editableNoteText}
              placeholder="Note Content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
            />
            <Box className={styles.editableNoteButtons}>
              <Button onClick={handleSave} className={styles.editableNoteSave}>
                Save
              </Button>
              <Button
                onClick={handleReset}
                className={styles.editableNoteReset}
              >
                Reset
              </Button>
            </Box>
          </Paper>
        </Box>
      </main>
    </Provider>
  );
}
