import { useState, useEffect } from 'react';

export default function Assignments() {
  const [assignments, setAssignments] = useState([]);
  const [activeUploadId, setActiveUploadId] = useState(null);
  const [file, setFile] = useState(null);
  const [submissions, setSubmissions] = useState([]);
  const [user, setUser] = useState({});

  const fetchAssignments = async () => {
    try {
      const res = await fetch(__API_URL__ + '/assignments');
      const data = await res.json();
      setAssignments(data);
    } catch(e) {
      console.error(e);
    }
  };

  const fetchUserSubmissions = async (studentId) => {
    // This is a bit simplified, ideally we'd have a specific route or filter
    try {
      // For simplicity, we'll fetch assignments and then for each check if a submission exists
      // In a real app, you'd fetch student specific submission status
      const res = await fetch(__API_URL__ + '/content'); // reusing a fetch pattern
      // Let's assume we fetch all submissions and filter for the user
      // But for now, we'll just handle the local state update after submission
    } catch (e) {}
  };

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem('user') || '{}');
    setUser(storedUser);
    fetchAssignments();
  }, []);

  const handleUploadClick = (id) => {
    setActiveUploadId(activeUploadId === id ? null : id);
    setFile(null);
  };

  const handleSubmit = async (assignmentId, e) => {
    e.preventDefault();
    if (file) {
      try {
        // In a real app, you'd upload to S3/Cloudinary and get a URL.
        // Here we'll simulate a file URL.
        const fileUrl = URL.createObjectURL(file);
        
        await fetch(__API_URL__ + '/submissions', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            assignmentId,
            studentId: user._id,
            studentName: user.username,
            fileUrl: fileUrl,
            fileName: file.name
          })
        });

        // Update local status to reflect submission
        setAssignments(assignments.map(a => a._id === assignmentId ? { ...a, status: 'Submitted', statusColor: '#3b82f6' } : a));
        setActiveUploadId(null);
        setFile(null);
        alert('Assignment submitted successfully!');
      } catch (e) {
        console.error(e);
        alert('Failed to submit assignment.');
      }
    }
  };

  const handleView = (feedback) => {
      alert(`Instructor Feedback:\n\n${feedback || "No feedback available yet."}`);
  };

  return (
    <div>
      <h2 style={{ fontSize: '24px', marginBottom: '24px' }}>Assignment Submissions</h2>
      <div className="card-grid">
        {assignments.map(a => {
            const status = a.status || 'Pending';
            const statusColor = a.statusColor || '#ef4444';
            
            return (
            <div key={a._id} className="card">
              <h3>{a.title}</h3>
              <p>Due: {a.deadline}</p>
              <p>Status: <span style={{ color: statusColor, fontWeight: 'bold' }}>{status}</span></p>
              
              {status === 'Pending' ? (
                  <>
                    <button className="action-button" onClick={() => handleUploadClick(a._id)}>
                      {activeUploadId === a._id ? 'Cancel Upload' : 'Upload Submission'}
                    </button>
                    {activeUploadId === a._id && (
                      <form onSubmit={(e) => handleSubmit(a._id, e)} style={{ marginTop: '16px', padding: '16px', background: '#f8fafc', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
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
              ) : status === 'Submitted' ? (
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
        )})}
        {assignments.length === 0 && <p>No assignments to display.</p>}
      </div>
    </div>
  );
}
