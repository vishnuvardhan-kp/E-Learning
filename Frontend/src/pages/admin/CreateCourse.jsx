import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Plus, BookOpen, User, Calendar, Shield, Save } from "lucide-react";
import { API_URL } from "../../api/backend";
import "./users.css";

export default function CreateCourse() {
  const navigate = useNavigate();
  const [instructors, setInstructors] = useState([]);
  const [newCourse, setNewCourse] = useState({
    title: "",
    instructorId: "",
    instructorName: "",
    dept: "",
    description: "",
    duration: "12 Weeks",
    targetYear: "1st Year",
    targetSection: "A"
  });

  const fetchInstructors = async () => {
    try {
      const res = await fetch(`${API_URL}/instructor`);
      const data = await res.json();
      setInstructors(data);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    fetchInstructors();
  }, []);

  const handleCreateCourse = async () => {
    if (!newCourse.title || !newCourse.instructorId) {
        alert("Please provide course title and assigned faculty.");
        return;
    }

    const instr = instructors.find(i => i._id === newCourse.instructorId);
    const payload = { 
      ...newCourse, 
      instructorName: instr ? instr.username : "Unassigned",
      enrollmentCount: 0,
      status: "Active"
    };

    try {
      await fetch(`${API_URL}/courses`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      navigate("/admin/courses");
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="animate-fade-in module-container">
      <div className="profile-header" style={{ marginBottom: '20px' }}>
        <button className="back-link" onClick={() => navigate("/admin/courses")} style={{ background: 'none', border: 'none', display: 'flex', alignItems: 'center', gap: '8px', color: '#64748b', cursor: 'pointer', fontWeight: 600 }}>
          <ArrowLeft size={18} />
          Back to Course List
        </button>
      </div>

      <div className="fullscreen-form-card">
        <div className="form-header-main" style={{ marginBottom: '40px', borderBottom: '2px solid #f1f5f9', paddingBottom: '24px' }}>
            <h1>Initialize Academic Curriculum</h1>
            <p style={{ color: '#64748b', marginTop: '8px', fontSize: '16px' }}>Define the syllabus and assign institutional targets for the new course.</p>
        </div>

        <div className="form-layout">
            <div className="input-group" style={{ gridColumn: 'span 2' }}>
                <label>Institutional Curriculum Title</label>
                <input 
                    placeholder="e.g. Advanced Machine Learning Frameworks" 
                    value={newCourse.title} 
                    onChange={e => setNewCourse({...newCourse, title: e.target.value})} 
                />
            </div>

            <div className="input-group">
                <label>Assigned Faculty / Instructor</label>
                <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                    <User size={18} style={{ position: 'absolute', left: '20px', color: '#94a3b8' }} />
                    <select 
                        value={newCourse.instructorId} 
                        onChange={e => setNewCourse({...newCourse, instructorId: e.target.value})}
                        style={{ paddingLeft: '50px' }}
                    >
                        <option value="">Select Faculty Member</option>
                        {instructors.map(i => (
                            <option key={i._id} value={i._id}>{i.username} — {i.dept}</option>
                        ))}
                    </select>
                </div>
            </div>

            <div className="input-group">
                <label>Department Cluster</label>
                <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                    <Shield size={18} style={{ position: 'absolute', left: '20px', color: '#94a3b8' }} />
                    <select 
                        value={newCourse.dept} 
                        onChange={e => setNewCourse({...newCourse, dept: e.target.value})}
                        style={{ paddingLeft: '50px' }}
                    >
                        <option value="">Select Department</option>
                        <option value="CSE">CSE</option>
                        <option value="IT">IT</option>
                        <option value="ECE">ECE</option>
                        <option value="MECH">MECH</option>
                    </select>
                </div>
            </div>

            <div className="input-group">
                <label>Target Academic Year</label>
                <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                    <Calendar size={18} style={{ position: 'absolute', left: '20px', color: '#94a3b8' }} />
                    <select 
                        value={newCourse.targetYear} 
                        onChange={e => setNewCourse({...newCourse, targetYear: e.target.value})}
                        style={{ paddingLeft: '50px' }}
                    >
                        <option value="1st Year">1st Year</option>
                        <option value="2nd Year">2nd Year</option>
                        <option value="3rd Year">3rd Year</option>
                        <option value="4th Year">4th Year</option>
                    </select>
                </div>
            </div>

            <div className="input-group">
                <label>Class Section Assignment</label>
                <select value={newCourse.targetSection} onChange={e => setNewCourse({...newCourse, targetSection: e.target.value})}>
                    <option value="A">Section A</option>
                    <option value="B">Section B</option>
                    <option value="C">Section C</option>
                    <option value="D">Section D</option>
                </select>
            </div>

            <div className="input-group">
                <label>Curriculum Duration</label>
                <input placeholder="e.g. 12 Weeks" value={newCourse.duration} onChange={e => setNewCourse({...newCourse, duration: e.target.value})} />
            </div>

            <div className="input-group" style={{ gridColumn: 'span 2' }}>
                <label>Syllabus & Course Description</label>
                <textarea 
                    placeholder="Enter a comprehensive overview of the learning objectives and syllabus content..."
                    value={newCourse.description}
                    onChange={e => setNewCourse({...newCourse, description: e.target.value})}
                    style={{ minHeight: '200px' }}
                />
            </div>

            <div className="modal-actions" style={{ gridColumn: 'span 2' }}>
                <button 
                    className="action-btn-primary" 
                    onClick={handleCreateCourse}
                    style={{ flex: 2, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px' }}
                >
                    <Save size={22} />
                    Publish Institutional Curriculum
                </button>
                <button 
                    className="action-btn-ghost" 
                    onClick={() => navigate("/admin/courses")}
                    style={{ flex: 1 }}
                >
                    Discard Draft
                </button>
            </div>
        </div>
      </div>
    </div>
  );
}
