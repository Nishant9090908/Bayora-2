/**
 * Bayora Backend - Ollama Client Service
 * Connects to local Ollama API instance with zero external dependencies (using native fetch).
 * Resolves http://localhost:11434 on Windows and http://host.docker.internal:11434 inside Docker.
 */
const fs = require('fs');
const config = require('../config/env');

/**
 * Resolve the appropriate Ollama base URL depending on runtime environment
 */
function getOllamaBaseUrl() {
  if (process.env.OLLAMA_BASE_URL) {
    return process.env.OLLAMA_BASE_URL;
  }

  // Detect if running inside a Docker container
  const isDocker = fs.existsSync('/.dockerenv') ||
                   process.env.IS_DOCKER === 'true' ||
                   process.env.DOCKER_CONTAINER === 'true';

  if (isDocker) {
    return 'http://host.docker.internal:11434';
  }

  return 'http://localhost:11434';
}

/**
 * Check if the Ollama service and target model are available
 */
async function checkOllamaHealth(timeoutMs = 3000) {
  const baseUrl = getOllamaBaseUrl();
  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeoutMs);

    const res = await fetch(`${baseUrl}/api/tags`, {
      method: 'GET',
      signal: controller.signal
    });
    clearTimeout(timer);

    if (!res.ok) {
      return { available: false, error: `HTTP ${res.status}: ${res.statusText}` };
    }

    const data = await res.json();
    const targetModel = config.OLLAMA_MODEL || 'llama3.2:1b';
    const models = data.models || [];
    const modelFound = models.some(m => m.name === targetModel || m.model === targetModel);

    return {
      available: true,
      baseUrl,
      targetModel,
      modelLoaded: modelFound,
      installedModels: models.map(m => m.name)
    };
  } catch (err) {
    return {
      available: false,
      baseUrl,
      error: err.name === 'AbortError' ? 'Connection timed out' : err.message
    };
  }
}

/**
 * Generate completion using local Ollama model (non-streaming)
 */
async function generateCompletion({ prompt, systemPrompt, model, timeoutMs }) {
  const baseUrl = getOllamaBaseUrl();
  const selectedModel = model || config.OLLAMA_MODEL || 'llama3.2:1b';
  const timeoutDuration = timeoutMs || config.OLLAMA_TIMEOUT_MS || 30000;

  const requestBody = {
    model: selectedModel,
    prompt: prompt,
    stream: false,
    options: {
      temperature: 0.2 // Low temperature for consistent safety testing
    }
  };

  if (systemPrompt && typeof systemPrompt === 'string' && systemPrompt.trim()) {
    requestBody.system = systemPrompt.trim();
  }

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutDuration);
  const startTime = Date.now();

  try {
    const response = await fetch(`${baseUrl}/api/generate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(requestBody),
      signal: controller.signal
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      let errorBody = '';
      try {
        const errJson = await response.json();
        errorBody = errJson.error || JSON.stringify(errJson);
      } catch (_) {
        errorBody = await response.text();
      }
      throw new Error(`Ollama generation failed [HTTP ${response.status}]: ${errorBody || response.statusText}`);
    }

    const data = await response.json();
    const elapsedMs = Date.now() - startTime;

    if (!data || typeof data.response !== 'string') {
      throw new Error('Invalid response structure received from Ollama API');
    }

    return {
      success: true,
      response: data.response.trim(),
      model: data.model || selectedModel,
      latencyMs: elapsedMs,
      promptEvalCount: data.prompt_eval_count || 0,
      evalCount: data.eval_count || 0,
      done: data.done || true
    };
  } catch (err) {
    clearTimeout(timeoutId);
    const elapsedMs = Date.now() - startTime;

    let errorMessage = err.message;
    if (err.name === 'AbortError') {
      errorMessage = `Ollama generation request timed out after ${timeoutDuration}ms`;
    } else if (err.code === 'ECONNREFUSED' || err.message.includes('fetch failed')) {
      errorMessage = `Cannot connect to Ollama at ${baseUrl}. Ensure Ollama is running and accessible.`;
    }

    return {
      success: false,
      error: errorMessage,
      latencyMs: elapsedMs,
      model: selectedModel
    };
  }
}

module.exports = {
  getOllamaBaseUrl,
  checkOllamaHealth,
  generateCompletion
};
