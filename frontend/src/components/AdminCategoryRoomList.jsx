import React, { useState } from 'react';
import { List, ListItem, ListItemText, IconButton, TextField, Stack, Typography, Divider } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';

export default function AdminCategoryRoomList({ categories, rooms, onDeleteCategory, onDeleteRoom, onEditCategory, onEditRoom }) {
  const [editCatId, setEditCatId] = useState(null);
  const [editCatName, setEditCatName] = useState('');
  const [editRoomId, setEditRoomId] = useState(null);
  const [editRoom, setEditRoom] = useState({ name: '', categoryId: '', managerName: '', managerContact: '' });

  return (
    <div>
      <Typography variant="subtitle1" sx={{ mt: 2 }}>Categories</Typography>
      <List dense>
        {categories.map(c => (
          <ListItem key={c.id} secondaryAction={
            editCatId === c.id ? (
              <>
                <IconButton edge="end" onClick={() => { onEditCategory(c.id, editCatName); setEditCatId(null); }}><SaveIcon /></IconButton>
                <IconButton edge="end" onClick={() => setEditCatId(null)}><CancelIcon /></IconButton>
              </>
            ) : (
              <>
                <IconButton edge="end" onClick={() => { setEditCatId(c.id); setEditCatName(c.name); }}><EditIcon /></IconButton>
                <IconButton edge="end" onClick={() => onDeleteCategory(c.id)}><DeleteIcon /></IconButton>
              </>
            )
          }>
            {editCatId === c.id ? (
              <TextField value={editCatName} onChange={e => setEditCatName(e.target.value)} size="small" sx={{ mr: 2 }} />
            ) : (
              <ListItemText primary={c.name} />
            )}
          </ListItem>
        ))}
      </List>
      <Divider sx={{ my: 2 }} />
      <Typography variant="subtitle1">Rooms</Typography>
      <List dense>
        {rooms.map(r => (
          <ListItem key={r.id} secondaryAction={
            editRoomId === r.id ? (
              <>
                <IconButton edge="end" onClick={() => { onEditRoom(r.id, editRoom); setEditRoomId(null); }}><SaveIcon /></IconButton>
                <IconButton edge="end" onClick={() => setEditRoomId(null)}><CancelIcon /></IconButton>
              </>
            ) : (
              <>
                <IconButton edge="end" onClick={() => { setEditRoomId(r.id); setEditRoom({ name: r.name, categoryId: r.categoryId, managerName: r.managerName || '', managerContact: r.managerContact || '' }); }}><EditIcon /></IconButton>
                <IconButton edge="end" onClick={() => onDeleteRoom(r.id)}><DeleteIcon /></IconButton>
              </>
            )
          }>
            {editRoomId === r.id ? (
              <Stack direction="row" spacing={1} sx={{ width: '100%' }}>
                <TextField value={editRoom.name} onChange={e => setEditRoom({ ...editRoom, name: e.target.value })} size="small" label="Name" />
                <TextField value={editRoom.categoryId} onChange={e => setEditRoom({ ...editRoom, categoryId: e.target.value })} size="small" label="CategoryId" />
                <TextField value={editRoom.managerName} onChange={e => setEditRoom({ ...editRoom, managerName: e.target.value })} size="small" label="Manager Name" />
                <TextField value={editRoom.managerContact} onChange={e => setEditRoom({ ...editRoom, managerContact: e.target.value })} size="small" label="Manager Contact" />
              </Stack>
            ) : (
              <ListItemText primary={`${r.name} (Category ${r.categoryId})`} />
            )}
          </ListItem>
        ))}
      </List>
    </div>
  );
}
