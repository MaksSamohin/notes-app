"use client";

import { Paper, Typography, Box, Button, Modal } from "@mui/material";
import { useState } from "react";
import styles from "./Note.module.css";
import Link from "next/link";
import { doc, deleteDoc } from "firebase/firestore";
import { db } from "@/firebaseConfig";

interface NoteProps {
  title: string;
  content: string;
  id: string;
  wordCount: number;
  symbolsCount: number;
  topWords: string;
  tone: string;
  onDelete: (id: string) => void;
}

export default function Note({
  id,
  title,
  content,
  onDelete,
  wordCount,
  topWords,
  tone,
}: NoteProps) {
  const [open, setOpen] = useState<boolean>(false);
  const handleOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  const handleDelete = async () => {
    try {
      const docRef = doc(db, "notes", id);
      await deleteDoc(docRef);
      onDelete(id);
      handleClose();
    } catch (error) {
      console.error("Failed to delete the note:", error);
    }
  };
  return (
    <>
      <Paper elevation={3} className={styles.note}>
        <Typography className={styles.noteTitle}>{title}</Typography>
        <hr />
        <Typography className={styles.noteContent}>{content}</Typography>
        <hr />
        <Box className={styles.noteTags}>
          <Typography className={styles.noteWords}>
            Word count: {wordCount}
          </Typography>
          <Typography className={styles.noteTon}>Text tone: {tone}</Typography>
          <Typography className={styles.noteOften}>
            Top words: {topWords || "No words"}
          </Typography>
        </Box>
        <Box className={styles.noteButtons}>
          <Link href={`/edit/${id}`}>
            <Button>Edit</Button>
          </Link>
          <Button onClick={handleOpen}>Delete</Button>
        </Box>
      </Paper>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="parent-modal-title"
        aria-describedby="parent-modal-description"
      >
        <Box className={styles.deleteModal}>
          <Typography>Are you sure to delete this note?</Typography>
          <Box className={styles.deleteModalButtons}>
            <Button onClick={handleDelete}>Yes</Button>
            <Button onClick={handleClose}>No</Button>
          </Box>
        </Box>
      </Modal>
    </>
  );
}
