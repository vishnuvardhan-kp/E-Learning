import { useState, useEffect } from "react";
import { API_URL } from "../../api/backend";
import "./dashboard.css";

export default function Dashboard() {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [stats, setStats] = useState({
    totalStudents: 0,
    totalTeachers: 0,
    studentsPresent: 0,
    facultyPresent: 0,
    activeCourses: 0,
    pendingApprovals: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch(__API_URL__ + '/admin/stats');
        const data = await response.json();
        setStats(data);
      } catch (error) {
        console.error("Error fetching stats:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
    // Refresh every 30 seconds for "real-time" feel
    const interval = setInterval(fetchStats, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="dashboard animate-fade-in">
      <div className="dashboard-header">
        <h1>Dashboard Overview</h1>
        
        <div className="temporal-controls">
          <label className="temporal-label">
            Operational Context
          </label>
          <input 
            type="date" 
            className="temporal-input"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
          />
        </div>
      </div>
      
      {loading ? (
        <div className="loading-state">Syncing institutional data...</div>
      ) : (
        <div className="grid">
          <div className="card">
            <h3>Total Students</h3>
            <p>{stats.totalStudents.toLocaleString()}</p>
          </div>
          <div className="card">
            <h3>Total Teachers</h3>
            <p>{stats.totalTeachers.toLocaleString()}</p>
          </div>
          <div className="card">
            <h3>Students Present</h3>
            <p>{stats.studentsPresent.toLocaleString()}</p>
          </div>
          <div className="card">
            <h3>Faculty Present</h3>
            <p>{stats.facultyPresent.toLocaleString()}</p>
          </div>
          <div className="card">
            <h3>Active Courses</h3>
            <p>{stats.activeCourses.toLocaleString()}</p>
          </div>
          <div className="card">
            <h3>Pending Approvals</h3>
            <p>{stats.pendingApprovals.toLocaleString()}</p>
          </div>
        </div>
      )}
    </div>
  );
}
