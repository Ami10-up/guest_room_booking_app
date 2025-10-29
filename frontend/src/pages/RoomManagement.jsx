// src/pages/RoomManagement.jsx

import React, { useState, useEffect } from 'react';
import apiClient from '../apiConfig';
import RoomFormModal from '../components/RoomFormModal';

const RoomManagement = () => {
    const [rooms, setRooms] = useState([]);
    const [categories, setCategories] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingRoom, setEditingRoom] = useState(null);

    const fetchData = async () => {
        setIsLoading(true);
        try {
            const [roomsRes, categoriesRes] = await Promise.all([
                apiClient.get('/rooms'),
                apiClient.get('/categories')
            ]);
            setRooms(roomsRes.data);
            setCategories(categoriesRes.data);
        } catch (err) {
            console.error("Fetch data error:", err);
            setError('Failed to fetch room data.');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleSaveRoom = async (roomData) => {
        try {
            if (roomData.id) {
                await apiClient.put(`/rooms/${roomData.id}`, roomData);
            } else {
                await apiClient.post('/rooms', roomData);
            }
            closeModal();
            fetchData(); // Refresh list after saving
        } catch (err) {
            console.error("Failed to save room:", err.response ? err.response.data : err.message);
            setError("Failed to save room. Please try again.");
        }
    };

    const handleDeleteRoom = async (roomId) => {
        if (window.confirm('Are you sure you want to delete this room? This cannot be undone.')) {
            try {
                await apiClient.delete(`/rooms/${roomId}`);
                fetchData(); // Refresh list after deleting
            } catch (err) {
                console.error("Failed to delete room:", err.response ? err.response.data : err.message);
                setError("Failed to delete room. Please try again.");
            }
        }
    };

    const openModal = (room = null) => {
        setEditingRoom(room);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setEditingRoom(null);
    };

    if (isLoading) return <p>Loading room data...</p>;
    if (error) return <p className="error-message">{error}</p>;

    return (
        <div>
            <div className="page-header">
                <h2>Manage Rooms</h2>
                <button onClick={() => openModal()} className="add-new-btn">Add New Room</button>
            </div>
            <p>Here you can add, edit, or delete individual rooms within each category.</p>
            <table className="management-table">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Room Name</th>
                        <th>Category</th>
                        <th>Manager Name</th>
                        <th>Manager Contact</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {rooms.map(room => (
                        <tr key={room.id}>
                            <td>{room.id}</td>
                            <td>{room.name}</td>
                            <td>{room.categoryName}</td>
                            <td>{room.managerName || 'N/A'}</td>
                            <td>{room.managerContact || 'N/A'}</td>
                            <td>
                                {/* --- THIS IS THE UI FOR THE EDIT/DELETE BUTTONS --- */}
                                <div className="action-buttons">
                                    <button onClick={() => openModal(room)} className="edit-btn">Edit</button>
                                    <button onClick={() => handleDeleteRoom(room.id)} className="reject-btn">Delete</button>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {isModalOpen && (
                <RoomFormModal 
                    room={editingRoom}
                    categories={categories}
                    onSave={handleSaveRoom}
                    onCancel={closeModal}
                />
            )}
        </div>
    );
};

export default RoomManagement;