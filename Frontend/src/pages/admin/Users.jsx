import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { UserPlus, Search, Filter, Eye, Edit3, X } from "lucide-react";
import { API_URL } from "../../api/backend";
import "./users.css";

export default function Users() {
  const navigate = useNavigate();
  const [showAdd, setShowAdd] = useState(false);
  const [batch, setBatch] = useState("");
  const [dept, setDept] = useState("");
  const [year, setYear] = useState("");
  const [section, setSection] = useState("");
  const [search, setSearch] = useState("");
  const [students, setStudents] = useState([]);
  
  const [newUser, setNewUser] = useState({ 
    username: "", 
    email: "", 
    password: "", 
    rollno: "",
    dept: "", 
    year: "",
    section: "",
    batch: ""
  });

  const fetchStudents = async () => {
    try {
      const res = await fetch(API_URL + '/student');
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
      await fetch(API_URL + '/admin/create-user', {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...newUser, role: "student" })
      });
      setShowAdd(false);
      setNewUser({ username: "", email: "", password: "", rollno: "", dept: "", year: "", section: "", batch: "" });
      fetchStudents();
    } catch (e) {
      console.error(e);
    }
  };

  const filtered = students.filter((s) =>
    (batch === "" || s.batch === batch) &&
    (dept === "" || s.dept === dept) &&
    (year === "" || s.year === year) &&
    (section === "" || s.section === section) &&
    (s.username?.toLowerCase().includes(search.toLowerCase()) ||
      s.email?.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="animate-fade-in module-container">
      <div className="header-bar">
         <h1 className="page-title">Student Management</h1>
         <button className="action-btn-primary" onClick={() => setShowAdd(true)} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '12px 24px', borderRadius: '12px', border: 'none', cursor: 'pointer', fontWeight: 800 }}>
           <UserPlus size={20} />
           Enroll Student
         </button>
      </div>

      <div className="filters-container">
        <div className="filter-group">
          <Filter size={16} className="filter-icon" />
          <select value={batch} onChange={(e) => setBatch(e.target.value)}>
            <option value="">All Batches</option>
            <option value="2020-2024">2020-2024</option>
            <option value="2021-2025">2021-2025</option>
            <option value="2022-2026">2022-2026</option>
          </select>
        </div>

        <select value={dept} onChange={(e) => setDept(e.target.value)}>
          <option value="">All Departments</option>
          <option value="CSE">CSE</option>
          <option value="IT">IT</option>
          <option value="ECE">ECE</option>
          <option value="MECH">MECH</option>
        </select>

        <select value={year} onChange={(e) => setYear(e.target.value)}>
          <option value="">All Years</option>
          <option value="1st Year">1st Year</option>
          <option value="2nd Year">2nd Year</option>
          <option value="3rd Year">3rd Year</option>
          <option value="4th Year">4th Year</option>
        </select>

        <select value={section} onChange={(e) => setSection(e.target.value)}>
          <option value="">All Sections</option>
          <option value="A">Section A</option>
          <option value="B">Section B</option>
          <option value="C">Section C</option>
          <option value="D">Section D</option>
        </select>

        <div className="search-box">
          <Search size={18} className="search-icon" />
          <input
            type="text"
            placeholder="Search by name or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <div className="table-wrapper">
        <table className="modern-table">
          <thead>
            <tr>
              <th>Student</th>
              <th>Dept / Year</th>
              <th>Section</th>
              <th>Batch</th>
              <th style={{ textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>

          <tbody>
            {filtered.map((s) => (
              <tr key={s._id}>
                <td>
                  <div className="student-cell">
                    <div className="student-avatar-small">{s.username ? s.username[0] : '?'}</div>
                    <div className="student-info-small">
                      <span className="name">{s.username || 'Unnamed'}</span>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        {s.rollno && <span style={{ fontSize: '10px', fontWeight: 800, color: '#2563eb', background: '#eff6ff', padding: '1px 6px', borderRadius: '4px' }}>{s.rollno}</span>}
                        <span className="email">{s.email || 'no-email'}</span>
                      </div>
                    </div>
                  </div>
                </td>
                <td>
                  <div className="dept-year">
                    <span className="dept-badge">{s.dept || "N/A"}</span>
                    <span className="year-text">{s.year || "N/A"}</span>
                  </div>
                </td>
                <td>
                  <span className={`section-badge section-${s.section || 'NA'}`}>
                    {s.section ? `Sec ${s.section}` : "N/A"}
                  </span>
                </td>
                <td><span className="batch-text">{s.batch || "-"}</span></td>
                <td>
                  <div className="actions-cell">
                    <button className="icon-btn view-btn" onClick={() => navigate(`/admin/students/${s._id}`)} title="View Profile">
                      <Eye size={18} />
                    </button>
                    <button className="icon-btn edit-btn" onClick={() => navigate(`/admin/students/${s._id}`)} title="Modify Record">
                      <Edit3 size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={5} className="empty-table-cell">
                  <div className="empty-state">
                    <p>No students found matching the selected criteria.</p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {showAdd && (
        <div className="modal-overlay animate-fade-in">
          <div className="modal-content">
            <div className="modal-header">
              <h2>Enroll New Student</h2>
              <button className="close-btn" onClick={() => setShowAdd(false)}><X size={24} /></button>
            </div>
            <div className="form-layout">
                <div className="input-group" style={{ gridColumn: 'span 2' }}>
                  <label>Full Name</label>
                  <input placeholder="Enter username" value={newUser.username} onChange={e => setNewUser({...newUser, username: e.target.value})} />
                </div>
                <div className="input-group">
                  <label>Institutional Email</label>
                  <input placeholder="student@college.edu" type="email" value={newUser.email} onChange={e => setNewUser({...newUser, email: e.target.value})} />
                </div>
                <div className="input-group">
                  <label>Secure Password</label>
                  <input placeholder="••••••••" type="password" value={newUser.password} onChange={e => setNewUser({...newUser, password: e.target.value})} />
                </div>
                <div className="input-group">
                  <label>Roll Number</label>
                  <input placeholder="e.g. 24CSE001" value={newUser.rollno} onChange={e => setNewUser({...newUser, rollno: e.target.value})} />
                </div>
                <div className="input-group">
                  <label>Department</label>
                  <select value={newUser.dept} onChange={e => setNewUser({...newUser, dept: e.target.value})}>
                      <option value="">Select Dept</option>
                      <option value="CSE">CSE</option>
                      <option value="IT">IT</option>
                      <option value="ECE">ECE</option>
                      <option value="MECH">MECH</option>
                  </select>
                </div>
                <div className="input-group">
                  <label>Year / Section</label>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <select value={newUser.year} onChange={e => setNewUser({...newUser, year: e.target.value})} style={{ flex: 2 }}>
                        <option value="">Year</option>
                        <option value="1st Year">1st</option>
                        <option value="2nd Year">2nd</option>
                        <option value="3rd Year">3rd</option>
                        <option value="4th Year">4th</option>
                    </select>
                    <select value={newUser.section} onChange={e => setNewUser({...newUser, section: e.target.value})} style={{ flex: 1 }}>
                        <option value="">Sec</option>
                        <option value="A">A</option>
                        <option value="B">B</option>
                        <option value="C">C</option>
                        <option value="D">D</option>
                    </select>
                  </div>
                </div>
                <div className="input-group" style={{ gridColumn: 'span 2' }}>
                  <label>Admission Batch</label>
                  <select value={newUser.batch} onChange={e => setNewUser({...newUser, batch: e.target.value})}>
                      <option value="">Select Batch</option>
                      <option value="2020-2024">2020-2024</option>
                      <option value="2021-2025">2021-2025</option>
                      <option value="2022-2026">2022-2026</option>
                      <option value="2023-2027">2023-2027</option>
                      <option value="2024-2028">2024-2028</option>
                  </select>
                </div>
                <div className="modal-actions">
                    <button className="action-btn-primary full-width" onClick={handleCreateStudent}>Create Academic Record</button>
                    <button className="action-btn-ghost full-width" onClick={() => setShowAdd(false)}>Discard</button>
                </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
