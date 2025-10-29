// src/pages/OccupancyDashboard.jsx

import React, { useState, useEffect } from 'react';
import apiClient from '../apiConfig';

// Helper function to generate an array of dates without mutating the original state
const getDatesInRange = (start, end) => {
    const dates = [];
    // Create a NEW Date object to avoid side effects
    let currentDate = new Date(start); 
    const lastDate = new Date(end);

    // Normalize to the start of the day to prevent timezone issues
    currentDate.setUTCHours(0, 0, 0, 0);
    lastDate.setUTCHours(0, 0, 0, 0);
    
    while (currentDate <= lastDate) {
        dates.push(new Date(currentDate));
        currentDate.setDate(currentDate.getDate() + 1);
    }
    return dates;
};

// A small, self-contained component for a single room's card
const RoomStatusCard = ({ room }) => {
    const isOccupied = !!room.bookingId;
    return (
        <div className={`room-card ${isOccupied ? 'status-occupied' : 'status-available'}`}>
            <div className="room-card-header">
                <h4>{room.roomName}</h4>
            </div>
            <div className="room-card-body">
                {isOccupied ? (
                    <>
                        <p><strong>Guest:</strong> {room.guestName}</p>
                        <p><strong>Rank:</strong> {room.guestRank}</p>
                        <p><strong>Checkout:</strong> {room.checkoutDate}</p>
                    </>
                ) : ( <p>Available</p> )}
            </div>
        </div>
    );
};

const OccupancyDashboard = () => {
    const [rooms, setRooms] = useState([]);
    const [bookings, setBookings] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');

    const [startDate, setStartDate] = useState(new Date());
    const [endDate, setEndDate] = useState(new Date(new Date().setDate(new Date().getDate() + 49)));
    
    useEffect(() => {
        console.log("--- OccupancyDashboard: useEffect triggered. ---");
        const fetchOccupancy = async () => {
            console.log("OccupancyDashboard: Fetching data...");
            setIsLoading(true); // Set loading true at the start of the fetch
            try {
                const config = {
                    params: {
                        startDate: startDate.toISOString().split('T')[0],
                        endDate: endDate.toISOString().split('T')[0],
                    }
                };
                const response = await apiClient.get('/bookings/occupancy-range', config);
                console.log("OccupancyDashboard: Data received successfully.", response.data);
                setRooms(response.data.allRooms);
                setBookings(response.data.bookings);
            } catch (err) {
                console.error("!!! API CALL FAILED !!!", err.response ? err.response.data : err.message);
                setError('Failed to fetch occupancy data.Please check console');
            } finally {
                console.log("5. Finally block reached. Setting isLoading to false.");
                setIsLoading(false); // Set loading false at the end, always
            }
        };
        fetchOccupancy();
    }, [startDate, endDate]);
    console.log("--- OccupancyDashboard component is rendering. ---");
    console.log("Current state -> isLoading:", isLoading, " | hasError:", !!error);

    if (isLoading) return <p>Loading occupancy data...</p>;
    if (error) return <p className="error-message">{error}</p>;

    const dates = getDatesInRange(startDate, endDate);

    const getRoomStatusForDate = (room, date) => {
        const dateString = date.toISOString().split('T')[0];
        for (const booking of bookings) {
            if (booking.guestRoomCategoryId === room.categoryId) {
                const isRoomInBooking = booking.allottedRoomNumbers && 
                                        booking.allottedRoomNumbers.includes(room.name);
                if (isRoomInBooking) {
                    if (dateString >= booking.dateFrom && dateString < booking.dateTo) {
                        // If booking is still pending (not yet allotted/approved), do not reveal the guest name
                        // in the occupancy calendar. Only show the guest name for approved or other non-pending statuses.
                        const guestName = booking.status === 'pending' ? null : booking.guestName;
                        return { status: booking.status, guestName };
                    }
                }
            }
        }
        return { status: 'available', guestName: null };
    };

    return (
        <div>
            <h2>Live Occupancy Calendar (Next 50 Days)</h2>
            <p>This grid shows the status of each room for the selected date range.</p>
            {/* We will add date picker inputs here later */}
            
            <div className="calendar-grid-container">
                <table className="calendar-grid">
                    <thead>
                        <tr>
                            <th className="room-header-cell">Room</th>
                            {dates.map(date => (
                                <th key={date.toISOString()} className="date-header-cell">
                                    <div>{date.getDate()}</div>
                                    <div>{date.toLocaleDateString('en-US', { weekday: 'short' })}</div>
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {rooms.map(room => (
                            <tr key={room.id}>
                                <td className="room-name-cell">
                                    <strong>{room.name}</strong><br/>
                                    <span>{room.categoryName}</span>
                                </td>
                                {dates.map(date => {
                                    const { status, guestName } = getRoomStatusForDate(room, date);
                                    return (
                                        <td key={date.toISOString()} className={`status-cell status-${status}`}>
                                            {status !== 'available' && (
                                                <div className="cell-content">
                                                    Reserved by: <strong>{guestName}</strong>
                                                </div>
                                            )}
                                        </td>
                                    );
                                })}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default OccupancyDashboard;