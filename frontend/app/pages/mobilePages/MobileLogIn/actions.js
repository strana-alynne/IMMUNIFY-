"use server";

import { createClient } from "@/utils/supabase/server";

export async function sendOTP(formData) {
  const supabase = createClient();

  const email = formData.get("email");

  const { data, error } = await supabase
    .from("Mother")
    .select("mother_id")
    .eq("mother_email", email)
    .eq("role", "mother");

  if (error) {
    return `Error checking email: ${error.message}`;
  }

  if (!data || data.length === 0) {
    return "No account found with this email address.";
  }

  // If the user exists and has the correct role, send the OTP
  const { error: signError } = await supabase.auth.signInWithOtp({
    email,
    options: {
      shouldCreateUser: false, // This prevents creating a new user if they don't exist
    },
  });

  if (signError) {
    return "Error sending OTP. Please try again.";
  }

  return "OTP sent. Please check your email.";
}

export async function verifyOTP(formData) {
  const supabase = createClient();

  const email = formData.get("email");
  const otp = formData.get("otp");

  const { error } = await supabase.auth.verifyOtp({
    email,
    token: otp,
    type: "email",
  });

  if (error) {
    return "Invalid OTP. Please try again.";
  } else {
    return "success";
  }
}
