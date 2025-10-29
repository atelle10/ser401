import { useState } from 'react';

const FileDropZone = ({ onFileSelect, acceptedFormats = ['.csv', '.xlsx'] }) => {
  const [dragging, setDragging] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [error, setError] = useState(null);

  const validateFile = (file) => {
    const fileExt = file.name.toLowerCase().slice(file.name.lastIndexOf('.'));
    if (!acceptedFormats.includes(fileExt)) {
      setError(`Only ${acceptedFormats.join(', ')} files accepted`);
      return false;
    }
    // FAMAR files are usually under 10MB
    if (file.size > 10 * 1024 * 1024) {
      setError('File too large (max 10MB)');
      return false;
    }
    setError(null);
    return true;
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragging(false);
    
    const file = e.dataTransfer.files[0];
    if (file && validateFile(file)) {
      setSelectedFile(file);
      onFileSelect(file);
    }
  };

  const handleFileInput = (e) => {
    const file = e.target.files[0];
    if (file && validateFile(file)) {
      setSelectedFile(file);
      onFileSelect(file);
    }
  };

  return (
    <div 
      className={`border-2 border-dashed p-8 rounded ${dragging ? 'border-blue-600 bg-blue-50' : 'border-gray-300'}`}
      onDragEnter={() => setDragging(true)}
      onDragLeave={() => setDragging(false)}
      onDrop={handleDrop}
      onDragOver={(e) => e.preventDefault()}
    >
      <input 
        type="file" 
        onChange={handleFileInput}
        accept={acceptedFormats.join(',')}
        className="hidden"
        id="file-input"
      />
      <label htmlFor="file-input" className="cursor-pointer">
        <p className="text-lg mb-2">
          {dragging ? 'Drop incident data file' : 'Upload Fire/Medical Data'}
        </p>
        <p className="text-sm text-gray-600">CSV or Excel format</p>
      </label>
      
      {selectedFile && (
        <div className="mt-4 p-2 bg-green-100 rounded">
          <p className="text-sm">{selectedFile.name} ({Math.round(selectedFile.size / 1024)}KB)</p>
        </div>
      )}
      
      {error && <p className="text-red-600 text-sm mt-2">{error}</p>}
    </div>
  );
};

export default FileDropZone;
