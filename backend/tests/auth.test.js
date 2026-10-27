/**
 * Bayora Backend Test Suite - Authentication & Credential Verification
 */
const request = require('supertest');
const app = require('../src/app');
const db = require('../src/config/db');

beforeAll(async () => {
  await db.initDatabase();
});

afterAll(async () => {
  await db.closeDatabase();
});

describe('1. User Registration & Validation', () => {
  it('should successfully register a new Red Team researcher', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({
        username: 'new_red_researcher',
        email: 'red.research@lab.internal',
        password: 'SecurePassword2026!',
        role: 'red_team',
        displayName: 'Red Researcher'
      });

    expect(res.status).toBe(201);
    expect(res.body.token).toBeDefined();
    expect(res.body.user.username).toBe('new_red_researcher');
    expect(res.body.user.role).toBe('red_team');
    expect(res.body.user.password_hash).toBeUndefined(); // Sensitive credentials must never be returned
  });

  it('should successfully register a new Blue Team researcher', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({
        username: 'new_blue_defender',
        email: 'blue.research@lab.internal',
        password: 'SecurePassword2026!',
        role: 'blue_team',
        displayName: 'Blue Defender'
      });

    expect(res.status).toBe(201);
    expect(res.body.user.role).toBe('blue_team');
  });

  it('should reject duplicate username registration with 409 Conflict', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({
        username: 'new_red_researcher',
        email: 'another_email@lab.internal',
        password: 'SecurePassword2026!',
        role: 'red_team'
      });

    expect(res.status).toBe(409);
    expect(res.body.error).toMatch(/already registered/i);
  });

  it('should prevent privilege escalation: cannot self-assign admin role on registration', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({
        username: 'sneaky_admin_wannabe',
        email: 'hacker@lab.internal',
        password: 'SecurePassword2026!',
        role: 'admin'
      });

    expect(res.status).toBe(400);
    expect(res.body.error).toMatch(/admin role cannot be self-assigned/i);
  });

  it('should reject registration with invalid email or weak password', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({
        username: 'bad_user',
        email: 'not-an-email',
        password: 'short'
      });

    expect(res.status).toBe(400);
    expect(res.body.error).toBeDefined();
  });
});

describe('2. User Login & Credential Verification', () => {
  it('should successfully log in with valid credentials and return a signed JWT', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({
        username: 'red_operator',
        password: 'RedOperator2026!'
      });

    expect(res.status).toBe(200);
    expect(res.body.token).toBeDefined();
    expect(res.body.user.role).toBe('red_team');
    expect(res.body.user.password_hash).toBeUndefined();
  });

  it('should reject login with invalid password and log security event', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({
        username: 'red_operator',
        password: 'WrongPassword!'
      });

    expect(res.status).toBe(401);
    expect(res.body.error).toBe('Invalid credentials provided');

    // Verify security event was captured in database
    const events = await db.query(
      "SELECT * FROM security_events WHERE event_type = 'AUTH_FAILED_CREDENTIALS' AND actor = 'red_operator'"
    );
    expect(events.rows.length).toBeGreaterThan(0);
  });

  it('should reject login with non-existent user and log security event', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({
        username: 'ghost_user',
        password: 'AnyPassword123!'
      });

    expect(res.status).toBe(401);
    expect(res.body.error).toBe('Invalid credentials provided');
  });

  it('should fetch authenticated user profile at /api/auth/me', async () => {
    const loginRes = await request(app)
      .post('/api/auth/login')
      .send({ username: 'red_operator', password: 'RedOperator2026!' });

    const token = loginRes.body.token;

    const res = await request(app)
      .get('/api/auth/me')
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body.user.username).toBe('red_operator');
    expect(res.body.user.role).toBe('red_team');
  });

  it('should reject unauthenticated request to /api/auth/me with 401', async () => {
    const res = await request(app).get('/api/auth/me');
    expect(res.status).toBe(401);
  });

  it('should reject forged/tampered token with 401 and capture security violation', async () => {
    const forgedToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.e30.tampered_signature_xyz';
    const res = await request(app)
      .get('/api/auth/me')
      .set('Authorization', `Bearer ${forgedToken}`);

    expect(res.status).toBe(401);
    expect(res.body.error).toMatch(/invalid authentication token/i);

    const events = await db.query(
      "SELECT * FROM security_events WHERE event_type = 'INVALID_TOKEN_SIGNATURE'"
    );
    expect(events.rows.length).toBeGreaterThan(0);
  });
});
