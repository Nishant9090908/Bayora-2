/**
 * =========================================================================
 * ADMIN & AUDITOR DASHBOARD (Dedicated Admin/Auditor Frontend Module)
 * Pixel-perfect Efferd Dark Dashboard Layout: Strict Black, White & Orange
 * =========================================================================
 */
import { SAMPLE_DATA } from "../js/mock-data.js";
import { renderBarChart, renderSteppedLineChart } from "../js/charts.js";

export function renderAdmin(container, appState) {
  const stats = SAMPLE_DATA.platformStats;

  container.innerHTML = `
    <div class="efferd-dashboard">
      <!-- 1. Top Metrics Row (Exact Efferd Layout) -->
      <div class="efferd-metrics-row">
        <div class="efferd-metric-card">
          <span class="efferd-metric-label">Target LLM</span>
          <span class="efferd-metric-num" style="font-size: 1.5rem; color: #ffffff;">SHIELDED</span>
          <div class="efferd-metric-trend trend-orange">
            <span>● 100% ISOLATED</span> <span class="vs-text">in backend</span>
          </div>
        </div>
        <div class="efferd-metric-card">
          <span class="efferd-metric-label">Tenant Isolation</span>
          <span class="efferd-metric-num">100%</span>
          <div class="efferd-metric-trend trend-orange">
            <span>Zero cross-team leaks</span>
          </div>
        </div>
        <div class="efferd-metric-card">
          <span class="efferd-metric-label">Total Evaluations</span>
          <span class="efferd-metric-num">${stats.totalEvaluationsRun}</span>
          <div class="efferd-metric-trend trend-orange">
            <span>▲ 14.2%</span> <span class="vs-text">throughput</span>
          </div>
        </div>
        <div class="efferd-metric-card">
          <span class="efferd-metric-label">Trapped Intrusions</span>
          <span class="efferd-metric-num" style="color: #ff5500;">${SAMPLE_DATA.securityEvents.length}</span>
          <div class="efferd-metric-trend trend-down">
            <span>401/403 blocked</span>
          </div>
        </div>
      </div>

      <!-- 2. Charts Row (Net telemetry bar chart & Integrity velocity stepped line chart) -->
      <div class="efferd-charts-row">
        <!-- Left: Evaluation Telemetry / Animated Bar Chart -->
        <div class="efferd-chart-card left-cell">
          <div class="efferd-chart-header">
            <span class="efferd-chart-title">Evaluation volume</span>
            <span class="efferd-chart-trend">▲ 68.4%</span>
          </div>
          <div class="efferd-chart-sub">Daily mediated evaluation throughput, last 7 days.</div>
          <div class="efferd-chart-canvas-wrap">
            <canvas id="admin-chart-canvas"></canvas>
          </div>
        </div>

        <!-- Right: Audit Verification / Stepped Line Chart -->
        <div class="efferd-chart-card">
          <div class="efferd-chart-header">
            <span class="efferd-chart-title">Integrity velocity</span>
            <span class="efferd-chart-trend">▲ 99.9%</span>
          </div>
          <div class="efferd-chart-sub">Stepped SHA-256 ledger commits, last 7 days.</div>
          <div class="efferd-chart-canvas-wrap">
            <canvas id="admin-stepped-canvas"></canvas>
          </div>
        </div>
      </div>

      <!-- 3. Bottom Row: System Audit Ledger, Ledger Health, Activity -->
      <div class="efferd-bottom-row">
        <!-- Left: Audit Trail Table -->
        <div class="efferd-bottom-card border-r">
          <div class="efferd-card-heading">System audit trail</div>
          <div class="efferd-card-subheading">Append-only non-repudiable cryptographic log.</div>
          <table class="efferd-table">
            <thead>
              <tr>
                <th>Actor</th>
                <th>Action</th>
                <th>Resource</th>
                <th style="text-align: right;">Status</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td class="primary-cell">eval_engine</td>
                <td class="mono-cell">RUN_EVALUATION</td>
                <td class="mono-cell">evaluations/EV-8891</td>
                <td style="text-align: right; color: #ffffff; font-weight: 600;">SUCCESS</td>
              </tr>
              <tr>
                <td class="primary-cell">red_operator</td>
                <td class="mono-cell">SUBMIT_PROMPT</td>
                <td class="mono-cell">prompts/ATK-1001</td>
                <td style="text-align: right; color: #ffffff; font-weight: 600;">SUCCESS</td>
              </tr>
              <tr>
                <td class="primary-cell">red_operator</td>
                <td class="mono-cell">GET_DEFENSE_PROBE</td>
                <td class="mono-cell">defenses/DEF-201</td>
                <td style="text-align: right; color: #ff5500; font-weight: 600;">BLOCKED 403</td>
              </tr>
              <tr>
                <td class="primary-cell">blue_defender</td>
                <td class="mono-cell">DEPLOY_DEFENSE</td>
                <td class="mono-cell">defenses/DEF-201</td>
                <td style="text-align: right; color: #ffffff; font-weight: 600;">SUCCESS</td>
              </tr>
            </tbody>
          </table>
          <a href="#admin" class="efferd-view-all-link">View All →</a>
        </div>

        <!-- Middle: Ledger Health (Caught Up) -->
        <div class="efferd-bottom-card border-r">
          <div class="efferd-card-heading">Ledger health</div>
          <div class="efferd-card-subheading">Nothing urgent needs your attention.</div>
          <div class="efferd-health-wrap">
            <div class="efferd-check-circle">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#ffffff" stroke-width="2.5"><polyline points="20 6 9 17 4 12"></polyline></svg>
            </div>
            <div class="efferd-health-title">You're caught up.</div>
            <div class="efferd-health-desc">
              All SHA-256 hashes match ground truth database inputs. Zero retroactive tampering detected.
            </div>
            <button id="btn-run-audit" class="efferd-btn-orange" style="font-size: 0.78rem; padding: 6px 14px;">Run Integrity Scan</button>
          </div>
        </div>

        <!-- Right: Activity Feed -->
        <div class="efferd-bottom-card">
          <div class="efferd-card-heading">Activity</div>
          <div class="efferd-card-subheading">Latest governance updates.</div>
          <div class="efferd-activity-list">
            <div class="efferd-activity-item">
              <div class="efferd-activity-icon">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
              </div>
              <div class="efferd-activity-info">
                <div class="efferd-activity-title">Enclave policy sync #8891</div>
                <div class="efferd-activity-time">About 2 hours ago</div>
              </div>
            </div>
            <div class="efferd-activity-item">
              <div class="efferd-activity-icon">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="8.5" cy="7" r="4"></circle><line x1="20" y1="8" x2="20" y2="14"></line><line x1="23" y1="11" x2="17" y2="11"></line></svg>
              </div>
              <div class="efferd-activity-info">
                <div class="efferd-activity-title">compliance_auditor logged in</div>
                <div class="efferd-activity-time">This morning</div>
              </div>
            </div>
            <div class="efferd-activity-item">
              <div class="efferd-activity-icon">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
              </div>
              <div class="efferd-activity-info">
                <div class="efferd-activity-title">Merkle audit chain verified</div>
                <div class="efferd-activity-time">Yesterday</div>
              </div>
            </div>
            <div class="efferd-activity-item">
              <div class="efferd-activity-icon">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
              </div>
              <div class="efferd-activity-info">
                <div class="efferd-activity-title">Level 4 isolation audit pass</div>
                <div class="efferd-activity-time">2 days ago</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 4. Enclave Actors & Clearance Matrix -->
      <div class="efferd-action-section">
        <div class="efferd-card-heading">Enclave Actors & Clearance Matrix</div>
        <div class="efferd-card-subheading">Cryptographic RBAC clearance registry</div>

        <table class="efferd-table" style="margin-top: 12px;">
          <thead>
            <tr>
              <th>Operator Username</th>
              <th>Enclave Role</th>
              <th>Security Clearance</th>
              <th>Assigned Scoped Repository</th>
            </tr>
          </thead>
          <tbody>
            ${SAMPLE_DATA.users.map(u => `
              <tr>
                <td class="primary-cell">${u.username}</td>
                <td>
                  <span class="badge ${u.role === 'red_team' ? 'badge-red' : u.role === 'blue_team' ? 'badge-blue' : 'badge-emerald'}">
                    ${u.role}
                  </span>
                </td>
                <td class="mono-cell">${u.clearance}</td>
                <td style="color: #666666; font-size: 0.8rem;">${u.role.toUpperCase()}_ISOLATED</td>
              </tr>
            `).join("")}
          </tbody>
        </table>
      </div>
    </div>
  `;

  // Initialize Canvas Charts
  setTimeout(() => {
    // 1. Vertical Animated Bar Chart: Mon - Sun
    renderBarChart("admin-chart-canvas", [
      { label: "Mon", value: 50, color: "#ffffff", colorEnd: "#ff5500" },
      { label: "Tue", value: 65, color: "#ffffff", colorEnd: "#ff5500" },
      { label: "Wed", value: 80, color: "#ffffff", colorEnd: "#ff5500" },
      { label: "Thu", value: 95, color: "#ffffff", colorEnd: "#ff5500" },
      { label: "Fri", value: 120, color: "#ffffff", colorEnd: "#ff5500" },
      { label: "Sat", value: 85, color: "#ffffff", colorEnd: "#ff5500" },
      { label: "Sun", value: 140, color: "#ffffff", colorEnd: "#ff5500" }
    ]);

    // 2. Stepped Line Chart: Apr 7 - Apr 13
    renderSteppedLineChart("admin-stepped-canvas", [
      { label: "Audits", data: [55, 70, 70, 92, 92, 105, 110], color: "#ffffff" },
      { label: "Verifications", data: [35, 48, 62, 62, 80, 80, 95], color: "#ff5500" }
    ], ['Apr 7', 'Apr 8', 'Apr 9', 'Apr 10', 'Apr 11', 'Apr 12', 'Apr 13']);
  }, 60);

  document.getElementById("btn-run-audit")?.addEventListener("click", () => {
    appState.showToast("Cryptographic audit complete: All evaluation records match their SHA-256 provenance hashes!", "success");
  });
}
