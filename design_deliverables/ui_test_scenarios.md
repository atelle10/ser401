# UI Test Scenarios - File Upload Interface

**Project:** FAMAR Dashboard - File Upload System  
**Author:** Zachary Alexander  
**Date:** November 6, 2024  
**Version:** 1.0

---

## Test Scenario 1: Successful File Upload (Happy Path)

**Objective:** Verify complete upload flow works with valid file

**Pre-conditions:**
- User is logged in with upload permissions
- Test file: Fire-Data-2024.csv (2.3 MB, 54 columns, valid data)

**Steps:**
1. Navigate to dashboard
2. Click "Upload" button in top navigation
3. Drag valid CSV file into upload area
4. Observe file validation process
5. Click "Confirm Upload" button
6. Wait for upload completion
7. Verify success message appears

**Expected Results:**
- Upload area highlights when file dragged over (blue border)
- File name and size display correctly
- Validation passes with green checkmark
- Progress bar shows 0% → 100%
- Success message: "File uploaded successfully"
- File appears in recent uploads list
- Upload popup closes automatically after 2 seconds

**Pass Criteria:** All expected results occur without errors

---

## Test Scenario 2: File Size Limit Validation

**Objective:** Verify system rejects files exceeding size limit

**Pre-conditions:**
- Test file: Large-Dataset.csv (87 MB, exceeds 50 MB limit)

**Steps:**
1. Open upload interface
2. Select file > 50 MB
3. Observe error handling

**Expected Results:**
- Error message appears: "File too large (87 MB)"
- Error details: "Maximum size: 50 MB"
- File card shows red border
- Upload button remains disabled
- "Remove File" option available
- Suggestion text: "Try compressing or splitting the file"

**Pass Criteria:** File rejected, clear error shown, upload prevented

---

## Test Scenario 3: Invalid File Type Handling

**Objective:** Ensure unsupported file types are rejected

**Test Cases:**
- 3a: PDF file (report.pdf)
- 3b: Word document (data.docx)
- 3c: Text file (info.txt)
- 3d: Image file (chart.png)

**Steps:**
1. Attempt to upload each file type
2. Check error messaging

**Expected Results:**
- Immediate rejection before upload starts
- Error: "Unsupported file type"
- List of accepted formats shown (CSV, XLSX, XLS)
- File input clears automatically
- User can select new file

**Pass Criteria:** All non-CSV/Excel files rejected with appropriate messages

---

## Test Scenario 4: Drag and Drop Interaction

**Objective:** Test drag-and-drop functionality

**Steps:**
1. Open upload interface
2. Drag file from desktop to browser
3. Hover over upload area
4. Drop file in upload zone
5. Verify file captured

**Expected Results:**
- Upload area highlights on drag enter (blue dashed border)
- Cursor shows "copy" icon
- Highlight removes on drag leave
- File processes on drop
- Same behavior as clicking "Choose File"

**Pass Criteria:** Drag-drop works identically to file picker

---

## Test Scenario 5: Multiple File Selection Prevention

**Objective:** Verify only single file uploads allowed

**Steps:**
1. Select multiple files in file picker (Ctrl+Click)
2. Attempt to drag multiple files
3. Check system response

**Expected Results:**
- File picker only accepts single selection
- If multiple files dragged, only first is accepted
- Message: "Please upload one file at a time"
- No crashes or undefined behavior

**Pass Criteria:** Single file constraint enforced gracefully

---

## Test Scenario 6: Network Interruption During Upload

**Objective:** Test handling of connection loss mid-upload

**Steps:**
1. Start uploading large file (10 MB+)
2. Disable network when progress hits 50%
3. Wait 10 seconds
4. Re-enable network
5. Observe recovery

**Expected Results:**
- Progress bar pauses at failure point
- Error message: "Upload failed - Connection lost"
- "Retry" button appears
- Clicking retry resumes from last checkpoint
- Upload completes successfully after retry
- Retry counter shows: "Attempt 2 of 3"

**Pass Criteria:** Upload recovers without requiring full restart

---

## Test Scenario 7: Missing Required Columns

**Objective:** Validate schema checking works

**Pre-conditions:**
- Test file: Incomplete-Data.csv (missing columns: Incident_Date, Unit_ID)

**Steps:**
1. Upload CSV missing required fields
2. Observe validation

**Expected Results:**
- Validation fails after parsing
- Warning message with missing column list
- Shows: "Missing: Incident_Date, Unit_ID"
- Shows: "Expected 54 columns, found 52"
- "Download Template" link available
- Option to proceed anyway (with confirmation)

**Pass Criteria:** Missing columns detected and clearly reported

---

## Test Scenario 8: Responsive Design - Mobile

**Objective:** Verify upload works on mobile devices

**Test Devices:**
- iPhone 12 (390×844)
- Samsung Galaxy S21 (360×800)
- iPad Air (820×1180)

**Steps:**
1. Open upload interface on mobile
2. Tap upload area
3. Select file from device
4. Complete upload

**Expected Results:**
- Upload area fits screen without horizontal scroll
- Touch targets minimum 44×44 pixels
- File picker opens native mobile file browser
- Progress bar clearly visible
- Error messages readable without zoom
- Buttons stacked vertically on narrow screens

**Pass Criteria:** Full functionality on mobile with good UX

---

## Test Scenario 9: Cancel Upload Mid-Process

**Objective:** Test ability to abort upload

**Steps:**
1. Start file upload
2. Click "Cancel" when progress is 30%
3. Confirm cancellation
4. Verify state reset

**Expected Results:**
- Confirmation dialog: "Cancel upload?"
- Upload stops immediately
- Progress bar resets
- File removed from interface
- Can select new file without refresh
- No partial data saved to server

**Pass Criteria:** Clean cancellation with no side effects

---

## Test Scenario 10: Concurrent Upload Prevention

**Objective:** Ensure only one upload at a time

**Steps:**
1. Start first file upload
2. While uploading, try to open upload interface again
3. Observe behavior

**Expected Results:**
- Upload button disabled during active upload
- Tooltip: "Upload in progress"
- Clicking shows current upload status
- Cannot select new file until first completes
- OR: Queue system shows "1 file uploading, 1 pending"

**Pass Criteria:** No conflicts from multiple simultaneous uploads

---

## Test Scenario 11: File Preview Before Upload

**Objective:** Verify user can review file details before confirming

**Steps:**
1. Select file
2. Review displayed information
3. Decide to upload or cancel

**Expected Results:**
- File name displayed correctly
- File size shown in MB/KB
- File type identified (CSV/Excel)
- Row count estimated (if possible)
- Column count shown
- "Confirm Upload" button visible
- "Remove" option available

**Pass Criteria:** All file metadata accurate and actionable

---

## Test Scenario 12: Error Recovery - Corrupted File

**Objective:** Handle files that can't be parsed

**Pre-conditions:**
- Test file: Corrupted.csv (binary data, not valid CSV)

**Steps:**
1. Upload corrupted file
2. Wait for parsing attempt
3. Review error handling

**Expected Results:**
- Error: "Unable to read file"
- Explanation: "File appears corrupted"
- Suggestions shown:
  - "Re-download from source"
  - "Check file encoding"
  - "Try different export format"
- "View Technical Details" expands error log
- Option to contact support with error details

**Pass Criteria:** Graceful failure with helpful recovery steps

---

## Test Scenario 13: Accessibility - Keyboard Navigation

**Objective:** Verify keyboard-only navigation works

**Steps:**
1. Tab to upload button
2. Press Enter to open upload interface
3. Tab to "Choose File" button
4. Press Enter to open file picker
5. Select file with keyboard
6. Tab to "Confirm Upload"
7. Press Enter to upload

**Expected Results:**
- All interactive elements reachable via Tab
- Focus indicators clearly visible
- Enter/Space keys activate buttons
- Escape key closes upload popup
- No keyboard traps
- Logical tab order

**Pass Criteria:** Complete upload possible without mouse

---

## Test Scenario 14: Accessibility - Screen Reader

**Objective:** Test with screen reader (NVDA/JAWS)

**Steps:**
1. Navigate to upload with screen reader on
2. Activate upload interface
3. Select and upload file
4. Listen to all announcements

**Expected Results:**
- "Upload button" announced
- Popup described: "File upload dialog"
- Upload area: "Drag and drop zone, or click to select file"
- File selected: "Fire-Data.csv, 2.3 megabytes, CSV file"
- Upload progress: "Uploading, 45 percent complete"
- Completion: "Upload successful"
- Errors announced with alert role

**Pass Criteria:** All actions and feedback audible and understandable

---

## Test Scenario 15: Performance - Large Dataset

**Objective:** Test with maximum allowed file size

**Pre-conditions:**
- Test file: Max-Size-Data.csv (49.9 MB, 100,000 rows)

**Steps:**
1. Upload maximum size file
2. Monitor performance
3. Complete upload

**Expected Results:**
- File selection responds within 1 second
- Validation completes within 5 seconds
- Upload progress smooth (no freezing)
- UI remains responsive during upload
- Memory usage stays reasonable (<500 MB)
- Upload completes within 2 minutes on average connection

**Pass Criteria:** Acceptable performance with large files

---

## Test Scenario 16: Edge Case - Empty File

**Objective:** Handle files with no data

**Pre-conditions:**
- Test file: Empty.csv (0 bytes OR header row only)

**Steps:**
1. Upload empty file
2. Check validation

**Expected Results:**
- Error: "File is empty"
- Details: "No data rows found"
- Prevents upload
- Clear guidance: "Ensure file contains data beyond headers"

**Pass Criteria:** Empty files rejected with explanation

---

## Test Scenario 17: Special Characters in Filename

**Objective:** Test filename handling

**Test Files:**
- "Fire Data (2024) #1.csv"
- "Medical_Stats-Q3!2024.xlsx"
- "Données_Incendie_2024.csv" (accented characters)

**Steps:**
1. Upload each file
2. Verify name displays correctly

**Expected Results:**
- Filenames display without corruption
- Special characters render properly
- Parentheses, hyphens, underscores supported
- International characters (UTF-8) work
- Very long filenames truncate with ellipsis

**Pass Criteria:** All valid filenames handled correctly

---

## Test Scenario 18: Browser Compatibility

**Objective:** Verify cross-browser support

**Test Browsers:**
- Chrome 120+
- Firefox 120+
- Safari 17+
- Edge 120+

**Steps:**
1. Test core upload flow in each browser
2. Note any differences

**Expected Results:**
- Identical functionality across browsers
- Drag-drop works in all
- File picker native to browser
- Progress indicators smooth
- No JavaScript errors in console

**Pass Criteria:** Consistent experience in all supported browsers

---

## Test Scenario 19: Session Timeout During Upload

**Objective:** Handle authentication expiry

**Steps:**
1. Start file upload
2. Simulate session timeout (clear auth token)
3. Wait for upload to attempt completion

**Expected Results:**
- Upload fails with auth error
- Message: "Session expired"
- "Log in again" button appears
- Upload can be retried after re-authentication
- File data preserved if possible

**Pass Criteria:** Graceful handling with clear next steps

---

## Test Scenario 20: Visual Regression Testing

**Objective:** Ensure UI matches design specifications

**Steps:**
1. Compare rendered UI to design mockups
2. Check all states:
   - Default
   - Hover
   - Active drag
   - File selected
   - Uploading
   - Success
   - Error

**Expected Results:**
- Colors match design tokens exactly
- Spacing consistent (padding, margins)
- Font sizes and weights correct
- Icons properly aligned
- Animations smooth (60fps)
- Shadows and borders as specified

**Pass Criteria:** Pixel-perfect match to approved designs

---

## Regression Test Suite

**Run after ANY upload-related code changes:**

1. Basic upload (Scenario 1)
2. File size validation (Scenario 2)
3. File type validation (Scenario 3)
4. Drag-drop (Scenario 4)
5. Mobile responsive (Scenario 8)
6. Keyboard navigation (Scenario 13)

**Time estimate:** 15 minutes for full regression

---

## Bug Reporting Template

When a test fails, document:

```
Test Scenario: [Number and name]
Expected: [What should happen]
Actual: [What actually happened]
Steps to Reproduce:
1. [Step 1]
2. [Step 2]
...

Environment:
- Browser: [Chrome 120]
- OS: [Windows 11]
- File: [Name and size]
- User role: [Admin/Uploader]

Screenshots: [Attach]
Console Errors: [Copy any errors]
Priority: [High/Medium/Low]
```

---

## Test Metrics

**Success Criteria:**
- 100% pass rate on critical scenarios (1, 2, 3, 8, 13)
- 95%+ pass rate on all scenarios
- No P0/P1 bugs remaining
- Average upload time < 30 seconds for 10 MB file
- Zero accessibility violations (WCAG 2.1 AA)

**Test Coverage Goals:**
- All user interactions tested
- All error states validated
- All supported file types checked
- All device sizes verified
- All browsers confirmed working

---

**Document Status:** Complete  
**Last Updated:** November 6, 2024  
**Next Review:** Before Sprint 3 demo
