/**
 * =========================================================================
 * SECURITY EVENTS & INTRUSION DETECTION (Admin / Auditor Domain)
 * Pixel-perfect Efferd Dark Dashboard Layout: Strict Black, White & Orange
 * =========================================================================
 */
import { SAMPLE_DATA } from "../js/mock-data.js";
import { renderBarChart, renderSteppedLineChart } from "../js/charts.js";

export function renderSecurityEvents(container, appState) {
  let events = [...SAMPLE_DATA.securityEvents];
  let filter = "ALL";

  function renderTable() {
    const filtered = filter === "ALL" 
      ? events 
      : events.filter(e => e.severity === filter);

    container.innerHTML = `
      <div class="efferd-dashboard">
        <!-- 1. Top Metrics Row (Exact Efferd Layout) -->
        <div class="efferd-metrics-row">
          <div class="efferd-metric-card">
            <span class="efferd-metric-label">Active Traps</span>
            <span class="efferd-metric-num">8</span>
            <div class="efferd-metric-trend trend-orange">
              <span>● ONLINE</span> <span class="vs-text">honeypots</span>
            </div>
          </div>
          <div class="efferd-metric-card">
            <span class="efferd-metric-label">Intrusions Trapped</span>
            <span class="efferd-metric-num" style="color: #ff5500;">${events.length}</span>
            <div class="efferd-metric-trend trend-orange">
              <span>401/403 attempts</span>
            </div>
          </div>
          <div class="efferd-metric-card">
            <span class="efferd-metric-label">Alert Posture</span>
            <span class="efferd-metric-num" style="font-size: 1.4rem; color: #ffffff;">ZERO TRUST</span>
            <div class="efferd-metric-trend trend-orange">
              <span>Auto-mitigation active</span>
            </div>
          </div>
          <div class="efferd-metric-card">
            <span class="efferd-metric-label">Median TTD</span>
            <span class="efferd-metric-num" style="font-family: 'Space Mono', monospace;">42ms</span>
            <div class="efferd-metric-trend trend-orange">
              <span>Instant entrapment</span>
            </div>
          </div>
        </div>

        <!-- 2. Charts Row (Intrusion attempts bar chart & Trap velocity stepped line chart) -->
        <div class="efferd-charts-row">
          <!-- Left: Intrusion Probes / Animated Bar Chart -->
          <div class="efferd-chart-card left-cell">
            <div class="efferd-chart-header">
              <span class="efferd-chart-title">Intrusion attempts</span>
              <span class="efferd-chart-trend">▲ 33.2%</span>
            </div>
            <div class="efferd-chart-sub">Daily trapped intrusion attempts, last 7 days.</div>
            <div class="efferd-chart-canvas-wrap">
              <canvas id="sec-chart-canvas"></canvas>
            </div>
          </div>

          <!-- Right: Trap Velocity / Stepped Line Chart -->
          <div class="efferd-chart-card">
            <div class="efferd-chart-header">
              <span class="efferd-chart-title">Trap velocity</span>
              <span class="efferd-chart-trend">▲ 98.4%</span>
            </div>
            <div class="efferd-chart-sub">Stepped mitigation events, last 7 days.</div>
            <div class="efferd-chart-canvas-wrap">
              <canvas id="sec-stepped-canvas"></canvas>
            </div>
          </div>
        </div>

        <!-- 3. Bottom Row: Security Stream, Trap Health, Activity -->
        <div class="efferd-bottom-row">
          <!-- Left: Violation Stream Table -->
          <div class="efferd-bottom-card border-r">
            <div style="display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 4px; flex-wrap: wrap; gap: 8px;">
              <div class="efferd-card-heading">Security violation stream</div>
              <div style="display: flex; gap: 4px;">
                <button class="efferd-btn-dark ${filter === 'ALL' ? 'efferd-btn-orange' : ''}" style="padding: 3px 8px; font-size: 0.72rem;" id="filter-all">All</button>
                <button class="efferd-btn-dark ${filter === 'CRITICAL' ? 'efferd-btn-orange' : ''}" style="padding: 3px 8px; font-size: 0.72rem;" id="filter-crit">Crit</button>
                <button class="efferd-btn-dark ${filter === 'HIGH' ? 'efferd-btn-orange' : ''}" style="padding: 3px 8px; font-size: 0.72rem;" id="filter-high">High</button>
                <button class="efferd-btn-dark ${filter === 'MEDIUM' ? 'efferd-btn-orange' : ''}" style="padding: 3px 8px; font-size: 0.72rem;" id="filter-med">Med</button>
              </div>
            </div>
            <div class="efferd-card-subheading">Active RBAC route enforcement log.</div>

            <table class="efferd-table">
              <thead>
                <tr>
                  <th>Event Type</th>
                  <th>Actor</th>
                  <th>Resource</th>
                  <th style="text-align: right;">Status</th>
                </tr>
              </thead>
              <tbody id="sec-events-tbody">
                ${filtered.map(ev => `
                  <tr>
                    <td class="primary-cell" style="font-size: 0.8rem;">${ev.eventType.replace(/_/g, ' ')}</td>
                    <td class="mono-cell">${ev.actor}</td>
                    <td class="mono-cell" style="color: #666666;">${ev.targetPath}</td>
                    <td style="text-align: right;">
                      <span style="font-size: 0.72rem; color: #ff5500; font-weight: 700;">${ev.actionTaken}</span>
                    </td>
                  </tr>
                `).join("")}
              </tbody>
            </table>
            <a href="#admin" class="efferd-view-all-link">View All →</a>
          </div>

          <!-- Middle: Trap Health (Caught Up) -->
          <div class="efferd-bottom-card border-r">
            <div class="efferd-card-heading">Trap health</div>
            <div class="efferd-card-subheading">Nothing urgent needs your attention.</div>
            <div class="efferd-health-wrap">
              <div class="efferd-check-circle">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#ffffff" stroke-width="2.5"><polyline points="20 6 9 17 4 12"></polyline></svg>
              </div>
              <div class="efferd-health-title">You're caught up.</div>
              <div class="efferd-health-desc">
                All 8 honeypot traps online. Zero unauthorized access escalations permitted.
              </div>
              <button id="btn-simulate-breach" class="efferd-btn-orange" style="font-size: 0.78rem; padding: 6px 14px;">Simulate 403 Breach</button>
            </div>
          </div>

          <!-- Right: Activity Feed -->
          <div class="efferd-bottom-card">
            <div class="efferd-card-heading">Activity</div>
            <div class="efferd-card-subheading">Latest trap updates.</div>
            <div class="efferd-activity-list">
              <div class="efferd-activity-item">
                <div class="efferd-activity-icon">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
                </div>
                <div class="efferd-activity-info">
                  <div class="efferd-activity-title">Cross-tenant probe trapped</div>
                  <div class="efferd-activity-time">About 2 hours ago</div>
                </div>
              </div>
              <div class="efferd-activity-item">
                <div class="efferd-activity-icon">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon></svg>
                </div>
                <div class="efferd-activity-info">
                  <div class="efferd-activity-title">Honeypot ping recorded</div>
                  <div class="efferd-activity-time">This morning</div>
                </div>
              </div>
              <div class="efferd-activity-item">
                <div class="efferd-activity-icon">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
                </div>
                <div class="efferd-activity-info">
                  <div class="efferd-activity-title">Audit breach alarm cleared</div>
                  <div class="efferd-activity-time">Yesterday</div>
                </div>
              </div>
              <div class="efferd-activity-item">
                <div class="efferd-activity-icon">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
                </div>
                <div class="efferd-activity-info">
                  <div class="efferd-activity-title">Zero-Trust policy active</div>
                  <div class="efferd-activity-time">2 days ago</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;

    // Render Canvas Charts
    setTimeout(() => {
      renderBarChart("sec-chart-canvas", [
        { label: "Mon", value: 12, color: "#ffffff", colorEnd: "#ff5500" },
        { label: "Tue", value: 24, color: "#ffffff", colorEnd: "#ff5500" },
        { label: "Wed", value: 38, color: "#ffffff", colorEnd: "#ff5500" },
        { label: "Thu", value: 45, color: "#ffffff", colorEnd: "#ff5500" },
        { label: "Fri", value: 60, color: "#ffffff", colorEnd: "#ff5500" },
        { label: "Sat", value: 35, color: "#ffffff", colorEnd: "#ff5500" },
        { label: "Sun", value: 72, color: "#ffffff", colorEnd: "#ff5500" }
      ]);

      renderSteppedLineChart("sec-stepped-canvas", [
        { label: "Traps", data: [20, 35, 35, 50, 50, 68, 72], color: "#ffffff" },
        { label: "Blocks", data: [15, 28, 40, 40, 52, 52, 65], color: "#ff5500" }
      ], ['Apr 7', 'Apr 8', 'Apr 9', 'Apr 10', 'Apr 11', 'Apr 12', 'Apr 13']);
    }, 60);

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
        eventType: "UNAUTHORIZED_CROSS_TEAM_PROBE",
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
      appState.showToast("🚨 BREACH TRAPPED: Cross-team rule inspection rejected with HTTP 403!", "error");
      renderTable();
    });
  }

  renderTable();
}
