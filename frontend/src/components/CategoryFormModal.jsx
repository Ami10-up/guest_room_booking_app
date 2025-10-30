// src/components/CategoryFormModal.jsx

import React, { useState } from 'react';

const CategoryFormModal = ({ category, onSave, onCancel }) => {
    // 'category' is null for 'add', an object for 'edit'
    const [name, setName] = useState(category ? category.name : '');
    const [allowedRank, setAllowedRank] = useState(category ? category.allowedRank : 'Officer');
    const [locationUrl, setLocationUrl] = useState(category ? category.locationUrl || '' : '');

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave({
            id: category ? category.id : null, // Include ID if editing
            name,
            allowedRank,
            locationUrl: locationUrl && locationUrl.length ? locationUrl : null,
        });
    };

    return (
        <div className="modal-backdrop">
            <div className="modal-content">
                <h3>{category ? 'Edit Category' : 'Add New Category'}</h3>
                <form onSubmit={handleSubmit}>
                    <div className="input-group">
                        <label htmlFor="name">Category Name</label>
                        <input
                            type="text"
                            id="name"
                            value={name}
                            placeholder="e.g., Shayan Kaksh"
                            onChange={(e) => setName(e.target.value)}
                            required
                        />
                    </div>
                    <div className="input-group">
                        <label htmlFor="rank">Allowed Rank</label>
                        <select
                            id="rank"
                            value={allowedRank}
                            onChange={(e) => setAllowedRank(e.target.value)}
                            required
                        >
                            <option value="Officer">Officer</option>
                            <option value="JCO">JCO</option>
                            <option value="OR">OR</option>
                        </select>
                    </div>
                    <div className="input-group">
                        <label htmlFor="location">Guest Room Location (Google Maps URL)</label>
                        <input
                            type="url"
                            id="location"
                            value={locationUrl}
                            placeholder="https://maps.google.com/?q=..."
                            onChange={(e) => setLocationUrl(e.target.value)}
                        />
                    </div>
                    <div className="modal-actions">
                        <button type="button" onClick={onCancel} className="cancel-btn">Cancel</button>
                        <button type="submit" className="approve-btn">Save Category</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CategoryFormModal;