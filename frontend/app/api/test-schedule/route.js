// app/api/test-schedule/route.js
import { createClient } from "@supabase/supabase-js";

export async function GET() {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
  );

  try {
    const { data, error } = await supabase.functions.invoke("check-schedules");

    if (error) throw error;

    return Response.json({ message: "Success", data });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}
