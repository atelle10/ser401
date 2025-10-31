import { useState, useEffect } from 'react';

const IncidentDataPreview = ({ file }) => {
  const [previewData, setPreviewData] = useState(null);

  useEffect(() => {
    if (file) {
      // basic file info for now
      setPreviewData({
        name: file.name,
        size: file.size,
        type: file.type
      });
    }
  }, [file]);

  if (!previewData) return null;

  return (
    <div className="preview-container">
      <h3>File Info</h3>
      <p>{previewData.name}</p>
      <p>Size: {previewData.size} bytes</p>
    </div>
  );
};

export default IncidentDataPreview;
