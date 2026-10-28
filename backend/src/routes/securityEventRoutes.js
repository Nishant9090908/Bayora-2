/**
 * Bayora Backend - Security Events & Intrusion Routes
 */
const express = require('express');
const router = express.Router();
const securityEventController = require('../controllers/securityEventController');
const { authenticate } = require('../middleware/auth');
const { requireRole } = require('../middleware/rbac');

// Admin only: list all intrusion attempts and security violation logs
router.get('/', authenticate, requireRole('admin'), securityEventController.listSecurityEvents);

// Simulate an unauthorized cross-team breach attempt for live testing
router.post('/simulate', authenticate, securityEventController.simulateBreach);
router.post('/simulate-breach', authenticate, securityEventController.simulateBreach);

module.exports = router;
