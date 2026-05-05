import { useState } from 'react';
import * as BaseUI from '../components/BaseUI';

/* 
   Parameter 2 - React Implementation: Reusable Components
   Simplicity: No Destructuring, Pure Functional Approach
*/

export default function CourseManagement(props) {
  const newTitleState = useState('');
  const newTitle = newTitleState[0];
  const setNewTitle = newTitleState[1];

  const createCourse = function() {
    if (newTitle.trim() && props.setCourses && props.courses) {
      const newCourse = { id: Date.now(), title: newTitle, enrolled: 0, status: 'Active' };
      const newList = [].concat([newCourse], props.courses);
      props.setCourses(newList);
      setNewTitle('');
    }
  };

  const deleteCourse = function(id) {
    if (props.setCourses && props.courses) {
      const newList = props.courses.filter(function(c) { return c.id !== id; });
      props.setCourses(newList);
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
            <BaseUI.BaseCard key={course.id}>
              <h3>{course.title}</h3>
              <BaseUI.BaseInfoRow label="Enrolled Students" value={course.enrolled} />
              <BaseUI.BaseInfoRow label="Current Status" value={course.status} />
              
              <div className="card-actions" style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
                <BaseUI.BaseButton variant="secondary">Edit Syllabus</BaseUI.BaseButton>
                <BaseUI.BaseButton 
                    style={{ background: '#ef4444', color: '#ffffff' }} 
                    onClick={function() { deleteCourse(course.id) }}
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
