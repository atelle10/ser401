const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api';

export const fetchKPIData = async ({ startDate, endDate, region = 'all' }) => {
  const params = new URLSearchParams({
    start_date: startDate,
    end_date: endDate,
    region: region
  });

  const response = await fetch(`${API_BASE_URL}/incidents/kpi-data?${params}`, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
  });

  if (!response.ok) {
    throw new Error(`API error: ${response.status}`);
  }

  const data = await response.json();
  return transformAPIData(data);
};

const transformAPIData = (apiData) => {
  if (!apiData || !apiData.incidents) return [];
  
  return apiData.incidents.flatMap(incident => {
    const base = {
      timestamp: incident.timestamp,
      postal_code: incident.postal_code,
      incident_type: incident.incident_type,
    };

    if (!incident.units || incident.units.length === 0) return [base];
    
    return incident.units.map(unit => ({
      ...base,
      unit_id: unit.unit_id,
      dispatch_time: unit.dispatch_time,
      arrival_time: unit.arrival_time,
    }));
  });
};
