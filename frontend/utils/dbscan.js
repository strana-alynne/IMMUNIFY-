export const geocodeAddress = async (address) => {
    try {
      const response = await fetch('http://127.0.0.1:8000/address', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ address }),  // Pass the address
      });
  
      const data = await response.json();
      return data;  // Return the geocoded latitude and longitude
    } catch (error) {
      console.error('Error geocoding address:', error);
      throw error;  // You can handle the error in the calling component
    }
  };