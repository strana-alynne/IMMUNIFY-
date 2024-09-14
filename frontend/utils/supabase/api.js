import { createClient } from "@/utils/supabase/client";

const supabase = createClient();

//DISPLAY VACCINES IN VACCINE INVENTORY
export async function fetchVaccines() {
  const { data, error } = await supabase
    .from("VaccineInventory")
    .select(
      `inventory_id, current_update, vaccine_quantity, Vaccine(vaccine_id, vaccine_name, doses_required)`
    );
  if (error) {
    console.error("Error fetching vaccines:", error.message);
    return [];
  }

  return data || [];
}

//GET THE INVENTORY TOTAL
export async function getInventoryTotal(vaccine_id) {
  const { data, error } = await supabase
    .from("VaccineInventory")
    .select("vaccine_quantity")
    .eq("vaccine_id", vaccine_id);

  if (error) {
    console.error("Error fetching inventory total:", error.message);
    return error.message;
  }

  return data[0].vaccine_quantity;
}

//DISPLAY STOCK PER VACCINE
export async function fetchVaccineStock(vaccine_id) {
  const { data, error } = await supabase
    .from("VaccineTransaction")
    .select(
      `transaction_id, transaction_date, transaction_type, transaction_quantity, batch_number, expiration_date, inventory_id)`
    )
    .eq("inventory_id", vaccine_id);
  if (error) {
    console.error("Error fetching vaccines:", error.message);
    return [];
  }

  return data || [];
}

// ADD VACCINE STOCK AND UPDATE INVENTORY QUANTITY
export async function addVaccineStock(addDetails) {
  const { data, error } = await supabase.from("VaccineTransaction").insert([
    {
      transaction_date: addDetails.transaction_date,
      transaction_type: addDetails.transaction_type,
      transaction_quantity: addDetails.transaction_quantity,
      batch_number: addDetails.batch_number,
      expiration_date: addDetails.expiration_date,
      inventory_id: addDetails.inventory_id,
    },
  ]);

  if (error) {
    console.error("Error adding vaccine stock:", error.message);
    return null;
  }
  const { data: inventoryData, error: inventoryError } = await supabase
    .from("VaccineInventory")
    .select("vaccine_quantity")
    .eq("inventory_id", addDetails.inventory_id)
    .single();

  if (inventoryError) {
    console.error(
      "Error fetching current vaccine quantity:",
      inventoryError.message
    );
    return null;
  }

  let newQuantity = inventoryData.vaccine_quantity;
  if (addDetails.transaction_type === "STOCK IN") {
    newQuantity += addDetails.transaction_quantity;
  } else if (addDetails.transaction_type === "STOCK OUT") {
    newQuantity -= addDetails.transaction_quantity;
  }

  const { error: updateError } = await supabase
    .from("VaccineInventory")
    .update({
      vaccine_quantity: newQuantity,
      current_update: addDetails.transaction_date,
    })
    .eq("inventory_id", addDetails.inventory_id);

  if (updateError) {
    console.error("Error updating vaccine quantity:", updateError.message);
    return null;
  }

  return data; // return the inserted transaction data
}

// UPDATE VACCINE STOCK AND ADJUST INVENTORY QUANTITY
export async function updateVaccineStock(updatedTransaction) {
  // Update the VaccineTransaction record with the new details
  const { data, error } = await supabase
    .from("VaccineTransaction")
    .update({
      transaction_date: updatedTransaction.transaction_date,
      transaction_type: updatedTransaction.transaction_type,
      transaction_quantity: updatedTransaction.transaction_quantity,
      batch_number: updatedTransaction.batch_number,
      expiration_date: updatedTransaction.expiration_date,
    })
    .eq("transaction_id", updatedTransaction.transaction_id);

  if (error) {
    console.error("Error updating vaccine stock:", error.message);
    return null;
  }

  // Fetch the current vaccine quantity in the inventory
  const { data: inventoryData, error: inventoryError } = await supabase
    .from("VaccineInventory")
    .select("vaccine_quantity")
    .eq("inventory_id", updatedTransaction.inventory_id)
    .single();

  if (inventoryError) {
    console.error(
      "Error fetching current vaccine quantity:",
      inventoryError.message
    );
    return null;
  }

  let currentQuantity = inventoryData.vaccine_quantity;

  // Fetch the original transaction to adjust the inventory correctly
  const { data: originalTransaction, error: originalError } = await supabase
    .from("VaccineTransaction")
    .select("transaction_type, transaction_quantity")
    .eq("transaction_id", updatedTransaction.transaction_id)
    .single();

  if (originalError) {
    console.error(
      "Error fetching original transaction:",
      originalError.message
    );
    return null;
  }

  // Adjust the inventory quantity based on the differences between the original and updated transaction
  if (originalTransaction.transaction_type === "STOCK IN") {
    currentQuantity -= originalTransaction.transaction_quantity;
  } else if (originalTransaction.transaction_type === "STOCK OUT") {
    currentQuantity += originalTransaction.transaction_quantity;
  }

  if (updatedTransaction.transaction_type === "STOCK IN") {
    currentQuantity += updatedTransaction.transaction_quantity;
  } else if (updatedTransaction.transaction_type === "STOCK OUT") {
    currentQuantity -= updatedTransaction.transaction_quantity;
  }

  // Update the vaccine inventory with the new quantity
  const { error: updateError } = await supabase
    .from("VaccineInventory")
    .update({
      vaccine_quantity: currentQuantity,
      current_update: updatedTransaction.transaction_date,
    })
    .eq("inventory_id", updatedTransaction.inventory_id);

  if (updateError) {
    console.error("Error updating vaccine quantity:", updateError.message);
    return null;
  }

  return data; // return the updated transaction data
}

// ADD CHILD AND MOTHER RECORDS
export async function addChild(
  motherData,
  childData,
  purokName,
  growthData,
  address
) {
  try {
    // Log input data for debugging
    console.log("Received motherData:", JSON.stringify(motherData, null, 2));
    console.log("Received childData:", JSON.stringify(childData, null, 2));
    console.log("Received growthData:", JSON.stringify(growthData, null, 2));
    console.log("Received purokName:", purokName);

    // Validate input data
    if (!motherData || !childData || !growthData || !purokName || !address) {
      throw new Error("Missing required data fields");
    }

    // Get purok ID from the purok name
    const { data: purok, error: purokError } = await supabase
      .from("Purok")
      .select("purok_id")
      .eq("purok_name", purokName)
      .single();

    if (purokError)
      throw new Error(`Error fetching Purok ID: ${purokError.message}`);
    if (!purok) throw new Error(`No Purok found with name: ${purokName}`);

    const purokId = purok.purok_id;
    console.log("Fetched Purok ID:", purokId);

    // Insert mother data
    const { data: mother, error: motherError } = await supabase
      .from("Mother")
      .insert([motherData])
      .select();

    if (motherError)
      throw new Error(`Error inserting Mother: ${motherError.message}`);
    const motherId = mother[0].mother_id;
    console.log("Inserted Mother ID:", motherId);

    // Insert child data
    const { data: child, error: childError } = await supabase
      .from("Child")
      .insert([
        {
          ...childData,
          ...address,
          mother_id: motherId,
          purok_id: purokId,
        },
      ])
      .select();

    if (childError)
      throw new Error(`Error inserting Child: ${childError.message}`);
    const childId = child[0].child_id;
    console.log("Inserted Child ID:", childId);

    // Insert growth data
    const { data: growth, error: growthError } = await supabase
      .from("Growth")
      .insert([
        {
          ...growthData,
          child_id: childId,
        },
      ])
      .select();

    if (growthError)
      throw new Error(`Error inserting Growth: ${growthError.message}`);
    console.log("Inserted Growth data:", growth);

    // Store child_id in localStorage
    localStorage.setItem("child_id", childId);
    // Log success and return response
    console.log("Insertion successful:", { mother, child, growth });
    return { success: true, mother, child, growth };
  } catch (error) {
    console.error("Error inserting data:", error.message);
    return { success: false, error: error.message };
  }
}

//DISPLAY INDIVIDUAL CHILD RECORDS
export async function fetchChild(child_id) {
  const { data, error } = await supabase
    .from("Child")
    .select(
      `child_id, child_name, child_age, birthdate, address, gender,
      Mother(mother_id, mother_name, contact_number, mother_email),
      Purok(purok_id, purok_name),
      Schedule(sched_id, scheduled_date, vaccine_id,
      ImmunizationRecords(record_id, date_administered, completion_status)
      )`
    )
    .eq("child_id", child_id);

  if (error) {
    console.error("Error fetching child:", error.message);
    return error.message;
  }

  return data || [];
}

//DISPLAY ALL CHILD RECORDS
export async function fetchAllChildren() {
  const { data, error } = await supabase
    .from("Child")
    .select(
      `
      child_id,
      child_name,
      child_age,
      birthdate,
      gender,
      Purok(purok_name),
      Mother(mother_name),
      Schedule!left (
        sched_id,
        scheduled_date,
        ImmunizationRecords!left (
          record_id,
          date_administered,
          completion_status
        )
      )
    `
    )
    .order("child_name");

  if (error) {
    console.error("Error fetching children data:", error);
    return [];
  }

  // Process the data to determine overall status
  const processedData = data.map((child) => {
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

    return { ...child, overallStatus };
  });

  console.log("Processed data:", processedData);
  return processedData;
}

//FETCH IMMUNIZATION RECORDS
export const updateImmunizationRecord = async (childId, vaccineData) => {
  // Update the schedules table
  const scheduleUpdates = vaccineData
    .map((vaccine) => ({
      child_id: childId,
      vaccine_id: vaccine.vaccineID,
      scheduled_date: vaccine.scheduledDate,
    }))
    .filter((item) => item.scheduled_date !== null);

  const { error: scheduleError } = await supabase
    .from("schedules")
    .upsert(scheduleUpdates, { onConflict: ["child_id", "vaccine_id"] });

  if (scheduleError) throw scheduleError;

  // Update the immunization_records table
  const immunizationUpdates = vaccineData
    .map((vaccine) => ({
      child_id: childId,
      vaccine_id: vaccine.vaccineID,
      date_administered: vaccine.administeredDate,
      completion_status: vaccine.status,
    }))
    .filter((item) => item.date_administered !== null);

  const { error: immunizationError } = await supabase
    .from("immunization_records")
    .upsert(immunizationUpdates, { onConflict: ["child_id", "vaccine_id"] });

  if (immunizationError) throw immunizationError;

  return { message: "Vaccine data updated successfully" };
};

//Fetching Latitude and Longitude
export async function geocodeAddress(address) {
  try {
    // Send the address to FastAPI for geocoding
    const response = await fetch(
      "https://immunify-dbscan.onrender.com/address",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ address: address }), // Sending the address to FastAPI
      }
    );

    if (!response.ok) {
      throw new Error("FastAPI request failed");
    }

    const result = await response.json();
    console.log(result);
    return result; // Expecting coordinates or result from FastAPI
  } catch (error) {
    console.error("Error in geocoding:", error.message);
    return { error: error.message };
  }
}

//Initial Schedule
export async function initialSchedule(sched) {
  const { data, error } = await supabase
    .from("Schedule")
    .insert([
      {
        scheduled_date: sched.scheduled_date,
        child_id: sched.child_id,
        vaccine_id: sched.vaccine_id,
      },
    ])
    .select("sched_id, scheduled_date");

  if (error) {
    console.error("Error inserting schedule:", error);
    return { error };
  }

  return { sched_id: data[0]?.sched_id, scheduledDate: data[0].scheduled_date }; // Return the inserted data
}

//Add initial immunization record
export async function addImmunizationRecord(
  scheduleId,
  date,
  status = "Completed"
) {
  const { data, error } = await supabase
    .from("ImmunizationRecords")
    .insert([
      {
        sched_id: scheduleId,
        completion_status: status,
        date_administered: date,
      },
    ])
    .select();

  if (error) {
    console.error("Error inserting immunization record:", error);
    return { error };
  }

  return { data: data[0] };
}

export async function handleSchedules(schedules, childId) {
  for (const [key, schedule] of Object.entries(schedules)) {
    const { vaccineId, date } = schedule;

    if (date === null) {
      console.log(
        `Null date for ${key}. Skipping schedule and immunization record.`
      );
      continue;
    }
    // Call initialSchedule for each schedule
    const result = await initialSchedule({
      scheduled_date: date,
      vaccine_id: vaccineId,
      child_id: childId, // Ensure childId is passed if needed
    });
    // Debugging to see the result
    console.log(`Result for ${key}:`, result);
    const immunizationResult = await addImmunizationRecord(
      result.sched_id,
      result.scheduledDate
    );
    console.log(`Immunization result for ${key}:`, immunizationResult);

    // Check if there's an error or data
    if (result.error) {
      console.error(`Error inserting schedule for ${key}:`, result.error);
    } else if (result.data) {
      console.log(`Schedule inserted successfully for ${key}:`, result.data);
    } else {
      console.log(`Unexpected result for ${key}:`, result);
    }
  }
}

export function logSchedule({ scheduled_date, vaccine_id, child_id }) {
  console.log("Logging schedule:", {
    scheduled_date,
    vaccine_id,
    child_id,
  });

  // Simulate successful logging
  return { data: { scheduled_date, vaccine_id, child_id } };
}
