import styles from "./page.module.css";
import Login from "@/components/Login/Login";
import Register from "@/components/Register/Register";

export default function Auth() {
  return (
    <main className={styles.main}>
      <Register />
    </main>
  );
}
