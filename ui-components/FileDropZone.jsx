import { useState } from 'react';

// TODO: add validation for file types
const FileDropZone = ({ onFileSelect }) => {
  const [dragging, setDragging] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);

  const handleDrop = (e) => {
    e.preventDefault();
    setDragging(false);
    
    const file = e.dataTransfer.files[0];
    if (file) {
      setSelectedFile(file);
      onFileSelect(file);
    }
  };

  return (
    <div 
      className={`upload-zone ${dragging ? 'dragging' : ''}`}
      onDragEnter={() => setDragging(true)}
      onDragLeave={() => setDragging(false)}
      onDrop={handleDrop}
      onDragOver={(e) => e.preventDefault()}
    >
      <p>Drop incident CSV file here</p>
      {selectedFile && <span>{selectedFile.name}</span>}
    </div>
  );
};

export default FileDropZone;
