const UploadErrorHandler = ({ error, onRetry }) => {
  if (!error) return null;

  return (
    <div className="error-box">
      <p>Error: {error}</p>
      <button onClick={onRetry}>Try Again</button>
    </div>
  );
};

export default UploadErrorHandler;
