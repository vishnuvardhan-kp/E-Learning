import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./profile.css";

export default function StudentProfile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [student, setStudent] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({});

  const fetchStudent = async () => {
    try {
      const res = await fetch(`http://localhost:5000/users/student/${id}`);
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
      await fetch(`http://localhost:5000/users/student/${id}`, {
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
    if (window.confirm("Are you sure you want to delete this student account?")) {
      try {
        await fetch(`http://localhost:5000/users/student/${id}`, {
          method: "DELETE"
        });
        navigate("/students");
      } catch (e) {
        console.error(e);
      }
    }
  };

  if (!student) return <div style={{ padding: '40px' }}>Loading institutional intelligence...</div>;

  return (
    <div className="animate-fade-in">
      <div style={{ marginBottom: '20px', display: 'flex', justifyContent: 'space-between' }}>
        <button className="back-btn" onClick={() => navigate(-1)}>
           ← Back to Student List
        </button>
        <div style={{ display: 'flex', gap: '10px' }}>
            <button className="action-btn" onClick={() => setIsEditing(!isEditing)}>
                {isEditing ? "Cancel" : "Modify Details"}
            </button>
            <button className="action-btn action-btn-danger" onClick={handleDelete}>
                Terminate Account
            </button>
        </div>
      </div>

      <div className="profile-grid">
        <div className="card-profile profile-left">
          <div className="profile-avatar">
            {student.username ? student.username.charAt(0).toUpperCase() : "S"}
          </div>
          {isEditing ? (
              <input 
                style={{ width: '100%', marginTop: '10px', padding: '8px', borderRadius: '4px', border: '1px solid #cbd5e1' }}
                value={editData.username} 
                onChange={e => setEditData({...editData, username: e.target.value})} 
              />
          ) : (
              <h2>{student.username}</h2>
          )}
          <p>{student.email}</p>
          <p style={{ marginTop: '5px', color: '#2563eb', fontWeight: 'bold' }}>Institutional Role: Student</p>
        </div>

        <div className="profile-right">
          <div className="card-profile section-intel">
            <h3>Academic Mapping</h3>
            <div className="intel-row">
                 <b>Department:</b> 
                 {isEditing ? (
                     <select value={editData.dept} onChange={e => setEditData({...editData, dept: e.target.value})}>
                         <option value="CSE">CSE</option>
                         <option value="IT">IT</option>
                         <option value="MECH">MECH</option>
                     </select>
                 ) : (
                     <span>{student.dept || "Not Assigned"}</span>
                 )}
            </div>
            <div className="intel-row">
                 <b>Year of Study:</b> 
                 {isEditing ? (
                     <select value={editData.year} onChange={e => setEditData({...editData, year: e.target.value})}>
                         <option value="1st Year">1st Year</option>
                         <option value="2nd Year">2nd Year</option>
                         <option value="3rd Year">3rd Year</option>
                         <option value="4th Year">4th Year</option>
                     </select>
                 ) : (
                     <span>{student.year || "Not Assigned"}</span>
                 )}
            </div>
          </div>

          <div className="card-profile section-intel">
            <h3>Identity Metadata</h3>
            <div className="intel-row">
                 <b>Email:</b> 
                 {isEditing ? (
                     <input value={editData.email} onChange={e => setEditData({...editData, email: e.target.value})} />
                 ) : (
                     <span>{student.email}</span>
                 )}
            </div>
            <div className="intel-row">
                 <b>Account ID:</b> <span>{student._id}</span>
            </div>
          </div>

          {isEditing && (
              <div style={{ marginTop: '20px' }}>
                  <button className="action-btn action-btn-primary" style={{ width: '100%', padding: '15px' }} onClick={handleUpdate}>
                      Save Changes to Database
                  </button>
              </div>
          )}
        </div>
      </div>
    </div>
  );
}
