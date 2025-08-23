const express = require('express');
const router = express.Router();
const roomController = require('../controllers/roomController');
const { authenticateToken, authorizeRoles } = require('../middleware/auth');

router.get('/', authenticateToken, roomController.getAll);
router.post('/', authenticateToken, authorizeRoles('admin'), roomController.create);
router.put('/:id', authenticateToken, authorizeRoles('admin'), roomController.update);
router.delete('/:id', authenticateToken, authorizeRoles('admin'), roomController.delete);

module.exports = router;
