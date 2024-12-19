// utils/supabase/dashboardmap.js
import { createClient } from "@/utils/supabase/client";

const supabase = createClient();

export async function setMap(startDate = null, endDate = null) {
  try {
    // Start with base query
    let query = supabase.from("Child")
      .select(`address, latitude, longitude, created_at,
          Schedule!left (
          sched_id,
          scheduled_date,
          ImmunizationRecords!left (
            record_id,
            date_administered,
            completion_status
          )
        )`);

    // Add date filters if provided
    if (startDate && endDate) {
      query = query.gte("created_at", startDate).lte("created_at", endDate);
    }

    const { data: locations, error } = await query;

    if (error) throw error;

    const processedLoc = locations.map((child) => {
      // Rest of your existing processing logic remains the same
      let overallStatus = "No Records";

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

      return {
        address: child.address,
        latitude: child.latitude,
        longitude: child.longitude,
        overallStatus: overallStatus,
      };
    });

    console.log("Processed locations:", processedLoc);

    const response = await fetch(
      "https://inner-tricia-immunify-284d2a41.koyeb.app/map_test",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({ locations: processedLoc }),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error("Network response was not ok", errorText);
    }

    const mapData = await response.text();
    return mapData;
  } catch (error) {
    console.error("Error in fetchLocationsAndMap:", error.message);
    throw error;
  }
}
