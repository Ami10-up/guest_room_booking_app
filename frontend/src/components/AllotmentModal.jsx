// src/components/AllotmentModal.jsx

import React, { useState, useEffect } from 'react';
import apiClient from '../apiConfig';

const AllotmentModal = ({ booking, allCategories, onApprove, onCancel }) => {
    // State to track the currently selected category for allotment
    const [selectedCategoryId, setSelectedCategoryId] = useState(booking.guestRoomCategoryId);
    const [availableRooms, setAvailableRooms] = useState([]);
    const [selectedRooms, setSelectedRooms] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');

    // Filter categories to only those matching the booking's rank
    const relevantCategories = allCategories.filter(c => c.allowedRank === booking.rank);

    useEffect(() => {
        const fetchAvailableRooms = async () => {
            // Can't fetch if no category is selected
            if (!booking || !selectedCategoryId) {
                setAvailableRooms([]);
                setIsLoading(false);
                return;
            }

            setIsLoading(true);
            setError('');
            try {
                const config = { 
                    params: {
                        categoryId: selectedCategoryId,
                        dateFrom: booking.dateFrom,
                        dateTo: booking.dateTo,
                    }
                };
                const response = await apiClient.get('/rooms/available', config);
                setAvailableRooms(response.data);
            } catch (err) {
                console.error("Failed to fetch available rooms:", err);
                setError("Could not load available rooms for this category.");
            } finally {
                setIsLoading(false);
            }
        };
        fetchAvailableRooms();
    }, [booking, selectedCategoryId]); // Re-fetches rooms when the selected category changes

    const handleCategoryChange = (e) => {
        // Convert the string value from the dropdown to a number
        setSelectedCategoryId(Number(e.target.value));
        // Reset room selection when the category changes
        setSelectedRooms([]);
    };

    const handleRoomSelection = (roomName) => {
        const isSelected = selectedRooms.includes(roomName);
        let newSelection = isSelected
            ? selectedRooms.filter(name => name !== roomName)
            : [...selectedRooms, roomName];

        if (newSelection.length > booking.numRooms) {
            alert(`You can only select up to ${booking.numRooms} room(s).`);
            return;
        }
        setSelectedRooms(newSelection);
    };

    const handleApproveClick = () => {
        if (selectedRooms.length > 0) {
            onApprove(booking.id, 'approved', selectedRooms, selectedCategoryId);
        }
    };

    const canApprove = selectedRooms.length === booking.numRooms;
    if (!booking) return null;

    return (
        <div className="modal-backdrop">
            <div className="modal-content">
                <h3>Approve Booking #{booking.id}</h3>
                <p><strong>Guest:</strong> {booking.name} ({booking.rank})</p>
                <p><strong>Dates:</strong> {booking.dateFrom} to {booking.dateTo}</p>
                <p><strong>Rooms Requested:</strong> {booking.numRooms}</p>
                <hr/>

                <div className="input-group">
                    <label htmlFor="category-select">Allot Guest House</label>
                    <select
                        id="category-select"
                        value={selectedCategoryId}
                        onChange={handleCategoryChange}
                        className="room-select"
                    >
                        {/* It's good practice to ensure the originally requested category is an option */}
                        {relevantCategories.map(cat => (
                            <option key={cat.id} value={cat.id}>{cat.name}</option>
                        ))}
                    </select>
                </div>

                <p>Please select <strong>{booking.numRooms}</strong> available room(s):</p>
                {isLoading && <p>Loading available rooms...</p>}
                {error && <p className="error-message">{error}</p>}
                
                {!isLoading && !error && (
                    <div className="room-checkbox-grid">
                        {availableRooms.length > 0 ? (
                            availableRooms.map(room => (
                                <div key={room.id} className="checkbox-item">
                                    <input 
                                        type="checkbox"
                                        id={`room-${room.id}`}
                                        value={room.name}
                                        checked={selectedRooms.includes(room.name)}
                                        onChange={() => handleRoomSelection(room.name)}
                                    />
                                    <label htmlFor={`room-${room.id}`}>{room.name}</label>
                                </div>
                            ))
                        ) : ( <p>No rooms are available in this guest house for the selected dates.</p> )}
                    </div>
                )}
                
                <div className="modal-actions">
                    <button type="button" onClick={onCancel} className="cancel-btn">Cancel</button>
                    <button onClick={handleApproveClick} disabled={!canApprove || isLoading} className="approve-btn">
                        Confirm & Approve ({selectedRooms.length}/{booking.numRooms})
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AllotmentModal;