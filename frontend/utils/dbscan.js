export default async function geocodeAddress(req, res) {
  const { address } = req.body;
  try {
    // Send the address to FastAPI for geocoding
    const response = await fetch("http://localhost:8000/address", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ address }), // Sending the address to FastAPI
    });

    if (!response.ok) {
      return res
        .status(response.status)
        .json({ error: "FastAPI request failed" });
    }

    const result = await response.json();
    return result; // Result should contain the coordinates
  } catch (error) {
    res.status(500).json({ error: "Failed to communicate with FastAPI" });
  }
}
