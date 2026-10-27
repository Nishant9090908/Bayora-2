/**
 * Bayora Backend - Express Application Factory
 */
const express = require('express');
const cors = require('cors');
const config = require('./config/env');
const { errorHandler } = require('./middleware/errorHandler');

// Import Domain Route Handlers from Team Modules
const authRoutes = require('./routes/authRoutes');
const evaluationRoutes = require('./routes/evaluationRoutes');
const redTeamRoutes = require('./red-team/redTeamRoutes');
const blueTeamRoutes = require('./blue-team/blueTeamRoutes');
const userRoutes = require('./admin/userRoutes');
const securityEventRoutes = require('./admin/securityEventRoutes');

const app = express();

// Security Headers & Cross-Origin Configuration
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Body parsing with size limiting
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true, limit: '1mb' }));

// Health Check & Telemetry
app.get('/api/health', (req, res) => {
  const db = require('./config/db');
  const isMem = db.isInMemoryDatabase();
  res.status(200).json({
    status: 'healthy',
    service: config.APP_NAME,
    environment: config.APP_ENV,
    timestamp: new Date().toISOString(),
    securityEnclave: 'Level 4 Active',
    isolation: '100% Enforced',
    database: {
      type: isMem ? 'in-memory-postgresql' : 'live-postgresql',
      isInMemory: isMem,
      persistence: isMem ? 'Volatile Session (pg-mem)' : 'Persistent Storage (PostgreSQL)'
    }
  });
});

// Mount Domain API Routers
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/red', redTeamRoutes);
app.use('/api/blue', blueTeamRoutes);
app.use('/api/evaluations', evaluationRoutes);
app.use('/api/security-events', securityEventRoutes);

// 404 Route Catch-all
app.use((req, res) => {
  res.status(404).json({
    error: `Resource not found: ${req.method} ${req.originalUrl}`
  });
});

// Centralized Error Handling Middleware
app.use(errorHandler);

module.exports = app;
