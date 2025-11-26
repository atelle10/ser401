import React, { useState } from 'react'
import FileDropZone from './FileDropZone'

export default function Upload() {
  const [file, setFile] = useState(null)
  const [uploading, setUploading] = useState(false)
  const [progress, setProgress] = useState(0)
  const [result, setResult] = useState(null)

  const handleFileSelect = (selectedFile) => {
    setFile(selectedFile)
    setResult(null)
  }

  const handleUpload = async () => {
    if (!file) return
    
    setUploading(true)
    setProgress(0)
    
    // Mock upload simulation
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval)
          setUploading(false)
          setResult({ success: true, message: 'File uploaded successfully' })
          return 100
        }
        return prev + 10
      })
    }, 200)
  }

  const handleCancel = () => {
    setUploading(false)
    setProgress(0)
    setFile(null)
    setResult(null)
  }

  return (
    <div className="p-4 sm:p-6 max-w-4xl mx-auto">
      <h1 className="text-xl sm:text-2xl font-semibold mb-4 sm:mb-6">Upload Data</h1>
      
      <div className="bg-white rounded-lg shadow p-4 sm:p-6 space-y-4 sm:space-y-6">
        <div>
          <h2 className="font-medium mb-2">Select CSV File</h2>
          <p className="text-sm text-gray-600 mb-4">
            Upload incident data in CSV format. File will be validated before staging.
          </p>
          <FileDropZone onFileSelect={handleFileSelect} />
        </div>

        {file && !uploading && !result && (
          <div className="border-t pt-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">{file.name}</p>
                <p className="text-sm text-gray-600">{(file.size / 1024).toFixed(2)} KB</p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={handleCancel}
                  className="px-4 py-2 rounded border hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleUpload}
                  className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700"
                >
                  Upload
                </button>
              </div>
            </div>
          </div>
        )}

        {uploading && (
          <div className="border-t pt-4">
            <div className="mb-2">
              <div className="flex justify-between text-sm mb-1">
                <span>Uploading...</span>
                <span>{progress}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
            <button
              onClick={handleCancel}
              className="text-sm text-red-600 hover:text-red-700"
            >
              Cancel Upload
            </button>
          </div>
        )}

        {result && (
          <div className={`border-t pt-4 ${result.success ? 'text-green-700' : 'text-red-700'}`}>
            <p className="font-medium">{result.message}</p>
            {result.success && (
              <button
                onClick={() => {
                  setFile(null)
                  setResult(null)
                }}
                className="mt-2 text-sm text-blue-600 hover:text-blue-700"
              >
                Upload Another File
              </button>
            )}
          </div>
        )}
      </div>

      <div className="mt-6 p-4 bg-gray-50 rounded-lg">
        <h3 className="font-medium mb-2">Requirements</h3>
        <ul className="text-sm text-gray-700 space-y-1 list-disc list-inside">
          <li>File format: CSV only</li>
          <li>Max file size: 50MB</li>
          <li>Required columns: timestamp, unit, incident_type</li>
          <li>Timestamp format: ISO 8601 or MM/DD/YYYY HH:MM:SS</li>
        </ul>
      </div>
    </div>
  )
}
