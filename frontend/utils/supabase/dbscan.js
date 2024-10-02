import { createClient } from "@/utils/supabase/client";

const supabase = createClient();

// Fetch children data from the database
export async function fecthChildrenData() {
  const { data, error } = await supabase.from("Child").select(
    `
      child_id,
      latitude,
      longitude,
      Purok(purok_name),
      Schedule!left (
        sched_id,
        scheduled_date,
        Vaccine(vaccine_id, vaccine_name),
        ImmunizationRecords!left (
          record_id,
          completion_status
        )
      )
    `
  );
  if (error) {
    console.error("Error fetching children data:", error);
    return [];
  }

  const processedData = data.map((child) => {
    let overallStatus = "No Records";

    // Process the data to determine overall status
    if (child.Schedule && child.Schedule.length > 0) {
      let allCompleted = true;
      let hasMissed = false;
      let hasScheduled = false;

      child.Schedule.forEach((schedule) => {
        const currentDate = new Date();
        const scheduleDate = new Date(schedule.scheduled_date);

        if (
          !schedule.ImmunizationRecords ||
          schedule.ImmunizationRecords.length === 0
        ) {
          if (scheduleDate < currentDate) {
            hasMissed = true;
          } else {
            hasScheduled = true;
          }
          allCompleted = false;
        } else {
          schedule.ImmunizationRecords.forEach((record) => {
            if (record.completion_status !== "Completed") {
              allCompleted = false;
              if (
                record.completion_status === "Missed" ||
                (scheduleDate < currentDate && !record.date_administered)
              ) {
                hasMissed = true;
              } else if (scheduleDate > currentDate) {
                hasScheduled = true;
              }
            }
          });
        }
      });

      if (hasMissed) {
        overallStatus = "Missed";
      } else if (allCompleted) {
        overallStatus = "Complete";
      } else if (hasScheduled) {
        overallStatus = "Partially Complete";
      }
    }

    return { ...child, overallStatus };
  });
  console.log(
    "overallStatus",
    processedData.filter((child) => child.overallStatus === "Missed")
  );
  return processedData.filter((child) => child.overallStatus === "Missed");
}

//PASS TO THE DBSCAN

export async function DBSCAN(data) {
  try {
    console.log(JSON.stringify(data, null, 2));
    const response = await fetch("http://127.0.0.1:8000/dbscan", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorBody = await response.text();
      console.error(
        "Error sending data to FastAPI:",
        response.status,
        response.statusText,
        errorBody
      );
      throw new Error(
        `HTTP error! status: ${response.status}, message: ${errorBody}`
      );
    }

    const result = await response.json();
    console.log("DBSCAN result:", result);
    return result;
  } catch (error) {
    console.error("Error in DBSCAN function:", error);
    throw error; // Re-throw the error for the caller to handle
  }
}
