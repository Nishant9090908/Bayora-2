/**
 * =========================================================================
 * EVALUATION DETAILS & PIPELINE PROVENANCE (Common / Shared Portal)
 * Multi-stage pipeline visualizer with sanitized view projections & hash proofs
 * =========================================================================
 */
import { SAMPLE_DATA } from "../js/mock-data.js";
import { apiClient } from "../js/api.js";

export async function renderEvaluation(container, appState) {
  let ev = appState.activeEvaluation || SAMPLE_DATA.currentEvaluation;
  let activeProjection = "auditor"; // "auditor" | "red" | "blue"

  // Attempt to fetch latest evaluations from backend
  try {
    const list = await apiClient.getEvaluations();
    if (list && list.length > 0 && !appState.activeEvaluation) {
      ev = list[0];
    }
  } catch (_) {
    // Graceful fallback to cached or sample data
  }

  function updateView() {
    const projectionHtml = getProjectionHtml(activeProjection, ev);

    container.innerHTML = `
      <div class="workspace-header">
        <div class="workspace-title-area">
          <div class="pillar-icon-box purple" style="width: 36px; height: 36px; margin-bottom: 0;">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
            </svg>
          </div>
          <div>
            <h2>Evaluation Run: <span class="font-mono text-blue">${ev.id}</span></h2>
            <p class="card-description">
              Target: <strong class="text-blue">${ev.targetModel || 'Client LLM (Ollama llama3.2:1b Mediated)'}</strong>
            </p>
          </div>
        </div>
        <div style="display: flex; gap: 8px; align-items: center; flex-wrap: wrap;">
          <span class="badge ${ev.overallOutcome === 'BLOCKED' ? 'badge-emerald' : 'badge-red'}">
            OUTCOME: ${ev.overallOutcome}
          </span>
          <span class="badge badge-muted font-mono">LATENCY: ${ev.latencyMs}ms</span>
          <span class="badge badge-muted font-mono text-emerald">
            TOKENS: ${ev.evalCount || 0} eval / ${ev.promptEvalCount || 0} prompt
          </span>
        </div>
      </div>

      <!-- 4-Stage Mediated Evaluation Pipeline -->
      <div class="pipeline-container">
        <div class="pipeline-step success">
          <div class="step-circle">01</div>
          <span class="step-name">Input Pre-Filter</span>
          <span class="step-meta text-emerald">Regex & Banned List</span>
        </div>

        <div class="pipeline-connector"></div>

        <div class="pipeline-step active">
          <div class="step-circle">02</div>
          <span class="step-name">Mediated LLM Query</span>
          <span class="step-meta text-blue">Ollama llama3.2:1b</span>
        </div>

        <div class="pipeline-connector"></div>

        <div class="pipeline-step success">
          <div class="step-circle">03</div>
          <span class="step-name">Output Safety Judge</span>
          <span class="step-meta text-emerald">Safety Score: ${ev.safetyScore || 92.5}/100</span>
        </div>

        <div class="pipeline-connector"></div>

        <div class="pipeline-step success">
          <div class="step-circle">04</div>
          <span class="step-name">Cryptographic Provenance</span>
          <span class="step-meta text-purple">SHA-256 Digest</span>
        </div>
      </div>

      <!-- Sanitized Projection View Switcher -->
      <div class="card" style="margin-bottom: var(--space-6); border-top: 3px solid var(--color-purple);">
        <div class="card-header">
          <div>
            <span class="card-title">Sanitized Role View Projection (Mutual Data Isolation)</span>
            <p class="card-description">Backend strips opposing proprietary fields before JSON response delivery</p>
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
          <span class="badge badge-emerald" id="integrity-badge">DIGEST COMMITTED</span>
        </div>

        <div style="background-color: var(--bg-primary); padding: var(--space-4); border-radius: var(--radius-md); border: 1px solid var(--border-subtle); margin-bottom: var(--space-4);">
          <div style="font-size: 0.75rem; text-transform: uppercase; color: var(--text-muted); font-weight: 700; margin-bottom: 4px; letter-spacing: 0.04em;">SHA-256 Evaluation Digest</div>
          <div class="font-mono" style="font-size: 0.84rem; color: var(--color-blue-text); word-break: break-all; font-weight: 600;">
            ${ev.provenanceHash}
          </div>
          <div style="font-size: 0.74rem; color: var(--text-muted); margin-top: 6px;">
            Formula: <code>SHA256(prompt_id || defense_id || prompt_text || defense_config || response || timestamp)</code>
          </div>
        </div>

        <div style="display: flex; gap: 12px; align-items: center; flex-wrap: wrap;">
          <button id="btn-verify-hash" class="btn btn-secondary">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
            Recompute & Verify Hash Integrity
          </button>
          <span id="verify-feedback" style="font-size: 0.82rem; color: var(--text-muted);">
            Click to query backend verification endpoint.
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

    // Real server-side cryptographic tamper check
    document.getElementById("btn-verify-hash")?.addEventListener("click", async () => {
      const fb = document.getElementById("verify-feedback");
      const badge = document.getElementById("integrity-badge");
      fb.innerHTML = `<span class="text-blue">Connecting to backend provenance verification enclave...</span>`;

      try {
        const result = await apiClient.verifyProvenance(ev.id);
        if (result.verified && !result.tamperDetected) {
          fb.innerHTML = `<span class="text-emerald font-semibold">✓ Hash matches ground truth database inputs. Zero retroactive tampering detected!</span>`;
          badge.textContent = "VERIFIED UNTAMPERED";
          badge.className = "badge badge-emerald";
          appState.showToast("Evaluation provenance successfully re-verified against ground truth!", "success");
        } else {
          fb.innerHTML = `<span class="text-red font-semibold">🚨 Cryptographic mismatch! Potential ledger tampering detected.</span>`;
          badge.textContent = "TAMPER DETECTED";
          badge.className = "badge badge-red";
          appState.showToast("Cryptographic provenance check failed!", "error");
        }
      } catch (err) {
        fb.innerHTML = `<span class="text-amber">Verification query error: ${err.message}</span>`;
      }
    });
  }

  function getProjectionHtml(projection, data) {
    if (projection === "auditor") {
      const v = data.views.auditor;
      return `
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px;">
          <div>
            <label class="form-label">Raw Red Team Adversarial Prompt</label>
            <div class="form-textarea" style="background-color: var(--bg-primary); min-height: 100px; color: var(--color-red-text); font-weight: 500;">
              ${v.rawAttackPrompt}
            </div>
          </div>
          <div>
            <label class="form-label">Raw Blue Team Defensive System Prompt</label>
            <div class="form-textarea" style="background-color: var(--bg-primary); min-height: 100px; color: var(--color-blue-text); font-weight: 500;">
              ${v.rawDefenseSystemPrompt}
            </div>
          </div>
        </div>

        <div style="margin-top: 16px;">
          <label class="form-label">Target Client LLM Response</label>
          <div class="form-textarea" style="background-color: var(--bg-primary); min-height: 70px; color: var(--color-emerald-text); font-weight: 500;">
            ${v.modelResponse}
          </div>
        </div>

        <div style="margin-top: 12px; font-size: 0.8rem; color: var(--color-emerald-text); font-weight: 600;">
          ✓ Full Auditor Perspective: Complete visibility into all parameters for accredited compliance oversight.
        </div>
      `;
    } else if (projection === "red") {
      const v = data.views.redTeamView;
      return `
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px;">
          <div>
            <label class="form-label">Your Adversarial Attack Prompt</label>
            <div class="form-textarea" style="background-color: var(--bg-primary); min-height: 100px; color: var(--color-red-text); font-weight: 500;">
              ${v.attackPrompt}
            </div>
          </div>
          <div>
            <label class="form-label">Opposing Blue Team Defensive Strategy</label>
            <div class="protected-box">
              <span class="text-blue">🔒 <strong>${v.defensePolicyInfo}</strong></span>
              <p style="margin-top: 8px; font-size: 0.78rem; color: var(--text-muted);">
                Defensive system prompt wrappers, custom regex rules, and internal guardrail thresholds are confidential to Blue Team.
              </p>
            </div>
          </div>
        </div>

        <div style="margin-top: 16px;">
          <label class="form-label">Model Evaluation Response (Sanitized)</label>
          <div class="form-textarea" style="background-color: var(--bg-primary); min-height: 70px; color: var(--text-primary); font-weight: 500;">
            ${v.modelResponseSnippet}
          </div>
        </div>

        <div style="margin-top: 12px; font-size: 0.8rem; color: var(--color-blue-text); font-weight: 600;">
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
              <span class="text-red">🔒 <strong>${v.rawAttackPayload}</strong></span>
              <p style="margin-top: 8px; font-size: 0.78rem; color: var(--text-muted);">
                Category: <code>${v.attackCategory}</code>. Raw zero-day prompts are intellectual property of the Red Team and masked by backend schema.
              </p>
            </div>
          </div>
          <div>
            <label class="form-label">Your Defensive Guardrail Implementation</label>
            <div class="form-textarea" style="background-color: var(--bg-primary); min-height: 100px; color: var(--color-blue-text); font-weight: 500;">
              ${v.defenseSystemPrompt}
            </div>
          </div>
        </div>

        <div style="margin-top: 16px;">
          <label class="form-label">Model Defensive Outcome</label>
          <div class="form-textarea" style="background-color: var(--bg-primary); min-height: 70px; color: var(--color-emerald-text); font-weight: 500;">
            ${v.modelResponseSnippet}
          </div>
        </div>

        <div style="margin-top: 12px; font-size: 0.8rem; color: var(--color-emerald-text); font-weight: 600;">
          ℹ️ Blue Team Perspective: You verify defense efficacy against standardized taxonomy without leaking Red Team's proprietary exploit payloads.
        </div>
      `;
    }
  }

  updateView();
}
