/**
 * Bayora Backend - User Management Controller
 * Handles administrative user discovery, profile inspection, and role governance
 */
const db = require('../config/db');

/**
 * List all users (Admin only)
 */
async function listUsers(req, res, next) {
  try {
    const result = await db.query(
      `SELECT id, username, email, role, display_name, pgp_fingerprint, created_at, updated_at
       FROM users 
       ORDER BY id ASC`
    );

    res.status(200).json({
      users: result.rows
    });
  } catch (err) {
    next(err);
  }
}

/**
 * Get user by ID (Admin or self)
 */
async function getUserById(req, res, next) {
  try {
    const targetId = parseInt(req.params.id, 10);

    // Only Admin or the user themselves can view full user profile
    if (req.user.role !== 'admin' && req.user.id !== targetId) {
      return res.status(403).json({
        error: 'Access denied: cannot inspect another user profile'
      });
    }

    const result = await db.query(
      `SELECT id, username, email, role, display_name, pgp_fingerprint, created_at, updated_at
       FROM users 
       WHERE id = $1`,
      [targetId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        error: 'User not found'
      });
    }

    res.status(200).json({
      user: result.rows[0]
    });
  } catch (err) {
    next(err);
  }
}

/**
 * Update user role (Admin only)
 * Backend-enforced role modification; users cannot change roles via frontend requests
 */
async function updateUserRole(req, res, next) {
  try {
    const targetId = parseInt(req.params.id, 10);
    const { role } = req.body;

    const userCheck = await db.query('SELECT id, username, role FROM users WHERE id = $1', [targetId]);
    if (userCheck.rows.length === 0) {
      return res.status(404).json({
        error: 'Target user does not exist'
      });
    }

    const targetUser = userCheck.rows[0];

    // Update role
    const updateResult = await db.query(
      `UPDATE users 
       SET role = $1, updated_at = CURRENT_TIMESTAMP 
       WHERE id = $2 
       RETURNING id, username, email, role, display_name, updated_at`,
      [role, targetId]
    );

    res.status(200).json({
      message: `User '${targetUser.username}' clearance successfully changed to '${role}'`,
      user: updateResult.rows[0]
    });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  listUsers,
  getUserById,
  updateUserRole
};
