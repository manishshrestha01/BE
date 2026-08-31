// Transient "history.state"-like flag passed between routes. react-router-dom's
// navigate(url, { state }) has no direct equivalent in next/navigation, so we
// persist the payload in sessionStorage and clear it on read.
const KEY = 'studymate:location-state:v1'

export function writeLocationState(state) {
  try {
    sessionStorage.setItem(KEY, JSON.stringify(state ?? null))
  } catch {
    // Ignore storage failures.
  }
}

export function readLocationState() {
  try {
    const raw = sessionStorage.getItem(KEY)
    if (!raw) return null
    sessionStorage.removeItem(KEY)
    return JSON.parse(raw)
  } catch {
    return null
  }
}