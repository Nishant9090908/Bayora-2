/**
 * Bayora Backend - User Management Routes (Admin Domain)
 */
const express = require('express');
const router = express.Router();
const userController = require('./userController');
const { authenticate } = require('../middleware/auth');
const { requireRole } = require('../middleware/rbac');
const { validateRoleUpdate } = require('../middleware/validation');

// Admin only: list all platform researchers
router.get('/', authenticate, requireRole('admin'), userController.listUsers);

// Inspect user profile (admin or owner)
router.get('/:id', authenticate, userController.getUserById);

// Admin only: assign or update user clearance role
router.patch('/:id/role', authenticate, requireRole('admin'), validateRoleUpdate, userController.updateUserRole);

module.exports = router;
