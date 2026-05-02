import { useState } from 'react';
import * as BaseUI from '../components/BaseUI';

export default function CourseManagement(props) {
  const [newTitle, setNewTitle] = useState('');

  const createCourse = async () => {
    if (newTitle.trim()) {
      try {
        await fetch('http://localhost:5000/courses', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ title: newTitle, enrolled: 0, status: 'Active' })
        });
        setNewTitle('');
        if (props.refreshCourses) {
          props.refreshCourses();
        }
      } catch (e) {
        console.error(e);
      }
    }
  };

  const deleteCourse = async function(id) {
    try {
        await fetch(`http://localhost:5000/courses/${id}`, {
            method: 'DELETE'
        });
        if (props.refreshCourses) {
            props.refreshCourses();
        }
    } catch(e) {
        console.error(e);
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2 style={{ fontSize: '24px', marginBottom: '24px' }}>Course Management</h2>
      </div>
      
      <BaseUI.BaseCard style={{ marginBottom: '32px', maxWidth: '600px' }}>
        <h3 style={{ marginBottom: '20px' }}>Quick Course Setup</h3>
        <BaseUI.BaseInput 
            label="Course Title" 
            placeholder="e.g. Intro to ML CS443" 
            value={newTitle} 
            onChange={function(e) { setNewTitle(e.target.value) }} 
        />
        <BaseUI.BaseButton onClick={createCourse}>Create New Course</BaseUI.BaseButton>
      </BaseUI.BaseCard>

      <h3 style={{ marginBottom: '16px' }}>Active Staff Classes</h3>
      <div className="card-grid" style={{ marginTop: 0 }}>
        {props.courses ? props.courses.map(function(course) {
            return (
            <BaseUI.BaseCard key={course._id}>
              <h3>{course.title}</h3>
              <BaseUI.BaseInfoRow label="Enrolled Students" value={course.enrolled || 0} />
              <BaseUI.BaseInfoRow label="Current Status" value={course.status || 'Active'} />
              
              <div className="card-actions" style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
                <BaseUI.BaseButton variant="secondary">Edit Syllabus</BaseUI.BaseButton>
                <BaseUI.BaseButton 
                    style={{ background: '#ef4444', color: '#ffffff' }} 
                    onClick={function() { deleteCourse(course._id) }}
                >
                  Delete
                </BaseUI.BaseButton>
              </div>
            </BaseUI.BaseCard>
        )}) : null}
        {props.courses && props.courses.length === 0 ? (
            <p style={{ color: '#64748b', fontStyle: 'italic' }}>No classes currently taught. Start by creating one above.</p>
        ) : null}
      </div>
    </div>
  );
}
