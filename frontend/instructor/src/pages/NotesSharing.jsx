export default function NotesSharing() {
  return (
    <div>
      <h2 style={{ fontSize: '24px', marginBottom: '24px' }}>Instructor Notes Space</h2>
      <p style={{ color: '#64748b', marginBottom: '24px' }}>Post notes in common space & highlight important student resources.</p>
      
      <div className="card-grid">
        <div className="card" style={{ border: '2px solid #0f172a' }}>
          <h3>Highlighted Resource</h3>
          <p>Shared by: You</p>
          <p style={{ fontSize: '13px', fontStyle: 'italic', color: '#475569' }}>"Operating Systems Final Review Guide"</p>
          <div className="card-actions" style={{ marginTop: '16px' }}>
            <button className="action-button">Edit Pin</button>
            <button className="action-button" style={{ background: '#ef4444' }}>Unpin</button>
          </div>
        </div>
        
        <div className="card">
          <h3>Algorithm Complexity Cheat Sheet</h3>
          <p>Shared by: Alice (Student)</p>
          <div className="card-actions">
            <button className="action-button" style={{ background: '#10b981' }}>Endorse</button>
            <button className="action-button" style={{ background: '#e2e8f0', color: '#0f172a' }}>Remove</button>
          </div>
        </div>
      </div>
    </div>
  );
}
