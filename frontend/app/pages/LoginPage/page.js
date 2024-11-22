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
import { toast, Toaster } from "sonner";

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

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
      setIsLoading(true);
      try {
        const formData = new FormData(formRef.current);
        const error = await login(formData, "web");
        if (error) {
          toast.error(error);
          setLoginError(error);
        } else {
          toast.success("Login Successful", { duration: 60000 });
        }
      } catch (error) {
        toast.error("An unexpected error occurred");
        setLoginError("An unexpected error occurred");
      } finally {
        setIsLoading(false);
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
      <Toaster richColors position="top-center" autoHideDuration={60000} />
      <Paper sx={{ p: 4, width: "90%", maxWidth: "400px" }}>
        <Stack alignItems="center" justifyContent="center" spacing={2}>
          <Typography
            variant="h2"
            sx={{
              fontSize: {
                xs: 36,
                sm: 40,
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
              disabled={isLoading}
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
              disabled={isLoading}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={handleClickShowPassword}
                      onMouseDown={handleMouseDownPassword}
                      edge="end"
                      disabled={isLoading}
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />

            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              sx={{ mt: 3, mb: 2 }}
              onClick={handleSubmit}
              disabled={isLoading}
            >
              {isLoading ? "Logging in..." : "Log in"}
            </Button>

            {loginError && (
              <Toaster
                richColors
                position="top-center"
                severity="error"
                autoHideDuration={3000}
              />
            )}

            <Grid container justifyContent="center">
              <Grid item alignItems="center" justifyItems="center">
                <Typography variant="body2">
                  Track your child’s vaccinations with ease.
                </Typography>
                <Link
                  href="/pages/mobilePages/MobileLogIn"
                  variant="body2"
                  tabIndex={isLoading ? -1 : 0}
                >
                  {"👉 Parents, log in here"}
                </Link>
              </Grid>
            </Grid>
          </Box>
        </form>
      </Paper>
    </main>
  );
}
