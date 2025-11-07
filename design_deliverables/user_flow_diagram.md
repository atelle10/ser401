# File Upload User Flow Diagram

**Project:** FAMAR Dashboard - File Upload System  
**Author:** Zachary Alexander  
**Date:** November 6, 2024  
**Version:** 1.0

---

## Primary User Flow: Successful Upload

```
┌─────────────────────────────────────────────────────────────────┐
│                      START: User at Dashboard                    │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             ▼
                    ┌────────────────┐
                    │ Click "Upload" │
                    │   in NavBar    │
                    └────────┬───────┘
                             │
                             ▼
                  ┌──────────────────────┐
                  │  Upload Modal Opens  │
                  │  (Popup Interface)   │
                  └──────────┬───────────┘
                             │
                ┌────────────┴────────────┐
                │                         │
                ▼                         ▼
        ┌───────────────┐        ┌──────────────────┐
        │  Drag File    │   OR   │ Click "Choose    │
        │  into Zone    │        │ File" Button     │
        └───────┬───────┘        └────────┬─────────┘
                │                         │
                └────────────┬────────────┘
                             │
                             ▼
                    ┌────────────────────┐
                    │  Native File       │
                    │  Picker Opens      │
                    └─────────┬──────────┘
                              │
                              ▼
                     ┌─────────────────┐
                     │ User Selects    │
                     │ File            │
                     └────────┬────────┘
                              │
                              ▼
                   ┌──────────────────────┐
                   │ Client-Side          │
                   │ Validation Starts    │
                   └──────────┬───────────┘
                              │
                 ┌────────────┴────────────┐
                 │                         │
         [PASS]  ▼                         ▼  [FAIL]
    ┌────────────────────┐      ┌──────────────────────┐
    │ File Preview Shows │      │  Error Message       │
    │ • Name             │      │  Displayed           │
    │ • Size             │      │  • Clear reason      │
    │ • Type             │      │  • How to fix        │
    └─────────┬──────────┘      └──────────┬───────────┘
              │                            │
              ▼                            ▼
    ┌─────────────────────┐     ┌───────────────────┐
    │ "Confirm Upload"    │     │ "Remove" or       │
    │ Button Active       │     │ "Try Again"       │
    └──────────┬──────────┘     └─────────┬─────────┘
               │                          │
               ▼                          │
      ┌────────────────┐                 │
      │ User Clicks    │                 │
      │ "Confirm"      │                 │
      └────────┬───────┘                 │
               │                         │
               ▼                         │
    ┌───────────────────────┐           │
    │ Upload Starts         │           │
    │ • Progress bar shows  │           │
    │ • Percentage updates  │           │
    └──────────┬────────────┘           │
               │                        │
    ┌──────────┴────────────┐          │
    │ Upload in progress... │          │
    │ (0% → 100%)          │          │
    └──────────┬────────────┘          │
               │                       │
    ┌──────────┴──────────┐           │
    │                     │           │
    ▼ [SUCCESS]           ▼ [FAILURE]│
┌────────────────┐  ┌─────────────────┴────┐
│ Success State  │  │ Error State          │
│ • Green check  │  │ • Red X              │
│ • Message      │  │ • Error details      │
│ • Auto-close   │  │ • Retry option       │
│   in 2 sec     │  │                      │
└────────┬───────┘  └──────────┬───────────┘
         │                     │
         │                     └──────────────┐
         ▼                                    │
┌─────────────────┐                          │
│ Modal Closes    │                          │
└────────┬────────┘                          │
         │                                   │
         ▼                                   │
┌───────────────────┐                       │
│ Dashboard Updates │                       │
│ • New data shown  │                       │
└────────┬──────────┘                       │
         │                                  │
         ▼                                  │
    ┌────────┐                             │
    │  END   │◄────────────────────────────┘
    └────────┘
```

---

## Alternative Flow: File Too Large

```
START
  │
  ▼
User selects file > 50 MB
  │
  ▼
System detects size
  │
  ▼
┌────────────────────────────┐
│ ERROR MESSAGE DISPLAYED    │
│                            │
│ "File too large (87 MB)"   │
│ "Maximum size: 50 MB"      │
│                            │
│ [Remove File] [Try Again]  │
└──────────┬─────────────────┘
           │
  ┌────────┴────────┐
  │                 │
  ▼                 ▼
Remove File    Select New File
  │                 │
  ▼                 │
Clear UI            │
  │                 │
  └────────┬────────┘
           │
           ▼
    Return to upload area
           │
           ▼
          END
```

---

## Alternative Flow: Invalid File Type

```
START
  │
  ▼
User selects .pdf file
  │
  ▼
System checks extension
  │
  ▼
┌──────────────────────────────┐
│ ERROR: Unsupported file type │
│                              │
│ "Only CSV and Excel files    │
│  are supported"              │
│                              │
│ Accepted formats:            │
│ • .csv                       │
│ • .xlsx                      │
│ • .xls                       │
│                              │
│ [Select Valid File]          │
└───────────┬──────────────────┘
            │
            ▼
    Return to file picker
            │
            ▼
           END
```

---

## Alternative Flow: Network Failure During Upload

```
Upload in progress (67%)
  │
  ▼
Network connection lost
  │
  ▼
┌──────────────────────────────┐
│ Upload paused                │
│                              │
│ "Connection lost"            │
│ "Progress: 67% (1.5 MB)"     │
│                              │
│ [Retry] [Cancel]             │
└────────┬─────────────────────┘
         │
    ┌────┴────┐
    │         │
    ▼         ▼
 [Retry]   [Cancel]
    │         │
    ▼         ▼
Resume     Clear upload
from 67%   Return to start
    │         │
    ▼         │
Continue      │
uploading     │
    │         │
    └────┬────┘
         │
         ▼
        END
```

---

## Alternative Flow: Server Validation Errors

```
File uploaded successfully
  │
  ▼
Server begins validation
  │
  ▼
Errors found in data
  │
  ▼
┌──────────────────────────────────┐
│ DATA VALIDATION ERRORS           │
│                                  │
│ Found 12 issues:                 │
│                                  │
│ • Row 45: Invalid date format    │
│ • Row 127: Negative time value   │
│ • Row 203: Missing station ID    │
│ • ... 9 more issues              │
│                                  │
│ [Download Error Report]          │
│ [Fix & Re-upload]                │
│ [Upload Anyway] (not recommended)│
└────────────┬─────────────────────┘
             │
   ┌─────────┴─────────┐
   │                   │
   ▼                   ▼
Download CSV      Fix & Re-upload
with errors           │
   │                  ▼
   │            User fixes issues
   │                  │
   │                  ▼
   │            Upload corrected file
   │                  │
   └─────────┬────────┘
             │
             ▼
     Validation passes
             │
             ▼
      Success state
             │
             ▼
            END
```

---

## User Decision Points

### Decision Point 1: How to Select File
```
User at upload interface
         │
         ▼
    [Decision]
         │
    ┌────┴────┐
    │         │
    ▼         ▼
 Drag file  Click button
    │         │
    └────┬────┘
         │
         ▼
    File selected
```

### Decision Point 2: File Validation Failed
```
Validation error shown
         │
         ▼
    [Decision]
         │
    ┌────┴────┐
    │         │
    ▼         ▼
 Try again  Cancel
    │         │
    │         ▼
    │    Close modal
    │         │
    └────┬────┘
         │
         ▼
        END
```

### Decision Point 3: Upload Failure
```
Upload failed
      │
      ▼
 [Decision]
      │
  ┌───┴───┐
  │       │
  ▼       ▼
Retry   Cancel
  │       │
  │       ▼
  │   Discard file
  │       │
  └───┬───┘
      │
      ▼
     END
```

---

## Edge Cases & Error States

### Edge Case 1: Empty File
```
User selects empty file (0 bytes)
  │
  ▼
System detects empty file
  │
  ▼
Error: "File is empty"
  │
  ▼
User selects valid file
  │
  ▼
Continue normal flow
```

### Edge Case 2: Multiple Files Selected
```
User drags 3 files at once
  │
  ▼
System accepts only first file
  │
  ▼
Warning: "Only one file at a time"
  │
  ▼
First file processes normally
```

### Edge Case 3: Session Timeout
```
Upload in progress
  │
  ▼
Session expires
  │
  ▼
Auth error detected
  │
  ▼
"Session expired - Please log in again"
  │
  ▼
User re-authenticates
  │
  ▼
Option to retry upload
```

### Edge Case 4: Duplicate File
```
User uploads file already in system
  │
  ▼
Server detects duplicate
  │
  ▼
Warning: "This file was already uploaded on [date]"
  │
  ▼
Options:
  • Upload anyway (creates duplicate)
  • Cancel (recommended)
  │
  ▼
User decides
```

---

## User Journey Map

### Phase 1: Awareness
```
User needs to upload new incident data
  ↓
Sees "Upload" button in navigation
  ↓
Understands purpose
```

### Phase 2: Consideration
```
Clicks upload button
  ↓
Reviews upload interface
  ↓
Checks file requirements
  ↓
Decides to proceed
```

### Phase 3: Action
```
Selects file from computer
  ↓
Reviews file details
  ↓
Confirms upload
  ↓
Monitors progress
```

### Phase 4: Completion
```
Sees success message
  ↓
Modal auto-closes
  ↓
Returns to dashboard with updated data
```

---

## System State Diagram

```
┌──────────────┐
│   IDLE       │◄──────────────────────┐
│ (No file)    │                       │
└──────┬───────┘                       │
       │ File selected                 │
       ▼                               │
┌──────────────┐                       │
│  VALIDATING  │                       │
│ (Checking    │                       │
│  file)       │                       │
└──────┬───────┘                       │
       │                               │
  ┌────┴────┐                         │
  │         │                         │
  ▼ Valid   ▼ Invalid                 │
┌──────────────┐  ┌──────────────┐   │
│   READY      │  │    ERROR     │───┘
│ (Can upload) │  │ (Fix issue)  │
└──────┬───────┘  └──────────────┘
       │ Confirm
       ▼
┌──────────────┐
│  UPLOADING   │
│ (Progress    │
│  bar active) │
└──────┬───────┘
       │
  ┌────┴────┐
  │         │
  ▼ Success ▼ Failure
┌──────────────┐  ┌──────────────┐
│   SUCCESS    │  │   FAILED     │───┐
│ (Auto-close) │  │ (Show retry) │   │
└──────┬───────┘  └──────────────┘   │
       │                 │            │
       │                 │ Retry      │
       │                 └────────────┘
       │
       └────────────────────────────────┘
```

---

## Interaction Patterns

### Pattern 1: Progressive Disclosure
```
1. Simple upload area shown
2. File selected → Details revealed
3. Error occurs → Detailed explanation shown
4. Advanced options hidden until needed
```

### Pattern 2: Immediate Feedback
```
1. User action
   ↓
2. Visual response (< 100ms)
   ↓
3. Processing indicator
   ↓
4. Completion confirmation
```

### Pattern 3: Error Recovery
```
1. Error detected
   ↓
2. Clear explanation provided
   ↓
3. Actionable next steps shown
   ↓
4. Easy path to retry
```

---

## Success Metrics

**Time to Upload:**
- File selection: < 5 seconds
- Validation: < 3 seconds
- Upload (10 MB): < 30 seconds
- Total flow: < 45 seconds

**Error Recovery:**
- User understands error: 95%+
- User can fix issue: 90%+
- Retry success rate: 85%+

**User Satisfaction:**
- Task completion: 95%+
- Would use again: 90%+
- Recommends to others: 85%+

---

## Flow Variants by User Type

### Admin User
```
Has permission to:
• Upload files
• Override validation warnings
• Access error logs
• See detailed progress

Additional flow options:
• Upload anyway (ignore warnings)
• View technical error details
```

### Regular User
```
Has permission to:
• Upload files
• View basic errors

Limited flow options:
• Must fix validation errors
• Cannot override warnings
• Basic error messages only
```

### Viewer (No Upload Permission)
```
Upload disabled
• Button grayed out
• Tooltip: "Permission required"
• Can request access
```

---

## Mobile Flow Differences

**Key Changes on Mobile:**
1. No drag-and-drop (file picker only)
2. Native mobile file browser opens
3. Touch-optimized buttons (min 44×44px)
4. Single-column layout
5. Bottom sheet for errors (easier to reach)

**Mobile-Specific Flow:**
```
Tap upload button
  ↓
Native file picker opens
  ↓
Select from photos/files
  ↓
File displays in modal
  ↓
Tap large "Upload" button
  ↓
Progress shown full-width
  ↓
Success toast notification
```

---

## Accessibility Flow

**Screen Reader Path:**
```
1. Navigate to "Upload button"
   → Announced: "Upload button, opens file upload dialog"
   
2. Activate button (Enter/Space)
   → Announced: "File upload dialog opened"
   
3. Tab to "Choose File"
   → Announced: "Choose file button, opens file picker"
   
4. Select file
   → Announced: "Fire-Data.csv, 2.3 megabytes, CSV file selected"
   
5. Tab to "Confirm Upload"
   → Announced: "Confirm upload button"
   
6. During upload
   → Announced: "Uploading, 45 percent complete"
   
7. Completion
   → Announced: "Upload successful, returning to dashboard"
```

---

**Document Status:** Complete  
**Review Status:** Ready for implementation  
**Last Updated:** November 6, 2024  
**Next Step:** Use this flow as reference during development
