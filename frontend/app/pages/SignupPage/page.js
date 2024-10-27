// Importing necessary modules from Material UI
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
  Select,
  MenuItem,
  FormControl,
  FormHelperText,
} from "@mui/material";
// Importing icons from Material UI
import { Visibility, VisibilityOff } from "@mui/icons-material";
// Importing necessary modules from React
import { useState } from "react";
import * as React from "react";
// Importing signup function from the actions module
import { signup } from "./actions";
import { toast, Toaster } from "sonner";
import { useRouter } from "next/navigation";

// Define the RegisterPage component
export default function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false); // State to track whether the password is visible or not
  const [password, setPassword] = useState(""); // State to store the password input by the user
  const [confirmPassword, setConfirmPassword] = useState(""); // State to store the confirm password input by the user
  const [error, setError] = useState(null); // State to store any error messages
  const [success, setSuccess] = useState(null); // State to store any success messages
  const [loading, setLoading] = useState(false); // State to track whether the form is being submitted
  const [role, setRole] = useState(""); // State to store the user's role (combo box)
  const handleClickShowPassword = () => setShowPassword((show) => !show); // Function to toggle the visibility of the password
  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };
  const router = useRouter();
  // Create a reference to the form element
  const formRef = React.createRef();
  // Function to handle the form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    // Check if the password and confirm password match
    if (password !== confirmPassword) {
      console.log("Passwords do not match");
      toast.error("Passwords do not match"); // Error message if they don't match
      setError("Passwords do not match"); // Error message if they don't match
      setSuccess(null);
    } else {
      // Get the form data from the form reference
      const formData = new FormData(formRef.current);
      formData.append("role", role);
      // Get the email from the form data
      const email = formData.get("email");
      if (!email) {
        // Check if the email is empty
        setError("Email is required");
        setSuccess(null);
      } else if (!role) {
        setError("User role required");
        setSuccess(null);
      } else {
        setError(null); // Clear any previous error messages
        setLoading(true); // Set the loading state to true
        const response = await signup(formData);
        setLoading(false);
        if (response.success) {
          toast.success(response.message); // If successful, show success message
          router.replace("/pages/LoginPage"); // Redirect to the login page
        }
        // Check if the signup was successful
        if (response.success) {
          toast.success(response.message, {
            duration: 900000, // Show toast for 2 seconds
            onDismiss: () => {
              router.replace("/pages/LoginPage");
            },
          }); // If successful, show success message
        } else {
          if (response.message === "The email is already used") {
            toast.error(
              "Email already exists. Please use a different email address."
            );
            setError(
              "Email already exists. Please use a different email address."
            );
          } else {
            toast.error(response.message); // If not, error message
          }
        }
      }
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-2 sm:p-4 md:p-8">
      <Paper sx={{ p: 4, width: "90%", maxWidth: "400px" }}>
        <Stack alignItems="center" justifyContent="center">
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
              onChange={(e) => setPassword(e.target.value)}
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

            <TextField
              margin="normal"
              required
              fullWidth
              name="confirmPassword"
              label="Confirm New Password"
              type={showPassword ? "text" : "password"}
              id="confirmPassword"
              autoComplete="current-password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
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

            <FormControl fullWidth>
              <Select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                displayEmpty
                inputProps={{ "aria-label": "Without label" }}
              >
                <MenuItem value="">Select Role</MenuItem>
                <MenuItem value="NURSE">NURSE</MenuItem>
                <MenuItem value="BHW">BHW</MenuItem>
              </Select>
              <FormHelperText>Select your role</FormHelperText>
            </FormControl>

            {
              (error && console.log(error),
              (
                <Toaster
                  richColors
                  position="top-center"
                  severity="error"
                  autoHideDuration={3000}
                />
              ))
            }
            {success &&
              (console.log(success),
              (
                <Toaster
                  richColors
                  position="top-center"
                  severity="error"
                  autoHideDuration={3000}
                />
              ))}

            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              sx={{ mt: 3, mb: 2 }}
              onClick={handleSubmit}
              disabled={loading}
            >
              {loading ? "Loading..." : "Sign Up"}
            </Button>

            <Grid container justifyContent="center">
              <Grid item>
                <Link href="/pages/LoginPage" variant="body2">
                  {"Already have an account? Log In"}
                </Link>
              </Grid>
            </Grid>
          </Box>
        </form>
      </Paper>
    </main>
  );
}
