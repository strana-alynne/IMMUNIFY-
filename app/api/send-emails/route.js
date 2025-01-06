import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/client";
import { Resend } from "resend";

const supabase = createClient();
const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST() {
  try {
    const today = new Date();
    const threeDaysBefore = new Date(today);
    threeDaysBefore.setDate(today.getDate() - 3);
    const oneDayBefore = new Date(today);
    oneDayBefore.setDate(today.getDate() - 1);
    const afterSchedule = new Date(today);
    afterSchedule.setDate(today.getDate() + 1);

    // Fetch schedules with vaccine info
    const { data: schedules, error } = await supabase
      .from("Schedule")
      .select(
        "scheduled_date, child_id, vaccine_id, Child(mother_id, Mother(mother_email, mother_name)), Vaccine(vaccine_name)"
      )
      .or(
        `scheduled_date.eq.${
          threeDaysBefore.toISOString().split("T")[0]
        },scheduled_date.eq.${
          oneDayBefore.toISOString().split("T")[0]
        },scheduled_date.eq.${afterSchedule.toISOString().split("T")[0]}`
      );

    if (error) {
      throw error;
    }

    // Group schedules by mother and date
    const groupedSchedules = schedules.reduce((acc, schedule) => {
      const motherEmail = schedule.Child.Mother.mother_email;
      const date = schedule.scheduled_date;

      if (!acc[motherEmail]) {
        acc[motherEmail] = {
          motherName: schedule.Child.Mother.mother_name,
          dates: {},
        };
      }

      if (!acc[motherEmail].dates[date]) {
        acc[motherEmail].dates[date] = [];
      }

      acc[motherEmail].dates[date].push(schedule.Vaccine.vaccine_name);
      return acc;
    }, {});

    // Send emails for each mother
    for (const motherEmail of Object.keys(groupedSchedules)) {
      const { motherName, dates } = groupedSchedules[motherEmail];

      for (const scheduledDate of Object.keys(dates)) {
        const vaccines = dates[scheduledDate];
        const formattedDate = new Date(scheduledDate).toLocaleDateString();
        const vaccineList = vaccines.join(", ");

        let subject, message;

        if (scheduledDate === threeDaysBefore.toISOString().split("T")[0]) {
          subject = "Vaccination Reminder: 3 Days Left";
          message = `Hi ${motherName}, this is a reminder that your child has the following vaccinations scheduled in 3 days on ${formattedDate}:\n\n${vaccines
            .map((v) => `- ${v}`)
            .join("\n")}`;
        } else if (scheduledDate === oneDayBefore.toISOString().split("T")[0]) {
          subject = "Vaccination Reminder: Tomorrow";
          message = `Hi ${motherName}, this is a reminder that your child has the following vaccinations scheduled tomorrow on ${formattedDate}:\n\n${vaccines
            .map((v) => `- ${v}`)
            .join("\n")}`;
        } else {
          subject = "Vaccination Follow-Up";
          message = `Hi ${motherName}, we noticed your child's following vaccinations were scheduled yesterday on ${formattedDate}. Please follow up if you missed any:\n\n${vaccines
            .map((v) => `- ${v}`)
            .join("\n")}`;
        }

        try {
          const emailResponse = await resend.emails.send({
            from: "team@immunify.info",
            to: motherEmail,
            subject,
            html: `<p>${message.replace(/\n/g, "<br>")}</p>`,
          });

          console.log("Email Response:", emailResponse);
        } catch (emailError) {
          console.error("Error sending email:", emailError.message);
          return NextResponse.json(
            { error: emailError.message },
            { status: 500 }
          );
        }
      }
    }

    return NextResponse.json({ message: "Emails sent successfully" });
  } catch (err) {
    console.error("Error fetching data or sending emails:", err.message);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
