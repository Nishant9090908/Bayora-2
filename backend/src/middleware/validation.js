/**
 * Bayora Backend - Request Validation Middleware
 * Validates all incoming payloads before processing by business controllers
 */

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const USERNAME_REGEX = /^[a-zA-Z0-9_]{3,30}$/;
const ALLOWED_SEVERITIES = ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'];

function validateRegister(req, res, next) {
  const { username, email, password, role, displayName, pgpFingerprint } = req.body;

  if (!username || typeof username !== 'string' || !USERNAME_REGEX.test(username)) {
    return res.status(400).json({
      error: 'Username must be 3-30 alphanumeric characters or underscores'
    });
  }

  if (!email || typeof email !== 'string' || !EMAIL_REGEX.test(email)) {
    return res.status(400).json({
      error: 'A valid email address is required'
    });
  }

  if (!password || typeof password !== 'string' || password.length < 8) {
    return res.status(400).json({
      error: 'Password must be at least 8 characters long'
    });
  }

  // Security Rule: Public registration cannot self-grant 'admin' role
  if (role && role === 'admin') {
    return res.status(400).json({
      error: 'Admin role cannot be self-assigned via registration'
    });
  }

  if (role && !['red_team', 'blue_team'].includes(role)) {
    return res.status(400).json({
      error: 'Role must be either red_team or blue_team'
    });
  }

  next();
}

function validateLogin(req, res, next) {
  const { username, password } = req.body;

  if (!username || typeof username !== 'string' || !password || typeof password !== 'string') {
    return res.status(400).json({
      error: 'Username and password are required'
    });
  }

  next();
}

function validatePrompt(req, res, next) {
  const { title, category, severity, promptText } = req.body;

  if (!title || typeof title !== 'string' || title.trim().length < 3) {
    return res.status(400).json({
      error: 'Title is required (minimum 3 characters)'
    });
  }

  if (!category || typeof category !== 'string' || category.trim().length < 2) {
    return res.status(400).json({
      error: 'Category is required'
    });
  }

  if (!severity || !ALLOWED_SEVERITIES.includes(severity.toUpperCase())) {
    return res.status(400).json({
      error: `Severity must be one of: ${ALLOWED_SEVERITIES.join(', ')}`
    });
  }

  if (!promptText || typeof promptText !== 'string' || promptText.trim().length < 5) {
    return res.status(400).json({
      error: 'Prompt text is required (minimum 5 characters)'
    });
  }

  next();
}

function validateDefense(req, res, next) {
  const { name, strictness, systemPrompt, bannedKeywords, regexRules, safetyThreshold } = req.body;

  if (!name || typeof name !== 'string' || name.trim().length < 3) {
    return res.status(400).json({
      error: 'Defense name is required (minimum 3 characters)'
    });
  }

  if (!strictness || typeof strictness !== 'string') {
    return res.status(400).json({
      error: 'Strictness level is required'
    });
  }

  if (!systemPrompt || typeof systemPrompt !== 'string' || systemPrompt.trim().length < 5) {
    return res.status(400).json({
      error: 'System prompt instructions are required (minimum 5 characters)'
    });
  }

  if (bannedKeywords && !Array.isArray(bannedKeywords)) {
    return res.status(400).json({
      error: 'bannedKeywords must be an array of strings'
    });
  }

  if (regexRules && !Array.isArray(regexRules)) {
    return res.status(400).json({
      error: 'regexRules must be an array of regex strings'
    });
  }

  if (safetyThreshold !== undefined && (typeof safetyThreshold !== 'number' || safetyThreshold < 0 || safetyThreshold > 1)) {
    return res.status(400).json({
      error: 'safetyThreshold must be a number between 0.0 and 1.0'
    });
  }

  next();
}

function validateRoleUpdate(req, res, next) {
  const { role } = req.body;

  if (!role || !['red_team', 'blue_team', 'admin'].includes(role)) {
    return res.status(400).json({
      error: 'Valid role required: red_team, blue_team, or admin'
    });
  }

  next();
}

module.exports = {
  validateRegister,
  validateLogin,
  validatePrompt,
  validateDefense,
  validateRoleUpdate
};
