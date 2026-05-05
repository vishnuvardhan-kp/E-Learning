import { useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import AdminApp from './pages/admin/AdminApp';
import InstructorApp from './pages/instructor/InstructorApp';
import StudentApp from './pages/student/StudentApp';
import Login from './pages/Login';

function RoleGuard({ allowedRole, children }) {
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';

  if (!isAuthenticated) return <Navigate to="/login" replace />;

  // Map stored role to portal route
  const roleMap = { admin: 'admin', instructor: 'instructor', student: 'student' };
  if (user.role && user.role !== allowedRole) {
    return <Navigate to={`/${roleMap[user.role] || 'login'}`} replace />;
  }

  return children;
}

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(
    localStorage.getItem('isAuthenticated') === 'true'
  );

  const onAuth = () => setIsAuthenticated(true);

  // If already authenticated, redirect root to the correct portal
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const getPortal = () => {
    if (!isAuthenticated) return '/login';
    const portals = { admin: '/admin', instructor: '/instructor', student: '/student' };
    return portals[user.role] || '/login';
  };

  return (
    <Routes>
      <Route path="/login" element={
        isAuthenticated ? <Navigate to={getPortal()} replace /> : <Login onAuth={onAuth} />
      } />

      <Route path="/admin/*" element={
        <RoleGuard allowedRole="admin">
          <AdminApp />
        </RoleGuard>
      } />

      <Route path="/instructor/*" element={
        <RoleGuard allowedRole="instructor">
          <InstructorApp />
        </RoleGuard>
      } />

      <Route path="/student/*" element={
        <RoleGuard allowedRole="student">
          <StudentApp />
        </RoleGuard>
      } />

      {/* Legacy redirects */}
      <Route path="/students/:id" element={<Navigate replace to="/admin/students/:id" />} />
      <Route path="/students"     element={<Navigate replace to="/admin/students" />} />
      <Route path="/teachers/:id" element={<Navigate replace to="/admin/teachers/:id" />} />
      <Route path="/teachers"     element={<Navigate replace to="/admin/teachers" />} />

      {/* Root → smart redirect based on role */}
      <Route path="/" element={<Navigate to={getPortal()} replace />} />

      {/* 404 fallback */}
      <Route path="*" element={<Navigate to={getPortal()} replace />} />
    </Routes>
  );
}
