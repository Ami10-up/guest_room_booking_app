// Simple admin proxy server
// Serves static files from frontend/dist, protects with Basic Auth, and proxies /api to backend

const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const path = require('path');

const ADMIN_USER = process.env.ADMIN_USER || 'admin';
const ADMIN_PASS = process.env.ADMIN_PASS || 'adminpass';
const PORT = process.env.ADMIN_PROXY_PORT || 8080;
const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:3000';
const DIST_PATH = process.env.DIST_PATH || path.join(__dirname, '..', 'frontend', 'dist');

function basicAuth(req, res, next) {
  const auth = req.headers['authorization'] || '';
  if (!auth.startsWith('Basic ')) {
    res.setHeader('WWW-Authenticate', 'Basic realm="Admin Area"');
    return res.status(401).send('Authentication required');
  }
  const b64 = auth.split(' ')[1];
  const [user, pass] = Buffer.from(b64, 'base64').toString().split(':');
  if (user === ADMIN_USER && pass === ADMIN_PASS) return next();
  res.setHeader('WWW-Authenticate', 'Basic realm="Admin Area"');
  return res.status(401).send('Invalid credentials');
}

const app = express();

// Apply basic auth to all routes served by this proxy (so admin UI and api proxy are protected)
app.use(basicAuth);

// Proxy API requests to backend
app.use('/api', createProxyMiddleware({ target: BACKEND_URL, changeOrigin: true, secure: false }));

// Serve static frontend
app.use(express.static(DIST_PATH));

// SPA fallback
app.get('*', (req, res) => {
  res.sendFile(path.join(DIST_PATH, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Admin proxy listening on http://localhost:${PORT}`);
  console.log(`Serving static from ${DIST_PATH}`);
  console.log(`Proxying /api -> ${BACKEND_URL}`);
  console.log(`Basic auth user: ${ADMIN_USER}`);
});
