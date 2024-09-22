"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";

// LOGIN
export async function login(formData) {
  const supabase = createClient();

  const data = {
    email: formData.get("email"),
    password: formData.get("password"),
  };

  const { user, error } = await supabase.auth.signInWithPassword(data);

  if (error) {
    if (error.status === 403) {
      // Email is not registered
      return { error: "Email is not registered" };
    } else if (error.status === 401) {
      // Incorrect password
      return { error: "Incorrect password" };
    } else {
      // Other error
      return { error: "An error occurred" };
    }
  }

  // Login successful, redirect to dashboard
  revalidatePath("/pages/Dashboard", "layout");
  redirect("/pages/Dashboard");
}
