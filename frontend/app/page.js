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
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { fetchVaccines } from "@/utils/supabase/api";
export default function Home() {
  const [vaccines, setVaccines] = useState([]);

  useEffect(() => {
    async function loadVaccines() {
      const fetchedVaccines = await fetchVaccines();
      console.log("Vaccines loaded in component:", fetchedVaccines);
      setVaccines(fetchedVaccines);
    }
    loadVaccines();
  }, []);

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
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <Paper sx={{ p: 4, width: "90%", maxWidth: "400px" }}>
        <Stack
          alignItems="center" // Center contents horizontally
          justifyContent="center" // Center contents vertically
        >
          <Typography variant="h2">WELCOME TO</Typography>
          <img src="/logo-wordmark.png" alt="logo" width="400" />
        </Stack>
        <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
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
          <Link href="" variant="body2">
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
              <Link href="/pages/SignIn" variant="body2">
                {"Do not have an account? Sign in"}
              </Link>
            </Grid>
          </Grid>
        </Box>
      </Paper>
    </main>
  );
}
