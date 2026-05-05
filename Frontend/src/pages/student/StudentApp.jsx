import { useState, useEffect } from 'react';
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import { 
  Search, 
  Layout, 
  ClipboardList, 
  PenTool, 
  TrendingUp, 
  Bell, 
  UserCircle,
  LogOut,
  Menu
} from 'lucide-react';
import './StudentApp.css';

import Profile from './Profile';
import Courses from './Courses';
import Learning from './Learning';
import Assignments from './Assignments';
import NotesSharing from './NotesSharing';
import Notifications from './Notifications';

function Sidebar() {
  const location = useLocation();
  const isActive = (path) => location.pathname === path ? 'active' : '';

  return (
    <div className="sidebar">
      <div className="sidebar-brand">
        <div className="brand-logo">S</div>
        <h2>STUDENT</h2>
      </div>
      <nav>
        <Link to="/student" className={isActive('/student')}>
          <Search size={20} />
          <span>Browse Courses</span>
        </Link>
        <Link to="/student/learning" className={isActive('/student/learning')}>
          <Layout size={20} />
          <span>Learning Dashboard</span>
        </Link>
        <Link to="/student/assignments" className={isActive('/student/assignments')}>
          <ClipboardList size={20} />
          <span>Assignments</span>
        </Link>
        <Link to="/student/notes" className={isActive('/student/notes')}>
          <PenTool size={20} />
          <span>Notes Hub</span>
        </Link>

        <Link to="/student/notifications" className={isActive('/student/notifications')}>
          <Bell size={20} />
          <span>Notifications</span>
        </Link>
        <Link to="/student/profile" className={isActive('/student/profile')}>
          <UserCircle size={20} />
          <span>My Profile</span>
        </Link>
      </nav>
    </div>
  );
}

export default function StudentApp() {
  const [courses, setCourses] = useState([]);
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [storedUser, setStoredUser] = useState(JSON.parse(localStorage.getItem('user') || '{}'));

  const fetchCourses = async () => {
    try {
      const res = await fetch(API_URL + '/courses');
      const data = await res.json();
      setCourses(data);
    } catch(e) {
      console.error(e);
    }
  };

  const syncProfile = async () => {
    if (storedUser._id) {
        try {
            const res = await fetch(`${API_URL}/users/student/${storedUser._id}`);
            const data = await res.json();
            if (data && !data.error) {
                const updated = { ...storedUser, ...data, role: 'student' };
                setStoredUser(updated);
                localStorage.setItem('user', JSON.stringify(updated));
            }
        } catch (e) { console.error("Scholar profile sync failed", e); }
    }
  };

  useEffect(() => {
    fetchCourses();
    syncProfile();
  }, []);

  const fetchEnrollments = async () => {
    try {
      const storedUser = JSON.parse(localStorage.getItem('user') || '{}');
      if (storedUser._id) {
        const res = await fetch(`${API_URL}/enroll/${storedUser._id}`);
        const data = await res.json();
        
        // Mark which courses are enrolled in the master list
        const enrolledIds = data.map(enr => enr.courseId);
        setCourses(prev => prev.map(c => enrolledIds.includes(c._id) ? { ...c, enrolled: true } : c));

        // Create the list for Learning Dashboard
        const enrolledData = data.map(enr => {
          const courseDetails = courses.find(c => c._id === enr.courseId);
          return courseDetails ? { ...courseDetails, status: enr.status, time: 'Current Semester', module: 'Unit 1' } : null;
        }).filter(Boolean);
        setEnrolledCourses(enrolledData);
      }
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    if (courses.length > 0) {
      fetchEnrollments();
    }
  }, [courses]);

  const handleEnroll = async (course) => {
    try {
      const storedUser = JSON.parse(localStorage.getItem('user') || '{}');
      if (!storedUser._id) {
        alert("Please login again to enroll.");
        return;
      }

      const res = await fetch(API_URL + '/enroll', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ studentId: storedUser._id, courseId: course._id })
      });

      if (res.ok) {
        alert(`Successfully enrolled in ${course.title}!`);
        fetchEnrollments();
      } else {
        const err = await res.json();
        alert(`Enrollment failed: ${err.error || 'Unknown error'}`);
      }
    } catch (e) {
      console.error(e);
      alert("Network error occurred during enrollment.");
    }
  };

  return (
    <div className="app-layout">
      <Sidebar />
      
      <div className="main-content">
        <header className="topbar">
          <div className="topbar-left">
            <button className="menu-toggle mobile-only">
              <Menu size={24} />
            </button>
            <h2 className="page-title">Scholar Portal</h2>
          </div>

          <div className="topbar-right">
            <div className="user-profile">
              <div className="user-info hide-mobile" style={{ textAlign: 'right' }}>
                <span className="user-name" style={{ display: 'block', fontWeight: '800', color: '#0f172a' }}>{storedUser.username}</span>
                <span className="user-email" style={{ display: 'block', fontSize: '11px', color: '#64748b', fontWeight: '600' }}>{storedUser.email || 'Undergraduate Learner'}</span>
              </div>
              <div className="user-avatar">
                {storedUser.username ? storedUser.username[0] : 'S'}
              </div>
            </div>
            <button
               className="logout-button" 
               onClick={() => {
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
            <Route path="/" element={<Courses courses={courses} onEnroll={handleEnroll} />} />
            <Route path="/learning" element={<Learning enrolledCourses={enrolledCourses} />} />
            <Route path="/assignments" element={<Assignments />} />
            <Route path="/notes" element={<NotesSharing />} />

            <Route path="/notifications" element={<Notifications />} />
            <Route path="/profile" element={<Profile user={storedUser} />} />
          </Routes>
        </div>
      </div>
    </div>
  );
}
