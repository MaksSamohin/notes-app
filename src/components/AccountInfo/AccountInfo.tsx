import { Box, Typography, Input, Button, Modal } from "@mui/material";
import styles from "./AccountInfo.module.css";
import { RootState, useAppDispatch } from "@/store/store";
import { useSelector } from "react-redux";
import { fetchUserData } from "@/store/userSlice";
import { useEffect, useState } from "react";
import { updateUserNameInDB, deleteAllUserNotes } from "@/store/userSlice";
import { fetchNotes, shareAllNotesWithUser } from "@/store/noteSlice";

export default function AccountInfo() {
  const dispatch = useAppDispatch();
  const user = useSelector((state: RootState) => state.user);
  const notes = useSelector((state: RootState) => state.notes.notes);
  const [newUsername, setNewUsername] = useState<string>(
    user.displayName || ""
  );
  const [open, setOpen] = useState<boolean>(false);
  const [friendEmail, setFriendEmail] = useState<string>("");

  useEffect(() => {
    if (user.displayName !== null) {
      setNewUsername(user.displayName);
    }
  }, [user.displayName]);

  useEffect(() => {
    if (user.uid) {
      dispatch(fetchUserData(user.uid));
      dispatch(fetchNotes(user.uid));
    }
  }, [user.uid, dispatch]);

  const handleOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  const handleUsernameChange = async () => {
    if (user.uid && newUsername.trim()) {
      dispatch(updateUserNameInDB({ uid: user.uid, displayName: newUsername }));
    }
  };

  const handleDeleteAllNotes = async () => {
    if (user.uid) {
      await deleteAllUserNotes(user.uid);
      dispatch(fetchNotes(user.uid));
    }
    setOpen(false);
  };

  const handleShareAllNotes = async () => {
    if (user.uid && friendEmail.trim()) {
      dispatch(shareAllNotesWithUser({ uid: user.uid, email: friendEmail }));
      setFriendEmail("");
    }
  };

  return (
    <>
      <Box className={styles.accountInfo}>
        <Box className={styles.accountName}>
          <Typography>Account name:</Typography>
          <Input
            value={newUsername}
            placeholder={"Set your username"}
            onChange={(e) => setNewUsername(e.target.value)}
          />
          <Button onClick={handleUsernameChange}>Save</Button>
        </Box>
        <Box className={styles.accountEmail}>
          <Typography>Email: {user.email}</Typography>
        </Box>
        <Box className={styles.accountNotes}>
          <Typography>All notes count: {notes.length}</Typography>
          {notes.length > 0 && (
            <Button onClick={handleOpen}>Delete all notes</Button>
          )}
        </Box>
        <Box className={styles.shareNotes}>
          <Typography>You can share your notes with friends</Typography>
          <Input
            onChange={(e) => setFriendEmail(e.target.value)}
            value={friendEmail}
            placeholder={"Set the friend's email"}
          />
          <Button onClick={handleShareAllNotes}>Add</Button>
        </Box>
      </Box>

      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="parent-modal-title"
        aria-describedby="parent-modal-description"
      >
        <Box className={styles.deleteModal}>
          <Typography className={styles.deleteModalText}>
            Are you sure to delete <span>ALL</span> notes?
          </Typography>
          <Box className={styles.deleteModalButtons}>
            <Button
              className={styles.deleteModalYes}
              onClick={handleDeleteAllNotes}
            >
              Yes
            </Button>
            <Button className={styles.deleteModalNo} onClick={handleClose}>
              No
            </Button>
          </Box>
        </Box>
      </Modal>
    </>
  );
}
