import { useState } from 'react';

export default function Assignments() {
  const [assignments, setAssignments] = useState([
    { id: 1, title: 'UI Design Mockup', due: 'Tomorrow, 11:59 PM', status: 'Pending', statusColor: '#ef4444' },
    { id: 2, title: 'Database Normalization', due: 'Last Friday', status: 'Graded (A+)', statusColor: '#10b981', feedback: 'Brilliant work! Your understanding of normalization forms is exceptional.' }
  ]);

  const [activeUploadId, setActiveUploadId] = useState(null);
  const [file, setFile] = useState(null);

  const handleUploadClick = (id) => {
    setActiveUploadId(activeUploadId === id ? null : id);
    setFile(null);
  };

  const handleSubmit = (id, e) => {
    e.preventDefault();
    if (file) {
      setAssignments(assignments.map(a => a.id === id ? { ...a, status: 'Submitted', statusColor: '#3b82f6' } : a));
      setActiveUploadId(null);
      setFile(null);
    }
  };

  const handleView = (feedback) => {
      alert(`Instructor Feedback:\n\n${feedback || "No feedback available yet."}`);
  };

  return (
    <div>
      <h2 style={{ fontSize: '24px', marginBottom: '24px' }}>Assignment Submissions</h2>
      <div className="card-grid">
        {assignments.map(a => (
            <div key={a.id} className="card">
              <h3>{a.title}</h3>
              <p>Due: {a.due}</p>
              <p>Status: <span style={{ color: a.statusColor, fontWeight: 'bold' }}>{a.status}</span></p>
              
              {a.status === 'Pending' ? (
                  <>
                    <button className="action-button" onClick={() => handleUploadClick(a.id)}>
                      {activeUploadId === a.id ? 'Cancel Upload' : 'Upload Submission'}
                    </button>
                    {activeUploadId === a.id && (
                      <form onSubmit={(e) => handleSubmit(a.id, e)} style={{ marginTop: '16px', padding: '16px', background: '#f8fafc', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                        <h4 style={{ marginBottom: '12px', fontSize: '14px', color: '#334155' }}>Upload PDF Document:</h4>
                        <input 
                          type="file" 
                          accept=".pdf" 
                          required 
                          onChange={(e) => setFile(e.target.files[0])}
                          style={{ marginBottom: '12px', width: '100%', fontSize: '14px' }} 
                        />
                        <button 
                          type="submit" 
                          style={{ padding: '8px 16px', fontSize: '12px', fontWeight: 'bold', background: '#2563eb', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                        >
                          Submit Assignment
                        </button>
                      </form>
                    )}
                  </>
              ) : a.status === 'Submitted' ? (
                  <button className="action-button" style={{ background: '#e2e8f0', color: '#0f172a' }}>Submission Under Review</button>
              ) : (
                  <button 
                    style={{ padding: '12px 24px', fontSize: '12px', fontWeight: 800, border: 'none', cursor: 'pointer', textTransform: 'uppercase', letterSpacing: '0.5px', background: '#e2e8f0', color: '#0f172a', borderRadius: '8px' }} 
                    onClick={() => handleView(a.feedback)}
                  >
                      View Feedback
                  </button>
              )}
            </div>
        ))}
      </div>
    </div>
  );
}
