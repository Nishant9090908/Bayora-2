/**
 * Bayora Backend - Blue Team Routes (Dedicated Blue Team Domain)
 * Protected by RBAC: only 'blue_team' or 'admin' allowed.
 */
const express = require('express');
const router = express.Router();
const blueTeamController = require('./blueTeamController');
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
