import { useState, useEffect } from 'react';
import { API_URL } from '../../api/backend';
import {
  User, Mail, Building2, GraduationCap, BookOpen,
  ShieldCheck, Edit3, Save, X, CheckCircle, Award, Users
} from 'lucide-react';

export default function Profile() {
  const [user, setUser]         = useState({});
  const [liveData, setLiveData] = useState(null);
  const [courses, setCourses]   = useState([]);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [editing, setEditing]   = useState(false);
  const [msg, setMsg]           = useState('');
  const [loading, setLoading]   = useState(true);

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem('user') || '{}');
    setUser(stored);
    setUsername(stored.username || '');

    if (stored._id) {
      // Fetch live instructor profile from backend using the unified user endpoint
      fetch(`${API_URL}/users/instructor/${stored._id}`)
        .then(r => r.json())
        .then(data => { 
          if (data && !data.error) {
            setLiveData(data); 
          } else {
            setLiveData(stored);
          }
          setLoading(false); 
        })
        .catch(() => { setLiveData(stored); setLoading(false); });

      // Fetch courses assigned to this instructor
      fetch(`${API_URL}/courses?instructorId=${stored._id}`)
        .then(r => r.json())
        .then(data => setCourses(Array.isArray(data) ? data : []))
        .catch(() => setCourses([]));
    } else {
      setLiveData(stored);
      setLoading(false);
    }
  }, []);

  const profile = liveData || user;

  const handleUpdate = async () => {
    try {
      const res = await fetch(`${API_URL}/users/instructor/${profile._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, ...(password ? { password } : {}) })
      });
      if (res.ok) {
        setMsg('Profile updated successfully!');
        const updated = { ...profile, username };
        setLiveData(updated);
        localStorage.setItem('user', JSON.stringify(updated));
        setPassword('');
        setEditing(false);
        setTimeout(() => setMsg(''), 3000);
      } else {
        setMsg('Failed to update. Please try again.');
      }
    } catch (e) {
      setMsg('Update failed. Check your connection.');
    }
  };

  const activeCourses   = courses.filter(c => c.status === 'Active');
  const pendingCourses  = courses.filter(c => c.status === 'Pending');
  const totalEnrolled   = activeCourses.reduce((sum, c) => sum + (c.enrolled || 0), 0);

  const InfoRow = ({ icon: Icon, label, value }) => (
    <div style={{ display: 'flex', alignItems: 'center', gap: '14px', padding: '14px 0', borderBottom: '1px solid #f1f5f9' }}>
      <div style={{ width: '38px', height: '38px', borderRadius: '10px', background: '#eff6ff', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
        <Icon size={18} color="#2563eb" />
      </div>
      <div>
        <p style={{ margin: 0, fontSize: '11px', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{label}</p>
        <p style={{ margin: '2px 0 0 0', fontSize: '15px', fontWeight: 700, color: '#0f172a' }}>{value || '—'}</p>
      </div>
    </div>
  );

  const StatCard = ({ label, value, color, bg }) => (
    <div style={{ background: bg, borderRadius: '16px', padding: '20px', textAlign: 'center' }}>
      <p style={{ margin: 0, fontSize: '32px', fontWeight: 900, color }}>{value}</p>
      <p style={{ margin: '4px 0 0', fontSize: '12px', fontWeight: 700, color: '#64748b' }}>{label}</p>
    </div>
  );

  return (
    <div style={{ padding: '0 0 40px', maxWidth: '1100px' }}>
      {/* Header Banner */}
      <div style={{
        background: 'linear-gradient(135deg, #1e40af 0%, #3b82f6 100%)',
        borderRadius: '24px',
        padding: '32px',
        marginBottom: '28px',
        display: 'flex',
        alignItems: 'center',
        gap: '24px',
        flexWrap: 'wrap',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Decorative circle */}
        <div style={{ position: 'absolute', right: '-40px', top: '-40px', width: '200px', height: '200px', borderRadius: '50%', background: 'rgba(255,255,255,0.06)' }} />
        
        <div style={{ width: '88px', height: '88px', borderRadius: '50%', background: 'rgba(255,255,255,0.2)', backdropFilter: 'blur(10px)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '32px', fontWeight: 900, color: '#fff', border: '3px solid rgba(255,255,255,0.3)', flexShrink: 0 }}>
          {(profile.username || 'F').substring(0, 2).toUpperCase()}
        </div>

        <div style={{ flex: 1 }}>
          <h2 style={{ margin: 0, fontSize: '26px', fontWeight: 900, color: '#fff', letterSpacing: '-0.5px' }}>
            {loading ? 'Loading...' : (profile.username || 'Faculty Member')}
          </h2>
          <p style={{ margin: '4px 0 0', color: 'rgba(255,255,255,0.8)', fontSize: '14px', fontWeight: 600 }}>
            {profile.dept ? `${profile.dept} Department` : 'Faculty'} • Lead Instructor
          </p>
          {profile.email && (
            <p style={{ margin: '6px 0 0', color: 'rgba(255,255,255,0.65)', fontSize: '13px' }}>{profile.email}</p>
          )}
        </div>

        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            onClick={() => setEditing(!editing)}
            style={{ background: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.3)', color: '#fff', padding: '10px 18px', borderRadius: '12px', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px' }}
          >
            {editing ? <X size={16} /> : <Edit3 size={16} />}
            {editing ? 'Cancel' : 'Edit Profile'}
          </button>
        </div>
      </div>

      {/* Success message */}
      {msg && (
        <div style={{ background: msg.includes('success') ? '#ecfdf5' : '#fee2e2', border: `1px solid ${msg.includes('success') ? '#10b981' : '#ef4444'}`, color: msg.includes('success') ? '#065f46' : '#991b1b', padding: '12px 20px', borderRadius: '12px', fontWeight: 700, fontSize: '14px', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <CheckCircle size={16} />
          {msg}
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>

        {/* --- Left: Faculty Details --- */}
        <div style={{ background: '#fff', borderRadius: '20px', padding: '28px', border: '1px solid #e2e8f0', boxShadow: '0 1px 3px rgba(0,0,0,0.06)' }}>
          <h3 style={{ margin: '0 0 4px', fontSize: '17px', fontWeight: 800, color: '#0f172a' }}>Faculty Details</h3>
          <p style={{ margin: '0 0 20px', fontSize: '13px', color: '#94a3b8', fontWeight: 600 }}>Institutional profile fetched from database</p>

          <InfoRow icon={User}         label="Full Name"      value={profile.username} />
          <InfoRow icon={Mail}         label="Email"          value={profile.email} />
          <InfoRow icon={Building2}    label="Department"     value={profile.dept} />
          <InfoRow icon={GraduationCap} label="Role"         value={profile.roleName || 'Lead Instructor'} />
          <InfoRow icon={ShieldCheck}  label="Account ID"    value={profile._id} />
        </div>

        {/* --- Right: Stats + Course List --- */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>

          {/* Stats */}
          <div style={{ background: '#fff', borderRadius: '20px', padding: '28px', border: '1px solid #e2e8f0', boxShadow: '0 1px 3px rgba(0,0,0,0.06)' }}>
            <h3 style={{ margin: '0 0 16px', fontSize: '17px', fontWeight: 800, color: '#0f172a' }}>Academic Overview</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px' }}>
              <StatCard label="Active Courses"   value={activeCourses.length}  color="#2563eb" bg="#eff6ff" />
              <StatCard label="Pending Approval" value={pendingCourses.length} color="#f59e0b" bg="#fffbeb" />
              <StatCard label="Total Enrolled"   value={totalEnrolled}         color="#10b981" bg="#ecfdf5" />
            </div>
          </div>

          {/* My Courses */}
          <div style={{ background: '#fff', borderRadius: '20px', padding: '28px', border: '1px solid #e2e8f0', boxShadow: '0 1px 3px rgba(0,0,0,0.06)' }}>
            <h3 style={{ margin: '0 0 16px', fontSize: '17px', fontWeight: 800, color: '#0f172a' }}>My Courses</h3>
            {courses.length === 0 ? (
              <p style={{ color: '#94a3b8', fontSize: '14px', fontWeight: 600, textAlign: 'center', padding: '20px 0' }}>No courses submitted yet.</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxHeight: '260px', overflowY: 'auto' }}>
                {courses.map(c => (
                  <div key={c._id} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px', background: '#f8fafc', borderRadius: '12px' }}>
                    <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: c.status === 'Active' ? '#ecfdf5' : '#fffbeb', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <BookOpen size={16} color={c.status === 'Active' ? '#10b981' : '#f59e0b'} />
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p style={{ margin: 0, fontWeight: 700, fontSize: '13px', color: '#0f172a', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{c.title}</p>
                      <p style={{ margin: '2px 0 0', fontSize: '11px', color: '#94a3b8', fontWeight: 600 }}>{c.dept} • {c.targetYear || 'All Years'}</p>
                    </div>
                    <span style={{ fontSize: '11px', fontWeight: 800, padding: '3px 10px', borderRadius: '100px', background: c.status === 'Active' ? '#ecfdf5' : '#fffbeb', color: c.status === 'Active' ? '#10b981' : '#f59e0b', flexShrink: 0 }}>
                      {c.status}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Edit Form */}
      {editing && (
        <div style={{ background: '#fff', borderRadius: '20px', padding: '28px', border: '1px solid #e2e8f0', boxShadow: '0 1px 3px rgba(0,0,0,0.06)', marginTop: '24px' }}>
          <h3 style={{ margin: '0 0 20px', fontSize: '17px', fontWeight: 800, color: '#0f172a' }}>Update Profile</h3>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 800, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '8px' }}>Username</label>
              <input
                type="text"
                value={username}
                onChange={e => setUsername(e.target.value)}
                style={{ width: '100%', padding: '12px 16px', borderRadius: '12px', border: '1px solid #e2e8f0', fontSize: '14px', fontWeight: 600, boxSizing: 'border-box' }}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 800, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '8px' }}>New Password</label>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="Leave blank to keep unchanged"
                style={{ width: '100%', padding: '12px 16px', borderRadius: '12px', border: '1px solid #e2e8f0', fontSize: '14px', fontWeight: 600, boxSizing: 'border-box' }}
              />
            </div>
          </div>

          <div style={{ display: 'flex', gap: '12px', marginTop: '24px' }}>
            <button
              onClick={handleUpdate}
              style={{ background: '#2563eb', color: '#fff', border: 'none', padding: '12px 28px', borderRadius: '12px', fontWeight: 800, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px' }}
            >
              <Save size={16} />
              Save Changes
            </button>
            <button
              onClick={() => setEditing(false)}
              style={{ background: '#f1f5f9', color: '#0f172a', border: 'none', padding: '12px 28px', borderRadius: '12px', fontWeight: 800, cursor: 'pointer', fontSize: '14px' }}
            >
              Discard
            </button>
          </div>
        </div>
      )}

      {/* Mobile responsive fix */}
      <style>{`
        @media (max-width: 768px) {
          div[style*="grid-template-columns: 1fr 1fr"] {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
}
