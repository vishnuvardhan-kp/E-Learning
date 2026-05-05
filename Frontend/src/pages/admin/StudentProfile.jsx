import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, User, Mail, Hash, BookOpen, Calendar, Save, Trash2, Edit2, X } from "lucide-react";
import "./profile.css";

export default function StudentProfile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [student, setStudent] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({});

  const fetchStudent = async () => {
    try {
      const res = await fetch(`${API_URL}/users/student/${id}`);
      const data = await res.json();
      setStudent(data);
      setEditData(data);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    fetchStudent();
  }, [id]);

  const handleUpdate = async () => {
    try {
      await fetch(`${API_URL}/users/student/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editData)
      });
      setIsEditing(false);
      fetchStudent();
    } catch (e) {
      console.error(e);
    }
  };

  const handleDelete = async () => {
    if (window.confirm("CRITICAL: Delete this student account permanently?")) {
      try {
        await fetch(`${API_URL}/users/student/${id}`, {
          method: "DELETE"
        });
        navigate("/admin/students");
      } catch (e) {
        console.error(e);
      }
    }
  };

  if (!student) return (
    <div className="loading-state">
      <div className="loader"></div>
      <p>Synchronizing Institutional Data...</p>
    </div>
  );

  return (
    <div className="animate-fade-in module-container">
      <div className="profile-header">
        <button className="back-link" onClick={() => navigate("/admin/students")}>
          <ArrowLeft size={18} />
          Back to Students
        </button>
        <div className="header-actions">
            <button className={`action-btn-secondary ${isEditing ? 'active' : ''}`} onClick={() => setIsEditing(!isEditing)}>
                {isEditing ? <X size={18} /> : <Edit2 size={18} />}
                <span>{isEditing ? "Cancel" : "Edit Profile"}</span>
            </button>
            <button className="action-btn-danger" onClick={handleDelete}>
                <Trash2 size={18} />
                <span>Delete Account</span>
            </button>
        </div>
      </div>

      <div className="profile-layout-grid">
        {/* LEFT COLUMN: PRIMARY IDENTITY */}
        <div className="profile-sidebar">
          <div className="profile-card identity-card">
            <div className="avatar-large">
              {student.username && typeof student.username === 'string' ? student.username[0].toUpperCase() : "S"}
            </div>
            <div className="identity-text">
              {isEditing ? (
                <input 
                  className="edit-input name-input"
                  value={editData.username} 
                  onChange={e => setEditData({...editData, username: e.target.value})} 
                />
              ) : (
                <h2>{student.username}</h2>
              )}
              <span className="role-badge">Student Member</span>
            </div>
          </div>

          <div className="profile-card contact-card">
            <h3>Contact Information</h3>
            <div className="contact-item">
              <Mail size={16} />
              {isEditing ? (
                <input value={editData.email} onChange={e => setEditData({...editData, email: e.target.value})} />
              ) : (
                <span>{student.email || 'No email provided'}</span>
              )}
            </div>
            <div className="contact-item">
              <Hash size={16} />
              <span className="mono">{student._id}</span>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: ACADEMIC INTEL */}
        <div className="profile-main">
          <div className="profile-card academic-intel">
            <div className="card-header">
              <BookOpen size={20} />
              <h3>Academic Record</h3>
            </div>
            
            <div className="intel-grid">
              <div className="intel-field">
                <label>Roll Number</label>
                {isEditing ? (
                  <input 
                    className="edit-input"
                    value={editData.rollno || ""} 
                    onChange={e => setEditData({...editData, rollno: e.target.value})} 
                    placeholder="e.g. 24CSE001"
                  />
                ) : (
                  <div className="field-value" style={{ fontWeight: 800, color: 'var(--primary)' }}>{student.rollno || "Not Assigned"}</div>
                )}
              </div>

              <div className="intel-field">
                <label>Department</label>
                {isEditing ? (
                  <select value={editData.dept} onChange={e => setEditData({...editData, dept: e.target.value})}>
                    <option value="">Select Dept</option>
                    <option value="CSE">CSE</option>
                    <option value="IT">IT</option>
                    <option value="ECE">ECE</option>
                    <option value="MECH">MECH</option>
                  </select>
                ) : (
                  <div className="field-value">{student.dept || "Unassigned"}</div>
                )}
              </div>

              <div className="intel-field">
                <label>Year of Study</label>
                {isEditing ? (
                  <select value={editData.year} onChange={e => setEditData({...editData, year: e.target.value})}>
                    <option value="1st Year">1st Year</option>
                    <option value="2nd Year">2nd Year</option>
                    <option value="3rd Year">3rd Year</option>
                    <option value="4th Year">4th Year</option>
                  </select>
                ) : (
                  <div className="field-value">{student.year || "Unassigned"}</div>
                )}
              </div>

              <div className="intel-field">
                <label>Section / Batch</label>
                {isEditing ? (
                  <select value={editData.section} onChange={e => setEditData({...editData, section: e.target.value})}>
                    <option value="A">Section A</option>
                    <option value="B">Section B</option>
                    <option value="C">Section C</option>
                    <option value="D">Section D</option>
                  </select>
                ) : (
                  <div className="field-value badge-sec">Section {student.section || "N/A"}</div>
                )}
              </div>

              <div className="intel-field">
                <label>Batch Cycle</label>
                {isEditing ? (
                  <input value={editData.batch} onChange={e => setEditData({...editData, batch: e.target.value})} placeholder="e.g. 2021-2025" />
                ) : (
                  <div className="field-value">{student.batch || "2021-2025"}</div>
                )}
              </div>
            </div>
          </div>

          <div className="profile-card activity-log">
            <div className="card-header">
              <Calendar size={20} />
              <h3>Engagement Metrics</h3>
            </div>
            <div className="metric-row">
              <div className="metric-item">
                <span className="metric-label">Status</span>
                <span className="metric-val status-active">Active</span>
              </div>
              <div className="metric-item">
                <span className="metric-label">Last Login</span>
                <span className="metric-val">2 hours ago</span>
              </div>
            </div>
          </div>

          {isEditing && (
            <button className="save-changes-btn animate-bounce-in" onClick={handleUpdate}>
              <Save size={20} />
              Save Institutional Record
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
