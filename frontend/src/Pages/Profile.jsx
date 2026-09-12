import { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from '../components/Navbar';

function Profile() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [bio, setBio] = useState('');
  const [createdAt, setCreatedAt] = useState('');
  const [totalAnalyses, setTotalAnalyses] = useState(0);
  const [avgScore, setAvgScore] = useState(0);
  const [message, setMessage] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
const [newPassword, setNewPassword] = useState('');
const [passwordMessage, setPasswordMessage] = useState('');
  useEffect(() => {
    fetchProfile();
    fetchStats();
  }, []);

  const fetchProfile = async () => {
    const token = localStorage.getItem('token');
    const response = await axios.get('https://gitpolish-backend.onrender.com/api/profile', {
      headers: { Authorization: `Bearer ${token}` }
    });
    setName(response.data.name);
    setEmail(response.data.email);
    setBio(response.data.bio || '');
    setCreatedAt(response.data.createdAt);
  };

  const fetchStats = async () => {
    const token = localStorage.getItem('token');
    const response = await axios.get('https://gitpolish-backend.onrender.com/api/history', {
      headers: { Authorization: `Bearer ${token}` }
    });
    const history = response.data;
    setTotalAnalyses(history.length);
    if (history.length > 0) {
      const avg = history.reduce((sum, item) => sum + item.codeReview.overallScore, 0) / history.length;
      setAvgScore(avg.toFixed(1));
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setMessage('');
    try {
      const token = localStorage.getItem('token');
      const response = await axios.put(
        'https://gitpolish-backend.onrender.com/api/profile',
        { name, bio },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      localStorage.setItem('userName', response.data.name);
      setMessage('✅ Profile updated successfully!');
    } catch (error) {
      setMessage('❌ Update fail ho gaya');
    }
  };
  const handlePasswordChange = async (e) => {
  e.preventDefault();
  setPasswordMessage('');
  try {
    const token = localStorage.getItem('token');
    await axios.put(
      'https://gitpolish-backend.onrender.com/api/change-password',
      { currentPassword, newPassword },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    setPasswordMessage('✅ Password changed successfully!');
    setCurrentPassword('');
    setNewPassword('');
  } catch (error) {
    setPasswordMessage('❌ ' + (error.response?.data?.error || 'Password change fail ho gaya'));
  }
};

  return (
    <div>
      <Navbar />
      <div className="container">
        <div className="profile-header">
          
  <img 
  src={`https://api.dicebear.com/7.x/initials/svg?seed=${name || 'U'}&backgroundColor=6c5ce7`}
  alt="avatar"
  className="profile-avatar-img"
/>
          <div>
            <h2 style={{ marginBottom: '4px' }}>{name}</h2>
            <p style={{ color: '#636e72', fontSize: '14px' }}>{email}</p>
          </div>
        </div>

        <div className="stats-row">
          <div className="stat-box">
            <div className="stat-number">{totalAnalyses}</div>
            <div className="stat-label">Total Analyses</div>
          </div>
          <div className="stat-box">
            <div className="stat-number">{avgScore || '-'}</div>
            <div className="stat-label">Avg Code Score</div>
          </div>
          <div className="stat-box">
            <div className="stat-number">
              {createdAt ? new Date(createdAt).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) : '-'}
            </div>
            <div className="stat-label">Member Since</div>
          </div>
        </div>

        <h3>Edit Profile</h3>
        {message && <p className={message.includes('✅') ? 'success-text' : 'error-text'}>{message}</p>}
        
        <form onSubmit={handleUpdate}>
          <label>Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <label>Bio</label>
          <input
            type="text"
            placeholder="Tell us about yourself..."
            value={bio}
            onChange={(e) => setBio(e.target.value)}
          />
          
          <label>Email (cannot be changed)</label>
          <input type="email" value={email} disabled />
          
          <button type="submit">Update Profile</button>
        </form>
        <h3>Change Password</h3>
{passwordMessage && <p className={passwordMessage.includes('✅') ? 'success-text' : 'error-text'}>{passwordMessage}</p>}

<form onSubmit={handlePasswordChange}>
  <label>Current Password</label>
  <input
    type="password"
    value={currentPassword}
    onChange={(e) => setCurrentPassword(e.target.value)}
  />

  <label>New Password</label>
  <input
    type="password"
    value={newPassword}
    onChange={(e) => setNewPassword(e.target.value)}
  />

  <button type="submit">Change Password</button>
</form>
      </div>
    </div>
  );
}

export default Profile;