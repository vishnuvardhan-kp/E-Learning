import { useState } from 'react';

const dummyPdfDataUri = 'data:application/pdf;base64,JVBERi0xLjcKCjEgMCBvYmogICUgZW50cnkgcG9pbnQKPDwKICAvVHlwZSAvQ2F0YWxvZwogIC9QYWdlcyAyIDAgUgo+PgplbmRvYmoKCjIgMCBvYmoKPDwKICAvVHlwZSAvUGFnZXMKICAvTWVkaWFCb3ggWyAwIDAgMjAwIDIwMCBdCiAgL0NvdW50IDEKICAvS2lkcyBbIDMgMCBSIF0KPj4KZW5kb2JqCgozIDAgb2JqCjw8CiAgL1R5cGUgL1BhZ2UKICAvUGFyZW50IDIgMCBSCiAgL1Jlc291cmNlcyA8PAogICAgL0ZvbnQgPDwKICAgICAgL0YxIDQgMCBSCj4+Cj4+CiAgL0NvbnRlbnRzIDUgMCBSCj4+CmVuZG9iagoKNCAwIG9iago8PAogIC9UeXBlIC9Gb250CiAgL1N1YnR5cGUgL1R5cGUxCiAgL0Jhc2VGb250IC9UaW1lcy1Sb21hbgo+PgplbmRvYmoKCjUgMCBvYmoKPDwgL0xlbmd0aCA0NCA+PgpzdHJlYW0KQlQKNTAgNTAgVEQKL0YxIDE4IFRmCihEdW1teSBQREYpIFRqCkVUCmVuZHN0cmVhbQplbmRvYmoKCnhyZWYKMCA2CjAwMDAwMDAwMDAgNjU1MzUgZiAKMDAwMDAwMDAxMCAwMDAwMCBuIAowMDAwMDAwMDc5IDAwMDAwIG4gCjAwMDAwMDAxNzMgMDAwMDAgbiAKMDAwMDAwMDMwMSAwMDAwMCBuIAowMDAwMDAwMzgwIDAwMDAwIG4gCnRyYWlsZXIKPDwKICAvU2l6ZSA2CiAgL1Jvb3QgMSAwIFIKPj4Kc3RhcnR4cmVmCjQ5NwolJUVPRgo=';

export default function NotesSharing() {
  const [notes, setNotes] = useState([
    { id: 1, title: 'Database Design Normalization cheat sheet', author: 'Bob', snippet: 'Helps with understanding 1NF, 2NF, 3NF.', upvotes: 124, fileUrl: dummyPdfDataUri, fileType: 'application/pdf' },
    { id: 2, title: 'Algorithm Complexity Cheat Sheet', author: 'Alice', snippet: 'A quick summary of Big-O notations.', upvotes: 85, fileUrl: dummyPdfDataUri, fileType: 'application/pdf' }
  ]);
  
  const [showUploadForm, setShowUploadForm] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newSnippet, setNewSnippet] = useState('');
  const [file, setFile] = useState(null);
  
  const [viewingNote, setViewingNote] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (newTitle && file) {
        // Create a local object URL to securely view the uploaded file on the frontend
        const fileUrl = URL.createObjectURL(file);
        setNotes([{
            id: Date.now(),
            title: newTitle,
            author: 'You',
            snippet: newSnippet || 'Newly uploaded peer material.',
            upvotes: 0,
            fileUrl: fileUrl,
            fileType: file.type
        }, ...notes]);
        setShowUploadForm(false);
        setNewTitle('');
        setNewSnippet('');
        setFile(null);
    }
  };

  const handleUpvote = (id) => {
    setNotes(notes.map(n => n.id === id ? { ...n, upvotes: n.upvotes + 1 } : n));
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2 style={{ fontSize: '24px', marginBottom: '24px' }}>Peer Notes Hub</h2>
        <button className="action-button" onClick={() => setShowUploadForm(!showUploadForm)}>
          {showUploadForm ? 'Cancel Upload' : 'Upload Notes'}
        </button>
      </div>
      <p style={{ color: '#64748b', marginBottom: '24px' }}>A shared space for students to exchange knowledge and study materials.</p>
      
      {showUploadForm && (
        <form onSubmit={handleSubmit} style={{ marginBottom: '24px', padding: '16px', background: '#f8fafc', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
          <h4 style={{ marginBottom: '12px', fontSize: '14px', color: '#334155' }}>Share your notes (PDF/PPT):</h4>
          
          <input 
            type="text" 
            placeholder="Note Title"
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            required 
            style={{ marginBottom: '12px', width: '100%', padding: '8px', fontSize: '14px', borderRadius: '4px', border: '1px solid #cbd5e1' }} 
          />
          
          <input 
            type="text" 
            placeholder="Short description snippet (optional)"
            value={newSnippet}
            onChange={(e) => setNewSnippet(e.target.value)}
            style={{ marginBottom: '12px', width: '100%', padding: '8px', fontSize: '14px', borderRadius: '4px', border: '1px solid #cbd5e1' }} 
          />

          <input 
            type="file" 
            accept=".pdf,.ppt,.pptx,application/pdf,application/vnd.ms-powerpoint,application/vnd.openxmlformats-officedocument.presentationml.presentation"
            required 
            onChange={(e) => setFile(e.target.files[0])}
            style={{ marginBottom: '12px', width: '100%', fontSize: '14px' }} 
          />
          
          <button 
            type="submit" 
            style={{ padding: '8px 16px', fontSize: '12px', fontWeight: 'bold', background: '#2563eb', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
          >
            Share Note
          </button>
        </form>
      )}

      {/* PDF / Document Viewer Modal */}
      {viewingNote && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.7)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 }}>
          <div style={{ width: '80%', height: '80%', background: 'white', borderRadius: '8px', padding: '16px', display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
              <h3 style={{ margin: 0 }}>{viewingNote.title}</h3>
              <button 
                onClick={() => setViewingNote(null)}
                style={{ background: '#ef4444', color: 'white', border: 'none', padding: '8px 16px', borderRadius: '4px', cursor: 'pointer' }}
              >
                Close Viewer
              </button>
            </div>
            <div style={{ flexGrow: 1, background: '#f1f5f9', display: 'flex', justifyContent: 'center', alignItems: 'center', borderRadius: '4px', overflow: 'hidden' }}>
                {viewingNote.fileType && viewingNote.fileType.includes('pdf') ? (
                  <iframe src={viewingNote.fileUrl} width="100%" height="100%" style={{ border: 'none' }} title={viewingNote.title}></iframe>
                ) : (
                  <div style={{ textAlign: 'center', padding: '24px' }}>
                     <p style={{ fontSize: '16px', marginBottom: '16px' }}>Preview for PPT files isn't supported natively in the browser without third-party plugins.</p>
                     <a href={viewingNote.fileUrl} download={viewingNote.title} style={{ padding: '10px 20px', background: '#2563eb', color: 'white', textDecoration: 'none', borderRadius: '4px', display: 'inline-block' }}>Download {viewingNote.title} Instead</a>
                  </div>
                )}
            </div>
          </div>
        </div>
      )}

      <div className="card-grid">
        {notes.map(note => (
            <div key={note.id} className="card">
              <h3>{note.title}</h3>
              <p>Shared by: {note.author}</p>
              <p style={{ fontSize: '13px', fontStyle: 'italic', color: '#475569' }}>"{note.snippet}"</p>
              <div className="card-actions" style={{ display: 'flex', gap: '8px', marginTop: '16px' }}>
                <button className="action-button" style={{ flex: 1, padding: '10px 12px', fontSize: '11px' }} onClick={() => setViewingNote(note)}>View Document</button>
                <button className="action-button" style={{ background: '#e2e8f0', color: '#0f172a', flex: 1, padding: '10px 12px', fontSize: '11px' }} onClick={() => handleUpvote(note.id)}>
                    Upvote ({note.upvotes})
                </button>
              </div>
            </div>
        ))}
      </div>
    </div>
  );
}
