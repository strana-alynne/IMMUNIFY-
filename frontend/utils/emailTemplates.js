export const createReminderEmail = (
  motherName,
  childName,
  vaccineName,
  scheduledDate,
  type
) => {
  const formattedDate = new Date(scheduledDate).toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const subjects = {
    threeDaysBefore: `Upcoming Vaccination Reminder - 3 Days Until ${childName}'s Appointment`,
    dayBefore: `Tomorrow's Vaccination Appointment for ${childName}`,
    afterSchedule: `Missed Vaccination Appointment for ${childName}`,
  };

  const messages = {
    threeDaysBefore: `
        Dear ${motherName},
  
        This is a reminder that ${childName} has an upcoming vaccination appointment in 3 days on ${formattedDate} for their ${vaccineName} vaccine.
  
        Please ensure you attend this important appointment for your child's health.
      `,
    dayBefore: `
        Dear ${motherName},
  
        This is a reminder that ${childName} has a vaccination appointment tomorrow, ${formattedDate}, for their ${vaccineName} vaccine.
  
        Please don't forget to attend this important appointment.
      `,
    afterSchedule: `
        Dear ${motherName},
  
        Our records show that ${childName} missed their vaccination appointment scheduled for ${formattedDate} for their ${vaccineName} vaccine.
  
        Please contact us to reschedule this important vaccination.
      `,
  };

  return {
    subject: subjects[type],
    text: messages[type],
  };
};
