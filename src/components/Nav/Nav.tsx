import {
  AppBar,
  Container,
  Button,
  Menu,
  MenuItem,
  Input,
  Box,
  List,
  Drawer,
  ListItem,
  Typography,
} from "@mui/material";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState, useAppDispatch } from "@/store/store";
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
import SearchIcon from "@mui/icons-material/Search";
import { usePathname } from "next/navigation";
import { fetchUserData } from "@/store/userSlice";
import MenuIcon from "@mui/icons-material/Menu";
import LogoutIcon from "@mui/icons-material/Logout";

interface NavProps {
  setSearchText: (text: string) => void;
}

export default function Nav({ setSearchText }: NavProps) {
  const user = useSelector((state: RootState) => state.user);
  const dispatch = useAppDispatch();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const route = useRouter();
  const pathname = usePathname();
  const [loading, setLoading] = useState(true);
  const [isHomePage, setIsHomepage] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);

  useAuth(setLoading);

  useEffect(() => {
    if (!loading && !user.uid) {
      route.push("/login");
    }

    if (pathname === "/") {
      setIsHomepage(true);
    } else {
      setIsHomepage(false);
    }
    if (user.uid) {
      dispatch(fetchUserData(user.uid));
    }
  }, [user.uid, route, loading]);

  const toggleDrawer = (open) => (event) => {
    if (
      event.type === "keydown" &&
      (event.key === "Tab" || event.key === "Shift")
    ) {
      return;
    }
    setDrawerOpen(open);
  };

  const list = () => (
    <Box
      sx={{}}
      role="presentation"
      onClick={toggleDrawer(false)}
      onKeyDown={toggleDrawer(false)}
      className={styles.drawerBox}
    >
      <List className={styles.drawerBoxList}>
        <ListItem>
          <Link href="/" className={styles.link}>
            <DashboardIcon sx={{ fontSize: 45 }} />
            Dashboard
          </Link>
        </ListItem>
        <ListItem>
          <Link href="/edit" className={styles.link}>
            <EditNoteIcon sx={{ fontSize: 45 }} />
            Add/Edit
          </Link>
        </ListItem>
        <ListItem>
          <Link href="/edit" className={styles.link}>
            <AnalyticsIcon sx={{ fontSize: 45 }} />
            Analysis
          </Link>
        </ListItem>
        <ListItem>
          <Link className={styles.link} href="/personalcabinet">
            <AccountCircleIcon sx={{ fontSize: 45 }} />
            Personal cabinet
          </Link>
        </ListItem>
        <ListItem className={styles.link} onClick={handleLogout}>
          <LogoutIcon sx={{ fontSize: 45 }} />
          Log out
        </ListItem>
      </List>
    </Box>
  );

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
    <>
      <AppBar>
        <Container className={styles.bar}>
          <Button
            className={styles.mobileMenu}
            onClick={toggleDrawer(!drawerOpen)}
          >
            <MenuIcon sx={{ color: "white", fontSize: 45 }} />
          </Button>
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

          {isHomePage && (
            <Box className={styles.searchField}>
              <SearchIcon className={styles.searchIcon} sx={{ fontSize: 45 }} />
              <Input
                className={styles.searchInput}
                onChange={(e) => setSearchText(e.target.value)}
                placeholder="Find the note"
              />
            </Box>
          )}

          <Button onClick={handleMenuOpen} className={styles.emailButton}>
            <AccountCircleIcon sx={{ fontSize: 40 }} />
            <Typography className={styles.emailDisplayText}>
              {user.displayName ? user.displayName : user.email}
            </Typography>
          </Button>
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
          >
            <Link
              className={styles.personalcabinetLink}
              href="/personalcabinet"
            >
              <MenuItem>Personal cabinet</MenuItem>
            </Link>
            <MenuItem onClick={handleLogout}>Log out</MenuItem>
          </Menu>
        </Container>
      </AppBar>
      <Drawer anchor="top" open={drawerOpen} onClose={toggleDrawer(false)}>
        {list()}
      </Drawer>
    </>
  );
}
