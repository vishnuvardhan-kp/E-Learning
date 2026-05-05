import { useState } from "react";
import "./users.css";

export default function Courses() {
  const [filter, setFilter] = useState("All");
  const [dept, setDept] = useState("");

  const [courses, setCourses] = useState([
    { id: 1, title: "Full Stack Development", instructor: "Dr. Karthik", dept: "CSE", category: "Programming", status: "Active", enrollment: 450, rating: 4.8 },
    { id: 2, title: "UI/UX Design", instructor: "Prof. Meera", dept: "IT", category: "Design", status: "Pending", enrollment: 0, rating: 0 },
    { id: 3, title: "Data Structures", instructor: "Mr. Rajan", dept: "CSE", category: "Core", status: "Active", enrollment: 1200, rating: 4.9 },
    { id: 4, title: "Machine Learning", instructor: "Dr. Karthik", dept: "AI", category: "AI/ML", status: "Active", enrollment: 850, rating: 4.7 }
  ]);

  const approveCourse = (id) => {
    setCourses(courses.map(c =>
      c.id === id ? { ...c, status: "Active" } : c
    ));
  };

  const deleteCourse = (id) => {
    setCourses(courses.filter(c => c.id !== id));
  };

  const filtered = courses.filter(c =>
    (filter === "All" || c.status === filter) &&
    (dept === "" || c.dept === dept)
  );

  return (
    <div className="animate-fade-in">
      <h1>Course Management</h1>

      <div className="filters-container">
        <select onChange={(e) => setFilter(e.target.value)}>
          <option value="All">All Courses</option>
          <option value="Active">Active</option>
          <option value="Pending">Pending</option>
        </select>

        <select onChange={(e) => setDept(e.target.value)}>
          <option value="">All Departments</option>
          <option value="CSE">CSE</option>
          <option value="IT">IT</option>
          <option value="MECH">MECH</option>
          <option value="CIVIL">CIVIL</option>
          <option value="AI">AI</option>
        </select>
      </div>

      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Course Title</th>
              <th>Instructor</th>
              <th>Dept</th>
              <th>Status</th>
              <th>Students</th>
              <th>Rating</th>
              <th style={{ textAlign: 'center' }}>Actions</th>
            </tr>
          </thead>

          <tbody>
            {filtered.map((c) => (
              <tr key={c.id}>
                <td>{c.title}</td>
                <td>{c.instructor}</td>
                <td><span className="class-badge" style={{ backgroundColor: '#f1f5f9', color: '#475569' }}>{c.dept}</span></td>
                <td>
                  <span className={`class-badge ${c.status === "Active" ? "role-assistant" : "role-incharge"}`}>
                    {c.status}
                  </span>
                </td>
                <td style={{ fontWeight: 800 }}>{c.enrollment}</td>
                <td style={{ fontWeight: 800, color: '#eab308' }}>⭐ {c.rating || "N/A"}</td>
                <td>
                   <div className="action-cell">
                     {c.status === "Pending" && (
                        <button className="action-btn" style={{ backgroundColor: '#059669', color: '#fff', borderColor: '#059669' }} onClick={() => approveCourse(c.id)}>Approve</button>
                     )}
                     <button className="action-btn action-btn-primary" onClick={() => alert("Viewing " + c.title)}>Record</button>
                     <button className="action-btn action-btn-danger" onClick={() => deleteCourse(c.id)}>Remove</button>
                   </div>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={7} className="no-data-cell">No institutional matches found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}