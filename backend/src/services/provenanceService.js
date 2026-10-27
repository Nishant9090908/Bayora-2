/**
 * Bayora Backend - Cryptographic Provenance Service
 * Computes deterministic SHA-256 hashes binding prompt, defense configuration,
 * outcomes, and timestamps to guarantee non-repudiation and prevent tampering.
 */
const crypto = require('crypto');

function computeProvenanceHash({ promptId, defenseId, promptText, defenseConfig, outcome, modelResponse, timestamp }) {
  const payload = JSON.stringify({
    promptId: promptId || null,
    defenseId: defenseId || null,
    prompt: (promptText || '').trim(),
    defense: typeof defenseConfig === 'string' ? defenseConfig : JSON.stringify(defenseConfig),
    outcome: outcome || 'BLOCKED',
    modelResponse: (modelResponse || '').trim(),
    timestamp: new Date(timestamp).toISOString()
  });

  return crypto.createHash('sha256').update(payload).digest('hex');
}

function verifyProvenanceHash({ promptId, defenseId, promptText, defenseConfig, outcome, modelResponse, timestamp, expectedHash }) {
  const computed = computeProvenanceHash({ promptId, defenseId, promptText, defenseConfig, outcome, modelResponse, timestamp });
  return {
    valid: computed === expectedHash,
    computedHash: computed,
    expectedHash
  };
}

module.exports = {
  computeProvenanceHash,
  verifyProvenanceHash
};
