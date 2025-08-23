import React, { useState, useEffect } from 'react';
import { getToken } from '../api';
import { TextField, Button, Typography, Box, Alert, MenuItem, Select, InputLabel, FormControl, Stack } from '@mui/material';

export default function BookingForm({ onBooked }) {
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState({
    guestRoomCategoryId: '', dateFrom: '', dateTo: '', numRooms: 1, numPeople: 1, reason: '', checkInTime: '', checkOutTime: ''
  });
  const [vacancy, setVacancy] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetch('http://localhost:4000/api/categories', {
      headers: { Authorization: 'Bearer ' + getToken() }
    })
      .then(res => res.json())
      .then(setCategories);
  }, []);

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const checkVacancy = async () => {
    setVacancy(null);
    const params = new URLSearchParams({
      categoryId: form.guestRoomCategoryId,
      dateFrom: form.dateFrom,
      dateTo: form.dateTo,
      numRooms: form.numRooms
    });
    const res = await fetch(`http://localhost:4000/api/bookings/vacancy?${params.toString()}`, {
      headers: { Authorization: 'Bearer ' + getToken() }
    });
    const data = await res.json();
    setVacancy(data.isAvailable ? 'Available' : 'Not available');
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setError(''); setSuccess('');
    const res = await fetch('http://localhost:4000/api/bookings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + getToken() },
      body: JSON.stringify(form)
    });
    const data = await res.json();
    if (data.id) {
      setSuccess('Booking requested!');
      setForm({ guestRoomCategoryId: '', dateFrom: '', dateTo: '', numRooms: 1, numPeople: 1, reason: '', checkInTime: '', checkOutTime: '' });
      onBooked && onBooked();
    } else {
      setError(data.message || 'Booking failed');
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2, p: 2, boxShadow: 2, borderRadius: 2, mb: 2 }}>
      <Typography variant="h6" align="center">Book a Room</Typography>
      {error && <Alert severity="error">{error}</Alert>}
      {success && <Alert severity="success">{success}</Alert>}
      <FormControl fullWidth required>
        <InputLabel>Category</InputLabel>
        <Select name="guestRoomCategoryId" value={form.guestRoomCategoryId} label="Category" onChange={handleChange}>
          <MenuItem value="">Select Category</MenuItem>
          {categories.map(c => <MenuItem key={c.id} value={c.id}>{c.name}</MenuItem>)}
        </Select>
      </FormControl>
      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
        <TextField type="date" name="dateFrom" label="Date From" InputLabelProps={{ shrink: true }} value={form.dateFrom} onChange={handleChange} required fullWidth />
        <TextField type="date" name="dateTo" label="Date To" InputLabelProps={{ shrink: true }} value={form.dateTo} onChange={handleChange} required fullWidth />
      </Stack>
      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
        <TextField type="number" name="numRooms" label="No. of Rooms" inputProps={{ min: 1 }} value={form.numRooms} onChange={handleChange} required fullWidth />
        <TextField type="number" name="numPeople" label="No. of People" inputProps={{ min: 1 }} value={form.numPeople} onChange={handleChange} required fullWidth />
      </Stack>
      <TextField name="reason" label="Reason" value={form.reason} onChange={handleChange} fullWidth />
      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
        <TextField name="checkInTime" label="Check-in Time" value={form.checkInTime} onChange={handleChange} fullWidth />
        <TextField name="checkOutTime" label="Check-out Time" value={form.checkOutTime} onChange={handleChange} fullWidth />
      </Stack>
      <Button type="button" onClick={checkVacancy} variant="outlined">Check Vacancy</Button>
      {vacancy && <Typography color={vacancy === 'Available' ? 'green' : 'red'}>{vacancy}</Typography>}
      <Button type="submit" variant="contained" color="primary">Book</Button>
    </Box>
  );
}
