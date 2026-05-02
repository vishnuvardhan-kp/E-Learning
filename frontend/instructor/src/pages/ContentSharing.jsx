import { useState, useEffect } from 'react';
import * as BaseUI from '../components/BaseUI';

export default function ContentSharing(props) {
  const [modules, setModules] = useState([]);
  const [newTitle, setNewTitle] = useState('');
  const [activeFolder, setActiveFolder] = useState(null);

  const fetchContent = async () => {
    try {
      const res = await fetch('http://localhost:5000/content');
      const data = await res.json();
      setModules(data);
    } catch(e) {
      console.error(e);
    }
  };

  useEffect(() => {
    fetchContent();
  }, []);

  const handleAdd = async function() {
    const currentCourseId = props.activeCourse;
    if (newTitle && currentCourseId) {
      try {
          await fetch('http://localhost:5000/content', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                  title: newTitle,
                  courseId: currentCourseId,
                  items: 'Empty'
              })
          });
          setNewTitle('');
          fetchContent();
      } catch(e) {
          console.error(e);
      }
    } else {
      alert("Please select a Course from the top context dropdown first!");
    }
  };

  const onFileSelect = async function(event) {
    const file = event.target.files[0];
    
    if (file && activeFolder) {
        const realFileName = file.name;
        let newItems = '';
        if (activeFolder.items === 'Empty') {
            newItems = realFileName;
        } else {
            newItems = activeFolder.items + ', ' + realFileName;
        }

        try {
            await fetch(`http://localhost:5000/content/${activeFolder._id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ items: newItems })
            });
            alert("File '" + realFileName + "' captured and uploaded to " + activeFolder.title);
            setActiveFolder(null);
            fetchContent();
        } catch(e) {
            console.error(e);
        }
    }
  };

  return (
    <div>
      <h2 style={{ fontSize: '24px', marginBottom: '24px' }}>Course Content Sharing</h2>
      
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
      <BaseUI.BaseCard style={{ marginBottom: '32px', maxWidth: '500px', border: '2px solid #2563eb' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h3 style={{ margin: 0 }}>Folder: {activeFolder.title}</h3>
            <BaseUI.BaseButton variant="secondary" onClick={function(){ setActiveFolder(null) }}>Cancel</BaseUI.BaseButton>
        </div>
        
        <div style={{ padding: '30px', border: '2px dashed #cbd5e1', borderRadius: '12px', textAlign: 'center', background: '#f8fafc' }}>
            <p style={{ fontSize: '14px', color: '#64748b', marginBottom: '16px', fontWeight: 'bold' }}>
                Select a document (PDF, DOCX) to upload:
            </p>
            
            <input 
                type="file" 
                style={{ fontSize: '14px', color: '#475569' }} 
                onChange={onFileSelect} 
            />
        </div>
      </BaseUI.BaseCard>
      )}

      <h3 style={{ marginBottom: '16px' }}>Uploaded Folders</h3>
      
      {modules.map(function(mod) {
          const activeFilter = props.activeCourse;
          if (activeFilter && mod.courseId !== activeFilter) {
              return null;
          }

          let courseNameLabel = 'General/Other';
          if (props.courses) {
              const found = props.courses.find(function(c){ 
                  return c._id === mod.courseId;
              });
              if (found) { courseNameLabel = found.title; }
          }

          return (
            <BaseUI.BaseCard key={mod._id} style={{ marginBottom: '12px' }}>
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
