# File Upload Error States Design

**Author:** Zachary Alexander  
**Date:** November 6, 2024  
**Task:** Design error states for file size validation and other upload errors

---

## Error State Categories

### 1. File Size Validation Errors

**Scenario:** User uploads file exceeding 50 MB limit

**Visual Treatment:**
- Border color changes to red (#e74c3c)
- Background shifts to light red tint (#fff5f5)
- Error icon appears (red exclamation mark)
- Clear error message displayed below upload area

**Message:**
```
⚠️ File too large
The file "Fire-Data-2024.csv" exceeds the 50 MB limit.
Current size: 87.3 MB
Please compress the file or upload a smaller dataset.
```

**Actions:**
- Remove file button (X icon)
- "Try Again" button to select new file
- Optional: Link to "How to compress CSV files"

---

### 2. Invalid File Type Error

**Scenario:** User uploads unsupported file format (e.g., .pdf, .txt, .doc)

**Visual Treatment:**
- Red dashed border around upload area
- File preview shows warning icon
- Rejected file grayed out

**Message:**
```
❌ Unsupported file type
The file "report.pdf" cannot be uploaded.
Only CSV and Excel files (.csv, .xlsx, .xls) are supported.
```

**Actions:**
- Remove rejected file
- Show list of accepted formats
- "Select Valid File" button

---

### 3. Corrupted or Malformed File

**Scenario:** File is corrupted or has parsing errors

**Visual Treatment:**
- Orange warning banner
- File details show "Parse Failed" status
- Technical details collapsed by default

**Message:**
```
⚠️ Unable to read file
The file "data.csv" appears to be corrupted or incorrectly formatted.

Common causes:
• File encoding issues (not UTF-8)
• Incomplete download
• Damaged file structure

Try re-downloading or re-exporting the file from the source.
```

**Actions:**
- "View Error Details" (expands technical log)
- "Upload Different File"
- "Contact Support" link

---

### 4. Missing Required Columns

**Scenario:** CSV missing critical columns (e.g., Incident_Date, Unit_ID)

**Visual Treatment:**
- Yellow warning state
- List of missing columns displayed
- Example of correct schema shown

**Message:**
```
⚠️ Missing required columns
The uploaded file is missing 3 required columns:

Missing:
• Incident_Date
• Unit_ID  
• Response_Time

Your file has: 48 columns
Expected: 54 columns

Download template file to see the correct format.
```

**Actions:**
- "Download Template" button
- "View Full Schema Requirements"
- "Cancel Upload"

---

### 5. Network/Upload Failure

**Scenario:** Connection lost during upload or server error

**Visual Treatment:**
- Red alert banner at top
- Progress bar shows red fill
- Retry icon appears

**Message:**
```
❌ Upload failed
Connection lost while uploading "Fire-Stats-2024.csv"

Progress: 67% complete (1.5 MB of 2.3 MB)

Check your internet connection and try again.
```

**Actions:**
- "Retry Upload" button (resumes from failure point)
- "Cancel"
- Shows retry count: "Attempt 2 of 3"

---

### 6. Server Validation Errors

**Scenario:** File passes client checks but fails server-side validation

**Visual Treatment:**
- Orange warning with details list
- Each error shows line/row number
- Scrollable error list if many issues

**Message:**
```
⚠️ Data validation errors
Found 12 issues in the uploaded file:

Row 45: Invalid date format in "Incident_Date" (expected: YYYY-MM-DD)
Row 127: Response_Time cannot be negative (-5 seconds)
Row 203: Missing required field "Station_Number"
Row 388: Duplicate Incident_ID "2024-FD-00156"

... 8 more issues

You can fix these errors and re-upload, or upload anyway (not recommended).
```

**Actions:**
- "Download Error Report" (CSV with all errors)
- "Fix and Re-upload"
- "Upload Anyway" (with confirmation warning)

---

### 7. Permission/Authentication Errors

**Scenario:** User lacks permission to upload files

**Visual Treatment:**
- Gray overlay on upload area
- Lock icon displayed
- Upload controls disabled

**Message:**
```
🔒 Upload permission required
You don't have permission to upload files.

Contact your administrator to request upload access.

Your current role: Viewer
Required role: Uploader or Admin
```

**Actions:**
- "Request Access" button (sends email to admin)
- "Contact Administrator"
- Upload area remains visible but disabled

---

## Error State Components

### Visual Hierarchy

1. **Icon** - Immediate visual indicator
   - ❌ Red X for critical errors (file type, size)
   - ⚠️ Yellow warning for fixable issues (missing columns)
   - 🔄 Blue info for retryable errors (network)

2. **Error Title** - Short, action-oriented
   - "File too large" not "Error: File size exceeds maximum"
   - "Missing required columns" not "Validation error 422"

3. **Description** - What went wrong
   - Plain language explanation
   - Specific details (file size, column names)
   - Avoid technical jargon

4. **Help Text** - How to fix it
   - Clear next steps
   - Links to documentation
   - Alternative actions

5. **Action Buttons** - What user can do
   - Primary action (Retry, Fix, Remove)
   - Secondary action (Cancel, Contact Support)

---

## Error Message Tone Guidelines

**Do:**
- Be specific about what went wrong
- Explain why it matters
- Provide clear next steps
- Use friendly, helpful language

**Don't:**
- Use technical error codes without translation
- Blame the user ("You made an error")
- Leave user stuck with no options
- Use ALL CAPS or excessive punctuation

**Examples:**

❌ **Bad:**
```
ERROR 413: REQUEST ENTITY TOO LARGE
The file you attempted to upload has exceeded the maximum file size limit configured by the server administrator.
```

✅ **Good:**
```
File too large (87 MB)
The maximum file size is 50 MB. Try compressing your file or splitting it into smaller files.
```

---

## Inline vs. Modal Error Presentation

### Use Inline Errors When:
- Single file upload
- Error is specific to one field
- User can fix without leaving page
- Non-critical warnings

### Use Modal/Alert When:
- Multiple files with errors
- Critical failure (server down)
- Requires user confirmation
- Blocking action needed

---

## Mobile Considerations

**Touch-Friendly Error Actions:**
- Buttons min 44px height
- Clear tap targets
- Swipe to dismiss for minor warnings
- Bottom sheet for error details (easier to reach)

**Simplified Error Messages:**
- Shorter text on mobile
- Icons more prominent
- "Learn More" expands details instead of showing all upfront

---

## Accessibility

**Screen Reader Support:**
- `role="alert"` for error messages
- `aria-live="polite"` for non-critical warnings
- `aria-describedby` links input to error message

**Keyboard Navigation:**
- Focus moves to error message when validation fails
- Tab through action buttons
- Escape key dismisses dismissible errors

**Color Independence:**
- Don't rely only on red/green
- Use icons + text
- Patterns/textures for colorblind users

---

## Error Recovery Flow

```
User uploads file
    ↓
Client validation
    ↓ (fail)
Show inline error → User fixes → Retry
    ↓ (pass)
Upload to server
    ↓
Server validation
    ↓ (fail)
Show detailed errors → Download report → Fix offline → Re-upload
    ↓ (pass)
Success state
```

---

## Implementation Notes

**CSS Classes:**
```css
.upload-area.error { border-color: #e74c3c; background: #fff5f5; }
.upload-area.warning { border-color: #f39c12; background: #fffbf0; }
.error-message { color: #c0392b; font-size: 14px; margin-top: 10px; }
.error-icon { fill: #e74c3c; width: 20px; height: 20px; }
```

**State Management:**
```javascript
const errorStates = {
  FILE_TOO_LARGE: { type: 'error', icon: '❌', retry: true },
  INVALID_TYPE: { type: 'error', icon: '❌', retry: false },
  MISSING_COLUMNS: { type: 'warning', icon: '⚠️', retry: true },
  NETWORK_FAILURE: { type: 'error', icon: '🔄', retry: true }
}
```

---

## Testing Checklist

- [ ] File > 50 MB triggers size error
- [ ] .pdf, .txt, .doc trigger type error
- [ ] Corrupted CSV shows parse error
- [ ] Missing columns detected and listed
- [ ] Network interruption shows retry option
- [ ] Server errors display with details
- [ ] Error messages read correctly by screen reader
- [ ] Mobile error display is touch-friendly
- [ ] Error states clear when new file selected
- [ ] Multiple errors show in priority order

---

**Design Status:** Complete  
**Review Status:** Ready for implementation  
**Next Step:** Implement error handling in FileDropZone component
