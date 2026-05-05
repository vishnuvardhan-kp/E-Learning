import { useState, useEffect } from "react";
import { 
  Bell, 
  Megaphone, 
  AlertTriangle, 
  Send, 
  Search, 
  Filter, 
  Plus, 
  X, 
  Trash2, 
  Eye, 
  User, 
  Globe, 
  Calendar,
  Users,
  Building2,
  GraduationCap
} from "lucide-react";
import { API_URL } from "../../api/backend";
import "./users.css";

export default function Notifications() {
  const [showAdd, setShowAdd] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [search, setSearch] = useState("");
  
  const [targetConfig, setTargetConfig] = useState({
    role: "All Users",
    dept: "All Departments",
    year: "All Years"
  });

  const [newNote, setNewNote] = useState({
    title: "",
    message: "",
    type: "Global"
  });

  const fetchNotifications = async () => {
    try {
      const res = await fetch(`${API_URL}/notifications`);
      const data = await res.json();
      setNotifications(data);
    } catch (e) {
      console.error(e);
      setNotifications([]);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const handleCreate = async () => {
    if (!newNote.title || !newNote.message) {
        alert("Please provide both a title and an institutional message.");
        return;
    }

    // Construct target string
    let finalTarget = targetConfig.role;
    if (targetConfig.dept !== "All Departments") finalTarget += ` - ${targetConfig.dept}`;
    if (targetConfig.role !== "Teachers" && targetConfig.year !== "All Years") finalTarget += ` - ${targetConfig.year}`;

    const payload = { ...newNote, target: finalTarget };

    try {
      await fetch(`${API_URL}/notifications`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      setShowAdd(false);
      setNewNote({ title: "", message: "", type: "Global" });
      setTargetConfig({ role: "All Users", dept: "All Departments", year: "All Years" });
      fetchNotifications();
    } catch (e) {
      console.error(e);
    }
  };

  const deleteNote = async (id) => {
    if (window.confirm("Permanently retract this institutional notification?")) {
      setNotifications(notifications.filter(n => n._id !== id));
    }
  };

  const filtered = notifications.filter(n => 
    n.title?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="animate-fade-in module-container">
      <div className="header-bar">
         <div className="title-group">
            <h1 className="page-title">Notification Center</h1>
            <p className="subtitle" style={{ color: '#64748b', fontSize: '14px', fontWeight: 600, marginTop: '-4px' }}>Institutional Broadcasting & Emergency Alerts</p>
         </div>
         <button className="action-btn-primary" onClick={() => setShowAdd(true)} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '12px 24px', borderRadius: '12px', border: 'none', cursor: 'pointer', fontWeight: 800 }}>
           <Plus size={20} />
           Dispatch Bulletin
         </button>
      </div>

      <div className="filters-container">
        <div className="search-box" style={{ flex: 1 }}>
          <Search size={18} className="search-icon" />
          <input 
            type="text" 
            placeholder="Search broadcast history..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <div className="table-wrapper">
        <table className="modern-table">
          <thead>
            <tr>
              <th>Broadcast Title</th>
              <th>Category</th>
              <th>Target Audience</th>
              <th>Dispatch Date</th>
              <th style={{ textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>

          <tbody>
            {filtered.map((n) => (
              <tr key={n._id}>
                <td>
                  <div className="student-cell">
                    <div className="student-avatar-small" style={{ background: n.type === 'Alert' ? '#fee2e2' : '#eff6ff', color: n.type === 'Alert' ? '#ef4444' : '#2563eb' }}>
                      {n.type === 'Alert' ? <AlertTriangle size={16} /> : <Megaphone size={16} />}
                    </div>
                    <span className="name">{n.title}</span>
                  </div>
                </td>
                <td>
                  <span className={`status-badge ${n.type === 'Alert' ? 'status-pending' : 'status-active'}`} style={n.type === 'Alert' ? { background: '#fee2e2', color: '#ef4444' } : {}}>
                    {n.type}
                  </span>
                </td>
                <td>
                   <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <Globe size={14} className="text-muted" />
                      <span className="year-text">{n.target}</span>
                   </div>
                </td>
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Calendar size={14} className="text-muted" />
                    <span className="year-text">{new Date(n.createdAt || Date.now()).toLocaleDateString()}</span>
                  </div>
                </td>
                <td>
                  <div className="actions-cell">
                    <button className="icon-btn view-btn" title="View Message Contents">
                      <Eye size={18} />
                    </button>
                    <button className="icon-btn delete-btn" onClick={() => deleteNote(n._id)} title="Retract Notification">
                      <Trash2 size={18} style={{ color: '#ef4444' }} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showAdd && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: '900px' }}>
            <div className="modal-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ padding: '10px', background: '#eff6ff', borderRadius: '12px', color: '#2563eb' }}>
                    <Megaphone size={24} />
                </div>
                <h2>Dispatch New Bulletin</h2>
              </div>
              <button className="icon-btn" onClick={() => setShowAdd(false)}><X size={20} /></button>
            </div>

            <div className="form-layout">
              <div className="input-group" style={{ gridColumn: 'span 2' }}>
                <label>Broadcast Title</label>
                <input 
                  placeholder="e.g., Final Semester Examination Schedule - 2026" 
                  value={newNote.title}
                  onChange={e => setNewNote({...newNote, title: e.target.value})}
                  style={{ fontSize: '18px', fontWeight: 700 }}
                />
              </div>

              <div className="input-group">
                <label>Message Category</label>
                <select value={newNote.type} onChange={e => setNewNote({...newNote, type: e.target.value})}>
                  <option value="Global">Institutional Announcement (Global)</option>
                  <option value="Alert">Urgent Emergency Alert</option>
                  <option value="Event">Campus Event / Activity</option>
                </select>
              </div>

              <div className="input-group">
                <label>Target User Role</label>
                <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                  <Users size={18} style={{ position: 'absolute', left: '16px', color: '#94a3b8' }} />
                  <select 
                    value={targetConfig.role} 
                    onChange={e => setTargetConfig({...targetConfig, role: e.target.value})}
                    style={{ paddingLeft: '45px' }}
                  >
                    <option value="All Users">All Institutional Users</option>
                    <option value="Students">Students Only</option>
                    <option value="Teachers">Faculty / Teachers Only</option>
                  </select>
                </div>
              </div>

              <div className="input-group">
                <label>Target Department</label>
                <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                  <Building2 size={18} style={{ position: 'absolute', left: '16px', color: '#94a3b8' }} />
                  <select 
                    value={targetConfig.dept} 
                    onChange={e => setTargetConfig({...targetConfig, dept: e.target.value})}
                    style={{ paddingLeft: '45px' }}
                  >
                    <option value="All Departments">All Departments</option>
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
                  <GraduationCap size={18} style={{ position: 'absolute', left: '16px', color: '#94a3b8' }} />
                  <select 
                    disabled={targetConfig.role === "Teachers"}
                    value={targetConfig.year} 
                    onChange={e => setTargetConfig({...targetConfig, year: e.target.value})}
                    style={{ paddingLeft: '45px', opacity: targetConfig.role === "Teachers" ? 0.5 : 1 }}
                  >
                    <option value="All Years">All Years</option>
                    <option value="1st Year">1st Year Only</option>
                    <option value="2nd Year">2nd Year Only</option>
                    <option value="3rd Year">3rd Year Only</option>
                    <option value="4th Year">4th Year Only</option>
                  </select>
                </div>
              </div>

              <div className="input-group" style={{ gridColumn: 'span 2' }}>
                <label>Detailed Message Content</label>
                <textarea 
                  placeholder="Enter the comprehensive institutional message here..."
                  value={newNote.message}
                  onChange={e => setNewNote({...newNote, message: e.target.value})}
                  style={{ minHeight: '150px' }}
                />
              </div>

              <div className="modal-actions">
                <button className="action-btn-primary" style={{ flex: 2, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }} onClick={handleCreate}>
                   <Send size={18} />
                   Dispatch Bulletin
                </button>
                <button className="action-btn-ghost" style={{ flex: 1 }} onClick={() => setShowAdd(false)}>Discard</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
