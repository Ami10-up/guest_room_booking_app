import React, { useState } from 'react';
import { register, setToken } from '../api';
import { TextField, Button, Typography, Box, Alert, MenuItem, Select, InputLabel, FormControl } from '@mui/material';

export default function RegisterForm({ onRegister }) {
  const [form, setForm] = useState({
    fullName: '', rank: '', idNo: '', username: '', password: '', contactNo: '', presentAppointment: '', role: 'user'
  });
  const [error, setError] = useState('');

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    const res = await register(form);
    if (res.token) {
      setToken(res.token);
      onRegister(res.user);
    } else {
      setError(res.message || 'Registration failed');
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2, p: 2, boxShadow: 2, borderRadius: 2 }}>
      <Typography variant="h5" align="center">Register</Typography>
      {error && <Alert severity="error">{error}</Alert>}
      <TextField name="fullName" label="Full Name" value={form.fullName} onChange={handleChange} required fullWidth />
      <TextField name="rank" label="Rank" value={form.rank} onChange={handleChange} fullWidth />
      <TextField name="idNo" label="ID No" value={form.idNo} onChange={handleChange} required fullWidth />
      <TextField name="username" label="Username" value={form.username} onChange={handleChange} required fullWidth />
      <TextField type="password" name="password" label="Password" value={form.password} onChange={handleChange} required fullWidth />
      <TextField name="contactNo" label="Contact No" value={form.contactNo} onChange={handleChange} fullWidth />
      <TextField name="presentAppointment" label="Present Appointment" value={form.presentAppointment} onChange={handleChange} fullWidth />
      <FormControl fullWidth>
        <InputLabel>Role</InputLabel>
        <Select name="role" value={form.role} label="Role" onChange={handleChange}>
          <MenuItem value="user">User</MenuItem>
          <MenuItem value="admin">Admin</MenuItem>
        </Select>
      </FormControl>
      <Button type="submit" variant="contained" color="primary">Register</Button>
    </Box>
  );
}
