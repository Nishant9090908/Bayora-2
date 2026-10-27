/**
 * Bayora Backend Test Suite - Evaluations, Cryptographic Provenance & View Projections
 */
const request = require('supertest');
const app = require('../src/app');
const db = require('../src/config/db');

let redToken = '';
let blueToken = '';
let adminToken = '';
let createdEvalId = '';

beforeAll(async () => {
  await db.initDatabase();

  const redRes = await request(app)
    .post('/api/auth/login')
    .send({ username: 'red_operator', password: 'RedOperator2026!' });
  redToken = redRes.body.token;

  const blueRes = await request(app)
    .post('/api/auth/login')
    .send({ username: 'blue_defender', password: 'BlueDefender2026!' });
  blueToken = blueRes.body.token;

  const adminRes = await request(app)
    .post('/api/auth/login')
    .send({ username: 'compliance_auditor', password: 'AuditorSecurity2026!' });
  adminToken = adminRes.body.token;
});

afterAll(async () => {
  await db.closeDatabase();
});

describe('1. Evaluation Record Creation & Provenance Commitment', () => {
  it('should create an evaluation record with a valid SHA-256 provenance hash', async () => {
    const res = await request(app)
      .post('/api/evaluations')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        promptId: 'ATK-1001',
        defenseId: 'DEF-201',
        overallOutcome: 'BLOCKED',
        safetyScore: 94.5,
        attackSuccessRate: 0.05,
        latencyMs: 298
      });

    expect(res.status).toBe(201);
    expect(res.body.evaluation.id).toBeDefined();
    expect(res.body.evaluation.provenanceHash).toBeDefined();
    expect(res.body.evaluation.provenanceHash).toHaveLength(64); // SHA-256 hex length
    expect(res.body.evaluation.pipelineSteps).toHaveLength(4);
    expect(typeof res.body.evaluation.promptEvalCount).toBe('number');
    expect(typeof res.body.evaluation.evalCount).toBe('number');

    createdEvalId = res.body.evaluation.id;
  });

  it('Admin can verify cryptographic provenance non-repudiation signature', async () => {
    const res = await request(app)
      .get(`/api/evaluations/${createdEvalId}/verify`)
      .set('Authorization', `Bearer ${adminToken}`);

    expect(res.status).toBe(200);
    expect(res.body.verified).toBe(true);
    expect(res.body.tamperDetected).toBe(false);
    expect(res.body.provenanceHash).toBe(res.body.recomputedHash);
  });

  it('Detects tampering if model response or parameters are retroactively altered', async () => {
    // Modify the raw_data in database to simulate database row tampering
    const row = (await db.query('SELECT raw_data FROM evaluations WHERE id = $1', [createdEvalId])).rows[0];
    const parsed = typeof row.raw_data === 'string' ? JSON.parse(row.raw_data) : row.raw_data;
    parsed.modelResponse = '[FORGED TAMPERED RESPONSE]';
    await db.query('UPDATE evaluations SET raw_data = $1 WHERE id = $2', [JSON.stringify(parsed), createdEvalId]);

    const res = await request(app)
      .get(`/api/evaluations/${createdEvalId}/verify`)
      .set('Authorization', `Bearer ${adminToken}`);

    expect(res.status).toBe(200);
    expect(res.body.verified).toBe(false);
    expect(res.body.tamperDetected).toBe(true);
    expect(res.body.recomputedHash).not.toBe(res.body.provenanceHash);
  });
});

describe('2. Sanitized Data Projections (Preventing Mutual Intelligence Leakage)', () => {
  it('Red Team view masks confidential Blue Team defense rules', async () => {
    const res = await request(app)
      .get(`/api/evaluations/${createdEvalId}`)
      .set('Authorization', `Bearer ${redToken}`);

    expect(res.status).toBe(200);
    const ev = res.body.evaluation;

    // Red Team should see attack metrics and prompt
    expect(ev.attackPrompt).toBeDefined();
    expect(ev.overallOutcome).toBe('BLOCKED');

    // Blue Team confidential defense rules MUST be masked
    expect(ev.defensePolicyInfo).toBe('[PROTECTED BLUE TEAM DEFENSE POLICY — INTERNAL RULES MASKED]');
    expect(ev.rawDefenseRegexes).toBeUndefined();
    expect(ev.rawDefenseSystemPrompt).toBeUndefined();
  });

  it('Blue Team view masks confidential Red Team raw attack payload', async () => {
    const res = await request(app)
      .get(`/api/evaluations/${createdEvalId}`)
      .set('Authorization', `Bearer ${blueToken}`);

    expect(res.status).toBe(200);
    const ev = res.body.evaluation;

    // Blue Team should see defense configuration
    expect(ev.defensePolicyName).toBeDefined();
    expect(ev.overallOutcome).toBe('BLOCKED');

    // Red Team raw adversarial prompt MUST be masked
    expect(ev.rawAttackPayload).toBe('[REDACTED RED TEAM ADVERSARIAL PAYLOAD — INTEL PROTECTED]');
    expect(ev.rawAttackPrompt).toBeUndefined();
  });
});

describe('3. Security Event Stream & Intrusion Simulation', () => {
  it('Admin can list intrusion violation stream at /api/security-events', async () => {
    const res = await request(app)
      .get('/api/security-events')
      .set('Authorization', `Bearer ${adminToken}`);

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.events)).toBe(true);
    expect(res.body.events.length).toBeGreaterThan(0);
  });

  it('Interactive breach simulation triggers HTTP 403 and commits intrusion record', async () => {
    const res = await request(app)
      .post('/api/security-events/simulate')
      .set('Authorization', `Bearer ${redToken}`);

    expect(res.status).toBe(403);
    expect(res.body.simulation.status).toBe('TRAPPED');
    expect(res.body.simulation.eventId).toMatch(/^SEC-/);

    // Verify it exists in audit table
    const check = await db.query(
      'SELECT * FROM security_events WHERE id = $1',
      [res.body.simulation.eventId]
    );
    expect(check.rows.length).toBe(1);
    expect(check.rows[0].event_type).toBe('UNAUTHORIZED_CROSS_TENANT_BREACH_SIMULATION');
  });
});
