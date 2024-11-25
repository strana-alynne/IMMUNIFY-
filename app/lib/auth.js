import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";

export async function getUser() {
  const supabase = createClient({ cookies });

  try {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    return user;
  } catch (error) {
    console.error("Error fetching user:", error.message);
    return null;
  }
}
