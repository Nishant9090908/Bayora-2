/**
 * =========================================================================
 * LANDING PAGE VIEW (Common / Shared Portal)
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
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
          </svg>
          Enter Red Team Studio
        </a>
        <a href="#blue-team" class="btn btn-primary">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
          </svg>
          Enter Blue Team Studio
        </a>
        <a href="#admin" class="btn btn-secondary">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
            <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
            <line x1="9" y1="3" x2="9" y2="21"/>
          </svg>
          Compliance Auditor Console
        </a>
      </div>
    </div>

    <!-- Core Pillars Grid -->
    <div class="pillars-grid">
      <!-- Pillar 1: Red Team Workspace -->
      <div class="pillar-card red">
        <div class="pillar-icon-box red">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="14.5 17.5 3 6 3 3 6 3 17.5 14.5"/>
            <line x1="13" y1="19" x2="19" y2="13"/>
            <line x1="16" y1="16" x2="20" y2="20"/>
            <line x1="19" y1="21" x2="21" y2="19"/>
          </svg>
        </div>
        <h3 class="pillar-title">1. Red Team Workspace</h3>
        <p class="pillar-text">
          Submit and benchmark proprietary adversarial prompts, multi-turn jailbreaks, and indirect prompt injections.
        </p>
        <ul class="pillar-features">
          <li>Owner-scoped prompt repositories</li>
          <li>Zero-day vectors shielded from Blue Team</li>
          <li>Adversarial taxonomy categorization</li>
          <li>Encrypted prompt persistence at rest</li>
        </ul>
      </div>

      <!-- Pillar 2: Blue Team Workspace -->
      <div class="pillar-card blue">
        <div class="pillar-icon-box blue">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
          </svg>
        </div>
        <h3 class="pillar-title">2. Blue Team Workspace</h3>
        <p class="pillar-text">
          Engineer defensive guardrails, system prompt shields, regex pattern matchers, and automated refusal criteria.
        </p>
        <ul class="pillar-features">
          <li>Confidential defense policy repository</li>
          <li>Input pre-filtering & regex engines</li>
          <li>Rules concealed to prevent reverse engineering</li>
          <li>Dynamic safety threshold tuning</li>
        </ul>
      </div>

      <!-- Pillar 3: Target Model Isolation -->
      <div class="pillar-card cyan">
        <div class="pillar-icon-box cyan">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
            <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
          </svg>
        </div>
        <h3 class="pillar-title">3. Client LLM Isolation</h3>
        <p class="pillar-text">
          The tested target model remains completely encapsulated in the backend with zero direct network access from clients.
        </p>
        <ul class="pillar-features">
          <li>API keys isolated exclusively to backend memory</li>
          <li>No direct endpoints exposed to Red or Blue teams</li>
          <li>All interactions route through Evaluation Mediator</li>
          <li>DoS protection & rate limit isolation</li>
        </ul>
      </div>

      <!-- Pillar 4: Provenance & View Projection -->
      <div class="pillar-card purple">
        <div class="pillar-icon-box purple">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
            <line x1="18" y1="20" x2="18" y2="10"/>
            <line x1="12" y1="20" x2="12" y2="4"/>
            <line x1="6" y1="20" x2="6" y2="14"/>
          </svg>
        </div>
        <h3 class="pillar-title">4. Trusted Mediator & Provenance</h3>
        <p class="pillar-text">
          Orchestrates multi-stage safety evaluations, computes SHA-256 non-repudiation hashes, and projects role-sanitized views.
        </p>
        <ul class="pillar-features">
          <li>4-stage pipeline execution visualizer</li>
          <li>Role-sanitized views strip opposing secrets</li>
          <li>Deterministic SHA-256 cryptographic provenance</li>
          <li>Automated 401/403 intrusion traps & alerts</li>
        </ul>
      </div>
    </div>
  `;
}
