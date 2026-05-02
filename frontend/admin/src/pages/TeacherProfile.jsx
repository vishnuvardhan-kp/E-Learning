import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./profile.css";

export default function TeacherProfile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [teacher, setTeacher] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({});

  const fetchTeacher = async () => {
    try {
      const res = await fetch(`http://localhost:5000/users/instructor/${id}`);
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
      await fetch(`http://localhost:5000/users/instructor/${id}`, {
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
    if (window.confirm("Are you sure you want to terminate this faculty account?")) {
      try {
        await fetch(`http://localhost:5000/users/instructor/${id}`, {
          method: "DELETE"
        });
        navigate("/teachers");
      } catch (e) {
        console.error(e);
      }
    }
  };

  if (!teacher) return <div style={{ padding: '40px' }}>Loading faculty intelligence...</div>;

  return (
    <div className="animate-fade-in">
      <div style={{ marginBottom: '20px', display: 'flex', justifyContent: 'space-between' }}>
        <button className="back-btn" onClick={() => navigate(-1)}>
           ← Back to Faculty List
        </button>
        <div style={{ display: 'flex', gap: '10px' }}>
            <button className="action-btn" onClick={() => setIsEditing(!isEditing)}>
                {isEditing ? "Cancel" : "Modify Accreditation"}
            </button>
            <button className="action-btn action-btn-danger" onClick={handleDelete}>
                Revoke Access
            </button>
        </div>
      </div>

      <div className="profile-grid">
        <div className="card-profile profile-left">
          <div className="profile-avatar">
            {teacher.username ? teacher.username.charAt(0).toUpperCase() : "F"}
          </div>
          {isEditing ? (
              <input 
                style={{ width: '100%', marginTop: '10px', padding: '8px', borderRadius: '4px', border: '1px solid #cbd5e1' }}
                value={editData.username} 
                onChange={e => setEditData({...editData, username: e.target.value})} 
              />
          ) : (
              <h2>{teacher.username}</h2>
          )}
          <p style={{ color: '#2563eb', fontWeight: 'bold' }}>Faculty Status: {teacher.roleName || "Instructor"}</p>
          <p>{teacher.email}</p>
        </div>

        <div className="profile-right">
          <div className="card-profile section-intel">
            <h3>Institutional Alignment</h3>
            <div className="intel-row">
                 <b>Department Cluster:</b> 
                 {isEditing ? (
                     <select value={editData.dept} onChange={e => setEditData({...editData, dept: e.target.value})}>
                         <option value="CSE">CSE</option>
                         <option value="IT">IT</option>
                         <option value="MECH">MECH</option>
                         <option value="CIVIL">CIVIL</option>
                     </select>
                 ) : (
                     <span>{teacher.dept || "Not Assigned"}</span>
                 )}
            </div>
            <div className="intel-row">
                 <b>Role Designation:</b> 
                 {isEditing ? (
                     <select value={editData.roleName} onChange={e => setEditData({...editData, roleName: e.target.value})}>
                         <option value="HOD">HOD</option>
                         <option value="Senior">Senior Professor</option>
                         <option value="Year Incharge">Year Incharge</option>
                     </select>
                 ) : (
                     <span>{teacher.roleName || "Instructor"}</span>
                 )}
            </div>
          </div>

          <div className="card-profile section-intel">
            <h3>Identity Metadata</h3>
            <div className="intel-row">
                 <b>Secure Email:</b> 
                 {isEditing ? (
                     <input value={editData.email} onChange={e => setEditData({...editData, email: e.target.value})} />
                 ) : (
                     <span>{teacher.email}</span>
                 )}
            </div>
            <div className="intel-row">
                 <b>Account ID:</b> <span>{teacher._id}</span>
            </div>
          </div>

          {isEditing && (
              <div style={{ marginTop: '20px' }}>
                  <button className="action-btn action-btn-primary" style={{ width: '100%', padding: '15px' }} onClick={handleUpdate}>
                      Synchronize Changes
                  </button>
              </div>
          )}
        </div>
      </div>
    </div>
  );
}