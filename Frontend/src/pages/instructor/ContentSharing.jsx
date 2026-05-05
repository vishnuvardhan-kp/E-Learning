import { useState, useEffect } from 'react';
import { API_URL } from '../../api/backend';
import { Folder, UploadCloud, Plus, X, FileText, CheckCircle, AlertTriangle, Search, Filter, BookOpen } from 'lucide-react';

export default function ContentSharing(props) {
  const [modules, setModules] = useState([]);
  const [newTitle, setNewTitle] = useState('');
  const [activeFolder, setActiveFolder] = useState(null);
  const [search, setSearch] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [msg, setMsg] = useState({ text: '', type: '' });

  const fetchContent = async () => {
    try {
      const res = await fetch(`${API_URL}/content?t=${Date.now()}`);
      const data = await res.json();
      setModules(data);
    } catch(e) {
      console.error(e);
    }
  };

  useEffect(() => {
    fetchContent();
  }, []);

  const showMessage = (text, type = 'success') => {
    setMsg({ text, type });
    setTimeout(() => setMsg({ text: '', type: '' }), 4000);
  };

  const handleAdd = async function() {
    const currentCourseId = props.activeCourse;
    if (newTitle && currentCourseId) {
      try {
          await fetch(`${API_URL}/content`, {
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
          showMessage('Folder created successfully!');
      } catch(e) {
          console.error(e);
          showMessage('Failed to create folder.', 'error');
      }
    } else {
      showMessage("Please select a Course from the top context dropdown first!", "error");
    }
  };

  const onFileSelect = async function(event) {
    const file = event.target.files[0];
    
    if (file && activeFolder) {
        setIsUploading(true);
        const realFileName = file.name;
        let newItems = '';
        if (activeFolder.items === 'Empty') {
            newItems = realFileName;
        } else {
            // Check if it already has files, append it
            newItems = activeFolder.items + ', ' + realFileName;
        }

        try {
            await fetch(`${API_URL}/content/${activeFolder._id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ items: newItems })
            });
            showMessage(`File '${realFileName}' securely uploaded to ${activeFolder.title}`);
            setActiveFolder(null);
            fetchContent();
        } catch(e) {
            console.error(e);
            showMessage('Upload failed. Network error.', 'error');
        } finally {
            setIsUploading(false);
        }
    }
  };

  const filtered = modules.filter(mod => {
    const activeFilter = props.activeCourse;
    if (activeFilter && mod.courseId !== activeFilter) return false;
    if (search && !mod.title.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  return (
    <div className="module-container">
      <style>{`
        .content-hero {
          background: linear-gradient(135deg, #1e1b4b 0%, #4338ca 100%);
          border-radius: 24px; padding: 32px 40px; color: #fff; margin-bottom: 32px;
          display: flex; justify-content: space-between; align-items: center;
          box-shadow: 0 20px 40px -10px rgba(67, 56, 202, 0.3);
          position: relative; overflow: hidden;
        }
        .content-hero::after {
          content: ''; position: absolute; right: -30px; bottom: -50px;
          width: 200px; height: 200px; background: radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%);
        }
        .hero-title { font-size: 28px; font-weight: 900; margin: 0 0 8px; letter-spacing: -1px; }
        .hero-subtitle { font-size: 15px; color: #e0e7ff; margin: 0; font-weight: 500; opacity: 0.9; }

        .content-grid { display: grid; grid-template-columns: 1fr 2fr; gap: 32px; align-items: start; }
        
        .creation-card {
          background: #fff; border-radius: 24px; padding: 28px;
          border: 1.5px solid var(--border-color);
          box-shadow: var(--shadow-sm); position: sticky; top: 100px;
        }
        .creation-header { margin-bottom: 24px; }
        .creation-header h3 { font-size: 18px; font-weight: 800; color: var(--text-main); margin: 0 0 8px; }
        .creation-header p { font-size: 13px; color: #64748b; margin: 0; line-height: 1.5; }
        
        .input-group { margin-bottom: 20px; }
        .input-group label { display: block; font-size: 12px; font-weight: 800; color: #64748b; margin-bottom: 8px; text-transform: uppercase; }
        .premium-input {
          width: 100%; padding: 14px 16px; border-radius: 12px;
          border: 1.5px solid #e2e8f0; font-size: 14px; font-weight: 600;
          transition: all 0.2s; background: #f8fafc; color: var(--text-main);
        }
        .premium-input:focus { outline: none; border-color: #6366f1; background: #fff; box-shadow: 0 0 0 4px #e0e7ff; }
        
        .btn-create {
          width: 100%; padding: 14px; border-radius: 12px;
          background: #2563eb; color: #fff; font-weight: 800; font-size: 14px;
          border: none; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 8px;
          transition: all 0.2s;
        }
        .btn-create:hover { background: #1d4ed8; transform: translateY(-2px); box-shadow: 0 8px 20px -4px rgba(37, 99, 235, 0.4); }

        .folder-card {
          background: #fff; border-radius: 20px; padding: 24px;
          border: 1.5px solid var(--border-color); margin-bottom: 16px;
          transition: all 0.3s;
        }
        .folder-card:hover { transform: translateY(-4px); border-color: #a5b4fc; box-shadow: var(--shadow-md); }
        .folder-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 16px; }
        
        .folder-title-group { display: flex; gap: 16px; align-items: center; }
        .folder-icon { width: 48px; height: 48px; border-radius: 14px; background: #eff6ff; color: #2563eb; display: flex; align-items: center; justify-content: center; }
        .folder-title { font-size: 18px; font-weight: 800; color: var(--text-main); margin: 0 0 4px; }
        .folder-course { font-size: 12px; font-weight: 700; color: #6366f1; background: #e0e7ff; padding: 4px 10px; border-radius: 6px; display: inline-block; }
        
        .btn-upload {
          padding: 10px 16px; border-radius: 10px; font-size: 13px; font-weight: 700;
          background: #fff; border: 1.5px solid #e2e8f0; color: #475569;
          cursor: pointer; display: flex; align-items: center; gap: 6px; transition: all 0.2s;
        }
        .btn-upload:hover { border-color: #2563eb; color: #2563eb; background: #eff6ff; }
        
        .folder-files { background: #f8fafc; border-radius: 12px; padding: 16px; border: 1px solid #f1f5f9; display: flex; align-items: flex-start; gap: 12px; }
        .folder-files p { margin: 0; font-size: 13px; color: #64748b; line-height: 1.5; font-weight: 500; }
        .file-pill { display: inline-flex; align-items: center; gap: 6px; background: #fff; border: 1px solid #e2e8f0; padding: 4px 10px; border-radius: 8px; font-size: 12px; font-weight: 700; color: #475569; margin: 4px 4px 0 0; }

        .upload-modal {
          background: #fff; border-radius: 20px; padding: 32px;
          border: 2px solid #6366f1; box-shadow: 0 20px 40px rgba(99,102,241,0.15);
          margin-bottom: 24px; position: relative; animation: slideDown 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
        @keyframes slideDown { from { opacity: 0; transform: translateY(-20px); } to { opacity: 1; transform: translateY(0); } }
        
        .upload-zone {
          border: 2px dashed #c7d2fe; border-radius: 16px; padding: 40px 20px;
          text-align: center; background: #f8fafc; transition: all 0.2s;
          position: relative; overflow: hidden;
        }
        .upload-zone:hover { border-color: #6366f1; background: #eff6ff; }
        .upload-zone input[type="file"] { position: absolute; top: 0; left: 0; width: 100%; height: 100%; opacity: 0; cursor: pointer; }
        
        @media (max-width: 1024px) {
          .content-grid { grid-template-columns: 1fr; }
          .creation-card { position: static; margin-bottom: 24px; }
        }
      `}</style>

      {/* HEADER */}
      <div className="content-hero animate-fade-in">
        <div>
          <h1 className="hero-title">Content Distribution</h1>
          <p className="hero-subtitle">Organize and deploy academic materials directly to your student cohorts.</p>
        </div>
        <div className="hide-mobile">
          <BookOpen size={64} style={{ opacity: 0.2 }} />
        </div>
      </div>

      {msg.text && (
        <div style={{ padding: '16px 20px', borderRadius: '16px', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '12px', background: msg.type === 'error' ? '#fef2f2' : '#f0fdf4', color: msg.type === 'error' ? '#ef4444' : '#16a34a', border: `1px solid ${msg.type === 'error' ? '#fecaca' : '#bbf7d0'}`, fontWeight: 700, fontSize: '14px', animation: 'slideDown 0.3s' }}>
          {msg.type === 'error' ? <AlertTriangle size={20} /> : <CheckCircle size={20} />}
          {msg.text}
        </div>
      )}

      <div className="content-grid">
        {/* LEFT COLUMN: CREATION */}
        <div>
          {!activeFolder ? (
            <div className="creation-card animate-fade-in">
              <div className="creation-header">
                <h3>Create New Folder</h3>
                <p>1. Select a course from the top navigation context.<br/>2. Name your module folder below.</p>
              </div>
              <div className="input-group">
                <label>Folder Designation</label>
                <input 
                  className="premium-input"
                  placeholder="e.g. Week 1: Core Fundamentals" 
                  value={newTitle} 
                  onChange={e => setNewTitle(e.target.value)} 
                />
              </div>
              <button className="btn-create" onClick={handleAdd}>
                <Plus size={18} />
                Generate Folder
              </button>
            </div>
          ) : (
            <div className="upload-modal">
              <button style={{ position: 'absolute', top: '16px', right: '16px', background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer' }} onClick={() => setActiveFolder(null)}>
                <X size={20} />
              </button>
              <h3 style={{ margin: '0 0 8px 0', fontSize: '18px', fontWeight: 800 }}>Upload to: {activeFolder.title}</h3>
              <p style={{ margin: '0 0 24px 0', fontSize: '13px', color: '#64748b' }}>Select a local document to securely distribute to the enrolled cohort.</p>
              
              <div className="upload-zone">
                <UploadCloud size={40} color="#818cf8" style={{ marginBottom: '16px' }} />
                <h4 style={{ margin: '0 0 4px 0', fontSize: '15px', fontWeight: 700, color: '#1e293b' }}>
                  {isUploading ? 'Uploading...' : 'Click or drag file to upload'}
                </h4>
                <p style={{ margin: 0, fontSize: '12px', color: '#94a3b8' }}>Supports PDF, DOCX, PPTX (Max 25MB)</p>
                <input type="file" onChange={onFileSelect} disabled={isUploading} />
              </div>
            </div>
          )}
        </div>

        {/* RIGHT COLUMN: FOLDER LIST */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h2 style={{ fontSize: '20px', fontWeight: 800, margin: 0, color: '#1e293b' }}>Active Modules</h2>
            <div style={{ display: 'flex', alignItems: 'center', background: '#fff', border: '1.5px solid #e2e8f0', borderRadius: '10px', padding: '8px 12px', gap: '8px', width: '250px' }}>
              <Search size={16} color="#94a3b8" />
              <input 
                placeholder="Search folders..." 
                value={search} 
                onChange={e => setSearch(e.target.value)}
                style={{ border: 'none', outline: 'none', width: '100%', fontSize: '13px', fontWeight: 600 }}
              />
            </div>
          </div>

          <div className="folder-list">
            {filtered.map(mod => {
              let courseNameLabel = 'General Resource';
              if (props.courses) {
                  const found = props.courses.find(c => c._id === mod.courseId);
                  if (found) courseNameLabel = found.title;
              }

              const files = mod.items === 'Empty' ? [] : mod.items.split(', ');

              return (
                <div key={mod._id} className="folder-card animate-fade-in">
                  <div className="folder-header">
                    <div className="folder-title-group">
                      <div className="folder-icon"><Folder size={24} /></div>
                      <div>
                        <h4 className="folder-title">{mod.title}</h4>
                        <span className="folder-course">{courseNameLabel}</span>
                      </div>
                    </div>
                    <button className="btn-upload" onClick={() => setActiveFolder(mod)}>
                      <UploadCloud size={16} />
                      <span className="hide-mobile">Add Material</span>
                    </button>
                  </div>
                  
                  <div className="folder-files">
                    <FileText size={16} color="#94a3b8" style={{ marginTop: '2px' }} />
                    <div style={{ flex: 1 }}>
                      {files.length === 0 ? (
                        <p>No materials uploaded yet. Folder is empty.</p>
                      ) : (
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                          {files.map((file, idx) => (
                            <span key={idx} className="file-pill">
                              {file}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}

            {filtered.length === 0 && (
              <div style={{ textAlign: 'center', padding: '60px', background: '#f8fafc', borderRadius: '20px', border: '2px dashed #cbd5e1' }}>
                <Folder size={40} color="#94a3b8" style={{ marginBottom: '16px' }} />
                <h4 style={{ margin: '0 0 8px 0', fontSize: '16px', color: '#475569' }}>No Folders Found</h4>
                <p style={{ margin: 0, fontSize: '14px', color: '#64748b' }}>Select a course context and create your first module folder.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
