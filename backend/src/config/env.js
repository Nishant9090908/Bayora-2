/**
 * Bayora Backend - Environment Configuration
 * Loads environment variables and provides secure defaults
 */
const path = require('path');
const dotenv = require('dotenv');

// Load environment variables from .env file in root
dotenv.config({ path: path.resolve(__dirname, '../../../.env') });

const config = {
  APP_NAME: process.env.APP_NAME || 'Bayora',
  APP_ENV: process.env.APP_ENV || 'development',
  PORT: parseInt(process.env.PORT, 10) || 8000,
  HOST: process.env.HOST || '127.0.0.1',
  
  // Security & Authentication Secrets (Server-side only)
  JWT_SECRET: process.env.JWT_SECRET || 'bayora_hackathon_super_secret_jwt_signing_key_2026_x7k9',
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '8h',
  
  // PostgreSQL Connection
  DATABASE_URL: process.env.DATABASE_URL || 'postgres://bayora_admin:bayora_secure_password_2026@localhost:5432/bayora_db',
  USE_IN_MEMORY_PG: process.env.USE_IN_MEMORY_PG || 'auto',
  
  // Target LLM Integration (Local Ollama)
  TARGET_LLM_PROVIDER: process.env.TARGET_LLM_PROVIDER || 'ollama',
  TARGET_MODEL_NAME: process.env.TARGET_MODEL_NAME || 'llama3.2:1b',
  OLLAMA_BASE_URL: process.env.OLLAMA_BASE_URL || '',
  OLLAMA_MODEL: process.env.OLLAMA_MODEL || 'llama3.2:1b',
  OLLAMA_TIMEOUT_MS: parseInt(process.env.OLLAMA_TIMEOUT_MS, 10) || 30000,
  OLLAMA_ORIGINS: process.env.OLLAMA_ORIGINS || 'http://localhost:3000,http://127.0.0.1:3000,http://localhost:8000,http://127.0.0.1:8000',
  OLLAMA_BIND_HOST: process.env.OLLAMA_BIND_HOST || '127.0.0.1'
};

module.exports = config;
