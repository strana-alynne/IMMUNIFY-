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
export async function addChild(motherData, childData, purokName, growthData) {
  try {
    // Log input data
    console.log("Received motherData:", motherData);
    console.log("Received childData:", childData);
    console.log("Received growthData:", growthData);
    console.log("Received purokName:", purokName);

    // Basic validation of input data
    if (!motherData || !childData || !growthData || !purokName) {
      throw new Error("Missing required data fields");
    }

    // Get purok ID from the purok name
    const { data: purok, error: purokError } = await supabase
      .from("Purok")
      .select("purok_id")
      .eq("purok_name", purokName)
      .single();

    if (purokError) throw purokError;
    if (!purok) throw new Error(`No purok found with name: ${purokName}`);

    const purokId = purok.purok_id;

    // Insert mother data
    const { data: mother, error: motherError } = await supabase
      .from("Mother")
      .insert([motherData])
      .select();

    if (motherError) throw motherError;
    const motherid = mother[0].mother_id;
    // Insert child data
    const { data: child, error: childError } = await supabase
      .from("Child")
      .insert([
        {
          ...childData,
          mother_id: motherid,
          purok_id: purokId,
        },
      ])
      .select();

    if (childError) throw childError;

    // Insert growth data
    const { data: growth, error: growthError } = await supabase
      .from("Growth")
      .insert([
        {
          ...growthData,
          child_id: child[0].child_id,
        },
      ])
      .select();

    if (growthError) throw growthError;

    localStorage.setItem("child_id", child[0].child_id);

    // Return success response with the inserted data
    console.log(
      "Insertion successful:",
      { mother, child, growth },
      { purokId },
      { motherid }
    );
    return { success: true, mother, child, growth };
  } catch (error) {
    console.error("Error inserting data:", error.message);
    return { success: false, error: error.message };
  }
}
