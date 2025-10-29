// src/App.jsx

import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import AdminLogin from './components/AdminLogin';
import AdminLayout from './components/AdminLayout';
import BookingManagement from './pages/BookingManagement';
import RoomManagement from './pages/RoomManagement';
import CategoryManagement from './pages/CategoryManagement';
import OccupancyDashboard from './pages/OccupancyDashboard';

function App() {
  // --- FIX 1: Lazy State Initialization ---
  // This function runs ONLY ONCE on the initial render, preventing re-renders from
  // causing a state change, which breaks the infinite loop.
  console.log("App component is rendering..."); 
  const [authToken, setAuthToken] = useState(() => localStorage.getItem('adminToken'));
  const [adminUser, setAdminUser] = useState(() => {
    const user = localStorage.getItem('adminUser');
    return user ? JSON.parse(user) : null;
  });

  const handleLoginSuccess = (token, user) => {
    localStorage.setItem('adminToken', token);
    localStorage.setItem('adminUser', JSON.stringify(user));
    setAuthToken(token);
    setAdminUser(user);
  };

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminUser');
    setAuthToken(null);
    setAdminUser(null);
  };
  console.log("Current auth token:", authToken);

  return (
    <Router>
      <Routes>
        {/* --- Public Login Route --- */}
        <Route
          path="/login"
          element={
            authToken ? <Navigate to="/admin/bookings" replace /> : <AdminLogin onLoginSuccess={handleLoginSuccess} />
          }
        />

        {/* --- Protected Admin Routes --- */}
        {/* We use a wrapper Route to protect all the child routes. */}
        <Route
          path="/admin"
          element={
            authToken ? <AdminLayout adminUser={adminUser} onLogout={handleLogout} /> : <Navigate to="/login" replace />
          }
        >
          {/* Default route for /admin will redirect to the bookings page */}
          <Route index element={<Navigate to="/admin/bookings" replace />} />
          
          {/* Child routes that will render inside AdminLayout's <Outlet> */}
          <Route path="bookings" element={<BookingManagement />} />
          <Route path="occupancy" element={<OccupancyDashboard />} />
          <Route path="rooms" element={<RoomManagement />} />
          <Route path="categories" element={<CategoryManagement />} />
        </Route>
        
        {/* --- Default Catch-all Route --- */}
        <Route
            path="*"
            element={<Navigate to={authToken ? "/admin/bookings" : "/login"} replace />}
        />
      </Routes>
    </Router>
  );
}

export default App;