/**
 * Bayora Backend - Red Team Routes (Dedicated Red Team Domain)
 * Protected by RBAC: only 'red_team' or 'admin' allowed.
 */
const express = require('express');
const router = express.Router();
const redTeamController = require('./redTeamController');
const { authenticate } = require('../middleware/auth');
const { requireRole } = require('../middleware/rbac');
const { validatePrompt } = require('../middleware/validation');

// Submit attack scenario
router.post('/prompts', authenticate, requireRole('red_team', 'admin'), validatePrompt, redTeamController.createPrompt);

// List owner-scoped attack scenarios
router.get('/prompts', authenticate, requireRole('red_team', 'admin'), redTeamController.listPrompts);

// Get attack scenario by ID
router.get('/prompts/:id', authenticate, requireRole('red_team', 'admin'), redTeamController.getPromptById);

module.exports = router;
