import { AppBar, Container, Button } from "@mui/material";
import Link from "next/link";
import React from "react";
import styles from "./Nav.module.css";

export default function Nav() {
  return (
    <AppBar>
      <Container className={styles.bar}>
        <ul className={styles.linkList}>
          <li>
            <Link href="/" className={styles.link}>
              Dashboard
            </Link>
          </li>
          <li>
            <Link href="/" className={styles.link}>
              Add/Edit
            </Link>
          </li>
          <li>
            <Link href="/" className={styles.link}>
              Analysis
            </Link>
          </li>
        </ul>
        <Link href="/auth" className={styles.link}>
          <Button className={styles.logout}>Log out</Button>
        </Link>
      </Container>
    </AppBar>
  );
}
