/**
 * Bayora Backend - Security Trap Service
 * Captures and persists security violations, intrusion attempts, and access anomalies.
 */
const db = require('../config/db');

async function recordSecurityEvent({
  eventType,
  severity = 'HIGH',
  actor = 'unknown',
  actorRole = 'unauthenticated',
  sourceIp = '127.0.0.1',
  targetPath,
  method,
  actionTaken,
  details = ''
}) {
  const eventId = `SEC-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

  try {
    await db.query(
      `INSERT INTO security_events 
       (id, timestamp, event_type, severity, actor, actor_role, source_ip, target_path, method, action_taken, details)
       VALUES ($1, CURRENT_TIMESTAMP, $2, $3, $4, $5, $6, $7, $8, $9, $10)`,
      [
        eventId,
        eventType,
        severity,
        actor,
        actorRole,
        sourceIp,
        targetPath,
        method,
        actionTaken,
        details
      ]
    );
  } catch (err) {
    console.error('[SecurityTrap] Failed to write security event:', err.message);
  }

  return eventId;
}

module.exports = {
  recordSecurityEvent
};
