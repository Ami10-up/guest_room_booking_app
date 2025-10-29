// src/components/AdminLayout.jsx

import React from 'react';
// Link is for client-side navigation, Outlet is the placeholder for page content
import { Link, Outlet } from 'react-router-dom';

const AdminLayout = ({ adminUser, onLogout }) => {
    // Basic check to ensure user data is available
    if (!adminUser) {
        return <div>Loading user data...</div>;
    }

    return (
        <div className="admin-layout">
            <aside className="sidebar">
                <div className="sidebar-header">
                    <h3>Atithi Bhavan</h3>
                    <span>Admin Panel</span>
                </div>
                <nav className="sidebar-nav">
                    {/* These links will navigate to the different admin pages */}
                    <Link to="/admin/bookings">Booking Requests</Link>
                    <Link to="/admin/occupancy">Live Occupancy</Link>
                    <Link to="/admin/rooms">Room Management</Link>
                    <Link to="/admin/categories">Category Management</Link>
                </nav>
                <div className="sidebar-footer">
                    <div className="user-info">
                        <strong>{adminUser.fullName}</strong>
                        <span>({adminUser.role})</span>
                    </div>
                    <button onClick={onLogout} className="logout-button">Logout</button>
                </div>
            </aside>
            <main className="main-content">
                {/* 
                  This is the magic part from react-router-dom.
                  Depending on the URL (/admin/bookings, /admin/rooms, etc.),
                  the corresponding component (BookingManagement, RoomManagement, etc.)
                  will be rendered here.
                */}
                <Outlet />
            </main>
        </div>
    );
};

export default AdminLayout;