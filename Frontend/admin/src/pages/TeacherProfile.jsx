import { useParams, useNavigate } from "react-router-dom";
import "./profile.css";

export default function TeacherProfile() {
  const { id } = useParams();
  const navigate = useNavigate();

  const teacher = {
    name: id === "1" ? "Dr. Arun Smith" : id === "2" ? "Prof. Priya Johnson" : "Faculty Member",
    dept: "Computer Science & Engineering",
    role: "HOD",
    email: `faculty${id}@kec.edu.in`,
    phone: "+91 98765 12345",
    experience: "10 Years",
    rating: "4.8",
    courses: ["Advance Algorithms", "Cloud Platforms", "Machine Intel"]
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
            {teacher.name.charAt(0)}
          </div>
          <h2>{teacher.name}</h2>
          <p>{teacher.role}</p>
          <p>{teacher.dept}</p>
        </div>

        <div className="profile-right">
          <div className="card-profile section-intel">
            <h3>Contact Information</h3>
            <div className="intel-row">
                 <b>Email:</b> <span>{teacher.email}</span>
            </div>
            <div className="intel-row">
                 <b>Phone:</b> <span>{teacher.phone}</span>
            </div>
          </div>

          <div className="card-profile section-intel">
            <h3>Professional Details</h3>
            <div className="intel-row">
                 <b>Experience:</b> <span>{teacher.experience}</span>
            </div>
            <div className="intel-row">
                 <b>Performance:</b> <span>Rating: {teacher.rating} / 5.0</span>
            </div>
          </div>

          <div className="card-profile section-intel">
            <h3>Instructional Portfolio</h3>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "10px", marginTop: "10px" }}>
              {teacher.courses.map((c, i) => (
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