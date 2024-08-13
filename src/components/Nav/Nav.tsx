import {
  AppBar,
  Container,
  Button,
  Menu,
  MenuItem,
  CircularProgress,
} from "@mui/material";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/store/store";
import { clearUser } from "@/store/userSlice";
import { signOut } from "firebase/auth";
import { auth } from "@/firebaseConfig";
import styles from "./Nav.module.css";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth.hook";

export default function Nav() {
  const user = useSelector((state: RootState) => state.user.user);
  const dispatch = useDispatch();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const route = useRouter();
  useAuth();

  useEffect(() => {
    if (!user) {
      route.push("/login");
    }
  }, []);
  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      dispatch(clearUser());
      handleMenuClose();
      route.push("/login");
    } catch (error) {
      console.error("Error signing out: ", error);
    }
  };

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
        <Button onClick={handleMenuOpen} className={styles.emailButton}>
          {user ? user.email : ""}
        </Button>
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleMenuClose}
        >
          <MenuItem onClick={handleLogout}>Log out</MenuItem>
        </Menu>
      </Container>
    </AppBar>
  );
}
