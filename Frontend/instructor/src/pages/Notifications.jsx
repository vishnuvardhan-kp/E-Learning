import { useState, useEffect } from 'react';

export default function Notifications(props) {
  const announcementsState = useState([
     { id: 1, title: 'Welcome to CS401!', courseId: 1, content: 'Glad to have you in the class!', type: 'Announcement', date: new Date().toLocaleDateString() }
  ]);
  const announcements = announcementsState[0];
  const setAnnouncements = announcementsState[1];

  const selectedCourseState = useState(props.activeCourse || '');
  const selectedCourse = selectedCourseState[0];
  const setSelectedCourse = selectedCourseState[1];

  const messageState = useState('');
  const message = messageState[0];
  const setMessage = messageState[1];

  useEffect(function() {
      if (props.activeCourse) {
          setSelectedCourse(props.activeCourse);
      }
  }, [props.activeCourse]);

  const handleSend = function(type) {
      if (selectedCourse && message) {
          const newAnnouncement = {
              id: Date.now(),
              title: message.length > 30 ? message.substring(0, 30) + '...' : message,
              courseId: Number(selectedCourse),
              content: message,
              type: type,
              date: new Date().toLocaleDateString()
          };
          const newList = [].concat([newAnnouncement], announcements);
          setAnnouncements(newList);
          setMessage('');
      } else {
          alert('Please select a target class/course and enter a message to broadcast.');
      }
  };

  const filteredAnnouncements = props.activeCourse
        ? announcements.filter(function(a) { return a.courseId === Number(props.activeCourse) })
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
              return <option key={c.id} value={c.id}>{c.title}</option>
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
                const foundCourse = props.courses.find(function(c) { return c.id === a.courseId });
                if (foundCourse) {
                    courseTitle = foundCourse.title;
                }
            }
            return (
              <div key={a.id} className="card" style={{ borderLeft: a.type === 'Announcement' ? '4px solid #3b82f6' : '4px solid #f59e0b' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                   <h3 style={{ margin: 0 }}>{a.type}: {a.title}</h3>
                   <span style={{ fontSize: '13px', background: '#f1f5f9', padding: '4px 8px', borderRadius: '4px', fontWeight: 'bold', color: '#475569' }}>{courseTitle}</span>
                </div>
                <p style={{ color: '#64748b', margin: '8px 0', fontSize: '12px' }}>Sent • {a.date}</p>
                <p style={{ margin: 0, marginTop: '12px', color: '#0f172a', lineHeight: '1.5' }}>{a.content}</p>
              </div>
            );
        })}
        {filteredAnnouncements.length === 0 ? <p style={{ color: '#64748b', fontStyle: 'italic' }}>No communications sent yet for this view.</p> : null}
      </div>
    </div>
  );
}
