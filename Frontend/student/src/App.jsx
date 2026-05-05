import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import './App.css';

import Login from './pages/Login';
import Profile from './pages/Profile';
import Courses from './pages/Courses';
import Learning from './pages/Learning';
import Assignments from './pages/Assignments';
import NotesSharing from './pages/NotesSharing';
import Progress from './pages/Progress';
import Notifications from './pages/Notifications';

function Sidebar() {
  const location = useLocation();
  const isActive = (path) => location.pathname === path ? 'active' : '';

  return (
    <div className="sidebar">
      <h2>Student Hub</h2>
      <Link to="/" className={isActive('/')}>Browse Courses</Link>
      <Link to="/learning" className={isActive('/learning')}>Learning Dashboard</Link>
      <Link to="/assignments" className={isActive('/assignments')}>Assignments</Link>
      <Link to="/notes" className={isActive('/notes')}>Notes Hub</Link>
      <Link to="/progress" className={isActive('/progress')}>Progress Tracker</Link>
      <Link to="/notifications" className={isActive('/notifications')}>Notifications</Link>
      <Link to="/profile" className={isActive('/profile')}>My Profile</Link>
    </div>
  );
}

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Lifted state for courses and enrolled courses
  const [courses, setCourses] = useState([
    { id: 1, title: 'Advanced Algorithms', code: 'CS401', desc: 'Fundamentals of graph theory and dynamic programming.', enrolled: false },
    { id: 2, title: 'UI/UX Architecture', code: 'DS205', desc: 'Creating professional and highly elegant interfaces.', enrolled: false },
    { id: 3, title: 'Quantum Computing', code: 'PH500', desc: 'Introduction to qubits, entanglement, and circuits.', enrolled: false }
  ]);

  const [enrolledCourses, setEnrolledCourses] = useState([
    { id: 101, title: 'Software Engineering Principles', time: 'Fall Semester', module: 'System Design Patterns' },
    { id: 102, title: 'Database Administration', time: 'Fall Semester', module: 'Query Optimization' }
  ]);

  const handleEnroll = (course) => {
    setCourses(courses.map(c => c.id === course.id ? { ...c, enrolled: true } : c));
    if (!enrolledCourses.find(ec => ec.id === course.id)) {
      setEnrolledCourses([...enrolledCourses, {
        id: course.id,
        title: course.title,
        time: 'Current Semester',
        module: 'Getting Started'
      }]);
    }
  };

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
        
        <div className="page-container">
          <div className="topbar">
            <h2 className="page-title">Learner Portal</h2>
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

          <Routes>
            <Route path="/" element={<Courses courses={courses} onEnroll={handleEnroll} />} />
            <Route path="/learning" element={<Learning enrolledCourses={enrolledCourses} />} />
            <Route path="/assignments" element={<Assignments />} />
            <Route path="/notes" element={<NotesSharing />} />
            <Route path="/progress" element={<Progress enrolledCourses={enrolledCourses} />} />
            <Route path="/notifications" element={<Notifications />} />
            <Route path="/profile" element={<Profile />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}