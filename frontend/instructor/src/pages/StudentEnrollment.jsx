import { useState, useEffect } from 'react';

export default function StudentEnrollment(props) {
  const [enrollments, setEnrollments] = useState([]);
  const [students, setStudents] = useState([]);

  const fetchData = async () => {
    try {
      // Fetch all students to get names
      const sRes = await fetch('http://127.0.0.1:5000/student');
      const sData = await sRes.json();
      setStudents(sData);

      // Fetch all enrollments
      const eRes = await fetch('http://127.0.0.1:5000/courses'); // Need a way to get enrollments
      // Wait, I need a route for all enrollments or by course
      // I'll fetch all enrollments from a new route I'll add
      const enrRes = await fetch('http://127.0.0.1:5000/admin/enrollments'); 
      const enrData = await enrRes.json();
      setEnrollments(enrData);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const filteredEnrollments = props.activeCourse 
        ? enrollments.filter(function(e) { return e.courseId === props.activeCourse }) 
        : enrollments;

  return (
    <div>
      <h2 style={{ fontSize: '24px', marginBottom: '24px' }}>Student Enrollment Oversight {props.activeCourse ? '(Filtered)' : ''}</h2>
      
      <div className="card-grid">
        {filteredEnrollments.map(function(enrollment) {
            const student = students.find(s => s._id === enrollment.studentId);
            const course = props.courses.find(c => c._id === enrollment.courseId);
            
            return (
            <div key={enrollment._id} className="card" style={{ borderLeft: '4px solid #10b981' }}>
              <h3>{student ? student.username : 'Unknown Student'}</h3>
              <p>Course: {course ? course.title : 'Unknown Course'}</p>
              <p>Status: {enrollment.status}</p>
              <p style={{ fontSize: '12px', color: '#64748b' }}>Enrolled On: {enrollment.enrolledAt ? new Date(enrollment.enrolledAt).toLocaleDateString() : 'N/A'}</p>
            </div>
        )})}
        {filteredEnrollments.length === 0 ? <p>No enrollments found for this view.</p> : null}
      </div>
    </div>
  );
}
