const HAS_SESSION_KEY = 'has_authenticated_session'

export const hasAuthenticatedSession = () => {
  if (typeof window === 'undefined') return false
  return window.sessionStorage.getItem(HAS_SESSION_KEY) === '1'
}

export const markAuthenticatedSession = () => {
  if (typeof window === 'undefined') return
  window.sessionStorage.setItem(HAS_SESSION_KEY, '1')
}

export const clearAuthenticatedSession = () => {
  if (typeof window === 'undefined') return
  window.sessionStorage.removeItem(HAS_SESSION_KEY)
}
