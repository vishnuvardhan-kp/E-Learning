import { useState, useEffect } from 'react';
import { Megaphone, AlertTriangle, Calendar, User, Globe, BellRing, Sparkles } from 'lucide-react';
import { API_URL } from '../../api/backend';

export default function Notifications() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const storedUser = JSON.parse(localStorage.getItem('user') || '{}');

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const res = await fetch(`${API_URL}/notifications?t=${Date.now()}`);
        const data = await res.json();
        
        // Institutional Filtering Logic
        const personalized = data.filter(n => {
          if (!n.target) return true; // Global
          if (n.target === "All Users") return true;
          
          const targets = n.target.toLowerCase();
          const userDept = (storedUser.dept || "").toLowerCase();
          const userYear = (storedUser.year || "").toLowerCase();

          const roleMatch = targets.includes("students") || targets.includes("all users");
          
          // If a specific dept is targeted, student must match it
          const deptMatch = !targets.includes(" - ") || 
                           targets.includes(userDept);
                           
          // If a specific year is targeted, student must match it
          const yearMatch = !targets.includes("year") || 
                           targets.includes(userYear);

          return roleMatch && deptMatch && yearMatch;
        });

        setNotifications(personalized);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchNotifications();
  }, []);

  return (
    <div className="module-container">
      <style>{`
        .notif-hero {
          background: linear-gradient(135deg, #1e1b4b 0%, #312e81 100%);
          border-radius: 24px; padding: 32px; color: #fff; margin-bottom: 24px;
          display: flex; align-items: center; justify-content: space-between;
          box-shadow: var(--shadow-lg); position: relative; overflow: hidden;
        }
        .notif-hero::after {
          content: ''; position: absolute; right: -20px; top: -20px;
          width: 120px; height: 120px; background: radial-gradient(circle, rgba(99,102,241,0.15) 0%, transparent 70%);
        }
        .notif-card {
          background: #fff; border-radius: 20px; padding: 16px 20px;
          border: 1px solid var(--border-color); margin-bottom: 12px;
          transition: all 0.3s; position: relative; display: flex; gap: 16px;
        }
        .notif-card:hover { transform: translateY(-2px); border-color: var(--student-primary); box-shadow: var(--shadow-sm); }
        .notif-card.urgent { border-left: 4px solid #ef4444; }
        .notif-card.global { border-left: 4px solid var(--student-primary); }
        
        .notif-icon-box {
          width: 44px; height: 44px; border-radius: 12px;
          display: flex; align-items: center; justify-content: center; flex-shrink: 0;
        }
        .notif-content { flex: 1; }
        .notif-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 4px; }
        .notif-title { font-size: 16px; font-weight: 800; color: var(--text-main); margin: 0; letter-spacing: -0.3px; }
        .notif-meta { display: flex; gap: 14px; margin-top: 8px; border-top: 1px solid #f1f5f9; padding-top: 8px; }
        .meta-item { display: flex; align-items: center; gap: 4px; font-size: 11px; font-weight: 700; color: #94a3b8; }
        .notif-body { font-size: 13.5px; color: #64748b; line-height: 1.5; margin-top: 4px; }
      `}</style>

      <div className="notif-hero animate-fade-in">
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'rgba(255,255,255,0.1)', padding: '5px 10px', borderRadius: '100px', width: 'fit-content', marginBottom: '12px' }}>
            <BellRing size={12} color="#a5b4fc" />
            <span style={{ fontSize: '10px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '1px' }}>Institutional Dispatch</span>
          </div>
          <h1 style={{ margin: 0, fontSize: '28px', fontWeight: 900, letterSpacing: '-1px' }}>Bulletin Board</h1>
          <p style={{ margin: '6px 0 0 0', opacity: 0.8, fontWeight: 500, fontSize: '14px' }}>Official announcements and emergency alerts from administration.</p>
        </div>
        <div className="hide-mobile">
          <Megaphone size={48} style={{ opacity: 0.2 }} />
        </div>
      </div>

      <div className="notif-list animate-fade-in" style={{ animationDelay: '0.1s' }}>
        {notifications.map((n, idx) => (
          <div key={n._id} className={`notif-card ${n.type === 'Alert' ? 'urgent' : 'global'} animate-fade-in`} style={{ animationDelay: `${idx * 0.05}s` }}>
            <div className="notif-icon-box" style={{ background: n.type === 'Alert' ? '#fef2f2' : '#eff6ff', color: n.type === 'Alert' ? '#ef4444' : '#2563eb' }}>
              {n.type === 'Alert' ? <AlertTriangle size={20} /> : <Megaphone size={20} />}
            </div>
            <div className="notif-content">
              <div className="notif-header">
                <h3 className="notif-title">{n.title}</h3>
                <span style={{ fontSize: '10px', fontWeight: 900, padding: '3px 8px', borderRadius: '5px', background: n.type === 'Alert' ? '#ef4444' : '#6366f1', color: '#fff', textTransform: 'uppercase' }}>
                  {n.type || 'Bulletin'}
                </span>
              </div>
              <p className="notif-body">{n.message}</p>
              <div className="notif-meta">
                <div className="meta-item"><Calendar size={12} /> {new Date(n.createdAt).toLocaleDateString()}</div>
                <div className="meta-item"><User size={12} /> Administration</div>
                <div className="meta-item"><Globe size={12} /> {n.target || 'Institutional'}</div>
              </div>
            </div>
          </div>
        ))}

        {notifications.length === 0 && !loading && (
          <div style={{ padding: '60px', textAlign: 'center', background: '#fff', borderRadius: '24px', border: '2.5px dashed #e2e8f0' }}>
            <Sparkles size={32} color="#cbd5e1" style={{ marginBottom: '12px' }} />
            <p style={{ color: '#94a3b8', fontWeight: 600, fontSize: '15px' }}>No institutional announcements for your academic profile.</p>
          </div>
        )}
      </div>
    </div>
  );
}
