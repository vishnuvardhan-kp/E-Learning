import { useState } from "react";
import "./dashboard.css";

export default function Dashboard() {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);

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
      
      <div className="grid">
        <div className="card">
          <h3>Total Students</h3>
          <p>12,450</p>
        </div>
        <div className="card">
          <h3>Total Teachers</h3>
          <p>450</p>
        </div>
        <div className="card">
          <h3>Students Present</h3>
          <p>11,720</p>
        </div>
        <div className="card">
          <h3>Faculty Present</h3>
          <p>438</p>
        </div>
        <div className="card">
          <h3>Active Courses</h3>
          <p>120</p>
        </div>
        <div className="card">
          <h3>Pending Approvals</h3>
          <p>15</p>
        </div>
      </div>
    </div>
  );
}