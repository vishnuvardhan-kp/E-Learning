export default function Notifications() {
  return (
    <div>
      <h2 style={{ fontSize: '24px', marginBottom: '24px' }}>Announcements & Alerts</h2>
      <div className="card-grid" style={{ gridTemplateColumns: '1fr' }}>
        <div className="card" style={{ borderLeft: '4px solid #ef4444' }}>
          <h3>Urgent: UI Design Mockup Due Tomorrow</h3>
          <p style={{ color: '#64748b' }}>Instructor • 2 hours ago</p>
          <p>Please ensure your submissions are in PDF format.</p>
        </div>
        <div className="card" style={{ borderLeft: '4px solid #eab308' }}>
          <h3>Course Update: Database Module</h3>
          <p style={{ color: '#64748b' }}>System • 1 day ago</p>
          <p>A new lecture has been published by your instructor.</p>
        </div>
      </div>
    </div>
  );
}
