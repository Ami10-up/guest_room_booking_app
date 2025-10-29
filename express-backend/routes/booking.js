const express = require('express');
const router = express.Router();
const bookingController = require('../controllers/bookingController');
const { authenticateToken, authorizeRoles } = require('../middleware/auth');

router.get('/', authenticateToken, bookingController.getAll);
router.post('/', authenticateToken, bookingController.create);
router.put('/:id/cancel', authenticateToken, bookingController.cancelBooking);

router.put('/:id/status', authenticateToken, authorizeRoles('admin'), bookingController.updateStatus);
router.delete('/:id', authenticateToken, authorizeRoles('admin'), bookingController.delete);
router.get('/vacancy', authenticateToken, bookingController.checkVacancy);
router.get('/occupancy-range', authenticateToken, authorizeRoles('admin'), bookingController.getOccupancyByDateRange);
module.exports = router;