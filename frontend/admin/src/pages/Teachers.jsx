import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./users.css";

export default function Teachers() {
  const navigate = useNavigate();
  const [showAdd, setShowAdd] = useState(false);
  const [dept, setDept] = useState("");
  const [search, setSearch] = useState("");
  const [teachers, setTeachers] = useState([]);
  
  const [newUser, setNewUser] = useState({ username: "", email: "", password: "", dept: "", roleName: "" });

  const fetchTeachers = async () => {
    try {
      const res = await fetch("http://localhost:5000/instructor");
      const data = await res.json();
      setTeachers(data);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    fetchTeachers();
  }, []);

  const handleCreateTeacher = async () => {
    try {
      await fetch("http://localhost:5000/admin/create-user", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...newUser, role: "instructor" })
      });
      setShowAdd(false);
      setNewUser({ username: "", email: "", password: "", dept: "", roleName: "" });
      fetchTeachers();
    } catch (e) {
      console.error(e);
    }
  };

  const filtered = teachers.filter((t) =>
    (dept === "" || t.dept === dept) &&
    (t.username?.toLowerCase().includes(search.toLowerCase()) || 
     t.email?.toLowerCase().includes(search.toLowerCase()))
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
              <th>Username</th>
              <th>Email</th>
              <th>Department Cluster</th>
              <th>Institutional Role</th>
              <th style={{ textAlign: 'center' }}>Actions</th>
            </tr>
          </thead>

          <tbody>
            {filtered.map((t) => (
              <tr key={t._id}>
                <td>{t.username}</td>
                <td>{t.email}</td>
                <td>{t.dept || "-"}</td>
                <td>
                  <span className={`class-badge ${
                      t.roleName === "HOD" ? "role-hod" : 
                      t.roleName === "Senior" ? "role-senior" : 
                      t.roleName === "Year Incharge" ? "role-incharge" : "role-assistant"
                    }`}
                  >
                    {t.roleName || "-"}
                  </span>
                </td>
                <td>
                  <div className="action-cell">
                    <button className="action-btn action-btn-primary" onClick={() => navigate(`/teachers/${t._id}`)}>Profile</button>
                    <button className="action-btn" onClick={() => navigate(`/teachers/${t._id}`)}>Modify</button>
                    <button className="action-btn action-btn-danger" onClick={async () => {
                      if(window.confirm("Delete " + t.username + "?")) {
                        await fetch(`http://localhost:5000/users/instructor/${t._id}`, { method: 'DELETE' });
                        fetchTeachers();
                      }
                    }}>Delete</button>
                  </div>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={5} className="no-data-cell">No institutional matches found.</td>
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
                <input placeholder="Username" value={newUser.username} onChange={e => setNewUser({...newUser, username: e.target.value})} />
                <input placeholder="Email" type="email" value={newUser.email} onChange={e => setNewUser({...newUser, email: e.target.value})} />
                <input placeholder="Password" type="password" value={newUser.password} onChange={e => setNewUser({...newUser, password: e.target.value})} />
                <select value={newUser.roleName} onChange={e => setNewUser({...newUser, roleName: e.target.value})}>
                    <option value="">Select Institutional Role</option>
                    <option value="HOD">HOD</option>
                    <option value="Senior">Senior Professor</option>
                    <option value="Year Incharge">Year Incharge</option>
                </select>
                <select value={newUser.dept} onChange={e => setNewUser({...newUser, dept: e.target.value})}>
                    <option value="">Department Cluster</option>
                    <option value="CSE">CSE</option>
                    <option value="IT">IT</option>
                    <option value="MECH">MECH</option>
                </select>
                <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                    <button className="action-btn action-btn-primary" style={{ flex: 1, padding: '16px' }} onClick={handleCreateTeacher}>Accredit Faculty</button>
                    <button className="action-btn" style={{ flex: 1, padding: '16px' }} onClick={() => setShowAdd(false)}>Cancel</button>
                </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}