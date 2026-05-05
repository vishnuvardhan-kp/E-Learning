import { useNavigate } from 'react-router-dom';

const Welcome = () => {
    const navigate = useNavigate();

    const features = [
        {
            title: 'User Management',
            description: 'Gain full control over student and instructor profiles. Manage roles, permissions, and account status with ease.',
            icon: 'U'
        },
        {
            title: 'Course Management',
            description: 'Oversee the entire curriculum. Approve new content, manage categories, and ensure course quality across the platform.',
            icon: 'C'
        },
        {
            title: 'Assignment Tracking',
            description: 'Monitor submission rates and grading cycles. Ensure students are meeting deadlines and instructors are providing feedback.',
            icon: 'A'
        },
        {
            title: 'Progress Analytics',
            description: 'Visualize institution growth through real-time data. Track active users, enrollment trends, and completion rates.',
            icon: 'P'
        }
    ];

    return (
        <div className="welcome-page-wrapper">
            <header className="welcome-header">
                <div className="welcome-header-content">
                    <div className="welcome-logo">KEC <span>E-Learning</span></div>
                    <div className="welcome-badge">Admin Control Center</div>
                </div>
            </header>

            <main className="welcome-main">
                <section className="welcome-hero">
                    <h1 className="hero-title">Next-Gen Admin Oversight</h1>
                    <p className="hero-subtitle">
                        Empowering educational leaders with smart tools to manage, track, and scale the learning experience. Everything you need to oversee your institution in one unified command center.
                    </p>
                    <button className="enter-dashboard-btn" onClick={() => navigate('/dashboard')}>
                        Navigate to Dashboard <span>→</span>
                    </button>
                </section>

                <section className="features-grid">
                    {features.map((feature, index) => (
                        <div key={index} className="feature-card">
                            <div className="feature-icon">{feature.icon}</div>
                            <h3 className="feature-title">{feature.title}</h3>
                            <p className="feature-description">{feature.description}</p>
                        </div>
                    ))}
                </section>
            </main>

            <footer className="welcome-footer">
                <p>&copy; 2026 KEC Educational Institution. Professional Admin Infrastructure.</p>
            </footer>

            <style>{`
                .welcome-page-wrapper {
                    min-height: 100vh;
                    background: #f8fafc;
                    font-family: 'Plus Jakarta Sans', sans-serif;
                    color: #1e293b;
                    padding-bottom: 50px;
                }

                .welcome-header {
                    background: white;
                    padding: 20px 0;
                    box-shadow: 0 4px 15px rgba(0,0,0,0.03);
                    position: sticky;
                    top: 0;
                    z-index: 100;
                }

                .welcome-header-content {
                    max-width: 1200px;
                    margin: 0 auto;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding: 0 30px;
                }

                .welcome-logo { font-size: 1.5rem; font-weight: 800; color: #1e293b; }
                .welcome-logo span { color: #2563eb; }

                .welcome-badge {
                    background: #eff6ff;
                    color: #2563eb;
                    padding: 8px 16px;
                    border-radius: 20px;
                    font-size: 0.85rem;
                    font-weight: 700;
                    text-transform: uppercase;
                    letter-spacing: 1px;
                }

                .welcome-main {
                    max-width: 1200px;
                    margin: 0 auto;
                    padding: 80px 30px;
                }

                .welcome-hero {
                    text-align: center;
                    margin-bottom: 100px;
                }

                .hero-title {
                    font-size: 3.5rem;
                    font-weight: 900;
                    margin-bottom: 25px;
                    letter-spacing: -2px;
                    color: #0f172a;
                }

                .hero-subtitle {
                    font-size: 1.25rem;
                    line-height: 1.6;
                    color: #64748b;
                    max-width: 800px;
                    margin: 0 auto 50px auto;
                }

                .enter-dashboard-btn {
                    background: #2563eb;
                    color: white;
                    border: none;
                    padding: 20px 45px;
                    border-radius: 14px;
                    font-size: 1.15rem;
                    font-weight: 800;
                    cursor: pointer;
                    transition: all 0.3s cubic-bezier(0.165, 0.84, 0.44, 1);
                    box-shadow: 0 20px 40px rgba(37, 99, 235, 0.2);
                }

                .enter-dashboard-btn:hover {
                    transform: translateY(-5px);
                    box-shadow: 0 25px 50px rgba(37, 99, 235, 0.3);
                    background: #1d4ed8;
                }

                .features-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
                    gap: 30px;
                }

                .feature-card {
                    background: white;
                    padding: 40px;
                    border-radius: 24px;
                    border: 1px solid #e2e8f0;
                    transition: all 0.3s ease;
                }

                .feature-card:hover {
                    transform: translateY(-10px);
                    border-color: #2563eb;
                    box-shadow: 0 20px 40px rgba(0,0,0,0.05);
                }

                .feature-icon {
                    font-size: 2.5rem;
                    margin-bottom: 25px;
                    display: block;
                }

                .feature-title {
                    font-size: 1.3rem;
                    font-weight: 800;
                    margin-bottom: 15px;
                    color: #1e293b;
                }

                .feature-description {
                    color: #64748b;
                    line-height: 1.6;
                    font-size: 0.95rem;
                }

                .welcome-footer {
                    text-align: center;
                    padding: 50px 0;
                    color: #94a3b8;
                    font-weight: 600;
                }

                @media (max-width: 768px) {
                    .hero-title { font-size: 2.5rem; }
                    .welcome-main { padding: 40px 20px; }
                }
            `}</style>
        </div>
    );
};

export default Welcome;
