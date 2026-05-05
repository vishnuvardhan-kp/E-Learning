import { useState } from "react";
import "./notifications.css";

export default function Notifications() {
  const [showModal, setShowModal] = useState(false);
  const [type, setType] = useState("Global");
  const [target, setTarget] = useState("All");

  const notifications = [
    { id: 1, title: "Final Exam Schedule", type: "Global", date: "2026-04-01", target: "All Students" },
    { id: 2, title: "System Maintenance", type: "Alert", date: "2026-03-31", target: "All Users" },
    { id: 3, title: "New Academic Policy", type: "Global", date: "2026-03-30", target: "Faculty" },
  ];

  return (
    <div className="page">
      <h1>Notification Center</h1>

      <div className="top-bar">
        <p>Send updates to users</p>
        <button onClick={() => setShowModal(true)}>+ Create</button>
      </div>

      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Title</th>
              <th>Type</th>
              <th>Date</th>
              <th>Target</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {notifications.map((n) => (
              <tr key={n.id}>
                <td>{n.title}</td>
                <td>{n.type}</td>
                <td>{n.date}</td>
                <td>{n.target}</td>
                <td>
                  <button onClick={() => alert("View " + n.title)}>View</button>
                  <button onClick={() => alert("Delete " + n.title)}>Delete</button>
                </td>
              </tr>
            ))}

            {notifications.length === 0 && (
              <tr>
                <td colSpan={5}>No data</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="modal">
          <div className="modal-box">
            <h2>Create Notification</h2>

            <input placeholder="Title" />
            <textarea placeholder="Message"></textarea>

            <select value={type} onChange={(e) => setType(e.target.value)}>
              <option value="Global">Global</option>
              <option value="Alert">Alert</option>
            </select>

            <select value={target} onChange={(e) => setTarget(e.target.value)}>
              <option value="All">All Users</option>
              <option value="Students">Students</option>
              <option value="Faculty">Faculty</option>
            </select>

            <div className="modal-actions">
              <button onClick={() => setShowModal(false)}>Send</button>
              <button onClick={() => setShowModal(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}