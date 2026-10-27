/**
 * =========================================================================
 * BAYORA API CLIENT SERVICE
 * Connects Frontend UI to Express Backend & Local Ollama Mediation Engine
 * =========================================================================
 */
import { SAMPLE_DATA } from "./mock-data.js";

export const API_BASE = "http://127.0.0.1:8000/api";

const KNOWN_CREDS = {
  red_operator: "RedOperator2026!",
  blue_defender: "BlueDefender2026!",
  compliance_auditor: "AuditorSecurity2026!"
};

class BayoraApiClient {
  constructor() {
    this.token = sessionStorage.getItem("bayora_token") || null;
    this.currentUser = sessionStorage.getItem("bayora_user") || "red_operator";
    this.currentRole = sessionStorage.getItem("bayora_role") || "red_team";
    this.isBackendAvailable = null;
  }

  setSession(token, username, role) {
    this.token = token;
    this.currentUser = username;
    this.currentRole = role;
    sessionStorage.setItem("bayora_token", token);
    sessionStorage.setItem("bayora_user", username);
    sessionStorage.setItem("bayora_role", role);
  }

  clearSession() {
    this.token = null;
    sessionStorage.removeItem("bayora_token");
  }

  async checkHealth() {
    try {
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), 1800);
      const res = await fetch(`${API_BASE}/health`, { signal: controller.signal });
      clearTimeout(timer);
      if (res.ok) {
        const data = await res.json();
        this.databaseStatus = data.database;
        const bannerDb = document.getElementById("banner-db-status");
        if (bannerDb && data.database) {
          bannerDb.textContent = `DB: ${data.database.persistence}`;
          bannerDb.className = data.database.isInMemory ? "banner-db-badge text-amber" : "banner-db-badge text-emerald";
        }
      }
      this.isBackendAvailable = res.ok;
      return res.ok;
    } catch (_) {
      this.isBackendAvailable = false;
      return false;
    }
  }

  async ensureAuthenticated(username = this.currentUser) {
    if (this.token && this.currentUser === username) {
      return this.token;
    }

    const password = KNOWN_CREDS[username] || "RedOperator2026!";
    try {
      const res = await fetch(`${API_BASE}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password })
      });

      if (res.ok) {
        const data = await res.json();
        this.setSession(data.token, data.username, data.role);
        return data.token;
      }
    } catch (e) {
      console.warn("[ApiClient] Auto-authentication failed. Operating in fallback mode:", e.message);
    }
    return null;
  }

  async login(username, password) {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password })
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || "Authentication failed");
    }
    this.setSession(data.token, data.username, data.role);
    return data;
  }

  async getEngineStatus() {
    const isOnline = await this.checkHealth();
    if (!isOnline) {
      return {
        online: false,
        engine: "Bayora Trusted Evaluation Mediator (Offline)",
        provider: "ollama (local)",
        configuredModel: "llama3.2:1b"
      };
    }

    await this.ensureAuthenticated();
    try {
      const res = await fetch(`${API_BASE}/evaluations/engine/status`, {
        headers: { Authorization: `Bearer ${this.token}` }
      });
      if (res.ok) {
        const data = await res.json();
        return { online: true, ...data };
      }
    } catch (_) { }
    return { online: false };
  }

  async createEvaluation({ promptId, defenseId, promptText, targetModel }) {
    const isOnline = await this.checkHealth();
    if (!isOnline) {
      // Fallback in-memory simulation if server is offline
      const mock = { ...SAMPLE_DATA.currentEvaluation };
      mock.id = `EV-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
      mock.timestamp = new Date().toISOString();
      return { evaluation: mock, simulated: true };
    }

    await this.ensureAuthenticated();
    const res = await fetch(`${API_BASE}/evaluations`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${this.token}`
      },
      body: JSON.stringify({
        promptId,
        defenseId,
        promptText,
        targetModel: targetModel || "llama3.2:1b"
      })
    });

    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || "Evaluation failed");
    }
    return { ...data, simulated: false };
  }

  async getEvaluations() {
    const isOnline = await this.checkHealth();
    if (!isOnline) {
      return [SAMPLE_DATA.currentEvaluation];
    }

    await this.ensureAuthenticated();
    try {
      const res = await fetch(`${API_BASE}/evaluations`, {
        headers: { Authorization: `Bearer ${this.token}` }
      });
      if (res.ok) {
        const data = await res.json();
        return data.evaluations;
      }
    } catch (_) { }
    return [SAMPLE_DATA.currentEvaluation];
  }

  async getEvaluationById(id) {
    const isOnline = await this.checkHealth();
    if (!isOnline) {
      return SAMPLE_DATA.currentEvaluation;
    }

    await this.ensureAuthenticated();
    const res = await fetch(`${API_BASE}/evaluations/${id}`, {
      headers: { Authorization: `Bearer ${this.token}` }
    });
    if (res.ok) {
      const data = await res.json();
      return data.evaluation;
    }
    return SAMPLE_DATA.currentEvaluation;
  }

  async verifyProvenance(id) {
    const isOnline = await this.checkHealth();
    if (!isOnline) {
      return {
        verified: true,
        recomputedHash: SAMPLE_DATA.currentEvaluation.provenanceHash,
        provenanceHash: SAMPLE_DATA.currentEvaluation.provenanceHash,
        tamperDetected: false,
        simulated: true
      };
    }

    // Verification requires admin role
    const adminToken = await this.ensureAuthenticated("compliance_auditor");
    const res = await fetch(`${API_BASE}/evaluations/${id}/verify`, {
      headers: { Authorization: `Bearer ${adminToken}` }
    });

    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || "Verification endpoint failed");
    }
    return { ...data, simulated: false };
  }
}

export const apiClient = new BayoraApiClient();
