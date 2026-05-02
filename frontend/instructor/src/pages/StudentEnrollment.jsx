import { useState } from 'react';

export default function StudentEnrollment(props) {
  const enrollmentsState = useState([
    { id: 1, name: 'John Doe', courseId: 1, status: 'Pending', borderColor: '#eab308' },
    { id: 2, name: 'Alice Smith', courseId: 1, status: 'Active', borderColor: '#10b981' },
    { id: 3, name: 'Bob Jones', courseId: 2, status: 'Pending', borderColor: '#eab308' }
  ]);
  const enrollments = enrollmentsState[0];
  const setEnrollments = enrollmentsState[1];

  const approveEnrollment = function(id) {
    const newEnrollments = enrollments.map(function(e) {
      if (e.id === id) {
          const updated = Object.assign({}, e);
          updated.status = 'Active';
          updated.borderColor = '#10b981';
          return updated;
      }
      return e;
    });
    setEnrollments(newEnrollments);
  };

  const rejectEnrollment = function(id) {
    const newEnrollments = enrollments.filter(function(e) {
        return e.id !== id;
    });
    setEnrollments(newEnrollments);
  };

  const filteredEnrollments = props.activeCourse 
        ? enrollments.filter(function(e) { return e.courseId === Number(props.activeCourse) }) 
        : enrollments;

  return (
    <div>
      <h2 style={{ fontSize: '24px', marginBottom: '24px' }}>Student Enrollment Oversight {props.activeCourse ? '(Filtered)' : ''}</h2>
      
      <div className="card-grid">
        {filteredEnrollments.map(function(enrollment) {
            let courseTitle = 'Unknown Course';
            if (props.courses) {
                const foundCourse = props.courses.find(function(c) { return c.id === enrollment.courseId });
                if (foundCourse) {
                    courseTitle = foundCourse.title;
                }
            }
            return (
            <div key={enrollment.id} className="card" style={{ borderLeft: '4px solid ' + enrollment.borderColor }}>
              <h3>{enrollment.name}</h3>
              <p>Course: {courseTitle}</p>
              <p>Status: {enrollment.status}</p>
              {enrollment.status === 'Pending' ? (
                  <div className="card-actions" style={{ display: 'flex', gap: '10px' }}>
                    <button className="action-button" style={{ background: '#10b981' }} onClick={function() { approveEnrollment(enrollment.id) }}>Approve</button>
                    <button className="action-button" style={{ background: '#ef4444' }} onClick={function() { rejectEnrollment(enrollment.id) }}>Reject</button>
                  </div>
              ) : (
                  <button className="action-button" style={{ background: '#e2e8f0', color: '#0f172a' }}>View Profile</button>
              )}
            </div>
        )})}
        {filteredEnrollments.length === 0 ? <p>No enrollments found for this view.</p> : null}
      </div>
    </div>
  );
}
