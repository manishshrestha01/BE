import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useUserProfile } from '../hooks/useUserProfile';
import { useAuth } from '../context/AuthContext';
import './UserInfo.css';
import { COLLEGES } from '../lib/colleges';

const UserInfo = () => {
  const { profile, updateProfile, loading } = useUserProfile();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    full_name: '',
    semester: '',
    faculty: 'Computer Engineering',
    university: 'Pokhara University',
    college: ''
  });
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  // Ensure auth pages set a light background while mounted
  useEffect(() => {
    document.body.classList.add('auth-theme')
    return () => {
      document.body.classList.remove('auth-theme')
    }
  }, [])

  // Update form data when profile loads
  useEffect(() => {
    if (profile) {
      setFormData({
        full_name: profile.full_name || '',
        semester: profile.semester || '',
        faculty: profile.faculty || 'Computer Engineering',
        university: profile.university || 'Pokhara University',
        college: profile.college || ''
      });
    }
  }, [profile]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.full_name || !formData.semester || !formData.college) {
      setError('Please fill all required fields.');
      return;
    }
    
    try {
      setSaving(true)
      // Ensure the selected college is valid to avoid sending malformed values
      const validCollege = COLLEGES.some(c => c.value === formData.college);
      if (!validCollege) {
        setError('Please select a valid college from the list.');
        setSaving(false)
        return;
      }

      const isComplete = Boolean(formData.full_name && formData.semester && formData.college);
      const updatedProfile = await updateProfile({ ...formData, setup_complete: isComplete });
      console.log('Profile update response:', updatedProfile);

      if (!updatedProfile) {
        setError('Failed to save profile. Please try again.');
        setSaving(false)
        return;
      }

      // Set a short-lived flag so refreshes shortly after saving do not redirect the user
      try {
        const expiry = Date.now() + 60 * 1000 // 60 seconds
        localStorage.setItem('profileJustCompletedUntil', String(expiry))
      } catch (e) {
        console.warn('Failed to set profileJustCompletedUntil in localStorage', e)
      }

      // Proceed to dashboard even if DB did not flip setupComplete (we have the latest values in-memory)
      console.log('Profile updated successfully, navigating to dashboard...');
      navigate('/dashboard', { state: { profileJustCompleted: true } });
    } catch (err) {
      const message = err?.message || err?.error?.message || JSON.stringify(err)
      setError(message || 'Failed to save profile. Please try again.')
      console.error('Profile update error:', err)
    } finally {
      setSaving(false)
    }
  };

  return (
    <div className="auth-page">
      {/* Navigation - Same as Login */}
      <nav className="auth-nav">
        <div className="auth-nav-container">
          <Link to="/" className="auth-nav-logo">
            <img src="/black.svg" alt="StudyMate Logo" style={{ height: 32 }} />
            <span className="auth-logo-text">StudyMate</span>
          </Link>
        </div>
      </nav>
      <div className="auth-content">
        <div className="auth-card">
          <h1 className="auth-title">Complete Your Profile</h1>
          {error && <div className="user-info-error">{error}</div>}
          <form className="auth-form" onSubmit={handleSubmit}>
            <label htmlFor="full_name" className="auth-label">Full Name</label>
            <input
              type="text"
              id="full_name"
              name="full_name"
              className="auth-input"
              placeholder="Enter your name"
              value={formData.full_name}
              onChange={handleChange}
              required
              autoComplete="name"
            />
            <label htmlFor="semester" className="auth-label">Current Semester</label>
            <select
              id="semester"
              name="semester"
              className="auth-input"
              value={formData.semester}
              onChange={handleChange}
              required
            >
              <option value="">Select Semester</option>
              <option value="1st Semester">1st Semester</option>
              <option value="2nd Semester">2nd Semester</option>
              <option value="3rd Semester">3rd Semester</option>
              <option value="4th Semester">4th Semester</option>
              <option value="5th Semester">5th Semester</option>
              <option value="6th Semester">6th Semester</option>
              <option value="7th Semester">7th Semester</option>
              <option value="8th Semester">8th Semester</option>
            </select>
            <label htmlFor="college" className="auth-label">College</label>
            <select
              id="college"
              name="college"
              className="auth-input"
              value={formData.college}
              onChange={handleChange}
              required
            >
              <option value="">Select College</option>
              {COLLEGES.map((c) => (
                <option key={c.value} value={c.value}>{c.label}</option>
              ))}
            </select>
            <label htmlFor="faculty" className="auth-label">Faculty</label>
            <input
              type="text"
              id="faculty"
              name="faculty"
              className="auth-input"
              value={formData.faculty}
              disabled
              style={{ cursor: 'not-allowed' }}
            />
            <label htmlFor="university" className="auth-label">University</label>
            <input
              type="text"
              id="university"
              name="university"
              className="auth-input"
              value={formData.university}
              disabled
              style={{ cursor: 'not-allowed' }}
            />
            <button type="submit" className="auth-btn-primary" disabled={loading || saving} style={{ marginTop: 18 }}>
              {loading || saving ? 'Saving...' : 'Save & Continue'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default UserInfo;
