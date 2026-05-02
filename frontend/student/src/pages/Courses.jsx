export default function Courses({ courses = [], onEnroll }) {
  return (
    <div>
      <h2 style={{ fontSize: '24px', marginBottom: '24px' }}>Course Browser</h2>
      <div className="card-grid">
        {courses.map(course => (
          <div key={course._id} className="card">
            <h3>{course.title}</h3>
            <p>{course.code} - {course.desc}</p>
            <button 
              className="action-button" 
              onClick={() => onEnroll && onEnroll(course)}
              disabled={course.enrolled}
              style={course.enrolled ? { background: '#10b981', color: 'white', cursor: 'default' } : {}}
            >
              {course.enrolled ? 'Enrolled' : 'Enroll Now'}
            </button>
          </div>
        ))}
        {courses.length === 0 && <p>No courses available at the moment.</p>}
      </div>
    </div>
  );
}
