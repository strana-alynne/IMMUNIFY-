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
        },scheduled_date.eq.${afterSchedule.toISOString().split("T")[0]}`
      );

    if (error) {
      throw error;
    }

    // Send emails
    for (const schedule of data) {
      const {
        scheduled_date,
        vaccine_id,
        Child: { Mother },
        Vaccine,
      } = schedule;

      const vaccineName = Vaccine.vaccine_name;
      const formattedDate = new Date(scheduled_date).toLocaleDateString();

      const subject =
        scheduled_date === threeDaysBefore.toISOString().split("T")[0]
          ? `Vaccination Reminder: 3 Days Left`
          : scheduled_date === oneDayBefore.toISOString().split("T")[0]
          ? `Vaccination Reminder: Tomorrow`
          : `Vaccination Follow-Up`;

      const message =
        scheduled_date === threeDaysBefore.toISOString().split("T")[0]
          ? `Hi ${Mother.mother_name}, this is a reminder that your child has the ${vaccineName} vaccination scheduled in 3 days on ${formattedDate}.`
          : scheduled_date === oneDayBefore.toISOString().split("T")[0]
          ? `Hi ${Mother.mother_name}, this is a reminder that your child has the ${vaccineName} vaccination scheduled tomorrow on ${formattedDate}.`
          : `Hi ${Mother.mother_name}, we noticed your child's ${vaccineName} vaccination was scheduled yesterday on ${formattedDate}. Please follow up if you missed it.`;

      try {
        const emailResponse = await resend.emails.send({
          from: "team@immunify.info", // Replace with your verified email
          to: Mother.mother_email,
          subject,
          html: `<p>${message}</p>`,
        });

        // Log the email response for debugging
        console.log("Email Response:", emailResponse);
      } catch (emailError) {
        console.error("Error sending email:", emailError.message);
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
