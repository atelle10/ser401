import { useMemo } from 'react';
import TrendIndicator from './TrendIndicator';

const IncidentStatsCard = ({ title, data, calcType = 'count', trend }) => {
  const statValue = useMemo(() => {
    if (!data || data.length === 0) return 0;

    switch (calcType) {
      case 'count':
        return data.length;
      
      case 'avgResponseTime':
        // assumes data has responseTime field in minutes
        const times = data.map(d => parseFloat(d.responseTime)).filter(t => !isNaN(t));
        if (times.length === 0) return 0;
        const avg = times.reduce((sum, t) => sum + t, 0) / times.length;
        return avg.toFixed(1);
      
      case 'fireVsMedical':
        // count fire vs medical incidents
        const fireCount = data.filter(d => d.incidentType?.toLowerCase().includes('fire')).length;
        return `${fireCount} / ${data.length - fireCount}`;
      
      default:
        return data.length;
    }
  }, [data, calcType]);

  const getUnitLabel = () => {
    switch (calcType) {
      case 'count': return 'incidents';
      case 'avgResponseTime': return 'min avg';
      case 'fireVsMedical': return 'Fire / Medical';
      default: return '';
    }
  };

  return (
    <div className="border rounded-lg p-4 bg-white shadow-sm hover:shadow-md transition-shadow">
      <h4 className="text-sm text-gray-600 mb-2">{title}</h4>
      <div className="flex items-baseline gap-2 mb-2">
        <p className="text-3xl font-bold text-blue-800">{statValue}</p>
        <span className="text-sm text-gray-500">{getUnitLabel()}</span>
      </div>
      
      {trend && (
        <TrendIndicator 
          value={trend} 
          inverse={calcType === 'avgResponseTime'} 
        />
      )}
      
      {calcType === 'count' && data && data.length > 0 && (
        <p className="text-xs text-gray-500 mt-2">
          Last updated: {new Date().toLocaleDateString()}
        </p>
      )}
    </div>
  );
};

export default IncidentStatsCard;
