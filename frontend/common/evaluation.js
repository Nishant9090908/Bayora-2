/**
 * =========================================================================
 * EVALUATION DETAILS & PIPELINE PROVENANCE (Common / Shared Portal)
 * Pixel-perfect Efferd Dark Dashboard Layout: Strict Black, White & Orange
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
  } catch (_) {}

  function updateView() {
    const projectionHtml = getProjectionHtml(activeProjection, ev);

    container.innerHTML = `
      <div class="efferd-dashboard">
        <!-- 1. Top Metrics Row (Exact Efferd Layout) -->
        <div class="efferd-metrics-row">
          <div class="efferd-metric-card">
            <span class="efferd-metric-label">Evaluation Run ID</span>
            <span class="efferd-metric-num" style="font-size: 1.6rem; font-family: 'Space Mono', monospace; color: #ffffff;">${ev.id}</span>
            <div class="efferd-metric-trend trend-orange">
              <span>● COMMITTED</span> <span class="vs-text">in pg-mem</span>
            </div>
          </div>
          <div class="efferd-metric-card">
            <span class="efferd-metric-label">Overall Outcome</span>
            <span class="efferd-metric-num" style="color: ${ev.overallOutcome === 'BLOCKED' ? '#ffffff' : '#ff5500'};">${ev.overallOutcome}</span>
            <div class="efferd-metric-trend ${ev.overallOutcome === 'BLOCKED' ? 'trend-orange' : 'trend-down'}">
              <span>Safety Score: ${ev.safetyScore || 94.0}/100</span>
            </div>
          </div>
          <div class="efferd-metric-card">
            <span class="efferd-metric-label">Target Model</span>
            <span class="efferd-metric-num" style="font-size: 1.4rem; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${ev.targetModel || 'llama3.2:1b'}</span>
            <div class="efferd-metric-trend trend-orange">
              <span>Mediated Sandbox</span>
            </div>
          </div>
          <div class="efferd-metric-card">
            <span class="efferd-metric-label">Latency / Tokens</span>
            <span class="efferd-metric-num" style="font-size: 1.6rem; font-family: 'Space Mono', monospace;">${ev.latencyMs || 240}ms</span>
            <div class="efferd-metric-trend trend-orange">
              <span>${ev.evalCount || 18} eval tokens</span>
            </div>
          </div>
        </div>

        <!-- 2. 4-Stage Mediated Evaluation Pipeline -->
        <div style="padding: 24px 28px; border-bottom: 1px solid #1a1a1a;">
          <div class="efferd-card-heading">4-Stage Mediated Evaluation Pipeline</div>
          <div class="efferd-card-subheading">Sequential guardrail verification with non-repudiable audit proofs</div>

          <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; margin-top: 16px;">
            <div style="background: #080808; border: 1px solid #222222; border-radius: 6px; padding: 16px;">
              <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 8px;">
                <span style="font-family: 'Space Mono', monospace; font-size: 0.72rem; color: #ff5500; font-weight: 700;">STAGE 01</span>
                <span style="width: 8px; height: 8px; border-radius: 50%; background: #ff5500;"></span>
              </div>
              <div style="font-weight: 600; font-size: 0.9rem; color: #ffffff; margin-bottom: 4px;">Input Pre-Filter</div>
              <div style="font-size: 0.75rem; color: #666666;">Regex & Banned Keywords</div>
            </div>

            <div style="background: #080808; border: 1px solid #222222; border-radius: 6px; padding: 16px;">
              <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 8px;">
                <span style="font-family: 'Space Mono', monospace; font-size: 0.72rem; color: #ff5500; font-weight: 700;">STAGE 02</span>
                <span style="width: 8px; height: 8px; border-radius: 50%; background: #ff5500;"></span>
              </div>
              <div style="font-weight: 600; font-size: 0.9rem; color: #ffffff; margin-bottom: 4px;">Mediated LLM Query</div>
              <div style="font-size: 0.75rem; color: #666666;">Isolated Target Invocation</div>
            </div>

            <div style="background: #080808; border: 1px solid #222222; border-radius: 6px; padding: 16px;">
              <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 8px;">
                <span style="font-family: 'Space Mono', monospace; font-size: 0.72rem; color: #ff5500; font-weight: 700;">STAGE 03</span>
                <span style="width: 8px; height: 8px; border-radius: 50%; background: #ff5500;"></span>
              </div>
              <div style="font-weight: 600; font-size: 0.9rem; color: #ffffff; margin-bottom: 4px;">Safety Judge</div>
              <div style="font-size: 0.75rem; color: #666666;">Score: ${ev.safetyScore || 94.0}/100</div>
            </div>

            <div style="background: #080808; border: 1px solid #222222; border-radius: 6px; padding: 16px;">
              <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 8px;">
                <span style="font-family: 'Space Mono', monospace; font-size: 0.72rem; color: #ff5500; font-weight: 700;">STAGE 04</span>
                <span style="width: 8px; height: 8px; border-radius: 50%; background: #ff5500;"></span>
              </div>
              <div style="font-weight: 600; font-size: 0.9rem; color: #ffffff; margin-bottom: 4px;">SHA-256 Digest</div>
              <div style="font-size: 0.75rem; color: #666666;">Cryptographic Provenance</div>
            </div>
          </div>
        </div>

        <!-- 3. Sanitized View Projections -->
        <div style="padding: 24px 28px; border-bottom: 1px solid #1a1a1a;">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px; flex-wrap: wrap; gap: 12px;">
            <div>
              <div class="efferd-card-heading">Sanitized Role View Projection (Mutual Isolation)</div>
              <div class="efferd-card-subheading" style="margin-bottom: 0;">Backend strips opposing proprietary fields before delivery</div>
            </div>
            
            <div style="display: flex; gap: 8px;">
              <button id="proj-auditor" class="efferd-btn-dark ${activeProjection === 'auditor' ? 'efferd-btn-orange' : ''}" style="padding: 6px 14px; font-size: 0.8rem;">Auditor (Full)</button>
              <button id="proj-red" class="efferd-btn-dark ${activeProjection === 'red' ? 'efferd-btn-orange' : ''}" style="padding: 6px 14px; font-size: 0.8rem;">Red Team View</button>
              <button id="proj-blue" class="efferd-btn-dark ${activeProjection === 'blue' ? 'efferd-btn-blue' : ''}" style="padding: 6px 14px; font-size: 0.8rem;">Blue Team View</button>
            </div>
          </div>

          <div id="projection-content">
            ${projectionHtml}
          </div>
        </div>

        <!-- 4. Cryptographic Provenance Ledger Proof -->
        <div style="padding: 24px 28px; background-color: #020202;">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 14px;">
            <div>
              <div class="efferd-card-heading">Cryptographic Evaluation Provenance Proof</div>
              <div class="efferd-card-subheading" style="margin-bottom: 0;">Tamper-evident verification formula</div>
            </div>
            <span class="badge badge-emerald" id="integrity-badge">DIGEST COMMITTED</span>
          </div>

          <div style="background: #000000; border: 1px solid #222222; border-radius: 6px; padding: 14px; margin-bottom: 16px;">
            <div style="font-size: 0.72rem; text-transform: uppercase; color: #888888; font-weight: 700; margin-bottom: 6px; letter-spacing: 0.05em;">SHA-256 Digest String</div>
            <div style="font-family: 'Space Mono', monospace; font-size: 0.82rem; color: #ffffff; word-break: break-all; font-weight: 600;">
              ${ev.provenanceHash || 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855'}
            </div>
          </div>

          <div style="display: flex; gap: 14px; align-items: center; flex-wrap: wrap;">
            <button id="btn-verify-hash" class="efferd-btn-orange">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
              Recompute & Verify Hash Integrity
            </button>
            <span id="verify-feedback" style="font-size: 0.82rem; color: #888888;">
              Click to query backend verification endpoint.
            </span>
          </div>
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
      fb.innerHTML = `<span style="color: #ff5500;">Connecting to backend provenance verification enclave...</span>`;

      try {
        const result = await apiClient.verifyProvenance(ev.id);
        if (result.verified && !result.tamperDetected) {
          fb.innerHTML = `<span style="color: #10b981; font-weight: 600;">✓ Hash matches ground truth database inputs. Zero retroactive tampering detected!</span>`;
          badge.textContent = "VERIFIED UNTAMPERED";
          badge.className = "badge badge-emerald";
          appState.showToast("Evaluation provenance successfully re-verified!", "success");
        } else {
          fb.innerHTML = `<span style="color: #ef4444; font-weight: 600;">🚨 Cryptographic mismatch! Potential ledger tampering detected.</span>`;
          badge.textContent = "TAMPER DETECTED";
          badge.className = "badge badge-red";
          appState.showToast("Cryptographic provenance check failed!", "error");
        }
      } catch (err) {
        fb.innerHTML = `<span style="color: #ff5500;">Verification query error: ${err.message}</span>`;
      }
    });
  }

  function getProjectionHtml(projection, data) {
    if (projection === "auditor") {
      const v = data?.views?.auditor || {
        rawAttackPrompt: data?.attackPrompt || "[RAW ATTACK PROMPT]",
        rawDefenseSystemPrompt: "[CONFIDENTIAL BLUE SHIELD SYSTEM PROMPT]",
        modelResponse: data?.modelResponse || "[MODEL RESPONSE]"
      };
      return `
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px;">
          <div>
            <label style="display: block; font-size: 0.8rem; color: #888888; margin-bottom: 6px;">Raw Red Team Adversarial Prompt</label>
            <div style="background: #000000; border: 1px solid #222222; border-radius: 6px; padding: 12px; font-family: 'Space Mono', monospace; font-size: 0.82rem; color: #ffffff; min-height: 90px;">
              ${v.rawAttackPrompt}
            </div>
          </div>
          <div>
            <label style="display: block; font-size: 0.8rem; color: #888888; margin-bottom: 6px;">Raw Blue Team Defensive System Prompt</label>
            <div style="background: #000000; border: 1px solid #222222; border-radius: 6px; padding: 12px; font-family: 'Space Mono', monospace; font-size: 0.82rem; color: #ffffff; min-height: 90px;">
              ${v.rawDefenseSystemPrompt}
            </div>
          </div>
        </div>

        <div style="margin-top: 14px;">
          <label style="display: block; font-size: 0.8rem; color: #888888; margin-bottom: 6px;">Target Client LLM Response</label>
          <div style="background: #000000; border: 1px solid #222222; border-radius: 6px; padding: 12px; font-family: 'Space Mono', monospace; font-size: 0.82rem; color: #ffffff; min-height: 60px;">
            ${v.modelResponse}
          </div>
        </div>
      `;
    } else if (projection === "red") {
      const v = data?.views?.redTeamView || {
        attackPrompt: data?.attackPrompt || "[YOUR ATTACK PROMPT]",
        defensePolicyInfo: "DEF-201 Active Wrapper",
        modelResponseSnippet: data?.modelResponse || "[SANITIZED MODEL SNIPPET]"
      };
      return `
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px;">
          <div>
            <label style="display: block; font-size: 0.8rem; color: #888888; margin-bottom: 6px;">Your Adversarial Attack Prompt</label>
            <div style="background: #000000; border: 1px solid #222222; border-radius: 6px; padding: 12px; font-family: 'Space Mono', monospace; font-size: 0.82rem; color: #ffffff; min-height: 90px;">
              ${v.attackPrompt}
            </div>
          </div>
          <div>
            <label style="display: block; font-size: 0.8rem; color: #888888; margin-bottom: 6px;">Opposing Blue Team Defensive Strategy</label>
            <div style="background: #090909; border: 1px dashed #333333; border-radius: 6px; padding: 14px; min-height: 90px;">
              <span style="color: #ff5500; font-weight: 600;">🔒 ${v.defensePolicyInfo}</span>
              <p style="margin-top: 8px; font-size: 0.78rem; color: #666666;">
                Defensive system prompt wrappers and regex rules are confidential to Blue Team.
              </p>
            </div>
          </div>
        </div>

        <div style="margin-top: 14px;">
          <label style="display: block; font-size: 0.8rem; color: #888888; margin-bottom: 6px;">Model Evaluation Response (Sanitized)</label>
          <div style="background: #000000; border: 1px solid #222222; border-radius: 6px; padding: 12px; font-family: 'Space Mono', monospace; font-size: 0.82rem; color: #ffffff; min-height: 60px;">
            ${v.modelResponseSnippet}
          </div>
        </div>
      `;
    } else {
      const v = data?.views?.blueTeamView || {
        rawAttackPayload: "[REDACTED ADVERSARIAL PROMPT]",
        attackCategory: "Jailbreak / Roleplay Bypass",
        defenseSystemPrompt: "[YOUR SYSTEM PROMPT WRAPPER]",
        modelResponseSnippet: data?.modelResponse || "[DEFENSIVE OUTCOME]"
      };
      return `
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px;">
          <div>
            <label style="display: block; font-size: 0.8rem; color: #888888; margin-bottom: 6px;">Tested Red Team Adversarial Attack</label>
            <div style="background: #090909; border: 1px dashed #333333; border-radius: 6px; padding: 14px; min-height: 90px;">
              <span style="color: #ff5500; font-weight: 600;">🔒 ${v.rawAttackPayload}</span>
              <p style="margin-top: 8px; font-size: 0.78rem; color: #666666;">
                Category: <code>${v.attackCategory}</code>. Raw exploit payloads are confidential to Red Team.
              </p>
            </div>
          </div>
          <div>
            <label style="display: block; font-size: 0.8rem; color: #38bdf8; margin-bottom: 6px; font-weight: 600;">Your Defensive Guardrail Implementation (Blue Team)</label>
            <div style="background: #020f1a; border: 1px solid rgba(14, 165, 233, 0.4); border-radius: 6px; padding: 12px; font-family: 'Space Mono', monospace; font-size: 0.82rem; color: #ffffff; min-height: 90px;">
              ${v.defenseSystemPrompt}
            </div>
          </div>
        </div>

        <div style="margin-top: 14px;">
          <label style="display: block; font-size: 0.8rem; color: #888888; margin-bottom: 6px;">Model Defensive Outcome</label>
          <div style="background: #000000; border: 1px solid #222222; border-radius: 6px; padding: 12px; font-family: 'Space Mono', monospace; font-size: 0.82rem; color: #ffffff; min-height: 60px;">
            ${v.modelResponseSnippet}
          </div>
        </div>
      `;
    }
  }

  updateView();
}
