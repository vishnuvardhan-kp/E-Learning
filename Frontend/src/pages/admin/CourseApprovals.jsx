import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { CheckCircle, XCircle, BookOpen, User, Clock, ShieldCheck, ArrowLeft, Search } from "lucide-react";
import { API_URL } from "../../api/backend";
import "./users.css";

export default function CourseApprovals() {
  const navigate = useNavigate();
  const [pendingCourses, setPendingCourses] = useState([]);
  const [search, setSearch] = useState("");

  const [dept, setDept] = useState("");
  const [year, setYear] = useState("");

  const fetchPending = async () => {
    try {
      // Add timestamp to bust browser cache
      const res = await fetch(`${API_URL}/courses?t=${Date.now()}`);
      const data = await res.json();
      setPendingCourses(data.filter(c => c.status !== "Active"));
    } catch (e) {
      console.error(e);
      setPendingCourses([]);
    }
  };

  useEffect(() => {
    fetchPending();
  }, []);

  const approveCourse = async (id) => {
    try {
      const res = await fetch(`${API_URL}/courses/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "Active" })
      });
      if (res.ok) {
        alert("Curriculum successfully authorized and live!");
        fetchPending();
      } else {
        const errData = await res.json();
        alert(`Approval failed: ${errData.error || "Server error"}`);
      }
    } catch (e) {
      console.error(e);
      alert("Network error: Could not reach the accreditation server.");
    }
  };

  const filtered = pendingCourses.filter(c => {
    const matchesSearch = c.title?.toLowerCase().includes(search.toLowerCase()) || 
                         c.instructorName?.toLowerCase().includes(search.toLowerCase());
    const matchesDept = dept === "" || c.dept === dept;
    const matchesYear = year === "" || c.targetYear === year;
    return matchesSearch && matchesDept && matchesYear;
  });

  return (
    <div className="animate-fade-in module-container">
      <div className="header-bar">
         <div className="title-group">
            <h1 className="page-title">Curriculum Approvals</h1>
            <p className="subtitle" style={{ color: '#64748b', fontSize: '14px', fontWeight: 600, marginTop: '-4px' }}>Institutional Review of Faculty-Created Syllabus</p>
         </div>
         <button className="action-btn-ghost" onClick={() => navigate("/admin/courses")} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
           <ArrowLeft size={18} />
           Back to Course List
         </button>
      </div>

      <div className="filters-container">
        <div className="search-box" style={{ flex: 1 }}>
          <Search size={18} className="search-icon" />
          <input 
            type="text" 
            placeholder="Search pending curricula..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="filter-group">
          <ShieldCheck size={18} className="text-muted" />
          <select value={dept} onChange={(e) => setDept(e.target.value)}>
            <option value="">All Departments</option>
            <option value="CSE">CSE</option>
            <option value="IT">IT</option>
            <option value="ECE">ECE</option>
            <option value="MECH">MECH</option>
          </select>
        </div>

        <div className="filter-group">
          <Clock size={18} className="text-muted" />
          <select value={year} onChange={(e) => setYear(e.target.value)}>
            <option value="">All Years</option>
            <option value="1st Year">1st Year</option>
            <option value="2nd Year">2nd Year</option>
            <option value="3rd Year">3rd Year</option>
            <option value="4th Year">4th Year</option>
          </select>
        </div>
      </div>

      <div className="table-wrapper">
        <table className="modern-table">
          <thead>
            <tr>
              <th>Proposed Curriculum</th>
              <th>Authoring Faculty</th>
              <th>Department</th>
              <th>Status</th>
              <th style={{ textAlign: 'right' }}>Review Actions</th>
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
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        {c.code && <span style={{ fontSize: '11px', fontWeight: 800, color: '#2563eb', background: '#eff6ff', padding: '2px 6px', borderRadius: '4px' }}>{c.code}</span>}
                        <span className="email">Submitted {new Date(c.createdAt || Date.now()).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>
                </td>
                <td>
                  <div className="student-info-small">
                    <span className="name" style={{ fontSize: '13px' }}>{c.instructorName}</span>
                    <span className="email" style={{ fontSize: '11px' }}>{c.instructorEmail || 'No email provided'}</span>
                  </div>
                </td>
                <td>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    <span className="dept-badge" style={{ alignSelf: 'flex-start' }}>{c.dept}</span>
                    <span style={{ fontSize: '11px', fontWeight: 700, color: '#64748b' }}>
                      {c.targetYear || 'All Years'} {c.section ? `(Sec ${c.section})` : ''}
                    </span>
                  </div>
                </td>
                <td>
                  <span className="status-badge status-pending">
                    <Clock size={12} /> Pending Review
                  </span>
                </td>
                <td>
                  <div className="actions-cell">
                    <button 
                        className="icon-btn approve-btn" 
                        title="Authorize Curriculum"
                        style={{ borderColor: '#10b981', color: '#10b981', width: 'auto', padding: '0 16px', gap: '8px' }}
                        onClick={() => approveCourse(c._id)}
                    >
                      <CheckCircle size={18} />
                      <span style={{ fontSize: '12px', fontWeight: 800 }}>Approve</span>
                    </button>
                    <button className="icon-btn delete-btn" title="Reject Syllabus" style={{ borderColor: '#ef4444', color: '#ef4444' }}>
                      <XCircle size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={5} className="empty-table-cell">
                  <div className="empty-state">
                    <p>No curricula currently awaiting institutional approval.</p>
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
