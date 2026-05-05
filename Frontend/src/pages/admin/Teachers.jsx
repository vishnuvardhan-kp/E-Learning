import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { UserPlus, Search, Filter, Eye, Edit3, X, Trash2 } from "lucide-react";
import { API_URL } from "../../api/backend";
import "./users.css";

export default function Teachers() {
  const navigate = useNavigate();
  const [showAdd, setShowAdd] = useState(false);
  const [dept, setDept] = useState("");
  const [search, setSearch] = useState("");
  const [teachers, setTeachers] = useState([]);
  
  const [newUser, setNewUser] = useState({ 
    username: "", 
    email: "", 
    password: "", 
    dept: "", 
    roleName: "" 
  });

  const fetchTeachers = async () => {
    try {
      const res = await fetch(API_URL + '/instructor');
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
      await fetch(API_URL + '/admin/create-user', {
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

  const deleteTeacher = async (id, name) => {
    if(window.confirm(`Terminate accreditation for ${name}?`)) {
      try {
        await fetch(`${API_URL}/users/instructor/${id}`, { method: 'DELETE' });
        fetchTeachers();
      } catch (e) { console.error(e); }
    }
  };

  const filtered = teachers.filter((t) =>
    (dept === "" || t.dept === dept) &&
    (t.username?.toLowerCase().includes(search.toLowerCase()) || 
     t.email?.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="animate-fade-in module-container">
      <div className="header-bar">
         <h1 className="page-title">Faculty Management</h1>
         <button className="action-btn-primary" onClick={() => setShowAdd(true)} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '12px 24px', borderRadius: '12px', border: 'none', cursor: 'pointer', fontWeight: 800 }}>
           <UserPlus size={20} />
           Accredit Faculty
         </button>
      </div>

      <div className="filters-container">
        <div className="filter-group">
          <Filter size={16} className="filter-icon" />
          <select value={dept} onChange={(e) => setDept(e.target.value)}>
            <option value="">All Departments</option>
            <option value="CSE">CSE</option>
            <option value="IT">IT</option>
            <option value="ECE">ECE</option>
            <option value="MECH">MECH</option>
          </select>
        </div>

        <div className="search-box">
          <Search size={18} className="search-icon" />
          <input
            type="text"
            placeholder="Search faculty by name or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <div className="table-wrapper">
        <table className="modern-table">
          <thead>
            <tr>
              <th>Faculty Member</th>
              <th>Dept Cluster</th>
              <th>Institutional Designation</th>
              <th style={{ textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>

          <tbody>
            {filtered.map((t) => (
              <tr key={t._id}>
                <td>
                  <div className="student-cell">
                    <div className="student-avatar-small" style={{ background: '#fef3c7', color: '#d97706' }}>
                      {t.username ? t.username[0] : 'F'}
                    </div>
                    <div className="student-info-small">
                      <span className="name">{t.username}</span>
                      <span className="email">{t.email || 'no-email'}</span>
                    </div>
                  </div>
                </td>
                <td><span className="dept-badge">{t.dept || "N/A"}</span></td>
                <td>
                  <span className={`section-badge section-${t.roleName === 'HOD' ? 'A' : t.roleName === 'Senior' ? 'B' : 'NA'}`}>
                    {t.roleName || "Instructor"}
                  </span>
                </td>
                <td>
                  <div className="actions-cell">
                    <button className="icon-btn view-btn" onClick={() => navigate(`/admin/teachers/${t._id}`)} title="View Profile">
                      <Eye size={18} />
                    </button>
                    <button className="icon-btn edit-btn" onClick={() => navigate(`/admin/teachers/${t._id}`)} title="Modify Record">
                      <Edit3 size={18} />
                    </button>
                    <button className="icon-btn" onClick={() => deleteTeacher(t._id, t.username)} title="Terminate" style={{ color: '#ef4444' }}>
                      <Trash2 size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={4} className="empty-table-cell">
                  <div className="empty-state">
                    <p>No faculty members found matching the criteria.</p>
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
              <h2>New Faculty Accreditation</h2>
              <button className="close-btn" onClick={() => setShowAdd(false)}><X size={24} /></button>
            </div>
            <div className="form-layout">
                <div className="input-group" style={{ gridColumn: 'span 2' }}>
                  <label>Full Name</label>
                  <input placeholder="Enter faculty name" value={newUser.username} onChange={e => setNewUser({...newUser, username: e.target.value})} />
                </div>
                <div className="input-group">
                  <label>Institutional Email</label>
                  <input placeholder="faculty@college.edu" type="email" value={newUser.email} onChange={e => setNewUser({...newUser, email: e.target.value})} />
                </div>
                <div className="input-group">
                  <label>Secure Password</label>
                  <input placeholder="••••••••" type="password" value={newUser.password} onChange={e => setNewUser({...newUser, password: e.target.value})} />
                </div>
                <div className="input-group">
                  <label>Department Cluster</label>
                  <select value={newUser.dept} onChange={e => setNewUser({...newUser, dept: e.target.value})}>
                      <option value="">Select Dept</option>
                      <option value="CSE">CSE</option>
                      <option value="IT">IT</option>
                      <option value="ECE">ECE</option>
                      <option value="MECH">MECH</option>
                  </select>
                </div>
                <div className="input-group">
                  <label>Designation</label>
                  <select value={newUser.roleName} onChange={e => setNewUser({...newUser, roleName: e.target.value})}>
                      <option value="">Select Role</option>
                      <option value="HOD">HOD</option>
                      <option value="Senior">Senior Prof</option>
                      <option value="Year Incharge">Incharge</option>
                  </select>
                </div>
                <div className="modal-actions">
                    <button className="action-btn-primary full-width" onClick={handleCreateTeacher}>Complete Accreditation</button>
                    <button className="action-btn-ghost full-width" onClick={() => setShowAdd(false)}>Discard</button>
                </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
