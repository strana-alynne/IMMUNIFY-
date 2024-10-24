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

  const { error } = await supabase.auth.signInWithPassword(data);

  if (error) {
    if (error.status === 403) {
      return "Email is not registered";
    } else if (error.status === 401) {
      return "Incorrect password";
    } else {
      return "An error occurred";
    }
  }
  // Login successful, redirect to dashboard
  revalidatePath("/pages/Dashboard", "layout");
  redirect("/pages/Dashboard");
}
