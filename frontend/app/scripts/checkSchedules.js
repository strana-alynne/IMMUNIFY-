// scripts/checkSchedules.js
import { createClient } from "@/utils/supabase/client";
import { Resend } from "resend";

const supabase = createClient();

const resend = new Resend();

async function processSchedules() {
  try {
    const today = new Date();

    // Fetch schedules for the next 3 days
    const { data: schedules, error } = await supabase
      .from("Schedule")
      .select(
        `
        sched_id,
        scheduled_date,
        Child (
          child_id,
          child_name,
          Mother (
            mother_id,
            mother_name,
            mother_email
          )
        ),
        Vaccine (
          vaccine_id,
          vaccine_name
        )
      `
      )
      .gte("scheduled_date", today.toISOString().split("T")[0])
      .lte(
        "scheduled_date",
        new Date(today.getTime() + 4 * 24 * 60 * 60 * 1000)
          .toISOString()
          .split("T")[0]
      );

    if (error) throw error;

    // Process each schedule
    for (const schedule of schedules) {
      const scheduledDate = new Date(schedule.scheduled_date);
      const daysUntilSchedule = Math.floor(
        (scheduledDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
      );

      // Determine email template and subject
      let emailTemplate = "";
      let subject = "";

      if (daysUntilSchedule === 3) {
        subject = "3 Days Until Vaccination Schedule";
        emailTemplate = getThreeDayReminderTemplate(schedule);
      } else if (daysUntilSchedule === 1) {
        subject = "Tomorrow is Vaccination Day";
        emailTemplate = getOneDayReminderTemplate(schedule);
      } else if (daysUntilSchedule === 0) {
        subject = "Vaccination Schedule Today";
        emailTemplate = getTodayReminderTemplate(schedule);
      }

      // Send email if template is set
      if (emailTemplate) {
        try {
          await resend.emails.send({
            from: "Vaccination Reminder <noreply@yourdomain.com>",
            to: schedule.Child.Mother.mother_email,
            subject: subject,
            html: emailTemplate,
          });

          console.log(
            `✅ Sent ${subject} email to ${schedule.Child.Mother.mother_email}`
          );
        } catch (error) {
          console.error(
            `❌ Failed to send email for schedule ${schedule.sched_id}:`,
            error
          );
        }
      }
    }

    console.log("✨ Successfully processed all schedules");
  } catch (error) {
    console.error("❌ Error processing schedules:", error);
    process.exit(1);
  }
}

// Email templates
function getThreeDayReminderTemplate(schedule) {
  return `
    <div>
      <h2>Upcoming Vaccination Reminder</h2>
      <p>Dear ${schedule.Child.Mother.mother_name},</p>
      <p>This is a reminder that ${
        schedule.Child.child_name
      } has an upcoming vaccination schedule in 3 days.</p>
      <p>Details:</p>
      <ul>
        <li>Vaccine: ${schedule.Vaccine.vaccine_name}</li>
        <li>Date: ${new Date(schedule.scheduled_date).toLocaleDateString()}</li>
      </ul>
      <p>Please ensure you bring your child to the health center on the scheduled date.</p>
    </div>
  `;
}

function getOneDayReminderTemplate(schedule) {
  return `
    <div>
      <h2>Tomorrow's Vaccination Schedule</h2>
      <p>Dear ${schedule.Child.Mother.mother_name},</p>
      <p>This is a reminder that ${
        schedule.Child.child_name
      }'s vaccination is scheduled for tomorrow.</p>
      <p>Details:</p>
      <ul>
        <li>Vaccine: ${schedule.Vaccine.vaccine_name}</li>
        <li>Date: ${new Date(schedule.scheduled_date).toLocaleDateString()}</li>
      </ul>
      <p>Please don't forget to bring your child to the health center tomorrow.</p>
    </div>
  `;
}

function getTodayReminderTemplate(schedule) {
  return `
    <div>
      <h2>Vaccination Schedule Today</h2>
      <p>Dear ${schedule.Child.Mother.mother_name},</p>
      <p>This is a reminder that ${
        schedule.Child.child_name
      }'s vaccination is scheduled for today.</p>
      <p>Details:</p>
      <ul>
        <li>Vaccine: ${schedule.Vaccine.vaccine_name}</li>
        <li>Date: ${new Date(schedule.scheduled_date).toLocaleDateString()}</li>
      </ul>
      <p>Please ensure you visit the health center today for your child's vaccination.</p>
    </div>
  `;
}

// Run the script
processSchedules();
