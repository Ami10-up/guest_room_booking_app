// src/apiConfig.js

import axios from 'axios';

// Use environment variable when running locally with Vite (VITE_API_BASE_URL).
// Falls back to localhost:3000 for local development so you don't have to rely on ngrok.
// In production you can set VITE_API_BASE_URL to your deployed API URL.
export const BASE_URL = typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_API_BASE_URL
    ? import.meta.env.VITE_API_BASE_URL
    : 'http://localhost:3000';

// Create a configured axios instance that will be used for ALL authenticated requests.
const apiClient = axios.create({
    baseURL: BASE_URL,
    headers: {
        // Keep the ngrok header in case you're tunnelling through ngrok, harmless otherwise.
        'ngrok-skip-browser-warning': 'true',
        'Content-Type': 'application/json',
    }
});

// The interceptor automatically adds the auth token to every request and
// prepends '/api' only for relative URLs to avoid corrupting absolute URLs.
apiClient.interceptors.request.use((config) => {
    const token = localStorage.getItem('adminToken');
    if (config && config.url) {
        const isAbsolute = config.url.startsWith('http://') || config.url.startsWith('https://');
        if (!isAbsolute && !config.url.startsWith('/api')) {
            config.url = `/api${config.url}`;
        }
    }
    if (token) {
        config.headers = config.headers || {};
        config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
}, (error) => Promise.reject(error));

export default apiClient;