import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useBackground } from '../../context/BackgroundContext'
import { useUserProfile } from '../../hooks/useUserProfile'
import { useAuth } from '../../context/AuthContext'
import './Settings.css'

const Settings = ({ onClose, initialSection = 'profile' }) => {
  const navigate = useNavigate()
  const { backgrounds, currentBg, changeBackground, customBg, setCustomBackground, removeCustomBackground } = useBackground()
  const { profile, updateProfile, getInitials, error: profileError } = useUserProfile()
  const { user, signOut, isAuthenticated } = useAuth()
  const [activeSection, setActiveSection] = useState(initialSection)
  const [windowState, setWindowState] = useState('normal') // 'normal', 'maximized', 'minimized'
  const [formData, setFormData] = useState({
    full_name: profile.full_name || '',
    semester: profile.semester || '',
    faculty: profile.faculty || 'Computer Engineering',
    university: profile.university || 'Pokhara University'
  })
  const fileInputRef = useRef(null)
  const [uploadError, setUploadError] = useState('')
  const [uploading, setUploading] = useState(false)
  const [dropActive, setDropActive] = useState(false)

  // Keep local form state in sync with profile when it loads/changes
  useEffect(() => {
    setFormData({
      full_name: profile.full_name || '',
      semester: profile.semester || '',
      faculty: profile.faculty || 'Computer Engineering',
      university: profile.university || 'Pokhara University'
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

  const handleSaveProfile = () => {
    // Persist profile and mark setup as complete
    updateProfile({ ...formData, setupComplete: true })
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
    // Limit file size to 8MB
    if (file.size > 8 * 1024 * 1024) {
      setUploadError('Image is too large (max 8 MB).')
      return
    }
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
    { id: 'landing', icon: '🌐', label: 'Landing Page' }
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
            <h3>{sections.find(s => s.id === activeSection)?.label}</h3>
          </div>

          <div className="settings-main-content">
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
                      onChange={handleInputChange}
                      disabled
                    />
                  </div>

                  <button className="btn-save-profile" onClick={handleSaveProfile}>
                    Save Profile
                  </button>
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

                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    style={{ display: 'none' }}
                    onChange={handleFileChange}
                  />

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
                <div className="about-app-icon">📖</div>
                <h4>PU Notes</h4>
                <p className="about-version">Version 1.0.0</p>
                <div className="about-details">
                  <p>A macOS-inspired notes viewer for Pokhara University Computer Engineering students.</p>
                  <p>Access comprehensive study materials for all 8 semesters.</p>
                </div>
                <div className="about-credits">
                  <p>Built with React + Vite</p>
                  <p>© 2025 PU Notes</p>
                </div>
              </div>
            )}

            {/* Landing Page Section */}
            {activeSection === 'landing' && (
              <div className="landing-preview-section" style={{height: '100%', width: '100%'}}>
                <p className="section-description">Preview the public landing page below or open it in a new tab:</p>
                <button
                  className="btn-open-landing"
                  style={{ marginBottom: 16, padding: '8px 16px', borderRadius: 8, border: 'none', background: '#007aff', color: '#fff', fontWeight: 500, cursor: 'pointer' }}
                  onClick={() => window.open('/', '_blank')}
                >
                  Open Landing Page in New Tab
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Settings
