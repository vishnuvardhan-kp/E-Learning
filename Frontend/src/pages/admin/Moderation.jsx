import { useState, useEffect } from "react";
import { ShieldAlert, FileText, CheckCircle, Ban, Eye, Filter, Search, User, Mail, Hash, Trash2 } from "lucide-react";
import { API_URL } from "../../api/backend";
import "./users.css";

export default function Moderation() {
  const [content, setContent] = useState([]);
  const [filter, setFilter] = useState("All");
  const [search, setSearch] = useState("");

  const fetchNotes = async () => {
    try {
      const res = await fetch(`${API_URL}/notes`);
      const data = await res.json();
      
      setContent(data.map(item => ({
        id: item._id,
        type: item.type || "Student Note",
        title: item.title || "Academic Resource",
        author: item.author || "Anonymous Student",
        rollNo: item.rollNo || "N/A",
        email: item.email || "no-email@college.edu",
        status: item.status || "Review",
        verifiedBy: item.verifiedBy || "Senior Faculty",
        fileUrl: item.fileUrl || "#"
      })));
    } catch (e) {
      console.error(e);
      setContent([]);
    }
  };

  useEffect(() => {
    fetchNotes();
  }, []);

  const updateStatus = async (id, newStatus) => {
    try {
      setContent(content.map(c => c.id === id ? { ...c, status: newStatus, verifiedBy: newStatus === "Safe" ? "Institutional Admin" : c.verifiedBy } : c));
    } catch (e) {
      console.error(e);
    }
  };

  const deleteAsset = async (id) => {
    if (window.confirm("Permanently purge this institutional asset? This action cannot be undone.")) {
      try {
        await fetch(`${API_URL}/notes/${id}`, { method: "DELETE" });
        setContent(content.filter(c => c.id !== id));
      } catch (e) {
        console.error(e);
        // Local removal if backend fails
        setContent(content.filter(c => c.id !== id));
      }
    }
  };

  const filtered = content.filter(c => 
    (filter === "All" || c.status === filter) &&
    (c.title.toLowerCase().includes(search.toLowerCase()) || 
     c.author.toLowerCase().includes(search.toLowerCase()) ||
     c.rollNo.toLowerCase().includes(search.toLowerCase()))
  );

  const getStatusBadge = (item) => {
    switch(item.status) {
      case "Safe": return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
          <span className="status-badge status-active"><CheckCircle size={12}/> Verified</span>
          <span style={{ fontSize: '10px', color: '#10b981', fontWeight: 700, marginLeft: '4px' }}>By: {item.verifiedBy}</span>
        </div>
      );
      case "Blocked": return <span className="status-badge status-pending" style={{ background: '#fee2e2', color: '#ef4444' }}><Ban size={12}/> Blocked</span>;
      default: return <span className="status-badge status-pending"><ShieldAlert size={12}/> In Review</span>;
    }
  };

  return (
    <div className="animate-fade-in module-container">
      <div className="header-bar">
         <div className="title-group">
            <h1 className="page-title">Student Notes</h1>
            <p className="subtitle" style={{ color: '#64748b', fontSize: '14px', fontWeight: 600, marginTop: '-4px' }}>Asset Integrity and Academic Quality Control</p>
         </div>
         <div className="search-box" style={{ maxWidth: '400px' }}>
            <Search size={18} className="search-icon" />
            <input 
              type="text" 
              placeholder="Search by title, author, or roll no..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
         </div>
      </div>

      <div className="filters-container" style={{ marginBottom: '32px' }}>
        <div className="filter-group">
          <Filter size={16} className="filter-icon" />
          <select value={filter} onChange={(e) => setFilter(e.target.value)}>
            <option value="All">All Operations</option>
            <option value="Review">Pending Review</option>
            <option value="Safe">Verified Assets</option>
            <option value="Blocked">Blocked / Spam</option>
          </select>
        </div>
      </div>

      <div className="table-wrapper">
        <table className="modern-table">
          <thead>
            <tr>
              <th>Institutional Asset</th>
              <th>Authoring Source</th>
              <th>Operational Status</th>
              <th style={{ textAlign: 'right' }}>Management Actions</th>
            </tr>
          </thead>

          <tbody>
            {filtered.map((c) => (
              <tr key={c.id}>
                <td>
                  <div className="student-cell">
                    <div className="student-avatar-small" style={{ background: '#f8fafc', color: '#3b82f6' }}>
                      <FileText size={18} />
                    </div>
                    <div className="student-info-small">
                      <span className="name">{c.title}</span>
                      <span className="email">{c.type}</span>
                    </div>
                  </div>
                </td>
                <td>
                  <div className="author-details" style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 700, color: 'var(--text-main)' }}>
                      <User size={14} className="text-muted" />
                      {c.author}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', color: 'var(--text-muted)' }}>
                      <Hash size={12} />
                      {c.rollNo}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', color: 'var(--text-muted)' }}>
                      <Mail size={12} />
                      {c.email}
                    </div>
                  </div>
                </td>
                <td>
                  <div className="status-container">
                    {getStatusBadge(c)}
                  </div>
                </td>
                <td>
                  <div className="actions-cell">
                    <button 
                      className="icon-btn view-btn" 
                      title="View Digital Asset"
                      onClick={() => window.open(c.fileUrl, '_blank')}
                    >
                      <Eye size={18} />
                    </button>
                    
                    {/* Admin can Block/Unblock once a Teacher has Verified it or it's already Blocked */}
                    {c.status !== "Review" && (
                        c.status === "Blocked" ? (
                            <button 
                                className="icon-btn" 
                                title="Authorize / Unblock Asset"
                                style={{ borderColor: '#10b981', color: '#10b981' }}
                                onClick={() => updateStatus(c.id, "Safe")}
                            >
                                <CheckCircle size={18} />
                            </button>
                        ) : (
                            <button 
                                className="icon-btn delete-btn" 
                                title="Block Resource"
                                style={{ borderColor: '#ef4444', color: '#ef4444' }}
                                onClick={() => updateStatus(c.id, "Blocked")}
                            >
                                <Ban size={18} />
                            </button>
                        )
                    )}

                    <button 
                      className="icon-btn" 
                      title="Permanently Purge Asset"
                      style={{ background: '#fee2e2', color: '#ef4444', border: 'none' }}
                      onClick={() => deleteAsset(c.id)}
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={4} className="empty-table-cell">
                  <div className="empty-state" style={{ padding: '40px', textAlign: 'center', color: '#94a3b8' }}>
                    <ShieldAlert size={48} style={{ marginBottom: '16px', opacity: 0.5 }} />
                    <p>No curricula or assets currently awaiting institutional oversight.</p>
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
