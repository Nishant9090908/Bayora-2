/**
 * =========================================================================
 * AUTHENTICATION PAGES (LOGIN & REGISTRATION)
 * Enterprise-grade cybersecurity login & onboarding interfaces
 * =========================================================================
 */
import { SAMPLE_DATA } from "../mock-data.js";

export function renderLogin(container, appState) {
  container.innerHTML = `
    <div class="auth-container">
      <div class="auth-card">
        <div class="auth-header">
          <div class="brand-icon" style="width: 38px; height: 38px; margin: 0 auto 12px; font-size: 18px;">B</div>
          <h2>Authentication Console</h2>
          <p class="card-description" style="margin-top: 4px;">Access Bayora AI Safety Testing Enclave</p>
        </div>

        <div class="auth-quick-roles">
          <span class="auth-quick-label">⚡ Fast Role Switcher (Prototype Demo)</span>
          <div class="quick-role-buttons">
            <button type="button" class="quick-role-btn" id="btn-quick-red" style="border-left: 2px solid var(--color-red);">Red Team</button>
            <button type="button" class="quick-role-btn" id="btn-quick-blue" style="border-left: 2px solid var(--color-blue);">Blue Team</button>
            <button type="button" class="quick-role-btn" id="btn-quick-auditor" style="border-left: 2px solid var(--color-purple);">Auditor</button>
          </div>
        </div>

        <form id="login-form">
          <div class="form-group">
            <label class="form-label" for="login-username">Operator ID / Username</label>
            <input type="text" id="login-username" class="form-input" placeholder="e.g. red_operator" value="red_operator" required />
          </div>

          <div class="form-group">
            <label class="form-label" for="login-password">Passphrase / Token</label>
            <input type="password" id="login-password" class="form-input" placeholder="••••••••••••" value="RedOperator2026!" required />
          </div>

          <div class="form-group">
            <label class="form-label" for="login-role">Assigned Clearance Role</label>
            <select id="login-role" class="form-select">
              <option value="red_team">Red Team (Adversarial Testing)</option>
              <option value="blue_team">Blue Team (Defensive Guardrails)</option>
              <option value="auditor">Security Auditor & Compliance</option>
            </select>
          </div>

          <button type="submit" class="btn btn-primary" style="width: 100%; margin-top: 8px;">
            Authenticate Session
          </button>
        </form>

        <div style="margin-top: var(--space-6); text-align: center; border-top: 1px solid var(--border-subtle); padding-top: var(--space-4);">
          <p style="font-size: 0.8rem;">
            Need accredited research credentials? <a href="#register">Register Research Node</a>
          </p>
        </div>

        <div style="margin-top: var(--space-4); background-color: var(--bg-primary); border: 1px solid var(--border-subtle); border-radius: var(--radius-sm); padding: 8px 12px; font-size: 0.72rem; color: var(--text-muted); text-align: center;">
          <span style="color: #f59e0b;">●</span> Visual Prototype Phase: Authenticated identities simulate backend session tokens.
        </div>
      </div>
    </div>
  `;

  // Attach quick-login handlers
  const usernameInput = document.getElementById("login-username");
  const passwordInput = document.getElementById("login-password");
  const roleSelect = document.getElementById("login-role");

  document.getElementById("btn-quick-red")?.addEventListener("click", () => {
    usernameInput.value = "red_operator";
    passwordInput.value = "RedOperator2026!";
    roleSelect.value = "red_team";
  });

  document.getElementById("btn-quick-blue")?.addEventListener("click", () => {
    usernameInput.value = "blue_defender";
    passwordInput.value = "BlueDefender2026!";
    roleSelect.value = "blue_team";
  });

  document.getElementById("btn-quick-auditor")?.addEventListener("click", () => {
    usernameInput.value = "compliance_auditor";
    passwordInput.value = "AuditorSecurity2026!";
    roleSelect.value = "auditor";
  });

  document.getElementById("login-form")?.addEventListener("submit", (e) => {
    e.preventDefault();
    const selectedRole = roleSelect.value;
    const username = usernameInput.value;
    appState.setUserRole(selectedRole, username);

    // Redirect to relevant dashboard
    if (selectedRole === "red_team") window.location.hash = "#red-team";
    else if (selectedRole === "blue_team") window.location.hash = "#blue-team";
    else window.location.hash = "#admin";
  });
}

export function renderRegister(container) {
  container.innerHTML = `
    <div class="auth-container">
      <div class="auth-card" style="max-width: 520px;">
        <div class="auth-header">
          <div class="brand-icon" style="width: 38px; height: 38px; margin: 0 auto 12px; font-size: 18px;">B</div>
          <h2>Researcher Registration</h2>
          <p class="card-description">Request accredited clearance for adversarial safety testing</p>
        </div>

        <form id="register-form">
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px;">
            <div class="form-group">
              <label class="form-label" for="reg-first">First Name</label>
              <input type="text" id="reg-first" class="form-input" placeholder="Sarah" required />
            </div>
            <div class="form-group">
              <label class="form-label" for="reg-last">Last Name</label>
              <input type="text" id="reg-last" class="form-input" placeholder="Connor" required />
            </div>
          </div>

          <div class="form-group">
            <label class="form-label" for="reg-email">Institutional Security Email</label>
            <input type="email" id="reg-email" class="form-input" placeholder="researcher@lab.org" required />
          </div>

          <div class="form-group">
            <label class="form-label" for="reg-role">Requested Role</label>
            <select id="reg-role" class="form-select">
              <option value="red_team">Red Team Researcher (Adversarial Testing)</option>
              <option value="blue_team">Blue Team Defender (Guardrail Architecture)</option>
              <option value="auditor">Compliance & Security Auditor</option>
            </select>
          </div>

          <div class="form-group">
            <label class="form-label" for="reg-pgp">Public Key Fingerprint (Optional)</label>
            <input type="text" id="reg-pgp" class="form-input font-mono" placeholder="4A9B 12E0 C87F 310B ..." />
            <span class="form-hint">Used for signed evaluation certificates</span>
          </div>

          <button type="submit" class="btn btn-primary" style="width: 100%; margin-top: 8px;">
            Submit Clearance Request
          </button>
        </form>

        <div style="margin-top: var(--space-6); text-align: center; border-top: 1px solid var(--border-subtle); padding-top: var(--space-4);">
          <p style="font-size: 0.8rem;">
            Existing credentials? <a href="#login">Return to Login</a>
          </p>
        </div>
      </div>
    </div>
  `;

  document.getElementById("register-form")?.addEventListener("submit", (e) => {
    e.preventDefault();
    alert("Clearance request logged. In production, requests require Auditor cryptographic approval. Redirecting to login...");
    window.location.hash = "#login";
  });
}
