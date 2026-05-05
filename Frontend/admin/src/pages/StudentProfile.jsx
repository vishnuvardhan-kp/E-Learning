import { useParams, useNavigate } from "react-router-dom";
import "./profile.css";

export default function StudentProfile() {
  const { id } = useParams();
  const navigate = useNavigate();

  const student = {
    name: id === "1" ? "Arun Kumar" : id === "2" ? "Priya Divya" : "Student Member",
    rollNo: id === "1" ? "20CS001" : "21IT045",
    batch: "2020-2024",
    dept: "Computer Science & Engineering",
    email: `student${id}@kec.edu.in`,
    phone: "+91 98765 43210",
    attendance: "94%",
    cgpa: "8.9",
    courses: ["React Architecture", "Database Internals", "OS Security"]
  };

  return (
    <div className="animate-fade-in">
      <div style={{ marginBottom: '20px' }}>
        <button className="back-btn" onClick={() => navigate(-1)}>
           ← Back
        </button>
      </div>

      <div className="profile-grid">
        <div className="card-profile profile-left">
          <div className="profile-avatar">
            {student.name.charAt(0)}
          </div>
          <h2>{student.name}</h2>
          <p>{student.rollNo}</p>
          <p style={{ marginTop: '5px' }}>{student.dept}</p>
        </div>

        <div className="profile-right">
          <div className="card-profile section-intel">
            <h3>Academic Performance</h3>
            <div className="intel-row">
                 <b>CGPA Record:</b> <span>{student.cgpa} / 10.0</span>
            </div>
            <div className="intel-row">
                 <b>Attendance:</b> <span>{student.attendance} Total</span>
            </div>
          </div>

          <div className="card-profile section-intel">
            <h3>Contact Intelligence</h3>
            <div className="intel-row">
                 <b>Secure Email:</b> <span>{student.email}</span>
            </div>
            <div className="intel-row">
                 <b>Mobile:</b> <span>{student.phone}</span>
            </div>
          </div>

          <div className="card-profile section-intel">
            <h3>Enrolled Courses</h3>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "10px", marginTop: "10px" }}>
              {student.courses.map((c, i) => (
                <span key={i} className="class-badge">
                  {c}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
