import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import './App.css';

import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import UsersPage from './pages/Users';
import StudentProfile from './pages/StudentProfile';
import Teachers from './pages/Teachers';
import TeacherProfile from './pages/TeacherProfile';
import Courses from './pages/Courses';
import Moderation from './pages/Moderation';
import Notifications from './pages/Notifications';

function Sidebar() {
  return (
    <div className="sidebar">
      <h2>E-Learning</h2>

      <Link to="/">Dashboard</Link>
      <Link to="/students">Students</Link>
      <Link to="/teachers">Teachers</Link>
      <Link to="/courses">Courses</Link>
      <Link to="/moderation">Moderation</Link>
      <Link to="/notifications">Notifications</Link>
    </div>
  );
}

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('auth') === 'true') {
      localStorage.setItem('isAuthenticated', 'true');
      window.history.replaceState({}, document.title, window.location.pathname);
      setIsAuthenticated(true);
    } else if (localStorage.getItem('isAuthenticated') === 'true') {
      setIsAuthenticated(true);
    }
  }, []);

  if (!isAuthenticated) {
    return <Login onAuth={() => {
      localStorage.setItem('isAuthenticated', 'true');
      setIsAuthenticated(true);
    }} />;
  }

  return (
    <Router>
      <div style={{ display: 'flex' }}>

        <Sidebar />

        <div style={{ padding: '40px', width: '100%', backgroundColor: '#ffffff', minHeight: '100vh' }}>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px', borderBottom: '1px solid #e2e8f0', paddingBottom: '25px' }}>
            <h2 style={{ margin: 0, fontSize: '30px', fontWeight: 950, letterSpacing: '-2px' }}>Admin Oversight</h2>
            <button
               className="logout-button" 
               onClick={() => {
                 localStorage.removeItem('isAuthenticated');
                 window.location.reload();
               }}
            >
              Sign Out
            </button>
          </div>

          {/* Dynamic Module Rendering Layer */}
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/students" element={<UsersPage />} />
            <Route path="/students/:id" element={<StudentProfile />} />
            <Route path="/teachers" element={<Teachers />} />
            <Route path="/teachers/:id" element={<TeacherProfile />} />
            <Route path="/courses" element={<Courses />} />
            <Route path="/moderation" element={<Moderation />} />
            <Route path="/notifications" element={<Notifications />} />
          </Routes>

        </div>
      </div>
    </Router>
  );
}