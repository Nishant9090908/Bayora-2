/**
 * Bayora Backend - Authentication Middleware
 * Validates cryptographically signed JWTs and verifies user identity
 */
const jwt = require('jsonwebtoken');
const config = require('../config/env');
const db = require('../config/db');
const { recordSecurityEvent } = require('../services/securityTrapService');

async function authenticate(req, res, next) {
  const authHeader = req.headers.authorization;
  const sourceIp = req.ip || req.connection.remoteAddress || '127.0.0.1';

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    await recordSecurityEvent({
      eventType: 'UNAUTHENTICATED_ACCESS_ATTEMPT',
      severity: 'MEDIUM',
      actor: 'unauthenticated',
      actorRole: 'unauthenticated',
      sourceIp,
      targetPath: req.originalUrl,
      method: req.method,
      actionTaken: 'REJECTED (HTTP 401)',
      details: 'Missing or malformed Authorization header.'
    });

    return res.status(401).json({
      error: 'Authentication token required'
    });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, config.JWT_SECRET);

    // Verify user exists in database
    const result = await db.query(
      'SELECT id, username, email, role, display_name FROM users WHERE id = $1',
      [decoded.userId]
    );

    if (result.rows.length === 0) {
      await recordSecurityEvent({
        eventType: 'UNKNOWN_USER_TOKEN',
        severity: 'HIGH',
        actor: `user_id:${decoded.userId}`,
        actorRole: 'unknown',
        sourceIp,
        targetPath: req.originalUrl,
        method: req.method,
        actionTaken: 'REJECTED (HTTP 401)',
        details: 'Valid token signature but user does not exist in database.'
      });

      return res.status(401).json({
        error: 'Invalid authentication session'
      });
    }

    req.user = result.rows[0];
    next();
  } catch (err) {
    const isExpired = err.name === 'TokenExpiredError';
    
    await recordSecurityEvent({
      eventType: isExpired ? 'EXPIRED_TOKEN_ATTEMPT' : 'INVALID_TOKEN_SIGNATURE',
      severity: isExpired ? 'LOW' : 'HIGH',
      actor: 'unknown',
      actorRole: 'unauthenticated',
      sourceIp,
      targetPath: req.originalUrl,
      method: req.method,
      actionTaken: 'REJECTED (HTTP 401)',
      details: isExpired ? 'JWT expired' : 'Forged or invalid HMAC signature detected.'
    });

    return res.status(401).json({
      error: isExpired ? 'Token has expired' : 'Invalid authentication token'
    });
  }
}

module.exports = {
  authenticate
};
