// src/pages/BookingManagement.jsx

import React, { useState, useEffect } from 'react';
import apiClient from '../apiConfig';
import BookingRow from '../components/BookingRow';
import AllotmentModal from '../components/AllotmentModal';

const BookingManagement = () => {
    const [bookings, setBookings] = useState([]);
    const [categories, setCategories] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedBooking, setSelectedBooking] = useState(null);

    const fetchData = async () => {
        setIsLoading(true);
        try {
            const [bookingsRes, categoriesRes] = await Promise.all([
                apiClient.get('/bookings'),
                apiClient.get('/categories')
            ]);
            
            const activeBookings = bookingsRes.data.filter(b => b.status !== 'cancelled');
            setBookings(activeBookings);
            setCategories(categoriesRes.data);
        } catch (err) {
            setError('Failed to fetch data.');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const getCategoryNameById = (id) => {
        const category = categories.find(c => c.id === id);
        return category ? category.name : 'Unknown Category';
    };

    // In src/pages/BookingManagement.jsx

const handleUpdateStatus = async (bookingId, status, allottedRoomNumbers = null, guestRoomCategoryId = null) => {
    // --- START DEBUG LOGGING ---
    console.log("--- handleUpdateStatus called ---");
    console.log("Booking ID:", bookingId);
    console.log("New Status:", status);
    console.log("Allotted Rooms:", allottedRoomNumbers);
    console.log("New Category ID:", guestRoomCategoryId);
    console.log("---------------------------------");
    // --- END DEBUG LOGGING ---

    try {
        const payload = {
            status,
            allottedRoomNumbers,
            guestRoomCategoryId
        };
        await apiClient.put(`/bookings/${bookingId}/status`, payload);
        fetchData(); 
    } catch (error) {
        console.error(`Failed to ${status} booking:`, error.response ? error.response.data : error.message);
        setError(`Failed to ${status} booking.`);
    }
    setIsModalOpen(false);
};

    const openApproveModal = (booking) => {
        setSelectedBooking(booking);
        setIsModalOpen(true);
    };
    
    const handleConfirmCancellation = (bookingId) => {
    if (window.confirm('Are you sure you want to confirm this cancellation? The room will become available.')) {
        // We use the same updateStatus endpoint, just with a different status
        handleUpdateStatus(bookingId, 'cancelled');
    }
};

    if (isLoading) return <p>Loading booking requests...</p>;
    if (error) return <p className="error-message">{error}</p>;

    // In src/pages/BookingManagement.jsx, replace the entire return statement

    return (
        <div>
            <h2>Manage Booking Requests</h2>
            <div className="table-container">
                <table className="management-table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Guest Name / User ID</th>
                            <th>Rank</th>
                            <th>Appointment</th>
                            {/* --- ADD THIS NEW HEADER --- */}
                            <th>Contact No.</th>
                            <th>Dates</th>
                            <th>Rooms / People</th>
                            <th>Reason</th>
                            <th>Remarks</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {bookings.map(booking => (
                            <BookingRow
                                key={booking.id}
                                booking={booking}
                                categoryName={getCategoryNameById(booking.guestRoomCategoryId)}
                                onApproveClick={() => openApproveModal(booking)}
                                onRejectClick={() => handleReject(booking.id)}
                                onConfirmCancellationClick={() => handleConfirmCancellation(booking.id)}
                            />   
                        ))}
                    </tbody>
                </table>
            </div>
            {bookings.length === 0 && !isLoading && <p>No new booking requests found.</p>}
            
            {isModalOpen && (
                <AllotmentModal
                    booking={selectedBooking}
                    allCategories={categories}
                    onApprove={handleUpdateStatus}
                    onCancel={() => setIsModalOpen(false)}
                />
            )}
        </div>
    );
};

export default BookingManagement;