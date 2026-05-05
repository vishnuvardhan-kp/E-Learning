import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./users.css";

export default function Teachers() {
  const navigate = useNavigate();
  const [showAdd, setShowAdd] = useState(false);
  const [dept, setDept] = useState("");
  const [search, setSearch] = useState("");

  const teachers = [
    { id: 1, name: "Dr. Smith", dept: "CSE", role: "HOD" },
    { id: 2, name: "Prof. Johnson", dept: "IT", role: "Senior" },
    { id: 3, name: "Ms. Davis", dept: "MECH", role: "Year Incharge" },
    { id: 4, name: "Mr. Brown", dept: "CIVIL", role: "Assistant Professor" }
  ];

  const filtered = teachers.filter((t) =>
    (dept === "" || t.dept === dept) &&
    (t.name.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="animate-fade-in">
      <div className="header-bar">
         <h1>Faculty Management</h1>
         <button className="action-btn action-btn-primary" onClick={() => setShowAdd(true)}>
           + New Faculty Accreditation
         </button>
      </div>

      <div className="filters-container">
        <select onChange={(e) => setDept(e.target.value)}>
          <option value="">All Departments</option>
          <option value="CSE">CSE</option>
          <option value="IT">IT</option>
          <option value="MECH">MECH</option>
          <option value="CIVIL">CIVIL</option>
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
              <th>Full Name</th>
              <th>Department Cluster</th>
              <th>Institutional Role</th>
              <th style={{ textAlign: 'center' }}>Actions</th>
            </tr>
          </thead>

          <tbody>
            {filtered.map((t) => (
              <tr key={t.id}>
                <td>{t.name}</td>
                <td>{t.dept}</td>
                <td>
                  <span className={`class-badge ${
                      t.role === "HOD" ? "role-hod" : 
                      t.role === "Senior" ? "role-senior" : 
                      t.role === "Year Incharge" ? "role-incharge" : "role-assistant"
                    }`}
                  >
                    {t.role}
                  </span>
                </td>
                <td>
                  <div className="action-cell">
                    <button className="action-btn action-btn-primary" onClick={() => navigate(`/teachers/${t.id}`)}>Profile</button>
                    <button className="action-btn" onClick={() => alert("Edit " + t.name)}>Modify</button>
                    <button className="action-btn action-btn-danger" onClick={() => alert("Delete " + t.name)}>Delete</button>
                  </div>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={4} className="no-data-cell">No institutional matches found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {showAdd && (
        <div className="modal-backdrop">
          <div className="modal-surface">
            <h2>New Faculty Accreditation</h2>
            <div className="form-grid">
                <input placeholder="Full Name" />
                <select>
                    <option>Select Institutional Role</option>
                    <option>HOD</option>
                    <option>Senior Professor</option>
                    <option>Year Incharge</option>
                </select>
                <select>
                    <option>Department Cluster</option>
                    <option>CSE</option>
                    <option>IT</option>
                    <option>MECH</option>
                </select>
                <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                    <button className="action-btn action-btn-primary" style={{ flex: 1, padding: '16px' }} onClick={() => setShowAdd(false)}>Accredit Faculty</button>
                    <button className="action-btn" style={{ flex: 1, padding: '16px' }} onClick={() => setShowAdd(false)}>Cancel</button>
                </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}