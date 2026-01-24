import React, { useState } from 'react'
import FileDropZone from './FileDropZone'
import { API_URL } from '../config'

export default function Upload() {
  const [dataType, setDataType] = useState('fire')
  const [file, setFile] = useState(null)
  const [uploading, setUploading] = useState(false)
  const [result, setResult] = useState(null)

  const handleFileSelect = (selectedFile) => {
    setFile(selectedFile)
    setResult(null)
  }

  const handleUpload = async () => {
    if (!file) return

    setUploading(true)
    setResult(null)

    try {
      const formData = new FormData()
      formData.append('file', file)

      const response = await fetch(
        `${API_URL}/api/upload?data_type=${dataType}`,
        { method: 'POST', body: formData }
      )

      const data = await response.json()

      if (response.ok) {
        setResult({ success: true, message: `${data.message} (${data.rows} rows)` })
        setTimeout(() => window.location.reload(), 1500)
      } else {
        setResult({ success: false, message: data.detail || 'Upload failed' })
      }
    } catch (error) {
      setResult({ success: false, message: 'Failed to connect to server' })
    } finally {
      setUploading(false)
    }
  }

  const handleCancel = () => {
    setUploading(false)
    setFile(null)
    setResult(null)
  }

  return (
    <div className="p-4 sm:p-6 max-w-4xl mx-auto">
      <h1 className="text-xl sm:text-2xl font-semibold mb-4 sm:mb-6">Upload Data</h1>

      <div className="bg-white rounded-lg shadow p-4 sm:p-6 space-y-4 sm:space-y-6">
        <div>
          <h2 className="font-medium mb-2">Select Data Type</h2>
          <div className="flex gap-2 mb-4">
            <button
              onClick={() => setDataType('fire')}
              className={`flex-1 px-4 py-2 rounded ${
                dataType === 'fire'
                  ? 'bg-blue-600 text-white'
                  : 'border hover:bg-gray-50'
              }`}
            >
              Fire
            </button>
            <button
              onClick={() => setDataType('ems')}
              className={`flex-1 px-4 py-2 rounded ${
                dataType === 'ems'
                  ? 'bg-blue-600 text-white'
                  : 'border hover:bg-gray-50'
              }`}
            >
              EMS
            </button>
          </div>
        </div>

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
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
              <span>Uploading {file?.name}...</span>
            </div>
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
