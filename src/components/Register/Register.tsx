"use client";

import {
  FormControl,
  Box,
  Typography,
  InputLabel,
  Input,
  FormHelperText,
  Button,
} from "@mui/material";
import React, { useState } from "react";
import styles from "./Register.module.css";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "@/firebaseConfig";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { doc, setDoc } from "firebase/firestore";

export default function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitPassword, setSubmitPassword] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [submitPasswordError, setSubmitPasswordError] = useState("");
  const [generalError, setGeneralError] = useState("");

  const router = useRouter();
  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };
  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  };
  const handleSubmitPasswordChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setSubmitPassword(e.target.value);
  };

  const validateForm = () => {
    let valid: boolean = true;
    if (!email) {
      setEmailError("Email is required");
      valid = false;
    } else if (email.length > 48) {
      setEmailError("Email length is too long");
    } else {
      setEmailError("");
    }

    if (!password) {
      setPasswordError("Password is required");
      valid = false;
    } else if (password.length < 8) {
      setPasswordError("Password length must be more than 8 chars");
      valid = false;
    } else if (password.length > 64) {
      setPasswordError("Password length is too long");
    } else {
      setPasswordError("");
    }

    if (password !== submitPassword) {
      setPasswordError("Passwords must be match");
      setSubmitPasswordError("Passwords must be match");
      valid = false;
    } else {
      setSubmitPasswordError("");
    }

    return valid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      try {
        const userCredential = await createUserWithEmailAndPassword(
          auth,
          email,
          password
        );
        const user = userCredential.user;

        await setDoc(doc(db, "users", user.uid), {
          uid: user.uid,
          email: user.email,
          displayName: "",
        });

        router.push("/");
      } catch (error: any) {
        setEmailError("Email is unavailable");
        setGeneralError(error.message);
      }
    }
  };

  return (
    <Box className={styles.registerBox}>
      <Typography className={styles.registerTitle}>Register</Typography>
      <FormControl
        component="form"
        onSubmit={handleSubmit}
        className={styles.registerForm}
      >
        <FormControl className={styles.emailForm} error={!!emailError}>
          <InputLabel htmlFor="email">Email address</InputLabel>
          <Input
            id={styles.email}
            type="email"
            value={email}
            onChange={handleEmailChange}
            aria-describedby="email-helper-text"
          ></Input>
          {emailError && (
            <FormHelperText id="email-helper-text">{emailError}</FormHelperText>
          )}
        </FormControl>

        <FormControl className={styles.passwordForm} error={!!passwordError}>
          <InputLabel htmlFor="password">Password</InputLabel>
          <Input
            id={styles.password}
            type="password"
            value={password}
            onChange={handlePasswordChange}
            aria-describedby="password-helper-text"
          />
          {passwordError && (
            <FormHelperText id="password-helper-text">
              {passwordError}
            </FormHelperText>
          )}
        </FormControl>
        <FormControl
          className={styles.submitPasswordForm}
          error={!!submitPasswordError}
        >
          <InputLabel htmlFor="submitPassword">Submit password</InputLabel>
          <Input
            id={styles.submitPassword}
            type="password"
            value={submitPassword}
            onChange={handleSubmitPasswordChange}
            aria-describedby="submitPassword-helper-text"
          />
          {submitPasswordError && (
            <FormHelperText id="submitPassword-helper-text">
              {submitPasswordError}
            </FormHelperText>
          )}
        </FormControl>
      </FormControl>
      <Box>
        Already have an account?{" "}
        <Link className={styles.redirect} href="/login">
          Login
        </Link>
      </Box>
      <Button type="submit" onClick={handleSubmit}>
        Register
      </Button>
    </Box>
  );
}
