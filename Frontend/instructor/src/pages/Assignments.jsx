import { useState } from 'react';
import * as BaseUI from '../components/BaseUI';

/* 
   Parameter 2 - React Implementation: Reusable Components
   Simplicity: No Destructuring, Pure Functional Approach
*/

export default function Assignments(props) {
  const assignmentsState = useState([
    { id: 1, title: 'UI Design Mockup', deadline: '2026-04-10', courseId: 2, submissionsCount: 2 },
  ]);
  const assignments = assignmentsState[0];
  const setAssignments = assignmentsState[1];
  
  const showCreateFormState = useState(false);
  const showCreateForm = showCreateFormState[0];
  const setShowCreateForm = showCreateFormState[1];

  const newTitleState = useState('');
  const newTitle = newTitleState[0];
  const setNewTitle = newTitleState[1];

  const newDeadlineState = useState('');
  const newDeadline = newDeadlineState[0];
  const setNewDeadline = newDeadlineState[1];

  const selectedCourseState = useState('');
  const selectedCourse = selectedCourseState[0];
  const setSelectedCourse = selectedCourseState[1];

  const evaluatingAssignmentState = useState(null);
  const evaluatingAssignment = evaluatingAssignmentState[0];
  const setEvaluatingAssignment = evaluatingAssignmentState[1];
  
  const submissionsState = useState([
    { id: 101, assignmentId: 1, studentName: 'Alice Smith', fileUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf', grade: '', feedback: '', evaluated: false },
    { id: 102, assignmentId: 1, studentName: 'Bob Jones', fileUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf', grade: '', feedback: '', evaluated: false },
  ]);
  const submissions = submissionsState[0];
  const setSubmissions = submissionsState[1];

  const handleCreate = function(e) {
    e.preventDefault();
    if (newTitle && newDeadline && selectedCourse) {
        const newAssignment = {
            id: Date.now(),
            title: newTitle,
            deadline: newDeadline,
            courseId: Number(selectedCourse),
            submissionsCount: 0
        };
        const newList = [].concat(assignments, [newAssignment]);
        setAssignments(newList);
        setShowCreateForm(false);
        setNewTitle('');
        setNewDeadline('');
        setSelectedCourse('');
    }
  };

  const handleProvideFeedback = function(subId, grade, feedback) {
     const newSubmissions = submissions.map(function(s) {
         if (s.id === subId) {
             const updated = Object.assign({}, s);
             updated.grade = grade;
             updated.feedback = feedback;
             updated.evaluated = true;
             return updated;
         }
         return s;
     });
     setSubmissions(newSubmissions);
  };

  const filteredAssignments = props.activeCourse 
        ? assignments.filter(function(a) { return a.courseId === Number(props.activeCourse) }) 
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
                       {props.courses ? props.courses.map(function(c) { return <option key={c.id} value={c.id}>{c.title}</option> }) : null}
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
                const foundCourse = props.courses.find(function(c) { return c.id === a.courseId });
                if (foundCourse) {
                    courseTitle = foundCourse.title;
                }
            }
            return (
              <BaseUI.BaseCard key={a.id}>
                <h3 style={{ marginBottom: '4px' }}>{a.title}</h3>
                <p style={{ color: '#2563eb', fontWeight: '600', fontSize: '14px', marginBottom: '16px' }}>{courseTitle}</p>
                <BaseUI.BaseInfoRow label="Deadline" value={a.deadline} />
                <BaseUI.BaseInfoRow label="Received" value={a.submissionsCount} />
                
                <div className="card-actions" style={{ display: 'flex', gap: '10px', marginTop: '16px' }}>
                  <BaseUI.BaseButton onClick={function() { setEvaluatingAssignment(a) }}>Evaluate</BaseUI.BaseButton>
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
             {submissions.filter(function(s) { return s.assignmentId === evaluatingAssignment.id }).length === 0 ? (
                 <p style={{ color: '#64748b', fontStyle: 'italic' }}>No submissions found yet.</p>
             ) : (
                 submissions.filter(function(s) { return s.assignmentId === evaluatingAssignment.id }).map(function(sub) {
                     return (
                     <BaseUI.BaseCard key={sub.id} style={{ marginBottom: '16px', border: '1px solid #e2e8f0' }}>
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
                             <form onSubmit={function(e) { e.preventDefault(); handleProvideFeedback(sub.id, e.target.grade.value, e.target.feedback.value); }}>
                                 <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-end' }}>
                                    <div style={{ width: '150px' }}>
                                        <BaseUI.BaseInput label="Grade" placeholder="e.g. A" required />
                                    </div>
                                    <div style={{ flex: 1 }}>
                                        <BaseUI.BaseInput label="Feedback" placeholder="Feedback notes..." required />
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
