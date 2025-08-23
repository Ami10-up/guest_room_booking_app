import React, { useEffect, useState } from 'react';
import { getToken } from '../api';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography } from '@mui/material';

export default function BookingHistory({ user }) {
  const [bookings, setBookings] = useState([]);
  useEffect(() => {
    fetch('http://localhost:4000/api/bookings', {
      headers: { Authorization: 'Bearer ' + getToken() }
    })
      .then(res => res.json())
      .then(data => {
        if (user.role === 'admin') setBookings(data);
        else setBookings(data.filter(b => b.userId === user.id));
      });
  }, [user]);

  return (
    <div>
      <Typography variant="h6" sx={{ mt: 2 }}>Booking History</Typography>
      <TableContainer component={Paper} sx={{ mt: 1 }}>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Category</TableCell>
              <TableCell>Date From</TableCell>
              <TableCell>Date To</TableCell>
              <TableCell>Status</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {bookings.map(b => (
              <TableRow key={b.id}>
                <TableCell>{b.id}</TableCell>
                <TableCell>{b.guestRoomCategoryId}</TableCell>
                <TableCell>{b.dateFrom}</TableCell>
                <TableCell>{b.dateTo}</TableCell>
                <TableCell>{b.status}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
}
