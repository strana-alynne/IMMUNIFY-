import { createClient } from "@/utils/supabase/client";
import { sendReminderEmail } from "@/utils/emailService";

const getSchedulesForReminders = async (daysFromNow) => {
  const supabase = createClient();
  const targetDate = new Date();
  targetDate.setDate(targetDate.getDate() + daysFromNow);

  const { data, error } = await supabase
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
      )
    `
    )
    .eq("scheduled_date", targetDate.toISOString().split("T")[0]);

  if (error) {
    console.error("Error fetching schedules:", error);
    return [];
  }

  return data;
};

export const sendThreeDayReminders = async () => {
  const schedules = await getSchedulesForReminders(3);
  for (const schedule of schedules) {
    await sendReminderEmail(
      schedule.Child.Mother.mother_email,
      schedule.Child.child_name,
      schedule.scheduled_date,
      "three-days"
    );
  }
};

export const sendOneDayReminders = async () => {
  const schedules = await getSchedulesForReminders(1);
  for (const schedule of schedules) {
    await sendReminderEmail(
      schedule.Child.Mother.mother_email,
      schedule.Child.child_name,
      schedule.scheduled_date,
      "one-day"
    );
  }
};

export const sendAfterScheduleReminders = async () => {
  const schedules = await getSchedulesForReminders(-1);
  for (const schedule of schedules) {
    await sendReminderEmail(
      schedule.Child.Mother.mother_email,
      schedule.Child.child_name,
      schedule.scheduled_date,
      "after"
    );
  }
};

// For local testing
if (require.main === module) {
  const command = process.argv[2];
  switch (command) {
    case "three-days":
      sendThreeDayReminders();
      break;
    case "one-day":
      sendOneDayReminders();
      break;
    case "after":
      sendAfterScheduleReminders();
      break;
    default:
      console.log(
        "Please specify reminder type: three-days, one-day, or after"
      );
  }
}
