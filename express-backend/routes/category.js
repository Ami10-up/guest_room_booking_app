const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/categoryController');
const { authenticateToken, authorizeRoles } = require('../middleware/auth');

router.get('/', authenticateToken, categoryController.getAll);
router.get('/:id', authenticateToken, categoryController.getById);
router.post('/', authenticateToken, authorizeRoles('admin'), categoryController.create);
router.put('/:id', authenticateToken, authorizeRoles('admin'), categoryController.update);
router.delete('/:id', authenticateToken, authorizeRoles('admin'), categoryController.delete);

module.exports = router;
