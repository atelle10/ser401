import { useState, useEffect } from 'react';

const UploadStatus = ({ uploading, onComplete, onError }) => {
  const [progress, setProgress] = useState(0);
  const [statusMsg, setStatusMsg] = useState('');

  useEffect(() => {
    if (!uploading) {
      setProgress(0);
      return;
    }

    // simulate upload progress
    setStatusMsg('Processing incident data...');
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setStatusMsg('Upload complete');
          setTimeout(() => onComplete?.(), 500);
          return 100;
        }
        return prev + 10;
      });
    }, 200);

    return () => clearInterval(interval);
  }, [uploading, onComplete]);

  if (!uploading && progress === 0) return null;

  return (
    <div className="border rounded p-4 bg-gray-50">
      <div className="flex justify-between mb-2">
        <span className="text-sm font-medium">{statusMsg}</span>
        <span className="text-sm text-gray-600">{progress}%</span>
      </div>
      
      <div className="w-full bg-gray-200 rounded h-2">
        <div 
          className="bg-blue-600 h-2 rounded transition-all"
          style={{ width: `${progress}%` }}
        ></div>
      </div>
      
      {progress === 100 && (
        <p className="text-sm text-green-600 mt-2">✓ File uploaded successfully</p>
      )}
    </div>
  );
};

export default UploadStatus;
