"use client";

import { Paper, Typography, Box, Button, Modal } from "@mui/material";
import { useState } from "react";
import styles from "./Note.module.css";
import Link from "next/link";
import { deleteNote } from "@/store/noteSlice";
import { useAppDispatch } from "@/store/store";
import { useSelector } from "react-redux";

interface NoteProps {
  title: string;
  content: string;
  id: string;
  wordCount: number;
  topWords: string;
  tone: string;
  onDelete: (id: string) => void;
  sharedWith?: string[];
  ownerId: string;
  currentUserId: string;
}

export default function Note({
  id,
  title,
  content,
  onDelete,
  wordCount,
  topWords,
  tone,
  sharedWith,
  ownerId,
  currentUserId,
}: NoteProps) {
  const [open, setOpen] = useState<boolean>(false);
  const dispatch = useAppDispatch();
  const handleOpen = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };
  const handleDelete = async () => {
    try {
      await dispatch(deleteNote(id)).unwrap();
      onDelete(id);
      handleClose();
    } catch (error) {
      console.error("Failed to delete the note:", error);
    }
  };
  return (
    <>
      <Paper elevation={3} className={styles.note}>
        <Link className={styles.link} href={`/edit/${id}`}>
          <Typography className={styles.noteTitle}>{title}</Typography>
          <hr />
          <Typography className={styles.noteContent}>{content}</Typography>
          <hr />
          <Box className={styles.noteTags}>
            <Typography className={styles.noteWords}>
              Word count: {wordCount}
            </Typography>
            <Typography className={styles.noteTon}>
              Text tone: {tone}
            </Typography>
            <Typography className={styles.noteOften}>
              Top words: {topWords || "No words"}
            </Typography>
          </Box>
        </Link>

        {ownerId === currentUserId && (
          <Box className={styles.noteButtons}>
            <Link href={`/edit/${id}`}>
              <Button>Edit</Button>
            </Link>
            <Button onClick={(e) => handleOpen(e)}>Delete</Button>
          </Box>
        )}
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
