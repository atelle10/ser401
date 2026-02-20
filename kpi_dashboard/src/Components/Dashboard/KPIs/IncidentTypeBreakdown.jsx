import { useState, useMemo } from 'react';

const COLORS = [
  'bg-orange-400', 'bg-amber-400', 'bg-yellow-400', 'bg-orange-300',
  'bg-amber-300', 'bg-yellow-300', 'bg-orange-200', 'bg-amber-200',
];

const EMS_KEYWORDS = [
  'medical', 'ems', 'ambulance', 'cardiac', 'respiratory', 'trauma',
  'overdose', 'seizure', 'unconscious', 'chest pain', 'breathing',
  'stroke', 'diabetic', 'injury', 'fall', 'sick', 'illness'
];

const classifyIncidentType = (type) => {
  const lowerType = type.toLowerCase();
  return EMS_KEYWORDS.some(keyword => lowerType.includes(keyword));
};

const IncidentTypeBreakdown = ({ data }) => {
  if (!data?.types?.length) {
    return (
      <div className="border rounded-lg p-4 bg-blue-500/40 backdrop-blur-md">
        <p className="text-gray-300">No incident type data available</p>
      </div>
    );
  }

  const maxCount = data.types[0]?.count || 1;

  return (
    <div className="border rounded-lg p-4 bg-white h-full">
      <h3 className="text-lg font-semibold mb-1">Incident Types</h3>
      <p className="text-sm text-gray-600 mb-3">
        {data.total_displayed} total incidents
      </p>
      <div className="space-y-3">
        {data.types.map((row, i) => (
          <div key={row.type}>
            <div className="flex justify-between text-xs mb-1">
              <span className="font-medium text-gray-700">{row.type}</span>
              <span className="text-gray-600">{row.count} ({row.percentage}%)</span>
            </div>
            <div className="h-5 bg-gray-100 rounded overflow-hidden">
              <div
                className={`h-full rounded ${COLORS[i % COLORS.length]}`}
                style={{ width: `${(row.count / maxCount) * 100}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default IncidentTypeBreakdown;
