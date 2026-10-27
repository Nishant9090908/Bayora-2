/**
 * Bayora Backend - Server Entry Point
 */
const app = require('./app');
const config = require('./config/env');
const db = require('./config/db');

async function startServer() {
  try {
    console.log(`[Bayora] Initializing ${config.APP_NAME} Security Enclave backend...`);

    // Initialize database connection, schema DDL, and initial seeds
    await db.initDatabase();

    const server = app.listen(config.PORT, config.HOST, () => {
      console.log(`[Bayora] Express backend active on http://${config.HOST}:${config.PORT}`);
      console.log(`[Bayora] Security boundaries enforced: Red/Blue mutual isolation & RBAC active.`);
    });

    // Graceful Shutdown
    const shutdown = async (signal) => {
      console.log(`\n[Bayora] Received ${signal}. Shutting down gracefully...`);
      server.close(async () => {
        await db.closeDatabase();
        console.log('[Bayora] Database pool closed. Server terminated.');
        process.exit(0);
      });
    };

    process.on('SIGINT', () => shutdown('SIGINT'));
    process.on('SIGTERM', () => shutdown('SIGTERM'));

  } catch (err) {
    console.error('[Bayora] Fatal error during startup:', err);
    process.exit(1);
  }
}

if (require.main === module) {
  startServer();
}

module.exports = { startServer };
