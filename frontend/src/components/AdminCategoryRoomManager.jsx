import React, { useState, useEffect } from 'react';
import { getToken } from '../api';
import AdminCategoryRoomList from './AdminCategoryRoomList';

export default function AdminCategoryRoomManager() {
  const deleteCategory = id => {
    fetch(`http://localhost:4000/api/categories/${id}`, {
      method: 'DELETE',
      headers: { Authorization: 'Bearer ' + getToken() }
    })
      .then(res => res.json())
      .then(data => setMsg(data.message || 'Deleted'));
  };

  const deleteRoom = id => {
    fetch(`http://localhost:4000/api/rooms/${id}`, {
      method: 'DELETE',
      headers: { Authorization: 'Bearer ' + getToken() }
    })
      .then(res => res.json())
      .then(data => setMsg(data.message || 'Deleted'));
  };

  const editCategory = (id, name) => {
    fetch(`http://localhost:4000/api/categories/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + getToken() },
      body: JSON.stringify({ name })
    })
      .then(res => res.json())
      .then(data => setMsg(data.message || 'Updated'));
  };

  const editRoom = (id, roomData) => {
    fetch(`http://localhost:4000/api/rooms/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + getToken() },
      body: JSON.stringify(roomData)
    })
      .then(res => res.json())
      .then(data => setMsg(data.message || 'Updated'));
  };
  const [categories, setCategories] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [catName, setCatName] = useState('');
  const [room, setRoom] = useState({ categoryId: '', name: '', managerName: '', managerContact: '' });
  const [msg, setMsg] = useState('');

  useEffect(() => {
    fetch('http://localhost:4000/api/categories', { headers: { Authorization: 'Bearer ' + getToken() } })
      .then(res => res.json()).then(setCategories);
    fetch('http://localhost:4000/api/rooms', { headers: { Authorization: 'Bearer ' + getToken() } })
      .then(res => res.json()).then(setRooms);
  }, [msg]);

  const addCategory = e => {
    e.preventDefault();
    fetch('http://localhost:4000/api/categories', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + getToken() },
      body: JSON.stringify({ name: catName })
    })
      .then(res => res.json())
      .then(data => setMsg(data.id ? 'Category added!' : data.message || 'Error'));
  };

  const addRoom = e => {
    e.preventDefault();
    fetch('http://localhost:4000/api/rooms', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + getToken() },
      body: JSON.stringify(room)
    })
      .then(res => res.json())
      .then(data => setMsg(data.id ? 'Room added!' : data.message || 'Error'));
  };

  return (
    <div>
      <h4>Manage Categories</h4>
      <form onSubmit={addCategory} style={{marginBottom:8}}>
        <input value={catName} onChange={e => setCatName(e.target.value)} placeholder="Category name" required />
        <button type="submit">Add Category</button>
      </form>
      <AdminCategoryRoomList
        categories={categories}
        rooms={rooms}
        onDeleteCategory={deleteCategory}
        onDeleteRoom={deleteRoom}
        onEditCategory={editCategory}
        onEditRoom={editRoom}
      />
      <h4>Manage Rooms</h4>
      <form onSubmit={addRoom} style={{marginBottom:8}}>
        <select name="categoryId" value={room.categoryId} onChange={e => setRoom({ ...room, categoryId: e.target.value })} required>
          <option value="">Select Category</option>
          {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
        <input name="name" value={room.name} onChange={e => setRoom({ ...room, name: e.target.value })} placeholder="Room name" required />
        <input name="managerName" value={room.managerName} onChange={e => setRoom({ ...room, managerName: e.target.value })} placeholder="Manager name" />
        <input name="managerContact" value={room.managerContact} onChange={e => setRoom({ ...room, managerContact: e.target.value })} placeholder="Manager contact" />
        <button type="submit">Add Room</button>
      </form>
      {msg && <div style={{color:'green'}}>{msg}</div>}
    </div>
  );
}
