import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./users.css";

export default function Users() {
  const navigate = useNavigate();
  const [showAdd, setShowAdd] = useState(false);
  const [batch, setBatch] = useState("");
  const [dept, setDept] = useState("");
  const [year, setYear] = useState("");
  const [search, setSearch] = useState("");

  const students = [
    { id: 1, name: "Arun Kumar", rollNo: "20CS001", batch: "2020-2024", dept: "CSE", year: "4th Year", section: "A" },
    { id: 2, name: "Priya Divya", rollNo: "21IT045", batch: "2021-2025", dept: "IT", year: "3rd Year", section: "B" },
    { id: 3, name: "R. Kumar", rollNo: "20ME012", batch: "2020-2024", dept: "MECH", year: "4th Year", section: "C" },
    { id: 4, name: "Divya S.", rollNo: "21CE089", batch: "2021-2025", dept: "CIVIL", year: "3rd Year", section: "D" }
  ];

  const filtered = students.filter((s) =>
    (batch === "" || s.batch === batch) &&
    (dept === "" || s.dept === dept) &&
    (year === "" || s.year === year) &&
    (s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.rollNo.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="animate-fade-in">
      <div className="header-bar">
         <h1>Student Management</h1>
         <button className="action-btn action-btn-primary" onClick={() => setShowAdd(true)}>
           + New Student Enrollment
         </button>
      </div>

      <div className="filters-container">
        <select onChange={(e) => setBatch(e.target.value)}>
          <option value="">All Batches</option>
          <option value="2020-2024">2020-2024</option>
          <option value="2021-2025">2021-2025</option>
        </select>

        <select onChange={(e) => setDept(e.target.value)}>
          <option value="">All Departments</option>
          <option value="CSE">CSE</option>
          <option value="IT">IT</option>
          <option value="MECH">MECH</option>
        </select>

        <select onChange={(e) => setYear(e.target.value)}>
          <option value="">All Years</option>
          <option value="1st Year">1st Year</option>
          <option value="2nd Year">2nd Year</option>
          <option value="3rd Year">3rd Year</option>
          <option value="4th Year">4th Year</option>
        </select>

        <input
          type="text"
          placeholder="Search identity..."
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Roll Number</th>
              <th>Student Name</th>
              <th>Batch</th>
              <th>Year</th>
              <th>Dept</th>
              <th>Class</th>
              <th style={{ textAlign: 'center' }}>Actions</th>
            </tr>
          </thead>

          <tbody>
            {filtered.map((s) => (
              <tr key={s.id}>
                <td>{s.rollNo}</td>
                <td>{s.name}</td>
                <td>{s.batch}</td>
                <td>{s.year}</td>
                <td>{s.dept}</td>
                <td><span className="class-badge">{s.section}</span></td>
                <td>
                  <div className="action-cell">
                    <button className="action-btn action-btn-primary" onClick={() => navigate(`/students/${s.id}`)}>View Profile</button>
                    <button className="action-btn" onClick={() => alert("Edit " + s.name)}>Modify</button>
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

      {showAdd && (
        <div className="modal-backdrop">
          <div className="modal-surface">
            <h2>New Student Enrollment</h2>
            <div className="form-grid">
                <input placeholder="Full Legal Name" />
                <input placeholder="Roll Number (e.g., 20CS001)" />
                <select>
                    <option>Select Department</option>
                    <option>CSE</option>
                    <option>IT</option>
                    <option>MECH</option>
                </select>
                <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                    <button className="action-btn action-btn-primary" style={{ flex: 1, padding: '16px' }} onClick={() => setShowAdd(false)}>Create Record</button>
                    <button className="action-btn" style={{ flex: 1, padding: '16px' }} onClick={() => setShowAdd(false)}>Cancel</button>
                </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}