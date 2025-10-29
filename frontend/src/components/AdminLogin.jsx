// src/components/AdminLogin.jsx

import React, { useState } from 'react';
import axios from 'axios'; // We will use axios directly for this public request
import { BASE_URL } from '../apiConfig'; // We only need the base URL from our config

const AdminLogin = ({ onLoginSuccess }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleLogin = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        try {
            // --- FIX: Use axios directly for the unauthenticated login request ---
            // We construct the full URL and add the ngrok header manually here.
            const response = await axios.post(
                `${BASE_URL}/api/auth/login`, 
                {
                    username,
                    password,
                },
                {
                    headers: { 'ngrok-skip-browser-warning': 'true' }
                }
            );

            const { token, user } = response.data;

            if (user && user.role === 'admin') {
                onLoginSuccess(token, user);
            } else {
                setError('Access denied. Only administrators can log in here.');
            }

        } catch (err) {
            setError('Login failed. Please check your username and password.');
            console.error("Login Error:", err.response ? err.response.data : err.message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="login-container">
            <div className="login-box">
                <h2>Admin Panel Login</h2>
                <form onSubmit={handleLogin}>
                    <div className="input-group">
                        <label htmlFor="username">Username</label>
                        <input
                            type="text"
                            id="username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                        />
                    </div>
                    <div className="input-group">
                        <label htmlFor="password">Password</label>
                        <input
                            type="password"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    {error && <p className="error-message">{error}</p>}
                    <button type="submit" disabled={isLoading}>
                        {isLoading ? 'Logging in...' : 'Login'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default AdminLogin;