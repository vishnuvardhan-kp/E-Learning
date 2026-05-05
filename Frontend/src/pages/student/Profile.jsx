import { useState, useEffect } from 'react';
import { User, Mail, Shield, Hash, GraduationCap, Calendar, MapPin, Layers, Lock, Edit3, Save, CheckCircle } from 'lucide-react';
import { API_URL } from '../../api/backend';

export default function Profile(props) {
  const [user, setUser] = useState(props.user || {});
  const [username, setUsername] = useState(props.user?.username || '');
  const [password, setPassword] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [msg, setMsg] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (props.user) {
      setUser(props.user);
      setUsername(props.user.username || '');
    }
  }, [props.user]);

  const handleUpdate = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/users/student/${user._id}`, {
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
        setIsEditing(false);
        setTimeout(() => setMsg(''), 4000);
      } else {
        const data = await res.json();
        setMsg(data.error || 'Failed to update profile.');
      }
    } catch (e) {
      setMsg('Network error: Could not reach the server.');
    } finally {
      setLoading(false);
    }
  };

  const InfoCard = ({ icon: Icon, label, value, color }) => (
    <div className="profile-info-pill">
      <div className="pill-icon" style={{ background: color + '15', color: color }}>
        <Icon size={18} />
      </div>
      <div className="pill-content">
        <label>{label}</label>
        <span>{value || 'Not Assigned'}</span>
      </div>
    </div>
  );

  return (
    <div className="module-container">
      <style>{`
        .profile-grid { display: grid; grid-template-columns: 1fr 1.5fr; gap: 32px; align-items: start; }
        
        .profile-main-card {
          background: #fff; border-radius: 28px; padding: 40px;
          border: 1.5px solid var(--border-color); position: relative; overflow: hidden;
          box-shadow: var(--shadow-md);
        }
        .profile-main-card::before {
          content: ''; position: absolute; top: 0; left: 0; right: 0; height: 120px;
          background: linear-gradient(135deg, #4338ca 0%, #6366f1 100%); z-index: 0;
        }

        .profile-header { position: relative; z-index: 1; display: flex; flex-direction: column; align-items: center; text-align: center; margin-top: 40px; }
        .profile-avatar-large {
          width: 120px; height: 120px; border-radius: 40px;
          background: #fff; color: var(--student-primary);
          display: flex; align-items: center; justify-content: center;
          font-size: 48px; font-weight: 900;
          box-shadow: 0 12px 32px rgba(0,0,0,0.1); border: 4px solid #fff;
          margin-bottom: 20px;
        }
        .profile-name-group h2 { font-size: 28px; font-weight: 900; color: var(--text-main); margin: 0; letter-spacing: -1px; }
        .profile-name-group p { font-size: 14px; font-weight: 700; color: var(--student-primary); text-transform: uppercase; letter-spacing: 1px; margin-top: 4px; }

        .academic-overview {
          background: #f8fafc; border-radius: 24px; padding: 32px;
          border: 1.5px solid var(--border-color);
        }
        .overview-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 24px; }
        .overview-header h3 { font-size: 18px; font-weight: 800; color: var(--text-main); margin: 0; }
        
        .info-pill-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
        .profile-info-pill {
          background: #fff; padding: 16px; border-radius: 18px;
          border: 1px solid #eef2ff; display: flex; align-items: center; gap: 14px;
          transition: all 0.2s;
        }
        .profile-info-pill:hover { border-color: #c7d2fe; transform: translateY(-2px); }
        .pill-icon { width: 40px; height: 40px; border-radius: 12px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
        .pill-content label { display: block; font-size: 11px; font-weight: 800; color: #94a3b8; text-transform: uppercase; letter-spacing: 0.5px; }
        .pill-content span { font-size: 14px; font-weight: 700; color: var(--text-main); }

        .edit-form { margin-top: 32px; padding-top: 32px; border-top: 1.5px dashed #e2e8f0; }
        .form-group { margin-bottom: 20px; }
        .form-group label { display: block; font-size: 12px; font-weight: 800; color: #64748b; margin-bottom: 8px; text-transform: uppercase; }
        .form-input {
          width: 100%; padding: 14px 16px; border-radius: 14px; border: 1.5px solid #e2e8f0;
          font-size: 14px; font-weight: 600; transition: all 0.2s;
        }
        .form-input:focus { outline: none; border-color: var(--student-primary); box-shadow: 0 0 0 4px var(--student-primary-light); }

        .btn-update {
          width: 100%; padding: 16px; border-radius: 16px; background: var(--student-primary);
          color: #fff; border: none; font-weight: 800; cursor: pointer;
          display: flex; align-items: center; justify-content: center; gap: 10px; transition: all 0.2s;
        }
        .btn-update:hover { background: var(--student-primary-hover); transform: translateY(-2px); }
        .btn-update:disabled { opacity: 0.7; cursor: not-allowed; }

        @media (max-width: 900px) {
          .profile-grid { grid-template-columns: 1fr; }
        }
      `}</style>

      <div className="profile-grid">
        {/* Main Identity Card */}
        <div className="profile-main-card animate-fade-in">
          <div className="profile-header">
            <div className="profile-avatar-large">
              {user.username ? user.username.substring(0,2).toUpperCase() : 'VI'}
            </div>
            <div className="profile-name-group">
              <h2>{user.username}</h2>
              <p>Undergraduate Learner</p>
            </div>
          </div>

          <div className="edit-form">
            {!isEditing ? (
              <button className="btn-update" onClick={() => setIsEditing(true)}>
                <Edit3 size={18} />
                Edit Account Details
              </button>
            ) : (
              <div className="animate-fade-in">
                <div className="form-group">
                  <label>Display Username</label>
                  <input 
                    className="form-input" 
                    value={username} 
                    onChange={e => setUsername(e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label>Update Password</label>
                  <input 
                    type="password" 
                    className="form-input" 
                    placeholder="Enter new password"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                  />
                </div>
                <button className="btn-update" onClick={handleUpdate} disabled={loading}>
                  {loading ? <Save className="animate-spin" size={18} /> : <CheckCircle size={18} />}
                  {loading ? 'Saving Changes...' : 'Save Profile'}
                </button>
                <button 
                  style={{ width: '100%', marginTop: '12px', background: 'transparent', border: 'none', color: '#64748b', fontWeight: 700, cursor: 'pointer' }}
                  onClick={() => setIsEditing(false)}
                >
                  Cancel
                </button>
              </div>
            )}
            {msg && (
              <div style={{ marginTop: '16px', padding: '12px', borderRadius: '12px', background: msg.includes('success') ? '#f0fdf4' : '#fef2f2', color: msg.includes('success') ? '#16a34a' : '#ef4444', fontSize: '13px', fontWeight: 700, textAlign: 'center', border: '1px solid currentColor' }}>
                {msg}
              </div>
            )}
          </div>
        </div>

        {/* Academic Credentials Card */}
        <div className="academic-overview animate-fade-in" style={{ animationDelay: '0.1s' }}>
          <div className="overview-header">
            <h3>Institutional Credentials</h3>
            <Shield size={20} color="var(--student-primary)" />
          </div>

          <div className="info-pill-grid">
            <InfoCard icon={Hash} label="Roll Number" value={user.rollno} color="#6366f1" />
            <InfoCard icon={Mail} label="Institutional Email" value={user.email} color="#8b5cf6" />
            <InfoCard icon={MapPin} label="Academic Cluster" value={user.dept} color="#ec4899" />
            <InfoCard icon={Calendar} label="Current Year" value={user.year} color="#f59e0b" />
            <InfoCard icon={Layers} label="Assigned Section" value={user.section ? `Section ${user.section}` : null} color="#10b981" />
            <InfoCard icon={GraduationCap} label="Admission Batch" value={user.batch} color="#06b6d4" />
          </div>

          <div style={{ marginTop: '32px', padding: '24px', background: '#eff6ff', borderRadius: '18px', border: '1.5px solid #dbeafe' }}>
            <h4 style={{ margin: '0 0 8px 0', fontSize: '14px', fontWeight: 800, color: '#1e40af' }}>Security Note</h4>
            <p style={{ margin: 0, fontSize: '13px', color: '#3b82f6', lineHeight: 1.5, fontWeight: 500 }}>
              Institutional credentials (Roll No, Dept, Year) are managed by the administration. 
              If you notice any discrepancies, please contact the Registrar's office.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
