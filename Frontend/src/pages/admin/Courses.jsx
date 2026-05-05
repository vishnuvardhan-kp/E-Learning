import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, Search, Filter, BookOpen, Trash2, CheckCircle, Clock, User, Award, X, ShieldCheck } from "lucide-react";
import { API_URL } from "../../api/backend";
import "./users.css";

export default function Courses() {
  const navigate = useNavigate();
  const [filter, setFilter] = useState("All");
  const [dept, setDept] = useState("");
  const [search, setSearch] = useState("");
  const [courses, setCourses] = useState([]);
  const [instructors, setInstructors] = useState([]);

  const fetchCourses = async () => {
    try {
      const res = await fetch(`${API_URL}/courses`);
      const data = await res.json();
      setCourses(data);
    } catch (e) {
      console.error(e);
    }
  };

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
    fetchCourses();
    fetchInstructors();
  }, []);

  const approveCourse = async (id) => {
    try {
      await fetch(`${API_URL}/courses/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "Active" })
      });
      fetchCourses();
    } catch (e) {
      console.error(e);
    }
  };

  const deleteCourse = async (id) => {
    if (window.confirm("CRITICAL: Permanently archive and delete this course syllabus?")) {
      try {
        await fetch(`${API_URL}/courses/${id}`, {
          method: "DELETE"
        });
        fetchCourses();
      } catch (e) {
        console.error(e);
      }
    }
  };

  const filtered = courses.filter(c =>
    (filter === "All" || (c.status || "Pending") === filter) &&
    (dept === "" || c.dept === dept) &&
    (c.title?.toLowerCase().includes(search.toLowerCase()) || 
     c.instructorName?.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="animate-fade-in module-container">
      <div className="header-bar">
         <div className="title-group">
            <h1 className="page-title">Course Management</h1>
            <p className="subtitle" style={{ color: '#64748b', fontSize: '14px', fontWeight: 600, marginTop: '-4px', display: 'flex', alignItems: 'center', gap: '10px' }}>
               Institutional Oversight & Curriculum Accreditation
               <button 
                  onClick={() => navigate("/admin/moderation")}
                  style={{ background: '#eff6ff', color: '#2563eb', border: 'none', padding: '4px 12px', borderRadius: '8px', fontSize: '11px', fontWeight: 800, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}
               >
                  <ShieldCheck size={12} />
                  Audit Moderation
               </button>
            </p>
         </div>
         <button className="action-btn-primary" onClick={() => navigate("/admin/courses/create")} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '12px 24px', borderRadius: '12px', border: 'none', cursor: 'pointer', fontWeight: 800 }}>
           <Plus size={20} />
           Initialize Course
         </button>
      </div>

      <div className="filters-container">
        <div className="filter-group">
          <Filter size={16} className="filter-icon" />
          <select value={filter} onChange={(e) => setFilter(e.target.value)}>
            <option value="All">All Statuses</option>
            <option value="Active">Active Syllabus</option>
            <option value="Pending">Pending Review</option>
          </select>
        </div>

        <select value={dept} onChange={(e) => setDept(e.target.value)}>
          <option value="">All Departments</option>
          <option value="CSE">CSE</option>
          <option value="IT">IT</option>
          <option value="ECE">ECE</option>
          <option value="MECH">MECH</option>
        </select>

        <div className="search-box">
          <Search size={18} className="search-icon" />
          <input
            type="text"
            placeholder="Search courses or instructors..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <div className="table-wrapper">
        <table className="modern-table">
          <thead>
            <tr>
              <th>Course Curriculum</th>
              <th>Target Cohort</th>
              <th>Assigned Faculty</th>
              <th>Department</th>
              <th>Enrollment</th>
              <th style={{ textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>

          <tbody>
            {filtered.map((c) => (
              <tr key={c._id}>
                <td>
                  <div className="student-cell">
                    <div className="student-avatar-small" style={{ background: '#eff6ff', color: '#2563eb' }}>
                      <BookOpen size={16} />
                    </div>
                    <div className="student-info-small">
                      <span className="name">{c.title}</span>
                      <span className="email">{c.duration || '12 Weeks'} Duration</span>
                    </div>
                  </div>
                </td>
                <td>
                  <div className="dept-year">
                    <span className="year-text">{c.targetYear || "1st Year"}</span>
                    <span className={`section-badge section-${c.targetSection || 'A'}`} style={{ fontSize: '10px', padding: '2px 8px' }}>
                      Sec {c.targetSection || "A"}
                    </span>
                  </div>
                </td>
                <td>
                  <div className="instructor-cell" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <User size={14} className="text-muted" />
                    <span className="year-text">{c.instructorName || "Faculty Pending"}</span>
                  </div>
                </td>
                <td><span className="dept-badge">{c.dept || "Gen"}</span></td>
                <td style={{ fontWeight: 800 }}>{c.enrollmentCount || 0} Students</td>
                <td>
                  <div className="actions-cell">
                    {(c.status || "Pending") === "Pending" && (
                      <button className="icon-btn approve-btn" onClick={() => approveCourse(c._id)} title="Approve Curriculum" style={{ borderColor: '#10b981', color: '#10b981' }}>
                        <CheckCircle size={18} />
                      </button>
                    )}
                    <button className="icon-btn view-btn" title="Course Curriculum">
                      <Award size={18} />
                    </button>
                    <button className="icon-btn delete-btn" onClick={() => deleteCourse(c._id)} title="Archive Course">
                      <Trash2 size={18} style={{ color: '#ef4444' }} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={6} className="empty-table-cell">
                  <div className="empty-state">
                    <p>No institutional course matches found.</p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
