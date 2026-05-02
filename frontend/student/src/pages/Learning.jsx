import { useState, useEffect } from 'react';

export default function Learning({ enrolledCourses = [] }) {
  const [activeCourseId, setActiveCourseId] = useState(null);
  const [readMaterials, setReadMaterials] = useState({});
  const [courseContent, setCourseContent] = useState([]);

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const res = await fetch('http://localhost:5000/content');
        const data = await res.json();
        setCourseContent(data);
      } catch(e) {
        console.error(e);
      }
    };
    fetchContent();
  }, []);

  const toggleRead = (materialKey) => {
    setReadMaterials(prev => ({
      ...prev,
      [materialKey]: !prev[materialKey]
    }));
  };

  const getMaterialsForCourse = (courseId) => {
      return courseContent.filter(c => c.courseId === courseId);
  };

  return (
    <div>
      <h2 style={{ fontSize: '24px', marginBottom: '24px' }}>Learning Dashboard</h2>
      <div className="card-grid">
        {enrolledCourses.map(course => (
          <div key={course._id} className="card" style={{ borderLeft: '4px solid #2563eb' }}>
            <h3>{course.title}</h3>
            <p>Enrolled: {course.time}</p>
            <p>Current Module: {course.module}</p>
            <button 
              className="action-button"
              onClick={() => setActiveCourseId(activeCourseId === course._id ? null : course._id)}
            >
              {activeCourseId === course._id ? 'Close Materials' : 'Continue Learning'}
            </button>
            
            {activeCourseId === course._id && (
              <div style={{ marginTop: '16px', padding: '12px', background: '#f8fafc', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                <h4 style={{ marginBottom: '8px', fontSize: '14px', color: '#334155' }}>Course Materials:</h4>
                <ul style={{ listStyleType: 'none', padding: 0, margin: 0 }}>
                  {getMaterialsForCourse(course._id).length > 0 ? getMaterialsForCourse(course._id).map(mat => {
                     const isRead = readMaterials[mat._id];
                     return (
                        <li key={mat._id} style={{ padding: '8px 0', borderBottom: '1px solid #cbd5e1', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                              <strong style={{ color: '#0f172a' }}>📁 {mat.title}</strong>
                              <button 
                                onClick={() => toggleRead(mat._id)}
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
                                {isRead ? 'Completed ✓' : 'Mark Completed'}
                              </button>
                          </div>
                          <div style={{ fontSize: '13px', color: '#64748b', opacity: isRead ? 0.6 : 1 }}>
                              Files: {mat.items}
                          </div>
                        </li>
                     );
                  }) : <p style={{ fontSize: '13px', color: '#64748b' }}>No materials posted yet.</p>}
                </ul>
              </div>
            )}
          </div>
        ))}
        {enrolledCourses.length === 0 && <p>You have not enrolled in any courses yet.</p>}
      </div>
    </div>
  );
}
