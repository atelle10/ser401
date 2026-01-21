export const calculateAvgResponseTime = (incidents, timeWindow = null) => {
  const now = new Date();
  const windowStart = timeWindow ? new Date(now - timeWindow) : null;
  
  let filteredIncidents = incidents;
  if (windowStart) {
    filteredIncidents = incidents.filter(inc => 
      new Date(inc.timestamp || inc.dispatch_time) >= windowStart
    );
  }
  
  const validIncidents = filteredIncidents.filter(inc => 
    inc.dispatch_time && inc.arrival_time
  );
  
  const responseTimes = validIncidents.map(inc => {
    const dispatch = new Date(inc.dispatch_time);
    const arrival = new Date(inc.arrival_time);
    return (arrival - dispatch) / 1000 / 60;
  }).filter(time => time > 0 && time < 60);
  
  if (responseTimes.length === 0) {
    return { value: null, trend: 0 };
  }
  
  const avgTime = responseTimes.reduce((sum, t) => sum + t, 0) / responseTimes.length;
  
  return { value: avgTime, trend: 0 };
};

export const filterByRegion = (incidents, region) => {
  if (!region || region === 'all') return incidents;
  
  return incidents.filter(inc => {
    if (!inc.postal_code) return false;
    const code = parseInt(inc.postal_code);
    if (region === 'south') return code < 85260;
    if (region === 'north') return code >= 85260;
    return true;
  });
};

export const calculateIncidentVolume = (incidents, timeWindow = null) => {
  const now = new Date();
  const windowStart = timeWindow ? new Date(now - timeWindow) : null;
  
  let currentIncidents = incidents;
  if (windowStart) {
    currentIncidents = incidents.filter(inc => 
      new Date(inc.timestamp) >= windowStart
    );
  }
  
  return {
    count: currentIncidents.length,
    trend: 0
  };
};

export const calculateActiveUnits = (incidents, timeWindow = null) => {
  const now = new Date();
  const windowStart = timeWindow ? new Date(now - timeWindow) : null;
  
  let filteredIncidents = incidents;
  if (windowStart) {
    filteredIncidents = incidents.filter(inc => 
      new Date(inc.timestamp) >= windowStart
    );
  }
  
  const units = new Set();
  const breakdown = { engine: 0, rescue: 0, ladder: 0 };
  
  filteredIncidents.forEach(inc => {
    if (inc.unit_id) {
      units.add(inc.unit_id);
      const type = inc.unit_id.charAt(0);
      if (type === 'E') breakdown.engine++;
      else if (type === 'R') breakdown.rescue++;
      else if (type === 'L') breakdown.ladder++;
    }
  });
  
  return {
    total: units.size,
    breakdown,
    trend: 0
  };
};
