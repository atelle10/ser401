# FAMAR UI Components

Upload workflow components for Fire and Medical incident data processing.

## Components

### FileDropZone.jsx
File upload interface with drag-and-drop support. Validates file types (.csv, .xlsx) and enforces 10MB size limit. Displays selected file info and error messages.

### IncidentDataPreview.jsx  
Previews uploaded incident data files. Parses CSV content and displays in table format with column headers and row data.

### UploadStatus.jsx
Displays upload progress with visual feedback. Shows percentage complete and current status (uploading, processing, complete).

### UploadErrorHandler.jsx
Handles upload errors with user-friendly messages. Provides retry functionality and error categorization.

### FireMedicalDataTable.jsx
Displays incident records in sortable, filterable table. Includes pagination and responsive design for large datasets.

### IncidentStatsCard.jsx
Shows incident statistics including response times, incident type breakdowns, and aggregated metrics.

## Usage

Components designed to work together in sequence:
1. User uploads file via FileDropZone
2. IncidentDataPreview shows file contents  
3. UploadStatus tracks processing
4. FireMedicalDataTable displays full dataset
5. IncidentStatsCard shows analytics

## Integration

Copy components to dashboard and wire together using shared state:

```javascript
const [uploadedFile, setUploadedFile] = useState(null);
const [parsedData, setParsedData] = useState(null);

<FileDropZone onFileSelect={(file) => setUploadedFile(file)} />
{uploadedFile && <IncidentDataPreview file={uploadedFile} />}
{parsedData && <FireMedicalDataTable data={parsedData} />}
```
