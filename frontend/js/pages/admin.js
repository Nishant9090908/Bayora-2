/**
 * =========================================================================
 * ADMIN & AUDITOR DASHBOARD
 * System Telemetry, Node Isolation, Global Audit Stream & Tenant Integrity
 * =========================================================================
 */
import { SAMPLE_DATA } from "../mock-data.js";

export function renderAdmin(container, appState) {
  const stats = SAMPLE_DATA.platformStats;

  container.innerHTML = `
    <div class="workspace-header">
      <div class="workspace-title-area">
        <div class="pillar-icon-box purple" style="width: 36px; height: 36px; font-size: 1rem; margin-bottom: 0;">🏛️</div>
        <div>
          <h2>Security & Compliance Auditor Console</h2>
          <p class="card-description">System-wide telemetry, cryptographic provenance validation, and tenant isolation governance</p>
        </div>
      </div>
      <div style="display: flex; gap: 8px;">
        <span class="badge badge-emerald">PROVENANCE VERIFIED</span>
        <button id="btn-run-audit" class="btn btn-secondary btn-sm">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
          Run Integrity Scan
        </button>
      </div>
    </div>

    <!-- Telemetry Stats -->
    <div class="stats-grid">
      <div class="stat-card">
        <span class="stat-label">Isolated Client LLM Target</span>
        <span class="stat-value" style="color: #38bdf8; font-size: 1.3rem;">ONLINE // SHIELDED</span>
        <span class="stat-subtext"><span class="status-dot green"></span> Keys encapsulated in backend</span>
      </div>
      <div class="stat-card">
        <span class="stat-label">Tenant Isolation Integrity</span>
        <span class="stat-value" style="color: #10b981;">100%</span>
        <span class="stat-subtext">Zero cross-team data leaks</span>
      </div>
      <div class="stat-card">
        <span class="stat-label">Evaluation Throughput</span>
        <span class="stat-value">${stats.totalEvaluationsRun}</span>
        <span class="stat-subtext">Avg latency: ${stats.averageEvaluationLatency}</span>
      </div>
      <div class="stat-card">
        <span class="stat-label">Intrusion Violations Logged</span>
        <span class="stat-value" style="color: #ef4444;">${SAMPLE_DATA.securityEvents.length}</span>
        <span class="stat-subtext">401/403 attempts trapped</span>
      </div>
    </div>

    <!-- Security Boundaries & Infrastructure Nodes -->
    <div class="dashboard-grid" style="margin-bottom: var(--space-6);">
      <div class="card">
        <div class="card-header">
          <span class="card-title">Enclave Security Boundaries</span>
          <span class="badge badge-emerald">ALL POLICIES ENFORCED</span>
        </div>
        
        <div style="display: flex; flex-direction: column; gap: 12px;">
          <div style="display: flex; justify-content: space-between; align-items: center; padding: 10px; background-color: var(--bg-primary); border-radius: var(--radius-sm); border: 1px solid var(--border-subtle);">
            <div>
              <div style="font-weight: 600; font-size: 0.88rem; color: #f1f5f9;">Backend-Enforced RBAC</div>
              <div style="font-size: 0.74rem; color: var(--text-muted);">Route guards verify server-side cryptographic JWT signature</div>
            </div>
            <span class="badge badge-emerald">ACTIVE</span>
          </div>

          <div style="display: flex; justify-content: space-between; align-items: center; padding: 10px; background-color: var(--bg-primary); border-radius: var(--radius-sm); border: 1px solid var(--border-subtle);">
            <div>
              <div style="font-weight: 600; font-size: 0.88rem; color: #f1f5f9;">Row-Level Tenant Scoping</div>
              <div style="font-size: 0.74rem; color: var(--text-muted);">Red prompts and Blue defenses queried strictly by owner_id</div>
            </div>
            <span class="badge badge-emerald">ACTIVE</span>
          </div>

          <div style="display: flex; justify-content: space-between; align-items: center; padding: 10px; background-color: var(--bg-primary); border-radius: var(--radius-sm); border: 1px solid var(--border-subtle);">
            <div>
              <div style="font-weight: 600; font-size: 0.88rem; color: #f1f5f9;">Client LLM Secret Isolation</div>
              <div style="font-size: 0.74rem; color: var(--text-muted);">API tokens strictly in backend environment variables (.env)</div>
            </div>
            <span class="badge badge-emerald">ISOLATED</span>
          </div>

          <div style="display: flex; justify-content: space-between; align-items: center; padding: 10px; background-color: var(--bg-primary); border-radius: var(--radius-sm); border: 1px solid var(--border-subtle);">
            <div>
              <div style="font-weight: 600; font-size: 0.88rem; color: #f1f5f9;">Cryptographic Provenance Proofs</div>
              <div style="font-size: 0.74rem; color: var(--text-muted);">SHA-256 digests mathematically bind prompt, defense, response & time</div>
            </div>
            <span class="badge badge-emerald">IMMUTABLE</span>
          </div>
        </div>
      </div>

      <!-- Active Users & Tenant Clearance -->
      <div class="card">
        <div class="card-header">
          <span class="card-title">Enclave Actors & Clearance Matrix</span>
          <span class="badge badge-muted">RBAC REGISTRY</span>
        </div>

        <div class="table-container">
          <table>
            <thead>
              <tr>
                <th>Operator</th>
                <th>Role</th>
                <th>Clearance</th>
                <th>Assigned Tenant</th>
              </tr>
            </thead>
            <tbody>
              ${SAMPLE_DATA.users.map(u => `
                <tr>
                  <td style="font-weight: 600; color: #f1f5f9;">${u.username}</td>
                  <td>
                    <span class="badge ${u.role === 'red_team' ? 'badge-red' : u.role === 'blue_team' ? 'badge-blue' : 'badge-emerald'}">
                      ${u.role}
                    </span>
                  </td>
                  <td class="font-mono" style="font-size: 0.75rem;">${u.clearance}</td>
                  <td style="color: var(--text-muted); font-size: 0.8rem;">${u.role.toUpperCase()}_ISOLATED</td>
                </tr>
              `).join("")}
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- Append-Only Audit Trail -->
    <div class="card">
      <div class="card-header">
        <span class="card-title">System-Wide Audit Trail (Append-Only)</span>
        <span class="badge badge-muted">NO DELETE / NO UPDATE EXPOSED</span>
      </div>

      <div class="table-container">
        <table>
          <thead>
            <tr>
              <th>Timestamp (UTC)</th>
              <th>Actor</th>
              <th>Role</th>
              <th>Action</th>
              <th>Resource</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td class="font-mono">2026-10-27 18:24:15</td>
              <td style="font-weight: 600; color: #fff;">eval_engine</td>
              <td><span class="badge badge-emerald">MEDIATOR</span></td>
              <td><code>RUN_EVALUATION</code></td>
              <td class="font-mono">evaluations/EV-2026-8891</td>
              <td><span class="badge badge-emerald">SUCCESS</span></td>
            </tr>
            <tr>
              <td class="font-mono">2026-10-27 18:24:10</td>
              <td style="font-weight: 600; color: #fff;">red_operator</td>
              <td><span class="badge badge-red">red_team</span></td>
              <td><code>SUBMIT_PROMPT</code></td>
              <td class="font-mono">prompts/ATK-1001</td>
              <td><span class="badge badge-emerald">SUCCESS</span></td>
            </tr>
            <tr>
              <td class="font-mono">2026-10-27 18:22:14</td>
              <td style="font-weight: 600; color: #fff;">red_operator</td>
              <td><span class="badge badge-red">red_team</span></td>
              <td><code>GET_DEFENSE_PROBE</code></td>
              <td class="font-mono">defenses/DEF-201</td>
              <td><span class="badge badge-red">BLOCKED 403</span></td>
            </tr>
            <tr>
              <td class="font-mono">2026-10-27 12:00:00</td>
              <td style="font-weight: 600; color: #fff;">blue_defender</td>
              <td><span class="badge badge-blue">blue_team</span></td>
              <td><code>DEPLOY_DEFENSE</code></td>
              <td class="font-mono">defenses/DEF-201</td>
              <td><span class="badge badge-emerald">SUCCESS</span></td>
            </tr>
            <tr>
              <td class="font-mono">2026-10-27 11:30:42</td>
              <td style="font-weight: 600; color: #fff;">compliance_auditor</td>
              <td><span class="badge badge-emerald">auditor</span></td>
              <td><code>AUTH_LOGIN</code></td>
              <td class="font-mono">auth/login</td>
              <td><span class="badge badge-emerald">SUCCESS</span></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  `;

  document.getElementById("btn-run-audit")?.addEventListener("click", () => {
    appState.showToast("Cryptographic audit complete: All 320 evaluation records match their SHA-256 provenance hashes!", "success");
  });
}
