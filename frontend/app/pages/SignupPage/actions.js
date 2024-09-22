"use server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";

// REGISTER
//formData is an object that contains the user-input values from the textfields UI
export async function signup(formData) {
  const supabase = createClient();
  //Taking the email and password values from the formData
  const data = {
    email: formData.get("email"),
    password: formData.get("password"),
  };
  // Try to sign up with Supabase
  try {
    const { error } = await supabase.auth.signUp(data); // Attempt to sign up with the extracted data
    // If there's an error, handle it
    if (error) {
      // If the error is due to invalid credentials and the email already exists, return a specific error message
      if (
        error.code === "invalid-credentials" &&
        error.message.includes("already exists")
      ) {
        return { success: false, message: "The email is already used" };
      } else {
        console.error("Error signing up:", error); // Display "Error signing up:" + return a generic error message on the terminal or console
        return { success: false, message: error.message };
      }
    } else {
      // If the signup is successful, return a success message and an email link will be provided
      return {
        success: true,
        message: "Success! Confirm the link on your email.",
      };
    }
  } catch (error) {
    // Catch any other errors that might occur and log them
    console.error("Error signing up:", error);
    return { success: false, message: "Error signing up" };
  }
}
