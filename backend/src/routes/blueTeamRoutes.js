/**
 * Bayora Backend - Blue Team Routes
 * Strictly protected: only users with role 'blue_team' or 'admin' can access.
 * Red Team requests will be rejected with HTTP 403 Forbidden and logged as security violations.
 */
const express = require('express');
const router = express.Router();
const blueTeamController = require('../controllers/blueTeamController');
const { authenticate } = require('../middleware/auth');
const { requireRole } = require('../middleware/rbac');
const { validateDefense } = require('../middleware/validation');

// Submit defensive guardrail configuration
router.post('/defenses', authenticate, requireRole('blue_team', 'admin'), validateDefense, blueTeamController.createDefense);

// List owner-scoped defense configurations
router.get('/defenses', authenticate, requireRole('blue_team', 'admin'), blueTeamController.listDefenses);

// Get defense configuration by ID
router.get('/defenses/:id', authenticate, requireRole('blue_team', 'admin'), blueTeamController.getDefenseById);

module.exports = router;
