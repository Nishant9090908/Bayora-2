/**
 * Bayora Backend - Blue Team Controller
 * Manages defensive guardrails, system prompts, and regex classifier rules.
 * Strict owner-scoping guarantees Red Team cannot query this repository.
 */
const db = require('../config/db');

/**
 * Submit a new defensive configuration
 */
async function createDefense(req, res, next) {
  try {
    const {
      name,
      strictness,
      systemPrompt,
      bannedKeywords = [],
      regexRules = [],
      safetyThreshold = 0.85
    } = req.body;

    const defenseId = `DEF-${Date.now().toString().slice(-4)}`;

    const result = await db.query(
      `INSERT INTO defense_configs 
       (id, owner_id, name, strictness, system_prompt, banned_keywords, regex_rules, safety_threshold, active_status)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
       RETURNING *`,
      [
        defenseId,
        req.user.id,
        name,
        strictness,
        systemPrompt,
        JSON.stringify(bannedKeywords),
        JSON.stringify(regexRules),
        safetyThreshold,
        'ACTIVE'
      ]
    );

    res.status(201).json({
      message: 'Defensive strategy successfully registered in Blue repository',
      defense: result.rows[0]
    });
  } catch (err) {
    next(err);
  }
}

/**
 * List defensive configurations (strictly owner-scoped for Blue Team)
 */
async function listDefenses(req, res, next) {
  try {
    let result;
    if (req.user.role === 'admin') {
      result = await db.query('SELECT * FROM defense_configs ORDER BY created_at DESC');
    } else {
      result = await db.query(
        'SELECT * FROM defense_configs WHERE owner_id = $1 ORDER BY created_at DESC',
        [req.user.id]
      );
    }

    res.status(200).json({
      defenses: result.rows
    });
  } catch (err) {
    next(err);
  }
}

/**
 * Get defensive configuration by ID (strictly owner-scoped)
 */
async function getDefenseById(req, res, next) {
  try {
    const { id } = req.params;

    const result = await db.query('SELECT * FROM defense_configs WHERE id = $1', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Defense configuration not found' });
    }

    const defense = result.rows[0];

    // Ownership check for non-admin Blue Team users
    if (req.user.role !== 'admin' && defense.owner_id !== req.user.id) {
      return res.status(403).json({ error: 'Access denied: not authorized to view this defense configuration' });
    }

    res.status(200).json({ defense });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  createDefense,
  listDefenses,
  getDefenseById
};
