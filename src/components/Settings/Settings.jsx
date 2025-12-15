import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useBackground } from '../../context/BackgroundContext'
import { useUserProfile } from '../../hooks/useUserProfile'
import { useAuth } from '../../context/AuthContext'
import './Settings.css'

const Settings = ({ onClose, initialSection = 'profile' }) => {
  const navigate = useNavigate()
  const { backgrounds, currentBg, changeBackground } = useBackground()
  const { profile, updateProfile, completeSetup, getInitials, error: profileError } = useUserProfile()
  const { user, signOut, isAuthenticated } = useAuth()
  const [activeSection, setActiveSection] = useState(initialSection)
  const [windowState, setWindowState] = useState('normal') // 'normal', 'maximized', 'minimized'
  const [formData, setFormData] = useState({
    full_name: profile.full_name || '',
    semester: profile.semester || '',
    faculty: profile.faculty || 'Computer Engineering',
    university: profile.university || 'Pokhara University'
  })

  const semesters = [
    '1st Semester', '2nd Semester', '3rd Semester', '4th Semester',
    '5th Semester', '6th Semester', '7th Semester', '8th Semester'
  ]

  const faculties = [
    'Computer Engineering',
  ]

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSaveProfile = () => {
    updateProfile(formData)
    completeSetup()
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

  const sections = [
    { id: 'profile', icon: '👤', label: profile.full_name || 'Profile' },
    { id: 'wallpaper', icon: '🖼️', label: 'Wallpaper' },
    { id: 'about', icon: 'ℹ️', label: 'About' }
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
                    <h4>{profile.full_name || 'Set up your profile'}</h4>
                    <p>{user?.email || profile.email || 'Add your academic details'}</p>
                    {profile.semester && (
                      <span className="profile-badge">{profile.semester}</span>
                    )}
                  </div>
                </div>

                {/* Profile Form */}
                <div className="profile-form">
                  {profileError && (
                    <div style={{ color: 'red', marginBottom: 12 }}>
                      {profileError}
                    </div>
                  )}
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
                    <select
                      id="faculty"
                      name="faculty"
                      value={formData.faculty}
                      onChange={handleInputChange}
                    >
                      {faculties.map(fac => (
                        <option key={fac} value={fac}>{fac}</option>
                      ))}
                    </select>
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
          </div>
        </div>
      </div>
    </div>
  )
}

export default Settings
