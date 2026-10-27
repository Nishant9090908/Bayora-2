/**
 * =========================================================================
 * BAYORA CLIENT APPLICATION CORE
 * Router, Global State, Role Switcher & View Orchestrator
 * =========================================================================
 */
import { SAMPLE_DATA } from "./mock-data.js";
import { renderLanding } from "./pages/landing.js";
import { renderLogin, renderRegister } from "./pages/auth.js";
import { renderRedTeam } from "./pages/red-team.js";
import { renderBlueTeam } from "./pages/blue-team.js";
import { renderAdmin } from "./pages/admin.js";
import { renderEvaluation } from "./pages/evaluation.js";
import { renderSecurityEvents } from "./pages/security-events.js";

class AppState {
  constructor() {
    this.currentRole = "red_team"; // default role for testing
    this.currentUsername = "red_operator";
    this.init();
  }

  init() {
    // Listen for hash changes
    window.addEventListener("hashchange", () => this.handleRoute());
    
    // Setup Topbar Role Switcher
    const roleSelect = document.getElementById("nav-role-select");
    if (roleSelect) {
      roleSelect.value = this.currentRole;
      roleSelect.addEventListener("change", (e) => {
        const newRole = e.target.value;
        const matchedUser = SAMPLE_DATA.users.find(u => u.role === newRole);
        this.setUserRole(newRole, matchedUser ? matchedUser.username : "operator");
        this.showToast(`Active clearance switched to: ${newRole.toUpperCase()}`, "warning");
        this.updateNavBadges();
      });
    }

    this.updateNavBadges();
    this.handleRoute();
  }

  setUserRole(role, username) {
    this.currentRole = role;
    this.currentUsername = username;
    const roleSelect = document.getElementById("nav-role-select");
    if (roleSelect) roleSelect.value = role;
    this.updateNavBadges();
  }

  updateNavBadges() {
    const roleBadge = document.getElementById("nav-role-badge");
    if (!roleBadge) return;

    if (this.currentRole === "red_team") {
      roleBadge.textContent = "RED TEAM";
      roleBadge.className = "badge badge-red";
    } else if (this.currentRole === "blue_team") {
      roleBadge.textContent = "BLUE TEAM";
      roleBadge.className = "badge badge-blue";
    } else {
      roleBadge.textContent = "AUDITOR";
      roleBadge.className = "badge badge-emerald";
    }
  }

  handleRoute() {
    const hash = window.location.hash.toLowerCase() || "#landing";
    const content = document.getElementById("main-content");
    if (!content) return;

    // Update active nav links
    document.querySelectorAll(".nav-link").forEach(link => {
      if (link.getAttribute("href") === hash) {
        link.classList.add("active");
      } else {
        link.classList.remove("active");
      }
    });

    window.scrollTo(0, 0);

    // Route dispatch
    switch (hash) {
      case "#":
      case "#landing":
        renderLanding(content);
        break;
      case "#login":
        renderLogin(content, this);
        break;
      case "#register":
        renderRegister(content);
        break;
      case "#red-team":
        renderRedTeam(content, this);
        break;
      case "#blue-team":
        renderBlueTeam(content, this);
        break;
      case "#admin":
        renderAdmin(content, this);
        break;
      case "#evaluation":
        renderEvaluation(content, this);
        break;
      case "#security-events":
        renderSecurityEvents(content, this);
        break;
      default:
        content.innerHTML = `
          <div style="text-align: center; padding: 80px 20px;">
            <h1 style="color: #ef4444; font-size: 2.5rem; margin-bottom: 12px;">404 // Enclave Route Not Found</h1>
            <p style="margin-bottom: 24px;">The requested security endpoint or dashboard does not exist in the routing manifest.</p>
            <a href="#landing" class="btn btn-secondary">Return to Enclave Overview</a>
          </div>
        `;
    }
  }

  showToast(message, type = "info") {
    let container = document.getElementById("toast-container");
    if (!container) {
      container = document.createElement("div");
      container.id = "toast-container";
      container.className = "toast-container";
      document.body.appendChild(container);
    }

    const toast = document.createElement("div");
    toast.className = `toast toast-${type}`;
    
    let icon = "ℹ️";
    if (type === "success") icon = "✓";
    if (type === "error") icon = "🚨";
    if (type === "warning") icon = "⚡";

    toast.innerHTML = `
      <span style="font-weight: 700; font-size: 1.1rem;">${icon}</span>
      <div style="flex: 1; font-weight: 500;">${message}</div>
    `;

    container.appendChild(toast);
    setTimeout(() => {
      toast.style.opacity = "0";
      toast.style.transform = "translateY(10px)";
      toast.style.transition = "all 0.3s ease";
      setTimeout(() => toast.remove(), 300);
    }, 4000);
  }
}

// Instantiate on DOM load
document.addEventListener("DOMContentLoaded", () => {
  window.BayoraApp = new AppState();
});
