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

  const [courses, setCourses] = useState([]);
  const [enrolledCourses, setEnrolledCourses] = useState([]);

  const fetchCourses = async () => {
    try {
      const res = await fetch('http://localhost:5000/courses');
      const data = await res.json();
      setCourses(data);
    } catch(e) {
      console.error(e);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchEnrollments = async () => {
    try {
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      if (user._id) {
        const res = await fetch(`http://localhost:5000/enroll/${user._id}`);
        const data = await res.json();
        // Link with course details
        const enrolledData = data.map(enr => {
          const courseDetails = courses.find(c => c._id === enr.courseId);
          return courseDetails ? { ...courseDetails, status: enr.status } : null;
        }).filter(Boolean);
        setEnrolledCourses(enrolledData);
      }
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    if (isAuthenticated && courses.length > 0) {
      fetchEnrollments();
    }
  }, [isAuthenticated, courses]);

  const handleEnroll = async (course) => {
    try {
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      await fetch('http://localhost:5000/enroll', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ studentId: user._id, courseId: course._id })
      });
      fetchEnrollments();
    } catch (e) {
      console.error(e);
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
                 localStorage.removeItem('user');
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