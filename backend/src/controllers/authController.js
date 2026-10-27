/**
 * Bayora Backend - Authentication Controller
 * Handles user registration, credential verification, and signed JWT issuance
 */
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../config/db');
const config = require('../config/env');
const { recordSecurityEvent } = require('../services/securityTrapService');

/**
 * Register a new user
 */
async function register(req, res, next) {
  try {
    const { username, email, password, role = 'red_team', displayName, pgpFingerprint } = req.body;
    const sourceIp = req.ip || req.connection.remoteAddress || '127.0.0.1';

    // Verify uniqueness
    const existing = await db.query(
      'SELECT id, username, email FROM users WHERE username = $1 OR email = $2',
      [username, email]
    );

    if (existing.rows.length > 0) {
      const match = existing.rows[0];
      const field = match.username === username ? 'Username' : 'Email';
      return res.status(409).json({
        error: `${field} is already registered`
      });
    }

    // Hash password with bcrypt
    const passwordHash = await bcrypt.hash(password, 10);
    const assignedRole = role === 'blue_team' ? 'blue_team' : 'red_team';

    const insertResult = await db.query(
      `INSERT INTO users (username, email, password_hash, role, display_name, pgp_fingerprint)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING id, username, email, role, display_name, created_at`,
      [username, email, passwordHash, assignedRole, displayName || username, pgpFingerprint || null]
    );

    const newUser = insertResult.rows[0];

    // Issue signed JWT
    const token = jwt.sign(
      { userId: newUser.id, username: newUser.username, role: newUser.role },
      config.JWT_SECRET,
      { expiresIn: config.JWT_EXPIRES_IN }
    );

    res.status(201).json({
      message: 'Account successfully registered and clearance assigned',
      token,
      user: {
        id: newUser.id,
        username: newUser.username,
        email: newUser.email,
        role: newUser.role,
        displayName: newUser.display_name,
        createdAt: newUser.created_at
      }
    });
  } catch (err) {
    next(err);
  }
}

/**
 * Login user and issue signed JWT
 */
async function login(req, res, next) {
  try {
    const { username, password } = req.body;
    const sourceIp = req.ip || req.connection.remoteAddress || '127.0.0.1';

    // Fetch user by username
    const result = await db.query(
      'SELECT id, username, email, password_hash, role, display_name, created_at FROM users WHERE username = $1',
      [username]
    );

    if (result.rows.length === 0) {
      await recordSecurityEvent({
        eventType: 'AUTH_FAILED_UNKNOWN_USER',
        severity: 'MEDIUM',
        actor: username,
        actorRole: 'unauthenticated',
        sourceIp,
        targetPath: req.originalUrl,
        method: req.method,
        actionTaken: 'REJECTED (HTTP 401)',
        details: `Login attempt with non-existent username: '${username}'`
      });

      return res.status(401).json({
        error: 'Invalid credentials provided'
      });
    }

    const user = result.rows[0];
    const passwordMatch = await bcrypt.compare(password, user.password_hash);

    if (!passwordMatch) {
      await recordSecurityEvent({
        eventType: 'AUTH_FAILED_CREDENTIALS',
        severity: 'MEDIUM',
        actor: username,
        actorRole: 'unauthenticated',
        sourceIp,
        targetPath: req.originalUrl,
        method: req.method,
        actionTaken: 'REJECTED (HTTP 401)',
        details: `Invalid passphrase submitted for user '${username}'`
      });

      return res.status(401).json({
        error: 'Invalid credentials provided'
      });
    }

    // Sign JWT token
    const token = jwt.sign(
      { userId: user.id, username: user.username, role: user.role },
      config.JWT_SECRET,
      { expiresIn: config.JWT_EXPIRES_IN }
    );

    res.status(200).json({
      message: 'Authentication successful',
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
        displayName: user.display_name,
        createdAt: user.created_at
      }
    });
  } catch (err) {
    next(err);
  }
}

/**
 * Get current authenticated user profile
 */
async function getCurrentUser(req, res) {
  res.status(200).json({
    user: {
      id: req.user.id,
      username: req.user.username,
      email: req.user.email,
      role: req.user.role,
      displayName: req.user.display_name
    }
  });
}

module.exports = {
  register,
  login,
  getCurrentUser
};
