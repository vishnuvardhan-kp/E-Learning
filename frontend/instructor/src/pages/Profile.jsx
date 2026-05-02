import { useState, useEffect } from 'react';

export default function Profile() {
  const [user, setUser] = useState({});
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [msg, setMsg] = useState('');

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem('user') || '{}');
    setUser(stored);
    setUsername(stored.username || '');
  }, []);

  const handleUpdate = async () => {
    try {
      const res = await fetch(`http://localhost:5000/users/${user.role}/${user._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });
      if (res.ok) {
        setMsg('Profile updated successfully!');
        const updatedUser = { ...user, username };
        setUser(updatedUser);
        localStorage.setItem('user', JSON.stringify(updatedUser));
        setPassword('');
      } else {
        setMsg('Failed to update.');
      }
    } catch (e) {
      setMsg('Failed to update.');
    }
  };

  return (
    <div>
      <h2 style={{ fontSize: '24px', marginBottom: '24px' }}>My Profile</h2>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(300px, 1fr) minmax(300px, 1fr)', gap: '24px' }}>
        <div className="card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '32px' }}>
            <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: 'linear-gradient(135deg, #2563eb, #3b82f6)', color: 'white', display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: '28px', fontWeight: 'bold', boxShadow: '0 4px 6px -1px rgba(37, 99, 235, 0.4)' }}>
              {user.username ? user.username.substring(0,2).toUpperCase() : 'U'}
            </div>
            <div>
              <h3 style={{ margin: 0, fontSize: '20px', letterSpacing: '-0.5px' }}>{user.username}</h3>
              <p style={{ margin: '4px 0 0 0', color: '#64748b', fontSize: '14px' }}>{user.role === 'student' ? 'Undergraduate Learner' : 'Faculty'}</p>
            </div>
          </div>
          
          <h4 style={{ marginBottom: '16px', color: '#0f172a', fontSize: '15px', borderBottom: '1px solid #e2e8f0', paddingBottom: '8px' }}>Personal Information</h4>
          
          <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 'bold', color: '#64748b', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Email Address</label>
              <p style={{ margin: 0, fontSize: '15px', color: '#0f172a', fontWeight: '500' }}>{user.email || 'N/A'}</p>
          </div>
          
          <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 'bold', color: '#64748b', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Username</label>
              <input type="text" value={username} onChange={e => setUsername(e.target.value)} style={{ padding: '8px', width: '100%', boxSizing: 'border-box', border: '1px solid #ccc', borderRadius: '4px' }} />
          </div>

          <div style={{ marginBottom: '24px' }}>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 'bold', color: '#64748b', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>New Password</label>
              <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Leave blank to keep unchanged" style={{ padding: '8px', width: '100%', boxSizing: 'border-box', border: '1px solid #ccc', borderRadius: '4px' }} />
          </div>

          <button onClick={handleUpdate} style={{ padding: '10px 20px', background: '#2563eb', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>Update Profile</button>
          {msg && <p style={{ color: msg.includes('success') ? 'green' : 'red', marginTop: '10px', fontSize: '14px' }}>{msg}</p>}
        </div>
      </div>
    </div>
  );
}
