import styles from "./page.module.css";
import Register from "@/components/Register/Register";
import { Box } from "@mui/material";

export default function RegisterPage() {
  return (
    <Box component="main" className={styles.main}>
      <Register />
    </Box>
  );
}
