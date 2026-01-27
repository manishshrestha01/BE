import { useCallback, useEffect, useRef, useState } from 'react'
import { useAuth } from '../../context/AuthContext'
import { useUserProfile } from '../../hooks/useUserProfile'
import { createSupportMessage } from '../../lib/database'
import { uploadFile, isAllowedFileType } from '../../lib/storage'
import { isSupabaseConfigured } from '../../lib/supabase'
import './ContactApp.css'

const MAX_ATTACHMENTS = 3
const MAX_FILE_BYTES = 15 * 1024 * 1024 // 15MB
const ACCEPT = 'image/*,.pdf,.ppt,.pptx,.doc,.docx,.txt,.md'
const LOCAL_KEY = 'study_contact_messages_v1'

export default function ContactApp ({ onClose }) {
  const { user } = useAuth()
  const { profile } = useUserProfile()
  const [windowState, setWindowState] = useState('normal')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const [attachments, setAttachments] = useState([])
  const [dropActive, setDropActive] = useState(false)
  const [sending, setSending] = useState(false)
  const [statusMsg, setStatusMsg] = useState('')
  const fileInputRef = useRef(null)
  const msgRef = useRef(null)
  const windowRef = useRef(null)

  useEffect(() => {
    // populate form from profile/auth if available
    if (profile?.full_name) setName(profile.full_name)
    else if (user?.user_metadata?.full_name) setName(user.user_metadata.full_name)
    if (user?.email) setEmail(user.email)
  }, [user, profile])

  const nameLocked = Boolean(profile?.full_name)
  const emailLocked = Boolean(user?.email || profile?.email)

  const formatFileSize = (n) => {
    if (!n) return '0 B'
    if (n < 1024) return `${n} B`
    if (n < 1024 * 1024) return `${Math.round(n / 1024)} KB`
    return `${(n / (1024 * 1024)).toFixed(1)} MB`
  }

  const addFiles = useCallback((fileList) => {
    const files = Array.from(fileList || [])
    for (const f of files) {
      if (attachments.length >= MAX_ATTACHMENTS) {
        setStatusMsg(`You can attach up to ${MAX_ATTACHMENTS} files.`)
        return
      }
      if (!isAllowedFileType(f.name)) {
        setStatusMsg('That file type is not allowed.')
        return
      }
      if (f.size > MAX_FILE_BYTES) {
        setStatusMsg('File too large — max 15 MB')
        return
      }
      const reader = new FileReader()
      reader.onload = () => setAttachments(a => [...a, { id: Date.now() + Math.random(), name: f.name, size: f.size, type: f.type, file: f, dataUrl: reader.result }])
      reader.onerror = () => setStatusMsg('Failed to read file')
      reader.readAsDataURL(f)
    }
  }, [attachments.length])

  const handleFileInput = (e) => {
    addFiles(e.target.files)
    e.target.value = ''
  }

  const handleDrop = (e) => {
    e.preventDefault()
    setDropActive(false)
    addFiles(e.dataTransfer?.files)
  }

  const removeAttachment = (id) => setAttachments(a => a.filter(x => x.id !== id))

  const persistLocally = (payload) => {
    try {
      const existing = JSON.parse(localStorage.getItem(LOCAL_KEY) || '[]')
      existing.unshift(payload)
      localStorage.setItem(LOCAL_KEY, JSON.stringify(existing))
      return true
    } catch (err) {
      console.error(err)
      return false
    }
  }

  const send = useCallback(async () => {
    if (!message.trim()) {
      setStatusMsg('Please enter a message before sending.')
      msgRef.current?.focus()
      return
    }

    setSending(true)
    setStatusMsg('')

    const payload = {
      userId: user?.id || null,
      name: name || null,
      email: email || null,
      subject: (message || '').slice(0, 80),
      message,
      metadata: { attachments: attachments.map(a => ({ name: a.name, size: a.size })) }
    }

    persistLocally({ ...payload, created_at: new Date().toISOString() })

    // upload attachments if Supabase configured
    if (isSupabaseConfigured() && attachments.length) {
      const uploaded = []
      for (const att of attachments) {
        try {
          const res = await uploadFile(att.file)
          if (res?.error) throw res.error
          uploaded.push({ name: att.name, url: res.data?.url || res.data?.publicUrl || null })
        } catch (err) {
          console.warn('attachment upload failed', err)
        }
      }
      payload.metadata.attachments = uploaded
    }

    // persist support message
    try {
      const res = await createSupportMessage(payload)
      if (res?.error) {
        setStatusMsg('Saved locally (server unavailable)')
      } else {
        setStatusMsg('Message sent successfully — thank you!')
        setMessage('')
        setAttachments([])
      }
    } catch (err) {
      console.error(err)
      setStatusMsg('Saved locally (failed to send)')
    } finally {
      setSending(false)
      setTimeout(() => setStatusMsg(''), 3000)
    }
  }, [attachments, email, message, name, user?.id])

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') onClose?.()
      if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') send()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose, send])

  const handleMinimize = () => setWindowState('minimized')

  const handleMaximize = () => {
    setWindowState(prev => prev === 'maximized' ? 'normal' : 'maximized')
    // focus window so keyboard shortcuts (Esc, Cmd+Enter) continue to work
    setTimeout(() => { try { windowRef.current?.focus() } catch (e) {} }, 60)
  }

  const getWindowClassName = () => {
    let cls = 'contact-window glass-dark'
    if (windowState === 'maximized') cls += ' maximized'
    if (windowState === 'minimized') cls += ' minimized'
    return cls
  }

  if (windowState === 'minimized') {
    return (
      <div className="contact-minimized" onClick={() => { setWindowState('normal'); setTimeout(() => { try { windowRef.current?.focus() } catch (e) {} }, 60) }}>
        <img src="/gedit.png" alt="Contact" className="contact-minimized-img" />
        <span>Contact</span>
      </div>
    )
  }

  return (
    <div className="contact-overlay" onClick={onClose}>
      <div ref={windowRef} className={getWindowClassName()} role="dialog" aria-label="Contact" tabIndex={-1} onMouseDown={() => { try { windowRef.current?.focus() } catch (e) {} }} onClick={(e) => e.stopPropagation()}>
        <div className="contact-titlebar">
          <div className="window-controls">
            <button className="window-btn close" onClick={onClose} title="Close">×</button>
            <button className="window-btn minimize" onClick={handleMinimize} title="Minimize">−</button>
            <button
              className="window-btn maximize"
              onClick={handleMaximize}
              title={windowState === 'maximized' ? 'Restore' : 'Maximize'}
              aria-label={windowState === 'maximized' ? 'Restore' : 'Maximize'}
            >+</button>
          </div>
          <div className="contact-title">Contact</div>
        </div>

        <div className="contact-body" onDragOver={(e) => e.preventDefault()}>
          <div className="contact-shell">
            <div className="contact-grid">
              <div className="contact-left" aria-hidden>
                <div className="contact-step"><div className="step-num">1</div><div className="step-label">Your name</div></div>
                <div className="contact-step"><div className="step-num">2</div><div className="step-label">Your email</div></div>
                <div className="contact-step"><div className="step-num">3</div><div className="step-label">Message</div></div>
              </div>

              <div className="contact-right">
                <div className="field-row">
                  <input
                    className={`contact-input ${nameLocked ? 'locked' : ''}`}
                    value={name}
                    onChange={e => setName(e.target.value)}
                    placeholder="Full name"
                    aria-label="Your name"
                    readOnly={nameLocked}
                  />
                </div>

                <div className="field-row">
                  <input
                    className={`contact-input ${emailLocked ? 'locked' : ''}`}
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    aria-label="Your email"
                    readOnly={emailLocked}
                  />
                </div>

                <div className="field-row">
                  <textarea
                    ref={msgRef}
                    className="contact-textarea"
                    value={message}
                    onChange={e => setMessage(e.target.value)}
                    placeholder="Write your message..."
                    aria-label="Message"
                    aria-required={true}
                  />
                </div>

                <div className="contact-status" aria-live="polite">{statusMsg && <div>{statusMsg}</div>}</div>
              </div>
            </div>

            <div className="contact-footer" onDrop={handleDrop} onDragOver={(e) => { e.preventDefault(); setDropActive(true) }} onDragLeave={() => setDropActive(false)}>
              <div style={{ display: 'flex', gap: 12, alignItems: 'center', flex: 1 }}>
                <input ref={fileInputRef} className="hidden-file-input" type="file" accept={ACCEPT} onChange={handleFileInput} multiple={false} />

                <div className={`attachment-dropzone ${dropActive ? 'active' : ''}`} onClick={() => fileInputRef.current?.click()} role="button" tabIndex={0} aria-describedby="contact-attachment-hint">
                  <div className="attachment-placeholder">Click to attach files or drag & drop here — PNG / JPG / PDF (max 15 MB)</div>
                </div>

                <div className="attachments-col" style={{ marginLeft: 8 }}>
                  <div id="contact-attachment-hint" className="inline-attach-meta">{attachments.length > 0 ? `${attachments.length} attached` : 'No attachments'}</div>
                  {attachments.length > 0 && (
                    <div className="attachment-list">
                      {attachments.map(a => (
                        <div key={a.id} className="attachment-item">
                          <div className="attachment-thumb">{a.type.startsWith('image/') ? <img src={a.dataUrl} alt={a.name} /> : <div className="attachment-icon">📄</div>}</div>
                          <div className="attachment-meta"><div className="attachment-name">{a.name}</div><div className="attachment-size">{formatFileSize(a.size)}</div></div>
                          <button className="attachment-remove" onClick={() => removeAttachment(a.id)} aria-label={`Remove ${a.name}`}>✕</button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                <div style={{ color: 'var(--text-tertiary)', fontSize: 13 }} />
                <button className="btn-send" onClick={send} disabled={sending || !message.trim()} aria-disabled={sending || !message.trim()}>{sending ? 'Sending…' : 'Send Message'}</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
 }
