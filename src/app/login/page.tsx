"use client";

import { Provider } from "react-redux";
import styles from "./page.module.css";
import Login from "@/components/Login/Login";
import { store } from "@/store/store";

export default function LoginPage() {
  return (
    <Provider store={store}>
      <main className={styles.main}>
        <Login />
      </main>
    </Provider>
  );
}
