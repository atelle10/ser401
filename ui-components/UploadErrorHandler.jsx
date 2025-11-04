const UploadErrorHandler = ({ error, onRetry, onDismiss }) => {
  if (!error) return null;

  const getErrorMessage = (err) => {
    // common file upload errors for FAMAR data
    if (err.includes('format')) {
      return 'Invalid file format. Please upload CSV or Excel files only.';
    }
    if (err.includes('size')) {
      return 'File is too large. FAMAR data files should be under 10MB.';
    }
    if (err.includes('network')) {
      return 'Network error. Check your connection and try again.';
    }
    return err || 'An error occurred during upload.';
  };

  const errorMsg = getErrorMessage(error);
  const showRetry = !error.includes('format'); // can't retry format errors

  return (
    <div className="border border-red-300 bg-red-50 rounded p-4 mb-4">
      <div className="flex items-start">
        <span className="text-red-600 mr-2">⚠</span>
        <div className="flex-1">
          <p className="text-sm text-red-800 font-medium">Upload Failed</p>
          <p className="text-sm text-red-700 mt-1">{errorMsg}</p>
          
          <div className="mt-3 flex gap-2">
            {showRetry && (
              <button 
                onClick={onRetry}
                className="text-sm bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
              >
                Retry Upload
              </button>
            )}
            <button 
              onClick={onDismiss}
              className="text-sm text-red-600 hover:text-red-800"
            >
              Dismiss
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UploadErrorHandler;
