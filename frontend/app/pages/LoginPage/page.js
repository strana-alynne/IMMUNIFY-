"use client";

import {
  Grid,
  Paper,
  Typography,
  Box,
  TextField,
  Button,
  Link,
  Stack,
  InputAdornment,
  IconButton,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { useState } from "react";
import * as React from "react";
import { login } from "./actions";
import Image from "next/image";

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const formRef = React.createRef();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      if (!email) {
        setEmailError("Email is required");
      } else {
        setEmailError("");
      }
      if (!password) {
        setPasswordError("Password is required");
      } else {
        setPasswordError("");
      }
    } else {
      const formData = new FormData(formRef.current);
      const error = await login(formData, "web");
      if (error) {
        setLoginError(error);
      }
    }
  };

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
    if (e.target.value) {
      setEmailError("");
    }
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
    if (e.target.value) {
      setPasswordError("");
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-2 sm:p-4 md:p-8">
      <Paper sx={{ p: 4, width: "90%", maxWidth: "400px" }}>
        <Stack
          alignItems="center" // Center contents horizontally
          justifyContent="center" // Center contents vertically
          spacing={2}
        >
          <Typography
            variant="h2"
            sx={{
              fontSize: {
                xs: 36, // Font size for extra-small screens
                sm: 40, // Font size for small screens and up
              },
            }}
          >
            WELCOME TO
          </Typography>
          <img src="/logo-wordmark.png" alt="logo" style={{ width: 400 }} />
        </Stack>
        <form ref={formRef}>
          <Box sx={{ mt: 1 }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Enter Your Email Address"
              name="email"
              autoComplete="email"
              autoFocus
              value={email}
              onChange={handleEmailChange}
              error={emailError !== ""}
              helperText={emailError}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type={showPassword ? "text" : "password"}
              id="password"
              autoComplete="current-password"
              value={password}
              onChange={handlePasswordChange}
              error={passwordError !== ""}
              helperText={passwordError}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={handleClickShowPassword}
                      onMouseDown={handleMouseDownPassword}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            <Link href="/pages/ForgotPass" variant="body2">
              Forgot password?
            </Link>

            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              sx={{ mt: 3, mb: 2 }}
              onClick={handleSubmit}
            >
              Log in
            </Button>

            {loginError && (
              <Typography variant="body2" color="error">
                {loginError}
              </Typography>
            )}

            <Grid container justifyContent="center">
              <Grid item>
                <Link href="/pages/SignupPage" variant="body2">
                  {"Do not have an account? Sign Up"}
                </Link>
              </Grid>
            </Grid>
          </Box>
        </form>
      </Paper>
    </main>
  );
}
