"use client";

import {
  Paper,
  Typography,
  Box,
  TextField,
  Button,
  Stack,
} from "@mui/material";
import { useState, useEffect } from "react";
import { sendOTP, verifyOTP } from "./actions";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [emailError, setEmailError] = useState("");
  const [otpError, setOtpError] = useState("");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [message, setMessage] = useState("");
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [isResending, setIsResending] = useState(false);
  const [isSendingOTP, setIsSendingOTP] = useState(false);
  const [isVerifyingOTP, setIsVerifyingOTP] = useState(false);

  const router = useRouter();

  useEffect(() => {
    if (countdown > 0) {
      const timer = setInterval(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [countdown]);

  const handleSendOTP = async (e) => {
    e.preventDefault();
    if (!email) {
      setEmailError("Email is required");
      return;
    }

    setEmailError("");
    setIsSendingOTP(true);

    const formData = new FormData();
    formData.append("email", email);
    const result = await sendOTP(formData);
    setMessage(result);
    if (result === "OTP sent. Please check your email.") {
      setIsOtpSent(true);
      setCountdown(10); // Start countdown after successful OTP send
    }

    setIsSendingOTP(false);
  };

  const handleResendOTP = async () => {
    try {
      setIsResending(true);
      const formData = new FormData();
      formData.append("email", email);
      const result = await sendOTP(formData);
      setMessage(result);
      if (result === "OTP sent. Please check your email.") {
        setCountdown(60); // Restart countdown
      }
    } catch (error) {
      setMessage("Failed to resend OTP. Please try again.");
    } finally {
      setIsResending(false);
    }
  };

  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    if (!otp) {
      setOtpError("OTP is required");
      return;
    }

    setOtpError("");
    setIsVerifyingOTP(true);

    const formData = new FormData();
    formData.append("email", email);
    formData.append("otp", otp);
    const result = await verifyOTP(formData);
    console.log(result);
    if (result === "success") {
      router.push("/pages/mobilePages/MobileDashboard");
    } else {
      setMessage(result);
    }

    setIsVerifyingOTP(false);
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
                disabled={isSendingOTP}
              >
                {isSendingOTP ? "Loading..." : "Send OTP"}
              </Button>
            </form>
          ) : (
            <Box component="form" onSubmit={handleVerifyOTP}>
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
                disabled={isVerifyingOTP}
              >
                {isVerifyingOTP ? "Loading..." : "Verify OTP"}
              </Button>

              <Button
                fullWidth
                variant="outlined"
                color="primary"
                onClick={handleResendOTP}
                disabled={countdown > 0 || isResending}
                sx={{ mb: 2 }}
              >
                {isResending
                  ? "Resending..."
                  : countdown > 0
                  ? `Resend OTP in ${countdown}s`
                  : "Resend OTP"}
              </Button>
            </Box>
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
