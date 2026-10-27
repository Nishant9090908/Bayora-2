/**
 * =========================================================================
 * LANDING PAGE VIEW
 * Professional overview of Bayora AI Safety Testing Architecture
 * =========================================================================
 */
export function renderLanding(container) {
  container.innerHTML = `
    <div class="landing-hero">
      <div class="hero-pill">
        <span class="status-dot green"></span>
        INFRASTRUCTURE POSTURE: ISOLATED & ACTIVE // LEVEL-4
      </div>
      <h1 class="hero-title">Securing Adversarial <span>AI Safety Testing</span></h1>
      <p class="hero-subtitle">
        A hardened evaluation enclave where Red Teams, Blue Teams, and Client LLMs operate
        with verified cryptographic provenance, tenant data separation, and zero cross-team intelligence leakage.
      </p>

      <div class="hero-cta">
        <a href="#red-team" class="btn btn-danger">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
          Enter Red Team Studio
        </a>
        <a href="#blue-team" class="btn btn-primary">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>
          Enter Blue Team Studio
        </a>
        <a href="#admin" class="btn btn-secondary">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><line x1="9" y1="3" x2="9" y2="21"/></svg>
          Auditor & Telemetry
        </a>
      </div>

      <!-- Live Platform Status Bar -->
      <div class="stats-grid" style="text-align: left; margin-top: var(--space-8);">
        <div class="stat-card">
          <span class="stat-label">Isolated Client LLM</span>
          <span class="stat-value" style="color: #38bdf8; font-size: 1.25rem;">ONLINE // SHIELDED</span>
          <span class="stat-subtext">Zero direct network exposure</span>
        </div>
        <div class="stat-card">
          <span class="stat-label">Evaluations Executed</span>
          <span class="stat-value">320</span>
          <span class="stat-subtext"><span class="status-dot green"></span> 100% SHA-256 Provenance</span>
        </div>
        <div class="stat-card">
          <span class="stat-label">Adversarial Block Rate</span>
          <span class="stat-value" style="color: #10b981;">87.6%</span>
          <span class="stat-subtext">Across 142 attack scenarios</span>
        </div>
        <div class="stat-card">
          <span class="stat-label">Cross-Tenant Intelligence Leaks</span>
          <span class="stat-value" style="color: #10b981;">0</span>
          <span class="stat-subtext">Enforced by backend DTO filters</span>
        </div>
      </div>

      <!-- Architecture 3-Pillar Breakdown -->
      <div class="pillars-grid">
        <div class="pillar-card">
          <div class="pillar-icon-box red">⚔️</div>
          <h3 style="color: #fca5a5; margin-bottom: 8px;">1. Red Team Workspace</h3>
          <p>
            Submit zero-day adversarial jailbreaks, indirect injections, and safety boundary tests.
            Proprietary attack prompts are encrypted and isolated from Blue Team inspection.
          </p>
          <div style="margin-top: 16px;">
            <span class="badge badge-red">OWNER-SCOPED REPO</span>
          </div>
        </div>

        <div class="pillar-card">
          <div class="pillar-icon-box blue">🛡️</div>
          <h3 style="color: #7dd3fc; margin-bottom: 8px;">2. Blue Team Workspace</h3>
          <p>
            Engineer multi-tier defensive guardrails, system prompt wrappers, and regex classifiers.
            Defensive logic remains confidential, preventing attackers from reverse-engineering evasions.
          </p>
          <div style="margin-top: 16px;">
            <span class="badge badge-blue">CONFIDENTIAL POLICIES</span>
          </div>
        </div>

        <div class="pillar-card">
          <div class="pillar-icon-box purple">⚖️</div>
          <h3 style="color: #d8b4fe; margin-bottom: 8px;">3. Trusted Evaluation Mediator</h3>
          <p>
            Orchestrates evaluations in an isolated execution sandbox. Holds target model credentials,
            scores safety, generates SHA-256 provenance hashes, and produces sanitized views.
          </p>
          <div style="margin-top: 16px;">
            <span class="badge badge-emerald">CRYPTOGRAPHIC AUDIT</span>
          </div>
        </div>
      </div>
    </div>
  `;
}
