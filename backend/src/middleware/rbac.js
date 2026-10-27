/**
 * Bayora Backend - Role-Based Access Control (RBAC) Middleware
 * Server-side role enforcement preventing privilege escalation and cross-team snooping
 */
const { recordSecurityEvent } = require('../services/securityTrapService');

function requireRole(...allowedRoles) {
  return async (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    const userRole = req.user.role;
    const sourceIp = req.ip || req.connection.remoteAddress || '127.0.0.1';

    // Check if role is authorized
    if (!allowedRoles.includes(userRole)) {
      await recordSecurityEvent({
        eventType: 'UNAUTHORIZED_ROLE_ACCESS_ATTEMPT',
        severity: 'CRITICAL',
        actor: req.user.username,
        actorRole: userRole,
        sourceIp,
        targetPath: req.originalUrl,
        method: req.method,
        actionTaken: 'BLOCKED (HTTP 403 Forbidden)',
        details: `Actor with role '${userRole}' attempted unauthorized access to restricted endpoint requiring: [${allowedRoles.join(', ')}].`
      });

      return res.status(403).json({
        error: 'Access denied: insufficient permissions'
      });
    }

    next();
  };
}

module.exports = {
  requireRole
};
