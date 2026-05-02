import { useState, useEffect } from 'react';

export default function Notifications(props) {
  const [announcements, setAnnouncements] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState(props.activeCourse || '');
  const [message, setMessage] = useState('');

  const fetchNotifications = async () => {
    try {
      const res = await fetch('http://localhost:5000/notifications');
      const data = await res.json();
      setAnnouncements(data);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  useEffect(function() {
      if (props.activeCourse) {
          setSelectedCourse(props.activeCourse);
      }
  }, [props.activeCourse]);

  const handleSend = async function(type) {
      if (selectedCourse && message) {
          try {
              const user = JSON.parse(localStorage.getItem('user') || '{}');
              await fetch('http://localhost:5000/notifications', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({
                      title: message.length > 30 ? message.substring(0, 30) + '...' : message,
                      message: message,
                      courseId: selectedCourse,
                      type: type === 'Announcement' ? 'Standard' : 'Urgent',
                      sender: user.username || 'Instructor'
                  })
              });
              setMessage('');
              fetchNotifications();
          } catch (e) {
              console.error(e);
          }
      } else {
          alert('Please select a target class/course and enter a message to broadcast.');
      }
  };

  const filteredAnnouncements = props.activeCourse
        ? announcements.filter(function(a) { return a.courseId === props.activeCourse })
        : announcements;

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2 style={{ fontSize: '24px', marginBottom: '24px' }}>Global Comms & Alerts {props.activeCourse ? '(Filtered)' : ''}</h2>
      </div>
      
      <div className="card" style={{ marginBottom: '32px' }}>
        <h3 style={{ marginBottom: '16px' }}>Broadcast Message</h3>
        <select className="input-field" value={selectedCourse} onChange={function(e) { setSelectedCourse(e.target.value) }} style={{ marginBottom: '16px' }}>
           <option value="">Select Target Course...</option>
           {props.courses ? props.courses.map(function(c) {
              return <option key={c._id} value={c._id}>{c.title}</option>
           }) : null}
        </select>
        <textarea className="input-field" rows={3} placeholder="Type announcement or deadline reminder here..." value={message} onChange={function(e) { setMessage(e.target.value) }}></textarea>
        <div style={{ display: 'flex', gap: '12px', marginTop: '12px' }}>
          <button className="action-button" style={{ background: '#3b82f6' }} onClick={function() { handleSend('Announcement') }}>Send Announcement</button>
          <button className="action-button" style={{ background: '#f59e0b', color: '#0f172a' }} onClick={function() { handleSend('Deadline Reminder') }}>Send Deadline Reminder</button>
        </div>
      </div>
      
      <h3 style={{ marginBottom: '16px', fontSize: '20px' }}>Broadcast History</h3>
      <div className="card-grid" style={{ gridTemplateColumns: '1fr', marginTop: 0 }}>
        {filteredAnnouncements.map(function(a) {
            let courseTitle = 'Unknown Course';
            if (props.courses) {
                const foundCourse = props.courses.find(function(c) { return c._id === a.courseId });
                if (foundCourse) {
                    courseTitle = foundCourse.title;
                }
            }
            return (
              <div key={a._id} className="card" style={{ borderLeft: a.type === 'Standard' ? '4px solid #3b82f6' : '4px solid #f59e0b' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                   <h3 style={{ margin: 0 }}>{a.type}: {a.title}</h3>
                   <span style={{ fontSize: '13px', background: '#f1f5f9', padding: '4px 8px', borderRadius: '4px', fontWeight: 'bold', color: '#475569' }}>{courseTitle}</span>
                </div>
                <p style={{ color: '#64748b', margin: '8px 0', fontSize: '12px' }}>Sent • {new Date(a.createdAt).toLocaleString()}</p>
                <p style={{ margin: 0, marginTop: '12px', color: '#0f172a', lineHeight: '1.5' }}>{a.message}</p>
              </div>
            );
        })}
        {filteredAnnouncements.length === 0 ? <p style={{ color: '#64748b', fontStyle: 'italic' }}>No communications sent yet for this view.</p> : null}
      </div>
    </div>
  );
}
