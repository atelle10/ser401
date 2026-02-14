let manualLogout = false

export const markManualLogout = () => {
  manualLogout = true
}

export const consumeManualLogout = () => {
  const wasManualLogout = manualLogout
  manualLogout = false
  return wasManualLogout
}
