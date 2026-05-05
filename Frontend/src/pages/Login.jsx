import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Login({ onAuth, forcedRole }) {
    const [user, setUser] = useState(forcedRole || '');
    const [identifier, setIdentifier] = useState('');
    const [pass, setPass] = useState('');
    const [error, setError] = useState(false);
    const navigate = useNavigate();

    const handleLogin = async () => {
        setError(false);
        if (!user || !identifier || !pass) {
            setError(true);
            return;
        }

        try {
            const res = await fetch(API_URL + '/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ role: user, identifier, password: pass })
            });

            if (res.ok) {
                const data = await res.json();
                localStorage.setItem('user', JSON.stringify(data.user));
                localStorage.setItem('isAuthenticated', 'true');
                
                if (onAuth) onAuth();
                
                // Navigate to the correct dashboard
                navigate(`/${user}`);
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
                .page-wrapper { display: grid; grid-template-columns: 1.1fr 0.9fr; width: 100vw; min-height: 100vh; z-index: 1; }
                .hero-section { display: flex; flex-direction: column; justify-content: center; padding: 80px; color: white; }
                .brand-badge { display: inline-block; padding: 6px 14px; background: rgba(255,255,255,0.08); border: 1px solid rgba(255,255,255,0.15); border-radius: 30px; font-size: 0.75rem; font-weight: 700; letter-spacing: 0.1em; color: #cbd5e1; margin-bottom: 32px; align-self: flex-start; text-transform: uppercase; }
                .hero-title { font-size: 4.5rem; font-weight: 800; line-height: 1.05; letter-spacing: -0.04em; margin: 0 0 32px 0; background: linear-gradient(135deg, #ffffff 0%, #94a3b8 100%); -webkit-background-clip: text; background-clip: text; -webkit-text-fill-color: transparent; }
                .hero-title span { background: linear-gradient(135deg, #60a5fa 0%, #a78bfa 100%); -webkit-background-clip: text; background-clip: text; -webkit-text-fill-color: transparent; }
                .hero-subtitle { font-size: 1.25rem; color: #94a3b8; line-height: 1.6; margin: 0 0 48px 0; max-width: 540px; font-weight: 400; }
                .stat-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 24px; max-width: 500px; }
                .stat-box { padding: 24px; background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.08); border-radius: 20px; backdrop-filter: blur(10px); }
                .stat-value { font-size: 2.25rem; font-weight: 800; color: #ffffff; margin-bottom: 6px; letter-spacing: -0.02em; }
                .stat-label { font-size: 0.813rem; color: #64748b; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; }
                .login-section { display: flex; justify-content: center; align-items: center; padding: 40px; background: rgba(15, 23, 42, 0.3); }
                .login-box-container { background: #ffffff; padding: 56px; border-radius: 32px; box-shadow: 0 25px 50px -12px rgba(0,0,0,0.5); width: 100%; max-width: 460px; border: 1px solid rgba(255,255,255,0.1); }
                .login-header { margin-bottom: 40px; }
                .login-header h2 { margin: 0 0 12px 0; font-size: 2rem; font-weight: 800; color: #0f172a; letter-spacing: -0.03em; }
                .login-header p { margin: 0; color: #64748b; font-size: 1rem; font-weight: 500; }
                .input-group { margin-bottom: 28px; }
                .input-group label { display: block; margin-bottom: 12px; font-size: 0.75rem; font-weight: 700; color: #475569; text-transform: uppercase; letter-spacing: 0.05em; }
                .auth-input { width: 100%; padding: 14px 18px; border: 2px solid #e2e8f0; border-radius: 14px; font-size: 1rem; font-weight: 500; outline: none; transition: all 0.2s; box-sizing: border-box; background: #f8fafc; font-family: inherit; color: #0f172a; }
                .auth-input:focus { border-color: #3b82f6; background: white; box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.1); }
                .auth-login-btn { width: 100%; padding: 18px; background: linear-gradient(135deg, #2563eb, #1d4ed8); color: white; border: none; border-radius: 14px; font-size: 1.125rem; font-weight: 700; cursor: pointer; transition: all 0.3s ease; box-shadow: 0 10px 20px -5px rgba(37, 99, 235, 0.3); font-family: inherit; letter-spacing: 0.01em; margin-top: 8px; }
                .auth-login-btn:hover { transform: translateY(-2px); box-shadow: 0 15px 25px -5px rgba(37, 99, 235, 0.4); filter: brightness(1.1); }
                .auth-error { background: #fef2f2; color: #dc2626; padding: 16px; border-radius: 12px; font-size: 0.875rem; font-weight: 600; text-align: center; margin-bottom: 32px; border: 1px solid #fee2e2; }
                .role-picker { display: flex; gap: 12px; margin-bottom: 32px; }
                .role-btn { flex: 1; padding: 14px 10px; border-radius: 12px; border: 2px solid #e2e8f0; background: #f8fafc; color: #64748b; font-weight: 700; font-size: 0.875rem; font-family: inherit; cursor: pointer; transition: all 0.2s; text-align: center; }
                .role-btn.active { border-color: #3b82f6; background: rgba(59, 130, 246, 0.05); color: #2563eb; }
                @media (max-width: 1024px) { .hero-section { padding: 40px; } .hero-title { font-size: 3.5rem; } }
                @media (max-width: 900px) { .page-wrapper { grid-template-columns: 1fr; } .hero-section { padding: 60px 24px; text-align: center; align-items: center; } .hero-title { font-size: 3rem; } .stat-grid { margin: 0 auto; } }
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
                        
                        {!forcedRole && (
                            <div className="input-group">
                                <label>Select Your Role</label>
                                <div className="role-picker">
                                    <button className={`role-btn ${user === 'student' ? 'active' : ''}`} onClick={() => setUser('student')}>Learner</button>
                                    <button className={`role-btn ${user === 'instructor' ? 'active' : ''}`} onClick={() => setUser('instructor')}>Faculty</button>
                                    <button className={`role-btn ${user === 'admin' ? 'active' : ''}`} onClick={() => setUser('admin')}>Admin</button>
                                </div>
                            </div>
                        )}
                        
                        <div className="input-group">
                            <label>Email Address</label>
                            <input type="email" className="auth-input" placeholder="student@gmail.com" value={identifier} onChange={(e) => setIdentifier(e.target.value)} onKeyPress={(e) => e.key === 'Enter' && handleLogin()} />
                        </div>
                        <div className="input-group">
                            <label>Password</label>
                            <input type="password" className="auth-input" placeholder="••••••••" value={pass} onChange={(e) => setPass(e.target.value)} onKeyPress={(e) => e.key === 'Enter' && handleLogin()} />
                        </div>

                        {(user === 'student' || user === 'instructor') && (
                            <button 
                                type="button"
                                className="role-btn" 
                                style={{ width: '100%', marginBottom: '16px', borderStyle: 'dashed', background: '#f0f9ff', color: '#0369a1', borderColor: '#bae6fd' }}
                                onClick={() => {
                                    if (user === 'student') {
                                        setIdentifier('student@gmail.com');
                                        setPass('password');
                                    } else if (user === 'instructor') {
                                        setIdentifier('instructor@gmail.com');
                                        setPass('password');
                                    }
                                }}
                            >
                                🚀 Login with Demo Credentials
                            </button>
                        )}
                        
                        <button className="auth-login-btn" onClick={handleLogin}>Authenticate & Enter</button>
                    </div>
                </div>
            </div>
        </div>
    );
}
