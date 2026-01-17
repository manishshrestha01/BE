// Lightweight client-side helpers for updating <head> tags (used by pages/components)
export function isBrowser() {
  return typeof window !== 'undefined' && typeof document !== 'undefined'
}

export function setTitle(title) {
  if (!isBrowser()) return
  document.title = title
}

export function setMeta({ name, property, content }) {
  if (!isBrowser()) return
  if (name) {
    let el = document.querySelector(`meta[name="${name}"]`)
    if (!el) {
      el = document.createElement('meta')
      el.setAttribute('name', name)
      document.head.appendChild(el)
    }
    el.setAttribute('content', content)
    return el
  }

  if (property) {
    let el = document.querySelector(`meta[property="${property}"]`)
    if (!el) {
      el = document.createElement('meta')
      el.setAttribute('property', property)
      document.head.appendChild(el)
    }
    el.setAttribute('content', content)
    return el
  }
}

export function setLinkRel(rel, href) {
  if (!isBrowser()) return
  let el = document.querySelector(`link[rel="${rel}"]`)
  if (!el) {
    el = document.createElement('link')
    el.setAttribute('rel', rel)
    document.head.appendChild(el)
  }
  el.setAttribute('href', href)
  return el
}

export function setJSONLD(json, id) {
  if (!isBrowser()) return
  const jsonText = JSON.stringify(json, null, 2)
  if (id) {
    let el = document.getElementById(id)
    if (!el) {
      el = document.createElement('script')
      el.type = 'application/ld+json'
      el.id = id
      document.head.appendChild(el)
    }
    el.textContent = jsonText
    return el
  } else {
    const el = document.createElement('script')
    el.type = 'application/ld+json'
    el.textContent = jsonText
    document.head.appendChild(el)
    return el
  }
}

export function removeElementById(id) {
  if (!isBrowser()) return
  const el = document.getElementById(id)
  if (el) el.remove()
}
