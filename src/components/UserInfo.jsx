import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useUserProfile } from '../hooks/useUserProfile';
import { useAuth } from '../context/AuthContext';
import './UserInfo.css';

const UserInfo = () => {
  const { profile, updateProfile, loading } = useUserProfile();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    full_name: '',
    semester: '',
    faculty: 'Computer Engineering',
    university: 'Pokhara University',
  });
  const [error, setError] = useState('');

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
      });
    }
  }, [profile]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.full_name || !formData.semester) {
      setError('Please fill all required fields.');
      return;
    }
    
    try {
      await updateProfile({ ...formData, setupComplete: true });
      console.log('Profile updated successfully, navigating to home...');
      navigate('/home', { state: { profileJustCompleted: true } });
    } catch (err) {
      setError('Failed to save profile. Please try again.');
      console.error('Profile update error:', err);
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
            <button type="submit" className="auth-btn-primary" disabled={loading} style={{ marginTop: 18 }}>
              {loading ? 'Saving...' : 'Save & Continue'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default UserInfo;
