import { useState } from 'react';

const UploadStatus = ({ uploading }) => {
  const [progress, setProgress] = useState(0);

  if (!uploading) return null;

  return (
    <div className="status-box">
      <p>Uploading...</p>
      <div className="progress-bar">
        <div style={{ width: `${progress}%` }}></div>
      </div>
    </div>
  );
};

export default UploadStatus;
