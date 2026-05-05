import { useState } from 'react';
import { CheckCircle2, XCircle, User, Book } from 'lucide-react';

export default function StudentEnrollment(props) {
  const [enrollments, setEnrollments] = useState([
    { id: 1, name: 'John Doe', courseId: 1, status: 'Pending', color: '#f59e0b' },
    { id: 2, name: 'Alice Smith', courseId: 1, status: 'Active', color: '#10b981' },
    { id: 3, name: 'Bob Jones', courseId: 2, status: 'Pending', color: '#f59e0b' }
  ]);

  const approveEnrollment = (id) => {
    setEnrollments(prev => prev.map(e => 
      e.id === id ? { ...e, status: 'Active', color: '#10b981' } : e
    ));
  };

  const rejectEnrollment = (id) => {
    setEnrollments(prev => prev.filter(e => e.id !== id));
  };

  const filteredEnrollments = props.activeCourse 
        ? enrollments.filter(e => e.courseId === Number(props.activeCourse) || e.courseId === props.activeCourse) 
        : enrollments;

  return (
    <div className="enrollment-oversight">
      <div className="section-header" style={{ marginBottom: '32px' }}>
        <h2 style={{ fontSize: '28px', fontWeight: 800, color: 'var(--text-main)', letterSpacing: '-1px' }}>
          Enrollment Oversight
        </h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '14px', fontWeight: 500 }}>
          Manage student applications and course access permissions.
        </p>
      </div>
      
      <div className="card-grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))' }}>
        {filteredEnrollments.map((enrollment) => {
            let courseTitle = 'Unknown Course';
            if (props.courses) {
                const foundCourse = props.courses.find(c => c._id === enrollment.courseId || c.id === enrollment.courseId);
                if (foundCourse) courseTitle = foundCourse.title;
            }
            
            return (
              <div key={enrollment.id} className="compact-enrollment-card">
                <style>{`
                  .compact-enrollment-card {
                    background: #fff;
                    border: 1px solid var(--border-color);
                    border-radius: 20px;
                    padding: 24px;
                    transition: var(--transition);
                    position: relative;
                    overflow: hidden;
                    box-shadow: var(--shadow-sm);
                  }
                  .compact-enrollment-card:hover {
                    transform: translateY(-4px);
                    box-shadow: var(--shadow-md);
                    border-color: var(--primary);
                  }
                  .status-badge {
                    position: absolute;
                    top: 24px;
                    right: 24px;
                    padding: 4px 12px;
                    border-radius: 20px;
                    font-size: 11px;
                    font-weight: 800;
                    text-transform: uppercase;
                    letter-spacing: 0.5px;
                  }
                  .student-info {
                    display: flex;
                    align-items: center;
                    gap: 16px;
                    margin-bottom: 20px;
                  }
                  .student-avatar {
                    width: 48px;
                    height: 48px;
                    background: #f1f5f9;
                    border-radius: 14px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    color: var(--primary);
                  }
                  .student-details h3 {
                    margin: 0;
                    font-size: 17px;
                    font-weight: 800;
                    color: var(--text-main);
                  }
                  .course-line {
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    font-size: 13px;
                    color: var(--text-muted);
                    font-weight: 600;
                    margin-bottom: 24px;
                  }
                  .action-row {
                    display: flex;
                    gap: 12px;
                  }
                  .btn-action {
                    flex: 1;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 8px;
                    padding: 10px;
                    border-radius: 12px;
                    font-size: 13px;
                    font-weight: 700;
                    cursor: pointer;
                    transition: var(--transition);
                    border: none;
                  }
                  .btn-approve { background: #ecfdf5; color: #10b981; }
                  .btn-approve:hover { background: #10b981; color: #fff; }
                  .btn-reject { background: #fef2f2; color: #ef4444; }
                  .btn-reject:hover { background: #ef4444; color: #fff; }
                  .btn-view { background: #f1f5f9; color: var(--text-main); width: 100%; }
                  .btn-view:hover { background: #e2e8f0; }
                `}</style>

                <div className="status-badge" style={{ background: enrollment.color + '15', color: enrollment.color }}>
                  {enrollment.status}
                </div>

                <div className="student-info">
                  <div className="student-avatar">
                    <User size={24} />
                  </div>
                  <div className="student-details">
                    <h3>{enrollment.name}</h3>
                  </div>
                </div>

                <div className="course-line">
                  <Book size={14} />
                  <span>{courseTitle}</span>
                </div>

                {enrollment.status === 'Pending' ? (
                  <div className="action-row">
                    <button className="btn-action btn-approve" onClick={() => approveEnrollment(enrollment.id)}>
                      <CheckCircle2 size={16} />
                      Approve
                    </button>
                    <button className="btn-action btn-reject" onClick={() => rejectEnrollment(enrollment.id)}>
                      <XCircle size={16} />
                      Reject
                    </button>
                  </div>
                ) : (
                  <button className="btn-action btn-view">
                    View Full Profile
                  </button>
                )}
              </div>
            );
        })}
        {filteredEnrollments.length === 0 && (
          <div style={{ padding: '40px', textAlign: 'center', background: '#f8fafc', borderRadius: '20px', border: '2px dashed #e2e8f0', gridColumn: '1 / -1' }}>
            <p style={{ color: 'var(--text-muted)', fontWeight: 600 }}>No active enrollment applications found.</p>
          </div>
        )}
      </div>
    </div>
  );
}
