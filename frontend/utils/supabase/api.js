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
      `transaction_id, transaction_date, transaction_type, transaction_quantity, batch_number, expiration_date, VaccineInventory(inventory_id, Vaccine(vaccine_id, vaccine_name))`
    )
    .eq("VaccineInventory.Vaccine.vaccine_id", vaccine_id);
  if (error) {
    console.error("Error fetching vaccines:", error.message);
    return [];
  }

  return data || [];
}

// ADD VACCINE
export async function addVaccineStock(addDetails) {
  await supabase.from("VaccineTransaction").insert([
    {
      transaction_date: addDetails.transaction_date,
      transaction_type: addDetails.transaction_type,
      transaction_quantity: addDetails.transaction_quantity,
      batch_number: addDetails.batch_number,
      expiration_date: addDetails.expiration_date,
      inventory_id: addDetails.inventory_id,
    },
  ]);
}


//SUBSCRIPTION
export async function subscribeToVaccineStock(inventoryID, setVaccines) {
  if (!inventoryID) return () => {};

  const { data: subscription, error } = supabase
    .from(`VaccineTransaction:inventory_id=eq.${inventoryID}`)
    .on('INSERT', async () => {
      const { data: updatedVaccines, error } = await supabase
        .from('VaccineTransaction')
        .select('*')
        .eq('inventory_id', inventoryID);

      if (error) {
        console.error('Error fetching updated vaccines:', error);
      } else {
        setVaccines(updatedVaccines);
      }
    })
    .subscribe();

  if (error) {
    console.error('Error setting up subscription:', error);
  }
  return () => {
    supabase.removeSubscription(subscription);
  };
}