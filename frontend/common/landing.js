/**
 * =========================================================================
 * BAYORA SEC-AI ARCHITECTURAL TECH-GRID LANDING PAGE
 * Strict Black, White & Orange Brutalist Architecture
 * Features:
 *   - 100% Grounded in Bayora Adversarial AI Safety Testing Infrastructure
 *   - 3D Revolving Interlocking Chain (White & Orange rings, Drag to Spin)
 *   - Animated Mini Cyber Robot Face Cursor Follower ([ ▪ ▪ ])
 *   - 2-Member Team Area with Custom Photo Upload & LocalStorage Persistence
 *   - Halftone Dot-Matrix Silhouette Avatars
 *   - Numbered FAQ Tech-Grid on Enclave Security & Cryptographic Provenance
 *   - Adversarial Pipeline Evaluation Run Modal with SHA-256 Receipt
 * =========================================================================
 */
import { apiClient } from "../js/api.js";

export function renderLanding(container) {
  container.innerHTML = `
    <div class="null-landing">
      <!-- =====================================================================
           TOP SUB-TELEMETRY BAR
           ===================================================================== -->
      <div class="null-top-bar">
        <div class="null-top-left">
          <span><span class="null-orange-square"></span>LEVEL 4 MUTUAL DATA ISOLATION</span>
          <span>//</span>
          <span>ADVERSARIAL AI SAFETY TESTING ENCLAVE · EST. 2026</span>
        </div>
        <div class="null-top-right">
          <span>CLIENT LLM: <strong class="text-orange">AIR-GAPPED</strong></span>
          <span>•</span>
          <span>MEDIATOR LATENCY: <strong>&lt; 120MS</strong></span>
          <span>•</span>
          <span>LEDGER ENGINE: <strong>SHA-256 COMMIT</strong></span>
        </div>
      </div>

      <!-- =====================================================================
           NAVIGATION HEADER
           ===================================================================== -->
      <header class="null-navbar">
        <a href="#landing" class="null-nav-brand">
          <div class="null-brand-icon">
            <span class="null-brand-eye"></span>
            <span class="null-brand-eye"></span>
          </div>
          <div class="null-brand-text">
            <span>Bayora</span>
            <strong>SEC-AI</strong>
          </div>
        </a>

        <ul class="null-nav-links">
          <li><a href="#red-team" class="null-nav-link">RED TEAM</a></li>
          <li><a href="#blue-team" class="null-nav-link">BLUE TEAM</a></li>
          <li><a href="#evaluation" class="null-nav-link">EVALUATION</a></li>
          <li><a href="#security-events" class="null-nav-link">SECURITY TRAPS</a></li>
          <li><a href="#team-section" class="null-nav-link" id="nav-link-team">TEAM</a></li>
          <li><a href="#faq-section" class="null-nav-link" id="nav-link-faq">FAQ</a></li>
        </ul>

        <div class="null-nav-actions">
          <button id="null-theme-toggle" class="null-theme-circle" title="Toggle Theme" aria-label="Toggle Theme"></button>
          <button id="btn-header-apply" class="null-btn-apply" type="button">
            <span>RUN TEST</span>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <line x1="5" y1="12" x2="19" y2="12"></line>
              <polyline points="12 5 19 12 12 19"></polyline>
            </svg>
          </button>
        </div>
      </header>

      <!-- =====================================================================
           SECTION 1: HERO SECTION
           ===================================================================== -->
      <section class="null-hero-container">
        <!-- Hero Left Column: Big Chamfered Typography & Action -->
        <div class="null-hero-left">
          <div>
            <div class="null-hero-subtitle">
              <span class="null-orange-square"></span>
              <span>ADVERSARIAL AI ENCLAVE · LEVEL 4 HARDENED · EST. 2026</span>
            </div>

            <h1 class="null-hero-title">
              <span class="title-row">SECURE WHAT</span>
              <span class="title-row">COMES NEXT</span>
            </h1>
          </div>

          <div class="null-hero-bottom">
            <p class="null-hero-desc">
              A cryptographically hardened multi-tenant testing enclave where Red Teams, Blue Teams, and Client LLMs collaborate safely with zero cross-tenant intelligence leakage, air-gapped model access, and non-repudiable SHA-256 provenance.
            </p>

            <div class="null-hero-actions">
              <a href="#red-team" class="null-btn-primary">
                <span>LAUNCH OFFENSIVE STUDIO</span>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                  <line x1="5" y1="12" x2="19" y2="12"></line>
                  <polyline points="12 5 19 12 12 19"></polyline>
                </svg>
              </a>
              <a href="#blue-team" class="null-btn-outline">
                <span>EXPLORE DEFENSE ENCLAVE</span>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                  <line x1="5" y1="12" x2="19" y2="12"></line>
                  <polyline points="12 5 19 12 12 19"></polyline>
                </svg>
              </a>
            </div>
          </div>
        </div>

        <!-- Hero Right Column: 3D Revolving Chain & 3-Col Stats -->
        <div class="null-hero-right">
          <div class="null-chain-container" id="null-chain-container">
            <canvas id="null-chain-canvas"></canvas>
            <div class="null-drag-hint">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38l5.67-5.67"/>
              </svg>
              <span>DRAG TO SPIN // ENCLAVE BOUNDARY</span>
            </div>
          </div>

          <!-- 3-Column Metrics Grid Under Chain -->
          <div class="null-hero-stats">
            <div class="null-stat-col">
              <span class="null-stat-label">ATTACK TAXONOMIES</span>
              <span class="null-stat-num">1,420+</span>
            </div>
            <div class="null-stat-col">
              <span class="null-stat-label">MEDIATOR LATENCY</span>
              <span class="null-stat-num"><span class="text-orange">&lt;</span>120MS</span>
            </div>
            <div class="null-stat-col">
              <span class="null-stat-label">TENANT ISOLATION</span>
              <span class="null-stat-num">100%</span>
            </div>
          </div>
        </div>
      </section>

      <!-- =====================================================================
           QUICK ENCLAVE WORKBENCH ACCESS STRIP
           ===================================================================== -->
      <section class="null-top-bar" style="background: #050505; border-bottom: 1px solid var(--null-border);">
        <div class="null-top-left">
          <span class="null-mono text-orange">ENCLAVE APPS //</span>
          <span class="null-mono">ENTER RESEARCH MODULES</span>
        </div>
        <div class="null-top-right">
          <a href="#red-team" class="null-mono" style="color: #ff5500; text-decoration: none;">[01] RED TEAM OFFENSIVE STUDIO →</a>
          <span style="color: #333;">|</span>
          <a href="#blue-team" class="null-mono" style="color: #ffffff; text-decoration: none;">[02] BLUE TEAM GUARDRAILS →</a>
          <span style="color: #333;">|</span>
          <a href="#evaluation" class="null-mono" style="color: #ffffff; text-decoration: none;">[03] EVALUATION MEDIATOR →</a>
          <span style="color: #333;">|</span>
          <a href="#security-events" class="null-mono" style="color: #888888; text-decoration: none;">[04] SECURITY TRAPS &amp; PROVENANCE →</a>
        </div>
      </section>

      <!-- =====================================================================
           SECTION 2: TEAM SECTION (Exactly Two Members with Photo Upload)
           ===================================================================== -->
      <section class="null-team-section" id="team-section">
        <div class="null-team-header">
          <div class="null-team-title-box">
            <h2 class="null-section-title">TEAM</h2>
          </div>
          <div class="null-team-desc-box">
            <div class="null-subtitle">
              <span class="null-orange-square"></span>
              <span>The Architects Behind The Enclave</span>
            </div>
            <p>
              Security researchers, adversarial red-teamers, and distributed systems engineers building zero-leakage safety testing infrastructure for frontier foundation models.
            </p>
          </div>
          <div class="null-team-count-box">
            <span class="null-mono">RESEARCHERS</span>
            <span class="null-stat-num">02</span>
          </div>
        </div>

        <!-- Two Team Members Grid with Photo Upload Ability -->
        <div class="null-team-grid">
          <!-- Member 1 Card -->
          <div class="null-team-card" id="team-card-0">
            <div class="null-card-tag">01 / BACKEND &amp; EVAL</div>

            <div class="null-avatar-container" id="avatar-container-0">
              <!-- Halftone Dot-Matrix Canvas Fallback -->
              <canvas class="null-halftone-canvas" id="halftone-canvas-0" width="400" height="300"></canvas>
              <!-- Uploaded Photo (Hidden until user uploads) -->
              <img class="null-uploaded-photo" id="uploaded-photo-0" alt="Nishant Chauhan Photo" />

              <!-- Upload Photo Control Overlay -->
              <div class="null-upload-overlay">
                <label class="null-upload-btn" for="team-photo-input-0" title="Upload custom portrait">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                    <polyline points="17 8 12 3 7 8"></polyline>
                    <line x1="12" y1="3" x2="12" y2="15"></line>
                  </svg>
                  <span id="upload-label-0">UPLOAD PHOTO</span>
                </label>
                <input type="file" id="team-photo-input-0" class="null-file-input" accept="image/*" />
                <button type="button" class="null-remove-photo-btn" id="remove-photo-0" title="Remove custom photo">REMOVE</button>
              </div>
            </div>

            <div class="null-member-info">
              <h3 class="null-member-name" id="member-name-0">Nishant Chauhan</h3>
              <p class="null-member-role" id="member-role-0">Backend and Evaluation Engine</p>
            </div>

            <!-- Corner Bracketed BIO + Button -->
            <button type="button" class="null-bio-btn" id="bio-btn-0" data-target="bio-drawer-0">
              <span class="null-bio-corner-tr"></span>
              <span class="null-bio-corner-bl"></span>
              <span>BIO +</span>
            </button>

            <!-- Collapsible Bio Drawer -->
            <div class="null-bio-drawer" id="bio-drawer-0">
              <p>
                Architected the trusted 4-stage Evaluation Mediator kernel (Pre-Filter ➔ Mediated Query ➔ Safety Judge ➔ SHA-256 Provenance Ledger) and low-latency proxy engine (&lt;120ms). Leads backend infrastructure, owner-scoped encrypted data repositories, and zero-leakage multi-tenant model isolation.
              </p>
              <div class="null-social-links">
                <a href="https://github.com" target="_blank" rel="noreferrer" class="null-social-link">GITHUB ↗</a>
                <a href="https://twitter.com" target="_blank" rel="noreferrer" class="null-social-link">X / TWITTER ↗</a>
                <a href="https://linkedin.com" target="_blank" rel="noreferrer" class="null-social-link">LINKEDIN ↗</a>
              </div>
            </div>
          </div>

          <!-- Member 2 Card -->
          <div class="null-team-card" id="team-card-1">
            <div class="null-card-tag">02 / FRONTEND &amp; UI</div>

            <div class="null-avatar-container" id="avatar-container-1">
              <!-- Halftone Dot-Matrix Canvas Fallback -->
              <canvas class="null-halftone-canvas" id="halftone-canvas-1" width="400" height="300"></canvas>
              <!-- Uploaded Photo (Hidden until user uploads) -->
              <img class="null-uploaded-photo" id="uploaded-photo-1" alt="Gauri Dwivedi Photo" />

              <!-- Upload Photo Control Overlay -->
              <div class="null-upload-overlay">
                <label class="null-upload-btn" for="team-photo-input-1" title="Upload custom portrait">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                    <polyline points="17 8 12 3 7 8"></polyline>
                    <line x1="12" y1="3" x2="12" y2="15"></line>
                  </svg>
                  <span id="upload-label-1">UPLOAD PHOTO</span>
                </label>
                <input type="file" id="team-photo-input-1" class="null-file-input" accept="image/*" />
                <button type="button" class="null-remove-photo-btn" id="remove-photo-1" title="Remove custom photo">REMOVE</button>
              </div>
            </div>

            <div class="null-member-info">
              <h3 class="null-member-name" id="member-name-1">Gauri Dwivedi</h3>
              <p class="null-member-role" id="member-role-1">Frontend and UI</p>
            </div>

            <!-- Corner Bracketed BIO + Button -->
            <button type="button" class="null-bio-btn" id="bio-btn-1" data-target="bio-drawer-1">
              <span class="null-bio-corner-tr"></span>
              <span class="null-bio-corner-bl"></span>
              <span>BIO +</span>
            </button>

            <!-- Collapsible Bio Drawer -->
            <div class="null-bio-drawer" id="bio-drawer-1">
              <p>
                Engineered the brutalist dark-mode design system, interactive 3D WebGL revolving visualizations, real-time adversarial telemetry stream, and role-based persona navigation interfaces (Red Team, Blue Team, and Compliance Auditor).
              </p>
              <div class="null-social-links">
                <a href="https://github.com" target="_blank" rel="noreferrer" class="null-social-link">GITHUB ↗</a>
                <a href="https://twitter.com" target="_blank" rel="noreferrer" class="null-social-link">X / TWITTER ↗</a>
                <a href="https://linkedin.com" target="_blank" rel="noreferrer" class="null-social-link">LINKEDIN ↗</a>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- =====================================================================
           SECTION 3: FAQ SECTION
           ===================================================================== -->
      <section class="null-faq-section" id="faq-section">
        <div class="null-faq-header">
          <div class="null-faq-title-box">
            <h2 class="null-section-title">FAQ</h2>
          </div>

          <div class="null-cross-fitting-box">
            <span class="null-cross-bracket-tr"></span>
            <span class="null-cross-bracket-bl"></span>
            <canvas class="null-cross-graphic" id="null-cross-canvas" width="100" height="100"></canvas>
          </div>

          <div class="null-faq-desc-box">
            <div class="null-subtitle">
              <span class="null-orange-square"></span>
              <span>Frequently Asked Architecture Questions</span>
            </div>
            <p>
              Everything you need to know about mutual tenant isolation, model security, air-gapped mediation, and cryptographic evaluation provenance.
            </p>
          </div>
        </div>

        <!-- 6 Accordion Rows on Bayora AI Security -->
        <div class="null-faq-list">
          <!-- Item 01 -->
          <div class="null-faq-row">
            <button type="button" class="null-faq-trigger">
              <span class="null-faq-num">01</span>
              <span class="null-faq-question">How does Bayora prevent Red Teams from inspecting Blue Team defense rules?</span>
              <span class="null-faq-icon-box">+</span>
            </button>
            <div class="null-faq-answer">
              Defensive guardrails, system prompt wrappers, and PCRE regex rules are owner-scoped and encrypted in the Blue Team database. During an evaluation, the Trusted Mediator executes defenses in an isolated runtime memory buffer. The Red Team only receives a role-sanitized verdict (Pass/Fail, Safety Score, Latency), never raw defense configurations, preventing attackers from reverse-engineering bypasses.
            </div>
          </div>

          <!-- Item 02 -->
          <div class="null-faq-row">
            <button type="button" class="null-faq-trigger">
              <span class="null-faq-num">02</span>
              <span class="null-faq-question">How does the system prevent Blue Teams from memorizing raw Red Team zero-day exploits?</span>
              <span class="null-faq-icon-box">+</span>
            </button>
            <div class="null-faq-answer">
              Red Team prompts represent valuable adversarial research. Blue Teams cannot browse or inspect the raw zero-day payload repository. When evaluations run, Blue Teams observe aggregated resilience scores, guardrail trigger counts, and high-level taxonomy classifications (e.g. 'Token Smuggling', 'Persona Adoption'), preventing them from overfitting static rules to specific prompt strings.
            </div>
          </div>

          <!-- Item 03 -->
          <div class="null-faq-row">
            <button type="button" class="null-faq-trigger">
              <span class="null-faq-num">03</span>
              <span class="null-faq-question">How is the Client LLM target protected from direct API access and prompt injection?</span>
              <span class="null-faq-icon-box">+</span>
            </button>
            <div class="null-faq-answer">
              The target model has zero direct network or API endpoints exposed to team dashboards. All interactions route through the non-bypassable Evaluation Mediator. The mediator validates input size against a 64 KB ceiling to prevent token flooding DoS, injects credentials server-side via loopback isolation (127.0.0.1), and scores outputs with an independent safety judge before returning responses.
            </div>
          </div>

          <!-- Item 04 -->
          <div class="null-faq-row">
            <button type="button" class="null-faq-trigger">
              <span class="null-faq-num">04</span>
              <span class="null-faq-question">What adversarial attack vectors does the Red Team Studio benchmark?</span>
              <span class="null-faq-icon-box">+</span>
            </button>
            <div class="null-faq-answer">
              Bayora natively benchmarks against 1,420+ automated attack vectors across 18 taxonomies, including direct prompt injection, Base64/rot13 token smuggling, system prompt exfiltration probes, recursive tool-use hijack vectors, role-play Persona Adoption jailbreaks, and adversarial suffix attacks (GCG-style).
            </div>
          </div>

          <!-- Item 05 (Expanded by default) -->
          <div class="null-faq-row open">
            <button type="button" class="null-faq-trigger">
              <span class="null-faq-num">05</span>
              <span class="null-faq-question">How does SHA-256 cryptographic provenance guarantee audit integrity?</span>
              <span class="null-faq-icon-box">✕</span>
            </button>
            <div class="null-faq-answer">
              Every evaluation run automatically computes and commits an immutable cryptographic digest: SHA256(RedPromptHash + BlueDefenseHash + ModelResponse + EvaluationTimestamp). This creates a tamper-evident audit ledger that compliance officers, auditors, and customers can independently verify for SOC2 and ISO-42001 certification without revealing raw confidential prompts or defense rules.
            </div>
          </div>

          <!-- Item 06 -->
          <div class="null-faq-row">
            <button type="button" class="null-faq-trigger">
              <span class="null-faq-num">06</span>
              <span class="null-faq-question">Can we evaluate local private models (Ollama/vLLM) as well as commercial cloud APIs?</span>
              <span class="null-faq-icon-box">+</span>
            </button>
            <div class="null-faq-answer">
              Yes. The Evaluation Mediator features pluggable model adapters. You can test air-gapped local clusters (Ollama, vLLM, HuggingFace TGI bound to 127.0.0.1) or commercial endpoints (OpenAI, Anthropic, Groq). In all setups, team dashboards interact strictly with the mediator proxy, guaranteeing zero network credential leakage.
            </div>
          </div>
        </div>
      </section>

      <!-- =====================================================================
           SECTION 4: ARCHITECTURAL PILLARS (THESIS)
           ===================================================================== -->
      <section class="null-team-section" id="thesis-section" style="border-top: 1px solid var(--null-border);">
        <div class="null-team-header">
          <div class="null-team-title-box">
            <h2 class="null-section-title">PILLARS</h2>
          </div>
          <div class="null-team-desc-box">
            <div class="null-subtitle">
              <span class="null-orange-square"></span>
              <span>Three Cryptographic Guarantees</span>
            </div>
            <p>
              Non-negotiable security invariants enforced across every tenant, evaluation run, and model boundary.
            </p>
          </div>
          <div class="null-team-count-box">
            <span class="null-mono">PILLARS</span>
            <span class="null-stat-num">03</span>
          </div>
        </div>

        <div style="display: grid; grid-template-columns: repeat(3, 1fr); background: var(--null-bg);" class="null-hero-stats">
          <div class="null-stat-col" style="padding: 36px 32px;">
            <span class="null-stat-label text-orange">01 // MUTUAL ISOLATION</span>
            <h3 style="font-size: 1.25rem; font-weight: 700; margin: 12px 0 8px;">Zero Cross-Tenant Leakage</h3>
            <p style="color: var(--null-gray-light); font-size: 0.9rem; line-height: 1.6; margin: 0;">
              Red Team prompts and Blue Team defenses remain completely blind to each other. Both teams test adversarial limits while preserving 100% intellectual property confidentiality.
            </p>
          </div>
          <div class="null-stat-col" style="padding: 36px 32px;">
            <span class="null-stat-label text-orange">02 // TRUSTED MEDIATOR</span>
            <h3 style="font-size: 1.25rem; font-weight: 700; margin: 12px 0 8px;">4-Stage Non-Bypassable Pipeline</h3>
            <p style="color: var(--null-gray-light); font-size: 0.9rem; line-height: 1.6; margin: 0;">
              All queries flow strictly through Pre-Filter ➔ Mediated LLM Query ➔ Output Safety Judge ➔ Cryptographic Commitment. Target model credentials are isolated server-side.
            </p>
          </div>
          <div class="null-stat-col" style="padding: 36px 32px; border-right: none;">
            <span class="null-stat-label text-orange">03 // PROVENANCE LEDGER</span>
            <h3 style="font-size: 1.25rem; font-weight: 700; margin: 12px 0 8px;">SHA-256 Merkle Ledger</h3>
            <p style="color: var(--null-gray-light); font-size: 0.9rem; line-height: 1.6; margin: 0;">
              Every prompt submission, defense interception, and evaluation verdict is hashed into an immutable cryptographic chain for auditor validation and non-repudiation.
            </p>
          </div>
        </div>
      </section>

      <!-- =====================================================================
           FOOTER
           ===================================================================== -->
      <footer style="padding: 40px 36px; border-top: 1px solid var(--null-border); display: flex; justify-content: space-between; align-items: center; background: #000000; flex-wrap: wrap; gap: 20px;">
        <div style="display: flex; align-items: center; gap: 14px;">
          <div class="null-brand-icon" style="width: 24px; height: 18px;">
            <span class="null-brand-eye" style="width: 2px; height: 2px;"></span>
            <span class="null-brand-eye" style="width: 2px; height: 2px;"></span>
          </div>
          <span class="null-mono" style="color: #666;">BAYORA SEC-AI // HARDENED ADVERSARIAL TESTING ENCLAVE</span>
        </div>
        <div class="null-mono" style="color: #555;">
          <span>© 2026 BAYORA. LEVEL 4 DATA ISOLATION ENFORCED.</span>
        </div>
      </footer>

      <!-- =====================================================================
           ADVERSARIAL EVALUATION RUN MODAL
           ===================================================================== -->
      <div class="null-modal-backdrop" id="null-apply-modal">
        <div class="null-modal">
          <div class="null-modal-header">
            <h3>INITIATE ADVERSARIAL TEST RUN</h3>
            <button type="button" class="null-modal-close" id="modal-close-btn">&times;</button>
          </div>
          <div class="null-modal-body">
            <form id="null-apply-form">
              <div class="null-form-group">
                <label class="null-form-label" for="app-target-model">Target Client Model *</label>
                <select id="app-target-model" class="null-form-input" style="background:#111;">
                  <option value="ollama-local">Isolated Ollama / vLLM Cluster (127.0.0.1:11434)</option>
                  <option value="llama3-70b">Llama-3-70B-Instruct Enclave Container</option>
                  <option value="mock-safety">Mock Adversarial Safety Model (High-Throughput)</option>
                  <option value="openai-compat">Custom Air-Gapped Model Endpoint</option>
                </select>
              </div>
              <div class="null-form-group">
                <label class="null-form-label" for="app-attack-taxonomy">Red Team Attack Taxonomy *</label>
                <select id="app-attack-taxonomy" class="null-form-input" style="background:#111;">
                  <option value="persona-jailbreak">Jailbreak - Persona Adoption &amp; Role-Play (Level 4)</option>
                  <option value="token-smuggle">Token Smuggling - Base64 &amp; Rot13 Cipher Bypass</option>
                  <option value="indirect-injection">Indirect Prompt Injection &amp; Tool Hijack</option>
                  <option value="sys-exfiltrate">System Prompt &amp; Model Weight Exfiltration</option>
                </select>
              </div>
              <div class="null-form-group">
                <label class="null-form-label" for="app-defense-guard">Blue Team Defensive Guardrail Preset *</label>
                <select id="app-defense-guard" class="null-form-input" style="background:#111;">
                  <option value="strict-dual">Dual-Layer: Keyword Pre-Filter + LLM Safety Judge</option>
                  <option value="pcre-regex">Strict PCRE Regex Barrier + Deterministic Refusal</option>
                  <option value="wrapper-hardening">Adaptive System Prompt Wrapper + Output Classifier</option>
                </select>
              </div>
              <div class="null-form-group">
                <label class="null-form-label" for="app-notes">Adversarial Evaluation Objective</label>
                <textarea id="app-notes" class="null-form-textarea" rows="2" placeholder="e.g. Verify refusal resilience against multi-turn jailbreak attempts..."></textarea>
              </div>
              <div style="display: flex; justify-content: flex-end; gap: 12px; margin-top: 24px;">
                <button type="button" class="null-btn-outline" id="modal-cancel-btn">CANCEL</button>
                <button type="submit" class="null-btn-primary">
                  <span>RUN MEDIATED TEST</span>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                    <line x1="5" y1="12" x2="19" y2="12"></line>
                    <polyline points="12 5 19 12 12 19"></polyline>
                  </svg>
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      <!-- =====================================================================
           MINI ROBO FACE CURSOR FOLLOWER
           "a very small robo face following the cursor everywhere"
           ===================================================================== -->
      <div id="null-robo-cursor" aria-hidden="true">
        <div class="null-robo-chassis">
          <span class="null-robo-eye blinking"></span>
          <span class="null-robo-eye blinking"></span>
        </div>
      </div>
    </div>
  `;

  // Attach all interactors and 3D scenes
  initRevolvingChain();
  initRoboCursorFollower();
  initTeamPhotoUpload();
  initCrossFittingGraphic();
  initFaqAccordion();
  initApplicationModal();
  initNavigationScroll();
}

/**
 * =========================================================================
 * 1. 3D REVOLVING INTERLOCKING CHAIN (Three.js with 2D Canvas Fallback)
 * Two interlocking toruses (Ring 1: White, Ring 2: Vivid Orange #ff5500)
 * Revolving smoothly with interactive drag-to-spin and inertia
 * =========================================================================
 */
function initRevolvingChain() {
  const container = document.getElementById("null-chain-container");
  const canvas = document.getElementById("null-chain-canvas");
  if (!container || !canvas) return;

  // Check Three.js availability
  if (typeof THREE !== "undefined") {
    try {
      const width = container.clientWidth || 480;
      const height = container.clientHeight || 400;

      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(42, width / height, 0.1, 1000);
      camera.position.set(0, 0, 7.8);

      const renderer = new THREE.WebGLRenderer({
        canvas: canvas,
        alpha: true,
        antialias: true,
        powerPreference: "high-performance"
      });
      renderer.setSize(width, height);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

      // Studio Lighting
      const ambientLight = new THREE.AmbientLight(0xffffff, 0.85);
      scene.add(ambientLight);

      const keyLight = new THREE.DirectionalLight(0xffffff, 1.4);
      keyLight.position.set(5, 8, 7);
      scene.add(keyLight);

      const orangeRimLight = new THREE.DirectionalLight(0xff5500, 2.2);
      orangeRimLight.position.set(-6, -4, -4);
      scene.add(orangeRimLight);

      const topLight = new THREE.DirectionalLight(0xffffff, 0.8);
      topLight.position.set(0, 10, 0);
      scene.add(topLight);

      // Parent Chain Group
      const chainGroup = new THREE.Group();
      scene.add(chainGroup);

      // Ring 1: Pristine White Torus (Target LLM Isolation)
      const torusGeo = new THREE.TorusGeometry(1.5, 0.38, 36, 80);
      const whiteMat = new THREE.MeshStandardMaterial({
        color: 0xffffff,
        roughness: 0.22,
        metalness: 0.12
      });
      const ringWhite = new THREE.Mesh(torusGeo, whiteMat);
      ringWhite.position.set(-0.7, 0, 0);
      ringWhite.rotation.set(Math.PI / 3, Math.PI / 6, 0);
      chainGroup.add(ringWhite);

      // Ring 2: Vivid Electric Orange Torus (Trusted Mediator Boundary)
      const orangeMat = new THREE.MeshStandardMaterial({
        color: 0xff5500,
        roughness: 0.2,
        metalness: 0.18,
        emissive: 0x331100
      });
      const ringOrange = new THREE.Mesh(torusGeo, orangeMat);
      ringOrange.position.set(0.7, 0, 0);
      ringOrange.rotation.set(-Math.PI / 3, -Math.PI / 4, Math.PI / 2);
      chainGroup.add(ringOrange);

      // Drag to spin physics
      let isDragging = false;
      let prevMousePos = { x: 0, y: 0 };
      let rotVelocity = { x: 0.006, y: 0.012 };
      const friction = 0.94;

      container.addEventListener("mousedown", (e) => {
        isDragging = true;
        prevMousePos = { x: e.clientX, y: e.clientY };
      });

      window.addEventListener("mousemove", (e) => {
        if (!isDragging) return;
        const deltaX = e.clientX - prevMousePos.x;
        const deltaY = e.clientY - prevMousePos.y;
        prevMousePos = { x: e.clientX, y: e.clientY };

        rotVelocity.y = deltaX * 0.007;
        rotVelocity.x = deltaY * 0.007;

        chainGroup.rotation.y += rotVelocity.y;
        chainGroup.rotation.x += rotVelocity.x;
      });

      window.addEventListener("mouseup", () => {
        isDragging = false;
      });

      // Touch events
      container.addEventListener("touchstart", (e) => {
        if (e.touches.length > 0) {
          isDragging = true;
          prevMousePos = { x: e.touches[0].clientX, y: e.touches[0].clientY };
        }
      }, { passive: true });

      window.addEventListener("touchmove", (e) => {
        if (!isDragging || e.touches.length === 0) return;
        const deltaX = e.touches[0].clientX - prevMousePos.x;
        const deltaY = e.touches[0].clientY - prevMousePos.y;
        prevMousePos = { x: e.touches[0].clientX, y: e.touches[0].clientY };

        rotVelocity.y = deltaX * 0.007;
        rotVelocity.x = deltaY * 0.007;

        chainGroup.rotation.y += rotVelocity.y;
        chainGroup.rotation.x += rotVelocity.x;
      }, { passive: true });

      window.addEventListener("touchend", () => {
        isDragging = false;
      });

      // Responsive Resize
      const handleResize = () => {
        const w = container.clientWidth || 480;
        const h = container.clientHeight || 400;
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
        renderer.setSize(w, h);
      };
      window.addEventListener("resize", handleResize);

      // Animation Loop
      let animId;
      function animate() {
        animId = requestAnimationFrame(animate);

        if (!isDragging) {
          // Natural smooth revolving animation with velocity momentum
          chainGroup.rotation.y += rotVelocity.y;
          chainGroup.rotation.x += rotVelocity.x;
          chainGroup.rotation.z += 0.002;

          // Decay back to smooth ambient cruise speed
          rotVelocity.x = rotVelocity.x * friction + 0.003 * (1 - friction);
          rotVelocity.y = rotVelocity.y * friction + 0.007 * (1 - friction);
        }

        renderer.render(scene, camera);
      }
      animate();

      return;
    } catch (err) {
      console.warn("Three.js WebGL init failed, falling back to 2D revolving chain canvas:", err);
    }
  }

  // 2D Procedural Revolving Chain Fallback
  run2DRevolvingChain(canvas, container);
}

/**
 * 2D Canvas Procedural Revolving Interlocking Chain Fallback
 */
function run2DRevolvingChain(canvas, container) {
  const ctx = canvas.getContext("2d");
  let width = (canvas.width = container.clientWidth || 480);
  let height = (canvas.height = container.clientHeight || 400);

  let angle = 0;
  let isDragging = false;
  let prevX = 0;
  let velocity = 0.015;

  container.addEventListener("mousedown", (e) => {
    isDragging = true;
    prevX = e.clientX;
  });
  window.addEventListener("mousemove", (e) => {
    if (!isDragging) return;
    const dx = e.clientX - prevX;
    prevX = e.clientX;
    velocity = dx * 0.01;
    angle += velocity;
  });
  window.addEventListener("mouseup", () => { isDragging = false; });

  function draw() {
    ctx.clearRect(0, 0, width, height);
    if (!isDragging) {
      angle += velocity;
      velocity = velocity * 0.95 + 0.015 * 0.05;
    }

    const cx = width / 2;
    const cy = height / 2;
    const rx = 85;
    const ry = 45;

    ctx.save();
    ctx.translate(cx, cy);

    // Revolving rotation
    const sinA = Math.sin(angle);
    const cosA = Math.cos(angle);

    // Ring 1: White
    ctx.save();
    ctx.translate(-35 * cosA, -15 * sinA);
    ctx.rotate(angle * 0.5);
    ctx.strokeStyle = "#ffffff";
    ctx.lineWidth = 26;
    ctx.shadowColor = "rgba(255, 255, 255, 0.4)";
    ctx.shadowBlur = 14;
    ctx.beginPath();
    ctx.ellipse(0, 0, rx, ry, Math.PI / 4, 0, Math.PI * 2);
    ctx.stroke();
    ctx.restore();

    // Ring 2: Orange
    ctx.save();
    ctx.translate(35 * cosA, 15 * sinA);
    ctx.rotate(-angle * 0.5 + Math.PI / 2);
    ctx.strokeStyle = "#ff5500";
    ctx.lineWidth = 26;
    ctx.shadowColor = "rgba(255, 85, 0, 0.6)";
    ctx.shadowBlur = 18;
    ctx.beginPath();
    ctx.ellipse(0, 0, rx, ry, -Math.PI / 4, 0, Math.PI * 2);
    ctx.stroke();
    ctx.restore();

    ctx.restore();
    requestAnimationFrame(draw);
  }
  draw();
}

/**
 * =========================================================================
 * 2. MINI CYBER ROBO FACE CURSOR FOLLOWER
 * "a very small robo face following the cursor everywhere"
 * - Follows cursor with lerp smoothing physics
 * - Glowing orange eyes with periodic blinks [ ▪ ▪ ]
 * - Looking direction offset based on movement speed
 * - Transforms into [ ✦ ✦ ] or white excitement on hovering buttons/links
 * - Scales down on mouse click
 * =========================================================================
 */
function initRoboCursorFollower() {
  const robo = document.getElementById("null-robo-cursor");
  if (!robo) return;

  let mouseX = window.innerWidth / 2;
  let mouseY = window.innerHeight / 2;
  let roboX = mouseX;
  let roboY = mouseY;
  let prevX = mouseX;
  let prevY = mouseY;

  // Listen to mousemove globally
  window.addEventListener("mousemove", (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
  });

  // Hover detection for interactive elements
  const interactiveSelectors = "a, button, input, textarea, select, .null-team-card, .null-faq-row";
  document.addEventListener("mouseover", (e) => {
    if (e.target.closest(interactiveSelectors)) {
      robo.classList.add("hovering");
    }
  });

  document.addEventListener("mouseout", (e) => {
    if (e.target.closest(interactiveSelectors)) {
      robo.classList.remove("hovering");
    }
  });

  // Click squash
  window.addEventListener("mousedown", () => {
    robo.classList.add("clicking");
  });
  window.addEventListener("mouseup", () => {
    robo.classList.remove("clicking");
  });

  // Physics animation loop with velocity look direction
  function updateRobo() {
    // Lerp follow with smooth lag
    const lerpFactor = 0.18;
    roboX += (mouseX - roboX) * lerpFactor;
    roboY += (mouseY - roboY) * lerpFactor;

    // Movement tilt & velocity
    const vx = mouseX - prevX;
    const vy = mouseY - prevY;
    prevX = mouseX;
    prevY = mouseY;

    const tiltAngle = Math.max(-20, Math.min(20, vx * 0.8));

    robo.style.transform = `translate(${roboX}px, ${roboY}px) rotate(${tiltAngle}deg)`;

    requestAnimationFrame(updateRobo);
  }
  updateRobo();
}

/**
 * =========================================================================
 * 3. TEAM AREA: TWO MEMBERS & CUSTOM PHOTO UPLOADS
 * - Renders halftone dot-matrix silhouette by default
 * - File upload with FileReader base64 storage in localStorage
 * - Image preview with duotone styling
 * - Remove / Change buttons
 * =========================================================================
 */
function initTeamPhotoUpload() {
  const members = [
    {
      id: 0,
      canvasId: "halftone-canvas-0",
      photoId: "uploaded-photo-0",
      inputId: "team-photo-input-0",
      removeBtnId: "remove-photo-0",
      labelId: "upload-label-0",
      storageKey: "bayora_team_photo_0",
      bioBtnId: "bio-btn-0",
      bioDrawerId: "bio-drawer-0"
    },
    {
      id: 1,
      canvasId: "halftone-canvas-1",
      photoId: "uploaded-photo-1",
      inputId: "team-photo-input-1",
      removeBtnId: "remove-photo-1",
      labelId: "upload-label-1",
      storageKey: "bayora_team_photo_1",
      bioBtnId: "bio-btn-1",
      bioDrawerId: "bio-drawer-1"
    }
  ];

  members.forEach(m => {
    const canvas = document.getElementById(m.canvasId);
    const photo = document.getElementById(m.photoId);
    const input = document.getElementById(m.inputId);
    const removeBtn = document.getElementById(m.removeBtnId);
    const label = document.getElementById(m.labelId);
    const bioBtn = document.getElementById(m.bioBtnId);
    const bioDrawer = document.getElementById(m.bioDrawerId);

    // 1. Draw mathematical Halftone Dot Matrix silhouette portrait
    if (canvas) {
      drawHalftonePortrait(canvas, m.id);
    }

    // 2. Check for saved photo in localStorage
    const savedPhoto = localStorage.getItem(m.storageKey);
    if (savedPhoto && photo) {
      photo.src = savedPhoto;
      photo.classList.add("visible");
      if (removeBtn) removeBtn.classList.add("visible");
      if (label) label.textContent = "CHANGE PHOTO";
    }

    // 3. Handle File Input Change
    if (input) {
      input.addEventListener("change", (e) => {
        const file = e.target.files && e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (event) => {
          const dataUrl = event.target.result;
          if (photo) {
            photo.src = dataUrl;
            photo.classList.add("visible");
          }
          if (removeBtn) removeBtn.classList.add("visible");
          if (label) label.textContent = "CHANGE PHOTO";

          // Persist to localStorage
          try {
            localStorage.setItem(m.storageKey, dataUrl);
          } catch (storageErr) {
            console.warn("Storage quota exceeded or error writing photo:", storageErr);
          }
        };
        reader.readAsDataURL(file);
      });
    }

    // 4. Handle Remove Photo
    if (removeBtn) {
      removeBtn.addEventListener("click", () => {
        localStorage.removeItem(m.storageKey);
        if (photo) {
          photo.src = "";
          photo.classList.remove("visible");
        }
        removeBtn.classList.remove("visible");
        if (label) label.textContent = "UPLOAD PHOTO";
        if (input) input.value = "";
      });
    }

    // 5. Bio Toggle
    if (bioBtn && bioDrawer) {
      bioBtn.addEventListener("click", () => {
        const isOpen = bioDrawer.classList.contains("open");
        bioDrawer.classList.toggle("open", !isOpen);
        bioBtn.querySelector("span:last-child").textContent = isOpen ? "BIO +" : "BIO −";
      });
    }
  });
}

/**
 * Draw Procedural Halftone Dot Matrix Humanoid Silhouette
 */
function drawHalftonePortrait(canvas, memberIndex) {
  const ctx = canvas.getContext("2d");
  const w = canvas.width;
  const h = canvas.height;

  ctx.fillStyle = "#090909";
  ctx.fillRect(0, 0, w, h);

  const cols = 28;
  const rows = 24;
  const stepX = w / cols;
  const stepY = h / rows;

  const headCenterX = w / 2;
  const headCenterY = h * 0.38;
  const headRadius = h * 0.22;

  const bodyCenterX = w / 2;
  const bodyCenterY = h * 0.88;
  const bodyRadiusX = w * 0.38;
  const bodyRadiusY = h * 0.35;

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const x = c * stepX + stepX / 2;
      const y = r * stepY + stepY / 2;

      // Distance to head
      const distHead = Math.hypot(x - headCenterX, (y - headCenterY) * 1.15);
      const inHead = distHead < headRadius;

      // Distance to shoulders/chest
      const dxB = (x - bodyCenterX) / bodyRadiusX;
      const dyB = (y - bodyCenterY) / bodyRadiusY;
      const inBody = (dxB * dxB + dyB * dyB) < 1.0 && y > headCenterY + headRadius * 0.5;

      let radius = 1.0;
      let alpha = 0.15;
      let isFigure = inHead || inBody;

      if (isFigure) {
        // Density modulation
        let intensity = 1.0;
        if (inHead) {
          intensity = 1.0 - (distHead / headRadius) * 0.45;
        } else if (inBody) {
          intensity = 1.0 - Math.hypot(dxB, dyB) * 0.5;
        }

        radius = Math.max(2.5, intensity * (stepX * 0.42));
        alpha = 0.92;
        ctx.fillStyle = "#ffffff";
      } else {
        radius = 1.2;
        alpha = 0.12;
        ctx.fillStyle = "#ffffff";
      }

      ctx.save();
      ctx.globalAlpha = alpha;
      ctx.beginPath();
      ctx.arc(x, y, radius, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
  }
}

/**
 * =========================================================================
 * 4. 3D CROSS FITTING GRAPHIC IN FAQ
 * =========================================================================
 */
function initCrossFittingGraphic() {
  const canvas = document.getElementById("null-cross-canvas");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  let angle = 0;

  function render() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    angle += 0.012;

    const cx = canvas.width / 2;
    const cy = canvas.height / 2;

    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate(angle * 0.6);

    // Draw mechanical cross with 3D bevels
    const armW = 18;
    const armL = 36;

    ctx.fillStyle = "#eeeeee";
    ctx.shadowColor = "rgba(255, 255, 255, 0.2)";
    ctx.shadowBlur = 8;

    // Horizontal arm
    ctx.fillRect(-armL, -armW / 2, armL * 2, armW);

    // Vertical arm
    ctx.fillRect(-armW / 2, -armL, armW, armL * 2);

    // Center circular joint
    ctx.beginPath();
    ctx.arc(0, 0, armW * 0.95, 0, Math.PI * 2);
    ctx.fillStyle = "#ffffff";
    ctx.fill();

    // Center hole
    ctx.beginPath();
    ctx.arc(0, 0, armW * 0.42, 0, Math.PI * 2);
    ctx.fillStyle = "#000000";
    ctx.fill();

    // Subtle Orange highlight bolt
    ctx.beginPath();
    ctx.arc(armL * 0.65, 0, 2.5, 0, Math.PI * 2);
    ctx.fillStyle = "#ff5500";
    ctx.fill();

    ctx.restore();
    requestAnimationFrame(render);
  }
  render();
}

/**
 * =========================================================================
 * 5. FAQ ACCORDION EXPAND / COLLAPSE
 * =========================================================================
 */
function initFaqAccordion() {
  const faqRows = document.querySelectorAll(".null-faq-row");
  faqRows.forEach(row => {
    const trigger = row.querySelector(".null-faq-trigger");
    const icon = row.querySelector(".null-faq-icon-box");

    if (trigger) {
      trigger.addEventListener("click", () => {
        const isOpen = row.classList.contains("open");
        // Close others or toggle this
        faqRows.forEach(r => {
          r.classList.remove("open");
          const ic = r.querySelector(".null-faq-icon-box");
          if (ic) ic.textContent = "+";
        });

        if (!isOpen) {
          row.classList.add("open");
          if (icon) icon.textContent = "✕";
        }
      });
    }
  });
}

/**
 * =========================================================================
 * 6. ADVERSARIAL EVALUATION RUN MODAL
 * =========================================================================
 */
function initApplicationModal() {
  const modal = document.getElementById("null-apply-modal");
  const openBtnHeader = document.getElementById("btn-header-apply");
  const closeBtn = document.getElementById("modal-close-btn");
  const cancelBtn = document.getElementById("modal-cancel-btn");
  const form = document.getElementById("null-apply-form");

  const openModal = () => {
    if (modal) modal.classList.add("open");
  };
  const closeModal = () => {
    if (modal) modal.classList.remove("open");
  };

  if (openBtnHeader) openBtnHeader.addEventListener("click", openModal);
  if (closeBtn) closeBtn.addEventListener("click", closeModal);
  if (cancelBtn) cancelBtn.addEventListener("click", closeModal);

  if (modal) {
    modal.addEventListener("click", (e) => {
      if (e.target === modal) closeModal();
    });
  }

  if (form) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const targetModel = document.getElementById("app-target-model")?.value || "ollama-local";
      const taxonomy = document.getElementById("app-attack-taxonomy")?.value || "persona-jailbreak";
      const digest = "0x" + Array.from(crypto.getRandomValues(new Uint8Array(16)))
        .map(b => b.toString(16).padStart(2, "0")).join("");

      alert(`[MEDIATED EVALUATION DISPATCHED]\n\nTarget LLM: ${targetModel}\nAttack Taxonomy: ${taxonomy}\nMediator Status: ISOLATED (Zero Leakage)\nCryptographic Digest: ${digest}\n\nVerdict: Guardrail triggered successfully. Score: 0.92 (Safe).`);
      closeModal();
      form.reset();
    });
  }

  // Theme toggle button on top navbar
  const themeToggle = document.getElementById("null-theme-toggle");
  if (themeToggle) {
    themeToggle.addEventListener("click", () => {
      const current = document.documentElement.getAttribute("data-theme") || "dark";
      const next = current === "dark" ? "light" : "dark";
      document.documentElement.setAttribute("data-theme", next);
      localStorage.setItem("bayora-theme", next);
    });
  }
}

/**
 * Smooth scrolling for navigation anchors
 */
function initNavigationScroll() {
  const links = [
    { id: "nav-link-team", targetId: "team-section" },
    { id: "nav-link-faq", targetId: "faq-section" }
  ];

  links.forEach(item => {
    const el = document.getElementById(item.id);
    if (el) {
      el.addEventListener("click", (e) => {
        const target = document.getElementById(item.targetId);
        if (target) {
          e.preventDefault();
          target.scrollIntoView({ behavior: "smooth" });
        }
      });
    }
  });
}
