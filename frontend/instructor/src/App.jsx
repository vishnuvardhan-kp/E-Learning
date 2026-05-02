import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import './App.css';

import Login from './pages/Login';
import CourseManagement from './pages/CourseManagement';
import StudentEnrollment from './pages/StudentEnrollment';
import Assignments from './pages/Assignments';
import ContentSharing from './pages/ContentSharing';
import ProgressMonitoring from './pages/ProgressMonitoring';
import Notifications from './pages/Notifications';
import Profile from './pages/Profile';

function Sidebar() {
  const location = useLocation();
  const isActive = function(path) { return location.pathname === path ? 'active' : ''; };

  return (
    <div className="sidebar">
      <h2>Instructor</h2>
      <Link to="/" className={isActive('/')}>Course Management</Link>
      <Link to="/enrollments" className={isActive('/enrollments')}>Enrollments</Link>
      <Link to="/assignments" className={isActive('/assignments')}>Assignments</Link>
      <Link to="/content" className={isActive('/content')}>Content Hub</Link>
      <Link to="/progress" className={isActive('/progress')}>Monitor Progress</Link>
      <Link to="/notifications" className={isActive('/notifications')}>Alerts & Comments</Link>
      <Link to="/profile" className={isActive('/profile')}>My Profile</Link>
    </div>
  );
}

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [courses, setCourses] = useState([]);
  const [activeCourseId, setActiveCourseId] = useState('');

  const fetchCourses = async () => {
    try {
      const res = await fetch('http://localhost:5000/courses');
      const data = await res.json();
      setCourses(data);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  useEffect(function() {
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
    return <Login onAuth={function() {
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
            <h2 className="page-title">Faculty Portal</h2>
            <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '13px', fontWeight: 'bold' }}>Active Context:</span>
                <select className="input-field" value={activeCourseId} onChange={function(e) { setActiveCourseId(e.target.value) }} style={{ margin: 0, padding: '4px 8px', width: '200px' }}>
                  <option value="">All Courses</option>
                  {courses.map(function(c) { return <option key={c._id} value={c._id}>{c.title}</option> })}
                </select>
              </div>
              <button
                 className="logout-button" 
                 onClick={function() {
                   localStorage.removeItem('isAuthenticated');
                   localStorage.removeItem('user');
                   window.location.reload();
                 }}
              >
                Sign Out
              </button>
            </div>
          </div>

          <Routes>
            <Route path="/" element={<CourseManagement courses={courses} refreshCourses={fetchCourses} />} />
            <Route path="/enrollments" element={<StudentEnrollment activeCourse={activeCourseId} courses={courses} />} />
            <Route path="/assignments" element={<Assignments courses={courses} activeCourse={activeCourseId} />} />
            <Route path="/content" element={<ContentSharing activeCourse={activeCourseId} />} />
            <Route path="/progress" element={<ProgressMonitoring activeCourse={activeCourseId} />} />
            <Route path="/notifications" element={<Notifications courses={courses} activeCourse={activeCourseId} />} />
            <Route path="/profile" element={<Profile />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}