"use client";

import { Paper, Typography, Box, Button, Modal } from "@mui/material";
import { useState } from "react";
import styles from "./Note.module.css";

export default function Note() {
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
        <Typography className={styles.noteTitle}>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Iure quam
          facere ratione, alias laboriosam, ad officia delectus placeat
          voluptates nihil similique fugiat aliquam, quibusdam exercitationem?
          Beatae delectus autem molestiae error!
        </Typography>
        <hr />
        <Typography className={styles.noteContent}>
          Lorem ipsum dolor, sit amet consectetur adipisicing elit. Autem
          placeat blanditiis qui veritatis amet, omnis velit ea laboriosam
          voluptate consequuntur saepe fugit consequatur quae architecto at
          ipsum vero totam ducimus. Alias, voluptatem in eveniet enim tempora
          dolorem perferendis doloremque molestias earum nemo laudantium iusto
          similique dolore a beatae hic laboriosam. Quidem blanditiis eius atque
          magni dolor ducimus quae excepturi doloribus. Molestias quam totam ea
          quibusdam alias saepe ducimus voluptatum autem perspiciatis
          repudiandae assumenda doloremque ut in nulla suscipit, deleniti
          obcaecati, magnam corporis rerum minus eligendi beatae quo earum. Cum,
          incidunt? Sunt similique, inventore numquam consequatur, fugiat
          provident qui accusantium ipsam quis accusamus sed obcaecati
          reiciendis recusandae asperiores animi est iusto omnis et porro.
          Accusantium quaerat, doloribus molestias maxime blanditiis voluptate!
          Ratione quis aliquid et voluptate saepe autem veniam id quidem amet
          explicabo necessitatibus minus aliquam, est porro non vero laborum
          dolorem eum. Vel architecto voluptas iusto ratione? Dignissimos, quam
          commodi.
        </Typography>
        <Box className={styles.noteButtons}>
          <Button>Edit</Button>
          <Button onClick={handleOpen}>Delete</Button>
        </Box>
      </Paper>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="parent-modal-title"
        aria-describedby="parent-modal-description"
      >
        <Box>
          <Typography>Are you sure to delete this?</Typography>
          <Box>
            <Button>Yes</Button>
            <Button>No</Button>
          </Box>
        </Box>
      </Modal>
    </>
  );
}
