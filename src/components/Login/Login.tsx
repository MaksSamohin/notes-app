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
import styles from "./Login.module.css";
import Link from "next/link";
import { auth } from "@/firebaseConfig";
import { useRouter } from "next/navigation";
import { signInWithEmailAndPassword } from "firebase/auth";
import { setUser } from "@/store/userSlice";
import { useDispatch } from "react-redux";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [generalError, setGeneralError] = useState("");
  const router = useRouter();
  const dispatch = useDispatch();

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };
  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  };

  const validateForm = () => {
    let valid: boolean = true;
    if (!email) {
      setEmailError("Email is required");
      valid = false;
    } else {
      setEmailError("");
    }

    if (!password) {
      setPasswordError("Password is required");
      valid = false;
    } else {
      setPasswordError("");
    }

    return valid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      try {
        const userCredential = await signInWithEmailAndPassword(
          auth,
          email,
          password
        );
        console.log("User logged in:", userCredential.user);
        dispatch(setUser(userCredential.user));
        router.push("/");
      } catch (error: any) {
        setGeneralError(error.message);
        setPasswordError("Incorrect password");
      }
    }
  };

  return (
    <Box className={styles.loginBox}>
      <Typography className={styles.loginTitle}>Authorization</Typography>
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
      <Box>
        Don't have account?{" "}
        <Link className={styles.redirect} href="/register">
          Register
        </Link>
      </Box>
      <Button type="submit" onClick={handleSubmit}>
        Sign In
      </Button>
    </Box>
  );
}
