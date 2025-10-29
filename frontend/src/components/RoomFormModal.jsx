// src/components/RoomFormModal.jsx

import React, { useState } from 'react';

const RoomFormModal = ({ room, categories, onSave, onCancel }) => {
    // State is initialized based on whether we are editing or creating
    const [name, setName] = useState(room ? room.name : '');
    const [categoryId, setCategoryId] = useState(room ? room.categoryId : '');
    const [managerName, setManagerName] = useState(room ? room.managerName : '');
    const [managerContact, setManagerContact] = useState(room ? room.managerContact : '');

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave({
            id: room ? room.id : null,
            name,
            categoryId,
            managerName,
            managerContact,
        });
    };

    return (
        <div className="modal-backdrop">
            <div className="modal-content">
                <h3>{room ? 'Edit Room' : 'Add New Room'}</h3>
                <form onSubmit={handleSubmit}>
                    <div className="input-group">
                        <label htmlFor="category">Category</label>
                        <select
                            id="category"
                            value={categoryId}
                            // --- FIX: Add the onChange handler ---
                            onChange={(e) => setCategoryId(e.target.value)}
                            required
                        >
                            <option value="" disabled>-- Select a Category --</option>
                            {categories.map(cat => (
                                <option key={cat.id} value={cat.id}>{cat.name}</option>
                            ))}
                        </select>
                    </div>
                    <div className="input-group">
                        <label htmlFor="name">Room Name / Number</label>
                        <input
                            type="text"
                            id="name"
                            value={name}
                            // --- FIX: Add the onChange handler ---
                            onChange={(e) => setName(e.target.value)}
                            required
                        />
                    </div>
                     <div className="input-group">
                        <label htmlFor="managerName">Manager Name</label>
                        <input
                            type="text"
                            id="managerName"
                            value={managerName}
                            // --- FIX: Add the onChange handler ---
                            onChange={(e) => setManagerName(e.target.value)}
                        />
                    </div>
                     <div className="input-group">
                        <label htmlFor="managerContact">Manager Contact</label>
                        <input
                            type="text"
                            id="managerContact"
                            value={managerContact}
                            // --- FIX: Add the onChange handler ---
                            onChange={(e) => setManagerContact(e.target.value)}
                        />
                    </div>
                    <div className="modal-actions">
                        <button type="button" onClick={onCancel} className="cancel-btn">Cancel</button>
                        <button type="submit" className="approve-btn">Save Room</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default RoomFormModal;