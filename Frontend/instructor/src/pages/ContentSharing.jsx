import { useState } from 'react';
import * as BaseUI from '../components/BaseUI';

/* 
   Content Hub: SIMPLEST VERSION (Viva Ready)
   - Real HTML File Input for "Uploading" documents
   - No destructuring
*/

export default function ContentSharing(props) {
  // 1. Module data
  const modulesState = useState([
    { id: 1, title: 'Introduction & Syllabus', courseId: 1, items: 'Guide.pdf, Intro.mp4' },
    { id: 2, title: 'Week 1: Fundamentals', courseId: 2, items: 'Notes.pdf' }
  ]);
  const modules = modulesState[0];
  const setModules = modulesState[1];

  // 2. State for folder creation
  const newTitleState = useState('');
  const newTitle = newTitleState[0];
  const setNewTitle = newTitleState[1];

  // 3. State for file management view
  const activeFolderState = useState(null);
  const activeFolder = activeFolderState[0];
  const setActiveFolder = activeFolderState[1];

  // Logic: Create new folder/module
  const handleAdd = function() {
    const currentCourseId = props.activeCourse;
    if (newTitle && currentCourseId) {
      const newModule = {
        id: Date.now(),
        title: newTitle,
        courseId: Number(currentCourseId),
        items: 'Empty'
      };
      const newList = [].concat(modules, [newModule]);
      setModules(newList);
      setNewTitle('');
    } else {
      alert("Please select a Course from the top context dropdown first!");
    }
  };

  // Logic: Handle real file selection from the browser
  const onFileSelect = function(event) {
    const file = event.target.files[0]; // Get the first file selected
    
    if (file && activeFolder) {
        const realFileName = file.name;
        
        const newList = modules.map(function(m) {
            if (m.id === activeFolder.id) {
                const updated = Object.assign({}, m);
                // Append the real file name to the items list
                if (updated.items === 'Empty') {
                    updated.items = realFileName;
                } else {
                    updated.items = updated.items + ', ' + realFileName;
                }
                return updated;
            }
            return m;
        });
        
        setModules(newList);
        alert("File '" + realFileName + "' captured and uploaded locally to " + activeFolder.title);
        setActiveFolder(null); // Close the view
    }
  };

  return (
    <div>
      <h2 style={{ fontSize: '24px', marginBottom: '24px' }}>Course Content Sharing</h2>
      
      {/* 1. FOLDER CREATION VIEW */}
      {!activeFolder ? (
      <BaseUI.BaseCard style={{ marginBottom: '32px', maxWidth: '500px' }}>
        <h3>Share New Material Folder</h3>
        <p style={{ fontSize: '13px', color: '#64748b', marginBottom: '20px' }}>
             Step 1: Set course in top context bar.<br/>
             Step 2: Enter folder name below.
        </p>

        <BaseUI.BaseInput 
            label="Folder Name" 
            placeholder="e.g. Chapter 1: Introduction" 
            value={newTitle} 
            onChange={function(e){ setNewTitle(e.target.value) }} 
        />
        <BaseUI.BaseButton onClick={handleAdd}>Create Folder</BaseUI.BaseButton>
      </BaseUI.BaseCard>
      ) : (
      /* 2. REAL FILE UPLOAD VIEW */
      <BaseUI.BaseCard style={{ marginBottom: '32px', maxWidth: '500px', border: '2px solid #2563eb' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h3 style={{ margin: 0 }}>Folder: {activeFolder.title}</h3>
            <BaseUI.BaseButton variant="secondary" onClick={function(){ setActiveFolder(null) }}>Cancel</BaseUI.BaseButton>
        </div>
        
        <div style={{ padding: '30px', border: '2px dashed #cbd5e1', borderRadius: '12px', textAlign: 'center', background: '#f8fafc' }}>
            <p style={{ fontSize: '14px', color: '#64748b', marginBottom: '16px', fontWeight: 'bold' }}>
                Select a document (PDF, DOCX) to upload:
            </p>
            
            {/* REAL HTML FILE INPUT */}
            <input 
                type="file" 
                style={{ fontSize: '14px', color: '#475569' }} 
                onChange={onFileSelect} 
            />
        </div>
      </BaseUI.BaseCard>
      )}

      {/* 3. FOLDER DISPLAY LIST */}
      <h3 style={{ marginBottom: '16px' }}>Uploaded Folders</h3>
      
      {modules.map(function(mod) {
          const activeFilter = props.activeCourse;
          if (activeFilter && Number(mod.courseId) !== Number(activeFilter)) {
              return null;
          }

          let courseNameLabel = 'General/Other';
          if (props.courses) {
              const found = props.courses.find(function(c){ 
                  return Number(c.id) === Number(mod.courseId) 
              });
              if (found) { courseNameLabel = found.title; }
          }

          return (
            <BaseUI.BaseCard key={mod.id} style={{ marginBottom: '12px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <h4 style={{ margin: 0, fontSize: '18px' }}>📁 {mod.title}</h4>
                  <p style={{ margin: '4px 0', fontSize: '12px', color: '#2563eb', fontWeight: 'bold' }}>
                    Linked Course: {courseNameLabel}
                  </p>
                </div>
                <div>
                  <BaseUI.BaseButton variant="secondary" onClick={function(){ setActiveFolder(mod) }}>
                     Upload PDF/Doc
                  </BaseUI.BaseButton>
                </div>
              </div>
              <div style={{ marginTop: '10px', fontSize: '13px', color: '#64748b' }}>
                  <strong>Files in Folder:</strong> {mod.items}
              </div>
            </BaseUI.BaseCard>
          );
      })}
    </div>
  );
}
