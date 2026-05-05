import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App.jsx'
import './index.css'
import { API_URL } from './api/backend'

window.API_URL = API_URL;
window.__API_URL__ = API_URL;

console.log("🚀 [E-Learning] API Base URL:", API_URL);

// Connectivity Test
fetch(API_URL + '/auth/login', { method: 'POST' })
  .then(() => console.log("📡 [E-Learning] Backend Connectivity Test: Reachable"))
  .catch(err => console.error("❌ [E-Learning] Backend Connectivity Test: FAILED", err));

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>,
)
