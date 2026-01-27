import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useBackground } from '../../context/BackgroundContext'
import { useUserProfile } from '../../hooks/useUserProfile'
import { useAuth } from '../../context/AuthContext'
import SettingRow from './SettingRow'
import './Settings.css'
import { COLLEGES } from '../../lib/colleges'

const Settings = ({ onClose, initialSection = 'profile' }) => {
  const navigate = useNavigate()
  const { backgrounds, currentBg, changeBackground, customBg, setCustomBackground, removeCustomBackground } = useBackground()
  const { profile, updateProfile, getInitials, error: profileError } = useUserProfile()
  const { user, signOut, isAuthenticated } = useAuth()
  const [activeSection, setActiveSection] = useState(initialSection)
  const [mobileView, setMobileView] = useState(null) // null | 'profile' | 'wallpaper' | 'about'
  const [windowState, setWindowState] = useState('normal') // 'normal', 'maximized', 'minimized'
  const [formData, setFormData] = useState({
    full_name: profile.full_name || '',
    semester: profile.semester || '',
    faculty: profile.faculty || 'Computer Engineering',
    university: profile.university || 'Pokhara University',
    college: profile.college || ''
  })
  const fileInputRef = useRef(null)
  const [uploadError, setUploadError] = useState('')
  const [saveError, setSaveError] = useState('')
  const [uploading, setUploading] = useState(false)
  const [dropActive, setDropActive] = useState(false)
  const touchStartX = useRef(null)
  const touchDelta = useRef(0)

  // FAQ state (namespaced for settings only)
  const [faqSearch, setFaqSearch] = useState('')
  const [openFaq, setOpenFaq] = useState(null)

  const settingsFaqs = [
    { id: 'q1', question: 'How do I change my wallpaper?', answer: 'Open Settings → Wallpaper. Select a built-in background or upload a custom image (max 100 MB).' },
    { id: 'q2', question: 'How do I update my profile?', answer: 'Go to Settings → Profile. Update your full name, semester, and college, then click Save.' },
    { id: 'q3', question: 'How do I sign out?', answer: 'Open Settings → Profile → Account and click Sign Out, or use the Sign Out row in mobile Settings.' },
    { id: 'q4', question: 'Can I upload my own background image?', answer: 'Yes — use the Wallpaper section to upload or drag & drop an image. Supported files are images only.' },
    { id: 'q5', question: 'Where can I find the app version?', answer: 'Open Settings → About to see the current version.' },
    { id: 'q6', question: 'What is the Dashboard app?', answer: 'The Dashboard is the main hub of StudyMate — it surfaces curated semester-wise resources, featured notes, and quick links (Notes, Contact, and other apps) so you can quickly find study materials.' },
    { id: 'q7', question: 'How can I upload notes or report bugs?', answer: 'Use the Contact app (accessible from the Dashboard) to upload study materials. If you need to report bugs, request features, or share files directly, use the Contact app — attach screenshots or files (common formats supported) and send a message. Contact attachments are limited to ~15 MB per file.' }
  ]

  const toggleFaq = (id) => setOpenFaq(prev => prev === id ? null : id)

  // Keep local form state in sync with profile when it loads/changes
  useEffect(() => {
    setFormData({
      full_name: profile.full_name || '',
      semester: profile.semester || '',
      faculty: profile.faculty || 'Computer Engineering',
      university: profile.university || 'Pokhara University',
      college: profile.college || ''
    })
  }, [profile])

  const semesters = [
    '1st Semester', '2nd Semester', '3rd Semester', '4th Semester',
    '5th Semester', '6th Semester', '7th Semester', '8th Semester'
  ]

  // Faculty is currently fixed; show as non-editable input (no dropdown)

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSaveProfile = async () => {
    // Persist profile and mark setup_complete only when all required fields are present
    // clear previous saveError
    setSaveError('')
    // validate college value if present
    if (formData.college && !COLLEGES.some(c => c.value === formData.college)) {
      setSaveError('Please select a valid college from the list.')
      return;
    }

    const isComplete = Boolean(formData.full_name && formData.semester && formData.college)
    try {
      await updateProfile({ ...formData, setup_complete: isComplete })
      console.log('Profile saved')
    } catch (err) {
      console.error('Failed to save profile:', err)
      setSaveError('Failed to save profile. Please try again.')
    }
  }

  const handleSignOut = async () => {
    try {
      await signOut()
      onClose()
      navigate('/')
    } catch (err) {
      console.error('Sign out error:', err)
    }
  }

  const handleUploadClick = () => {
    setUploadError('')
    fileInputRef.current?.click()
  }

  const handleFileChange = (e) => {
    const file = e.target?.files?.[0]
    if (file) processFile(file)
    // clear input so same file can be selected again if needed
    e.target.value = ''
  }

  const handleDragOver = (e) => {
    e.preventDefault()
  }

  const handleDrop = (e) => {
    e.preventDefault()
    setDropActive(false)
    const file = e.dataTransfer?.files?.[0]
    if (file) processFile(file)
  }

  const processFile = (file) => {
    setUploadError('')
    if (!file.type.startsWith('image/')) {
      setUploadError('Please upload a valid image file.')
      return
    }

    // Allow files up to 100 MB
    const MAX_SIZE = 100 * 1024 * 1024 // 100 MB
    if (file.size > MAX_SIZE) {
      setUploadError('Image is too large (max 100 MB).')
      return
    }

    // For large files, prefer using blob URLs to avoid expensive base64 encoding in memory
    const BLOB_THRESHOLD = 10 * 1024 * 1024 // 10 MB
    if (file.size > BLOB_THRESHOLD && typeof URL.createObjectURL === 'function') {
      try {
        const blobUrl = URL.createObjectURL(file)
        // If setting a blob URL, we won't persist it (localStorage can't store blobs reliably)
        setCustomBackground(blobUrl)
      } catch (err) {
        console.error('Failed to create blob URL for image', err)
        setUploadError('Failed to process image. Please try a smaller file.')
      } finally {
        setUploading(false)
      }
      return
    }

    // Smaller files: read as data URL and persist where possible
    setUploading(true)
    const reader = new FileReader()
    reader.onload = () => {
      const url = reader.result
      try {
        setCustomBackground(url)
      } finally {
        setUploading(false)
      }
    }
    reader.onerror = () => {
      setUploadError('Failed to read file.')
      setUploading(false)
    }
    reader.readAsDataURL(file)
  }

  const sections = [
    { id: 'profile', icon: '👤', label: profile.full_name || 'Profile' },
    { id: 'wallpaper', icon: '🖼️', label: 'Wallpaper' },
    { id: 'about', icon: 'ℹ️', label: 'About' },
    { id: 'faq', icon: '❓', label: 'FAQ' }
  ]

  const handleMinimize = () => {
    setWindowState('minimized')
  }

  const handleMaximize = () => {
    setWindowState(prev => prev === 'maximized' ? 'normal' : 'maximized')
  }

  const getWindowClassName = () => {
    let className = 'settings-window glass-dark'
    if (windowState === 'maximized') className += ' maximized'
    if (windowState === 'minimized') className += ' minimized'
    return className
  }

  const handleTouchStart = (e) => {
    touchStartX.current = e.touches?.[0]?.clientX || 0
    touchDelta.current = 0
  }

  const handleTouchMove = (e) => {
    if (touchStartX.current == null) return
    const x = e.touches?.[0]?.clientX || 0
    touchDelta.current = x - touchStartX.current
  }

  const handleTouchEnd = () => {
    const delta = touchDelta.current || 0
    // Swipe right to close if distance > 80px
    if (delta > 80) setMobileView(null)
    touchStartX.current = null
    touchDelta.current = 0
  }

  if (windowState === 'minimized') {
    return (
      <div className="settings-minimized" onClick={() => setWindowState('normal')}>
        <span>⚙️</span>
        <span>Settings</span>
      </div>
    )
  }

  return (
    <div className="settings-overlay" onClick={onClose}>
      <div className={getWindowClassName()} onClick={e => e.stopPropagation()}>
        {/* Sidebar */}
        <div className="settings-sidebar">
          <div className="settings-sidebar-header">
            <div className="window-controls">
              <button className="window-btn close" onClick={onClose} title="Close">
                <span>×</span>
              </button>
              <button className="window-btn minimize" onClick={handleMinimize} title="Minimize">
                <span>−</span>
              </button>
              <button className="window-btn maximize" onClick={handleMaximize} title={windowState === 'maximized' ? 'Restore' : 'Maximize'}>
                <span>+</span>
              </button>
            </div>
            <h2>Settings</h2>
          </div>
          <nav className="settings-nav">
            {sections.map(section => (
              <button
                key={section.id}
                className={`settings-nav-item ${activeSection === section.id ? 'active' : ''}`}
                onClick={() => setActiveSection(section.id)}
              >
                <span className="nav-icon">{section.icon}</span>
                <span className="nav-label">{section.label}</span>
              </button>
            ))}
          </nav>
        </div>

        {/* Main Content */}
        <div className="settings-main">
          <div className="settings-main-header">
            <button className="mobile-back-btn" onClick={onClose} aria-label="Back">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M15 18l-6-6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <span className="mobile-back-text">Back</span>
            </button>
            <h3>{sections.find(s => s.id === activeSection)?.label}</h3>
          </div>

          {/* Global hidden file input - available for mobile and desktop uploads */}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden-file-input"
            onChange={handleFileChange}
          />

          <div className="settings-main-content">
            {/* Mobile-first view (iOS-style) */}
            <div className="mobile-only">
              {!mobileView ? (
                <>
                  <div className="mobile-header">Settings</div>

                  <div className="mobile-group">
                    <SettingRow
                      icon={<span className="avatar-initials">{getInitials()}</span>}
                      title={profile.full_name || 'Set up your profile'}
                      subtitle={user?.email || profile.email}
                      onClick={() => setMobileView('profile')}
                    />
                  </div>

                  <div className="mobile-group">
                    <SettingRow
                      icon={<span>🖼️</span>}
                      title="Wallpaper"
                      subtitle="Choose a wallpaper for your desktop"
                      onClick={() => setMobileView('wallpaper')}
                    />
                    <SettingRow
                      icon={<span>ℹ️</span>}
                      title="About"
                      onClick={() => setMobileView('about')}
                    />
                    <SettingRow
                      icon={<span>❓</span>}
                      title="FAQ"
                      onClick={() => setMobileView('faq')}
                    />
                    <SettingRow
                      icon={<span>🚪</span>}
                      title="Sign Out"
                      onClick={handleSignOut}
                      danger
                    />
                   </div>
                </>
              ) : (
                <div className="mobile-subview" onTouchStart={handleTouchStart} onTouchMove={handleTouchMove} onTouchEnd={handleTouchEnd}>
                  <div className="settings-main-header">
                    <button className="mobile-back-btn" onClick={() => setMobileView(null)} aria-label="Back">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M15 18l-6-6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </button>
                    <h3 style={{ marginLeft: 8 }}>{sections.find(s => s.id === mobileView)?.label || ''}</h3>
                   </div>
                   <div style={{ paddingTop: 12 }}>
                    {mobileView === 'profile' && (
                      <div className="profile-section">
                        {/* Reuse the desktop profile form content inside mobile subview */}
                        {/* ...re-use the same form markup... */}
                        <div className="profile-card">
                          <div className="profile-avatar">
                            {profile.avatar ? (
                              <img src={profile.avatar} alt={profile.full_name} />
                            ) : (
                              <span className="avatar-initials">{getInitials()}</span>
                            )}
                          </div>
                          <div className="profile-card-info">
                            <div className="profile-card-info-inner">
                              <h4>{profile.full_name || 'Set up your profile'}</h4>
                              <p>{user?.email || profile.email || 'Add your academic details'}</p>
                              {profile.semester && (
                                <span className="profile-badge">{profile.semester}</span>
                              )}
                              <div className="profile-actions">
                                {/* Removed Wallpaper button - accessible from main navigation */}
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="profile-form">
                          <div className="form-group">
                            <label htmlFor="mobile_full_name">Full Name</label>
                            <input
                              type="text"
                              id="mobile_full_name"
                              name="full_name"
                              placeholder="Enter your name"
                              value={formData.full_name}
                              onChange={handleInputChange}
                            />
                          </div>
                          <div className="form-group">
                            <label htmlFor="mobile_semester">Current Semester</label>
                            <select id="mobile_semester" name="semester" value={formData.semester} onChange={handleInputChange}>
                              <option value="">Select Semester</option>
                              {semesters.map(sem => (
                                <option key={sem} value={sem}>{sem}</option>
                              ))}
                            </select>
                          </div>
                          <div className="form-group">
                            <label htmlFor="mobile_college">College</label>
                            <select id="mobile_college" name="college" value={formData.college} onChange={handleInputChange}>
                              <option value="">Select College</option>
                              {COLLEGES.map(c => (
                                <option key={c.value} value={c.value}>{c.label}</option>
                              ))}
                            </select>
                          </div>
                          <button className="btn-save-profile" onClick={handleSaveProfile}>
                            Save
                          </button>
                          {saveError && <div style={{ color: 'red', marginTop: 8 }}>{saveError}</div>}
                          {/* Removed Change Wallpaper button - accessible from main navigation */}
                        </div>
                      </div>
                    )}
                    {mobileView === 'wallpaper' && (
                      <div className="wallpaper-section">
                        <p className="section-description">Choose a wallpaper for your desktop</p>
                        <div className="background-grid">
                          {backgrounds.map(bg => (
                            <div
                              key={bg.id}
                              className={`background-option ${currentBg.id === bg.id ? 'active' : ''}`}
                              style={{ background: bg.value }}
                              onClick={() => changeBackground(bg.id)}
                            >
                              <span className="bg-name">{bg.name}</span>
                              {currentBg.id === bg.id && <span className="bg-check">✓</span>}
                            </div>
                          ))}
                        </div>
                        <div className="custom-bg-section">
                          <div
                            className={`custom-bg-dropzone ${dropActive ? 'active' : ''}`}
                            onDragOver={handleDragOver}
                            onDrop={handleDrop}
                            onDragEnter={() => setDropActive(true)}
                            onDragLeave={() => setDropActive(false)}
                            onClick={handleUploadClick}
                          >
                            {customBg ? (
                              <div className="custom-bg-preview" style={{ backgroundImage: `url(${customBg})` }}>
                                <div className="custom-bg-badge">Custom</div>
                              </div>
                            ) : (
                              <div className="custom-bg-placeholder">Drag & drop an image here or click to browse</div>
                            )}
                          </div>
                          <div className="custom-bg-actions">
                            {!customBg ? (
                              <button className="btn-save-profile" onClick={handleUploadClick} disabled={uploading} style={{ marginTop: 12 }}>
                                {uploading ? 'Uploading...' : 'Upload custom background'}
                              </button>
                            ) : (
                              <button className="btn-save-profile" onClick={() => removeCustomBackground()} style={{ marginTop: 12, background: '#ff3b30' }}>
                                Remove custom background
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    )}
                    {mobileView === 'about' && (
                      <div className="about-section">
                        <div className="about-app-icon">
                          <picture>
                            <source srcSet="/white.svg" media="(prefers-color-scheme: dark)" />
                            <img src="/black.svg" alt="StudyMate logo" className="about-app-icon-img" />
                          </picture>
                        </div>
                        <h4>StudyMate</h4>
                        <p className="about-version">Version 1.0.0</p>
                        <div className="about-details">
                          <p>Your study companion — organized notes, past papers, and semester-wise resources for PU students.</p>
                          <p>Discover curated materials and helpful guides to support your learning across all semesters.</p>
                        </div>
                      </div>
                    )}
                    {mobileView === 'faq' && (
                      <div className="settings-faq-section">
                        <h4>Frequently Asked Questions</h4>
                        <p className="section-description">Quick answers to common questions about StudyMate.</p>
                        <div className="settings-faq-search">
                          <input type="search" placeholder="Search FAQs..." value={faqSearch} onChange={(e) => setFaqSearch(e.target.value)} />
                        </div>
                        <div className="settings-faq-list">
                          {settingsFaqs.filter(f => (f.question + ' ' + f.answer).toLowerCase().includes(faqSearch.toLowerCase())).map(f => (
                            <div className="settings-faq-item" key={f.id}>
                              <button className="settings-faq-question" onClick={() => toggleFaq(f.id)} aria-expanded={openFaq === f.id} aria-controls={`settings-faq-answer-${f.id}`}>
                                <span>{f.question}</span>
                                <span className="settings-faq-toggle">{openFaq === f.id ? '−' : '+'}</span>
                              </button>
                              {openFaq === f.id && <div id={`settings-faq-answer-${f.id}`} className="settings-faq-answer" role="region">{f.answer}</div>}
                            </div>
                          ))}
                        </div>
                        <div className="settings-faq-footer" style={{ marginTop: 12 }}>
                          <button className="settings-faq-link" onClick={() => { onClose(); navigate('/faq') }}>Open full FAQ</button>
                        </div>
                      </div>
                    )}
                   </div>
                </div>
              )}
            </div>

            {/* Desktop-only sections (hidden on mobile) */}
            <div className="desktop-only">
            {/* Profile Section */}
            {activeSection === 'profile' && (
              <div className="profile-section">
                 {/* Profile Card - Like iCloud */}
                 <div className="profile-card">
                   <div className="profile-avatar">
                     {profile.avatar ? (
                       <img src={profile.avatar} alt={profile.full_name} />
                     ) : (
                       <span className="avatar-initials">{getInitials()}</span>
                     )}
                   </div>
                   <div className="profile-card-info">
                     <div className="profile-card-info-inner">
                       <h4>{profile.full_name || 'Set up your profile'}</h4>
                       <p>{user?.email || profile.email || 'Add your academic details'}</p>
                       {profile.semester && (
                         <span className="profile-badge">{profile.semester}</span>
                       )}
                     </div>
                   </div>
                 </div>

                 {/* Profile Form */}
                 <div className="profile-form">
                   {profileError && (
                     <div style={{ color: 'red', marginBottom: 12 }}>
                       {profileError}
                     </div>
                   )}

                  {/* Edit header so users know this section is editable */}
                  <div className="profile-edit-header">
                    <span className="profile-edit-icon" aria-hidden>✏️</span>
                    <div className="profile-edit-text">
                      <div className="profile-edit-title">Edit</div>
                      <div className="profile-edit-desc">Update your profile information below:</div>
                    </div>
                  </div>

                  <div className="form-group">
                    <label htmlFor="full_name">Full Name</label>
                    <input
                      type="text"
                      id="full_name"
                      name="full_name"
                      placeholder="Enter your name"
                      value={formData.full_name}
                      onChange={handleInputChange}
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="semester">Current Semester</label>
                    <select
                      id="semester"
                      name="semester"
                      value={formData.semester}
                      onChange={handleInputChange}
                    >
                      <option value="">Select Semester</option>
                      {semesters.map(sem => (
                        <option key={sem} value={sem}>{sem}</option>
                      ))}
                    </select>
                  </div>

                  <div className="form-group">
                    <label htmlFor="college">College</label>
                    <select
                      id="college"
                      name="college"
                      value={formData.college}
                      onChange={handleInputChange}
                    >
                      <option value="">Select College</option>
                      {COLLEGES.map(c => (
                        <option key={c.value} value={c.value}>{c.label}</option>
                      ))}
                    </select>
                  </div>

                  <div className="form-group">
                    <label htmlFor="faculty">Faculty</label>
                    <input
                      type="text"
                      id="faculty"
                      name="faculty"
                      value={formData.faculty}
                      disabled
                      style={{ cursor: 'not-allowed' }}
                    />
                  </div>

                   <div className="form-group">
                     <label htmlFor="university">University</label>
                     <input
                       type="text"
                       id="university"
                       name="university"
                       value={formData.university}
                       disabled
                       style={{ cursor: 'not-allowed' }}
                     />
                   </div>

                  <button className="btn-save-profile" onClick={handleSaveProfile}>
                    Save Profile
                  </button>
                  {saveError && <div style={{ color: 'red', marginTop: 8 }}>{saveError}</div>}
                </div>

                {/* Account Section */}
                {isAuthenticated && (
                  <div className="account-section">
                    <h4>Account</h4>
                    <div className="account-info">
                      <p>Signed in as <strong>{user?.email}</strong></p>
                      <button className="btn-signout" onClick={handleSignOut}>
                        Sign Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Wallpaper Section */}
            {activeSection === 'wallpaper' && (
              <div className="wallpaper-section">
                <p className="section-description">Choose a wallpaper for your desktop</p>
                <div className="background-grid">
                  {backgrounds.map(bg => (
                    <div
                      key={bg.id}
                      className={`background-option ${currentBg.id === bg.id ? 'active' : ''}`}
                      style={{ background: bg.value }}
                      onClick={() => changeBackground(bg.id)}
                    >
                      <span className="bg-name">{bg.name}</span>
                      {currentBg.id === bg.id && <span className="bg-check">✓</span>}
                    </div>
                  ))}
                </div>

                {/* Custom Background Upload */}
                <div className="custom-bg-section">
                  <p className="section-description" style={{ marginTop: 18 }}>Or upload your own background</p>

                  <div
                    className={`custom-bg-dropzone ${dropActive ? 'active' : ''}`}
                    onDragOver={handleDragOver}
                    onDrop={handleDrop}
                    onDragEnter={() => setDropActive(true)}
                    onDragLeave={() => setDropActive(false)}
                    onClick={handleUploadClick}
                  >
                    {customBg ? (
                      <div className="custom-bg-preview" style={{ backgroundImage: `url(${customBg})` }}>
                        <div className="custom-bg-badge">Custom</div>
                      </div>
                    ) : (
                      <div className="custom-bg-placeholder">Drag & drop an image here or click to browse</div>
                    )}
                  </div>

                  {uploadError && <div className="upload-error">{uploadError}</div>}

                  <div className="custom-bg-actions">
                    {!customBg ? (
                      <button className="btn-save-profile" onClick={handleUploadClick} disabled={uploading} style={{ marginTop: 12 }}>
                        {uploading ? 'Uploading...' : 'Upload custom background'}
                      </button>
                    ) : (
                      <div style={{ display: 'flex', gap: 8 }}>
                        <button className="btn-save-profile" onClick={() => removeCustomBackground()} style={{ marginTop: 12, background: '#ff3b30' }}>
                          Remove custom background
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* About Section */}
            {activeSection === 'about' && (
              <div className="about-section">
                <div className="about-app-icon">
                  <picture>
                    <source srcSet="/white.svg" media="(prefers-color-scheme: dark)" />
                    <img src="/black.svg" alt="StudyMate logo" className="about-app-icon-img" />
                  </picture>
                </div>
                <h4>StudyMate</h4>
                <p className="about-version">Version 1.0.0</p>
                <div className="about-details">
                  <p>Your study companion — organized notes, past papers, and semester-wise resources for PU students.</p>
                  <p>Discover curated materials and helpful guides to support your learning across all semesters.</p>
                </div>
                <div className="about-credits">
                  <p>Built with React + Vite</p>
                  <p>© 2025 StudyMate</p>
                </div>
              </div>
            )}
            {/* FAQ Section (desktop) */}
            {activeSection === 'faq' && (
              <div className="settings-faq-section">
                <h4>Frequently Asked Questions</h4>
                <p className="section-description">Quick answers to common questions about StudyMate.</p>
                <div className="settings-faq-search" style={{ marginTop: 12, marginBottom: 12 }}>
                  <input type="search" placeholder="Search FAQs..." value={faqSearch} onChange={(e) => setFaqSearch(e.target.value)} />
                </div>
                <div className="settings-faq-list">
                  {settingsFaqs.filter(f => (f.question + ' ' + f.answer).toLowerCase().includes(faqSearch.toLowerCase())).map(f => (
                    <div className="settings-faq-item" key={f.id}>
                      <button className="settings-faq-question" onClick={() => toggleFaq(f.id)} aria-expanded={openFaq === f.id} aria-controls={`settings-faq-answer-${f.id}`}>
                        <span>{f.question}</span>
                        <span className="settings-faq-toggle">{openFaq === f.id ? '−' : '+'}</span>
                      </button>
                      {openFaq === f.id && <div id={`settings-faq-answer-${f.id}`} className="settings-faq-answer" role="region">{f.answer}</div>}
                    </div>
                  ))}
                </div>
                <div className="settings-faq-footer" style={{ marginTop: 12 }}>
                  <button className="settings-faq-link" onClick={() => { onClose(); navigate('/faq') }}>Open full FAQ</button>
                </div>
              </div>
            )}
            </div> {/* end .desktop-only */}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Settings
