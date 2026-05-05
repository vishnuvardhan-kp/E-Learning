import { useState, useEffect } from 'react';
import { Plus, ClipboardCheck, Clock, Users, Trash2, Send } from 'lucide-react';

export default function Assignments(props) {
  const [assignments, setAssignments] = useState([]);
  const [newTitle, setNewTitle] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [courseId, setCourseId] = useState('');

  const fetchAssignments = async () => {
    try {
      const res = await fetch(API_URL + '/assignments');
      const data = await res.json();
      setAssignments(data);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    fetchAssignments();
  }, []);

  const createAssignment = async () => {
    if (newTitle && dueDate && courseId) {
      try {
        await fetch(API_URL + '/assignments', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ title: newTitle, dueDate, courseId, submissionsCount: 0 })
        });
        setNewTitle('');
        setDueDate('');
        fetchAssignments();
      } catch (e) {
        console.error(e);
      }
    }
  };

  const deleteAssignment = async (id) => {
    if (window.confirm("Delete this assignment?")) {
      try {
        await fetch(`${API_URL}/assignments/${id}`, { method: 'DELETE' });
        fetchAssignments();
      } catch (e) {
        console.error(e);
      }
    }
  };

  const filtered = props.activeCourse 
    ? assignments.filter(a => a.courseId === props.activeCourse)
    : assignments;

  return (
    <div className="module-container">
      <style>{`
        .assignment-creator {
          background: #fff;
          border-radius: 24px;
          padding: 32px;
          border: 1px solid var(--border-color);
          margin-bottom: 40px;
          box-shadow: var(--shadow-sm);
        }
        .form-row {
          display: grid;
          grid-template-columns: 2fr 1fr 1fr auto;
          gap: 16px;
          align-items: flex-end;
        }
        .assignment-card {
          background: #fff;
          border-radius: 20px;
          padding: 24px;
          border: 1px solid var(--border-color);
          transition: var(--transition);
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 16px;
        }
        .assignment-card:hover {
          border-color: var(--primary);
          box-shadow: var(--shadow-md);
        }
        .assignment-main {
          display: flex;
          align-items: center;
          gap: 20px;
        }
        .icon-box {
          width: 48px;
          height: 48px;
          background: #f1f5f9;
          border-radius: 14px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--primary);
        }
        .assignment-info h3 {
          margin: 0;
          font-size: 17px;
          font-weight: 800;
          color: var(--text-main);
        }
        .assignment-meta {
          display: flex;
          gap: 20px;
          margin-top: 6px;
        }
        .meta-tag {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 13px;
          color: var(--text-muted);
          font-weight: 600;
        }
        .assignment-actions {
          display: flex;
          gap: 12px;
        }
        .btn-icon {
          width: 40px;
          height: 40px;
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          border: none;
          cursor: pointer;
          transition: var(--transition);
        }
        .btn-del { background: #fee2e2; color: #ef4444; }
        .btn-del:hover { background: #ef4444; color: #fff; }
        .btn-view { background: #f1f5f9; color: var(--text-main); }
        .btn-view:hover { background: #e2e8f0; }
        
        .label { display: block; font-size: 12px; font-weight: 800; color: var(--text-muted); text-transform: uppercase; margin-bottom: 8px; letter-spacing: 0.5px; }
        .input { width: 100%; background: #f8fafc; border: 1px solid #e2e8f0; padding: 12px 16px; border-radius: 12px; font-weight: 600; outline: none; transition: var(--transition); }
        .input:focus { background: #fff; border-color: var(--primary); }
      `}</style>

      <div className="assignment-creator animate-fade-in">
        <h3 style={{ fontSize: '20px', fontWeight: 800, marginBottom: '20px' }}>Create New Assignment</h3>
        <div className="form-row">
          <div>
            <span className="label">Assignment Title</span>
            <input className="input" placeholder="e.g. Final Project Report" value={newTitle} onChange={e => setNewTitle(e.target.value)} />
          </div>
          <div>
            <span className="label">Due Date</span>
            <input className="input" type="date" value={dueDate} onChange={e => setDueDate(e.target.value)} />
          </div>
          <div>
            <span className="label">Course</span>
            <select className="input" value={courseId} onChange={e => setCourseId(e.target.value)}>
              <option value="">Select Course</option>
              {props.courses?.map(c => <option key={c._id} value={c._id}>{c.title}</option>)}
            </select>
          </div>
          <button className="btn-create" style={{ height: '48px', padding: '0 24px', background: 'var(--primary)', color: '#fff', border: 'none', borderRadius: '12px', fontWeight: 800, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }} onClick={createAssignment}>
            <Plus size={20} />
            Post
          </button>
        </div>
      </div>

      <div className="section-header" style={{ marginBottom: '24px' }}>
        <h3 style={{ fontSize: '22px', fontWeight: 800 }}>Active Assignments</h3>
      </div>

      <div className="assignment-list">
        {filtered.map(a => (
          <div className="assignment-card" key={a._id}>
            <div className="assignment-main">
              <div className="icon-box">
                <ClipboardCheck size={24} />
              </div>
              <div className="assignment-info">
                <h3>{a.title}</h3>
                <div className="assignment-meta">
                  <div className="meta-tag">
                    <Clock size={14} />
                    <span>Due: {new Date(a.dueDate).toLocaleDateString()}</span>
                  </div>
                  <div className="meta-tag">
                    <Users size={14} />
                    <span>{a.submissionsCount || 0} Submissions</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="assignment-actions">
              <button className="btn-icon btn-view" title="Review Submissions">
                <Send size={18} />
              </button>
              <button className="btn-icon btn-del" onClick={() => deleteAssignment(a._id)} title="Delete Assignment">
                <Trash2 size={18} />
              </button>
            </div>
          </div>
        ))}
        
        {filtered.length === 0 && (
          <div style={{ padding: '60px', textAlign: 'center', background: '#fff', borderRadius: '24px', border: '2px dashed #e2e8f0' }}>
            <p style={{ color: 'var(--text-muted)', fontWeight: 600 }}>No assignments posted yet.</p>
          </div>
        )}
      </div>
    </div>
  );
}
