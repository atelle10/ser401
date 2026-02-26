const UnitHourUtilizationByOrigin = () => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <div className="border rounded-lg p-4 bg-blue-500/40 backdrop-blur-md">
        <h4 className="text-sm font-semibold text-gray-200 mb-1">Scottsdale UHU</h4>
        <div className="text-2xl font-bold text-white">—</div>
      </div>
      <div className="border rounded-lg p-4 bg-blue-500/40 backdrop-blur-md">
        <h4 className="text-sm font-semibold text-gray-200 mb-1">Non-Scottsdale UHU</h4>
        <div className="text-2xl font-bold text-white">—</div>
      </div>
    </div>
  );
};

export default UnitHourUtilizationByOrigin;
