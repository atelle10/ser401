import { API_URL } from '../config.js'

const TARGETS_URL = `${API_URL}/api/admin/response-time-targets`

export const fetchResponseTimeTargets = async () => {
  const response = await fetch(TARGETS_URL, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
  })

  if (!response.ok) {
    throw new Error(`API error: ${response.status}`)
  }

  return response.json()
}

export const saveResponseTimeTargets = async (body) => {
  const response = await fetch(TARGETS_URL, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })

  if (!response.ok) {
    throw new Error(`API error: ${response.status}`)
  }

  return response.json()
}
