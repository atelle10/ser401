import { API_URL } from '../config.js';

const API_BASE_URL = `${API_URL}/api`;

const buildUrl = (path, params) => {
  const url = new URL(`${API_BASE_URL}${path}`);
  Object.entries(params || {}).forEach(([key, value]) => {
    if (value == null) return;
    url.searchParams.set(key, String(value));
  });
  return url.toString();
};

const fetchJson = async (url) => {
  const response = await fetch(url, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
  });

  if (!response.ok) {
    throw new Error(`API error: ${response.status}`);
  }

  return response.json();
};

export const fetchKPIData = async ({ startDate, endDate, region = 'all' }) => {
  try {
    const url = buildUrl('/incidents/kpi-data', {
      start_date: startDate,
      end_date: endDate,
      region,
    });

    const data = await fetchJson(url);
    return { success: true, data: transformAPIData(data), error: null };
  } catch (error) {
    return { success: false, data: null, error: error.message };
  }
};

export const fetchKPISummary = async ({ startDate, endDate, region = 'all' }) => {
  try {
    const url = buildUrl('/incidents/summary', {
      start_date: startDate,
      end_date: endDate,
      region,
    });

    const data = await fetchJson(url);
    return { success: true, data, error: null };
  } catch (error) {
    return { success: false, data: null, error: error.message };
  }
};

export const fetchIncidentHeatmap = async ({ startDate, endDate, region = 'all' }) => {
  try {
    const url = buildUrl('/incidents/heatmap', {
      start_date: startDate,
      end_date: endDate,
      region,
    });

    const data = await fetchJson(url);
    return { success: true, data, error: null };
  } catch (error) {
    return { success: false, data: null, error: error.message };
  }
};

export const fetchCallVolume = async ({ startDate, endDate, region = 'all', granularity = 'daily' }) => {
  try {
    const url = buildUrl('/incidents/call-volume', {
      start_date: startDate,
      end_date: endDate,
      region,
      granularity,
    });

    const data = await fetchJson(url);
    return { success: true, data, error: null };
  } catch (error) {
    return { success: false, data: null, error: error.message };
  }
};

export const fetchTypeBreakdown = async ({ startDate, endDate, region = 'all' }) => {
  try {
    const url = buildUrl('/incidents/type-breakdown', {
      start_date: startDate,
      end_date: endDate,
      region,
    });

    const data = await fetchJson(url);
    return { success: true, data, error: null };
  } catch (error) {
    return { success: false, data: null, error: error.message };
  }
};

export const fetchPostalBreakdown = async ({ startDate, endDate, region = 'all' }) => {
  try {
    const url = buildUrl('/incidents/postal-breakdown', {
      start_date: startDate,
      end_date: endDate,
      region,
    });

    const data = await fetchJson(url);
    return { success: true, data, error: null };
  } catch (error) {
    return { success: false, data: null, error: error.message };
  }
};

const transformAPIData = (apiData) => {
  if (!apiData || !apiData.incidents) return [];

  return apiData.incidents.flatMap(incident => {
    const postalCode = incident.postal_code != null ? Number.parseInt(String(incident.postal_code), 10) : null;
    const base = {
      timestamp: incident.timestamp,
      postal_code: Number.isNaN(postalCode) ? null : postalCode,
      incident_type: incident.incident_type,
    };

    if (!incident.units || incident.units.length === 0) return [base];
    
    return incident.units.map(unit => ({
      ...base,
      unit_id: unit.unit_id,
      dispatch_time: unit.dispatch_time,
      arrival_time: unit.arrival_time,
      en_route_time: unit.en_route_time || unit.dispatch_time,
      clear_time: unit.clear_time || unit.arrival_time,
    }));
  });
};

export const generateMockKPIData = (timeWindow = 7 * 24 * 60 * 60 * 1000) => {
  const now = new Date();
  const startTime = now.getTime() - timeWindow;
  const mockData = [];

  const units = ['E101', 'E102', 'R201', 'R202', 'L301', 'L302'];
  const postalCodes = ['85250', '85251', '85254', '85260', '85262', '85266'];

  for (let i = 0; i < 100; i++) {
    const timestamp = new Date(startTime + Math.random() * timeWindow);
    const dispatchDelay = Math.random() * 5;
    const responseTime = 5 + Math.random() * 15;

    const dispatch = new Date(timestamp.getTime() + dispatchDelay * 60000);
    const arrival = new Date(dispatch.getTime() + responseTime * 60000);

    mockData.push({
      timestamp: timestamp.toISOString(),
      unit_id: units[Math.floor(Math.random() * units.length)],
      postal_code: postalCodes[Math.floor(Math.random() * postalCodes.length)],
      dispatch_time: dispatch.toISOString(),
      arrival_time: arrival.toISOString(),
    });
  }

  return mockData;
};
