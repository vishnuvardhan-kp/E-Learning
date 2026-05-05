import { useState, useEffect } from 'react';
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import { 
  BookOpen, 
  Users, 
  ClipboardList, 
  Share2, 
  BarChart3, 
  Bell, 
  UserCircle,
  LogOut,
  Menu
} from 'lucide-react';
import './InstructorApp.css';

import CourseManagement from './CourseManagement';
import StudentEnrollment from './StudentEnrollment';
import Assignments from './Assignments';
import ContentSharing from './ContentSharing';
import ProgressMonitoring from './ProgressMonitoring';
import Notifications from './Notifications';
import Profile from './Profile';

function Sidebar() {
  const location = useLocation();
  const isActive = (path) => location.pathname === path ? 'active' : '';

  return (
    <div className="sidebar">
      <div className="sidebar-brand">
        <div className="brand-logo">F</div>
        <h2>FACULTY</h2>
      </div>
      <nav>
        <Link to="/instructor" className={isActive('/instructor')}>
          <BookOpen size={20} />
          <span>Course Management</span>
        </Link>
        <Link to="/instructor/enrollments" className={isActive('/instructor/enrollments')}>
          <Users size={20} />
          <span>Enrollments</span>
        </Link>
        <Link to="/instructor/assignments" className={isActive('/instructor/assignments')}>
          <ClipboardList size={20} />
          <span>Assignments</span>
        </Link>
        <Link to="/instructor/content" className={isActive('/instructor/content')}>
          <Share2 size={20} />
          <span>Content Hub</span>
        </Link>
        <Link to="/instructor/progress" className={isActive('/instructor/progress')}>
          <BarChart3 size={20} />
          <span>Monitor Progress</span>
        </Link>
        <Link to="/instructor/notifications" className={isActive('/instructor/notifications')}>
          <Bell size={20} />
          <span>Alerts & Comments</span>
        </Link>
        <Link to="/instructor/profile" className={isActive('/instructor/profile')}>
          <UserCircle size={20} />
          <span>My Profile</span>
        </Link>
      </nav>
    </div>
  );
}

export default function InstructorApp() {
  const [courses, setCourses] = useState([]);
  const [storedUser, setStoredUser] = useState(JSON.parse(localStorage.getItem('user') || '{}'));
  const [activeCourseId, setActiveCourseId] = useState('');

  const fetchCourses = async () => {
    try {
      const res = await fetch(API_URL + '/courses');
      const data = await res.json();
      setCourses(data);
    } catch (e) {
      console.error(e);
    }
  };

  const syncProfile = async () => {
    if (storedUser._id) {
        try {
            const res = await fetch(`${API_URL}/users/instructor/${storedUser._id}`);
            const data = await res.json();
            if (data && !data.error) {
                const updated = { ...storedUser, ...data, role: 'instructor' };
                setStoredUser(updated);
                localStorage.setItem('user', JSON.stringify(updated));
            }
        } catch (e) { console.error("Profile sync failed", e); }
    }
  };

  useEffect(() => {
    fetchCourses();
    syncProfile();
  }, []);

  return (
    <div className="app-layout">
      <Sidebar />
      
      <div className="main-content">
        <header className="topbar">
          <div className="topbar-left">
            <button className="menu-toggle mobile-only">
              <Menu size={24} />
            </button>
            <h2 className="page-title">Faculty Portal</h2>
            
            <div className="hide-mobile" style={{ marginLeft: '40px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '12px', fontWeight: '700', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Context:</span>
              <select className="context-selector" value={activeCourseId} onChange={function(e) { setActiveCourseId(e.target.value) }}>
                <option value="">All Courses</option>
                {courses.map(function(c) { return <option key={c._id} value={c._id}>{c.title}</option> })}
              </select>
            </div>
          </div>

          <div className="topbar-right">
            <div className="user-profile">
              <div className="user-info hide-mobile" style={{ textAlign: 'right' }}>
                <span className="user-name" style={{ display: 'block', fontWeight: '800', color: '#0f172a' }}>{storedUser.username}</span>
                <span className="user-email" style={{ display: 'block', fontSize: '11px', color: '#64748b', fontWeight: '600' }}>{storedUser.email || 'Lead Instructor'}</span>
              </div>
              <div className="user-avatar">
                {storedUser.username ? storedUser.username[0] : 'F'}
              </div>
            </div>
            <button
               className="logout-button" 
               onClick={function() {
                 localStorage.removeItem('isAuthenticated');
                 localStorage.removeItem('user');
                 window.location.href = '/login';
               }}
            >
              <LogOut size={18} />
              <span className="hide-mobile">Sign Out</span>
            </button>
          </div>
        </header>

        <div className="page-body animate-fade-in">
          <Routes>
            <Route path="/" element={<CourseManagement courses={courses} refreshCourses={fetchCourses} user={storedUser} />} />
            <Route path="/enrollments" element={<StudentEnrollment activeCourse={activeCourseId} courses={courses} />} />
            <Route path="/assignments" element={<Assignments courses={courses} activeCourse={activeCourseId} />} />
            <Route path="/content" element={<ContentSharing activeCourse={activeCourseId} />} />
            <Route path="/progress" element={<ProgressMonitoring activeCourse={activeCourseId} />} />
            <Route path="/notifications" element={<Notifications courses={courses} activeCourse={activeCourseId} />} />
            <Route path="/profile" element={<Profile />} />
          </Routes>
        </div>
      </div>
    </div>
  );
}
