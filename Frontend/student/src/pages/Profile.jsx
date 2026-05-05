export default function Profile() {
  return (
    <div>
      <h2 style={{ fontSize: '24px', marginBottom: '24px' }}>My Profile</h2>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(300px, 1fr) minmax(300px, 1fr)', gap: '24px' }}>
        {/* Personal Details Card */}
        <div className="card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '32px' }}>
            <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: 'linear-gradient(135deg, #2563eb, #3b82f6)', color: 'white', display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: '28px', fontWeight: 'bold', boxShadow: '0 4px 6px -1px rgba(37, 99, 235, 0.4)' }}>
              JD
            </div>
            <div>
              <h3 style={{ margin: 0, fontSize: '20px', letterSpacing: '-0.5px' }}>John Doe</h3>
              <p style={{ margin: '4px 0 0 0', color: '#64748b', fontSize: '14px' }}>Undergraduate Learner</p>
            </div>
          </div>
          
          <h4 style={{ marginBottom: '16px', color: '#0f172a', fontSize: '15px', borderBottom: '1px solid #e2e8f0', paddingBottom: '8px' }}>Personal Information</h4>
          
          <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 'bold', color: '#64748b', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Full Name</label>
              <p style={{ margin: 0, fontSize: '15px', color: '#0f172a', fontWeight: '500' }}>John Doe</p>
          </div>
          
          <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 'bold', color: '#64748b', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Email Address</label>
              <p style={{ margin: 0, fontSize: '15px', color: '#0f172a', fontWeight: '500' }}>john.doe@university.edu</p>
          </div>
          
          <div style={{ marginBottom: '24px' }}>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 'bold', color: '#64748b', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Student ID</label>
              <p style={{ margin: 0, fontSize: '15px', color: '#0f172a', fontWeight: '500' }}>STU-998234</p>
          </div>
        </div>
        
        {/* Preferences Card */}
        <div className="card">
           <h4 style={{ marginBottom: '16px', color: '#0f172a', fontSize: '15px', borderBottom: '1px solid #e2e8f0', paddingBottom: '8px' }}>Preferences & Security</h4>
           
           <div style={{ marginBottom: '32px' }}>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 'bold', color: '#64748b', marginBottom: '12px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Email Notifications</label>
              
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px', padding: '12px', borderBottom: '1px solid #f1f5f9' }}>
                 <span style={{ fontSize: '14px', color: '#0f172a', fontWeight: '500' }}>Course Content Updates</span>
                 <span style={{ fontSize: '12px', background: '#dcfce7', color: '#166534', padding: '4px 8px', borderRadius: '12px', fontWeight: 'bold' }}>Enabled</span>
              </div>
              
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px', borderBottom: '1px solid #f1f5f9' }}>
                 <span style={{ fontSize: '14px', color: '#0f172a', fontWeight: '500' }}>Assignment & Grade Alerts</span>
                 <span style={{ fontSize: '12px', background: '#dcfce7', color: '#166534', padding: '4px 8px', borderRadius: '12px', fontWeight: 'bold' }}>Enabled</span>
              </div>
           </div>

           <div>
             <label style={{ display: 'block', fontSize: '13px', fontWeight: 'bold', color: '#64748b', marginBottom: '12px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Account Security</label>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px' }}>
                 <span style={{ fontSize: '14px', color: '#0f172a', fontWeight: '500' }}>Two-Factor Auth</span>
                 <span style={{ fontSize: '12px', background: '#fef3c7', color: '#b45309', padding: '4px 8px', borderRadius: '12px', fontWeight: 'bold' }}>Disabled</span>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}
