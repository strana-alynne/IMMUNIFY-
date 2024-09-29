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
} from "@mui/material";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function ForgotPassword() {
  const router = useRouter();
  const [email, setEmail] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();
    // Here you would handle the password reset logic, like sending a reset email
    console.log("Reset link sent to:", email);
    router.push("/pages/PasswordResetConfirmation");
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <Paper sx={{ p: 4, width: "90%", maxWidth: "400px" }}>
        <Stack alignItems="center" justifyContent="center">
          <Typography variant="h4" sx={{ mb: 2 }}>
            Forgot Your Password?
          </Typography>
          <Typography variant="body1" sx={{ mb: 2, textAlign: "center" }}>
            Enter your email address below and we'll send you a link to reset
            your password.
          </Typography>
        </Stack>
        <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
          <TextField
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email Address"
            name="email"
            autoComplete="email"
            autoFocus
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            sx={{ mt: 3, mb: 2 }}
          >
            Send Reset Link
          </Button>
          <Grid container justifyContent="center">
            <Grid item>
              <Link href="/pages/LoginPage" variant="body2">
                {"Remembered your password? Log in"}
              </Link>
            </Grid>
          </Grid>
        </Box>
      </Paper>
    </main>
  );
}
