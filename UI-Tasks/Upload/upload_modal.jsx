import React, { useState, useRef } from 'react'

/**
 * Standalone modal for upload prototype.
 * Not imported by the app. Used for UI-only iteration.
 */
export default function UploadModal() {
  const [open, setOpen] = useState(false)
  const closeBtn = useRef(null)

  return (
    <div>
      <button onClick={() => setOpen(true)} className="px-3 py-1 rounded bg-blue-600 text-white">Upload</button>
      {open && (
        <div role="dialog" aria-modal="true" className="fixed inset-0 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-2xl shadow-xl w-[720px] max-w-[95vw]">
            <div className="flex items-center justify-between p-4 border-b">
              <h2 className="font-semibold">Upload Data</h2>
              <button ref={closeBtn} onClick={() => setOpen(false)} aria-label="Close" className="text-2xl leading-none">×</button>
            </div>
            <div className="p-4 space-y-3 text-sm">
              <p>Select a CSV to validate before staging.</p>
              <input type="file" accept=".csv" />
              <div className="text-xs text-gray-500">Accepted: .csv • Max ~50MB</div>
            </div>
            <div className="p-4 border-t flex justify-end gap-2">
              <button onClick={() => setOpen(false)} className="px-3 py-1 rounded border">Cancel</button>
              <button className="px-3 py-1 rounded bg-blue-600 text-white">Validate</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
