import { useState, useEffect } from 'react';
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  UserSquare2, 
  BookOpen, 
  ShieldCheck, 
  Bell, 
  LogOut,
  Menu,
  X,
  User as UserIcon,
  CheckSquare
} from 'lucide-react';
import './AdminApp.css';

import Dashboard from './Dashboard';
import UsersPage from './Users';
import StudentProfile from './StudentProfile';
import Teachers from './Teachers';
import TeacherProfile from './TeacherProfile';
import Courses from './Courses';
import CreateCourse from './CreateCourse';
import CourseApprovals from './CourseApprovals';
import Moderation from './Moderation';
import Notifications from './Notifications';

function Sidebar() {
  const location = useLocation();
  const isActive = (path) => location.pathname === path ? 'active' : '';

  return (
    <aside className="sidebar hide-mobile">
      <div className="sidebar-brand">
        <div className="brand-logo">E</div>
        <h2>ACADEMIA</h2>
      </div>

      <nav>
        <Link to="/admin" className={isActive('/admin')}>
          <LayoutDashboard size={20} />
          <span>Dashboard</span>
        </Link>
        <Link to="/admin/students" className={isActive('/admin/students')}>
          <Users size={20} />
          <span>Students</span>
        </Link>
        <Link to="/admin/teachers" className={isActive('/admin/teachers')}>
          <UserSquare2 size={20} />
          <span>Teachers</span>
        </Link>
        <Link to="/admin/courses" className={isActive('/admin/courses')}>
          <BookOpen size={20} />
          <span>Courses</span>
        </Link>
        <Link to="/admin/moderation" className={isActive('/admin/moderation')}>
          <ShieldCheck size={20} />
          <span>Student Notes</span>
        </Link>
        <Link to="/admin/notifications" className={isActive('/admin/notifications')}>
          <Bell size={20} />
          <span>Notifications</span>
        </Link>
      </nav>

      <div className="sidebar-logout" style={{ marginTop: 'auto', padding: '20px' }}>
        <button
           className="logout-button" 
           style={{ width: '100%', justifyContent: 'center' }}
           onClick={() => {
             localStorage.removeItem('isAuthenticated');
             window.location.href = '/login';
           }}
        >
          <LogOut size={18} />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
}

export default function AdminApp() {
  const location = useLocation();
  const isActive = (path) => location.pathname === path ? 'active' : '';

  return (
    <div className="app-layout">
      <Sidebar />

      <div className="main-content">
        <header className="topbar hide-mobile">
          <div className="topbar-left">
            <h2 className="page-title">Institutional Oversight</h2>
            <button 
              onClick={() => window.location.href = '/admin/course-approvals'}
              style={{ marginLeft: '20px', background: '#ecfdf5', color: '#10b981', border: '1px solid #10b981', padding: '8px 16px', borderRadius: '10px', fontSize: '13px', fontWeight: 800, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}
            >
              <CheckSquare size={16} />
              Course Approvals
            </button>
          </div>
          <div className="topbar-right"></div>
        </header>

        <div className="page-body animate-fade-in">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/students" element={<UsersPage />} />
            <Route path="/students/:id" element={<StudentProfile />} />
            <Route path="/teachers" element={<Teachers />} />
            <Route path="/teachers/:id" element={<TeacherProfile />} />
            <Route path="/courses" element={<Courses />} />
            <Route path="/courses/create" element={<CreateCourse />} />
            <Route path="/course-approvals" element={<CourseApprovals />} />
            <Route path="/moderation" element={<Moderation />} />
            <Route path="/notifications" element={<Notifications />} />
          </Routes>
        </div>

        {/* Full-Feature Bottom Navigation for Mobile */}
        <div className="mobile-nav-container mobile-only">
            <div className="mobile-nav">
                <Link to="/admin" className={isActive('/admin')}>
                    <LayoutDashboard size={20} />
                    <span>Home</span>
                </Link>
                <Link to="/admin/students" className={isActive('/admin/students')}>
                    <Users size={20} />
                    <span>Students</span>
                </Link>
                <Link to="/admin/teachers" className={isActive('/admin/teachers')}>
                    <UserSquare2 size={20} />
                    <span>Teachers</span>
                </Link>
                <Link to="/admin/courses" className={isActive('/admin/courses')}>
                    <BookOpen size={20} />
                    <span>Courses</span>
                </Link>
                <Link to="/admin/moderation" className={isActive('/admin/moderation')}>
                    <ShieldCheck size={20} />
                    <span>Notes</span>
                </Link>
                <Link to="/admin/notifications" className={isActive('/admin/notifications')}>
                    <Bell size={20} />
                    <span>Alerts</span>
                </Link>
                <button 
                  className="mobile-nav-logout"
                  onClick={() => {
                    localStorage.removeItem('isAuthenticated');
                    window.location.href = '/login';
                  }}
                >
                  <LogOut size={20} />
                  <span>Exit</span>
                </button>
            </div>
        </div>
      </div>
    </div>
  );
}
