/**
 * =========================================================================
 * SECURITY EVENTS & INTRUSION DETECTION
 * Real-time monitoring of 401/403 access violations & threat detection
 * =========================================================================
 */
import { SAMPLE_DATA } from "../mock-data.js";

export function renderSecurityEvents(container, appState) {
  let events = [...SAMPLE_DATA.securityEvents];
  let filter = "ALL";

  function renderTable() {
    const filtered = filter === "ALL" 
      ? events 
      : events.filter(e => e.severity === filter);

    container.innerHTML = `
      <div class="workspace-header">
        <div class="workspace-title-area">
          <div class="pillar-icon-box red" style="width: 36px; height: 36px; font-size: 1rem; margin-bottom: 0;">🚨</div>
          <div>
            <h2>Security Events & Intrusion Traps</h2>
            <p class="card-description">Real-time detection of unauthorized role elevation, direct model bypass, and credential anomalies</p>
          </div>
        </div>
        <div style="display: flex; gap: 8px;">
          <span class="badge badge-red" id="active-violations-badge">${events.length} VIOLATIONS LOGGED</span>
        </div>
      </div>

      <!-- Interactive Security Breach Simulation Panel -->
      <div class="breach-sim-panel">
        <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 12px;">
          <div>
            <h3 style="color: #fca5a5; font-size: 1.05rem;">🧪 Interactive Intrusion Test: Simulate Cross-Team Breach</h3>
            <p style="font-size: 0.82rem; color: #cbd5e1; margin-top: 2px;">
              Trigger an unauthorized cross-team API request (e.g., Red Team operator probing Blue Team confidential defense rules directly).
            </p>
          </div>
          <button id="btn-simulate-breach" class="btn btn-danger">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
            Simulate 403 Unauthorized Access Attempt
          </button>
        </div>
      </div>

      <!-- Events Log Card with Filter Bar -->
      <div class="card">
        <div class="card-header">
          <span class="card-title">Security Violation Stream</span>
          
          <div style="display: flex; gap: 6px;">
            <button class="btn btn-outline btn-sm ${filter === 'ALL' ? 'btn-secondary' : ''}" id="filter-all">All (${events.length})</button>
            <button class="btn btn-outline btn-sm ${filter === 'CRITICAL' ? 'btn-secondary' : ''}" id="filter-crit" style="color: #f87171;">Critical</button>
            <button class="btn btn-outline btn-sm ${filter === 'HIGH' ? 'btn-secondary' : ''}" id="filter-high" style="color: #fb923c;">High</button>
            <button class="btn btn-outline btn-sm ${filter === 'MEDIUM' ? 'btn-secondary' : ''}" id="filter-med" style="color: #facc15;">Medium</button>
          </div>
        </div>

        <div class="table-container">
          <table>
            <thead>
              <tr>
                <th>Timestamp (UTC)</th>
                <th>Severity</th>
                <th>Event Type</th>
                <th>Actor / Role</th>
                <th>Source IP</th>
                <th>Target Resource</th>
                <th>Action Taken</th>
              </tr>
            </thead>
            <tbody id="sec-events-tbody">
              ${filtered.map(ev => `
                <tr class="${ev.severity === 'CRITICAL' ? 'event-row-critical' : ''}">
                  <td class="font-mono">${ev.timestamp}</td>
                  <td>
                    <span class="badge ${ev.severity === 'CRITICAL' ? 'badge-red' : ev.severity === 'HIGH' ? 'badge-amber' : 'badge-muted'}">
                      ${ev.severity}
                    </span>
                  </td>
                  <td style="font-weight: 600; color: #fff;">
                    <code>${ev.eventType}</code>
                  </td>
                  <td>
                    <span style="font-weight: 500;">${ev.actor}</span>
                    <span style="font-size: 0.72rem; color: var(--text-muted);">(${ev.actorRole})</span>
                  </td>
                  <td class="font-mono">${ev.sourceIp}</td>
                  <td class="font-mono" style="color: #38bdf8;">${ev.targetPath}</td>
                  <td>
                    <span class="badge ${ev.actionTaken.includes('403') || ev.actionTaken.includes('BLOCKED') ? 'badge-red' : 'badge-amber'}">
                      ${ev.actionTaken}
                    </span>
                  </td>
                </tr>
              `).join("")}
            </tbody>
          </table>
        </div>
      </div>
    `;

    // Filter Handlers
    document.getElementById("filter-all")?.addEventListener("click", () => { filter = "ALL"; renderTable(); });
    document.getElementById("filter-crit")?.addEventListener("click", () => { filter = "CRITICAL"; renderTable(); });
    document.getElementById("filter-high")?.addEventListener("click", () => { filter = "HIGH"; renderTable(); });
    document.getElementById("filter-med")?.addEventListener("click", () => { filter = "MEDIUM"; renderTable(); });

    // Interactive Breach Simulator
    document.getElementById("btn-simulate-breach")?.addEventListener("click", () => {
      const now = new Date().toISOString().replace("T", " ").substring(0, 19);
      const simulatedBreach = {
        id: `SEC-${900 + events.length + 1}`,
        timestamp: now,
        eventType: "UNAUTHORIZED_ROLE_ACCESS_ATTEMPT",
        severity: "CRITICAL",
        actor: appState.currentUsername || "red_operator",
        actorRole: appState.currentRole || "red_team",
        sourceIp: "127.0.0.1 (Client Node)",
        targetPath: "/api/blue/defenses/DEF-201/raw_rules",
        method: "GET",
        actionTaken: "BLOCKED (HTTP 403 Forbidden)",
        details: "Automated intrusion detection: Cross-tenant unauthorized access attempt trapped and permanently logged."
      };

      events.unshift(simulatedBreach);
      SAMPLE_DATA.securityEvents.unshift(simulatedBreach);
      appState.showToast("🚨 BREACH BLOCKED: Unauthorized cross-team rule inspection rejected with HTTP 403!", "error");
      renderTable();
    });
  }

  renderTable();
}
