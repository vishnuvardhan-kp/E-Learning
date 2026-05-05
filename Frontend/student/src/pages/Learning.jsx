import { useState } from 'react';

export default function Learning({ enrolledCourses = [] }) {
  const [activeCourseId, setActiveCourseId] = useState(null);
  const [readMaterials, setReadMaterials] = useState({});

  const toggleRead = (materialKey) => {
    setReadMaterials(prev => ({
      ...prev,
      [materialKey]: !prev[materialKey]
    }));
  };

  return (
    <div>
      <h2 style={{ fontSize: '24px', marginBottom: '24px' }}>Learning Dashboard</h2>
      <div className="card-grid">
        {enrolledCourses.map(course => (
          <div key={course.id} className="card" style={{ borderLeft: '4px solid #2563eb' }}>
            <h3>{course.title}</h3>
            <p>Enrolled: {course.time}</p>
            <p>Current Module: {course.module}</p>
            <button 
              className="action-button"
              onClick={() => setActiveCourseId(activeCourseId === course.id ? null : course.id)}
            >
              {activeCourseId === course.id ? 'Close Materials' : 'Continue Learning'}
            </button>
            
            {activeCourseId === course.id && (
              <div style={{ marginTop: '16px', padding: '12px', background: '#f8fafc', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                <h4 style={{ marginBottom: '8px', fontSize: '14px', color: '#334155' }}>Course Materials:</h4>
                <ul style={{ listStyleType: 'none', padding: 0, margin: 0 }}>
                  {[
                    { id: 'notes', icon: '📄', label: 'Lecture Notes (PDF)' },
                    { id: 'video', icon: '🎥', label: 'Video Recording (MP4)' },
                    { id: 'reading', icon: '📝', label: 'Reading Materials / Articles (Link)' }
                  ].map(mat => {
                     const key = `${course.id}-${mat.id}`;
                     const isRead = readMaterials[key];
                     return (
                        <li key={mat.id} style={{ padding: '8px 0', borderBottom: '1px solid #cbd5e1', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <a href="#" style={{ color: '#2563eb', textDecoration: isRead ? 'line-through' : 'none', display: 'flex', alignItems: 'center', gap: '8px', opacity: isRead ? 0.6 : 1 }}>
                            {mat.icon} {mat.label}
                          </a>
                          <button 
                            onClick={() => toggleRead(key)}
                            style={{ 
                               padding: '4px 8px', 
                               fontSize: '11px', 
                               background: isRead ? '#10b981' : '#e2e8f0', 
                               color: isRead ? 'white' : '#0f172a', 
                               border: 'none', 
                               borderRadius: '4px', 
                               cursor: 'pointer', 
                               fontWeight: 'bold',
                               transition: 'all 0.2s'
                            }}>
                            {isRead ? 'Read ✓' : 'Mark as Read'}
                          </button>
                        </li>
                     );
                  })}
                </ul>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
