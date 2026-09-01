const DB_NAME = 'studymate-wallpapers'
const STORE = 'videos'
const DB_VERSION = 1

let dbPromise = null

function openDb() {
  if (typeof indexedDB === 'undefined') return Promise.reject(new Error('IndexedDB unavailable'))
  if (dbPromise) return dbPromise
  dbPromise = new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, DB_VERSION)
    req.onupgradeneeded = () => {
      const db = req.result
      if (!db.objectStoreNames.contains(STORE)) {
        db.createObjectStore(STORE, { keyPath: 'id' })
      }
    }
    req.onsuccess = () => resolve(req.result)
    req.onerror = () => reject(req.error)
  })
  return dbPromise
}

async function getCached(id) {
  try {
    const db = await openDb()
    return await new Promise((resolve) => {
      const tx = db.transaction(STORE, 'readonly')
      const req = tx.objectStore(STORE).get(id)
      req.onsuccess = () => resolve(req.result || null)
      req.onerror = () => resolve(null)
    })
  } catch {
    return null
  }
}

async function putCached(id, blob) {
  try {
    const db = await openDb()
    await new Promise((resolve, reject) => {
      const tx = db.transaction(STORE, 'readwrite')
      tx.objectStore(STORE).put({ id, blob, ts: Date.now() })
      tx.oncomplete = () => resolve()
      tx.onerror = () => reject(tx.error)
    })
  } catch {
    // storage failures are non-fatal; fall back to remote URL
  }
}

async function removeCached(id) {
  try {
    const db = await openDb()
    await new Promise((resolve) => {
      const tx = db.transaction(STORE, 'readwrite')
      tx.objectStore(STORE).delete(id)
      tx.oncomplete = () => resolve()
      tx.onerror = () => resolve()
    })
  } catch {
    // ignore
  }
}

// Fetch a wallpaper (video or image) and cache it in IndexedDB. Returns a
// blob URL that can be used immediately. Falls back to a null (caller then
// uses the remote URL) on any failure.
async function fetchAndCache(id, url) {
  try {
    const cached = await getCached(id)
    if (cached && cached.blob) return URL.createObjectURL(cached.blob)
  } catch {
    // continue to network fetch
  }

  try {
    const res = await fetch(url)
    if (!res.ok) return null
    const blob = await res.blob()
    if (blob.size === 0) return null
    void putCached(id, blob)
    return URL.createObjectURL(blob)
  } catch {
    return null
  }
}

export { getCached, putCached, removeCached, fetchAndCache }
