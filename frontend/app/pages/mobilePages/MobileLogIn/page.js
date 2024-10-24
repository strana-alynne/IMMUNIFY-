"use client";

import {
  Paper,
  Typography,
  Box,
  TextField,
  Button,
  Link,
  Stack,
  Grid,
} from "@mui/material";
import { useState } from "react";
import * as React from "react";
import { sendOTP, verifyOTP } from "./actions";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [emailError, setEmailError] = useState("");
  const [otpError, setOtpError] = useState("");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [message, setMessage] = useState("");
  const [isOtpSent, setIsOtpSent] = useState(false);

  const router = useRouter();

  const handleSendOTP = async (e) => {
    e.preventDefault();
    if (!email) {
      setEmailError("Email is required");
      return;
    }

    setEmailError("");

    const formData = new FormData();
    formData.append("email", email);
    const result = await sendOTP(formData);
    setMessage(result);
    if (result === "OTP sent. Please check your email.") {
      setIsOtpSent(true);
    }
  };

  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    if (!otp) {
      setOtpError("OTP is required");
      return;
    }

    setOtpError("");

    const formData = new FormData();
    formData.append("email", email);
    formData.append("otp", otp);
    const result = await verifyOTP(formData);
    console.log(result);
    if (result === "success") {
      router.push("/pages/mobilePages/MobileDashboard"); // Redirect to dashboard after successful login
    } else {
      setMessage(result);
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-2 sm:p-4 md:p-8">
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
        <Box sx={{ mt: 1 }}>
          {!isOtpSent ? (
            <form onSubmit={handleSendOTP}>
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
                onChange={(e) => setEmail(e.target.value)}
                error={emailError !== ""}
                helperText={emailError}
              />
              <Button
                type="submit"
                fullWidth
                variant="contained"
                color="primary"
                sx={{ mt: 3, mb: 2 }}
              >
                Send OTP
              </Button>
            </form>
          ) : (
            <form onSubmit={handleVerifyOTP}>
              <TextField
                margin="normal"
                required
                fullWidth
                id="otp"
                label="Enter OTP"
                name="otp"
                autoFocus
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                error={otpError !== ""}
                helperText={otpError}
              />
              <Button
                type="submit"
                fullWidth
                variant="contained"
                color="primary"
                sx={{ mt: 3, mb: 2 }}
              >
                Verify OTP
              </Button>
            </form>
          )}

          {message && (
            <Typography variant="body2" color="primary" align="center">
              {message}
            </Typography>
          )}
        </Box>
      </Paper>
    </main>
  );
}
