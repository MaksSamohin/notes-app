import styles from "./page.module.css";
import Register from "@/components/Register/Register";

export default function RegisterPage() {
  return (
    <main className={styles.main}>
      <Register />
    </main>
  );
}
