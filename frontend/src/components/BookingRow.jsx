// src/components/BookingRow.jsx

import React from 'react';

const BookingRow = ({ booking, categoryName, onApproveClick, onRejectClick, onConfirmCancellationClick }) => {
    
    // This helper function determines the style and text for the status badge
    const renderStatus = (status) => {
        let colorClass = '';
        switch (status) {
            case 'pending':
                colorClass = 'status-pending';
                break;
            case 'approved':
                colorClass = 'status-approved';
                break;
            case 'rejected':
                colorClass = 'status-rejected';
                break;
            // --- THIS IS THE NEWLY ADDED CASE ---
            case 'cancellation_pending':
                colorClass = 'status-cancellation-pending';
                break;
            default:
                colorClass = 'status-cancelled';
        }
        // Replace underscore with space for display, e.g., 'cancellation_pending' becomes 'CANCELLATION PENDING'
        const statusText = status.replace('_', ' ').toUpperCase();
        return <span className={`status-badge ${colorClass}`}>{statusText}</span>;
    };

    return (
        <tr>
            <td>{booking.id}</td>
            <td>
                <div><strong>{booking.name}</strong></div>
                <div className="sub-text">ID: {booking.idNo}</div>
            </td>
            <td>{booking.rank}</td>
            <td>{booking.presentAppointment}</td>
            <td>{booking.contactNo || 'N/A'}</td>
            <td>
                <div>{booking.dateFrom}</div>
                <div>to {booking.dateTo}</div>
            </td>
            <td>
                <div>Rooms: {booking.numRooms}</div>
                <div className="sub-text">Guests: {booking.numPeople}</div>
            </td>
            <td>{booking.reason}</td>
            <td>{booking.remarks || 'N/A'}</td>
            <td>{renderStatus(booking.status)}</td>
            <td>
                {/* Conditionally render buttons based on the status */}
                {booking.status === 'pending' && (
                    <div className="action-buttons">
                        <button onClick={onApproveClick} className="approve-btn">Approve</button>
                        <button onClick={onRejectClick} className="reject-btn">Reject</button>
                    </div>
                )}
                
                {/* --- THIS IS THE NEW UI FOR THE NEW STATUS --- */}
                {booking.status === 'cancellation_pending' && (
                    <div className="action-buttons">
                        <button onClick={onConfirmCancellationClick} className="reject-btn">
                            Confirm Cancel
                        </button>
                    </div>
                )}
            </td>
        </tr>
    );
};

export default BookingRow;