export default function Progress({ enrolledCourses = [] }) {
  const getCourseProgress = (id) => (id.length > 5 ? Math.floor(Math.random() * 20) + 65 : 0);
  
  const totalCourses = enrolledCourses.length;
  const avgCompletion = totalCourses > 0 
    ? Math.floor(enrolledCourses.reduce((sum, course) => sum + getCourseProgress(course._id), 0) / totalCourses)
    : 0;

  return (
    <div>
      <h2 style={{ fontSize: '24px', marginBottom: '24px' }}>Progress Tracker</h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '24px', marginBottom: '40px' }}>
        <div className="stat-card">
          <h4>Active Courses</h4>
          <div className="value">{totalCourses}</div>
        </div>
        <div className="stat-card">
          <h4>Avg. Completion</h4>
          <div className="value">{avgCompletion}%</div>
        </div>
        <div className="stat-card">
          <h4>Submitted</h4>
          <div className="value">12 / 15</div>
        </div>
      </div>
      
      <div className="card" style={{ marginBottom: '24px' }}>
         <h3 style={{ marginBottom: '20px' }}>Course Progress Breakdown</h3>
         <div>
           {totalCourses === 0 ? (
              <p style={{ color: '#64748b' }}>No courses enrolled yet.</p>
           ) : (
              enrolledCourses.map(course => {
                const progressValue = getCourseProgress(course._id);
                return (
                  <div key={course._id} style={{ marginBottom: '20px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                       <span style={{ fontWeight: '600', color: '#0f172a' }}>{course.title}</span>
                       <span style={{ color: '#64748b', fontSize: '14px', fontWeight: 'bold' }}>{progressValue}%</span>
                    </div>
                    <div style={{ width: '100%', backgroundColor: '#e2e8f0', borderRadius: '8px', height: '12px', overflow: 'hidden' }}>
                       <div style={{ width: `${progressValue}%`, backgroundColor: progressValue === 0 ? 'transparent' : '#10b981', height: '100%', borderRadius: '8px', transition: 'width 0.5s ease-in-out' }}></div>
                    </div>
                  </div>
                )
              })
           )}
         </div>
      </div>

      <div className="card">
        <h3 style={{ marginBottom: '20px' }}>Performance History</h3>
        <div style={{ height: '200px', background: '#f8fafc', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px dashed #cbd5e1', borderRadius: '8px' }}>
          <p style={{ color: '#94a3b8', fontSize: '14px' }}>[ Linear Performance Chart Placeholder ]</p>
        </div>
      </div>
    </div>
  );
}
