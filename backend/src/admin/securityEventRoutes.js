/**
 * Bayora Backend - Security Events & Intrusion Routes (Admin / Auditor Domain)
 */
const express = require('express');
const router = express.Router();
const securityEventController = require('./securityEventController');
const { authenticate } = require('../middleware/auth');
const { requireRole } = require('../middleware/rbac');

// Admin only: list all intrusion attempts and security violation logs
router.get('/', authenticate, requireRole('admin'), securityEventController.listSecurityEvents);

// Simulate an unauthorized cross-team breach attempt for live testing
router.post('/simulate', authenticate, securityEventController.simulateBreach);

module.exports = router;
