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
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();
  const handleSubmit = () => {
    router.push("./pages/ChildRecords");
  };
  const [showPassword, setShowPassword] = useState(false);

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  return (
    <main
      className="flex min-h-screen flex-col items-center justify-center p-4"
      style={{ width: "100%", maxWidth: "390px" }}
    >
      <Paper sx={{ p: 3, width: "100%", maxWidth: "360px" }}>
        <Stack alignItems="center" justifyContent="center">
          <Typography variant="h4" align="center">WELCOME TO</Typography>
          <img src="/logo-wordmark.png" alt="logo" width="200" />
        </Stack>
        <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 2 }}>
          <TextField
            margin="normal"
            required
            fullWidth
            id="email"
            label="Enter Your Email Address"
            name="email"
            autoComplete="email"
            autoFocus
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            label=" New Password"
            type={showPassword ? "text" : "password"}
            id="password"
            autoComplete="current-password"
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
          <Link href="pages/ForgotPass" variant="body2">
            Forgot password?
          </Link>

          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            sx={{ mt: 3, mb: 2 }}
          >
            Sign In
          </Button>
          <Grid container justifyContent="center">
            <Grid item>
              <Link href="/pages/MobileSignIn" variant="body2">
                {"Do not have an account? Help Here "}
              </Link>
            </Grid>
          </Grid>
        </Box>
      </Paper>
    </main>
  );
}
