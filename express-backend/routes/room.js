// express-backend/routes/room.js
const express = require('express');
const router = express.Router();
const roomController = require('../controllers/roomController');
const { authenticateToken, authorizeRoles } = require('../middleware/auth');

router.get('/', authenticateToken, roomController.getAll);
router.get('/available', authenticateToken, authorizeRoles('admin'), roomController.getAvailableRoomsForBooking);
// router.get('/occupancy', ...); // <-- DELETE THIS LINE
router.post('/', authenticateToken, authorizeRoles('admin'), roomController.create);
router.put('/:id', authenticateToken, authorizeRoles('admin'), roomController.update);
router.delete('/:id', authenticateToken, authorizeRoles('admin'), roomController.delete);
router.get('/manager/:categoryId', authenticateToken, roomController.getManagerForCategory);
module.exports = router;