import { AppBar, Container, Button, Menu, MenuItem } from "@mui/material";
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
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import DashboardIcon from "@mui/icons-material/Dashboard";
import EditNoteIcon from "@mui/icons-material/EditNote";
import AnalyticsIcon from "@mui/icons-material/Analytics";

export default function Nav() {
  const user = useSelector((state: RootState) => state.user);
  const dispatch = useDispatch();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const route = useRouter();
  const [loading, setLoading] = useState(true);

  useAuth(setLoading);

  useEffect(() => {
    if (!loading && !user.uid) {
      route.push("/login");
    }
  }, [user.uid, route, loading]);

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
              <DashboardIcon sx={{ fontSize: 30 }} />
              Dashboard
            </Link>
          </li>
          <li>
            <Link href="/edit" className={styles.link}>
              <EditNoteIcon sx={{ fontSize: 45 }} />
              Add/Edit
            </Link>
          </li>
          <li>
            <Link href="/edit" className={styles.link}>
              <AnalyticsIcon sx={{ fontSize: 30 }} />
              Analysis
            </Link>
          </li>
        </ul>
        <Button onClick={handleMenuOpen} className={styles.emailButton}>
          <AccountCircleIcon sx={{ fontSize: 40 }} />
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
