"use client";

import { Paper, Typography, Box, Button, Modal } from "@mui/material";
import { useState } from "react";
import styles from "./Note.module.css";
import Link from "next/link";

interface NoteProps {
  title: string;
  content: string;
}

export default function Note({ title, content }: NoteProps) {
  const [open, setOpen] = useState<boolean>(false);
  const handleOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  return (
    <>
      <Paper elevation={3} className={styles.note}>
        <Typography className={styles.noteTitle}>{title}</Typography>
        <hr />
        <Typography className={styles.noteContent}>{content}</Typography>
        <Box className={styles.noteButtons}>
          <Link href="/edit">
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
            <Button onClick={handleClose}>Yes</Button>
            <Button onClick={handleClose}>No</Button>
          </Box>
        </Box>
      </Modal>
    </>
  );
}
