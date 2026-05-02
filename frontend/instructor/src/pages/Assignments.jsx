import { useState, useEffect } from 'react';
import * as BaseUI from '../components/BaseUI';

export default function Assignments(props) {
  const [assignments, setAssignments] = useState([]);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newDeadline, setNewDeadline] = useState('');
  const [selectedCourse, setSelectedCourse] = useState('');
  const [evaluatingAssignment, setEvaluatingAssignment] = useState(null);
  const [submissions, setSubmissions] = useState([]);

  const fetchAssignments = async () => {
    try {
      const res = await fetch('http://localhost:5000/assignments');
      const data = await res.json();
      setAssignments(data);
    } catch(e) {
      console.error(e);
    }
  };

  const fetchSubmissions = async (assignmentId) => {
    try {
      const res = await fetch(`http://localhost:5000/submissions/${assignmentId}`);
      const data = await res.json();
      setSubmissions(data);
    } catch(e) {
      console.error(e);
    }
  };

  useEffect(() => {
    fetchAssignments();
  }, []);

  useEffect(() => {
    if (evaluatingAssignment) {
      fetchSubmissions(evaluatingAssignment._id);
    }
  }, [evaluatingAssignment]);

  const handleCreate = async function(e) {
    e.preventDefault();
    if (newTitle && newDeadline && selectedCourse) {
        try {
          await fetch('http://localhost:5000/assignments', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              title: newTitle,
              deadline: newDeadline,
              courseId: selectedCourse,
              submissionsCount: 0
            })
          });
          setShowCreateForm(false);
          setNewTitle('');
          setNewDeadline('');
          setSelectedCourse('');
          fetchAssignments();
        } catch (error) {
          console.error(error);
        }
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this assignment?")) {
      try {
        await fetch(`http://localhost:5000/assignments/${id}`, {
          method: 'DELETE'
        });
        fetchAssignments();
      } catch (e) {
        console.error(e);
      }
    }
  };

  const handleProvideFeedback = async function(subId, grade, feedback) {
    try {
      await fetch(`http://localhost:5000/submissions/${subId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ grade, feedback })
      });
      fetchSubmissions(evaluatingAssignment._id);
      fetchAssignments(); // Refresh submission count if needed
    } catch (e) {
      console.error(e);
    }
  };

  const filteredAssignments = props.activeCourse 
        ? assignments.filter(function(a) { return a.courseId === props.activeCourse }) 
        : assignments;

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2 style={{ fontSize: '24px', marginBottom: '24px' }}>
             Assignment Management {props.activeCourse ? '(Filtered by Context)' : ''}
        </h2>
        <BaseUI.BaseButton onClick={function() { setShowCreateForm(!showCreateForm) }}>
            {showCreateForm ? 'Cancel Creation' : 'Create Assignment'}
        </BaseUI.BaseButton>
      </div>

      {showCreateForm ? (
        <BaseUI.BaseCard style={{ marginBottom: '24px', background: '#f8fafc' }}>
            <form onSubmit={handleCreate}>
                <h3 style={{ marginBottom: '20px' }}>New Assignment</h3>
                <div style={{ marginBottom: '16px' }}>
                    <label style={{ display: 'block', fontSize: '11px', fontWeight: '900', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: '4px' }}>Linked Class/Course</label>
                    <select className="input-field" value={selectedCourse} onChange={function(e) { setSelectedCourse(e.target.value) }} required>
                       <option value="">Select Course...</option>
                       {props.courses ? props.courses.map(function(c) { return <option key={c._id} value={c._id}>{c.title}</option> }) : null}
                    </select>
                </div>
                <BaseUI.BaseInput 
                    label="Assignment Title" 
                    value={newTitle} 
                    onChange={function(e) { setNewTitle(e.target.value) }} 
                    required 
                />
                <BaseUI.BaseInput 
                    label="Deadline" 
                    type="date" 
                    value={newDeadline} 
                    onChange={function(e) { setNewDeadline(e.target.value) }} 
                    required 
                />
                <BaseUI.BaseButton type="submit">Publish Assignment</BaseUI.BaseButton>
            </form>
        </BaseUI.BaseCard>
      ) : null}
      
      <div className="card-grid">
        {filteredAssignments.map(function(a) {
            let courseTitle = 'Unknown Course';
            if (props.courses) {
                const foundCourse = props.courses.find(function(c) { return c._id === a.courseId });
                if (foundCourse) {
                    courseTitle = foundCourse.title;
                }
            }
            return (
              <BaseUI.BaseCard key={a._id}>
                <h3 style={{ marginBottom: '4px' }}>{a.title}</h3>
                <p style={{ color: '#2563eb', fontWeight: '600', fontSize: '14px', marginBottom: '16px' }}>{courseTitle}</p>
                <BaseUI.BaseInfoRow label="Deadline" value={a.deadline} />
                <BaseUI.BaseInfoRow label="Received" value={a.submissionsCount || 0} />
                
                <div className="card-actions" style={{ display: 'flex', gap: '10px', marginTop: '16px' }}>
                  <BaseUI.BaseButton onClick={function() { setEvaluatingAssignment(a) }}>Evaluate</BaseUI.BaseButton>
                  <BaseUI.BaseButton 
                    style={{ background: '#ef4444' }} 
                    onClick={() => handleDelete(a._id)}
                  >
                    Delete
                  </BaseUI.BaseButton>
                </div>
              </BaseUI.BaseCard>
            );
        })}
        {filteredAssignments.length === 0 && !showCreateForm ? <p>No assignments currently found.</p> : null}
      </div>
      
      {evaluatingAssignment ? (
        <BaseUI.BaseCard style={{ marginTop: '32px', background: '#f8fafc', border: '2px solid #cbd5e1' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
             <h3 style={{ margin: 0 }}>Evaluating: {evaluatingAssignment.title}</h3>
             <BaseUI.BaseButton 
                style={{ background: '#ef4444' }} 
                onClick={function() { setEvaluatingAssignment(null) }}
             >
                Close
             </BaseUI.BaseButton>
          </div>
          
          <div>
             {submissions.length === 0 ? (
                 <p style={{ color: '#64748b', fontStyle: 'italic' }}>No submissions found yet.</p>
             ) : (
                 submissions.map(function(sub) {
                     return (
                     <BaseUI.BaseCard key={sub._id} style={{ marginBottom: '16px', border: '1px solid #e2e8f0' }}>
                         <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px', alignItems: 'center' }}>
                             <span style={{ fontWeight: 'bold', fontSize: '18px', color: '#0f172a' }}>{sub.studentName}</span>
                             {sub.evaluated ? (
                                <span style={{ color: '#166534', fontWeight: 'bold', background: '#dcfce7', padding: '4px 12px', borderRadius: '20px', fontSize: '12px' }}>
                                    Graded: {sub.grade}
                                </span>
                             ) : null}
                         </div>
                         
                         <div style={{ marginBottom: '20px' }}>
                            <a href={sub.fileUrl} target="_blank" rel="noreferrer" style={{ color: '#2563eb', textDecoration: 'none', fontWeight: '600', fontSize: '14px' }}>
                               📄 View Submission File
                            </a>
                         </div>
                         
                         {!sub.evaluated ? (
                             <form onSubmit={function(e) { 
                               e.preventDefault(); 
                               handleProvideFeedback(sub._id, e.target.grade.value, e.target.feedback.value); 
                             }}>
                                 <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-end' }}>
                                    <div style={{ width: '150px' }}>
                                        <BaseUI.BaseInput name="grade" label="Grade" placeholder="e.g. A" required />
                                    </div>
                                    <div style={{ flex: 1 }}>
                                        <BaseUI.BaseInput name="feedback" label="Feedback" placeholder="Feedback notes..." required />
                                    </div>
                                    <div style={{ marginBottom: '20px' }}>
                                        <BaseUI.BaseButton type="submit">Save</BaseUI.BaseButton>
                                    </div>
                                 </div>
                             </form>
                         ) : (
                             <div style={{ padding: '16px', background: '#f1f5f9', borderRadius: '8px', borderLeft: '4px solid #10b981' }}>
                                 <p style={{ margin: 0, color: '#475569', fontStyle: 'italic', fontSize: '14px' }}>Instructor Feedback: {sub.feedback}</p>
                             </div>
                         )}
                     </BaseUI.BaseCard>
                 )})
             )}
          </div>
        </BaseUI.BaseCard>
      ) : null}
    </div>
  );
}
