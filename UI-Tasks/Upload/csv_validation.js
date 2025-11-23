// Minimal CSV checks: header presence, size, simple timestamp pattern
export function hasRequiredHeaders(headers) {
  const need = ["incident_id", "timestamp", "unit"]
  const set = new Set(headers.map(h => h.trim().toLowerCase()))
  return need.every(h => set.has(h))
}

export function looksLikeTimestamp(value) {
  // 2025-01-31 14:22:00
  return /^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/.test(value || "")
}

export function unitPatternOK(unit) {
  // E##, R##, LT##, LA##, etc.
  return /^(E|R|LT|LA)\d{1,3}$/i.test((unit || "").trim())
}
