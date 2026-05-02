import { useState, useEffect } from "react";
import "./users.css";

export default function Courses() {
  const [filter, setFilter] = useState("All");
  const [dept, setDept] = useState("");
  const [courses, setCourses] = useState([]);

  const fetchCourses = async () => {
    try {
      const res = await fetch("http://localhost:5000/courses");
      const data = await res.json();
      setCourses(data);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  const approveCourse = async (id) => {
    try {
      // In a real app we'd have a specific approve route, here we'll just update the status
      await fetch(`http://localhost:5000/courses/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "Active" })
      });
      fetchCourses();
    } catch (e) {
      console.error(e);
    }
  };

  const deleteCourse = async (id) => {
    if (window.confirm("Delete this course permanently?")) {
      try {
        await fetch(`http://localhost:5000/courses/${id}`, {
          method: "DELETE"
        });
        fetchCourses();
      } catch (e) {
        console.error(e);
      }
    }
  };

  const filtered = courses.filter(c =>
    (filter === "All" || (c.status || "Pending") === filter) &&
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
              <th style={{ textAlign: 'center' }}>Actions</th>
            </tr>
          </thead>

          <tbody>
            {filtered.map((c) => (
              <tr key={c._id}>
                <td>{c.title}</td>
                <td>{c.instructorName || "Assigned Faculty"}</td>
                <td><span className="class-badge" style={{ backgroundColor: '#f1f5f9', color: '#475569' }}>{c.dept || "Gen"}</span></td>
                <td>
                  <span className={`class-badge ${(c.status || "Pending") === "Active" ? "role-assistant" : "role-incharge"}`}>
                    {c.status || "Pending"}
                  </span>
                </td>
                <td style={{ fontWeight: 800 }}>{c.enrollmentCount || 0}</td>
                <td>
                   <div className="action-cell">
                     {(c.status || "Pending") === "Pending" && (
                        <button className="action-btn" style={{ backgroundColor: '#059669', color: '#fff', borderColor: '#059669' }} onClick={() => approveCourse(c._id)}>Approve</button>
                     )}
                     <button className="action-btn action-btn-primary" onClick={() => alert("Viewing " + c.title)}>Record</button>
                     <button className="action-btn action-btn-danger" onClick={() => deleteCourse(c._id)}>Remove</button>
                   </div>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={6} className="no-data-cell">No institutional matches found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}