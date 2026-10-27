/**
 * Bayora Backend - Red Team Controller
 * Manages offensive attack prompts and adversarial scenarios.
 * Strict owner-scoping guarantees Blue Team cannot query this repository.
 */
const db = require('../config/db');

/**
 * Submit a new adversarial attack prompt
 */
async function createPrompt(req, res, next) {
  try {
    const { title, category, severity, promptText, targetModel } = req.body;
    const promptId = `ATK-${Date.now().toString().slice(-4)}`;

    const result = await db.query(
      `INSERT INTO attack_prompts 
       (id, owner_id, title, category, severity, prompt_text, target_model, status)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
       RETURNING *`,
      [
        promptId,
        req.user.id,
        title,
        category,
        severity.toUpperCase(),
        promptText,
        targetModel || 'Client LLM (GPT-4o-mini Mediated)',
        'SUBMITTED'
      ]
    );

    res.status(201).json({
      message: 'Adversarial scenario successfully registered in Red repository',
      prompt: result.rows[0]
    });
  } catch (err) {
    next(err);
  }
}

/**
 * List attack prompts (strictly owner-scoped for Red Team)
 */
async function listPrompts(req, res, next) {
  try {
    let result;
    if (req.user.role === 'admin') {
      result = await db.query('SELECT * FROM attack_prompts ORDER BY created_at DESC');
    } else {
      result = await db.query(
        'SELECT * FROM attack_prompts WHERE owner_id = $1 ORDER BY created_at DESC',
        [req.user.id]
      );
    }

    res.status(200).json({
      prompts: result.rows
    });
  } catch (err) {
    next(err);
  }
}

/**
 * Get attack prompt by ID (strictly owner-scoped)
 */
async function getPromptById(req, res, next) {
  try {
    const { id } = req.params;

    const result = await db.query('SELECT * FROM attack_prompts WHERE id = $1', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Attack prompt not found' });
    }

    const prompt = result.rows[0];

    // Ownership check for non-admin Red Team users
    if (req.user.role !== 'admin' && prompt.owner_id !== req.user.id) {
      return res.status(403).json({ error: 'Access denied: not authorized to view this prompt' });
    }

    res.status(200).json({ prompt });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  createPrompt,
  listPrompts,
  getPromptById
};
