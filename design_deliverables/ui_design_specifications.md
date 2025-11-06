# UI Design Specifications - File Upload System

**Project:** FAMAR Dashboard  
**Component:** File Upload Interface  
**Author:** Zachary Alexander  
**Date:** November 6, 2024  
**Version:** 1.0

---

## Overview

This document defines the complete visual and interaction specifications for the file upload system. All measurements, colors, and behaviors are defined here for consistent implementation.

---

## Design Tokens

### Colors

**Primary Palette:**
```
Blue Primary:    #3498db
Blue Dark:       #2980b9
Blue Light:      #e7f3ff
Blue Hover:      #5dade2
```

**Secondary Palette:**
```
Green Success:   #27ae60
Green Light:     #d4edda
Yellow Warning:  #f39c12
Yellow Light:    #fff3cd
Red Error:       #e74c3c
Red Light:       #f8d7da
```

**Neutral Palette:**
```
Gray 900:        #212529  (primary text)
Gray 700:        #495057  (secondary text)
Gray 500:        #6c757d  (placeholder text)
Gray 300:        #dee2e6  (borders)
Gray 100:        #f8f9fa  (backgrounds)
White:           #ffffff
```

**Semantic Colors:**
```
Text Primary:    #212529
Text Secondary:  #6c757d
Text Disabled:   #adb5bd
Border Default:  #dee2e6
Border Focus:    #3498db
Background:      #ffffff
Shadow:          rgba(0, 0, 0, 0.1)
```

### Typography

**Font Family:**
```
Primary: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', sans-serif
Monospace: 'Courier New', Courier, monospace (for file names/sizes)
```

**Font Sizes:**
```
Heading 1:    24px / 1.3 line-height / 600 weight
Heading 2:    20px / 1.4 line-height / 600 weight
Heading 3:    18px / 1.4 line-height / 600 weight
Body Large:   16px / 1.5 line-height / 400 weight
Body:         14px / 1.5 line-height / 400 weight
Body Small:   13px / 1.4 line-height / 400 weight
Caption:      12px / 1.3 line-height / 400 weight
Label:        11px / 1.2 line-height / 600 weight (uppercase)
```

### Spacing Scale

```
Space 1:   4px
Space 2:   8px
Space 3:   12px
Space 4:   16px
Space 5:   20px
Space 6:   24px
Space 8:   32px
Space 10:  40px
Space 12:  48px
Space 16:  64px
```

### Border Radius

```
Small:    4px  (badges, tags)
Medium:   6px  (buttons, inputs)
Large:    8px  (cards, containers)
XLarge:   12px (modals, upload areas)
Round:    50% (avatars, icon buttons)
```

### Shadows

```
Shadow 1:  0 1px 3px rgba(0, 0, 0, 0.1)   (subtle)
Shadow 2:  0 2px 8px rgba(0, 0, 0, 0.1)   (card)
Shadow 3:  0 4px 12px rgba(0, 0, 0, 0.15) (elevated)
Shadow 4:  0 8px 16px rgba(0, 0, 0, 0.2)  (modal)
Shadow 5:  0 16px 32px rgba(0, 0, 0, 0.25) (overlay)
```

### Transitions

```
Fast:     150ms ease-in-out
Normal:   250ms ease-in-out
Slow:     400ms ease-in-out
```

---

## Component Specifications

### 1. Upload Area (Drag & Drop Zone)

**Desktop Dimensions:**
```
Width:  100% (max 800px)
Height: 320px
Padding: 60px 40px
```

**Default State:**
```
Background:   #ffffff
Border:       2px dashed #3498db
Border Radius: 12px
Box Shadow:   none
```

**Hover State:**
```
Background:   #f8fbff
Border:       2px dashed #2980b9
Transform:    translateY(-2px)
Box Shadow:   0 8px 16px rgba(52, 152, 219, 0.1)
Transition:   all 250ms ease-in-out
```

**Drag Over State:**
```
Background:   #f0fff4
Border:       3px dashed #27ae60
Border Color: #27ae60
```

**Error State:**
```
Background:   #fff5f5
Border:       2px dashed #e74c3c
Border Color: #e74c3c
```

**Content Structure:**
```
├─ Upload Icon (80×80px, centered)
├─ Main Text (18px, #34495e, 500 weight)
├─ Hint Text (14px, #7f8c8d)
├─ Choose File Button
└─ File Types Text (12px, #95a5a6)
```

---

### 2. Upload Icon

**Dimensions:**
```
Size: 80×80px
Margin Bottom: 20px
```

**SVG Styling:**
```
Fill: #3498db
Stroke: none
```

**States:**
```
Default:   opacity 1.0
Hover:     opacity 0.8, scale 1.05
Drag Over: fill changes to #27ae60
```

---

### 3. Choose File Button

**Primary Button:**
```
Background:    #3498db
Color:         #ffffff
Padding:       12px 32px
Border Radius: 6px
Font Size:     14px
Font Weight:   500
Border:        none
```

**Hover State:**
```
Background:    #2980b9
Transform:     translateY(-1px)
Box Shadow:    0 4px 8px rgba(52, 152, 219, 0.3)
Cursor:        pointer
```

**Active State:**
```
Transform:     translateY(0)
Box Shadow:    0 2px 4px rgba(52, 152, 219, 0.2)
```

**Disabled State:**
```
Background:    #e9ecef
Color:         #adb5bd
Cursor:        not-allowed
Opacity:       0.6
```

---

### 4. File Preview Card

**Dimensions:**
```
Width:  100%
Padding: 20px
Margin Top: 20px
Border Radius: 8px
```

**Styling:**
```
Background:   #ffffff
Border:       1px solid #e9ecef
Box Shadow:   0 2px 8px rgba(0, 0, 0, 0.1)
```

**Layout:**
```
Display: flex
Align Items: center
Gap: 16px
```

**Components:**
- File Icon (48×48px)
- File Info (flex: 1)
- Action Buttons (32×32px each)

---

### 5. File Icon (Large)

**Dimensions:**
```
Size: 48×48px
Border Radius: 8px
Margin Right: 16px
```

**Styling:**
```
Background: linear-gradient(135deg, #667eea 0%, #764ba2 100%)
Display: flex
Align Items: center
Justify Content: center
```

**Icon Inside:**
```
Size: 28×28px
Fill: #ffffff
```

---

### 6. File Information Display

**File Name:**
```
Font Size:   16px
Font Weight: 600
Color:       #212529
Overflow:    hidden
Text Overflow: ellipsis
White Space: nowrap
Margin Bottom: 4px
```

**File Metadata:**
```
Font Size:   13px
Color:       #6c757d
Display:     inline-flex
Gap:         8px
```

**Example:**
```
Fire-Data-2024.csv
2.3 MB • Uploaded 2 minutes ago
```

---

### 7. Progress Bar

**Container:**
```
Width:  100%
Height: 6px
Background: #ecf0f1
Border Radius: 3px
Overflow: hidden
Margin Top: 12px
```

**Fill:**
```
Height: 100%
Background: linear-gradient(90deg, #3498db 0%, #2ecc71 100%)
Border Radius: 3px
Transition: width 300ms ease-out
```

**States:**
```
0%:        width: 0%
50%:       width: 50%
100%:      width: 100%, background: #27ae60
Error:     background: #e74c3c
Paused:    background: #f39c12
```

---

### 8. Status Badges

**Success Badge:**
```
Background:   #d4edda
Color:        #155724
Padding:      4px 10px
Border Radius: 12px
Font Size:    12px
Font Weight:  500
Display:      inline-flex
Align Items:  center
Gap:          6px
```

**Warning Badge:**
```
Background:   #fff3cd
Color:        #856404
```

**Error Badge:**
```
Background:   #f8d7da
Color:        #721c24
```

**Processing Badge:**
```
Background:   #e7f3ff
Color:        #0c5460
```

**Badge Icon (Dot):**
```
Width:  6px
Height: 6px
Border Radius: 50%
Background: currentColor
```

---

### 9. Action Buttons (Icon Only)

**Dimensions:**
```
Size: 32×32px
Padding: 0
Border Radius: 4px
```

**Default State:**
```
Background: #f8f9fa
Border: none
Cursor: pointer
```

**Hover State:**
```
Background: #e9ecef
```

**Icon:**
```
Size: 16×16px
Fill: #495057
```

**Delete/Remove Button:**
```
Hover Background: #f8d7da
Hover Icon Fill: #e74c3c
```

---

### 10. Error Messages

**Container:**
```
Display: flex
Align Items: flex-start
Gap: 12px
Padding: 16px
Background: #f8d7da
Border: 1px solid #f5c6cb
Border Radius: 6px
Margin Top: 16px
```

**Icon:**
```
Size: 20×20px
Fill: #e74c3c
Flex Shrink: 0
Margin Top: 2px
```

**Text:**
```
Font Size: 14px
Color: #721c24
Line Height: 1.5
```

**Title:**
```
Font Weight: 600
Margin Bottom: 4px
```

**Description:**
```
Font Weight: 400
```

---

### 11. File Type Labels

**Styling:**
```
Font Size: 12px
Color: #95a5a6
Text Align: center
Margin Top: 15px
```

**Content:**
```
"Supported formats: CSV, Excel (.xlsx, .xls) • Max size: 50 MB"
```

---

### 12. Modal/Popup Container

**Dimensions:**
```
Max Width: 600px
Padding: 32px
Border Radius: 12px
```

**Styling:**
```
Background: #ffffff
Box Shadow: 0 16px 32px rgba(0, 0, 0, 0.25)
Position: fixed (centered)
Z-Index: 1000
```

**Backdrop:**
```
Background: rgba(0, 0, 0, 0.5)
Backdrop Filter: blur(4px)
Position: fixed
Inset: 0
Z-Index: 999
```

**Animation:**
```
Entrance: fade in + scale up (0.9 → 1.0) over 250ms
Exit: fade out + scale down (1.0 → 0.95) over 200ms
```

---

## Interaction Specifications

### 1. Drag and Drop

**Drag Enter:**
- Add `drag-over` class to upload area
- Border color changes to green (#27ae60)
- Background changes to #f0fff4
- Transition: 150ms ease-in-out

**Drag Leave:**
- Remove `drag-over` class
- Return to default state
- Transition: 150ms ease-in-out

**Drop:**
- Remove `drag-over` class
- Trigger file validation
- Show file preview immediately
- Disable upload area (prevent additional drops)

### 2. File Selection Flow

```
1. User clicks "Choose File" button
   → Native file picker opens
   
2. User selects file
   → File picker closes
   → Client-side validation starts
   
3. Validation passes
   → File preview card appears (250ms fade in)
   → Upload button becomes active
   
4. User clicks "Confirm Upload"
   → Progress bar appears
   → Upload begins
   
5. Upload completes
   → Success message shows (fade in)
   → Auto-close after 2 seconds
```

### 3. Hover States

**Button Hover:**
- Transition: 150ms ease-in-out
- Transform: translateY(-1px)
- Box shadow increases

**Card Hover:**
- Subtle elevation change
- Border color brightens
- Transition: 200ms ease-in-out

**Icon Hover:**
- Scale: 1.1
- Opacity: 0.8
- Transition: 150ms ease-in-out

### 4. Loading States

**Button Loading:**
```
Text: "Uploading..."
Icon: Spinning circle (360deg rotation, 1s infinite linear)
Disabled: true
Cursor: wait
```

**Progress Animation:**
```
Width animates from 0% to current progress
Transition: width 300ms ease-out
Update interval: 100ms
```

### 5. Focus States

**Keyboard Focus:**
```
Outline: 2px solid #3498db
Outline Offset: 2px
Border Radius: matches element
```

**Focus Visible (keyboard only):**
```
Use :focus-visible pseudo-class
No focus ring on mouse click
Clear focus ring on Tab navigation
```

---

## Responsive Breakpoints

### Desktop (1024px+)
```
Upload Area Width: 100% (max 800px)
Upload Area Height: 320px
Modal Width: 600px
Font sizes: default (as specified above)
```

### Tablet (768px - 1023px)
```
Upload Area Width: 100%
Upload Area Height: 280px
Modal Width: 90vw (max 600px)
Padding reduced by 25%
```

### Mobile (< 768px)
```
Upload Area Width: 100%
Upload Area Height: 240px
Upload Area Padding: 40px 20px
Modal Width: 95vw
Modal Padding: 24px
Button Width: 100% (stacked)
Font sizes: -1px from desktop
```

---

## Accessibility Requirements

### ARIA Attributes

**Upload Area:**
```html
<div 
  role="button"
  tabindex="0"
  aria-label="Drag and drop file upload area"
  aria-describedby="upload-instructions"
>
```

**File Input:**
```html
<input
  type="file"
  id="file-input"
  aria-label="Choose file to upload"
  accept=".csv,.xlsx,.xls"
>
```

**Progress Bar:**
```html
<div
  role="progressbar"
  aria-valuenow="67"
  aria-valuemin="0"
  aria-valuemax="100"
  aria-label="Upload progress: 67 percent"
>
```

**Error Messages:**
```html
<div
  role="alert"
  aria-live="assertive"
  aria-atomic="true"
>
```

### Keyboard Navigation

**Tab Order:**
```
1. Upload button
2. Choose File button (if visible)
3. File preview actions (if file selected)
4. Confirm/Cancel buttons
5. Close button (X)
```

**Keyboard Shortcuts:**
```
Enter/Space on upload area: Open file picker
Escape: Close modal/clear selection
Tab: Move to next element
Shift+Tab: Move to previous element
```

### Color Contrast

**WCAG 2.1 AA Compliance:**
```
Text on White:     4.5:1 minimum
Large Text:        3:1 minimum
Interactive:       3:1 minimum
Error Text:        4.5:1 minimum
```

**Verified Combinations:**
```
✓ #212529 on #ffffff: 16.1:1 (passes AAA)
✓ #495057 on #ffffff: 8.6:1 (passes AAA)
✓ #721c24 on #f8d7da: 7.2:1 (passes AA)
✓ #3498db on #ffffff: 3.4:1 (passes AA for large text)
```

---

## Animation Specifications

### Fade In
```css
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}
duration: 250ms
timing: ease-in-out
```

### Scale Up
```css
@keyframes scaleUp {
  from { transform: scale(0.95); opacity: 0; }
  to { transform: scale(1); opacity: 1; }
}
duration: 250ms
timing: ease-out
```

### Slide Up
```css
@keyframes slideUp {
  from { transform: translateY(10px); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
}
duration: 300ms
timing: ease-out
```

### Spin (Loading)
```css
@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}
duration: 1000ms
timing: linear
iteration: infinite
```

---

## Browser Support

**Minimum Versions:**
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

**Required Features:**
- CSS Grid
- Flexbox
- CSS Custom Properties
- File API
- Drag and Drop API
- FormData API
- Fetch API

**Fallbacks:**
- No drag-drop: File picker still works
- No animations: Instant state changes
- No shadows: Borders emphasized instead

---

## Implementation Checklist

- [ ] All colors match design tokens exactly
- [ ] Typography scales correctly on all devices
- [ ] Spacing follows 4px/8px grid
- [ ] Border radius consistent across components
- [ ] Shadows applied correctly
- [ ] Hover states transition smoothly
- [ ] Focus states visible for keyboard users
- [ ] ARIA attributes present and correct
- [ ] Color contrast meets WCAG AA
- [ ] Responsive breakpoints work
- [ ] Animations perform at 60fps
- [ ] Touch targets minimum 44×44px on mobile

---

**Document Status:** Complete  
**Review Status:** Ready for implementation  
**Last Updated:** November 6, 2024  
**Next Review:** After implementation, before Sprint 3 demo
