/**
 * Bayora Backend - Red Team Routes
 * Strictly protected: only users with role 'red_team' or 'admin' can access.
 * Blue Team requests will be rejected with HTTP 403 Forbidden and logged as security violations.
 */
const express = require('express');
const router = express.Router();
const redTeamController = require('../controllers/redTeamController');
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
