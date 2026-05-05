export default function ProgressMonitoring() {
  return (
    <div>
      <h2 style={{ fontSize: '24px', marginBottom: '24px' }}>Progress Monitoring Matrix</h2>
      <div style={{ display: 'flex', gap: '24px', marginBottom: '40px' }}>
        <div className="stat-card" style={{ flex: 1 }}>
          <h4>Class Average</h4>
          <div className="value">B+</div>
        </div>
        <div className="stat-card" style={{ flex: 1 }}>
          <h4>At-Risk Students</h4>
          <div className="value" style={{ color: '#ef4444' }}>3</div>
        </div>
        <div className="stat-card" style={{ flex: 1 }}>
          <h4>Submission Rate</h4>
          <div className="value">92%</div>
        </div>
      </div>
      
      <div className="card">
        <h3>Activity Log & Scores</h3>
        <table style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse', marginTop: '16px' }}>
          <thead>
            <tr style={{ borderBottom: '2px solid #e2e8f0' }}>
              <th style={{ padding: '12px' }}>Student</th>
              <th style={{ padding: '12px' }}>Recent Score</th>
              <th style={{ padding: '12px' }}>Status</th>
              <th style={{ padding: '12px' }}>Last Active</th>
            </tr>
          </thead>
          <tbody>
            <tr style={{ borderBottom: '1px solid #e2e8f0' }}>
              <td style={{ padding: '12px' }}>Bob Jenkins</td>
              <td style={{ padding: '12px' }}>85 / 100</td>
              <td style={{ padding: '12px', color: '#10b981', fontWeight: 'bold' }}>On Track</td>
              <td style={{ padding: '12px', color: '#64748b' }}>2 hours ago</td>
            </tr>
            <tr style={{ borderBottom: '1px solid #e2e8f0' }}>
              <td style={{ padding: '12px' }}>Charlie Davis</td>
              <td style={{ padding: '12px' }}>42 / 100</td>
              <td style={{ padding: '12px', color: '#ef4444', fontWeight: 'bold' }}>Needs Intervention</td>
              <td style={{ padding: '12px', color: '#64748b' }}>4 days ago</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
