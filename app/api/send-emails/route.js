import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/client";
import { Resend } from "resend";

const supabase = createClient();
const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST() {
  try {
    const today = new Date();
    const threeDaysBefore = new Date(today);
    threeDaysBefore.setDate(today.getDate() + 3);
    const oneDayBefore = new Date(today);
    oneDayBefore.setDate(today.getDate() + 1);
    const afterSchedule = new Date(today);
    afterSchedule.setDate(today.getDate() - 1);

    // Convert today to ISO date string for comparison
    const todayString = today.toISOString().split("T")[0];

    // Fetch schedules with vaccine info
    const { data, error } = await supabase
      .from("Schedule")
      .select(
        "scheduled_date, child_id, vaccine_id, Child(mother_id, Mother(mother_email, mother_name)), Vaccine(vaccine_name)"
      )
      .or(
        `scheduled_date.eq.${
          threeDaysBefore.toISOString().split("T")[0]
        },scheduled_date.eq.${
          oneDayBefore.toISOString().split("T")[0]
        },scheduled_date.eq.${todayString},scheduled_date.eq.${
          afterSchedule.toISOString().split("T")[0]
        }`
      );

    if (error) {
      throw error;
    }

    // Send emails
    for (const schedule of data) {
      const {
        scheduled_date,
        Child: { Mother },
        Vaccine,
      } = schedule;

      const vaccineName = Vaccine.vaccine_name;
      const formattedDate = new Date(scheduled_date).toLocaleDateString();

      let subject, message;

      // Determine email content based on schedule timing
      switch (scheduled_date) {
        case threeDaysBefore.toISOString().split("T")[0]:
          subject = "Vaccination Reminder: 3 Days Left";
          message = `Hi ${Mother.mother_name}, this is a reminder that your child has the ${vaccineName} vaccination scheduled in 3 days on ${formattedDate}.`;
          break;
        case oneDayBefore.toISOString().split("T")[0]:
          subject = "Vaccination Reminder: Tomorrow";
          message = `Hi ${Mother.mother_name}, this is a reminder that your child has the ${vaccineName} vaccination scheduled tomorrow on ${formattedDate}.`;
          break;
        case todayString:
          subject = "Vaccination Due Today";
          message = `Hi ${Mother.mother_name}, this is a reminder that your child's ${vaccineName} vaccination is scheduled for today. Please ensure you visit the clinic as planned.`;
          break;
        case afterSchedule.toISOString().split("T")[0]:
          subject = "Vaccination Follow-Up";
          message = `Hi ${Mother.mother_name}, we noticed your child's ${vaccineName} vaccination was scheduled yesterday on ${formattedDate}. Please follow up if you missed it.`;
          break;
        default:
          continue; // Skip if date doesn't match any conditions
      }

      try {
        const emailResponse = await resend.emails.send({
          from: "team@immunify.info",
          to: Mother.mother_email,
          subject,
          html: `<p>${message}</p>`,
        });

        console.log("Email Response:", emailResponse);
      } catch (emailError) {
        console.error("Error sending email:", emailError);
        return NextResponse.json(
          { error: emailError.message },
          { status: 500 }
        );
      }
    }

    return NextResponse.json({ message: "Emails sent successfully" });
  } catch (err) {
    console.error("Error fetching data or sending emails:", err.message);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
