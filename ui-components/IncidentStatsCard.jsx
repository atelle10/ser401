const IncidentStatsCard = ({ title, value }) => {
  return (
    <div className="stat-card">
      <h4>{title}</h4>
      <p className="stat-value">{value}</p>
    </div>
  );
};

export default IncidentStatsCard;
