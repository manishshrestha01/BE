import React, { useState } from 'react';
import './UploadNotes.css';

const semesters = [
  '1st Semester', '2nd Semester', '3rd Semester', '4th Semester',
  '5th Semester', '6th Semester', '7th Semester', '8th Semester'
];

const faculties = [
  'Computer Engineering',
];

const UploadNotes = () => {
  const [formData, setFormData] = useState({
    full_name: '',
    semester: '',
    faculty: faculties[0],
    file: null,
  });
  const [uploadStatus, setUploadStatus] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setUploadStatus('');
  };

  const handleFileChange = (e) => {
    setFormData(prev => ({ ...prev, file: e.target.files[0] }));
    setUploadStatus('');
  };

  const handleUpload = (e) => {
    e.preventDefault();
    if (!formData.full_name || !formData.semester || !formData.faculty || !formData.file) {
      setUploadStatus('Please fill all fields and select a file.');
      return;
    }
    setTimeout(() => {
      setUploadStatus('Notes uploaded successfully!');
      setFormData({ full_name: '', semester: '', faculty: faculties[0], file: null });
    }, 1000);
  };

  return (
    <div className="upload-notes-section">
      <div className="profile-card upload-card">
        <div className="profile-avatar upload-avatar">
          <span role="img" aria-label="Upload">⬆️</span>
        </div>
        <div className="profile-card-info" style={{ width: '100%' }}>
          <h4>Upload Notes</h4>
          <form onSubmit={handleUpload} className="profile-form" style={{ marginTop: 12 }}>
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
              <label htmlFor="semester">Semester</label>
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
              <label htmlFor="file">Select File</label>
              <input
                id="file"
                type="file"
                accept=".pdf,.doc,.docx"
                onChange={handleFileChange}
              />
            </div>
            <button type="submit">Upload</button>
            {uploadStatus && <p style={{ marginTop: 8 }}>{uploadStatus}</p>}
          </form>
        </div>
      </div>
    </div>
  );
};

export default UploadNotes;
