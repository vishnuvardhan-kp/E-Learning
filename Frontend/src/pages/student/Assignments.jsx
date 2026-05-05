import { useState, useEffect } from 'react';
import { FileText, Clock, CheckCircle, AlertCircle, UploadCloud, ChevronRight, MessageSquare } from 'lucide-react';

export default function Assignments() {
  const [assignments, setAssignments] = useState([]);
  const [activeUploadId, setActiveUploadId] = useState(null);
  const [file, setFile] = useState(null);
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

        setAssignments(assignments.map(a => a._id === assignmentId ? { ...a, status: 'Submitted' } : a));
        setActiveUploadId(null);
        setFile(null);
      } catch (e) {
        console.error(e);
        alert('Failed to submit assignment.');
      }
    }
  };

  const handleView = (feedback) => {
      alert(`Instructor Feedback:\n\n${feedback || "No feedback available yet."}`);
  };

  const getStatusConfig = (status) => {
    switch (status) {
      case 'Submitted':
        return { color: '#3b82f6', bg: '#eff6ff', icon: <CheckCircle size={14} />, text: 'Submitted' };
      case 'Graded':
        return { color: '#10b981', bg: '#ecfdf5', icon: <CheckCircle size={14} />, text: 'Graded' };
      default:
        return { color: '#ef4444', bg: '#fef2f2', icon: <AlertCircle size={14} />, text: 'Pending' };
    }
  };

  return (
    <div className="animate-fade-in">
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '32px' }}>
        <div>
          <h2 style={{ fontSize: '28px', fontWeight: 900, color: '#1e1b4b', margin: 0, letterSpacing: '-1px' }}>Curriculum Tasks</h2>
          <p style={{ color: '#64748b', fontSize: '14px', marginTop: '4px' }}>Track your academic submissions and instructor feedback.</p>
        </div>
        <div style={{ padding: '8px 16px', background: 'white', borderRadius: '12px', border: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <FileText size={18} color="#6366f1" />
          <span style={{ fontWeight: 700, color: '#1e1b4b', fontSize: '14px' }}>{assignments.length} Total</span>
        </div>
      </div>

      <div className="card-grid">
        {assignments.map(a => {
            const status = a.status || 'Pending';
            const config = getStatusConfig(status);
            
            return (
            <div key={a._id} className="card" style={{ padding: '24px', position: 'relative', overflow: 'hidden' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' }}>
                <div style={{ padding: '10px', background: '#f5f7ff', borderRadius: '12px', color: '#6366f1' }}>
                  <FileText size={24} />
                </div>
                <div style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '6px', 
                  padding: '6px 12px', 
                  borderRadius: '100px', 
                  background: config.bg, 
                  color: config.color,
                  fontSize: '11px',
                  fontWeight: 800,
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px'
                }}>
                  {config.icon}
                  {config.text}
                </div>
              </div>

              <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#1e1b4b', marginBottom: '8px' }}>{a.title}</h3>
              
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#64748b', fontSize: '13px', marginBottom: '24px' }}>
                <Clock size={14} />
                <span>Due on <strong>{a.deadline}</strong></span>
              </div>
              
              {status === 'Pending' ? (
                  <>
                    <button 
                      className="student-btn"
                      onClick={() => handleUploadClick(a._id)}
                      style={{ 
                        width: '100%', 
                        background: activeUploadId === a._id ? '#f1f5f9' : '#6366f1',
                        color: activeUploadId === a._id ? '#475569' : 'white',
                        border: 'none',
                        padding: '12px',
                        borderRadius: '10px',
                        fontWeight: 700,
                        fontSize: '14px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '8px',
                        transition: 'all 0.2s'
                      }}
                    >
                      {activeUploadId === a._id ? 'Cancel' : <><UploadCloud size={18} /> Upload Submission</>}
                    </button>

                    {activeUploadId === a._id && (
                      <form onSubmit={(e) => handleSubmit(a._id, e)} className="animate-fade-in" style={{ marginTop: '16px', padding: '20px', background: '#f8fafc', borderRadius: '16px', border: '2px dashed #e2e8f0' }}>
                        <div style={{ textAlign: 'center', marginBottom: '16px' }}>
                          <div style={{ width: '48px', height: '48px', background: 'white', borderRadius: '12px', display: 'flex', alignItems: 'center', justifySelf: 'center', justifyContent: 'center', margin: '0 auto 12px', color: '#6366f1', border: '1px solid #e2e8f0' }}>
                            <UploadCloud size={24} />
                          </div>
                          <p style={{ margin: 0, fontSize: '13px', color: '#64748b', fontWeight: 500 }}>Select your assignment PDF</p>
                        </div>
                        
                        <input 
                          type="file" 
                          accept=".pdf" 
                          required 
                          onChange={(e) => setFile(e.target.files[0])}
                          style={{ marginBottom: '16px', width: '100%', fontSize: '12px', color: '#475569' }} 
                        />
                        
                        <button 
                          type="submit" 
                          style={{ 
                            width: '100%',
                            padding: '12px', 
                            fontSize: '14px', 
                            fontWeight: 800, 
                            background: '#1e1b4b', 
                            color: 'white', 
                            border: 'none', 
                            borderRadius: '10px', 
                            cursor: 'pointer',
                            boxShadow: '0 4px 12px rgba(30, 27, 75, 0.2)'
                          }}
                        >
                          Submit Now
                        </button>
                      </form>
                    )}
                  </>
              ) : status === 'Submitted' ? (
                  <div style={{ 
                    width: '100%', 
                    padding: '12px', 
                    background: '#f1f5f9', 
                    color: '#64748b', 
                    borderRadius: '10px', 
                    textAlign: 'center',
                    fontSize: '13px',
                    fontWeight: 700,
                    border: '1px solid #e2e8f0'
                  }}>
                    Under Instructor Review
                  </div>
              ) : (
                  <button 
                    className="student-btn"
                    onClick={() => handleView(a.feedback)}
                    style={{ 
                      width: '100%', 
                      background: 'white',
                      color: '#6366f1',
                      border: '1.5px solid #6366f1',
                      padding: '12px',
                      borderRadius: '10px',
                      fontWeight: 700,
                      fontSize: '14px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px',
                      transition: 'all 0.2s'
                    }}
                  >
                    <MessageSquare size={18} />
                    View Feedback
                    <ChevronRight size={16} />
                  </button>
              )}
            </div>
        )})}
        {assignments.length === 0 && (
          <div style={{ gridColumn: '1 / -1', padding: '60px', textAlign: 'center', background: 'white', borderRadius: '24px', border: '1px solid #e2e8f0' }}>
            <div style={{ width: '64px', height: '64px', background: '#f5f7ff', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px', color: '#6366f1' }}>
              <FileText size={32} />
            </div>
            <h3 style={{ color: '#1e1b4b', margin: '0 0 8px 0' }}>No Tasks Assigned</h3>
            <p style={{ color: '#64748b', margin: 0 }}>You're all caught up! There are no pending assignments at this time.</p>
          </div>
        )}
      </div>
    </div>
  );
}

