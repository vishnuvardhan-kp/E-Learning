import { useState } from "react";
import "./users.css";

export default function Moderation() {
  const [content, setContent] = useState([
    { id: 1, type: "Note", title: "ML Cheat Sheet", author: "Arun", status: "Safe" },
    { id: 2, type: "Upload", title: "Semester Questions", author: "Dr. Karthik", status: "Review" },
    { id: 3, type: "Post", title: "Free Marks Click Here", author: "SpamBot", status: "Spam" },
    { id: 4, type: "Material", title: "Algorithms", author: "Meera", status: "Safe" }
  ]);

  const removeContent = (id) => {
    setContent(content.filter((c) => c.id !== id));
  };

  const verifyContent = (id) => {
    setContent(content.map((c) =>
      c.id === id ? { ...c, status: "Safe" } : c
    ));
  };

  return (
    <div className="animate-fade-in">
      <h1>Content Moderation</h1>

      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Type</th>
              <th>Content Title</th>
              <th>Authoring Faculty/Student</th>
              <th>Operational Status</th>
              <th style={{ textAlign: 'center' }}>Management Actions</th>
            </tr>
          </thead>

          <tbody>
            {content.map((c) => (
              <tr key={c.id}>
                <td>{c.type}</td>
                <td style={{ fontWeight: 600 }}>{c.title}</td>
                <td>{c.author}</td>
                <td><span className="class-badge" style={{ backgroundColor: '#fef2f2', color: '#991b1b' }}>{c.status}</span></td>
                <td>
                   <div className="action-cell">
                     <button className="action-btn action-btn-primary" onClick={() => alert("Reviewing " + c.title)}>Review</button>
                     {c.status !== "Safe" && (
                        <button className="action-btn" style={{ backgroundColor: '#059669', color: '#fff', borderColor: '#059669' }} onClick={() => verifyContent(c.id)}>Verify</button>
                     )}
                     <button className="action-btn action-btn-danger" onClick={() => removeContent(c.id)}>Delete</button>
                   </div>
                </td>
              </tr>
            ))}
            {content.length === 0 && (
              <tr>
                <td colSpan={5} className="no-data-cell">No institutional matches found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}