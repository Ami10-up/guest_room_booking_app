// src/pages/CategoryManagement.jsx

import React, { useState, useEffect } from 'react';
import apiClient from '../apiConfig';
import CategoryFormModal from '../components/CategoryFormModal';

const CategoryManagement = () => {
    const [categories, setCategories] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingCategory, setEditingCategory] = useState(null);

    const fetchData = async () => {
        
        try {
            const response = await apiClient.get('/categories');
            setCategories(response.data);
        } catch (err) {
            console.error("Fetch categories error:", err);
            setError('Failed to fetch categories.');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleSaveCategory = async (categoryData) => {
        try {
            if (categoryData.id) {
                // This is an update (PUT request)
                await apiClient.put(`/categories/${categoryData.id}`, categoryData);
            } else {
                // This is a create (POST request)
                await apiClient.post('/categories', categoryData);
            }
            closeModal();
            fetchData(); // Refresh the list after saving
        } catch (err) {
            console.error("Failed to save category:", err.response ? err.response.data : err.message);
            setError("Failed to save category. Please try again.");
        }
    };

    const handleDeleteCategory = async (categoryId) => {
        if (window.confirm('Are you sure you want to delete this category? This cannot be undone.')) {
            try {
                await apiClient.delete(`/categories/${categoryId}`);
                fetchData(); // Refresh the list after deleting
            } catch (err) {
                console.error("Failed to delete category:", err.response ? err.response.data : err.message);
                setError("Failed to delete category. Please try again.");
            }
        }
    };

    const openModal = (category = null) => {
        setEditingCategory(category);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setEditingCategory(null);
    };

    if (isLoading) return <p>Loading categories...</p>;
    if (error) return <p className="error-message">{error}</p>;

    return (
        <div>
            <div className="page-header">
                <h2>Manage Guest House Categories</h2>
                <button onClick={() => openModal()} className="add-new-btn">Add New Category</button>
            </div>
            <p>Here you can add, rename, or delete the main guest house categories.</p>
            <table className="management-table">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Category Name</th>
                        <th>Location</th>
                        <th>Allowed Rank</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {categories.map(category => (
                        <tr key={category.id}>
                            <td>{category.id}</td>
                            <td>{category.name}</td>
                            <td>{category.locationUrl ? (<a href={category.locationUrl} target="_blank" rel="noreferrer">Open</a>) : 'N/A'}</td>
                            <td>{category.allowedRank}</td>
                            <td>
                                <div className="action-buttons">
                                    <button onClick={() => openModal(category)} className="edit-btn">Edit</button>
                                    <button onClick={() => handleDeleteCategory(category.id)} className="reject-btn">Delete</button>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            {isModalOpen && (
                <CategoryFormModal
                    category={editingCategory}
                    onSave={handleSaveCategory}
                    onCancel={closeModal}
                />
            )}
        </div>
    );
};

export default CategoryManagement;