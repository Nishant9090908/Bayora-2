/**
 * =========================================================================
 * EVALUATION DETAILS & PIPELINE PROVENANCE
 * Multi-stage pipeline visualizer with sanitized view projections & hash proofs
 * =========================================================================
 */
import { SAMPLE_DATA } from "../mock-data.js";

export function renderEvaluation(container, appState) {
  const ev = SAMPLE_DATA.currentEvaluation;
  let activeProjection = "auditor"; // "auditor" | "red" | "blue"

  function updateView() {
    const projectionHtml = getProjectionHtml(activeProjection, ev);

    container.innerHTML = `
      <div class="workspace-header">
        <div class="workspace-title-area">
          <div class="pillar-icon-box purple" style="width: 36px; height: 36px; font-size: 1rem; margin-bottom: 0;">🔬</div>
          <div>
            <h2>Evaluation Run: <span class="font-mono" style="color: #38bdf8;">${ev.id}</span></h2>
            <p class="card-description">Mediated pipeline execution with cryptographic non-repudiation</p>
          </div>
        </div>
        <div style="display: flex; gap: 8px; align-items: center;">
          <span class="badge ${ev.overallOutcome === 'BLOCKED' ? 'badge-emerald' : 'badge-red'}">
            OUTCOME: ${ev.overallOutcome}
          </span>
          <span class="badge badge-muted font-mono">LATENCY: ${ev.latencyMs}ms</span>
        </div>
      </div>

      <!-- 4-Stage Mediated Evaluation Pipeline -->
      <div class="pipeline-container">
        <div class="pipeline-step success">
          <div class="step-circle">01</div>
          <span class="step-name">Input Pre-Filter</span>
          <span class="step-meta" style="color: #6ee7b7;">Regex & Banned List</span>
        </div>

        <div class="pipeline-connector"></div>

        <div class="pipeline-step active">
          <div class="step-circle">02</div>
          <span class="step-name">Mediated LLM Query</span>
          <span class="step-meta" style="color: #38bdf8;">Isolated API Invocation</span>
        </div>

        <div class="pipeline-connector"></div>

        <div class="pipeline-step success">
          <div class="step-circle">03</div>
          <span class="step-name">Output Safety Judge</span>
          <span class="step-meta" style="color: #6ee7b7;">Safety Score: 92/100</span>
        </div>

        <div class="pipeline-connector"></div>

        <div class="pipeline-step success">
          <div class="step-circle">04</div>
          <span class="step-name">Cryptographic Provenance</span>
          <span class="step-meta" style="color: #c084fc;">SHA-256 Digest</span>
        </div>
      </div>

      <!-- Sanitized Projection View Switcher -->
      <div class="card" style="margin-bottom: var(--space-6);">
        <div class="card-header">
          <div>
            <span class="card-title">Sanitized Role View Projection (Mutual Data Isolation)</span>
            <p class="card-description">Demonstrating how the backend strips unauthorized fields before JSON response delivery</p>
          </div>
          
          <div class="projection-pill-group">
            <button id="proj-auditor" class="projection-btn ${activeProjection === 'auditor' ? 'active' : ''}">Auditor (Unredacted)</button>
            <button id="proj-red" class="projection-btn ${activeProjection === 'red' ? 'active' : ''}">Red Team View</button>
            <button id="proj-blue" class="projection-btn ${activeProjection === 'blue' ? 'active' : ''}">Blue Team View</button>
          </div>
        </div>

        <!-- Rendered Projection Content -->
        <div id="projection-content">
          ${projectionHtml}
        </div>
      </div>

      <!-- Cryptographic Provenance & Integrity Proof -->
      <div class="card">
        <div class="card-header">
          <span class="card-title">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
            Cryptographic Evaluation Provenance Proof
          </span>
          <span class="badge badge-emerald" id="integrity-badge">DIGEST VERIFIED</span>
        </div>

        <div style="background-color: var(--bg-primary); padding: var(--space-4); border-radius: var(--radius-md); border: 1px solid var(--border-subtle); margin-bottom: var(--space-4);">
          <div style="font-size: 0.75rem; text-transform: uppercase; color: var(--text-muted); font-weight: 600; margin-bottom: 4px;">SHA-256 Evaluation Digest</div>
          <div class="font-mono" style="font-size: 0.84rem; color: #38bdf8; word-break: break-all;">
            ${ev.provenanceHash}
          </div>
          <div style="font-size: 0.72rem; color: var(--text-muted); margin-top: 6px;">
            Formula: <code>SHA256(prompt_id || defense_id || prompt_text || defense_config || response || timestamp)</code>
          </div>
        </div>

        <div style="display: flex; gap: 12px; align-items: center;">
          <button id="btn-verify-hash" class="btn btn-secondary">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
            Recompute & Verify Hash Integrity
          </button>
          <span id="verify-feedback" style="font-size: 0.82rem; color: var(--text-muted);">
            Click to simulate server-side tamper check.
          </span>
        </div>
      </div>
    `;

    // Attach Switcher Listeners
    document.getElementById("proj-auditor")?.addEventListener("click", () => {
      activeProjection = "auditor";
      updateView();
    });
    document.getElementById("proj-red")?.addEventListener("click", () => {
      activeProjection = "red";
      updateView();
    });
    document.getElementById("proj-blue")?.addEventListener("click", () => {
      activeProjection = "blue";
      updateView();
    });

    // Hash verification simulation
    document.getElementById("btn-verify-hash")?.addEventListener("click", () => {
      const fb = document.getElementById("verify-feedback");
      const badge = document.getElementById("integrity-badge");
      fb.innerHTML = `<span style="color: #10b981;">✓ Hash matches ground truth inputs. Zero retroactive tampering detected!</span>`;
      badge.textContent = "VERIFIED UNTAMPERED";
      badge.className = "badge badge-emerald";
      appState.showToast("Evaluation provenance successfully re-verified against ground truth!", "success");
    });
  }

  function getProjectionHtml(projection, data) {
    if (projection === "auditor") {
      const v = data.views.auditor;
      return `
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px;">
          <div>
            <label class="form-label">Raw Red Team Adversarial Prompt</label>
            <div class="form-textarea" style="background-color: var(--bg-primary); min-height: 100px; color: #fca5a5;">
              ${v.rawAttackPrompt}
            </div>
          </div>
          <div>
            <label class="form-label">Raw Blue Team Defensive System Prompt</label>
            <div class="form-textarea" style="background-color: var(--bg-primary); min-height: 100px; color: #7dd3fc;">
              ${v.rawDefenseSystemPrompt}
            </div>
          </div>
        </div>

        <div style="margin-top: 16px;">
          <label class="form-label">Target Client LLM Response</label>
          <div class="form-textarea" style="background-color: var(--bg-primary); min-height: 70px; color: #a7f3d0;">
            ${v.modelResponse}
          </div>
        </div>

        <div style="margin-top: 12px; font-size: 0.78rem; color: #10b981;">
          ✓ Full Auditor Perspective: Complete visibility into all parameters for accredited compliance oversight.
        </div>
      `;
    } else if (projection === "red") {
      const v = data.views.redTeamView;
      return `
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px;">
          <div>
            <label class="form-label">Your Adversarial Attack Prompt</label>
            <div class="form-textarea" style="background-color: var(--bg-primary); min-height: 100px; color: #fca5a5;">
              ${v.attackPrompt}
            </div>
          </div>
          <div>
            <label class="form-label">Opposing Blue Team Defensive Strategy</label>
            <div class="protected-box">
              🔒 <strong>${v.defensePolicyInfo}</strong>
              <p style="margin-top: 8px; font-size: 0.76rem; color: #94a3b8;">
                Defensive system prompt wrappers, custom regex rules, and internal guardrail thresholds are confidential to Blue Team.
              </p>
            </div>
          </div>
        </div>

        <div style="margin-top: 16px;">
          <label class="form-label">Model Evaluation Response (Sanitized)</label>
          <div class="form-textarea" style="background-color: var(--bg-primary); min-height: 70px; color: #e2e8f0;">
            ${v.modelResponseSnippet}
          </div>
        </div>

        <div style="margin-top: 12px; font-size: 0.78rem; color: #38bdf8;">
          ℹ️ Red Team Perspective: You receive your attack outcome and safety metrics without exposing Blue Team's internal evasion defenses.
        </div>
      `;
    } else {
      const v = data.views.blueTeamView;
      return `
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px;">
          <div>
            <label class="form-label">Tested Red Team Adversarial Attack</label>
            <div class="redacted-box">
              🔒 <strong>${v.rawAttackPayload}</strong>
              <p style="margin-top: 8px; font-size: 0.76rem; color: #94a3b8;">
                Category: <code>${v.attackCategory}</code>. Raw zero-day prompts are intellectual property of the Red Team and masked by backend schema.
              </p>
            </div>
          </div>
          <div>
            <label class="form-label">Your Defensive Guardrail Implementation</label>
            <div class="form-textarea" style="background-color: var(--bg-primary); min-height: 100px; color: #7dd3fc;">
              ${v.defenseSystemPrompt}
            </div>
          </div>
        </div>

        <div style="margin-top: 16px;">
          <label class="form-label">Model Defensive Outcome</label>
          <div class="form-textarea" style="background-color: var(--bg-primary); min-height: 70px; color: #a7f3d0;">
            ${v.modelResponseSnippet}
          </div>
        </div>

        <div style="margin-top: 12px; font-size: 0.78rem; color: #10b981;">
          ℹ️ Blue Team Perspective: You verify defense efficacy against standardized taxonomy without leaking Red Team's proprietary exploit payloads.
        </div>
      `;
    }
  }

  updateView();
}
