const KNOWN_PREFIX = ["E", "R", "LT", "LA"]

export function normalizeUnit(code) {
  const s = (code || "").toUpperCase().trim()
  const m = s.match(/^(LT|LA|E|R)(\d{1,3})$/)
  if (!m) return { ok: false, value: s }
  if (!KNOWN_PREFIX.includes(m[1])) return { ok: false, value: s }
  return { ok: true, value: `${m[1]}${parseInt(m[2], 10)}` }
}
