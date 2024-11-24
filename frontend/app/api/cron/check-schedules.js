import { Resend } from "resend";
import { createClient } from "@/utils/supabase/client";
import { createReminderEmail } from "@/utils/email";

const resend = new Resend(process.env.RESEND_API_KEY);

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const supabase = createClient();
  try {
    const today = new Date();
    const threeDaysFromNow = new Date(today);
    threeDaysFromNow.setDate(today.getDate() + 3);
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);

    // Format dates for PostgreSQL
    const formatDate = (date) => date.toISOString().split("T")[0];

    // Get schedules and related information
    const { data: schedules, error } = await supabase
      .from("Schedule")
      .select(
        `
        *,
        Child (
          child_name,
          Mother (
            mother_name,
            mother_email
          )
        ),
        Vaccine (
          vaccine_name
        )
      `
      )
      .or(
        `scheduled_date.eq.${formatDate(
          threeDaysFromNow
        )},scheduled_date.eq.${formatDate(
          tomorrow
        )},scheduled_date.eq.${formatDate(yesterday)}`
      );

    if (error) throw error;

    // Send emails for each relevant schedule
    for (const schedule of schedules) {
      const { Child: child, Vaccine: vaccine } = schedule;
      const { mother_name, mother_email } = child.Mother;
      const scheduledDate = new Date(schedule.scheduled_date);

      let emailType;
      if (formatDate(scheduledDate) === formatDate(threeDaysFromNow)) {
        emailType = "threeDaysBefore";
      } else if (formatDate(scheduledDate) === formatDate(tomorrow)) {
        emailType = "dayBefore";
      } else if (formatDate(scheduledDate) === formatDate(yesterday)) {
        emailType = "afterSchedule";
      }

      const { subject, text } = createReminderEmail(
        mother_name,
        child.child_name,
        vaccine.vaccine_name,
        scheduledDate,
        emailType
      );

      await resend.emails.send({
        from: "team@immunify.info",
        to: mother_email,
        subject: subject,
        text: text,
      });
    }

    return res
      .status(200)
      .json({ message: "Reminder emails sent successfully" });
  } catch (error) {
    console.error("Error sending reminder emails:", error);
    return res.status(500).json({ error: "Failed to send reminder emails" });
  }
}
