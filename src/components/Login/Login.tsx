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

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");

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
    } else if (password.length < 8) {
      setPasswordError("Password length must be more than 8 chars");
    } else {
      setPasswordError("");
    }

    return valid;
  };

  const handleSubmit = (e: React.FormEvent) => {
    if (validateForm()) {
      console.log("Email:", email);
      console.log("Password:", password);
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

      <Button type="submit" onClick={handleSubmit}>
        Sign In
      </Button>
    </Box>
  );
}
