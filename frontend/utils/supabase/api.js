import { createClient } from "@/utils/supabase/client";
import { stringify } from "postcss";

const supabase = createClient();

//========================== ABOUT INVENTORY =================================

export const subscribeToVaccineTransactions = (inventoryId, callback) => {
  const subscription = supabase
    .channel(`vaccine-transactions-${inventoryId}`)
    .on(
      "postgres_changes",
      {
        event: "*",
        schema: "public",
        table: "VaccineTransaction",
        filter: `inventory_id=eq.${inventoryId}`,
      },
      (payload) => {
        callback(payload);
      }
    )
    .subscribe();

  return subscription;
};
//DELETE VACCINE
export async function delVaccine(inventory, id, type, qtty) {
  // Fetch the current vaccine quantity in the inventory
  const { data: inventoryData, error: inventoryError } = await supabase
    .from("VaccineInventory")
    .select("vaccine_quantity")
    .eq("inventory_id", inventory)
    .single(); // Use single() to ensure only one row is returned

  if (inventoryError) {
    console.error(
      "Error fetching current vaccine quantity:",
      inventoryError.message
    );
    return null;
  }

  // Ensure we have a current quantity from the fetched data
  let currentQuantity = inventoryData.vaccine_quantity;

  // Adjust the inventory quantity based on the transaction type
  if (type === "STOCK IN") {
    currentQuantity -= qtty;
  } else if (type === "STOCK OUT") {
    currentQuantity += qtty;
  }

  // Update the vaccine inventory with the new quantity
  const { error: updateError } = await supabase
    .from("VaccineInventory")
    .update({
      vaccine_quantity: currentQuantity,
      current_update: new Date().toISOString(),
    })
    .eq("inventory_id", inventory);

  if (updateError) {
    console.error("Error updating vaccine quantity:", updateError.message);
    return null;
  }

  // Delete the VaccineTransaction record
  const { error } = await supabase
    .from("VaccineTransaction")
    .delete()
    .eq("transaction_id", id);

  if (error) {
    console.error("Error deleting vaccine transaction:", error.message);
    return null;
  }

  return console.log("Succesfully deleted"); // Return the deleted transaction data or any confirmation if needed
}

//DISPLAY VACCINES IN VACCINE INVENTORY
export async function fetchVaccines() {
  const { data, error } = await supabase
    .from("VaccineInventory")
    .select(
      `inventory_id, current_update, vaccine_quantity, Vaccine(vaccine_id, vaccine_name, vials_per_baby)`
    )
    .order("vaccine_id", { ascending: true });
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

//DISPLAY STOCK OF SELECTED VACCINE
export async function fetchVaccineStock(inventory_id) {
  const { data, error } = await supabase
    .from("VaccineTransaction")
    .select(
      `transaction_id, transaction_date, transaction_type, transaction_quantity, batch_number, expiration_date, inventory_id, remarks)`
    )
    .eq("inventory_id", inventory_id)
    .order("created_at", { ascending: true });

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
      remarks: addDetails.remarks,
      created_at: new Date().toISOString(),
    },
  ]);

  if (error) {
    console.error("Error adding vaccine stock:", error);
    alert(`Error adding vaccine stock: ${error.message}`);
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

//GET INVENTORY ID
export async function getInventoryId(vaccine_id) {
  const { data, error } = await supabase
    .from("VaccineInventory")
    .select(`inventory_id`)
    .eq("vaccine_id", vaccine_id);

  if (error) {
    console.error("Error fetching vaccines:", error.message);
    return [];
  }

  return data[0].inventory_id;
}

// UPDATE VACCINE STOCK AND ADJUST INVENTORY QUANTITY
export async function updateVaccineStock(updatedTransaction) {
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

  console.log("originalTransaction", originalTransaction);
  // Update the VaccineTransaction record with the new details
  console.log("updatedTransactidjdjhon", updatedTransaction.inventory_id);
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
  console.log("currentQuantity", currentQuantity);
  // Fetch the original transaction to adjust the inventory correctly

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

  console.log("currentQuantity", currentQuantity);
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

// CHECK VACCINE STOCK
export async function checkVaccineStock(vaccine_id, quantity) {
  const { data, error } = await supabase
    .from("VaccineInventory")
    .select("vaccine_quantity")
    .eq("vaccine_id", vaccine_id)
    .select();
  if (error) {
    console.error("Error fetching inventory total:", error.message);
    return false;
  }

  console.log("qtty", data, data[0].vaccine_quantity);
  if (data[0].vaccine_quantity >= quantity) {
    return true;
  } else {
    return false;
  }
}

//========================== MOTHER ACCOUNT=================================
export const updateMotherDetails = async (motherId, updatedData) => {
  const { data, error } = await supabase
    .from("Mother")
    .update(updatedData)
    .eq("mother_id", motherId);

  if (error) throw error;
  return data;
};

export const motherService = {
  /**
   * Search for mothers by name or email
   * @param {string} query - Search query
   * @returns {Promise<{data: Array, error: Error}>}
   */
  async searchMothers(query) {
    if (!query || query.length < 2) {
      return { data: [], error: null };
    }

    try {
      const { data, error } = await supabase
        .from("Mother")
        .select("mother_id, mother_name, mother_email, contact_number")
        .or(`mother_name.ilike.%${query}%,mother_email.ilike.%${query}%`)
        .order("mother_name", { ascending: true })
        .limit(10);

      if (error) throw error;

      // Format contact number for display
      const formattedData = data.map((mother) => ({
        ...mother,
        contact_number: mother.contact_number
          ? mother.contact_number.toString()
          : "",
      }));

      return { data: formattedData, error: null };
    } catch (error) {
      console.error("Error searching mothers:", error);
      return { data: [], error };
    }
  },

  /**
   * Create a new mother account
   * @param {Object} motherData - Mother information
   * @returns {Promise<{motherData: Object, tempPassword: string, error: Error}>}
   */

  async createMotherAccount(motherData) {
    const {
      mother_email,
      mother_name,
      contact_number,
      relationship,
      mother_age,
    } = motherData;

    try {
      // Generate a temporary password
      const tempPassword = Math.random().toString(36).slice(-8);

      // Get the next available mother_id
      const { data: lastMother, error: fetchError } = await supabase
        .from("Mother")
        .select("mother_id")
        .order("mother_id", { ascending: false })
        .limit(1)
        .single();

      if (fetchError && fetchError.code !== "PGRST116") {
        throw fetchError;
      }

      // Generate next mother ID
      let nextMotherId;
      if (lastMother) {
        const lastNumber = parseInt(lastMother.mother_id.slice(1), 10);
        nextMotherId = `M${String(lastNumber + 1).padStart(3, "0")}`;
      } else {
        nextMotherId = "M001";
      }

      // Sign up the user with Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: mother_email,
        password: tempPassword,
        options: {
          data: {
            email_confirm: true,
            email_verified: true,
            role: "mother",
            mother_id: nextMotherId,
          },
        },
      });

      if (authError) throw authError;

      // Insert the mother data into the Mother table
      const { data: motherRecord, error: motherError } = await supabase
        .from("Mother")
        .insert({
          mother_id: nextMotherId,
          mother_name,
          mother_email,
          contact_number,
          relationship,
          mother_age,
        })
        .select()
        .single();

      if (motherError) throw motherError;

      // Send magic link email
      const { error: magicLinkError } = await supabase.auth.signInWithOtp({
        email: mother_email,
        options: {
          emailRedirectTo: `${window.location.origin}/pages/mobilePages/MobileLogIn`,
        },
      });

      if (magicLinkError) throw magicLinkError;

      return { motherData: motherRecord, tempPassword, error: null };
    } catch (error) {
      console.error("Error creating mother account:", error);
      return { motherData: null, tempPassword: null, error };
    }
  },

  /**
   * Get a mother by ID
   * @param {string} motherId
   * @returns {Promise<{data: Object, error: Error}>}
   */
  async getMotherById(motherId) {
    try {
      const { data, error } = await supabase
        .from("Mother")
        .select("*")
        .eq("mother_id", motherId)
        .single();

      if (error) throw error;

      return { data, error: null };
    } catch (error) {
      console.error("Error fetching mother:", error);
      return { data: null, error };
    }
  },

  /**
   * Update mother information
   * @param {string} motherId
   * @param {Object} updateData
   * @returns {Promise<{data: Object, error: Error}>}
   */
  async updateMother(motherId, updateData) {
    try {
      const { data, error } = await supabase
        .from("Mother")
        .update(updateData)
        .eq("mother_id", motherId)
        .select()
        .single();

      if (error) throw error;

      return { data, error: null };
    } catch (error) {
      console.error("Error updating mother:", error);
      return { data: null, error };
    }
  },
};

//========================== CHILD RECORDS =================================
export const searchChildren = async (
  searchTerm,
  purokFilter = [],
  statusFilter = []
) => {
  let query = supabase.from("Child").select(`
      child_id,
      child_name,
      child_age,
      birthdate,
      gender,
      overallStatus,
      Purok (
        purok_name
      ),
      Mother (
        mother_name
      )
    `);

  // Apply search filter if search term exists
  if (searchTerm) {
    query = query.or(`
      child_name.ilike.%${searchTerm}%,
      Purok.purok_name.ilike.%${searchTerm}%,
      Mother.mother_name.ilike.%${searchTerm}%
    `);
  }

  // Apply purok filter if selected
  if (purokFilter.length > 0) {
    query = query.in("Purok.purok_name", purokFilter);
  }

  // Apply status filter if selected
  if (statusFilter.length > 0) {
    query = query.in("overallStatus", statusFilter);
  }

  const { data, error } = await query;

  if (error) {
    console.error("Error searching children:", error);
    throw error;
  }

  return data;
};

export async function deleteChild(child) {}

// ADD CHILD AND MOTHER RECORDS
export async function addChild(
  motherId,
  childData,
  purokName,
  growthData,
  address
) {
  console.log("motherId", motherId);
  console.log("ChildData", childData);
  console.log("purok", purokName[0]);
  console.log("address", address);
  try {
    // Validate input data
    if (!motherId || !childData || !growthData || !purokName || !address) {
      throw new Error("Missing required data fields");
    }

    // Get purok ID from the purok name
    const { data: purok, error: purokError } = await supabase
      .from("Purok")
      .select("purok_id")
      .eq("purok_name", purokName[0])
      .single();

    if (purokError)
      throw new Error(`Error fetching Purok ID: ${purokError.message}`);
    if (!purok) throw new Error(`No Purok found with name: ${purokName}`);

    const purokId = purok.purok_id;

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

    // Store child_id in localStorage
    localStorage.setItem("child_id", childId);

    return { success: true, child, growth };
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
      Mother(*),
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
    let scheduleDate = child.Schedule.length;

    // Process the data to determine overall status
    if (child.Schedule && child.Schedule.length > 0) {
      let allCompleted = true;
      let hasMissed = false;
      let hasScheduled = false;

      child.Schedule.forEach((schedule) => {
        const currentDate = schedule.ImmunizationRecords.length;

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

//HANDLE SCHEDULES
export async function handleSchedules(schedules, childId) {
  const nextVaccinesToSchedule = new Set();
  const scheduledVaccines = new Set();
  let baseDate = null;
  let allCreateRecord = true;

  for (const [key, schedule] of Object.entries(schedules)) {
    const { vaccineId, date, createImmunizationRecord } = schedule;

    if (date === null) {
      console.log(`Null date for ${key}. Skipping schedule.`);
      continue;
    }

    if (!baseDate) {
      baseDate = new Date(date);
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
        allCreateRecord = false;
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

  if (allCreateRecord) {
    for (const nextVaccine of nextVaccinesToSchedule) {
      if (!scheduledVaccines.has(nextVaccine.vaccineId)) {
        const scheduleDate =
          nextVaccine.vaccineId !== "V004" && nextVaccine.vaccineId !== "V007"
            ? addOneMonth(baseDate, 1)
            : addFourMonth(baseDate, 1.5);

        const nextResult = await initialSchedule({
          scheduled_date: scheduleDate,
          vaccine_id: nextVaccine.vaccineId,
          child_id: childId,
        });

        console.log(
          `Next schedule result for ${nextVaccine.name}:`,
          nextResult
        );

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
  } else {
    console.log(
      `Skipping scheduling next vaccines as not all immunization records were created.`
    );
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
  return newDate.toISOString().split("T")[0];
}

function addFourMonth(date) {
  const newDate = new Date(date);
  newDate.setMonth(newDate.getMonth() + 4);
  return newDate.toISOString().split("T")[0];
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
  return data;
}

// FETCH EXISTING RECORDS FOR TODAY
export const fetchExistingRecords = async (vaccineId, date) => {
  const { data, error } = await supabase
    .from("Schedule")
    .select(
      `
      *,
      ImmunizationRecords!inner(*)
    `
    )
    .eq("vaccine_id", vaccineId)
    .eq("ImmunizationRecords.date_administered", date);

  if (error) {
    console.error("Error:", error);
    throw error;
  }

  return data;
};
// FETCH VACCINE DETAILS
export const fetchVaccineDetails = async (vaccineId) => {
  const { data, error } = await supabase
    .from("Vaccine")
    .select("vials_per_baby")
    .eq("vaccine_id", vaccineId)
    .single();
  if (error) throw new Error(error.message);
  return data;
};

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
  if (updateRecord.status === null) {
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
  } else {
    const { data, error } = await supabase
      .from("ImmunizationRecords")
      .update({
        date_administered: updateRecord.date_administered,
        completion_status: updateRecord.status,
      })
      .eq("record_id", updateRecord.record_id);

    console.log("newRecord from API", data);
    if (error) {
      console.error("Error updating vaccine stock:", error.message);
      return null;
    }
    return data;
  }
}

//DELETE IMMUNIZATION RECORD
export async function deleteRecord(delRecords) {
  const { data, error } = await supabase
    .from("ImmunizationRecords")
    .select(`Schedule(sched_id, vaccine_id)`)
    .eq("record_id", delRecords.record_id)
    .single();

  if (error) {
    console.error("Error fetching record_id:", error.message);
    return error.message;
  }

  const sched_id = data.Schedule.sched_id;
  const vaccine_id = data.Schedule.vaccine_id;

  const { error: deleRecord } = await supabase
    .from("ImmunizationRecords")
    .delete()
    .eq("record_id", delRecords.record_id);

  if (delRccord) {
    console.error("Error updating vaccine stock:", error.message);
  }

  const { data: checkSched, error: checkError } = await supabase
    .from("Schedule")
    .select(`*, ImmunizationRecords(*)`)
    .neq("sched_id", sched_id)
    .eq("vaccine_id", vaccine_id)
    .eq("child_id", delRecords.child_id);

  if (checkError) {
    console.log("checkError", checkError.message);
    return checkError;
  }

  const schedulesToDelete = checkSched.filter((sched) => {
    return sched.ImmunizationRecords.length === 0;
  });

  if (schedulesToDelete.length > 0) {
    const idsToDelete = schedulesToDelete.map((sched) => sched.sched_id);
    const { error: deleteError } = await supabase
      .from("Schedule")
      .delete()
      .in("sched_id", idsToDelete);

    if (deleteError) {
      console.log("deleteError", deleteError.message);
      return deleteError;
    }

    console.log("Deleted schedules:", idsToDelete);
  } else {
    console.log("No schedules to delete");
  }
}
//FETCH SCHEDULED CHILD TODAY

export async function fetchScheduledChild() {
  const { data, error } = await supabase.rpc(
    "count_children_with_schedules_today"
  );

  if (error) {
    console.error("Error:", error);
    return 0;
  }

  return data || 0; // Use count instead of length
}

//FETCH SCHEDULED CHILD TODAY
export async function fetchScheduledChildId() {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1); // Add one day
  const today = tomorrow.toISOString().split("T")[0]; // Format as YYYY-MM-DD

  const { data, error } = await supabase
    .from("Schedule")
    .select("child_id")
    .eq("scheduled_date", today);

  if (error) {
    console.error("Error:", error);
    throw error;
  }

  return data;
}

export const fetchImmunizedChildId = async () => {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const today = tomorrow.toISOString().split("T")[0];

  const { data, error } = await supabase
    .from("Schedule")
    .select(
      `
      child_id,
      ImmunizationRecords!inner(*)
    `
    )
    .eq("ImmunizationRecords.date_administered", today);

  if (error) {
    console.error("Error:", error);
    throw error;
  }

  return data;
};

export const fetchSchedTomChildId = async () => {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 2);
  const today = tomorrow.toISOString().split("T")[0];

  const { data, error } = await supabase
    .from("Schedule")
    .select("child_id")
    .eq("scheduled_date", today);

  if (error) {
    console.error("Error:", error);
    throw error;
  }

  return data;
};

//FETCH IMMUINIZED CHILD TODAY
export async function fetchImmunizedChild() {
  const { data, error } = await supabase.rpc("count_children_immunized_today");

  if (error) {
    console.error("Error:", error);
    return 0;
  }

  return data || 0;
}

//FETCH SCHEDULES TOMORROW
export async function fetchScheduledChildTom() {
  const { data, error } = await supabase.rpc(
    "count_children_with_schedules_tomorrow"
  );

  if (error) {
    console.error("Error:", error);
    return 0;
  }

  console.log("jdhdjhd", data);
  return data || 0;
}

//CREATE BCG AND HEPATITIS B SCHEDULE
export async function createSchedBCGHb(childId, baseDate) {
  const vaccinesToSchedule = [
    { id: "V003", name: "Penta" },
    { id: "V004", name: "OPV" },
    { id: "V005", name: "PCV" },
    { id: "V006", name: "IPV" },
    { id: "V007", name: "MMR" },
  ];

  for (const vaccine of vaccinesToSchedule) {
    let scheduleDate;
    if (vaccine.id === "V004" || vaccine.id === "V007") {
      scheduleDate = addFourMonth(baseDate, 1.5);
    } else {
      scheduleDate = addOneMonth(baseDate, 1);
    }

    const result = await initialSchedule({
      scheduled_date: scheduleDate,
      vaccine_id: vaccine.id,
      child_id: childId,
    });

    if (result.error) {
      console.error(`Error scheduling ${vaccine.name}:`, result.error);
    } else {
      console.log(`Scheduled ${vaccine.name} for ${scheduleDate}`);
    }
  }
}

//Checks Records for BCG and Hepatitis B
export async function checkRecordsBCGandHb(child_id) {
  const { data, error } = await supabase
    .from("Schedule")
    .select(
      `
      *,
      ImmunizationRecords(*)
    `
    )
    .eq("child_id", child_id)
    .in("vaccine_id", ["V001", "V002"]);

  if (error) {
    console.error("Error fetching records:", error);
    throw error;
  }

  const hasRecords = data.some(
    (entry) => entry.ImmunizationRecords && entry.ImmunizationRecords.length > 0
  );
  console.log("Has records:", hasRecords);
  if (hasRecords) {
    return true;
  } else {
    return false;
  }
}

//updateChildDetails
export const updateChildDetails = async (childId, updatedData) => {
  const getAddress = await geocodeAddress(updatedData.address);

  const { data: purokdata, error: purokError } = await supabase
    .from("Purok")
    .select("purok_id")
    .eq("purok_name", updatedData.purok)
    .single();

  if (purokError)
    throw new Error(`Error fetching Purok ID: ${purokError.message}`);
  if (!purokdata) throw new Error(`No Purok found with name: ${purokdata}`);

  const purokId = purokdata.purok_id;

  const { data, error } = await supabase
    .from("Child")
    .update({
      child_name: updatedData.child_name,
      gender: updatedData.gender,
      birthdate: updatedData.birthdate.format("YYYY-MM-DD"),
      address: updatedData.address,
      purok_id: purokId,
      ...getAddress,
    })
    .eq("child_id", childId);

  if (error) throw error;
  return data;
};
//========================== ABOUT THE LOCATION =================================

export async function geocodeAddress(address) {
  try {
    // Send the address to FastAPI for geocoding
    const response = await fetch(
      "https://inner-tricia-immunify-284d2a41.koyeb.app/address",
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

export async function setMap() {
  try {
    // Fetch locations from Supabase
    const { data: locations, error } = await supabase.from("Child")
      .select(`address, latitude, longitude, 
        Schedule!left (
        sched_id,
        scheduled_date,
        ImmunizationRecords!left (
          record_id,
          date_administered,
          completion_status
        )
      )`);

    if (error) throw error;

    const processedLoc = locations.map((child) => {
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

      return {
        address: child.address,
        latitude: child.latitude,
        longitude: child.longitude,
        overallStatus: overallStatus,
      };
    });

    console.log("Processed locations:", processedLoc);
    // Fetch map from API with locations
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

//========================== MOBILE FUNCTIONS ============================
export async function motherChild(mother_id) {
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
    .eq("mother_id", mother_id);

  if (error) {
    console.error("Error fetching child:", error.message);
    return error.message;
  }

  if (!data || data.length === 0) {
    console.warn("No data found for child_id:", mother_id);
    return [];
  }

  console.log("Mother's children:", data);

  const processedData = data.map((child) => {
    let overallStatus = "No Records";
    let scheduleDate = child.Schedule.length;
    // console.log("Mother's children length:", child.Schedule.length);

    // Process the data to determine overall status
    if (child.Schedule && child.Schedule.length > 0) {
      let allCompleted = true;
      let hasMissed = false;
      let hasScheduled = false;

      child.Schedule.forEach((schedule) => {
        const currentDate = schedule.ImmunizationRecords.length;
        // console.log("Schedule date:", schedule.ImmunizationRecords);
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
        overallStatus = "Partially Completed";
      }
    }

    return { ...child, overallStatus };
  });

  return processedData;
}

//========================== SUMMARY ============================

//COUNT NUMBER OF DEFAULTERS
export async function countMissedChildren() {
  const { data, error } = await supabase.from("Child").select(
    `
      child_id,
      Schedule!left (
        scheduled_date,
        ImmunizationRecords!left (
          date_administered,
          completion_status
        )
      )
    `
  );

  if (error) {
    console.error("Error fetching children data:", error);
    return 0;
  }

  const missedCount = data.reduce((count, child) => {
    let hasMissed = false;

    if (child.Schedule && child.Schedule.length > 0) {
      child.Schedule.forEach((schedule) => {
        const currentDate = new Date();
        const scheduleDate = new Date(schedule.scheduled_date);

        if (
          !schedule.ImmunizationRecords ||
          schedule.ImmunizationRecords.length === 0
        ) {
          if (scheduleDate < currentDate) {
            hasMissed = true;
          }
        } else {
          schedule.ImmunizationRecords.forEach((record) => {
            if (
              record.completion_status === "Missed" ||
              (scheduleDate < currentDate && !record.date_administered)
            ) {
              hasMissed = true;
            }
          });
        }
      });
    }

    return hasMissed ? count + 1 : count;
  }, 0);

  return missedCount;
}

//COUNT NUMBER OF ALL CHILDREN
export async function totalChildren() {
  const { data, count, error } = await supabase
    .from("Child")
    .select("*", { count: "exact" });

  if (error) {
    console.error("Error fetching children:", error.message);
    return 0; // Return 0 or handle error as appropriate
  }

  console.log("Total children:", count);
  return count; // Return the count instead of data
}
