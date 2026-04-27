import React, { useState } from 'react';
import './Profile.css';

function Profile({ user, onBack, onUpdateProfile }) {
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(user?.name || '');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    if (!name.trim()) {
      setError('Name cannot be empty');
      return;
    }
    setLoading(true);
    try {
      await onUpdateProfile(name);
      setSuccess('Profile updated successfully!');
      setIsEditing(false);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="profile-container">
      <button className="back-button" onClick={onBack}>← Back</button>
      <div className="profile-content">
        <h1>👤 My Profile</h1>
        
        {error && <div className="error">{error}</div>}
        {success && <div className="success">{success}</div>}

        <div className="profile-card">
          <div className="profile-info">
            <div className="info-row">
              <span className="label">Name:</span>
              {isEditing ? (
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="edit-input"
                />
              ) : (
                <span className="value">{user?.name}</span>
              )}
            </div>
            <div className="info-row">
              <span className="label">Email:</span>
              <span className="value">{user?.email}</span>
            </div>
            <div className="info-row">
              <span className="label">Member Since:</span>
              <span className="value">{new Date().toLocaleDateString()}</span>
            </div>
          </div>

          <div className="profile-actions">
            {isEditing ? (
              <>
                <button onClick={handleSubmit} disabled={loading} className="save-btn">
                  {loading ? 'Saving...' : 'Save Changes'}
                </button>
                <button onClick={() => {
                  setIsEditing(false);
                  setName(user?.name);
                  setError('');
                }} className="cancel-btn">
                  Cancel
                </button>
              </>
            ) : (
              <button onClick={() => setIsEditing(true)} className="edit-btn">
                Edit Profile
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;
