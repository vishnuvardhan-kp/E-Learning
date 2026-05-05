import { useState, useEffect } from 'react';
import { Plus, Trash2, Edit, Users, Clock, CheckCircle, AlertCircle, Send, Hash } from 'lucide-react';
import { API_URL } from '../../api/backend';
import * as BaseUI from '../../components/BaseUI';

export default function CourseManagement(props) {
  const [newTitle, setNewTitle] = useState('');
  const [newCode, setNewCode] = useState('');
  const [newDept, setNewDept] = useState(props.user?.dept || '');
  const [newYear, setNewYear] = useState('');
  const [newSection, setNewSection] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const storedUser = props.user || {};

  // Sync newDept if props.user updates later (e.g. after syncProfile)
  useEffect(() => {
    if (props.user?.dept && !newDept) {
      setNewDept(props.user.dept);
    }
  }, [props.user, newDept]);

  const createCourse = async () => {
    if (!newTitle.trim()) {
      alert('Please enter a course title.');
      return;
    }
    setSubmitting(true);
    try {
      await fetch(API_URL + '/courses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: newTitle,
          code: newCode,
          dept: newDept,
          targetYear: newYear,
          section: newSection,
          instructorName: storedUser.username || 'Unknown Instructor',
          instructorEmail: storedUser.email || '',
          enrolled: 0,
          status: 'Pending'   // Goes to admin for approval
        })
      });
      setNewTitle('');
      setNewCode('');
      setNewDept(storedUser.dept || '');
      setNewYear('');
      setNewSection('');
      setSubmitted(true);
      setTimeout(() => setSubmitted(false), 4000);
      if (props.refreshCourses) props.refreshCourses();
    } catch (e) {
      console.error(e);
    } finally {
      setSubmitting(false);
    }
  };

  const deleteCourse = async (id, status) => {
    if (status === 'Pending') {
      alert('This course is pending admin approval and cannot be deleted yet.');
      return;
    }
    if (window.confirm('Are you sure you want to delete this course?')) {
      try {
        await fetch(API_URL + `/courses/${id}`, { method: 'DELETE' });
        if (props.refreshCourses) props.refreshCourses();
      } catch (e) {
        console.error(e);
      }
    }
  };

  const getStatusBadge = (status) => {
    if (status === 'Active') return (
      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: '#ecfdf5', color: '#10b981', padding: '4px 12px', borderRadius: '100px', fontSize: '12px', fontWeight: 800 }}>
        <CheckCircle size={12} /> Active
      </span>
    );
    if (status === 'Pending') return (
      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: '#fffbeb', color: '#f59e0b', padding: '4px 12px', borderRadius: '100px', fontSize: '12px', fontWeight: 800 }}>
        <Clock size={12} /> Pending Admin Approval
      </span>
    );
    return (
      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: '#fee2e2', color: '#ef4444', padding: '4px 12px', borderRadius: '100px', fontSize: '12px', fontWeight: 800 }}>
        <AlertCircle size={12} /> {status}
      </span>
    );
  };

  return (
    <div className="module-container">
      <style>{`
        .setup-card {
          background: #fff;
          border-radius: 24px;
          padding: 32px;
          border: 1px solid var(--border-color);
          margin-bottom: 40px;
          box-shadow: var(--shadow-sm);
        }
        .setup-header { margin-bottom: 24px; }
        .setup-header h3 {
          font-size: 20px;
          font-weight: 800;
          color: var(--text-main);
          letter-spacing: -0.5px;
        }
        .input-group-row {
          display: flex;
          gap: 16px;
          align-items: flex-end;
          flex-wrap: wrap;
        }
        .course-card {
          background: #fff;
          border-radius: 20px;
          padding: 24px;
          border: 1px solid var(--border-color);
          transition: var(--transition);
          display: flex;
          flex-direction: column;
          gap: 16px;
        }
        .course-card:hover {
          transform: translateY(-4px);
          box-shadow: var(--shadow-md);
          border-color: var(--primary);
        }
        .course-card.pending {
          border-color: #fde68a;
          background: #fffdf5;
        }
        .course-card h3 {
          font-size: 18px;
          font-weight: 800;
          color: var(--text-main);
          margin: 0;
        }
        .course-meta { display: flex; flex-direction: column; gap: 10px; }
        .meta-item {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 13px;
          color: var(--text-muted);
          font-weight: 600;
        }
        .meta-item svg { color: var(--primary); }
        .course-actions { display: flex; gap: 10px; margin-top: 8px; }
        .btn-course {
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
        .btn-edit { background: #f1f5f9; color: var(--text-main); }
        .btn-edit:hover { background: #e2e8f0; }
        .btn-delete { background: #fee2e2; color: #ef4444; }
        .btn-delete:hover { background: #ef4444; color: #fff; }
        .btn-create {
          background: var(--primary);
          color: #fff;
          padding: 14px 28px;
          border-radius: 14px;
          font-weight: 800;
          display: flex;
          align-items: center;
          gap: 8px;
          border: none;
          cursor: pointer;
          white-space: nowrap;
          min-width: 180px;
          justify-content: center;
        }
        .btn-create:disabled { opacity: 0.6; cursor: not-allowed; }
        .course-title-input {
          font-size: 18px !important;
          font-weight: 800 !important;
          color: var(--text-main) !important;
          letter-spacing: -0.5px !important;
          border: 2px solid #e2e8f0 !important;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important;
          width: 100%;
          padding: 14px 20px;
          border-radius: 16px;
          background: #f8fafc;
          box-sizing: border-box;
          outline: none;
        }
        .course-title-input:focus {
          border-color: var(--primary) !important;
          box-shadow: 0 0 0 4px rgba(37, 99, 235, 0.1) !important;
          background: #fff !important;
        }
        .success-toast {
          background: #ecfdf5;
          border: 1px solid #10b981;
          color: #065f46;
          padding: 14px 20px;
          border-radius: 14px;
          font-weight: 700;
          font-size: 14px;
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 24px;
          animation: fadeIn 0.3s ease;
        }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(-8px); } to { opacity: 1; transform: translateY(0); } }
        @media (max-width: 640px) {
          .input-group-row { flex-direction: column; }
          .btn-create { width: 100%; }
        }
      `}</style>

      {/* Success Toast */}
      {submitted && (
        <div className="success-toast">
          <Send size={18} />
          Course submitted successfully! It is now awaiting admin approval.
        </div>
      )}

      {/* Quick Course Setup */}
      <div className="setup-card animate-fade-in">
        <div className="setup-header">
          <h3>Quick Course Setup</h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>
            Submit a new curriculum module — it will be sent to the admin for approval before going live.
          </p>
        </div>

        <div className="input-group-row">
          <div style={{ flex: 1.5, minWidth: '200px' }}>
            <div className="input-group">
              <label style={{ fontSize: '12px', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.5px', display: 'block', marginBottom: '8px' }}>Course Title</label>
              <input 
                className="course-title-input"
                placeholder="Advanced Quantum Mechanics" 
                value={newTitle} 
                onChange={(e) => setNewTitle(e.target.value)} 
              />
            </div>
          </div>

          <div style={{ flex: 0.8, minWidth: '150px' }}>
            <div className="input-group">
              <label style={{ fontSize: '12px', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.5px', display: 'block', marginBottom: '8px' }}>Course Code</label>
              <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                <Hash size={18} style={{ position: 'absolute', left: '16px', color: '#94a3b8' }} />
                <input 
                  placeholder="e.g. PHY-402" 
                  value={newCode} 
                  onChange={(e) => setNewCode(e.target.value)} 
                  style={{ width: '100%', padding: '14px 16px 14px 45px', borderRadius: '16px', border: '2px solid #e2e8f0', background: '#f8fafc', fontSize: '15px', fontWeight: 700, color: 'var(--text-main)', outline: 'none' }}
                />
              </div>
            </div>
          </div>

          <div style={{ flex: 1, minWidth: '130px' }}>
            <label style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px', display: 'block', marginBottom: '8px' }}>Department</label>
            <select
              disabled
              value={newDept}
              onChange={(e) => setNewDept(e.target.value)}
              style={{ width: '100%', padding: '12px 16px', borderRadius: '12px', border: '1px solid var(--border-color)', fontSize: '14px', fontWeight: 600, background: '#f1f5f9', cursor: 'not-allowed', color: '#64748b' }}
            >
              <option value="">Select Dept</option>
              <option value="CSE">CSE</option>
              <option value="IT">IT</option>
              <option value="ECE">ECE</option>
              <option value="MECH">MECH</option>
            </select>
          </div>

          <div style={{ flex: 0.8, minWidth: '130px' }}>
            <label style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px', display: 'block', marginBottom: '8px' }}>Target Year</label>
            <select
              value={newYear}
              onChange={(e) => setNewYear(e.target.value)}
              style={{ width: '100%', padding: '12px 16px', borderRadius: '12px', border: '1px solid var(--border-color)', fontSize: '14px', fontWeight: 600, background: '#f8fafc' }}
            >
              <option value="">All Years</option>
              <option value="1st Year">1st Year</option>
              <option value="2nd Year">2nd Year</option>
              <option value="3rd Year">3rd Year</option>
              <option value="4th Year">4th Year</option>
            </select>
          </div>

          <div style={{ flex: 0.8, minWidth: '130px' }}>
            <label style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px', display: 'block', marginBottom: '8px' }}>Section</label>
            <select
              value={newSection}
              onChange={(e) => setNewSection(e.target.value)}
              style={{ width: '100%', padding: '12px 16px', borderRadius: '12px', border: '1px solid var(--border-color)', fontSize: '14px', fontWeight: 600, background: '#f8fafc' }}
            >
              <option value="">All Sections</option>
              <option value="A">Section A</option>
              <option value="B">Section B</option>
              <option value="C">Section C</option>
              <option value="D">Section D</option>
            </select>
          </div>

          <button className="btn-create" onClick={createCourse} disabled={submitting}>
            <Send size={18} />
            {submitting ? 'Submitting...' : 'Submit for Approval'}
          </button>
        </div>
      </div>

      {/* Course List */}
      <div className="section-header" style={{ marginBottom: '24px' }}>
        <h3 style={{ fontSize: '22px', fontWeight: 800, letterSpacing: '-0.5px' }}>My Department Classes</h3>
        <p style={{ color: 'var(--text-muted)', fontSize: '13px', fontWeight: 600, marginTop: '4px' }}>
          Pending courses are awaiting institutional approval. Active courses are live.
        </p>
      </div>

      <div className="card-grid">
        {props.courses && props.courses.map(function(course) {
          return (
            <div className={`course-card ${course.status === 'Pending' ? 'pending' : ''}`} key={course._id}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '12px' }}>
                <div>
                    <h3 style={{ marginBottom: '4px' }}>{course.title}</h3>
                    {course.code && <span style={{ fontSize: '12px', fontWeight: 800, color: 'var(--primary)', letterSpacing: '1px' }}>{course.code}</span>}
                </div>
                {getStatusBadge(course.status)}
              </div>

              <div className="course-meta">
                <div className="meta-item">
                  <Users size={16} />
                  <span>{course.enrolled || 0} Students Enrolled</span>
                </div>
                {course.dept && (
                  <div className="meta-item">
                    <Clock size={16} />
                    <span>Department: {course.dept}</span>
                  </div>
                )}
                {course.targetYear && (
                  <div className="meta-item">
                    <CheckCircle size={16} />
                    <span>Year: {course.targetYear} {course.section ? `(Section ${course.section})` : ''}</span>
                  </div>
                )}
              </div>

              <div className="course-actions">
                {course.status === 'Active' && (
                  <button className="btn-course btn-edit">
                    <Edit size={16} />
                    Edit Syllabus
                  </button>
                )}
                {course.status === 'Pending' && (
                  <div style={{ flex: 1, padding: '10px', background: '#fffbeb', borderRadius: '12px', textAlign: 'center', fontSize: '12px', fontWeight: 700, color: '#92400e' }}>
                    ⏳ Waiting for Admin Review
                  </div>
                )}
                <button
                  className="btn-course btn-delete"
                  style={course.status === 'Pending' ? { opacity: 0.4, cursor: 'not-allowed' } : {}}
                  onClick={() => deleteCourse(course._id, course.status)}
                >
                  <Trash2 size={16} />
                  Delete
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {props.courses && props.courses.length === 0 && (
        <div style={{ padding: '60px', textAlign: 'center', background: '#fff', borderRadius: '24px', border: '2px dashed #e2e8f0' }}>
          <p style={{ color: 'var(--text-muted)', fontWeight: 600 }}>No courses yet. Use the form above to submit your first curriculum for approval.</p>
        </div>
      )}
    </div>
  );
}
