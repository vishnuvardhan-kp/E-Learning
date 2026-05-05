const isLocal = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';

export const API_URL = isLocal
    ? 'http://localhost:5000'
    : 'https://vinodh0512-e-learning.hf.space';

export default API_URL;
