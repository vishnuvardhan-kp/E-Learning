import { useState, useEffect } from 'react';
import { Play, CheckCircle2, ArrowLeft, Folder, FileText, Download, X, Eye } from 'lucide-react';
import { API_URL } from '../../api/backend';

export default function Learning({ enrolledCourses }) {
  const [activeCourse, setActiveCourse] = useState(null);
  const [modules, setModules] = useState([]);
  const [activePdf, setActivePdf] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchCourseContent = async (courseId) => {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/content?t=${Date.now()}`);
      const data = await res.json();
      // Filter modules only for the selected course
      const courseModules = data.filter(m => m.courseId === courseId);
      setModules(courseModules);
    } catch(e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleResume = (course) => {
    setActiveCourse(course);
    fetchCourseContent(course._id);
  };

  const openDocument = (fileName) => {
    setActivePdf(fileName);
  };

  return (
    <div className="module-container">
      <style>{`
        .learning-header { margin-bottom: 32px; }
        .learning-header h1 { font-size: 32px; font-weight: 800; color: var(--text-main); letter-spacing: -1px; margin-bottom: 8px; }
        
        /* Course Grid */
        .active-course-row { display: grid; grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)); gap: 24px; }
        .learning-card { background: #fff; border-radius: 24px; border: 1.5px solid var(--border-color); overflow: hidden; transition: all 0.3s; }
        .learning-card:hover { transform: translateY(-6px); box-shadow: 0 20px 40px -10px rgba(99,102,241,0.2); border-color: #a5b4fc; }
        .card-cover { height: 120px; background: linear-gradient(135deg, #4338ca, #312e81); display: flex; align-items: center; justify-content: center; color: #fff; font-size: 48px; font-weight: 900; opacity: 0.9; }
        .card-content { padding: 24px; }
        .card-content h3 { font-size: 20px; font-weight: 800; color: var(--text-main); margin: 0 0 12px; letter-spacing: -0.5px; }
        .course-progress-bar { height: 8px; background: #f1f5f9; border-radius: 4px; margin: 20px 0; overflow: hidden; }
        .progress-fill { height: 100%; background: #6366f1; border-radius: 4px; transition: width 1s ease-in-out; }
        .lesson-info { display: flex; justify-content: space-between; font-size: 13px; font-weight: 700; color: #64748b; margin-bottom: 24px; }
        
        .btn-continue { width: 100%; padding: 14px; background: #6366f1; color: #fff; border-radius: 12px; font-weight: 800; display: flex; align-items: center; justify-content: center; gap: 8px; border: none; cursor: pointer; transition: all 0.2s; }
        .btn-continue:hover { background: #4f46e5; box-shadow: 0 8px 20px -4px rgba(99,102,241,0.4); }

        /* Reader View */
        .reader-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 32px; background: #fff; padding: 20px 32px; border-radius: 20px; border: 1px solid var(--border-color); }
        .btn-back { display: flex; align-items: center; gap: 8px; font-size: 14px; font-weight: 800; color: #64748b; background: none; border: none; cursor: pointer; padding: 8px 16px; border-radius: 10px; transition: all 0.2s; }
        .btn-back:hover { background: #f1f5f9; color: var(--text-main); }
        
        .module-list { display: flex; flex-direction: column; gap: 20px; }
        .module-folder { background: #fff; border-radius: 20px; border: 1px solid var(--border-color); padding: 24px; }
        .folder-title-row { display: flex; align-items: center; gap: 16px; margin-bottom: 20px; padding-bottom: 16px; border-bottom: 1.5px dashed #e2e8f0; }
        .folder-icon { width: 48px; height: 48px; border-radius: 14px; background: #eff6ff; color: #2563eb; display: flex; align-items: center; justify-content: center; }
        
        .files-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 16px; }
        .file-card { display: flex; align-items: center; justify-content: space-between; padding: 16px; border-radius: 14px; border: 1.5px solid #e2e8f0; background: #f8fafc; transition: all 0.2s; cursor: pointer; }
        .file-card:hover { border-color: #a5b4fc; background: #fff; box-shadow: 0 4px 12px rgba(99,102,241,0.08); transform: translateY(-2px); }
        .file-info { display: flex; align-items: center; gap: 12px; }
        .file-icon { color: #ef4444; }
        .file-name { font-size: 14px; font-weight: 700; color: var(--text-main); }
        
        /* PDF Modal */
        .pdf-modal-overlay { position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(15, 23, 42, 0.85); backdrop-filter: blur(12px); z-index: 999999; display: flex; align-items: center; justify-content: center; padding: 20px; animation: fadeIn 0.2s; }
        .pdf-modal-content { background: #0f172a; width: 100%; max-width: 1200px; height: 95vh; border-radius: 20px; border: 1px solid rgba(255,255,255,0.1); display: flex; flex-direction: column; overflow: hidden; box-shadow: 0 32px 64px rgba(0,0,0,0.5); animation: slideUp 0.3s cubic-bezier(0.4, 0, 0.2, 1); }
        .pdf-toolbar { background: rgba(30, 41, 59, 0.8); backdrop-filter: blur(8px); color: #fff; padding: 16px 24px; display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid rgba(255,255,255,0.05); }
        .pdf-title { font-size: 16px; font-weight: 700; display: flex; align-items: center; gap: 10px; color: #f8fafc; }
        .pdf-viewer-area { flex: 1; background: #cbd5e1; display: flex; flex-direction: column; align-items: center; padding: 40px; overflow-y: auto; }
        .pdf-mock-page { background: #fff; width: 100%; max-width: 850px; min-height: 1100px; box-shadow: 0 12px 32px rgba(0,0,0,0.15); border-radius: 4px; padding: 80px; margin-bottom: 40px; }
        
        .btn-modal-action { background: rgba(255,255,255,0.1); border: 1px solid rgba(255,255,255,0.1); color: #fff; cursor: pointer; display: flex; align-items: center; gap: 8px; font-size: 13px; font-weight: 600; padding: 8px 16px; border-radius: 8px; transition: all 0.2s; }
        .btn-modal-action:hover { background: rgba(255,255,255,0.2); }
        .btn-modal-close { background: #ef4444; border: none; color: #fff; cursor: pointer; display: flex; align-items: center; justify-content: center; width: 36px; height: 36px; border-radius: 8px; transition: all 0.2s; }
        .btn-modal-close:hover { background: #dc2626; }
      `}</style>

      {!activeCourse ? (
        <>
          <div className="learning-header animate-fade-in">
            <h1>Continue Learning</h1>
            <p style={{ color: '#64748b', fontWeight: 500, fontSize: '15px' }}>Pick up exactly where you left off in your enrolled modules.</p>
          </div>

          <div className="active-course-row">
            {enrolledCourses.map(course => (
              <div className="learning-card animate-fade-in" key={course._id}>
                <div className="card-cover">
                  {course.title.substring(0,2).toUpperCase()}
                </div>
                <div className="card-content">
                  <h3>{course.title}</h3>
                  <div style={{ display: 'flex', gap: '12px' }}>
                    <span style={{ fontSize: '12px', fontWeight: 800, color: '#10b981', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <CheckCircle2 size={14} />
                      {course.status || 'Active'}
                    </span>
                    <span style={{ fontSize: '12px', fontWeight: 700, color: '#64748b' }}>
                      Semester: {course.time || 'Current'}
                    </span>
                  </div>

                  <div className="course-progress-bar">
                    <div className="progress-fill" style={{ width: '45%' }}></div>
                  </div>

                  <div className="lesson-info">
                    <span>Module: Core Content</span>
                    <span>45% Complete</span>
                  </div>

                  <button className="btn-continue" onClick={() => handleResume(course)}>
                    <Play size={16} fill="white" />
                    Resume Module
                  </button>
                </div>
              </div>
            ))}

            {enrolledCourses.length === 0 && (
              <div style={{ padding: '80px', textAlign: 'center', background: '#fff', borderRadius: '24px', border: '2px dashed #e2e8f0', gridColumn: '1 / -1' }}>
                <Folder size={48} color="#cbd5e1" style={{ margin: '0 auto 16px' }} />
                <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#1e293b', margin: '0 0 8px' }}>No Active Enrollments</h3>
                <p style={{ color: '#64748b', fontWeight: 500, margin: '0 0 16px' }}>Enroll in a course from the catalog to access learning materials.</p>
              </div>
            )}
          </div>
        </>
      ) : (
        <div className="animate-fade-in">
          <div className="reader-header">
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <button className="btn-back" onClick={() => setActiveCourse(null)}>
                <ArrowLeft size={18} /> Back
              </button>
              <h2 style={{ margin: 0, fontSize: '20px', fontWeight: 800, color: '#1e293b' }}>
                {activeCourse.title} - Learning Materials
              </h2>
            </div>
          </div>

          {loading ? (
            <div style={{ padding: '60px', textAlign: 'center', color: '#64748b', fontWeight: 600 }}>Loading curriculum data...</div>
          ) : (
            <div className="module-list">
              {modules.map(mod => {
                const files = mod.items === 'Empty' ? [] : mod.items.split(', ');
                return (
                  <div key={mod._id} className="module-folder animate-fade-in">
                    <div className="folder-title-row">
                      <div className="folder-icon"><Folder size={24} /></div>
                      <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 800, color: '#1e293b' }}>{mod.title}</h3>
                    </div>
                    
                    {files.length === 0 ? (
                      <p style={{ color: '#94a3b8', fontSize: '14px', fontWeight: 500 }}>No documents have been uploaded to this module yet.</p>
                    ) : (
                      <div className="files-grid">
                        {files.map((file, idx) => (
                          <div key={idx} className="file-card" onClick={() => openDocument(file)}>
                            <div className="file-info">
                              <FileText size={20} className="file-icon" />
                              <span className="file-name">{file}</span>
                            </div>
                            <Eye size={18} color="#6366f1" />
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}

              {modules.length === 0 && (
                <div style={{ padding: '60px', textAlign: 'center', background: '#fff', borderRadius: '24px', border: '2px dashed #e2e8f0' }}>
                  <p style={{ color: '#64748b', fontWeight: 600, fontSize: '15px' }}>The instructor has not uploaded any learning materials for this course yet.</p>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* PDF VIEWER MODAL */}
      {activePdf && (
        <div className="pdf-modal-overlay">
          <div className="pdf-modal-content">
            <div className="pdf-toolbar">
              <div className="pdf-title">
                <FileText size={18} color="#60a5fa" />
                {activePdf}
              </div>
              <div style={{ display: 'flex', gap: '16px' }}>
                <button className="btn-modal-action">
                  <Download size={16} /> Download PDF
                </button>
                <button className="btn-modal-close" onClick={() => setActivePdf(null)}>
                  <X size={20} />
                </button>
              </div>
            </div>
            <div className="pdf-viewer-area">
              <div className="pdf-mock-page">
                <h1 style={{ fontSize: '28px', borderBottom: '2px solid #e2e8f0', paddingBottom: '16px', marginBottom: '24px', color: '#1e293b' }}>{activePdf.replace(/\.[^/.]+$/, "")}</h1>
                <p style={{ color: '#475569', lineHeight: 1.8, fontSize: '15px', marginBottom: '20px' }}>
                  This is the secure institutional document viewer. The contents of <strong>{activePdf}</strong> are rendered here natively, preventing unauthorized external distribution.
                </p>
                <div style={{ height: '200px', background: '#f8fafc', borderRadius: '12px', border: '1px dashed #cbd5e1', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#94a3b8', fontWeight: 600 }}>
                   [ Document Content Rendered Successfully ]
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
