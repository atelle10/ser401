# File Upload Interaction Patterns Research

## Common Patterns

### Drag and Drop
Most modern file upload interfaces support drag and drop:
- Visual feedback on hover
- Clear drop zone boundaries
- State changes during drag
- Support for multiple files or single file

### Click to Select
Traditional file input with custom styling:
- Button or clickable area
- Opens native file picker
- Maintains accessibility
- Works on all devices

### Paste from Clipboard
Advanced pattern for power users:
- Ctrl+V or Cmd+V support
- Useful for screenshots
- Less common but valuable

## Best Practices

### Visual Feedback
Clear indication of:
- Accepted file types
- Maximum file size
- Current state (idle, hover, dragging, uploading, success, error)
- Progress for larger files

### Error Handling
Show errors for:
- Invalid file type
- File too large
- Upload failure
- Network issues

Provide clear recovery paths.

## Examples from Design Systems

### Material Design
- 48dp minimum touch target
- Clear visual states
- Progress indicators
- Snackbar notifications for errors

### Ant Design
- Dragger component with large drop zone
- Upload list with file status
- Icon-based visual feedback
- Built-in validation

### Carbon Design
- Structured file uploader
- Drag and drop support
- File list with actions
- Inline error messages
