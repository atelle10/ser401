import { useState, useEffect } from 'react';

const IncidentDataPreview = ({ file, onRemove }) => {
  const [previewData, setPreviewData] = useState(null);
  const [parsing, setParsing] = useState(false);

  useEffect(() => {
    if (!file) return;
    
    setParsing(true);
    const reader = new FileReader();
    
    reader.onload = (e) => {
      const text = e.target.result;
      const lines = text.split('\n').slice(0, 6); // preview first 5 rows + header
      const headers = lines[0]?.split(',') || [];
      
      setPreviewData({
        name: file.name,
        size: Math.round(file.size / 1024),
        rowCount: text.split('\n').length - 1,
        headers: headers.slice(0, 5), // show first 5 columns
        sampleRows: lines.slice(1, 4).map(row => row.split(',').slice(0, 5))
      });
      setParsing(false);
    };
    
    reader.readAsText(file);
  }, [file]);

  if (!previewData) return null;

  return (
    <div className="border rounded p-4 bg-white">
      <div className="flex justify-between items-start mb-3">
        <div>
          <h3 className="font-semibold">{previewData.name}</h3>
          <p className="text-sm text-gray-600">
            {previewData.size}KB · ~{previewData.rowCount} incidents
          </p>
        </div>
        <button onClick={onRemove} className="text-red-600 text-sm">Remove</button>
      </div>
      
      {parsing ? (
        <p className="text-sm">Reading file...</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="text-xs w-full">
            <thead>
              <tr className="border-b">
                {previewData.headers.map((h, i) => (
                  <th key={i} className="text-left p-1">{h.trim()}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {previewData.sampleRows.map((row, i) => (
                <tr key={i} className="border-b">
                  {row.map((cell, j) => (
                    <td key={j} className="p-1">{cell.trim()}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
          <p className="text-xs text-gray-500 mt-2">Showing first 3 rows...</p>
        </div>
      )}
    </div>
  );
};

export default IncidentDataPreview;
