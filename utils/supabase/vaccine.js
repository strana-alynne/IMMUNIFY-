import { createClient } from "@/utils/supabase/client";

const supabase = createClient();

export async function administeredVaccine(addDetails) {
  console.log("add Details:", addDetails);
  // If it's a stock out transaction, we need to find the appropriate batch(es)
  if (addDetails.transaction_type === "STOCK OUT") {
    try {
      // Fetch all transactions for this inventory
      const { data: allTransactions, error: transactionError } = await supabase
        .from("VaccineTransaction")
        .select(
          "batch_number, expiration_date, transaction_type, transaction_quantity"
        )
        .eq("inventory_id", addDetails.inventory_id);

      if (transactionError) {
        console.error("Error fetching transactions:", transactionError);
        alert(`Error fetching transactions: ${transactionError.message}`);
        return null;
      }

      // Calculate net quantity per batch
      const batchQuantities = allTransactions.reduce((acc, transaction) => {
        const existingBatch = acc.find(
          (b) => b.batch_number === transaction.batch_number
        );

        // Adjust quantity based on transaction type
        const quantityModifier =
          transaction.transaction_type === "STOCK IN" ? 1 : -1;
        const adjustedQuantity =
          transaction.transaction_quantity * quantityModifier;

        if (existingBatch) {
          existingBatch.total_quantity += adjustedQuantity;
          // Keep the earliest expiration date
          existingBatch.expiration_date =
            new Date(existingBatch.expiration_date) <
            new Date(transaction.expiration_date)
              ? existingBatch.expiration_date
              : transaction.expiration_date;
        } else {
          acc.push({
            batch_number: transaction.batch_number,
            expiration_date: transaction.expiration_date,
            total_quantity: adjustedQuantity,
          });
        }
        return acc;
      }, []);

      console.log("Batch quantities:", batchQuantities);

      // Filter out batches with zero or negative quantity
      const availableBatches = batchQuantities.filter(
        (batch) => batch.total_quantity > 0
      );

      // Sort batches by expiration date (ascending) and total quantity (ascending)
      const sortedBatches = availableBatches.sort((a, b) => {
        // First, compare expiration dates
        const dateComparison =
          new Date(a.expiration_date).getTime() -
          new Date(b.expiration_date).getTime();

        // If expiration dates are the same, compare total quantities
        if (dateComparison === 0) {
          return a.total_quantity - b.total_quantity;
        }

        return dateComparison;
      });

      // Validate if we have enough quantity
      const totalAvailableQuantity = sortedBatches.reduce(
        (sum, batch) => sum + batch.total_quantity,
        0
      );

      if (totalAvailableQuantity < addDetails.transaction_quantity) {
        alert("Insufficient vaccine quantity in inventory");
        return null;
      }

      // Track remaining quantity to stock out
      let remainingQuantityToStockOut = addDetails.transaction_quantity;
      const stockOutTransactions = [];

      // Stock out batches
      for (const batch of sortedBatches) {
        if (remainingQuantityToStockOut <= 0) break;

        const quantityToStockOut = Math.min(
          batch.total_quantity,
          remainingQuantityToStockOut
        );

        stockOutTransactions.push({
          ...addDetails,
          batch_number: batch.batch_number,
          transaction_quantity: quantityToStockOut,
        });

        remainingQuantityToStockOut -= quantityToStockOut;
      }

      // Perform stock out transactions
      for (const transaction of stockOutTransactions) {
        const { error } = await supabase.from("VaccineTransaction").insert([
          {
            transaction_date: transaction.transaction_date,
            transaction_type: transaction.transaction_type,
            transaction_quantity: transaction.transaction_quantity,
            batch_number: transaction.batch_number,
            expiration_date: transaction.expiration_date,
            inventory_id: transaction.inventory_id,
            remarks: transaction.remarks,
            created_at: new Date().toISOString(),
          },
        ]);

        if (error) {
          console.error("Error adding vaccine stock:", error);
          alert(`Error adding vaccine stock: ${error.message}`);
          return null;
        }
      }

      // Update inventory quantity
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

      const newQuantity =
        inventoryData.vaccine_quantity - addDetails.transaction_quantity;

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

      return stockOutTransactions;
    } catch (error) {
      console.error("Unexpected error:", error);
      alert(`Unexpected error: ${error.message}`);
      return null;
    }
  } else {
    // Existing stock in logic remains the same
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

    const newQuantity =
      inventoryData.vaccine_quantity + addDetails.transaction_quantity;

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

    return data;
  }
}
