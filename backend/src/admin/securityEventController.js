/**
 * Bayora Backend - Security Events Controller (Admin / Auditor Domain)
 * Provides audit stream inspection for Auditors and interactive breach simulation
 */
const db = require('../config/db');
const { recordSecurityEvent } = require('../services/securityTrapService');

/**
 * List all logged security events (Admin/Auditor only)
 */
async function listSecurityEvents(req, res, next) {
  try {
    const result = await db.query(
      `SELECT id, timestamp, event_type, severity, actor, actor_role, source_ip, target_path, method, action_taken, details
       FROM security_events
       ORDER BY timestamp DESC
       LIMIT 100`
    );

    res.status(200).json({
      events: result.rows
    });
  } catch (err) {
    next(err);
  }
}

/**
 * Simulate an unauthorized cross-team breach attempt
 * (e.g. Red Team actor attempting to directly extract Blue Team confidential defense rules)
 */
async function simulateBreach(req, res, next) {
  try {
    const actor = req.user ? req.user.username : 'simulated_adversary';
    const actorRole = req.user ? req.user.role : 'red_team';
    const sourceIp = req.ip || '10.0.12.44';

    const eventId = await recordSecurityEvent({
      eventType: 'UNAUTHORIZED_CROSS_TENANT_BREACH_SIMULATION',
      severity: 'CRITICAL',
      actor,
      actorRole,
      sourceIp,
      targetPath: '/api/blue/defenses/DEF-201/confidential-rules',
      method: 'GET',
      actionTaken: 'BLOCKED (HTTP 403 Forbidden)',
      details: 'Cross-tenant breach simulation: Opposing team attempted unauthorized extraction of confidential defense rules.'
    });

    res.status(403).json({
      error: 'Access denied: unauthorized cross-team data access attempt',
      simulation: {
        status: 'TRAPPED',
        eventId,
        actionTaken: 'BLOCKED (HTTP 403 Forbidden)',
        details: 'Intrusion trap triggered. Violation permanently committed to append-only security log.'
      }
    });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  listSecurityEvents,
  simulateBreach
};
