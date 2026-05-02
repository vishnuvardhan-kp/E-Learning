import { useState, useEffect } from 'react';

export default function Notifications() {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const res = await fetch('http://localhost:5000/notifications');
        const data = await res.json();
        setNotifications(data);
      } catch (e) {
        console.error(e);
      }
    };
    fetchNotifications();
  }, []);

  return (
    <div>
      <h2 style={{ fontSize: '24px', marginBottom: '24px' }}>Announcements & Alerts</h2>
      <div className="card-grid" style={{ gridTemplateColumns: '1fr' }}>
        {notifications.map(n => (
          <div key={n._id} className="card" style={{ borderLeft: `4px solid ${n.type === 'Urgent' ? '#ef4444' : '#eab308'}` }}>
            <h3>{n.title}</h3>
            <p style={{ color: '#64748b' }}>{n.sender || 'System'} • {new Date(n.createdAt).toLocaleString()}</p>
            <p>{n.message}</p>
          </div>
        ))}
        {notifications.length === 0 && <p>No new announcements at this time.</p>}
      </div>
    </div>
  );
}
