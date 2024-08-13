import { Box, TextareaAutosize, Input, Paper, Button } from "@mui/material";
import styles from "./EditableNote.module.css";
import { useRouter } from "next/navigation";
import { db } from "@/firebaseConfig";
import { addDoc, collection, updateDoc, doc } from "firebase/firestore";
import { useState } from "react";

export default function EditableNote({ noteId = null }) {
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
    <Paper className={styles.editableNote}>
      <Input
        className={styles.editableNoteTitle}
        placeholder="Note Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <hr />
      <TextareaAutosize
        minRows="35"
        className={styles.editableNoteText}
        placeholder="Note Content"
        value={content}
        onChange={(e) => setContent(e.target.value)}
      />
      <Box className={styles.editableNoteButtons}>
        <Button onClick={handleSave} className={styles.editableNoteSave}>
          Save
        </Button>
        <Button onClick={handleReset} className={styles.editableNoteReset}>
          Reset
        </Button>
      </Box>
    </Paper>
  );
}
