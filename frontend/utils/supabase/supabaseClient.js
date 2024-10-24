import { createClient } from "@/utils/supabase/client";

const supabase = createClient();
process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

//========================== ABOUT REMINDERS =================================

// CREATE A NEW REMINDER
export async function addReminder(title, description, type) {
  const { data, error } = await supabase.from("reminders").insert([
    {
      title,
      description,
      reminder_type: type,
      created_at: new Date().toISOString(), // Remove if handled by DB
    },
  ]);

  if (error) {
    console.error("Error adding new reminder:", error.message);
    return { success: false, error: error.message };
  }

  return { success: true, data };
}

// FETCH ALL REMINDERS (WITH SEARCH FUNCTIONALITY)
export async function fetchReminders(searchTerm = "") {
  let query = supabase
    .from("reminders")
    .select("id, title, description, reminder_type, created_at")
    .order("created_at", { ascending: false });

  if (searchTerm) {
    query = query.or(
      `title.ilike.%${searchTerm}%,description.ilike.%${searchTerm}%`
    );
  }

  const { data, error } = await query;

  if (error) {
    console.error("Error fetching reminders:", error.message);
    return { success: false, data: [] };
  }

  return { success: true, data };
}

// VIEW REMINDERS FOR MOBILE PAGE
export const viewReminders = async () => {
  const { data, error } = await supabase
    .from("reminders")
    .select("id, title, description, created_at") // Fetch only required fields
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error viewing reminders:", error.message, error.details);
    return { success: false, data: [], error };
  }

  return { success: true, data };
};

// Fetch a reminder by ID-- INDIVIDUAL VIEW PAGE
export async function fetchReminderById(id) {
  const { data, error } = await supabase
    .from("reminders")
    .select("*")
    .eq("id", id)
    .single(); // Fetch a single reminder

  if (error) {
    console.error("Error fetching reminder:", error.message);
    return { success: false, error: error.message };
  }

  return { success: true, data };
}

// DELETE A REMINDER
export async function deleteReminder(id) {
  const { data, error } = await supabase
    .from("reminders")
    .delete()
    .eq("id", id);

  if (error) {
    console.error("Error deleting reminder:", error.message);
    return { success: false, error: error.message };
  }

  return { success: true, data };
}
