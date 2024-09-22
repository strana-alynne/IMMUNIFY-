import { createClient } from "@/utils/supabase/client";

const supabase = createClient();

//-----INVENTORY-------
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

//-----CHILD RECORDS-------

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
      .select("child_id");

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
      Schedule(sched_id, scheduled_date, Vaccine(vaccine_id, vaccine_name),
      ImmunizationRecords(record_id, date_administered, completion_status)
      )`
    )
    .eq("child_id", child_id);

  if (error) {
    console.error("Error fetching child:", error.message);
    return error.message;
  }

  if (!data || data.length === 0) {
    console.warn("No data found for child_id:", child_id);
    return [];
  }

  const processedData = data.map((child) => {
    let overallStatus = "No Records";

    // Check if Schedule exists and is an array
    if (
      child.Schedule &&
      Array.isArray(child.Schedule) &&
      child.Schedule.length > 0
    ) {
      let allCompleted = true;
      let hasMissed = false;
      let hasScheduled = false;

      child.Schedule.forEach((schedule) => {
        const currentDate = new Date();
        const scheduleDate = new Date(schedule.scheduled_date);

        // Check if schedule and ImmunizationRecords exist
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

  return processedData;
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

// ADD INITIAL SCHEDULE
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

//ADD INITAL IMMUNIZATION RECORDS
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

//HANDLE SCHEDULES
export async function handleSchedules(schedules, childId) {
  const nextVaccinesToSchedule = new Set();
  const scheduledVaccines = new Set();
  console.log("Initial scheduled vaccines:", scheduledVaccines);

  for (const [key, schedule] of Object.entries(schedules)) {
    const { vaccineId, date, createImmunizationRecord } = schedule;

    if (date === null) {
      console.log(`Null date for ${key}. Skipping schedule.`);
      continue;
    }

    if (!scheduledVaccines.has(vaccineId)) {
      const result = await initialSchedule({
        scheduled_date: date,
        vaccine_id: vaccineId,
        child_id: childId,
      });

      console.log(`Result for ${key}:`, result);

      if (result.error) {
        console.error(`Error inserting schedule for ${key}:`, result.error);
        continue;
      }

      if (createImmunizationRecord) {
        const immunizationResult = await addImmunizationRecord(
          result.sched_id,
          result.scheduledDate
        );
        console.log(
          `Immunization record created for ${key}:`,
          immunizationResult
        );
      } else {
        console.log(`Skipping immunization record creation for ${key}`);
      }

      scheduledVaccines.add(vaccineId);

      const nextVaccines = getNextVaccines(key);
      console.log(`Next vaccines for ${key}:`, nextVaccines);
      nextVaccines.forEach((nextVaccine) => {
        if (!scheduledVaccines.has(nextVaccine.vaccineId)) {
          nextVaccinesToSchedule.add(nextVaccine);
        }
      });
    }
  }

  for (const nextVaccine of nextVaccinesToSchedule) {
    if (!scheduledVaccines.has(nextVaccine.vaccineId)) {
      const scheduleDate =
        nextVaccine.vaccineId != "V004" && nextVaccine.vaccineId != "V007"
          ? addOneMonth(new Date(), 1.5)
          : addFourMonth(new Date(), 1.5);

      const nextResult = await initialSchedule({
        scheduled_date: scheduleDate,
        vaccine_id: nextVaccine.vaccineId,
        child_id: childId,
      });

      console.log(`Next schedule result for ${nextVaccine.name}:`, nextResult);

      if (nextResult.error) {
        console.error(
          `Error inserting next schedule for ${nextVaccine.name}:`,
          nextResult.error
        );
      } else {
        scheduledVaccines.add(nextVaccine.vaccineId);
      }
    }
  }
}

//GET THE VACCINE ID
function getNextVaccines(currentVaccine) {
  const nextVaccinesMap = {
    bcg: [
      { vaccineId: "V003", name: "Penta" },
      { vaccineId: "V004", name: "OPV" },
      { vaccineId: "V005", name: "PCV" },
      { vaccineId: "V006", name: "IPV" },
      { vaccineId: "V007", name: "MMR" },
    ],
    hepatitis_b: [
      { vaccineId: "V003", name: "Penta" },
      { vaccineId: "V004", name: "OPV" },
      { vaccineId: "V005", name: "PCV" },
      { vaccineId: "V006", name: "IPV" },
      { vaccineId: "V007", name: "MMR" },
    ],
    // Add mappings for other vaccines if needed
  };

  return nextVaccinesMap[currentVaccine] || [];
}

// GET THE MONTH FOR THE NEXT VACCINE
function addOneMonth(date) {
  const newDate = new Date(date);
  newDate.setMonth(newDate.getMonth() + 1);
  return newDate.toISOString().split("T")[0]; // Return formatted date as YYYY-MM-DD
}
function addFourMonth(date) {
  const newDate = new Date(date);
  newDate.setMonth(newDate.getMonth() + 4);
  return newDate.toISOString().split("T")[0]; // Return formatted date as YYYY-MM-DD
}

//CREATE NEW IMMUNIZATION RECORD
export async function newImmunizationRecord(record) {
  const { data, error } = await supabase
    .from("ImmunizationRecords")
    .insert(record)
    .select();

  if (error) {
    console.error("Error adding immunization record:", error);
    throw error;
  }

  console.log("this is fucking", data);
  return data;
}

export function determineCompletionStatus(scheduledDate, dateAdministered) {
  const scheduled = new Date(scheduledDate);
  const administered = new Date(dateAdministered);

  if (administered < scheduled) {
    return "Partially Complete";
  } else if (administered.toDateString() === scheduled.toDateString()) {
    return "Completed";
  } else {
    return "Missed";
  }
}

//CREATE NEW SCHEDULE
export const createNewSchedule = async (childId, vaccineId, scheduledDate) => {
  const { data, error } = await supabase
    .from("Schedule")
    .insert({
      child_id: childId,
      vaccine_id: vaccineId,
      scheduled_date: scheduledDate,
    })
    .select();

  console.log("newSchedule from API", data);
  if (error) throw new Error(error.message);
  return data;
};

//UPDATES IMMUNIZATION RECORD
export async function updateRecords(updateRecord) {
  // Update the VaccineTransaction record with the new details
  const { data, error } = await supabase
    .from("ImmunizationRecords")
    .update({
      date_administered: updateRecord.date_administered,
    })
    .eq("record_id", updateRecord.record_id);

  console.log("newRecord from API", data);
  if (error) {
    console.error("Error updating vaccine stock:", error.message);
    return null;
  }
  return data;
}

//-----FAST API -------

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

