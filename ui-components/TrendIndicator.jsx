const TrendIndicator = ({ value, inverse = false }) => {
  // Don't render anything if there's no meaningful change
  if (!value || Math.abs(value) < 0.1) return null;

  const isUp = value > 0;
  // For metrics like response time, down is actually good
  const isGood = inverse ? !isUp : isUp;
  
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-1 rounded text-sm font-medium 
      ${isGood ? 'text-green-600 bg-green-50' : 'text-red-600 bg-red-50'}`}>
      <span className="text-base">{isUp ? '↑' : '↓'}</span>
      <span>{Math.abs(value).toFixed(1)}%</span>
    </span>
  );
};

export default TrendIndicator;
