// utils/getImmunizationData.js
import { createClient } from "./client";
const supabase = createClient();

export async function getImmunizationStats() {
    const { data, error } = await supabase
    .from('ImmunizationRecords')
    .select(`
      date_administered,
      Schedule!inner (
        vaccine_id,
        Vaccine!inner (
          vaccine_name
        )
      )
    `)
    .not('date_administered', 'is', null)
    .order('date_administered', { ascending: true });

  if (error) {
    console.error('Error fetching immunization data:', error);
    return { chartData: [], vaccineNames: [] };
  }

  // Process data to group by month and vaccine
  const monthlyData = data.reduce((acc, record) => {
    const date = new Date(record.date_administered);
    const monthYear = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
    const vaccineName = record.Schedule.Vaccine.vaccine_name;

    if (!acc[monthYear]) {
      acc[monthYear] = {};
    }
    
    if (!acc[monthYear][vaccineName]) {
      acc[monthYear][vaccineName] = 0;
    }
    
    acc[monthYear][vaccineName]++;
    return acc;
  }, {});

  const vaccineNames = [...new Set(data.map(record => 
    record.Schedule.Vaccine.vaccine_name
  ))];
  
  const chartData = Object.entries(monthlyData)
    .map(([month, vaccines]) => {
      const [year, monthNum] = month.split('-');
      const dataPoint = { 
        month: new Date(year, parseInt(monthNum) - 1)
      };
      vaccineNames.forEach(vaccine => {
        dataPoint[vaccine] = vaccines[vaccine] || 0;
      });
      return dataPoint;
    })
    .sort((a, b) => a.month - b.month);

  return { chartData, vaccineNames };
}
