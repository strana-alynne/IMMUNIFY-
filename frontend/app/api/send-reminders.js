import { createClient } from "@supabase/supabase-js";
import Resend from "resend";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SECRET_KEY
);
const resend = new Resend(process.env.RESEND_API_KEY);

export default async function handler(req, res) {
  try {
    // Get the current date
    const today = new Date();

    // Query schedules 3 days before, 1 day before, and the day after
    const { data: schedules, error } = await supabase
      .from("Schedule")
      .select(
        `
        sched_id,
        scheduled_date,
        child_id,
        Child (
          mother_id,
          Mother (mother_email, mother_name)
        )
      `
      )
      .lte(
        "scheduled_date",
        new Date(today.setDate(today.getDate() + 3)).toISOString()
      )
      .gte(
        "scheduled_date",
        new Date(today.setDate(today.getDate() - 4)).toISOString()
      );

    if (error) throw error;

    for (const schedule of schedules) {
      const { scheduled_date, Child } = schedule;
      const { Mother } = Child;
      const { mother_email, mother_name } = Mother;

      const daysUntil = Math.ceil(
        (new Date(scheduled_date) - today) / (1000 * 60 * 60 * 24)
      );

      let emailSubject, emailBody;

      if (daysUntil === 3) {
        emailSubject = "Reminder: Vaccination in 3 Days";
        emailBody = `Dear ${mother_name},\n\nThis is a reminder that your child's vaccination is scheduled in 3 days on ${scheduled_date}.\n\nThank you.`;
      } else if (daysUntil === 1) {
        emailSubject = "Reminder: Vaccination Tomorrow";
        emailBody = `Dear ${mother_name},\n\nThis is a reminder that your child's vaccination is scheduled tomorrow on ${scheduled_date}.\n\nThank you.`;
      } else if (daysUntil === -1) {
        emailSubject = "Reminder: Missed Vaccination";
        emailBody = `Dear ${mother_name},\n\nThis is a reminder that your child's vaccination was scheduled on ${scheduled_date}. Please contact your health center.\n\nThank you.`;
      }

      if (emailSubject && emailBody) {
        await resend.emails.send({
          from: "clinic@example.com",
          to: mother_email,
          subject: emailSubject,
          text: emailBody,
        });
      }
    }

    res.status(200).json({ message: "Emails sent successfully." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to send emails." });
  }
}
