/**
 * Bayora Backend Test Suite - Database Operations & Integrity Constraints
 */
const db = require('../src/config/db');

beforeAll(async () => {
  await db.initDatabase();
});

afterAll(async () => {
  await db.closeDatabase();
});

describe('PostgreSQL Database Operations & Constraint Enforcement', () => {
  it('should successfully execute queries using the connection pool', async () => {
    const result = await db.query('SELECT 1 + 1 AS sum');
    expect(result.rows[0].sum).toBe(2);
  });

  it('should enforce CHECK constraint on user roles', async () => {
    let errorThrown = false;
    try {
      await db.query(
        `INSERT INTO users (username, email, password_hash, role) 
         VALUES ('invalid_role_user', 'invalid@bayora.sec', 'hash', 'super_hacker')`
      );
    } catch (err) {
      errorThrown = true;
      expect(err).toBeDefined();
    }
    expect(errorThrown).toBe(true);
  });

  it('should enforce unique constraint on username', async () => {
    let errorThrown = false;
    try {
      await db.query(
        `INSERT INTO users (username, email, password_hash, role) 
         VALUES ('red_operator', 'duplicate@bayora.sec', 'hash', 'red_team')`
      );
    } catch (err) {
      errorThrown = true;
      expect(err).toBeDefined();
    }
    expect(errorThrown).toBe(true);
  });

  it('should cascade delete attack prompts when owner user is deleted', async () => {
    // Insert a transient user
    const userRes = await db.query(
      `INSERT INTO users (username, email, password_hash, role) 
       VALUES ('transient_user', 'transient@bayora.sec', 'hash', 'red_team') 
       RETURNING id`
    );
    const userId = userRes.rows[0].id;

    // Insert an attack prompt owned by transient user
    const promptId = `ATK-TEST-${Date.now()}`;
    await db.query(
      `INSERT INTO attack_prompts (id, owner_id, title, category, severity, prompt_text)
       VALUES ($1, $2, 'Cascade Test Prompt', 'Injection', 'LOW', 'Test prompt')`,
      [promptId, userId]
    );

    // Delete transient user
    await db.query('DELETE FROM users WHERE id = $1', [userId]);

    // Verify prompt was cascade deleted
    const checkPrompt = await db.query('SELECT * FROM attack_prompts WHERE id = $1', [promptId]);
    expect(checkPrompt.rows.length).toBe(0);
  });
});
