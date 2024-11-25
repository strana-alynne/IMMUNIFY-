import { createClient } from "@/utils/supabase/client";

const supabase = createClient();

export async function deleteChat(mother_id) {
  const { data, error } = await supabase
    .from("conversations")
    .select(`conversation_id`)
    .eq("mother_id", mother_id);

  if (error) {
    console.error("Error fetching record_id:", error.message);
    return error.message;
  }

  const conv_id = data[0].conversation_id;
  console.log("conv_id", conv_id);

  const { error: error2 } = await supabase
    .from("messages")
    .delete()
    .eq("conversation_id", conv_id);

  if (error2) {
    console.error("Error fetching record_id:", error.message);
    return error2.message;
  }

  const { error: error3 } = await supabase
    .from("conversations")
    .delete()
    .eq("conversation_id", conv_id);

  if (error3) {
    console.error("Error fetching record_id:", error.message);
    return error3.message;
  }
}
