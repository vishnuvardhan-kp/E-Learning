import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./users.css";

export default function Users() {
  const navigate = useNavigate();
  const [showAdd, setShowAdd] = useState(false);
  const [batch, setBatch] = useState("");
  const [dept, setDept] = useState("");
  const [year, setYear] = useState("");
  const [search, setSearch] = useState("");
  const [students, setStudents] = useState([]);
  
  const [newUser, setNewUser] = useState({ username: "", email: "", password: "", dept: "", year: "" });

  const fetchStudents = async () => {
    try {
      const res = await fetch("http://localhost:5000/student");
      const data = await res.json();
      setStudents(data);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  const handleCreateStudent = async () => {
    try {
      await fetch("http://localhost:5000/admin/create-user", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...newUser, role: "student" })
      });
      setShowAdd(false);
      setNewUser({ username: "", email: "", password: "", dept: "", year: "" });
      fetchStudents();
    } catch (e) {
      console.error(e);
    }
  };

  const filtered = students.filter((s) =>
    (batch === "" || s.batch === batch) &&
    (dept === "" || s.dept === dept) &&
    (year === "" || s.year === year) &&
    (s.username?.toLowerCase().includes(search.toLowerCase()) ||
      s.email?.toLowerCase().includes(search.toLowerCase()))
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
              <th>Username</th>
              <th>Email</th>
              <th>Batch</th>
              <th>Year</th>
              <th>Dept</th>
              <th style={{ textAlign: 'center' }}>Actions</th>
            </tr>
          </thead>

          <tbody>
            {filtered.map((s) => (
              <tr key={s._id}>
                <td>{s.username}</td>
                <td>{s.email}</td>
                <td>{s.batch || "-"}</td>
                <td>{s.year || "-"}</td>
                <td>{s.dept || "-"}</td>
                <td>
                  <div className="action-cell">
                    <button className="action-btn action-btn-primary" onClick={() => navigate(`/students/${s._id}`)}>View Profile</button>
                    <button className="action-btn" onClick={() => navigate(`/students/${s._id}`)}>Modify</button>
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

      {showAdd && (
        <div className="modal-backdrop">
          <div className="modal-surface">
            <h2>New Student Enrollment</h2>
            <div className="form-grid">
                <input placeholder="Username" value={newUser.username} onChange={e => setNewUser({...newUser, username: e.target.value})} />
                <input placeholder="Email" type="email" value={newUser.email} onChange={e => setNewUser({...newUser, email: e.target.value})} />
                <input placeholder="Password" type="password" value={newUser.password} onChange={e => setNewUser({...newUser, password: e.target.value})} />
                <select value={newUser.dept} onChange={e => setNewUser({...newUser, dept: e.target.value})}>
                    <option value="">Select Department</option>
                    <option value="CSE">CSE</option>
                    <option value="IT">IT</option>
                    <option value="MECH">MECH</option>
                </select>
                <select value={newUser.year} onChange={e => setNewUser({...newUser, year: e.target.value})}>
                    <option value="">Select Year</option>
                    <option value="1st Year">1st Year</option>
                    <option value="2nd Year">2nd Year</option>
                    <option value="3rd Year">3rd Year</option>
                    <option value="4th Year">4th Year</option>
                </select>
                <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                    <button className="action-btn action-btn-primary" style={{ flex: 1, padding: '16px' }} onClick={handleCreateStudent}>Create Account</button>
                    <button className="action-btn" style={{ flex: 1, padding: '16px' }} onClick={() => setShowAdd(false)}>Cancel</button>
                </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}