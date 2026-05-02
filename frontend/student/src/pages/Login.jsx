import { useState } from 'react';

export default function Login({ onAuth }) {
    const [user, setUser] = useState('');
    const [identifier, setIdentifier] = useState('');
    const [pass, setPass] = useState('');
    const [error, setError] = useState(false);

    const handleLogin = async () => {
        setError(false);
        if (!user || !identifier || !pass) {
            setError(true);
            return;
        }

        if (!user) {
            alert("Please select your role (Learner, Faculty, or Admin) first!");
            return;
        }

        try {
            const res = await fetch('http://127.0.0.1:5000/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ role: user, identifier, password: pass })
            });

            if (res.ok) {
                const data = await res.json();
                localStorage.setItem('user', JSON.stringify(data.user));
                
                if (user === 'admin') {
                    window.location.href = 'http://localhost:5173/?auth=true';
                } else if (user === 'instructor') {
                    window.location.href = 'http://localhost:5175/?auth=true';
                } else if (user === 'student') {
                    window.location.href = 'http://localhost:5174/?auth=true';
                }
            } else {
                setError(true);
            }
        } catch (e) {
            console.error(e);
            setError(true);
        }
    };

    return (
        <div style={{ margin: 0, padding: 0, fontFamily: "'Plus Jakarta Sans', sans-serif", background: '#0f172a', minHeight: '100vh', display: 'flex', overflowX: 'hidden', position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, zIndex: 9999 }}>
            <style>{`
                .bg-glow-1 { position: absolute; top: -10vw; left: -10vw; width: 40vw; height: 40vw; background: radial-gradient(circle, rgba(37,99,235,0.4) 0%, rgba(15,23,42,0) 70%); z-index: 0; pointer-events: none; }
                .bg-glow-2 { position: absolute; bottom: -10vw; right: 20vw; width: 50vw; height: 50vw; background: radial-gradient(circle, rgba(236,72,153,0.15) 0%, rgba(15,23,42,0) 70%); z-index: 0; pointer-events: none; }
                .page-wrapper { display: grid; grid-template-columns: 1fr 1fr; width: 100vw; min-height: 100vh; z-index: 1; }
                .hero-section { display: flex; flex-direction: column; justify-content: center; padding: 10%; color: white; }
                .brand-badge { display: inline-block; padding: 8px 16px; background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); border-radius: 30px; font-size: 14px; font-weight: 600; letter-spacing: 1px; color: #94a3b8; margin-bottom: 24px; align-self: flex-start; }
                .hero-title { font-size: 64px; font-weight: 800; line-height: 1.1; letter-spacing: -2.5px; margin: 0 0 24px 0; background: linear-gradient(135deg, #ffffff 0%, #cbd5e1 100%); -webkit-background-clip: text; background-clip: text; -webkit-text-fill-color: transparent; }
                .hero-title span { background: linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%); -webkit-background-clip: text; background-clip: text; -webkit-text-fill-color: transparent; }
                .hero-subtitle { font-size: 20px; color: #94a3b8; line-height: 1.6; margin: 0 0 40px 0; max-width: 500px; }
                .stat-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
                .stat-box { padding: 20px; background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.05); border-radius: 16px; }
                .stat-value { font-size: 32px; font-weight: 800; color: #ffffff; margin-bottom: 8px; letter-spacing: -1px; }
                .stat-label { font-size: 14px; color: #64748b; font-weight: 600; text-transform: uppercase; letter-spacing: 1px; }
                .login-section { display: flex; justify-content: center; align-items: center; padding: 40px; }
                .login-box-container { background: rgba(255, 255, 255, 0.95); backdrop-filter: blur(20px); padding: 48px; border-radius: 24px; box-shadow: 0 25px 50px -12px rgba(0,0,0,0.5); width: 100%; max-width: 420px; transition: transform 0.3s cubic-bezier(0.165, 0.84, 0.44, 1); border: 1px solid rgba(255,255,255,0.2); }
                .login-box-container:hover { transform: translateY(-5px); box-shadow: 0 35px 60px -15px rgba(0,0,0,0.6); }
                .login-header { margin-bottom: 32px; }
                .login-header h2 { margin: 0 0 8px 0; font-size: 28px; font-weight: 800; color: #0f172a; letter-spacing: -1px; }
                .login-header p { margin: 0; color: #64748b; font-size: 15px; }
                .input-group { margin-bottom: 24px; }
                .input-group label { display: block; margin-bottom: 10px; font-size: 12px; font-weight: 700; color: #475569; text-transform: uppercase; letter-spacing: 1px; }
                .auth-input { width: 100%; padding: 16px; border: 2px solid #e2e8f0; border-radius: 12px; font-size: 15px; font-weight: 500; outline: none; transition: all 0.2s; box-sizing: border-box; background: #f8fafc; font-family: 'Plus Jakarta Sans', sans-serif; color: #0f172a; }
                .auth-input:focus { border-color: #3b82f6; background: white; box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.1); }
                .auth-login-btn { width: 100%; padding: 16px; background: linear-gradient(135deg, #2563eb, #1d4ed8); color: white; border: none; border-radius: 12px; font-size: 16px; font-weight: 700; cursor: pointer; transition: all 0.3s cubic-bezier(0.165, 0.84, 0.44, 1); box-shadow: 0 10px 20px -5px rgba(37, 99, 235, 0.3); font-family: 'Plus Jakarta Sans', sans-serif; letter-spacing: 0.5px; }
                .auth-login-btn:hover { background: linear-gradient(135deg, #3b82f6, #2563eb); transform: translateY(-2px); box-shadow: 0 15px 25px -5px rgba(37, 99, 235, 0.4); }
                .auth-error { background: #fee2e2; color: #ef4444; padding: 14px; border-radius: 10px; font-size: 14px; font-weight: 600; text-align: center; margin-bottom: 24px; border: 1px solid #fecaca; }
                .role-picker { display: flex; gap: 10px; margin-bottom: 24px; }
                .role-btn { flex: 1; padding: 12px 8px; border-radius: 10px; border: 2px solid #e2e8f0; background: #f8fafc; color: #64748b; font-weight: 700; font-size: 13px; font-family: 'Plus Jakarta Sans', sans-serif; cursor: pointer; transition: all 0.2s; text-align: center; }
                .role-btn:hover { border-color: #cbd5e1; background: #f1f5f9; }
                .role-btn.active { border-color: #3b82f6; background: rgba(59, 130, 246, 0.1); color: #2563eb; box-shadow: 0 4px 12px -2px rgba(37, 99, 235, 0.2); }
                @media (max-width: 900px) { .page-wrapper { grid-template-columns: 1fr; } .hero-section { padding: 40px 24px; text-align: center; align-items: center; } .brand-badge { align-self: center; } .hero-title { font-size: 48px; } }
            `}</style>
            
            <div className="bg-glow-1"></div>
            <div className="bg-glow-2"></div>

            <div className="page-wrapper">
                <div className="hero-section">
                    <div className="brand-badge">INSTITUTIONAL GRADE</div>
                    <h1 className="hero-title">Shaping the <br/><span>Future of Learning.</span></h1>
                    <p className="hero-subtitle">Access your personalized dashboard. Instructors effortlessly manage curriculum, while students engage with cutting-edge academic material.</p>
                    
                    <div className="stat-grid">
                        <div className="stat-box">
                            <div className="stat-value">99.9%</div>
                            <div className="stat-label">Uptime Architecture</div>
                        </div>
                        <div className="stat-box">
                            <div className="stat-value">Multi</div>
                            <div className="stat-label">Role Workspaces</div>
                        </div>
                    </div>
                </div>

                <div className="login-section">
                    <div className="login-box-container">
                        <div className="login-header">
                            <h2>Secure Portal</h2>
                            <p>Enter your institutional credentials to proceed.</p>
                        </div>

                        {error && <div className="auth-error">Authentication failed. Please try again.</div>}
                        
                        <div className="input-group">
                            <label>Select Your Role</label>
                            <div className="role-picker">
                                <button className={`role-btn ${user === 'student' ? 'active' : ''}`} onClick={() => setUser('student')}>Learner</button>
                                <button className={`role-btn ${user === 'instructor' ? 'active' : ''}`} onClick={() => setUser('instructor')}>Faculty</button>
                                <button className={`role-btn ${user === 'admin' ? 'active' : ''}`} onClick={() => setUser('admin')}>Admin</button>
                            </div>
                        </div>
                        
                        <div className="input-group">
                            <label>Username or Email</label>
                            <input type="text" className="auth-input" placeholder="john@example.com" value={identifier} onChange={(e) => setIdentifier(e.target.value)} onKeyPress={(e) => e.key === 'Enter' && handleLogin()} />
                        </div>
                        <div className="input-group">
                            <label>Password</label>
                            <input type="password" className="auth-input" placeholder="••••••••" value={pass} onChange={(e) => setPass(e.target.value)} onKeyPress={(e) => e.key === 'Enter' && handleLogin()} />
                        </div>
                        
                        <button className="auth-login-btn" onClick={handleLogin}>Authenticate & Enter</button>
                    </div>
                </div>
            </div>
        </div>
    );
}
