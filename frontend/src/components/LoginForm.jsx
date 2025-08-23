import React, { useState } from 'react';
import { login, setToken } from '../api';
import { TextField, Button, Typography, Box, Alert } from '@mui/material';

export default function LoginForm({ onLogin }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    const res = await login(username, password);
    if (res.token) {
      setToken(res.token);
      onLogin(res.user);
    } else {
      setError(res.message || 'Login failed');
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2, p: 2, boxShadow: 2, borderRadius: 2 }}>
      <Typography variant="h5" align="center">Login</Typography>
      {error && <Alert severity="error">{error}</Alert>}
      <TextField label="Username" value={username} onChange={e => setUsername(e.target.value)} required fullWidth />
      <TextField label="Password" type="password" value={password} onChange={e => setPassword(e.target.value)} required fullWidth />
      <Button type="submit" variant="contained" color="primary">Login</Button>
    </Box>
  );
}
