/**
 * =========================================================================
 * AUTHENTICATION PAGES (Common / Shared Portal)
 * Pixel-perfect Efferd Dark Dashboard Layout: Strict Black, White & Orange
 * =========================================================================
 */
import { SAMPLE_DATA } from "../js/mock-data.js";
import { apiClient } from "../js/api.js";

export function renderLogin(container, appState) {
  container.innerHTML = `
    <div style="min-height: 80vh; display: flex; align-items: center; justify-content: center; padding: 40px 20px;">
      <div style="width: 100%; max-width: 440px; background: #000000; border: 1px solid #1c1c1c; border-radius: 8px; padding: 32px; box-sizing: border-box;">
        <div style="text-align: center; margin-bottom: 24px;">
          <div style="width: 36px; height: 36px; margin: 0 auto 12px; background: #0c0c0c; border: 1px solid #222222; border-radius: 6px; display: flex; align-items: center; justify-content: center; color: #ff5500;">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="M9 12l2 2 4-4"/></svg>
          </div>
          <h2 style="font-size: 1.3rem; font-weight: 700; color: #ffffff; margin-bottom: 6px;">Authenticate Operator</h2>
          <p style="font-size: 0.82rem; color: #666666;">Access Bayora Enclave with cryptographic RBAC</p>
        </div>

        <div style="background: #080808; border: 1px solid #1a1a1a; border-radius: 6px; padding: 12px; margin-bottom: 20px;">
          <span style="font-size: 0.7rem; text-transform: uppercase; color: #666666; font-weight: 700; letter-spacing: 0.05em; display: block; margin-bottom: 8px;">Fast Persona Preset</span>
          <div style="display: flex; gap: 6px;">
            <button type="button" class="efferd-btn-dark" id="btn-quick-red" style="flex: 1; padding: 5px 8px; font-size: 0.75rem; border-color: #ff5500;">Red Team</button>
            <button type="button" class="efferd-btn-dark" id="btn-quick-blue" style="flex: 1; padding: 5px 8px; font-size: 0.75rem;">Blue Team</button>
            <button type="button" class="efferd-btn-dark" id="btn-quick-auditor" style="flex: 1; padding: 5px 8px; font-size: 0.75rem;">Auditor</button>
          </div>
        </div>

        <form id="login-form">
          <div style="margin-bottom: 14px;">
            <label style="display: block; font-size: 0.8rem; color: #888888; margin-bottom: 6px;">Operator ID / Username</label>
            <input type="text" id="login-username" class="efferd-input" value="red_operator" required />
          </div>

          <div style="margin-bottom: 14px;">
            <label style="display: block; font-size: 0.8rem; color: #888888; margin-bottom: 6px;">Passphrase / Token</label>
            <input type="password" id="login-password" class="efferd-input" value="RedOperator2026!" required />
          </div>

          <div style="margin-bottom: 20px;">
            <label style="display: block; font-size: 0.8rem; color: #888888; margin-bottom: 6px;">Clearance Scope</label>
            <select id="login-role" class="efferd-input">
              <option value="red_team">Red Team (Adversarial Testing)</option>
              <option value="blue_team">Blue Team (Defensive Guardrails)</option>
              <option value="auditor">Security Auditor & Compliance</option>
            </select>
          </div>

          <button type="submit" class="efferd-btn-orange" style="width: 100%;">
            Authenticate Session
          </button>
        </form>

        <div style="margin-top: 24px; text-align: center; border-top: 1px solid #1a1a1a; padding-top: 16px;">
          <p style="font-size: 0.8rem; color: #666666;">
            Need new credentials? <a href="#register" style="color: #ff5500; text-decoration: none; font-weight: 600;">Register Node</a>
          </p>
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

  document.getElementById("login-form")?.addEventListener("submit", async (e) => {
    e.preventDefault();
    const selectedRole = roleSelect.value;
    const username = usernameInput.value;
    const password = passwordInput.value;
    const submitBtn = e.target.querySelector('button[type="submit"]');

    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.textContent = "Authenticating...";
    }

    try {
      const loginRes = await apiClient.login(username, password);
      const verifiedRole = loginRes.role === 'admin' ? 'auditor' : loginRes.role;
      appState.setUserRole(verifiedRole, loginRes.username);
      appState.showToast(`Authenticated as ${loginRes.username} (${verifiedRole.toUpperCase()}) via live JWT!`, "success");

      if (verifiedRole === "red_team") window.location.hash = "#red-team";
      else if (verifiedRole === "blue_team") window.location.hash = "#blue-team";
      else window.location.hash = "#admin";
    } catch (err) {
      if (err.message && err.message.includes("fetch failed")) {
        appState.setUserRole(selectedRole, username);
        appState.showToast(`Backend offline: operating in offline simulation as ${username}`, "warning");
        if (selectedRole === "red_team") window.location.hash = "#red-team";
        else if (selectedRole === "blue_team") window.location.hash = "#blue-team";
        else window.location.hash = "#admin";
      } else {
        appState.showToast(`Login failed: ${err.message}`, "error");
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.textContent = "Authenticate Session";
        }
      }
    }
  });
}

export function renderRegister(container) {
  container.innerHTML = `
    <div style="min-height: 80vh; display: flex; align-items: center; justify-content: center; padding: 40px 20px;">
      <div style="width: 100%; max-width: 480px; background: #000000; border: 1px solid #1c1c1c; border-radius: 8px; padding: 32px; box-sizing: border-box;">
        <div style="text-align: center; margin-bottom: 24px;">
          <div style="width: 36px; height: 36px; margin: 0 auto 12px; background: #0c0c0c; border: 1px solid #222222; border-radius: 6px; display: flex; align-items: center; justify-content: center; color: #ff5500;">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="M9 12l2 2 4-4"/></svg>
          </div>
          <h2 style="font-size: 1.3rem; font-weight: 700; color: #ffffff; margin-bottom: 6px;">Researcher Registration</h2>
          <p style="font-size: 0.82rem; color: #666666;">Request accredited clearance for AI safety testing</p>
        </div>

        <form id="register-form">
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 14px;">
            <div>
              <label style="display: block; font-size: 0.8rem; color: #888888; margin-bottom: 6px;">First Name</label>
              <input type="text" id="reg-first" class="efferd-input" placeholder="Sarah" required />
            </div>
            <div>
              <label style="display: block; font-size: 0.8rem; color: #888888; margin-bottom: 6px;">Last Name</label>
              <input type="text" id="reg-last" class="efferd-input" placeholder="Connor" required />
            </div>
          </div>

          <div style="margin-bottom: 14px;">
            <label style="display: block; font-size: 0.8rem; color: #888888; margin-bottom: 6px;">Security Email</label>
            <input type="email" id="reg-email" class="efferd-input" placeholder="researcher@lab.org" required />
          </div>

          <div style="margin-bottom: 14px;">
            <label style="display: block; font-size: 0.8rem; color: #888888; margin-bottom: 6px;">Requested Role</label>
            <select id="reg-role" class="efferd-input">
              <option value="red_team">Red Team Researcher (Adversarial Testing)</option>
              <option value="blue_team">Blue Team Defender (Guardrail Architecture)</option>
              <option value="auditor">Compliance & Security Auditor</option>
            </select>
          </div>

          <button type="submit" class="efferd-btn-orange" style="width: 100%; margin-top: 8px;">
            Submit Clearance Request
          </button>
        </form>

        <div style="margin-top: 24px; text-align: center; border-top: 1px solid #1a1a1a; padding-top: 16px;">
          <p style="font-size: 0.8rem; color: #666666;">
            Already have credentials? <a href="#login" style="color: #ff5500; text-decoration: none; font-weight: 600;">Return to Login</a>
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
