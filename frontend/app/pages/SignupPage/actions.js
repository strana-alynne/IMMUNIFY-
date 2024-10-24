"use server";
import { createClient } from "@/utils/supabase/server";

export async function signup(formData) {
  const supabase = createClient();
  const email = formData.get("email");
  const password = formData.get("password");
  const role = formData.get("role");

  try {
    // Step 1: Sign up the user with metadata
    const { data: authData, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          role: role, // Add role to user_metadata
        },
      },
    });

    if (signUpError) {
      console.error("Signup error:", signUpError);
      return { success: false, message: signUpError.message };
    }

    if (!authData || !authData.user) {
      console.error("No user data returned");
      return { success: false, message: "Error creating user" };
    }

    // Step 2: Create user profile in the database
    const { error: profileError } = await supabase
      .from("user_profiles")
      .insert([
        {
          id: authData.user.id,
          email: email,
          role: role,
        },
      ]);

    if (profileError) {
      console.error("Error creating user profile:", profileError);
      // Optional: delete the auth user if profile creation fails
      await supabase.auth.admin.deleteUser(authData.user.id);
      return { success: false, message: "Error creating user profile" };
    }

    return {
      success: true,
      message:
        "Success! User created and profile set up. Please confirm the link in your email.",
    };
  } catch (error) {
    console.error("Unexpected error during signup:", error);
    return { success: false, message: "Unexpected error during signup" };
  }
}
