# File Upload Interaction Patterns Research

## Common Patterns

### Drag and Drop
Most modern file upload interfaces support drag and drop:
- Visual feedback on hover
- Clear drop zone boundaries
- State changes during drag

### Click to Select
Traditional file input with custom styling:
- Button or clickable area
- Opens native file picker
- Maintains accessibility

### Paste from Clipboard
Advanced pattern for power users:
- Ctrl+V or Cmd+V support
- Useful for screenshots
- Requires JavaScript handling

## Best Practices

### Visual Feedback
Clear indication of:
- Accepted file types
- Maximum file size
- Current state (idle, hover, dragging, uploading, success, error)

### Error Handling
Show errors for invalid file type, size, upload failure, and network issues.
Provide clear recovery paths.
