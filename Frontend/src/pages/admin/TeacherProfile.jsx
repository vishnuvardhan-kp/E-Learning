import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, User, Mail, Hash, BookOpen, Shield, Save, Trash2, Edit2, X, Award } from "lucide-react";
import "./profile.css";

export default function TeacherProfile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [teacher, setTeacher] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({});

  const fetchTeacher = async () => {
    try {
      const res = await fetch(`${API_URL}/users/instructor/${id}`);
      const data = await res.json();
      setTeacher(data);
      setEditData(data);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    fetchTeacher();
  }, [id]);

  const handleUpdate = async () => {
    try {
      await fetch(`${API_URL}/users/instructor/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editData)
      });
      setIsEditing(false);
      fetchTeacher();
    } catch (e) {
      console.error(e);
    }
  };

  const handleDelete = async () => {
    if (window.confirm("CRITICAL: Terminate faculty accreditation and revoke all access?")) {
      try {
        await fetch(`${API_URL}/users/instructor/${id}`, {
          method: "DELETE"
        });
        navigate("/admin/teachers");
      } catch (e) {
        console.error(e);
      }
    }
  };

  if (!teacher) return (
    <div className="loading-state">
      <div className="loader"></div>
      <p>Retrieving Faculty Record...</p>
    </div>
  );

  return (
    <div className="animate-fade-in module-container">
      <div className="profile-header">
        <button className="back-link" onClick={() => navigate("/admin/teachers")}>
          <ArrowLeft size={18} />
          Back to Faculty List
        </button>
        <div className="header-actions">
            <button className={`action-btn-secondary ${isEditing ? 'active' : ''}`} onClick={() => setIsEditing(!isEditing)}>
                {isEditing ? <X size={18} /> : <Edit2 size={18} />}
                <span>{isEditing ? "Cancel" : "Modify Accreditation"}</span>
            </button>
            <button className="action-btn-danger" onClick={handleDelete}>
                <Trash2 size={18} />
                <span>Revoke Access</span>
            </button>
        </div>
      </div>

      <div className="profile-layout-grid">
        {/* LEFT COLUMN: PRIMARY IDENTITY */}
        <div className="profile-sidebar">
          <div className="profile-card identity-card">
            <div className="avatar-large" style={{ background: 'linear-gradient(135deg, #f59e0b, #d97706)' }}>
              {teacher.username && typeof teacher.username === 'string' ? teacher.username[0].toUpperCase() : "F"}
            </div>
            <div className="identity-text">
              {isEditing ? (
                <input 
                  className="edit-input name-input"
                  value={editData.username} 
                  onChange={e => setEditData({...editData, username: e.target.value})} 
                />
              ) : (
                <h2>{teacher.username}</h2>
              )}
              <span className="role-badge" style={{ background: '#fef3c7', color: '#d97706' }}>
                {teacher.roleName || "Instructor"}
              </span>
            </div>
          </div>

          <div className="profile-card contact-card">
            <h3>Institutional Metadata</h3>
            <div className="contact-item">
              <Mail size={16} />
              {isEditing ? (
                <input value={editData.email} onChange={e => setEditData({...editData, email: e.target.value})} />
              ) : (
                <span>{teacher.email || 'no-email@college.edu'}</span>
              )}
            </div>
            <div className="contact-item">
              <Hash size={16} />
              <span className="mono">{teacher._id}</span>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: ACADEMIC INTEL */}
        <div className="profile-main">
          <div className="profile-card academic-intel">
            <div className="card-header">
              <Shield size={20} />
              <h3>Academic Accreditation</h3>
            </div>
            
            <div className="intel-grid">
              <div className="intel-field">
                <label>Department Cluster</label>
                {isEditing ? (
                  <select value={editData.dept} onChange={e => setEditData({...editData, dept: e.target.value})}>
                    <option value="CSE">CSE</option>
                    <option value="IT">IT</option>
                    <option value="ECE">ECE</option>
                    <option value="MECH">MECH</option>
                  </select>
                ) : (
                  <div className="field-value">{teacher.dept || "Unassigned"}</div>
                )}
              </div>

              <div className="intel-field">
                <label>Institutional Role</label>
                {isEditing ? (
                  <select value={editData.roleName} onChange={e => setEditData({...editData, roleName: e.target.value})}>
                    <option value="HOD">HOD</option>
                    <option value="Senior">Senior Professor</option>
                    <option value="Year Incharge">Year Incharge</option>
                    <option value="Assistant">Assistant Professor</option>
                  </select>
                ) : (
                  <div className="field-value">{teacher.roleName || "Instructor"}</div>
                )}
              </div>

              <div className="intel-field">
                <label>Staff Category</label>
                <div className="field-value">Full-Time Faculty</div>
              </div>

              <div className="intel-field">
                <label>Assigned Courses</label>
                <div className="field-value badge-sec">3 Active Classes</div>
              </div>
            </div>
          </div>

          <div className="profile-card activity-log">
            <div className="card-header">
              <Award size={20} />
              <h3>Professional Standing</h3>
            </div>
            <div className="metric-row">
              <div className="metric-item">
                <span className="metric-label">Access Level</span>
                <span className="metric-val status-active">Level 4 (High)</span>
              </div>
              <div className="metric-item">
                <span className="metric-label">Tenure Status</span>
                <span className="metric-val">Permanent</span>
              </div>
            </div>
          </div>

          {isEditing && (
            <button className="save-changes-btn animate-bounce-in" onClick={handleUpdate} style={{ background: '#d97706', boxShadow: '0 10px 20px rgba(217, 119, 6, 0.2)' }}>
              <Save size={20} />
              Synchronize Faculty Record
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
