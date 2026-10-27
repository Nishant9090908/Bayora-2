/**
 * Bayora Backend - Evaluation Records Routes
 * Accessible to authenticated researchers with role-sanitized view projections.
 */
const express = require('express');
const router = express.Router();
const evaluationController = require('../controllers/evaluationController');
const { authenticate } = require('../middleware/auth');
const { requireRole } = require('../middleware/rbac');

// Create/commit evaluation run with cryptographic provenance
router.post('/', authenticate, evaluationController.createEvaluation);

// List evaluations (projected according to caller's clearance)
router.get('/', authenticate, evaluationController.listEvaluations);

// Engine telemetry & Ollama health status
router.get('/engine/status', authenticate, evaluationController.getEngineStatus);

// Get evaluation run details by ID (projected according to caller's clearance)
router.get('/:id', authenticate, evaluationController.getEvaluationById);

// Verify cryptographic provenance hash against stored digest (Admin only)
router.get('/:id/verify', authenticate, requireRole('admin'), evaluationController.verifyEvaluationProvenance);

module.exports = router;
