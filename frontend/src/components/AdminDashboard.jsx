import React, { useEffect, useState } from 'react';
import { getToken } from '../api';
import { fetchUsers } from '../apiAdmin';
import AdminCategoryRoomManager from './AdminCategoryRoomManager';
import AdminUserManager from './AdminUserManager';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography, Button, Select, MenuItem, FormControl, InputLabel, Box, Alert } from '@mui/material';

export default function AdminDashboard() {
  const [bookings, setBookings] = useState([]);
  const [categories, setCategories] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [users, setUsers] = useState([]);
  const [message, setMessage] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  useEffect(() => {
    fetch('http://localhost:4000/api/bookings', { headers: { Authorization: 'Bearer ' + getToken() } })
      .then(res => res.json()).then(setBookings);
    fetch('http://localhost:4000/api/categories', { headers: { Authorization: 'Bearer ' + getToken() } })
      .then(res => res.json()).then(setCategories);
    fetch('http://localhost:4000/api/rooms', { headers: { Authorization: 'Bearer ' + getToken() } })
      .then(res => res.json()).then(setRooms);
    fetchUsers().then(setUsers);
  }, [message]);

  const updateBookingStatus = (id, status) => {
    fetch(`http://localhost:4000/api/bookings/${id}/status`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + getToken() },
      body: JSON.stringify({ status })
    })
      .then(res => res.json())
      .then(() => setMessage('Booking updated!'));
  };

  const getUserName = (id) => {
    const u = users.find(u => u.id === id);
    return u ? u.fullName || u.username : id;
  };
  const getCategoryName = (id) => {
    const c = categories.find(c => c.id === id);
    return c ? c.name : id;
  };

  const filteredBookings = statusFilter ? bookings.filter(b => b.status === statusFilter) : bookings;

  return (
    <Box sx={{ maxWidth: 900, mx: 'auto', mt: 3 }}>
      <Typography variant="h4" gutterBottom>Admin Dashboard</Typography>
      {message && <Alert severity="success" sx={{ mb: 2 }}>{message}</Alert>}
      <Typography variant="h6" sx={{ mt: 2 }}>All Bookings</Typography>
      <FormControl sx={{ minWidth: 180, mb: 2 }}>
        <InputLabel>Status Filter</InputLabel>
        <Select value={statusFilter} label="Status Filter" onChange={e => setStatusFilter(e.target.value)}>
          <MenuItem value="">All</MenuItem>
          <MenuItem value="pending">Pending</MenuItem>
          <MenuItem value="approved">Approved</MenuItem>
          <MenuItem value="rejected">Rejected</MenuItem>
          <MenuItem value="cancelled">Cancelled</MenuItem>
        </Select>
      </FormControl>
      <TableContainer component={Paper} sx={{ mb: 3 }}>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>User</TableCell>
              <TableCell>Category</TableCell>
              <TableCell>Date From</TableCell>
              <TableCell>Date To</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredBookings.map(b => (
              <TableRow key={b.id}>
                <TableCell>{b.id}</TableCell>
                <TableCell>{getUserName(b.userId)}</TableCell>
                <TableCell>{getCategoryName(b.guestRoomCategoryId)}</TableCell>
                <TableCell>{b.dateFrom}</TableCell>
                <TableCell>{b.dateTo}</TableCell>
                <TableCell>{b.status}</TableCell>
                <TableCell>
                  {b.status === 'pending' && <>
                    <Button size="small" variant="contained" color="success" sx={{ mr: 1 }} onClick={() => updateBookingStatus(b.id, 'approved')}>Approve</Button>
                    <Button size="small" variant="contained" color="error" onClick={() => updateBookingStatus(b.id, 'rejected')}>Reject</Button>
                  </>}
                  {b.status === 'approved' && <Button size="small" variant="contained" color="warning" onClick={() => updateBookingStatus(b.id, 'cancelled')}>Cancel</Button>}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <AdminCategoryRoomManager />
    <AdminUserManager />
    </Box>
  );
}
